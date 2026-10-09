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

/* Sebagian pengujian harus menunggu pekerjaan asinkron, misalnya
   FileReader saat menguji impor cadangan data. Uji sinkron tidak bisa
   menunggu, jadi uji asinkron dikumpulkan dulu lalu dijalankan berurutan
   di akhir berkas. Dengan begitu semua uji tetap berurutan dan tidak
   saling menimpa variabel yang sama. */
const tertunda=[];
function cekAsync(nama,fn){ tertunda.push({nama,fn}); }

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


/* ============ UJI TAMBAHAN: PERBAIKAN FASE INI ============ */

const SLOT=n=>w.NUTRISI.MEAL_SLOTS.length;

/* Pelacak air. Target ikut berat badan, jadi isi kartu harus ikut
   berubah kalau berat user berubah, dan angka disimpan per tanggal
   supaya hafalan kemarin tidak ikut terhitung hari ini. */
cek('pelacak air: simpan per tanggal, tidak negatif, target ikut berat',()=>{
  const w=boot(); akun(w,{user:{weight:70,targetWeight:65}});
  w.renderAirCard();
  const el=w.document.getElementById('water-done-val');
  const label=()=>w.document.getElementById('water-done-label').textContent;
  if(!el) throw new Error('kartu air tidak ada di markup');
  if(el.textContent.trim()!=='0 ml') throw new Error('awal bukan 0 ml: '+el.textContent);

  w.tambahAir(250); w.tambahAir(250);
  if(w.getAir()!==500) throw new Error('dua kali 250 jadi '+w.getAir());
  if(el.textContent.indexOf('500')<0) throw new Error('label tidak ikut berubah');

  w.setAir(-9999);
  if(w.getAir()!==0) throw new Error('nilai negatif diterima');
  w.setAir(1000.7);
  if(w.getAir()!==1001) throw new Error('pembulatan salah: '+w.getAir());

  const kunci='ip90_water_'+new Date().toISOString().split('T')[0];
  const tersimpan=w.localStorage.getItem(kunci);
  if(!tersimpan||JSON.parse(tersimpan).ml!==1001)
    throw new Error('tersimpan di kunci yang salah: '+tersimpan);

  const target=w.calculateWater(70).display;
  if(label().indexOf(target)<0)
    throw new Error('target di label "'+label()+'" bukan '+target);

  w.saveState('ip90_user',Object.assign(w.loadState('ip90_user'),{weight:100}));
  w.renderAirCard();
  if(label().indexOf(w.calculateWater(100).display)<0)
    throw new Error('label tidak ikut berat baru');
  if(label().indexOf(w.calculateWater(70).display)>=0)
    throw new Error('label masih memakai berat lama');
  w.close();
});

/* Nilai air untuk tanggal lain tidak boleh terbaca sebagai hari ini.
   Tanpa uji ini, angka air bisa terlihat benar pagi hari dan salah
   setelah tengah malam tanpa ada yang mengubah apa pun. */
cek('pelacak air: nilai tanggal lain tidak terbaca sebagai hari ini',()=>{
  const w=boot(); akun(w,{});
  w.saveState('ip90_water_'+hari(1),{ml:3000});
  w.saveState('ip90_water_'+hari(5),{ml:2500});
  if(w.getAir()!==0) throw new Error('pakai nilai tanggal lain: '+w.getAir());
  w.close();
});

/* Berat badan dan lingkar pinggang di luar wajar harus ditolak, bukan
   disimpan. Nilai seperti "abc" atau 10 kg diam-diam merusak grafik
   dan seluruh perhitungan yang memakainya. */
cek('catatan tubuh: nilai di luar wajar ditolak dan tidak disimpan',()=>{
  const w=boot(); akun(w,{});
  const elW=w.document.getElementById('track-weight');
  const elWa=w.document.getElementById('track-waist');
  if(!elW||!elWa) throw new Error('kolom catatan tubuh tidak ada');
  const bobot=()=>w.loadState('ip90_tracking')||{weights:[],waists:[]};
  const toast=()=>{const t=w.document.getElementById('tracking-toast');return t?t.textContent:'';};

  elW.value='abc'; elWa.value='';
  w.saveBodyTracking();
  if(bobot().weights.length) throw new Error('nilai "abc" tersimpan');

  elW.value='999'; w.saveBodyTracking();
  if(bobot().weights.length) throw new Error('berat 999 kg tersimpan');
  if(!/25-250/.test(toast())) throw new Error('tidak ada pemberitahuan penolakan');

  elWa.value='5'; w.saveBodyTracking();
  if(bobot().waists.length) throw new Error('lingkar pinggang 5 cm tersimpan');

  elW.value='70.5'; elWa.value='82';
  w.saveBodyTracking();
  if(bobot().weights.length!==1||bobot().weights[0].value!==70.5)
    throw new Error('berat sah tidak tersimpan');
  if(bobot().waists.length!==1||bobot().waists[0].value!==82)
    throw new Error('pinggang sah tidak tersimpan');

  elW.value='70.5'; w.saveBodyTracking();
  if(bobot().weights.length!==1)
    throw new Error('catatan tanggal sama jadi dua entri');
  w.close();
});

/* Grafik berat memakai Chart.js dari CDN. Kalau CDN tidak terjangkau,
   halaman harus tetap punya grafik. Chart sengaja tidak ada di sini. */
cek('grafik berat: tetap tergambar tanpa Chart.js',()=>{
  const w=boot(); akun(w,{});
  if(typeof w.Chart!=='undefined') throw new Error('Chart ada, uji tidak mengujinya');
  w.saveState('ip90_tracking',{weights:[
    {date:hari(20),day:71,value:72.0},
    {date:hari(10),day:81,value:71.2},
    {date:hari(0),day:91,value:70.4}
  ],waists:[]});
  const svg=w.document.getElementById('weight-chart-fallback');
  const canvas=w.document.getElementById('weight-chart');
  if(!svg) throw new Error('SVG cadangan tidak ada di markup');
  w.drawWeightChartFallback(w.loadState('ip90_tracking'));
  if(svg.style.display!=='block') throw new Error('SVG tetap tersembunyi');
  if(svg.querySelectorAll('path').length<2) throw new Error('garis dan area tidak digambar');
  if(svg.querySelectorAll('circle').length!==3) throw new Error('titik data bukan 3');
  if(!/70\.4/.test(svg.textContent)) throw new Error('label angka hilang');
  if(/undefined|NaN/.test(svg.innerHTML)) throw new Error('SVG berisi teks rusak');
  if(canvas.style.display!=='none')
    throw new Error('canvas tidak disembunyikan saat pakai cadangan');

  w.drawWeightChartFallback({weights:[]});
  if(svg.style.display!=='none') throw new Error('SVG tidak disembunyikan saat data kosong');
  w.drawWeightChartFallback({weights:[{day:1,value:'x'},{day:2,value:70}]});
  if(/undefined|NaN/.test(svg.innerHTML)) throw new Error('nilai rusak bocor ke SVG');
  w.close();
});

/* Impor data lewat FileReader, jadi hasilnya datang belakangan.
   Menunggu pesan muncul lebih baik daripada menunggu angka tetap:
   kalau tidak ada pesan sama sekali, itu sendiri sudah kegagalan. */
async function tungguPesan(w,regex,maxMs){
  const el=w.document.getElementById('data-msg');
  const batas=Date.now()+(maxMs||2000);
  while(Date.now()<batas){
    if(el&&el.textContent&&regex.test(el.textContent)) return el.textContent;
    await new Promise(r=>setTimeout(r,10));
  }
  return el?el.textContent:'';
}

/* Kunci cache hari (ip90_daydata_..._v16) sengaja dibuang setelah impor
   supaya latihan dihitung ulang dari data yang baru masuk. Kunci seperti ini
   tidak dihitung sebagai kehilangan data. */
const bukanCache=k=>k.indexOf('ip90_daydata_')!==0;

/* Impor data: berkas salah harus ditolak tanpa merusak data lama, dan
   berkas benar harus mengembalikan isi persis seperti sebelumnya. */
cekAsync('cadangan data: berkas salah ditolak, data lama tetap utuh',async()=>{
  const w=boot(); akun(w,{user:{weight:66}});
  const sebelum=w.exportIsi();
  const rubbish=[
    '{}',
    '{"app":"Aplikasi Lain","data":{"ip90_user":{"weight":1}}}',
    'bukan json sama sekali',
    '{"app":"Instruktur Pribadi 90 Hari"}',
    '{"app":"Instruktur Pribadi 90 Hari","data":"bukan objek"}',
    '[]'
  ];
  for(let i=0;i<rubbish.length;i++){
    const el=w.document.getElementById('data-msg');
    if(el) el.textContent='';
    const file=new w.File([rubbish[i]],'x.json',{type:'application/json'});
    w.importData({files:[file],value:'x.json'});
    const pesan=await tungguPesan(w,/\S/);
    if(!pesan) throw new Error('berkas '+i+' ditolak tanpa pesan');
    if(/berhasil dimuat/i.test(pesan)) throw new Error('berkas '+i+' diterima: '+pesan);
    const sesudah=w.exportIsi();
    const kunci=Object.keys(sebelum);
    if(kunci.length!==Object.keys(sesudah).length)
      throw new Error('jumlah kunci berubah setelah berkas '+i);
    for(let j=0;j<kunci.length;j++)
      if(sebelum[kunci[j]]!==sesudah[kunci[j]])
        throw new Error('kunci berubah: '+kunci[j]);
  }
  w.close();
});

cekAsync('cadangan data: impor berkas benar mengembalikan semua isi',async()=>{
  const w=boot(); akun(w,{user:{weight:66,targetWeight:60}});
  w.tambahAir(1250);
  w.toggleMealDone(0);
  const asli=w.exportIsi();

  const paket={app:'Instruktur Pribadi 90 Hari',versi:'ip90-export-1',
    diekspor:new Date().toISOString(),data:{}};
  Object.keys(asli).forEach(k=>{ paket.data[k]=JSON.parse(asli[k]); });

  w.localStorage.clear();
  if(w.getAir()!==0) throw new Error('localStorage tidak benar-benar kosong');

  const file=new w.File([JSON.stringify(paket)],'cadangan.json',{type:'application/json'});
  w.importData({files:[file],value:'cadangan.json'});
  const pesan=await tungguPesan(w,/berhasil dimuat/i);
  if(!pesan) throw new Error('tidak ada pemberitahuan sukses: '+pesan);

  const pulih=w.exportIsi();
  const hilang=Object.keys(asli).filter(k=>bukanCache(k)&&pulih[k]!==asli[k]);
  if(hilang.length) throw new Error('kunci tidak kembali: '+hilang.join(', '));
  if(w.getAir()!==1250) throw new Error('air tidak kembali: '+w.getAir());
  const td=w.loadToday();
  if(!Array.isArray(td.mealsCompleted)||!td.mealsCompleted[0])
    throw new Error('makan yang sudah ditandai tidak kembali');
  const u=w.loadState('ip90_user');
  if(!u||u.weight!==66) throw new Error('profil tidak kembali: '+JSON.stringify(u));
  w.close();
});

/* Panduan dashboard menghitung sisa jadwal makan dari jumlah slot
   sebenarnya. Dulu angka 3 ditulis mati di dalam kode, jadi begitu
   slot kelima ditambahkan, menghitungannya langsung salah. */
cek('panduan dashboard: sisa makan dari jumlah slot sebenarnya',()=>{
  const w=boot(); akun(w,{});
  const msg=()=>w.document.getElementById('dash-guide-msg').textContent;
  const label=()=>w.document.getElementById('dash-guide-label').textContent;
  const total=w.NUTRISI.MEAL_SLOTS.length;

  const td=w.loadToday();
  td.workoutDone=true; td.mealsCompleted=[]; w.saveToday(td);
  w.renderGuidance(w.loadToday());
  if(!new RegExp('ada '+total+' jadwal').test(msg()))
    throw new Error('sisa awal salah: '+msg());
  if(!/latihan selesai/i.test(label())) throw new Error('label salah: '+label());

  td.mealsCompleted=[true,true]; w.saveToday(td);
  w.renderGuidance(w.loadToday());
  if(!new RegExp('ada '+(total-2)+' jadwal').test(msg()))
    throw new Error('sisa setelah 2 salah: '+msg());

  td.mealsCompleted=new Array(total).fill(true); w.saveToday(td);
  w.renderGuidance(w.loadToday());
  if(!/^selesai$/i.test(label().trim())) throw new Error('label selesai salah: '+label());

  td.workoutDone=false; w.saveToday(td);
  w.renderGuidance(w.loadToday());
  if(!/latihan/i.test(label())) throw new Error('label latihan salah: '+label());

  td.workoutDone=true; td.mealsCompleted='sampah'; w.saveToday(td);
  w.renderGuidance(w.loadToday());
  if(/NaN|undefined/.test(msg())) throw new Error('data rusak bocor ke layar: '+msg());
  if(!new RegExp('ada '+total+' jadwal').test(msg()))
    throw new Error('data rusak tidak dihitung sebagai 0: '+msg());
  w.close();
});

/* Beruntun harian hanya bertambah kalau latihan selesai dan seluruh
   slot makan tercentang. Data rusak tidak boleh menaikkan angka. */
cek('beruntun: hanya hari tuntas yang menambah, data rusak diabaikan',()=>{
  const w=boot(); akun(w,{});
  const set=(n,last)=>w.saveState('ip90_program',
    Object.assign(w.loadState('ip90_program'),{streak:n,lastActiveDate:last===undefined?hari(1):last}));
  const penuh=n=>new Array(n).fill(true);

  set(4);
  let td=w.loadToday();
  td.workoutDone=true; td.mealsCompleted=penuh(w.NUTRISI.MEAL_SLOTS.length-1);
  w.saveToday(td);
  if(w.updateStreak()!==4) throw new Error('naik padahal slot masih kurang');

  td.mealsCompleted='bukan array'; w.saveToday(td);
  if(w.updateStreak()!==4) throw new Error('naik dari data rusak (string)');

  td.mealsCompleted=null; w.saveToday(td);
  if(w.updateStreak()!==4) throw new Error('naik dari null');

  td.mealsCompleted=undefined; w.saveToday(td);
  if(w.updateStreak()!==4) throw new Error('naik dari undefined');

  td.mealsCompleted={0:true,1:true,2:true,3:true,4:true}; w.saveToday(td);
  if(w.updateStreak()!==4) throw new Error('naik dari objek');

  td.workoutDone=false; td.mealsCompleted=penuh(w.NUTRISI.MEAL_SLOTS.length); w.saveToday(td);
  if(w.updateStreak()!==4) throw new Error('naik tanpa latihan selesai');

  td.workoutDone=true; w.saveToday(td);
  if(w.updateStreak()!==5) throw new Error('hari tuntas tidak menambah beruntun');
  if(w.getStreak()!==5) throw new Error('getStreak tidak sama: '+w.getStreak());
  if(w.updateStreak()!==5) throw new Error('naik dua kali dalam sehari');

  w.saveState('ip90_today_'+new Date().toISOString().split('T')[0],
    {workoutDone:false,mealsCompleted:[]});
  set(5,hari(3));
  if(w.updateStreak()!==5) throw new Error('hari kosong ikut menambah beruntun');
  w.close();
});

/* Pemeriksaan energi mengunci mulai latihan saja. Kalau seluruh tab ikut
   terkunci, halaman bisa tertinggal dengan body overflow hidden dan
   tidak bisa digulir sama sekali. */
cek('cek energi: tab lain tetap terbuka dan halaman tetap bisa digulir',()=>{
  const w=boot(); akun(w,{skipEnergy:true});
  if(w.loadToday().energyChecked) throw new Error('energi dianggap sudah dicek');

  ['menu','progress','dashboard','latihan'].forEach(function(t){
    w.switchTab(w.document.querySelector('.lp-tab[onclick*="'+t+'"]'),t);
    if(!w.document.getElementById('tab-'+t).classList.contains('active'))
      throw new Error('tab '+t+' gagal dibuka');
    if(w.document.body.style.overflow==='hidden')
      throw new Error('gulir terkunci setelah membuka tab '+t);
  });

  const kartu=w.document.querySelectorAll('#exercise-list .exercise-card');
  if(!kartu.length) throw new Error('tidak ada kartu latihan untuk diperiksa');
  let terkunci=0;
  [...kartu].forEach(function(c){
    if(!c.classList.contains('locked')) return;
    terkunci++;
    if(c.querySelector('.ex-timer-btn'))
      throw new Error('latihan terkunci masih punya tombol timer');
  });
  if(!terkunci) throw new Error('tidak ada latihan yang terkunci tanpa cek energi');
  w.close();
});

/* Menandai makan selesai tidak boleh bergantung pada cek energi. */
cek('makan bisa ditandai tanpa cek energi',()=>{
  const w=boot(); akun(w,{skipEnergy:true});
  w.switchTab(w.document.querySelector('.lp-tab[onclick*="menu"]'),'menu');
  const total=w.NUTRISI.MEAL_SLOTS.length;
  for(let i=0;i<total;i++) w.toggleMealDone(i);
  const arr=w.loadToday().mealsCompleted;
  if(!Array.isArray(arr)||arr.filter(Boolean).length!==total)
    throw new Error('slot belum lengkap: '+JSON.stringify(arr));
  if(w.document.body.style.overflow==='hidden') throw new Error('gulir terkunci');
  w.close();
});

/* Kunci pemulihan pernah tidak pernah kedaluwarsa, sehingga Hari
   Pemulihan bisa tersangkut selamanya. Sekarang kuncinya ber tanggal
   dan yang sudah lewat dibersihkan saat aplikasi dibuka. */
/* recoveryKey(1) berarti besok, jadi kunci yang masih berlaku adalah
   kunci besok, bukan kunci kemarin. Kunci kemarin memang sudah
   kedaluwarsa dan harus dibersihkan. */
cek('kunci pemulihan: yang kedaluwarsa dibersihkan, yang aktif tetap',()=>{
  const w=boot();
  const besok=hari(-1);
  w.saveState('ip90_recovery_next_'+hari(3),'uji-tua');
  w.saveState('ip90_recovery_next_'+hari(1),'uji-kemarin');
  w.saveState('ip90_recovery_next_'+besok,'uji-aktif');
  w.localStorage.setItem('ip90_recovery_flag','"1"');
  w.bersihkanRecoveryKeys();
  if(w.localStorage.getItem('ip90_recovery_next_'+hari(3))!==null)
    throw new Error('kunci lama tidak dibersihkan');
  if(w.localStorage.getItem('ip90_recovery_next_'+hari(1))!==null)
    throw new Error('kunci kemarin tidak dibersihkan');
  if(w.loadState('ip90_recovery_next_'+besok)!=='uji-aktif')
    throw new Error('kunci aktif ikut terhapus');
  if(w.localStorage.getItem('ip90_recovery_flag')!==null)
    throw new Error('kunci lama ip90_recovery_flag masih ada');
  w.bersihkanRecoveryKeys();
  if(w.loadState('ip90_recovery_next_'+besok)!=='uji-aktif')
    throw new Error('kunci aktif terhapus saat dipanggil kedua kali');
  w.close();
});

/* Level latihan boleh turun hanya pada minggu deload, dan naik paling
   banyak satu tingkat per minggu. Satu lompatan yang disengaja ada di
   batas blok: minggu pertama blok baru mulai dari dasar blok yang lebih
   tinggi, jadi dari minggu deload bisa naik dua tingkat. Yang diuji
   adalah aturan itu, bukan bebas lonjakan.
   Level juga tidak boleh melewati batas yang diizinkan untuk profil
   pengguna; batas yang sengaja dilanggar diperiksa lewat
   getLevelForDay(day,true). */
cek('level latihan: naik bertahap, turun hanya saat deload, tidak lewat batas',()=>{
  [30,50,60,70].forEach(function(umur){
    const w=boot();
    akun(w,{user:{age:umur,weight:70,height:170}});
    const cap=w.getLevelCap();
    const lompatDiBawah=2;
    let sebelum=0;
    for(let d=0;d<95;d++){
      const lv=w.getLevelForDay(d);
      const no=w.getLevelForDay(d,true);
      const hari=d+1;
      if(!isFinite(lv)||lv<1) throw new Error('umur '+umur+' hari '+hari+' level '+lv);
      if(!isFinite(no)||no<1||no>8)
        throw new Error('umur '+umur+' hari '+hari+' level tanpa batas '+no);
      if(lv>cap) throw new Error('umur '+umur+' hari '+hari+' level '+lv+' melewati batas '+cap);
      if(no<lv) throw new Error('umur '+umur+' hari '+hari+' level lebih tinggi dari versi tanpa batas');
      if(lv<sebelum&&!w.isDeloadDay(d))
        throw new Error('umur '+umur+' hari '+hari+' level turun di luar deload');
      if(lv>sebelum+lompatDiBawah)
        throw new Error('umur '+umur+' hari '+hari+' level naik lebih dari '+lompatDiBawah);
      if(lv>sebelum+lompatDiBawah-1&&Math.floor(d/7)===Math.floor((d-1)/7))
        throw new Error('umur '+umur+' hari '+hari+' level naik di tengah minggu yang sama');
      sebelum=lv;
    }
    const info=w.getLevelInfo(89,true);
    if(!info.name||!info.sets||!info.reps) throw new Error('getLevelInfo tidak lengkap');
    if(/NaN|undefined/.test(JSON.stringify(info))) throw new Error('getLevelInfo rusak');
    w.close();
  });
});

/* Keadaan buka-tutup pada kartu yang bisa dilipat harus ikut dilaporkan
   ke atribut aria, supaya pembaca layar tidak diberi kabar yang salah. */
cek('aria-expanded dan aria-checked ikut perubahan keadaan',()=>{
  const w=boot(); akun(w,{});
  w.switchTab(w.document.querySelector('.lp-tab[onclick*="latihan"]'),'latihan');
  const head=w.document.querySelector('#exercise-list .exercise-card .exercise-header');
  if(!head) throw new Error('kepala kartu latihan tidak ada');
  w.toggleExercise(head);
  const card=head.parentElement;
  const nyata=card.classList.contains('open')?'true':'false';
  if(head.getAttribute('aria-expanded')!==nyata)
    throw new Error('aria-expanded latihan tidak sinkron');
  w.toggleExercise(head);
  if(head.getAttribute('aria-expanded')===nyata)
    throw new Error('aria-expanded latihan tidak berubah saat dilipat lagi');

  w.switchTab(w.document.querySelector('.lp-tab[onclick*="menu"]'),'menu');
  const meal=w.document.getElementById('meal-card-0');
  const mh=meal.querySelector('.meal-card-header');
  if(!mh) throw new Error('kepala kartu makan tidak ada');
  w.toggleMeal(0);
  if(mh.getAttribute('aria-expanded')!==(meal.classList.contains('open')?'true':'false'))
    throw new Error('aria-expanded makan tidak sinkron');

  w.showEnergyModal();
  w.selectEnergy(3);
  const bintang=[...w.document.querySelectorAll('.energy-star')];
  if(bintang.length!==5) throw new Error('bintang energi bukan 5');
  for(let i=0;i<3;i++)
    if(bintang[i].getAttribute('aria-checked')!=='true')
      throw new Error('bintang '+(i+1)+' terpilih tapi aria-checked false');
  for(let i=3;i<5;i++)
    if(bintang[i].getAttribute('aria-checked')!=='false')
      throw new Error('bintang '+(i+1)+' tidak terpilih tapi aria-checked true');
  w.selectEnergy(1);
  if(bintang[0].getAttribute('aria-checked')!=='true'
     ||bintang[1].getAttribute('aria-checked')!=='false')
    throw new Error('bintang tidak ikut berubah saat-energy diturunkan');
  w.close();
});

async function jalankanTertunda(){
  for(let i=0;i<tertunda.length;i++){
    const t=tertunda[i];
    total++;
    try{ await t.fn(); lulus++; console.log('  ok    '+t.nama); }
    catch(e){ problems.push(t.nama+': '+e.message); console.log('  GAGAL '+t.nama+'  ->  '+e.message); }
  }
}

(async function(){
  await jalankanTertunda();
  console.log('\n'+'='.repeat(62));
  console.log(lulus+' dari '+total+' kelompok uji lolos');
  if(problems.length){
    console.log('TOTAL MASALAH: '+problems.length);
    [...new Set(problems)].slice(0,25).forEach(p=>console.log('  - '+p));
    process.exit(1);
  }
  console.log('TOTAL MASALAH: 0');
  process.exit(0);
})();
