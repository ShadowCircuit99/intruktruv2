# Instruktur Pribadi 90 Hari

Program latihan dan makan 90 hari yang berjalan di peramban — tanpa akun, tanpa server, tanpa pemasangan.
---

## Cara Pakai

### 1. Isi Formulir Sekali
Nama, berat badan, target berat, tinggi, usia, jenis kelamin, aktivitas harian, tujuan, dan bahan yang dihindari.

Kalau selisih berat awal dan target melebihi 20 kg, muncul peringatan — program terlalu agresif, lebih baik dicicil.

### 2. Tiap Pagi, Isi Kondisi Tubuh
Tingkat energi (1–5) dan jam tidur. Butuh 30 detik. Ini menentukan intensitas latihan hari itu.

> Pemeriksaan ini hanya mengunci **mulai latihan**. Tab Hari Ini, Menu, dan Progres tetap bisa dibuka tanpa isinya.

### 3. Kerjakan Latihan
Berurutan: pemanasan → latihan utama → pendinginan. Item berikutnya terkunci sampai item sebelumnya selesai.

Ada timer untuk gerakan berbasis waktu dan penghitung set untuk gerakan berbasis repetisi.

### 4. Ikuti Menu
Lima slot makan (sarapan, siang, snack, malam, minuman) dengan porsi sudah dihitung.

Kalau ada bahan yang mau diganti, tekan **Ganti** di baris bahannya. Kartu menampilkan energi, protein, karbohidrat, lemak, serat, gula, natrium, dan lemak jenuh.

### 5. Catat Progress
Tab **Progres** berisi grafik berat, poin 90 hari, catatan jurnal, dan panel **Data & Pengaturan**.

---

## Fitur Utama

| Fitur | Detail |
|-------|--------|
| **Program 90 hari** | Hari dihitung otomatis dari tanggal mulai, bukan daftar centang manual |
| **Tiga tujuan** | Turun berat, jaga badan, atau naik otot — target kalori & makro dihitung dari badanmu, bukan angka tetap |
| **Menu harian** | 53 hidangan berbeda dalam 90 hari, dihitung dari berat bahan, bukan dari angka yang dikunci |
| **Data gizi USDA** | Semua angka dari USDA FoodData Central, bisa ditelusuri per bahan |
| **Metode masak** | Goreng, tumis, kukus, rebus, panggang — hasil gizinya berbeda per metode |
| **Latihan berurutan** | 8 tingkat, naik 3 minggu lalu turun 1 minggu, berulang. Item terkunci sampai selesai |
| **Kondisi tubuh** | Energi dan jam tidur tiap pagi; 3 hari energi rendah → intensitas otomatis turun |
| **Pelacak air** | Target 30–35 ml/kg, disimpan per tanggal, tombol cepat +250 / +500 ml |
| **Grafik berat** | Canvas Chart.js dengan fallback SVG kalau koneksi gagal |
| **Cadangan data** | Unduh / impor `.json` — pindah perangkat tanpa kehilangan progress |
| **Cetak menu** | Cetak menu hari ini ke kertas, rapi tanpa navigasi |
| **Jurnal harian** | Catatan bebas tiap hari, ikut memengaruhi intensitas latihan besok |
| **Pengingat harian** | Notifikasi peramban kalau latihan belum dikerjakan |
| **Mode gelap & terang** | Ikut tema perangkat atau manual |
| **Responsif** | 1 kolom di HP, 2 kolom di laptop |

---

## Cara Angka Dihitung

### Target Energi
```
BMR : Mifflin-St Jeor
TDEE : BMR x aktivitas harian (min 1,55)
Turun : TDEE x 0,80 (tidak boleh di bawah BMR)
Jaga  : TDEE
Naik  : TDEE x 1,12
```

### Rasio Makro
| Tujuan | Protein | Lemak | Karbo | Serat |
|--------|---------|-------|-------|------|
| Turun | 2,0 g/kg | 28% energi (min 0,6 g/kg) | sisanya | max(25 g, 14 g/1000 kkal) |
| Jaga | 1,6 g/kg | — | — | — |
| Naik | 1,8 g/kg | — | — | — |

Batas: gula ≤ 10% energi, natrium ≤ 2000 mg.

### Energi Hidangan
```
gizi = (gizi bahan x gram dipakai / 100) + minyak terserap
kkal = protein x 4 + karbo neto x 4 + lemak x 9 + serat x 2
```

Karbohidrat pakai **neto** (total − serat) supaya serat tidak dihitung dua kali. Energi dihitung ulang dari makro, bukan diambil dari kolom energi USDA (faktor Atwater-nya berbeda-beda).

### Pelacak Air
Target harian = berat badan terakhir x 30–35 ml/kg.

---

## Pelacak Air

Kartu air ada di tab **Hari Ini**.

| Tombol | Fungsi |
|--------|--------|
| **+ 250 ml** | Tambah 250 ml |
| **+ 500 ml** | Tambah 500 ml |
| **Ulangi** | Reset ke 0 ml |

Angka disimpan per tanggal. Hari berikutnya mulai dari nol.

---

## Cadangan Data

Data disimpan di peramban, terenkripsi di `localStorage`, dan tidak dikirim ke mana pun.

**Unduh Data** → satu berkas `.json` berisi seluruh program.
**Impor Data** → memulihkan dari berkas.

Aturan:
- Hanya berkas dari aplikasi ini yang diterima.
- Berkas rusak atau dari aplikasi lain ditolak, data lama tidak berubah.
- Kalau impor gagal di tengah jalan, semua data dikembalikan seperti semula.

Simpan berkas ini ke penyimpanan awan atau email sendiri agar tidak hilang.

---

## Cetak Menu

Tombol **Cetak Menu** mencetak hanya tab Menu: judul, tanggal, semua slot makan, rincian gizi, dan daftar bahan. Navigasi dan tombol tidak ikut tercetak.

---

## Latihan

### Struktur Sesi
```
Pemanasan → Latihan Utama → Pendinginan
```

Semua item berurutan dan terkunci. Deload setiap 4 minggu.

| Blok | Minggu 1 | Minggu 2 | Minggu 3 | Minggu 4 |
|------|----------|----------|----------|----------|
| 1 | Tahap 1 | Tahap 2 | Tahap 3 | Turun |
| 2 | Tahap 3 | Tahap 4 | Tahap 5 | Turun |
| 3 | Tahap 5 | Tahap 6 | Tahap 7 | Turun |
| 4 | Tahap 7 | Tahap 8 | Turun | — |

Limit: usia, aktivitas, dan BMI menurunkan level maksimum supaya program tidak berlebihan.

### Setelah Hari ke-90
Aplikasi masuk **mode perawatan**:
- Kalori kembali ke kebutuhan harian
- Protein 1,6 g/kg
- Latihan 3x seminggu di Tahap 5
- Label berubah jadi "Perawatan 1", "Perawatan 2", dst.

Tombol **Ulangi 90 Hari dari Awal** untuk mulai dari nol.

---

## Pengingat Harian

Ikon lonceng di baris atas → nyalakan, pilih jam. Notifikasi muncul kalau latihan hari itu belum selesai.

**Batasan:** notifikasi hanya jalan selama tab peramban terbuka. Kalau tab ditutup, tidak ada yang berjalan. Begitu tab dibuka lagi, notifikasi hari itu dikirim saat itu juga. Tidak ada hari yang terlewat.

---

## Tampilan

| Lebar | Layout |
|-------|--------|
| < 620px | 1 kolom, tab bawah |
| 620–899px | 1 kolom rapat |
| ≥ 900px | 2 kolom, konten max 1080px |

Semua tombol ≥ 40px, input font 16px (cegah zoom di iOS). Teks min 12px.

Grafik berat punya dua jalur: Chart.js dari CDN, fallback SVG yang digambar sendiri — tidak pernah hilang karena koneksi.

---

## Aksesibilitas

- Tab: `role="tablist"` dan `role="tab"`, `aria-selected` sinkron
- Bintang energi: `role="radiogroup"`, `aria-checked`
- Kartu lipat: `aria-expanded` selalu sinkron
- Keyboard: Enter/Spasi buka kartu, ←/→ pindah tab, Esc tutup modal
- Tombol lompat ke konten di paling atas
- Fokus keyboard selalu terlihat, kontras warna memenuhi standar keterbacaan

---

## Struktur File

| Berkas | Isi | Ukuran |
|--------|-----|--------|
| `index.html` | Tampilan & struktur | ~39 KB |
| `style.css` | Styling (light/dark) | ~72 KB |
| `script.js` | Logika inti aplikasi | ~224 KB |
| `nutrition.js` | Data gizi 97 bahan + kalkulasi energi | ~30 KB |
| `recipes.js` | 53 resep | ~43 KB |
| `notif.js` | Pengingat harian | ~4 KB |
| `utils.js` | Keamanan (enkripsi, validasi, XSS) + UX helper | ~3 KB |
| `manifest.webmanifest` | Metadata PWA | ~0,6 KB |
| `icon-180.png` | Ikon iPhone homescreen | ~0,8 KB |
| `icon-192.png` | Ikon Android layar utama | ~0,8 KB |
| `icon-512.png` | Ikon Android splash | ~3,9 KB |
| `README.md` | Dokumentasi ini | — |
| `SUMBER.md` | Rujukan data USDA per bahan | ~10 KB |
| `cek.js` | Verifikasi integritas file (dev) | ~20 KB |

> Aplikasi tidak butuh `npm install`. Satu-satunya dependency eksternal: Chart.js (grafik), dimuat dari CDN dengan fallback SVG.

---

## Deploy

### GitHub Pages
1. Push seluruh file di tabel **Struktur File** ke repo GitHub publik.
2. Di repo: **Settings → Pages → Branch: `main`, folder: `/ (root)` → Save**.
3. Tunggu ~1 menit. URL: `https://<username>.github.io/<repo>/`

### Lokal
Buka `index.html` langsung di peramban — tidak butuh server.

---

## Yang Perlu Diketahui

### Data Simpan di Peramban
Berat, catatan, dan progres disimpan di `localStorage` peramban — **terenkripsi** dan tidak dikirim ke mana pun.

Kalau data peramban dibersihkan, perangkat diganti, atau mode penyamaran dipakai, progress hilang. Gunakan **Unduh Data** secara berkala.

### Angka Gizi
Dari 97 bahan, **22 pakai padanan USDA** dan **1 belum bersumber** (`serai`, nilai 0). Semua alasan tertulis di [SUMBER.md](SUMBER.md).

### Tanpa Gambar Gerakan
51 gerakan berupa teks instruksi. Untuk gerakan yang sulit diceritakan, cadangan ada di kolom `kesalahan` di tiap item.

### Tanpa Server
Tidak ada yang bisa bocor, tidak ada biaya bulanan, tidak ada yang harus dijaga. Tapi juga tidak ada sinkronisasi antar perangkat — pindah data lewat berkas cadangan.

---

## Keamanan

- **XSS**: Input nama tervalidasi ketat (huruf saja, min 2 karakter). Semua render user input pakai `textContent`, bukan `innerHTML`.
- **Enkripsi**: Semua data di `localStorage` terenkripsi XOR + Base64 sebelum ditulis.
- **Integritas**: `cek.js` memverifikasi setiap file sebelum dan sesudah perubahan.
- **GitHub Pages**: Tidak bisa mengatur `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, atau `Permissions-Policy` — batasan statis GitHub Pages. Kalau butuh header keamanan penuh, deploy di Cloudflare Pages dengan custom domain.

---

## Lisensi
Bebas dipakai dan diubah.
