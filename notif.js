

/* Status pengingat */
const NOTIF_KEY='ip90_notif';
const NOTIF_DEFAULT={aktif:false, jam:'07:00', terakhir:''};

function notifBaca(){
try{
const s=localStorage.getItem(NOTIF_KEY);
if(!s) return Object.assign({},NOTIF_DEFAULT);
const o=JSON.parse(s);
return {aktif:!!o.aktif, jam:NOTIFJamValid(o.jam), terakhir:String(o.terakhir||'')};
}catch(e){
return Object.assign({},NOTIF_DEFAULT);
}
}

function notifSimpan(p){
try{ localStorage.setItem(NOTIF_KEY,JSON.stringify(p)); }catch(e){}
}

function NOTIFJamValid(v){
if(typeof v!=='string'||!/^\d{2}:\d{2}$/.test(v)) return NOTIF_DEFAULT.jam;
const jam=Number(v.slice(0,2)), menit=Number(v.slice(3,5));
if(jam>23||menit>59) return NOTIF_DEFAULT.jam;
return v;
}

function notifDidukung(){
return typeof Notification!=='undefined';
}

function notifIzin(){
if(!notifDidukung()) return 'tidak didukung';
if(typeof Notification.permission!=='string') return 'tidak didukung';
return Notification.permission;
}

function notifBoleh(){
return notifDidukung()&&Notification.permission==='granted';
}

function notifTanggal(d){
const x=d||new Date();
return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0');
}

function notifSudahLewatWaktu(jam,sekarang){
const p=NOTIFJamValid(jam).split(':');
const target=Number(p[0])*60+Number(p[1]);
const d=sekarang||new Date();
return (d.getHours()*60+d.getMinutes())>=target;
}

/* Pemeriksaan utama */
function notifPeriksa(paksa){
const p=notifBaca();
if(!p.aktif) return false;
if(!notifBoleh()) return false;

const hariIni=notifTanggal();
if(!paksa&&p.terakhir===hariIni) return false;
if(!paksa&&!notifSudahLewatWaktu(p.jam)) return false;

notifTampilkan();
p.terakhir=hariIni;
notifSimpan(p);
return true;
}

/* Mengirim notifikasi */
function notifTampilkan(){
const day=getCurrentDay();
const sd=loadDayData(day);
const selesai=!sd||!sd.workout||!sd.workout.done;
const judul=selesai?'Latihan hari ini belum dikerjakan':'Program hari ini';

let isi;
if(selesai){
isi='Cek kondisi badan dulu, lalu mulai latihan hari ke-'+Math.min(day+1,90)+'.';
}else{
isi='Semua sudah beres. Lihat progres di tab Progres.';
}

try{
const n=new Notification(judul,{body:isi,tag:'ip90-harian',renotify:false});
n.onclick=function(){
try{ window.focus(); }catch(e){}
showScreen('lp');
n.close();
};
}catch(e){ return false; }
return true;
}

function notifMintaIzin(){
if(!notifDidukung()) return Promise.resolve('tidak didukung');
if(Notification.permission!=='default') return Promise.resolve(Notification.permission);
try{
return Notification.requestPermission().then(function(p){ return p; });
}catch(e){
return new Promise(function(resolve){
try{
Notification.requestPermission(function(p){ resolve(p); });
}catch(e2){ resolve('ditolak'); }
});
}
}

function notifAktifkan(){
return notifMintaIzin().then(function(izin){
const p=notifBaca();
if(izin==='granted'){
p.aktif=true;
if(!p.terakhir) p.terakhir='';
notifSimpan(p);
}else{
p.aktif=false;
notifSimpan(p);
}
return izin;
});
}

function notifMatikan(){
const p=notifBaca();
p.aktif=false;
notifSimpan(p);
renderNotifPanel();
}

function notifSetJam(v){
const p=notifBaca();
p.jam=NOTIFJamValid(v);
notifSimpan(p);
renderNotifPanel();
}

function notifUji(){
if(!notifBoleh()){
renderNotifPanel();
return false;
}
notifTampilkan();
return true;
}

/* Pasang pengingat */
function notifMulai(){
if(typeof document==='undefined') return;
const tick=function(){ try{ notifPeriksa(); }catch(e){} };
document.addEventListener('visibilitychange',function(){
if(!document.hidden) tick();
});
window.addEventListener('focus',tick);
setInterval(tick,60000);
setTimeout(tick,1200);
}

function notifStatusTeks(){
if(!notifDidukung())
return 'Peramban ini tidak bisa mengirim notifikasi. Aplikasi tetap jalan, tapi pengingat otomatis tidak ada.';
const izin=Notification.permission;
if(izin==='denied')
return 'Notifikasi diblokir di pengaturan peramban. Izinkan dulu lewat ikon gembok di bilah alamat.';
const p=notifBaca();
if(!p.aktif) return 'Pengingat harian sedang mati.';
if(izin==='default')
return 'Izin notifikasi belum diminta. Tekan Aktifkan lalu izinkan di peramban.';
return 'Aktif. Notifikasi muncul '+(p.terakhir?('terakhir kali ini '+p.terakhir+'.'):'hari ini pukul '+p.jam+'.');
}
