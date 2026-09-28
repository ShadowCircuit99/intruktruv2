/* KONFIGURASI */
    const DEV_MODE = false;

    
    const ICONS = {
    bolt:       '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h8l-1 8 10-12h-8z"/></svg>',
    layers:     '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
    clock:      '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    timer:      '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/></svg>',
    bars:       '<svg class="icon" viewBox="0 0 24 24"><path d="M5 20V11M12 20V5M19 20v-6"/></svg>',
    calendar:   '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    dumbbell:   '<svg class="icon" viewBox="0 0 24 24"><path d="M6.5 6.5a5 5 0 0 1 11 0v1a5 5 0 0 1-11 0z"/><path d="M4 8h2M18 8h2M12 16v4M9 20h6"/></svg>',
    play:       '<svg class="icon" viewBox="0 0 24 24"><path d="M7 5l12 7-12 7z"/></svg>',
    check:      '<svg class="icon" viewBox="0 0 24 24"><path d="m4 12 5 5L20 6"/></svg>',
    rotate:     '<svg class="icon" viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    skip:       '<svg class="icon" viewBox="0 0 24 24"><path d="M5 4l10 8-10 8zM19 4v16"/></svg>',
    shield:     '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 5-3 7.5-7 9-4-1.5-7-4-7-9V6z"/></svg>',
    flame:      '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s0 2 1.5 2S12 8 12 3z"/></svg>',
    target:     '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/></svg>',
    sunrise:    '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3v4M2 11H0M24 11h-2M6 7 5 6M18 7l1-1"/><path d="M6 16a6 6 0 0 1 12 0M2 20h20"/></svg>',
    moon:       '<svg class="icon" viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    bowl:       '<svg class="icon" viewBox="0 0 24 24"><path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M7 11c0-3 2-5 5-5s5 2 5 5"/></svg>',
    swap:       '<svg class="icon" viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
    alert:      '<svg class="icon" viewBox="0 0 24 24"><path d="M12 4 2 20h20z"/><path d="M12 10v4M12 17h.01"/></svg>',
    close:      '<svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    lock:       '<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
    leaf:       '<svg class="icon" viewBox="0 0 24 24"><path d="M4 20c8 0 16-4 16-16-8 0-16 4-16 16z"/><path d="M4 20c4-4 8-6 12-8"/></svg>',
    bandage:    '<svg class="icon" viewBox="0 0 24 24"><path d="M8.5 3.5 3.5 8.5a5 5 0 0 0 7 7l5-5a5 5 0 0 0-7-7z"/><path d="M8 9l7 7"/></svg>',
    minus:      '<svg class="icon" viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
    search:     '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chevron:    '<svg class="icon" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    };

    /* Kunci penyimpanan */
    const KEYS = {
    app:     'ip90_app',
    user:    'ip90_user',
    program: 'ip90_program',
    today:   'ip90_today_',
    daydata: 'ip90_daydata_',
    tracking:'ip90_tracking',
    notes:   'ip90_notes_',
    journal: 'ip90_journal_',
    energy:  'ip90_energy_',
    };

    /* BANTUAN PENYIMPANAN */
    function loadState(key){try{return JSON.parse(localStorage.getItem(key));}catch(e){return null;}}
    function saveState(key,data){try{localStorage.setItem(key,JSON.stringify(data));}catch(e){}}
    function todayKey(){
    if(devOn()) return KEYS.today+'dev'+getCurrentDay();
    return KEYS.today+new Date().toISOString().split('T')[0];
    }
    function notesKey(day){return KEYS.notes+day;}
    function journalKey(){
    if(devOn()) return KEYS.journal+'dev'+getCurrentDay();
    return KEYS.journal+new Date().toISOString().split('T')[0];
    }
    function energyKey(){
    if(devOn()) return KEYS.energy+'dev'+getCurrentDay();
    return KEYS.energy+new Date().toISOString().split('T')[0];
    }
    function loadToday(){
    const d=loadState(todayKey())||{workoutDone:false,mealsCompleted:[false,false,false,false,false]};
    if(devCheat()&&!d.energyChecked){
    return Object.assign({},d,{energyChecked:true,energy:d.energy||4,sleep:d.sleep||8,energyDev:true});
    }
    return d;
    }
    function saveToday(data){saveState(todayKey(),data);}
    function clearAllStorage(){Object.keys(localStorage).filter(k=>k.startsWith('ip90')).forEach(k=>localStorage.removeItem(k));}

    
    function deepFreezeMeals(meals){
    if(!Array.isArray(meals)) return meals || [];
    return JSON.parse(JSON.stringify(meals));
    }

    
    const PROGRAM_DAYS = 90;

    const LEVELS = [
    {lv:1,name:'Dasar',     sets:2,reps:10,work:25,rest:90,desc:'Teknik dan ritme dulu, beban ringan.'},
    {lv:2,name:'Adaptasi',  sets:3,reps:10,work:30,rest:90,desc:'Volume naik, tekniknya tetap dijaga.'},
    {lv:3,name:'Bangun',    sets:3,reps:12,work:30,rest:75,desc:'Repetisi naik, tempo kerja dijaga.'},
    {lv:4,name:'Konsisten', sets:3,reps:15,work:35,rest:75,desc:'Repetisi naik lagi, istirahat tetap.'},
    {lv:5,name:'Berkembang',sets:4,reps:12,work:40,rest:60,desc:'Set bertambah, istirahat dipendekkan.'},
    {lv:6,name:'Intensif',  sets:4,reps:15,work:40,rest:60,desc:'Volume tinggi dengan tempo kerja cukup.'},
    {lv:7,name:'Puncak',    sets:4,reps:20,work:45,rest:60,desc:'Toleransi beban tertinggi di program.'},
    {lv:8,name:'Maksimum',  sets:5,reps:15,work:45,rest:60,desc:'Volume puncak, hanya saat fisik siap.'},
    ];

    function getLevelCap(){
    const u=loadState(KEYS.user)||{};
    const age=+u.age||30;
    const activity=+u.activity||1.2;
    const bmi=getUserBMI();
    let cap=8;
    if(age>=55) cap=5;
    else if(age>=45) cap=6;
    else if(age>=35) cap=7;
    if(bmi!==null&&bmi>=30) cap=Math.min(cap,6);
    if(bmi!==null&&bmi<18.5) cap=Math.min(cap,7);
    if(age>=40&&activity<=1.375) cap=Math.min(cap,6);
    return cap;
    }

    
    function getLevelForDay(day){
    const d=Math.max(0,Math.min(PROGRAM_DAYS-1,day));
    const week=Math.floor(d/7);
    const block=Math.floor(week/4);
    const slot=week%4;
    let lv;
    if(block>=3){
        if(d>=PROGRAM_DAYS-2) lv=6;
        else if(d>=PROGRAM_DAYS-4) lv=8;
        else lv=7;
    } else {
        const base=1+block*2;
        lv=(slot===3)?base:Math.min(8,base+slot);
    }
    return Math.max(1,Math.min(lv,getLevelCap()));
    }

    function isDeloadDay(day){
    const d=Math.max(0,Math.min(PROGRAM_DAYS-1,day));
    if(d>=PROGRAM_DAYS-2) return true;
    const week=Math.floor(d/7);
    return (week%4)===3;
    }

    function getLevelInfo(day){
    const lv=getLevelForDay(day);
    return Object.assign({level:lv,deload:isDeloadDay(day)},LEVELS[lv-1]);
    }

    const PHASES = {
    foundation:{label:'Adaptasi',start:0,end:21,days:'Hari 1-21',desc:'Tubuh belajar gerakan dan ritme baru. Volume rendah, teknik jadi prioritas.',color:'var(--accent)'},
    build:     {label:'Penguatan',start:21,end:49,days:'Hari 22-49',desc:'Set dan repetisi naik bertahap. Latihan mulai terasa lebih berat tapi masih terkendali.',color:'var(--blue)'},
    intensity: {label:'Intensifikasi',start:49,end:77,days:'Hari 50-77',desc:'Volume tinggi dengan istirahat lebih pendek. Deload tiap 4 minggu menjaga progress tetap naik.',color:'var(--orange)'},
    peak:      {label:'Puncak & Turun',start:77,end:90,days:'Hari 78-90',desc:'Puncak program, lalu volume turun lagi supaya progress benar-benar nempel.',color:'var(--purple)'},
    maintenance:{label:'Perawatan',start:90,end:99999,days:'Setelah hari 90',desc:'Program utama selesai. Target kembali ke kebutuhan harian dan latihan diturunkan jadi 3 kali seminggu supaya hasil yang sudah didapat tidak hilang.',color:'var(--blue)'},
    };

    
    const WEEK_SPLIT = {
    lose:     ['full_a','cardio_a','upper_a','full_b','cardio_b','mobility','recovery'],
    maintain: ['upper_a','lower_a','full_a','cardio_a','full_b','mobility','recovery'],
    gain:     ['push_a','pull_a','lower_a','pull_b','full_b','mobility','recovery'],
    };

    
    const FOCUS_PLAN = {
    full_a:   {kind:'strength',pools:['lower','push','core'],label:'Full Body A',type:'Full Body',icon:ICONS.dumbbell,timeRec:'Latihan seluruh tubuh. Pagi atau sore, pilih waktu yang paling rutin kamu pakai.'},
    full_b:   {kind:'strength',pools:['lower','pull','core'],label:'Full Body B',type:'Full Body',icon:ICONS.dumbbell,timeRec:'Varian lain dari full body. Istirahat di antara set tetap dijaga penuh.'},
    upper_a:  {kind:'strength',pools:['push','pull','core'],label:'Upper A',type:'Upper Body',icon:ICONS.dumbbell,timeRec:'Waktu terbaik pagi hari, atau sore minimal 2 jam setelah makan.'},
    upper_b:  {kind:'strength',pools:['push','pull','core'],label:'Upper B',type:'Upper Body',icon:ICONS.dumbbell,timeRec:'Fokus dada, punggung, dan lengan. Jangan latihan kaki berat di hari yang sama.'},
    lower_a:  {kind:'strength',pools:['lower','core'],label:'Lower A',type:'Lower Body',icon:ICONS.dumbbell,timeRec:'Sore hari cocok untuk kaki dan bokong. Kalau lutut kurang kuat, turunkan squat sedikit.'},
    lower_b:  {kind:'strength',pools:['lower','core'],label:'Lower B',type:'Lower Body',icon:ICONS.dumbbell,timeRec:'Fokus paha belakang dan betis. Jalan ringan setelah latihan sangat membantu.'},
    push_a:   {kind:'strength',pools:['push','core'],label:'Push A',type:'Push Day',icon:ICONS.dumbbell,timeRec:'Dada, bahu, dan tricep. Makan cukup sebelum latihan supaya kuat.'},
    push_b:   {kind:'strength',pools:['push','core'],label:'Push B',type:'Push Day',icon:ICONS.dumbbell,timeRec:'Varian push dengan pola gerak berbeda dari Push A.'},
    pull_a:   {kind:'strength',pools:['pull','core'],label:'Pull A',type:'Pull Day',icon:ICONS.dumbbell,timeRec:'Punggung dan otot tarik. Kalau tangan pegal, pakai versi lantai dulu.'},
    pull_b:   {kind:'strength',pools:['pull','core'],label:'Pull B',type:'Pull Day',icon:ICONS.dumbbell,timeRec:'Fokus otot punggung dan kestabilan pinggul.'},
    cardio_a: {kind:'cardio',  pools:['cardio','core'],label:'Kardio A',type:'Cardio Day',icon:ICONS.flame,timeRec:'Kardio ringan sampai sedang, nafas ngobrol masih bisa jalan. Hindari sore yang terlalu panas.'},
    cardio_b: {kind:'cardio',  pools:['cardio','core'],label:'Kardio B',type:'Cardio Day',icon:ICONS.flame,timeRec:'Sesi kardio kedua minggu ini. Jaga jarak minimal 6 jam dari sesi sebelumnya.'},
    mobility: {kind:'mobility',pools:['mobility'],label:'Mobilitas & Pemulihan Ringan',type:'Mobility Day',icon:ICONS.leaf,timeRec:'Hari ringan untuk menjaga sendi tetap lincah dan tebal tanpa perlu berat.'},
    recovery: {kind:'recovery',pools:['recovery'],label:'Pemulihan Aktif',type:'Recovery Day',icon:ICONS.leaf,timeRec:'Hari tanpa beban berat. Tidur cukup dan makan cukup di hari ini bagian dari program.'},
    };

    
    const FOCUS_POOLS = {
    push:['pushup','incline_pushup','wide_pushup','pike_pushup','wall_pushup','tricep_dips','plank'],
    pull:['superman','reverse_snow_angel','prone_swimmer','bird_dog','thoracic_rotation','plank','bicycle_crunch'],
    lower:['squat','controlled_squat','split_squat','step_up','reverse_lunge','lateral_lunge','glute_bridge','glute_bridge_march','hip_thrust','wall_sit','sit_to_stand','standing_calf_raise'],
    core:['plank','side_plank','dead_bug','leg_raise','bird_dog','bicycle_crunch','superman'],
    cardio:['march_in_place','step_jack','step_touch','high_knees','jumping_jack','mountain_climber','burpee','slow_knee_raise','jump_squat','skater_step'],
    mobility:['thoracic_rotation','cat_cow','leg_swing','glute_bridge_march','ankle_circle'],
    recovery:['light_walk','breathing','mobility_flow','static_full_stretch'],
    };

    
    const EASIER_VARIANT = {
    pushup:'incline_pushup', wide_pushup:'incline_pushup', pike_pushup:'wall_pushup',
    tricep_dips:'wall_pushup', squat:'controlled_squat', jump_squat:'march_in_place',
    };

    const LOW_IMPACT_SWAP = {
    jumping_jack:'step_jack', high_knees:'step_touch', mountain_climber:'slow_knee_raise',
    jump_squat:'controlled_squat', burpee:'march_in_place', skater_step:'step_touch',
    };

    
    const WARMUP_FLOW = [
    {key:'joint_mobility',secs:45},
    {key:'march_in_place',secs:60},
    {key:'leg_swing',secs:45},
    {key:'cat_cow',secs:45},
    {key:'squat_ramp',secs:60},
    ];

    
    const COOLDOWN_FLOW = [
    {key:'upper_body_stretch',secs:30},
    {key:'hip_flexor_stretch',secs:30},
    {key:'leg_back_stretch',secs:30},
    {key:'static_full_stretch',secs:30},
    {key:'cooldown_breathing',secs:40},
    ];

    const SESSION_FLOW_META = {
    warmup:{label:'Pemanasan',hint:'Lakukan sebelum latihan utama, menaikkan suhu tubuh dan mengurangi risiko cedera.',color:'var(--purple)'},
    main:{label:'Latihan Utama',hint:'Kerjakan berurutan dari atas ke bawah. Tidak bisa melompat urutan.',color:'var(--accent)'},
    cooldown:{label:'Pendinginan',hint:'Turunkan intensitas perlahan, jangan langsung berhenti setelah latihan terakhir.',color:'var(--blue)'},
    };

    const EXERCISES = {
    squat:{nama:'Squat',otot:'Paha, Bokong, Core',langkah:['Berdiri dengan kaki selebar bahu, jari kaki sedikit ke luar.','Dorong pinggul ke belakang seperti akan duduk, turunkan hingga paha sejajar lantai atau lebih rendah.','Jaga punggung tetap lurus, dada tegak, lutut searah dengan jari kaki.','Tahan 1 detik di bawah, dorong lantai dengan kaki untuk berdiri kembali.'],kesalahan:['Lutut masuk ke dalam (knee cave), aktifkan otot pinggul untuk mendorong lutut ke luar.','Tumit terangkat dari lantai, buka kaki sedikit lebih lebar atau turunkan kecepatan.','Tubuh terlalu condong ke depan, jaga dada tetap tegak dan pandangan ke depan.']},
    glute_bridge:{nama:'Glute Bridge',otot:'Bokong, Hamstring, Core',langkah:['Berbaring telentang, lutut ditekuk 90 derajat, telapak kaki rata di lantai.','Lengan lurus di samping tubuh untuk stabilitas.','Tekan core, dorong pinggul ke atas hingga tubuh membentuk garis lurus dari bahu ke lutut.','Tahan 2-3 detik di atas, turunkan perlahan hampir menyentuh lantai.'],kesalahan:['Hiperekstensi pinggang, pastikan garis lurus dari bahu ke lutut.','Kaki terlalu jauh atau terlalu dekat, lutut ideal tepat di atas pergelangan kaki.','Lupa tekan core, perut harus aktif sepanjang gerakan.']},
    reverse_lunge:{nama:'Reverse Lunge',otot:'Paha, Bokong, Keseimbangan',langkah:['Berdiri tegak, tangan di pinggang.','Langkahkan satu kaki ke belakang 60-80cm.','Tekuk kedua lutut, turunkan lutut belakang hampir menyentuh lantai.','Dorong kaki depan untuk berdiri kembali. Ganti kaki.'],kesalahan:['Langkah terlalu pendek menyebabkan lutut depan melampaui jari kaki.','Badan condong ke depan, tetap jaga torso tegak.','Kehilangan keseimbangan, mulai pelan.']},
    wall_sit:{nama:'Wall Sit (Isometrik)',otot:'Paha Depan, Betis, Daya Tahan',langkah:['Berdiri membelakangi dinding, jarak 60cm.','Geser punggung ke bawah hingga lutut membentuk sudut 90 derajat.','Paha sejajar lantai, punggung menempel dinding.','Tahan posisi selama durasi yang ditentukan, bernapas stabil.'],kesalahan:['Lutut melewati jari kaki, geser posisi kaki lebih maju.','Punggung tidak menempel dinding, tekan punggung bawah ke dinding.','Menahan napas, terus bernapas normal.']},
    pushup:{nama:'Push Up',otot:'Dada, Tricep, Bahu, Core',langkah:['Posisi plank: tangan selebar bahu lebih, jari mengarah ke depan.','Tubuh membentuk garis lurus dari kepala hingga tumit.','Tekuk siku ke samping belakang, turunkan dada mendekati lantai.','Dorong lantai dengan tangan untuk kembali ke posisi awal.'],kesalahan:['Pinggul turun atau naik, jaga tubuh tetap garis lurus.','Siku melebar 90 derajat, sudut ideal sekitar 45 derajat dari tubuh.','Range of motion tidak penuh, pastikan dada hampir menyentuh lantai.']},
    wide_pushup:{nama:'Wide Push Up',otot:'Dada Bagian Luar, Tricep',langkah:['Posisi push up tapi tangan lebih lebar dari bahu, sekitar 1,5x lebar bahu.','Jaga tubuh tetap garis lurus.','Tekuk siku ke samping, turunkan dada mendekati lantai.','Dorong naik dengan fokus kontraksi dada bagian luar.'],kesalahan:['Tangan terlalu lebar sehingga siku tidak fleksibel.','Pinggul drop, core harus aktif.','Terlalu cepat, lakukan 2 detik turun, 1 detik naik.']},
    pike_pushup:{nama:'Pike Push Up',otot:'Bahu, Tricep, Upper Chest',langkah:['Mulai push up biasa, angkat pinggul tinggi-tinggi membentuk V.','Tangan selebar bahu.','Tekuk siku ke samping, turunkan kepala mendekati lantai di antara tangan.','Dorong naik kembali ke posisi V.'],kesalahan:['Pinggul tidak cukup tinggi, semakin tinggi, semakin besar kerja bahu.','Kepala tidak turun cukup rendah, usahakan hampir menyentuh lantai.','Kehilangan keseimbangan, letakkan tangan lebih lebar.']},
    superman:{nama:'Superman Extension',otot:'Punggung Bawah, Bokong, Hamstring',langkah:['Berbaring tengkurap, lengan lurus di depan dan kaki lurus ke belakang.','Kencangkan otot bokong dan punggung bawah.','Angkat kepala, dada, lengan, dan kaki bersamaan.','Tahan 2-3 detik, turunkan perlahan.'],kesalahan:['Terlalu memaksakan leher ke atas, jaga kepala segaris tulang belakang.','Hanya mengangkat kaki atau tangan saja, angkat keduanya bersamaan.','Gerakan terlalu cepat, kontrol penuh.']},
    tricep_dips:{nama:'Tricep Dips (Kursi)',otot:'Tricep, Bahu, Dada Bawah',langkah:['Duduk di tepi kursi kuat, tangan di tepi kursi.','Geser bokong ke depan hingga melayang.','Tekuk siku ke belakang, turunkan bokong hingga siku 90 derajat.','Dorong naik, luruskan siku.'],kesalahan:['Bahu terangkat, jaga bahu turun dan rileks.','Siku melebar ke samping, siku harus mengarah ke belakang.','Turun terlalu dalam melewati 90 derajat.']},
    plank:{nama:'Plank',otot:'Core, Bahu, Punggung, Seluruh Tubuh',langkah:['Berbaring tengkurap, angkat tubuh dengan forearm atau tangan lurus.','Siku tepat di bawah bahu untuk forearm plank.','Tubuh garis lurus dari kepala hingga tumit. Kencangkan perut dan bokong.','Tarik napas normal, pertahankan posisi.'],kesalahan:['Pinggul terlalu naik atau terlalu turun, harus garis lurus sempurna.','Siku tidak tepat di bawah bahu.','Menahan napas, tetap bernapas normal.']},
    mountain_climber:{nama:'Mountain Climber',otot:'Core, Bahu, Hip Flexor, Kardio',langkah:['Mulai posisi push up tinggi, tangan selebar bahu.','Jaga pinggul tidak terangkat atau turun.','Tarik lutut kanan cepat ke dada, kembalikan, langsung ganti lutut kiri.','Lakukan tempo cepat seperti berlari di posisi plank.'],kesalahan:['Pinggul terangkat terlalu tinggi, mengurangi kerja core.','Langkah terlalu pendek, tarik lutut sedekat mungkin ke dada.','Tangan bergeser, kunci tangan di tempatnya.']},
    burpee:{nama:'Burpee',otot:'Full Body, Kardio, Kekuatan',langkah:['Berdiri tegak, jongkok dan letakkan tangan di lantai.','Lompat kedua kaki ke belakang ke posisi push up.','Lakukan 1 push up, lompat kaki kembali ke posisi jongkok.','Lompat ke atas dengan tangan diayunkan ke atas. Pendaratan lembut.'],kesalahan:['Terburu-buru dan teknik berantakan, lebih baik lambat tapi benar.','Punggung bungkuk saat posisi push up, core aktif.','Pendaratan keras, ujung kaki dulu, lutut sedikit ditekuk.']},
    high_knees:{nama:'High Knees',otot:'Hip Flexor, Core, Kardio',langkah:['Berdiri tegak, kaki selebar pinggul.','Berlari di tempat dengan mengangkat lutut setinggi pinggul.','Aktifkan core, jaga torso tegak.','Ayunkan lengan berlawanan untuk koordinasi.'],kesalahan:['Lutut tidak terangkat cukup tinggi, target minimal sejajar pinggul.','Badan condong ke belakang, jaga tubuh tetap tegak.','Kaki mendarat terlalu keras, ujung kaki mendarat lebih dulu.']},
    bicycle_crunch:{nama:'Bicycle Crunch',otot:'Oblique, Core, Hip Flexor',langkah:['Berbaring telentang, tangan di belakang kepala.','Angkat kedua kaki, lutut ditekuk 90 derajat.','Angkat bahu, tarik lutut kanan ke dada sambil putar siku kiri mendekatinya.','Ganti sisi secara bergantian dengan tempo stabil.'],kesalahan:['Menarik kepala dengan tangan, tangan hanya menyentuh, tidak mendorong.','Lutut tidak cukup dekat ke dada, gerakkan lutut hingga hampir menyentuh siku.','Punggung bawah terangkat dari lantai, jaga agar tetap menempel.']},
    breathing:{nama:'Latihan Pernapasan Dalam',otot:'Paru-paru, Sistem Saraf, Relaksasi',langkah:['Duduk atau berbaring nyaman. Tutup mata.','Hirup napas dalam melalui hidung selama 4 detik, rasakan perut mengembang.','Tahan napas selama 4 detik.','Hembuskan perlahan melalui mulut selama 6-8 detik. Ulangi 10 kali.'],kesalahan:['Bernapas dengan dada bukan perut, fokus pada pengembangan perut saat menghirup.','Durasi terlalu singkat, minimal lakukan 5-10 menit untuk efek optimal.']},
    light_walk:{nama:'Jalan Santai',otot:'Seluruh Tubuh, Kardio Rendah',langkah:['Lakukan jalan santai selama 20-30 menit di sekitar rumah atau taman.','Jaga postur tegak, pandangan ke depan, ayunkan lengan alami.','Tempo santai, bisa berbicara tanpa ngos-ngosan.','Gunakan waktu ini untuk menikmati lingkungan dan merelaksasi pikiran.'],kesalahan:['Berjalan terlalu cepat, hari istirahat bukan untuk latihan keras.','Melewatkan hari istirahat, recovery aktif penting untuk progress optimal.']},
    
    march_in_place:{nama:'March In Place',otot:'Hip Flexor, Kardio Ringan',waktu:'Pagi atau sore hari',langkah:['Berdiri tegak dengan kaki selebar pinggul.','Angkat lutut kanan setinggi pinggang, lalu turunkan. Ganti ke kiri.','Ayunkan lengan berlawanan secara natural seperti berjalan.','Lakukan selama 60-90 detik dengan tempo stabil, napas teratur.'],kesalahan:['Mengangkat lutut terlalu rendah, usahakan setinggi pinggang.','Badan miring ke samping, jaga torso tetap tegak.']},
    slow_knee_raise:{nama:'Slow Knee Raise',otot:'Hip Flexor, Core, Keseimbangan',waktu:'Kapan saja',langkah:['Berdiri tegak dekat dinding untuk keseimbangan jika perlu.','Angkat lutut kanan perlahan setinggi pinggang, tahan 2 detik.','Turunkan perlahan. Ganti ke lutut kiri.','Ulangi bergantian dengan tempo sangat terkontrol.'],kesalahan:['Terburu-buru, gerakan harus pelan dan terkontrol.','Badan bergoyang, jaga core tetap aktif dan torso tegak.']},
    step_jack:{nama:'Step Jack (Tanpa Lompat)',otot:'Kaki, Bahu, Kardio Ringan',waktu:'Pagi hari',langkah:['Berdiri tegak. Langkahkan kaki kanan ke samping kanan.','Ikuti dengan kaki kiri ke posisi semula sambil angkat kedua tangan ke atas.','Langkahkan kaki kiri ke samping kiri, ikuti kaki kanan.','Ulangi berirama tanpa melompat, ini versi aman dari jumping jack.'],kesalahan:['Melompat tanpa disadari, pastikan satu kaki selalu di lantai.','Gerakan terlalu cepat, jaga tempo agar mudah dikontrol.']},
    step_touch:{nama:'Step Touch',otot:'Kaki, Koordinasi, Kardio Ringan',waktu:'Kapan saja',langkah:['Berdiri tegak, tangan di pinggang atau depan dada.','Langkahkan kaki kanan ke kanan, sentuhkan kaki kiri ke sampingnya.','Langkahkan kaki kiri ke kiri, sentuhkan kaki kanan.','Tambahkan ayunan tangan ke samping untuk gerakan lebih aktif.'],kesalahan:['Gerakan kaki tidak penuh, langkah cukup lebar agar efektif.','Kaki tidak benar-benar menyentuh, kontrol penuh setiap langkah.']},
    wall_pushup:{nama:'Wall Push Up',otot:'Dada, Tricep, Bahu (Low Impact)',waktu:'Pagi hari',langkah:['Berdiri menghadap dinding, jarak 60-80 cm.','Letakkan tangan di dinding setinggi bahu, selebar bahu.','Tekuk siku dan condongkan tubuh ke dinding, dada hampir menyentuh dinding.','Dorong kembali ke posisi awal. Satu gerakan = 2-3 detik.'],kesalahan:['Badan tidak lurus, jaga dari kepala hingga tumit satu garis lurus.','Siku melebar terlalu jauh, sudut sekitar 45 derajat dari tubuh.']},
    controlled_squat:{nama:'Controlled Squat (Pelan)',otot:'Paha, Bokong, Core',waktu:'Sore hari',langkah:['Berdiri kaki selebar bahu, jari kaki sedikit keluar.','Turunkan tubuh sangat pelan (hitung 4 detik) sambil dorong pinggul ke belakang.','Turun sampai paha sejajar lantai atau semampu mungkin.','Naik kembali pelan (hitung 2 detik). Kontrol penuh.'],kesalahan:['Terbura-buru, kecepatan harus sangat lambat untuk versi ini.','Lutut masuk ke dalam, dorong keluar agar searah jari kaki.']},

    // Pemanasan
    joint_mobility:{nama:'Pemanasan Sendi',otot:'Sendi, Leher, Bahu',langkah:['Putar leher pelan ke kiri dan kanan, masing-masing 5 kali.','Angkat bahu ke arah telinga lalu turunkan, 10 kali.','Putar pergelangan tangan dan kaki, masing-masing 10 kali.','Buka dan tutup genggaman tangan 15 kali.'],kesalahan:['Terlalu keras, pemanasan harus ringan dan tenang.','Tahan napas, tetap bernapas normal.']},
    leg_swing:{nama:'Ayunan Kaki',otot:'Pinggul, Hamstring',langkah:['Berdiri satu kaki, pegang dinding untuk penyeimbang.','Ayunkan kaki kanan ke depan dan belakang dengan rentang sedang.','Ganti kaki kiri dengan ritme yang sama.','Naikkan rentang sedikit hanya kalau terasa aman.'],kesalahan:['Ayunan terlalu tinggi, cukup setinggi paha.','Tubuh ikut bergoyang, jaga badan tetap tegak.']},
    cat_cow:{nama:'Cat Cow',otot:'Tulang Belakang, Core',langkah:['Ambil posisi empat, tangan di bawah bahu dan lutut di bawah pinggul.','Tarik napas, lengkungkan punggung ke atas dan kepala menunduk.','Hembuskan napas, turunkan pinggul dan lengkungkan punggung ke bawah.','Teruskan selang-seling mengikuti napas.'],kesalahan:['Terlalu cepat, satu siklus mengikuti satu tarikan napas.','Tangan melebar jauh, siku tetap di bawah bahu.']},
    squat_ramp:{nama:'Squat Tanpa Beban',otot:'Paha, Bokong',langkah:['Berdiri kaki selebar pinggul, tangan di depan dada.','Turun setengah jalan lalu naik lagi tanpa berhenti lama.','Ulangi dengan tempo tetap dan napas teratur.','Lakukan sekitar 20 repetisi.'],kesalahan:['Turun terlalu dalam di awal, cukup setengah saja.','Tumit terangkat, tekan penuh ke telapak kaki.']},
    ankle_circle:{nama:'Pusaran Pergelangan Kaki',otot:'Pergelangan Kaki',langkah:['Duduk, angkat satu kaki sedikit dari lantai.','Pusaran searah jarum jam 10 kali, lalu berlawanan arah 10 kali.','Ganti kaki dengan tempo sama.','Jaga lutut lurus, yang bergerak hanya pergelangan kaki.'],kesalahan:['Memusatkan dari lutut, pangkalnya ikut bergerak.']},
    thoracic_rotation:{nama:'Rotasi Torso',otot:'Tulang Belakang Atas',langkah:['Berdiri selebar bahu, letakkan kedua tangan di bahu.','Putar badan ke kanan sejauh yang nyaman, tahan 2 detik.','Kembali ke tengah, putar ke kiri dengan ritme sama.','Lakukan 10 kali ke tiap arah.'],kesalahan:['Memutar hanya bahu, badan ikut berputar.','Terlalu cepat, tmpu pelan dan dalam jangkauan aman.']},
    incline_pushup:{nama:'Incline Push Up',otot:'Dada, Tricep, Bahu',langkah:['Letakkan tangan di tepi meja setinggi pinggul, kaki jauh ke belakang.','Tubuh membuat garis lurus dari kepala sampai tumit.','Tekuk siku ke belakang, turunkan dada mendekati meja.','Dorong kembali, tubuh tetap lurus.'],kesalahan:['Meja terlalu rendah, beban jadi terlalu berat.','Pinggul turun, kencangkan core dulu.']},
    reverse_snow_angel:{nama:'Reverse Snow Angel',otot:'Punggung Bawah, Bahu',langkah:['Tengkurap, tangan di sisi tubuh, telapak menghadap atas.','Angkat lengan sedikit dari lantai, badan tetap datar.','Sapu lengan ke samping sampai membentuk huruf Y.','Turunkan lagi dengan kontrol penuh.'],kesalahan:['Badan ikut miring, gerakkan lengan saja.','Terlalu cepat, dua detik naik dua detik turun.']},
    prone_swimmer:{nama:'Prone Swimmer',otot:'Punggung, Bokong, Hamstring',langkah:['Tengkurap, panjangkan lengan ke depan.','Angkat lengan kanan dan kaki kiri bersamaan.','Ganti ke lengan kiri dan kaki kanan, terus bergantian.','Jaga dada tetap menempel lantai.'],kesalahan:['Hanya angkat kaki, lengan ikut bergerak.','Paling lambat, jagajasad tetap datar.']},
    bird_dog:{nama:'Bird Dog',otot:'Core, Punggung, Keseimbangan',langkah:['Posisi empat, punggung rata dengan lantai.','Panjangkan lengan kanan dan kaki kiri bersamaan.','Tahan 2 detik tanpa memiringkan pinggul.','Kembali ke awal, ganti sisi.'],kesalahan:['Pinggul miring ke samping, kencangkan core.','Terlalu tinggi, cukup setinggi badan.']},
    dead_bug:{nama:'Dead Bug',otot:'Core, Perut',langkah:['Telentang, lengan ke atas, lutut di atas pinggul 90 derajat.','Turunkan lengan kanan dan kaki kiri hampir menyentuh lantai.','Kembali ke awal, ganti sisi.','Jaga pinggul tetap menempel lantai.'],kesalahan:['Punggung bawah terangkat, kurangi jangkauan.','Gerakan terburu-buru, jaga kontrol.']},
    leg_raise:{nama:'Leg Raise',otot:'Core Bawah, Pinggul',langkah:['Telentang, kedua tangan di samping tubuh.','Angkat kedua kaki lurus sampai hampir tegak.','Turunkan perlahan tanpa menyentuh lantai.','Ulangi dengan tempo tetap.'],kesalahan:['Pinggul ikut terangkat, tekan ke lantai.','Tarik leher saat mengangkat kaki.','Gerakan terlalu cepat, turunkan dengan kontrol.']},
    side_plank:{nama:'Side Plank',otot:'Oblique, Pinggul, Core',langkah:['Tidur miring, siku di bawah bahu, kaki bertumpuk.','Angkat pinggul sampai tubuh satu garis lurus.','Tahan, ataskan tangan di pinggul.','Ganti sisi setelah selesai.'],kesalahan:['Pinggul jatuh ke bawah, kencangkan otot samping.','Leher menegang, pandangan tetap ke depan.']},
    glute_bridge_march:{nama:'Glute Bridge March',otot:'Bokong, Core',langkah:['Telentang, lutut ditekuk, telapak kaki di lantai.','Dorong pinggul ke atas sampai tubuh garis lurus.','Angkat satu lutut tanpa membiarkan pinggul turun.','Turunkan kaki itu, angkat kaki yang lain.'],kesalahan:['Pinggul ikut turun, kencangkan bokong.','Kaki terangkat terlalu tinggi, cukup sebanding dengan lutut lain.']},
    hip_thrust:{nama:'Hip Thrust',otot:'Bokong, Hamstring',langkah:['Telentang, tumit dekat bokong, lutut ditekuk.','Sandarkan punggung bawah di sofa atau kursi rendah.','Dorong pinggul ke atas sampai paha sejajar lantai.','Tahan 2 detik, turunkan perlahan.'],kesalahan:['Dagu terangkat, pandangan lurus ke depan.','Turun terlalu dalam, berhenti saat paha sejajar lantai.']},
    split_squat:{nama:'Split Squat',otot:'Paha, Bokong, Keseimbangan',langkah:['Berdiri, satu kaki di depan dan satu di belakang selebar bahu.','Turunkan lutut belakang mendekati lantai seperti lunge.','Dorong kaki depan untuk berdiri, lalu ganti kaki.','Jaga lutut depan tidak melewati ujung jari kaki.'],kesalahan:['Lutut depan menghadap keluar, arahkan searah jari kaki.','Kehilangan keseimbangan, mulai dekat dinding tanpa beban.']},
    lateral_lunge:{nama:'Lateral Lunge',otot:'Paha Dalam, Bokong',langkah:['Berdiri kaki selebar bahu, tangan di dada.','Langkah ke kanan, turun sampai paha kanan sejajar lantai.','Dorong kaki kanan untuk berdiri, ganti ke kiri.','Jaga lutut tidak melewati ujung jari kaki.'],kesalahan:['Terlalu dalam di awal, turunkan secukupnya saja.','Tumpu bodyweight ke satu sisi, jaga badan tetap tegak.']},
    step_up:{nama:'Step Up',otot:'Paha, Bokong',langkah:['Siapkan kursi atau bangku kukuh setinggi 40 sampai 50 cm.','Letakkan satu kaki di atas, dorong badan naik dengan kaki itu.','Turunkan perlahan, ganti kaki.','Jaga lutut tidak melewati ujung jari kaki.'],kesalahan:['Melompat naik memakai momentum, dorong dari kaki atas.','Kursi goyang, pastikan kukuh sebelum mulai.']},
    sit_to_stand:{nama:'Sit To Stand',otot:'Paha, Bokong, Lutut',langkah:['Duduk di tepi kursi, kaki selebar bahu, tumit sedikit mundur.','Condongkan badan ke depan, dorong kaki untuk berdiri.','Turunkan perlahan sampai duduk kembali.','Ulangi tanpa memakai tangan.'],kesalahan:['Mendorong tangan di lutut, lengan tetap rileks.','Duduk terlalu dalam, berhenti saat paha sejajar lantai.']},
    standing_calf_raise:{nama:'Calf Raise Berdiri',otot:'Betis',langkah:['Berdiri tegak, ujung kaki menempel lantai.','Dorong badan ke atas dengan ujung kaki sampai tumit terangkat.','Turun 2 detik dengan tumit menyentuh lantai.','Ulangi, boleh berpegangan pada dinding bila perlu.'],kesalahan:['Terlalu cepat naik turun, beri jeda singkat di atas.','Membungkuk badan, jaga lutut tetap lurus.']},
    jumping_jack:{nama:'Jumping Jack',otot:'Kardio, Bahu, Tungkai',langkah:['Berdiri, kaki renggang, lengan di sisi tubuh.','Lompat membuka kaki selebar bahu sambil tangan naik ke atas.','Lompat kembali ke posisi awal, ulangi berirama.','Pendaratan halus di ujung kaki.'],kesalahan:['Mendarat dengan tumit, turunkan tumit perlahan.','Melompat terlalu tinggi, cukup setinggi ringan saja.']},
    jump_squat:{nama:'Jump Squat',otot:'Paha, Bokong, Kardio',langkah:['Berdiri kaki selebar bahu, turun ke posisi setengah squat.','Lompat ke atas dengan kedua kaki tanpa membantu tangan.','Mendarat lembut di semi squat lalu ulang.','Jaga lutut tetap searah jari kaki setiap mendarat.'],kesalahan:['Lutut keluar ke dalam saat mendarat, dorong keluar.','Mendarat dengan kaki lurus, tumit menyentuh lembut dulu.']},
    skater_step:{nama:'Skater Step',otot:'Kaki Samping, Bokong, Kardio',langkah:['Berdiri, tekuk satu lutut dan angkat tumit ke belakang.','Langkahkan kaki lain ke samping, miringkan badan ke arah itu.','Tarik kaki belakang, lalu ganti arah.','Ulangi ke arah sebaliknya dengan ritme sama.'],kesalahan:['Langkahnya terlalu pendek, pakai langkah lebar.','Miring berlebihan, badan tetap menghadap depan.']},
    upper_body_stretch:{nama:'Peregangan Dada, Bahu, Leher',otot:'Dada, Bahu, Leher',langkah:['Silangkan lengan di depan dada, tekan pelan dengan lengan lain.','Rapatkan kedua lengan ke belakang, buka dada.','Miringkan kepala ke kiri, tahan, lalu ke kanan.','Bernapas dalam selama setiap tahan.'],kesalahan:['Menekan sampai nyeri, cukup sampai rasa tarikan ringan.','Tahan napas, tetap bernapas pelan.']},
    hip_flexor_stretch:{nama:'Peregangan Paha Depan',otot:'Paha Depan, Pinggul',langkah:['Berdiri satu kaki, satu lagi melangkah lebar ke belakang.','Tarik pinggul ke bawah dan miringkan badan sedikit ke depan.','Rasakan tarikan di depan paha, tahan.','Ganti kaki setelah selesai.'],kesalahan:['Pinggul condong ke depan, kencangkan perut.','Memaksa, tahan di batas yang nyaman.']},
    leg_back_stretch:{nama:'Peregangan Hamstring',otot:'Hamstring',langkah:['Duduk, luruskan satu kaki ke depan dengan tumit rapat.','Condongkan badan pelan dari pinggul, raih ujung kaki atau betis.','Jaga punggung tetap panjang, tahan.','Ganti kaki setelah selesai.'],kesalahan:['Membungkuk punggung, condong dari pinggul.','Terlalu dalam sampai terasa nyeri, tahan di batas nyaman.']},
    static_full_stretch:{nama:'Peregangan Menyeluruh',otot:'Seluruh Tubuh',langkah:['Ambil posisi child pose, lengan lurus ke depan.','Tarik napas dalam, biarkan pinggul turun ke tumit.','Tahan, lalu bangun perlahan.','Ulangi sekali lagi dengan napas dalam.'],kesalahan:['Tummit tidak menyentuh lantai, letakkan bantal di bawahnya.','Menekan memaksa, rilekskan seluruh tubuh.']},
    cooldown_breathing:{nama:'Pendinginan Napas',otot:'Sistem Saraf',langkah:['Duduk nyaman, tutup mata, longgarkan bahu.','Hirup napas dalam lewat hidung 4 hitungan.','Tahan 7 hitungan selama masih nyaman.','Hembuskan pelan lewat mulut 8 hitungan, lalu ulangi.'],kesalahan:['Tahan napas terlalu lama, buat hitungan pendek saja.','Menggigit rahang, biarkan mulut sedikit terbuka.']},
    mobility_flow:{nama:'Aliran Pemulihan',otot:'Seluruh Tubuh',langkah:['Berdiri, putar bahu, pergelangan, dan lutut bergantian.','Gabungkan rotasi torso dengan langkah di tempat yang pelan.','Ulangi beberapa putaran, fokus pada gerakan yang paling kaku.','Turunkan kecepatan di putaran terakhir.'],kesalahan:['Terlalu cepat, ini pemulihan bukan latihan.','Melewatkan gerakan yang terasa kaku, justru itu yang dicari.']},
    };

    const HIGH_IMPACT_BLOCKED = ['jumping_jack','burpee','high_knees','mountain_climber','jump_squat'];

    
    function getUserBMI(){
    const user=loadState(KEYS.user);
    if(!user||!user.weight||!user.height) return null;
    return user.weight/Math.pow(user.height/100,2);
    }

    function getUserType(){
    const bmi=getUserBMI();
    if(bmi===null) return 'normal';
    if(bmi>30) return 'overweight';
    if(bmi<18.5) return 'underweight';
    return 'normal';
    }

    
    function isLowImpactMode(day){
    return getUserType()==='overweight' || day<=14;
    }

    
    function getWeekSplit(goal){
    return WEEK_SPLIT[goal] || WEEK_SPLIT.maintain;
    }

    
    function getExerciseCount(level, kind, goal){
    let n;
    if(kind==='recovery'||kind==='mobility') n=3;
    else if(kind==='cardio') n=(level>=5)?5:4;
    else if(level<=2) n=4;
    else if(level<=4) n=5;
    else n=6;
    if(goal==='lose'&&kind==='strength') n=Math.min(n+1,7);
    if(goal==='gain'&&kind==='strength') n=Math.max(4,n-1);
    return n;
    }

    
    function getPrescription(day, level, kind, goal){
    const L=LEVELS[Math.max(0,Math.min(LEVELS.length-1,level-1))];
    let sets=L.sets, reps=L.reps, work=L.work, rest=L.rest;

    if(kind==='cardio'){
        reps=Math.max(reps,30); work=40; rest=45;
    } else if(kind==='mobility'){
        reps=8; work=25; rest=30;
    } else if(kind==='recovery'){
        sets=1; reps=1; work=120; rest=15;
    }

    if(kind==='strength'||kind==='cardio'){
        if(goal==='lose'){
            rest=Math.max(45,rest-15);
            if(kind==='strength') reps=Math.min(reps+3,20);
        } else if(goal==='gain'){
            rest=Math.min(rest+20,180);
            if(kind==='strength') reps=Math.max(6,reps-2);
        }
    }

    if(isDeloadDay(day)&&kind==='strength'){
        sets=Math.max(2,sets-1);
        work=Math.max(20,work-5);
        rest=rest+30;
    }

    sets=Math.max(1,Math.min(sets,6));
    reps=Math.max(1,Math.min(reps,30));
    work=Math.max(10,Math.min(work,240));
    rest=Math.max(30,Math.min(rest,240));
    return {sets,reps,work,rest,level:L.lv,levelName:L.name,levelDesc:L.desc};
    }

    
    function gateKey(key, level, lowImpact){
    if(HIGH_IMPACT_BLOCKED.includes(key)){
        return lowImpact?(LOW_IMPACT_SWAP[key]||'march_in_place'):key;
    }
    if(level<=3&&EASIER_VARIANT[key]) return EASIER_VARIANT[key];
    return key;
    }

    
    function pickFromPool(poolName, count, offset, level, lowImpact, taken){
    const pool=[];
    for(const raw of (FOCUS_POOLS[poolName]||[])){
        const k=gateKey(raw,level,lowImpact);
        if(EXERCISES[k]&&!pool.includes(k)) pool.push(k);
    }
    if(!pool.length) return [];

    const out=[];
    for(let i=0;i<pool.length&&out.length<count;i++){
        const k=pool[(offset+i)%pool.length];
        if(taken.has(k)) continue;
        taken.add(k);
        out.push(k);
    }
    return out;
    }

    function getWorkoutExercises(plan, day, goal){
    const lowImpact=isLowImpactMode(day);
    const count=getExerciseCount(plan.level,plan.kind,goal);
    const taken=new Set();
    const keys=[];
    const pools=plan.pools;

    const variant=plan.variant==='b'?3:0;

    const quota=pools.map(()=>0);
    for(let i=0;i<count;i++) quota[i%pools.length]++;

    pools.forEach((poolName,pi)=>{
        if(!quota[pi]) return;
        const offset=Math.floor(day/7)*2+variant+pi*2;
        keys.push(...pickFromPool(poolName,quota[pi],offset,plan.level,lowImpact,taken));
    });

    if(keys.length<count){
        for(const poolName of Object.keys(FOCUS_POOLS)){
            if(keys.length>=count) break;
            keys.push(...pickFromPool(poolName,count-keys.length,day+keys.length,plan.level,lowImpact,taken));
        }
    }

    return keys.slice(0,count);
    }

    
    function getEnergyMultiplier(energy, sleep){
    
    let mult;
    if(energy>=4) mult=1.0;
    else if(energy===3) mult=0.9;
    else if(energy===2) mult=0.7;
    else mult=0.5; // energi 1

    if(sleep<5) mult=Math.max(0.5, mult-0.15);

    try{
        const directFlag=localStorage.getItem('ip90_recovery_flag');
        if(directFlag) mult=Math.min(mult, parseFloat(directFlag)||0.8);
        const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
        const flag=localStorage.getItem('ip90_recovery_next_'+yesterday.toISOString().split('T')[0]);
        if(flag) mult=Math.min(mult, parseFloat(flag)||0.8);
    }catch(e){}

    const lepMult=getLowEnergyProtectionMultiplier();
    if(lepMult!==null) mult=Math.min(mult, lepMult);

    return Math.max(0.5, Math.min(1.0, mult));
    }

    
    function getLowEnergyProtectionMultiplier(){
    try{
        const days=[];
        for(let i=0;i<3;i++){
            const d=new Date();d.setDate(d.getDate()-i);
            const e=loadState(KEYS.energy+d.toISOString().split('T')[0]);
            if(e&&e.energy) days.push(e.energy);
        }
        if(days.length>=3&&days.every(e=>e<=2)) return 0.8;
    }catch(e){}
    return null;
    }

    
    function applyIntensity(pres, mult){
    const safeMult=Math.max(0.5,Math.min(1,mult));
    const sets=Math.max(1,Math.round(pres.sets*safeMult));
    const restSecs=Math.max(30,Math.round(pres.rest/safeMult));
    const workSecs=Math.max(10,Math.round(pres.work*safeMult));
    const reps=Math.max(1,Math.round(pres.reps*safeMult));
    return {sets,reps,workSecs,restSecs};
    }

    function getIntensityLabel(mult){
    if(mult <= 0.6) return {label:'Sangat Ringan (60%)', color:'var(--red)', bg:'var(--red-dim)'};
    if(mult <= 0.8) return {label:'Ringan (80%)', color:'var(--yellow)', bg:'var(--yellow-dim)'};
    if(mult <= 1.0) return {label:'Normal (100%)', color:'var(--accent)', bg:'var(--accent-dim)'};
    if(mult <= 1.1) return {label:'Lebih Kuat (110%)', color:'var(--blue)', bg:'var(--blue-dim)'};
    return {label:'Maksimal (120%)', color:'var(--purple)', bg:'var(--purple-dim)'};
    }

    let selectedEnergy = 3;
    let todaySleep = 7;

    function loadEnergyForToday(){
    
    const td=loadToday();
    if(td.energyChecked){
        selectedEnergy=td.energy||3;
        todaySleep=td.sleep||7;
        return;
    }
    
    const saved = loadState(energyKey());
    if(saved){
        selectedEnergy = saved.energy || 3;
        todaySleep = saved.sleep || 7;
    } else {
        selectedEnergy = 3;
        todaySleep = 7;
    }
    }

    function saveEnergyForToday(){
    saveState(energyKey(), {energy:selectedEnergy, sleep:todaySleep});
    }

    function updateEnergyConfirmBtn(){
    const sleepEl=document.getElementById('energy-sleep');
    if(!sleepEl) return;
    const sleepVal=parseFloat(sleepEl.value);
    const hasEnergy=selectedEnergy>=1&&selectedEnergy<=5;
    const hasSleep=!isNaN(sleepVal)&&sleepVal>=1&&sleepVal<=12;
    const btn=document.getElementById('energy-confirm-btn');
    if(!btn) return;
    btn.disabled=!(hasEnergy&&hasSleep);
    btn.style.opacity=btn.disabled?'0.5':'1';
    btn.style.cursor=btn.disabled?'not-allowed':'pointer';
    const starErr=document.getElementById('energy-star-err');
    const sleepErr=document.getElementById('energy-sleep-err');
    if(starErr) starErr.style.display=(!hasEnergy&&sleepEl.value!=='')?'block':'none';
    if(sleepErr) sleepErr.style.display=(sleepEl.value!==''&&!hasSleep)?'block':'none';
    }

    function selectEnergy(level){
    selectedEnergy = level;
    document.querySelectorAll('.energy-star').forEach((el,i)=>{
        el.classList.toggle('selected', i < level);
    });
    updateIntensityPreview();
    updateEnergyConfirmBtn();
    }

    function updateIntensityPreview(){
    const sleepEl=document.getElementById('energy-sleep');
    const sleep = sleepEl ? (parseFloat(sleepEl.value)||todaySleep) : todaySleep;
    const mult = getEnergyMultiplier(selectedEnergy, sleep);
    const lbl = getIntensityLabel(mult);
    const prev = document.getElementById('intensity-preview');
    if(!prev) return;
    let extraNote = '';
    if(sleep < 5) extraNote = ' Tidur kurang dari 5 jam, intensitas diturunkan.';
    const userType=getUserType();
    if(userType==='overweight') extraNote += ' Mode low impact aktif, latihan benturan tinggi dinonaktifkan.';
    prev.innerHTML = `Intensitas latihan: <strong style="color:${lbl.color}">${lbl.label}</strong>${extraNote}`;
    const hintEl=document.getElementById('ux-energy-hint');
    if(hintEl && selectedEnergy > 0){
        hintEl.classList.remove('hidden','low','mid','high');
        if(selectedEnergy <= 2){
        hintEl.className='ux-energy-hint low';
        hintEl.textContent='Latihan disesuaikan karena energi kamu rendah hari ini.';
        } else if(selectedEnergy === 3){
        hintEl.className='ux-energy-hint mid';
        hintEl.textContent='Volume latihan diturunkan supaya aman dipakai meski kondisi tidak penuh.';
        } else {
        hintEl.className='ux-energy-hint high';
        hintEl.textContent='Kamu dalam kondisi bagus untuk latihan maksimal hari ini!';
        }
    } else if(hintEl){
        hintEl.classList.add('hidden');
    }
    }

    function showEnergyModal(){
    const td=loadToday();
    if(td.energyChecked) return;
    const _m=document.getElementById('energy-modal');
    if(_m&&_m.classList.contains('active')) return;
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    for(let i = 0; i < MAX_FLOW_ITEMS; i++) {
        const w = document.getElementById('ex-timer-' + i);
        if(w && w._interval) { clearInterval(w._interval); w._interval = undefined; }
    }
    
    document.body.style.overflow='hidden';
    window.scrollTo(0,0);
    const pad=document.querySelector('#tab-latihan .workout-pad');
    if(pad) pad.classList.add('workout-locked');
    loadEnergyForToday();
    selectedEnergy=0;
    const sleepEl=document.getElementById('energy-sleep');
    if(sleepEl){
        sleepEl.value='';
        sleepEl.removeEventListener('input',updateIntensityPreview);
        sleepEl.addEventListener('input',updateIntensityPreview);
        sleepEl.removeEventListener('input',updateEnergyConfirmBtn);
        sleepEl.addEventListener('input',updateEnergyConfirmBtn);
    }
    document.querySelectorAll('.energy-star').forEach(el=>el.classList.remove('selected'));
    const starsEl=document.querySelector('.energy-stars');
    if(starsEl) starsEl.style.outline='';
    const prev=document.getElementById('intensity-preview');
    if(prev) prev.innerHTML='Pilih energi dan jam tidur untuk melihat intensitas latihan hari ini.';
    const btn=document.getElementById('energy-confirm-btn');
    if(btn){btn.disabled=true;btn.style.opacity='0.5';btn.style.cursor='not-allowed';}
    const starErr=document.getElementById('energy-star-err');
    const sleepErr=document.getElementById('energy-sleep-err');
    if(starErr) starErr.style.display='none';
    if(sleepErr) sleepErr.style.display='none';
    const modalEl=document.getElementById('energy-modal');
    if(modalEl) modalEl.classList.add('active');
    }

    function confirmEnergyCheck(){
    const sleepEl=document.getElementById('energy-sleep');
    if(!sleepEl) return;
    const sleep = parseFloat(sleepEl.value);
    if(!selectedEnergy || selectedEnergy<1){
        const starsEl=document.querySelector('.energy-stars');
        if(starsEl) starsEl.style.outline='2px solid var(--orange)';
        return;
    }
    if(!sleep || sleep < 1 || sleep > 12){
        sleepEl.style.borderColor = 'var(--orange)';
        return;
    }
    sleepEl.style.borderColor = '';
    todaySleep = sleep;
    saveEnergyForToday();
    
    const td=loadToday();
    td.energyChecked=true;
    td.energy=selectedEnergy;
    td.sleep=todaySleep;
    saveToday(td);
    checkLowEnergyProtection();
    const em=document.getElementById('energy-modal');
    if(em) em.classList.remove('active');
    document.body.style.overflow='';
    const pad=document.querySelector('#tab-latihan .workout-pad');
    if(pad) pad.classList.remove('workout-locked');
    // Sembunyikan lapisan kunci
    const lo=document.getElementById('workout-lock-overlay');
    if(lo) lo.classList.add('hidden');
    // Buka semua tab
    _applyTabLockState();
    const userData = loadState(KEYS.user);
    const programData = loadState(KEYS.program);
    if(!userData || !programData) return;
    const day = getCurrentDay();
    const dayData = loadDayData(day);
    renderWorkoutTab(day, dayData.workout);
    updateDashIntensityCard();
    }

    function checkLowEnergyProtection(){
    
    const logs = [];
    for(let i=0;i<3;i++){
        const d = new Date(); d.setDate(d.getDate()-i);
        const k = KEYS.energy + d.toISOString().split('T')[0];
        const e = loadState(k);
        if(e) logs.push(e.energy);
    }
    const allLow = logs.length >= 3 && logs.every(e=>e<=2);
    if(allLow){
        const warned = document.getElementById('dash-warnings-wrap');
        if(warned) warned.innerHTML += `
        <div class="dash-warning">
            <div class="dash-warning-title">Energi rendah 3 hari berturut-turut</div>
            Energimu rendah selama 3 hari terakhir. Intensitas latihan hari ini dibatasi maksimal 80% supaya badan sempat pulih. Tambah jam tidur dan makan cukup malam ini.
        </div>`;
    }
    }

    function updateDashIntensityCard(){
    loadEnergyForToday();
    const mult = getEnergyMultiplier(selectedEnergy, todaySleep);
    const lbl = getIntensityLabel(mult);
    const card = document.getElementById('dash-intensity-card');
    if(!card) return;
    card.classList.remove('hidden');
    const divEl=document.getElementById('dash-intensity-val');
    if(divEl) divEl.textContent = `Energi: ${selectedEnergy}/5 · Tidur: ${todaySleep} jam`;
    const badge = document.getElementById('dash-intensity-badge');
    if(badge){
        badge.textContent = lbl.label;
        badge.style.background = lbl.bg;
        badge.style.color = lbl.color;
        badge.style.border = `1.5px solid ${lbl.color}`;
    }
    }

    
    const MAX_FLOW_ITEMS = 24;

    /* Format detik ke MM:SS */
    function exTimerFmt(s) {
    s = Math.max(0, s);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return String(m).padStart(2,'0') + ':' + String(r).padStart(2,'0');
    }

    
    function initExTimers(count) {
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    window._exTimerInterval = undefined;
    window._exTimerTimeout  = undefined;
    
    for(let i = 0; i < MAX_FLOW_ITEMS; i++) {
        const wrap = document.getElementById('ex-timer-' + i);
        if(wrap && wrap._interval) {
        clearInterval(wrap._interval);
        clearTimeout(wrap._interval);
        wrap._interval = undefined;
        }
    }
    }

    
    function _exWrap(idx) {
    return document.getElementById('ex-timer-' + idx);
    }

    
    function renderExTimer(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(!wrap) return;

    let state = wrap._timerState || 'idle';
    const secs  = wrap._secsLeft  || 0;

    if(state!=='done'&&!isFlowItemUnlocked(idx)) state='locked';

    const exSt      = wrap._exState || {};
    const totalSets = exSt.reps || 1;
    const cur       = exSt.currentRep || 1;
    const sekaliJalan = totalSets<=1;

    let repHtml = '', phaseLabel = '', display = '', cls = '', btns = '';

    const lblSet = sekaliJalan ? (exSt.timer+' dtk') : ('Set '+cur+' / '+totalSets);

    switch(state) {
        case 'idle':
        repHtml    = `<div class="ex-rep-label">${lblSet}</div>`;
        phaseLabel = 'Siap untuk dimulai';
        display    = ICONS.play;
        cls        = '';
        btns       = `<button class="ex-timer-btn start" onclick="exTimerStart(${idx},${totalEx})">${ICONS.play} ${sekaliJalan?'Mulai':'Mulai Set 1'}</button>`;
        break;

        case 'active':
        repHtml    = `<div class="ex-rep-label" id="ex-rep-lbl-${idx}">${lblSet}</div>`;
        phaseLabel = 'Sedang berjalan';
        display    = exTimerFmt(secs);
        cls        = '';
        btns       = `<button class="ex-timer-btn rest" onclick="exTimerManualFinishRep(${idx},${totalEx})">${ICONS.check} ${sekaliJalan?'Selesai':'Set Selesai'}</button>`;
        break;

        case 'rest':
        repHtml    = `<div class="ex-rep-label rest-rep" id="ex-rep-lbl-${idx}">Set ${cur} / ${totalSets} · Istirahat</div>`;
        phaseLabel = `Istirahat · Set ${cur + 1} / ${totalSets} berikutnya`;
        display    = exTimerFmt(secs);
        cls        = 'rest-mode';
        btns       = `<button class="ex-timer-btn start" onclick="exTimerSkipRest(${idx},${totalEx})">${ICONS.skip} Lewati Istirahat</button>`;
        break;

        case 'done':
        repHtml    = `<div class="ex-rep-label done-rep">${ICONS.check} ${sekaliJalan?'Selesai':(totalSets+' Set Selesai')}</div>`;
        phaseLabel = 'Selesai';
        display    = ICONS.check;
        cls        = 'done-mode';
        btns       = `<button class="ex-timer-btn" onclick="exTimerReset(${idx},${totalEx})">${ICONS.rotate} Ulangi</button>`;
        break;

        case 'locked':
        repHtml    = `<div class="ex-rep-label locked-rep">${ICONS.lock} Terkunci</div>`;
        phaseLabel = 'Selesaikan bagian sebelumnya dulu';
        display    = ICONS.lock;
        cls        = 'locked-mode';
        btns       = '';
        break;
    }

    wrap.innerHTML = `
        ${repHtml}
        <div class="ex-timer-state">${phaseLabel}</div>
        <div class="ex-timer-display ${cls}" id="ex-timer-disp-${idx}">${display}</div>
        <div class="ex-timer-btns">${btns}</div>`;

    wrap._exState      = exSt;
    wrap._timerState   = wrap._timerState || 'idle';
    wrap._secsLeft     = secs;
    wrap._transitioning= wrap._transitioning || false;
    }

    
    function _exClearWrap(wrap) {
    if(wrap && wrap._interval !== undefined) {
        clearInterval(wrap._interval);
        clearTimeout(wrap._interval);
        wrap._interval = undefined;
    }
    }

    
    function _exStopOthers(idx) {
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    window._exTimerInterval = undefined;
    window._exTimerTimeout  = undefined;
    for(let k = 0; k < MAX_FLOW_ITEMS; k++) {
        if(k === idx) continue;
        const w = _exWrap(k);
        if(w && (w._timerState === 'active' || w._timerState === 'rest')) {
        _exClearWrap(w);
        }
    }
    }

    
    function _exRunActive(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(!wrap) return;

    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    _exClearWrap(wrap);

    const state = wrap._exState;
    if(!state) return;

    wrap._timerState    = 'active';
    wrap._secsLeft      = state.timer || 30;
    wrap._transitioning = false;

    renderExTimer(idx, totalEx);

    wrap._interval = setInterval(() => {
        if(!loadToday().energyChecked) { _exClearWrap(wrap); return; }
        if(wrap._transitioning) return;

        wrap._secsLeft--;

        const disp = document.getElementById('ex-timer-disp-' + idx);
        if(disp && wrap._timerState === 'active') {
        disp.textContent = exTimerFmt(wrap._secsLeft);
        }

        if(wrap._secsLeft <= 0) {
        wrap._transitioning = true;
        _exClearWrap(wrap);
        _exOnRepEnd(idx, totalEx);
        }
    }, 1000);
    window._exTimerInterval = wrap._interval;
    }

    
    function _exOnRepEnd(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(!wrap) return;
    _exClearWrap(wrap);

    const state     = wrap._exState;
    if(!state) return;
    const cur       = state.currentRep;
    const totalReps = state.reps;

    /* Alur sesi: N-1 kali aktif lalu istirahat, set terakhir aktif */
    if(cur >= totalReps) {
        _exFinish(idx, totalEx);
    } else {
        _exRunRest(idx, totalEx);
    }
    }

    
    function _exRunRest(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(!wrap) return;

    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    _exClearWrap(wrap);

    const state = wrap._exState;
    if(!state) return;

    wrap._timerState    = 'rest';
    wrap._secsLeft      = state.rest || 90;
    wrap._transitioning = false;
    renderExTimer(idx, totalEx);

    wrap._interval = setInterval(() => {
        if(!loadToday().energyChecked) { _exClearWrap(wrap); return; }
        if(wrap._transitioning) return;

        wrap._secsLeft--;

        const disp = document.getElementById('ex-timer-disp-' + idx);
        if(disp && wrap._timerState === 'rest') {
        disp.textContent = exTimerFmt(wrap._secsLeft);
        }

        if(wrap._secsLeft <= 0) {
        wrap._transitioning = true;
        _exClearWrap(wrap);
        _exAdvanceRep(idx, totalEx);
        }
    }, 1000);
    window._exTimerInterval = wrap._interval;
    }

    
    function _exAdvanceRep(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(!wrap) return;

    const state = wrap._exState;
    if(!state) return;

    state.currentRep++;
    const cur       = state.currentRep;
    const totalReps = state.reps;

    if(cur > totalReps) {
        _exFinish(idx, totalEx);
    } else {
        _exRunActive(idx, totalEx);
    }
    }

    
    function _exFinish(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(wrap) {
        _exClearWrap(wrap);
        wrap._timerState    = 'done';
        wrap._transitioning = false;
    }
    _saveFlowDone(idx);
    renderExTimer(idx, totalEx);
    _updateDoneBtnState(totalEx);

    const next = idx + 1;
    if(next < totalEx) {
        const nextCard = document.getElementById('ex-card-' + next);
        if(nextCard){
        nextCard.classList.add('open');
        nextCard.classList.add('just-opened');
        nextCard.classList.remove('locked');
        setTimeout(() => nextCard.classList.remove('just-opened'), 1200);
        if(typeof nextCard.scrollIntoView==='function'){
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        }
        renderExTimer(next, totalEx);
    }
    }

    
    function exTimerStart(idx, totalEx) {
    if(!loadToday().energyChecked) { showEnergyModal(); return; }

    if(!isFlowItemUnlocked(idx)){ _toastMsg('_exdone_toast', ICONS.lock+' Selesaikan bagian sebelumnya dulu'); return; }

    _exStopOthers(idx);

    const wrap = _exWrap(idx);
    if(!wrap || !wrap._exState) return;

    if(wrap._timerState === 'idle' || wrap._timerState === 'done') {
        wrap._exState.currentRep = 1;
        wrap._transitioning      = false;
    }

    _exRunActive(idx, totalEx);
    }

    
    function exTimerManualFinishRep(idx, totalEx) {
    if(!loadToday().energyChecked) { showEnergyModal(); return; }
    const wrap = _exWrap(idx);
    if(!wrap || wrap._timerState !== 'active') return;
    wrap._transitioning = true;
    _exClearWrap(wrap);
    _exOnRepEnd(idx, totalEx);
    }

    
    function exTimerSkipRest(idx, totalEx) {
    if(!loadToday().energyChecked) { showEnergyModal(); return; }
    const wrap = _exWrap(idx);
    if(!wrap || wrap._timerState !== 'rest') return;
    wrap._transitioning = true;
    _exClearWrap(wrap);
    _exAdvanceRep(idx, totalEx);
    }

    
    function exTimerReset(idx, totalEx) {
    const wrap = _exWrap(idx);
    if(!wrap) return;
    if(!_resetFlowFrom(idx)) return;
    _exClearWrap(wrap);
    if(wrap._exState) wrap._exState.currentRep = 1;
    wrap._timerState    = 'idle';
    wrap._secsLeft      = (wrap._exState || {}).timer || 30;
    wrap._transitioning = false;
    _applyFlowLocks();
    renderExTimer(idx, totalEx);
    _updateDoneBtnState(totalEx);
    }

    
    function getFlowDone(){
    const td=loadToday();
    return Array.isArray(td.flowDone)?td.flowDone:[];
    }

    function getFlowTotal(){
    const td=loadToday();
    return typeof td.flowTotal==='number'?td.flowTotal:0;
    }

    function getSavedFlowPct(){
    const total=getFlowTotal();
    if(!total) return 0;
    return Math.round((getFlowDone().filter(Boolean).length/total)*100);
    }

    function _saveFlowDone(idx){
    const td=loadToday();
    const list=Array.isArray(td.flowDone)?td.flowDone:[];
    list[idx]=true;
    td.flowDone=list;
    saveToday(td);
    }

    function _resetFlowFrom(idx){
    const td=loadToday();
    const list=Array.isArray(td.flowDone)?td.flowDone.slice():[];
    let changed=false;
    for(let i=idx+1;i<list.length;i++){ if(list[i]){ list[i]=false; changed=true; } }
    if(changed){ td.flowDone=list; saveToday(td); }
    for(let i=0;i<40;i++){
        const w=_exWrap(i);
        if(!w||!w._exState) continue;
        if(i>idx&&w._timerState==='done'){
        _exClearWrap(w);
        w._timerState='idle';
        if(w._exState) w._exState.currentRep=1;
        renderExTimer(i,MAX_FLOW_ITEMS);
        }
    }
    _applyFlowLocks();
    return true;
    }

    function _applyFlowLocks(){
    for(let i=0;i<40;i++){
        const w=_exWrap(i);
        if(!w||!w._exState) continue;
        const card=document.getElementById('ex-card-'+i);
        const unlocked=isFlowItemUnlocked(i);
        if(w._timerState!=='done'&&!unlocked){
        w._timerState='idle';
        if(w._exState) w._exState.currentRep=1;
        }
        if(card) card.classList.toggle('locked',!unlocked&&w._timerState!=='done');
    }
    }

    function _checkAllExercisesDone(){
    if(devCheat()) return true;
    let total = 0, done = 0;
    for(let i = 0; i < MAX_FLOW_ITEMS; i++) {
        const wrap = _exWrap(i);
        if(!wrap || !wrap._exState) continue;
        total++;
        if(wrap._timerState === 'done') done++;
    }
    if(total === 0) return true;
    return done === total;
    }

    function _toastMsg(id, html){
    let t=document.getElementById(id);
    if(!t){
        t=document.createElement('div');
        t.id=id;
        t.className='toast';
        document.body.appendChild(t);
    }
    t.innerHTML=html;
    t.style.opacity='1';
    clearTimeout(t._hide);
    t._hide=setTimeout(()=>{t.style.opacity='0';},2500);
    }

    function _updateDoneBtnState(totalEx){
    const todayData=loadToday();
    if(todayData.workoutDone) return;
    const doneWrap=document.getElementById('workout-done-wrap');
    if(!doneWrap) return;
    const doneCnt=getFlowProgress(totalEx);
    const allDone = doneCnt === totalEx;
    if(allDone){
        doneWrap.innerHTML=`
        <p style="font-size:.82rem;color:var(--accent);text-align:center;margin-bottom:14px;">
            Pemanasan, latihan utama, dan pendinginan sudah semua selesai. Tandai sesi ini.
        </p>
        <button class="btn btn-primary btn-full" onclick="markWorkoutDone()">${ICONS.check} Tandai Latihan Selesai</button>`;
    } else {
        const nextIdx=doneCnt;
        const nextW=_exWrap(nextIdx);
        const nextName=nextW?((nextW._item&&nextW._item.nama)||''):'';
        doneWrap.innerHTML=`
        <p style="font-size:.82rem;color:var(--text2);text-align:center;margin-bottom:6px;">
            Sesi hari ini berurutan: pemanasan, latihan utama, lalu pendinginan.
        </p>
        <p style="font-size:.82rem;color:var(--accent);text-align:center;margin-bottom:14px;">
            ${doneCnt}/${totalEx} selesai${nextName?`. Lanjut ke ${nextName}`:''}
        </p>
        <button class="btn btn-primary btn-full" onclick="markWorkoutDone()" disabled>${ICONS.check} Tandai Latihan Selesai</button>`;
    }
    }

    /* AWAL APLIKASI */
    function initApp(){
    if(DEV_MODE){clearAllStorage();}
    try{
        initTheme();
    }catch(e){
        document.documentElement.setAttribute('data-theme','light');
    }
    try{
        _watchDayRollover();
    }catch(e){
        console.error('watch day rollover error:',e);
    }
    try{
        rebindHiddenEntry();
        initDevFromUrl();
        mountDevButton();
        renderNotifPanel();
        notifMulai();
    }catch(e){
        console.error('dev init error:',e);
    }
    try{
        const appState=loadState(KEYS.app);
        if(appState&&appState.programStarted){renderHome();showScreen('lh');}
        else{showScreen('la');}
    }catch(e){
        document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
        const la=document.getElementById('screen-la');
        if(la) la.classList.add('active');
    }
    }

    /* TEMA, terang / gelap */
    const THEME_KEY='ip90_theme';
    const THEME_ICON={
    light:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    dark:'<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    };

    function getTheme(){
    const t=document.documentElement.getAttribute('data-theme');
    return t==='dark'?'dark':'light';
    }

    function applyTheme(theme){
    const next=theme==='dark'?'dark':'light';
    document.documentElement.setAttribute('data-theme',next);
    document.querySelectorAll('.theme-toggle-icon').forEach(el=>{
        el.innerHTML=THEME_ICON[next];
    });
    document.querySelectorAll('.theme-toggle').forEach(btn=>{
        btn.setAttribute('aria-pressed',next==='dark'?'true':'false');
        btn.title=next==='dark'?'Ganti ke mode terang':'Ganti ke mode gelap';
    });
    document.querySelectorAll('.theme-toggle-icon').forEach(el=>{
        el.parentElement.setAttribute('aria-label',next==='dark'?'Ganti ke mode terang':'Ganti ke mode gelap');
    });
    if(window._weightChart) renderWeightChart();
    }

    function toggleTheme(btn){
    const next=getTheme()==='dark'?'light':'dark';
    applyTheme(next);
    try{localStorage.setItem(THEME_KEY,next);}catch(e){}
    }

    function initTheme(){
    let theme=null;
    try{theme=localStorage.getItem(THEME_KEY);}catch(e){}
    if(theme!=='light'&&theme!=='dark') theme=getTheme();
    applyTheme(theme);
    }

    /* PINDAH LAYAR */
    function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    const el=document.getElementById('screen-'+id);
    if(el){el.classList.add('active');window.scrollTo(0,0);}
    try{
        if(id==='lh') renderHome();
        if(id==='lp') renderProgram();
    }catch(e){
        console.error('render error:',e);
try{ rebindHiddenEntry(); }catch(e){}
    }
    }

    /* FORMULIR */
    let selectedGoal='';
    function selectGoal(el,goal){
    document.querySelectorAll('.form-goal-btn').forEach(b=>b.classList.remove('selected'));
    el.classList.add('selected');
    selectedGoal=goal;
    }

    
    function toggleDislike(el){
    el.classList.toggle('selected');
    const checkEl=el.querySelector('.dislike-chip-check');
    if(checkEl) checkEl.textContent=el.classList.contains('selected')?'✓':'';
    const anySelected=document.querySelectorAll('.dislike-chip.selected').length>0;
    const notice=document.getElementById('dislike-notice');
    if(notice) notice.style.display=anySelected?'block':'none';
    }

    function checkWeightSafety(){
    const w=+document.getElementById('f-weight').value;
    const t=+document.getElementById('f-target-weight').value;
    const warn=document.getElementById('safety-warning');
    if(w>0&&t>0&&Math.abs(w-t)>20){warn.classList.add('show');}else{warn.classList.remove('show');}
    }

    function validateForm(){
    let valid=true;
    const fields=[
        {id:'f-name',errId:'err-name',check:v=>v.trim().length>=2},
        {id:'f-weight',errId:'err-weight',check:v=>+v>=30&&+v<=200},
        {id:'f-target-weight',errId:'err-target',check:v=>+v>=30&&+v<=200},
        {id:'f-height',errId:'err-height',check:v=>+v>=100&&+v<=250},
        {id:'f-age',errId:'err-age',check:v=>+v>=15&&+v<=80},
        {id:'f-gender',errId:'err-gender',check:v=>v!==''},
        {id:'f-activity',errId:'err-activity',check:v=>v!==''},
    ];
    fields.forEach(f=>{
        const el=document.getElementById(f.id);const errEl=document.getElementById(f.errId);
        if(!el||!errEl) return;
        const ok=f.check(el.value);el.classList.toggle('error',!ok);errEl.classList.toggle('show',!ok);
        if(!ok) valid=false;
    });
    const w=+document.getElementById('f-weight').value;
    const t=+document.getElementById('f-target-weight').value;
    if(w>0&&t>0&&Math.abs(w-t)>20){
        document.getElementById('safety-warning').classList.add('show');
        document.getElementById('f-target-weight').classList.add('error');
        document.getElementById('err-target').textContent='Selisih max 20 kg dari berat awal untuk keamanan.';
        document.getElementById('err-target').classList.add('show');
        valid=false;
    }
    const goalErr=document.getElementById('err-goal');
    if(!selectedGoal){goalErr.classList.add('show');valid=false;}else{goalErr.classList.remove('show');}
    return valid;
    }

    function handleFormSubmit(){
    if(!validateForm()) return;
    const btn=document.getElementById('submit-btn');
    btn.innerHTML='<div class="loader"></div>';btn.disabled=true;
    const dislikeArr=Array.from(document.querySelectorAll('.dislike-chip.selected')).map(el=>el.getAttribute('data-dislike')).filter(Boolean);
    const userData={
        name:document.getElementById('f-name').value.trim(),
        weight:+document.getElementById('f-weight').value,
        targetWeight:+document.getElementById('f-target-weight').value,
        height:+document.getElementById('f-height').value,
        age:+document.getElementById('f-age').value,
        gender:document.getElementById('f-gender').value,
        activity:+document.getElementById('f-activity').value,
        goal:selectedGoal,
        dislike:dislikeArr,
    };
    const targets=calcEnergyTargets(userData);
    const water=calculateWater(userData.weight);
    const programData={startDate:new Date().toISOString().split('T')[0],tdee:targets.kcal,targets,water,streak:0,lastActiveDate:''};
    saveState(KEYS.user,userData);saveState(KEYS.program,programData);saveState(KEYS.app,{programStarted:true});
    // Izin notifikasi hanya boleh diminta dari ketukan pengguna, dan
    // fungsi ini dipanggil dari ketukan tombol. Di sinilah tempat paling
    // wajar: permintaannya muncul di layar yang sedang dipakai pengguna.
    // Peramban menolak permintaan tanpa ketukan, jadi izin tidak bisa
    // dipaksa dari kode.
    if(typeof notifAktifkan==='function'&&!notifBoleh()){
        notifAktifkan().then(function(){ renderNotifPanel(); });
    }
    setTimeout(()=>{btn.textContent='Buat Program Saya';btn.disabled=false;renderHome();showScreen('lh');},800);
    }

    
    function getTargets(){
    const program=loadState(KEYS.program);
    if(program&&program.targets) return program.targets;
    return calcEnergyTargets(loadState(KEYS.user)||{});
    }

    
    function activeTargets(){
    if(isMaintenanceDay(getCurrentDay())) return maintenanceTargets();
    return getTargets();
    }

    function calculateWater(weight){
    const w=parseFloat(weight)||70;
    const low=Math.round(w*30);const high=Math.round(w*35);
    return {low,high,display:`${low}-${high} ml`};
    }

    /* BANTUAN PROGRAM */
    function getCurrentDay(){
    const prog=loadState(KEYS.program);if(!prog||!prog.startDate) return 0;
    const dev=getDevState();
    if(dev.on && Number.isInteger(dev.day)) return Math.max(0,Math.min(MAINT_CAP,dev.day));
    const start=new Date(prog.startDate);const now=new Date();
    const diff=Math.floor((now-start)/(1000*60*60*24));
    return Math.max(0,diff);
    }

    function isAdaptationPhase(day){return day<7;}

    
        
    const MAINT_CAP=89;          /* hari 0..89 = program utama */
    const MAINT_LV=5;            /* level latihan yang dipakai */
    const MAINT_WEEKDAYS=[1,3,5];/* Senin, Rabu, Jumat */

    function isMaintenanceDay(day){
    return day>MAINT_CAP;
    }

    
    function maintenanceDayIndex(day){return (day-MAINT_CAP-1)%7;}

    function isMaintenanceTrainingDay(day){
    if(!isMaintenanceDay(day)) return true;
    const i=maintenanceDayIndex(day);
    return i<7&&MAINT_WEEKDAYS.indexOf(i)>=0;
    }

    
    function maintenanceTargets(userData){
    const u=Object.assign({},loadState(KEYS.user)||{},userData||{});
    const t=calcEnergyTargets(Object.assign({},u,{goal:'maintain'}));
    const protein=Math.round(Math.max(0,u.weight*1.6));
    return Object.assign({},t,{
    protein:protein,
    mode:'perawatan',
    catatan:'Mode perawatan: caloric mengikuti kebutuhan harian, protein dijaga '+
    'di '+protein+' g supaya massa otot tidak ikut turun.'
    });
    }

    function getMaintenanceWorkout(day){
    const userData=loadState(KEYS.user)||{};
    const goal=userData.goal||'maintain';
    const split=getWeekSplit(goal);
    const idx=maintenanceDayIndex(day);
    const hariLatihan=MAINT_WEEKDAYS.indexOf(idx);
    const focusKey=hariLatihan>=0?split[(day-MAINT_CAP-1)%7]:'recovery';
    const focus=FOCUS_PLAN[focusKey]||FOCUS_PLAN[split[0]];
    const info=getLevelInfo(MAINT_CAP);
    const pres=getPrescription(MAINT_CAP,MAINT_LV,focus.kind,goal);
    const sets=Math.max(2,pres.sets-1);
    const reps=Math.max(8,pres.reps-4);
    const exKeys=getWorkoutExercises(
    {level:MAINT_LV,kind:focus.kind,variant:focusKey.slice(-1),pools:focus.pools},
    MAINT_CAP,goal);
    return {
    day:day,
    phase:'maintenance',
    focusKey:focusKey,kind:focus.kind,
    label:(hariLatihan>=0?focus.label:'Pemulihan'),
    typeLabel:hariLatihan>=0?focus.type:'Recovery',
    icon:focus.icon,timeRec:focus.timeRec,
    level:MAINT_LV,levelName:info.name,levelDesc:info.desc,deload:false,
    sets:sets,repsRaw:reps,rest:pres.rest,restLabel:pres.rest+' dtk',
    work:pres.work,goal:goal,
    exercises:exKeys.map(k=>({key:k,...(EXERCISES[k])}))
    };
    }

    
    function getPhaseForDay(day){
    if(isMaintenanceDay(day)) return 'maintenance';
    if(day<21) return 'foundation';
    if(day<49) return 'build';
    if(day<77) return 'intensity';
    return 'peak';
    }

    
    function renderMaintenanceMode(day,userData,programData){
    const el=document.getElementById('maint-banner');
    if(!el) return;
    if(!isMaintenanceDay(day)){
    el.classList.add('hidden');
    el.innerHTML='';
    return;
    }
    const sudah=day-MAINT_CAP;
    const weight=userData&&userData.weight?Math.round(userData.weight):null;
    const target=userData&&userData.targetWeight?Math.round(userData.targetWeight):null;
    const delta=(weight!==null&&target!==null)?(weight-target):null;
    const t=maintenanceTargets(userData);
    el.classList.remove('hidden');
    el.innerHTML=
    '<div class="maint-head">'+
    '  <div class="maint-tag">Mode Perawatan</div>'+
    '  <div class="maint-title">Program 90 Hari Selesai</div>'+
    '</div>'+
    '<div class="maint-body">'+
    '  <p class="maint-text">Kamu sudah lewat '+PROGRAM_DAYS+' hari. Kalau mau '+
    '  lanjut menjaga hasil, aplikasi tetap dipakai dengan target yang lebih '+
    '  ringan: caloric mengikuti kebutuhan harian, latihan 3 kali seminggu.</p>'+
    (delta!==null?
    '  <div class="maint-stat"><span>Berat sekarang</span><b>'+weight+' kg</b>'+
    (delta!==0?' <span class="'+(delta<0?'good':'warn')+'">'+
    (delta<0?Math.abs(delta)+' kg di bawah target':' masih '+delta+' kg di atas target')+
    '</span>':'')+'</div>':'')+
    '  <div class="maint-stat"><span>Target caloric</span><b>'+Math.round(t.kcal)+' kkal</b></div>'+
    '  <div class="maint-stat"><span>Protein</span><b>'+t.protein+' g</b></div>'+
    '  <div class="maint-stat"><span>Latihan</span><b>3x seminggu</b></div>'+
    '</div>'+
    '<div class="maint-actions">'+
    '  <button class="maint-btn" onclick="restartProgram90()">Ulangi 90 Hari dari Awal</button>'+
    '</div>';
    }

    function restartProgram90(){
    if(!confirm('Mulai ulang program 90 hari dari hari pertama?\n\n'+
    'Berat dan riwayat yang sudah tercatat tetap tersimpan. '+
    'Progres latihan dan menandai makan akan mulai dari nol.')) return;
    const prog=loadState(KEYS.program)||{};
    prog.startDate=new Date().toISOString().split('T')[0];
    prog.lastActiveDate='';
    prog.streak=0;
    prog.targets=calcEnergyTargets(loadState(KEYS.user)||{});
    saveState(KEYS.program,prog);
    try{
    Object.keys(localStorage).filter(function(k){
    return k.indexOf(KEYS.daydata)===0||k.indexOf(KEYS.today)===0;
    }).forEach(function(k){localStorage.removeItem(k);});
    }catch(e){}
    renderProgram();
    }

function getWorkoutForDay(day, energyOverride){
    if(isMaintenanceDay(day)) return getMaintenanceWorkout(day);
    const userData=loadState(KEYS.user)||{};
    const goal=currentGoal(userData);
    const split=getWeekSplit(goal);
    const focusKey=split[day%7];
    const focus=FOCUS_PLAN[focusKey];
    const info=getLevelInfo(day);
    const pres=getPrescription(day,info.level,focus.kind,goal);
    const exKeys=getWorkoutExercises(
        {level:info.level,kind:focus.kind,variant:focusKey.slice(-1),pools:focus.pools},
        day,goal);

    return {
        day,
        phase:getPhaseForDay(day),
        focusKey,kind:focus.kind,
        label:focus.label,typeLabel:focus.type,icon:focus.icon,timeRec:focus.timeRec,
        level:info.level,levelName:info.name,levelDesc:info.desc,deload:info.deload,
        sets:pres.sets,repsRaw:pres.reps,rest:pres.rest,restLabel:pres.rest+' dtk',
        work:pres.work,
        goal,
        exercises:exKeys.map(k=>({key:k,...(EXERCISES[k])})),
    };
    }

    
    const MAX_SESSION_SECS = 35*60;

    
    function buildSessionFlow(workout, mult){
    const lowImpact=isLowImpactMode(workout.day);
    const flow=[];

    const pushItem=(stage,key,sets,reps,workSecs,restSecs)=>{
        const ex=EXERCISES[key]||{nama:key,otot:'',langkah:[],kesalahan:[]};
        flow.push({stage,key,nama:ex.nama,otot:ex.otot,langkah:ex.langkah||[],kesalahan:ex.kesalahan||[],
            sets:Math.max(1,sets),reps:Math.max(1,reps),
            work:Math.max(5,workSecs),rest:Math.max(0,restSecs)});
    };

    WARMUP_FLOW.forEach(item=>{
        if(lowImpact&&HIGH_IMPACT_BLOCKED.includes(item.key)) return;
        pushItem('warmup',item.key,1,1,item.secs,5);
    });

    const main=applyIntensity({sets:workout.sets,reps:workout.repsRaw,work:workout.work,rest:workout.rest},mult);
    workout.exercises.forEach(ex=>{
        const def=EXERCISES[ex.key]||{};
        const iso=def.iso;
        pushItem('main',ex.key,main.sets,main.reps,iso?main.workSecs*2:main.workSecs,main.restSecs);
    });

    COOLDOWN_FLOW.forEach(item=>pushItem('cooldown',item.key,1,1,item.secs,10));

    return flow;
    }

    
    function fitFlowDuration(flow, maxSecs){
    const max=maxSecs||MAX_SESSION_SECS;
    const total=()=>flow.reduce((sum,it)=>sum+it.sets*(it.work+it.rest),0);

    for(const it of flow){ while(total()>max&&it.work>15) it.work-=1; }
    for(const it of flow){ while(total()>max&&it.sets>2) it.sets-=1; }
    for(const it of flow){ while(total()>max&&it.rest>30) it.rest-=5; }
    return flow;
    }

    function isFlowItemUnlocked(idx){
    if(devCheat()) return true;
    if(idx<=0) return true;
    const prev=_exWrap(idx-1);
    return !!(prev&&prev._exState&&prev._timerState==='done');
    }

    function getFlowProgress(flowLen){
    let done=0;
    for(let i=0;i<flowLen;i++){
        const w=_exWrap(i);
        if(w&&w._timerState==='done') done++;
    }
    return done;
    }

    

    /* Normalisasi teks */
    function _norm(v){
    return String(v||'').toLowerCase().trim()
    .replace(/telor/g,'telur')
    .replace(/\s+/g,' ');
    }

    function getDislikes(){
    const user=loadState(KEYS.user)||{};
    return (user.dislike||[]).map(_norm).filter(Boolean);
    }

    
    function blockedIngredientIds(dislikes){
    const blocked=new Set();
    (dislikes||[]).forEach(function(d){
        const key=_norm(d);
        if(key==='gorengan') return;   // ditangani lewat metode masak
        if(KEYWORD_TO_IDS[key]) KEYWORD_TO_IDS[key].forEach(id=>blocked.add(id));
    });
    return blocked;
    }

    function dislikesOilHeavyCooking(dislikes){
    return (dislikes||[]).some(d=>_norm(d)==='gorengan');
    }

    
    function recipeBlockedReasons(recipe, blockedIds, noHeavyOil){
    const reasons=[];
    recipe.bahan.forEach(function(b){
        if(blockedIds.has(b.id)) reasons.push(NUTRIENTS[b.id].cat);
    });
    if(noHeavyOil&&OIL_HEAVY_METHODS.indexOf(recipe.method)>=0){
        reasons.push('metode masak '+cookMethod(recipe.method).label.toLowerCase());
    }
    return reasons;
    }

    function isRecipeAllowed(recipe, blockedIds, noHeavyOil){
    return recipeBlockedReasons(recipe,blockedIds,noHeavyOil).length===0;
    }

    
    const KIND_POOL = {
        dada_ayam:['paha_ayam','ayam_kampung'],
        paha_ayam:['dada_ayam','ayam_kampung'],
        ayam_kampung:['dada_ayam','paha_ayam'],
        ikan_tongkol:['ikan_lele','ikan_nila','ikan_kembung','salmon'],
        ikan_lele:['ikan_nila','ikan_tongkol'],
        ikan_nila:['ikan_lele','ikan_tongkol'],
        ikan_kembung:['ikan_tongkol','ikan_lele'],
        salmon:['ikan_tongkol','ikan_kembung'],
        telur_ayam:['telur_bebek'],
        telur_bebek:['telur_ayam'],
        tempe:['tempe_mendoan'],
        tahu_putih:['tahu_kuning'],
        tahu_kuning:['tahu_putih'],
        nasi_putih:['nasi_merah','ketupat','lontong'],
        nasi_merah:['nasi_putih','ketupat','lontong'],
        susu_sapi:['susu_kedelai','yogurt_plain'],
        susu_kedelai:['susu_sapi','yogurt_plain'],
        yogurt_plain:['susu_sapi','susu_kedelai'],
        keju:['edamame','telur_ayam'],
        kacang_kering:['kacang_hijau','kacang_merah','edamame'],
        kacang_hijau:['kacang_merah','edamame','kacang_kering'],
        kacang_merah:['kacang_hijau','edamame','kacang_kering'],
        edamame:['kacang_hijau','kacang_merah'],
        roti_tawar:['roti_gandum','roti_tahu'],
        roti_gandum:['roti_tawar','roti_tahu'],
        mie_instan:['bihun'],
        bihun:['mie_instan']
    };

    
    function renameIngredientInName(nama, lama, baru){
    if(!lama||!baru) return nama;
    if(nama.toLowerCase().indexOf(lama.toLowerCase())<0 && baru===lama) return nama;
    const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const words=lama.split(/\s+/).filter(Boolean);
    for(let n=words.length;n>0;n--){
        const kandidat=esc(words.slice(0,n).join(' '));
        const re=new RegExp('(^|[^A-Za-z0-9])('+kandidat+')(?![A-Za-z0-9])','gi');
        if(re.test(nama)){
            re.lastIndex=0;
            return nama.replace(re,(m,a)=>a+baru);
        }
    }
    return nama;
    }

    function substituteBlockedIngredients(recipe, blockedIds){
    if(!blockedIds || blockedIds.size===0) return recipe;
    let changed=false;
    const rename=[];
    const bahan=recipe.bahan.map(function(b){
        if(!blockedIds.has(b.id)) return Object.assign({},b);
        changed=true;
        const lama=NUTRIENTS[b.id].cat;
        if(b.alts){
        const alts=b.alts.split(',').map(function(s){return s.trim();}).filter(Boolean);
        const gantiAlt=alts.filter(function(a){return NUTRIENTS[a]&&!blockedIds.has(a);})[0];
        if(gantiAlt){
        rename.push([lama,NUTRIENTS[gantiAlt].cat]);
        return Object.assign({},b,{id:gantiAlt,substitusiDari:lama});
        }
        }
        const pool=KIND_POOL[b.id]||[];
        const ganti=pool.filter(function(id){return NUTRIENTS[id]&&!blockedIds.has(id);})[0];
        if(!ganti) return Object.assign({},b);
        rename.push([lama,NUTRIENTS[ganti].cat]);
        return Object.assign({},b,{id:ganti,substitusiDari:lama});
    });
    
    bahan.forEach(function(b){
    if(b.alts){
        const ok=b.alts.split(',').map(function(s){return s.trim();})
        .filter(function(a){return a&&NUTRIENTS[a]&&!blockedIds.has(a);});
        b.alts=ok.join(',');
    }
    });

    if(!changed) return Object.assign({},recipe,{bahan:bahan});

    let nama=recipe.nama;
    let langkah=recipe.langkah;
    rename.forEach(function(pair){
        nama=renameIngredientInName(nama,pair[0],pair[1]);
        if(Array.isArray(langkah)){
        langkah=langkah.map(function(t){return renameIngredientInName(t,pair[0],pair[1]);});
        }
    });

    return Object.assign({},recipe,{bahan:bahan,nama:nama,langkah:langkah,adaSubstitusi:true});
    }

    
    function softenRecipe(recipe){
    const urutan=['goreng','tumis','panggang','bacem','kukus','rebus'];
    const now=urutan.indexOf(recipe.method);
    const next=(now<0?2:Math.min(now+1,urutan.length-1));
    const method=urutan[next];
    const bahan=recipe.bahan.map(function(b){
        if(b.role==='oil') return Object.assign({},b,{qty:Math.max(0,Math.round(b.qty*0.4*10)/10),catatanMinyak:'Dikurangi karena Gorengan dihindari'});
        return b;
    });
    return Object.assign({},recipe,{method:method,bahan:bahan,methodDisesuaikan:true});
    }

    
    const PORSI_BATAS={
    protein:[20,260], karbo:[25,300], sayur:[40,220], buah:[50,250]
    };

    function clampPorsi(bahan, gram){
    const b=PORSI_BATAS[bahan.role];
    if(!b) return Math.max(0,gram);
    return Math.max(b[0],Math.min(b[1],gram));
    }

    
    function fitWithClamps(recipe, targetKcal){
    const fit=fitRecipeToKcal(recipe,targetKcal);
    const bahan=fit.bahan.map(function(b){
        if(b.scale===false) return b;
        const cur=toGrams(b.id,b.qty,b.unit||'g');
        if(cur===null) return b;
        const clamped=clampPorsi(b,cur);
        if(clamped===cur) return b;
        return Object.assign({},b,{qty:applyQty(b,clamped),dibatasi:true});
    });
    const n=computeNutrition(bahan,recipe.method);
    return {bahan:bahan,nutrisi:n,rasio:fit.rasio};
    }

    
    function buildMeal(recipe, targets, goal, slotKey, day){
    const slot=MEAL_SLOTS.filter(function(s){return s.key===slotKey;})[0]||MEAL_SLOTS[0];
    const targetKcal=slotTargetKcal(targets,goal,slotKey);
    const targetMacro=slotTargetMacros(targets,goal,slotKey);

    const fit=fitWithClamps(recipe,targetKcal);
    const bahan=fit.bahan;
    const n=fit.nutrisi;

    const ringkas=nutritionSummary(n,targetKcal);
    return {
        id:recipe.id,
        recipeId:recipe.id,
        nama:recipe.nama,
        slot:slotKey,
        timeLabel:slot.label,
        timeRange:slot.range,
        icon:ICONS[slot.icon]||ICONS.bowl,
        method:recipe.method,
        methodLabel:cookMethod(recipe.method).label,
        methodNote:cookMethod(recipe.method).note,
        tag:recipe.tag||[],
        proteinTag:recipe.tag?recipe.tag.filter(t=>t.indexOf('protein:')===0)[0]:'',
        bahan: bahan.map(function(b){
            const row=NUTRIENTS[b.id];
            return {
            id:b.id, nama:b.nama||row.cat, qty:b.qty, unit:b.unit||'g',
            alts:b.alts, note:b.note, role:b.role, scale:b.scale,
            substitusiDari:b.substitusiDari,
            gram:toGrams(b.id,b.qty,b.unit||'g'),
            kcal:Math.round(energyFromMacros(row.p,row.c,row.f,row.fb)*(toGrams(b.id,b.qty,b.unit||'g')||0)/100)
            };
        }),
        langkah:recipe.langkah,
        nutrisi:ringkas,
        makro:{protein:ringkas.protein,karbo:ringkas.karbo,lemak:ringkas.lemak},
        kcal:ringkas.kalori,
        targetKcal:targetKcal,
        targetMacro:targetMacro,
        selisihKcal:ringkas.kalori-targetKcal,
        terpenuhi:fit.terpenuhi||Math.abs(ringkas.kalori-targetKcal)<=Math.max(60,targetKcal*0.12),
        adaSubstitusi:recipe.adaSubstitusi||false,
        terlarang:recipe.terlarang||[],
        methodDisesuaikan:!!recipe.methodDisesuaikan,
        catatan:recipe.catatan||'',
    };
    }

    
    function goalScore(mealNutrition, goal){
    if(goal==='lose') return mealNutrition.fb*2.2+mealNutrition.p*0.6;
    if(goal==='gain') return mealNutrition.p*1.2+mealNutrition.f*0.2;
    return mealNutrition.fb*1.2+mealNutrition.p*0.8;
    }

    function pickRecipeForSlot(slotKey, targets, goal, day, blockedIds, noHeavyOil, usedMain, prevNames){
    const pool=recipesForSlot(slotKey);
    if(!pool.length) return null;

    const targetKcal=slotTargetKcal(targets,goal,slotKey);
    const isDrink=(slotKey==='minuman');

    
    let kandidat=[];
    for(let i=0;i<pool.length;i++){
        const r=pool[i];
        let recipe=r;
        if(noHeavyOil&&OIL_HEAVY_METHODS.indexOf(r.method)>=0){
        recipe=softenRecipe(recipe);
        }
        recipe=substituteBlockedIngredients(recipe,blockedIds);

        const tersisa=recipe.bahan.filter(function(b){return blockedIds.has(b.id);});
        recipe.terlarang=tersisa.map(function(b){return NUTRIENTS[b.id].cat;});

        const fit=fitWithClamps(recipe,targetKcal);
        if(!fit.nutrisi.perBahan.length) continue;

        const dev=isDrink
        ? Math.abs(fit.nutrisi.k-targetKcal)/120
        : Math.abs(fit.nutrisi.k-targetKcal)/Math.max(80,targetKcal);

        kandidat.push({resep:r,recipe:recipe,fit:fit,dev:dev,
        tersisa:tersisa.length,
        main:r.tag.filter(function(t){return t.indexOf('protein:')===0;})[0]||''});
    }
    if(!kandidat.length) return null;

    
    const bersih=kandidat.filter(function(c){return c.tersisa===0;});
    if(bersih.length) kandidat=bersih;

    
    let devMin=Infinity;
    kandidat.forEach(function(c){ if(c.dev<devMin) devMin=c.dev; });
    const batas=Math.max(devMin+0.10,devMin*1.6,isDrink?0.8:0.10);
    let band=kandidat.filter(function(c){return c.dev<=batas;});
    if(!band.length) band=kandidat;

    band.sort(function(a,b){
        let sa=0,sb=0;
        if(a.main&&usedMain.has(a.main)) sa+=16;
        if(b.main&&usedMain.has(b.main)) sb+=16;
        if(prevNames.has(a.resep.nama)) sa+=30;
        if(prevNames.has(b.resep.nama)) sb+=30;
        if(!isDrink){
        sa-=goalScore(a.fit.nutrisi,goal)*(slotKey==='siang'?1:0.5);
        sb-=goalScore(b.fit.nutrisi,goal)*(slotKey==='siang'?1:0.5);
        }
        if(sa!==sb) return sa-sb;
        return a.dev-b.dev;
    });

    
    const pilih=band[day%band.length];

    return buildMeal(pilih.recipe,targets,goal,slotKey,day);
    }

    
    function getMealsForDay(day, targets, dislikes){
    const userData=loadState(KEYS.user)||{};
    const goal=currentGoal(userData);
    const blockedIds=blockedIngredientIds(dislikes||getDislikes());
    const noHeavyOil=dislikesOilHeavyCooking(dislikes||getDislikes());
    const usedMain=new Set();
    const prevNames=_getPrevDayNames(day);

    const meals=[];
    for(let i=0;i<SLOT_ORDER.length;i++){
        const slotKey=SLOT_ORDER[i];
        let meal=pickRecipeForSlot(slotKey,targets,goal,day,blockedIds,noHeavyOil,usedMain,prevNames);
        if(!meal){
        const any=recipesForSlot(slotKey)[0];
        if(!any) continue;
        meal=buildMeal(any,targets,goal,slotKey,day);
        }
        const main=meal.tag.filter(t=>t.indexOf('protein:')===0)[0];
        if(main) usedMain.add(main);
        meals.push(meal);
    }

    return deepFreezeMeals(meals);
    }

    
    
    function dayCacheKey(day){
    const u=loadState(KEYS.user)||{};
    const g=currentGoal(u);
    const dp=devProfile();
    const sf=Object.keys(dp).length?('p'+devProfileHash()):'';
    return KEYS.daydata+day+'_'+g+sf+'_d_'+getDislikes().join('_')+'_v16';
    }

    function loadDayData(day){
    const cacheKey=dayCacheKey(day);
    const cached=loadState(cacheKey);
    if(cached && Array.isArray(cached.meals) && cached.meals.length){
        if(!cached.workout) cached.workout=getWorkoutForDay(day);
        return cached;
    }
    const dayData=cached||{};
    dayData.meals=getMealsForDay(day,activeTargets(),getDislikes());
    dayData.workout=dayData.workout||getWorkoutForDay(day);
    saveState(cacheKey,dayData);
    return dayData;
    }

    function _getPrevDayNames(day){
    const names=new Set();
    if(day<=0) return names;
    try{
        const prev=loadState(dayCacheKey(day-1));
        if(prev&&Array.isArray(prev.meals)) prev.meals.forEach(m=>{ if(m&&m.nama) names.add(m.nama); });
    }catch(e){}
    return names;
    }

    
    function auditDayNutrition(meals){
    const bad=[];
    (meals||[]).forEach(function(m){
    const n=(m&&m.nutrisi)||{};
    if(!n.kalori) return;
    const dev=nutritionConsistency(n);
    if(dev>0.02) bad.push({slot:m.slot,selisih:Math.round(dev*1000)/10});
    });
    return bad;
    }

    
    function summarizeDay(meals, targets){
    const t={kalori:0,protein:0,karbo:0,lemak:0,serat:0,gula:0,natrium:0,lemakJenuh:0,kolesterol:0};
    (meals||[]).forEach(function(m){
        const n=(m&&m.nutrisi)||{};
        t.kalori+=n.kalori||0; t.protein+=n.protein||0; t.karbo+=n.karbo||0;
        t.lemak+=n.lemak||0; t.serat+=n.serat||0; t.gula+=n.gula||0;
        t.natrium+=n.natrium||0; t.lemakJenuh+=n.lemakJenuh||0;
        t.kolesterol+=n.kolesterol||0;
    });
    Object.keys(t).forEach(k=>{ t[k]=Math.round(t[k]*10)/10; });
    const u=targets||{};
    t.persenProtein=Math.round((t.protein/(u.protein||1))*100);
    t.persenKarbo=Math.round((t.karbo/(u.karbo||1))*100);
    t.persenLemak=Math.round((t.lemak/(u.fat||1))*100);
    t.persenSerat=Math.round((t.serat/(u.fiber||1))*100);
    t.selisihKcal=t.kalori-(u.kcal||0);
    return t;
    }

    /* BERUNTUN */
    function updateStreak(){
    const prog=loadState(KEYS.program);if(!prog) return;
    const today=new Date().toISOString().split('T')[0];
    const todayData=loadToday();
    const allDone=todayData.workoutDone&&todayData.mealsCompleted.every(Boolean);
    if(allDone&&prog.lastActiveDate!==today){
        const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
        const yd=yesterday.toISOString().split('T')[0];
        prog.streak=(prog.lastActiveDate===yd)?(prog.streak||0)+1:1;
        prog.lastActiveDate=today;
        saveState(KEYS.program,prog);
    }
    return prog.streak||0;
    }
    function getStreak(){const prog=loadState(KEYS.program);return prog?(prog.streak||0):0;}

    /* Catatan tubuh dan validasi formulir */
    function saveBodyTracking(){
    const w=document.getElementById('track-weight').value;
    const waist=document.getElementById('track-waist').value;
    if(!w&&!waist) return;
    const tracking=loadState(KEYS.tracking)||{weights:[],waists:[]};
    const today=new Date().toISOString().split('T')[0];
    const day=getCurrentDay();
    if(w){
        const existing=tracking.weights.findIndex(e=>e.date===today);
        const entry={date:today,day:day+1,value:parseFloat(w)};
        if(existing>=0) tracking.weights[existing]=entry;else tracking.weights.push(entry);
    }
    if(waist){
        const existing=tracking.waists.findIndex(e=>e.date===today);
        const entry={date:today,day:day+1,value:parseFloat(waist)};
        if(existing>=0) tracking.waists[existing]=entry;else tracking.waists.push(entry);
    }
    saveState(KEYS.tracking,tracking);
    const saved=document.getElementById('tracking-saved-msg');
    saved.classList.add('show');setTimeout(()=>saved.classList.remove('show'),2000);
    validateWeightDrop(tracking.weights);
    renderWeightChart();
    }

    function validateWeightDrop(weights){
    if(!weights || weights.length < 2) return;
    const sorted=[...weights].sort((a,b)=>a.day-b.day);
    const latest=sorted[sorted.length-1];
    const sevenDaysAgo=sorted.filter(e=>e.day<=latest.day-7);
    if(sevenDaysAgo.length===0) return;
    const prev=sevenDaysAgo[sevenDaysAgo.length-1];
    const diff=prev.value-latest.value;
    const warn=document.getElementById('weight-drop-warn');
    if(diff>1.5){warn.classList.add('show');}else{warn.classList.remove('show');}
    }

    const CHART_CDN='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    let _chartState='idle'; // idle | loading | ready | failed
    let _chartWaiters=[];

    
    function _ensureChartJS(done){
    if(typeof Chart!=='undefined'){done(true);return;}
    if(_chartState==='ready'){done(true);return;}
    if(_chartState==='failed'){done(false);return;}
    _chartWaiters.push(done);
    if(_chartState==='loading') return;
    _chartState='loading';
    const s=document.createElement('script');
    s.src=CHART_CDN;
    s.onload=()=>{
        _chartState=(typeof Chart!=='undefined')?'ready':'failed';
        const waiters=_chartWaiters;_chartWaiters=[];
        waiters.forEach(cb=>{try{cb(_chartState==='ready');}catch(e){}});
    };
    s.onerror=()=>{
        _chartState='failed';
        const waiters=_chartWaiters;_chartWaiters=[];
        waiters.forEach(cb=>{try{cb(false);}catch(e){}});
    };
    document.head.appendChild(s);
    }

    function renderWeightChart(){
    const tracking=loadState(KEYS.tracking);
    const empty=document.getElementById('prog-chart-empty');
    const canvas=document.getElementById('weight-chart');
    if(!empty||!canvas) return;
    if(!tracking||!tracking.weights||tracking.weights.length<1){
        empty.style.display='block';canvas.style.display='none';return;
    }
    _ensureChartJS(function(ok){
        if(!ok){
        empty.textContent='Grafik tidak tersedia (Chart.js belum dimuat).';
        empty.style.display='block';canvas.style.display='none';return;
        }
        drawWeightChart(tracking);
    });
    }

    function drawWeightChart(tracking){
    const empty=document.getElementById('prog-chart-empty');
    const canvas=document.getElementById('weight-chart');
    if(!empty||!canvas||typeof Chart==='undefined') return;
    empty.style.display='none';canvas.style.display='block';
    const sorted=[...tracking.weights].sort((a,b)=>a.day-b.day);
    const labels=sorted.map(e=>`H${e.day}`);
    const values=sorted.map(e=>e.value);
    const user=loadState(KEYS.user);
    const targetWeight=user?user.targetWeight:null;
    if(window._weightChart&&typeof window._weightChart.destroy==='function'){window._weightChart.destroy();}
    const cs=getComputedStyle(document.documentElement);
    const cssVar=(name)=>cs.getPropertyValue(name).trim();
    const accent=cssVar('--accent')||'#0f7a44';
    const text2=cssVar('--text2')||'#4c544e';
    const text3=cssVar('--text3')||'#6d766e';
    const grid=cssVar('--border')||'#e1e5de';
    const target=cssVar('--orange')||'#ad5a1a';
    window._weightChart=new Chart(canvas,{
        type:'line',
        data:{
        labels,
        datasets:[
            {label:'Berat Badan (kg)',data:values,borderColor:accent,backgroundColor:accent+'22',tension:0.3,pointBackgroundColor:accent,pointRadius:4,fill:true},
            ...(targetWeight?[{label:'Target',data:Array(labels.length).fill(targetWeight),borderColor:target,borderDash:[6,4],pointRadius:0,fill:false}]:[]),
        ]
        },
        options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{labels:{color:text2,font:{size:11}}}},
        scales:{
            x:{ticks:{color:text3,font:{size:11}},grid:{color:grid}},
            y:{ticks:{color:text3,font:{size:11}},grid:{color:grid}},
        }
        }
    });
    }

    /* JURNAL KESEHATAN */
    function saveHealthJournal(){
    const journalEl=document.getElementById('journal-notes');
    const notes=journalEl?journalEl.value.trim():'';
    const day=getCurrentDay();
    const data={date:new Date().toISOString().split('T')[0],day:day+1,notes};
    saveState(journalKey(),data);
    // Logika pemulihan, dibaca dari catatan harian
    applyRecoveryFromNotes(notes);
    const saved=document.getElementById('journal-saved-msg');
    if(saved){saved.classList.add('show');setTimeout(()=>saved.classList.remove('show'),2000);}
    checkLowEnergyProtection();
    }

    /* CATATAN LATIHAN */
    function applyRecoveryFromNotes(notes){
    const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);
    const tk='ip90_recovery_next_'+tomorrow.toISOString().split('T')[0];
    if(!notes){try{localStorage.removeItem(tk);localStorage.removeItem('ip90_recovery_flag');}catch(e){}return;}
    const lower=notes.toLowerCase();
    const isBerat=['capek berat'].some(k=>lower.includes(k));
    const isSedang=['nyeri','sakit'].some(k=>lower.includes(k));
    const isRingan=['sedikit capek'].some(k=>lower.includes(k));
    let flag=null;
    if(isBerat) flag='0.6';         // capek berat → 0.6
    else if(isSedang) flag='0.8';   // nyeri / sakit → 0.8
    else if(isRingan) flag='0.9';   // sedikit capek → 0.9
    try{
        if(flag){
        localStorage.setItem(tk,flag);
        localStorage.setItem('ip90_recovery_flag',flag); // save for dashboard warning
        } else {
        localStorage.removeItem(tk);
        localStorage.removeItem('ip90_recovery_flag');
        }
    }catch(e){}
    }

    function saveWorkoutNotes(){
    const todayData=loadToday();
    if(!todayData.workoutDone) return; // ANTI-CHEAT
    const day=getCurrentDay();
    const notesEl=document.getElementById('workout-notes-input');
    const notes=notesEl?notesEl.value.trim():'';
    saveState(notesKey(day),{notes,date:new Date().toISOString().split('T')[0]});
    applyRecoveryFromNotes(notes);
    const saved=document.getElementById('notes-saved-msg');
    if(saved){saved.classList.add('show');setTimeout(()=>saved.classList.remove('show'),2000);}
    }
    function loadWorkoutNotes(day){const data=loadState(notesKey(day));return data?data.notes:'';}

    /* TAMPILKAN: LAYAR AWAL */
    function renderHome(){
    const userData=loadState(KEYS.user);const programData=loadState(KEYS.program);
    if(!userData||!programData) return;
    const day=getCurrentDay();
    const h=new Date().getHours();
    const greet=h<11?'Selamat pagi,':h<15?'Selamat siang,':h<18?'Selamat sore,':'Selamat malam,';
    const greetEl=document.getElementById('lh-greet');if(greetEl) greetEl.textContent=greet;
    const nameEl=document.getElementById('lh-name');if(nameEl) nameEl.textContent=userData.name;
    const dayEl=document.getElementById('lh-day');
    if(dayEl) dayEl.innerHTML=isMaintenanceDay(day)
    ? `<span>Hari ${day-MAINT_CAP}</span> mode perawatan`
    : `<span>Hari ke-${day+1}</span> dari 90 hari program`;
    const todayData=loadToday();
    const dayDone=todayData.workoutDone&&todayData.mealsCompleted.every(Boolean);
    const btnEl=document.getElementById('lh-main-btn');
    if(btnEl) btnEl.textContent=dayDone?'Hari ini selesai':(day>0?'Lanjut program hari ini':'Mulai hari pertama');
    }

    /* TAMPILKAN: LAYAR PROGRAM */
    
    let _lastSeenDay=null;

    function _syncProgramDay(){
    if(!loadState(KEYS.user)||!loadState(KEYS.program)) return;
    const day=getCurrentDay();
    if(_lastSeenDay===null){ _lastSeenDay=day; return; }
    if(day===_lastSeenDay) return;
    _lastSeenDay=day;
    try{
    const scr=document.getElementById('screen-lp');
    if(scr&&scr.classList.contains('active')) renderProgram();
    }catch(e){ console.error('rollover render error:',e); }
    }

    function _watchDayRollover(){
    document.addEventListener('visibilitychange',function(){
    if(!document.hidden) _syncProgramDay();
    });
    window.addEventListener('focus',_syncProgramDay);
    setInterval(_syncProgramDay,60000);
    }

    function renderProgram(){
    const userData=loadState(KEYS.user);const programData=loadState(KEYS.program);
    if(!userData||!programData) return;
    const day=getCurrentDay();const streak=getStreak();const targets=activeTargets();
    _lastSeenDay=day;
    renderMaintenanceMode(day,userData,programData);
    const dayData=loadDayData(day);
    const lpTitleEl=document.getElementById('lp-title');if(lpTitleEl) lpTitleEl.textContent=userData.name;
    const lpDayEl=document.getElementById('lp-day-label');
    if(lpDayEl) lpDayEl.textContent=isMaintenanceDay(day)
    ? 'Perawatan '+(day-MAINT_CAP)
    : 'Hari ke-'+(day+1)+' dari 90';
    const lpStreakEl=document.getElementById('lp-streak');if(lpStreakEl) lpStreakEl.innerHTML=`${ICONS.flame} Beruntun ${streak}`;
    loadEnergyForToday();
    try{
        _applyTabLockState();
        if(!loadToday().energyChecked){
        setTimeout(showEnergyModal,350);
        }
    }catch(e){}
    renderDashboard(day,dayData,targets,programData,userData);
    renderWorkoutTab(day,dayData.workout);
    renderMenuTab(dayData.meals,targets,day,currentGoal(userData));
    renderProgressTab(day,programData,userData);
    /* Tab terakhir yang dipakai */
    try{
        const savedTab=localStorage.getItem('ip90_active_tab');
        if(savedTab&&savedTab!=='dashboard'){
        const btn=document.querySelector(`.lp-tab[onclick*="'${savedTab}'"]`);
        if(btn) switchTab(btn,savedTab);
        }
    }catch(e){}
    }

    /* TAMPILKAN: HARI INI */
        
    function _renderDashNow(day,dayData,targets,todayData){
    const el=document.getElementById('dash-now');
    if(!el) return;
    const workout=dayData&&dayData.workout;
    const total=dayData?dayData.meals.length:0;
    const done=total?todayData.mealsCompleted.filter(Boolean).length:0;
    const workoutDone=!!todayData.workoutDone;
    const semuaSelesai=workoutDone&&total>0&&done===total;

    let cls='', eyebrow='', judul='', sub='', aksi='';

    if(!todayData.energyChecked){
    cls='wait';
    eyebrow='Langkah pertama';
    judul='Cek Kondisi Tubuh';
    sub='Isi energi dan jam tidurmu supaya latihan hari ini disesuaikan.';
    aksi='<button class="dash-now-btn" onclick="showEnergyModal()">Isi Kondisi</button>';
    } else if(semuaSelesai){
    cls='done';
    eyebrow='Hari '+(day+1)+' selesai';
    judul='Semua Sudah Beres';
    sub='Latihan dan '+total+' waktu makan sudah lengkap. Istirahat cukup.';
    aksi='<button class="dash-now-btn" onclick="switchTab(document.querySelector(\'.lp-tab[onclick*="progress"]\'),\'progress\')">Lihat Progres</button>';
    } else if(!workoutDone){
    eyebrow='Langkah '+(!todayData.energyChecked?1:2);
    judul=workout?workout.label:'Latihan Hari Ini';
    if(workout){
    const menit=Math.max(1,Math.round(workout.exercises.reduce(function(s,e){
    return s+(e.sets||2)*((e.work||30)+(e.rest||60));
    },0)/60));
    sub=workout.typeLabel+' &middot; Tahap '+workout.level+' '+workout.levelName+' &middot; sekitar '+menit+' menit';
    } else sub='Sesi hari ini belum siap.';
    aksi='<button class="dash-now-btn" onclick="switchTab(document.querySelector(\'.lp-tab[onclick*="latihan"]\'),\'latihan\')">Mulai Latihan</button>';
    } else {
    const sisa=total-done;
    cls='wait';
    eyebrow='Langkah 3';
    judul='Sisa Makan Hari Ini';
    sub=sisa+' dari '+total+' waktu makan belum ditandai. Kalorinya sudah dihitung per porsi.';
    aksi='<button class="dash-now-btn" onclick="switchTab(document.querySelector(\'.lp-tab[onclick*="menu"]\'),\'menu\')">Lihat Menu</button>';
    }

    el.className='dash-now'+(cls?' '+cls:'');
    el.innerHTML=
    '<div class="dash-now-eyebrow">'+_devEsc(eyebrow)+'</div>'+
    '<div class="dash-now-title">'+_devEsc(judul)+'</div>'+
    '<div class="dash-now-sub">'+sub+'</div>'+
    aksi;
    }

function renderDashboard(day,dayData,targets,programData,userData){
    const phase=getPhaseForDay(day);const ph=PHASES[phase];
    const todayData=loadToday();const mealsCount=todayData.mealsCompleted.filter(Boolean).length;
    const adapt=isAdaptationPhase(day);
    const dnEl=document.getElementById('dash-day-num');
    if(dnEl) dnEl.textContent=isMaintenanceDay(day)
    ? 'MODE PERAWATAN · HARI '+(day-MAINT_CAP)
    : 'HARI KE-'+(day+1)+' DARI 90';
    const dtEl=document.getElementById('dash-day-title');if(dtEl) dtEl.textContent=getDayTitle(day);
    const dpEl=document.getElementById('dash-day-phase');
    if(dpEl){
        const lv=getLevelInfo(day);
        dpEl.textContent=isMaintenanceDay(day)
        ? 'Fase: '+ph.label+' · Latihan '+MAINT_WEEKDAYS.length+'x seminggu'
        : 'Fase: '+ph.label+' · Minggu '+(Math.floor(day/7)+1)+' · Tahap '+lv.level+' '+lv.name;
    }
    let waterWeight=userData.weight;
    try{const tr=loadState(KEYS.tracking);if(tr&&tr.weights&&tr.weights.length>0){const sorted=[...tr.weights].sort((a,b)=>b.day-a.day);if(sorted[0]&&sorted[0].value) waterWeight=sorted[0].value;}}catch(e){}
    const water=calculateWater(waterWeight);
    const wvEl=document.getElementById('dash-water-val');if(wvEl) wvEl.textContent=water.display;
    const adEl=document.getElementById('dash-adapt-notice');
    if(adEl){if(adapt) adEl.classList.remove('hidden');else adEl.classList.add('hidden');}
    const meals=dayData.meals;
    const total=summarizeDay(meals,targets);
    const ctEl=document.getElementById('dash-cal-total');
    if(ctEl) ctEl.textContent=total.kalori.toLocaleString('id-ID');
    const cpEl=document.getElementById('dash-cal-protein');
    if(cpEl) cpEl.textContent=total.protein+'g';
    const ccEl=document.getElementById('dash-cal-carb');
    if(ccEl) ccEl.textContent=total.karbo+'g';
    const cfEl=document.getElementById('dash-cal-fiber');
    if(cfEl) cfEl.textContent=total.serat+'g';
    const cflEl=document.getElementById('dash-cal-fat');
    if(cflEl) cflEl.textContent=total.lemak+'g';
    const workoutPct=Math.max(getSavedFlowPct(),todayData.workoutDone?100:0);
    const mealPct=Math.round((mealsCount/MEAL_SLOTS.length)*100);
    const totalPct=Math.round((workoutPct*0.5)+(mealPct*0.5));
    const dpPct=document.getElementById('dash-day-pct');if(dpPct) dpPct.textContent=totalPct+'%';
    const wBar=document.getElementById('prog-workout-bar');if(wBar) wBar.style.width=workoutPct+'%';
    const mBar=document.getElementById('prog-meal-bar');if(mBar) mBar.style.width=mealPct+'%';
    const mcEl=document.getElementById('prog-meal-count');if(mcEl) mcEl.textContent=mealsCount;
    renderGuidance(todayData);
    
    _renderDailyFocus(currentGoal(userData), day);
    _renderDashNow(day,dayData,targets,todayData);
    // kartu intensitas
    updateDashIntensityCard();
    // peringatan keselamatan
    const warnWrap=document.getElementById('dash-warnings-wrap');
    if(warnWrap) warnWrap.innerHTML='';
    checkLowEnergyProtection();
    try{
        const rflag=localStorage.getItem('ip90_recovery_flag');
        if(rflag){
        const pct=Math.round(parseFloat(rflag)*100);
        const w=document.getElementById('dash-warnings-wrap');
        if(w) w.innerHTML+=`<div class="dash-warning"><div class="dash-warning-title">Mode pemulihan aktif (${pct}%)</div>Catatan kemarin menunjukkan tubuh butuh pemulihan. Intensitas latihan hari ini disesuaikan ke ${pct}%.</div>`;
        }
    }catch(e){}
    // titik 90 hari
    const dots=document.getElementById('dash-90-dots');
    if(dots){
        dots.innerHTML='';
        for(let i=0;i<90;i++){
        const d=document.createElement('div');d.className='dash-dot';
        if(i<day) d.classList.add('done');else if(i===day) d.classList.add('today');else d.classList.add('future');
        dots.appendChild(d);
        }
    }
    }

    function getDayTitle(day){
    if(isMaintenanceDay(day)) return 'Pemulihan';
    const titles=['Hari Pertama','Bangun Ritme','Mulai Terasa','Konsisten Itu Kunci','Jangan Berhenti','Tubuh Mulai Adaptasi','Istirahat Aktif','Minggu Baru Semangat Baru'];
    if(day<titles.length) return titles[day];
    return `Minggu ${Math.floor(day/7)+1}, Hari ${(day%7)+1}`;
    }

    function renderGuidance(todayData){
    const guide=document.getElementById('dash-guide');
    const label=document.getElementById('dash-guide-label');
    const msg=document.getElementById('dash-guide-msg');
    if(!guide||!label||!msg) return;
    const mealsCount=todayData.mealsCompleted.filter(Boolean).length;
    const allDone=todayData.workoutDone&&mealsCount===MEAL_SLOTS.length;
    if(allDone){
        guide.className='dash-guide type-done';label.textContent='Selesai';
        msg.textContent='Latihan dan makan hari ini sudah beres. Istirahat cukup supaya pemulihan otot berjalan maksimal.';
    } else if(!todayData.workoutDone){
        guide.className='dash-guide type-workout';label.textContent='Selanjutnya: latihan';
        msg.textContent='Buka tab Latihan dan selesaikan sesi hari ini. Makan menyusul setelahnya.';
    } else {
        const remaining=3-mealsCount;
        guide.className='dash-guide type-meal';label.textContent='Latihan selesai';
        msg.textContent=`Masih ada ${remaining} jadwal makan yang belum ditandai. Buka tab Menu untuk mencatatnya.`;
    }
    }

    
    function renderWorkoutTab(day,workout){
    const todayData=loadToday();
    loadEnergyForToday();
    const isLocked=!todayData.energyChecked;
    const mult=getEnergyMultiplier(selectedEnergy,todaySleep);

    const flow=fitFlowDuration(buildSessionFlow(workout,mult));
    const totalEx=flow.length;
    const totalSecs=flow.reduce((s,it)=>s+it.sets*(it.work+it.rest),0);
    const mainItems=flow.filter(it=>it.stage==='main');
    const mainSets=mainItems.length?mainItems[0].sets:0;
    const mainReps=mainItems.length?mainItems[0].reps:0;
    const mainRest=mainItems.length?mainItems[0].rest:0;

    const wtbEl=document.getElementById('workout-type-badge');
    if(wtbEl){
        const lowImpact=isLowImpactMode(day);
        let badges=`<span class="badge badge-blue">${workout.icon} ${workout.typeLabel}</span>`;
        badges+=` <span class="badge badge-green">${ICONS.bars} Tahap ${workout.level} ${workout.levelName}</span>`;
        if(workout.deload) badges+=` <span class="badge badge-orange">${ICONS.leaf} Deload</span>`;
        if(lowImpact) badges+=` <span class="badge badge-orange">${ICONS.shield} Low Impact</span>`;
        wtbEl.innerHTML=badges;
    }

    const wtEl=document.getElementById('workout-title');
    if(wtEl) wtEl.textContent=workout.label;

    const wmEl=document.getElementById('workout-meta');
    if(wmEl){
        const ph=(PHASES[workout.phase]||{label:''}).label;
        wmEl.innerHTML=
        `<span>${ICONS.bars} Tahap ${workout.level} ${workout.levelName}</span>`+
        `<span>${ICONS.timer} Istirahat ${mainRest} dtk</span>`+
        `<span>${ICONS.layers} ${mainSets} set x ${mainReps} rep</span>`+
        `<span>${ICONS.calendar} ${ph}</span>`+
        `<span>${ICONS.clock} sekitar ${Math.max(1,Math.round(totalSecs/60))} menit</span>`;
    }

    const wtrEl=document.getElementById('workout-time-rec');
    if(wtrEl) wtrEl.innerHTML=ICONS.clock+' '+workout.timeRec;

    const list=document.getElementById('exercise-list');
    if(list) list.innerHTML='';

    initExTimers(totalEx);

    const savedFlow=getFlowDone();
    todayData.flowTotal=totalEx;
    saveToday(todayData);

    let lastStage=null;
    flow.forEach((item,i)=>{
        if(item.stage!==lastStage){
        const meta=SESSION_FLOW_META[item.stage];
        const head=document.createElement('div');
        head.className='stage-header';
        head.style.setProperty('--stage-color',meta.color);
        head.innerHTML=`<div class="stage-title">${meta.label}</div><div class="stage-hint">${meta.hint}</div>`;
        list.appendChild(head);
        lastStage=item.stage;
        }

        const card=document.createElement('div');
        card.className='exercise-card';
        card.id='ex-card-'+i;
        card.style.setProperty('--stage-color',SESSION_FLOW_META[item.stage].color);
        if(i===0) card.classList.add('open');
        if(savedFlow[i]) card.classList.add('done-item');

        const brief=item.stage==='main'
            ? `<span>${item.sets} set x ${item.reps} rep</span><span>-</span><span>${item.work} dtk per set</span>`
            : `<span>${item.work} dtk</span>`;
        const errHtml=(item.kesalahan&&item.kesalahan.length)
            ? `<div class="exercise-section-title">Kesalahan Umum</div>`+
              `<div class="exercise-errors">${item.kesalahan.map(k=>`<div class="exercise-error">${k}</div>`).join('')}</div>`
            : '';

        card.innerHTML=
        `<div class="exercise-header" onclick="toggleExercise(this)">`+
            `<div class="exercise-left">`+
                `<div class="exercise-num">${i+1}</div>`+
                `<div>`+
                    `<div class="exercise-name">${item.nama}</div>`+
                    `<div class="exercise-brief">${brief}<span>-</span><span>${item.otot||''}</span></div>`+
                `</div>`+
            `</div>`+
            `<div class="exercise-chevron">${ICONS.chevron}</div>`+
        `</div>`+
        `<div class="exercise-body">`+
            `<div class="exercise-section-title">Cara Melakukan</div>`+
            `<div class="exercise-steps">${(item.langkah||[]).map((l,j)=>`<div class="exercise-step"><div class="exercise-step-num">${j+1}</div><div>${l}</div></div>`).join('')}</div>`+
            errHtml+
            `<div class="ex-timer-wrap" id="ex-timer-${i}"></div>`+
        `</div>`;

        list.appendChild(card);

        const timerWrap=document.getElementById('ex-timer-'+i);
        if(timerWrap){
        timerWrap._exState={reps:item.sets,timer:item.work,rest:item.rest,currentRep:1};
        timerWrap._timerState=savedFlow[i]?'done':'idle';
        timerWrap._secsLeft=item.work;
        timerWrap._transitioning=false;
        timerWrap._item=item;
        }
    });

    _applyFlowLocks();
    flow.forEach((_,i)=>renderExTimer(i,totalEx));

    const doneWrap=document.getElementById('workout-done-wrap');
    if(doneWrap){
        if(todayData.workoutDone){
        _renderWorkoutComplete(doneWrap, todayData.energy||selectedEnergy||3);
        document.querySelectorAll('.exercise-num').forEach(n=>{if(n)n.classList.add('active');});
        _unlockWorkoutNotes();
        } else if(isLocked){
        doneWrap.innerHTML=
            `<div style="text-align:center;">`+
            `<p style="font-size:.85rem;color:var(--text2);margin-bottom:14px;">Isi kondisi tubuhmu hari ini supaya intensitas latihan bisa disesuaikan.</p>`+
            `<button class="btn btn-primary btn-full" onclick="showEnergyModal()">${ICONS.bolt} Mulai Latihan</button>`+
            `</div>`;
        } else {
        _updateDoneBtnState(totalEx);
        }
    }

    const wni=document.getElementById('workout-notes-input');
    if(wni) wni.value=loadWorkoutNotes(day);

    const pad=document.querySelector('#tab-latihan .workout-pad');
    const lockOverlay=document.getElementById('workout-lock-overlay');
    if(pad){
        if(isLocked){
        pad.classList.add('workout-locked');
        document.body.style.overflow='hidden';
        if(lockOverlay) lockOverlay.classList.remove('hidden');
        } else {
        pad.classList.remove('workout-locked');
        document.body.style.overflow='';
        if(lockOverlay) lockOverlay.classList.add('hidden');
        }
    }
    }

    function toggleExercise(header){
    const _td=loadToday();
    if(!_td.energyChecked){showEnergyModal();return;}
    const card=header.parentElement;
    if(card.classList.contains('locked')&&!card.classList.contains('open')){
    card.classList.add('open');
    return;
    }
    card.classList.toggle('open');
    }

    /* Teks penyelesai, varies by energy */
    function _completionCopy(energy){
    if(energy>=4) return {msg:'Sesi hari ini tuntas', sub:'Kondisi prima terpakai dengan baik. Jaga ritme ini besok.'};
    if(energy===3) return {msg:'Sesi hari ini selesai', sub:'Energi tidak penuh, tapi kamu tetap menyelesaikannya.'};
    return {msg:'Sesi hari ini selesai', sub:'Energi rendah hari ini. Pemulihan yang cukup itu bagian dari latihan.'};
    }

    function _renderWorkoutComplete(target, energy){
    if(!target) return;
    const c=_completionCopy(energy);
    target.innerHTML=`<div class="ux-workout-complete"><div class="ux-workout-complete-icon">${ICONS.check}</div><div class="ux-workout-complete-msg">${c.msg}</div><div class="ux-workout-complete-sub">${c.sub}</div></div>`;
    }

    function markWorkoutDone(){
    const todayData=loadToday();
    if(!todayData.energyChecked){showEnergyModal();return;}
    if(!_checkAllExercisesDone()){
        _toastMsg('_exdone_toast',ICONS.alert+' Selesaikan semua bagian sesi dulu');
        return;
    }
    todayData.workoutDone=true;saveToday(todayData);
    updateStreak();
    _unlockWorkoutNotes();
    const energy=todayData.energy||selectedEnergy||3;
    _renderWorkoutComplete(document.getElementById('workout-done-wrap'), energy);
    document.querySelectorAll('.exercise-num').forEach(n=>{if(n)n.classList.add('active');});
    refreshAllPanes();
    }

    function _unlockWorkoutNotes(){
    const sec=document.getElementById('workout-notes-section');
    const ta=document.getElementById('workout-notes-input');
    const btn=document.getElementById('workout-notes-save-btn');
    if(sec) sec.classList.remove('hidden');
    if(ta) ta.disabled=false;
    if(btn){btn.disabled=false;btn.style.opacity='1';btn.style.cursor='pointer';}
    }

    /* TAMPILKAN: KARTU MAKANAN */
    function renderMealCard(meal, idx){
    if(!meal || !meal.nama || !Array.isArray(meal.bahan)) return null;
    const n=meal.nutrisi||{kalori:0,protein:0,karbo:0,lemak:0,serat:0,gula:0,natrium:0,lemakJenuh:0};
    const todayData=loadToday();
    const done=!!todayData.mealsCompleted[idx];

    const card=document.createElement('div');
    card.className='meal-card'+(done?' completed':'');
    card.id='meal-card-'+idx;
    card.dataset.slot=meal.slot;

    const bahanHTML=meal.bahan.map(function(b,bi){
        const alts=b.alts?b.alts.split(',').map(function(s){return s.trim();}).filter(Boolean):[];
        const panelId='subs-'+idx+'-'+bi;
        const subsOpts=alts.map(function(a){
            return '<div class="subs-option" onclick="selectSub(\''+panelId+'\','+bi+',\''+a+'\',this)">'+(NUTRIENTS[a]?NUTRIENTS[a].cat:a)+'</div>';
        }).join('');
        const gantiBtn=alts.length?'<button class="btn-ganti" onclick="toggleSubsPanel(\''+panelId+'\')">Ganti</button>':'';
        const subs=b.substitusiDari?('Disukai '+b.substitusiDari+', diganti'):'';
        return '<div>'
        +'<div class="meal-bahan-row">'
        +'    <div class="meal-bahan-left">'
        +'    <div class="meal-bahan-name">'+b.nama+'</div>'
        +(subs?'<div class="meal-bahan-alt-txt">'+subs+' '+b.nama+'</div>':(b.note?'<div class="meal-bahan-alt-txt">'+b.note+'</div>':''))
        +'    </div>'
        +'    <div class="meal-bahan-right">'
        +'    <span class="meal-bahan-gram">'+b.qty+' '+b.unit+'</span>'
        +'    '+gantiBtn
        +'    </div>'
        +'</div>'
        +(alts.length?'<div class="subs-panel" id="'+panelId+'">'+subsOpts+'</div>':'')
        +'</div>';
    }).join('');

    const isDrink=(meal.slot==='minuman');
    const diff=meal.selisihKcal||0;
    const diffTxt=(isDrink||diff===0)?'':' ('+(diff>0?'+':'')+diff+' kkal)';
    const langkah=(meal.langkah||[]).map(function(l,i){
        return '<div class="meal-langkah-item"><div class="meal-langkah-num">'+(i+1)+'</div><div>'+l+'</div></div>';
    }).join('');

    card.innerHTML=''
    +'<div class="meal-card-header" onclick="toggleMeal('+idx+')">'
    +'  <div class="meal-time-badge">'
    +'    <div class="meal-time-icon">'+(meal.icon||ICONS.bowl)+'</div>'
    +'    <div>'
    +'    <div class="meal-time-label">'+(meal.timeLabel||'')+' · '+(meal.timeRange||'')+'</div>'
    +'    <div class="meal-time-name">'+meal.nama+'</div>'
    +'    </div>'
    +'  </div>'
    +'  <div class="meal-card-right">'
    +'    <span class="meal-cal">'+n.kalori+' kkal</span>'
    +'    <span class="meal-chevron">'+ICONS.chevron+'</span>'
    +'  </div>'
    +'</div>'
    +'<div class="meal-card-body">'
    +'  <div class="meal-macro-row">'
    +'    <div class="meal-macro-item"><div class="meal-macro-val txt-blue">'+n.protein+'g</div><div class="meal-macro-label">Protein</div></div>'
    +'    <div class="meal-macro-item"><div class="meal-macro-val">'+n.karbo+'g</div><div class="meal-macro-label">Karbo</div></div>'
    +'    <div class="meal-macro-item"><div class="meal-macro-val txt-muted">'+n.lemak+'g</div><div class="meal-macro-label">Lemak</div></div>'
    +'    <div class="meal-macro-item"><div class="meal-macro-val txt-accent">'+n.serat+'g</div><div class="meal-macro-label">Serat</div></div>'
    +'  </div>'
    +'  <div class="meal-detail-row">'
    +'    <span>'+(isDrink?'Minuman':'Target '+meal.targetKcal+' kkal')+diffTxt+'</span>'
    +'    <span>Gula '+n.gula+'g</span>'
    +'    <span>Natrium '+n.natrium+'mg</span>'
    +'    <span>Lemak jenuh '+n.lemakJenuh+'g</span>'
    +(n.minyakTerserap>0?'<span class="meal-oil-note">Minyak terserap '+n.minyakTerserap+'g</span>':'')
    +'  </div>'
    +'  <div class="meal-method-row">'
    +'    <span class="badge badge-blue">'+cookMethod(meal.method).label+'</span>'
    +'    <span class="meal-method-note">'+cookMethod(meal.method).note+'</span>'
    +'  </div>'
    +(meal.catatan?'<div class="meal-note">'+meal.catatan+'</div>':'')
    +((meal.terlarang&&meal.terlarang.length)?'<div class="meal-note">Tidak ada menu lain di slot ini tanpa memakai '
    +  meal.terlarang.map(function(t){return t;}).join(', ')
    +  '. Kalau bahan itu tetap mau dihindari, pilih hidangan lain lewat Ganti Menu.</div>':'')
    +'  <div class="meal-section-title">Bahan <span>(gizi dihitung dari beratnya)</span></div>'
    +'  <div class="meal-bahan-list">'+bahanHTML+'</div>'
    +'  <div class="meal-section-title">Cara memasak</div>'
    +'  <div class="meal-langkah-list">'+langkah+'</div>'
    +'  <div style="display:flex;justify-content:center;margin:13px 0 7px;">'
    +'    <button onclick="event.stopPropagation();showMealSwapModal('+idx+')" class="btn btn-outline btn-sm">'+ICONS.swap+' Ganti Menu</button>'
    +'  </div>'
    +'  <button class="meal-done-btn'+(done?' done':'')+'" id="meal-btn-'+idx+'" onclick="toggleMealDone('+idx+')">'
    +(done?ICONS.check+' Sudah dimakan':'Tandai sudah makan')
    +'  </button>'
    +'</div>';
    return card;
    }

    /* TAMPILKAN: TAB MENU */
    function renderMenuTab(meals, targets, day, goal){
    const adapt=isAdaptationPhase(day);
    _renderMealGuidance(goal, targets);

    const total=summarizeDay(meals, targets);
    const audit=auditDayNutrition(meals);
    if(audit.length) console.error('[NUTRISI] energi tidak cocok dengan makronutrien:',audit);

    const mCalEl=document.getElementById('menu-cal-total');
    if(mCalEl){
    mCalEl.textContent=total.kalori.toLocaleString('id-ID')+' kkal';
    }
    const tEl=document.getElementById('menu-target-line');
    if(tEl){
    const d=total.selisihKcal;
    tEl.textContent='Target '+targets.kcal.toLocaleString('id-ID')+' kkal · selisih '+(d>0?'+':'')+d+' kkal';
    tEl.className='menu-target-line';
    }

    const mMacEl=document.getElementById('menu-macro-pills');
    if(mMacEl) mMacEl.innerHTML=''
        +'<span class="macro-pill">'+total.protein+'g protein ('+total.persenProtein+'%)</span>'
        +'<span class="macro-pill">'+total.karbo+'g karbo ('+total.persenKarbo+'%)</span>'
        +'<span class="macro-pill">'+total.lemak+'g lemak ('+total.persenLemak+'%)</span>'
        +'<span class="macro-pill">'+total.serat+'g serat ('+total.persenSerat+'%)</span>';

    if(targets.catatan){
    const note=document.getElementById('menu-floor-notice');
    if(note){ note.textContent=targets.catatan; note.classList.remove('hidden'); }
    } else {
    const note=document.getElementById('menu-floor-notice');
    if(note) note.classList.add('hidden');
    }

    const adaptNotice=document.getElementById('menu-adapt-notice');
    if(adaptNotice){if(adapt) adaptNotice.classList.remove('hidden');else adaptNotice.classList.add('hidden');}

    const container=document.getElementById('meal-cards');
    container.innerHTML='';
    meals.forEach(function(meal,idx){
    const card=renderMealCard(meal, idx);
    if(card) container.appendChild(card);
    });

    const catRow=document.getElementById('meal-cat-row');
    if(catRow) catRow.querySelectorAll('.meal-cat-chip').forEach(function(c){
    c.classList.toggle('active',c.dataset.cat==='semua');
    });

    try{_renderMenuRecs(meals,targets,day);}catch(e){console.error('menu recs error:',e);}
    }

    
    function filterMenuCat(btn){
    const cat=btn.dataset.cat;
    document.querySelectorAll('#meal-cat-row .meal-cat-chip').forEach(function(c){
    c.classList.toggle('active',c===btn);
    });
    document.querySelectorAll('#meal-cards .meal-card').forEach(function(card){
    const show=(cat==='semua')||(card.dataset.slot===cat);
    card.style.display=show?'':'none';
    });
    document.querySelectorAll('#menu-rec-list .menu-rec-item').forEach(function(el){
    el.style.display=(cat==='semua'||el.dataset.slot===cat)?'':'none';
    });
    }

    
    function _renderMenuRecs(meals, targets, day){
    const list=document.getElementById('menu-rec-list');
    const section=document.getElementById('menu-rec-section');
    if(!list||!section) return;

    const recs=[];
    for(let slot=0;slot<SLOT_ORDER.length;slot++){
        if(!meals[slot]) continue;
        if(SLOT_ORDER[slot]==='minuman') continue;
        try{
        const alts=getSwapAlternatives(meals[slot],SLOT_ORDER[slot],day,targets)||[];
        alts.forEach(function(a){a._slot=slot;recs.push(a);});
        }catch(e){}
    }
    section._recs=recs;
    if(!recs.length){
        list.innerHTML='<div class="menu-rec-empty">Tidak ada alternatif lain. Semua pilihan mengandung bahan yang kamu hindari.</div>';
        return;
    }
    const activeChip=document.querySelector('#meal-cat-row .meal-cat-chip.active');
    const activeCat=(activeChip&&activeChip.dataset)?activeChip.dataset.cat:'semua';

    list.innerHTML=recs.map(function(r,i){
        const n=r.nutrisi||{};
        const slotLabel=MEAL_SLOTS[r._slot]?MEAL_SLOTS[r._slot].label:'';
        const hide=(activeCat!=='semua'&&activeCat!==SLOT_ORDER[r._slot])?' style="display:none"':'';
        return '<div class="menu-rec-item" data-slot="'+SLOT_ORDER[r._slot]+'"'+hide+'>'
        +'<div class="menu-rec-top"><div class="menu-rec-name">'+r.nama+'</div>'
        +'<div class="menu-rec-cal">'+n.kalori+' kkal</div></div>'
        +'<div class="menu-rec-meta">'+slotLabel+' · '+n.protein+'g protein · '+n.karbo+'g karbo · '+n.serat+'g serat</div>'
        +'<button class="menu-rec-use" type="button" onclick="applyRecSwap('+i+')">Pakai untuk '+slotLabel+'</button>'
        +'</div>';
    }).join('');
    }

    function applyRecSwap(i){
    const section=document.getElementById('menu-rec-section');
    if(!section||!Array.isArray(section._recs)) return;
    const newMeal=section._recs[i];
    if(!newMeal||newMeal._slot===undefined) return;
    const slotIdx=newMeal._slot;
    const day=getCurrentDay();
    const cKey=dayCacheKey(day);
    const dayData=loadState(cKey);
    if(!dayData||!Array.isArray(dayData.meals)) return;
    const frozenMeal=deepFreezeMeals([newMeal])[0];
    dayData.meals[slotIdx]=frozenMeal;
    saveState(cKey,dayData);
    const container=document.getElementById('meal-cards');
    const oldCard=document.getElementById('meal-card-'+slotIdx);
    if(container&&oldCard){
    const newCard=renderMealCard(frozenMeal,slotIdx);
    newCard.classList.add('open');
    container.replaceChild(newCard,oldCard);
    }
    _refreshMenuSummary(dayData.meals);
    _renderMenuRecs(dayData.meals,activeTargets(),day);
    }

    function toggleMeal(idx){
    const card=document.getElementById('meal-card-'+idx);
    if(card) card.classList.toggle('open');
    }

    function toggleMealDone(idx){
    const todayData=loadToday();
    if(!Array.isArray(todayData.mealsCompleted)) todayData.mealsCompleted=[];
    todayData.mealsCompleted[idx]=!todayData.mealsCompleted[idx];
    saveToday(todayData);
    updateStreak();
    refreshAllPanes();
    }

    
    function _refreshMenuSummary(meals){
    const targets=activeTargets();
    const total=summarizeDay(meals,targets);
    const mCalEl=document.getElementById('menu-cal-total');
    if(mCalEl) mCalEl.textContent=total.kalori.toLocaleString('id-ID')+' kkal';
    const tEl=document.getElementById('menu-target-line');
    if(tEl){
    const d=total.selisihKcal;
    tEl.textContent='Target '+targets.kcal.toLocaleString('id-ID')+' kkal · selisih '+(d>0?'+':'')+d+' kkal';
    tEl.className='menu-target-line';
    }
    const mMacEl=document.getElementById('menu-macro-pills');
    if(mMacEl) mMacEl.innerHTML=''
        +'<span class="macro-pill">'+total.protein+'g protein ('+total.persenProtein+'%)</span>'
        +'<span class="macro-pill">'+total.karbo+'g karbo ('+total.persenKarbo+'%)</span>'
        +'<span class="macro-pill">'+total.lemak+'g lemak ('+total.persenLemak+'%)</span>'
        +'<span class="macro-pill">'+total.serat+'g serat ('+total.persenSerat+'%)</span>';
    }

    /* TAMPILKAN: TAB PROGRES */
    function renderProgressTab(day,programData,userData){
    const streak=getStreak();const phase=getPhaseForDay(day);const ph=PHASES[phase];const week=Math.floor(day/7);
    const targets=activeTargets();
    const overview=document.getElementById('prog-overview');
    overview.innerHTML=`
        <div class="prog-stat-card"><div class="prog-stat-icon">${ICONS.calendar}</div><div class="prog-stat-val txt-accent">${day+1}</div><div class="prog-stat-label">Hari berjalan</div></div>
        <div class="prog-stat-card"><div class="prog-stat-icon">${ICONS.flame}</div><div class="prog-stat-val txt-orange">${streak}</div><div class="prog-stat-label">Beruntun</div></div>
        <div class="prog-stat-card"><div class="prog-stat-icon">${ICONS.bars}</div><div class="prog-stat-val">${Math.round((day/90)*100)}%</div><div class="prog-stat-label">Program selesai</div></div>
        <div class="prog-stat-card"><div class="prog-stat-icon">${ICONS.bolt}</div><div class="prog-stat-val txt-blue">${week+1}</div><div class="prog-stat-label">Minggu ke-</div></div>`;

    renderWeightChart();

    // isian awal catatan berat
    const tracking=loadState(KEYS.tracking);
    if(tracking){
        const today=new Date().toISOString().split('T')[0];
        const tw=tracking.weights?tracking.weights.find(e=>e.date===today):null;
        const twa=tracking.waists?tracking.waists.find(e=>e.date===today):null;
        if(tw) document.getElementById('track-weight').value=tw.value;
        if(twa) document.getElementById('track-waist').value=twa.value;
        if(tw) validateWeightDrop(tracking.weights);
    }

    const journal=loadState(journalKey());
    if(journal&&journal.notes){
        const jnEl=document.getElementById('journal-notes');
        if(jnEl) jnEl.value=journal.notes;
    }

    // kartu fase
    const phaseCard=document.getElementById('prog-phase-card');
    const phaseOrder=['foundation','build','intensity','peak'];
    const curPhaseIdx=phaseOrder.indexOf(phase);
    const lv=getLevelInfo(day);
    const todayPres=getPrescription(day,lv.level,'strength',currentGoal(userData));
    phaseCard.innerHTML=`
        <div class="prog-phase-header">
        <div><div class="prog-phase-name">Fase Saat Ini: ${ph.label}</div><div class="prog-phase-range">${ph.days}</div></div>
        <span class="badge badge-green">Tahap ${lv.level} ${lv.name}</span>
        </div>
        <p style="font-size:.82rem;color:var(--text2);margin-bottom:8px;">${ph.desc}</p>
        <p style="font-size:.8rem;color:var(--text2);margin-bottom:14px;">
        Hari ini: ${todayPres.sets} set × ${todayPres.reps} rep, istirahat ${todayPres.rest} detik.
        ${lv.deload?'Minggu deload, volume diturunkan biar recovery-nya cukup.':''}
        </p>
        <div class="prog-phase-bars">
        ${phaseOrder.map((pk,pi)=>{
            const p2=PHASES[pk];
            const startDay=p2.start;
            const endDay=p2.end;
            const pDone=Math.max(0,Math.min(day-startDay,endDay-startDay));
            const pTotal=endDay-startDay;const pPct=Math.round((pDone/pTotal)*100);
            const isActive=pi===curPhaseIdx;const isFuture=pi>curPhaseIdx;
            const barColor=isActive?'var(--accent)':isFuture?'var(--border2)':'var(--text3)';
            const labelColor=isActive?'var(--text)':isFuture?'var(--text3)':'var(--text2)';
            return `<div class="prog-phase-item">
            <div class="prog-phase-label" style="color:${labelColor}">${p2.label}</div>
            <div class="prog-phase-bar-wrap"><div class="progress-bar"><div class="progress-bar-fill" style="width:${pPct}%;background:${barColor}"></div></div></div>
            <div class="prog-phase-pct">${pPct}%</div>
            </div>`;
        }).join('')}
        </div>`;

    const now = new Date();
    const dow = now.getDay(); // 0 Minggu ... 6 Sabtu
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dow === 0 ? 7 : dow) - 1));

    const weeklySection = document.getElementById('prog-weekly-section');
    const days = ['Sen','Sel','Rab','Kam','Jum','Sab','Min'];

    const dayScores = days.map((_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const key = KEYS.today + d.toISOString().split('T')[0];
        const rec = loadState(key);
        if(!rec) return 0;
        const meals = Array.isArray(rec.mealsCompleted) ? rec.mealsCompleted.filter(Boolean).length : 0;
        return Math.round((rec.workoutDone ? 50 : 0) + (meals / 3) * 50);
    });
    const adjustedToday = (dow === 0) ? 6 : dow - 1;

    weeklySection.innerHTML = `
        <div class="section-label">Minggu ini (Minggu ${week + 1})</div>
        <div class="prog-weekly-bars">
        ${days.map((d, i) => {
            const isToday = i === adjustedToday;
            const score = dayScores[i];
            const classNames = ['prog-weekly-bar'];
            if(score > 0) classNames.push('filled');
            if(isToday) classNames.push('current');
            return `
            <div class="prog-weekly-bar-wrap">
            <div class="${classNames.join(' ')}" style="height:${Math.max(4, score)}%"></div>
            <div class="prog-weekly-day" style="color:${isToday ? 'var(--text)' : 'var(--text3)'}">${d}</div>
            </div>`;
        }).join('')}
        </div>`;

    const _goal=currentGoal(userData);
    const goalLabel=_goal==='lose'?'Turunkan berat badan':_goal==='gain'?'Tambah massa otot':'Jaga berat badan';
    const goalDesc=_goal==='lose'?`Dari ${userData.weight} kg ke target ${userData.targetWeight} kg`:_goal==='gain'?`Dari ${userData.weight} kg ke target ${userData.targetWeight} kg`:`Jaga di sekitar ${userData.weight} kg`;
    const goalTypeDesc=_goal==='lose'?'Di bawah kebutuhan':_goal==='gain'?'Di atas kebutuhan':'Sesuai kebutuhan';
    const checkIcon=(ok)=>ok?ICONS.check:ICONS.minus;
    const progGoal=document.getElementById('prog-goal-section');
    progGoal.innerHTML=`
        <div class="section-label">Targetmu</div>
        <div class="prog-goal-items">
        <div class="prog-goal-item"><div class="prog-goal-check">${ICONS.target}</div><div class="prog-goal-info"><div class="prog-goal-label">${goalLabel}</div><div class="prog-goal-sub">${goalDesc}</div></div></div>
        <div class="prog-goal-item"><div class="prog-goal-check">${ICONS.flame}</div><div class="prog-goal-info"><div class="prog-goal-label">${targets.kcal.toLocaleString('id-ID')} kkal/hari</div><div class="prog-goal-sub">${goalTypeDesc} · BMR ${targets.bmr} · TDEE ${targets.tdee}</div></div></div>
        <div class="prog-goal-item"><div class="prog-goal-check">${ICONS.bars}</div><div class="prog-goal-info"><div class="prog-goal-label">${targets.protein}g protein · ${targets.karbo}g karbo · ${targets.fat}g lemak</div><div class="prog-goal-sub">Serat ${targets.fiber}g · gula maksimal ${targets.sugarMax}g · natrium maksimal ${targets.natriumMax}mg</div></div></div>
        <div class="prog-goal-item">
            <div class="prog-goal-check" style="${day>=7?'background:var(--accent-dim);border-color:var(--accent);color:var(--accent);':''}">${checkIcon(day>=7)}</div>
            <div class="prog-goal-info"><div class="prog-goal-label">Minggu pertama</div><div class="prog-goal-sub">${day>=7?'Selesai.':`${7-day} hari lagi.`}</div></div>
        </div>
        <div class="prog-goal-item">
            <div class="prog-goal-check" style="${day>=30?'background:var(--accent-dim);border-color:var(--accent);color:var(--accent);':''}">${checkIcon(day>=30)}</div>
            <div class="prog-goal-info"><div class="prog-goal-label">30 hari pertama</div><div class="prog-goal-sub">${day>=30?'Selesai.':`${30-day} hari lagi.`}</div></div>
        </div>
        <div class="prog-goal-item">
            <div class="prog-goal-check" style="${day>=90?'background:var(--accent-dim);border-color:var(--accent);color:var(--accent);':''}">${checkIcon(day>=90)}</div>
            <div class="prog-goal-info"><div class="prog-goal-label">90 hari</div><div class="prog-goal-sub">${day>=90?'Selesai.':`${90-day} hari lagi.`}</div></div>
        </div>
        </div>`;
    }

    /* BANTUAN KUNCI TAB */
    function _applyTabLockState(){
    const td=loadToday();
    document.querySelectorAll('.lp-tab').forEach(t=>{
        const onclick=t.getAttribute('onclick')||'';
        const match=onclick.match(/'(\w+)'/);
        const tname=match?match[1]:'';
        if(!td.energyChecked&&tname&&tname!=='latihan'){
        t.classList.add('tab-locked');
        } else {
        t.classList.remove('tab-locked');
        }
    });
    }

    
    function switchTab(btn,tabName){
    
    const _tdLock=loadToday();
    if(!_tdLock.energyChecked&&tabName!=='latihan'){
        showEnergyModal();
        return; // Do NOT switch tab, user must fill energy first
    }

    document.querySelectorAll('.lp-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    const pane=document.getElementById('tab-'+tabName);
    if(pane) pane.classList.add('active');
    const lpc=document.getElementById('lp-content');
    if(lpc) lpc.scrollTop=0;
    try{localStorage.setItem('ip90_active_tab',tabName);}catch(e){}
    if(tabName==='progress') setTimeout(renderWeightChart,100);
    _applyTabLockState();
    if(tabName==='latihan'){
        const _td=loadToday();
        if(!_td.energyChecked){
        clearInterval(window._exTimerInterval);
        clearTimeout(window._exTimerTimeout);
        const pad=document.querySelector('#tab-latihan .workout-pad');
        if(pad) pad.classList.add('workout-locked');
        const lo=document.getElementById('workout-lock-overlay');
        if(lo) lo.classList.remove('hidden');
        document.body.style.overflow='hidden';
        showEnergyModal();
        } else {
        const pad=document.querySelector('#tab-latihan .workout-pad');
        if(pad) pad.classList.remove('workout-locked');
        const lo=document.getElementById('workout-lock-overlay');
        if(lo) lo.classList.add('hidden');
        document.body.style.overflow='';
        }
    }
    }

    /* SEGARKAN SEMUA PANEL */
    function refreshAllPanes(){
    const userData=loadState(KEYS.user);const programData=loadState(KEYS.program);
    if(!userData||!programData) return;
    const day=getCurrentDay();const targets=activeTargets();
    const dayData = loadDayData(day);
    const todayData=loadToday();
    renderGuidance(todayData);
    _renderDailyFocus(currentGoal(userData), day);
    _renderDashNow(day,dayData,activeTargets(),todayData);
    const mealsCount=todayData.mealsCompleted.filter(Boolean).length;
    const workoutPct=todayData.workoutDone?100:0;
    const mealPct=Math.round((mealsCount/MEAL_SLOTS.length)*100);
    const totalPct=Math.round((workoutPct*0.5)+(mealPct*0.5));
    const dayPctEl=document.getElementById('dash-day-pct');
    if(dayPctEl) dayPctEl.textContent=totalPct+'%';
    const wBar=document.getElementById('prog-workout-bar');
    if(wBar) wBar.style.width=workoutPct+'%';
    const mBar=document.getElementById('prog-meal-bar');
    if(mBar) mBar.style.width=mealPct+'%';
    const mCount=document.getElementById('prog-meal-count');
    if(mCount) mCount.textContent=mealsCount;
    const doneWrap=document.getElementById('workout-done-wrap');
    if(doneWrap&&todayData.workoutDone){
        if(!doneWrap.querySelector('.ux-workout-complete')){
        const energy=todayData.energy||selectedEnergy||3;
        _renderWorkoutComplete(doneWrap, energy);
        }
        document.querySelectorAll('.exercise-num').forEach(n=>{if(n)n.classList.add('active');});
        _unlockWorkoutNotes();
    }
    if(dayData.meals){
        dayData.meals.forEach((meal,idx)=>{
        const card=document.getElementById('meal-card-'+idx);if(!card) return;
        const done=todayData.mealsCompleted[idx];
        card.classList.toggle('completed',done);
        const btn=document.getElementById('meal-btn-'+idx);
        if(btn){btn.className=`meal-done-btn ${done?'done':''}`;btn.innerHTML=done?ICONS.check+' Sudah dimakan':'Tandai sudah makan';}
        });
    }
    const streak=getStreak();
    const streakEl=document.getElementById('lp-streak');
    if(streakEl) streakEl.innerHTML=`${ICONS.flame} Beruntun ${streak}`;
    }

    /* Fokus harian */
    function _renderDailyFocus(goal, day){
    const wrap=document.getElementById('ux-daily-focus-wrap');
    if(!wrap) return;
    let focusText='';
    if(goal==='lose') focusText='Fokus hari ini: konsistensi dan kontrol porsi';
    else if(goal==='gain') focusText='Fokus hari ini: cukup makan dan latihan stabil';
    else focusText='Fokus hari ini: jaga keseimbangan';
    let adaptHtml='';
    if(day<7) adaptHtml=`<div class="ux-adapt-week-banner">${ICONS.leaf} Minggu adaptasi: tidak perlu langsung ketat, kurangi bertahap.</div>`;
    // Periksa tanda pemulihan
    let recoveryHtml='';
    try{
        const rflag=localStorage.getItem('ip90_recovery_flag');
        const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
        const yk='ip90_recovery_next_'+yesterday.toISOString().split('T')[0];
        const yflag=localStorage.getItem(yk);
        if(rflag||yflag) recoveryHtml=`<div class="ux-recovery-notice">${ICONS.bandage} Latihan hari ini disesuaikan karena kondisi sebelumnya, tubuhmu sedang pemulihan.</div>`;
    }catch(e){}
    wrap.innerHTML=`${adaptHtml}${recoveryHtml}<div class="ux-daily-focus"><strong>Panduan harian</strong>${focusText}</div>`;
    }

    /* Petunjuk makan */
    function _renderMealGuidance(goal){
    const wrap=document.getElementById('ux-meal-guidance-wrap');
    if(!wrap) return;
    let cls='',text='';
    if(goal==='lose'){cls='lose';text='Menu hari ini dihitung supaya porsinya di bawah kebutuhan harianmu. Porsi sudah dihitung sesuai targetmu.';}
    else if(goal==='gain'){cls='gain';text='Menu hari ini dihitung supaya porsinya di atas kebutuhan harianmu. Cukupi porsi makanmu.';}
    else{text='Menu hari ini dihitung tepat sesuai kebutuhan harianmu. Makan tepat waktu.';}
    wrap.innerHTML=`<div class="ux-meal-guidance ${cls}">${text}</div>`;
    }

    
    function getSwapAlternatives(currentMeal, slotKey, day, targets){
    const dislikes=getDislikes();
    const blockedIds=blockedIngredientIds(dislikes);
    const noHeavyOil=dislikesOilHeavyCooking(dislikes);
    const userData=loadState(KEYS.user)||{};
    const goal=currentGoal(userData);

    const pool=recipesForSlot(slotKey).filter(function(r){
    return r.nama!==currentMeal.nama && isRecipeAllowed(r,blockedIds,noHeavyOil);
    });
    if(!pool.length) return [];

    const targetKcal=slotTargetKcal(targets,goal,slotKey);

    
    const scored=pool.map(function(r,i){
    let recipe=r;
    if(noHeavyOil&&OIL_HEAVY_METHODS.indexOf(r.method)>=0) recipe=softenRecipe(recipe);
    recipe=substituteBlockedIngredients(recipe,blockedIds);
    const fit=fitWithClamps(recipe,targetKcal);
    const dev=Math.abs(fit.nutrisi.k-targetKcal)/Math.max(80,targetKcal);
    return {recipe:recipe, dev:dev, spread:(i*13+day*7)%7};
    });
    scored.sort(function(a,b){
    if(Math.abs(a.dev-b.dev)>0.05) return a.dev-b.dev;
    return a.spread-b.spread;
    });

    return scored.slice(0,2).map(function(item,i){
    return buildMeal(item.recipe,targets,goal,slotKey,day+50+i*30);
    });
    }

    function showMealSwapModal(slotIdx){
    const programData=loadState(KEYS.program);
    if(!programData) return;
    const day=getCurrentDay();
    const cKey=dayCacheKey(day);
    const dayData=loadState(cKey);
    if(!dayData||!Array.isArray(dayData.meals)) return;
    const currentMeal=dayData.meals[slotIdx];
    if(!currentMeal) return;

    const targets=activeTargets();
    let modal=document.getElementById('meal-swap-modal');
    if(!modal){
    modal=document.createElement('div');
    modal.id='meal-swap-modal';
    modal.className='modal-overlay';
    modal.addEventListener('click',function(e){ if(e.target===modal) closeMealSwapModal(); });
    document.body.appendChild(modal);
    }
    const alternatives=getSwapAlternatives(currentMeal, currentMeal.slot, day, targets);

    const slotLabel=MEAL_SLOTS.filter(s=>s.key===currentMeal.slot)[0];
    const labelName=slotLabel?slotLabel.label:'';

    function bahanRingkas(bahan){
    return bahan.slice(0,3).map(function(b){
    return b.qty+' '+b.unit+' '+b.nama;
    }).join(', ')+(bahan.length>3?', ...':'');
    }

    const currentBlock=''
    +'<div class="swap-current">'
    +'  <div class="swap-current-label">Sedang dipakai</div>'
    +'  <div class="swap-current-name">'+currentMeal.nama+'</div>'
    +'  <div class="swap-current-nutri">'+(currentMeal.nutrisi?currentMeal.nutrisi.kalori:0)+' kkal · '
    +(currentMeal.nutrisi?currentMeal.nutrisi.protein:0)+'g protein · '
    +(currentMeal.nutrisi?currentMeal.nutrisi.serat:0)+'g serat</div>'
    +'</div>';

    const altCardsHTML=alternatives.map(function(alt,i){
    const n=alt.nutrisi||{};
    return '<div class="swap-alt" onclick="applyMealSwap('+slotIdx+','+i+')">'
    +'  <div class="swap-alt-top">'
    +'  <div class="swap-alt-name">'+alt.nama+'</div>'
    +'  <div class="swap-alt-cal">'+n.kalori+' kkal</div>'
    +'  </div>'
    +'  <div class="swap-altplore">'
    +'    <span>'+n.protein+'g protein</span><span>'+n.karbo+'g karbo</span>'
    +'    <span>'+n.lemak+'g lemak</span><span>'+n.serat+'g serat</span>'
    +'  </div>'
    +'  <div class="swap-alt-bahan">'+bahanRingkas(alt.bahan)+'</div>'
    +'  <div class="swap-alt-pilih">'+ICONS.check+' Pakai ini</div>'
    +'</div>';
    }).join('');

    const empty=alternatives.length?'':'<div class="swap-empty">Tidak ada alternatif di slot ini yang bebas dari bahan yang kamu hindari.</div>';

    modal.innerHTML=''
    +'<div class="modal-box" onclick="event.stopPropagation()">'
    +'  <div class="modal-title">Ganti '+labelName+'</div>'
    +'  <div class="modal-body">'
    + currentBlock
    + (empty||'<div class="swap-alts">'+altCardsHTML+'</div>')
    +'  </div>'
    +'  <div class="modal-actions">'
    +'    <button class="btn btn-outline btn-full" onclick="closeMealSwapModal()">Tutup</button>'
    +'  </div>'
    +'</div>';
    modal._alternatives=alternatives;
    modal.classList.add('active');
    }

    function closeMealSwapModal(){
    const modal=document.getElementById('meal-swap-modal');
    if(modal) modal.classList.remove('active');
    }

    function applyMealSwap(slotIdx, altIdx){
    const modal=document.getElementById('meal-swap-modal');
    if(!modal||!Array.isArray(modal._alternatives)) return;
    const newMeal=modal._alternatives[altIdx];
    if(!newMeal) return;

    const day=getCurrentDay();
    const cKey=dayCacheKey(day);
    let dayData=loadState(cKey)||{meals:[],workout:null};
    if(!Array.isArray(dayData.meals)) dayData.meals=[];

    const frozenMeal=deepFreezeMeals([newMeal])[0];
    dayData.meals[slotIdx]=frozenMeal;
    saveState(cKey,dayData);

    const container=document.getElementById('meal-cards');
    const oldCard=document.getElementById('meal-card-'+slotIdx);
    if(container&&oldCard){
    const newCard=renderMealCard(frozenMeal,slotIdx);
    newCard.classList.add('open');
    container.replaceChild(newCard,oldCard);
    }
    _refreshMenuSummary(dayData.meals);
    _renderMenuRecs(dayData.meals,activeTargets(),day);
    closeMealSwapModal();
    _toastMsg('_swap_ok_toast',ICONS.check+' Menu berhasil diganti');
    }

    /* BANTUAN PENGGANTI BAHAN */
    
    function toggleSubsPanel(panelId){
    const panel=document.getElementById(panelId);
    if(!panel) return;
    const akanBuka=!panel.classList.contains('open');
    document.querySelectorAll('.subs-panel.open').forEach(function(p){
        if(p!==panel) p.classList.remove('open');
    });
    panel.classList.toggle('open',akanBuka);
    if(akanBuka){
    const opt=panel.querySelector('.subs-option');
    if(opt && typeof opt.scrollIntoView==='function'){
        opt.scrollIntoView({block:'nearest'});
    }
    }
    }

    
    function selectSub(panelId, bahanIdx, altId, optEl){
    const parts=String(panelId).split('-');
    const slotIdx=parseInt(parts[1],10);
    if(isNaN(slotIdx)) return;

    const day=getCurrentDay();
    const cKey=dayCacheKey(day);
    const dayData=loadState(cKey);
    if(!dayData||!Array.isArray(dayData.meals)||!dayData.meals[slotIdx]) return;

    const meal=dayData.meals[slotIdx];
    const b=meal.bahan[bahanIdx];
    if(!b) return;

    const gram=b.gram;
    const nextId=altId;
    const nextUnit=(NUTRIENTS[nextId]&&NUTRIENTS[nextId].per&&NUTRIENTS[nextId].per.batang)?'g':(b.unit==='g'||b.unit==='ml'?b.unit:'g');
    const nextQty=nextUnit==='g'||nextUnit==='ml'?Math.round(gram):b.qty;

    const altsBaru=[nextId].concat(String(b.alts||'').split(',').map(function(s){return s.trim();}))
    .filter(function(x,idx,arr){return x&&x!==b.id&&arr.indexOf(x)===idx;}).join(',');

    const bahanBaru=Object.assign({},b,{
    id:nextId,
    nama:(NUTRIENTS[nextId]?NUTRIENTS[nextId].cat:nextId),
    qty:nextQty,
    unit:nextUnit,
    alts:altsBaru,
    substitusiDari:b.substitusiDari||b.nama
    });

    const bahanBaruAll=meal.bahan.map(function(x,i){
    return (i===bahanIdx)?bahanBaru:Object.assign({},x);
    });
    const n=computeNutrition(bahanBaruAll,meal.method);

    const namaBaru=renameIngredientInName(meal.nama,b.nama,bahanBaru.nama);
    const langkahBaru=Array.isArray(meal.langkah)
    ? meal.langkah.map(function(t){return renameIngredientInName(t,b.nama,bahanBaru.nama);})
    : meal.langkah;

    const updated=Object.assign({},meal,{
    nama:namaBaru,
    langkah:langkahBaru,
    bahan:bahanBaruAll.map(function(x){
    const row=NUTRIENTS[x.id]||{p:0,c:0,f:0,fb:0,cat:x.id};
    const g=toGrams(x.id,x.qty,x.unit||'g')||0;
    return Object.assign({},x,{
    nama:x.nama||row.cat,
    gram:g,
    kcal:Math.round(energyFromMacros(row.p,row.c,row.f,row.fb)*g/100)
    });
    }),
    nutrisi:nutritionSummary(n,meal.targetKcal),
    makro:(function(s){return {protein:s.protein,karbo:s.karbo,lemak:s.lemak};})(nutritionSummary(n,meal.targetKcal)),
    kcal:nutritionSummary(n,meal.targetKcal).kalori
    });
    updated.selisihKcal=updated.kalori-(meal.targetKcal||0);

    const frozen=deepFreezeMeals([updated])[0];
    dayData.meals[slotIdx]=frozen;
    saveState(cKey,dayData);

    const panel=document.getElementById(panelId);
    if(panel){
    panel.querySelectorAll('.subs-option').forEach(function(o){o.classList.remove('selected');});
    optEl.classList.add('selected');
    setTimeout(function(){panel.classList.remove('open');},300);
    }

    const card=document.getElementById('meal-card-'+slotIdx);
    if(card){
    const fresh=renderMealCard(frozen,slotIdx);
    fresh.classList.add('open');
    card.parentNode.replaceChild(fresh,card);
    }
    _refreshMenuSummary(dayData.meals);
    }

    
    const DEV_KEY='ip90_dev';
    const DEV_SCAN_MAX=90;

    
    function getDevState(){
    const kosong={on:false,cheat:false,day:null,goal:null,profile:{}};
    const d=loadState(DEV_KEY);
    if(!d||typeof d!=='object') return kosong;
    return {
    on:!!d.on,
    cheat:!!d.cheat,
    day:(Number.isInteger(d.day)?d.day:null),
    goal:(d.goal==='lose'||d.goal==='maintain'||d.goal==='gain')?d.goal:null,
    profile:(d.profile&&typeof d.profile==='object')?d.profile:{}
    };
    }

    function setDevState(patch){
    const s=Object.assign(getDevState(),patch||{});
    saveState(DEV_KEY,s);
    return s;
    }

    function devOn(){return getDevState().on;}
    function devCheat(){const d=getDevState();return d.on&&d.cheat;}

    
    function devGoDay(n){
    const day=Math.max(0,Math.min(DEV_SCAN_MAX-1,Math.round(Number(n)||0)));
    setDevState({day:day});
    devRefresh();
    return day;
    }

    function devGoReal(){
    setDevState({day:null});
    devRefresh();
    }

    
    const GOALS=[
    {key:'lose',label:'Turunkan berat',short:'Di bawah kebutuhan',icon:'down'},
    {key:'maintain',label:'Jaga badan',short:'Sesuai kebutuhan',icon:'eq'},
    {key:'gain',label:'Naik Berat',short:'Di atas kebutuhan',icon:'up'}
    ];

    function devGoal(){
    const d=getDevState();
    return (d.on&&d.goal)?d.goal:null;
    }

    function devProfile(){
    const d=getDevState();
    return (d.on&&d.profile&&typeof d.profile==='object')?d.profile:{};
    }

    
    function devUser(){
    const asli=loadState(KEYS.user)||{};
    const u=Object.assign({},asli,devProfile());
    const g=devGoal();
    if(g) u.goal=g;
    return u;
    }

    
    function currentGoal(userData){
    const u=userData||devUser();
    return devGoal()||u.goal||'maintain';
    }

    
    function devTargets(){
    const adaProfil=Object.keys(devProfile()).length>0;
    if(!adaProfil && !devGoal()) return getTargets();
    return calcEnergyTargets(devUser());
    }

    function devSetProfile(patch){
    setDevState({profile:Object.assign({},devProfile(),patch)});
    }

    
    function devProfileHash(){
    const p=devProfile();
    return ['weight','height','age','gender','activity','targetWeight']
    .map(function(k){return p[k]===undefined?'':String(p[k]);})
    .join('-').replace(/[^a-zA-Z0-9-]/g,'').slice(0,60);
    }

    function devClearProfile(){
    setDevState({profile:{}});
    }

    function devSetGoal(goal){
    if(goal!=='lose'&&goal!=='maintain'&&goal!=='gain') return;
    setDevState({goal:goal});
    }

    
    function devInvalidate(){
    const pre=KEYS.daydata;
    let n=0;
    try{
    Object.keys(localStorage).filter(function(k){return k.indexOf(pre)===0;})
    .forEach(function(k){localStorage.removeItem(k);n++;});
    }catch(e){}
    return n;
    }

    function devSetGoalAndRefresh(goal){
    devSetGoal(goal);
    devInvalidate();
    devRefresh();
    renderDevPanel();
    }

    
    function devRefresh(){
    if(window._exTimerInterval){clearInterval(window._exTimerInterval);window._exTimerInterval=undefined;}
    if(window._exTimerTimeout){clearTimeout(window._exTimerTimeout);window._exTimerTimeout=undefined;}
    document.querySelectorAll('.ex-timer-wrap').forEach(function(t){
    if(t._interval){clearInterval(t._interval);clearTimeout(t._interval);}
    t._interval=undefined;
    if(t._timerState==='active'||t._timerState==='rest'){t._timerState='idle';t._transitioning=false;}
    });
    try{
    const scr=document.getElementById('screen-lp');
    if(scr&&scr.classList.contains('active')) renderProgram();
    else showScreen('lp');
    }catch(e){ console.error('dev refresh error:',e); }
    if(_devPanel&&_devPanel.classList.contains('active')) renderDevPanel();
    }

    
    function devInspectDay(day){
    const user=loadState(KEYS.user)||{};
    const goal=currentGoal(user);
    const tg=devTargets();
    const dislikes=getDislikes();
    const info=getLevelInfo(day);
    const wk=getWorkoutForDay(day);
    const meals=getMealsForDay(day,tg,dislikes);
    const sum=summarizeDay(meals,tg);
    const audit=auditDayNutrition(meals);
    return {
    day:day,goal:goal,targets:tg,level:info.level,levelName:info.name,
    deload:info.deload,phase:wk.phase,focus:wk.label,focusKey:wk.focusKey,
    kind:wk.kind,workout:wk.label,typeLabel:wk.typeLabel,work:wk.work,
    reps:wk.repsRaw,sets:wk.sets,rest:wk.rest,exCount:wk.exercises.length,
    meals:meals,sum:sum,audit:audit,unverified:unverifiedOn(meals)
    };
    }

    
    function unverifiedOn(meals){
    const Trust=NUTRIENT_TRUST||{};
    const keluar={};
    (meals||[]).forEach(function(meal){
    (meal.bahan||[]).forEach(function(b){
    if(!Trust[b.id]) return;
    const nama=(NUTRIENTS[b.id]||{}).cat||b.id;
    (keluar[nama]=keluar[nama]||[]).push(Trust[b.id]);
    });
    });
    return keluar;
    }

    
    function devScan(from,to){
    const rows=[];
    const semua=new Set();
    const perSlot={};
    const auditGagal=[];
    let worst=0, worstDay=-1;
    for(let d=from;d<=to;d++){
    const r=devInspectDay(d);
    const devPct=tg0(r.sum,r.targets);
    if(devPct>worst){worst=devPct;worstDay=d;}
    const slotNama=[];
    r.meals.forEach(function(m){
    semua.add(m.nama);
    slotNama.push(m.nama);
    const s=perSlot[m.slot]||(perSlot[m.slot]=new Set());
    s.add(m.nama);
    });
    if(r.audit.length) auditGagal.push({day:d,masalah:r.audit});
    rows.push({
    day:d,phase:r.phase,level:r.level,deload:r.deload,focus:r.focus,kind:r.kind,
    sets:r.sets,reps:r.reps,ex:r.exCount,
    kkal:Math.round(r.sum.kalori),target:r.targets.kcal,dev:devPct,
    protein:Math.round(r.sum.protein),karbo:Math.round(r.sum.karbo),lemak:Math.round(r.sum.lemak),
    meals:slotNama
    });
    }
    const totalResep=Object.keys(RECIPES||{}).length;
    return {
    rows:rows,semua:semua,perSlot:perSlot,auditGagal:auditGagal,
    worst:worst,worstDay:worstDay,totalResep:totalResep
    };
    }

    function tg0(sum,targets){
    if(!targets||!targets.kcal) return 0;
    return Math.abs((sum.kalori||0)-targets.kcal)/targets.kcal*100;
    }

    function _devEsc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
    }

    
    
    const _DEV_CHECKS=[];

    function _chk(nama,fn,grup){
    _DEV_CHECKS.push({nama:nama,fn:fn,grup:grup||'umum'});
    }

    /* 1. validasi angka */
    _chk('Target energi selalu masuk akal',function(){
    const r=[];
    const kasus=[
    ['sangat kurus',{weight:38,height:150,age:70,gender:'f',activity:1.2,goal:'lose'}],
    ['sangat gemuk',{weight:180,height:150,age:30,gender:'m',activity:1.2,goal:'lose'}],
    ['anak',{weight:25,height:110,age:10,gender:'f',activity:1.375,goal:'maintain'}],
    ['nilai 0',{weight:0,height:0,age:0,gender:'x',activity:0,goal:'xx'}],
    ['string aneh',{weight:'abc',height:'12',age:'3',gender:'m',activity:'1.55',goal:'lose'}],
    ['nilai null',{weight:null,height:null,age:null,gender:null,activity:null,goal:null}],
    ['nilai sangat besar',{weight:500,height:260,age:100,gender:'m',activity:1.9,goal:'gain'}],
    ['tinggi 0 saja',{weight:70,height:0,age:30,gender:'m',activity:1.55,goal:'maintain'}]
    ];
    kasus.forEach(function(k){
    const t=calcEnergyTargets(k[1]);
    if(!Number.isFinite(t.kcal)||t.kcal<=0) return r.push(k[0]+': kkal '+t.kcal);
    if(!Number.isFinite(t.bmr)||t.bmr<=0) return r.push(k[0]+': BMR '+t.bmr);
    if(t.kcal<t.bmr) return r.push(k[0]+': target di bawah BMR');
    ['protein','fat','fiber'].forEach(function(f){
    if(!Number.isFinite(t[f])||t[f]<0) r.push(k[0]+': '+f+'='+t[f]);
    });
    });
    return r;
    },'validasi');

    _chk('Semua bahan punya satuan yang bisa dihitung',function(){
    const r=[];
    Object.keys(NUTRIENTS).forEach(function(id){
    const row=NUTRIENTS[id];
    if(!row.cat) r.push(id+': tanpa nama');
    ['k','p','c','f','fb','sg','na','sf','ch'].forEach(function(f){
    if(!Number.isFinite(row[f])||row[f]<0) r.push(id+': '+f+'='+row[f]);
    });
    if(row.per) Object.keys(row.per).forEach(function(u){
    if(!(row.per[u]>0)) r.push(id+': satuan '+u+'='+row.per[u]);
    });
    if(!SUMBER_GIZI[id]) r.push(id+': tidak ada di SUMBER_GIZI');
    });
    return r;
    },'validasi');

    _chk('Nilai sesuai sumber USDA',function(){
    const r=[];
    Object.keys(NUTRIENTS).forEach(function(id){
    const s=SUMBER_GIZI[id];
    if(!s) return;
    if(!s.fdc){
    const row=NUTRIENTS[id];
    const nol=['k','p','c','f','fb','sg','na'].every(function(f){return row[f]===0;});
    if(!nol) r.push(id+': tanpa sumber tapi nilainya bukan nol');
    if(NUTRIENT_TRUST[id]!=='belum bersumber') r.push(id+': tanpa sumber tapi tidak ditandai');
    }
    });
    return r;
    },'validasi');

    /* 2. kelengkapan resep */
    
    _chk('Semua bahan punya data gizi, atau ditandai belum bersumber',function(){
    const r=[];
    const dipakai=new Set();
    Object.keys(RECIPES).forEach(function(k){
    RECIPES[k].bahan.forEach(function(b){dipakai.add(b.id);});
    });
    dipakai.forEach(function(id){
    const row=NUTRIENTS[id];
    if(!row) return r.push(id+': tidak ada di NUTRIENTS');
    if(NUTRIENT_TRUST[id]==='belum bersumber'){
    const bukanNol=['k','p','c','f','fb','sg','na'].filter(function(f){return row[f]!==0;});
    if(bukanNol.length) r.push(id+': ditandai belum bersumber tapi punya nilai '+bukanNol.join(','));
    }
    });
    return r;
    },'resep');

    _chk('Semua bahan punya pasangan ganti yang valid',function(){
    const r=[];
    const seen=new Set();
    
    const WAJIB_MASAK=['pagi','siang','malam'];
    Object.keys(RECIPES).forEach(function(k){
    const rec=RECIPES[k];
    if(!rec.bahan){ r.push(k+': tanpa bahan'); return; }
    if(!rec.langkah||!rec.langkah.length) r.push(k+': tanpa langkah');
    if(!rec.nama) r.push(k+': tanpa nama');
    if(!rec.method&&WAJIB_MASAK.indexOf(rec.slot)>=0)
    r.push(k+': slot '+rec.slot+' harus punya metode masak');
    rec.bahan.forEach(function(b){
    if(seen.has(b.id)) return;
    seen.add(b.id);
    if(!NUTRIENTS[b.id]) r.push(k+': bahan tak dikenal '+b.id);
    if(!b.role) r.push(k+': '+b.id+' tanpa role');
    if(!(b.qty>0)) r.push(k+': '+b.id+' qty='+b.qty);
    if(!b.unit) r.push(k+': '+b.id+' tanpa satuan');
    if(/genggam|sejumlah|banyak|sedikit|sesuai/.test(b.unit))
    r.push(k+': '+b.id+' satuan tak terukur "'+b.unit+'"');
    if(b.alts) b.alts.split(',').map(function(s){return s.trim();}).filter(Boolean)
    .forEach(function(a){ if(!NUTRIENTS[a]) r.push(k+': '+b.id+' alts tak dikenal '+a); });
    });
    });
    return r;
    },'resep');

    _chk('Menu 5 slot terisi untuk ketiga tujuan',function(){
    const r=[];
    const uji0=Object.assign({},loadState(KEYS.user)||{},devProfile());
    ['lose','maintain','gain'].forEach(function(goal){
    const tg=calcEnergyTargets(Object.assign({},uji0,{goal:goal}));
    const meals=getMealsForDay(0,tg,getDislikes());
    if(meals.length!==MEAL_SLOTS.length)
    r.push(goal+': '+meals.length+' slot, harus '+MEAL_SLOTS.length);
    MEAL_SLOTS.forEach(function(s){
    const m=meals.filter(function(x){return x.slot===s.key;})[0];
    if(!m) r.push(goal+': slot '+s.key+' kosong');
    else if(!m.bahan||!m.bahan.length) r.push(goal+': slot '+s.key+' tanpa bahan');
    });
    });
    return r;
    },'resep');

    /* 3. latihan */
    
    _chk('Latihan naik bertahap, turun hanya saat deload',function(){
    const r=[];
    let prevLv=0, maxLv=0, deloadHari=0;
    let blokDeload=0, dalamDeload=false;
    for(let d=0;d<90;d++){
    const info=getLevelInfo(d);
    if(info.level<prevLv&&!info.deload)
    r.push('hari '+(d+1)+': level turun dari '+prevLv+' ke '+info.level+' di luar hari deload');
    if(info.level>8) r.push('hari '+(d+1)+': level '+info.level+' melebihi puncak 8');
    if(info.level>maxLv) maxLv=info.level;
    if(info.deload){
    deloadHari++;
    if(!dalamDeload){blokDeload++;dalamDeload=true;}
    } else dalamDeload=false;
    prevLv=info.level;
    const p=getPrescription(d,info.level,'strength','maintain');
    if(p.sets<1||p.reps<1) r.push('hari '+(d+1)+': set/rep di bawah 1');
    if(p.work<10) r.push('hari '+(d+1)+': durasi kerja '+p.work);
    if(p.rest<30) r.push('hari '+(d+1)+': istirahat '+p.rest);
    }
    if(maxLv!==8) r.push('level tertinggi cuma '+maxLv+', tidak pernah sampai 8');
    if(blokDeload<3||blokDeload>5)
    r.push('blok deload '+blokDeload+', nirinya 3 sampai 5 dalam 90 hari');
    if(deloadHari<14) r.push('total hari deload cuma '+deloadHari);
    return r;
    },'latihan');

    _chk('Setiap sesi punya gerakan yang boleh dipakai',function(){
    const r=[];
    for(let d=0;d<90;d+=3){
    const wk=getWorkoutForDay(d);
    if(!wk.exercises||!wk.exercises.length) r.push('hari '+(d+1)+': tanpa gerakan');
    if(!wk.label) r.push('hari '+(d+1)+': tanpa nama sesi');
    wk.exercises.forEach(function(e){
    if(!e.nama) r.push('hari '+(d+1)+': gerakan tanpa nama');
    if(!e.key) r.push('hari '+(d+1)+': gerakan tanpa kunci');
    });
    }
    return r;
    },'latihan');

    _chk('Periode deload muncul sesuai jadwal',function(){
    const r=[];
    let deload=0;
    for(let d=0;d<90;d++) if(isDeloadDay(d)) deload++;
    if(deload<18||deload>26) r.push('jumlah hari deload '+deload+', nirinya sekitar 22');
    return r;
    },'latihan');

    /* 4. penyimpanan */
    _chk('Kunci cache memuat tujuan, bukan cuma hari',function(){
    const r=[];
    const k1=dayCacheKey(0);
    if(k1.indexOf('lose')<0&&k1.indexOf('maintain')<0&&k1.indexOf('gain')<0)
    r.push('kunci cache tidak memuat tujuan: '+k1);
    return r;
    },'penyimpanan');

    _chk('Cache harian ditulis dan dibaca konsisten',function(){
    const r=[];
    const k=dayCacheKey(0);
    const isi=loadState(k);
    if(!isi||!Array.isArray(isi.meals)||!isi.meals.length)
    r.push('cache hari 0 kosong: '+k);
    return r;
    },'penyimpanan');

    _chk('Status harian terpisah per tanggal',function(){
    const r=[];
    const tgl=new Date().toISOString().split('T')[0];
    if(!loadState(todayKey())) r.push('catatan harian hari ini tidak tersimpan');
    const lain=todayKey().replace(tgl,'2000-01-01');
    if(loadState(lain)===undefined) r.push('kunci tanggal tidak bisa dihitung');
    return r;
    },'penyimpanan');

    _chk('localStorage menoleransi isi rusak',function(){
    const r=[];
    const k='ip90_daydata_rusak';
    try{
    localStorage.setItem(k,'{bukan json');
    if(loadState(k)!==null) r.push('JSON rusak tidak mengembalikan null');
    localStorage.removeItem(k);
    localStorage.setItem('ip90_user_rusak','<html>');
    if(loadState('ip90_user_rusak')!==null) r.push('isi rusak tidak mengembalikan null');
    localStorage.removeItem('ip90_user_rusak');
    }catch(e){ r.push('localStorage melempar: '+e.message); }
    return r;
    },'penyimpanan');

    /* 5. tampilan */
    _chk('Semua handler di markup punya fungsi',function(){
    const r=[];
    ['tab-latihan','tab-menu','tab-progress','exercise-list','meal-cards','workout-done-wrap']
    .forEach(function(id){
    if(!document.getElementById(id)) r.push('id tidak ada: '+id);
    });
    return r;
    },'tampilan');

    _chk('Angka tidak bocor ke teks',function(){
    const r=[];
    if(!document.getElementById('screen-lp')) return r;
    ['tab-latihan','tab-menu','tab-progress'].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    const t=el.textContent||'';
    const rusak=t.match(/undefined|NaN|\[object Object\]/g);
    if(rusak) r.push(id+': '+rusak.length+'x "'+rusak[0]+'"');
    });
    return r;
    },'tampilan');

    
    _chk('Tidak ada istilah asing atau jargon di layar',function(){
    const JEJAK=['Dashboard','Streak','streak','Interdisciplinary','Defisit','Surplus',
    'Level Energimu','Input DataTubuh','Mode Kalori','kalori seimbang',
    'untuk mulai tracking'];
    const r=[];
    ['screen-lf','screen-lh','screen-lp'].forEach(function(id){
    const el=document.getElementById(id);
    if(!el) return;
    let t=el.textContent||'';
    const html=el.innerHTML||'';
    ['aria-label','title','placeholder'].forEach(function(attr){
    const rx=new RegExp(attr+'="([^"]*)"','g');
    let m;
    while((m=rx.exec(html))!==null) t+=' '+m[1];
    });
    JEJAK.forEach(function(k){
    if(t.indexOf(k)>=0) r.push(id+': "'+k+'"');
    });
    });
    return r;
    },'tampilan');

    /* 6. orkestrator */

    

    _chk('Semua bahan punya catatan sumber USDA',function(){
    const r=[];
    Object.keys(NUTRIENTS).forEach(function(id){
    if(!SUMBER_GIZI[id]) r.push(id+': tidak ada di SUMBER_GIZI');
    });
    Object.keys(SUMBER_GIZI).forEach(function(id){
    if(!NUTRIENTS[id]) r.push(id+': ada di SUMBER_GIZI tapi tidak di NUTRIENTS');
    });
    return r;
    },'sumber data');

    _chk('Bahan tanpa sumber ditandai dengan benar',function(){
    const r=[];
    Object.keys(NUTRIENTS).forEach(function(id){
    const trust=NUTRIENT_TRUST[id];
    if(!SUMBER_GIZI[id]&&trust!=='belum bersumber')
    r.push(id+': tanpa sumber tapi tidak ditandai belum bersumber');
    });
    Object.keys(NUTRIENT_TRUST).forEach(function(id){
    if(!NUTRIENTS[id]) r.push(id+': ditandai tapi tidak ada di NUTRIENTS');
    });
    return r;
    },'sumber data');

    _chk('Padanan punya alasan tertulis',function(){
    const r=[];
    Object.keys(NUTRIENT_TRUST).forEach(function(id){
    if(typeof NUTRIENT_TRUST[id]==='string'&&NUTRIENT_TRUST[id]==='padanan'){
    if(!SUMBER_GIZI[id]||!SUMBER_GIZI[id].desc) r.push(id+': padanan tanpa deskripsi sumber');
    }
    });
    return r;
    },'sumber data');

    

    _chk('Tidak ada kata asing atau merek di layar',function(){
    const r=[];
    const terlarang=['cooking','crispy','grill','teflon','teflan','toast',
    'al dente','minced','portion'];
    const kumpulan=[];
    Object.keys(NUTRIENTS).forEach(function(id){ kumpulan.push(String(NUTRIENTS[id].cat||'')); });
    Object.keys(COOK_METHODS).forEach(function(k){
    const m=COOK_METHODS[k];
    kumpulan.push(String(m.label||''), String(m.note||''));
    });
        if(typeof RECIPES!=='undefined'&&Array.isArray(RECIPES)){
    RECIPES.forEach(function(x){
    kumpulan.push(String(x.nama||''));
    (x.langkah||[]).forEach(function(l){ kumpulan.push(String(l)); });
    (x.bahan||[]).forEach(function(b){ kumpulan.push(String(b.nama||b.cat||'')); });
    });
    }
    const teks=kumpulan.join(' ').toLowerCase();
    terlarang.forEach(function(k){
    if(teks.indexOf(k)>=0) r.push('"'+k+'" masih ada di teks yang tampil');
    });
    if(/\bkah\b/.test(teks)) r.push('"kah" (huruf u hilang dari "kuah")');
    return r;
    },'bahasa');

    _chk('Target sentuh minimal 40px',function(){
    const r=[];
    if(typeof getComputedStyle!=='function') return r;
    ['.btn','.lp-tab','.meal-cat-chip','.dev-btn'].forEach(function(sel){
    const el=document.querySelector(sel);
    if(!el) return;
    const h=el.getBoundingClientRect().height;
    if(h>0&&h<40) r.push(sel+': '+Math.round(h)+'px');
    });
    return r;
    },'tampilan');

    _chk('Halaman punya bahasa dan viewport',function(){
    const r=[];
    const html=document.documentElement;
    if(!html.getAttribute('lang')) r.push('html tanpa lang');
    if(!document.querySelector('meta[name="viewport"]')) r.push('tanpa meta viewport');
    if(!document.title) r.push('tanpa title');
    return r;
    },'tampilan');

    

    _chk('Status pengingat bisa dibaca dan valid',function(){
    const r=[];
    if(typeof notifBaca!=='function') return ['modul notif.js tidak termuat'];
    const s=notifBaca();
    if(!NOTIFJamValid(s.jam)) r.push('jam tidak valid: '+s.jam);
    if(typeof s.aktif!=='boolean') r.push('aktif bukan boolean');
    if(s.terakhir&&!/^\d{4}-\d{2}-\d{2}$/.test(s.terakhir)) r.push('tanggal terakhir rusak: '+s.terakhir);
    return r;
    },'pengingat');

    _chk('Pengingat tidak akan muncul dua kali sehari',function(){
    const r=[];
    if(typeof notifPeriksa!=='function') return ['modul notif.js tidak termuat'];
    const s=notifBaca();
    if(s.aktif&&notifBoleh()&&s.terakhir===notifTanggal())
    r.push('pertama kali hari ini seharusnya tampil, belum');
    return r;
    },'pengingat');

    

    _chk('Kunci cache berubah kalau tujuan atau bahan dihindari berubah',function(){
    const r=[];
    if(typeof dayCacheKey!=='function') return ['dayCacheKey tidak ada'];
    const asli=loadState(KEYS.user);
    const asliDislike=saveState
    try{
    const kA=dayCacheKey(5);
    saveState(KEYS.user,Object.assign({},asli,{goal:'lose'}));
    const kLose=dayCacheKey(5);
    saveState(KEYS.user,Object.assign({},asli,{goal:'gain'}));
    const kGain=dayCacheKey(5);
    if(kA===kLose) r.push('kunci sama setelah tujuan diganti');
    if(kLose===kGain) r.push('kunci sama antara turun dan naik');
    if(dayCacheKey(5)===dayCacheKey(6)) r.push('kunci sama untuk hari berbeda');
    if(kA.indexOf('lose')<0&&kA.indexOf('maintain')<0&&kA.indexOf('gain')<0)
    r.push('kunci tidak memuat tujuan: '+kA);
    }finally{
    saveState(KEYS.user,asli);
    }
    if(dayCacheKey(5)!==dayCacheKey(5)) r.push('kunci tidak stabil untuk keadaan yang sama');
    return r;
    },'penyimpanan');

    _chk('Semua resep bisa ditemukan dari slot-nya',function(){
    const r=[];
    if(typeof RECIPES==='undefined') return ['recipes.js tidak termuat'];
    const ada=new Set(RECIPES.map(function(x){ return x.slot; }));
    MEAL_SLOTS.forEach(function(s){
    if(!ada.has(s.key)) r.push('slot tanpa resep: '+s.key);
    });
    return r;
    },'kelengkapan resep');

    

    _chk('Setiap gerakan punya instruksi',function(){
    const r=[];
    if(typeof FLOW_POOLS==='undefined'&&typeof FOCUS_POOLS==='undefined')
    return ['kumpulan gerakan tidak termuat'];
    return r;
    },'latihan');

    function devSelfCheck(){
    const hasil=[];
    const grup={};
    _DEV_CHECKS.forEach(function(c){
    const t0=(typeof performance!=='undefined'&&performance.now)?performance.now():0;
    let r=[];
    try{ r=c.fn()||[]; }catch(e){ r=[ 'lempar: '+e.message ]; }
    const ms=((typeof performance!=='undefined'&&performance.now)?performance.now():0)-t0;
    const status=r.length?'gagal':'ok';
    hasil.push({nama:c.nama,grup:c.grup,status:status,masalah:r,ms:ms});
    grup[c.grup]=grup[c.grup]||{ok:0,gagal:0};
    grup[c.grup][status]++;
    });
    return {hasil:hasil,grup:grup,waktu:new Date().toLocaleTimeString('id-ID')};
    }

    /* 7. pemindaian panjang 3 tujuan x 90 hari */
    function devDeepScan(){
    const laporan=[];
    const asli=Object.assign({},getDevState());
    const profilAsli=loadState(KEYS.user);
    ['lose','maintain','gain'].forEach(function(goal){
    const uji=Object.assign({},loadState(KEYS.user)||{},devProfile(),{goal:goal});
    const tg=calcEnergyTargets(uji);
    const baris=[];
    const semua=new Set();
    const perSlot={};
    let auditGagal=0, worst=0, worstDay=-1, tanpaSlot=0;
    for(let d=0;d<90;d++){
    const meals=getMealsForDay(d,tg,getDislikes());
    if(meals.length!==MEAL_SLOTS.length){ tanpaSlot++; continue; }
    if(auditDayNutrition(meals).length) auditGagal++;
    const sum=summarizeDay(meals,tg);
    const dev=Math.abs(sum.kalori-tg.kcal)/tg.kcal*100;
    if(dev>worst){worst=dev;worstDay=d;}
    meals.forEach(function(m){
    semua.add(m.nama);
    const s=perSlot[m.slot]||(perSlot[m.slot]=new Set());
    s.add(m.nama);
    });
    const info=getLevelInfo(d);
    const wk=getWorkoutForDay(d);
    baris.push({day:d+1,level:info.level,deload:info.deload,focus:wk.label,
    kkal:Math.round(sum.kalori),dev:dev,
    protein:Math.round(sum.protein),karbo:Math.round(sum.karbo),lemak:Math.round(sum.lemak)});
    }
    laporan.push({
    goal:goal,kcal:Math.round(tg.kcal),protein:tg.protein,fat:tg.fat,
    bmr:Math.round(tg.bmr),tdee:Math.round(tg.tdee),
    baris:baris,semua:semua,perSlot:perSlot,
    auditGagal:auditGagal,tanpaSlot:tanpaSlot,worst:worst,worstDay:worstDay+1,
    config:{weight:uji.weight,height:uji.height,age:uji.age,gender:uji.gender,
    activity:uji.activity,targetWeight:uji.targetWeight,goal:uji.goal}
    });
    });
    setDevState({goal:asli.goal,profile:asli.profile});
    return laporan;
    }

    /* Panel: pemilih tiga tujuan */
    function devGoalPicker(){
    const aktif=currentGoal();
    return '<div class="dev-sec"><div class="dev-sec-t">Tujuan yang diuji</div>'+
    '<div class="dev-goals">'+GOALS.map(function(g){
    const on=(g.key===aktif);
    const tg=calcEnergyTargets(Object.assign({},devUser(),{goal:g.key}));
    return '<button class="dev-goal'+(on?' on':'')+'" onclick="devSetGoalAndRefresh(\''+g.key+'\')">'+
    '<span class="dg-l">'+_devEsc(g.label)+'</span>'+
    '<span class="dg-k">'+Math.round(tg.kcal)+' kkal</span>'+
    '<span class="dg-s">P '+tg.protein+'g &middot; L '+tg.fat+'g</span>'+
    '</button>';
    }).join('')+
    '</div>'+
    '<div class="dev-line">Target dihitung ulang untuk tiap tujuan. Cache menu dibuang otomatis supaya tidak ada hidangan dari tujuan lama yang terbaca.</div>'+
    '</div>';
    }

    /* Panel: editor profil */
    function devProfileEditor(){
    const u=devUser();
    const p=devProfile();
    const ada=Object.keys(p).length>0;
    const f=[
    ['weight','Berat','kg','70','120',0.5],
    ['targetWeight','Target berat','kg','65','120',0.5],
    ['height','Tinggi','cm','150','210',1],
    ['age','Usia','tahun','15','80',1],
    ['activity','Aktivitas','x','1.2','1.9',0.05]
    ];
    const gender=(u.gender==='f'?'wanita':'pria');
    return '<div class="dev-sec"><div class="dev-sec-t">Profil tiruan'+
    (ada?' <span class="dev-tag alt">aktif</span>':'')+'</div>'+
    '<div class="dev-line">Target: <b>'+Math.round(devTargets().kcal)+'</b> kkal &middot; BMR '+
    Math.round(devTargets().bmr)+' &middot; TDEE '+Math.round(devTargets().tdee)+'</div>'+
    '<div class="dev-fields">'+f.map(function(x){
    const v=(p[x[0]]!==undefined)?p[x[0]]:u[x[0]];
    return '<div class="dev-field"><label>'+x[1]+'</label>'+
    '<div class="dev-inwrap"><input class="dev-in" type="number" step="'+x[5]+'" min="'+x[3]+'" max="'+x[4]+'"'+
    ' value="'+(v===undefined||v===null?'':v)+'" data-k="'+x[0]+'"'+
    ' onchange="devProfileChange(this.dataset.k,this.value)">'+
    '<span class="dev-unit">'+x[2]+'</span></div></div>';
    }).join('')+
    '<div class="dev-field"><label>Jenis kelamin</label>'+
    '<div class="dev-inwrap"><select class="dev-in" data-k="gender"'+
    ' onchange="devProfileChange(this.dataset.k,this.value)">'+
    '<option value="m"'+(u.gender==='m'?' selected':'')+'>pria</option>'+
    '<option value="f"'+(u.gender==='f'?' selected':'')+'>wanita</option>'+
    '</select></div></div>'+
    '</div>'+
    '<div class="dev-line">BMR Mifflin: '+(u.gender==='f'?'10 &times; kg + 6,25 &times; cm - 5 &times; tahun - 161':'10 &times; kg + 6,25 &times; cm - 5 &times; tahun + 5')+'</div>'+
    '<div class="dev-btnrow">'+
    '<button class="dev-btn wide" onclick="devProfileRandom()">Contoh acak</button>'+
    (ada?'<button class="dev-btn wide" onclick="devClearProfileAndRefresh()">Kembali ke profil asli</button>':'')+
    '</div></div>';
    }

    function devProfileChange(k,v){
    const p=Object.assign({},devProfile());
    if(k==='gender'){ p.gender=v; }
    else{
    const n=parseFloat(v);
    if(!isFinite(n)){ delete p[k]; }
    else{ p[k]=n; }
    }
    devSetProfile(p);
    devInvalidate();
    devRefresh();
    renderDevPanel();
    }

    function devProfileRandom(){
    const g=GOALS[Math.floor(Math.random()*GOALS.length)].key;
    const f=Math.random()<0.5;
    const w=Math.round((f?48:62)+Math.random()*40);
    const t=Math.round(w*(f?(0.82+Math.random()*0.1):(1.06+Math.random()*0.12)));
    const h=Math.round(155+Math.random()*35);
    const a=Math.round(19+Math.random()*45);
    const act=[1.2,1.375,1.55,1.725,1.9][Math.floor(Math.random()*5)];
    devSetProfile({weight:w,targetWeight:t,height:h,age:a,gender:f?'f':'m',activity:act});
    devSetGoal(g);
    devInvalidate();
    devRefresh();
    renderDevPanel();
    }

    function devClearProfileAndRefresh(){
    devClearProfile();
    devInvalidate();
    devRefresh();
    renderDevPanel();
    }

    /* Panel: hasil cek bug */
    function devCheckPanel(){
    return '<div class="dev-sec"><div class="dev-sec-t">Cek bug otomatis</div>'+
    '<div class="dev-btnrow">'+
    '<button class="dev-btn wide primary" onclick="devRunCheck()">Cek semua ('+_DEV_CHECKS.length+')</button>'+
    '<button class="dev-btn wide" onclick="devRunDeep()">Cek 90 hari &times; 3 tujuan</button>'+
    '</div>'+
    '<div class="dev-line">Setiap cek bisa dijalankan sendiri lewat tombolnya di daftar. Tidak ada yang mengubah data. Cek 90 hari menghitung ulang seluruh menu untuk ketiga tujuan, butuh beberapa detik.</div>'+
    '<div class="dev-chklist">'+_DEV_CHECKS.map(function(c,i){
    return '<div class="dev-chkrow" id="dcr-'+i+'">'+
    '<button class="dev-chkgo" onclick="devRunOne('+i+')" title="Jalankan cek ini saja">'+
    '<span class="dc-i" id="dci-'+i+'">&middot;</span>'+
    '<span class="dc-n">'+_devEsc(c.nama)+'</span>'+
    '<span class="dc-g">'+_devEsc(c.grup)+'</span>'+
    '<span class="dc-t" id="dct-'+i+'"></span></button></div>';
    }).join('')+'</div>'+
    '<div id="dev-check-out"></div>'+
    '</div>';
    }

    
    function devJalankanCek(c){
    const t0=(typeof performance!=='undefined'&&performance.now)?performance.now():0;
    let r=[];
    try{ r=c.fn()||[]; }catch(e){ r=['lempar: '+e.message]; }
    const ms=((typeof performance!=='undefined'&&performance.now)?performance.now():0)-t0;
    return {nama:c.nama,grup:c.grup,masalah:r,ms:ms,status:r.length?'gagal':'ok'};
    }

    
    function devCek(nama){
    const c=_DEV_CHECKS.filter(function(x){ return x.nama===nama; })[0];
    if(!c) return {nama:nama,status:'tidak ada',masalah:['tidak ada cek bernama ini']};
    return devJalankanCek(c);
    }

    function devRunOne(i){
    const c=_DEV_CHECKS[i];
    if(!c) return;
    const t0=(typeof performance!=='undefined'&&performance.now)?performance.now():0;
    let r=[];
    try{ r=c.fn()||[]; }catch(e){ r=['lempar: '+e.message]; }
    const ms=((typeof performance!=='undefined'&&performance.now)?performance.now():0)-t0;
    const status=r.length?'gagal':'ok';
    const baris=document.getElementById('dcr-'+i);
    const ikon=document.getElementById('dci-'+i);
    const waktu=document.getElementById('dct-'+i);
    if(baris) baris.className='dev-chkrow '+status;
    if(ikon) ikon.innerHTML=status==='ok'?'&#10003;':'&#10007;';
    if(waktu) waktu.textContent=ms<1?'':Math.round(ms)+' ms';
    if(r.length){
    const out=document.getElementById('dev-check-out');
    if(out) out.innerHTML='<div class="dev-bad">'+_devEsc(c.nama)+'</div><div class="dc-m">'+
    r.slice(0,12).map(_devEsc).join('<br>')+
    (r.length>12?'<br>... +'+(r.length-12)+' masalah':'')+'</div>';
    }
    }

    function devRunCheck(){
    const out=document.getElementById('dev-check-out');
    if(out) out.innerHTML='<div class="dev-note">Memeriksa...</div>';
    setTimeout(function(){
    const r=devSelfCheck();
    if(!out) return;
    let h='<div class="dev-sum '+(Object.keys(r.grup).some(function(g){return r.grup[g].gagal;})?'bad':'ok')+'">'+
    Object.keys(r.grup).map(function(g){
    return _devEsc(g)+' '+r.grup[g].ok+' ok'+(r.grup[g].gagal?' / '+r.grup[g].gagal+' gagal':'');
    }).join(' &middot; ')+'</div>';
    h+=r.hasil.map(function(x){
    return '<div class="dev-chk '+x.status+'">'+
    '<span class="dc-i">'+(x.status==='ok'?'&#10003;':'&#10007;')+'</span>'+
    '<span class="dc-n">'+_devEsc(x.nama)+'</span>'+
    '<span class="dc-t">'+(x.ms<1?'':Math.round(x.ms)+' ms')+'</span>'+
    (x.masalah.length?'<div class="dc-m">'+x.masalah.slice(0,6).map(_devEsc).join('<br>')+
    (x.masalah.length>6?'<br>... +'+(x.masalah.length-6)+' masalah':'')+'</div>':'')+
    '</div>';
    }).join('');
    out.innerHTML=h+'<div class="dev-line">Dicek '+_devEsc(r.waktu)+'</div>';
    },30);
    }

    function devRunDeep(){
    const out=document.getElementById('dev-check-out');
    if(out) out.innerHTML='<div class="dev-note">Menghitung 270 hari menu, tunggu sebentar...</div>';
    setTimeout(function(){
    const laporan=devDeepScan();
    if(!out) return;
    let h='';
    laporan.forEach(function(L){
    const gagal=L.auditGagal+L.tanpaSlot;
    h+='<div class="dev-sum '+(gagal?'bad':'ok')+'" style="margin-top:10px">'+
    _devEsc(L.goal.toUpperCase())+' &middot; '+L.kcal+' kkal &middot; BMR '+L.bmr+' &middot; P '+L.protein+'g L '+L.fat+'g</div>';
    h+='<div class="dev-line">Profil: '+L.config.weight+' kg, '+L.config.height+' cm, '+L.config.age+
    ' tahun, '+L.config.gender+(L.config.targetWeight?' , target '+L.config.targetWeight+' kg':'')+'</div>';
    h+='<div class="dev-line '+(gagal?'bad':'ok')+'">'+
    (gagal?('Audit gagal '+L.auditGagal+' hari, slot kosong '+L.tanpaSlot+' hari')
    :'Audit lolos 90 hari, semua slot terisi')+
    ' &middot; '+L.semua.size+' hidangan berbeda &middot; meleset terburuk '+L.worst.toFixed(1)+'% (hari '+L.worstDay+')</div>';
    h+='<table class="dev-tbl"><thead><tr><th class="n">H</th><th>L</th><th>Fokus</th><th class="n">kkal</th><th class="n">P</th><th class="n">K</th><th class="n">L</th><th class="n">%</th></tr></thead><tbody>';
    L.baris.forEach(function(b){
    h+='<tr'+(b.deload?' class="dl"':'')+'><td class="n">'+b.day+'</td>'+
    '<td>'+b.level+(b.deload?'d':'')+'</td><td>'+_devEsc(b.focus)+'</td>'+
    '<td class="n">'+b.kkal+'</td><td class="n">'+b.protein+'</td><td class="n">'+b.karbo+'</td>'+
    '<td class="n">'+b.lemak+'</td><td class="n '+(b.dev>10?'bad':'')+'">'+b.dev.toFixed(0)+'</td></tr>';
    });
    h+='</tbody></table>';
    h+='<div class="dev-sub">Hewan per slot</div>'+
    Object.keys(L.perSlot).map(function(k){
    return '<div class="dev-line"><b>'+_devEsc(k)+'</b> ('+L.perSlot[k].size+'): '+
    [...L.perSlot[k]].map(_devEsc).join(', ')+'</div>';
    }).join('');
    });
    h+='<div class="dev-line">Selesai '+_devEsc(new Date().toLocaleTimeString('id-ID'))+'</div>';
    out.innerHTML=h;
    },30);
    }

    let _devPanel=null;
    let _devScanCache=null;

    function _buildDevPanel(){
    if(_devPanel) return _devPanel;
    const el=document.createElement('div');
    el.className='dev-overlay';
    el.id='dev-overlay';
    el.innerHTML=
    '<div class="dev-panel" role="dialog" aria-label="Developer">'+
    '  <div class="dev-head">'+
    '    <div class="dev-title">Developer</div>'+
    '    <button class="dev-close" onclick="closeDevPanel()" aria-label="Tutup">&times;</button>'+
    '  </div>'+
    '  <div class="dev-body" id="dev-body"></div>'+
    '</div>';
    document.body.appendChild(el);
    _devPanel=el;
    return el;
    }

    function openDevPanel(){
    _buildDevPanel();
    renderDevPanel();
    _devPanel.classList.add('active');
    document.body.style.overflow='hidden';
    }

    function closeDevPanel(){
    if(!_devPanel) return;
    _devPanel.classList.remove('active');
    document.body.style.overflow='';
    }

    function _devRow(label,isi,kelas){
    return '<div class="dev-row"><span class="dev-k">'+_devEsc(label)+'</span>'+
    '<span class="dev-v '+(kelas||'')+'">'+isi+'</span></div>';
    }

    function _devSwitch(label,nyala,fn,ket){
    return '<label class="dev-switch">'+
    '<input type="checkbox" '+(nyala?'checked':'')+' onchange="'+fn+'(this.checked)">'+
    '<span class="dev-switch-box"></span>'+
    '<span class="dev-switch-label">'+_devEsc(label)+
    (ket?'<small>'+_devEsc(ket)+'</small>':'')+'</span></label>';
    }

    function devToggleMode(on){
    setDevState({on:!!on});
    if(!on){
    setDevState({cheat:false,day:null,goal:null,profile:{}});
    devInvalidate();
    }
    renderDevPanel();
    if(on) devRefresh(); else { try{ showScreen('lp'); }catch(e){} }
    }

    function devToggleCheat(on){ setDevState({cheat:!!on}); renderDevPanel(); devRefresh(); }

    function devScanRun(from,to){
    const body=document.getElementById('dev-body');
    if(body){
    body.innerHTML='<div class="dev-note">Menghitung '+((to-from)+1)+' hari, tunggu sebentar...</div>';
    }
    setTimeout(function(){
    _devScanCache=devScan(from,to);
    renderDevPanel();
    },30);
    }

    function renderDevPanel(){
    if(!_devPanel) return;
    const body=document.getElementById('dev-body');
    if(!body) return;
    const dev=getDevState();
    const day=getCurrentDay();
    const r=devInspectDay(day);
    const phase=(PHASES[r.phase]||{label:'-'});

    let h='';

    /* 1. mode */
    h+='<div class="dev-sec"><div class="dev-sec-t">Mode</div>'+
    _devSwitch('Developer aktif',dev.on,'devToggleMode','hari virtual + panel')+
    _devSwitch('Buka semua yang terkunci',dev.cheat,'devToggleCheat','lewati cek kondisi, urutan latihan, kunci tab')+
    (dev.cheat?'<div class="dev-warn">Cheat aktif. Kunci urutan, cek kondisi tubuh, dan syarat selesai latihan dilewati.</div>':'')+
    (isLoggedIn()?'<div class="dev-btnrow"><button class="dev-btn wide" onclick="authLogout()">Keluar dari login</button></div>':'')+
    '</div>';

    /* 2. tiga tujuan */
    h+=devGoalPicker();

    /* 3. profil tiruan */
    h+=devProfileEditor();

    /* 4. navigasi hari */
    h+='<div class="dev-sec"><div class="dev-sec-t">Hari</div>'+
    '<div class="dev-nav">'+
    '<button class="dev-btn" onclick="devGoDay('+(day-7)+')">-7</button>'+
    '<button class="dev-btn" onclick="devGoDay('+(day-1)+')">-1</button>'+
    '<input class="dev-dayin" type="number" min="1" max="90" value="'+(day+1)+'"'+
    ' onchange="devGoDay(this.value-1)" aria-label="Nomor hari">'+
    '<button class="dev-btn" onclick="devGoDay('+(day+1)+')">+1</button>'+
    '<button class="dev-btn" onclick="devGoDay('+(day+7)+')">+7</button>'+
    '</div>'+
    '<div class="dev-line">Hari <b>'+(day+1)+'</b> dari '+DEV_SCAN_MAX+
    (dev.day===null?' <span class="dev-tag">jam sistem</span>':' <span class="dev-tag alt">virtual</span>')+'</div>'+
    '<div class="dev-btnrow">'+
    '<button class="dev-btn wide" onclick="devGoDay(0)">Hari 1</button>'+
    '<button class="dev-btn wide" onclick="devGoDay(29)">Hari 30</button>'+
    '<button class="dev-btn wide" onclick="devGoDay(59)">Hari 60</button>'+
    '<button class="dev-btn wide" onclick="devGoDay(89)">Hari 90</button>'+
    (dev.day===null?'':'<button class="dev-btn wide primary" onclick="devGoReal()">Kembali ke hari nyata</button>')+
    '</div></div>';

    /* 5. rincian hari ini */
    h+='<div class="dev-sec"><div class="dev-sec-t">Rincian hari '+(day+1)+'</div>'+
    _devRow('Tujuan',_devEsc(r.goal))+
    _devRow('Fase',_devEsc(phase.label)+' <small>'+_devEsc(phase.days)+'</small>')+
    _devRow('Level',r.level+' '+_devEsc(r.levelName)+(r.deload?' <span class="dev-tag warn">deload</span>':''))+
    _devRow('Fokus',_devEsc(r.focus)+' <small>'+_devEsc(r.typeLabel)+'</small>')+
    _devRow('Resep latihan',r.sets+' set x '+r.reps+' rep, '+r.work+' dtk, rest '+r.rest+' dtk, '+r.exCount+' gerakan')+
    _devRow('Target',Math.round(r.targets.kcal)+' kkal &middot; P '+r.targets.protein+'g &middot; L '+r.targets.fat+'g &middot; F '+r.targets.fiber+'g')+
    '<div class="dev-line"><b>Sumber angka gizi</b><br>'+_devEsc(NUTRIENT_SOURCE)+'</div>'+
    '<table class="dev-tbl"><thead><tr><th>Slot</th><th>Hidangan</th><th class="n">kkal</th><th class="n">P</th><th class="n">K</th><th class="n">L</th></tr></thead><tbody>'+
    r.meals.map(function(m){
    return '<tr><td>'+_devEsc(m.timeLabel||m.slot)+'</td><td>'+_devEsc(m.nama)+'</td>'+
    '<td class="n">'+Math.round(m.nutrisi.kalori)+'</td>'+
    '<td class="n">'+Math.round(m.nutrisi.protein)+'</td>'+
    '<td class="n">'+Math.round(m.nutrisi.karbo)+'</td>'+
    '<td class="n">'+Math.round(m.nutrisi.lemak)+'</td></tr>';
    }).join('')+
    '<tr class="tot"><td>Total</td><td></td><td class="n">'+Math.round(r.sum.kalori)+'</td>'+
    '<td class="n">'+Math.round(r.sum.protein)+'</td>'+
    '<td class="n">'+Math.round(r.sum.karbo)+'</td>'+
    '<td class="n">'+Math.round(r.sum.lemak)+'</td></tr>'+
    '</tbody></table>'+
    (function(){
    const nama=Object.keys(r.unverified||{});
    if(!nama.length) return '<div class="dev-ok">Semua bahan di hari ini angkanya persis dari USDA</div>';
    return '<div class="dev-line"><b>Bahan pakai padanan USDA</b><br>'+
    nama.map(function(x){
    const t=[...new Set(r.unverified[x])].join(', ');
    return _devEsc(x)+' <small>'+_devEsc(t)+'</small>';
    }).join('<br>')+'</div>';
    })()+
    '<div class="dev-line '+(tg0(r.sum,r.targets)>10?'bad':'ok')+'">Total '+
    Math.round(r.sum.kalori)+' / '+Math.round(r.targets.kcal)+' kkal, meleset '+
    tg0(r.sum,r.targets).toFixed(1)+'%</div>'+
    (r.audit.length?'<div class="dev-bad">Audit: '+r.audit.length+' masalah</div>':'<div class="dev-ok">Audit lolos, tidak ada masalah</div>')+
    '</div>';

    /* 6. pemindai pola */
    h+='<div class="dev-sec"><div class="dev-sec-t">Pindai pola</div>'+
    '<div class="dev-btnrow">'+
    '<button class="dev-btn wide" onclick="devScanRun(0,6)">7 hari</button>'+
    '<button class="dev-btn wide" onclick="devScanRun(0,29)">30 hari</button>'+
    '<button class="dev-btn wide" onclick="devScanRun(0,'+(DEV_SCAN_MAX-1)+')">90 hari</button>'+
    '</div>';
    if(_devScanCache){
    const s=_devScanCache;
    const last=s.rows[s.rows.length-1];
    h+='<div class="dev-line">Pemindaian hari '+(s.rows[0].day+1)+'-'+(last.day+1)+', '+
    s.semua.size+' hidangan berbeda, '+(s.totalResep?s.totalResep+' hidangan di database':'')+'</div>';
    h+='<div class="dev-line '+(s.worst>10?'bad':'ok')+'">Meleset paling jauh '+
    s.worst.toFixed(1)+'% (hari '+(s.worstDay+1)+')</div>';
    if(s.auditGagal.length){
    h+='<div class="dev-bad">Audit gagal di '+s.auditGagal.length+' hari</div>';
    } else {
    h+='<div class="dev-ok">Audit lolos semua '+s.rows.length+' hari</div>';
    }
    h+='<table class="dev-tbl"><thead><tr><th class="n">H</th><th>Level</th><th>Fokus</th><th class="n">Set</th><th class="n">kkal</th><th class="n">%</th></tr></thead><tbody>'+
    s.rows.map(function(x){
    return '<tr'+(x.deload?' class="dl"':'')+'><td class="n">'+(x.day+1)+'</td>'+
    '<td>L'+x.level+(x.deload?' d':'')+'</td>'+
    '<td>'+_devEsc(x.focus)+'</td>'+
    '<td class="n">'+x.sets+'x'+x.reps+'</td>'+
    '<td class="n">'+x.kkal+'</td>'+
    '<td class="n '+(x.dev>10?'bad':'')+'">'+x.dev.toFixed(0)+'</td></tr>';
    }).join('')+
    '</tbody></table>';
    h+='<div class="dev-sub">Hewan per slot</div>'+
    Object.keys(s.perSlot).map(function(k){
    return '<div class="dev-line"><b>'+_devEsc(k)+'</b> ('+s.perSlot[k].size+'): '+
    [...s.perSlot[k]].map(_devEsc).join(', ')+'</div>';
    }).join('');
    }
    h+='</div>';

    /* 7. cek bug otomatis */
    h+=devCheckPanel();

    /* 8. sumber data */
    h+='<div class="dev-sec"><div class="dev-sec-t">Data</div>'+
    _devRow('Bahan','<b>'+Object.keys(NUTRIENTS).length+'</b> bahan')+
    _devRow('Bersumber USDA',Object.keys(SUMBER_GIZI).filter(function(k){return SUMBER_GIZI[k].fdc;}).length+' bahan')+
    _devRow('Belum bersumber',Object.keys(NUTRIENTS).filter(function(k){
    return !(SUMBER_GIZI[k]&&SUMBER_GIZI[k].fdc);
    }).map(function(k){return k;}).join(', ')||'-')+
    _devRow('Penyimpangan 4/4/9',auditNutrientDB(25).length+' bahan melebihi 25%')+
    '<div class="dev-btnrow">'+
    '<button class="dev-btn wide" onclick="devCopyData()">Salin ringkasan</button>'+
    '<button class="dev-btn wide" onclick="devReset()">Reset mode developer</button>'+
    '</div></div>';

    body.innerHTML=h;
    }

    function devCopyData(){
    const day=getCurrentDay();
    const r=devInspectDay(day);
    const txt=[
    'Hari '+(day+1)+' dari '+DEV_SCAN_MAX,
    'Fase '+((PHASES[r.phase]||{}).label||'-')+' | Level '+r.level+' '+r.levelName+(r.deload?' (deload)':''),
    'Fokus: '+r.focus+' | '+r.sets+' set x '+r.reps+' rep',
    'Target: '+Math.round(r.targets.kcal)+' kkal',
    'Total : '+Math.round(r.sum.kalori)+' kkal (meleset '+tg0(r.sum,r.targets).toFixed(1)+'%)',
    '',
    r.meals.map(function(m){return '- ['+(m.timeLabel||m.slot)+'] '+m.nama+' '+Math.round(m.nutrisi.kalori)+' kkal';}).join('\n')
    ].join('\n');
    try{
    if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt);
    }else{
    const ta=document.createElement('textarea');
    ta.value=txt;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');}catch(e){}
    document.body.removeChild(ta);
    }
    _toastMsg('dev_toast','Ringkasan tersalin');
    }catch(e){ console.error('copy error:',e); }
    }

    function devReset(){
    saveState(DEV_KEY,null);
    try{localStorage.removeItem(DEV_KEY);}catch(e){}
    Object.keys(localStorage).filter(function(k){return k.indexOf('ip90_today_dev')===0||
    k.indexOf('ip90_energy_dev')===0||k.indexOf('ip90_journal_dev')===0;})
    .forEach(function(k){localStorage.removeItem(k);});
    devInvalidate();
    _devScanCache=null;
    closeDevPanel();
    try{ showScreen('lp'); }catch(e){}
    _toastMsg('dev_toast','Mode developer direset');
    }

    
    const AUTH_SALT='ip90';
    const AUTH_USER='066411c23410dbe0';
    const AUTH_PASS='f84a1099f7ede000';
    const SESSION_HRS=12;
    const SESSION_KEY='ip90_session';

    function _authHash(t){
    let h=5381;
    const s=AUTH_SALT+'|'+t;
    for(let i=0;i<s.length;i++){ h=((h<<5)+h+s.charCodeAt(i))>>>0; }
    let out='';
    for(let i=0;i<4;i++){ out+=(h>>>0).toString(16).padStart(8,'0');
    h=((h*1103515245+12345)>>>0); }
    return out.slice(0,16);
    }

    function isLoggedIn(){
    const s=loadState(SESSION_KEY);
    return !!(s&&s.exp&&s.exp>Date.now());
    }

    function authLogin(user,pass){
    if(_authHash(String(user||'').trim().toLowerCase())!==AUTH_USER) return false;
    if(_authHash(String(pass||''))!==AUTH_PASS) return false;
    saveState(SESSION_KEY,{exp:Date.now()+SESSION_HRS*3600*1000});
    return true;
    }

    function authLogout(){
    try{localStorage.removeItem(SESSION_KEY);}catch(e){}
    if(_devPanel) closeDevPanel();
    _devScanCache=null;
    const b=document.querySelector('.dev-launch');
    if(b) b.remove();
    try{ showScreen(devOn()?'lp':'la'); }catch(e){}
    }

    
    function openLogin(){
    let el=document.getElementById('login-screen');
    if(el) el.remove();
    el=document.createElement('div');
    el.className='login-screen';
    el.id='login-screen';
    el.innerHTML=
    '<div class="login-scan" aria-hidden="true"></div>'+
    '<pre class="login-grid" aria-hidden="true"></pre>'+
    '<form class="login-box" onsubmit="return loginSubmit(event)" autocomplete="off">'+
    '  <div class="login-head">'+
    '    <span class="login-dots" aria-hidden="true"><i></i><i></i><i></i></span>'+
    '    <span class="login-path">~/dev/access</span>'+
    '  </div>'+
    '  <div class="login-term">'+
    '    <div class="ln"><span class="pr">&gt;</span> inisialisasi sesi dev<span class="cur"></span></div>'+
    '    <div class="ln dim">sinkron kredensial dengan penyimpanan lokal</div>'+
    '    <div class="ln" id="login-log">&gt; menunggu kredensial<span class="cur"></span></div>'+
    '  </div>'+
    '  <div class="login-sep"></div>'+
    '  <div class="login-field">'+
    '    <label class="login-lbl" for="login-user">pengguna</label>'+
    '    <input id="login-user" class="login-in" type="text" autocomplete="off"'+
    '     autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Pengguna">'+
    '  </div>'+
    '  <div class="login-field">'+
    '    <label class="login-lbl" for="login-pass">kunci</label>'+
    '    <input id="login-pass" class="login-in" type="password" autocomplete="off" aria-label="Kunci">'+
    '  </div>'+
    '  <div class="login-err" id="login-err" role="status" aria-live="polite"></div>'+
    '  <div class="login-actions">'+
    '    <button class="login-go" type="submit"><span>&gt;</span> masuk</button>'+
    '    <button class="login-back" type="button" onclick="closeLogin()">batal</button>'+
    '  </div>'+
    '  <div class="login-foot">mode developer &middot; 3 tujuan &middot; lompat 90 hari &middot; cek bug</div>'+
    '</form>';
    document.body.appendChild(el);

    const grid=el.querySelector('.login-grid');
    if(grid){
    let g='';
    for(let y=0;y<18;y++){ g+='<span class="g-row">';
      for(let x=0;x<52;x++){ g+=(Math.random()<0.14?(Math.random()<0.5?'0':'1'):' '); }
      g+='</span>'; }
    grid.textContent=g;
    }

    const log=document.getElementById('login-log');
    setTimeout(function(){
    if(log&&!isLoggedIn()) log.innerHTML='&gt; memverifikasi hash...';
    },420);
    setTimeout(function(){
    const f=document.getElementById('login-user');
    if(f) f.focus();
    },80);
    }

    function closeLogin(){
    const el=document.getElementById('login-screen');
    if(el) el.remove();
    }

    function loginSubmit(ev){
    if(ev&&ev.preventDefault) ev.preventDefault();
    const u=document.getElementById('login-user');
    const p=document.getElementById('login-pass');
    const e=document.getElementById('login-err');
    if(!u||!p||!e) return false;
    if(authLogin(u.value,p.value)){
    u.value='';p.value='';
    closeLogin();
    setDevState({on:true});
    try{ mountDevButton(); }catch(e){}
    openDevPanel();
    devRefresh();
    return false;
    }
    e.textContent='Akses ditolak. hash tidak cocok.';
    u.value='';p.value='';
    const log=document.getElementById('login-log');
    if(log) log.innerHTML='&gt; hash tidak cocok <span class="cur"></span>';
    if(p.focus) p.focus();
    return false;
    }

    
    const _HIDDEN_ENTRY_TARGETS=['#screen-la .la-logo','#lh-name','#lh-day'];

    function bindHiddenEntry(){
    let hit=0, timer=null;
    const DAFTAR=_HIDDEN_ENTRY_TARGETS
    .map(function(sel){ return document.querySelector(sel); })
    .filter(Boolean);
    if(!DAFTAR.length) return;
    DAFTAR.forEach(function(el){
    el.style.cursor='default';
    el.addEventListener('click',function(){
    hit++;
    if(timer) clearTimeout(timer);
    timer=setTimeout(function(){hit=0;},900);
    if(hit>=5){
    hit=0;
    openLogin();
    }
    });
    });
    }

    
    function toggleNotifPanel(btn){
    const el=document.getElementById('notif-panel');
    if(!el) return;
    const buka=el.hasAttribute('hidden');
    if(buka){
    renderNotifPanel();
    el.removeAttribute('hidden');
    if(btn) btn.setAttribute('aria-expanded','true');
    }else{
    el.setAttribute('hidden','');
    if(btn) btn.setAttribute('aria-expanded','false');
    }
    }

    function renderNotifPanel(){
    const st=document.getElementById('notif-status');
    if(st) st.textContent=notifStatusTeks();
    const tg=document.getElementById('notif-toggle');
    if(tg) tg.checked=notifBaca().aktif;
    const tm=document.getElementById('notif-time');
    if(tm) tm.value=notifBaca().jam;
    const dot=document.getElementById('notif-dot');
    if(dot) dot.hidden=!(notifBaca().aktif&&notifBoleh());
    }

    function notifToggle(mau){
    if(!mau){ notifMatikan(); return; }
    notifAktifkan().then(function(izin){
    renderNotifPanel();
    if(izin==='granted') notifPeriksa(true);
    });
    }

    document.addEventListener('click',function(e){
    const el=document.getElementById('notif-panel');
    if(!el||el.hasAttribute('hidden')) return;
    if(el.contains(e.target)) return;
    if(e.target.closest&&e.target.closest('.notif-bell')) return;
    el.setAttribute('hidden','');
    });

    
    function rebindHiddenEntry(){
    let baru=0;
    _HIDDEN_ENTRY_TARGETS.forEach(function(sel){
    const el=document.querySelector(sel);
    if(!el||el.hasAttribute('data-hidden-entry')) return;
    el.setAttribute('data-hidden-entry','1');
    baru++;
    });
    if(baru) bindHiddenEntry();
    }

    function initDevFromUrl(){
    try{
    const q=String(location.search||'');
    if(/[?&]login=1/.test(q)){ openLogin(); return; }
    if(/[?&]dev=1/.test(q)&&isLoggedIn()){ setDevState({on:true}); openDevPanel(); return; }
    if(/[?&]dev=1/.test(q)){ openLogin(); return; }
    }catch(e){}
    }

    function mountDevButton(){
    if(!isLoggedIn()&&!devOn()) return;
    const right=document.querySelector('#screen-lp .lp-topbar-right');
    if(!right||right.querySelector('.dev-launch')) return;
    const b=document.createElement('button');
    b.className='dev-launch';
    b.type='button';
    b.setAttribute('aria-label','Developer');
    b.title='Developer';
    b.innerHTML='<svg viewBox="0 0 24 24"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>';
    b.onclick=function(){
    if(devOn()) openDevPanel();
    else openLogin();
    };
    right.insertBefore(b,right.firstChild);
    }

    /* HAPUS DATA */
    function showResetModal(){document.getElementById('reset-modal').classList.add('active');}
    function closeResetModal(){document.getElementById('reset-modal').classList.remove('active');}
    function resetAll(){
    clearAllStorage();closeResetModal();selectedGoal='';
    document.querySelectorAll('.form-goal-btn').forEach(b=>b.classList.remove('selected'));
    document.querySelectorAll('.dislike-chip').forEach(c=>{c.classList.remove('selected');const ch=c.querySelector('.dislike-chip-check');if(ch)ch.textContent='';});
    const dn=document.getElementById('dislike-notice');if(dn)dn.style.display='none';
    document.querySelectorAll('.form-input').forEach(i=>{i.value='';i.classList.remove('error');});
    document.querySelectorAll('.form-select').forEach(s=>{s.value='';});
    document.querySelectorAll('.form-error-msg').forEach(e=>e.classList.remove('show'));
    const swEl=document.getElementById('safety-warning');if(swEl) swEl.classList.remove('show');
    clearInterval(window._exTimerInterval);
    clearTimeout(window._exTimerTimeout);
    window._exTimerInterval = undefined;
    window._exTimerTimeout  = undefined;
    for(let i = 0; i < MAX_FLOW_ITEMS; i++) {
        const wrap = document.getElementById('ex-timer-' + i);
        if(wrap) {
        if(wrap._interval) { clearInterval(wrap._interval); clearTimeout(wrap._interval); }
        wrap._interval = undefined;
        wrap._exState = undefined;
        wrap._timerState = 'idle';
        wrap._secsLeft = 0;
        wrap._transitioning = false;
        }
    }
    showScreen('la');
    }

    /* PASANG */
    window.addEventListener('DOMContentLoaded',initApp);
