/* ================================================================
   animasi.js -- animasi SVG latihan.
   Memakai ilustrasiFrame/ilustrasiDur dari ilustrasi.js untuk
   menggerakkan <g class="il-g"> pada kartu latihan yang terbuka.

   Aturan:
   - Animasi hanya berjalan saat satu kartu latihan terbuka.
   - Jika reduce-motion aktif, fallback ke frame statis.
   - Hanya update node <g class="il-g">, tidak meng-inject ulang
     seluruh SVG.
   - Saat kartu ditutup, rAF di-cancel dan SVG statis dikembalikan.
   ================================================================ */
(function (root) {
  'use strict';

  var reduceMotion = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // State satu animasi aktif (satu kartu pada satu waktu).
  var state = null;

  function markerId() { return 'il-arrowhead'; }

  // Bangun SVG tunggal: defs + properti statis + <g class="il-g"> kosong.
  function buildLiveSVG(key) {
    var uid = markerId();
    var defs = '<marker id="' + uid + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker>';
    var props = (root.ilustrasiProps && root.ilustrasiProps(key)) || '';
    return {
      html: '<svg class="il-svg il-live" viewBox="0 0 120 120" role="img" aria-label="Ilustrasi gerakan" preserveAspectRatio="xMidYMid meet">' +
        '<defs>' + defs + '</defs>' +
        '<g class="il-hias">' + props + '</g>' +
        '<g class="il-g"></g></svg>'
    };
  }

  // Simpan HTML statis (flipbook) supaya bisa dikembalikan saat tutup.
  function simpanStatis(card) {
    if (!card._ilStaticHTML) {
      var il = card.querySelector('.il-illustration');
      if (il) card._ilStaticHTML = il.innerHTML;
    }
  }

  function pulihkan(card) {
    if (!card) return;
    var il = card.querySelector('.il-illustration');
    if (il && card._ilStaticHTML) il.innerHTML = card._ilStaticHTML;
  }

  function hentikan() {
    if (state) {
      if (state.raf) root.cancelAnimationFrame(state.raf);
      pulihkan(state.card);
      state = null;
    }
  }

  // Mulai animasi untuk satu kartu. Berhentikan animasi sebelumnya.
  function mulai(card, key) {
    hentikan();
    if (reduceMotion || !root.ilustrasiFrame || !card) return;
    simpanStatis(card);
    var il = card.querySelector('.il-illustration');
    if (!il) return;
    var built = buildLiveSVG(key);
    il.innerHTML = built.html;
    var g = il.querySelector('.il-g');
    if (!g) { pulihkan(card); return; }
    var dur = root.ilustrasiDur(key) || 2000;
    var t0 = root.performance ? root.performance.now() : Date.now();
    var raf;
    function tick(now) {
      var t = (now - t0) / dur;
      var u = t - Math.floor(t); // u ∈ [0,1)
      var f = root.ilustrasiFrame(key, u);
      g.innerHTML = f.body;
      raf = root.requestAnimationFrame(tick);
    }
    raf = root.requestAnimationFrame(tick);
    state = { raf: raf, card: card, key: key };
  }

  // Hentikan animasi kartu tertentu (dipanggil saat kartu ditutup).
  function hentikanKartu(card) {
    if (state && state.card === card) hentikan();
    else if (card) pulihkan(card);
  }

  // Hentikan semua animasi (dipanggil saat daftar latihan di-render ulang).
  function hentikanSemua() {
    hentikan();
  }

  // Jeda saat tab tersembunyi, lanjutkan saat kembali.
  function onVisibility() {
    if (root.document && root.document.hidden) {
      if (state && state.raf) { root.cancelAnimationFrame(state.raf); state.raf = null; }
    } else if (state && !state.raf) {
      var g = state.card ? state.card.querySelector('.il-g') : null;
      if (g) {
        var dur = root.ilustrasiDur(state.key) || 2000;
        var t0 = root.performance ? root.performance.now() : Date.now();
        var raf;
        function tick(now) {
          var t = (now - t0) / dur;
          var u = t - Math.floor(t);
          g.innerHTML = root.ilustrasiFrame(state.key, u).body;
          raf = root.requestAnimationFrame(tick);
        }
        raf = root.requestAnimationFrame(tick);
        state.raf = raf;
      }
    }
  }

  if (root.document && root.document.addEventListener) {
    root.document.addEventListener('visibilitychange', onVisibility);
  }

  // API
  root.animasiMulai = mulai;
  root.animasiBerhenti = hentikanKartu;
  root.animasiStopAll = hentikanSemua;
})(typeof window !== 'undefined' ? window : globalThis);
