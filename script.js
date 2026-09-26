
/* ============================================================
   CONFIG
   ============================================================ */
const DEV_MODE = false;

/* ============================================================
   STATE KEYS
   ============================================================ */
const KEYS = {
    app: 'ip90_app',
    user: 'ip90_user',
    program: 'ip90_program',
    today: 'ip90_today_',
    daydata: 'ip90_daydata_',
    tracking: 'ip90_tracking',
    notes: 'ip90_notes_',
    journal: 'ip90_journal_',
    energy: 'ip90_energy_',
};

/* ============================================================
   STORAGE HELPERS
   ============================================================ */
function loadState(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}
function saveState(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { }
}
function todayKey() { return KEYS.today + new Date().toISOString().split('T')[0]; }
function notesKey(day) { return KEYS.notes + day; }
function journalKey() { return KEYS.journal + new Date().toISOString().split('T')[0]; }
function energyKey() { return KEYS.energy + new Date().toISOString().split('T')[0]; }
function loadToday() { return loadState(todayKey()) || { workoutDone: false, mealsCompleted: [false, false, false] }; }
function saveToday(data) { saveState(todayKey(), data); }

/* FIX-1: snapshot keys sebelum iterasi — cegah masalah modifikasi saat iterasi */
function clearAllStorage() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('ip90'));
    keys.forEach(k => localStorage.removeItem(k));
}

/* FIX-2: rename deepFreezeMeals → deepCloneMeals
   Fungsi asli melakukan JSON deep clone, BUKAN Object.freeze.
   Nama sebelumnya menyesatkan. Alias backward-compat disertakan. */
function deepCloneMeals(meals) {
    if (!Array.isArray(meals)) return meals || [];
    return JSON.parse(JSON.stringify(meals));
}
const deepFreezeMeals = deepCloneMeals; /* alias agar call-site lama tidak perlu diubah */


/* ============================================================
   MEAL ENGINE v17 — SMART VARIATION (REAL FOOD SYSTEM)
   ============================================================ */

const COOKING_STYLES = {
    tempe: ['goreng', 'tumis', 'bacem'],
    tahu: ['goreng', 'tumis', 'panggang'],
    ayam: ['goreng', 'tumis', 'panggang'],
    telur: ['dadar', 'ceplok', 'orak-arik'],
    ikan: ['goreng', 'bakar', 'kukus'],
    sayur: ['tumis', 'kukus'],
};

function pickCookingStyle(protein, day, slot) {
    const styles = COOKING_STYLES[protein] || ['tumis'];
    return styles[(day * 7 + slot * 3) % styles.length];
}

const SAYUR_VARIANTS = [
    'kangkung', 'bayam', 'sawi hijau', 'wortel', 'buncis',
    'kol', 'labu siam', 'daun singkong', 'terong', 'kacang panjang',
    'sawi putih', 'tauge', 'brokoli', 'timun',
];
const _SAYUR_SLOT_OFFSET = [0, 5, 10];

function pickSayur(day, slot, usedSayurs) {
    const base = (day * 3 + slot + _SAYUR_SLOT_OFFSET[slot % 3]) % SAYUR_VARIANTS.length;
    if (usedSayurs && usedSayurs.size > 0) {
        for (let i = 0; i < SAYUR_VARIANTS.length; i++) {
            const candidate = SAYUR_VARIANTS[(base + i) % SAYUR_VARIANTS.length];
            if (!usedSayurs.has(candidate)) return candidate;
        }
        /* FIX-3: log pool exhaustion, jangan diam-diam return duplikat */
        if (DEV_MODE) console.warn('[pickSayur] semua varian sayur terpakai hari ini — fallback ke base:', SAYUR_VARIANTS[base]);
    }
    return SAYUR_VARIANTS[base];
}

const BUMBU_VARIANTS = {
    tempe: ['orek kecap', 'orek pedas ringan', 'tumis bawang putih', 'tumis cabe', 'bacem manis', 'balado ringan'],
    tahu: ['tumis kecap', 'goreng bawang', 'balado ringan', 'tumis cabe', 'panggang kecap', 'goreng kunyit'],
    ayam: ['kecap manis', 'goreng bawang', 'tumis cabe', 'panggang sederhana', 'goreng kunyit', 'bakar kecap'],
    telur: ['balado ringan', 'dadar bawang', 'ceplok kecap', 'orak arik sayur', 'dadar lada', 'ceplok bawang'],
    ikan: ['bakar kecap', 'goreng sederhana', 'tumis cabe', 'kukus ringan', 'goreng kunyit', 'bakar bumbu'],
};

function pickBumbu(protein, day, slot, usedBumbus) {
    const list = BUMBU_VARIANTS[protein] || ['tumis sederhana'];
    const base = (day + slot * 2) % list.length;
    if (usedBumbus && usedBumbus.size > 0) {
        for (let i = 0; i < list.length; i++) {
            const candidate = list[(base + i) % list.length];
            if (!usedBumbus.has(candidate)) return candidate;
        }
        /* FIX-3: log pool exhaustion */
        if (DEV_MODE) console.warn('[pickBumbu] semua bumbu terpakai untuk', protein, '— fallback ke base:', list[base]);
    }
    return list[base];
}

const BASE_PORTION = {
    protein: { tempe: 100, tahu: 120, ayam: 120, telur: 2, ikan: 120 },
    karbo: { nasi: 150, roti: 80, kentang: 200 },
    sayur: 80,
    bumbu: { bawang_putih: 2, bawang_merah: 2, kecap: 10, garam: 1 },
    minyak: 5,
};

/* FIX-4: tambah guard NaN — fungsi asli mengembalikan NaN jika targetKalori = undefined/NaN
   (sebelumnya diselamatkan oleh '|| 500' di call-site, tapi fungsinya sendiri tidak aman) */
function getScaleFactor(targetKalori) {
    const cal = parseFloat(targetKalori);
    if (!cal || isNaN(cal)) return 1.0;
    return Math.min(1.8, Math.max(0.6, cal / 500));
}

/* FIX-5: ekstrak helper getKarboKey() — deteksi karbo via regex sebelumnya
   DUPLIKAT identik di buildIngredients DAN generateRecipe. Sekarang satu sumber kebenaran. */
function getKarboKey(nama) {
    if (/roti/i.test(nama)) return 'roti';
    if (/kentang/i.test(nama)) return 'kentang';
    return 'nasi';
}

function buildIngredients(meal, scale, sayurPicked) {
    const protein = meal.protein_tag;
    const karboKey = getKarboKey(meal.nama || ''); /* FIX-5: pakai helper, bukan inline regex */
    const bahan = [];

    /* 1) PROTEIN */
    if (protein === 'telur') {
        bahan.push({ item: 'Telur ayam', gram: Math.max(1, Math.round(BASE_PORTION.protein.telur * scale)), unit: 'butir' });
    } else {
        const label = { tempe: 'Tempe', tahu: 'Tahu putih', ayam: 'Dada ayam', ikan: 'Ikan (nila/lele/tongkol)' }[protein] || _capitalize(protein);
        bahan.push({ item: label, gram: Math.round((BASE_PORTION.protein[protein] || 100) * scale), unit: 'g' });
    }

    /* 2) KARBO */
    const karboG = Math.round((BASE_PORTION.karbo[karboKey] || 150) * scale);
    const karboLabel = { nasi: 'Nasi putih matang', roti: 'Roti tawar', kentang: 'Kentang' }[karboKey] || 'Nasi putih matang';
    const isRoti = karboKey === 'roti';
    bahan.push({
        item: karboLabel,
        gram: isRoti ? Math.max(1, Math.round(3 * scale)) : karboG,
        unit: isRoti ? 'lembar' : 'g',
    });

    /* 3) SAYUR */
    bahan.push({ item: _capitalize(sayurPicked || 'bayam'), gram: Math.round(BASE_PORTION.sayur * Math.min(scale, 1.2)), unit: 'g' });

    /* 4) BUMBU AROMATIS */
    bahan.push({ item: 'Bawang putih', gram: BASE_PORTION.bumbu.bawang_putih, unit: 'siung' });
    bahan.push({ item: 'Bawang merah', gram: BASE_PORTION.bumbu.bawang_merah, unit: 'siung' });
    bahan.push({ item: 'Kecap manis', gram: BASE_PORTION.bumbu.kecap, unit: 'ml' });
    bahan.push({ item: 'Garam & lada', gram: 0, unit: 'secukupnya' });

    /* 5) MINYAK */
    bahan.push({ item: 'Minyak goreng', gram: Math.min(15, Math.round(BASE_PORTION.minyak * scale)), unit: 'ml' });

    /* 6) BUMBU DASAR */
    bahan.push({ item: 'Bumbu dasar (bawang + garam)', gram: 5, unit: 'g' });

    return bahan;
}

/* ============================================================
   applyMealStyle — legacy shim (no-op, hanya set flag _styled)
   FIX-6: hapus param `day` yang tidak pernah digunakan
   ============================================================ */
function applyMealStyle(meal) {
    if (!meal || meal._styled || meal._isFallback || meal._isEmptyPool) return meal;
    return { ...meal, _styled: true };
}

/* ============================================================
   generateRecipe v17.5 — SMART VARIATION + ANTI REPETISI
   ============================================================ */
function generateRecipe(meal, day, slot, usedBumbus, usedSayurs) {
    if (!meal || !meal.protein_tag) return meal;

    const protein = meal.protein_tag;
    const style = pickCookingStyle(protein, day, slot);
    const sayur = pickSayur(day, slot, usedSayurs);
    const bumbu = pickBumbu(protein, day, slot, usedBumbus);
    const scale = getScaleFactor(meal.base_cal || 500);
    const bahan = buildIngredients(meal, scale, sayur);
    const karboShort = getKarboKey(meal.nama || ''); /* FIX-5: helper, bukan duplikasi regex */
    const nama = `${_capitalize(protein)} ${bumbu} + ${sayur}`;

    function g(keyword) {
        const found = bahan.find(b => new RegExp(keyword, 'i').test(b.item));
        if (!found) return '';
        if (found.unit === 'secukupnya') return 'secukupnya';
        return `${found.gram}${found.unit === 'g' ? 'g' : ' ' + found.unit}`;
    }

    let langkah = [];

    if (style === 'goreng') {
        langkah = [
            `Siapkan bahan: cuci bersih ${sayur}, tiriskan. ${protein === 'tempe' ? `Iris ${g(protein)} tempe tipis-tipis lalu lumuri dengan garam dan sedikit lada. Diamkan 5 menit.`
                : protein === 'tahu' ? `Potong ${g(protein)} tahu menjadi potongan tebal sekitar 2cm, taburi sedikit garam.`
                    : protein === 'ikan' ? `Cuci ${g(protein)} ikan, beri garam, sedikit kunyit, dan lada. Diamkan 5 menit.`
                        : `Potong ${g(protein)} ${protein} menjadi bagian sedang, lumuri dengan garam dan lada. Diamkan 5 menit.`
            }`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang. Goreng ${protein} hingga semua sisi kuning kecokelatan — ${(protein === 'tempe' || protein === 'tahu')
                ? 'sekitar 2–3 menit tiap sisi, jangan sering dibalik'
                : 'sekitar 5–7 menit tiap sisi sampai matang di dalam'
            }. Angkat dan tiriskan.`,
            `Buang sisa minyak berlebih di teflon. Tumis ${g('bawang putih')} bawang putih geprek sampai harum, sekitar 30 detik. Masukkan ${g(sayur)} ${sayur}, tambahkan garam secukupnya. Tumis 2–3 menit sampai layu dan matang.`,
            `Siapkan ${g(karboShort)} ${karboShort}${karboShort === 'kentang' ? ' rebus atau kukus yang sudah matang' : ' di piring'
            }. Letakkan ${protein} goreng dan tumis ${sayur} di sisinya. Sajikan selagi hangat.`,
        ];
    }
    else if (style === 'tumis') {
        langkah = [
            `Siapkan bahan: ${protein === 'ayam' ? `potong ${g(protein)} ayam menjadi dadu kecil atau strip tipis melintang serat`
                : protein === 'tempe' ? `potong ${g(protein)} tempe menjadi dadu kecil`
                    : protein === 'tahu' ? `potong ${g(protein)} tahu menjadi dadu sedang`
                        : `siapkan ${g(protein)} ${protein}`
            }. Iris ${g('bawang merah')} bawang merah dan ${g('bawang putih')} bawang putih. Potong ${sayur} siap masak.`,
            `Panaskan ${g('minyak')} minyak di wajan api sedang. Tumis bawang merah dan bawang putih iris sampai layu, harum, dan sedikit kecokelatan — sekitar 1–2 menit.`,
            `Masukkan ${protein}, aduk rata bersama bumbu. Masak ${protein === 'ayam' ? '5–7 menit'
                : (protein === 'tempe' || protein === 'tahu') ? '3–4 menit'
                    : '5 menit'
            } sampai ${protein} matang${protein === 'ayam' ? ' dan tidak ada bagian merah' : ' dan sedikit kecokelatan'
            }. Tuang ${g('kecap')} kecap manis dan garam secukupnya, aduk merata. Masak 2 menit lagi agar bumbu meresap.`,
            `Di wajan lain, panaskan sedikit minyak. Tumis ${g(sayur)} ${sayur} dengan bawang putih geprek, 2–3 menit sampai layu. Bumbui garam.`,
            `Sajikan ${protein} tumis bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur} di sisinya.`,
        ];
    }
    else if (style === 'bacem') {
        langkah = [
            `Potong ${g('tempe')} tempe menjadi dadu agak besar. Rebus sebentar dalam air mendidih 3 menit untuk mengurangi rasa pahit, tiriskan.`,
            `Tumis ${g('bawang putih')} bawang putih dan ${g('bawang merah')} bawang merah cincang sampai harum. Tuang ${g('kecap')} kecap manis, ketumbar bubuk secukupnya, garam, dan 150ml air. Aduk rata dan biarkan mendidih.`,
            `Masukkan tempe ke kuah bacem, pastikan semua bagian terendam. Kecilkan api, masak 15–20 menit sambil sesekali diaduk pelan sampai kuah menyusut dan bumbu meresap ke dalam tempe.`,
            `Sementara menunggu, tumis ${g(sayur)} ${sayur} dengan bawang putih geprek di wajan terpisah, 2–3 menit. Bumbui garam.`,
            `Sajikan tempe bacem bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur} di sisinya.`,
        ];
    }
    else if (style === 'panggang') {
        langkah = [
            `Siapkan ${g(protein)} ${protein}: ${protein === 'ayam' ? 'bersihkan, buat beberapa sayatan agar bumbu meresap'
                : protein === 'ikan' ? 'cuci bersih, keringkan dengan tisu dapur, buat sayatan di badan ikan'
                    : `potong menjadi bagian sedang`
            }. Lumuri merata dengan garam, lada, dan ${g('kecap')} kecap asin. Diamkan minimal 10 menit biar bumbu meresap.`,
            `Panaskan teflon tebal tanpa minyak di api sedang hingga benar-benar panas. Letakkan ${protein}, jangan digerakkan dulu — biarkan 5–7 menit sampai sisi bawah berubah warna dan ada garis kecokelatan tipis. Balik sekali, masak 5–7 menit lagi sampai matang merata.`,
            `Sementara ${protein} dipanggang, tumis ${g(sayur)} ${sayur} dengan ${g('bawang putih')} bawang putih geprek di teflon lain, 2–3 menit sampai layu. Bumbui garam.`,
            `Sajikan ${protein} panggang bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur} di sisinya.`,
        ];
    }
    else if (style === 'bakar') {
        langkah = [
            `Cuci bersih ${g('ikan')} ikan, keringkan dengan tisu. Buat 2–3 sayatan diagonal di badan ikan agar bumbu meresap. Lumuri merata dengan kunyit bubuk, garam, sedikit lada, dan perasan jeruk nipis. Diamkan 10 menit.`,
            `Panaskan teflon atau grill pan tanpa minyak di api sedang-tinggi sampai panas betul. Letakkan ikan, jangan digerakkan — bakar 5–6 menit sampai sisi bawah kecokelatan. Balik pelan-pelan, bakar sisi lain 5 menit sampai matang.`,
            `Tumis ${g(sayur)} ${sayur} dengan ${g('bawang putih')} bawang putih geprek di teflon lain, 2–3 menit sampai matang. Bumbui garam.`,
            `Sajikan ikan bakar di atas ${g(karboShort)} ${karboShort} dengan ${sayur} di sisi piring. Tambahkan sambal dan perasan jeruk nipis jika suka.`,
        ];
    }
    else if (style === 'dadar') {
        langkah = [
            `Cincang halus ${g('bawang merah')} bawang merah. Iris tipis ${sayur} atau cincang kasar jika daun-daunan. Sisihkan.`,
            `Kocok ${g('telur')} telur dengan bawang merah cincang, garam secukupnya, dan sedikit lada sampai tercampur rata. Masukkan ${sayur} ke dalam kocokan telur, aduk.`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang. Tuang adonan telur, ratakan. Masak sampai sisi bawah set dan pinggirnya agak kering — sekitar 2 menit. Balik sekali, masak 1 menit lagi sampai matang merata. Angkat.`,
            `Sajikan telur dadar di atas atau di samping ${g(karboShort)} ${karboShort}. Bisa langsung dimakan atau ditambah kecap manis sesuai selera.`,
        ];
    }
    else if (style === 'ceplok') {
        langkah = [
            `Siapkan bahan: cuci ${sayur}, iris bawang putih tipis-tipis.`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang sampai benar-benar panas. Pecahkan ${g('telur')} telur langsung ke teflon satu per satu — jaga kuning telur tetap utuh. Kecilkan api, biarkan tanpa diaduk selama 2–3 menit sampai bagian putih telur set sepenuhnya.`,
            `Siram ${g('kecap')} kecap manis di atas telur yang sudah set. Tutup teflon 30 detik agar kecap menempel dan kuning telur matang sesuai selera. Angkat.`,
            `Di teflon yang sama, tambah sedikit minyak. Tumis bawang putih iris sampai harum, masukkan ${g(sayur)} ${sayur} dan garam. Tumis 2 menit sampai layu. Sajikan telur ceplok kecap dengan ${sayur} bersama ${g(karboShort)} ${karboShort} hangat.`,
        ];
    }
    else if (style === 'orak-arik') {
        langkah = [
            `Iris tipis ${g('bawang merah')} bawang merah dan ${g('bawang putih')} bawang putih. Potong atau iris ${sayur} sesuai ukuran. Kocok ${g('telur')} telur dengan garam dan sedikit lada dalam mangkuk sampai rata.`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang. Tumis bawang merah dan bawang putih sampai harum dan sedikit kecokelatan — sekitar 1 menit.`,
            `Tuang kocokan telur ke wajan. Biarkan 10 detik sampai bagian bawah mulai set, lalu aduk perlahan dengan spatula membentuk potongan besar. Terus aduk sampai telur matang berbulir tapi masih sedikit lembab — jangan sampai terlalu kering.`,
            `Masukkan ${g(sayur)} ${sayur} ke dalam telur orak-arik. Aduk rata, masak 1–2 menit sampai ${sayur} layu dan matang. Cicipi garam.`,
            `Sajikan hangat di atas ${g(karboShort)} ${karboShort}.`,
        ];
    }
    else if (style === 'kukus') {
        langkah = [
            `Siapkan ${g(protein)} ${protein}: ${protein === 'ayam' ? 'bersihkan, buat beberapa tusukan kecil agar bumbu meresap'
                : protein === 'ikan' ? 'cuci bersih, keringkan dengan tisu'
                    : `potong menjadi bagian sedang`
            }. Lumuri merata dengan garam, ${g('kecap')} kecap asin, dan sedikit jahe iris tipis. Diamkan 10 menit.`,
            `Siapkan panci kukusan — didihkan air di bawah. Tata ${protein} di atas wadah tahan panas atau piring. Kukus selama 12–15 menit dengan api sedang sampai matang ${protein === 'ayam' ? '(tidak ada bagian merah saat dipotong)'
                : protein === 'ikan' ? '(daging mudah terlepas dari tulang)'
                    : '(tekstur empuk dan padat)'
            }.`,
            `Sementara menunggu, tumis ${g('bawang putih')} bawang putih geprek sampai harum. Masukkan ${g(sayur)} ${sayur}, tambahkan garam secukupnya. Tumis 2–3 menit sampai ${sayur} layu dan matang.`,
            `Angkat ${protein} kukus, siram sedikit ${g('kecap')} kecap asin atau kecap manis di atasnya jika suka. Sajikan bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur}.`,
        ];
    }
    else {
        /* Fallback generic */
        langkah = [
            `Siapkan semua bahan: ${protein === 'ayam' ? `potong ${g(protein)} ayam dadu kecil`
                : protein === 'tempe' ? `potong ${g(protein)} tempe dadu`
                    : protein === 'tahu' ? `potong ${g(protein)} tahu dadu`
                        : `siapkan ${g(protein)} ${protein}`
            }. Iris tipis ${g('bawang putih')} bawang putih dan siapkan ${g(sayur)} ${sayur}.`,
            `Panaskan ${g('minyak')} minyak di wajan api sedang. Tumis bawang putih sampai harum dan sedikit kecokelatan — sekitar 1 menit.`,
            `Masukkan ${protein}, aduk rata. Masak ${protein === 'ayam' ? '6–8 menit' : '3–5 menit'} sampai matang dan berwarna kecokelatan. Bumbui garam dan lada secukupnya. Cicipi.`,
            `Masukkan ${sayur}, aduk bersama ${protein}. Masak 2–3 menit sampai ${sayur} layu dan matang. Sajikan hangat bersama ${g(karboShort)} ${karboShort}.`,
        ];
    }

    /* FIX-7: console.log aslinya selalu aktif bahkan saat DEV_MODE = false — dibungkus flag */
    if (DEV_MODE) {
        console.log('[MEAL VAR]', protein, '|', bumbu, '|', sayur, '| style:', style);
        console.log('[RECIPE DETAIL]', nama, '| scale:', scale.toFixed(2));
        console.log('[RECIPE BAHAN]', bahan.map(b => `${b.item} ${b.gram}${b.unit}`).join(', '));
    }

    return {
        ...meal,
        nama,
        _bumbu: bumbu,
        _sayur: sayur,
        resep: { bahan, langkah },
    };
}

function _capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}


/* ============================================================
   MEAL DATA v6.6 — PAGI (14 rotasi) — tidak ada perubahan
   ============================================================ */
const PAGI_MEALS = [
    { nama: 'Nasi Putih & Telur Ceplok Kecap dengan Tumis Bayam', base_cal: 390, protein_tag: 'telur', makro: { protein: 22, karbo: 52, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g', alt: 'nasi merah' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Bayam segar', gram: 80, unit: 'g', alt: 'kangkung' }, { item: 'Kecap manis', gram: 10, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Panaskan sedikit minyak di teflon, tumis bawang putih geprek sampai harum — sekitar 30 detik.', 'Masukkan bayam, aduk sebentar, masak 2 menit hingga layu. Angkat, sisihkan.', 'Di teflon yang sama, ceplok telur. Saat pinggirnya sudah set, siram kecap manis di atasnya. Biarkan sampai kuning telur matang sesuai selera.', 'Sajikan nasi hangat dengan tumis bayam dan telur ceplok kecap.'] } },
    { nama: 'Nasi Merah & Tempe Goreng Kunyit dengan Tumis Kangkung', base_cal: 420, protein_tag: 'tempe', makro: { protein: 24, karbo: 54, lemak: 12 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g', alt: 'nasi putih' }, { item: 'Tempe', gram: 120, unit: 'g' }, { item: 'Kangkung', gram: 100, unit: 'g', alt: 'bayam atau sawi' }, { item: 'Kunyit bubuk', gram: 1, unit: 'g' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Iris tempe tipis-tipis, lumuri rata dengan kunyit bubuk dan sedikit garam.', 'Goreng tempe di teflon pakai sedikit minyak, api sedang — 3 menit tiap sisi. Jangan sering dibalik supaya tidak berantakan.', 'Tumis bawang putih geprek di wajan lain sampai harum, masukkan kangkung dan kecap asin. Aduk rata, masak 2 menit sampai kangkung layu.', 'Sajikan nasi merah dengan tempe goreng kunyit dan tumis kangkung.'] } },
    { nama: 'Roti Tawar & Telur Dadar Sayur', base_cal: 360, protein_tag: 'telur', makro: { protein: 18, karbo: 42, lemak: 11 }, resep: { bahan: [{ item: 'Roti tawar', gram: 3, unit: 'lembar', alt: 'roti gandum' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Sawi hijau', gram: 60, unit: 'g', alt: 'bayam atau kol' }, { item: 'Bawang putih', gram: 1, unit: 'siung' }, { item: 'Garam & lada', gram: 0, unit: 'secukupnya' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Cincang kasar sawi hijau, sisihkan.', 'Kocok 2 telur dengan garam, sedikit lada, dan sawi cincang sampai rata.', 'Tuang ke teflon panas yang sudah diolesi sedikit minyak. Masak api sedang sampai bawah set, balik sekali — masak 1 menit lagi sampai matang.', 'Sajikan dadar dengan roti tawar. Bisa tambah kecap manis kalau suka.'] } },
    { nama: 'Nasi Putih & Ayam Suwir Kecap dengan Tumis Wortel', base_cal: 450, protein_tag: 'ayam', makro: { protein: 36, karbo: 50, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Dada atau paha ayam', gram: 150, unit: 'g' }, { item: 'Wortel', gram: 80, unit: 'g', alt: 'kol' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Bawang merah', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Rebus ayam di air mendidih dengan sedikit garam, 20 menit. Angkat, dinginkan sebentar lalu suwir kasar.', 'Tumis bawang merah dan bawang putih iris sampai layu dan harum.', 'Masukkan ayam suwir dan kecap manis. Aduk rata, masak 3 menit sampai bumbu meresap.', 'Tumis wortel iris tipis dengan bawang putih di wajan lain, 3 menit. Bumbui garam. Sajikan bersama nasi.'] } },
    { nama: 'Kentang Rebus & Telur Balado Sederhana', base_cal: 400, protein_tag: 'telur', makro: { protein: 20, karbo: 54, lemak: 10 }, resep: { bahan: [{ item: 'Kentang sedang', gram: 200, unit: 'g' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Tomat merah', gram: 1, unit: 'buah' }, { item: 'Cabai merah', gram: 2, unit: 'buah', alt: 'lada bubuk' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Rebus kentang utuh 20 menit hingga bisa ditusuk garpu. Kupas, potong-potong.', 'Rebus telur 10 menit, kupas. Goreng sebentar di teflon sampai kulit sedikit kecokelatan dan berbintik.', 'Haluskan kasar cabai merah, tomat, dan bawang merah. Tumis sampai matang dan harum.', 'Masukkan telur goreng ke bumbu, aduk pelan agar tidak hancur. Masak 2 menit. Sajikan dengan kentang rebus.'] } },
    { nama: 'Nasi Merah & Tahu Goreng Kecap dengan Sawi Rebus', base_cal: 390, protein_tag: 'tahu', makro: { protein: 20, karbo: 54, lemak: 10 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g', alt: 'nasi putih' }, { item: 'Tahu putih', gram: 200, unit: 'g', alt: 'tahu kuning' }, { item: 'Sawi hijau', gram: 100, unit: 'g', alt: 'kangkung' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong tahu jadi beberapa bagian, goreng di teflon dengan minyak minimal sampai semua sisi kuning kecokelatan.', 'Tumis bawang putih geprek sampai harum, masukkan tahu goreng dan kecap manis. Aduk pelan, masak 2 menit.', 'Rebus sawi hijau di air mendidih bergarum, 2 menit. Tiriskan.', 'Sajikan nasi merah dengan tahu kecap dan sawi rebus di samping.'] } },
    { nama: 'Nasi Putih & Telur Orak-arik Bawang dengan Tumis Kol', base_cal: 375, protein_tag: 'telur', makro: { protein: 18, karbo: 50, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Telur ayam', gram: 3, unit: 'butir' }, { item: 'Kol putih', gram: 100, unit: 'g', alt: 'sawi putih' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Kecap asin', gram: 5, unit: 'ml' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Iris tipis bawang merah dan bawang putih, tumis di minyak panas sampai harum dan sedikit kecokelatan.', 'Kocok 3 telur dengan kecap asin dan sedikit lada. Tuang ke wajan, biarkan 10 detik sebelum diaduk perlahan — orak-arik sampai matang tapi masih lembab.', 'Tumis kol iris tipis dengan bawang putih di wajan lain, 3 menit. Bumbui garam.', 'Sajikan nasi dengan telur orak-arik dan tumis kol.'] } },
    { nama: 'Nasi Merah & Tempe Bacem Manis dengan Tumis Bayam', base_cal: 430, protein_tag: 'tempe', makro: { protein: 28, karbo: 54, lemak: 12 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g' }, { item: 'Tempe', gram: 130, unit: 'g' }, { item: 'Bayam segar', gram: 100, unit: 'g', alt: 'kangkung' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Ketumbar bubuk', gram: 1, unit: 'g' }], langkah: ['Potong tempe jadi dadu agak besar. Tumis bawang putih sampai harum, masukkan kecap manis, ketumbar, sedikit garam, dan 100ml air. Aduk rata.', 'Masukkan tempe, pastikan terendam bumbu. Kecilkan api, masak 15 menit sambil sesekali diaduk pelan sampai kuah menyusut.', 'Tumis bayam dengan bawang putih geprek di wajan lain, 2 menit sampai layu.', 'Sajikan nasi merah dengan tempe bacem dan tumis bayam.'] } },
    { nama: 'Nasi Putih & Ayam Goreng Kunyit dengan Tumis Kangkung', base_cal: 460, protein_tag: 'ayam', makro: { protein: 34, karbo: 50, lemak: 14 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Ayam potong', gram: 150, unit: 'g', alt: 'dada ayam' }, { item: 'Kangkung', gram: 100, unit: 'g', alt: 'bayam atau sawi' }, { item: 'Kunyit bubuk', gram: 2, unit: 'g' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Bawang merah', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 10, unit: 'ml' }], langkah: ['Lumuri ayam merata dengan kunyit bubuk, garam, dan sedikit lada. Diamkan 10 menit biar bumbu nempel.', 'Goreng ayam di teflon dengan sedikit minyak, api sedang — 6 sampai 7 menit tiap sisi. Jangan sering dibalik.', 'Tumis kangkung dengan bawang putih geprek 2 menit sampai layu. Bumbui garam.', 'Sajikan nasi dengan ayam goreng kunyit dan tumis kangkung.'] } },
    { nama: 'Roti Tawar & Tahu Goreng Tipis dengan Tumis Wortel', base_cal: 350, protein_tag: 'tahu', makro: { protein: 16, karbo: 40, lemak: 11 }, resep: { bahan: [{ item: 'Roti tawar', gram: 3, unit: 'lembar', alt: 'roti gandum' }, { item: 'Tahu putih', gram: 180, unit: 'g' }, { item: 'Wortel', gram: 80, unit: 'g', alt: 'kol' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Iris tahu tipis-tipis sekitar 5mm. Goreng di teflon sedikit minyak, api sedang — balik sekali setelah sisi bawah kecokelatan.', 'Tumis bawang putih geprek sampai harum. Masukkan wortel iris serong tipis dan kecap asin, tumis 3 menit sampai agak lunak.', 'Sajikan roti tawar dengan tahu goreng tipis dan tumis wortel.'] } },
    { nama: 'Nasi Putih & Telur Rebus Sambal Kecap dengan Sawi Rebus', base_cal: 380, protein_tag: 'telur', makro: { protein: 20, karbo: 50, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Sawi hijau', gram: 100, unit: 'g', alt: 'bayam' }, { item: 'Kecap manis', gram: 10, unit: 'ml' }, { item: 'Sambal', gram: 5, unit: 'g', alt: 'cabai rawit' }, { item: 'Minyak goreng', gram: 3, unit: 'ml' }], langkah: ['Rebus telur di air mendidih 10 menit. Angkat, rendam air dingin sebentar lalu kupas. Potong dua.', 'Campur kecap manis dengan sambal dalam mangkuk kecil sebagai saus.', 'Rebus sawi hijau di air bergarum, 2 menit. Tiriskan.', 'Sajikan nasi dengan telur rebus, siram saus kecap sambal di atas telur, dan sawi rebus di samping.'] } },
    { nama: 'Nasi Merah & Tempe Goreng Orek dengan Lalapan Timun', base_cal: 415, protein_tag: 'tempe', makro: { protein: 25, karbo: 55, lemak: 12 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g', alt: 'nasi putih' }, { item: 'Tempe', gram: 150, unit: 'g' }, { item: 'Timun', gram: 100, unit: 'g' }, { item: 'Tomat', gram: 1, unit: 'buah' }, { item: 'Kecap manis', gram: 12, unit: 'ml' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong tempe jadi dadu kecil. Goreng di teflon dengan sedikit minyak sampai semua sisi kecokelatan — biarkan tiap sisi matang dulu sebelum diaduk.', 'Tumis bawang merah dan bawang putih iris sampai harum. Masukkan tempe goreng dan kecap manis, aduk rata. Masak 3 menit sampai bumbu meresap.', 'Iris timun dan tomat jadi lalapan segar.', 'Sajikan nasi merah dengan tempe orek dan lalapan di samping.'] } },
    { nama: 'Nasi Putih & Ayam Rebus Suwir Bawang dengan Tumis Buncis', base_cal: 440, protein_tag: 'ayam', makro: { protein: 36, karbo: 50, lemak: 9 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Dada ayam', gram: 140, unit: 'g' }, { item: 'Buncis', gram: 100, unit: 'g', alt: 'kacang panjang' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Bawang merah', gram: 2, unit: 'siung' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }], langkah: ['Rebus ayam di air mendidih bersama bawang putih geprek dan garam, 20 menit. Angkat dan suwir kasar.', 'Tumis bawang merah dan bawang putih iris sampai harum. Masukkan ayam suwir dan kecap asin, aduk rata. Masak 3 menit.', 'Tumis buncis potong 3cm dengan bawang putih, 4 menit sampai matang tapi masih hijau.', 'Sajikan nasi dengan ayam suwir bawang dan tumis buncis.'] } },
    { nama: 'Kentang Kukus & Tahu Goreng Kecap dengan Tumis Wortel', base_cal: 380, protein_tag: 'tahu', makro: { protein: 18, karbo: 52, lemak: 10 }, resep: { bahan: [{ item: 'Kentang', gram: 200, unit: 'g' }, { item: 'Tahu kuning atau putih', gram: 180, unit: 'g' }, { item: 'Wortel', gram: 80, unit: 'g', alt: 'kol' }, { item: 'Kecap manis', gram: 12, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Cuci kentang, potong beberapa bagian. Kukus 15 menit sampai empuk saat ditusuk.', 'Potong tahu tebal, goreng di teflon tanpa minyak sampai kuning kecokelatan. Siram kecap manis, biarkan 1 menit.', 'Tumis wortel iris tipis dengan bawang putih geprek, 3 menit. Bumbui garam.', 'Sajikan kentang kukus hangat dengan tahu kecap dan tumis wortel.'] } },
];

/* ============================================================
   MEAL DATA v6.6 — SIANG (14 rotasi) — tidak ada perubahan
   ============================================================ */
const SIANG_MEALS = [
    { nama: 'Nasi Putih & Ayam Goreng Bumbu Kuning dengan Tumis Kangkung', base_cal: 560, protein_tag: 'ayam', makro: { protein: 44, karbo: 58, lemak: 14 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g', alt: 'nasi merah' }, { item: 'Ayam potong', gram: 160, unit: 'g', alt: 'dada ayam' }, { item: 'Kangkung segar', gram: 100, unit: 'g', alt: 'bayam atau sawi' }, { item: 'Kunyit bubuk', gram: 2, unit: 'g' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Jahe', gram: 2, unit: 'cm' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Haluskan kasar bawang putih, bawang merah, dan jahe. Lumuri ayam dengan campuran itu plus kunyit bubuk, garam, dan lada. Diamkan 15 menit.', 'Goreng ayam di teflon dengan sedikit minyak, api sedang. 6 sampai 7 menit tiap sisi sampai kulit kecokelatan dan matang di dalam.', 'Tumis kangkung dengan bawang putih geprek 2 menit sampai layu. Bumbui garam.', 'Sajikan nasi bersama ayam goreng bumbu kuning dan tumis kangkung.'] } },
    { nama: 'Nasi Putih & Tempe Orek Kecap dengan Tumis Buncis', base_cal: 530, protein_tag: 'tempe', makro: { protein: 36, karbo: 62, lemak: 14 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Tempe', gram: 150, unit: 'g' }, { item: 'Buncis', gram: 100, unit: 'g', alt: 'kacang panjang' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong tempe jadi dadu kecil. Goreng di teflon dengan minyak minimal, api sedang, sampai semua sisi kecokelatan.', 'Tumis bawang merah dan bawang putih sampai harum. Masukkan tempe goreng dan kecap manis, aduk pelan. Masak 3 sampai 4 menit sampai bumbu meresap.', 'Tumis buncis potong dengan bawang putih, 4 menit. Bumbui garam.', 'Sajikan nasi dengan tempe orek kecap dan tumis buncis.'] } },
    { nama: 'Nasi Putih & Telur Bumbu Bali dengan Tumis Wortel Kol', base_cal: 500, protein_tag: 'telur', makro: { protein: 28, karbo: 62, lemak: 14 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Telur ayam', gram: 3, unit: 'butir' }, { item: 'Wortel', gram: 80, unit: 'g' }, { item: 'Kol putih', gram: 80, unit: 'g', alt: 'sawi putih' }, { item: 'Bawang merah', gram: 4, unit: 'siung' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Tomat', gram: 1, unit: 'buah' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Rebus telur 12 menit, kupas. Goreng sebentar di teflon sampai kulit berbintik kecokelatan.', 'Haluskan kasar bawang merah, bawang putih, dan tomat. Tumis di sedikit minyak sampai matang dan harum.', 'Masukkan telur goreng ke bumbu. Masak pelan 3 menit agar bumbu meresap ke kulit telur.', 'Tumis wortel dan kol iris tipis dengan bawang putih 4 menit. Sajikan semua bersama nasi putih.'] } },
    { nama: 'Nasi Putih & Tahu Bacem Manis dengan Tumis Kol', base_cal: 490, protein_tag: 'tahu', makro: { protein: 30, karbo: 62, lemak: 12 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Tahu kuning keras', gram: 200, unit: 'g', alt: 'tahu putih' }, { item: 'Kol putih', gram: 120, unit: 'g', alt: 'sawi putih' }, { item: 'Kecap manis', gram: 20, unit: 'ml' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Ketumbar bubuk', gram: 2, unit: 'g' }], langkah: ['Potong tahu jadi bagian agak tebal. Rebus 3 menit untuk mengurangi kadar air, tiriskan.', 'Tumis bawang putih sampai harum. Masukkan 150ml air, kecap manis, dan ketumbar. Biarkan mendidih.', 'Masukkan tahu ke kuah bacem. Kecilkan api, masak 15 sampai 20 menit sambil sesekali dibalik sampai kuah menyusut.', 'Tumis kol iris tipis dengan bawang putih, 3 menit. Sajikan bersama nasi dan tahu bacem.'] } },
    { nama: 'Nasi Putih & Ayam Rebus Rempah dengan Sup Wortel', base_cal: 540, protein_tag: 'ayam', makro: { protein: 46, karbo: 58, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Dada ayam', gram: 150, unit: 'g' }, { item: 'Wortel', gram: 100, unit: 'g' }, { item: 'Serai', gram: 1, unit: 'batang' }, { item: 'Jahe', gram: 3, unit: 'cm' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Daun salam', gram: 2, unit: 'lembar' }], langkah: ['Didihkan air, masukkan serai geprek, jahe iris, bawang putih geprek, dan daun salam. Biarkan 2 menit biar keluar aromanya.', 'Masukkan dada ayam utuh, kecilkan api ke sedang. Rebus 25 sampai 30 menit sampai matang. Angkat, suwir.', 'Saring kaldu ke panci bersih. Masukkan wortel potong, rebus 10 menit. Bumbui garam dan lada.', 'Sajikan nasi putih dengan suwiran ayam rempah dan sup wortel hangat.'] } },
    { nama: 'Nasi Merah & Ayam Kecap Bawang dengan Tumis Sawi', base_cal: 545, protein_tag: 'ayam', makro: { protein: 44, karbo: 56, lemak: 13 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g' }, { item: 'Dada ayam', gram: 150, unit: 'g' }, { item: 'Sawi hijau', gram: 100, unit: 'g', alt: 'kangkung' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong ayam tipis-tipis melintang serat. Tumis bawang merah dan bawang putih iris sampai layu dan harum.', 'Masukkan ayam, aduk, masak 4 sampai 5 menit sampai warnanya berubah dan matang.', 'Tuang kecap manis dan kecap asin, aduk rata. Masak lagi 2 sampai 3 menit sampai bumbu meresap.', 'Tumis sawi hijau dengan bawang putih di wajan lain, 2 menit. Sajikan bersama nasi merah.'] } },
    { nama: 'Nasi Putih & Tempe Goreng Rempah dengan Sayur Asem', base_cal: 510, protein_tag: 'tempe', makro: { protein: 28, karbo: 68, lemak: 13 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Tempe', gram: 150, unit: 'g' }, { item: 'Kacang panjang', gram: 80, unit: 'g', alt: 'buncis' }, { item: 'Jagung manis', gram: 1, unit: 'buah' }, { item: 'Asam jawa', gram: 5, unit: 'g', alt: 'jeruk nipis' }, { item: 'Ketumbar bubuk', gram: 2, unit: 'g' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Iris tempe agak tebal. Lumuri rata dengan ketumbar bubuk, kunyit, garam, dan lada. Goreng di teflon 3 menit tiap sisi — biarkan dulu sebelum dibalik.', 'Didihkan 600ml air di panci. Masukkan asam jawa yang sudah dilarutkan sedikit air, garam, dan sedikit gula.', 'Masukkan jagung potong dan kacang panjang ke kuah asem. Masak 8 menit sampai sayur empuk.', 'Sajikan nasi dengan tempe goreng rempah dan sayur asem hangat.'] } },
    { nama: 'Nasi Merah & Tahu Panggang Saus Tomat dengan Tumis Wortel', base_cal: 480, protein_tag: 'tahu', makro: { protein: 26, karbo: 64, lemak: 11 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g' }, { item: 'Tahu putih', gram: 180, unit: 'g', alt: 'tahu kuning' }, { item: 'Tomat', gram: 2, unit: 'buah' }, { item: 'Wortel', gram: 100, unit: 'g', alt: 'kol' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Kecap manis', gram: 8, unit: 'ml' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong tahu jadi dadu sedang. Panggang di teflon tanpa minyak sampai semua sisi kecokelatan — balik pelan-pelan agar tidak hancur. Sisihkan.', 'Tumis bawang merah iris sampai layu. Masukkan tomat cincang kasar, kecap manis, dan 2 sendok makan air. Masak sampai tomat lunak dan sausnya agak mengental.', 'Masukkan tahu panggang ke saus tomat, aduk pelan. Masak 3 menit sampai bumbu meresap.', 'Tumis wortel iris tipis dengan bawang putih, 3 menit. Sajikan bersama nasi merah.'] } },
    { nama: 'Nasi Putih & Telur Dadar Kecap dengan Tumis Kangkung', base_cal: 490, protein_tag: 'telur', makro: { protein: 26, karbo: 60, lemak: 12 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Telur ayam', gram: 3, unit: 'butir' }, { item: 'Kangkung', gram: 100, unit: 'g', alt: 'bayam atau sawi' }, { item: 'Kecap manis', gram: 12, unit: 'ml' }, { item: 'Bawang merah', gram: 2, unit: 'siung' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Kocok 3 telur dengan sedikit garam dan lada sampai rata.', 'Tuang ke teflon panas dengan sedikit minyak. Masak api sedang sampai bawah set — balik sekali, masak 1 menit. Jangan sampai terlalu kering.', 'Siram kecap manis di atas dadar yang sudah diangkat. Potong-potong.', 'Tumis kangkung dengan bawang merah dan bawang putih 2 menit sampai layu. Sajikan bersama nasi putih.'] } },
    { nama: 'Nasi Putih & Ayam Tumis Buncis Bawang', base_cal: 535, protein_tag: 'ayam', makro: { protein: 42, karbo: 58, lemak: 11 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g', alt: 'nasi merah' }, { item: 'Dada ayam', gram: 150, unit: 'g' }, { item: 'Buncis', gram: 120, unit: 'g', alt: 'kacang panjang' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Kecap asin', gram: 10, unit: 'ml' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong ayam jadi dadu kecil. Tumis bawang merah dan bawang putih iris sampai harum dan layu.', 'Masukkan ayam, aduk rata. Masak 5 sampai 6 menit api sedang sampai ayam matang dan sedikit kecokelatan.', 'Masukkan buncis potong 3cm dan kecap asin. Tumis 4 menit sampai buncis empuk tapi masih hijau.', 'Sajikan langsung di atas nasi hangat.'] } },
    { nama: 'Nasi Merah & Tempe Tahu Goreng Kunyit dengan Tumis Kol', base_cal: 480, protein_tag: 'tempe', makro: { protein: 30, karbo: 56, lemak: 13 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g' }, { item: 'Tempe', gram: 100, unit: 'g' }, { item: 'Tahu putih', gram: 100, unit: 'g' }, { item: 'Kol putih', gram: 80, unit: 'g', alt: 'sawi hijau' }, { item: 'Kunyit bubuk', gram: 2, unit: 'g' }, { item: 'Ketumbar bubuk', gram: 1, unit: 'g' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong tempe dan tahu jadi dadu sedang. Lumuri semua dengan kunyit bubuk, ketumbar, dan garam. Aduk rata, diamkan 5 menit.', 'Panaskan sedikit minyak di teflon. Goreng tempe dulu 3 menit tiap sisi sampai kecokelatan dan harum. Angkat.', 'Goreng tahu di teflon yang sama dengan hati-hati — balik pelan supaya tidak hancur, 2 menit tiap sisi hingga kuning kecokelatan.', 'Tumis kol iris tipis dengan bawang putih geprek, 3 menit sampai agak layu. Sajikan tempe dan tahu goreng kunyit bersama tumis kol dan nasi merah.'] } },
    { nama: 'Nasi Putih & Tahu Goreng Kecap dengan Tumis Bayam', base_cal: 470, protein_tag: 'tahu', makro: { protein: 26, karbo: 62, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Tahu keras', gram: 200, unit: 'g' }, { item: 'Bayam segar', gram: 120, unit: 'g', alt: 'kangkung' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Potong tahu jadi potongan tebal sekitar 2cm. Goreng di teflon tanpa minyak tambahan sampai semua sisi kuning kecokelatan.', 'Tumis bawang putih geprek sampai harum. Masukkan tahu goreng dan kecap manis, aduk pelan. Masak 3 menit.', 'Tumis bayam segar dengan bawang putih geprek di wajan lain, 2 menit sampai layu.', 'Sajikan nasi putih dengan tahu goreng kecap dan tumis bayam.'] } },
    { nama: 'Nasi Putih & Telur Rebus Sambal Hijau dengan Tumis Buncis', base_cal: 500, protein_tag: 'telur', makro: { protein: 26, karbo: 62, lemak: 12 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 150, unit: 'g' }, { item: 'Telur ayam', gram: 3, unit: 'butir' }, { item: 'Buncis', gram: 100, unit: 'g', alt: 'kacang panjang' }, { item: 'Cabai hijau', gram: 3, unit: 'buah', alt: 'lada bubuk' }, { item: 'Tomat hijau', gram: 1, unit: 'buah', alt: 'tomat merah' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Rebus telur di air mendidih 10 menit. Angkat dan kupas.', 'Haluskan kasar cabai hijau, tomat hijau, dan bawang merah. Tumis di sedikit minyak sampai matang dan harum.', 'Masukkan telur rebus ke sambal, aduk pelan agar telur tidak hancur. Masak 2 menit.', 'Tumis buncis potong dengan bawang putih 4 menit. Sajikan semua bersama nasi.'] } },
    { nama: 'Nasi Merah & Ayam Suwir Kunyit dengan Sayur Bening', base_cal: 520, protein_tag: 'ayam', makro: { protein: 42, karbo: 56, lemak: 10 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 150, unit: 'g' }, { item: 'Dada ayam', gram: 150, unit: 'g' }, { item: 'Bayam segar', gram: 100, unit: 'g', alt: 'kangkung' }, { item: 'Jagung manis', gram: 80, unit: 'g' }, { item: 'Kunyit bubuk', gram: 1, unit: 'g' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }], langkah: ['Rebus ayam di air mendidih bersama kunyit bubuk dan bawang putih geprek, 20 menit. Angkat, suwir kasar.', 'Didihkan 500ml air di panci. Masukkan bawang merah iris, jagung potong, dan garam.', 'Masukkan bayam, masak 3 sampai 4 menit. Cicipi dan sesuaikan garam.', 'Sajikan nasi merah dengan ayam suwir kunyit dan sayur bening di mangkuk terpisah.'] } },
];

/* ============================================================
   MEAL DATA v6.6 — MALAM (14 rotasi) — tidak ada perubahan
   ============================================================ */
const MALAM_MEALS = [
    { nama: 'Kentang Kukus & Ayam Tumis Bawang dengan Tumis Bayam', base_cal: 420, protein_tag: 'ayam', makro: { protein: 36, karbo: 42, lemak: 11 }, resep: { bahan: [{ item: 'Kentang', gram: 200, unit: 'g' }, { item: 'Dada ayam', gram: 120, unit: 'g', alt: 'ayam suwir rebus' }, { item: 'Bayam segar', gram: 100, unit: 'g', alt: 'kangkung' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Potong kentang jadi dadu sedang. Kukus 15 menit sampai empuk saat ditusuk.', 'Potong ayam jadi strip tipis. Lumuri kecap asin dan lada. Tumis bawang merah dan bawang putih, masukkan ayam, masak 8 sampai 10 menit sampai matang.', 'Tumis bayam dengan bawang putih geprek, 2 menit sampai layu.', 'Sajikan kentang kukus hangat bersama ayam tumis bawang dan tumis bayam.'] } },
    { nama: 'Nasi Porsi Kecil & Telur Rebus Kecap dengan Sup Wortel Jahe', base_cal: 390, protein_tag: 'telur', makro: { protein: 22, karbo: 50, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 100, unit: 'g', alt: 'nasi merah' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Wortel', gram: 120, unit: 'g' }, { item: 'Jahe', gram: 3, unit: 'cm' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Minyak goreng', gram: 3, unit: 'ml' }], langkah: ['Rebus telur 10 menit, kupas. Panaskan sedikit minyak, masukkan telur dan kecap asin. Masak 3 menit sambil sesekali diputar agar warna merata.', 'Rebus wortel potong dengan jahe iris dan bawang putih geprek di 400ml air, 10 menit sampai wortel empuk.', 'Bumbui sup dengan garam dan lada. Cicipi.', 'Sajikan nasi porsi kecil dengan telur kecap dan sup wortel jahe hangat.'] } },
    { nama: 'Tempe Goreng Tipis & Tahu Kukus dengan Tumis Sayuran', base_cal: 380, protein_tag: 'tempe', makro: { protein: 28, karbo: 38, lemak: 14 }, resep: { bahan: [{ item: 'Tempe', gram: 120, unit: 'g' }, { item: 'Tahu putih', gram: 150, unit: 'g' }, { item: 'Wortel', gram: 80, unit: 'g' }, { item: 'Kol putih', gram: 80, unit: 'g', alt: 'sawi putih' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Iris tempe sangat tipis sekitar 3mm. Goreng di teflon tanpa minyak tambahan, api sedang — biarkan tiap sisi matang dan crispy kecokelatan sebelum dibalik. Sisihkan.', 'Potong tahu tebal, kukus 10 menit sampai matang. Setelah matang, siram kecap asin di atasnya.', 'Tumis bawang putih geprek sampai harum, masukkan wortel dan kol iris. Tumis 4 menit sambil sesekali diaduk sampai sayur agak lunak.', 'Sajikan tahu kukus, tempe goreng tipis crispy, dan tumis sayuran bersama.'] } },
    { nama: 'Nasi Merah Porsi Kecil & Ayam Kuah Jahe dengan Buncis Rebus', base_cal: 400, protein_tag: 'ayam', makro: { protein: 34, karbo: 42, lemak: 9 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 100, unit: 'g' }, { item: 'Dada ayam', gram: 130, unit: 'g' }, { item: 'Buncis', gram: 100, unit: 'g', alt: 'kacang panjang' }, { item: 'Jahe', gram: 4, unit: 'cm' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Daun bawang', gram: 20, unit: 'g' }, { item: 'Garam & lada', gram: 0, unit: 'secukupnya' }], langkah: ['Rebus ayam bersama jahe iris tebal dan bawang putih geprek di 400ml air, api sedang, 20 menit. Suwir. Masukkan kembali ke kaldu.', 'Tambahkan daun bawang iris ke kaldu. Bumbui garam dan lada. Biarkan mendidih sebentar.', 'Rebus buncis di air bergarum selama 5 menit hingga empuk tapi masih hijau. Tiriskan.', 'Sajikan nasi merah porsi kecil dengan kuah ayam jahe dan buncis rebus di samping.'] } },
    { nama: 'Nasi Putih & Tempe Tahu Goreng Kunyit dengan Tumis Kol', base_cal: 380, protein_tag: 'tempe', makro: { protein: 26, karbo: 42, lemak: 12 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 100, unit: 'g' }, { item: 'Tempe', gram: 80, unit: 'g' }, { item: 'Tahu putih', gram: 100, unit: 'g' }, { item: 'Kol putih', gram: 100, unit: 'g', alt: 'sawi hijau' }, { item: 'Kunyit bubuk', gram: 2, unit: 'g' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Bawang merah', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Potong tempe dan tahu jadi dadu kecil. Lumuri rata dengan kunyit bubuk, sedikit garam, dan lada. Diamkan 5 menit biar bumbu meresap.', 'Goreng tempe dulu di teflon dengan sedikit minyak, api sedang, sampai kecokelatan — 3 menit tiap sisi. Angkat. Lanjut goreng tahu dengan hati-hati agar tidak hancur, 2 menit tiap sisi.', 'Tumis kol iris tipis dengan bawang putih dan bawang merah geprek, 3 menit sampai agak layu dan harum.', 'Sajikan nasi putih porsi kecil dengan tempe tahu goreng kunyit dan tumis kol.'] } },
    { nama: 'Kentang Rebus & Tahu Goreng Kecap dengan Tumis Brokoli', base_cal: 410, protein_tag: 'tahu', makro: { protein: 22, karbo: 52, lemak: 12 }, resep: { bahan: [{ item: 'Kentang', gram: 220, unit: 'g' }, { item: 'Tahu keras', gram: 180, unit: 'g' }, { item: 'Brokoli atau kol', gram: 100, unit: 'g' }, { item: 'Kecap manis', gram: 12, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Rebus kentang utuh di air bergarum, 20 menit hingga empuk. Kupas, belah dua.', 'Potong tahu jadi dadu, goreng di teflon tanpa minyak hingga semua sisi cokelat. Siram kecap manis, biarkan 1 menit.', 'Tumis brokoli potong kecil dengan bawang putih geprek, 4 menit sampai empuk. Bumbui garam.', 'Sajikan kentang rebus hangat bersama tahu goreng kecap dan tumis brokoli.'] } },
    { nama: 'Sup Ayam Jahe Hangat dengan Nasi Merah', base_cal: 380, protein_tag: 'ayam', makro: { protein: 32, karbo: 40, lemak: 9 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 100, unit: 'g' }, { item: 'Dada ayam', gram: 120, unit: 'g' }, { item: 'Wortel', gram: 80, unit: 'g' }, { item: 'Kentang kecil', gram: 80, unit: 'g' }, { item: 'Jahe', gram: 4, unit: 'cm' }, { item: 'Bawang putih', gram: 3, unit: 'siung' }, { item: 'Seledri atau daun bawang', gram: 15, unit: 'g' }], langkah: ['Didihkan 600ml air, masukkan jahe geprek dan bawang putih geprek. Biarkan 2 menit biar keluar aromanya.', 'Masukkan ayam utuh, kecilkan api ke sedang. Rebus 20 menit sampai matang. Angkat, suwir, masukkan kembali ke kaldu.', 'Masukkan wortel dan kentang potong ke kaldu, rebus 10 menit sampai empuk.', 'Tabur seledri atau daun bawang iris. Cicipi garam dan lada. Sajikan sup hangat bersama nasi merah.'] } },
    { nama: 'Tempe Kukus & Telur Rebus dengan Sayur Bening Bayam', base_cal: 370, protein_tag: 'tempe', makro: { protein: 26, karbo: 38, lemak: 13 }, resep: { bahan: [{ item: 'Tempe', gram: 150, unit: 'g' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Bayam segar', gram: 150, unit: 'g', alt: 'kangkung' }, { item: 'Jagung manis', gram: 80, unit: 'g' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Kecap asin', gram: 5, unit: 'ml' }, { item: 'Garam', gram: 0, unit: 'secukupnya' }], langkah: ['Kukus tempe utuh atau potong besar selama 15 menit sampai matang dan teksturnya sedikit lebih padat. Setelah matang, siram kecap asin di atasnya agar ada rasa gurih.', 'Rebus telur di air mendidih 10 menit untuk kuning matang penuh. Angkat, rendam air dingin sebentar, lalu kupas dan potong dua.', 'Didihkan 400ml air di panci. Masukkan bawang merah iris tipis dan jagung potong. Masak 5 menit. Masukkan bayam, masak 2 menit lagi sampai layu. Bumbui garam, cicipi.', 'Sajikan tempe kukus dan telur rebus bersama sayur bening bayam dalam mangkuk. Menu ini ringan dan cocok untuk makan malam.'] } },
    { nama: 'Nasi Porsi Kecil & Ayam Tumis Kecap dengan Tumis Wortel', base_cal: 395, protein_tag: 'ayam', makro: { protein: 36, karbo: 38, lemak: 10 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 100, unit: 'g' }, { item: 'Dada ayam', gram: 140, unit: 'g' }, { item: 'Wortel', gram: 100, unit: 'g', alt: 'kol' }, { item: 'Kecap manis', gram: 12, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Bawang merah', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Potong ayam tipis melintang serat. Tumis bawang merah dan bawang putih sampai harum.', 'Masukkan ayam, aduk, masak 5 menit sampai warnanya berubah dan matang.', 'Tuang kecap manis, aduk rata. Masak lagi 2 menit sampai bumbu menempel.', 'Tumis wortel iris tipis dengan bawang putih di wajan lain, 3 menit. Sajikan nasi porsi kecil dengan ayam kecap dan tumis wortel.'] } },
    { nama: 'Nasi Putih & Tahu Goreng Sambal dengan Tumis Sawi', base_cal: 400, protein_tag: 'tahu', makro: { protein: 22, karbo: 50, lemak: 11 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 100, unit: 'g' }, { item: 'Tahu keras', gram: 200, unit: 'g' }, { item: 'Sawi hijau', gram: 100, unit: 'g', alt: 'kangkung' }, { item: 'Sambal', gram: 10, unit: 'g', alt: 'cabai rawit + tomat' }, { item: 'Kecap manis', gram: 8, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Potong tahu jadi dadu sedang. Goreng di teflon tanpa minyak sampai semua sisi cokelat dan agak kering.', 'Masukkan kecap manis dan sambal ke tahu. Aduk pelan agar tahu tidak hancur. Masak 2 sampai 3 menit sampai bumbu meresap.', 'Tumis sawi hijau dengan bawang putih geprek, 2 menit sampai layu.', 'Sajikan nasi porsi kecil dengan tahu goreng sambal dan tumis sawi.'] } },
    { nama: 'Nasi Merah & Tempe Goreng dengan Tumis Kangkung Bawang', base_cal: 410, protein_tag: 'tempe', makro: { protein: 26, karbo: 48, lemak: 13 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 100, unit: 'g' }, { item: 'Tempe', gram: 140, unit: 'g' }, { item: 'Kangkung', gram: 120, unit: 'g', alt: 'bayam atau sawi' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Kecap asin', gram: 8, unit: 'ml' }, { item: 'Minyak goreng', gram: 8, unit: 'ml' }], langkah: ['Iris tempe tipis-tipis. Goreng di teflon dengan sedikit minyak, api sedang. Biarkan tiap sisi matang dan crispy sebelum dibalik.', 'Tumis bawang merah dan bawang putih iris sampai harum dan layu.', 'Masukkan kangkung dan kecap asin, aduk sebentar. Tumis 2 menit sampai kangkung layu.', 'Sajikan nasi merah dengan tempe goreng crispy dan tumis kangkung bawang.'] } },
    { nama: 'Kentang Kukus & Telur Rebus dengan Tumis Bayam Bawang', base_cal: 380, protein_tag: 'telur', makro: { protein: 20, karbo: 48, lemak: 11 }, resep: { bahan: [{ item: 'Kentang', gram: 200, unit: 'g' }, { item: 'Telur ayam', gram: 2, unit: 'butir' }, { item: 'Bayam segar', gram: 120, unit: 'g', alt: 'kangkung' }, { item: 'Bawang merah', gram: 3, unit: 'siung' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Kecap asin', gram: 6, unit: 'ml' }, { item: 'Minyak goreng', gram: 5, unit: 'ml' }], langkah: ['Cuci kentang, potong beberapa bagian. Kukus 15 menit hingga empuk.', 'Rebus telur di air mendidih 10 menit. Angkat, rendam air dingin, kupas, dan potong dua.', 'Tumis bawang merah dan bawang putih iris sampai harum. Masukkan bayam dan kecap asin, aduk. Masak 2 menit.', 'Sajikan kentang kukus dengan telur rebus dan tumis bayam bawang.'] } },
    { nama: 'Nasi Putih & Ayam Kuah Bening Jahe', base_cal: 370, protein_tag: 'ayam', makro: { protein: 32, karbo: 38, lemak: 8 }, resep: { bahan: [{ item: 'Nasi putih matang', gram: 100, unit: 'g' }, { item: 'Dada ayam', gram: 130, unit: 'g' }, { item: 'Sawi hijau', gram: 100, unit: 'g', alt: 'bayam' }, { item: 'Jahe', gram: 3, unit: 'cm' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Daun bawang', gram: 20, unit: 'g' }, { item: 'Garam & lada', gram: 0, unit: 'secukupnya' }], langkah: ['Didihkan 500ml air. Masukkan jahe geprek dan bawang putih geprek.', 'Masukkan ayam utuh, kecilkan api ke sedang. Rebus 20 menit sampai matang. Angkat, suwir.', 'Masukkan sawi hijau ke kaldu, masak 2 menit. Masukkan kembali ayam suwir dan daun bawang iris. Bumbui garam dan lada.', 'Sajikan nasi porsi kecil dengan kuah ayam bening jahe hangat.'] } },
    { nama: 'Nasi Merah & Tahu Bacem dengan Tumis Wortel Buncis', base_cal: 390, protein_tag: 'tahu', makro: { protein: 22, karbo: 48, lemak: 11 }, resep: { bahan: [{ item: 'Nasi merah matang', gram: 100, unit: 'g' }, { item: 'Tahu kuning keras', gram: 180, unit: 'g' }, { item: 'Wortel', gram: 80, unit: 'g' }, { item: 'Buncis', gram: 80, unit: 'g', alt: 'kacang panjang' }, { item: 'Kecap manis', gram: 15, unit: 'ml' }, { item: 'Bawang putih', gram: 2, unit: 'siung' }, { item: 'Ketumbar bubuk', gram: 1, unit: 'g' }], langkah: ['Potong tahu jadi potongan agak tebal. Rebus 3 menit, tiriskan.', 'Tumis bawang putih sampai harum. Masukkan kecap manis, ketumbar, garam, dan 100ml air. Masukkan tahu, masak api kecil 15 menit sampai kuah menyusut.', 'Tumis wortel iris dan buncis potong 3cm dengan bawang putih, 4 menit. Bumbui garam.', 'Sajikan nasi merah dengan tahu bacem dan tumis wortel buncis.'] } },
];


/* ============================================================
   WORKOUT DATA — tidak ada perubahan
   ============================================================ */
const WORKOUT_DAY_MAP = ['push', 'lower', 'pull', 'cardio', 'push', 'lower', 'rest'];

const PHASES = {
    foundation: { label: 'Fondasi', days: '1–28', sets: '3', repsRaw: '8–10', rest: 90, restLabel: '90 dtk', desc: 'Bangun pola gerak yang benar, perkenalkan tubuh pada latihan rutin.', color: 'var(--accent)' },
    build: { label: 'Bangun', days: '29–56', sets: '3', repsRaw: '10–12', rest: 75, restLabel: '75 dtk', desc: 'Tingkatkan repetisi, fokus pada koneksi pikiran–otot.', color: 'var(--blue)' },
    intensity: { label: 'Intensitas', days: '57–84', sets: '4', repsRaw: '12–15', rest: 60, restLabel: '60 dtk', desc: 'Tambah set, kurangi istirahat untuk membangun endurance.', color: 'var(--orange)' },
    peak: { label: 'Puncak', days: '85–90', sets: '4', repsRaw: '15–20', rest: 45, restLabel: '45 dtk', desc: 'Capai performa terbaik sebelum program selesai.', color: 'var(--purple)' },
};

const WORKOUT_TEMPLATES = {
    push: { label: 'Latihan Mendorong (Dada & Bahu)', type: 'Push Day', icon: '🏋️', timeRec: 'Pagi hari lebih optimal untuk push day.', exercises: ['pushup', 'wide_pushup', 'pike_pushup', 'tricep_dips', 'plank'] },
    pull: { label: 'Latihan Menarik (Punggung & Bisep)', type: 'Pull Day', icon: '💪', timeRec: 'Pagi atau sore hari, pilih sesuai energimu.', exercises: ['superman', 'reverse_lunge', 'bicycle_crunch', 'mountain_climber', 'plank'] },
    lower: { label: 'Latihan Bawah Tubuh (Kaki & Bokong)', type: 'Lower Day', icon: '🦵', timeRec: 'Sore hari cocok untuk lower body workout.', exercises: ['squat', 'glute_bridge', 'reverse_lunge', 'wall_sit', 'plank'] },
    cardio: { label: 'Kardio & Core Aktif', type: 'Cardio Day', icon: '🔥', timeRec: 'Pagi hari (6–9) atau sore (16–18) paling ideal.', exercises: ['high_knees', 'burpee', 'mountain_climber', 'bicycle_crunch', 'plank'] },
    rest: { label: 'Pemulihan Aktif', type: 'Rest Day', icon: '🧘', timeRec: 'Bisa kapan saja. Nikmati hari istirahat ini.', exercises: ['stretching', 'breathing', 'light_walk'] },
};

const WARMUP_EXERCISES = [
    { nama: 'Pemanasan Sendi & Leher', langkah: ['Putar leher perlahan ke kiri dan kanan, masing-masing 5 kali.', 'Putar bahu ke depan 10 kali, lalu ke belakang 10 kali.', 'Putar pergelangan tangan dan kaki masing-masing 10 kali.', 'Ayunkan lengan ke atas dan ke bawah 10 kali.'] },
    { nama: 'Aktivasi Ringan (March In Place)', langkah: ['Berdiri tegak, angkat lutut kanan setinggi pinggang, lalu turunkan.', 'Ganti ke lutut kiri. Lakukan bergantian selama 30–45 detik.', 'Tempo sedang — tidak perlu terlalu cepat, fokus napas teratur.', 'Ayunkan lengan berlawanan secara alami untuk koordinasi.'] },
];

const COOLDOWN_EXERCISES = [
    { nama: 'Peregangan & Pendinginan', langkah: ['Peregangan leher: miringkan ke kiri dan kanan, tahan 15 detik tiap sisi.', 'Peregangan bahu: silangkan satu lengan di depan dada, tahan 20 detik.', 'Peregangan punggung: posisi child pose, lengan lurus ke depan, tahan 30 detik.', 'Peregangan kaki: duduk, luruskan kaki, raih ujung kaki. Tahan 20 detik.'] },
];

const EXERCISES = {
    squat: { nama: 'Squat', otot: 'Paha, Bokong, Core', langkah: ['Berdiri dengan kaki selebar bahu, jari kaki sedikit ke luar.', 'Dorong pinggul ke belakang seperti akan duduk, turunkan hingga paha sejajar lantai atau lebih rendah.', 'Jaga punggung tetap lurus, dada tegak, lutut searah dengan jari kaki.', 'Tahan 1 detik di bawah, dorong lantai dengan kaki untuk berdiri kembali.'], kesalahan: ['Lutut masuk ke dalam (knee cave) — aktifkan otot pinggul untuk mendorong lutut ke luar.', 'Tumit terangkat dari lantai — buka kaki sedikit lebih lebar atau turunkan kecepatan.', 'Tubuh terlalu condong ke depan — jaga dada tetap tegak dan pandangan ke depan.'] },
    glute_bridge: { nama: 'Glute Bridge', otot: 'Bokong, Hamstring, Core', langkah: ['Berbaring telentang, lutut ditekuk 90 derajat, telapak kaki rata di lantai.', 'Lengan lurus di samping tubuh untuk stabilitas.', 'Tekan core, dorong pinggul ke atas hingga tubuh membentuk garis lurus dari bahu ke lutut.', 'Tahan 2–3 detik di atas, turunkan perlahan hampir menyentuh lantai.'], kesalahan: ['Hiperekstensi pinggang — pastikan garis lurus dari bahu ke lutut.', 'Kaki terlalu jauh atau terlalu dekat — lutut ideal tepat di atas pergelangan kaki.', 'Lupa tekan core — perut harus aktif sepanjang gerakan.'] },
    reverse_lunge: { nama: 'Reverse Lunge', otot: 'Paha, Bokong, Keseimbangan', langkah: ['Berdiri tegak, tangan di pinggang.', 'Langkahkan satu kaki ke belakang 60–80cm.', 'Tekuk kedua lutut, turunkan lutut belakang hampir menyentuh lantai.', 'Dorong kaki depan untuk berdiri kembali. Ganti kaki.'], kesalahan: ['Langkah terlalu pendek menyebabkan lutut depan melampaui jari kaki.', 'Badan condong ke depan — tetap jaga torso tegak.', 'Kehilangan keseimbangan — mulai pelan.'] },
    wall_sit: { nama: 'Wall Sit (Isometrik)', otot: 'Paha Depan, Betis, Daya Tahan', langkah: ['Berdiri membelakangi dinding, jarak 60cm.', 'Geser punggung ke bawah hingga lutut membentuk sudut 90 derajat.', 'Paha sejajar lantai, punggung menempel dinding.', 'Tahan posisi selama durasi yang ditentukan, bernapas stabil.'], kesalahan: ['Lutut melewati jari kaki — geser posisi kaki lebih maju.', 'Punggung tidak menempel dinding — tekan punggung bawah ke dinding.', 'Menahan napas — terus bernapas normal.'] },
    pushup: { nama: 'Push Up', otot: 'Dada, Tricep, Bahu, Core', langkah: ['Posisi plank: tangan selebar bahu lebih, jari mengarah ke depan.', 'Tubuh membentuk garis lurus dari kepala hingga tumit.', 'Tekuk siku ke samping belakang, turunkan dada mendekati lantai.', 'Dorong lantai dengan tangan untuk kembali ke posisi awal.'], kesalahan: ['Pinggul turun atau naik — jaga tubuh tetap garis lurus.', 'Siku melebar 90 derajat — sudut ideal sekitar 45 derajat dari tubuh.', 'Range of motion tidak penuh — pastikan dada hampir menyentuh lantai.'] },
    wide_pushup: { nama: 'Wide Push Up', otot: 'Dada Bagian Luar, Tricep', langkah: ['Posisi push up tapi tangan lebih lebar dari bahu, sekitar 1,5x lebar bahu.', 'Jaga tubuh tetap garis lurus.', 'Tekuk siku ke samping, turunkan dada mendekati lantai.', 'Dorong naik dengan fokus kontraksi dada bagian luar.'], kesalahan: ['Tangan terlalu lebar sehingga siku tidak fleksibel.', 'Pinggul drop — core harus aktif.', 'Terlalu cepat — lakukan 2 detik turun, 1 detik naik.'] },
    pike_pushup: { nama: 'Pike Push Up', otot: 'Bahu, Tricep, Upper Chest', langkah: ['Mulai push up biasa, angkat pinggul tinggi-tinggi membentuk V.', 'Tangan selebar bahu.', 'Tekuk siku ke samping, turunkan kepala mendekati lantai di antara tangan.', 'Dorong naik kembali ke posisi V.'], kesalahan: ['Pinggul tidak cukup tinggi — semakin tinggi, semakin besar kerja bahu.', 'Kepala tidak turun cukup rendah — usahakan hampir menyentuh lantai.', 'Kehilangan keseimbangan — letakkan tangan lebih lebar.'] },
    superman: { nama: 'Superman Extension', otot: 'Punggung Bawah, Bokong, Hamstring', langkah: ['Berbaring tengkurap, lengan lurus di depan dan kaki lurus ke belakang.', 'Kencangkan otot bokong dan punggung bawah.', 'Angkat kepala, dada, lengan, dan kaki bersamaan.', 'Tahan 2–3 detik, turunkan perlahan.'], kesalahan: ['Terlalu memaksakan leher ke atas — jaga kepala segaris tulang belakang.', 'Hanya mengangkat kaki atau tangan saja — angkat keduanya bersamaan.', 'Gerakan terlalu cepat — kontrol penuh.'] },
    tricep_dips: { nama: 'Tricep Dips (Kursi)', otot: 'Tricep, Bahu, Dada Bawah', langkah: ['Duduk di tepi kursi kuat, tangan di tepi kursi.', 'Geser bokong ke depan hingga melayang.', 'Tekuk siku ke belakang, turunkan bokong hingga siku 90 derajat.', 'Dorong naik, luruskan siku.'], kesalahan: ['Bahu terangkat — jaga bahu turun dan rileks.', 'Siku melebar ke samping — siku harus mengarah ke belakang.', 'Turun terlalu dalam melewati 90 derajat.'] },
    plank: { nama: 'Plank', otot: 'Core, Bahu, Punggung, Seluruh Tubuh', langkah: ['Berbaring tengkurap, angkat tubuh dengan forearm atau tangan lurus.', 'Siku tepat di bawah bahu untuk forearm plank.', 'Tubuh garis lurus dari kepala hingga tumit. Kencangkan perut dan bokong.', 'Tarik napas normal, pertahankan posisi.'], kesalahan: ['Pinggul terlalu naik atau terlalu turun — harus garis lurus sempurna.', 'Siku tidak tepat di bawah bahu.', 'Menahan napas — tetap bernapas normal.'] },
    mountain_climber: { nama: 'Mountain Climber', otot: 'Core, Bahu, Hip Flexor, Kardio', langkah: ['Mulai posisi push up tinggi, tangan selebar bahu.', 'Jaga pinggul tidak terangkat atau turun.', 'Tarik lutut kanan cepat ke dada, kembalikan, langsung ganti lutut kiri.', 'Lakukan tempo cepat seperti berlari di posisi plank.'], kesalahan: ['Pinggul terangkat terlalu tinggi — mengurangi kerja core.', 'Langkah terlalu pendek — tarik lutut sedekat mungkin ke dada.', 'Tangan bergeser — kunci tangan di tempatnya.'] },
    burpee: { nama: 'Burpee', otot: 'Full Body, Kardio, Kekuatan', langkah: ['Berdiri tegak, jongkok dan letakkan tangan di lantai.', 'Lompat kedua kaki ke belakang ke posisi push up.', 'Lakukan 1 push up, lompat kaki kembali ke posisi jongkok.', 'Lompat ke atas dengan tangan diayunkan ke atas. Pendaratan lembut.'], kesalahan: ['Terburu-buru dan teknik berantakan — lebih baik lambat tapi benar.', 'Punggung bungkuk saat posisi push up — core aktif.', 'Pendaratan keras — ujung kaki dulu, lutut sedikit ditekuk.'] },
    high_knees: { nama: 'High Knees', otot: 'Hip Flexor, Core, Kardio', langkah: ['Berdiri tegak, kaki selebar pinggul.', 'Berlari di tempat dengan mengangkat lutut setinggi pinggul.', 'Aktifkan core, jaga torso tegak.', 'Ayunkan lengan berlawanan untuk koordinasi.'], kesalahan: ['Lutut tidak terangkat cukup tinggi — target minimal sejajar pinggul.', 'Badan condong ke belakang — jaga tubuh tetap tegak.', 'Kaki mendarat terlalu keras — ujung kaki mendarat lebih dulu.'] },
    bicycle_crunch: { nama: 'Bicycle Crunch', otot: 'Oblique, Core, Hip Flexor', langkah: ['Berbaring telentang, tangan di belakang kepala.', 'Angkat kedua kaki, lutut ditekuk 90 derajat.', 'Angkat bahu, tarik lutut kanan ke dada sambil putar siku kiri mendekatinya.', 'Ganti sisi secara bergantian dengan tempo stabil.'], kesalahan: ['Menarik kepala dengan tangan — tangan hanya menyentuh, tidak mendorong.', 'Lutut tidak cukup dekat ke dada — gerakkan lutut hingga hampir menyentuh siku.', 'Punggung bawah terangkat dari lantai — jaga agar tetap menempel.'] },
    stretching: { nama: 'Peregangan Seluruh Tubuh', otot: 'Fleksibilitas, Pemulihan', langkah: ['Lakukan peregangan leher: miringkan kepala ke kiri dan kanan, tahan 15 detik tiap sisi.', 'Peregangan bahu: silangkan satu lengan di depan dada, tahan dengan lengan lain 20 detik.', 'Peregangan punggung: posisi child pose, lengan lurus ke depan, tahan 30 detik.', 'Peregangan kaki: duduk, luruskan kaki, raih ujung kaki. Tahan 20 detik tiap kaki.'], kesalahan: ['Memaksakan peregangan hingga terasa nyeri — hanya sampai terasa tarikan nyaman.', 'Menahan napas saat stretching — tetap bernapas dalam dan stabil.', 'Terburu-buru — setiap posisi minimal 15–30 detik.'] },
    breathing: { nama: 'Latihan Pernapasan Dalam', otot: 'Paru-paru, Sistem Saraf, Relaksasi', langkah: ['Duduk atau berbaring nyaman. Tutup mata.', 'Hirup napas dalam melalui hidung selama 4 detik, rasakan perut mengembang.', 'Tahan napas selama 4 detik.', 'Hembuskan perlahan melalui mulut selama 6–8 detik. Ulangi 10 kali.'], kesalahan: ['Bernapas dengan dada bukan perut — fokus pada pengembangan perut saat menghirup.', 'Durasi terlalu singkat — minimal lakukan 5–10 menit untuk efek optimal.'] },
    light_walk: { nama: 'Jalan Santai', otot: 'Seluruh Tubuh, Kardio Rendah', langkah: ['Lakukan jalan santai selama 20–30 menit di sekitar rumah atau taman.', 'Jaga postur tegak, pandangan ke depan, ayunkan lengan alami.', 'Tempo santai — bisa berbicara tanpa ngos-ngosan.', 'Gunakan waktu ini untuk menikmati lingkungan dan merelaksasi pikiran.'], kesalahan: ['Berjalan terlalu cepat — hari istirahat bukan untuk latihan keras.', 'Melewatkan hari istirahat — recovery aktif penting untuk progress optimal.'] },
    march_in_place: { nama: 'March In Place', otot: 'Hip Flexor, Kardio Ringan', langkah: ['Berdiri tegak dengan kaki selebar pinggul.', 'Angkat lutut kanan setinggi pinggang, lalu turunkan. Ganti ke kiri.', 'Ayunkan lengan berlawanan secara natural seperti berjalan.', 'Lakukan selama 60–90 detik dengan tempo stabil, napas teratur.'], kesalahan: ['Mengangkat lutut terlalu rendah — usahakan setinggi pinggang.', 'Badan miring ke samping — jaga torso tetap tegak.'] },
    slow_knee_raise: { nama: 'Slow Knee Raise', otot: 'Hip Flexor, Core, Keseimbangan', langkah: ['Berdiri tegak dekat dinding untuk keseimbangan jika perlu.', 'Angkat lutut kanan perlahan setinggi pinggang, tahan 2 detik.', 'Turunkan perlahan. Ganti ke lutut kiri.', 'Ulangi bergantian dengan tempo sangat terkontrol.'], kesalahan: ['Terburu-buru — gerakan harus pelan dan terkontrol.', 'Badan bergoyang — jaga core tetap aktif dan torso tegak.'] },
    step_jack: { nama: 'Step Jack (Tanpa Lompat)', otot: 'Kaki, Bahu, Kardio Ringan', langkah: ['Berdiri tegak. Langkahkan kaki kanan ke samping kanan.', 'Ikuti dengan kaki kiri ke posisi semula sambil angkat kedua tangan ke atas.', 'Langkahkan kaki kiri ke samping kiri, ikuti kaki kanan.', 'Ulangi berirama tanpa melompat — ini versi aman dari jumping jack.'], kesalahan: ['Melompat tanpa disadari — pastikan satu kaki selalu di lantai.', 'Gerakan terlalu cepat — jaga tempo agar mudah dikontrol.'] },
    step_touch: { nama: 'Step Touch', otot: 'Kaki, Koordinasi, Kardio Ringan', langkah: ['Berdiri tegak, tangan di pinggang atau depan dada.', 'Langkahkan kaki kanan ke kanan, sentuhkan kaki kiri ke sampingnya.', 'Langkahkan kaki kiri ke kiri, sentuhkan kaki kanan.', 'Tambahkan ayunan tangan ke samping untuk gerakan lebih aktif.'], kesalahan: ['Gerakan kaki tidak penuh — langkah cukup lebar agar efektif.', 'Kaki tidak benar-benar menyentuh — kontrol penuh setiap langkah.'] },
    wall_pushup: { nama: 'Wall Push Up', otot: 'Dada, Tricep, Bahu (Low Impact)', langkah: ['Berdiri menghadap dinding, jarak 60–80 cm.', 'Letakkan tangan di dinding setinggi bahu, selebar bahu.', 'Tekuk siku dan condongkan tubuh ke dinding, dada hampir menyentuh dinding.', 'Dorong kembali ke posisi awal. Satu gerakan = 2–3 detik.'], kesalahan: ['Badan tidak lurus — jaga dari kepala hingga tumit satu garis lurus.', 'Siku melebar terlalu jauh — sudut sekitar 45 derajat dari tubuh.'] },
    controlled_squat: { nama: 'Controlled Squat (Pelan)', otot: 'Paha, Bokong, Core', langkah: ['Berdiri kaki selebar bahu, jari kaki sedikit keluar.', 'Turunkan tubuh sangat pelan (hitung 4 detik) sambil dorong pinggul ke belakang.', 'Turun sampai paha sejajar lantai atau semampu mungkin.', 'Naik kembali pelan (hitung 2 detik). Kontrol penuh.'], kesalahan: ['Terburu-buru — kecepatan harus sangat lambat untuk versi ini.', 'Lutut masuk ke dalam — dorong keluar agar searah jari kaki.'] },
};

const LOW_IMPACT_CARDIO = ['march_in_place', 'step_jack', 'step_touch'];
const LOW_IMPACT_PUSH = ['wall_pushup', 'controlled_squat', 'plank', 'glute_bridge', 'superman'];
const HIGH_IMPACT_BLOCKED = ['jumping_jack', 'burpee', 'high_knees', 'mountain_climber', 'jump_squat'];
const HIGH_IMPACT_REPLACE = {
    jumping_jack: 'step_jack',
    burpee: 'march_in_place',
    high_knees: 'step_touch',
    mountain_climber: 'slow_knee_raise',
    jump_squat: 'controlled_squat',
};


/* ============================================================
   USER CLASSIFICATION
   ============================================================ */
function getUserBMI() {
    const user = loadState(KEYS.user);
    if (!user || !user.weight || !user.height) return null;
    return user.weight / Math.pow(user.height / 100, 2);
}

function getUserType() {
    const bmi = getUserBMI();
    if (bmi === null) return 'normal';
    if (bmi > 30) return 'overweight';
    if (bmi < 18.5) return 'underweight';
    return 'normal';
}

/* ============================================================
   LOW IMPACT MODE
   ============================================================ */
function isLowImpactMode(day) {
    return getUserType() === 'overweight' || day <= 14;
}

/* FIX-8: hapus param `weight` yang tidak pernah digunakan */
function isLowImpactDay(day, energy) {
    return getUserType() === 'overweight' || day <= 14 || energy <= 2;
}

/* ============================================================
   TRAINING PHASE LABEL
   FIX-9: batas hari diselaraskan dengan PHASES constant
   Sebelum: < 7 / < 30 / < 60 (tidak sinkron dengan PHASES)
   Sesudah: ≤ 28 / ≤ 56 / ≤ 84  (sinkron persis dengan foundation/build/intensity/peak)
   Label juga diambil dari PHASES agar tidak ada duplikasi string.
   ============================================================ */
function getTrainingPhaseLabel(day) {
    if (day <= 28) return PHASES.foundation.label;  // 'Fondasi'
    if (day <= 56) return PHASES.build.label;        // 'Bangun'
    if (day <= 84) return PHASES.intensity.label;    // 'Intensitas'
    return PHASES.peak.label;                         // 'Puncak'
}

/* ============================================================
   GOAL-BASED EXERCISE SELECTION
   ============================================================ */
const STRENGTH_EXERCISES = ['pushup', 'wide_pushup', 'pike_pushup', 'tricep_dips', 'plank', 'squat', 'glute_bridge', 'reverse_lunge', 'wall_sit', 'superman', 'wall_pushup', 'controlled_squat'];
const CARDIO_LIGHT_EXERCISES = ['march_in_place', 'step_jack', 'step_touch', 'slow_knee_raise', 'bicycle_crunch'];
const CARDIO_ALL = ['high_knees', 'burpee', 'mountain_climber', 'step_touch', 'march_in_place', 'step_jack', 'slow_knee_raise', 'bicycle_crunch'];
const STRENGTH_POOL_GAIN = ['squat', 'glute_bridge', 'plank', 'pushup', 'wall_pushup', 'superman', 'wall_sit', 'controlled_squat'];

/* FIX-10: hapus param `type` yang tidak pernah digunakan di dalam fungsi
   FIX-11 (CRITICAL): cegah duplikasi exercise pada goal === 'gain'

   BUG ASLI:
     poolIdx cycling bisa menghasilkan replacement yang sudah ada di result.
     Contoh: result = ['squat', 'mountain_climber', 'plank']
     STRENGTH_POOL_GAIN[0] = 'squat' → mountain_climber diganti squat
     → ['squat', 'squat', 'plank'] ← DUPLIKAT

   FIX:
     Gunakan Set `inUse` untuk tracking exercise yang sudah ada,
     lalu cari replacement yang BELUM ada di Set tersebut.
     Jika pool habis (semua strength sudah terpakai), biarkan cardio tetap
     daripada menambah duplikat.
*/
function filterByGoal(exercises, goal) {
    if (!goal || goal === 'maintain') return exercises;

    if (goal === 'gain') {
        const total = exercises.length;
        const minStrength = Math.ceil(total * 0.7);
        const result = [...exercises];
        let strengthCount = result.filter(k => STRENGTH_EXERCISES.includes(k)).length;

        if (strengthCount < minStrength) {
            const inUse = new Set(result); /* track semua exercise yang sedang ada di list */

            for (let i = 0; i < result.length; i++) {
                if (strengthCount >= minStrength) break;
                const k = result[i];

                if (CARDIO_ALL.includes(k) && !STRENGTH_EXERCISES.includes(k)) {
                    /* Cari exercise strength yang BELUM ada di result */
                    const replacement = STRENGTH_POOL_GAIN.find(s => !inUse.has(s));
                    if (replacement) {
                        inUse.delete(k);        /* hapus exercise lama dari tracking */
                        inUse.add(replacement); /* daftarkan yang baru */
                        result[i] = replacement;
                        strengthCount++;
                    }
                    /* Jika semua STRENGTH_POOL_GAIN sudah terpakai, biarkan cardio tetap */
                }
            }
        }
        return result;
    }

    if (goal === 'lose') {
        return exercises.map(k =>
            HIGH_IMPACT_BLOCKED.includes(k) ? (HIGH_IMPACT_REPLACE[k] || 'march_in_place') : k
        );
    }

    return exercises;
}
// Maps focus to which workout type aligns best
function getWorkoutTypeByFocus(focus, defaultType) {
    if (defaultType === 'rest' || defaultType === 'cardio') return defaultType;
    if (focus === 'upper') return 'push';
    if (focus === 'lower') return 'lower';
    if (focus === 'full') return 'pull'; // pull = full body (back + core + legs)
    return defaultType;
}
function getLowEnergyProtectionMultiplier() {
    try {
        const days = [];
        for (let i = 0; i < 3; i++) {
            const d = new Date(); d.setDate(d.getDate() - i);
            const k = KEYS.energy + d.toISOString().split('T')[0];
            const e = loadState(k);
            if (e && e.energy) days.push(e.energy);
        }
        if (days.length >= 3 && days.every(e => e <= 2)) {
            // Force 0.8 and reset signal
            return 0.8;
        }
    } catch (e2) { }
    return null;
}

/* ============================================================
   KONSTANTA MODUL — ubah di sini untuk update semua referensi
   ============================================================ */
const MAX_EXERCISES = 5;

/* ============================================================
   WORKOUT EXERCISE SELECTION v6.5
   Source-level safety: semua filter high-impact dilakukan di sini.
   Tidak ada ketergantungan pada scan di level render.
   ============================================================ */
function getWorkoutExercises(type, day) {
    if (type === 'rest') return WORKOUT_TEMPLATES.rest.exercises;

    /* FIX-2: guard — cegah crash jika tipe tidak ada di template */
    if (!WORKOUT_TEMPLATES[type]) {
        console.error('[getWorkoutExercises] tipe latihan tidak dikenal:', type);
        return [];
    }

    const user = loadState(KEYS.user);
    const goal = user ? user.goal : 'maintain';
    const lowImpact = isLowImpactMode(day);            /* true jika overweight ATAU day <= 14 */
    const forceBlock = getUserType() === 'overweight';  /* blok absolut tanpa pengecualian */

    let exercises = [...WORKOUT_TEMPLATES[type].exercises];

    /* PASS 1: filter low-impact dan overweight
       lowImpact sudah mencakup forceBlock karena isLowImpactMode() memeriksa overweight,
       sehingga kondisi || forceBlock di sini hanya sebagai penjaga eksplisit */
    if (lowImpact || forceBlock) {
        exercises = exercises.map(k => {
            if (HIGH_IMPACT_BLOCKED.includes(k)) return HIGH_IMPACT_REPLACE[k] || 'march_in_place';
            if (k === 'pushup' && (day < 7 || forceBlock)) return 'wall_pushup';
            return k;
        });
    }


    /* Terapkan pemilihan latihan berbasis goal */
    exercises = filterByGoal(exercises, goal);

    /* PASS 2 (dulunya PASS 3): guard absolut setelah filterByGoal — cegah exercise
       high-impact yang mungkin lolos akibat logika goal filter, khusus untuk overweight */
    if (forceBlock) {
        exercises = exercises.map(k =>
            HIGH_IMPACT_BLOCKED.includes(k) ? (HIGH_IMPACT_REPLACE[k] || 'march_in_place') : k
        );
    }

    return exercises.slice(0, MAX_EXERCISES);
}


/* ============================================================
   ADAPTIVE INTENSITY SYSTEM
   ============================================================ */

/* Variabel global rest-timer (digunakan di bagian lain codebase) */
let restTimerInterval = null;
let restTimerSeconds = 90;
let restTimerRunning = false;

function getLowEnergyProtectionMultiplier() {
    const logs = [];
    for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const k = KEYS.energy + d.toISOString().split('T')[0];
        try {
            const e = loadState(k);
            if (e && typeof e.energy === 'number') logs.push(e.energy);
        } catch (err) { }
    }
    if (logs.length >= 3 && logs.every(e => e <= 2)) return 0.8;
    return null;
}


function getEnergyMultiplier(energy, sleep) {
    /* Peta energi ke multiplier dasar
       Energi 5 → 100%, 4 → 100%, 3 → 90%, 2 → 70%, 1 → 50% */
    let mult;
    if (energy >= 4) mult = 1.0;
    else if (energy === 3) mult = 0.9;
    else if (energy === 2) mult = 0.7;
    else mult = 0.5;  /* energi 1 atau nilai tidak valid */

    /* FIX-7: tambah guard NaN/undefined untuk parameter sleep
       Sebelumnya: sleep=undefined → sleep < 5 → false (aman tapi tidak eksplisit)
       Sekarang: hanya terapkan penalti jika sleep adalah angka valid */
    const safeSleep = parseFloat(sleep);
    if (!isNaN(safeSleep) && safeSleep < 5) {
        mult = Math.max(0.5, mult - 0.15);
    }

    /* Recovery flag dari catatan kemarin → cap multiplier dari atas */
    try {
        const directFlag = localStorage.getItem('ip90_recovery_flag');
        if (directFlag) mult = Math.min(mult, parseFloat(directFlag) || 0.8);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yk = 'ip90_recovery_next_' + yesterday.toISOString().split('T')[0];
        const flag = localStorage.getItem(yk);
        if (flag) mult = Math.min(mult, parseFloat(flag) || 0.8);
    } catch (e) { }

    /* FIX-8 (KRITIS): Math.max(mult, lepMult) → Math.min(mult, lepMult)
  
        */
    const lepMult = getLowEnergyProtectionMultiplier();
    if (lepMult !== null) mult = Math.min(mult, lepMult);

    /* Floor absolut: multiplier tidak pernah di bawah 0.5 */
    return Math.max(0.5, Math.min(1.0, mult));
}


/* Progressive overload: mikro-siklus 4 minggu
   Minggu 1 → rep dasar
   Minggu 2 → rep dasar + 2
   Minggu 3 → rep dasar + 4
   Minggu 4 → rep kembali ke dasar, set +1
   Diulang per fase makro */
function getProgressiveOverload(day, baseSets, baseRepsRaw, baseRest) {
    const weekInPhase = Math.floor((day % 28) / 7);  /* 0, 1, 2, 3 */
    const baseSetsNum = parseInt(baseSets) || 3;
    let repsRaw = baseRepsRaw;
    let sets = baseSetsNum;

    /* FIX-9: tambah guard untuk baseRepsRaw null/undefined */
    if (baseRepsRaw && baseRepsRaw.includes('–')) {
        const [lo, hi] = baseRepsRaw.split('–').map(Number);
        if (weekInPhase === 0) { repsRaw = `${lo}–${hi}`; }
        else if (weekInPhase === 1) { repsRaw = `${lo + 2}–${hi + 2}`; }
        else if (weekInPhase === 2) { repsRaw = `${lo + 4}–${hi + 4}`; }
        else { repsRaw = `${lo}–${hi}`; }
        /* Minggu 4: rep kembali ke base, set +1 ditangani satu titik di bawah */
    }

    /* FIX-10: hapus Math.min(sets+1, sets+1) dari dalam else block sebelumnya.
       Math.min(x, x) selalu menghasilkan x — tidak berguna sama sekali.
       Selain itu nilainya langsung di-override di baris ini juga (dead code ganda).
       Satu titik assignment yang jelas untuk penambahan set minggu 4. */
    if (weekInPhase === 3) sets = baseSetsNum + 1;

    return { sets: String(sets), repsRaw, rest: baseRest, restLabel: baseRest + ' dtk' };
}


function applyIntensity(sets, repsRaw, rest, mult) {
    const safeMult = Math.max(0.5, mult);

    /* FIX-11: parseInt bisa menghasilkan NaN jika input tidak valid.
       Tambah fallback ke nilai default yang masuk akal. */
    const setsNum = parseInt(sets) || 3;
    const restNum = parseInt(rest) || 90;

    const adjSets = Math.max(2, Math.round(setsNum * safeMult));
    const adjRest = Math.max(30, Math.round(restNum / safeMult));

    let repsLabel = repsRaw;
    if (repsRaw && repsRaw.includes('–')) {
        const [lo, hi] = repsRaw.split('–').map(Number);
        const adjLo = Math.max(3, Math.round(lo * safeMult));
        /* FIX-12: pastikan adjHi selalu > adjLo — cegah range terbalik seperti "4–4"
           atau "5–4" akibat pembulatan yang tidak simetris */
        const adjHi = Math.max(adjLo + 1, Math.round(hi * safeMult));
        repsLabel = `${adjLo}–${adjHi}`;
    }

    /* Timer istirahat diadaptasi proporsional dengan intensitas:
       50% → 15 dtk, 70% → 21 dtk, 90% → 27 dtk, 100% → 30 dtk */
    const adjTimerSecs = Math.max(10, Math.round(30 * safeMult));

    return {
        sets: String(adjSets),
        reps: repsLabel,
        rest: adjRest + ' dtk',
        restSecs: adjRest,
        timerSecs: adjTimerSecs,
    };
}


/* FIX-13: hapus label untuk mult > 1.0 (110%, 120%) — dead code.
   getEnergyMultiplier() selalu mengembalikan Math.min(1.0, ...) sehingga
   kedua label tersebut tidak pernah bisa tercapai. Membiarkannya ada
   memberi kesan fitur yang sebenarnya tidak berfungsi. */
function getIntensityLabel(mult) {
    if (mult <= 0.6) return { label: 'Sangat Ringan (60%)', color: 'var(--red)', bg: 'var(--red-dim)' };
    if (mult <= 0.8) return { label: 'Ringan (80%)', color: 'var(--yellow)', bg: 'var(--yellow-dim)' };
    return { label: 'Normal (100%)', color: 'var(--accent)', bg: 'var(--accent-dim)' };
}


let selectedEnergy = 3;
let todaySleep = 7;


function loadEnergyForToday() {
    const td = loadToday();
    if (td.energyChecked) {
        selectedEnergy = td.energy || 3;
        todaySleep = td.sleep || 7;
        return;
    }
    const saved = loadState(energyKey());
    if (saved) {
        selectedEnergy = saved.energy || 3;
        todaySleep = saved.sleep || 7;
    } else {
        selectedEnergy = 3;
        todaySleep = 7;
    }
}

function saveEnergyForToday() {
    saveState(energyKey(), { energy: selectedEnergy, sleep: todaySleep });
}


function updateEnergyConfirmBtn() {
    const sleepEl = document.getElementById('energy-sleep');
    if (!sleepEl) return;
    const sleepVal = parseFloat(sleepEl.value);
    const hasEnergy = selectedEnergy >= 1 && selectedEnergy <= 5;
    const hasSleep = !isNaN(sleepVal) && sleepVal >= 1 && sleepVal <= 12;
    const btn = document.getElementById('energy-confirm-btn');
    if (!btn) return;
    btn.disabled = !(hasEnergy && hasSleep);
    btn.style.opacity = btn.disabled ? '0.5' : '1';
    btn.style.cursor = btn.disabled ? 'not-allowed' : 'pointer';
    const starErr = document.getElementById('energy-star-err');
    const sleepErr = document.getElementById('energy-sleep-err');
    if (starErr) starErr.style.display = (!hasEnergy && sleepEl.value !== '') ? 'block' : 'none';
    if (sleepErr) sleepErr.style.display = (sleepEl.value !== '' && !hasSleep) ? 'block' : 'none';
}


function selectEnergy(level) {
    selectedEnergy = level;
    document.querySelectorAll('.energy-star').forEach((el, i) => {
        el.classList.toggle('selected', i < level);
    });
    updateIntensityPreview();
    updateEnergyConfirmBtn();
}


/* FIX-14: hapus semua emoji dari teks UI — ganti dengan teks deskriptif */
function updateIntensityPreview() {
    const sleepEl = document.getElementById('energy-sleep');
    const sleep = sleepEl ? (parseFloat(sleepEl.value) || todaySleep) : todaySleep;
    const mult = getEnergyMultiplier(selectedEnergy, sleep);
    const lbl = getIntensityLabel(mult);
    const prev = document.getElementById('intensity-preview');
    if (!prev) return;

    let extraNote = '';
    if (sleep < 5) extraNote = ' Peringatan: tidur kurang dari 5 jam — intensitas diturunkan untuk keselamatanmu.';
    if (getUserType() === 'overweight') extraNote += ' Mode Low Impact aktif — latihan benturan tinggi dinonaktifkan.';

    prev.innerHTML = `Intensitas latihan: <strong style="color:${lbl.color}">${lbl.label}</strong>${extraNote}`;

    const hintEl = document.getElementById('ux-energy-hint');
    if (!hintEl) return;

    if (selectedEnergy > 0) {
        hintEl.classList.remove('hidden', 'low', 'mid', 'high');
        if (selectedEnergy <= 2) {
            hintEl.className = 'ux-energy-hint low';
            hintEl.textContent = 'Latihan disesuaikan karena energi kamu rendah hari ini.';
        } else if (selectedEnergy === 3) {
            hintEl.className = 'ux-energy-hint mid';
            hintEl.textContent = 'Latihan disesuaikan agar tetap optimal meski energi tidak penuh.';
        } else {
            hintEl.className = 'ux-energy-hint high';
            hintEl.textContent = 'Kamu dalam kondisi bagus untuk latihan maksimal hari ini!';
        }
    } else {
        hintEl.classList.add('hidden');
    }
}


/* FIX-15: ganti magic number 30 dengan MAX_EXERCISES pada loop timer cleanup */
function showEnergyModal() {
    const td = loadToday();
    if (td.energyChecked) return;

    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    for (let i = 0; i < MAX_EXERCISES; i++) {
        const w = document.getElementById('ex-timer-' + i);
        if (w && w._interval) { clearInterval(w._interval); w._interval = undefined; }
    }

    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    const pad = document.querySelector('#tab-latihan .workout-pad');
    if (pad) pad.classList.add('workout-locked');

    loadEnergyForToday();
    selectedEnergy = 0;

    const sleepEl = document.getElementById('energy-sleep');
    if (sleepEl) {
        sleepEl.value = '';
        sleepEl.removeEventListener('input', updateIntensityPreview);
        sleepEl.addEventListener('input', updateIntensityPreview);
        sleepEl.removeEventListener('input', updateEnergyConfirmBtn);
        sleepEl.addEventListener('input', updateEnergyConfirmBtn);
    }

    document.querySelectorAll('.energy-star').forEach(el => el.classList.remove('selected'));
    const starsEl = document.querySelector('.energy-stars');
    if (starsEl) starsEl.style.outline = '';

    const prev = document.getElementById('intensity-preview');
    if (prev) prev.innerHTML = 'Pilih energi dan tidur untuk melihat intensitas latihan hari ini.';

    const btn = document.getElementById('energy-confirm-btn');
    if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; btn.style.cursor = 'not-allowed'; }

    const starErr = document.getElementById('energy-star-err');
    const sleepErr = document.getElementById('energy-sleep-err');
    if (starErr) starErr.style.display = 'none';
    if (sleepErr) sleepErr.style.display = 'none';

    const modalEl = document.getElementById('energy-modal');
    if (modalEl) modalEl.classList.add('active');
}


/* FIX-16: getDislikes() sebelumnya dipanggil tiga kali (sekali langsung, sekali
   untuk join, sekali di dalam getMealsForDay). Cache hasilnya satu kali. */
function confirmEnergyCheck() {
    const sleepEl = document.getElementById('energy-sleep');
    if (!sleepEl) return;

    const sleep = parseFloat(sleepEl.value);
    if (!selectedEnergy || selectedEnergy < 1) {
        const starsEl = document.querySelector('.energy-stars');
        if (starsEl) starsEl.style.outline = '2px solid var(--orange)';
        return;
    }
    if (!sleep || sleep < 1 || sleep > 12) {
        sleepEl.style.borderColor = 'var(--orange)';
        return;
    }

    sleepEl.style.borderColor = '';
    todaySleep = sleep;
    saveEnergyForToday();

    const td = loadToday();
    td.energyChecked = true;
    td.energy = selectedEnergy;
    td.sleep = todaySleep;
    saveToday(td);

    checkLowEnergyProtection();

    const em = document.getElementById('energy-modal');
    if (em) em.classList.remove('active');
    document.body.style.overflow = '';

    const pad = document.querySelector('#tab-latihan .workout-pad');
    if (pad) pad.classList.remove('workout-locked');

    const lo = document.getElementById('workout-lock-overlay');
    if (lo) lo.classList.add('hidden');

    _applyTabLockState();

    const userData = loadState(KEYS.user);
    const programData = loadState(KEYS.program);
    if (!userData || !programData) return;

    const day = getCurrentDay();

    /* FIX-16: cache getDislikes() satu kali, gunakan variabel di semua tempat */
    const dislikes = getDislikes();
    const dislikeKey = dislikes.join('_');
    const cacheKey = KEYS.daydata + day + '_d_' + dislikeKey + '_v14';

    let dayData = loadState(cacheKey);
    if (!dayData) dayData = {};

    if (dayData.meals) {
        if (DEV_MODE) console.warn('[confirmEnergyCheck] USING LOCKED MEALS day:', day);
    }

    if (!dayData.meals || !Array.isArray(dayData.meals) || dayData.meals.length === 0) {
        dayData.meals = getMealsForDay(day, programData.tdee, dislikes);
        dayData.workout = dayData.workout || getWorkoutForDay(day);
        saveState(cacheKey, dayData);
    }

    renderWorkoutTab(day, dayData.workout);
    updateDashIntensityCard();
}


/* FIX-17: refaktor — gunakan getLowEnergyProtectionMultiplier() agar logika
   "3 hari berturut-turut" tidak diduplikasi antara sini dan getEnergyMultiplier().
   FIX-18: hapus semua emoji dari teks peringatan */
function checkLowEnergyProtection() {
    const lepMult = getLowEnergyProtectionMultiplier();
    if (lepMult === null) return;

    const warned = document.getElementById('dash-warnings-wrap');
    if (warned) {
        warned.innerHTML += `
      <div class="dash-warning">
        <div class="dash-warning-title">Peringatan: Energi Rendah 3 Hari Berturut-turut</div>
        Energimu sudah rendah selama 3 hari. Intensitas latihan hari ini dibatasi 80% untuk mencegah overtraining. Perbanyak istirahat, asupan protein, dan kualitas tidur malam ini.
      </div>`;
    }
}


function updateDashIntensityCard() {
    loadEnergyForToday();
    const mult = getEnergyMultiplier(selectedEnergy, todaySleep);
    const lbl = getIntensityLabel(mult);
    const card = document.getElementById('dash-intensity-card');
    if (!card) return;
    card.classList.remove('hidden');
    const divEl = document.getElementById('dash-intensity-val');
    if (divEl) divEl.textContent = `Energi: ${selectedEnergy}/5 — Tidur: ${todaySleep} jam`;
    const badge = document.getElementById('dash-intensity-badge');
    if (badge) {
        badge.textContent = lbl.label;
        badge.style.background = lbl.bg;
        badge.style.color = lbl.color;
        badge.style.border = `1.5px solid ${lbl.color}`;
    }
}


/* Format detik menjadi MM:SS */
function exTimerFmt(s) {
    s = Math.max(0, s);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}

/* Parse string rep: "8–10" → midpoint, "10" → 10 */
function _parseReps(str) {
    if (!str) return 1;
    const s = String(str).trim();
    if (s.includes('–')) {
        const p = s.split('–').map(Number);
        return Math.max(1, Math.round((p[0] + p[1]) / 2));
    }
    const n = parseInt(s);
    return isNaN(n) ? 1 : Math.max(1, n);
}

/* Kill semua timer aktif sebelum workout di-render
   FIX-19: ganti magic number 30 dengan MAX_EXERCISES */
function initExTimers(count) {
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    window._exTimerInterval = undefined;
    window._exTimerTimeout = undefined;
    for (let i = 0; i < MAX_EXERCISES; i++) {
        const wrap = document.getElementById('ex-timer-' + i);
        if (wrap && wrap._interval) {
            clearInterval(wrap._interval);
            wrap._interval = undefined;
        }
    }
}

/* Dapatkan wrap element berdasarkan index */
function _exWrap(idx) {
    return document.getElementById('ex-timer-' + idx);
}

/* FIX-20: helper baru _exClearAll() — sebelumnya ada 3 baris clear yang diulang
   identik di setiap fungsi timer. Sekarang satu panggilan untuk clear KEDUA
   referensi (global window._exTimerInterval DAN lokal wrap._interval). */
function _exClearAll(wrap) {
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    window._exTimerInterval = undefined;
    window._exTimerTimeout = undefined;
    _exClearWrap(wrap);
}

/* Clear hanya interval lokal satu wrap — tidak menyentuh global window._exTimerInterval */
function _exClearWrap(wrap) {
    if (!wrap || wrap._interval === undefined) return;
    clearInterval(wrap._interval);
    clearTimeout(wrap._interval);
    wrap._interval = undefined;
}


function renderExTimer(idx, totalEx) {
    const wrap = _exWrap(idx);
    if (!wrap) return;

    const state = wrap._timerState || 'idle';
    const secs = wrap._secsLeft || 0;
    const exSt = wrap._exState || {};
    const totalReps = exSt.reps || 1;
    const cur = exSt.currentRep || 1;

    let repHtml = '', phaseLabel = '', display = '', cls = '', btns = '';

    switch (state) {
        case 'idle':
            repHtml = `<div class="ex-rep-label">Rep 1 / ${totalReps}</div>`;
            phaseLabel = 'Siap untuk dimulai';
            display = '▶';
            cls = '';
            btns = `<button class="ex-timer-btn start" onclick="exTimerStart(${idx},${totalEx})">▶ Mulai Rep 1</button>`;
            break;

        case 'active':
            repHtml = `<div class="ex-rep-label" id="ex-rep-lbl-${idx}">Rep ${cur} / ${totalReps}</div>`;
            phaseLabel = 'Mulai';
            display = exTimerFmt(secs);
            cls = '';
            btns = `<button class="ex-timer-btn rest" onclick="exTimerManualFinishRep(${idx},${totalEx})">&#10003; Rep Selesai</button>`;
            break;

        case 'rest':
            repHtml = `<div class="ex-rep-label rest-rep" id="ex-rep-lbl-${idx}">Rep ${cur} / ${totalReps} &mdash; Istirahat</div>`;
            phaseLabel = `Istirahat &mdash; Rep ${cur + 1} / ${totalReps} berikutnya`;
            display = exTimerFmt(secs);
            cls = 'rest-mode';
            btns = `<button class="ex-timer-btn start" onclick="exTimerSkipRest(${idx},${totalEx})">Lewati Istirahat</button>`;
            break;

        case 'done':
            repHtml = `<div class="ex-rep-label done-rep">${totalReps} Rep Selesai</div>`;
            phaseLabel = 'Selesai';
            display = '&#10003;';
            cls = 'done-mode';
            btns = `<button class="ex-timer-btn" onclick="exTimerReset(${idx},${totalEx})" style="font-size:.7rem;color:var(--text3);">&#8635; Ulangi</button>`;
            break;
    }

    wrap.innerHTML = `
    ${repHtml}
    <div class="ex-timer-state">${phaseLabel}</div>
    <div class="ex-timer-display ${cls}" id="ex-timer-disp-${idx}">${display}</div>
    <div class="ex-timer-btns">${btns}</div>`;
}


/* Hentikan semua timer di wrap lain kecuali idx yang sedang aktif
   FIX-19: ganti magic number 30 dengan MAX_EXERCISES */
function _exStopOthers(idx) {
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    window._exTimerInterval = undefined;
    window._exTimerTimeout = undefined;
    for (let k = 0; k < MAX_EXERCISES; k++) {
        if (k === idx) continue;
        const w = _exWrap(k);
        if (w && (w._timerState === 'active' || w._timerState === 'rest')) {
            _exClearWrap(w);
        }
    }
}


/* Jalankan fase active — membaca state HANYA dari wrap._exState (sumber tunggal)

   FIX-20: ganti 3 baris clear manual dengan _exClearAll() di setiap entri fungsi
   FIX-23: bungkus console.log dengan DEV_MODE — tidak boleh aktif di production */
function _exRunActive(idx, totalEx) {
    const wrap = _exWrap(idx);
    if (!wrap) return;

    _exClearAll(wrap);

    const state = wrap._exState;
    if (!state) return;

    wrap._timerState = 'active';
    wrap._secsLeft = state.timer || 30;
    wrap._transitioning = false;

    if (DEV_MODE) console.log('[ExTimer] mulai rep', state.currentRep, '/', state.reps);
    renderExTimer(idx, totalEx);

    wrap._interval = setInterval(() => {
        if (!loadToday().energyChecked) { _exClearAll(wrap); return; }
        if (wrap._transitioning) return;

        wrap._secsLeft--;

        const disp = document.getElementById('ex-timer-disp-' + idx);
        if (disp && wrap._timerState === 'active') {
            disp.textContent = exTimerFmt(wrap._secsLeft);
        }

        if (wrap._secsLeft <= 0) {
            wrap._transitioning = true;
            _exClearAll(wrap);
            _exOnRepEnd(idx, totalEx);
        }
    }, 1000);
    window._exTimerInterval = wrap._interval;
}


/* Fase active selesai — tentukan apakah ini rep terakhir atau lanjut ke rest

   FIX-23: bungkus console.log dengan DEV_MODE */
function _exOnRepEnd(idx, totalEx) {
    const wrap = _exWrap(idx);
    if (!wrap) return;
    _exClearWrap(wrap);

    const state = wrap._exState;
    if (!state) return;
    const cur = state.currentRep;
    const totalReps = state.reps;

    if (DEV_MODE) console.log('[ExTimer] rep', cur, '/', totalReps, 'selesai');

    if (cur >= totalReps) {
        if (DEV_MODE) console.log('[ExTimer] DONE — rep terakhir tercapai');
        _exFinish(idx, totalEx);
    } else {
        if (DEV_MODE) console.log('[ExTimer] lanjut ke istirahat');
        _exRunRest(idx, totalEx);
    }
}


/* Fase rest — saat selesai, increment currentRep lalu jalankan fase active berikutnya

   FIX-20: ganti 3 baris clear manual dengan _exClearAll() */
function _exRunRest(idx, totalEx) {
    const wrap = _exWrap(idx);
    if (!wrap) return;

    _exClearAll(wrap);

    const state = wrap._exState;
    if (!state) return;

    wrap._timerState = 'rest';
    wrap._secsLeft = state.rest || 90;
    wrap._transitioning = false;
    renderExTimer(idx, totalEx);

    wrap._interval = setInterval(() => {
        if (!loadToday().energyChecked) { _exClearAll(wrap); return; }
        if (wrap._transitioning) return;

        wrap._secsLeft--;

        const disp = document.getElementById('ex-timer-disp-' + idx);
        if (disp && wrap._timerState === 'rest') {
            disp.textContent = exTimerFmt(wrap._secsLeft);
        }

        if (wrap._secsLeft <= 0) {
            wrap._transitioning = true;
            _exClearAll(wrap);
            _exAdvanceRep(idx, totalEx);
        }
    }, 1000);
    window._exTimerInterval = wrap._interval;
}


function generateRecipe(meal, day, slot, usedBumbus, usedSayurs) {
    if (!meal || !meal.protein_tag) return meal;
    /* FIX A: guard double-generation — karbo type detection bergantung pada
       meal.nama ASLI. Jika dipanggil ulang, nama sudah diubah → karbo salah. */
    if (meal._recipeDone) return meal;

    const protein = meal.protein_tag;
    const style = pickCookingStyle(protein, day, slot);
    const sayur = pickSayur(day, slot, usedSayurs);
    const bumbu = pickBumbu(protein, day, slot, usedBumbus);
    const scale = getScaleFactor(meal.base_cal || 500);
    const bahan = buildIngredients(meal, scale, sayur);
    const karboShort = getKarboKey(meal.nama || '');   /* baca nama ASLI sebelum diubah */
    const nama = `${_capitalize(protein)} ${bumbu} + ${sayur}`;

    function g(keyword) {
        const found = bahan.find(b => new RegExp(keyword, 'i').test(b.item));
        if (!found) return '';
        if (found.unit === 'secukupnya') return 'secukupnya';
        return `${found.gram}${found.unit === 'g' ? 'g' : ' ' + found.unit}`;
    }

    let langkah = [];

    if (style === 'goreng') {
        langkah = [
            `Siapkan bahan: cuci bersih ${sayur}, tiriskan. ${protein === 'tempe' ? `Iris ${g(protein)} tempe tipis-tipis lalu lumuri dengan garam dan sedikit lada. Diamkan 5 menit.`
                : protein === 'tahu' ? `Potong ${g(protein)} tahu menjadi potongan tebal sekitar 2cm, taburi sedikit garam.`
                    : protein === 'ikan' ? `Cuci ${g(protein)} ikan, beri garam, sedikit kunyit, dan lada. Diamkan 5 menit.`
                        : `Potong ${g(protein)} ${protein} menjadi bagian sedang, lumuri dengan garam dan lada. Diamkan 5 menit.`
            }`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang. Goreng ${protein} hingga semua sisi kuning kecokelatan — ${(protein === 'tempe' || protein === 'tahu')
                ? 'sekitar 2–3 menit tiap sisi, jangan sering dibalik'
                : 'sekitar 5–7 menit tiap sisi sampai matang di dalam'
            }. Angkat dan tiriskan.`,
            `Buang sisa minyak berlebih di teflon. Tumis ${g('bawang putih')} bawang putih geprek sampai harum, sekitar 30 detik. Masukkan ${g(sayur)} ${sayur}, tambahkan garam secukupnya. Tumis 2–3 menit sampai layu dan matang.`,
            `Siapkan ${g(karboShort)} ${karboShort}${karboShort === 'kentang' ? ' rebus atau kukus yang sudah matang' : ' di piring'
            }. Letakkan ${protein} goreng dan tumis ${sayur} di sisinya. Sajikan selagi hangat.`,
        ];
    }
    else if (style === 'tumis') {
        langkah = [
            `Siapkan bahan: ${protein === 'ayam' ? `potong ${g(protein)} ayam menjadi dadu kecil atau strip tipis melintang serat`
                : protein === 'tempe' ? `potong ${g(protein)} tempe menjadi dadu kecil`
                    : protein === 'tahu' ? `potong ${g(protein)} tahu menjadi dadu sedang`
                        : `siapkan ${g(protein)} ${protein}`
            }. Iris ${g('bawang merah')} bawang merah dan ${g('bawang putih')} bawang putih. Potong ${sayur} siap masak.`,
            `Panaskan ${g('minyak')} minyak di wajan api sedang. Tumis bawang merah dan bawang putih iris sampai layu, harum, dan sedikit kecokelatan — sekitar 1–2 menit.`,
            `Masukkan ${protein}, aduk rata bersama bumbu. Masak ${protein === 'ayam' ? '5–7 menit'
                : (protein === 'tempe' || protein === 'tahu') ? '3–4 menit'
                    : '5 menit'
            } sampai ${protein} matang${protein === 'ayam' ? ' dan tidak ada bagian merah' : ' dan sedikit kecokelatan'
            }. Tuang ${g('kecap')} kecap manis dan garam secukupnya, aduk merata. Masak 2 menit lagi agar bumbu meresap.`,
            `Di wajan lain, panaskan sedikit minyak. Tumis ${g(sayur)} ${sayur} dengan bawang putih geprek, 2–3 menit sampai layu. Bumbui garam.`,
            `Sajikan ${protein} tumis bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur} di sisinya.`,
        ];
    }
    else if (style === 'bacem') {
        langkah = [
            `Potong ${g('tempe')} tempe menjadi dadu agak besar. Rebus sebentar dalam air mendidih 3 menit untuk mengurangi rasa pahit, tiriskan.`,
            `Tumis ${g('bawang putih')} bawang putih dan ${g('bawang merah')} bawang merah cincang sampai harum. Tuang ${g('kecap')} kecap manis, ketumbar bubuk secukupnya, garam, dan 150ml air. Aduk rata dan biarkan mendidih.`,
            `Masukkan tempe ke kuah bacem, pastikan semua bagian terendam. Kecilkan api, masak 15–20 menit sambil sesekali diaduk pelan sampai kuah menyusut dan bumbu meresap ke dalam tempe.`,
            `Sementara menunggu, tumis ${g(sayur)} ${sayur} dengan bawang putih geprek di wajan terpisah, 2–3 menit. Bumbui garam.`,
            `Sajikan tempe bacem bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur} di sisinya.`,
        ];
    }
    else if (style === 'panggang') {
        langkah = [
            `Siapkan ${g(protein)} ${protein}: ${protein === 'ayam' ? 'bersihkan, buat beberapa sayatan agar bumbu meresap'
                : protein === 'ikan' ? 'cuci bersih, keringkan dengan tisu dapur, buat sayatan di badan ikan'
                    : `potong menjadi bagian sedang`
            }. Lumuri merata dengan garam, lada, dan ${g('kecap')} kecap asin. Diamkan minimal 10 menit biar bumbu meresap.`,
            `Panaskan teflon tebal tanpa minyak di api sedang hingga benar-benar panas. Letakkan ${protein}, jangan digerakkan dulu — biarkan 5–7 menit sampai sisi bawah berubah warna dan ada garis kecokelatan tipis. Balik sekali, masak 5–7 menit lagi sampai matang merata.`,
            `Sementara ${protein} dipanggang, tumis ${g(sayur)} ${sayur} dengan ${g('bawang putih')} bawang putih geprek di teflon lain, 2–3 menit sampai layu. Bumbui garam.`,
            `Sajikan ${protein} panggang bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur} di sisinya.`,
        ];
    }
    else if (style === 'bakar') {
        langkah = [
            `Cuci bersih ${g('ikan')} ikan, keringkan dengan tisu. Buat 2–3 sayatan diagonal di badan ikan agar bumbu meresap. Lumuri merata dengan kunyit bubuk, garam, sedikit lada, dan perasan jeruk nipis. Diamkan 10 menit.`,
            `Panaskan teflon atau grill pan tanpa minyak di api sedang-tinggi sampai panas betul. Letakkan ikan, jangan digerakkan — bakar 5–6 menit sampai sisi bawah kecokelatan. Balik pelan-pelan, bakar sisi lain 5 menit sampai matang.`,
            `Tumis ${g(sayur)} ${sayur} dengan ${g('bawang putih')} bawang putih geprek di teflon lain, 2–3 menit sampai matang. Bumbui garam.`,
            `Sajikan ikan bakar di atas ${g(karboShort)} ${karboShort} dengan ${sayur} di sisi piring. Tambahkan sambal dan perasan jeruk nipis jika suka.`,
        ];
    }
    else if (style === 'dadar') {
        langkah = [
            `Cincang halus ${g('bawang merah')} bawang merah. Iris tipis ${sayur} atau cincang kasar jika daun-daunan. Sisihkan.`,
            `Kocok ${g('telur')} telur dengan bawang merah cincang, garam secukupnya, dan sedikit lada sampai tercampur rata. Masukkan ${sayur} ke dalam kocokan telur, aduk.`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang. Tuang adonan telur, ratakan. Masak sampai sisi bawah set dan pinggirnya agak kering — sekitar 2 menit. Balik sekali, masak 1 menit lagi sampai matang merata. Angkat.`,
            `Sajikan telur dadar di atas atau di samping ${g(karboShort)} ${karboShort}. Bisa langsung dimakan atau ditambah kecap manis sesuai selera.`,
        ];
    }
    else if (style === 'ceplok') {
        langkah = [
            `Siapkan bahan: cuci ${sayur}, iris bawang putih tipis-tipis.`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang sampai benar-benar panas. Pecahkan ${g('telur')} telur langsung ke teflon satu per satu — jaga kuning telur tetap utuh. Kecilkan api, biarkan tanpa diaduk selama 2–3 menit sampai bagian putih telur set sepenuhnya.`,
            `Siram ${g('kecap')} kecap manis di atas telur yang sudah set. Tutup teflon 30 detik agar kecap menempel dan kuning telur matang sesuai selera. Angkat.`,
            `Di teflon yang sama, tambah sedikit minyak. Tumis bawang putih iris sampai harum, masukkan ${g(sayur)} ${sayur} dan garam. Tumis 2 menit sampai layu. Sajikan telur ceplok kecap dengan ${sayur} bersama ${g(karboShort)} ${karboShort} hangat.`,
        ];
    }
    else if (style === 'orak-arik') {
        langkah = [
            `Iris tipis ${g('bawang merah')} bawang merah dan ${g('bawang putih')} bawang putih. Potong atau iris ${sayur} sesuai ukuran. Kocok ${g('telur')} telur dengan garam dan sedikit lada dalam mangkuk sampai rata.`,
            `Panaskan ${g('minyak')} minyak di teflon api sedang. Tumis bawang merah dan bawang putih sampai harum dan sedikit kecokelatan — sekitar 1 menit.`,
            `Tuang kocokan telur ke wajan. Biarkan 10 detik sampai bagian bawah mulai set, lalu aduk perlahan dengan spatula membentuk potongan besar. Terus aduk sampai telur matang berbulir tapi masih sedikit lembab — jangan sampai terlalu kering.`,
            `Masukkan ${g(sayur)} ${sayur} ke dalam telur orak-arik. Aduk rata, masak 1–2 menit sampai ${sayur} layu dan matang. Cicipi garam.`,
            `Sajikan hangat di atas ${g(karboShort)} ${karboShort}.`,
        ];
    }
    else if (style === 'kukus') {
        langkah = [
            `Siapkan ${g(protein)} ${protein}: ${protein === 'ayam' ? 'bersihkan, buat beberapa tusukan kecil agar bumbu meresap'
                : protein === 'ikan' ? 'cuci bersih, keringkan dengan tisu'
                    : `potong menjadi bagian sedang`
            }. Lumuri merata dengan garam, ${g('kecap')} kecap asin, dan sedikit jahe iris tipis. Diamkan 10 menit.`,
            `Siapkan panci kukusan — didihkan air di bawah. Tata ${protein} di atas wadah tahan panas atau piring. Kukus selama 12–15 menit dengan api sedang sampai matang ${protein === 'ayam' ? '(tidak ada bagian merah saat dipotong)'
                : protein === 'ikan' ? '(daging mudah terlepas dari tulang)'
                    : '(tekstur empuk dan padat)'
            }.`,
            `Sementara menunggu, tumis ${g('bawang putih')} bawang putih geprek sampai harum. Masukkan ${g(sayur)} ${sayur}, tambahkan garam secukupnya. Tumis 2–3 menit sampai ${sayur} layu dan matang.`,
            `Angkat ${protein} kukus, siram sedikit ${g('kecap')} kecap asin atau kecap manis di atasnya jika suka. Sajikan bersama ${g(karboShort)} ${karboShort} hangat dan tumis ${sayur}.`,
        ];
    }
    else {
        langkah = [
            `Siapkan semua bahan: ${protein === 'ayam' ? `potong ${g(protein)} ayam dadu kecil`
                : protein === 'tempe' ? `potong ${g(protein)} tempe dadu`
                    : protein === 'tahu' ? `potong ${g(protein)} tahu dadu`
                        : `siapkan ${g(protein)} ${protein}`
            }. Iris tipis ${g('bawang putih')} bawang putih dan siapkan ${g(sayur)} ${sayur}.`,
            `Panaskan ${g('minyak')} minyak di wajan api sedang. Tumis bawang putih sampai harum dan sedikit kecokelatan — sekitar 1 menit.`,
            `Masukkan ${protein}, aduk rata. Masak ${protein === 'ayam' ? '6–8 menit' : '3–5 menit'} sampai matang dan berwarna kecokelatan. Bumbui garam dan lada secukupnya. Cicipi.`,
            `Masukkan ${sayur}, aduk bersama ${protein}. Masak 2–3 menit sampai ${sayur} layu dan matang. Sajikan hangat bersama ${g(karboShort)} ${karboShort}.`,
        ];
    }

    if (DEV_MODE) {
        console.log('[MEAL VAR]', protein, '|', bumbu, '|', sayur, '| style:', style);
        console.log('[RECIPE DETAIL]', nama, '| scale:', scale.toFixed(2));
        console.log('[RECIPE BAHAN]', bahan.map(b => `${b.item} ${b.gram}${b.unit}`).join(', '));
    }

    return {
        ...meal,
        nama,
        _bumbu: bumbu,
        _sayur: sayur,
        _recipeDone: true,   /* FIX A: flag agar tidak di-generate ulang */
        resep: { bahan, langkah },
    };
}


function confirmEnergyCheck() {
    const sleepEl = document.getElementById('energy-sleep');
    if (!sleepEl) return;

    const sleep = parseFloat(sleepEl.value);
    if (!selectedEnergy || selectedEnergy < 1) {
        const starsEl = document.querySelector('.energy-stars');
        if (starsEl) starsEl.style.outline = '2px solid var(--orange)';
        return;
    }
    if (!sleep || sleep < 1 || sleep > 12) {
        sleepEl.style.borderColor = 'var(--orange)';
        return;
    }

    sleepEl.style.borderColor = '';
    todaySleep = sleep;
    saveEnergyForToday();

    const td = loadToday();
    td.energyChecked = true;
    td.energy = selectedEnergy;
    td.sleep = todaySleep;
    saveToday(td);

    checkLowEnergyProtection();

    const em = document.getElementById('energy-modal');
    if (em) em.classList.remove('active');
    document.body.style.overflow = '';

    const pad = document.querySelector('#tab-latihan .workout-pad');
    if (pad) pad.classList.remove('workout-locked');

    const lo = document.getElementById('workout-lock-overlay');
    if (lo) lo.classList.add('hidden');

    _applyTabLockState();

    const userData = loadState(KEYS.user);
    const programData = loadState(KEYS.program);
    if (!userData || !programData) return;

    const day = getCurrentDay();
    const dislikes = getDislikes();
    const dislikeKey = dislikes.join('_');
    const cacheKey = KEYS.daydata + day + '_d_' + dislikeKey + '_v14';

    let dayData = loadState(cacheKey);
    if (!dayData) dayData = {};

    if (dayData.meals) {
        if (DEV_MODE) console.warn('[confirmEnergyCheck] USING LOCKED MEALS day:', day);
    }

    /* FIX B: pisah blok meals dan workout — masing-masing independen.
       Sebelumnya workout hanya di-generate di dalam blok `if (!dayData.meals)`,
       sehingga jika meals ada tapi workout tidak → workout tidak pernah dibuat. */
    if (!dayData.meals || !Array.isArray(dayData.meals) || dayData.meals.length === 0) {
        dayData.meals = getMealsForDay(day, programData.tdee, dislikes);
    }
    if (!dayData.workout) {
        dayData.workout = getWorkoutForDay(day);
    }
    saveState(cacheKey, dayData);

    renderWorkoutTab(day, dayData.workout);
    updateDashIntensityCard();
}


function getWorkoutForDay(day, energyOverride) {  /* energyOverride: deprecated, tidak berpengaruh */
    let type = WORKOUT_DAY_MAP[day % 7];

    if (type !== 'rest' && type !== 'cardio') {
        const focus = getWorkoutFocus(day);
        const focusType = getWorkoutTypeByFocus(focus, type);
        if (focusType && WORKOUT_TEMPLATES[focusType]) type = focusType;
    }

    const template = WORKOUT_TEMPLATES[type];
    const phase = getPhaseForDay(day);
    const p = PHASES[phase];
    const userData = loadState(KEYS.user);
    const goal = userData ? userData.goal : 'maintain';
    const exKeys = getWorkoutExercises(type, day);
    const po = getProgressiveOverload(day, p.sets, p.repsRaw, p.rest);
    const trainingPhaseLabel = getTrainingPhaseLabel(day);

    return {
        type,
        phase,
        label: template.label,
        typeLabel: template.type,
        icon: template.icon,
        timeRec: template.timeRec,
        sets: po.sets,
        repsRaw: po.repsRaw,
        rest: po.rest,
        restLabel: po.restLabel,
        trainingPhaseLabel,
        goal,
        exercises: exKeys.map(k => ({
            key: k,
            ...(EXERCISES[k] || { nama: k, otot: '', langkah: [], kesalahan: [] }),
        })),
    };
}


/* FIX D: isMealAllowed() didelegasikan ke _mealHasDislike() agar satu sumber
   kebenaran. Tidak ada lagi dua implementasi paralel yang bisa berbeda hasil. */
function isMealAllowed(meal, dislikeList) {
    if (!dislikeList || dislikeList.length === 0) return true;
    const dl = dislikeList.map(d => String(d).toLowerCase().trim()).filter(Boolean);
    if (dl.length === 0) return true;

    /* Delegasikan ke _mealHasDislike() — satu implementasi untuk semua path */
    if (_mealHasDislike(meal, dl)) return false;

    /* Khusus: dislike 'gorengan' → blokir semua meal yang mengandung kata 'goreng'
       (dipertahankan karena ini aturan khusus yang tidak ada di _mealHasDislike) */
    if (dl.includes('gorengan')) {
        const namaL = meal.nama.toLowerCase();
        if (namaL.includes('goreng')) return false;
        if (meal.resep && meal.resep.bahan) {
            for (const b of meal.resep.bahan) {
                if ((b.item || '').toLowerCase().includes('goreng')) return false;
            }
        }
    }

    return true;
}

/* ============================================================
   renderMealCard
   FIX-1: `type` param tidak pernah digunakan di dalam fungsi — diberi komentar
   FIX-2: safeFallbackMeal dipanggil tanpa slot — selalu menghasilkan meal
          slot 0 (pagi) meski ini adalah slot siang/malam. Perbaiki ke (new Set(), idx, dislikes).
   FIX-3: getDislikes() dipanggil 3× — di-cache satu kali
   FIX-4: hapus semua emoji dari HTML yang dihasilkan
   ============================================================ */
function renderMealCard(meal, idx, type /* unused */) {
    const dislikes = getDislikes();  /* FIX-3: cache satu kali */

    /* FIX-2: pass idx sebagai slot agar fallback menggunakan distribusi waktu yang benar */
    if (!meal || !meal.nama || !meal.resep) meal = safeFallbackMeal(new Set(), idx, dislikes);
    if (_mealHasDislike(meal, dislikes)) {
        if (DEV_MODE) console.error('[renderMealCard] dislike leak terdeteksi:', meal);
        meal = safeFallbackMeal(new Set(), idx, dislikes);
    }
    if (!meal.resep) meal = safeFallbackMeal(new Set(), idx, dislikes);

    const bahan = (meal.resep && Array.isArray(meal.resep.bahan)) ? meal.resep.bahan : [];
    const langkah = (meal.resep && Array.isArray(meal.resep.langkah)) ? meal.resep.langkah : [];
    const makro = meal.makro || { protein: 0, karbo: 0, lemak: 0 };

    const todayData = loadToday();
    const done = todayData.mealsCompleted[idx];
    const card = document.createElement('div');
    card.className = `meal-card ${done ? 'completed' : ''}`;
    card.id = `meal-card-${idx}`;

    const bahanHTML = bahan.map((b, bi) => {
        const alts = b.alt ? b.alt.split(' atau ').map(s => s.trim()).filter(Boolean) : [];
        const panelId = `subs-${idx}-${bi}`;
        const nameId = `bname-${idx}-${bi}`;
        const subsOpts = alts.map((a, ai) =>
            `<div class="subs-option" onclick="selectSub('${panelId}','${nameId}','${a}',this)">${a}</div>`
        ).join('');
        const gantiBtn = alts.length
            ? `<button class="btn-ganti" onclick="toggleSubsPanel('${panelId}')">Ganti</button>`
            : '';
        return `<div>
      <div class="meal-bahan-row">
        <div class="meal-bahan-left">
          <div class="meal-bahan-name" id="${nameId}">${b.item}</div>
          ${b.alt ? `<div class="meal-bahan-alt-txt">Alt: ${b.alt}</div>` : ''}
        </div>
        <div class="meal-bahan-right">
          <span class="meal-bahan-gram">${b.gram === 0 ? b.unit : `${b.gram} ${b.unit}`}</span>
          ${gantiBtn}
        </div>
      </div>
      ${alts.length ? `<div class="subs-panel" id="${panelId}">${subsOpts}</div>` : ''}
    </div>`;
    }).join('');

    /* FIX-4: hapus emoji dari seluruh card HTML */
    card.innerHTML = `
    <div class="meal-card-header" onclick="toggleMeal(${idx})">
      <div class="meal-time-badge">
        <div class="meal-time-icon">${meal.icon || ''}</div>
        <div>
          <div class="meal-time-label">${meal.timeLabel || ''} &middot; ${meal.timeRange || ''}</div>
          <div class="meal-time-name">${meal.nama}</div>
        </div>
      </div>
      <div class="meal-card-right">
        <span class="meal-cal">${meal.kalori || meal.base_cal || 0} kkal</span>
        <span class="meal-chevron">&#9662;</span>
      </div>
    </div>
    <div class="meal-card-body">
      <div class="meal-macro-row">
        <div class="meal-macro-item"><div class="meal-macro-val txt-blue">${makro.protein}g</div><div class="meal-macro-label">Protein</div></div>
        <div class="meal-macro-item"><div class="meal-macro-val">${makro.karbo}g</div><div class="meal-macro-label">Karbo</div></div>
        <div class="meal-macro-item"><div class="meal-macro-val txt-muted">${makro.lemak}g</div><div class="meal-macro-label">Lemak</div></div>
      </div>
      <div class="meal-section-title">Bahan-bahan <span style="font-weight:400;text-transform:none;font-size:.7rem;color:var(--text3);">(alt = alternatif pengganti)</span></div>
      <div class="meal-bahan-list">${bahanHTML}</div>
      <div class="meal-section-title">Cara Memasak</div>
      <div class="meal-langkah-list">
        ${langkah.map((l, i) => `<div class="meal-langkah-item"><div class="meal-langkah-num">${i + 1}</div><div>${l}</div></div>`).join('')}
      </div>
      <div style="display:flex;justify-content:center;margin:12px 0 6px;">
        <button onclick="event.stopPropagation();showMealSwapModal(${idx})" style="background:transparent;border:1.5px solid var(--border2);color:var(--text2);padding:8px 22px;border-radius:99px;font-size:.79rem;font-weight:600;cursor:pointer;letter-spacing:.02em;transition:border-color .2s,color .2s;">Ganti Menu</button>
      </div>
      <button class="meal-done-btn ${done ? 'done' : ''}" id="meal-btn-${idx}" onclick="toggleMealDone(${idx})">
        ${done ? '&#10003; Sudah Dimakan' : '&#9675; Tandai Sudah Makan'}
      </button>
    </div>`;
    return card;
}


/* ============================================================
   RENDER: MENU TAB
   FIX-5: getDislikes() di-cache sebelum forEach — bukan per-iterasi
   FIX-6: safeFallbackMeal dengan slot yang benar (idx)
   FIX-7: hapus emoji dari macro pills
   ============================================================ */
function renderMenuTab(meals, tdee, day, goal) {
    const adapt = isAdaptationPhase(day);
    const dislikes = getDislikes();  /* FIX-5: cache sebelum loop */
    _renderMealGuidance(goal);

    const totalProt = meals.reduce((s, m) => s + ((m.makro || {}).protein || 0), 0);
    const totalKarbo = meals.reduce((s, m) => s + ((m.makro || {}).karbo || 0), 0);
    const totalLemak = meals.reduce((s, m) => s + ((m.makro || {}).lemak || 0), 0);

    const mCalEl = document.getElementById('menu-cal-total');
    if (mCalEl) mCalEl.textContent = tdee.toLocaleString('id-ID') + ' kkal';

    /* FIX-7: hapus emoji dari macro pills */
    const mMacEl = document.getElementById('menu-macro-pills');
    if (mMacEl) mMacEl.innerHTML = `
    <span class="macro-pill">${totalProt}g Protein</span>
    <span class="macro-pill">${totalKarbo}g Karbo</span>
    <span class="macro-pill">${totalLemak}g Lemak</span>`;

    const goalNotice = document.getElementById('menu-goal-notice');
    if (goalNotice && goal) {
        const g = getGoalGuidance(goal);
        goalNotice.style.background = g.bg;
        goalNotice.style.borderColor = g.color;
        goalNotice.style.color = g.color;
        goalNotice.innerHTML = `<strong>${g.label}</strong> &mdash; ${g.desc}`;
        goalNotice.classList.remove('hidden');
    }

    const adaptNotice = document.getElementById('menu-adapt-notice');
    if (adaptNotice) {
        if (adapt) adaptNotice.classList.remove('hidden');
        else adaptNotice.classList.add('hidden');
    }

    const container = document.getElementById('meal-cards');
    container.innerHTML = '';
    meals.forEach((meal, idx) => {
        /* FIX-6: pass idx sebagai slot; FIX-5: gunakan dislikes yang sudah di-cache */
        if (!meal || !meal.nama || !meal.resep) meal = safeFallbackMeal(new Set(), idx, dislikes);
        const card = renderMealCard(meal, idx, null);
        container.appendChild(card);
    });
}

function toggleMeal(idx) { document.getElementById('meal-card-' + idx).classList.toggle('open'); }
function toggleMealDone(idx) {
    const todayData = loadToday();
    todayData.mealsCompleted[idx] = !todayData.mealsCompleted[idx];
    saveToday(todayData);
    updateStreak();
    refreshAllPanes();
}


/* ============================================================
   RENDER: PROGRESS TAB
   FIX-8:  day >= 90 tidak pernah terpenuhi karena getCurrentDay() max 89.
           Gunakan day >= 89 untuk milestone "90 Hari Selesai".
   FIX-9:  hapus komentar debug stale tentang variabel 'week'.
   FIX-10: hapus semua emoji dari HTML yang dihasilkan.
   ============================================================ */
function renderProgressTab(day, programData, userData) {
    const streak = getStreak();
    const phase = getPhaseForDay(day);
    const ph = PHASES[phase];
    const week = Math.floor(day / 7);
    const overview = document.getElementById('prog-overview');

    /* FIX-10: hapus emoji dari stat cards */
    overview.innerHTML = `
    <div class="prog-stat-card"><div class="prog-stat-val txt-accent">${day + 1}</div><div class="prog-stat-label">Hari Berjalan</div></div>
    <div class="prog-stat-card"><div class="prog-stat-val txt-orange">${streak}</div><div class="prog-stat-label">Streak Aktif</div></div>
    <div class="prog-stat-card"><div class="prog-stat-val">${Math.round((day / 90) * 100)}%</div><div class="prog-stat-label">Program Selesai</div></div>
    <div class="prog-stat-card"><div class="prog-stat-val txt-blue">${week + 1}</div><div class="prog-stat-label">Minggu Ke-</div></div>`;

    renderWeightChart();

    const tracking = loadState(KEYS.tracking);
    if (tracking) {
        const today = new Date().toISOString().split('T')[0];
        const tw = tracking.weights ? tracking.weights.find(e => e.date === today) : null;
        const twa = tracking.waists ? tracking.waists.find(e => e.date === today) : null;
        if (tw) document.getElementById('track-weight').value = tw.value;
        if (twa) document.getElementById('track-waist').value = twa.value;
        if (tw) validateWeightDrop(tracking.weights);
    }

    const journal = loadState(journalKey());
    if (journal && journal.notes) {
        const jnEl = document.getElementById('journal-notes');
        if (jnEl) jnEl.value = journal.notes;
    }

    const phaseCard = document.getElementById('prog-phase-card');
    const phaseOrder = ['foundation', 'build', 'intensity', 'peak'];
    const curPhaseIdx = phaseOrder.indexOf(phase);
    phaseCard.innerHTML = `
    <div class="prog-phase-header">
      <div>
        <div class="prog-phase-name">Fase Saat Ini: ${ph.label}</div>
        <div class="prog-phase-range">Hari ${ph.days}</div>
      </div>
      <span class="badge badge-green">${ph.sets} Set &times; ${ph.repsRaw}</span>
    </div>
    <p style="font-size:.82rem;color:var(--text2);margin-bottom:14px;">${ph.desc}</p>
    <div class="prog-phase-bars">
      ${phaseOrder.map((pk, pi) => {
        const p2 = PHASES[pk];
        const startDay = [0, 28, 56, 84][pi];
        const endDay = [28, 56, 84, 90][pi];
        const pDone = Math.max(0, Math.min(day - startDay, endDay - startDay));
        const pTotal = endDay - startDay;
        const pPct = Math.round((pDone / pTotal) * 100);
        const isActive = pi === curPhaseIdx;
        const isFuture = pi > curPhaseIdx;
        const barColor = isActive ? 'var(--accent)' : isFuture ? 'var(--border2)' : 'var(--text3)';
        const labelColor = isActive ? 'var(--text)' : isFuture ? 'var(--text3)' : 'var(--text2)';
        return `<div class="prog-phase-item">
          <div class="prog-phase-label" style="color:${labelColor}">${p2.label}</div>
          <div class="prog-phase-bar-wrap"><div class="progress-bar"><div class="progress-bar-fill" style="width:${pPct}%;background:${barColor}"></div></div></div>
          <div class="prog-phase-pct">${pPct}%</div>
        </div>`;
    }).join('')}
    </div>`;

    /* Weekly bars — FIX-9: hapus komentar debug stale */
    const now = new Date();
    const currentDayIndex = now.getDay();
    /* getDay(): 0=Minggu, 1=Senin..6=Sabtu. Array days dimulai dari Senin (index 0). */
    const adjustedToday = (currentDayIndex === 0) ? 6 : currentDayIndex - 1;
    const weeklySection = document.getElementById('prog-weekly-section');
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    weeklySection.innerHTML = `
    <div class="section-label">Minggu Ini (Minggu ${week + 1})</div>
    <div class="prog-weekly-bars">
      ${days.map((d, i) => {
        const isToday = i === adjustedToday;
        const isPast = i < adjustedToday;
        const heightPct = isPast ? 100 : isToday ? 60 : 10;
        const bg = isPast ? 'var(--accent)' : isToday ? 'var(--blue)' : 'var(--border)';
        return `<div class="prog-weekly-bar-wrap">
          <div class="prog-weekly-bar ${isPast ? 'filled' : isToday ? 'current' : ''}"
            style="height:${heightPct}%;background:${bg}">
          </div>
          <div class="prog-weekly-day" style="color:${isToday ? 'var(--text)' : 'var(--text3)'}">
            ${d}
          </div>
        </div>`;
    }).join('')}
    </div>`;

    /* FIX-8: day >= 90 tidak pernah tercapai (max 89). Gunakan >= 89 untuk milestone terakhir.
       FIX-10: hapus emoji dari goal section */
    const goalLabel = userData.goal === 'lose' ? 'Turunkan Berat Badan'
        : userData.goal === 'gain' ? 'Tambah Massa Otot'
            : 'Jaga Berat Badan Ideal';
    const goalDesc = userData.goal === 'lose' ? `Dari ${userData.weight}kg ke target ${userData.targetWeight}kg (defisit kalori)`
        : userData.goal === 'gain' ? `Dari ${userData.weight}kg ke target ${userData.targetWeight}kg (surplus kalori)`
            : `Jaga di sekitar ${userData.weight}kg (kalori seimbang)`;

    function milestoneCheck(done) {
        return done
            ? `<div class="prog-goal-check" style="background:var(--accent-dim);border-color:var(--accent);">&#10003;</div>`
            : `<div class="prog-goal-check"></div>`;
    }

    const progGoal = document.getElementById('prog-goal-section');
    progGoal.innerHTML = `
    <div class="section-label">Targetmu</div>
    <div class="prog-goal-items">
      <div class="prog-goal-item">
        <div class="prog-goal-check">&#9679;</div>
        <div class="prog-goal-info"><div class="prog-goal-label">${goalLabel}</div><div class="prog-goal-sub">${goalDesc}</div></div>
      </div>
      <div class="prog-goal-item">
        <div class="prog-goal-check">&#9679;</div>
        <div class="prog-goal-info">
          <div class="prog-goal-label">${programData.tdee} kkal/hari</div>
          <div class="prog-goal-sub">${userData.goal === 'lose' ? 'Defisit kalori untuk menurunkan berat'
            : userData.goal === 'gain' ? 'Surplus kalori untuk menambah massa otot'
                : 'Kalori seimbang untuk menjaga berat'
        }</div>
        </div>
      </div>
      <div class="prog-goal-item">
        ${milestoneCheck(day >= 7)}
        <div class="prog-goal-info">
          <div class="prog-goal-label">Selesai Minggu Pertama</div>
          <div class="prog-goal-sub">${day >= 7 ? 'Tercapai! Kamu sudah melewati fase paling sulit.' : `${7 - day} hari lagi.`}</div>
        </div>
      </div>
      <div class="prog-goal-item">
        ${milestoneCheck(day >= 30)}
        <div class="prog-goal-info">
          <div class="prog-goal-label">30 Hari Pertama</div>
          <div class="prog-goal-sub">${day >= 30 ? 'Luar biasa! Sebulan penuh program selesai.' : `${30 - day} hari lagi.`}</div>
        </div>
      </div>
      <div class="prog-goal-item">
        ${milestoneCheck(day >= 89)}
        <div class="prog-goal-info">
          <div class="prog-goal-label">90 Hari Selesai</div>
          <div class="prog-goal-sub">${day >= 89 ? 'KAMU BERHASIL! 90 hari yang luar biasa!' : `${90 - day} hari lagi. Kamu bisa!`}</div>
        </div>
      </div>
    </div>`;
}


/* ============================================================
   TAB LOCK STATE HELPER — tidak ada perubahan logika
   ============================================================ */
function _applyTabLockState() {
    const td = loadToday();
    document.querySelectorAll('.lp-tab').forEach(t => {
        const onclick = t.getAttribute('onclick') || '';
        const match = onclick.match(/'(\w+)'/);
        const tname = match ? match[1] : '';
        if (!td.energyChecked && tname && tname !== 'latihan') {
            t.classList.add('tab-locked');
        } else {
            t.classList.remove('tab-locked');
        }
    });
}


/* ============================================================
   TAB SWITCHING — tidak ada perubahan logika
   ============================================================ */
function switchTab(btn, tabName) {
    const _tdLock = loadToday();
    if (!_tdLock.energyChecked && tabName !== 'latihan') {
        showEnergyModal();
        return;
    }
    document.querySelectorAll('.lp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const pane = document.getElementById('tab-' + tabName);
    if (pane) pane.classList.add('active');
    const lpc = document.getElementById('lp-content');
    if (lpc) lpc.scrollTop = 0;
    try { localStorage.setItem('ip90_active_tab', tabName); } catch (e) { }
    if (tabName === 'progress') setTimeout(renderWeightChart, 100);
    _applyTabLockState();
    if (tabName === 'latihan') {
        const _td = loadToday();
        if (!_td.energyChecked) {
            clearInterval(window._exTimerInterval);
            clearTimeout(window._exTimerTimeout);
            const pad = document.querySelector('#tab-latihan .workout-pad');
            if (pad) pad.classList.add('workout-locked');
            const lo = document.getElementById('workout-lock-overlay');
            if (lo) lo.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            showEnergyModal();
        } else {
            const pad = document.querySelector('#tab-latihan .workout-pad');
            if (pad) pad.classList.remove('workout-locked');
            const lo = document.getElementById('workout-lock-overlay');
            if (lo) lo.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
}


/* ============================================================
   REFRESH ALL PANES
   ============================================================ */
function refreshAllPanes() {
    const userData = loadState(KEYS.user);
    const programData = loadState(KEYS.program);
    if (!userData || !programData) return;

    const day = getCurrentDay();
    const tdee = programData.tdee;

    /* FIX-11: cache getDislikes() satu kali */
    const dislikes = getDislikes();
    const dislikeKey = dislikes.join('_');
    const cacheKey = KEYS.daydata + day + '_d_' + dislikeKey + '_v14';

    let dayData = loadState(cacheKey);
    if (!dayData) dayData = {};

    /* FIX-13: bungkus console.warn dengan DEV_MODE */
    if (dayData.meals) {
        if (DEV_MODE) console.warn('[refreshAllPanes] USING LOCKED MEALS day:', day);
    }

    /* FIX-12: dua blok independen — meals dan workout tidak lagi saling bergantung */
    if (!dayData.meals || !Array.isArray(dayData.meals) || dayData.meals.length === 0) {
        dayData.meals = deepCloneMeals(getMealsForDay(day, tdee, dislikes));
    }
    if (!dayData.workout) {
        dayData.workout = getWorkoutForDay(day);
    }
    saveState(cacheKey, dayData);

    const todayData = loadToday();
    renderGuidance(todayData);
    _renderDailyFocus(userData.goal, day);

    const mealsCount = todayData.mealsCompleted.filter(Boolean).length;
    const workoutPct = todayData.workoutDone ? 100 : 0;
    const mealPct = Math.round((mealsCount / 3) * 100);
    const totalPct = Math.round((workoutPct * 0.5) + (mealPct * 0.5));

    const dayPctEl = document.getElementById('dash-day-pct');
    if (dayPctEl) dayPctEl.textContent = totalPct + '%';
    const wBar = document.getElementById('prog-workout-bar');
    if (wBar) wBar.style.width = workoutPct + '%';
    const mBar = document.getElementById('prog-meal-bar');
    if (mBar) mBar.style.width = mealPct + '%';
    const mCount = document.getElementById('prog-meal-count');
    if (mCount) mCount.textContent = mealsCount;

    const doneWrap = document.getElementById('workout-done-wrap');
    if (doneWrap && todayData.workoutDone) {
        if (!doneWrap.querySelector('.ux-workout-complete')) {
            const energy = todayData.energy || selectedEnergy || 3;
            /* FIX-14: hapus emoji dari pesan selesai */
            let completionMsg = 'Kamu sudah selesai latihan hari ini.';
            let completionSub = 'Istirahat yang cukup agar otot pulih maksimal.';
            if (energy >= 4) {
                completionMsg = 'Latihan kamu mantap hari ini, pertahankan!';
                completionSub = 'Kondisi prima terpakai dengan baik. Lanjutkan besok!';
            } else if (energy === 3) {
                completionMsg = 'Bagus, kamu tetap konsisten hari ini.';
                completionSub = 'Konsistensi itu kunci — kamu sudah buktikan itu.';
            } else {
                completionMsg = 'Tetap hebat, kamu tetap bergerak meski kondisi tidak maksimal.';
                completionSub = 'Ini yang membedakan kamu. Besok pasti lebih baik.';
            }
            doneWrap.innerHTML = `<div class="ux-workout-complete">
        <div class="ux-workout-complete-icon">&#10003;</div>
        <div class="ux-workout-complete-msg">${completionMsg}</div>
        <div class="ux-workout-complete-sub">${completionSub}</div>
      </div>`;
        }
        document.querySelectorAll('.exercise-num').forEach(n => { if (n) n.classList.add('active'); });
        _unlockWorkoutNotes();
    }

    if (dayData.meals) {
        dayData.meals.forEach((meal, idx) => {
            const card = document.getElementById('meal-card-' + idx);
            if (!card) return;
            const done = todayData.mealsCompleted[idx];
            card.classList.toggle('completed', done);
            const btn = document.getElementById('meal-btn-' + idx);
            /* FIX-14: hapus emoji dari teks tombol */
            if (btn) {
                btn.className = `meal-done-btn ${done ? 'done' : ''}`;
                btn.textContent = done ? '&#10003; Sudah Dimakan' : '&#9675; Tandai Sudah Makan';
            }
        });
    }

    const streak = getStreak();
    const streakEl = document.getElementById('lp-streak');
    /* FIX-14: hapus emoji dari streak */
    if (streakEl) streakEl.textContent = streak + ' hari';
}


/* ============================================================
   UX: Daily focus guidance
   FIX-15: hapus emoji dari teks panduan
   ============================================================ */
function _renderDailyFocus(goal, day) {
    const wrap = document.getElementById('ux-daily-focus-wrap');
    if (!wrap) return;

    let focusText = '';
    if (goal === 'lose') focusText = 'Fokus hari ini: konsistensi dan kontrol porsi';
    else if (goal === 'gain') focusText = 'Fokus hari ini: cukup makan dan latihan stabil';
    else focusText = 'Fokus hari ini: jaga keseimbangan';

    /* FIX-15: hapus emoji */
    let adaptHtml = '';
    let recoveryHtml = '';

    if (day < 7) {
        adaptHtml = `<div class="ux-adapt-week-banner">Minggu adaptasi: tidak perlu langsung ketat, kurangi secara bertahap.</div>`;
    }

    try {
        const rflag = localStorage.getItem('ip90_recovery_flag');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yk = 'ip90_recovery_next_' + yesterday.toISOString().split('T')[0];
        const yflag = localStorage.getItem(yk);
        if (rflag || yflag) {
            recoveryHtml = `<div class="ux-recovery-notice">Latihan hari ini disesuaikan karena kondisi sebelumnya &mdash; tubuhmu sedang pemulihan.</div>`;
        }
    } catch (e) { }

    wrap.innerHTML = `${adaptHtml}${recoveryHtml}<div class="ux-daily-focus"><strong>Panduan Harian &mdash;</strong> ${focusText}</div>`;
}


/* ============================================================
   UX: Meal guidance
   FIX-16: hapus emoji dari teks panduan
   ============================================================ */
function _renderMealGuidance(goal) {
    const wrap = document.getElementById('ux-meal-guidance-wrap');
    if (!wrap) return;
    let cls = '', text = '';
    if (goal === 'lose') { cls = 'lose'; text = 'Menu ini disusun untuk membantu penurunan berat badan &mdash; porsi dan kalori sudah dikontrol.'; }
    else if (goal === 'gain') { cls = 'gain'; text = 'Menu ini mendukung peningkatan berat badan &mdash; cukupi porsi makan kamu hari ini.'; }
    else { text = 'Menu ini dirancang untuk menjaga keseimbanganmu &mdash; makan tepat waktu dan nikmati prosesnya.'; }
    wrap.innerHTML = `<div class="ux-meal-guidance ${cls}">${text}</div>`;
}


/* ============================================================
   MEAL SWAP
   FIX-17: hapus semua emoji dari ICONS array dan HTML yang dihasilkan
   ============================================================ */
function getSwapAlternatives(currentMeal, slot, day, tdee) {
    const dislikes = getDislikes();
    const pools = [PAGI_MEALS, SIANG_MEALS, MALAM_MEALS];
    const pool = (pools[slot] || PAGI_MEALS).slice();

    const candPool = pool.filter(m => m.nama !== currentMeal.nama);
    const filtered = filterMealsSoft(candPool, dislikes);

    const usedP1 = new Set([currentMeal.protein_tag]);
    const usedN1 = new Set([currentMeal.nama]);
    const alt1Raw = pickBestMeal(filtered, usedP1, usedN1, new Set(), day + 101, slot);

    const usedP2 = new Set([currentMeal.protein_tag, alt1Raw ? alt1Raw.protein_tag : '']);
    const usedN2 = new Set([currentMeal.nama, alt1Raw ? alt1Raw.nama : '']);
    const remaining = filtered.filter(m => !usedN2.has(m.nama));
    const alt2Raw = pickBestMeal(
        remaining.length ? remaining : filtered,
        usedP2, usedN2, new Set(), day + 202, slot
    );

    const userData = loadState(KEYS.user);
    const goal = (userData && userData.goal) || 'maintain';
    const dist = getMealDistribution(goal);
    const targetCal = Math.round(tdee * dist[slot]);

    const TIME_LABELS = ['Sarapan', 'Makan Siang', 'Makan Malam'];
    /* FIX-17: hapus emoji dari ICONS — gunakan string kosong */
    const ICONS = ['', '', ''];
    const TIME_RANGES = ['06:00–08:00', '12:00–13:00', '18:00–19:00'];
    const TYPES = ['pagi', 'siang', 'malam'];

    const altUsedBumbus = new Set();
    const altUsedSayurs = new Set();

    return [alt1Raw, alt2Raw].filter(Boolean).map((m, i) => {
        const clone = Object.assign({}, m);
        const withRecipe = generateRecipe(clone, day + 50 + i * 30, slot + 3 + i * 2, altUsedBumbus, altUsedSayurs);
        if (withRecipe._bumbu) altUsedBumbus.add(withRecipe._bumbu);
        if (withRecipe._sayur) altUsedSayurs.add(withRecipe._sayur);
        return scaleMeal(
            Object.assign({}, withRecipe, { type: TYPES[slot] }),
            targetCal,
            TIME_LABELS[slot],
            ICONS[slot],
            TIME_RANGES[slot]
        );
    });
}

function showMealSwapModal(slotIdx) {
    const programData = loadState(KEYS.program);
    if (!programData) return;
    const day = getCurrentDay();
    const tdee = programData.tdee;
    const dk = getDislikes().join('_');
    const cKey = KEYS.daydata + day + '_d_' + dk + '_v14';
    const dayData = loadState(cKey);
    if (!dayData || !Array.isArray(dayData.meals)) return;
    const currentMeal = dayData.meals[slotIdx];
    if (!currentMeal) return;

    let modal = document.getElementById('meal-swap-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'meal-swap-modal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.65);display:flex;align-items:flex-end;justify-content:center;';
        modal.addEventListener('click', function (e) { if (e.target === modal) closeMealSwapModal(); });
        document.body.appendChild(modal);
    }

    const alternatives = getSwapAlternatives(currentMeal, slotIdx, day, tdee);
    const SLOT_NAMES = ['Sarapan', 'Makan Siang', 'Makan Malam'];

    /* FIX-17: hapus semua emoji dari modal HTML */
    if (!alternatives.length) {
        modal.innerHTML = '<div style="background:var(--bg);width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:30px 20px 40px;text-align:center;">'
            + '<div style="font-size:.93rem;font-weight:700;color:var(--text);margin-bottom:8px;">Tidak ada alternatif</div>'
            + '<div style="font-size:.8rem;color:var(--text3);margin-bottom:22px;">Semua pilihan lain mengandung bahan yang kamu hindari.</div>'
            + '<button onclick="closeMealSwapModal()" style="background:var(--card);border:1.5px solid var(--border2);color:var(--text2);padding:10px 28px;border-radius:99px;font-size:.85rem;font-weight:600;cursor:pointer;">Tutup</button>'
            + '</div>';
        modal.style.display = 'flex';
        return;
    }

    modal._alternatives = alternatives;
    modal._slotIdx = slotIdx;

    const altCardsHTML = alternatives.map((alt, i) => {
        const mk = alt.makro || { protein: 0, karbo: 0, lemak: 0 };
        const bahanList = alt.resep && Array.isArray(alt.resep.bahan)
            ? alt.resep.bahan.slice(0, 3).map(b => b.gram + (b.unit === 'g' ? 'g' : ' ' + b.unit) + ' ' + b.item.toLowerCase()).join(', ')
            : '';
        return '<div onclick="applyMealSwap(' + slotIdx + ',' + i + ')" style="background:var(--card2);border:1.5px solid var(--border2);border-radius:14px;padding:14px 16px;margin-bottom:10px;cursor:pointer;">'
            + '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:7px;">'
            + '<div style="font-size:.9rem;font-weight:700;color:var(--text);line-height:1.35;">' + alt.nama + '</div>'
            + '<div style="font-size:.88rem;font-weight:700;color:var(--accent);white-space:nowrap;">' + alt.kalori + ' kkal</div>'
            + '</div>'
            + '<div style="display:flex;gap:10px;font-size:.75rem;margin-bottom:9px;">'
            + '<span style="color:var(--blue);">' + mk.protein + 'g protein</span>'
            + '<span style="color:var(--text2);">' + mk.karbo + 'g karbo</span>'
            + '<span style="color:var(--text3);">' + mk.lemak + 'g lemak</span>'
            + '</div>'
            + (bahanList ? '<div style="font-size:.73rem;color:var(--text3);margin-bottom:11px;">' + bahanList + (alt.resep.bahan.length > 3 ? ' ...' : '') + '</div>' : '')
            + '<div style="background:var(--accent);color:#000;text-align:center;padding:8px 0;border-radius:99px;font-size:.82rem;font-weight:700;letter-spacing:.02em;">&#10003; Pilih Menu Ini</div>'
            + '</div>';
    }).join('');

    modal.innerHTML = '<div style="background:var(--bg);width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:22px 18px 40px;max-height:90vh;overflow-y:auto;">'
        + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">'
        + '<div style="font-size:1rem;font-weight:700;color:var(--text);">Ganti Menu</div>'
        + '<button onclick="closeMealSwapModal()" style="background:none;border:none;color:var(--text2);font-size:1.3rem;cursor:pointer;padding:0 4px;line-height:1;">&#10005;</button>'
        + '</div>'
        + '<div style="font-size:.75rem;color:var(--text3);margin-bottom:14px;">' + SLOT_NAMES[slotIdx] + ' &middot; kalori tetap sesuai targetmu</div>'
        + '<div style="background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 13px;margin-bottom:16px;">'
        + '<div style="font-size:.7rem;color:var(--text3);margin-bottom:3px;">Menu sekarang:</div>'
        + '<div style="font-size:.86rem;font-weight:600;color:var(--text);">' + currentMeal.nama + '</div>'
        + '</div>'
        + '<div style="font-size:.79rem;font-weight:600;color:var(--text2);margin-bottom:10px;">Pilih alternatif:</div>'
        + altCardsHTML
        + '<button onclick="closeMealSwapModal()" style="width:100%;background:transparent;border:1.5px solid var(--border2);color:var(--text3);padding:10px 0;border-radius:99px;font-size:.82rem;font-weight:600;cursor:pointer;margin-top:4px;">Batal</button>'
        + '</div>';

    modal.style.display = 'flex';
}

function closeMealSwapModal() {
    const modal = document.getElementById('meal-swap-modal');
    if (modal) modal.style.display = 'none';
}

/* FIX-17: hapus emoji dari toast */
function applyMealSwap(slotIdx, altIdx) {
    const modal = document.getElementById('meal-swap-modal');
    if (!modal || !Array.isArray(modal._alternatives)) return;
    const newMeal = modal._alternatives[altIdx];
    if (!newMeal) return;

    const day = getCurrentDay();
    const dk = getDislikes().join('_');
    const cKey = KEYS.daydata + day + '_d_' + dk + '_v14';
    let dayData = loadState(cKey) || { meals: [], workout: null };
    if (!Array.isArray(dayData.meals)) dayData.meals = [];

    const frozenMeal = deepCloneMeals([newMeal])[0];
    dayData.meals[slotIdx] = frozenMeal;
    saveState(cKey, dayData);

    const container = document.getElementById('meal-cards');
    const oldCard = document.getElementById('meal-card-' + slotIdx);
    if (container && oldCard) {
        const newCard = renderMealCard(frozenMeal, slotIdx, null);
        newCard.classList.add('open');
        container.replaceChild(newCard, oldCard);
    }

    _refreshMenuMacros(dayData.meals);
    closeMealSwapModal();

    let toast = document.getElementById('_swap_ok_toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = '_swap_ok_toast';
        toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--card);border:1.5px solid var(--accent);color:var(--accent);padding:11px 24px;border-radius:99px;font-size:.83rem;font-weight:600;z-index:9999;pointer-events:none;white-space:nowrap;transition:opacity .3s;';
        document.body.appendChild(toast);
    }
    toast.textContent = 'Menu berhasil diganti!';
    toast.style.opacity = '1';
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(function () { toast.style.opacity = '0'; }, 2500);
}

/* FIX-17: hapus emoji dari macro pills */
function _refreshMenuMacros(meals) {
    if (!Array.isArray(meals)) return;
    const totalProt = meals.reduce((s, m) => s + ((m.makro || {}).protein || 0), 0);
    const totalKarbo = meals.reduce((s, m) => s + ((m.makro || {}).karbo || 0), 0);
    const totalLemak = meals.reduce((s, m) => s + ((m.makro || {}).lemak || 0), 0);
    const mMacEl = document.getElementById('menu-macro-pills');
    if (mMacEl) mMacEl.innerHTML =
        '<span class="macro-pill">' + totalProt + 'g Protein</span>'
        + '<span class="macro-pill">' + totalKarbo + 'g Karbo</span>'
        + '<span class="macro-pill">' + totalLemak + 'g Lemak</span>';
}


/* ============================================================
   SUBSTITUTION HELPERS — tidak ada perubahan
   ============================================================ */
function toggleSubsPanel(panelId) {
    const p = document.getElementById(panelId);
    if (p) p.classList.toggle('open');
}

function selectSub(panelId, nameId, altName, optEl) {
    const nameEl = document.getElementById(nameId);
    if (nameEl) nameEl.textContent = altName;
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.querySelectorAll('.subs-option').forEach(o => o.classList.remove('selected'));
        optEl.classList.add('selected');
        setTimeout(() => panel.classList.remove('open'), 300);
    }
}


/* ============================================================
SUBSTITUTION HELPERS
============================================================ */
function toggleSubsPanel(panelId) {
    const p = document.getElementById(panelId);
    if (p) p.classList.toggle('open');
}
function selectSub(panelId, nameId, altName, optEl) {
    const nameEl = document.getElementById(nameId);
    if (nameEl) nameEl.textContent = altName;
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.querySelectorAll('.subs-option').forEach(o => o.classList.remove('selected'));
        optEl.classList.add('selected');
        setTimeout(() => panel.classList.remove('open'), 300);
    }
}


