/* ================================================================
   ilustrasi.js -- ilustrasi gerakan latihan, SVG buatan sendiri.
   Ukuran viewBox 120x120 dengan margin 8px di setiap sisi
   ( area isi 104x104 ). Lantai di y=96.
   currentColor dipakai agar ikut tema gelap/terang.
   ================================================================ */

(function (root) {
  'use strict';

  var MARGIN = 8;
  var W = 120 - 2 * MARGIN;   // 104
  var H = 120 - 2 * MARGIN;   // 104
  var FLOOR = 96;             // di dalam area isi

  function g(isi) {
    return '<g class="il-g">' + isi + '</g>';
  }

  function garis(x1, y1, x2, y2, tebal) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke-width="' + (tebal || 3.2) + '"/>';
  }

  function rantai(pts, tebal) {
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length; i++) d += 'L' + pts[i][0] + ',' + pts[i][1];
    return '<path d="' + d + '" fill="none" stroke-width="' +
      (tebal || 3.2) + '"/>';
  }

  function kepala(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 8) +
      '" fill="none" stroke-width="' + 3.2 + '"/>';
  }

  function badan(x1, y1, x2, y2) {
    return garis(x1, y1, x2, y2, 3.2 + 1.2);
  }

  function lantai() {
    return '<line x1="' + MARGIN + '" y1="' + FLOOR + '" x2="' + (120 - MARGIN) + '" y2="' + FLOOR + '" />';
  }

  function panah(x1, y1, x2, y2) {
    return '<path class="il-arrow" d="M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2 +
      '" marker-end="url(#il-arrowhead)"/>';
  }

  function pose(bagian, opsi) {
    opsi = opsi || {};
    var s = lantai() + g(bagian.filter(Boolean).join(''));
    if (opsi.panah) s += opsi.panah;
    return s;
  }

  /* ---- Standar tubuh berdiri (panggul di (60,FLOOR), bahu di (60,30)) ---- */
  function orang(px, py, bx, by, kaki, lengan) {
    return [
      badan(px, py, bx, by),
      kepala(bx + (bx - px) * 0.16, by - 8 - 3.2),
      rantai(kaki),
      rantai(lengan[0], 3.2 - 0.8),
      rantai(lengan[1], 3.2 - 0.8),
    ];
  }

  /* ---- Bentuk per kelompok ---- */

  /* Berdiri tegak */
  function tegap(v) {
    v = v || {};
    var kiri = v.kakiKiri || [[52, 58], [48, 80], [44, 96]];
    var kanan = v.kakiKanan || [[52, 58], [56, 80], [60, 96]];
    var lk = v.lenganKiri || [[52, 28], [44, 44], [42, 60]];
    var lkn = v.lenganKanan || [[52, 28], [58, 44], [60, 60]];
    return pose(orang(52, 58, 52, 28, kiri, [lk, lkn]), v.panah ? { panah: v.panah } : null);
  }

  /* Jongkok */
  function jongkok(dalam) {
    dalam = dalam || 0;
    var py = 58 + dalam;
    return pose([
      badan(52, py, 50, 32 + Math.round(dalam / 2)),
      kepala(50, 32 + Math.round(dalam / 2) - 8 - 3.2),
      rantai([[52, py], [46, py - 20], [46, 32 + Math.round(dalam / 2)]]),
      rantai([[52, py], [36 + dalam * 0.3, py + 2], [40, 96]]),
      rantai([[52, py], [64 - dalam * 0.3, py + 2], [60, 96]]),
      rantai([[50, 36], [44, 52], [38, 64]], 3.2 - 0.8),
      rantai([[50, 36], [56, 52], [62, 64]], 3.2 - 0.8),
    ], { panah: panah(76, 68, 76, 84) });
  }

  /* Lunge */
  function lunge(arah) {
    arah = arah || 1;
    var px = 52;
    var py = 62;
    return pose([
      badan(px, py, px + 2, 34),
      kepala(px + 2, 34 - 8 - 3.2),
      rantai([[px, py], [px - 16 * arah, py + 3], [px - 20 * arah, 96]]),
      rantai([[px, py], [px + 18 * arah, py + 2], [px + 24 * arah, 92], [px + 30 * arah, 96]]),
      rantai([[px + 2, 38], [px - 8, 54], [px - 10, 64]], 3.2 - 0.8),
      rantai([[px + 2, 38], [px + 12, 54], [px + 14, 64]], 3.2 - 0.8),
    ], { panah: panah(px + 28 * arah, 78, px + 28 * arah, 92) });
  }

  /* Push up */
  function pushup(turun) {
    var b = turun ? 10 : 0;
    return pose([
      badan(36, 44 + b, 88, 64),
      kepala(32, 40 + b),
      rantai([[34, 46 + b], [28, 72 + b / 2], [24, 96]]),
      rantai([[38, 50 + b], [44, 74 + b / 2], [42, 96]]),
      rantai([[88, 64], [96, 80], [98, 96]]),
      rantai([[88, 64], [100, 82], [104, 96]]),
    ], { panah: panah(74, 38 + b, 74, 26) });
  }

  /* Plank */
  function plank() {
    return pose([
      badan(36, 50, 90, 64),
      kepala(32, 45),
      rantai([[34, 52], [28, 76], [22, 96]]),
      rantai([[38, 54], [44, 78], [40, 96]]),
      rantai([[90, 64], [98, 82], [100, 96]]),
      rantai([[90, 64], [102, 84], [106, 96]]),
    ]);
  }

  /* Berbaring telentang */
  function telentang(angkatPinggul) {
    var l = 88;
    var pinggulY = angkatPinggul ? l - 14 : l;
    return pose([
      badan(38, l, 32, l),
      kepala(22, l - 8),
      rantai([[38, l], [70, pinggulY], [84, l + 2], [96, l + 2]]),
      rantai([[38, l], [68, pinggulY - 2], [82, l - 4], [94, l - 4]]),
      rantai([[36, l - 6], [48, l - 18], [56, l - 24]], 3.2 - 0.8),
      rantai([[36, l - 4], [44, l - 2], [54, l - 2]], 3.2 - 0.8),
    ], angkatPinggul ? { panah: panah(72, pinggulY + 16, 72, pinggulY + 4) } : null);
  }

  /* Berbaring tengkurap */
  function tengkurap(angkat) {
    var l = 86;
    var naik = angkat ? 8 : 0;
    return pose([
      badan(44, l, 86, l),
      kepala(88, l - 8 - naik),
      rantai([[44, l], [22, l - 2 - naik], [8, l - 6 - naik]], 3.2 - 0.8),
      rantai([[82, l], [96, l - 2 - naik], [110, l - 8 - naik]]),
      rantai([[82, l + 2], [96, l + 2], [110, l - 4]], 3.2 - 0.8),
    ], angkat ? { panah: panah(78, l - 22, 78, l - 14) } : null);
  }

  /* Empat tihor / pole positions */
  function empatTitik(bulat) {
    var back = bulat ? 44 : 60;
    return pose([
      badan(42, 60, 88, back),
      kepala(94, back - 8),
      rantai([[42, 60], [38, 74], [42, 96]]),
      rantai([[40, 60], [86, back + 4], [90, 74], [88, 96]]),
      rantai([[92, back + 10], [88, 76], [90, 96]], 3.2 - 0.8),
    ], { panah: panah(68, back - 16, 68, back - 10) });
  }

  /* Duduk menghadap depan */
  function duduk() {
    return pose([
      badan(52, 62, 52, 38),
      kepala(52, 38 - 8 - 3.2),
      rantai([[52, 62], [38, 78], [30, 96]]),
      rantai([[52, 62], [66, 78], [74, 96]]),
      rantai([[52, 46], [44, 56], [46, 62]], 3.2 - 0.8),
      rantai([[52, 46], [60, 56], [58, 62]], 3.2 - 0.8),
    ]);
  }

  /* ---- Peta gerakan -> pose ---- */

  /* Setiap entri: [poseAwal, poseAkhir]. Dua tahap ditampilkan berdampingan.
     Fungsi saja (tanpa argumen) diambil sebagai pose pertama. */
  var GAMBAR = {
    squat: [jongkok.bind(null, 0), jongkok.bind(null, 16)],
    controlled_squat: [jongkok.bind(null, 2), jongkok.bind(null, 16)],
    squat_ramp: [jongkok.bind(null, 0), jongkok.bind(null, 8)],
    jump_squat: [jongkok.bind(null, 12), tegap],

    glute_bridge: [telentang.bind(null, false), telentang.bind(null, true)],
    hip_thrust: [telentang.bind(null, false), telentang.bind(null, true)],
    glute_bridge_march: [telentang.bind(null, true), telentang.bind(null, true)],

    reverse_lunge: [tegap, lunge.bind(null, 1)],
    split_squat: [tegap, lunge.bind(null, 1)],
    lateral_lunge: [tegap, lunge.bind(null, 1)],

    wall_sit: [jongkok.bind(null, 6), jongkok.bind(null, 12)],
    sit_to_stand: [duduk, tegap],
    step_up: [tegap, lunge.bind(null, -1)],

    pushup: [pushup.bind(null, false), pushup.bind(null, true)],
    wide_pushup: [pushup.bind(null, false), pushup.bind(null, true)],
    incline_pushup: [pushup.bind(null, false), pushup.bind(null, true)],
    wall_pushup: [tegap, pushup.bind(null, true)],
    pike_pushup: [pushup.bind(null, false), pushup.bind(null, true)],

    plank: [plank, plank],
    side_plank: [plank, plank],
    superman: [tengkurap.bind(null, false), tengkurap.bind(null, true)],
    reverse_snow_angel: [tengkurap.bind(null, false), tengkurap.bind(null, true)],
    prone_swimmer: [tengkurap.bind(null, false), tengkurap.bind(null, true)],

    cat_cow: [empatTitik.bind(null, false),empatTitik.bind(null, true)],
    bird_dog: [empatTitik.bind(null, false),empatTitik.bind(null, true)],
    mountain_climber: [empatTitik.bind(null, false),empatTitik.bind(null, true)],
    dead_bug: [telentang.bind(null, false), telentang.bind(null, true)],
    bicycle_crunch: [telentang.bind(null, false), telentang.bind(null, true)],
    leg_raise: [telentang.bind(null, false), telentang.bind(null, true)],

    jumping_jack: [tegap, tegap],
    high_knees: [tegap, lunge.bind(null, 1)],
    march_in_place: [tegap, lunge.bind(null, 1)],
    slow_knee_raise: [tegap, lunge.bind(null, 1)],
    step_jack: [tegap, lunge.bind(null, 1)],
    step_touch: [tegap, lunge.bind(null, 1)],
    skater_step: [tegap, lunge.bind(null, 1)],
    burpee: [tegap, jongkok.bind(null, 14)],

    light_walk: [tegap, lunge.bind(null, 1)],

    tricep_dips: [duduk, duduk],
    standing_calf_raise: [tegap, tegap],

    joint_mobility: [tegap, tegap],
    leg_swing: [tegap, lunge.bind(null, 1)],
    ankle_circle: [duduk, duduk],
    mobility_flow: [tegap, tegap],

    breathing: [duduk, duduk],
    cooldown_breathing: [duduk, duduk],
    upper_body_stretch: [tegap, tegap],
    hip_flexor_stretch: [tegap, lunge.bind(null, 1)],
    leg_back_stretch: [duduk, duduk],
    static_full_stretch: [duduk, duduk],

    'default': [tegap, tegap],
  };

  function tahapPose(key, n) {
    var e = GAMBAR[String(key || '').trim()] || GAMBAR['default'];
    var f = e[n] || e[0];
    return f();
  }

  function svgBungkus(isi, label) {
    return '<svg class="il-svg" viewBox="0 0 120 120" role="img" aria-label="' +
      label + '" preserveAspectRatio="xMidYMid meet">' + isi + '</svg>';
  }

  /* Publik */

  function ilustrasi(key, muatDefs) {
    var isi = tahapPose(key, 0);
    return (muatDefs ? defs() : '') + svgBungkus(isi, 'Ilustrasi gerakan');
  }

  function ilustrasiMulti(key) {
    var s1 = tahapPose(key, 0);
    var s2 = tahapPose(key, 1);
    return defs() +
      '<figure class="il-multi">' +
        '<div class="il-step">' + svgBungkus(s1, 'Posisi awal') + '<span class="il-cap">1. Mulai</span></div>' +
        '<div class="il-step">' + svgBungkus(s2, 'Posisi gerakan') + '<span class="il-cap">2. Gerak</span></div>' +
      '</figure>';
  }

  function defs() {
    return '<svg class="il-defs" aria-hidden="true" focusable="false">' +
      '<defs>' +
      '<marker id="il-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 z" class="il-arrowhead"/>' +
      '</marker>' +
      '</defs></svg>';
  }

  if (typeof window !== 'undefined') {
    window.ilustrasi = ilustrasi;
    window.ilustrasiMulti = ilustrasiMulti;
    window.ilustrasiPunya = function (key) {
      return Object.prototype.hasOwnProperty.call(GAMBAR, key);
    };
  } else {
    global.ilustrasi = ilustrasi;
    global.ilustrasiMulti = ilustrasiMulti;
    global.ilustrasiPunya = function (key) {
      return Object.prototype.hasOwnProperty.call(GAMBAR, key);
    };
  }
})(typeof window !== 'undefined' ? window : this);