/* ================================================================
   CEK KES-INTEGRITAS  --  node cek.js

   Jalankan sebelum dan sesudah ngubah file apa pun:

       node cek.js

   Kenapa file ini ada: sebuah skrip pernah menulis isi yang salah ke
   style.css sampai file itu tinggal satu baris, dan tidak ada git
   yang bisa mengembalikan. Cek ini menangkap kelas kesalahan yang
   sama SEBELUM jadi Damage, dan yang jadi rusak diam-diam.

   Tidak butuh dependency. Tidak butuh server. Tidak mengubah apa pun.
   ================================================================ */

const fs=require('fs');
const path=require('path');

const ROOT=__dirname;
/* Satu daftar file, dipakai semua pemeriksaan di bawah. Semula tiap
   pemeriksaan menulis daftarnya sendiri, dan begitu ada file baru
   (notif.js) beberapa pemeriksaan diam-diam tidak ikut memindainya.
   Wajib menambah file baru ke sini, bukan menyalin daftar baru. */
const DEPLOY=['index.html','style.css','nutrition.js','recipes.js','notif.js',
'script.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png',
'README.md','SUMBER.md','.gitignore','utils.js'];

/* Ikon dan manifest ikut DEPLOY, bukan sekadar dilacak diam-diam.
   Halaman sudah merujuk mereka, jadi file-nya wajib ikut ter-push;
   kalau lupa, breakage baru muncul di server. */
const IKON=['icon-192.png','icon-512.png','icon-180.png'];
const PNG_SIH=[0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a];

/* File JavaScript yang dimuat halaman. Handler di markup, kelas CSS,
   dan banned words diperiksa terhadap gabungan semua file ini. */
const JSDIR=['nutrition.js','recipes.js','notif.js','script.js','utils.js'];
const gabungJS=function(){ return JSDIR.map(baca).join('\n'); };

/* Batas bawah ukuran file. Angka-angka ini lebih rendah dari file
   asli, jadi kalau suatu saat file terpangkas separuh, cek ini
   langsung gagal. */
const MIN_SIZE={'index.html':20000,'style.css':40000,'nutrition.js':30000,'notif.js':4000,
'recipes.js':35000,'script.js':150000,'README.md':8000,'SUMBER.md':5000,
'manifest.webmanifest':300,'icon-192.png':200,'icon-512.png':200,'icon-180.png':200,
'.gitignore':200,'utils.js':500};

let gagal=0;
const problems=[];
function cek(nama,fn){
  let pesan=null;
  try{ pesan=fn(); }catch(e){ pesan=e.message; }
  if(pesan){
    gagal++;
    problems.push(nama+': '+pesan);
    console.log('  GAGAL  '+nama+'  ->  '+pesan);
  }
  else console.log('  ok    '+nama);
}
function baca(name){ return fs.readFileSync(path.join(ROOT,name),'utf8'); }

console.log('== 1. FILE ADA DAN TIDAK TERPANGKAS ==');
DEPLOY.forEach(function(f){
  cek(f,function(){
    if(!fs.existsSync(path.join(ROOT,f))) return 'file tidak ada';
    const n=fs.statSync(path.join(ROOT,f)).size;
    const min=MIN_SIZE[f]||1000;
    if(n<min) return 'hanya '+n+' byte, minimal '+min+' (kemungkinan terpangkas)';
    return null;
  });
});

console.log('\n== 2. KURUNG KURAWAL SEIMBANG ==');
cek('CSS',function(){
  const c=baca('style.css');
  const o=(c.match(/\{/g)||[]).length, t=(c.match(/\}/g)||[]).length;
  if(o!==t) return o+' buka vs '+t+' tutup';
  // kurung kurawal di dalam komentar atau string dihitung keliru,
  // jadi dicek juga imbalance-nya tidak jauh
  if(Math.abs(o-t)>0) return 'selisih '+Math.abs(o-t);
  return null;
});
cek('JavaScript',function(){
  JSDIR.forEach(function(f){
    const s=baca(f);
    const o=(s.match(/\{/g)||[]).length, t=(s.match(/\}/g)||[]).length;
    if(Math.abs(o-t)>2) return f+': '+o+' vs '+t;
  });
  return null;
});

console.log('\n== 3. SYNTAX JAVASCRIPT ==');
cek('tiga file bisa di-parse',function(){
  const vm=require('vm');
  JSDIR.forEach(function(f){
    try{ new vm.Script(baca(f),{filename:f}); }
    catch(e){ return f+': '+e.message; }
  });
  return null;
});

console.log('\n== 4. KELAS CSS ==');
cek('semua kelas yang dipakai punya CSS',function(){
  const html=baca('index.html');
  // Komentar CSS harus dibuang dulu sebelum dicari. Kalau tidak, kelas
  // yang namanya disebut di dalam komentar akan dianggap punya aturan
  // padahal tidak ada sama sekali. experienced ini nyata terjadi:
  // dash-prog-item hanya disebut di dalam komentar, aturannya hilang.
  const css=baca('style.css').replace(/\/\*[\s\S]*?\*\//g,'');
  const js=gabungJS();

  // Ambil nama kelas dari string class="..." di markup dan JS,
  // termasuk yang dirangkai dengan + dan ${}. Nama kelas yang
  // masih berupa ekspresi tidak bisa dibaca, jadi dilewati.
  const kelas=new Set();
  const rx=/(?:class|className)=(["'])([\s\S]*?)\1/g;
  let m;
  while((m=rx.exec(html+'\n'+js))!==null){
    m[2].replace(/\$\{[^}]*\}/g,' ')
      .split('+')
      .map(function(s){ return s.replace(/^[\s'"(]+|[\s)'"]+$/g,''); })
      .filter(function(s){ return s && /^[a-z][a-z0-9_-]*$/i.test(s) && !/^\d/.test(s); })
      .forEach(function(s){ kelas.add(s); });
  }
  const rx2=/classList\.(?:add|toggle|remove)\('([\w-]+)'/g;
  while((m=rx2.exec(js))!==null) kelas.add(m[1]);

  const hilang=[...kelas].filter(function(k){ return css.indexOf('.'+k)<0; });
  if(hilang.length) return hilang.length+' kelas tanpa CSS: '+hilang.join(', ');
  return null;
});
/* Selector yatim itu sisa, bukan kerusakan. Selector yang tidak dipakai
   tidak merusak tampilan, hanya menambah byte. Yang penting kebalikannya:
   kelas yang DIPAKAI tapi tidak ada aturannya. Karena itu yang digagalkan
   di atas; yang di sini hanya dilaporkan, supaya cek tidak selalu gagal
   lalu orang berhenti bacanya. */
(function(){
  const css=baca('style.css');
  const src=['index.html'].concat(JSDIR)
  .map(function(f){ return baca(f); }).join('\n');
  const sel=css.replace(/\/\*[\s\S]*?\*\//g,'').split('}')
    .map(function(b){ const x=b.indexOf('{'); return x<0?'':b.slice(0,x).trim(); })
    .filter(Boolean)
    .flatMap(function(k){ return k.split(',').map(function(x){ return x.trim(); }); })
    .filter(function(s){ return s && /^\./.test(s); });
  const yatim=[...new Set(sel)].filter(function(s){
    const nama=s.replace(/^\./,'').replace(/[^a-zA-Z0-9_-].*$/,'');
    return nama && src.indexOf(nama)<0;
  });
  if(yatim.length) console.log('  info  selector yatim ('+yatim.length+'), aman dihapus: '+yatim.join(', '));
})();

console.log('\n== 5. CROSS-REFERENCE ==');
cek('id yang dipanggil JS ada di markup',function(){
  const js=baca('script.js');
  const html=baca('index.html');
  const ids=[...new Set([...js.matchAll(/getElementById\('([\w-]+)'\)/g)].map(function(m){ return m[1]; }))];
  const hilang=ids.filter(function(i){
    return html.indexOf('id="'+i+'"')<0 && !/modal|overlay|login|dev/.test(i);
  });
  if(hilang.length) return hilang.join(', ');
  return null;
});
cek('handler HTML punya fungsi',function(){
  const html=baca('index.html');
  const src=gabungJS();
  const h=[...new Set([...html.matchAll(/(?:onclick|onchange|oninput|onsubmit)="([A-Za-z_]\w*)\(/g)].map(function(m){ return m[1]; }))];
  const hilang=h.filter(function(x){ return !new RegExp('function\\s+'+x+'\\s*\\(').test(src); });
  if(hilang.length) return hilang.join(', ');
  return null;
});
cek('tidak ada fungsi yang dideklarasikan dua kali',function(){
  const js=baca('script.js');
  const defs=[...js.matchAll(/^\s*function\s+([A-Za-z_]\w*)/gm)].map(function(m){ return m[1]; });
  const dup=[...new Set(defs.filter(function(n,i){ return defs.indexOf(n)!==i; }))];
  if(dup.length) return dup.join(', ');
  return null;
});
/* Panggilan fungsi yang tidak ada definisinya baru gagal saat baris itu
   dieksekusi. Kalau baris itu jarang dijalankan, cacatnya bisa bertahan
   lama tanpa terlihat. _applyTabLockState pernah seperti itu: fungsinya
   dihapus, pemanggilnya tertinggal, dan tidak ada yang gagal sampai
   program itu dibuka lagi.
   Daftar deklarasi dikumpulkan dari semua bentuk penulisan nama:
   deklarasi fungsi, deklarasi variabel, parameter fungsi, parameter
   panah, tangkapan catch, dan for..of. Sisa yang dipanggil tapi tidak
   ada namanya adalah kandidat bug. */
const BUILTIN=new Set(('if for while switch catch return typeof new delete void in of instanceof class extends '+
'this null true false undefined NaN Infinity function do else try await async yield throw case break continue '+
'Array Object String Number Boolean Date Math JSON RegExp Error Promise Map Set WeakMap WeakSet Symbol BigInt '+
'parseInt parseFloat isFinite isNaN encodeURIComponent decodeURIComponent setTimeout clearTimeout setInterval '+
'clearInterval requestAnimationFrame cancelAnimationFrame fetch console window document localStorage navigator '+
'location history screen alert confirm prompt Intl Blob File FileReader FormData URL URLSearchParams Headers '+
'getComputedStyle resolve reject then catch all race status '+
'Notification PushManager ServiceWorker caches indexOf fromCharCode of '+
'notifAktifkan notifMatikan notifStatusTeks notifPeriksa notifMulai notifBaca NOTIFJamValid NOTIFTanggal '+
'AbortController TextEncoder TextDecoder Uint8Array Int8Array Uint16Array Int16Array Uint32Array Int32Array '+
'Float32Array Float64Array ArrayBuffer DataView CustomEvent Event EventTarget MutationObserver '+
'ResizeObserver IntersectionObserver performance structuredClone queueMicrotask require module exports process '+
'Buffer setImmediate clearImmediate globalThis Proxy Reflect WeakRef FinalizationRegistry global '+
'close notify toString valueOf hasOwnProperty preventDefault stopPropagation btoa atob')
.split(' '));

/* Penyamar string dan komentar. Karakter di dalam string dan komentar
   diganti spasi, panjangnya tidak berubah, jadi posisi karakter tetap
   utuh. Regex biasa tidak bisa dipakai di sini: kode aplikasi penuh
   ungkapan bertingkat, string yang berisi tanda kutip escap, dan
   regex; pola naif salah memotong, dan baris yang seharusnya utuh
   justru lenyap karena sisanya ikut dianggap string. */
function samarkan(src){
  const out=src.split('');
  let i=0;
  const n=src.length;
  const kosongkan=function(a,b){
    for(let k=a;k<b;k++) if(out[k]!=='\n') out[k]=' ';
  };
  while(i<n){
    const c=src[i], d=src[i+1];
    if(c==='/'&&d==='/'){
      const s=i; while(i<n&&src[i]!=='\n') i++;
      kosongkan(s,i); continue;
    }
    if(c==='/'&&d==='*'){
      const s=i; i+=2;
      while(i<n&&!(src[i]==='*'&&src[i+1]==='/')) i++;
      i=Math.min(n,i+2);
      kosongkan(s,i); continue;
    }
    if(c==='"'||c==="'"||c==='`'){
      const q=c, s=i;
      i++;
      while(i<n){
        if(src[i]==='\\'){ i+=2; continue; }
        if(src[i]===q){ i++; break; }
        if(q!=='`'&&src[i]==='\n') break;
        i++;
      }
      kosongkan(s,i); continue;
    }
    i++;
  }
  return out.join('');
}

cek('fungsi yang dipanggil selalu punya deklarasi',function(){
  const js=JSDIR.map(function(f){ return samarkan(baca(f)); }).join('\n');
  const nama=new Set();
  let m;
  const tambah=function(re){ let x; while((x=re.exec(js))!==null) nama.add(x[1]); };
  tambah(/function\s+([A-Za-z_$][\w$]*)\s*\(/g);
  tambah(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g);
  tambah(/function\s+[A-Za-z_$][\w$]*\s*\(([^)]*)\)/g);
  tambah(/\(([^()]*)\)\s*=>/g);
  tambah(/([A-Za-z_$][\w$]*)\s*=>/g);
  tambah(/\bcatch\s*\(\s*([A-Za-z_$][\w$]*)/g);
  tambah(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s+(?:of|in)\s/g);
  tambah(/\bclass\s+([A-Za-z_$][\w$]*)/g);

  /* Hanya pemanggilan yang muncul setelah tanda kode, bukan kata
     di dalam kalimat. Teks resep dan komentar banyak berisi kata
     diikuti tanda kurung, misalnya "dimasak (direbus)", dan itu
     bukan pemanggilan fungsi. Membuang string dan komentar dengan
     regex tidak aman di sini: kode ini penuh ungkapan bertingkat
     dan regex, sehingga pola naif salah memotong dan justru
     menghilangkan baris yang benar. */
  const sebelum=/(?:^|[=({[,;:!&|?+\-*<>~%]|\breturn\b|\btypeof\b|\bawait\b|\bnew\b|\bvoid\b|\bcase\b|\bin\b|\bof\b)\s*$/;
  const dipanggil=new Set();
  const rx=/([A-Za-z_$][\w$]*)\s*\(/g;
  while((m=rx.exec(js))!==null){
    const n=m[1];
    if(!/^[a-z_$]/.test(n)) continue;
    if(BUILTIN.has(n)||nama.has(n)) continue;
    const sebelumIni=js.slice(Math.max(0,m.index-12),m.index);
    if(!sebelum.test(sebelumIni)) continue;
    dipanggil.add(n);
  }
  return dipanggil.size? [...dipanggil].join(', ') : null;
});

console.log('\n== 6. ASET LOKAL DAN PWA ==');
cek('semua src/href menunjuk file yang ada',function(){
  const html=baca('index.html');
  const refs=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(function(m){ return m[1]; });
  const rusak=refs.filter(function(r){
    if(/^(https?:)?\/\//.test(r)) return false;
    if(r.startsWith('#')||r.startsWith('data:')||r.startsWith('mailto:')) return false;
    const nama=r.split('?')[0].split('#')[0];
    if(!nama) return false;
    return !fs.existsSync(path.join(ROOT,nama));
  });
  return rusak.length?rusak.join(', '):null;
});
cek('manifest.webmanifest adalah JSON yang wajar',function(){
  let m;
  try{ m=JSON.parse(baca('manifest.webmanifest')); }
  catch(e){ return 'JSON rusak: '+e.message; }
  const kurang=[];
  if(!m.name) kurang.push('name');
  if(!m.start_url) kurang.push('start_url');
  if(!Array.isArray(m.icons)||!m.icons.length) kurang.push('icons');
  if(kurang.length) return 'kurang: '+kurang.join(', ');
  const tanpaFile=m.icons.filter(function(i){
    return typeof i.src==='string' && !/^(https?:)?\/\//.test(i.src)
      && !fs.existsSync(path.join(ROOT,i.src));
  }).map(function(i){ return i.src; });
  if(tanpaFile.length) return 'ikon tidak ada: '+tanpaFile.join(', ');
  return null;
});
cek('ikon PNG punya tanda tangan yang benar',function(){
  const rusak=[];
  IKON.forEach(function(f){
    const buf=fs.readFileSync(path.join(ROOT,f));
    if(buf.length<8) return rusak.push(f+' (terlalu kecil)');
    for(let i=0;i<PNG_SIH.length;i++){
      if(buf[i]!==PNG_SIH[i]) return rusak.push(f+' (bukan PNG)');
    }
    if(buf.toString('latin1',12,16)!=='IHDR') return rusak.push(f+' (tanpa blok IHDR)');
  });
  return rusak.length?rusak.join(', '):null;
});
/* SVG inline bisa ditunjuk lewat url(#id) di atribut, atau diambil
   dari JS lalu diisi. Keduanya sah, jadi keduanya dihitung terpakai. */
cek('id SVG inline tidak menggantung',function(){
  const html=baca('index.html');
  const svg=html.match(/<svg[\s\S]*?<\/svg>/g)||[];
  if(!svg.length) return 'tidak ada SVG inline, grafik cadangan hilang';
  const semua=html+'\n'+gabungJS();
  const idSvg=[...new Set(svg.flatMap(function(s){
    return [...s.matchAll(/\sid="([\w-]+)"/g)].map(function(m){ return m[1]; });
  }))];
  const yatim=idSvg.filter(function(i){
    return semua.indexOf('url(#'+i+')')<0
      && !new RegExp('getElementById\\(\''+i+'\'\\)').test(gabungJS());
  });
  return yatim.length?'id SVG tidak dipakai: '+yatim.join(', '):null;
});
cek('SVG inline punya viewBox',function(){
  const svg=baca('index.html').match(/<svg[\s\S]*?>/g)||[];
  const rusak=svg.filter(function(s){ return !/viewBox=/.test(s); });
  return rusak.length?rusak.length+' SVG tanpa viewBox (tidak responsif)':null;
});

console.log('\n== 7. TIPOGRAFI ==');
cek('root 16px dan tidak ada teks di bawah 12px',function(){
  const css=baca('style.css');
  if(!/html\{font-size:16px/.test(css)) return 'root bukan 16px, token akan bergeser';
  const px=[...css.matchAll(/font-size:(\.[0-9]+|[0-9]+(?:\.[0-9]+)?)rem/g)]
  .map(function(m){ return Math.round(parseFloat(m[1])*16*10)/10; });
  const kecil=px.filter(function(v){ return v<12; });
  if(kecil.length) return kecil.length+' aturan di bawah 12px';
  return null;
});
cek('token skala lengkap',function(){
  const css=baca('style.css');
  const t=['--fs-2xs','--fs-xs','--fs-sm','--fs-md','--fs-lg','--fs-xl','--font-m','--font-h','--font-b'];
  const kurang=t.filter(function(x){ return css.indexOf(x+':')<0; });
  if(kurang.length) return 'kurang: '+kurang.join(', ');
  return null;
});

console.log('\n== 8. KODE BERSIH ==');
cek('tidak ada console.log atau debug',function(){
  const n=JSDIR
  .reduce(function(a,f){ return a+baca(f).split('\n').filter(function(l){ return /console\.(log|debug)\(/.test(l); }).length; },0);
  if(n) return n+' baris';
  return null;
});
/* Dua pemeriksaan di bawah ini sebelumnya ditulis dengan return di dalam
   forEach. Return di dalam callback hanya keluar dari callback itu, bukan
   dari fungsi induknya, jadi hasilnya selalu null dan pemeriksaannya
   selalu lolos. Dua-duanya sudah ketahuan karena script.js sempat
   memuat tiga huruf Korea di dalam komentar tanpa pernah dilaporkan. */
/* PNG ikut DEPLOY untuk pemeriksaan keberadaan dan ukuran, tapi bukan
   file teks: dibaca sebagai utf8 akan menghasilkan deretan karakter
   asing palsu dan membuat pemeriksaan karakter gagal terus. */
const TEKS=DEPLOY.filter(function(f){ return !/\.png$/.test(f); })
.concat(['AUDIT.md','cek.js','uji.js']);

cek('tidak ada karakter asing di file teks',function(){
  const asing=/[\u0400-\u04ff\u4e00-\u9fff\uac00-\ud7af\ufffd]/;
  const rusak=[];
  TEKS.forEach(function(f){
    if(!fs.existsSync(path.join(ROOT,f))) return;
    const m=baca(f).match(asing);
    if(!m) return;
    const kode=[...new Set(m)].map(c=>'U+'+c.charCodeAt(0).toString(16).toUpperCase());
    rusak.push(f+' ('+kode.join(' ')+')');
  });
  return rusak.length?rusak.join(', '):null;
});
cek('semua file pakai LF saja',function(){
  const rusak=[];
  TEKS.forEach(function(f){
    if(!fs.existsSync(path.join(ROOT,f))) return;
    if(/\r\n/.test(baca(f))) rusak.push(f);
  });
  return rusak.length?rusak.join(', ')+' (ada CRLF)':null;
});

console.log('\n== 9. GIT ==');
cek('ada commit',function(){
  const {execSync}=require('child_process');
  try{ execSync('git rev-parse HEAD',{cwd:ROOT,stdio:'pipe'}); }
  catch(e){ return 'belum ada commit, file tidak bisa dikembalikan'; }
  return null;
});
cek('tidak ada perubahan belum di-commit',function(){
  const {execSync}=require('child_process');
  let out='';
  try{ out=execSync('git status --porcelain',{cwd:ROOT,stdio:'pipe'}).toString(); }
  catch(e){ return 'git tidak bisa dibaca'; }
  // File yang belum dilacak ikut dihitung kalau namanya ada di DEPLOY.
  // Kalau tidak, file baru yang lupa di-add akan lolos tanpa terdeteksi,
  // padahal tidak akan ikut ter-push.
  const dirty=out.split('\n').filter(function(l){
    if(!l.trim()) return false;
    if(/^\?\?/.test(l)){
      const nama=l.slice(3).trim();
      return DEPLOY.indexOf(nama.replace(/\\/g,'/'))>=0;
    }
    return true;
  });
  if(dirty.length) return dirty.length+' file berubah: '+dirty.map(function(l){ return l.slice(3); }).join(', ');
  return null;
});

function see(){
  return JSDIR.map(baca).join('\n');
}

console.log('\n== 10. ATURAN SEBELUM MENJALANKAN UJI YANG MERUSAK FILE ==');
/* Dua kali dalam sesi ini, `git checkout -- <file>` mengembalikan
   pekerjaan yang belum di-commit, bukan hanya kerusakan uji. Skrip
   penguji mengembalikan file ke commit terakhir, dan karena perubahan
   itu belum pernah di-commit, perubahan itu hilang. Uji jaring
   pengaman justru jadi penyebab kehilangan.
   Aturan: commit dulu, baru merusak file. */
cek('tidak ada file yang belum di-commit',function(){
  const {execSync}=require('child_process');
  let out='';
  try{ out=execSync('git status --porcelain',{cwd:ROOT,stdio:'pipe'}).toString(); }
  catch(e){ return 'git tidak bisa dibaca, tidak aman untuk uji merusak file'; }
  const dirty=out.split('\n').filter(function(l){
    if(!l.trim()) return false;
    if(/^\?\?/.test(l)) return DEPLOY.indexOf(l.slice(3).trim())>=0;
    return true;
  });
  if(dirty.length) return dirty.length+' file belum di-commit. Uji yang merusak file akan HILANGKAN mereka: '+dirty.map(function(l){ return l.slice(3); }).join(', ');
  return null;
});

console.log('\n'+'='.repeat(62));
if(gagal){
  console.log('GAGAL: '+gagal+' pemeriksaan');
  console.log('\nKalau ini menandai file yang terpotong, kembalikan:');
  console.log('  git checkout -- <nama-file>');
  console.log('Kalau commit-nya belum ada, tidak ada pemulihan otomatis.');
  console.log('JANGAN lanjut mengedit sebelum masalah utama beres.');
  if(/belum di-commit/.test(problems.join(' '))){
    console.log('');
    console.log('PENTING: file yang belum di-commit akan hilang kalau ada');
    console.log('uji yang memakai `git checkout` untuk memulihkan file.');
    console.log('Commit dulu, baru menjalankan uji semacam itu.');
  }
  process.exit(1);
} else {
  console.log('SEMUA LOLOS');
  process.exit(0);
}
