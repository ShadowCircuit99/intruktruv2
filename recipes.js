

    const B = (id, qty, role, unit, opt) => {
    const b = { id: id, qty: qty, role: role || 'bumbu', unit: unit || 'g' };
    if (!opt) return b;
    if (opt.nama) b.nama = opt.nama;
    if (opt.alts) b.alts = opt.alts;
    if (opt.note) b.note = opt.note;
    if (opt.scale === false) b.scale = false;
    return b;
    };

    const GARAM = (g) => B('garam', g === undefined ? 1 : g, 'bumbu', 'g', { scale: false });
    const MERICA = (g) => B('merica_bubuk', g === undefined ? 0.3 : g, 'bumbu', 'g', { scale: false });
    const KASIN = (ml) => B('kecap_asin', ml === undefined ? 8 : ml, 'bumbu', 'ml', { scale: false });
    const MANIS = (ml) => B('kecap_manis', ml === undefined ? 10 : ml, 'bumbu', 'ml', { scale: false });
    
    const MINYAK = (ml) => B('minyak_goreng', ml, 'oil', 'ml', { scale: false });

    const RECIPES = [

    /* SARAPAN */
    { id:'sar-nasi-telur-bayam', nama:'Nasi Putih, Telur Ceplok Kecap, dan Tumis Bayam',
    slot:'pagi', method:'tumis', tag:['karbo:nasi','protein:telur'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g', { alts:'nasi_merah' }),
    B('telur_ayam', 2, 'protein', 'butir', { alts:'telur_bebek' }),
    B('bayam', 100, 'sayur', 'g', { alts:'kangkung' }),
    B('bawang_merah', 1, 'bumbu', 'siung'),
    B('bawang_putih', 1, 'bumbu', 'siung'),
    MANIS(10), GARAM(1), MERICA(0.2), MINYAK(4)
    ],
    langkah:[
    'Panaskan minyak di wajan api sedang, tumis bawang putih geprek sampai harum, sekitar 30 detik.',
    'Masukkan bayam, aduk, masak 2 menit sampai layu. Cicipi garam, lalu angkat.',
    'Di wajan yang sama, pecahkan telur satu per satu dan jangan diaduk.',
    'Masak 2 sampai 3 menit dengan api kecil. Siram kecap manis saat pinggirannya sudah set.',
    'Sajikan nasi hangat dengan telur ceplok dan tumis bayam.'
    ] },

    { id:'sar-tempe-goreng-kunyit', nama:'Nasi Merah, Tempe Goreng Kunyit, dan Tumis Kangkung',
    slot:'pagi', method:'goreng', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_merah', 150, 'karbo', 'g', { alts:'nasi_putih' }),
    B('tempe', 120, 'protein', 'g'),
    B('kangkung', 100, 'sayur', 'g', { alts:'bayam' }),
    B('kunyit', 6, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    KASIN(8), GARAM(1), MERICA(0.3), MINYAK(6)
    ],
    langkah:[
    'Iris tempe tipis, lumuri rata dengan kunyit parut, garam, dan lada. Diamkan 5 menit.',
    'Goreng di wajan dengan minyak, api sedang, 3 menit tiap sisi. Jangan sering dibalik.',
    'Tumis bawang putih geprek di wajan lain sampai harum, masukkan kangkung dan kecap asin.',
    'Masak 2 menit sampai kangkung layu, bumbui garam.',
    'Sajikan nasi merah dengan tempe goreng kunyit dan tumis kangkung.'
    ] },

    { id:'sar-roti-dadar', nama:'Roti Tawar, Telur Dadar Sayur, dan Susu',
    slot:'pagi', method:'tumis', tag:['karbo:roti','protein:telur'],
    bahan:[
    B('roti_tawar', 3, 'karbo', 'lembar', { alts:'roti_gandum' }),
    B('telur_ayam', 2, 'protein', 'butir'),
    B('sawi_hijau', 60, 'sayur', 'g', { alts:'bayam' }),
    B('bawang_merah', 1, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 1, 'bumbu', 'siung', { scale: false }),
    GARAM(1), MERICA(0.2), MINYAK(5),
    B('susu_sapi', 200, 'protein', 'ml', { scale: false, note:'Gelas susu UHT' })
    ],
    langkah:[
    'Cincang kasar sawi dan bawang merah, sisihkan.',
    'Kocok 2 telur dengan garam dan lada sampai rata, masukkan potongan sawi.',
    'Tuang ke wajan dengan sedikit minyak, masak api sedang sampai sisi bawah set.',
    'Balik sekali, masak 1 menit lagi. Jangan digoreng terlalu lama agar tidak kering.',
    'Sajikan dengan roti tawar dan segelas susu UHT.'
    ] },

    { id:'sar-ayam-suwir', nama:'Nasi Putih, Ayam Suwir Kecap, dan Tumis Wortel',
    slot:'pagi', method:'tumis', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('dada_ayam', 130, 'protein', 'g'),
    B('wortel', 80, 'sayur', 'g', { alts:'buncis' }),
    B('bawang_merah', 2, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    MANIS(12), GARAM(1), MERICA(0.3), MINYAK(5)
    ],
    langkah:[
    'Rebus ayam di 600 ml air mendidih dengan garam, 20 menit hingga matang.',
    'Angkat, dinginkan sebentar, lalu suwir kasar.',
    'Tumis bawang merah dan bawang putih iris sampai layu dan harum.',
    'Masukkan ayam suwir dan kecap manis, masak 3 menit sampai bumbu meresap.',
    'Tumis wortel iris tipis 3 menit, sajikan bersama nasi.'
    ] },

    { id:'sar-kentang-telur-balado', nama:'Kentang Rebus, Telur Balado Sederhana, dan Air',
    slot:'pagi', method:'goreng', tag:['karbo:kentang','protein:telur'],
    bahan:[
    B('kentang', 200, 'karbo', 'g', { alts:'ubi_jalar' }),
    B('telur_ayam', 2, 'protein', 'butir'),
    B('tomat', 80, 'sayur', 'g'),
    B('daun_salam', 1, 'bumbu', 'lembar', { scale: false }),
    GARAM(1), MERICA(0.2), MINYAK(6)
    ],
    langkah:[
    'Rebus kentang utuh 20 menit hingga bisa ditusuk garpu. Kupas dan potong.',
    'Rebus telur 10 menit, kupas.',
    'Goreng telur sebentar di wajan dengan minyak sampai kulit sedikit kecokelatan.',
    'Tumis tomat cincang kasar dengan daun salam, garam, dan lada sampai menjadi saus kental.',
    'Masukkan telur goreng ke saus, aduk pelan 2 menit. Sajikan dengan kentang rebus.'
    ] },

    { id:'sar-tahu-kecap-sawi', nama:'Nasi Merah, Tahu Goreng Kecap, dan Sawi Rebus',
    slot:'pagi', method:'goreng', tag:['karbo:nasi','protein:tahu'],
    bahan:[
    B('nasi_merah', 150, 'karbo', 'g', { alts:'nasi_putih' }),
    B('tahu_putih', 200, 'protein', 'g', { alts:'tahu_kuning' }),
    B('sawi_hijau', 100, 'sayur', 'g', { alts:'sawi_putih' }),
    MANIS(15), GARAM(1), MERICA(0.2), MINYAK(6)
    ],
    langkah:[
    'Potong tahu jadi beberapa bagian tebal.',
    'Goreng di wajan dengan minyak minimal sampai semua sisi kuning kecokelatan.',
    'Tumis bawang putih geprek, masukkan tahu goreng dan kecap manis, masak 2 menit api kecil.',
    'Rebus sawi di air bergarum 2 menit, lalu tiriskan.',
    'Sajikan nasi merah dengan tahu kecap dan sawi rebus.'
    ] },

    { id:'sar-telur-orarik', nama:'Nasi Putih, Telur Orak-Arik, dan Tumis Kol',
    slot:'pagi', method:'tumis', tag:['karbo:nasi','protein:telur'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('telur_ayam', 3, 'protein', 'butir'),
    B('kol', 100, 'sayur', 'g', { alts:'sawi_putih' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    KASIN(6), GARAM(1), MERICA(0.3), MINYAK(6)
    ],
    langkah:[
    'Iris tipis bawang merah dan bawang putih, tumis sampai harum dan kecokelatan.',
    'Kocok 3 telur dengan kecap asin dan lada sampai rata.',
    'Tuang kocokan ke wajan, tunggu 10 detik tanpa diaduk, lalu orak-arik pelan sampai matang tapi lembap.',
    'Tumis kol iris tipis di wajan lain 3 menit, bumbui garam.',
    'Sajikan nasi dengan telur orak-arik dan tumis kol.'
    ] },

    { id:'sar-tempe-bacem', nama:'Nasi Merah, Tempe Bacem Manis, dan Tumis Bayam',
    slot:'pagi', method:'bacem', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_merah', 150, 'karbo', 'g', { alts:'nasi_putih' }),
    B('tempe', 130, 'protein', 'g'),
    B('bayam', 100, 'sayur', 'g', { alts:'kangkung' }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    B('ketumbar_bubuk', 2, 'bumbu', 'g', { scale: false }),
    MANIS(15), GARAM(1), MINYAK(5)
    ],
    langkah:[
    'Potong tempe jadi dadu agak besar, rebus 3 menit untuk mengurangi rasa pahit, lalu tiriskan.',
    'Tumis bawang putih geprek sampai harum. Tuang 150 ml air, kecap manis, dan ketumbar, biarkan mendidih.',
    'Masukkan tempe, kecilkan api, masak 15 menit sambil sesekali diaduk pelan sampai kuah menyusut.',
    'Tumis bayam dengan bawang putih 2 menit sampai layu.',
    'Sajikan nasi merah dengan tempe bacem dan tumis bayam.'
    ] },

    { id:'sar-ayam-goreng-kunyit', nama:'Nasi Putih, Ayam Goreng Kunyit, dan Tumis Kangkung',
    slot:'pagi', method:'goreng', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('dada_ayam', 130, 'protein', 'g', { alts:'ayam_kampung' }),
    B('kangkung', 100, 'sayur', 'g', { alts:'bayam' }),
    B('kunyit', 8, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    KASIN(8), GARAM(1), MERICA(0.3), MINYAK(7)
    ],
    langkah:[
    'Lumuri ayam dengan kunyit parut, garam, dan lada. Diamkan 10 menit.',
    'Biarkan tiap sisi matang dulu sebelum dibalik, supaya tidak hangus.',
    'Tumis kangkung dengan bawang putih 2 menit sampai layu, bumbui garam.',
    'Sajikan nasi dengan ayam goreng kunyit dan tumis kangkung.'
    ] },

    { id:'sar-oat-kedelai', nama:'Oatmeal Susu Kedelai dan Pisang',
    slot:'pagi', method:'rebus', tag:['karbo:oat','protein:kedelai'],
    bahan:[
    B('oatmeal', 50, 'karbo', 'g'),
    B('susu_kedelai', 250, 'protein', 'ml', { alts:'susu_sapi' }),
    B('pisang', 1, 'buah', 'buah', { scale: false, alts:'apel' })
    ],
    langkah:[
    'Didihkan susu kedelai, kecilkan api, lalu masukkan oatmeal.',
    'Aduk perlahan 4 sampai 5 menit sampai kental.',
    'Iris pisang, taburkan di atas, dan sajikan selagi hangat.'
    ] },

    { id:'sar-lontong-sate', nama:'Lontong, Sate Ayam Kecap, dan Timun',
    slot:'pagi', method:'panggang', tag:['karbo:lontong','protein:ayam'],
    bahan:[
    B('lontong', 150, 'karbo', 'g', { alts:'ketupat' }),
    B('dada_ayam', 120, 'protein', 'g'),
    B('timun', 80, 'sayur', 'g', { alts:'tomat' }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    MANIS(20), GARAM(1), MERICA(0.3), MINYAK(4)
    ],
    langkah:[
    'Potong ayam jadi dadu 2 cm, lumuri dengan kecap manis, garam, dan lada. Diamkan 20 menit.',
    'Tusuk ayam di tusuk sate, 4 sampai 5 tusuk per porsi.',
    'Panggang 3 menit tiap sisi dengan api sedang, oles minyak sisa.',
    'Potong timun dan lontong, sajikan bersama kecap manis untuk celup.'
    ] },

    { id:'sar-bubur-ayam', nama:'Bubur Nasi Ayam Jahe dan Telur Rebus',
    slot:'pagi', method:'rebus', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('beras_putih', 50, 'karbo', 'g'),
    B('dada_ayam', 100, 'protein', 'g'),
    B('telur_ayam', 1, 'protein', 'butir'),
    B('jahe', 8, 'bumbu', 'g', { scale: false }),
    B('daun_bawang', 15, 'sayur', 'g', { scale: false }),
    GARAM(1), MERICA(0.2)
    ],
    langkah:[
    'Cuci beras, rebus dalam 500 ml air dengan jahe iris dan garam sampai menjadi bubur yang pulen.',
    'Masukkan ayam rebus yang sudah disuwir, masak lagi 5 menit sambil diaduk pelan.',
    'Tambahkan daun bawang iris, koreksi rasa dengan garam.',
    'Rebus telur terpisah 10 menit, kupas, sajikan di samping mangkuk.'
    ] },

    { id:'sar-omelet-keju', nama:'Omelet Keju Tomat, Roti Tawar, dan Jeruk',
    slot:'pagi', method:'tumis', tag:['karbo:roti','protein:telur'],
    bahan:[
    B('roti_tawar', 3, 'karbo', 'lembar', { alts:'roti_gandum' }),
    B('telur_ayam', 2, 'protein', 'butir'),
    B('keju', 20, 'protein', 'g', { alts:'tahu_kuning' }),
    B('tomat', 100, 'sayur', 'g'),
    B('bawang_putih', 1, 'bumbu', 'siung', { scale: false }),
    GARAM(0.8), MERICA(0.2), MINYAK(5),
    B('jeruk', 1, 'buah', 'buah', { scale: false })
    ],
    langkah:[
    'Tiris tomat dari bijinya, potong kecil, cincang halus bawang putih.',
    'Tumis bawang putih sampai harum, masukkan tomat, garam, dan lada, masak 2 menit sampai lembut.',
    'Kocok telur dengan garam, tuang ke wajan berminyak, masak api sedang 2 menit.',
    'Taburkan keju, tutup 30 detik agar leleh, lalu angkat sebelum terlalu kering.',
    'Sajikan dengan roti tawar dan satu buah jeruk.'
    ] },

    /* MAKAN SIANG */
    { id:'siang-ayam-kuning', nama:'Nasi Putih, Ayam Goreng Bumbu Kuning, dan Tumis Kangkung',
    slot:'siang', method:'goreng', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g', { alts:'nasi_merah' }),
    B('dada_ayam', 150, 'protein', 'g', { alts:'ayam_kampung' }),
    B('kangkung', 100, 'sayur', 'g', { alts:'bayam' }),
    B('kunyit', 10, 'bumbu', 'g', { scale: false }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    B('jahe', 5, 'bumbu', 'g', { scale: false }),
    GARAM(1.5), MERICA(0.5), MINYAK(8)
    ],
    langkah:[
    'Haluskan kunyit, bawang putih, bawang merah, dan jahe jadi bumbu.',
    'Lumuri ayam dengan bumbu, garam, dan lada. Diamkan 20 menit agar meresap.',
    'Goreng di wajan dengan minyak, api sedang, 6 sampai 7 menit tiap sisi.',
    'Tumis kangkung dengan bawang putih 2 menit, bumbui garam.',
    'Sajikan nasi bersama ayam goreng bumbu kuning dan tumis kangkung.'
    ] },

    { id:'siang-tempe-orek', nama:'Nasi Putih, Tempe Orek Kecap, dan Tumis Buncis',
    slot:'siang', method:'goreng', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('tempe', 150, 'protein', 'g', { alts:'tempe_mendoan' }),
    B('buncis', 100, 'sayur', 'g', { alts:'kacang_panjang' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    MANIS(15), GARAM(1), MERICA(0.3), MINYAK(7)
    ],
    langkah:[
    'Potong tempe jadi dadu kecil, goreng dengan minyak sampai semua sisi kecokelatan.',
    'Tumis bawang merah dan bawang putih sampai harum.',
    'Masukkan tempe goreng dan kecap manis, aduk pelan, masak 3 sampai 4 menit sampai meresap.',
    'Tumis buncis 4 menit, bumbui garam.',
    'Sajikan nasi dengan tempe orek kecap dan tumis buncis.'
    ] },

    { id:'siang-telur-bumbu', nama:'Nasi Putih, Telur Bumbu Bali, dan Wortel Kol',
    slot:'siang', method:'goreng', tag:['karbo:nasi','protein:telur'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('telur_ayam', 3, 'protein', 'butir'),
    B('wortel', 80, 'sayur', 'g'),
    B('kol', 80, 'sayur', 'g', { alts:'sawi_putih' }),
    B('tomat', 100, 'sayur', 'g'),
    B('bawang_merah', 4, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    GARAM(1.5), MERICA(0.3), MINYAK(7)
    ],
    langkah:[
    'Rebus telur 12 menit, kupas, lalu goreng sebentar sampai kulit berbintik kecokelatan.',
    'Haluskan kasar bawang merah, bawang putih, dan tomat.',
    'Tumis di sedikit minyak sampai matang dan harum, tambahkan 100 ml air.',
    'Masukkan telur goreng ke bumbu, masak pelan 3 menit agar bumbu meresap ke kulit telur.',
    'Tumis wortel dan kol 4 menit, sajikan semua bersama nasi.'
    ] },

    { id:'siang-tahu-bacem', nama:'Nasi Putih, Tahu Bacem Manis, dan Tumis Kol',
    slot:'siang', method:'bacem', tag:['karbo:nasi','protein:tahu'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('tahu_kuning', 200, 'protein', 'g', { alts:'tahu_putih' }),
    B('kol', 120, 'sayur', 'g', { alts:'sawi_putih' }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    B('ketumbar_bubuk', 2, 'bumbu', 'g', { scale: false }),
    B('daun_salam', 1, 'bumbu', 'lembar', { scale: false }),
    MANIS(20), GARAM(1), MINYAK(5)
    ],
    langkah:[
    'Potong tahu jadi bagian agak tebal, rebus 3 menit untuk mengurangi kadar air, lalu tiriskan.',
    'Tumis bawang putih geprek sampai harum. Masukkan 150 ml air, kecap manis, ketumbar, dan daun salam.',
    'Masukkan tahu, kecilkan api, masak 15 sampai 20 menit sambil sesekali dibalik sampai kuah menyusut.',
    'Tumis kol iris tipis 3 menit.',
    'Sajikan bersama nasi dan tahu bacem.'
    ] },

    { id:'siang-ayam-rebus', nama:'Nasi Putih, Ayam Rebus Rempah, dan Sup Wortel',
    slot:'siang', method:'rebus', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('dada_ayam', 150, 'protein', 'g'),
    B('wortel', 100, 'sayur', 'g'),
    B('serai', 1, 'bumbu', 'batang', { scale: false }),
    B('jahe', 8, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    B('daun_salam', 2, 'bumbu', 'lembar', { scale: false }),
    GARAM(1.5), MERICA(0.4)
    ],
    langkah:[
    'Didihkan 700 ml air, masukkan serai geprek, jahe iris, bawang putih, dan daun salam. Biarkan 2 menit.',
    'Masukkan dada ayam utuh, kecilkan api ke sedang, rebus 25 sampai 30 menit. Angkat lalu suwir.',
    'Saring kuah ke panci bersih, masukkan wortel potong, rebus 10 menit.',
    'Bumbui kuah dengan garam dan lada, cicipi sebelum mengangkat dari api.',
    'Sajikan nasi putih dengan suwiran ayam rempah dan sup wortel hangat.'
    ] },

    { id:'siang-ayam-kecap', nama:'Nasi Merah, Ayam Kecap Bawang, dan Tumis Sawi',
    slot:'siang', method:'tumis', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_merah', 150, 'karbo', 'g', { alts:'nasi_putih' }),
    B('dada_ayam', 150, 'protein', 'g'),
    B('sawi_hijau', 100, 'sayur', 'g', { alts:'kangkung' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    MANIS(15), KASIN(8), GARAM(1), MERICA(0.4), MINYAK(6)
    ],
    langkah:[
    'Potong ayam tipis melintang serat. Tumis bawang merah dan putih iris sampai layu dan harum.',
    'Masukkan ayam, aduk, masak 4 sampai 5 menit sampai warnanya berubah dan matang.',
    'Tuang kecap manis dan kecap asin, aduk rata, masak 2 sampai 3 menit lagi.',
    'Tumis sawi hijau dengan bawang putih 2 menit, bumbui garam.',
    'Sajikan bersama nasi merah.'
    ] },

    { id:'siang-tempe-asem', nama:'Nasi Putih, Tempe Goreng Rempah, dan Sayur Asem',
    slot:'siang', method:'goreng', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('tempe', 150, 'protein', 'g'),
    B('kacang_panjang', 80, 'sayur', 'g', { alts:'buncis' }),
    B('jagung_manis', 100, 'sayur', 'g'),
    B('tomat', 80, 'sayur', 'g'),
    B('kunyit', 5, 'bumbu', 'g', { scale: false }),
    B('ketumbar_bubuk', 2, 'bumbu', 'g', { scale: false }),
    GARAM(2), MERICA(0.3), MINYAK(7)
    ],
    langkah:[
    'Iris tempe agak tebal, lumuri dengan ketumbar, kunyit, garam, dan lada.',
    'Goreng di wajan 3 menit tiap sisi, biarkan tiap sisi matang dulu sebelum dibalik.',
    'Didihkan 600 ml air, masukkan tomat cincang dan garam.',
    'Masukkan jagung dan kacang panjang, masak 8 menit sampai empuk.',
    'Sajikan nasi dengan tempe goreng rempah dan sayur asem hangat.'
    ] },

    { id:'siang-tahu-saus-tomat', nama:'Nasi Merah, Tahu Panggang Saus Tomat, dan Wortel',
    slot:'siang', method:'panggang', tag:['karbo:nasi','protein:tahu'],
    bahan:[
    B('nasi_merah', 150, 'karbo', 'g', { alts:'nasi_putih' }),
    B('tahu_putih', 180, 'protein', 'g', { alts:'tahu_kuning' }),
    B('tomat', 150, 'sayur', 'g'),
    B('wortel', 100, 'sayur', 'g', { alts:'kol' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    MANIS(8), GARAM(1), MERICA(0.3), MINYAK(4)
    ],
    langkah:[
    'Potong tahu jadi dadu sedang, panggang di wajan tanpa minyak sampai semua sisi kecokelatan.',
    'Balik pelan-pelan agar tidak hancur, lalu sisihkan.',
    'Tumis bawang merah iris, masukkan tomat cincang kasar, kecap manis, dan 2 sendok makan air.',
    'Masak sampai tomat lunak dan saus mengental, masukkan tahu, aduk pelan, masak 3 menit.',
    'Tumis wortel 3 menit, sajikan bersama nasi merah.'
    ] },

    { id:'siang-telur-dadar', nama:'Nasi Putih, Telur Dadar Kecap, dan Tumis Kangkung',
    slot:'siang', method:'tumis', tag:['karbo:nasi','protein:telur'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('telur_ayam', 3, 'protein', 'butir'),
    B('kangkung', 100, 'sayur', 'g', { alts:'bayam' }),
    B('bawang_merah', 2, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    MANIS(12), GARAM(1), MERICA(0.2), MINYAK(6)
    ],
    langkah:[
    'Kocok 3 telur dengan garam dan lada sampai rata.',
    'Tuang ke wajan dengan minyak, masak api sedang sampai bawah set, balik sekali, masak 1 menit.',
    'Jangan sampai terlalu kering, angkat dan potong-potong.',
    'Tumis kangkung dengan bawang merah dan putih 2 menit sampai layu.',
    'Siram kecap manis di atas dadar, sajikan bersama nasi putih.'
    ] },

    { id:'siang-ayam-buncis', nama:'Nasi Putih, Ayam Tumis Buncis Bawang',
    slot:'siang', method:'tumis', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g', { alts:'nasi_merah' }),
    B('dada_ayam', 150, 'protein', 'g'),
    B('buncis', 120, 'sayur', 'g', { alts:'kacang_panjang' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    KASIN(10), GARAM(1), MERICA(0.3), MINYAK(6)
    ],
    langkah:[
    'Potong ayam jadi dadu kecil. Tumis bawang merah dan putih iris sampai harum dan layu.',
    'Masukkan ayam, aduk rata, masak 5 sampai 6 menit sampai matang dan sedikit kecokelatan.',
    'Masukkan buncis potong 3 cm dan kecap asin, tumis 4 menit sampai buncis empuk tapi masih hijau.',
    'Sajikan langsung di atas nasi hangat.'
    ] },

    { id:'siang-tempe-tahu', nama:'Nasi Merah, Tempe Tahu Goreng Kunyit, dan Tumis Kol',
    slot:'siang', method:'goreng', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_merah', 150, 'karbo', 'g', { alts:'nasi_putih' }),
    B('tempe', 100, 'protein', 'g'),
    B('tahu_putih', 100, 'protein', 'g'),
    B('kol', 80, 'sayur', 'g', { alts:'sawi_hijau' }),
    B('kunyit', 8, 'bumbu', 'g', { scale: false }),
    B('ketumbar_bubuk', 1, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    GARAM(1), MERICA(0.3), MINYAK(8)
    ],
    langkah:[
    'Potong tempe dan tahu jadi dadu sedang, lumuri dengan kunyit parut, ketumbar, garam, dan lada. Diamkan 5 menit.',
    'Goreng tempe dulu 3 menit tiap sisi sampai kecokelatan, lalu angkat.',
    'Goreng tahu di wajan yang sama dengan hati-hati, balik pelan supaya tidak hancur, 2 menit tiap sisi.',
    'Tumis kol iris tipis dengan bawang putih 3 menit sampai agak layu.',
    'Sajikan tempe dan tahu goreng kunyit bersama tumis kol dan nasi merah.'
    ] },

    { id:'siang-ikan-bakar', nama:'Nasi Putih, Ikan Bakar Sambal Dadar, dan Brokoli',
    slot:'siang', method:'panggang', tag:['karbo:nasi','protein:ikan'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('ikan_kembung', 150, 'protein', 'g', { alts:'ikan_tongkol' }),
    B('brokoli', 120, 'sayur', 'g', { alts:'buncis' }),
    B('tomat', 100, 'sayur', 'g'),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    MANIS(12), GARAM(1.5), MERICA(0.3), MINYAK(5)
    ],
    langkah:[
    'Bersihkan ikan, buat 2 sampai 3 sayatan diagonal agar bumbu meresap.',
    'Lumuri dengan kecap manis, garam, dan lada, diamkan 10 menit.',
    'Panggang di wajan dengan minyak, 4 menit tiap sisi.',
    'Sambal: tumis bawang merah iris dengan tomat cincang, garam, dan lada sampai mengental.',
    'Kukus brokoli 4 menit, sajikan bersama nasi dan ikan bakar dengan sambal.'
    ] },

    { id:'siang-mie-ayam', nama:'Mie Instan Goreng, Ayam, dan Kangkung',
    slot:'siang', method:'goreng', tag:['karbo:mie','protein:ayam'],
    bahan:[
    B('mie_instan', 1, 'karbo', 'bungkus', { alts:'bihun' }),
    B('dada_ayam', 100, 'protein', 'g'),
    B('kangkung', 100, 'sayur', 'g'),
    B('bawang_merah', 2, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    GARAM(1.5), MERICA(0.3), MINYAK(6)
    ],
    langkah:[
    'Rebus mie setengah matang, lalu tiriskan.',
    'Goreng ayam dengan minyak sampai matang, tambahkan bawang merah dan putih.',
    'Masukkan mie, aduk dengan bumbu hingga bercampur.',
    'Tambahkan kangkung, masak 2 menit sampai layu, bumbui garam dan lada.'
    ] },

    { id:'siang-gado-gado', nama:'Gado-Gado, Nasi Putih, dan Tahu Panggang',
    slot:'siang', method:'goreng', tag:['karbo:nasi','protein:tahu'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('tahu_putih', 150, 'protein', 'g'),
    B('kangkung', 100, 'sayur', 'g'),
    B('tauge', 80, 'sayur', 'g'),
    B('buncis', 80, 'sayur', 'g'),
    B('kentang', 80, 'karbo', 'g', { alts:'ubi_jalar' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    B('gula_pasir', 5, 'bumbu', 'g', { scale: false, note:'Opsional' }),
    KASIN(20), GARAM(1), MINYAK(6)
    ],
    langkah:[
    'Panggang tahu di wajan sampai kecokelatan, potong dadu.',
    'Celup kangkung, tauge, dan buncis dalam air mendidih 2 menit, tiriskan.',
    'Tumis bawang merah dan putih, masukkan kentang rebus potong, kecap asin, dan gula. Masak 3 menit.',
    'Campur semua sayur ke dalam piring, letakkan tahu di atas.',
    'Siram bumbu kacang dan taburkan kerupuk, sajikan dengan nasi putih.'
    ] },

    { id:'siang-soto-ayam', nama:'Soto Ayam Bening, Nasi Putih, dan Wortel',
    slot:'siang', method:'rebus', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 150, 'karbo', 'g'),
    B('dada_ayam', 150, 'protein', 'g'),
    B('wortel', 80, 'sayur', 'g'),
    B('kentang', 60, 'karbo', 'g', { alts:'ubi_jalar' }),
    B('daun_salam', 2, 'bumbu', 'lembar', { scale: false }),
    B('serai', 1, 'bumbu', 'batang', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    B('tomat', 60, 'sayur', 'g'),
    GARAM(1.5), MERICA(0.3)
    ],
    langkah:[
    'Didihkan 800 ml air dengan serai, daun salam, dan bawang putih, lalu saring.',
    'Masukkan kentang potong dan rebus 10 menit.',
    'Tambahkan potongan ayam, wortel, dan tomat, rebus 8 menit lagi.',
    'Bumbui garam dan lada, koreksi rasa sebelum menghidangkan.',
    'Sajikan soto dengan nasi putih hangat.'
    ] },

    /* MAKAN MALAM */
    { id:'malam-ayam-kentang', nama:'Kentang Kukus, Ayam Tumis Bawang, dan Bayam',
    slot:'malam', method:'kukus', tag:['karbo:kentang','protein:ayam'],
    bahan:[
    B('kentang', 200, 'karbo', 'g'),
    B('dada_ayam', 130, 'protein', 'g', { alts:'ayam_kampung' }),
    B('bayam', 100, 'sayur', 'g', { alts:'kangkung' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    KASIN(8), GARAM(1), MERICA(0.3), MINYAK(5)
    ],
    langkah:[
    'Potong kentang jadi dadu sedang, kukus 15 menit sampai empuk saat ditusuk.',
    'Potong ayam jadi strip tipis, lumuri kecap asin dan lada.',
    'Tumis bawang merah dan putih, masukkan ayam, masak 8 sampai 10 menit sampai matang.',
    'Tumis bayam dengan bawang putih 2 menit sampai layu.',
    'Sajikan kentang kukus hangat bersama ayam tumis bawang dan tumis bayam.'
    ] },

    { id:'malam-sup-ayam', nama:'Sup Ayam Jahe Hangat, Nasi Merah, dan Wortel',
    slot:'malam', method:'rebus', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_merah', 100, 'karbo', 'g', { alts:'nasi_putih' }),
    B('dada_ayam', 120, 'protein', 'g'),
    B('wortel', 80, 'sayur', 'g'),
    B('kentang', 80, 'karbo', 'g', { alts:'ubi_jalar' }),
    B('jahe', 10, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    B('daun_bawang', 15, 'sayur', 'g', { scale: false }),
    GARAM(1.2), MERICA(0.3)
    ],
    langkah:[
    'Didihkan 600 ml air, masukkan jahe geprek dan bawang putih geprek. Biarkan 2 menit.',
    'Masukkan ayam utuh, kecilkan api, rebus 20 menit. Angkat, suwir, kembalikan ke kuah.',
    'Masukkan wortel dan kentang potong ke kuah, rebus 10 menit sampai empuk.',
    'Tabur daun bawang iris, bumbui garam dan lada.',
    'Sajikan sup hangat bersama nasi merah.'
    ] },

    { id:'malam-tempe-tahu', nama:'Tempe Goreng Tipis, Tahu Kukus, dan Tumis Sayuran',
    slot:'malam', method:'goreng', tag:['protein:tempe'],
    bahan:[
    B('tempe', 120, 'protein', 'g'),
    B('tahu_putih', 150, 'protein', 'g', { alts:'tahu_kuning' }),
    B('wortel', 80, 'sayur', 'g'),
    B('kol', 80, 'sayur', 'g', { alts:'sawi_putih' }),
    B('nasi_putih', 100, 'karbo', 'g'),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    KASIN(8), GARAM(1), MERICA(0.3), MINYAK(6)
    ],
    langkah:[
    'Iris tempe sangat tipis sekitar 3 mm, goreng di wajan dengan sedikit minyak sampai kecokelatan.',
    'Potong tahu tebal, kukus 10 menit sampai matang, lalu siram kecap asin.',
    'Tumis bawang putih geprek, masukkan wortel dan kol iris, tumis 4 menit.',
    'Sajikan tahu kukus, tempe goreng, tumis sayur, dan nasi.'
    ] },

    { id:'malam-ayam-kuah', nama:'Nasi Merah Porsi Kecil, Kuah Ayam Jahe, dan Buncis Rebus',
    slot:'malam', method:'rebus', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_merah', 100, 'karbo', 'g', { alts:'nasi_putih' }),
    B('dada_ayam', 130, 'protein', 'g'),
    B('buncis', 100, 'sayur', 'g', { alts:'kacang_panjang' }),
    B('jahe', 10, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 3, 'bumbu', 'siung', { scale: false }),
    B('daun_bawang', 20, 'sayur', 'g', { scale: false }),
    GARAM(1.2), MERICA(0.3)
    ],
    langkah:[
    'Rebus ayam bersama jahe iris tebal dan bawang putih geprek di 400 ml air, api sedang, 20 menit. Suwir.',
    'Tambahkan daun bawang iris ke kuah, bumbui garam dan lada.',
    'Rebus buncis di air bergarum 5 menit hingga empuk tapi masih hijau, lalu tiriskan.',
    'Sajikan nasi merah porsi kecil dengan kuah ayam jahe dan buncis rebus.'
    ] },

    { id:'malam-tahu-sambal', nama:'Nasi Putih, Tahu Goreng Sambal, dan Tumis Sawi',
    slot:'malam', method:'goreng', tag:['karbo:nasi','protein:tahu'],
    bahan:[
    B('nasi_putih', 100, 'karbo', 'g'),
    B('tahu_kuning', 200, 'protein', 'g', { alts:'tahu_putih' }),
    B('sawi_hijau', 100, 'sayur', 'g', { alts:'kangkung' }),
    B('tomat', 80, 'sayur', 'g'),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    GARAM(1.2), MERICA(0.4), MINYAK(6)
    ],
    langkah:[
    'Potong tahu jadi dadu sedang, goreng di wajan dengan minyak sampai semua sisi cokelat dan agak kering.',
    'Tumis bawang merah dan putih, masukkan tomat cincang, garam, dan lada. Masak sampai mengental.',
    'Masukkan tahu goreng ke sambal, aduk pelan agar tidak hancur, masak 2 sampai 3 menit.',
    'Tumis sawi hijau dengan bawang putih 2 menit sampai layu.',
    'Sajikan nasi porsi kecil dengan tahu goreng sambal dan tumis sawi.'
    ] },

    { id:'malam-tempe-kangkung', nama:'Nasi Merah, Tempe Goreng, dan Tumis Kangkung Bawang',
    slot:'malam', method:'goreng', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_merah', 100, 'karbo', 'g', { alts:'nasi_putih' }),
    B('tempe', 140, 'protein', 'g'),
    B('kangkung', 120, 'sayur', 'g', { alts:'bayam' }),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    KASIN(8), GARAM(1), MERICA(0.3), MINYAK(6)
    ],
    langkah:[
    'Iris tempe tipis, goreng di wajan dengan minyak sampai tiap sisi matang dan kering.',
    'Tumis bawang merah dan putih iris sampai harum dan layu.',
    'Masukkan kangkung dan kecap asin, aduk sebentar, tumis 2 menit sampai layu.',
    'Sajikan nasi merah dengan tempe goreng kering dan tumis kangkung bawang.'
    ] },

    { id:'malam-ikan-kukus', nama:'Nasi Putih Porsi Kecil, Ikan Kukus Jahe, dan Wortel',
    slot:'malam', method:'kukus', tag:['karbo:nasi','protein:ikan'],
    bahan:[
    B('nasi_putih', 100, 'karbo', 'g'),
    B('ikan_tongkol', 150, 'protein', 'g', { alts:'ikan_nila' }),
    B('wortel', 100, 'sayur', 'g'),
    B('jahe', 8, 'bumbu', 'g', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    KASIN(10), GARAM(1), MERICA(0.3)
    ],
    langkah:[
    'Cuci ikan, buat sayatan, lumuri dengan kecap asin, garam, dan jahe iris. Diamkan 10 menit.',
    'Kukus 12 sampai 15 menit dengan api sedang sampai daging mudah terlepas dari tulang.',
    'Tumis wortel dengan bawang putih 3 menit.',
    'Sajikan dengan nasi porsi kecil.'
    ] },

    { id:'malam-tempe-kukus', nama:'Tempe Kukus Kecap, Telur Rebus, dan Sayur Bening Bayam',
    slot:'malam', method:'kukus', tag:['protein:tempe'],
    bahan:[
    B('tempe', 150, 'protein', 'g'),
    B('telur_ayam', 2, 'protein', 'butir'),
    B('bayam', 150, 'sayur', 'g', { alts:'kangkung' }),
    B('jagung_manis', 80, 'sayur', 'g'),
    B('nasi_putih', 100, 'karbo', 'g'),
    B('bawang_merah', 3, 'bumbu', 'siung', { scale: false }),
    KASIN(6), GARAM(1)
    ],
    langkah:[
    'Kukus tempe utuh atau potong besar 15 menit sampai matang, lalu siram kecap asin.',
    'Rebus telur 10 menit, rendam air dingin sebentar, kupas, potong dua.',
    'Didihkan 400 ml air, masukkan bawang merah iris dan jagung potong, masak 5 menit.',
    'Masukkan bayam, masak 2 menit lagi, bumbui garam.',
    'Sajikan tempe kukus dan telur rebus bersama sayur bening dan nasi.'
    ] },

    { id:'malam-ayam-tumis', nama:'Nasi Porsi Kecil, Ayam Tumis Kecap, dan Wortel',
    slot:'malam', method:'tumis', tag:['karbo:nasi','protein:ayam'],
    bahan:[
    B('nasi_putih', 100, 'karbo', 'g', { alts:'nasi_merah' }),
    B('dada_ayam', 140, 'protein', 'g'),
    B('wortel', 100, 'sayur', 'g'),
    B('bawang_merah', 2, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 2, 'bumbu', 'siung', { scale: false }),
    MANIS(12), GARAM(1), MERICA(0.3), MINYAK(5)
    ],
    langkah:[
    'Potong ayam tipis melintang serat, tumis bawang merah dan putih sampai harum.',
    'Masukkan ayam, aduk, masak 5 menit sampai warnanya berubah dan matang.',
    'Tuang kecap manis, aduk rata, masak 2 menit lagi sampai bumbu menempel.',
    'Tumis wortel iris tipis 3 menit di wajan lain.',
    'Sajikan nasi porsi kecil dengan ayam kecap dan tumis wortel.'
    ] },

    { id:'malam-sayur-asem', nama:'Sayur Asem, Nasi Putih, dan Tempe Orek',
    slot:'malam', method:'rebus', tag:['karbo:nasi','protein:tempe'],
    bahan:[
    B('nasi_putih', 120, 'karbo', 'g'),
    B('tempe', 120, 'protein', 'g'),
    B('kacang_panjang', 100, 'sayur', 'g'),
    B('jagung_manis', 80, 'sayur', 'g'),
    B('labu_siam', 100, 'sayur', 'g', { alts:'timun' }),
    B('daun_salam', 1, 'bumbu', 'lembar', { scale: false }),
    B('asam_jawa', 5, 'bumbu', 'g', { scale: false, alts:'jeruk_nipis' }),
    GARAM(1.5), MERICA(0.3), MINYAK(5)
    ],
    langkah:[
    'Iris tempe, tumis dengan minyak dan garam sampai kecokelatan.',
    'Didihkan 600 ml air dengan daun salam. Masukkan kacang panjang dan jagung, rebus 6 menit.',
    'Tambahkan asam jawa yang sudah larut di sedikit air, labu siam, garam, dan lada.',
    'Masak 5 menit lagi sampai sayur empuk.',
    'Sajikan sayur asem dengan nasi putih dan tempe orek.'
    ] },

    { id:'malam-omelet-sayur', nama:'Omelet Sayur dan Nasi Putih Porsi Kecil',
    slot:'malam', method:'tumis', tag:['karbo:nasi','protein:telur'],
    bahan:[
    B('nasi_putih', 100, 'karbo', 'g'),
    B('telur_ayam', 2, 'protein', 'butir'),
    B('buncis', 100, 'sayur', 'g'),
    B('wortel', 60, 'sayur', 'g'),
    B('tomat', 80, 'sayur', 'g'),
    B('bawang_merah', 2, 'bumbu', 'siung', { scale: false }),
    B('bawang_putih', 1, 'bumbu', 'siung', { scale: false }),
    GARAM(1.2), MERICA(0.3), MINYAK(5)
    ],
    langkah:[
    'Iris buncis, wortel, dan tomat tipis, tumis dengan minyak 3 menit, tambahkan garam dan lada.',
    'Kocok telur dengan garam, tuang ke atas tumisan sayur.',
    'Masak api sedang 2 menit, lipat sekali, masak 30 detik lagi.',
    'Sajikan dengan nasi porsi kecil.'
    ] },

    /* SNACK */
    { id:'snack-yogurt-buah', nama:'Yogurt Plain dengan Mangga dan Semangka',
    slot:'snack', method:'', tag:['protein:susu'],
    bahan:[
    B('yogurt_plain', 1, 'protein', 'cup', { alts:'susu_sapi' }),
    B('mangga', 100, 'buah', 'g', { alts:'nanas' }),
    B('semangka', 100, 'buah', 'g', { alts:'pepaya' })
    ],
    langkah:[
    'Potong mangga dan semangka jadi dadu ukuran sedang.',
    'Tuang yogurt ke dalam gelas atau mangkuk.',
    'Susun potongan buah di atas yogurt, sajikan langsung tanpa gula tambahan.'
    ] },

    { id:'snack-kacang-buah', nama:'Kacang Panggang dan Apel',
    slot:'snack', method:'panggang', tag:['protein:kacang'],
    bahan:[
    B('kacang_kering', 30, 'protein', 'g', { alts:'kacang_hijau' }),
    B('apel', 1, 'buah', 'buah', { alts:'jeruk' })
    ],
    langkah:[
    'Panggang kacang di oven 150 derajat selama 15 menit, atau sangrai tanpa minyak di wajan.',
    'Tidak perlu garam. Kacang sudah mengandung lemak dan protein sendiri.',
    'Cuci apel dan potong jadi wedges, sajikan bersama.'
    ] },

    { id:'snack-pisang-kedelai', nama:'Pisang dan Susu Kedelai',
    slot:'snack', method:'', tag:['protein:kedelai'],
    bahan:[
    B('pisang', 1, 'buah', 'buah', { alts:'apel' }),
    B('susu_kedelai', 250, 'protein', 'ml', { alts:'susu_sapi' })
    ],
    langkah:[
    'Kupas dan iris pisang.',
    'Panaskan susu kedelai hingga hangat, jangan sampai mendidih.',
    'Sajikan bersama sebagai kombinasi karbohidrat dan protein.'
    ] },

    { id:'snack-telur-sayur', nama:'Telur Rebus, Tomat, dan Timun',
    slot:'snack', method:'rebus', tag:['protein:telur'],
    bahan:[
    B('telur_ayam', 2, 'protein', 'butir', { alts:'telur_bebek' }),
    B('tomat', 100, 'sayur', 'g'),
    B('timun', 80, 'sayur', 'g'),
    GARAM(0.5), MERICA(0.2)
    ],
    langkah:[
    'Rebus telur 10 menit sampai kuning matang penuh, lalu kupas.',
    'Potong tomat dan timun jadi dadu atau wedge.',
    'Taburi sedikit garam dan lada pada potongan tomat dan timun.',
    'Sajikan telur rebus sebagai sumber protein rendah lemak.'
    ] },

    { id:'snack-tahu-kerupuk', nama:'Tahu Goreng dan Kerupuk',
    slot:'snack', method:'goreng', tag:['protein:tahu'],
    bahan:[
    B('tahu_kuning', 100, 'protein', 'g', { alts:'tahu_putih' }),
    B('kerupuk', 30, 'karbo', 'g', { alts:'kerupuk_udang' })
    ],
    langkah:[
    'Goreng tahu sampai garing, atau panggang di wajan dengan sedikit minyak.',
    'Sajikan bersama kerupuk. Kerupuk perlu dijaga porsinya karena asin dan berminyak.'
    ] },

    { id:'snack-oat-kacang', nama:'Oatmeal Susu dengan Pisang',
    slot:'snack', method:'rebus', tag:['protein:kedelai'],
    bahan:[
    B('oatmeal', 40, 'karbo', 'g'),
    B('susu_kedelai', 200, 'protein', 'ml', { alts:'susu_sapi' }),
    B('pisang', 1, 'buah', 'buah', { scale: false }),
    B('gula_pasir', 5, 'bumbu', 'g', { scale: false, note:'Opsional, bisa dihilangkan' })
    ],
    langkah:[
    'Didihkan susu, masukkan oatmeal, aduk 4 menit sampai kental.',
    'Tambahkan gula bila perlu, atau pakai potongan pisang sebagai pemanis alami.',
    'Sajikan selagi hangat.'
    ] },

    { id:'snack-anggur-keju', nama:'Keju, Anggur, dan Kacang Kering',
    slot:'snack', method:'', tag:['protein:keju'],
    bahan:[
    B('keju', 25, 'protein', 'g', { alts:'edamame' }),
    B('anggur', 5, 'buah', 'buah', { alts:'semangka' }),
    B('kacang_kering', 20, 'protein', 'g', { alts:'kacang_hijau' })
    ],
    langkah:[
    'Potong keju jadi dadu dan anggur jadi dua bagian.',
    'Sangrai kacang tanpa minyak sampai harum.',
    'Sajikan ketiganya bersama sebagai kombinasi protein, lemak, dan karbohidrat.'
    ] },

    /* MINUMAN */
    { id:'minum-air', nama:'Air Putih',
    slot:'minuman', method:'', tag:['minum:air'],
    bahan:[ B('air', 2000, 'minuman', 'ml', { scale: false,
    note:'Target harian 30 ml per kg berat badan, sampai 35 ml kalau aktif' }) ],
    langkah:[
    'Minum air secara merata sepanjang hari, bukan sekaligus 2 liter.',
    'Target harian mengikuti berat badan: 30 ml/kg untuk aktivitas ringan, 35 ml/kg untuk yang aktif.'
    ] },

    { id:'minum-teh', nama:'Teh Tanpa Gula',
    slot:'minuman', method:'', tag:['minum:teh'],
    bahan:[
    B('teh', 5, 'minuman', 'g', { scale: false, note:'Daun teh' }),
    B('air', 2000, 'minuman', 'ml', { scale: false })
    ],
    langkah:[
    'Seduh teh dengan air panas sekitar 90 derajat, diamkan 3 sampai 5 menit.',
    'Tanpa gula. Kalau ingin lebih segar, tambahkan irisan lemon.',
    'Tetap lengkapi dengan air putih, teh saja tidak cukup untuk hidrasi harian.'
    ] },

    { id:'minum-susu', nama:'Susu UHT',
    slot:'minuman', method:'', tag:['minum:susu'],
    bahan:[ B('susu_sapi', 200, 'minuman', 'ml', { alts:'susu_kedelai' }) ],
    langkah:[
    'Panaskan susu di panci atau microwave sampai hangat, jangan sampai mendidih.',
    'Susu bisa ditambahkan ke teh atau kopi sebagai pengganti gula susu.'
    ] },

    { id:'minum-susu-kedelai', nama:'Susu Kedelai',
    slot:'minuman', method:'', tag:['minum:kedelai'],
    bahan:[ B('susu_kedelai', 250, 'minuman', 'ml', { alts:'susu_sapi' }) ],
    langkah:[
    'Panaskan susu kedelai hingga hangat dan mulai berbusa.',
    'Cocok untuk diet nabati dan rendah kalori.'
    ] },

    { id:'minum-yogurt', nama:'Yogurt Minuman',
    slot:'minuman', method:'', tag:['minum:susu'],
    bahan:[ B('yogurt_plain', 1, 'minuman', 'cup', { alts:'susu_sapi' }) ],
    langkah:[
    'Aduk yogurt sampai rata, bisa encer dengan air dingin.',
    'Simpan di kulkas setelah dibuka.'
    ] },

    { id:'minum-jus-alpukat', nama:'Jus Alpukat Susu',
    slot:'minuman', method:'', tag:['minum:buah'],
    bahan:[
    B('alpukat', 100, 'buah', 'g'),
    B('susu_sapi', 150, 'minuman', 'ml', { alts:'susu_kedelai' })
    ],
    langkah:[
    'Keruk setengah alpukat dan buang bijinya.',
    'Blender bersama susu sampai halus.',
    'Minum langsung, tidak perlu gula tambahan.'
    ] },

    { id:'minum-air-jeruk', nama:'Air Jeruk Peras',
    slot:'minuman', method:'', tag:['minum:buah'],
    bahan:[
    B('jeruk', 2, 'buah', 'buah', { alts:'apel' }),
    B('air', 300, 'minuman', 'ml', { scale: false })
    ],
    langkah:[
    'Peras jeruk, buih yang muncul di permukaan dibuang agar tidak pahit.',
    'Campur dengan air dingin, tanpa gula tambahan.'
    ] },
    ];

    

    const KEYWORD_TO_IDS = {
    'ayam': ['dada_ayam','paha_ayam','ayam_kampung'],
    'telur': ['telur_ayam','telur_bebek'],
    'ikan': ['ikan_tongkol','ikan_lele','ikan_nila','ikan_kembung'],
    'tempe': ['tempe','tempe_mendoan'],
    'tahu': ['tahu_putih','tahu_kuning'],
    'nasi': ['nasi_putih','nasi_merah','beras_putih','beras_merah'],
    'mie instan': ['mie_instan','bihun'],
    'susu': ['susu_sapi','yogurt_plain','keju'],
    'gula': ['gula_pasir','gula_merah','madu'],
    'minyak': ['minyak_goreng','minyak_sawit','minyak_kelapa'],
    'santan': ['santan_kelapa','santan_kental'],
    'keju': ['keju'],
    'kacang': ['kacang_kering','kacang_merah','kacang_hijau','edamame'],
    'gorengan': []
    };

    const OIL_HEAVY_METHODS = ['goreng','tumis','panggang'];

    const SLOT_ORDER = ['pagi','siang','snack','malam','minuman'];

    function recipesForSlot(slotKey){
    return RECIPES.filter(function(r){ return r.slot===slotKey; });
    }

    function findRecipe(id){
    for(const r of RECIPES){ if(r.id===id) return r; }
    return null;
    }

    window.RESEP = {
    RECIPES, KEYWORD_TO_IDS, OIL_HEAVY_METHODS, SLOT_ORDER,
    recipesForSlot, findRecipe
    };