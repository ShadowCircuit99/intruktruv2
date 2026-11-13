/* ================================================================
   ilustrasi.js -- ilustrasi gerakan latihan, SVG buatan sendiri.
   Kanvas 120x120, lantai di y=96, sosok stick-figure tetap.
   Semua goresan memakai currentColor (ikut tema gelap/terang).

   Sistem: setiap pose dibangun dari KERANGKA SENDI. Posisi sendi
   (pinggul, lutut, tumit, bahu, siku, tangan, leher, kepala) dihitung
   dengan trigonometri supaya gerakan benar-benar mengikuti teks latihan.
   ================================================================ */

(function (root) {
  'use strict';

  var FLOOR = 96;
  var STROKE = 3.4;
  var D2R = Math.PI / 180;

  function r(n) { return Math.round(n * 100) / 100; }

  // Easing cubic untuk gerakan lebih alami (mulai cepat, berhenti mulus)
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInCubic(t) { return t * t * t; }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Warna garis eksplisit: SVG yang disuntikkan lewat innerHTML tidak mewarisi
  // currentColor, jadi tanpa ini seluruh goresan tidak terlihat.
  var TINTA = 'currentColor';

  function linha(x1, y1, x2, y2, w) {
    return '<line x1="' + r(x1) + '" y1="' + r(y1) +
      '" x2="' + r(x2) + '" y2="' + r(y2) +
      '" stroke="' + TINTA + '" stroke-width="' + (w || STROKE) +
      '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function retangulo(pts, w) {
    var d = 'M' + r(pts[0][0]) + ' ' + r(pts[0][1]);
    for (var i = 1; i < pts.length; i++) d += 'L' + r(pts[i][0]) + ' ' + r(pts[i][1]);
    return '<path d="' + d + '" fill="none" stroke="' + TINTA +
      '" stroke-width="' + (w || STROKE) +
      '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  function bola(x, y, rad, isi) {
    if (isi) {
      return '<circle cx="' + r(x) + '" cy="' + r(y) +
        '" r="' + rad + '" fill="' + TINTA + '" stroke="none"/>';
    }
    return '<circle cx="' + r(x) + '" cy="' + r(y) +
      '" r="' + rad + '" fill="none" stroke="' + TINTA + '" stroke-width="1.6"/>';
  }

  function lantai(y) {
    return '<line class="il-floor" x1="6" y1="' + (y || FLOOR) +
      '" x2="114" y2="' + (y || FLOOR) + '" stroke="' + TINTA +
      '" stroke-width="1.6" stroke-dasharray="5 5"/>';
  }

  /* Properti penunjang (dinding, kursi, bangku/meja).
     Digambar dengan garis putus-putus tipis supaya jelas ini bukan badan,
     hanya acuan tempat menumpu. Semua tetap stroke="currentColor". */
  var PROP_W = 1.8;

  function garisPutus(x1, y1, x2, y2) {
    return '<line class="il-prop" x1="' + r(x1) + '" y1="' + r(y1) +
      '" x2="' + r(x2) + '" y2="' + r(y2) + '" stroke="' + TINTA +
      '" stroke-width="' + PROP_W + '" stroke-dasharray="6 4"/>';
  }

  // Dinding vertikal. sisi 'kiri' = dinding di kiri tubuh (menempel punggung
  // saat menghadap kanan), 'kanan' = dinding di kanan (dipijak/didorong tangan).
  function dinding(sisi, x) {
    if (x === undefined) x = sisi === 'kiri' ? 14 : 106;
    var atas = 12, bawah = FLOOR + 4;
    // peneduh dinding di luar garis, supaya terbaca sebagai bidang
    return '<rect class="il-prop" x="' + r(sisi === 'kiri' ? 4 : x) + '" y="' + atas +
      '" width="' + r(sisi === 'kiri' ? x - 4 : 112 - x) + '" height="' + (bawah - atas) +
      '" fill="' + TINTA + '" fill-opacity="0.06" stroke="none"/>' +
      linha(x, atas, x, bawah, PROP_W) +
      '<line class="il-prop" x1="' + r(x - 5) + '" y1="' + atas + '" x2="' + r(x + 5) + '" y2="' + atas +
      '" stroke="' + TINTA + '" stroke-width="' + PROP_W + '"/>';
  }

  /* Kursi: dudukan persegi + dua kaki + sandaran (opsional).
     x1..x2 = rentang dudukan, seatY = tinggi permukaan duduk. */
  function kursi(x1, x2, seatY, opts) {
    opts = opts || {};
    var tebal = 3;
    var out = '';
    if (opts.sandaran) {
      // sandaran di sisi kiri (menghadap kanan)
      out += linha(x1 - 1, seatY - 24, x1 - 1, seatY - tebal, PROP_W * 1.2) +
        linha(x1 - 1, seatY - 24, x1 + 6, seatY - 24, PROP_W * 1.2);
    }
    // dudukan (tebal)
    out += '<rect class="il-prop" x="' + r(x1) + '" y="' + r(seatY - tebal) +
      '" width="' + r(x2 - x1) + '" height="' + tebal +
      '" fill="' + TINTA + '" fill-opacity="0.12" stroke="' + TINTA +
      '" stroke-width="' + PROP_W + '" stroke-linejoin="round"/>';
    // kaki kursi ke lantai
    out += garisPutus(x1 + 2, seatY, x1 + 2, FLOOR) +
      garisPutus(x2 - 2, seatY, x2 - 2, FLOOR);
    return out;
  }

  // Bangku rendah (hip thrust): blok padat setinggi seatY.
  function bangkuRendah(x1, x2, seatY) {
    return '<rect class="il-prop" x="' + r(x1) + '" y="' + r(seatY) +
      '" width="' + r(x2 - x1) + '" height="' + r(FLOOR - seatY) +
      '" fill="' + TINTA + '" fill-opacity="0.08" stroke="' + TINTA +
      '" stroke-width="' + PROP_W + '" stroke-dasharray="6 4" stroke-linejoin="round"/>';
  }

  // Meja / permukaan miring setinggi pinggul (incline push up).
  function meja(x1, x2, topY) {
    return '<rect class="il-prop" x="' + r(x1) + '" y="' + r(topY) +
      '" width="' + r(x2 - x1) + '" height="4" fill="' + TINTA +
      '" fill-opacity="0.14" stroke="' + TINTA + '" stroke-width="' + PROP_W +
      '" stroke-linejoin="round"/>' +
      garisPutus(x1 + 1, topY + 4, x1 + 1, FLOOR) +
      garisPutus(x2 - 1, topY + 4, x2 - 1, FLOOR);
  }

  // Undakan / bangku untuk step up: platform persegi setinggi topY.
  function undakan(x1, x2, topY) {
    return '<rect class="il-prop" x="' + r(x1) + '" y="' + r(topY) +
      '" width="' + r(x2 - x1) + '" height="' + r(FLOOR - topY) +
      '" fill="' + TINTA + '" fill-opacity="0.08" stroke="' + TINTA +
      '" stroke-width="' + PROP_W + '" stroke-linejoin="round"/>';
  }

  function panah(x1, y1, x2, y2) {
    return '<path class="il-arrow" d="M' + r(x1) + ' ' + r(y1) +
      'L' + r(x2) + ' ' + r(y2) + '" stroke="' + TINTA +
      '" fill="none" stroke-width="1.2" marker-end="url(#il-arrowhead)"/>';
  }

  function defsMarker(uid) {
    return '<marker id="' + uid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker>';
  }

  function svgBungkus(isi, label, uid) {
    return '<svg class="il-svg" viewBox="0 0 120 120" role="img" aria-label="' + label +
      '" preserveAspectRatio="xMidYMid meet">' +
      '<defs>' + defsMarker(uid) + '</defs>' +
      isi + '</svg>';
  }

  function pose(isi) {
    if (!isi) return '';
    return '<g class="il-g">' + isi + '</g>';
  }

  /* ================================================================
     KERANGKA SENDI
     ================================================================

     Ukuran segmen (proporsional, kanvas 120):
       leher-ke-pinggul : 34
       pinggul-ke-lutut : 24
       lutut-ke-tumit   : 24
       bahu-ke-siku     : 18
       siku-ke-tangan   : 18
       kepala radius    : 6.5

     Sudut dalam DERAJAT, 0 = menghadap ke kanan (+x), 90 = ke bawah (+y),
     -90 = ke atas. Ini supaya mudah membayangkan arah anggota tubuh.

     Kerangka:
       { kepala:[x,y], leher:[x,y], pinggul:[x,y],
         sikuKiri:[x,y], tanganKiri:[x,y],
         sikuKanan:[x,y], tanganKanan:[x,y],
         lututKiri:[x,y], tumitKiri:[x,y],
         lututKanan:[x,y], tumitKanan:[x,y] }
     ================================================================ */

  function titik(x, y) { return [x, y]; }
  function geser(p, dx, dy) { return [p[0] + dx, p[1] + dy]; }

  // Titik ujung dari pivot, panjang, sudut (derajat).
  function ujung(pivot, panjang, sudut) {
    var rad = sudut * D2R;
    return [pivot[0] + panjang * Math.cos(rad), pivot[1] + panjang * Math.sin(rad)];
  }

  // Titik tengah antar dua titik.
  function tengah(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }

  // Interpolasi linear antara dua pose-koordinat.
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpPt(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; }

  /* Gambar kerangka menjadi konten SVG (tanpa bungkus <g>).
     opts: { lantai:true, bayangan:true, panah:[{...}] } */
  function isiKerangka(k, opts) {
    opts = opts || {};
    var out = [];

    // bayangan di lantai (ringan, opsional)
    if (opts.bayangan) {
      var xMin = 999, xMax = -999;
      [k.tumitKiri, k.tumitKanan, k.tanganKiri, k.tanganKanan, k.pinggul].forEach(function (p) {
        if (p) { xMin = Math.min(xMin, p[0]); xMax = Math.max(xMax, p[0]); }
      });
      out.push('<line class="il-floor" x1="' + r(xMin - 3) + '" y1="' + FLOOR +
        '" x2="' + r(xMax + 3) + '" y2="' + FLOOR + '" stroke="' + TINTA + '" stroke-width="2" opacity="0.25"/>');
    }

    // tulang belakang (leher -> pinggul); lewat tengah kalau ada lengkungan
    if (k.tengahPunggung) {
      out.push(retangulo([k.leher, k.tengahPunggung], STROKE));
      out.push(retangulo([k.tengahPunggung, k.pinggul], STROKE));
    } else {
      out.push(retangulo([k.leher, k.pinggul], STROKE));
    }

    // kepala
    if (k.kepala) {
      out.push(bola(k.kepala[0], k.kepala[1], 6.5));
    }
    // leher pendek (kepala -> leher) supaya kepala tidak mengambang
    if (k.kepala && k.leher) {
      var arahLeher = Math.atan2(k.leher[1] - k.kepala[1], k.leher[0] - k.kepala[0]);
      var pLeher = [k.kepala[0] + 6.5 * Math.cos(arahLeher), k.kepala[1] + 6.5 * Math.sin(arahLeher)];
      out.push(retangulo([pLeher, k.leher], STROKE));
    }

    // lengan kiri (sisi belakang, lebih redup)
    if (k.sikuKiri && k.tanganKiri) {
      out.push(retangulo([k.bahuKiri || k.leher, k.sikuKiri, k.tanganKiri], STROKE - 0.8));
    }
    // lengan kanan (sisi depan, tebal penuh)
    if (k.sikuKanan && k.tanganKanan) {
      out.push(retangulo([k.bahuKanan || k.leher, k.sikuKanan, k.tanganKanan], STROKE));
    }

    // kaki kiri (belakang, redup)
    if (k.lututKiri && k.tumitKiri) {
      out.push(retangulo([k.pinggul, k.lututKiri, k.tumitKiri], STROKE - 0.8));
    }
    // kaki kanan (depan)
    if (k.lututKanan && k.tumitKanan) {
      out.push(retangulo([k.pinggul, k.lututKanan, k.tumitKanan], STROKE));
    }

    // panah opsional
    if (opts.panah) {
      opts.panah.forEach(function (p) { out.push(panah(p[0], p[1], p[2], p[3])); });
    }

    // lantai
    if (opts.lantai !== false) out.push(lantai(opts.lantaiY));

    return out.join('');
  }

  function gambarKerangka(k, opts) { return pose(isiKerangka(k, opts)); }

  /* ================================================================
     KERANGKA DASAR BERDIRI
     ================================================================ */

  // Berdiri tegak, menghadap kanan. Pinggul di (px, py).
  function kerangkaBerdiri(px, py) {
    px = px || 60; py = py || 62;
    var leher = [px, py - 34];
    return {
      pinggul: [px, py],
      leher: leher,
      kepala: [px + 1, leher[1] - 9],
      bahuKiri: [px - 1, leher[1] + 2],
      bahuKanan: [px + 1, leher[1] + 2],
      sikuKiri: [px - 7, leher[1] + 18],
      tanganKiri: [px - 8, leher[1] + 34],
      sikuKanan: [px + 8, leher[1] + 18],
      tanganKanan: [px + 9, leher[1] + 34],
      lututKiri: [px - 5, py + 24],
      tumitKiri: [px - 6, FLOOR],
      lututKanan: [px + 5, py + 24],
      tumitKanan: [px + 6, FLOOR]
    };
  }

  // Berdiri dengan kaki melebar (jumping jack awal)
  function kerangkaBerdiriLebar(px, py, lebar) {
    px = px || 60; py = py || 62;
    var kaki = lebar || 10;
    var k = kerangkaBerdiri(px, py);
    k.lututKiri = [px - kaki * 0.6, py + 24];
    k.tumitKiri = [px - kaki, FLOOR];
    k.lututKanan = [px + kaki * 0.6, py + 24];
    k.tumitKanan = [px + kaki, FLOOR];
    return k;
  }

  /* ================================================================
     POSE DUDUK
     ================================================================ */

  // Duduk di lantai (untuk pernapasan, peregangan duduk, dips).
  // pinggul di (px, py), kaki ditekuk ke depan.
  function kerangkaDuduk(px, py, opts) {
    opts = opts || {};
    px = px || 60; py = py || 74;
    var condong = opts.condong || 0; // 0 = tegak, positif = bungkuk depan
    var leher = [px + Math.sin(condong * D2R) * -34 * 0, py - 34];
    leher = [px + condong * 0.4, py - 34 + condong * 0.2];
    var k = {
      pinggul: [px, py],
      leher: leher,
      kepala: [leher[0] + 1, leher[1] - 9],
      bahuKiri: [leher[0] - 1, leher[1] + 2],
      bahuKanan: [leher[0] + 1, leher[1] + 2],
      sikuKiri: [leher[0] - 6, leher[1] + 16],
      tanganKiri: [leher[0] - 4, leher[1] + 30],
      sikuKanan: [leher[0] + 6, leher[1] + 16],
      tanganKanan: [leher[0] + 8, leher[1] + 30],
      lututKiri: [px + 14, py + 2],
      tumitKiri: [px + 16, FLOOR],
      lututKanan: [px + 16, py + 2],
      tumitKanan: [px + 18, FLOOR]
    };
    if (opts.lenganNaik) {
      k.sikuKiri = [leher[0] - 8, leher[1] - 4];
      k.tanganKiri = [leher[0] - 10, leher[1] - 20];
      k.sikuKanan = [leher[0] + 8, leher[1] - 4];
      k.tanganKanan = [leher[0] + 10, leher[1] - 20];
    }
    if (opts.kakiLurus) {
      // kaki lurus ke depan (peregangan hamstring)
      k.lututKiri = [px + 18, py + 6];
      k.tumitKiri = [px + 34, FLOOR];
      k.lututKanan = [px + 20, py + 6];
      k.tumitKanan = [px + 36, FLOOR];
    }
    return k;
  }

  /* ================================================================
     POSE WALL SIT
     Punggung menempel dinding, pinggul turun sampai lutut ~90 derajat.
     ================================================================ */

  var DINDING = 26; // x dinding (di kiri tubuh yang menghadap kanan)

  function kerangkaWallSit(t) {
    t = t || 0;
    var tEased = easeOutCubic(t);
    var hipY = lerp(62, 72, tEased);
    // punggung rapat dinding: leher & pinggul sama-sama di x dinding + tebal
    var leherX = DINDING + 9;
    var leherY = hipY - 34;
    var lututX = leherX + 26 * tEased + 8 * (1 - tEased);
    var lututY = lerp(FLOOR - 10, hipY + 2, tEased);
    return {
      pinggul: [leherX, hipY],
      leher: [leherX, leherY],
      kepala: [leherX, leherY - 9],
      bahuKiri: [leherX - 1, leherY + 2],
      bahuKanan: [leherX + 1, leherY + 2],
      sikuKiri: [leherX + 6, leherY + 16],
      tanganKiri: [leherX + 16, leherY + 20],
      sikuKanan: [leherX + 8, leherY + 18],
      tanganKanan: [leherX + 18, leherY + 22],
      lututKiri: [lututX - 2, lututY],
      tumitKiri: [lututX + 2, FLOOR],
      lututKanan: [lututX + 2, lututY],
      tumitKanan: [lututX + 6, FLOOR]
    };
  }

  function wallSit(t) {
    return gambarKerangka(kerangkaWallSit(t)) + dinding('kiri', DINDING);
  }

  /* ================================================================
     POSE JONGKOK / SQUAT
     dalam: 0 = berdiri, 1 = paha sejajar lantai
     ================================================================ */

  function kerangkaJongkok(px, t) {
    px = px || 60;
    t = t || 0;
    // Gunakan easing cubic out untuk gerakan alami: turun cepat, berhenti mulus di bawah
    var tEased = easeOutCubic(t);
    // Pelvis turun dan sedikit mundur
    var hipY = lerp(62, 78, tEased);
    var hipX = px - 8 * tEased;
    // Lututmaju seiring turunnya pelvis
    var lututX = px + 10 * tEased;
    var lututY = lerp(86, 78, tEased);
    // Leher mengikuti pivot pinggul
    var leherY = hipY - 34;
    var leherX = hipX + 7 * tEased;
    // Tangan ke depan saat turun, kembali saat bangun
    var tanganOffset = 3 * (1 - tEased);
    return {
      pinggul: [hipX, hipY],
      leher: [leherX, leherY],
      kepala: [leherX + 1, leherY - 9],
      bahuKiri: [leherX - 1, leherY + 2],
      bahuKanan: [leherX + 1, leherY + 2],
      sikuKiri: [leherX + 6, leherY + 18 - tanganOffset],
      tanganKiri: [leherX + 16, leherY + 22 - tanganOffset * 1.5],
      sikuKanan: [leherX + 7, leherY + 18],
      tanganKanan: [leherX + 17, leherY + 22 - tanganOffset * 1.5],
      lututKiri: [lututX - 2, lututY],
      tumitKiri: [lututX + 4, FLOOR],
      lututKanan: [lututX + 2, lututY],
      tumitKanan: [lututX + 8, FLOOR]
    };
  }

  /* ================================================================
     POSE LUNGE / SPLIT SQUAT
     arah: 1 = kaki kanan di depan, -1 = kaki kiri di depan
     t: 0 = berdiri, 1 = lunge penuh
     ================================================================ */

  function kerangkaLunge(arah, t) {
    arah = arah || 1;
    t = t || 0;
    var px = 58;
    var hipY = lerp(60, 74, t);       // pinggul turun
    var kakiDepanX = px + 20 * arah;   // kaki depan menjauh
    var kakiBelakangX = px - 22 * arah; // kaki belakang menjauh
    // lutut depan menekuk ke depan, tumit di lantai
    var lututDepanY = lerp(84, 74, t);
    var tumitDepanY = FLOOR;
    // lutut belakang turun ke lantai (mendekati lantai saat t=1)
    var lututBelakangY = lerp(84, 90, t);
    var tumitBelakangY = lerp(FLOOR, 88, t); // tumit belakang terangkat
    var leherY = hipY - 34;
    var leherX = px + 2 * t * arah;
    var depan = {
      lutut: [kakiDepanX - 6 * arah, lututDepanY],
      tumit: [kakiDepanX + 2 * arah, tumitDepanY]
    };
    var belakang = {
      lutut: [kakiBelakangX + 6 * arah, lututBelakangY],
      tumit: [kakiBelakangX - 2 * arah, tumitBelakangY]
    };
    return {
      pinggul: [px, hipY],
      leher: [leherX, leherY],
      kepala: [leherX + 1, leherY - 9],
      bahuKiri: [leherX - 1, leherY + 2],
      bahuKanan: [leherX + 1, leherY + 2],
      sikuKiri: [leherX - 6, leherY + 18],
      tanganKiri: [leherX - 8, leherY + 34],
      sikuKanan: [leherX + 6, leherY + 18],
      tanganKanan: [leherX + 8, leherY + 34],
      // arah > 0: kaki kiri di belakang, kanan di depan (menghadap kanan)
      lututKiri: arah > 0 ? belakang.lutut : depan.lutut,
      tumitKiri: arah > 0 ? belakang.tumit : depan.tumit,
      lututKanan: arah > 0 ? depan.lutut : belakang.lutut,
      tumitKanan: arah > 0 ? depan.tumit : belakang.tumit
    };
  }

  /* ================================================================
     POSE PLANK / PUSH-UP
     t: 0 = lengan lurus (atas), 1 = siku menekuk (bawah)
     ================================================================ */

  function kerangkaPlank(t) {
    t = t || 0;
    // Gunakan easing untuk turun lebih cepat dan bangun lebih tenang
    var tEased = easeOutCubic(t);
    var bahuX = 38;
    var bahuY = lerp(56, 72, tEased);
    var pinggulX = 76;
    var pinggulY = lerp(60, 76, tEased);
    // Punggung sedikit cember-cember: kepala di atas bahu, tidak terlalu jauh
    var leherX = bahuX - 8;
    var leherY = bahuY - 2;
    // Kaki tetap ke belakang
    var kakiBelakangX = 100;
    var kakiBelakangY = FLOOR;
    // Siku melengkung ke bawah saat turun (sudut sekitar 45-90 derajat)
    // saat t=0: siku lurus, saat t=1: siku sudah mengecur
    var sikuX = bahuX - 4;
    var sikuY = lerp(bahuY + 20, bahuY + 10, tEased);
    var sikuKiri = [sikuX, sikuY];
    var tanganKiri = lerpPt([30, FLOOR], [36, FLOOR], tEased);
    var sikuKanan = [bahuX + 2, sikuY];
    var tanganKanan = [44, FLOOR];
    // Lutut mengikuti punggul dengan sedikit delay
    var lututY = lerp(76, 86, tEased);
    return {
      pinggul: [pinggulX, pinggulY],
      leher: [leherX, leherY],
      kepala: [leherX - 6, leherY - 2],
      bahuKiri: [bahuX, bahuY],
      bahuKanan: [bahuX + 2, bahuY],
      sikuKiri: sikuKiri,
      tanganKiri: tanganKiri,
      sikuKanan: sikuKanan,
      tanganKanan: tanganKanan,
      lututKiri: [pinggulX + 8, lututY],
      tumitKiri: [kakiBelakangX - 3, kakiBelakangY],
      lututKanan: [pinggulX + 10, lututY],
      tumitKanan: [kakiBelakangX, kakiBelakangY]
    };
  }

  /* ================================================================
     POSE TELENTANG (glute bridge, dead bug, leg raise, bicycle)
     bridgeT: 0 = pangkal di lantai, 1 = pinggul terangkat
     ================================================================ */

  function kerangkaTelentang(bridgeT) {
    bridgeT = bridgeT || 0;
    var lantaiY = 86;
    var bahu = [30, lantaiY - 22];
    var pinggul = [64, lerp(lantaiY - 4, lantaiY - 20, bridgeT)];
    return {
      pinggul: pinggul,
      leher: [bahu[0] + 2, bahu[1]],
      kepala: [24, bahu[1] - 2],
      bahuKiri: [bahu[0] - 1, bahu[1] + 1],
      bahuKanan: [bahu[0] + 1, bahu[1] + 1],
      // lengan di samping tubuh / di lantai
      sikuKiri: [bahu[0] + 8, lantaiY - 12],
      tanganKiri: [bahu[0] + 14, lantaiY - 4],
      sikuKanan: [bahu[0] + 10, lantaiY - 14],
      tanganKanan: [bahu[0] + 18, lantaiY - 6],
      // lutut ditekuk ke atas, tumit di lantai
      lututKiri: [pinggul[0] + 12, lerp(lantaiY - 20, lantaiY - 30, bridgeT)],
      tumitKiri: [pinggul[0] + 22, lantaiY],
      lututKanan: [pinggul[0] + 14, lerp(lantaiY - 22, lantaiY - 32, bridgeT)],
      tumitKanan: [pinggul[0] + 24, lantaiY]
    };
  }

  /* ================================================================
     POSE TENGKURAP (superman, prone swimmer, reverse snow angel)
     angkat: 0 = rata lantai, 1 = terangkat
     ================================================================ */

  function kerangkaTengkurap(angkat) {
    angkat = angkat || 0;
    var lantaiY = 86;
    var dy = lerp(0, 10, angkat);
    var bahu = [34, lantaiY - 4 - dy];
    var pinggul = [72, lantaiY - 2 - dy * 0.6];
    return {
      pinggul: pinggul,
      leher: [bahu[0] + 2, bahu[1] - 2],
      kepala: [bahu[0] - 8, bahu[1] - 4 - dy * 0.4],
      bahuKiri: [bahu[0] - 1, bahu[1]],
      bahuKanan: [bahu[0] + 1, bahu[1]],
      // lengan lurus ke depan
      sikuKiri: [bahu[0] - 12, bahu[1] - 2 * dy * 0.5],
      tanganKiri: [bahu[0] - 24, bahu[1] - 4 * dy * 0.5],
      sikuKanan: [bahu[0] - 10, bahu[1] - 1 - 2 * dy * 0.5],
      tanganKanan: [bahu[0] - 22, bahu[1] - 2 - 4 * dy * 0.5],
      // kaki lurus ke belakang
      lututKiri: [pinggul[0] + 12, pinggul[1] + 2],
      tumitKiri: [pinggul[0] + 24, pinggul[1] + 4 - dy * 0.6],
      lututKanan: [pinggul[0] + 14, pinggul[1] + 2],
      tumitKanan: [pinggul[0] + 26, pinggul[1] + 4 - dy * 0.8]
    };
  }

  /* ================================================================
     POSE MERANGKAK (cat cow, bird dog)
     melengkung: -1 = lengkung ke atas (cat), 0 = rata, 1 = lengkung ke bawah (cow)
     ================================================================ */

  function kerangkaMerangkak(melengkung, angkatTangan, angkatKaki) {
    melengkung = melengkung || 0;
    var lantaiY = FLOOR;
    var bahu = [38, 62];
    var pinggul = [76, 62];
    var sag = -6 * melengkung; // negative = naik (cat)
    var tengahPunggung = [57, 62 + sag];

    // lengan vertikal ke lantai
    var sikuKiri = [bahu[0] - 1, 76];
    var tanganKiri = [bahu[0] - 1, lantaiY];
    var sikuKanan = [bahu[0] + 3, 76];
    var tanganKanan = [bahu[0] + 3, lantaiY];

    if (angkatTangan) {
      sikuKanan = [bahu[0] + 10, 58];
      tanganKanan = [bahu[0] + 22, 54];
    }

    // kaki merangkak
    var lututKiri = [pinggul[0] - 2, 80];
    var tumitKiri = [pinggul[0] - 2, lantaiY];
    var lututKanan = [pinggul[0] + 2, 80];
    var tumitKanan = [pinggul[0] + 2, lantaiY];

    if (angkatKaki) {
      lututKiri = [pinggul[0] + 10, 76];
      tumitKiri = [pinggul[0] + 22, 72];
    }

    return {
      pinggul: pinggul,
      tengahPunggung: tengahPunggung,
      leher: [bahu[0] + 2, bahu[1] - 2 - (melengkung < 0 ? 4 : 0)],
      kepala: [bahu[0] - 8, bahu[1] - 6 - (melengkung > 0 ? -4 : 0)],
      bahuKiri: [bahu[0], bahu[1]],
      bahuKanan: [bahu[0] + 2, bahu[1]],
      sikuKiri: sikuKiri,
      tanganKiri: tanganKiri,
      sikuKanan: sikuKanan,
      tanganKanan: tanganKanan,
      lututKiri: lututKiri,
      tumitKiri: tumitKiri,
      lututKanan: lututKanan,
      tumitKanan: tumitKanan
    };
  }

  /* ================================================================
     POSE BERDIRI SATU KAKI TERANGKAT (high knees, march, knee raise)
     t: 0..1 = tinggi lutut
     ================================================================ */

  function kerangkaAngkatLutut(t) {
    t = t || 0;
    var px = 58;
    var hipY = 60;
    var k = kerangkaBerdiri(px, hipY);
    // kaki kanan terangkat: lutut ke depan atas
    var lututY = lerp(84, 64, t);
    var lututX = px + 2 + 8 * t;
    var tumitX = px + 2 + 4 * t;
    var tumitY = lerp(FLOOR, 80, t);
    k.lututKanan = [lututX, lututY];
    k.tumitKanan = [tumitX, tumitY];
    // lengan berlawanan: lengan kiri maju, kanan mundur
    k.sikuKiri = [px + 4, hipY - 16];
    k.tanganKiri = [px + 12, hipY - 12];
    k.sikuKanan = [px - 6, hipY - 16];
    k.tanganKanan = [px - 12, hipY - 20];
    return k;
  }

  /* ================================================================
     POSE AYUN KAKI (leg swing)
     front: 1 = kaki depan, -1 = kaki belakang
     Berdiri satu kaki, tangan memegang dinding di kiri untuk penyeimbang.
     ================================================================ */

  var DINDING_TANGAN = 30;

  function kerangkaAyunKaki(front) {
    front = front || 0;
    var px = 58;
    var k = kerangkaBerdiri(px, 60);
    // lengan kiri memegang dinding setinggi bahu
    var leher = k.leher;
    k.sikuKiri = [(DINDING_TANGAN + leher[0]) / 2, leher[1] + 6];
    k.tanganKiri = [DINDING_TANGAN + 1, leher[1] + 4];
    // lengan kanan rileks di samping
    k.sikuKanan = [px + 7, leher[1] + 18];
    k.tanganKanan = [px + 8, leher[1] + 30];
    // kaki kanan diayun, lutut belakang sedikit ditekuk
    var sudut = front > 0 ? 15 : (front < 0 ? -35 : 0);
    var lutut = ujung([px, 60], 24, 90 - sudut);
    var tumit = ujung(lutut, 24, 88 - sudut);
    k.lututKanan = lutut;
    k.tumitKanan = tumit;
    return k;
  }

  function ayunKaki(front) {
    return gambarKerangka(kerangkaAyunKaki(front)) + dinding('kiri', DINDING_TANGAN);
  }

  /* ================================================================
     POSE STEP TOUCH (langkah ke samping)
     t: 0 = tengah, 1 = kaki kanan menyentuh samping
     ================================================================ */

  function kerangkaStepTouch(t) {
    t = t || 0;
    var px = 60;
    var k = kerangkaBerdiri(px, 62);
    // kaki kiri (penopang)
    k.lututKiri = [px - 4, 86];
    k.tumitKiri = [px - 6, FLOOR];
    // kaki kanan menapak ke samping
    if (t > 0) {
      k.lututKanan = [px + 6 + 8 * t, 86];
      k.tumitKanan = [px + 6 + 16 * t, FLOOR];
      k.sikuKanan = [px + 8 + 4 * t, 48 - 4 * t];
      k.tanganKanan = [px + 12 + 6 * t, 40 - 6 * t];
    }
    return k;
  }

  /* ================================================================
     Helper: gabung kerangka dasar + override (spread syntax clone)
     ================================================================ */

  function dengan(base, over) {
    var o = {};
    var key;
    for (key in base) if (Object.prototype.hasOwnProperty.call(base, key)) o[key] = base[key];
    for (key in over) if (Object.prototype.hasOwnProperty.call(over, key)) o[key] = over[key];
    return o;
  }

  /* ================================================================
     POSE-POSE PENDIRIAN LAIN
     ================================================================ */

  function tegak() { return gambarKerangka(kerangkaBerdiri(60, 62)); }

  function tegakLenganSamping() {
    var k = kerangkaBerdiri(60, 62);
    // lengan lurus keluar horizontal (bukan ke atas)
    k.sikuKiri = [50, 60];
    k.tanganKiri = [38, 60];
    k.sikuKanan = [70, 60];
    k.tanganKanan = [82, 60];
    return gambarKerangka(k);
  }

  function lenganKeAtas() {
    var k = kerangkaBerdiri(60, 62);
    // lengan lurus ke atas, hampir menyatu di atas kepala
    k.sikuKiri = [54, 40];
    k.tanganKiri = [56, 16];
    k.sikuKanan = [66, 40];
    k.tanganKanan = [64, 16];
    return gambarKerangka(k);
  }

  function bintang() {
    var k = kerangkaBerdiriLebar(60, 62, 22);
    // lengan terentang penuh ke atas-diagonal (bentuk bintang)
    k.sikuKiri = [50, 42];
    k.tanganKiri = [44, 16];
    k.sikuKanan = [70, 42];
    k.tanganKanan = [76, 16];
    return gambarKerangka(k);
  }

  function jangkau() {
    var k = kerangkaBerdiri(60, 62);
    k.sikuKiri = [54, 40];
    k.tanganKiri = [52, 20];
    k.sikuKanan = [66, 40];
    k.tanganKanan = [68, 20];
    return gambarKerangka(k);
  }

  function angkatTumit(t) {
    t = t === undefined ? 1 : t;
    var naik = lerp(62, 56, t); // badan naik saat tumit tergangkat
    var k = kerangkaBerdiri(60, naik);
    // tumit naik, lutut tetap lurus; kaki bergerak ke atas di ujung jari
    var lututY = lerp(86, 80, t);
    var tumitY = lerp(FLOOR, 90, t);
    k.lututKiri = [56, lututY];
    k.tumitKiri = [55, tumitY];
    k.lututKanan = [64, lututY];
    k.tumitKanan = [65, tumitY];
    return gambarKerangka(k, { lantaiY: FLOOR });
  }

  // Calf raise sambil berpegangan dinding (versi aman).
  function angkatTumitDinding(t) {
    var k = kerangkaBerdiri(64, lerp(62, 56, t === undefined ? 1 : t));
    var d = 26;
    var lututY = lerp(86, 80, t === undefined ? 1 : t);
    var tumitY = lerp(FLOOR, 90, t === undefined ? 1 : t);
    k.lututKiri = [60, lututY];
    k.tumitKiri = [59, tumitY];
    k.lututKanan = [68, lututY];
    k.tumitKanan = [69, tumitY];
    k.sikuKiri = [(d + k.leher[0]) / 2, k.leher[1] + 10];
    k.tanganKiri = [d + 1, k.leher[1] + 8];
    return gambarKerangka(k, { lantaiY: FLOOR }) + dinding('kiri', d);
  }

  function jongkok(t) { return gambarKerangka(kerangkaJongkok(60, t)); }

  function lunge(t) { return gambarKerangka(kerangkaLunge(1, t)); }

  function reverseLunge(t) { return gambarKerangka(kerangkaLunge(1, t)); }

  function lateralLunge(t) { return gambarKerangka(kerangkaLunge(-1, t)); }

  function pushup(t) { return gambarKerangka(kerangkaPlank(t)); }

  function plank(t) { return gambarKerangka(kerangkaPlank(t * 0.3)); }

  function telentang(t) { return gambarKerangka(kerangkaTelentang(t)); }

  function tengkurap(t) { return gambarKerangka(kerangkaTengkurap(t)); }

  function merangkak(melengkung, angkatTangan, angkatKaki) {
    return gambarKerangka(kerangkaMerangkak(melengkung, angkatTangan, angkatKaki));
  }

  function angkatLutut(t) { return gambarKerangka(kerangkaAngkatLutut(t)); }

  // Knee raise dengan tangan menyentuh dinding untuk keseimbangan.
  function angkatLututDinding(t) {
    var k = kerangkaAngkatLutut(t);
    var d = 22;
    k.sikuKiri = [(d + k.leher[0]) / 2, k.leher[1] + 8];
    k.tanganKiri = [d + 1, k.leher[1] + 6];
    return gambarKerangka(k) + dinding('kiri', d);
  }

  function duduk(mode) {
    return gambarKerangka(kerangkaDuduk(56, 74, mode || {})) + bangkuRendah(45, 85, 76);
  }

  // Duduk di kursi untuk sit-to-stand: kaki ditekuk, tumit di lantai.
  var KURSI_X1 = 38, KURSI_X2 = 76, KURSI_SEAT = 68;

  function dudukKursi(t) {
    t = t || 0;
    var seatY = KURSI_SEAT;
    var naik = easeOutCubic(t);
    // t=0 duduk penuh di kursi, t=1 berdiri tegak
    var hipX = lerp(KURSI_X2 - 8, 66, naik);
    var hipY = lerp(seatY - 1, 62, naik);
    var condong = Math.sin(naik * Math.PI) * 0.9; // condong ke depan di tengah
    var leherX = hipX + 6 * condong;
    var leherY = hipY - 34;
    if (naik > 0.6) { leherX = lerp(leherX, hipX, (naik - 0.6) / 0.4); }
    var lututX = lerp(KURSI_X2 + 10, 66, naik);
    var lututY = lerp(seatY + 4, 86, naik);
    var tumitX = lerp(KURSI_X2 + 6, 66, naik);
    return {
      pinggul: [hipX, hipY],
      leher: [leherX, leherY],
      kepala: [leherX + 1, leherY - 9],
      bahuKiri: [leherX - 1, leherY + 2],
      bahuKanan: [leherX + 1, leherY + 2],
      sikuKiri: [leherX + 4, leherY + 16],
      tanganKiri: [leherX + 12, leherY + 20],
      sikuKanan: [leherX + 6, leherY + 18],
      tanganKanan: [leherX + 14, leherY + 22],
      lututKiri: [lututX, lututY],
      tumitKiri: [tumitX - 3, FLOOR],
      lututKanan: [lututX + 3, lututY],
      tumitKanan: [tumitX + 3, FLOOR]
    };
  }

  function sitToStand(t) {
    return gambarKerangka(dudukKursi(t)) + kursi(KURSI_X1, KURSI_X2, KURSI_SEAT, { sandaran: true });
  }

  // Step up: kaki naik ke undakan, badan terdorong naik.
  var UPA_X1 = 62, UPA_X2 = 100, UPA_TOP = 78;

  function stepUp(t) {
    t = t || 0;
    var naik = easeOutCubic(t);
    var hipY = lerp(60, 58, naik);
    var px = 48;
    var k = kerangkaBerdiri(px, hipY);
    // kaki kanan di atas undakan
    if (naik > 0) {
      k.lututKanan = [lerp(px + 4, UPA_X1 + 4, naik), lerp(84, UPA_TOP - 8, naik)];
      k.tumitKanan = [lerp(px + 6, UPA_X1 + 12, naik), lerp(FLOOR, UPA_TOP, naik)];
      // kaki kiri tetap di lantai, lutut lurus
      k.lututKiri = [px - 4, lerp(FLOOR - 10, FLOOR - 8, naik)];
      k.tumitKiri = [px - 4, FLOOR];
      k.sikuKiri = [px + 2, k.leher[1] + 18];
      k.tanganKiri = [px + 4, k.leher[1] + 30];
      k.sikuKanan = [px + 10, k.leher[1] + 18];
      k.tanganKanan = [px + 14, k.leher[1] + 28];
    }
    return gambarKerangka(k) + undakan(UPA_X1, UPA_X2, UPA_TOP);
  }

  function stepTouchPose(t) { return gambarKerangka(kerangkaStepTouch(t)); }

  /* ================================================================
     POSE TAMBAHAN (dips, wall pushup, pike, superman variant,
     side plank, mountain climber, dead bug, bicycle, leg raise)
     ================================================================ */

  function dips(t) {
    t = t === undefined ? 0 : t;
    var bangkuY = 68;            // tinggi permukaan duduk kursi
    var kursiKiri = 62, kursiKanan = 96;
    var dy = lerp(0, 9, t);      // badan turun saat siku menekuk
    // Bokong di tepi depan kursi; tangan di tepi kursi di belakang pinggul
    var bahuX = kursiKiri - 12;
    var bahuY = bangkuY - 24 + dy;
    var k = {
      pinggul: [kursiKiri + 1, bangkuY - 1 + dy * 0.85],
      leher: [bahuX + 1, bahuY],
      kepala: [bahuX + 2, bahuY - 9],
      bahuKiri: [bahuX, bahuY + 1],
      bahuKanan: [bahuX + 2, bahuY + 1],
      // tangan menggenggam tepi kursi, siku mengarah ke belakang
      sikuKiri: [kursiKiri - 5, bangkuY - 11 + dy * 0.75],
      tanganKiri: [kursiKiri, bangkuY - 1],
      sikuKanan: [kursiKiri - 3, bangkuY - 9 + dy * 0.75],
      tanganKanan: [kursiKiri + 3, bangkuY - 1],
      // kaki lurus ke depan, tumit di lantai
      lututKiri: [kursiKanan - 4, bangkuY + 10 + dy * 0.25],
      tumitKiri: [104, FLOOR],
      lututKanan: [kursiKanan - 2, bangkuY + 12 + dy * 0.25],
      tumitKanan: [107, FLOOR]
    };
    return gambarKerangka(k) + kursi(kursiKiri, kursiKanan, bangkuY);
  }

  var DINDING_PUSHUP = 100;

  function wallPushup(t) {
    var dy = lerp(0, 5, t);
    var px = 56;
    var k = {
      pinggul: [px, 60],
      leher: [px + 2 + dy * 0.5, 42],
      kepala: [px + 6 + dy * 0.5, 36],
      bahuKiri: [px + 2, 44],
      bahuKanan: [px + 3, 44],
      sikuKiri: [px + 10, 40 + dy * 0.5],
      tanganKiri: [px + 18, 36 + dy],
      sikuKanan: [px + 12, 44 + dy * 0.5],
      tanganKanan: [px + 20, 40 + dy],
      lututKiri: [px - 2, 82],
      tumitKiri: [px - 4, FLOOR],
      lututKanan: [px + 2, 82],
      tumitKanan: [px, FLOOR]
    };
    // tangan menempel dinding: geser telapak ke garis dinding
    k.tanganKiri = [DINDING_PUSHUP - 1, 42 + dy];
    k.tanganKanan = [DINDING_PUSHUP - 1, 46 + dy];
    return gambarKerangka(k) + dinding('kanan', DINDING_PUSHUP);
  }

  function pikePushup(t) {
    var dy = lerp(0, 6, t);
    var bahu = [42, 62 + dy];
    var pinggul = [72, 44 + dy * 0.6];
    var k = {
      pinggul: pinggul,
      leher: [bahu[0] + 4, bahu[1] - 2],
      kepala: [bahu[0] - 4, bahu[1] - 4],
      bahuKiri: [bahu[0], bahu[1]],
      bahuKanan: [bahu[0] + 2, bahu[1]],
      sikuKiri: [bahu[0] - 2, bahu[1] + 14],
      tanganKiri: [bahu[0] - 4, FLOOR],
      sikuKanan: [bahu[0] + 4, bahu[1] + 16],
      tanganKanan: [bahu[0] + 4, FLOOR],
      lututKiri: [pinggul[0] + 8, pinggul[1] + 16],
      tumitKiri: [92, FLOOR],
      lututKanan: [pinggul[0] + 10, pinggul[1] + 18],
      tumitKanan: [94, FLOOR]
    };
    return gambarKerangka(k);
  }

  function superman(t) {
    return gambarKerangka(kerangkaTengkurap(t));
  }

  function sidePlank(t) {
    t = t === undefined ? 1 : t;
    var lantaiY = 88;
    // t: 0 = pinggul turun (hampir menyentuh lantai), 1 = pinggul terangkat penuh
    var hipLift = lerp(6, 0, t); // offset y tambahan saat turun
    var k = {
      pinggul: [72, 70 + hipLift],
      leher: [44, 60 + hipLift * 0.7],
      kepala: [34, 56 + hipLift * 0.7],
      bahuKiri: [44, 61 + hipLift * 0.7],
      bahuKanan: [45, 62 + hipLift * 0.7],
      sikuKiri: [38, 74],
      tanganKiri: [36, lantaiY],
      // lengan atas diangkat lurus ke langit-langit
      sikuKanan: [50, lerp(52, 46, t)],
      tanganKanan: [58, lerp(34, 22, t)],
      lututKiri: [86, 78 + hipLift],
      tumitKiri: [100, 88],
      lututKanan: [87, 79 + hipLift],
      tumitKanan: [101, 88]
    };
    return gambarKerangka(k, { lantaiY: lantaiY });
  }

  function sidePlankTurun() { return sidePlank(0); }

  function mountainClimber(t) {
    t = t || 0;
    var k = kerangkaPlank(0);
    // kaki kanan ditarik ke dada
    k.lututKanan = [66 - 20 * t, 66 + 4 * t];
    k.tumitKanan = [78 - 38 * t, 78 - 8 * t];
    return gambarKerangka(k);
  }

  function deadBug(t) {
    var lantaiY = 86;
    var t = t || 0;
    var bahuX = 30, bahuY = lantaiY - 20;
    var pinggul = [64, lantaiY - 2];
    // lengan kanan turun, kaki kiri turun
    var lenganTurunSikuX = lerp(44, 48, t);
    var lenganTurunSikuY = lerp(bahuY + 4, lantaiY - 12, t);
    var lenganTurunTanganX = lerp(46, 24, t * 0.2) + 6;
    var lenganTurunTanganY = lerp(bahuY - 10, lantaiY - 6, t);
    var kakiTurunLututX = lerp(76, 84, t);
    var kakiTurunLututY = lerp(lantaiY - 12, lantaiY - 6, t);
    var kakiTurunTumitX = lerp(84, 92, t);
    var kakiTurunTumitY = lerp(lantaiY - 24, lantaiY - 4, t);
    var k = {
      pinggul: pinggul,
      leher: [bahuX + 2, bahuY],
      kepala: [bahuX - 4, bahuY - 2],
      bahuKiri: [bahuX, bahuY + 1],
      bahuKanan: [bahuX + 2, bahuY + 1],
      // lengan kiri terangkat ke atas
      sikuKiri: [bahuX + 2, bahuY - 10],
      tanganKiri: [bahuX + 6, lantaiY - 44],
      // lengan kanan turun ke lantai
      sikuKanan: [lenganTurunSikuX, lenganTurunSikuY],
      tanganKanan: [lenganTurunTanganX, lenganTurunTanganY],
      // kaki kiri diangkat (sudut 90)
      lututKiri: [pinggul[0] + 10, lantaiY - 20],
      tumitKiri: [pinggul[0] + 20, lantaiY - 32],
      // kaki kanan turun lurus
      lututKanan: [kakiTurunLututX, kakiTurunLututY],
      tumitKanan: [kakiTurunTumitX, kakiTurunTumitY]
    };
    return gambarKerangka(k, { lantaiY: lantaiY });
  }

  function bicycleCrunch(t) {
    t = t || 0;
    var lantaiY = 86;
    var bahu = [34, lantaiY - 20];
    var pinggul = [64, lantaiY - 4];
    // lutut kanan ditarik ke dada
    var lututTarik = [72, lerp(lantaiY - 18, 54, t)];
    var tumitTarik = [80, lerp(lantaiY - 26, 58, t)];
    // lutut kiri tetap
    var lututL = [80, lantaiY - 12];
    var tumitL = [92, lantaiY - 6];
    var k = {
      pinggul: pinggul,
      leher: [bahu[0] + 2, bahu[1]],
      kepala: [bahu[0] - 4, bahu[1] - 2],
      bahuKiri: [bahu[0], bahu[1] + 1],
      bahuKanan: [bahu[0] + 2, bahu[1] + 1],
      // tangan kanan di belakang kepala
      sikuKanan: [bahu[0] - 2, bahu[1] - 8],
      tanganKanan: [bahu[0] + 10, bahu[1] - 10],
      // tangan kiri di belakang kepala
      sikuKiri: [bahu[0] + 2, bahu[1] - 8],
      tanganKiri: [bahu[0] + 12, bahu[1] - 6],
      lututKiri: lututL,
      tumitKiri: tumitL,
      lututKanan: lututTarik,
      tumitKanan: tumitTarik
    };
    return gambarKerangka(k, { lantaiY: lantaiY });
  }

  function legRaise(t) {
    t = t || 0;
    var lantaiY = 86;
    var pinggul = [60, lantaiY - 4];
    var sudut = lerp(0, -75, t);
    var lutut = ujung(pinggul, 22, sudut);
    var tumit = ujung(lutut, 22, sudut);
    var k = {
      pinggul: pinggul,
      leher: [34, lantaiY - 22],
      kepala: [28, lantaiY - 24],
      bahuKiri: [34, lantaiY - 21],
      bahuKanan: [36, lantaiY - 21],
      sikuKiri: [40, lantaiY - 10],
      tanganKiri: [44, lantaiY - 2],
      sikuKanan: [42, lantaiY - 10],
      tanganKanan: [46, lantaiY - 2],
      lututKiri: lutut,
      tumitKiri: tumit,
      lututKanan: [lutut[0] + 1, lutut[1] + 2],
      tumitKanan: [tumit[0] + 1, tumit[1] + 2]
    };
    return gambarKerangka(k, { lantaiY: lantaiY });
  }

  // Hip thrust: punggung bawah disandarkan ke sofa/kursi rendah di belakang.
  var SOFA_X1 = 10, SOFA_X2 = 34, SOFA_H = 66;

  function hipThrust(bridgeT) {
    bridgeT = bridgeT || 0;
    var lantaiY = 86;
    var bahu = [SOFA_X2 + 4, lantaiY - 22];
    var pinggul = [66, lerp(lantaiY - 4, lantaiY - 20, bridgeT)];
    var k = {
      pinggul: pinggul,
      leher: [bahu[0] - 4, bahu[1]],
      kepala: [bahu[0] - 12, bahu[1] - 2],
      bahuKiri: [bahu[0] - 1, bahu[1] + 1],
      bahuKanan: [bahu[0] + 1, bahu[1] + 1],
      sikuKiri: [bahu[0] + 8, lantaiY - 12],
      tanganKiri: [bahu[0] + 14, lantaiY - 4],
      sikuKanan: [bahu[0] + 10, lantaiY - 14],
      tanganKanan: [bahu[0] + 18, lantaiY - 6],
      lututKiri: [pinggul[0] + 12, lerp(lantaiY - 22, lantaiY - 32, bridgeT)],
      tumitKiri: [pinggul[0] + 20, lantaiY],
      lututKanan: [pinggul[0] + 14, lerp(lantaiY - 24, lantaiY - 34, bridgeT)],
      tumitKanan: [pinggul[0] + 22, lantaiY]
    };
    return gambarKerangka(k, { lantaiY: lantaiY }) + undakan(SOFA_X1, SOFA_X2, SOFA_H);
  }

  function dudukBungkuk(t) {
    t = t === undefined ? 1 : t;
    var k = kerangkaDuduk(54, 74, { kakiLurus: true });
    // bungkuk ke depan: leher & kepala turun ke arah kaki
    k.leher = lerpPt([54, 40], [74, 66], t);
    k.kepala = lerpPt([55, 31], [82, 64], t);
    k.bahuKiri = geser(k.leher, -1, 2);
    k.bahuKanan = geser(k.leher, 1, 2);
    // lengan menjulur ke arah kaki
    k.sikuKiri = lerpPt([48, 56], [80, 70], t);
    k.tanganKiri = lerpPt([46, 70], [90, 76], t);
    k.sikuKanan = lerpPt([60, 56], [82, 70], t);
    k.tanganKanan = lerpPt([62, 70], [92, 76], t);
    return gambarKerangka(k);
  }

  function dudukNapas(dalam) {
    var k = kerangkaDuduk(56, 74, { lenganNaik: !!dalam });
    return gambarKerangka(k);
  }

  function ankleCircle(t) {
    var k = kerangkaDuduk(52, 74, { lenganNaik: false });
    // kaki kiri diangkat sedikit & lingkaran di pergelangan
    var t = t || 0;
    var px = 68, py = 76;
    var rad = 4;
    var cx = px + rad * Math.cos(t * 2 * Math.PI);
    var cy = py + rad * Math.sin(t * 2 * Math.PI);
    k.lututKiri = [px - 2, 70];
    k.tumitKiri = [cx, cy];
    // duduk di kursi, kaki kanan menapak lantai
    k.tumitKanan = [78, FLOOR];
    k.lututKanan = [80, 80];
    return gambarKerangka(k) + kursi(40, 84, 74);
  }

  // Child pose: duduk di atas tumit, badan menunduk, lengan lurus ke depan.
  function childPose(t) {
    t = t === undefined ? 1 : t;
    var lantaiY = 86;
    var pinggulX = 78, pinggulY = lerp(84, 88, t); // pinggul turun ke tumit
    var leherX = lerp(56, 46, t);
    var leherY = lerp(50, lantaiY - 6, t);
    var k = {
      pinggul: [pinggulX, pinggulY],
      leher: [leherX, leherY],
      kepala: [leherX - 9, leherY + 2],
      bahuKiri: [leherX - 1, leherY + 1],
      bahuKanan: [leherX + 1, leherY + 1],
      sikuKiri: [leherX - 14, leherY + 2],
      tanganKiri: [leherX - 28, lantaiY],
      sikuKanan: [leherX - 12, leherY + 4],
      tanganKanan: [leherX - 27, lantaiY - 1],
      lututKiri: [pinggulX - 4, lantaiY - 4],
      tumitKiri: [pinggulX - 12, lantaiY],
      lututKanan: [pinggulX - 1, lantaiY - 4],
      tumitKanan: [pinggulX - 9, lantaiY]
    };
    return gambarKerangka(k, { lantaiY: lantaiY });
  }

  var MEJA_TOP = 66, MEJA_KIRI = 96, MEJA_KANAN = 114;

  function wallLean(t) {
    t = t === undefined ? 0 : t;
    var dy = t * 6;
    var px = 52;
    var k = {
      pinggul: [px, 62],
      leher: [px + 8 + dy, 46],
      kepala: [px + 12 + dy, 40],
      bahuKiri: [px + 8, 47],
      bahuKanan: [px + 9, 47],
      sikuKiri: [px + 16, 44 + dy * 0.5],
      tanganKiri: [px + 30, 42 + dy],
      sikuKanan: [px + 18, 48 + dy * 0.5],
      tanganKanan: [px + 32, 46 + dy],
      lututKiri: [px - 2, 82],
      tumitKiri: [px - 6, FLOOR],
      lututKanan: [px + 2, 82],
      tumitKanan: [px - 2, FLOOR]
    };
    // telapak menumpu di tepi meja, bukan melayang
    k.tanganKiri = [MEJA_KIRI + 1, MEJA_TOP - 2 + dy * 0.2];
    k.tanganKanan = [MEJA_KIRI + 4, MEJA_TOP - 1 + dy * 0.2];
    return gambarKerangka(k) + meja(MEJA_KIRI, MEJA_KANAN, MEJA_TOP);
  }

  /* ================================================================
     PETA GERAKAN
     Setiap entry = array fungsi; tiap fungsi menghasilkan satu frame.
     Urutan frame mengikuti langkah latihan: mulai -> gerak -> kembali.
     ================================================================ */

  var GAMBAR = {
    // --- SQUAT & VARIASI ---
    squat: [jongkok.bind(null, 0), jongkok.bind(null, 0.35), jongkok.bind(null, 0.7), jongkok.bind(null, 1)],
    controlled_squat: [jongkok.bind(null, 0), jongkok.bind(null, 0.5), jongkok.bind(null, 1), jongkok.bind(null, 1)],
    squat_ramp: [jongkok.bind(null, 0), jongkok.bind(null, 0.3), jongkok.bind(null, 0.6)],
    jump_squat: [jongkok.bind(null, 0.6), jongkok.bind(null, 0.2), tegak, tegak],

    // --- GLUTE BRIDGE & HIP ---
    glute_bridge: [telentang.bind(null, 0), telentang.bind(null, 0.5), telentang.bind(null, 1), telentang.bind(null, 0.3)],
    hip_thrust: [hipThrust.bind(null, 0), hipThrust.bind(null, 0.5), hipThrust.bind(null, 1)],
    glute_bridge_march: [telentang.bind(null, 0), telentang.bind(null, 1), deadBug.bind(null, 0.5)],

    // --- LUNGE & VARIASI ---
    reverse_lunge: [tegak, lunge.bind(null, 0.4), lunge.bind(null, 1)],
    split_squat: [tegak, lunge.bind(null, 0.5), lunge.bind(null, 1)],
    lateral_lunge: [tegak, lateralLunge.bind(null, 0.5), lateralLunge.bind(null, 1)],

    // --- WALL SIT, SIT-TO-STAND, STEP UP ---
    wall_sit: [wallSit.bind(null, 0), wallSit.bind(null, 0.6), wallSit.bind(null, 1)],
    sit_to_stand: [sitToStand.bind(null, 0), sitToStand.bind(null, 0.5), sitToStand.bind(null, 1)],
    step_up: [tegak, stepUp.bind(null, 0.5), stepUp.bind(null, 1)],

    // --- PUSH-UP & VARIASI ---
    pushup: [pushup.bind(null, 0), pushup.bind(null, 0.4), pushup.bind(null, 0.8), pushup.bind(null, 1)],
    wide_pushup: [pushup.bind(null, 0), pushup.bind(null, 0.5), pushup.bind(null, 1)],
    incline_pushup: [wallLean.bind(null, 0), wallLean.bind(null, 0.5), wallLean.bind(null, 1)],
    wall_pushup: [wallPushup.bind(null, 0), wallPushup.bind(null, 0.5), wallPushup.bind(null, 1)],
    pike_pushup: [pikePushup.bind(null, 0), pikePushup.bind(null, 0.5), pikePushup.bind(null, 1)],

    // --- CORE & PLANK ---
    plank: [plank.bind(null, 0), plank.bind(null, 0.5), plank.bind(null, 1)],
    side_plank: [sidePlankTurun, sidePlank, sidePlankTurun],
    superman: [tengkurap.bind(null, 0), tengkurap.bind(null, 0.5), tengkurap.bind(null, 1), tengkurap.bind(null, 0)],
    reverse_snow_angel: [tengkurap.bind(null, 0), tengkurap.bind(null, 0.5), tengkurap.bind(null, 1)],
    prone_swimmer: [tengkurap.bind(null, 0), tengkurap.bind(null, 0.5), tengkurap.bind(null, 1)],

    // --- MERANGKAK ---
    cat_cow: [merangkak.bind(null, 1, false, false), merangkak.bind(null, 0, false, false), merangkak.bind(null, -1, false, false)],
    bird_dog: [merangkak.bind(null, 0, false, false), merangkak.bind(null, 0, true, false), merangkak.bind(null, 0, true, true)],
    mountain_climber: [mountainClimber.bind(null, 0), mountainClimber.bind(null, 0.5), mountainClimber.bind(null, 1)],
    dead_bug: [deadBug.bind(null, 0), deadBug.bind(null, 0.5), deadBug.bind(null, 1)],
    bicycle_crunch: [bicycleCrunch.bind(null, 0), bicycleCrunch.bind(null, 0.5), bicycleCrunch.bind(null, 1)],
    leg_raise: [legRaise.bind(null, 0), legRaise.bind(null, 0.5), legRaise.bind(null, 1)],

    // --- KARDIO ---
    jumping_jack: [tegak, tegakLenganSamping, bintang, tegakLenganSamping],
    high_knees: [tegak, angkatLutut.bind(null, 0.5), angkatLutut.bind(null, 1)],
    march_in_place: [tegak, angkatLutut.bind(null, 0.35), angkatLutut.bind(null, 0.7)],
    slow_knee_raise: [tegak, angkatLututDinding.bind(null, 0.5), angkatLututDinding.bind(null, 1)],
    step_jack: [tegak, tegakLenganSamping, bintang, tegak],
    step_touch: [stepTouchPose.bind(null, 0), stepTouchPose.bind(null, 0.5), stepTouchPose.bind(null, 1)],
    skater_step: [tegak, lateralLunge.bind(null, 0.5), lateralLunge.bind(null, 1)],
    burpee: [tegak, jongkok.bind(null, 0.8), pushup.bind(null, 0.6), tegak],

    // --- JALAN SANTAI ---
    light_walk: [tegak, angkatLutut.bind(null, 0.2), angkatLutut.bind(null, 0.4)],

    // --- OTOT & MOBILITAS ---
    tricep_dips: [dips.bind(null, 0), dips.bind(null, 0.5), dips.bind(null, 1)],
    standing_calf_raise: [tegak, angkatTumitDinding.bind(null, 0.5), angkatTumitDinding.bind(null, 1), tegak],

    // --- PEMANASAN ---
    joint_mobility: [tegak, tegakLenganSamping, jangkau],
    thoracic_rotation: [tegak, tegakLenganSamping, jangkau],
    leg_swing: [ayunKaki.bind(null, -1), ayunKaki.bind(null, 0), ayunKaki.bind(null, 1)],
    ankle_circle: [ankleCircle.bind(null, 0), ankleCircle.bind(null, 0.33), ankleCircle.bind(null, 0.66)],
    mobility_flow: [tegak, tegakLenganSamping, jangkau],

    // --- PENDINGINAN ---
    breathing: [duduk, dudukNapas.bind(null, true), duduk],
    cooldown_breathing: [duduk, dudukNapas.bind(null, true), duduk],
    upper_body_stretch: [tegak, tegakLenganSamping, jangkau],
    hip_flexor_stretch: [tegak, lunge.bind(null, 0.5), lunge.bind(null, 1)],
    leg_back_stretch: [duduk, dudukBungkuk.bind(null, 0.5), dudukBungkuk.bind(null, 1)],
    static_full_stretch: [jangkau, childPose.bind(null, 0.5), childPose.bind(null, 1)],

    'default': [tegak, tegak, tegak]
  };

  /* ================================================================
     ANIMASI -- data gerak per latihan.
     Dibangun dari KERANGKA sendi yang SAMA PERSIS dengan GAMBAR,
     supaya frame statis dan animasi tidak saling bertentangan.

     Setiap entri RAW adalah fungsi () -> {k, opts, props}:
       k     = posisi sendi (objek kerangka)
       opts  = opsi gambarKerangka (lantaiY, dll.)
       props = string SVG properti penunjang (dinding/kursi/meja)

     GERAK[key] adalah garis waktu (timeline) segmen. Tiap segmen:
       {a, b, dur, ease}  interpolasi dari frame a ke frame b
       {hold, dur}         diam di frame hold
       dur dalam milidetik; ease: 'in'|'out'|'io'.
     ================================================================ */

  function _b(k, opts, props) { return { k: k, opts: opts || {}, props: props || '' }; }

  // --- builder baku (memakai kerangka* yang sama dengan GAMBAR) ---
  function Rjongkok(t) { return _b(kerangkaJongkok(60, t)); }
  function Rlunge(t) { return _b(kerangkaLunge(1, t)); }
  function RlateralLunge(t) { return _b(kerangkaLunge(-1, t)); }
  function Rpushup(t) { return _b(kerangkaPlank(t)); }
  function Rplank(t) { return _b(kerangkaPlank(t * 0.3)); }
  function Rtelentang(t) { return _b(kerangkaTelentang(t)); }
  function Rtengkurap(t) { return _b(kerangkaTengkurap(t)); }
  function Rmerangkak(m, a, ak) { return _b(kerangkaMerangkak(m, a, ak)); }
  function RangkatLutut(t) { return _b(kerangkaAngkatLutut(t)); }
  function RstepTouch(t) { return _b(kerangkaStepTouch(t)); }
  function Rtegak() { return _b(kerangkaBerdiri(60, 62)); }
  function Rduduk(mode) { return _b(kerangkaDuduk(56, 74, mode || {}), null, bangkuRendah(45, 85, 76)); }
  function RdudukNapas(dalam) { return _b(kerangkaDuduk(56, 74, { lenganNaik: !!dalam })); }

  // Sit-to-stand: salinan dudukKursi tanpa prop (kursi ditambah di wrapper).
  function RdudukKursi(t) {
    var seatY = KURSI_SEAT, naik = easeOutCubic(t || 0);
    var hipX = lerp(KURSI_X2 - 8, 66, naik), hipY = lerp(seatY - 1, 62, naik);
    var condong = Math.sin(naik * Math.PI) * 0.9;
    var leherX = hipX + 6 * condong, leherY = hipY - 34;
    if (naik > 0.6) leherX = lerp(leherX, hipX, (naik - 0.6) / 0.4);
    var lututX = lerp(KURSI_X2 + 10, 66, naik), lututY = lerp(seatY + 4, 86, naik);
    var tumitX = lerp(KURSI_X2 + 6, 66, naik);
    return {
      pinggul: [hipX, hipY], leher: [leherX, leherY], kepala: [leherX + 1, leherY - 9],
      bahuKiri: [leherX - 1, leherY + 2], bahuKanan: [leherX + 1, leherY + 2],
      sikuKiri: [leherX + 4, leherY + 16], tanganKiri: [leherX + 12, leherY + 20],
      sikuKanan: [leherX + 6, leherY + 18], tanganKanan: [leherX + 14, leherY + 22],
      lututKiri: [lututX, lututY], tumitKiri: [tumitX - 3, FLOOR],
      lututKanan: [lututX + 3, lututY], tumitKanan: [tumitX + 3, FLOOR]
    };
  }
  function RsitToStand(t) {
    return _b(RdudukKursi(t), null, kursi(KURSI_X1, KURSI_X2, KURSI_SEAT, { sandaran: true }));
  }

  function RstepUp(t) {
    var naik = easeOutCubic(t || 0), hipY = lerp(60, 58, naik), px = 48;
    var k = kerangkaBerdiri(px, hipY);
    if (naik > 0) {
      k.lututKanan = [lerp(px + 4, UPA_X1 + 4, naik), lerp(84, UPA_TOP - 8, naik)];
      k.tumitKanan = [lerp(px + 6, UPA_X1 + 12, naik), lerp(FLOOR, UPA_TOP, naik)];
      k.lututKiri = [px - 4, lerp(FLOOR - 10, FLOOR - 8, naik)];
      k.tumitKiri = [px - 4, FLOOR];
      k.sikuKiri = [px + 2, k.leher[1] + 18]; k.tanganKiri = [px + 4, k.leher[1] + 30];
      k.sikuKanan = [px + 10, k.leher[1] + 18]; k.tanganKanan = [px + 14, k.leher[1] + 28];
    }
    return _b(k, null, undakan(UPA_X1, UPA_X2, UPA_TOP));
  }

  function Rdips(t) {
    var bangkuY = 68, kursiKiri = 62, kursiKanan = 96;
    var dy = lerp(0, 9, t === undefined ? 0 : t);
    var bahuX = kursiKiri - 12, bahuY = bangkuY - 24 + dy;
    var k = {
      pinggul: [kursiKiri + 1, bangkuY - 1 + dy * 0.85],
      leher: [bahuX + 1, bahuY], kepala: [bahuX + 2, bahuY - 9],
      bahuKiri: [bahuX, bahuY + 1], bahuKanan: [bahuX + 2, bahuY + 1],
      sikuKiri: [kursiKiri - 5, bangkuY - 11 + dy * 0.75], tanganKiri: [kursiKiri, bangkuY - 1],
      sikuKanan: [kursiKiri - 3, bangkuY - 9 + dy * 0.75], tanganKanan: [kursiKiri + 3, bangkuY - 1],
      lututKiri: [kursiKanan - 4, bangkuY + 10 + dy * 0.25], tumitKiri: [104, FLOOR],
      lututKanan: [kursiKanan - 2, bangkuY + 12 + dy * 0.25], tumitKanan: [107, FLOOR]
    };
    return _b(k, null, kursi(kursiKiri, kursiKanan, bangkuY));
  }

  function RwallPushup(t) {
    var dy = lerp(0, 5, t === undefined ? 0 : t), px = 56;
    var k = {
      pinggul: [px, 60], leher: [px + 2 + dy * 0.5, 42], kepala: [px + 6 + dy * 0.5, 36],
      bahuKiri: [px + 2, 44], bahuKanan: [px + 3, 44],
      sikuKiri: [px + 10, 40 + dy * 0.5], tanganKiri: [px + 18, 36 + dy],
      sikuKanan: [px + 12, 44 + dy * 0.5], tanganKanan: [px + 20, 40 + dy],
      lututKiri: [px - 2, 82], tumitKiri: [px - 4, FLOOR],
      lututKanan: [px + 2, 82], tumitKanan: [px, FLOOR]
    };
    k.tanganKiri = [DINDING_PUSHUP - 1, 42 + dy];
    k.tanganKanan = [DINDING_PUSHUP - 1, 46 + dy];
    return _b(k, null, dinding('kanan', DINDING_PUSHUP));
  }

  function RpikePushup(t) {
    var dy = lerp(0, 6, t === undefined ? 0 : t);
    var bahu = [42, 62 + dy], pinggul = [72, 44 + dy * 0.6];
    var k = {
      pinggul: pinggul, leher: [bahu[0] + 4, bahu[1] - 2], kepala: [bahu[0] - 4, bahu[1] - 4],
      bahuKiri: [bahu[0], bahu[1]], bahuKanan: [bahu[0] + 2, bahu[1]],
      sikuKiri: [bahu[0] - 2, bahu[1] + 14], tanganKiri: [bahu[0] - 4, FLOOR],
      sikuKanan: [bahu[0] + 4, bahu[1] + 16], tanganKanan: [bahu[0] + 4, FLOOR],
      lututKiri: [pinggul[0] + 8, pinggul[1] + 16], tumitKiri: [92, FLOOR],
      lututKanan: [pinggul[0] + 10, pinggul[1] + 18], tumitKanan: [94, FLOOR]
    };
    return _b(k);
  }

  function RsidePlank(t) {
    t = t === undefined ? 1 : t;
    var lantaiY = 88, hipLift = lerp(6, 0, t);
    var k = {
      pinggul: [72, 70 + hipLift], leher: [44, 60 + hipLift * 0.7], kepala: [34, 56 + hipLift * 0.7],
      bahuKiri: [44, 61 + hipLift * 0.7], bahuKanan: [45, 62 + hipLift * 0.7],
      sikuKiri: [38, 74], tanganKiri: [36, lantaiY],
      sikuKanan: [50, lerp(52, 46, t)], tanganKanan: [58, lerp(34, 22, t)],
      lututKiri: [86, 78 + hipLift], tumitKiri: [100, 88],
      lututKanan: [87, 79 + hipLift], tumitKanan: [101, 88]
    };
    return _b(k, { lantaiY: lantaiY });
  }
  function RsidePlankTurun() { return RsidePlank(0); }

  function RmountainClimber(t) {
    var k = kerangkaPlank(0);
    k.lututKanan = [66 - 20 * (t || 0), 66 + 4 * (t || 0)];
    k.tumitKanan = [78 - 38 * (t || 0), 78 - 8 * (t || 0)];
    return _b(k);
  }

  function RdeadBug(t) {
    var lantaiY = 86, t = t || 0;
    var bahuX = 30, bahuY = lantaiY - 20, pinggul = [64, lantaiY - 2];
    var k = {
      pinggul: pinggul, leher: [bahuX + 2, bahuY], kepala: [bahuX - 4, bahuY - 2],
      bahuKiri: [bahuX, bahuY + 1], bahuKanan: [bahuX + 2, bahuY + 1],
      sikuKiri: [bahuX + 2, bahuY - 10], tanganKiri: [bahuX + 6, lantaiY - 44],
      sikuKanan: [lerp(44, 48, t), lerp(bahuY + 4, lantaiY - 12, t)],
      tanganKanan: [lerp(46, 24, t * 0.2) + 6, lerp(bahuY - 10, lantaiY - 6, t)],
      lututKiri: [pinggul[0] + 10, lantaiY - 20], tumitKiri: [pinggul[0] + 20, lantaiY - 32],
      lututKanan: [lerp(76, 84, t), lerp(lantaiY - 12, lantaiY - 6, t)],
      tumitKanan: [lerp(84, 92, t), lerp(lantaiY - 24, lantaiY - 4, t)]
    };
    return _b(k, { lantaiY: lantaiY });
  }

  function RbicycleCrunch(t) {
    var lantaiY = 86, t = t || 0;
    var bahu = [34, lantaiY - 20], pinggul = [64, lantaiY - 4];
    var k = {
      pinggul: pinggul, leher: [bahu[0] + 2, bahu[1]], kepala: [bahu[0] - 4, bahu[1] - 2],
      bahuKiri: [bahu[0], bahu[1] + 1], bahuKanan: [bahu[0] + 2, bahu[1] + 1],
      sikuKanan: [bahu[0] - 2, bahu[1] - 8], tanganKanan: [bahu[0] + 10, bahu[1] - 10],
      sikuKiri: [bahu[0] + 2, bahu[1] - 8], tanganKiri: [bahu[0] + 12, bahu[1] - 6],
      lututKiri: [80, lantaiY - 12], tumitKiri: [92, lantaiY - 6],
      lututKanan: [72, lerp(lantaiY - 18, 54, t)], tumitKanan: [80, lerp(lantaiY - 26, 58, t)]
    };
    return _b(k, { lantaiY: lantaiY });
  }

  function RlegRaise(t) {
    var lantaiY = 86, t = t || 0, pinggul = [60, lantaiY - 4];
    var sudut = lerp(0, -75, t), lutut = ujung(pinggul, 22, sudut), tumit = ujung(lutut, 22, sudut);
    var k = {
      pinggul: pinggul, leher: [34, lantaiY - 22], kepala: [28, lantaiY - 24],
      bahuKiri: [34, lantaiY - 21], bahuKanan: [36, lantaiY - 21],
      sikuKiri: [40, lantaiY - 10], tanganKiri: [44, lantaiY - 2],
      sikuKanan: [42, lantaiY - 10], tanganKanan: [46, lantaiY - 2],
      lututKiri: lutut, tumitKiri: tumit,
      lututKanan: [lutut[0] + 1, lutut[1] + 2], tumitKanan: [tumit[0] + 1, tumit[1] + 2]
    };
    return _b(k, { lantaiY: lantaiY });
  }

  function RhipThrust(t) {
    var lantaiY = 86, t = t || 0;
    var bahu = [SOFA_X2 + 4, lantaiY - 22], pinggul = [66, lerp(lantaiY - 4, lantaiY - 20, t)];
    var k = {
      pinggul: pinggul, leher: [bahu[0] - 4, bahu[1]], kepala: [bahu[0] - 12, bahu[1] - 2],
      bahuKiri: [bahu[0] - 1, bahu[1] + 1], bahuKanan: [bahu[0] + 1, bahu[1] + 1],
      sikuKiri: [bahu[0] + 8, lantaiY - 12], tanganKiri: [bahu[0] + 14, lantaiY - 4],
      sikuKanan: [bahu[0] + 10, lantaiY - 14], tanganKanan: [bahu[0] + 18, lantaiY - 6],
      lututKiri: [pinggul[0] + 12, lerp(lantaiY - 22, lantaiY - 32, t)], tumitKiri: [pinggul[0] + 20, lantaiY],
      lututKanan: [pinggul[0] + 14, lerp(lantaiY - 24, lantaiY - 34, t)], tumitKanan: [pinggul[0] + 22, lantaiY]
    };
    return _b(k, { lantaiY: lantaiY }, undakan(SOFA_X1, SOFA_X2, SOFA_H));
  }

  function RdudukBungkuk(t) {
    t = t === undefined ? 1 : t;
    var k = kerangkaDuduk(54, 74, { kakiLurus: true });
    k.leher = lerpPt([54, 40], [74, 66], t);
    k.kepala = lerpPt([55, 31], [82, 64], t);
    k.bahuKiri = geser(k.leher, -1, 2);
    k.bahuKanan = geser(k.leher, 1, 2);
    k.sikuKiri = lerpPt([48, 56], [80, 70], t);
    k.tanganKiri = lerpPt([46, 70], [90, 76], t);
    k.sikuKanan = lerpPt([60, 56], [82, 70], t);
    k.tanganKanan = lerpPt([62, 70], [92, 76], t);
    return _b(k);
  }

  function RankleCircle(t) {
    var k = kerangkaDuduk(52, 74, { lenganNaik: false });
    var t = t || 0, px = 68, py = 76, rad = 4;
    var cx = px + rad * Math.cos(t * 2 * Math.PI), cy = py + rad * Math.sin(t * 2 * Math.PI);
    k.lututKiri = [px - 2, 70];
    k.tumitKiri = [cx, cy];
    k.tumitKanan = [78, FLOOR];
    k.lututKanan = [80, 80];
    return _b(k, null, kursi(40, 84, 74));
  }

  function RchildPose(t) {
    t = t === undefined ? 1 : t;
    var lantaiY = 86, pinggulX = 78, pinggulY = lerp(84, 88, t);
    var leherX = lerp(56, 46, t), leherY = lerp(50, lantaiY - 6, t);
    var k = {
      pinggul: [pinggulX, pinggulY], leher: [leherX, leherY], kepala: [leherX - 9, leherY + 2],
      bahuKiri: [leherX - 1, leherY + 1], bahuKanan: [leherX + 1, leherY + 1],
      sikuKiri: [leherX - 14, leherY + 2], tanganKiri: [leherX - 28, lantaiY],
      sikuKanan: [leherX - 12, leherY + 4], tanganKanan: [leherX - 27, lantaiY - 1],
      lututKiri: [pinggulX - 4, lantaiY - 4], tumitKiri: [pinggulX - 12, lantaiY],
      lututKanan: [pinggulX - 1, lantaiY - 4], tumitKanan: [pinggulX - 9, lantaiY]
    };
    return _b(k, { lantaiY: lantaiY });
  }

  function RwallLean(t) {
    t = t === undefined ? 0 : t;
    var dy = t * 6, px = 52;
    var k = {
      pinggul: [px, 62], leher: [px + 8 + dy, 46], kepala: [px + 12 + dy, 40],
      bahuKiri: [px + 8, 47], bahuKanan: [px + 9, 47],
      sikuKiri: [px + 16, 44 + dy * 0.5], tanganKiri: [px + 30, 42 + dy],
      sikuKanan: [px + 18, 48 + dy * 0.5], tanganKanan: [px + 32, 46 + dy],
      lututKiri: [px - 2, 82], tumitKiri: [px - 6, FLOOR],
      lututKanan: [px + 2, 82], tumitKanan: [px - 2, FLOOR]
    };
    k.tanganKiri = [MEJA_KIRI + 1, MEJA_TOP - 2 + dy * 0.2];
    k.tanganKanan = [MEJA_KIRI + 4, MEJA_TOP - 1 + dy * 0.2];
    return _b(k, null, meja(MEJA_KIRI, MEJA_KANAN, MEJA_TOP));
  }

  function RangkatLututDinding(t) {
    var k = kerangkaAngkatLutut(t), d = 22;
    k.sikuKiri = [(d + k.leher[0]) / 2, k.leher[1] + 8];
    k.tanganKiri = [d + 1, k.leher[1] + 6];
    return _b(k, null, dinding('kiri', d));
  }

  function RangkatTumit(t) {
    t = t === undefined ? 1 : t;
    var naik = lerp(62, 56, t), k = kerangkaBerdiri(60, naik);
    var lututY = lerp(86, 80, t), tumitY = lerp(FLOOR, 90, t);
    k.lututKiri = [56, lututY]; k.tumitKiri = [55, tumitY];
    k.lututKanan = [64, lututY]; k.tumitKanan = [65, tumitY];
    return _b(k, { lantaiY: FLOOR });
  }

  function RangkatTumitDinding(t) {
    t = t === undefined ? 1 : t;
    var k = kerangkaBerdiri(64, lerp(62, 56, t)), d = 26;
    var lututY = lerp(86, 80, t), tumitY = lerp(FLOOR, 90, t);
    k.lututKiri = [60, lututY]; k.tumitKiri = [59, tumitY];
    k.lututKanan = [68, lututY]; k.tumitKanan = [69, tumitY];
    k.sikuKiri = [(d + k.leher[0]) / 2, k.leher[1] + 10];
    k.tanganKiri = [d + 1, k.leher[1] + 8];
    return _b(k, { lantaiY: FLOOR }, dinding('kiri', d));
  }

  function RayunKaki(front) {
    return _b(kerangkaAyunKaki(front), null, dinding('kiri', DINDING_TANGAN));
  }

  function RtegakLenganSamping() {
    var k = kerangkaBerdiri(60, 62);
    k.sikuKiri = [50, 60]; k.tanganKiri = [38, 60];
    k.sikuKanan = [70, 60]; k.tanganKanan = [82, 60];
    return _b(k);
  }

  function RlenganKeAtas() {
    var k = kerangkaBerdiri(60, 62);
    k.sikuKiri = [54, 40]; k.tanganKiri = [56, 16];
    k.sikuKanan = [66, 40]; k.tanganKanan = [64, 16];
    return _b(k);
  }

  function Rbintang() {
    var k = kerangkaBerdiriLebar(60, 62, 22);
    k.sikuKiri = [50, 42]; k.tanganKiri = [44, 16];
    k.sikuKanan = [70, 42]; k.tanganKanan = [76, 16];
    return _b(k);
  }

  function Rjangkau() {
    var k = kerangkaBerdiri(60, 62);
    k.sikuKiri = [54, 40]; k.tanganKiri = [52, 20];
    k.sikuKanan = [66, 40]; k.tanganKanan = [68, 20];
    return _b(k);
  }

  function F(fn, a, b, c) { return a === undefined ? fn : function () { return fn(a, b, c); }; }

  var RAW = {
    squat: [F(Rjongkok, 0), F(Rjongkok, 0.35), F(Rjongkok, 0.7), F(Rjongkok, 1)],
    controlled_squat: [F(Rjongkok, 0), F(Rjongkok, 0.5), F(Rjongkok, 1), F(Rjongkok, 1)],
    squat_ramp: [F(Rjongkok, 0), F(Rjongkok, 0.3), F(Rjongkok, 0.6)],
    jump_squat: [F(Rjongkok, 0.6), F(Rjongkok, 0.2), Rtegak, Rtegak],
    glute_bridge: [F(Rtelentang, 0), F(Rtelentang, 0.5), F(Rtelentang, 1), F(Rtelentang, 0.3)],
    hip_thrust: [F(RhipThrust, 0), F(RhipThrust, 0.5), F(RhipThrust, 1)],
    glute_bridge_march: [F(Rtelentang, 0), F(Rtelentang, 1), F(RdeadBug, 0.5)],
    reverse_lunge: [Rtegak, F(Rlunge, 0.4), F(Rlunge, 1)],
    split_squat: [Rtegak, F(Rlunge, 0.5), F(Rlunge, 1)],
    lateral_lunge: [Rtegak, F(RlateralLunge, 0.5), F(RlateralLunge, 1)],
    wall_sit: [F(Rjongkok, 0), F(Rjongkok, 0.6), F(Rjongkok, 1)],
    sit_to_stand: [F(RsitToStand, 0), F(RsitToStand, 0.5), F(RsitToStand, 1)],
    step_up: [Rtegak, F(RstepUp, 0.5), F(RstepUp, 1)],
    pushup: [F(Rpushup, 0), F(Rpushup, 0.4), F(Rpushup, 0.8), F(Rpushup, 1)],
    wide_pushup: [F(Rpushup, 0), F(Rpushup, 0.5), F(Rpushup, 1)],
    incline_pushup: [F(RwallLean, 0), F(RwallLean, 0.5), F(RwallLean, 1)],
    wall_pushup: [F(RwallPushup, 0), F(RwallPushup, 0.5), F(RwallPushup, 1)],
    pike_pushup: [F(RpikePushup, 0), F(RpikePushup, 0.5), F(RpikePushup, 1)],
    plank: [F(Rplank, 0), F(Rplank, 0.5), F(Rplank, 1)],
    side_plank: [RsidePlankTurun, RsidePlank, RsidePlankTurun],
    superman: [F(Rtengkurap, 0), F(Rtengkurap, 0.5), F(Rtengkurap, 1), F(Rtengkurap, 0)],
    reverse_snow_angel: [F(Rtengkurap, 0), F(Rtengkurap, 0.5), F(Rtengkurap, 1)],
    prone_swimmer: [F(Rtengkurap, 0), F(Rtengkurap, 0.5), F(Rtengkurap, 1)],
    cat_cow: [F(Rmerangkak, 1, false, false), F(Rmerangkak, 0, false, false), F(Rmerangkak, -1, false, false)],
    bird_dog: [F(Rmerangkak, 0, false, false), F(Rmerangkak, 0, true, false), F(Rmerangkak, 0, true, true)],
    mountain_climber: [F(RmountainClimber, 0), F(RmountainClimber, 0.5), F(RmountainClimber, 1)],
    dead_bug: [F(RdeadBug, 0), F(RdeadBug, 0.5), F(RdeadBug, 1)],
    bicycle_crunch: [F(RbicycleCrunch, 0), F(RbicycleCrunch, 0.5), F(RbicycleCrunch, 1)],
    leg_raise: [F(RlegRaise, 0), F(RlegRaise, 0.5), F(RlegRaise, 1)],
    jumping_jack: [Rtegak, RtegakLenganSamping, Rbintang, RtegakLenganSamping],
    high_knees: [Rtegak, F(RangkatLutut, 0.5), F(RangkatLutut, 1)],
    march_in_place: [Rtegak, F(RangkatLutut, 0.35), F(RangkatLutut, 0.7)],
    slow_knee_raise: [Rtegak, F(RangkatLututDinding, 0.5), F(RangkatLututDinding, 1)],
    step_jack: [Rtegak, RtegakLenganSamping, Rbintang, Rtegak],
    step_touch: [F(RstepTouch, 0), F(RstepTouch, 0.5), F(RstepTouch, 1)],
    skater_step: [Rtegak, F(RlateralLunge, 0.5), F(RlateralLunge, 1)],
    burpee: [Rtegak, F(Rjongkok, 0.8), F(Rpushup, 0.6), Rtegak],
    light_walk: [Rtegak, F(RangkatLutut, 0.2), F(RangkatLutut, 0.4)],
    tricep_dips: [F(Rdips, 0), F(Rdips, 0.5), F(Rdips, 1)],
    standing_calf_raise: [Rtegak, F(RangkatTumitDinding, 0.5), F(RangkatTumitDinding, 1), Rtegak],
    joint_mobility: [Rtegak, RtegakLenganSamping, Rjangkau],
    thoracic_rotation: [Rtegak, RtegakLenganSamping, Rjangkau],
    leg_swing: [F(RayunKaki, -1), F(RayunKaki, 0), F(RayunKaki, 1)],
    ankle_circle: [F(RankleCircle, 0), F(RankleCircle, 0.33), F(RankleCircle, 0.66)],
    mobility_flow: [Rtegak, RtegakLenganSamping, Rjangkau],
    breathing: [Rduduk, F(RdudukNapas, true), Rduduk],
    cooldown_breathing: [Rduduk, F(RdudukNapas, true), Rduduk],
    upper_body_stretch: [Rtegak, RtegakLenganSamping, Rjangkau],
    hip_flexor_stretch: [Rtegak, F(Rlunge, 0.5), F(Rlunge, 1)],
    leg_back_stretch: [Rduduk, F(RdudukBungkuk, 0.5), F(RdudukBungkuk, 1)],
    static_full_stretch: [Rjangkau, F(RchildPose, 0.5), F(RchildPose, 1)],
    'default': [Rtegak, Rtegak, Rtegak]
  };

  function S(a, b, dur, ease) { return { a: a, b: b, dur: dur, ease: ease || 'io' }; }
  function H(idx, dur) { return { hold: idx, dur: dur }; }

  var GERAK = {
    squat: [S(0, 1, 300), S(1, 2, 350), S(2, 3, 350), H(3, 1000), S(3, 2, 350), S(2, 1, 350), S(1, 0, 300)],
    controlled_squat: [S(0, 1, 1400), S(1, 2, 1300), S(2, 3, 1300), S(3, 2, 700), S(2, 1, 700), S(1, 0, 600)],
    squat_ramp: [S(0, 1, 400), S(1, 2, 400), S(2, 1, 400), S(1, 0, 400)],
    jump_squat: [S(0, 1, 300), S(1, 2, 250), H(2, 200), S(2, 1, 200), S(1, 0, 250)],
    glute_bridge: [S(0, 1, 500), S(1, 2, 500), H(2, 2500), S(2, 3, 600), S(3, 0, 600)],
    hip_thrust: [S(0, 1, 500), S(1, 2, 500), H(2, 2000), S(2, 1, 500), S(1, 0, 500)],
    glute_bridge_march: [S(0, 1, 600), S(1, 2, 600), H(2, 1500), S(2, 1, 500), S(1, 0, 500)],
    reverse_lunge: [S(0, 1, 450), S(1, 2, 450), S(2, 1, 450), S(1, 0, 450)],
    split_squat: [S(0, 1, 450), S(1, 2, 450), S(2, 1, 450), S(1, 0, 450)],
    lateral_lunge: [S(0, 1, 450), S(1, 2, 450), S(2, 1, 450), S(1, 0, 450)],
    wall_sit: [S(0, 1, 800), S(1, 2, 800), H(2, 3000), S(2, 1, 600), S(1, 0, 600)],
    sit_to_stand: [S(0, 1, 600), S(1, 2, 600), H(2, 400), S(2, 1, 600), S(1, 0, 600)],
    step_up: [S(0, 1, 500), S(1, 2, 500), H(2, 400), S(2, 1, 600), S(1, 0, 600)],
    pushup: [S(0, 1, 350), S(1, 2, 350), S(2, 3, 300), S(3, 2, 300), S(2, 1, 350), S(1, 0, 350)],
    wide_pushup: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    incline_pushup: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    wall_pushup: [S(0, 1, 600), S(1, 2, 600), S(2, 1, 600), S(1, 0, 600)],
    pike_pushup: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    plank: [S(0, 1, 800), S(1, 2, 800), H(2, 1200), S(2, 1, 800), S(1, 0, 800)],
    side_plank: [S(0, 1, 600), H(1, 2500), S(1, 0, 600)],
    superman: [S(0, 1, 500), S(1, 2, 500), H(2, 2500), S(2, 3, 600), S(3, 0, 600)],
    reverse_snow_angel: [S(0, 1, 800), S(1, 2, 800), S(2, 1, 800), S(1, 0, 800)],
    prone_swimmer: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    cat_cow: [S(0, 1, 1600), S(1, 2, 1600), S(2, 1, 1600), S(1, 0, 1600)],
    bird_dog: [S(0, 1, 700), H(1, 2000), S(1, 2, 700), H(2, 2000), S(2, 1, 700), S(1, 0, 700)],
    mountain_climber: [S(0, 1, 250), S(1, 2, 250), S(2, 1, 250), S(1, 0, 250)],
    dead_bug: [S(0, 1, 700), S(1, 2, 700), S(2, 1, 700), S(1, 0, 700)],
    bicycle_crunch: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    leg_raise: [S(0, 1, 800), S(1, 2, 800), H(2, 300), S(2, 1, 1000), S(1, 0, 1000)],
    jumping_jack: [S(0, 1, 300), S(1, 2, 300), S(2, 3, 300), S(3, 0, 300)],
    high_knees: [S(0, 1, 250), S(1, 2, 250), S(2, 1, 250), S(1, 0, 250)],
    march_in_place: [S(0, 1, 350), S(1, 2, 350), S(2, 1, 350), S(1, 0, 350)],
    slow_knee_raise: [S(0, 1, 900), S(1, 2, 900), H(2, 2000), S(2, 1, 900), S(1, 0, 900)],
    step_jack: [S(0, 1, 400), S(1, 2, 400), S(2, 3, 400), S(3, 0, 400)],
    step_touch: [S(0, 1, 400), S(1, 2, 400), S(2, 1, 400), S(1, 0, 400)],
    skater_step: [S(0, 1, 400), S(1, 2, 400), S(2, 1, 400), S(1, 0, 400)],
    burpee: [S(0, 1, 500), S(1, 2, 450), S(2, 1, 450), S(1, 0, 500)],
    light_walk: [S(0, 1, 450), S(1, 2, 450), S(2, 1, 450), S(1, 0, 450)],
    tricep_dips: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    standing_calf_raise: [S(0, 1, 700), S(1, 2, 700), H(2, 600), S(2, 3, 900), S(3, 0, 1100)],
    joint_mobility: [S(0, 1, 700), S(1, 2, 700), S(2, 1, 700), S(1, 0, 700)],
    thoracic_rotation: [S(0, 1, 800), S(1, 2, 800), H(2, 2000), S(2, 1, 800), S(1, 0, 800)],
    leg_swing: [S(0, 1, 500), S(1, 2, 500), S(2, 1, 500), S(1, 0, 500)],
    ankle_circle: [S(0, 1, 600), S(1, 2, 600), S(2, 0, 600)],
    mobility_flow: [S(0, 1, 600), S(1, 2, 600), S(2, 1, 600), S(1, 0, 600)],
    breathing: [S(0, 1, 4000), H(1, 4000), S(1, 0, 7000)],
    cooldown_breathing: [S(0, 1, 4000), H(1, 7000), S(1, 0, 8000)],
    upper_body_stretch: [S(0, 1, 1000), S(1, 2, 1000), H(2, 2000), S(2, 1, 1000), S(1, 0, 1000)],
    hip_flexor_stretch: [S(0, 1, 800), S(1, 2, 800), H(2, 2000), S(2, 1, 800), S(1, 0, 800)],
    leg_back_stretch: [S(0, 1, 1000), S(1, 2, 1000), H(2, 2000), S(2, 0, 1200)],
    static_full_stretch: [S(0, 1, 1000), S(1, 2, 1000), H(2, 2500), S(2, 1, 1000), S(1, 0, 1000)],
    'default': [S(0, 1, 600), S(1, 2, 600), S(2, 1, 600), S(1, 0, 600)]
  };

  function durTimeline(seq) {
    var tot = 0;
    for (var i = 0; i < seq.length; i++) tot += seq[i].dur;
    return tot;
  }

  function ilustrasiDur(key) {
    var k = String(key || '').trim();
    return durTimeline(GERAK[k] || GERAK['default']);
  }

  // Properti penunjang statis (dinding/kursi/meja/undakan) untuk satu
  // latihan. Digabung dari SEMUA frame supaya objek penumpu tidak
  // menghilang saat pose berubah (mis. step_up: berdiri dulu baru
  // platform muncul; breathing: bangku harus selalu ada).
  var cacheProps = {};
  function ilustrasiProps(key) {
    var k = String(key || '').trim();
    if (cacheProps[k]) return cacheProps[k];
    var e = RAW[k] || RAW['default'];
    var seen = {}, out = '';
    for (var i = 0; i < e.length; i++) {
      var fr = e[i]();
      if (fr.props && !seen[fr.props]) { seen[fr.props] = true; out += fr.props; }
    }
    cacheProps[k] = out;
    return out;
  }

  // Interpolasi sendi antara dua frame.
  function interpRaw(A, B, t) {
    var k = {};
    for (var j in A.k) {
      if (A.k.hasOwnProperty(j)) {
        if (Array.isArray(A.k[j]) && Array.isArray(B.k[j])) k[j] = lerpPt(A.k[j], B.k[j], t);
        else k[j] = A.k[j];
      }
    }
    return { k: k, opts: B.opts || A.opts, props: A.props || '' };
  }

  function ilustrasiFrame(key, u) {
    var k = String(key || '').trim();
    var e = RAW[k] || RAW['default'];
    var seq = GERAK[k] || GERAK['default'];
    var total = durTimeline(seq);
    var t = ((u % 1) + 1) % 1 * total;
    var acc = 0, i, s, segT, ease, A, B, r;
    for (i = 0; i < seq.length; i++) {
      s = seq[i];
      if (t < acc + s.dur) {
        if (s.hold !== undefined) {
          r = e[s.hold]();
          return { body: isiKerangka(r.k, r.opts), props: r.props };
        }
        segT = (t - acc) / s.dur;
        ease = s.ease === 'in' ? easeInCubic : (s.ease === 'out' ? easeOutCubic : easeInOutCubic);
        segT = ease(segT);
        A = e[s.a](); B = e[s.b]();
        r = interpRaw(A, B, segT);
        return { body: isiKerangka(r.k, r.opts), props: r.props };
      }
      acc += s.dur;
    }
    r = e[e.length - 1]();
    return { body: isiKerangka(r.k, r.opts), props: r.props };
  }

  function tahapPose(key, n) {
    var e = GAMBAR[String(key || '').trim()] || GAMBAR['default'];
    var f = e[n] || e[0];
    return f();
  }

  function ilustrasi(key, muatDefs) {
    var isi = tahapPose(key, 0);
    return (muatDefs ? '<svg class="il-defs hidden">' + defsMarker('x') + '</svg>' : '') +
      svgBungkus(isi, 'Ilustrasi gerakan', 'il-ah-' + Math.floor(Math.random() * 1000));
  }

  function ilustrasiMulti(key) {
    var e = GAMBAR[String(key || '').trim()] || GAMBAR['default'];
    var captions = ['1. Mulai', '2. Gerak', '3. Bawah', '4. Kembali', '5. Ulang'];
    var frames = '';
    var i, f, isi;
    for (i = 0; i < e.length; i++) {
      f = e[i] || e[0];
      isi = f();
      frames += '<div class="il-step">' + svgBungkus(isi, 'Tahap ' + (i + 1), 'il-ah-f' + i) +
        '<span class="il-cap">' + (captions[i] || (i + 1) + '. Tahap') + '</span></div>';
    }
    var s1 = (e[0] || e[0])();
    return svgBungkus(s1, 'Posisi awal', 'il-ah-1') +
      '<figure class="il-multi">' + frames + '</figure>';
  }

  var api = {
    ilustrasi: ilustrasi,
    ilustrasiMulti: ilustrasiMulti,
    punya: function (key) { return Object.prototype.hasOwnProperty.call(GAMBAR, key); },
    ilustrasiFrame: ilustrasiFrame,
    ilustrasiDur: ilustrasiDur,
    ilustrasiProps: ilustrasiProps
  };

  if (typeof window !== 'undefined') {
    window.ilustrasi = api.ilustrasi;
    window.ilustrasiMulti = api.ilustrasiMulti;
    window.ilustrasiPunya = api.punya;
    window.ilustrasiFrame = api.ilustrasiFrame;
    window.ilustrasiDur = api.ilustrasiDur;
    window.ilustrasiProps = api.ilustrasiProps;
  } else {
    root.ilustrasi = api.ilustrasi;
    root.ilustrasiMulti = api.ilustrasiMulti;
    root.ilustrasiPunya = api.punya;
    root.ilustrasiFrame = api.ilustrasiFrame;
    root.ilustrasiDur = api.ilustrasiDur;
    root.ilustrasiProps = api.ilustrasiProps;
  }
})(typeof window !== 'undefined' ? window : globalThis);
