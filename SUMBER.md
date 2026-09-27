# Sumber Data Gizi

Angka gizi di `nutrition.js` **diambil otomatis dari USDA FoodData Central**.
Tidak ada angka yang diketik dari ingatan.

## Apa yang diunduh

Dari `https://fdc.nal.usda.gov/download-datasets.html`:

| File | Isi | Dipakai untuk |
|---|---|---|
| `FoodData_Central_sr_legacy_food_csv_2018-04.zip` | 7.793 produk | **93 dari 96 bahan** |
| `FoodData_Central_foundation_food_csv_2026-04-30.zip` | 11.776 produk | cadangan |
| `FoodData_Central_survey_food_csv_2024-10-31.zip` | 5.432 produk (FNDDS) | 2 bahan: susu kedelai, coklat panas |
| `FoodData_Central_branded_food_csv_2026-04-30.zip` | 1.999.950 produk | hanya dicek untuk serai |

Yang dibaca: `food.csv` (nama produk) dan `food_nutrient.csv` (angka per
nutrien). Kedua file itu yang jadi sumber tunggal semua angka.

## Nutrien yang diambil

| Kolom di kode | USDA nutrient id | Nama |
|---|---|---|
| `k` | 1008 | Energy |
| `p` | 1003 | Protein |
| `c` | 1005 − 1079 | Karbohidrat neto |
| `f` | 1004 | Total lipid |
| `fb` | 1079 | Fiber, total dietary |
| `sg` | 1063 | Sugars, total |
| `na` | 1093 | Sodium, Na (mg) |
| `sf` | 1258 | Fatty acids, total saturated |
| `ch` | 1253 | Cholesterol (mg) |

USDA mengukur **karbohidrat total** (termasuk serat). Aplikasi memakai
karbohidrat **neto**, jadi `c = 1005 − 1079`. Itu pengurangan dua angka
ber-sumber, bukan angka karangan. Serat tetap dihitung sebagai 2 kkal/g.

## Dua jebakan di dataset USDA

**1. Foundation Food tidak lengkap per produk.**
`chicken, thigh, meat and skin, raw` punya protein dan lemak tapi **tidak punya
energi**, dan karbositanya tercatat −0,2 (nilai negatif = tidak terukur). Kalau
dipakai apa adanya, susu kedelai keluar "0 kkal". Jadi tool menolak baris yang
tidak punya nutrien inti lengkap (energi + protein + lemak).

**2. FNDDS (Survey) memakai `nutrient_nbr`, bukan id FDC.**
Di `food_nutrient.csv` FNDDS, kolom `nutrient_id` berisi angka seperti
`208` (Energy), bukan `1008`. Tanpa dipetakan lewat `nutrient.csv`, semua
baris FNDDS terlihat "tidak lengkap" padahal isinya ada.


## Kenapa SR Legacy diutamakan

Foundation Food ternyata **tidak lengkap per produk**. Contoh nyata dari file
itu: `chicken, thigh, meat and skin, raw` punya protein dan lemak tapi
**tidak punya energi**, dan karbositanya tercatat −0,2 (nilai negatif, berarti
tidak terukur). Kalau baris seperti itu dipakai, susu kedelai bisa keluar
"0 kkal".

Jadi tool-nya menolak baris yang tidak punya nutrien inti lengkap (energi +
protein + lemak) dan pindah ke kandidat berikutnya.

## Cara mengaudit

`SUMBER_GIZI` di `nutrition.js` menyebut `ds` (dataset), `fdc` (nomor FDC),
dan `desc` (deskripsi resmi produknya) untuk tiap bahan. Buka
`https://fdc.nal.usda.gov/food-details/`<nomor FDC>` untuk melihat baris
aslinya.

Di browser:

```js
console.table(NUTRISI.NUTRIENTS);   // angka sekarang
console.table(SUMBER_GIZI);         // asal tiap angka
```

## Yang TIDAK bersumber: 1 bahan

`serai`. Dicari di keempat dataset USDA:

| Dataset | Hasil |
|---|---|
| SR Legacy 2018-04 | 0 hasil |
| Foundation Food 2026-04-30 | 0 hasil |
| Survey / FNDDS 2024-10-31 | 0 hasil |
| Branded 2026-04-30 | 664 dari 1.999.950 produk mengandung kata "lemongrass", tapi semuanya produk kemasan (SODA LEMONGRASS, LEMONGRASS CHICKEN STIR FRY) |

Untuk dua yang paling mendekati, `LEMON GRASS LEAVES ORGANIC SPICES`
(fdc 1127003) dan `BEVERAGE, LEMONGRASS` (fdc 1111260), baris nutriennya
dicek di seluruh 26.027.437 baris `food_nutrient.csv`: **20 baris ditemukan,
nol yang memuat 9 nutrien inti**. Jadi masalahnya bukan tidak adanya produk,
melainkan data gizinya memang tidak diisi.

Angka `serai` **0 dan diberi tanda `BELUM BERSUMBER`**. Nol itu bukan nilai
sebenarnya dan tidak boleh dipakai sebagai acuan.

Untuk menutupnya, sumber yang tepat adalah **Tabel Komposisi pangan Kemenkes**
atau **ASEAN Food Composition Database** — keduanya mencakup bahan tropis.
USDA adalah database pasar Amerika, jadi bahan yang tidak lazim di sana cenderung
kosong isinya.

## Tiga pemetaan yang sempat salah jenis, sudah diperbaiki

Tiga pemetaan sempat tertaut ke produk USDA yang salah jenis. Semuanya
ketahuan karena angkanya janggal untuk bahan segar, lalu dicek ulang
langsung ke file CSV-nya:

| Bahan | Semula tertaut ke | k | Seharusnya | k |
|---|---|---|---|---|
| `edamame` | Soybeans, mature seeds, **raw** (kacang kering) | 446 | edamame, frozen, prepared (168411) | 121 |
| `lontong` | Rice cake, **cracker** (kering) | 392 | Rice, white, long-grain, cooked (168878) | 130 |
| `kunyit` | Spices, turmeric, ground | 312 | tetap (tidak ada kunyit segar di USDA) | 312 |

`edamame` paling parah: kelebihan **3,7 kali**, jadi setiap hidangan yang
memakainya kegedean caloric-nya. `lontong` kelebihan 2,4 kali. Keduanya
sudah diganti dan sekarang terverifikasi cocok baris demi baris.


## Dua bahan yang duluan kosong, sekarang dapat FNDDS

| Bahan | Sumber | Nilai |
|---|---|---|
| `susu_kedelai` | fdc 2705405, *Soy milk, unsweetened* | 38 kkal, P 3,6, L 2,1, K 1,3 |
| `coklat_hot` | fdc 2705473, *Hot chocolate / cocoa, made with whole or reduced fat (2%) milk* | 91 kkal, P 2,7, L 1,5, K 16,5 |

Keduanya bukan padanan lagi, tapi baris USDA yang memang cocok.


## Yang memakai padanan USDA: 21 bahan

Bahan ini tidak ada di USDA, jadi dipakai bahan USDA lain sebagai pembanding.
Alasannya ditulis di baris yang sama, dan UI menandai hidangan yang memakainya.

| Bahan aplikasi | Dipakai dari USDA | Kenapa |
|---|---|---|
| `ketupat` | Rice, white, long-grain, enriched, cooked | Bahannya sama dengan nasi putih matang |
| `lontong` | Rice, white, long-grain, cooked | USDA hanya punya rice cake **kering** (380–392 kkal), sedangkan lontong direbus. Dipakai nasi putih matang supaya besarannya tidak jauh meleset; deviasi nyata masih sekitar 25%. |
| `roti_tahu` | Bread, white, commercial | Isi tahu tidak ada; nilai calories sebenarnya lebih tinggi |
| `mie_instan` | Noodles, chinese, chow mein | Padanan dekat (lihat catatan di bawah) |
| `daging_kambing` | Lamb, ground | USDA tak punya daging kambing |
| `ikan_tongkol` | Fish, mackerel, Atlantic | Ikan oily terdekat |
| `ikan_kembung` | Fish, anchovy, european | Ikan kecil oily terdekat |
| `bakso` | Luncheon sausage, pork and beef | Komposisi terdekat |
| `tempe_mendoan` | Tempeh, cooked | Tempe goreng |
| `kangkung` | Cabbage, chinese (pak-choi) | USDA tak punya water spinach |
| `kacang_panjang` | Beans, snap, green | USDA tak punya yardlong bean |
| `labu_kuning` | Squash, winter, butternut | Squash Asia terdekat |
| `kunyit` | Spices, turmeric, ground | USDA tak punya kunyit segar |
| `ketumbar_bubuk` | Spices, cumin seed | Biji, bukan bubuk |
| `merica_bubuk` | Spices, pepper, black | Biji, bukan bubuk |
| `kecap_manis` | Sauce, hoisin | Saus kecap manis terdekat |
| `minyak_sawit` | Oil, palm | USDA cuma punya palm kernel oil |
| `santan_kental` | Nuts, coconut milk, canned | Santan kaleng |
| `salak` | Jackfruit, raw | USDA tak punya salak |
| `kerupuk` | Crackers, saltines | USDA tak punya kerupuk |
| `kerupuk_udang` | Crackers, flavored, fish-shaped | Cracker bentuk ikan |

### Catatan `mie_instan`

Padanannya `Noodles, chinese, chow mein` (471 kkal/100 g) ternyata **cukup
dekat** untuk mie instan kering, yang sebenarnya sekitar 430–470 kkal/100 g.
Jadi padanan ini layak dipakai, meski bukan produk yang sama.

Dicek juga di FNDDS: yang ada cuma "Ramen bowl" (112–137 kkal/100 g), yaitu
sudah dimasak dengan air dan bumbu — bukan mie kering. Memakainya akan
menyimpang sekitar 300 kkal, jadi tidak dipakai.

## Alat di folder `fdc/`

| File | Guna |
|---|---|
| `csv.js` | Parser CSV tanpa dependency |
| `map.js` | Pemetaan id aplikasi → deskripsi USDA + alasan padanan |
| `meta.js` | Nama Indonesia + konversi satuan (`per`, `dens`) |
| `ambil.js` | Ambil angka USDA, tolak baris tidak lengkap, tulis `sumber.json` |
| `gen.js` | Susun blok `NUTRIENTS` dari `sumber.json` + `meta.js` |
| `gen_sumber.js` | Susun blok `SUMBER_GIZI` |
| `fix.js` | Pasang ulang blok ke `nutrition.js` |
| `saran.js` | Cari kandidat USDA untuk bahan yang belum ketemu |
| `verif.js` | Bandingkan `nutrition.js` vs `sumber.json` |
| `search.js`, `probe*.js`, `cari2.js` | Pencarian deskripsi di dalam dataset |

Alur memperbarui:

```bash
node fdc/ambil.js        # ambil angka dari file USDA
node fdc/gen.js          # susun blok NUTRIENTS
node fdc/gen_sumber.js   # susun blok SUMBER_GIZI
node fdc/fix.js          # pasang ke ../nutrition.js
node fdc/verif.js        # pastikan cocok dengan sumber
```

## Catatan soal angka energi

Kolom `k` di `nutrition.js` adalah **nilai USDA apa adanya**, dipakai hanya
sebagai pembanding. Aplikasi **tidak** memakainya: energi selalu dihitung ulang
dari makronutrien dengan faktor Atwater (`p×4 + c×4 + f×9 + fb×2`).

Alasannya, USDA memakai faktor Atwater sendiri yang berbeda-beda. 59 dari 96
bahan punya selisih lebih dari 3% antara `k` USDA dan hasil 4/4/9. Yang
terbesar pada kacang tanah (USDA 587 kkal, 4/4/9 menghasilkan 443). Itu bukan
salah data, cuma beda metode. Karena itu energi dihitung dari makronutrien,
bukan diambil dari kolom calories.
