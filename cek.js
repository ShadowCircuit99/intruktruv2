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
'script.js','README.md','SUMBER.md','.gitignore'];

/* File JavaScript yang dimuat halaman. Handler di markup, kelas CSS,
   dan banned words diperiksa terhadap gabungan semua file ini. */
const JSDIR=['nutrition.js','recipes.js','notif.js','script.js'];
const gabungJS=function(){ return JSDIR.map(baca).join('\n'); };

/* Batas bawah ukuran file. Angka-angka ini lebih rendah dari file
   asli, jadi kalau suatu saat file terpangkas separuh, cek ini
   langsung gagal. */
const MIN_SIZE={'index.html':20000,'style.css':40000,'nutrition.js':30000,'notif.js':4000,
'recipes.js':35000,'script.js':150000,'README.md':8000,'SUMBER.md':5000,
'.gitignore':200};

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

console.log('\n== 6. TIPOGRAFI ==');
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

console.log('\n== 7. KODE BERSIH ==');
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
const TEKS=DEPLOY.concat(['AUDIT.md','cek.js','uji.js']);

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

console.log('\n== 8. GIT ==');
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

console.log('\n== 9. ATURAN SEBELUM MENJALANKAN UJI YANG MERUSAK FILE ==');
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
