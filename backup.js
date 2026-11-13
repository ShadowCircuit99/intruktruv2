/* ================================================================
   AUTO-BACKUP -- LocalStorage backup & restore for Instruktur Pribadi 90 Hari
   ================================================================ */

const BACKUP_KEY = 'ip90_auto_backup_v1';

// Pakai loadState milik aplikasi (sudah menangani data terenkripsi),
// supaya backup tidak salah membaca bentuk penyimpanan.
function _bacaAman(key, fallback) {
  try {
    if (typeof loadState === 'function') {
      const v = loadState(key);
      if (v !== null && v !== undefined) return v;
    }
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function createBackup() {
  try {
    const appState = {
      user: _bacaAman('ip90_user', { name: '', weight: 70, targetWeight: 65, height: 170, age: 28, gender: 'm', activity: 1.55, goal: 'maintain', dislike: [] }),
      program: _bacaAman('ip90_program', { startDate: new Date().toISOString().split('T')[0], tdee: 2200, targets: null, water: {}, streak: 0, lastActiveDate: '' }),
      app: _bacaAman('ip90_app', {}),
      timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(appState);
    localStorage.setItem(BACKUP_KEY, json);
    return json;
  } catch (e) {
    console.error('Backup gagal:', e);
    return null;
  }
}

function loadUserData() {
  return _bacaAman('ip90_user', { name: '', weight: 70, targetWeight: 65, height: 170, age: 28, gender: 'm', activity: 1.55, goal: 'maintain', dislike: [] });
}

function loadProgramData() {
  return _bacaAman('ip90_program', { startDate: new Date().toISOString().split('T')[0], tdee: 2200, targets: null, water: {}, streak: 0, lastActiveDate: '' });
}

function loadTodayData() {
  const day = (typeof getCurrentDay === 'function') ? getCurrentDay() : 0;
  return _bacaAman('ip90_daydata_' + day, { workoutDone: false, mealsCompleted: [], dayIndex: day, lastActiveDate: '' });
}

function loadStatisticsData() {
  return _bacaAman('ip90_tracking', { totalWorkouts: 0, totalCalories: 0, streakDays: 0, lastUpdate: '' });
}

// Auto-backup: simpan setiap kali halaman diakses/dua kali dalam 1 menit
let lastAutoBackup = 0;

function maybeAutoBackup() {
  const now = Date.now();
  if (now - lastAutoBackup > 120000) { // 2 menit
    lastAutoBackup = now;
    createBackup();
  }
}

// Expose functions globally for use in the app
if (typeof window !== 'undefined') {
  window.createBackup = createBackup;
  window.maybeAutoBackup = maybeAutoBackup;
  window.loadUserData = loadUserData;
  window.loadProgramData = loadProgramData;
  window.loadTodayData = loadTodayData;
  window.loadStatisticsData = loadStatisticsData;
}