/* ================================================================
   ilustrasi.js -- ilustrasi gerakan latihan, SVG buatan sendiri.

   Kenapa bukan foto: aplikasi ini harus tetap jalan tanpa internet
   setelah dimuat, dan 51 foto akan membuat folder jauh lebih besar.
   Gambar di sini memakai garis dan lingkaran, jadi ukurannya hanya
   beberapa KB, ikut warna tema (currentColor), dan tetap tajam di
   layar densitas tinggi.

   Tahap: (1) posisi awal, (2) posisi gerakan. Dua gambar berdampingan
   lebih mudah dipahami daripada satu gambar diam yang ambigu.
   Nomor tahap kecil ada di sudut supaya urutannya jelas.

   Cara pakai:
       ilustrasi('./ilustrasi.js', 'squat')   -> string SVG
       ilustrasiMulti('squat')                -> dua tahap + label

   Kunci yang belum punya gambar khusus memakai bentuk dasar dari
   kelompoknya, jadi tidak pernah kosong.
   ================================================================ */

(function (root) {
  'use strict';

  /* Anatomi dasar. Satuan px pada viewBox 120x120, lantai di y=104. */
  var FLOOR = 104;
  var KEPALA_R = 8;
  var GURU = 3.2; // tebal garis badan utama

  function g(isi) {
    return '<g class="il-g">' + isi + '</g>';
  }

  /* ---- Pembentuk bagian tubuh ---- */
  function garis(x1, y1, x2, y2, tebal) {
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
      '" stroke-width="' + (tebal || GURU) + '"/>';
  }

  /* Rantai sambungan: serangkaian titik [x,y] dihubungkan. */
  function rantai(pts, tebal) {
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 1; i < pts.length; i++) d += 'L' + pts[i][0] + ',' + pts[i][1];
    return '<path d="' + d + '" fill="none" stroke-width="' +
      (tebal || GURU) + '"/>';
  }

  function kepala(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || KEPALA_R) +
      '" fill="none" stroke-width="' + GURU + '"/>';
  }

  /* Badan: garis punggung dari panggul ke bahu. */
  function badan(x1, y1, x2, y2) {
    return garis(x1, y1, x2, y2, GURU + 1.2);
  }

  /* Garis bantu lantai, memberi konteks tanpa jadi pusat perhatian. */
  function lantai() {
    return '<line class="il-floor" x1="8" y1="' + FLOOR + '" x2="112" y2="' +
      FLOOR + '" />';
  }

  /* Arah gerak. Panah punya garis tepi sendiri supaya tidak
     menumpang aturan stroke-isi yang dipakai badan. */
  function panah(x1, y1, x2, y2) {
    return '<path class="il-arrow" d="M' + x1 + ',' + y1 + 'L' + x2 + ',' + y2 +
      '" marker-end="url(#il-arrowhead)"/>';
  }

  /* ---- Pose tubuh ringkas ---- */
  /* Menyusun gambar dari daftar bagian supaya tiap pose cukup satu
     baris. Semua pose bertumpu di lantai kecuali yang berbaring. */
  function pose(bagian, opsi) {
    opsi = opsi || {};
    var s = lantai() + g(bagian.filter(Boolean).join(''));
    if (opsi.panah) s += opsi.panah;
    return s;
  }

  /* Pose berdiri: pangkal panggul di (px,py), bahu (bx,by). */
  function orang(px, py, bx, by, kaki, lengan) {
    return [
      badan(px, py, bx, by),
      kepala(bx + (bx - px) * 0.16, by - KEPALA_R - 2),
      rantai(kaki),
      rantai(lengan[0], GURU - 0.8),
      rantai(lengan[1], GURU - 0.8),
    ];
  }

  /* ---- Bentuk per kelompok ---- */
  var BENTUK = {};

  /* Berdiri tegak dengan variasi. params: {lengan, kaki} */
  function tegap(v) {
    v = v || {};
    var kiri = v.kakiKiri || [[60, 62], [56, 84], [52, 104]];
    var kanan = v.kakiKanan || [[60, 62], [64, 84], [68, 104]];
    var lk = v.lenganKiri || [[60, 30], [48, 46], [46, 62]];
    var lkn = v.lenganKanan || [[60, 30], [72, 46], [74, 62]];
    return pose(orang(60, 62, 60, 30, kiri, [lk, lkn]), v.panah ? { panah: v.panah } : null);
  }

  /* Jongkok: panggul turun, lutut menekuk ke depan. */
  function jongkok(dalam) {
    dalam = dalam || 0;
    var py = 62 + dalam;
    return pose([
      badan(60, py, 58, 30 + Math.round(dalam / 2)),
      kepala(58, 30 + Math.round(dalam / 2) - KEPALA_R - 2),
      rantai([[60, py], [58, py - 24], [58, 30 + Math.round(dalam / 2)]]), // punggung tambahan
      rantai([[60, py], [40 + dalam * 0.4, py + 2], [44, 104]]),
      rantai([[60, py], [80 - dalam * 0.4, py + 2], [76, 104]]),
      rantai([[58, 34], [52, 52], [44, 64]], GURU - 0.8),
      rantai([[58, 34], [64, 52], [72, 64]], GURU - 0.8),
    ], { panah: panah(84, 70, 84, 86) });
  }

  /* Lunge: satu kaki depan, satu kaki belakang. */
  function lunge(arah) {
    arah = arah || 1;
    var px = 60;
    var py = 66;
    return pose([
      badan(px, py, px + 2, 32),
      kepala(px + 2, 32 - KEPALA_R - 2),
      rantai([[px, py], [px - 18 * arah, py + 4], [px - 22 * arah, 104]]),
      rantai([[px, py], [px + 20 * arah, py + 2], [px + 26 * arah, 96], [px + 32 * arah, 104]]),
      rantai([[px + 2, 36], [px - 10, 50], [px - 12, 62]], GURU - 0.8),
      rantai([[px + 2, 36], [px + 14, 50], [px + 16, 62]], GURU - 0.8),
    ], { panah: panah(px + 30 * arah, 78, px + 30 * arah, 94) });
  }

  /* Push up: badan miring, tangan ke lantai. */
  function pushup(turun) {
    var b = turun ? 12 : 0;
    return pose([
      // badan dari bahu (34,46+b) ke panggul/pinggul naik
      badan(34, 46 + b, 92, 66),
      kepala(30, 42 + b),
      rantai([[32, 48 + b], [26, 74 + b / 2], [22, 104]]), // lengan
      rantai([[40, 50 + b], [46, 76 + b / 2], [44, 104]]),
      rantai([[92, 66], [100, 84], [102, 104]]), // kaki
      rantai([[92, 66], [104, 86], [108, 104]]),
    ], { panah: panah(76, 40 + b, 76, 28) });
  }

  /* Plank gaya papan. */
  function plank() {
    return pose([
      badan(34, 52, 94, 66),
      kepala(30, 47),
      rantai([[32, 54], [26, 78], [20, 104]]),
      rantai([[40, 56], [46, 80], [42, 104]]),
      rantai([[94, 66], [102, 84], [104, 104]]),
      rantai([[94, 66], [106, 86], [110, 104]]),
      '<line class="il-rule" x1="28" y1="52" x2="100" y2="70" />',
    ]);
  }

  /* Berbaring telentang: punggung di lantai. */
  function telentang(angkatPinggul) {
    var l = FLOOR - 12;
    var pinggulY = angkatPinggul ? l - 16 : l;
    return pose([
      badan(40, l, 34, l), // dobel tipis, membuat garis punggung stabil
      kepala(24, l - 8),
      rantai([[40, l], [72, pinggulY], [86, l + 2], [98, l + 2]]),
      rantai([[40, l], [70, pinggulY - 2], [84, l - 4], [96, l - 4]]),
      rantai([[38, l - 6], [50, l - 18], [58, l - 24]], GURU - 0.8),
      rantai([[38, l - 4], [46, l - 2], [56, l - 2]], GURU - 0.8),
    ], angkatPinggul ? { panah: panah(74, pinggulY + 18, 74, pinggulY + 4) } : null);
  }

  /* Berbaring tengkurap, kepala di kanan. */
  function tengkurap(angkat) {
    var l = FLOOR - 14;
    var naik = angkat ? 10 : 0;
    return pose([
      badan(46, l, 88, l),
      kepala(92, l - 8 - naik),
      rantai([[46, l], [24, l - 2 - naik], [10, l - 6 - naik]], GURU - 0.8),
      rantai([[86, l], [100, l - 2 - naik], [112, l - 8 - naik]]),
      rantai([[86, l + 2], [100, l + 2], [112, l - 4]], GURU - 0.8),
    ], angkat ? { panah: panah(80, l - 24, 80, l - 14) } : null);
  }

  /* Berlutut empat titik: punggung horizontal. */
  function empatTitik(bulat) {
    var back = bulat ? 46 : 62;
    return pose([
      badan(44, 62, 92, back),
      kepala(98, back - 8),
      rantai([[44, 62], [40, 76], [44, 104]]),
      rantai([[42, 62], [88, back + 4], [92, 76], [90, 104]]),
      rantai([[94, back + 12], [90, 78], [92, 104]], GURU - 0.8),
    ], { panah: panah(70, back - 18, 70, back - 12) });
  }

  /* Duduk menghadap depan (pernapasan, peregangan). */
  function duduk() {
    return pose([
      badan(60, 66, 60, 40),
      kepala(60, 40 - KEPALA_R - 2),
      rantai([[60, 66], [44, 82], [34, 104]]),
      rantai([[60, 66], [76, 82], [86, 104]]),
      rantai([[60, 44], [50, 58], [52, 66]], GURU - 0.8),
      rantai([[60, 44], [70, 58], [68, 66]], GURU - 0.8),
    ]);
  }

  /* ---- Peta gerakan -> pose ---- */
  /* Setiap entri: [tahap1, tahap2]. Bisa juga fungsi satu tahap. */
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

    cat_cow: [empatTitik.bind(null, false), empatTitik.bind(null, true)],
    bird_dog: [empatTitik.bind(null, false), empatTitik.bind(null, true)],
    mountain_climber: [empatTitik.bind(null, false), empatTitik.bind(null, true)],
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

    /* cadangan untuk kunci yang ditambahkan nanti */
    'default': [tegap, tegap],
  };

  function tahapPose(key, n) {
    var e = GAMBAR[key] || GAMBAR['default'];
    var f = e[n] || e[0];
    return f();
  }

  function svgBungkus(isi, label) {
    return '<svg class="il-svg" viewBox="0 0 120 120" role="img" aria-label="' +
      label + '" preserveAspectRatio="xMidYMid meet">' + isi + '</svg>';
  }

  /* Asal-usul panah. Satu <defs> per daftar sudah cukup; kolom
     tidak perlu memuat ulang untuk setiap kartu. */
  var DEFS_ID = 'il-defs';
  function defs() {
    return '<svg class="il-defs" aria-hidden="true" focusable="false">' +
      '<defs>' +
      '<marker id="il-arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0,0 L10,5 L0,10 z" class="il-arrowhead"/>' +
      '</marker>' +
      '</defs></svg>';
  }

  /* Publik ---- */

  /* sarankanSemua = true kalau belum ada SVG panah di halaman;
     fungsi ini menyisipkan SVG <defs> kecil di awal penanda. */
  function ilustrasi(key, muatDefs) {
    var isi = tahapPose(String(key || '').trim(), 0);
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

  root.ilustrasi = ilustrasi;
  root.ilustrasiMulti = ilustrasiMulti;
  root.ilustrasiPunya = function (key) { return Object.prototype.hasOwnProperty.call(GAMBAR, key); };
})(typeof window !== 'undefined' ? window : this);
