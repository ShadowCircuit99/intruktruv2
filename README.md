# Instruktur Olahraga Pribadi

Aplikasi **Instruktur Olahraga Pribadi** berbasis web menggunakan **HTML, CSS, dan JavaScript** untuk membantu pengguna menjalankan program latihan 90 hari dan rencana makan harian secara mandiri, seperti punya personal trainer.


## Fitur Utama
- 🏋️ Program latihan 90 hari dengan progresi bertahap (bukan meloncat)
- ⏱️ Sesi latihan wajib berurutan: pemanasan → latihan utama → pendinginan
- 🔢 Setiap nilai gizi dihitung dari berat bahan, bukan dari angka tebakan
- 🍽️ 5 slot makan harian: sarapan, siang, snack, malam, minuman
- 📊 Tracking berat badan, lingkar pinggang, dan progres sesi
- 📅 Deload otomatis tiap 4 minggu supaya badan sempat pulih


## Struktur File

```
index.html      markup + tampilan
style.css       gaya
nutrition.js    basis data gizi, metode masak, target energi, penyesuaian porsi
recipes.js      53 resep dengan bahan terukur
script.js       seluruh logic: planner makan, engine latihan, progress, UI
```

`nutrition.js` dan `recipes.js` dimuat sebelum `script.js`. Keduanya juga mengekspor data ke `window.NUTRISI` dan `window.RESEP` supaya tidak bergantung pada cakupan leksikal antar tag `<script>`.


## Dari Mana Angka Gizinya?

**Semua angka gizi berasal dari USDA FoodData Central**, diambil otomatis dari
file CSV resmi — bukan diketik manual, bukan dari ingatan.

```
total gizi menu = jumlah (gizi bahan x berat dipakai / 100) + minyak terserap
energi          = protein x 4 + karbohidrat x 4 + lemak x 9 + serat x 2  (Atwater)
```

Energi **tidak** diambil dari kolom calories USDA, tapi dihitung ulang dari
makronutrien. Alasannya, USDA memakai faktor Atwater sendiri yang berbeda-beda
— kacang tanah misalnya 587 kkal di tabelnya, sedangkan 4/4/9 memberi 443.
Itu bukan salah data, cuma beda metode.

Karbohidrat memakai yang **neto**: total karbohidrat USDA (nutrient 1005)
dikurangi serat (1079), supaya serat tidak dihitung dua kali sebagai energi.

Rincian lengkap per bahan — dataset, nomor FDC, deskripsi resmi, dan bahan mana
saja yang belum bersumber — ada di **[SUMBER.md](SUMBER.md)**. Ringkasnya:

- **95 dari 96 bahan** terambil dari USDA FoodData Central
  (SR Legacy 2018-04, Foundation Food 2026-04-30, Survey/FNDDS 2024-10-31)
- **1 bahan belum bersumber**: serai. Dicari di keempat dataset USDA termasuk
  Branded 1,9 juta produk, tidak ada baris serai murni. Angkanya 0 dengan tanda
  `BELUM BERSUMBER` -- nol itu bukan nilai sebenarnya
- **21 bahan memakai padanan USDA** lain karena bahan aslinya tidak ada di
  database itu, dengan alasan tertulis di tiap baris dan ditandai di UI

`SUMBER_GIZI` di `nutrition.js` menyebut nomor FDC tiap bahan, jadi angkanya
bisa diaudit langsung di fdc.nal.usda.gov:

```js
console.table(SUMBER_GIZI);
```


## Metode Masak Dinaikkan ke Perhitungan

Bahan yang sama dimasak berbeda kalorinya. Tiap metode punya karakter:

| Metode | Minyak terserap | Air tersisa |
|--------|-----------------|-------------|
| Direbus | 0% | 90% |
| Dikukus | 0% | 92% |
| Dipanggang | 3% protein, 1% karbo | 70% |
| Tumis | 4% protein, 1% karbo | 80% |
| Digoreng | 12% protein, 3% karbo | 60% |
| Direbus kuah | 2% protein, 1% karbo | 130% |
| Tanpa dimasak | 0% | 100% |

Minyak yang meresap dihitung dan ditampilkan terpisah, supaya jelas dari mana
kalorinya datang. Resep tanpa metode masak (buah, minuman) memakai mode
"Tanpa dimasak" sehingga tidak ada minyak fiktif yang ikut terhitung.


## Target Energi

```
BMR  : Mifflin-St Jeor
TDEE : BMR × aktivitas tertinggi antara laporan user dan kebutuhan
       program (1.55 untuk 5-6 hari latihan/minggu)

turun  : TDEE × 0.80, DITAKHANKAN tidak boleh di bawah BMR
jaga   : TDEE
naik   : TDEE × 1.12
```

Defisit **tidak** lagi flat −500 kkal dengan batas bawah tetap. Limit-fixed
sebelumnya membuat mode "turun" justru menaikkan berat pada pengguna dengan
TDEE kecil: wanita 55 kg/160 cm/35 th punya TDEE 1302, dikurangi 500 = 802,
lalu dipaksa naik ke 1200 — di atas TDEE-nya sendiri.

Target makro:

| | Protein | Lemak | Karbohidrat | Serat |
|---|---|---|---|---|
| Turun | 2.0 g/kg | 28% energi, min 0.6 g/kg | sisanya | max(25 g, 14 g/1000 kkal) |
| Jaga | 1.6 g/kg | " | " | " |
| Naik | 1.8 g/kg | " | " | " |

Batas atas gula 10% energi, natrium 2000 mg.


## Distribusi Makan

| Tujuan | Sarapan | Siang | Snack | Malam | Minuman |
|---|---|---|---|---|---|
| Turun | 26% | 34% | 10% | 27% | 3% |
| Jaga | 26% | 32% | 12% | 27% | 3% |
| Naik | 28% | 32% | 13% | 27% | 0% |


## Cara Target Ditepati

Target didepati dengan mengubah porsi bahan utama saja. Bumbu, minyak, dan
rempah dikunci (`scale:false`) supaya rasa hidangan tidak berubah.

```
1. semua bahan utama dikalikan satu rasio (0.55 – 2.0)
2. kalau masih meleset >10%, koreksi hanya sumber karbohidrat
3. takaran dikunci ke rentang yang masuk akal di dapur
4. gizi dihitung ULANG dari gram akhir
```

Angka yang ditampilkan selalu hasil perhitungan ulang dari gram akhir,
bukan target yang diminta. Kalau meleset, selisihnya ditampilkan terbuka di
kartu.


## Cara Memilih Hidangan

Pemilihan hidangan dijalankan dua tahap, bukan satu skor tunggal. Kalau caloric
langsung dinilai per resep, satu resep yang paling pas target akan menang
setiap hari dan user tidak pernah bervariasi.

```
1. KANDIDAT  semua resep dihitung setelah porsi disesuaikan dan dikunci
2. BERSIH    buang yang masih memakai bahan terlarang, asal ada yang bersih
3. BAND      sisakan yang caloric-nya dalam max(best + 12%, best x 1.6)
4. URUTAN    urutkan: protein yang mengulang, hidangan kemarin, kecocokan tujuan
5. ROTASI    ambil band[hari % jumlah band], jadi tiap resep layak muncul
```

Kalau satu slot memang tidak punya menu yang bebas bahan terlarang, yang
dipakai tetap yang paling sedikit melanggar — bukan menolak semua — dan
kartu diberi tahu bahan mana yang tidak bisa dihindari.

Bahan yang diganti ikut menulis ulang nama hidangan dan langkah masaknya. Kalau tidak, kartu akan tetap menyebut "Keju cheddar" padahal
isinya edamame, dan langkah masaknya memerintahkan memotong keju.

Semua pilihan bersifat deterministik: hari yang sama selalu menghasilkan
menu yang sama, jadi refresh tidak mengubah apa pun.


## Latihan Wajib Berurutan

```
Pemanasan  →  Latihan Utama  →  Pendinginan
```

- Bagian berikutnya terkunci sampai bagian sebelumnya selesai
- Status: `locked` → `available` → `in_progress` → `completed`
- Validasi ada di JavaScript, bukan cuma CSS: memanggil `exTimerStart(3)` saat
  item 3 belum tersedia tidak melakukan apa-apa
- Progres tersimpan per hari, refresh tidak menghapus urutan
- Mengulang satu bagian membatalkan semua bagian setelahnya


## Progresi Latihan

**3 minggu naik + 1 minggu deload**, diulang tiap blok 4 minggu.

| Blok | Minggu 1 | Minggu 2 | Minggu 3 | Minggu 4 |
|------|----------|----------|----------|----------|
| 1 | Level 1 | Level 2 | Level 3 | Deload |
| 2 | Level 3 | Level 4 | Level 5 | Deload |
| 3 | Level 5 | Level 6 | Level 7 | Deload |
| 4 | Level 7 | Level 8 | Turun lagi (taper) | |

Tiap level punya set, repetisi, durasi kerja, dan istirahat sendiri
(L1: 2×10, istirahat 90 dtk → L8: 5×15, istirahat 60 dtk). Level juga
dibatasi oleh usia, BMI, dan tingkat aktivitas supaya program tidak
berlebihan.


## Split Mingguan per Tujuan

| Tujuan | Pola 7 hari |
|---|---|
| Turun | Full Body A → Kardio A → Upper A → Full Body B → Kardio B → Mobilitas → Pemulihan |
| Jaga | Upper A → Lower A → Full Body A → Kardio A → Full Body B → Mobilitas → Pemulihan |
| Naik | Push A → Pull A → Lower A → Pull B → Full Body B → Mobilitas → Pemulihan |


## Batas Keamanan

- Sesi latihan dibatasi 35 menit, dipotong berurutan: durasi kerja, set, istirahat
- Minimal 2 set dan 30 detik istirahat
- BMI di atas 30 atau 14 hari pertama memakai gerakan low impact
- Energi dan jam tidur setiap hari ikut menurunkan intensitas
- Tiga hari beruntun energi rendah membatasi latihan maksimal 80%
- Protein 20 kg lebih tinggi saat defisit supaya massa otot ikut terjaga
- Target calories tidak pernah di bawah metabolisme basal


## Teknologi

- HTML5
- CSS3
- JavaScript (Vanilla JS, tanpa dependency)
- LocalStorage


## Menjalankan

Cukup buka `index.html` di browser:

```bash
start index.html
```

Atau sajikan lewat HTTP server lokal:

```bash
python -m http.server 8000
```
