/* ============================================================
   utils.js — Keamanan, validasi, dan helper UX
   Dipakai oleh script.js dan notif.js
   ============================================================ */

/* ---- XSS Prevention ---- */
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---- Input Validation ---- */
function validasiNama(nama) {
  const clean = nama.trim();
  return clean.length >= 2 && /^[a-zA-Z\u00C0-\u024F\s\-\.]+$/.test(clean);
}

function validasiAngka(val, min, max, label) {
  label = label || 'Input';
  var num = parseFloat(val);
  if (isNaN(num)) return { valid: false, msg: label + ' harus berupa angka.' };
  if (num < min) return { valid: false, msg: label + ' minimal ' + min + '.' };
  if (num > max) return { valid: false, msg: label + ' maksimal ' + max + '.' };
  return { valid: true };
}

/* ---- LocalStorage Encryption ---- */
var _ENC_KEY = 'Instruktru2xSekuriti2024!';

function _encBase(text) {
  var encoded = '';
  for (var i = 0; i < text.length; i++) {
    var c = text.charCodeAt(i) ^ _ENC_KEY.charCodeAt(i % _ENC_KEY.length);
    encoded += String.fromCharCode(c);
  }
  try {
    return btoa(encoded);
  } catch(e) {
    return null;
  }
}

function _decBase(encoded) {
  if (!encoded) return null;
  try {
    var decoded = atob(encoded);
  } catch(e) {
    return null;
  }
  var result = '';
  for (var i = 0; i < decoded.length; i++) {
    var c = decoded.charCodeAt(i) ^ _ENC_KEY.charCodeAt(i % _ENC_KEY.length);
    result += String.fromCharCode(c);
  }
  return result;
}

/* ---- Toast Notification ---- */
function showToast(message, type) {
  type = type || 'success';
  var toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = 'toast ' + type;
  toast.textContent = message;
  requestAnimationFrame(function() {
    toast.classList.add('show');
  });
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(function() {
    toast.classList.remove('show');
  }, 3000);
}

/* ---- Field Error Helpers ---- */
function showFieldError(inputEl, msgEl, message) {
  if (inputEl) inputEl.classList.add('input-error');
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.style.display = 'flex';
  }
}

function clearFieldError(inputEl, msgEl) {
  if (inputEl) inputEl.classList.remove('input-error');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.style.display = 'none';
  }
}

/* BANTUAN: Loading state */
function showLoading(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var existing = container.querySelector('.skeleton-loader');
  if (existing) return;
  var loader = document.createElement('div');
  loader.className = 'skeleton-loader';
  loader.innerHTML =
    '<div class="skeleton-line" style="width:80%"></div>' +
    '<div class="skeleton-line" style="width:60%"></div>' +
    '<div class="skeleton-line" style="width:90%"></div>';
  container.appendChild(loader);
  container.style.display = 'block';
}

function hideLoading(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;
  var loader = container.querySelector('.skeleton-loader');
  if (loader) loader.remove();
  container.style.display = '';
}
