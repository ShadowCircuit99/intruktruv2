/* ================================================================
   genikon.js -- generator ikon PNG anti-alias.  node genikon.js

   Ikon lama cuma 833 byte: garis kotak tanpa perataan subpiksel,
   jadi tepinya bergerigi di layar densitas tinggi. Skrip ini
   menggambar ulang ikon dumbbell pada faktor supersample 4x lalu
   diratakan ke ukuran akhir, sehingga tepi halus tanpa library
   gambar apa pun (PNG ditulis manual lewat zlib bawaan Node).

   Dipakai sekali saat mendesain ikon; hasilnya (icon-*.png) yang
   ikut ter-push, bukan skripnya. Kalau desain berubah, jalankan
   lagi lalu commit ketiga PNG-nya.
   ================================================================ */

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SS = 4; // faktor supersample

/* ---- Penulis PNG manual ---- */
const CRC_TABEL = (function () {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABEL[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function blok(tipe, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const isi = Buffer.concat([Buffer.from(tipe, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(isi), 0);
  return Buffer.concat([len, isi, crc]);
}

function tulisPNG(file, w, h, rgba) {
  const scan = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    scan[y * (w * 4 + 1)] = 0; // filter: None
    rgba.copy(scan, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    blok('IHDR', ihdr),
    blok('IDAT', zlib.deflateSync(scan, { level: 9 })),
    blok('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(path.join(ROOT, file), png);
  console.log('  tulis ' + file + '  ' + w + 'x' + h + '  ' + png.length + ' byte');
}

/* ---- Bentuk ---- */
// Kotak bersudut membulat, koordinat piksel.
function dalamRoundRect(px, py, x, y, w, h, r) {
  if (px < x || px > x + w || py < y || py > y + h) return false;
  const rx = Math.min(r, w / 2);
  const ry = Math.min(r, h / 2);
  const cx = px < x + rx ? x + rx : px > x + w - rx ? x + w - rx : px;
  const cy = py < y + ry ? y + ry : py > y + h - ry ? y + h - ry : py;
  const dx = px - cx;
  const dy = py - cy;
  return dx * dx + dy * dy <= rx * ry;
}

/* Desain: latar hijau tema penuh (aman untuk maskable), glyph
   dumbbell putih di zona aman 80%. Semua pecahan ukuran, jadi
   satu desain untuk 180/192/512. */
const HIJAU = [0x0f, 0x7a, 0x44];
const PUTIH = [255, 255, 255];

function warnaGlyph(nx, ny) {
  // nx, ny dalam 0..1 terhadap sisi ikon. Zona aman maskable:
  // lingkaran diameter 80% -- semua bentuk dijaga di 0.15..0.85.
  const pecahan = [
    // pelat luar kiri, pelat dalam kiri, gagang, pelat dalam kanan, pelat luar kanan
    [0.20, 0.33, 0.075, 0.34, 0.032],
    [0.30, 0.395, 0.05, 0.21, 0.026],
    [0.35, 0.46, 0.30, 0.08, 0.038],
    [0.65, 0.395, 0.05, 0.21, 0.026],
    [0.725, 0.33, 0.075, 0.34, 0.032],
  ];
  for (let i = 0; i < pecahan.length; i++) {
    const p = pecahan[i];
    if (dalamRoundRect(nx, ny, p[0], p[1], p[2], p[3], p[4])) return PUTIH;
  }
  return null;
}

function render(file, size) {
  const W = size * SS;
  const buf = Buffer.alloc(W * W * 4);
  for (let y = 0; y < W; y++) {
    for (let x = 0; x < W; x++) {
      const nx = (x + 0.5) / W;
      const ny = (y + 0.5) / W;
      const g = warnaGlyph(nx, ny);
      const c = g || HIJAU;
      const o = (y * W + x) * 4;
      buf[o] = c[0];
      buf[o + 1] = c[1];
      buf[o + 2] = c[2];
      buf[o + 3] = 255;
    }
  }
  // Ratakan SS x SS -> size x size (box filter)
  const out = Buffer.alloc(size * size * 4);
  const n = SS * SS;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const o = ((y * SS + sy) * W + (x * SS + sx)) * 4;
          r += buf[o]; g += buf[o + 1]; b += buf[o + 2]; a += buf[o + 3];
        }
      }
      const o2 = (y * size + x) * 4;
      out[o2] = Math.round(r / n);
      out[o2 + 1] = Math.round(g / n);
      out[o2 + 2] = Math.round(b / n);
      out[o2 + 3] = Math.round(a / n);
    }
  }
  tulisPNG(file, size, size, out);
}

console.log('Generate ikon supersample ' + SS + 'x:');
render('icon-512.png', 512);
render('icon-192.png', 192);
render('icon-180.png', 180);