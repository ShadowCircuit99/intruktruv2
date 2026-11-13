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

  /* Gambar kerangka menjadi SVG.
     opts: { lantai:true, bayangan:true, panah:[{...}] } */
  function gambarKerangka(k, opts) {
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

    return pose(out.join(''));
  }

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
     ================================================================ */

  function kerangkaAyunKaki(front) {
    front = front || 0;
    var px = 58;
    var k = kerangkaBerdiri(px, 60);
    // kaki kanan diayun
    var sudut = front > 0 ? 15 : (front < 0 ? -35 : 0);
    var lutut = ujung([px, 60], 24, 90 - sudut);
    var tumit = ujung(lutut, 24, 88 - sudut);
    k.lututKanan = lutut;
    k.tumitKanan = tumit;
    return k;
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

  function ayunKaki(front) { return gambarKerangka(kerangkaAyunKaki(front)); }

  function duduk(mode) {
    return gambarKerangka(kerangkaDuduk(56, 74, mode || {}));
  }

  function stepTouchPose(t) { return gambarKerangka(kerangkaStepTouch(t)); }

  /* ================================================================
     POSE TAMBAHAN (dips, wall pushup, pike, superman variant,
     side plank, mountain climber, dead bug, bicycle, leg raise)
     ================================================================ */

  function dips(t) {
    t = t === undefined ? 0 : t;
    var bangkuY = 70;            // tepi bangku (lantai atas)
    var bangkuKiri = 66, bangkuKanan = 92;
    var dy = lerp(0, 8, t);      // badan turun saat siku menekuk
    // Bahu & kepala di atas pinggul, badan condong sedikit ke depan
    var bahuY = bangkuY - 26 + dy;
    var bahuX = 60;
    var k = {
      // pinggul di tepi depan bangku
      pinggul: [bangkuKiri - 2, bangkuY - 2 + dy * 0.9],
      leher: [bahuX + 2, bahuY],
      kepala: [bahuX + 4, bahuY - 8],
      bahuKiri: [bahuX, bahuY + 1],
      bahuKanan: [bahuX + 2, bahuY + 1],
      // tangan menggenggam tepi bangku di belakang pinggul
      sikuKiri: [bangkuKiri - 8, bangkuY - 10 + dy * 0.6],
      tanganKiri: [bangkuKiri - 2, bangkuY],
      sikuKanan: [bangkuKiri - 6, bangkuY - 8 + dy * 0.6],
      tanganKanan: [bangkuKiri, bangkuY],
      // kaki lurus ke depan, tumit di lantai
      lututKiri: [bangkuKanan + 2, bangkuY + 6 + dy * 0.3],
      tumitKiri: [104, FLOOR],
      lututKanan: [bangkuKanan + 4, bangkuY + 8 + dy * 0.3],
      tumitKanan: [106, FLOOR]
    };
    // gambar bangku (persegi panjang di belakang)
    var bangku = retangulo([[bangkuKiri, bangkuY], [bangkuKanan, bangkuY]], STROKE) +
      linha(bangkuKiri, bangkuY, bangkuKiri, FLOOR, STROKE) +
      linha(bangkuKanan, bangkuY, bangkuKanan, FLOOR, STROKE);
    return gambarKerangka(k, { lantai: true, panah: null }) + bangku;
  }

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
    return gambarKerangka(k) + linha(88, 32, 88, FLOOR, 2);
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
    return gambarKerangka(k);
  }

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
    return gambarKerangka(k) + linha(88, 34, 88, FLOOR, 2);
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
    hip_thrust: [telentang.bind(null, 0), telentang.bind(null, 0.5), telentang.bind(null, 1)],
    glute_bridge_march: [telentang.bind(null, 0), telentang.bind(null, 1), deadBug.bind(null, 0.5)],

    // --- LUNGE & VARIASI ---
    reverse_lunge: [tegak, lunge.bind(null, 0.4), lunge.bind(null, 1)],
    split_squat: [tegak, lunge.bind(null, 0.5), lunge.bind(null, 1)],
    lateral_lunge: [tegak, lateralLunge.bind(null, 0.5), lateralLunge.bind(null, 1)],

    // --- WALL SIT, SIT-TO-STAND, STEP UP ---
    wall_sit: [jongkok.bind(null, 0), jongkok.bind(null, 0.6), jongkok.bind(null, 1)],
    sit_to_stand: [duduk, jongkok.bind(null, 0.5), tegak],
    step_up: [tegak, angkatLutut.bind(null, 0.5), angkatLutut.bind(null, 1)],

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
    slow_knee_raise: [tegak, angkatLutut.bind(null, 0.5), angkatLutut.bind(null, 1)],
    step_jack: [tegak, tegakLenganSamping, bintang, tegak],
    step_touch: [stepTouchPose.bind(null, 0), stepTouchPose.bind(null, 0.5), stepTouchPose.bind(null, 1)],
    skater_step: [tegak, lateralLunge.bind(null, 0.5), lateralLunge.bind(null, 1)],
    burpee: [tegak, jongkok.bind(null, 0.8), pushup.bind(null, 0.6), tegak],

    // --- JALAN SANTAI ---
    light_walk: [tegak, angkatLutut.bind(null, 0.2), angkatLutut.bind(null, 0.4)],

    // --- OTOT & MOBILITAS ---
    tricep_dips: [dips.bind(null, 0), dips.bind(null, 0.5), dips.bind(null, 1)],
    standing_calf_raise: [tegak, angkatTumit.bind(null, 0.5), angkatTumit.bind(null, 1), tegak],

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
    static_full_stretch: [tegak, jangkau, dudukBungkuk.bind(null, 1)],

    'default': [tegak, tegak, tegak]
  };

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
    punya: function (key) { return Object.prototype.hasOwnProperty.call(GAMBAR, key); }
  };

  if (typeof window !== 'undefined') {
    window.ilustrasi = api.ilustrasi;
    window.ilustrasiMulti = api.ilustrasiMulti;
    window.ilustrasiPunya = api.punya;
  } else {
    root.ilustrasi = api.ilustrasi;
    root.ilustrasiMulti = api.ilustrasiMulti;
    root.ilustrasiPunya = api.punya;
  }
})(typeof window !== 'undefined' ? window : globalThis);
