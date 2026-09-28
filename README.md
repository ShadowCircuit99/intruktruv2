# Instruktur Pribadi 90 Hari

Program latihan dan makan selama 90 hari, berjalan di peramban.
Tanpa akun, tanpa server, tanpa pemasangan.

Buka `index.html`, isi formulir, selesai.

---

## Daftar Isi

- [Fitur](#fitur)
- [Cara Memakai](#cara-memakai)
- [Dari Mana Angka Gizinya](#dari-mana-angka-gizinya)
- [Cara Target Energi Dihitung](#cara-target-energi-dihitung)
- [Cara Memilih Menu](#cara-memilih-menu)
- [Latihan](#latihan)
- [Setelah Hari ke-90](#setelah-hari-ke-90)
- [Pengingat Harian](#pengingat-harian)
- [Tampilan](#tampilan)
- [Isi Folder](#isi-folder)
- [Yang Perlu Diketahui](#yang-perlu-diketahui)

---

## Fitur

**Program 90 hari** yang menghitung hari sendiri dari tanggal mulai. Bukan
daftar yang harus dicentang manual.

**Tiga pilihan tujuan.** Turun berat, jaga badan, atau tambah massa otot.
Setiap pilihan punya target kalori dan makro yang berbeda, dihitung dari badan
kamu sendiri, bukan angka tetap.

**Menu harian yang dihitung ulang.** Lima slot makan dipilih otomatis supaya
total harannya mendekati target: sarapan, makan siang, snack, makan malam, dan
minuman. Gizi dihitung dari berat tiap bahan, bukan dari angka yang dikunci.

**Angka gizi dari USDA.** Semua dari USDA FoodData Central, bukan dari ingatan
atau blog. Ada nomor FDC per bahan, jadi bisa ditelusuri.

**Metode masak ikut dihitung.** Goreng, tumis, kukus, rebus, dan panggang
memberi hasil yang berbeda untuk bahan yang sama. Minyak yang meresap
dihitung dan ditampilkan terpisah.

**53 resep.** Dengan catatan bahan yang dihindari, penggantinya bisa diganti
dari dalam aplikasi.

**Latihan berurutan dengan 8 tingkat.** Pemanasan, latihan utama, pendinginan.
Item berikutnya tidak bisa dibuka sebelum item sebelumnya selesai. Progres
naik 3 minggu lalu turun 1 minggu, berulang.

**Pemantauan kondisi tubuh.** Tiap pagi isi tingkat energi dan jam tidur.
Kalau energi tiga hari berturut-turut rendah, intensitas latihan otomatis
diturunkan.

**Beruntun hari.** Dihitung dari catatan harian, bukan dari ada tidaknya
aplikasi yang dibuka.

**Grafik berat.** Domba, sarapan, dan makan malam dicatat, lalu ditampilkan
sebagai grafik.

**Catatan jurnal.** Tiap hari bisa menulis catatan bebas.

**Pengingat harian.** Notifikasi kalau latihan hari itu belum dikerjakan.

**Mode gelap dan terang.**

**Berjalan di HP maupun di laptop.** Satu kolom di layar kecil, sidebar di
layar lebar.

---

## Cara Memakai

### 1. Isi formulir

Nama, berat badan, berat target, tinggi, usia, jenis kelamin, tingkat
aktivitas, dan tujuan. Setelah itu, pilih bahan yang tidak mau dimakan
setiap hari.

Ada peringatan kalau berat target meleset lebih dari 20 kg — program itu
agresif, dan lebih baik dicicil.

### 2. Tiap pagi, isi kondisi tubuh

Butuh 30 detik: tingkat energi 1 sampai 5, jam tidur. Ini yang menentukan
latihan hari itu berat atau ringan.

### 3. Kerjakan latihan

Urut dan tidak bisa dilompati. Warm-up, lalu latihan utama, lalu cool-down.
Ada timer untuk gerakan berbasis waktu dan penghitung set untuk gerakan
berbasis repetisi.

### 4. Ikuti menu

Lima slot, porsi sudah dihitung. Kalau ada bahan yang ingin diganti, tekan
**Ganti** di baris bahannya.

Kartu makanan menampilkan jumlah calories, protein,
karbohidrat, lemak, serat, gula, natrium, dan lemak jenuh. Vitamin masih
dihitung per bahan, cuma tidak ditampilkan di kartu.

### 5. Catat berat dan progress

Tab **Progres** berisi grafik berat, titik 90 hari, dan catatan jurnal.

---

## Dari Mana Angka Gizinya

Semua angka gizi berasal dari **USDA FoodData Central**, diambil dari file CSV
resmi.

```
gizi hidangan = jumlah (gizi bahan x gram dipakai / 100) + minyak terserap
energi        = protein x 4 + karbo x 4 + lemak x 9 + serat x 2   (Atwater)
```

Energi **dihitung ulang** dari makronutrien, bukan diambil dari kolom calories
USDA. Alasannya USDA memakai faktor Atwater sendiri yang berbeda-beda, jadi
hasilnya sedikit berbeda. Itu bukan salah data, cuma beda metode.

Karbohidrat memakai yang **neto**: total karbohidrat dikurangi serat, supaya
serat tidak dihitung dua kali.

Rincian per bahan ada di [SUMBER.md](SUMBER.md).

### Metode masak

| Metode | Minyak yang meresap | Air tersisa |
|--------|--------------------|-------------|
| Direbus | 0% | 90% |
| Dikukus | 0% | 92% |
| Dipanggang | 3% protein, 1% karbo | 70% |
| Tumis | 4% protein, 1% karbo | 80% |
| Digoreng | 12% protein, 3% karbo | 60% |
| Direbus bumbu | 2% protein, 1% karbo | 130% |
| Tanpa dimasak | 0% | 100% |

---

## Cara Target Energi Dihitung

```
BMR   : Mifflin-St Jeor
TDEE  : BMR x aktivitas, dibatasi minimal 1,55
turun : TDEE x 0,80, tidak boleh di bawah BMR
jaga  : TDEE
naik  : TDEE x 1,12
```

| | Protein | Lemak | Karbohidrat | Serat |
|---|---|---|---|---|
| Turun | 2,0 g/kg | 28% energi, min 0,6 g/kg | sisanya | max(25 g, 14 g/1000 kkal) |
| Jaga | 1,6 g/kg | " | " | " |
| Naik | 1,8 g/kg | " | " | " |

Batas atas gula 10% energi, natrium 2000 mg.

Target dijaga dengan mengubah porsi bahan utama. Bumbu, minyak, dan rempah
tidak ikut dikecilkan supaya rasanya tidak berubah. Angka yang ditampilkan
selalu hasil hitungan ulang dari gram akhir, jadi kalau meleset, selisihnya
diterampilkan terbuka di kartu.

---

## Cara Memilih Menu

Menu tidak diacak sembarangan. Ada lima langkah supaya bisa varied tapi
tetap pas target:

```
1. Semua resep dihitung setelah porsinya disesuaikan
2. Yang memakai bahan terlarang dibuang
3. Sisanya disaring ke yang kalorinya dekat
4. Diurutkan supaya protein tidak terus mengulang
5. Dipilih bergiliran, jadi tiap resep tetap punya giliran
```

Hasilnya: 51 hidangan berbeda muncul dalam 90 hari, bukan lima menu yang
berputar.

---

## Latihan

```
Pemanasan  ->  Latihan Utama  ->  Pendinginan
```

Latihan **berurutan**. Item berikutnya terkunci sampai item sebelumnya selesai.
Ini disengaja, supaya program benar-benar dikerjakan dari awal sampai akhir.

**Tiga minggu naik, satu minggu turun.** Berulang tiap blok empat minggu.

| Blok | Minggu 1 | Minggu 2 | Minggu 3 | Minggu 4 |
|------|----------|----------|----------|----------|
| 1 | Tahap 1 | Tahap 2 | Tahap 3 | Turun |
| 2 | Tahap 3 | Tahap 4 | Tahap 5 | Turun |
| 3 | Tahap 5 | Tahap 6 | Tahap 7 | Turun |
| 4 | Tahap 7 | Tahap 8 | Turun lagi | |

Tiap tingkat punya set, repetisi, durasi kerja, dan istirahat sendiri, dan
dibatasi oleh usia dan tingkat aktivitas supaya program tidak berlebihan.

Pola mingguannya berbeda tiap tujuan, dengan satu hari pemulihan aktif.

---

## Setelah Hari ke-90

Program berakhir, tapi aplikasi tidak berhenti. Masuk **mode perawatan**:

- Kalori kembali ke kebutuhan harian
- Protein 1,6 g/kg
- Latihan tiga kali seminggu di Tahap 5, volumenya dikurangi
- Label hari berubah jadi "Perawatan 1", "Perawatan 2", dan seterusnya

Ada tombol **Ulangi 90 Hari dari Awal** kalau mau mulai dari nol. Berat dan
riwayat tetap tersimpan.

---

## Pengingat Harian

Ada ikon lonceng di baris atas. Nyalakan, pilih jamnya, dan tiap hari
mendapat notifikasi: kalau latihan hari itu belum selesai,\notifikasinya
bilang begitu.

Izin notifikasi diminta otomatis begitu formulir selesai diisi, karena
saat itu kamu sedang menekan tombol. Kalau tidak muncul, buka panel
lonceng dan tekan **Aktifkan** lagi.

### Batasnya, apa adanya

Notifikasi hanya muncul **selama tab ini terbuka di peramban**. Kalau tab
ditutup, tidak ada yang berjalan, jadi tidak ada notifikasi.

Ini tidak bisa diperbaiki di situs statis seperti GitHub Pages. Untuk menutup
celah itu dibutuhkan server pengirim, dan halaman web tidak punya server.

Yang bisa dilakukan: begitu tab dibuka lagi, notifikasi hari itu tetap
dikirim saat itu juga. Jadi tidak ada hari yang terlewat.

Kalau perambanmu memblokir notifikasi, panel lonceng menuliskan cara
mengaktifkannya kembali lewat pengaturan situs.

---

## Tampilan

| Lebar | Tampilan |
|-------|----------|
| < 620px | Satu kolom, tab di bawah |
| 620-899px | Kartu lebih rapat |
| >= 900px | Konten 1080px, tab pindah ke sisi kiri |

Ukuran teks punya enam tingkat, dengan lantai 12px supaya tetap terbaca di
layar kecil. Semua tombol minimal 40px, jadi nyaman ditekan dengan jari.

Bahasa yang dipakai di layar sehari-hari, bukan istilah teknis. Contohnya
"Beruntun" bukan "Streak", dan "Tahap 1" bukan "Level 1" — level ambigu,
apa maksudnya tingkatan program atau tingkat tenaga.

Tab **Hari Ini** menampilkan satu kartu besar yang berubah sendiri mengikuti
status, tiga angka utama, lalu sisanya dilipat. Peringatan keselamatan tidak
perlu dibuka dulu untuk dibaca.

---

## Isi Folder

| Berkas | Isi |
|--------|-----|
| `index.html` | Tampilan |
| `style.css` | Gaya |
| `nutrition.js` | Data gizi 97 bahan, metode masak, target energi |
| `recipes.js` | 53 resep |
| `notif.js` | Pengingat harian |
| `script.js` | Logika aplikasi |
| `SUMBER.md` | Sumber USDA per bahan |
| `cek.js` | Pemeriksaan integritas berkas |
| `uji.js` | Uji regresi |

Untuk deploy ke GitHub Pages: unggah berkas-berkas di atas ke repository,
lalu aktifkan Pages dari branch utama.

Tidak ada `npm install` untuk menjalankan aplikasinya. Chart berat dimuat
dari internet; kalau gagal dimuat, halaman tetap tampil normal.

---

## Yang Perlu Diketahui

### Data kamu ada di peramban

Berat, catatan, dan progres disimpan di peramban itu sendiri. Tidak dikirim
ke mana pun, tapi juga tidak cadangan.

Kalau data peramban dibersihkan, atau kamu ganti perangkat, atau memakai
mode penyamaran, **seluruh 90 hari progres hilang tanpa sisa**.

**Belum ada cara mengekspor atau mengimpor data.** Ini yang paling perlu
dilengkapi di kemudian hari.

### Angka gizi ada yang belum persis

Dari 97 bahan, **22 memakai padanan USDA** dan **1 belum bersumber sama
sekali** (`serai`,bernilai 0).

Semuanya punya alasan tertulis di [SUMBER.md](SUMBER.md). Bukan
kebohongan, tapi ini batasnya.

### Tidak ada gambar atau video gerakan

51 gerakan diberikan dalam bentuk teks instruksi. Untuk gerakan yang tidak
dipahami, kadang lebih sulit diceritakan daripada ditunjukkan.

### Tanpa akun, tanpa server

Tidak ada yang bisa bocor, tidak ada biaya bulanan, tidak ada yang harus
dijaga. Tapi juga tidak ada sinkronisasi antar perangkat.

---

## Lisensi

Bebas dipakai dan diubah.
