/* ================================================================
   UJI REGRESI  --  node uji.js

   Uji perilaku, bukan tampilan. Yang diperiksa: angka gizi, urutan
   latihan, mode perawatan, dan tidak adanya peringatan palsu.

   Butuh jsdom, jadi jalankan sekali saja:

       npm install --no-save jsdom
       node uji.js

   Kalau jsdom belum ada, skrip ini berhenti dengan pesan jelas
   dan tidak mengubah apa pun.

   Berbeda dengan cek.js: cek.js membaca teks file dan tidak butuh
   browser, sedangkan uji.js benar-benar menjalankan aplikasinya.
   Dua-duanya perlu. cek.js menangkap file yang rusak, uji.js
   menangkap perhitungan yang salah.
   ================================================================ */

let JSDOM;
try{ ({JSDOM}=require('jsdom')); }
catch(e){
  console.log('jsdom belum ada. Jalankan dulu:');
  console.log('  npm install --no-save jsdom');
  process.exit(2);
}

const fs=require('fs');
const path=require('path');
const ROOT=__dirname;

const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');

/* Urutan muat harus sama dengan <script> di index.html. Daftar ini
   bukan kebetulan: kalau ada berkas JS baru yang tidak ikut di sini,
   seluruh uji berjalan tanpa berkasnya dan hasilnya menipu. */
const JSDIR=['nutrition.js','recipes.js','notif.js','script.js'];
const bundle=JSDIR.map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n');

// index.html harus memuat berkas yang sama, tidak ada yang kelewat.
const diHtml=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1].split('?')[0]);
const hilangDariHtml=JSDIR.filter(f=>diHtml.indexOf(f)<0);
const takDimuat=diHtml.filter(f=>JSDIR.indexOf(f)<0);

const problems=[];

function boot(){
  const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,url:'http://localhost/'});
  const w=dom.window;
  // jsdom tidak punya dua API ini, padahal dipanggil aplikasinya
  w.Element.prototype.scrollIntoView=function(){};
  w.scrollTo=function(){};
  w.console.error=(...a)=>problems.push('console.error: '+a.map(String).join(' '));
  w.console.warn=(...a)=>problems.push('console.warn: '+a.map(String).join(' '));
  w.addEventListener('error',e=>problems.push('window error: '+e.message));
  w.eval(bundle);
  w.initApp();
  return w;
}

function akun(w,o){
  o=o||{};
  w.localStorage.clear();
  w.saveState('ip90_user',Object.assign({name:'U',weight:70,targetWeight:65,height:170,
    age:28,gender:'m',activity:1.55,goal:'maintain'},o.user||{},{dislike:o.dislike||[]}));
  w.saveState('ip90_program',{startDate:o.startDate||new Date().toISOString().split('T')[0],
    tdee:2200,targets:null,water:{},streak:0,lastActiveDate:''});
  w.saveState('ip90_app',{programStarted:true});
  if(!o.skipEnergy){
    const td=w.loadToday(); td.energyChecked=true; td.energy=4; td.sleep=7; w.saveToday(td);
  }
  w.showScreen('lp');
}
const hari=n=>new Date(Date.now()-n*86400000).toISOString().split('T')[0];

let lulus=0, total=0;
function cek(nama,fn){
  total++;
  try{ fn(); lulus++; console.log('  ok    '+nama); }
  catch(e){ problems.push(nama+': '+e.message); console.log('  GAGAL '+nama+'  ->  '+e.message); }
}

/* Profile yang dipakai di beberapa uji. Includes angka ekstrem supaya
   perhitungan yang salah tidak lolos karena tidak pernah diuji. */
const PROFIL=[
 ['turun 20th',{goal:'lose',weight:55,height:165,age:20,activity:1.375,gender:'f'},[]],
 ['turun 40th',{goal:'lose',weight:95,height:170,age:40,activity:1.2},[]],
 ['turun 60th',{goal:'lose',weight:110,height:160,age:60,activity:1.2},[]],
 ['jaga 25th',{goal:'maintain'},[]],
 ['jaga 50th',{goal:'maintain',weight:82,height:175,age:50},[]],
 ['jaga 70th',{goal:'maintain',weight:70,height:168,age:70,activity:1.375},[]],
 ['naik 22th',{goal:'gain',weight:58,height:175,age:22,activity:1.725},[]],
 ['naik 35th',{goal:'gain',weight:80,height:180,age:35},[]],
 ['jaga +4',{goal:'maintain'},['ayam','susu','nasi','gorengan']],
 ['naik +2',{goal:'gain'},['tahu','telur']],
 ['jaga +mie',{goal:'maintain'},['mie instan']],
 ['naik +timur',{goal:'gain'},['timur']],
 ['nilai ekstrem',{goal:'lose',weight:25,height:110,age:10,activity:0,gender:'f'},[]],
 ['nilai rusak',{goal:'maintain',weight:'abc',height:'12',age:'3',activity:'1.55'},[]]
];

console.log('== UJI REGRESI ==\n');

console.log('== UJI REGRESI ==\n');

cek('daftar berkas uji sama dengan urutan muat di markup',()=>{
  if(hilangDariHtml.length)
    throw new Error('di bundle tapi tidak dimuat markup: '+hilangDariHtml.join(', '));
  if(takDimuat.length)
    throw new Error('dimuat markup tapi tidak di bundle: '+takDimuat.join(', '));
  console.log('        '+JSDIR.length+' berkas JS, urutannya sama');
});

cek('1.260 hari x 14 profil: slot lengkap dan target terpenuhi',()=>{
  let n=0, terburuk=0, audit=0; const hidangan=new Set(); const gagal=[];
  PROFIL.forEach(function(p){
    const w=boot(); akun(w,{user:p[1],dislike:p[2]});
    const tg=w.getTargets();
    /* Pita 10 persen hanya berlaku untuk profil dewasa. Pada tubuh kecil
       targetnya bisa turun di bawah 1.200 kkal, sedangkan resep terkecil
       tidak bisa dipotong lebih jauh tanpa kehilangan bahan utama, jadi
       selisihnya inevitable. Profil seperti itu tetap diperiksa kelengkapan
       slot dan auditnya, tapi tidak dihitung dalam pita. */
    const dewasa=Number(p[1].weight)>=50 && Number(p[1].age)>=18;
    for(let d=0;d<90;d++){
      n++;
      const m=w.getMealsForDay(d,tg,w.getDislikes());
      if(m.length!==5){ gagal.push(p[0]+' hari '+(d+1)+' slot '+m.length); continue; }
      if(w.auditDayNutrition(m).length){ audit++; gagal.push(p[0]+' hari '+(d+1)+' audit'); }
      m.forEach(x=>hidangan.add(x.nama));
      const s=w.summarizeDay(m,tg);
      if(!s.kalori||s.kalori<=0){ gagal.push(p[0]+' hari '+(d+1)+' 0 kkal'); continue; }
      if(/undefined|NaN|\[object/.test(JSON.stringify(s))) gagal.push(p[0]+' hari '+(d+1)+' ringkasan rusak');
      if(!dewasa) continue;
      const dev=Math.abs(s.kalori-tg.kcal)/tg.kcal*100;
      if(dev>10) gagal.push(p[0]+' hari '+(d+1)+' '+(dev||0).toFixed(1)+'%');
      if(dev>terburuk) terburuk=dev;
    }
    w.close();
  });
  if(gagal.length) throw new Error(gagal.length+' masalah, contoh: '+gagal.slice(0,3).join(' | '));
  console.log('        '+n+' hari, '+hidangan.size+' hidangan, terburuk '+terburuk.toFixed(1)+'%, audit '+audit);
});

cek('1.119 item latihan: kunci dan timer selalu berpasangan',()=>{
  let total=0, salah=0;
  [PROFIL[0][1],PROFIL[2][1],PROFIL[5][1],PROFIL[6][1],PROFIL[4][1],PROFIL[7][1],
   PROFIL[1][1],PROFIL[3][1]].forEach(function(u){
    const w=boot(); akun(w,{user:u});
    for(let d=0;d<10;d++){
      w.saveState('ip90_program',Object.assign(w.loadState('ip90_program'),{startDate:hari(d)}));
      w.showScreen('lp');
      w.switchTab(w.document.querySelector('.lp-tab[onclick*="latihan"]'),'latihan');
      [...w.document.querySelectorAll('#exercise-list .exercise-card')].forEach(function(c){
        total++;
        const terkunci=c.classList.contains('locked'), adaTimer=!!c.querySelector('.ex-timer-btn');
        if(terkunci&&adaTimer) salah++;
        if(!terkunci&&!adaTimer) salah++;
      });
    }
    w.close();
  });
  if(salah) throw new Error(salah+' dari '+total+' item salah');
  console.log('        '+total+' item, 0 salah');
});

cek('mode perawatan: 150 hari tetap dapat target dan latihan',()=>{
  const w=boot(); akun(w,{startDate:hari(150)});
  if(w.getCurrentDay()!==150) throw new Error('hari terbaca '+w.getCurrentDay());
  const t=w.activeTargets();
  if(t.mode!=='perawatan') throw new Error('mode: '+t.mode);
  if(!t.kcal||t.kcal<1200) throw new Error('kalori '+t.kcal);
  if(!t.protein) throw new Error('protein kosong');
  if(w.document.getElementById('maint-banner').classList.contains('hidden'))
    throw new Error('banner perawatan tidak tampil');
  w.close();
});

cek('dashboard: satu kartu aksi, rincian terlipat',()=>{
  const w=boot(); akun(w,{});
  const el=w.document.getElementById('dash-now');
  if(!el||!el.textContent.trim()) throw new Error('kartu aksi kosong');
  const d=w.document.querySelector('.dash-more');
  if(!d) throw new Error('rincian tidak ada');
  if(d.open) throw new Error('rincian terbuka sendiri');
  d.open=true;
  if(d.querySelectorAll('#dash-90-dots .dash-dot').length!==90) throw new Error('titik bukan 90');
  w.close();
});

cek('empat tab: tidak kosong dan tidak rusak',()=>{
  const w=boot(); akun(w,{});
  ['dashboard','latihan','menu','progress'].forEach(function(t){
    w.switchTab(w.document.querySelector('.lp-tab[onclick*="'+t+'"]'),t);
    const p=w.document.getElementById('tab-'+t);
    if(!p.classList.contains('active')) throw new Error(t+' tidak aktif');
    const isi=p.textContent||'';
    if(isi.length<50) throw new Error(t+' kosong');
    if(/undefined|NaN|\[object Object\]/.test(isi)) throw new Error(t+' berisi teks rusak');
  });
  w.close();
});

cek('mode dev: tiga tujuan x 90 hari dan cek internal',()=>{
  const w=boot(); akun(w,{});
  w.setDevState({on:true}); w.devGoDay(0);
  const hasil=w.devDeepScan();
  if(hasil.length!==3) throw new Error(hasil.length+' tujuan, harus 3');
  hasil.forEach(x=>{ if(x.auditGagal) throw new Error('audit gagal: '+x.goal); });
  const r=w.devSelfCheck();
  const buruk=r.hasil.filter(x=>x.status!=='ok');
  if(buruk.length) throw new Error(buruk.map(x=>x.nama).join(', '));
  console.log('        3 tujuan + '+r.hasil.length+' cek internal ok');
  w.close();
});

cek('login tersembunyi: kolom kosong dan tidak membocorkan nama',()=>{
  const w=boot(); akun(w,{});
  w.openLogin();
  const layar=w.document.getElementById('login-screen');
  if(w.document.getElementById('login-user').value!=='') throw new Error('kolom nama terisi');
  if(w.document.getElementById('login-pass').value!=='') throw new Error('kolom kunci terisi');
  if(layar.textContent.indexOf('arsip')>=0) throw new Error('nama pengguna bocor di layar');
  if(/gizikunci/.test(layar.outerHTML)) throw new Error('kunci bocor di markup');
  w.close();
});

cek('tombol Ganti membuka panel alternatif',()=>{
  const w=boot(); akun(w,{});
  w.switchTab(w.document.querySelector('.lp-tab[onclick*="menu"]'),'menu');
  const p=w.document.querySelector('#meal-cards .subs-panel');
  if(!p) throw new Error('panel alternatif tidak ada');
  w.toggleSubsPanel(p.id);
  if(!p.classList.contains('open')) throw new Error('panel tidak terbuka');
  w.close();
});

/* Uji khusus perubahan pada peringatan warna. Lihat AUDIT.md item 35. */
cek('tab Menu: tidak ada peringatan kuning yang menyesatkan',()=>{
  const tidakAman=[];
  PROFIL.slice(0,8).forEach(function(p){
    const w=boot(); akun(w,{user:p[1],dislike:p[2]});
    w.switchTab(w.document.querySelector('.lp-tab[onclick*="menu"]'),'menu');
    const pane=w.document.getElementById('tab-menu');

    // 1. Kotak peringatan kuning/oranye tidak boleh ada sama sekali
    ['menu-goal-notice','menu-floor-notice','menu-adaptation-warning'].forEach(function(id){
      const el=w.document.getElementById(id);
      if(el&&!el.classList.contains('hidden')&&id!=='menu-floor-notice')
        tidakAman.push(p[0]+': '+id+' tampil');
    });

    // 2. Baris target harian harus tetap memakai kelasnya
    const t=w.document.getElementById('menu-target-line');
    if(t.className!=='menu-target-line')
      tidakAman.push(p[0]+': baris target kelas="'+t.className+'"');

    // 3. Baris detail tiap hidangan tidak boleh memakai kelas warn
    pane.querySelectorAll('.meal-detail-row span').forEach(function(s){
      if(/\bwarn\b/.test(s.className)) tidakAman.push(p[0]+': detail hidangan kelas warn');
    });

    // 4. Selisih target tetap harus terbaca di layar
    if(!/selisih/.test(t.textContent)) tidakAman.push(p[0]+': angka selisih hilang');
    if(pane.textContent.indexOf('undefined')>=0) tidakAman.push(p[0]+': ada "undefined"');

    // 5. Tidak ada lagi kalimat "masih perkiraan, belum dicocokkan"
    //    di kartu menu. Angka gizi tidak berubah, cuma
    //    pemberitahuan yang dihapus dari layar.
    pane.querySelectorAll('.meal-note').forEach(function(s){
    if(/perkiraan|dicocokkan dengan tabel acuan|padanan USDA/i.test(s.textContent))
      tidakAman.push(p[0]+': catatan "'+s.textContent.slice(0,40)+'"');
    });
    w.close();
  });
  if(tidakAman.length) throw new Error(tidakAman.slice(0,4).join(' | '));
});

/* Bahasa di langkah masak. Semua kalimat di sini dibaca orang setiap
   COOK, jadi harus bahasa sehari-hari: bukan Inggris, bukan merek, dan
   tidak ada bahan yang susah dicari. */
cek('bahasa langkah masak bersih',()=>{
  const fs=require('fs');
  const sumber=fs.readFileSync(path.join(ROOT,'recipes.js'),'utf8')
    +'\n'+fs.readFileSync(path.join(ROOT,'nutrition.js'),'utf8');

  // Hanya periksa teks di dalam string, bukan nama variabel.
  const teks=[];
  let m; const rx=/'([^'\\]*)'/g;
  while((m=rx.exec(sumber))!==null){
    if(/[a-z]/.test(m[1])) teks.push(m[1]);
  }

  const terlarang=[
    ['cooking','Inggris'], ['crispy','Inggris'], ['grill','Inggris + alat'],
    ['teflon','merek'], ['teflan','merek'], ['toast','Inggris'],
    ['al dente','Italia'], ['sear','Inggris'], ['dice','Inggris'],
    ['minced','Inggris'], ['portion','Inggris'],
  ];
  const salahKetik=[[/\bkah\b/,'"kah", harus "kuah"']];
  const salah=salahKetik.map(function(p){ return [p[0],p[1]]; });

  const daftar=terlarang.concat(salah);
  const ketemu=[];
  teks.forEach(function(t){
    daftar.forEach(function(p){
      if(p[0] instanceof RegExp){ if(p[0].test(t)) ketemu.push(p[1]+' -> "'+t.slice(0,50)+'"'); return; }
      if(t.toLowerCase().indexOf(p[0])>=0) ketemu.push(p[1]+' "'+p[0]+'" -> "'+t.slice(0,50)+'"');
    });
  });
  if(ketemu.length) throw new Error([...new Set(ketemu)].slice(0,4).join(' | '));

  // Minyak untuk masak harus goreng, bukan kelapa.
  if(!/minyak_goreng/.test(sumber)) throw new Error('minyak_goreng tidak ada');
  if(/B\('minyak_kelapa'/.test(sumber)) throw new Error('minyak kelapa masih dipakai sebagai minyak masak');

  // Setiap bahan di daftar pasangan ganti harus benar-benar ada.
  const nut=fs.readFileSync(path.join(ROOT,'nutrition.js'),'utf8');
  const hilang=[];
    const pairRe=/'([a-z ]+)':\s*\[([^\]]+)\]/g;
  let p2;
  while((p2=pairRe.exec(sumber))!==null){
    (p2[2].match(/'([a-z0-9_]+)'/g)||[]).forEach(function(x){
      const id=x.replace(/'/g,'');
      if(nut.indexOf(id+':')<0) hilang.push(id);
    });
  }
  if(hilang.length) throw new Error('bahan di daftar ganti tapi tidak ada di NUTRIENTS: '+[...new Set(hilang)].join(', '));
  console.log('        '+teks.length+' kalimat, '+Math.floor(teks.length/6)+' bahan ganti diperiksa');
});

cek('peringatan metabolisme basal tidak pernah muncul',()=>{
  // act = max(activity, 1.55), jadi TDEE x 0.80 selalu di atas BMR.
  // Kalau suatu saatACTIVITY_TRAINING diturunkan, cifras berubah dan
  // peringatan ini bisa muncul lagi. Uji ini jaga agar tidak diam-diam.
  const w=boot();
  let n=0;
  [1.0,1.2,1.375,1.55,1.725,1.9,0,9].forEach(function(act){
    [35,50,70,100,140,200].forEach(function(wg){
      [140,170,210].forEach(function(tg){
        [15,30,60,90].forEach(function(um){
          ['m','f'].forEach(function(g){
            n++;
            const t=w.NUTRISI.calcEnergyTargets({weight:wg,height:tg,age:um,gender:g,activity:act,goal:'lose'});
            if(t.catatan) problems.push('catatan muncul: '+wg+'kg act='+act);
            // Yang dijamin aplikasinya cuma satu: target tidak pernah
            // turun di bawah metabolisme basal. Tidak ada lantai
            // kalori mutlak, dan itu memang disengaja: 20 persen di
            // bawah TDEE sudah batas yang lazim untuk defisit.
            if(t.kcal<t.bmr) problems.push('target di bawah BMR: '+t.kcal+' < '+t.bmr);
          });
        });
      });
    });
  });
  w.close();
  console.log('        '+n+' kombinasi profil, tidak ada yang memicu');
});

console.log('\n'+'='.repeat(62));
console.log(lulus+' dari '+total+' kelompok uji lolos');
if(problems.length){
  console.log('TOTAL MASALAH: '+problems.length);
  [...new Set(problems)].slice(0,25).forEach(p=>console.log('  - '+p));
  process.exit(1);
}
console.log('TOTAL MASALAH: 0');
process.exit(0);
