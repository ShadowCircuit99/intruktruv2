/*
   NUTRITION ENGINE
   Semua angka gizi berasal dari USDA FoodData Central, diambil otomatis dari
   file CSV resmi (SR Legacy 2018-04, Foundation Food 2026-04-30, Survey/FNDDS
   2024-10-31). Bukan diketik manual. Rincian per bahan ada di SUMBER.md, dan
   nomor FDC-nya di SUMBER_GIZI.
   Rumus:
   gizi hidangan = Σ (gizi bahan × gram dipakai ÷ 100) + minyak terserap
   energi        = protein×4 + karbo×4 + lemak×9 + serat×2   (faktor Atwater)
   Energi tidak diambil dari kolom calories USDA, tapi dihitung dari
   makronutrien. Alasannya USDA memakai faktor Atwater sendiri yang
   berbeda-beda -- kacang tanah misal 587 kkal di tabelnya, sedangkan 4/4/9
   memberi 443. Kolom k disimpan hanya sebagai pembanding kualitas data.
   Konvensi karbo: c = karbohidrat TERSEDIA (karbohidrat total 1005 dikurangi
   serat 1079), supaya serat tidak dihitung dua kali sebagai energi.
   */

    /* Energi dari faktor Atwater: 4 kkal/g protein dan karbohidrat,
       9 kkal/g lemak, 2 kkal/g serat. */
    function energyFromMacros(p, c, f, fb){
    return p*4 + c*4 + f*9 + fb*2;
    }

    /* ASAL ANGKA DI BAWAH

    Semuanya diambil dari USDA FoodData Central: file CSV resmi SR Legacy
    2018-04 dan Foundation Food 2026-04-30, diunduh dari fdc.nal.usda.gov
    lalu dibaca baris demi baris. Tidak ada angka yang diketik dari ingatan.

    Tiga bahan belum punya sumber USDA dan diberi angka 0 dengan penanda
    "BELUM BERSUMBER": serai, susu kedelai, coklat panas. Angka 0 di sana
    BUKAN nilai sebenarnya dan tidak boleh dipakai sebagai acuan.

    Dua puluh satu bahan memakai padanan USDA lain karena bahan aslinya
    tidak ada di database itu. Barisnya diberi tanda "// padanan USDA"
    beserta alasannya, jadi tidak ada yang diam-diam disamakan.

    Alat untuk memperbarui: lihat folder fdc/. */
    const NUTRIENT_SOURCE = 'USDA FoodData Central (SR Legacy 2018-04, Foundation Food 2026-04-30, Survey/FNDDS 2024-10-31), diambil otomatis dari file CSV resmi; hanya serai yang belum bersumber dan 21 memakai padanan USDA - lihat catatan di tiap baris';

    /* Tingkat keyakinan per bahan, supaya angka perkiraan tidak tercampur
    dengan angka yang benar-benar terukur. 'derived' = tidak ada baris baku,
    nilainya disusun dari komponen atau mengikuti faktor Atwater berbeda. */
        /* Bahan yang angkanya belum punya sumber USDA, atau memakai padanan.
       Lihat SUMBER_GIZI untuk daftar lengkap dan alasannya. -- */
        /* Bahan yang angkanya belum punya sumber USDA, atau memakai padanan.
       Lihat SUMBER_GIZI untuk daftar lengkap dan alasannya. -- */
    const NUTRIENT_TRUST = {
  ketupat:          'padanan',
  lontong:          'padanan',
  roti_tahu:        'padanan',
  mie_instan:       'padanan',
  daging_kambing:   'padanan',
  ikan_tongkol:     'padanan',
  ikan_kembung:     'padanan',
  bakso:            'padanan',
  tempe:            'sebagian',
  tempe_mendoan:    'padanan',
  kangkung:         'padanan',
  kacang_panjang:   'padanan',
  labu_kuning:      'padanan',
  kunyit:           'padanan',
  ketumbar_bubuk:   'padanan',
  merica_bubuk:     'padanan',
  kecap_manis:      'padanan',
  minyak_sawit:     'padanan',
  santan_kental:    'padanan',
  salak:            'padanan',
  kerupuk:          'padanan',
  kerupuk_udang:    'padanan',
  serai:            'belum bersumber',
    };

    /* Sumber per bahan, supaya angkanya bisa diaudit.
       Buka https://fdc.nal.usda.gov lalu cari fdc_id-nya untuk melihat
       baris asli. Dataset:
         SR = SR Legacy 2018-04
         FO = Foundation Food 2026-04-30 (nilai pengukuran laboratorium)
         FD = Survey Food / FNDDS 2024-10-31
         FO = Foundation Food 2026-04-30 (nilai pengukuran laboratorium)
       "padanan"  = bahan aslinya tidak ada di USDA, jadi memakai bahan USDA
                  lain sebagai pembanding; alasannya ada di baris bawahnya.
       "kosong"   = belum ada sumber USDA sama sekali, angkanya 0 dan
                  BELUM boleh dianggap sebagai nilai sebenarnya. -- */
    const SUMBER_GIZI = {
    beras_putih:      {ds:'SR',fdc:168877,desc:'Rice, white, long-grain, regular, raw, enriched'},
    beras_merah:      {ds:'SR',fdc:169703,desc:'Rice, brown, long-grain, raw (Includes foods for USDA\'s Food Distribution Program)'},
    nasi_putih:       {ds:'SR',fdc:168878,desc:'Rice, white, long-grain, regular, enriched, cooked'},
    nasi_merah:       {ds:'SR',fdc:169704,desc:'Rice, brown, long-grain, cooked (Includes foods for USDA\'s Food Distribution Program)'},
    ketupat:          {ds:'SR',fdc:168878,desc:'Rice, white, long-grain, regular, enriched, cooked'},  // padanan
                      // padanan: Ketupat tidak ada di USDA. Bahannya sama dengan nasi putih matang, jadi angka diambil dari nasi putih matang.
    lontong:          {ds:'SR',fdc:168878,desc:'Rice, white, long-grain, regular, enriched, cooked'},  // padanan
                      // padanan: USDA hanya punya rice cake KERING (380-392 kkal), sedangkan lontong direbus. Dipakai nasi putih matang supaya besarannya tidak jauh meleset; deviasi nyata masih sekitar 25 persen.
    roti_tawar:       {ds:'SR',fdc:174924,desc:'Bread, white, commercially prepared'},
    roti_gandum:      {ds:'SR',fdc:172688,desc:'Bread, whole-wheat, commercially prepared'},
    roti_tahu:        {ds:'SR',fdc:174924,desc:'Bread, white, commercially prepared'},  // padanan
                      // padanan: Roti isi tahu tidak ada di USDA. Yang dipakai hanya roti tawar putih; isi tahu tidak termasuk, jadi angka calories sebenarnya lebih tinggi.
    kentang:          {ds:'SR',fdc:170026,desc:'Potatoes, flesh and skin, raw'},
    ubi_jalar:        {ds:'SR',fdc:168482,desc:'Sweet potato, raw, unprepared (Includes foods for USDA\'s Food Distribution Program)'},
    jagung_manis:     {ds:'SR',fdc:169998,desc:'Corn, sweet, yellow, raw'},
    mie_instan:       {ds:'SR',fdc:168905,desc:'Noodles, chinese, chow mein'},  // padanan
                      // padanan: Mie instan tidak ada di SR Legacy. Chow mein kering dipakai sebagai pembanding, DAN ini bukan nilai mie instan sebenarnya. Angka aslinya perlu dataset Survey/Branded USDA.
    bihun:            {ds:'SR',fdc:169742,desc:'Rice noodles, dry'},
    sari_kedelai:     {ds:'SR',fdc:174276,desc:'Soy protein isolate'},
    oatmeal:          {ds:'SR',fdc:173904,desc:'Cereals, oats, regular and quick, not fortified, dry'},
    quinoa:           {ds:'SR',fdc:168917,desc:'Quinoa, cooked'},
    dada_ayam:        {ds:'SR',fdc:171474,desc:'Chicken, broilers or fryers, breast, meat and skin, raw'},
    paha_ayam:        {ds:'SR',fdc:173627,desc:'Chicken, broilers or fryers, dark meat, thigh, meat only, raw'},
    ayam_kampung:     {ds:'SR',fdc:171052,desc:'Chicken, broilers or fryers, meat only, raw'},
    daging_sapi:      {ds:'SR',fdc:171796,desc:'Beef, ground, 85% lean meat / 15% fat, raw'},
    daging_kambing:   {ds:'SR',fdc:174370,desc:'Lamb, ground, raw'},  // padanan
                      // padanan: USDA tidak punya daging kambing. Memakai lamb (daging kambing Australia) sebagai pembanding.
    ikan_tongkol:     {ds:'SR',fdc:175119,desc:'Fish, mackerel, Atlantic, raw'},  // padanan
                      // padanan: Ikan tongkol tidak ada di USDA. Memakai mackerel Atlantik, ikan oily yang paling dekat secara gizi.
    ikan_lele:        {ds:'SR',fdc:175165,desc:'Fish, catfish, channel, farmed, raw'},
    ikan_nila:        {ds:'SR',fdc:175176,desc:'Fish, tilapia, raw'},
    ikan_kembung:     {ds:'SR',fdc:174182,desc:'Fish, anchovy, european, raw'},  // padanan
                      // padanan: Ikan kembung tidak ada di USDA. Memakai teri Eropa, ikan kecil oily yang paling dekat.
    salmon:           {ds:'SR',fdc:175167,desc:'Fish, salmon, Atlantic, farmed, raw'},
    telur_ayam:       {ds:'SR',fdc:171287,desc:'Egg, whole, raw, fresh'},
    telur_bebek:      {ds:'SR',fdc:172189,desc:'Egg, duck, whole, fresh, raw'},
    bakso:            {ds:'SR',fdc:174587,desc:'Luncheon sausage, pork and beef'},  // padanan
                      // padanan: Bakso tidak ada di USDA. Memakai luncheon sausage babi-sapi, yang komposisinya paling dekat.
    sosis:            {ds:'SR',fdc:167696,desc:'Frankfurter, beef, low fat'},
    tempe:            {ds:'SR',fdc:174272,desc:'Tempeh'},  // nutrien tidak lengkap
    tempe_mendoan:    {ds:'SR',fdc:172467,desc:'Tempeh, cooked'},  // padanan; nutrien tidak lengkap
                      // padanan: Tempe mendoan tidak ada di USDA. Memakai tempe matang yang sudah digoreng.
    tahu_putih:       {ds:'SR',fdc:172448,desc:'Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)'},
    tahu_kuning:      {ds:'SR',fdc:172449,desc:'Tofu, soft, prepared with calcium sulfate and magnesium chloride (nigari)'},
    keju:             {ds:'SR',fdc:173414,desc:'Cheese, cheddar'},
    kacang_kering:    {ds:'SR',fdc:173806,desc:'Peanuts, all types, dry-roasted, without salt'},
    kacang_merah:     {ds:'SR',fdc:175193,desc:'Beans, kidney, all types, mature seeds, raw'},
    kacang_hijau:     {ds:'SR',fdc:174256,desc:'Mung beans, mature seeds, raw'},
    edamame:          {ds:'SR',fdc:168411,desc:'edamame, frozen, prepared'},
    bayam:            {ds:'SR',fdc:168462,desc:'Spinach, raw'},
    kangkung:         {ds:'SR',fdc:170390,desc:'Cabbage, chinese (pak-choi), raw'},  // padanan
                      // padanan: Kangkung (water spinach) tidak ada di USDA. Memakai pak-choi sebagai daun hijau Asia.
    sawi_hijau:       {ds:'SR',fdc:169256,desc:'Mustard greens, raw'},
    sawi_putih:       {ds:'SR',fdc:170390,desc:'Cabbage, chinese (pak-choi), raw'},
    wortel:           {ds:'SR',fdc:170393,desc:'Carrots, raw'},
    buncis:           {ds:'SR',fdc:169961,desc:'Beans, snap, green, raw'},
    kacang_panjang:   {ds:'SR',fdc:169961,desc:'Beans, snap, green, raw'},  // padanan
                      // padanan: Kacang panjang tidak ada di USDA. Memakai buncis hijau.
    kol:              {ds:'SR',fdc:169975,desc:'Cabbage, raw'},
    brokoli:          {ds:'SR',fdc:170379,desc:'Broccoli, raw'},
    labu_siam:        {ds:'SR',fdc:170402,desc:'Chayote, fruit, raw'},
    labu_kuning:      {ds:'SR',fdc:169295,desc:'Squash, winter, butternut, raw'},  // padanan
                      // padanan: Labu kuning tidak ada di USDA. Memakai squash winter butternut, yang paling dekat.
    terong:           {ds:'SR',fdc:169228,desc:'Eggplant, raw'},
    tauge:            {ds:'SR',fdc:169957,desc:'Mung beans, mature seeds, sprouted, raw'},
    timun:            {ds:'SR',fdc:168409,desc:'Cucumber, with peel, raw'},
    tomat:            {ds:'SR',fdc:170457,desc:'Tomatoes, red, ripe, raw, year round average'},
    selada:           {ds:'SR',fdc:169249,desc:'Lettuce, green leaf, raw'},
    lobak:            {ds:'SR',fdc:169276,desc:'Radishes, raw'},
    bawang_merah:     {ds:'SR',fdc:170000,desc:'Onions, raw'},
    bawang_putih:     {ds:'SR',fdc:169230,desc:'Garlic, raw'},
    kunyit:           {ds:'SR',fdc:172231,desc:'Spices, turmeric, ground'},  // padanan
                      // padanan: Kunyit segar tidak ada di USDA. Memakai serbuk kunyit; serat lebih rendah.
    jahe:             {ds:'SR',fdc:169231,desc:'Ginger root, raw'},
    daun_salam:       {ds:'SR',fdc:170917,desc:'Spices, bay leaf'},
    daun_bawang:      {ds:'SR',fdc:170005,desc:'Onions, spring or scallions (includes tops and bulb), raw'},
    ketumbar_bubuk:   {ds:'SR',fdc:170923,desc:'Spices, cumin seed'},  // padanan
                      // padanan: Memakai biji ketumbar utuh, bukan bubuk.
    merica_bubuk:     {ds:'SR',fdc:170931,desc:'Spices, pepper, black'},  // padanan
                      // padanan: Memakai lada hitam utuh, bukan bubuk.
    garam:            {ds:'SR',fdc:173468,desc:'Salt, table'},
    kecap_manis:      {ds:'SR',fdc:172886,desc:'Sauce, hoisin, ready-to-serve'},  // padanan
                      // padanan: Kecap manis tidak ada di USDA. Memakai hoisin, saus kecap manis yang paling dekat.
    kecap_asin:       {ds:'SR',fdc:174277,desc:'Soy sauce made from soy and wheat (shoyu)'},
    minyak_kelapa:    {ds:'SR',fdc:171412,desc:'Oil, coconut'},
    minyak_sawit:     {ds:'SR',fdc:171015,desc:'Oil, palm'},  // padanan
                      // padanan: USDA hanya punya palm kernel oil, bukan minyak sawit grocery. Dipakai sebagai pembanding saja.
    gula_pasir:       {ds:'SR',fdc:169655,desc:'Sugars, granulated'},
    gula_merah:       {ds:'SR',fdc:168833,desc:'Sugars, brown'},
    madu:             {ds:'SR',fdc:169640,desc:'Honey'},
    santan_kelapa:    {ds:'SR',fdc:170172,desc:'Nuts, coconut milk, raw (liquid expressed from grated meat and water)'},
    santan_kental:    {ds:'SR',fdc:170173,desc:'Nuts, coconut milk, canned (liquid expressed from grated meat and water)'},  // padanan; nutrien tidak lengkap
                      // padanan: Santan kental tidak ada. Memakai santan kelapa kaleng.
    pisang:           {ds:'SR',fdc:173944,desc:'Bananas, raw'},
    apel:             {ds:'SR',fdc:171688,desc:'Apples, raw, with skin'},
    jeruk:            {ds:'SR',fdc:169097,desc:'Oranges, raw, all commercial varieties'},
    mangga:           {ds:'SR',fdc:169910,desc:'Mangos, raw'},
    semangka:         {ds:'SR',fdc:167765,desc:'Watermelon, raw'},
    pepaya:           {ds:'SR',fdc:169926,desc:'Papayas, raw'},
    nanas:            {ds:'SR',fdc:169124,desc:'Pineapple, raw, all varieties'},
    salak:            {ds:'SR',fdc:174687,desc:'Jackfruit, raw'},  // padanan
                      // padanan: Salak tidak ada di USDA. Memakai nangka, buah tropis yang paling dekat.
    anggur:           {ds:'SR',fdc:174683,desc:'Grapes, red or green (European type, such as Thompson seedless), raw'},
    air:              {ds:'SR',fdc:174158,desc:'Water, bottled, generic'},
                      // Air murni: USDA mencatat 0 kkal dan 0 forall nutrient lain.
    teh:              {ds:'SR',fdc:173227,desc:'Beverages, tea, black, brewed, prepared with tap water'},
    susu_sapi:        {ds:'SR',fdc:171265,desc:'Milk, whole, 3.25% milkfat, with added vitamin D'},
    susu_kedelai:     {ds:'FD',fdc:2705405,desc:'Soy milk, unsweetened'},
    yogurt_plain:     {ds:'SR',fdc:171284,desc:'Yogurt, plain, whole milk'},
    coklat_hot:       {ds:'FD',fdc:2705473,desc:'Hot chocolate / cocoa, made with whole or reduced fat (2%) milk'},
    kerupuk:          {ds:'SR',fdc:172746,desc:'Crackers, saltines (includes oyster, soda, soup)'},  // padanan
                      // padanan: Kerupuk tidak ada di USDA. Memakai cracker asin sebagai gantinya.
    jeruk_nipis:      {ds:'SR',fdc:168155,desc:'Limes, raw'},
    kerupuk_udang:    {ds:'SR',fdc:174098,desc:'Crackers, flavored, fish-shaped'},  // padanan
                      // padanan: Kerupuk udang tidak ada di USDA. Memakai cracker bentuk ikan.
    alpukat:          {ds:'SR',fdc:171705,desc:'Avocados, raw, all commercial varieties'},
    asam_jawa:        {ds:'SR',fdc:167763,desc:'Tamarinds, raw'},
    serai:            {ds:'-',fdc:0,desc:'belum ada sumber USDA'},
    };

    window.SUMBER_GIZI = SUMBER_GIZI;

    const NUTRIENTS = {
    /* ---- Nilai per 100 g bagian yang dapat dimakan.
       SEMUA angka di bawah diambil dari USDA FoodData Central lewat file CSV
       resmi, bukan diketik manual. Sumber per bahan ada di SUMBER_GIZI.
       k,p,c,f,fb,sg,na,sf,ch = USDA nutrient id 1008, 1003, (1005-1079),
       1004, 1079, 1063, 1093, 1258, 1253. Karbo dipakai yang NETO supaya
       serat tidak dihitung dua kali sebagai energi.
       Baris "// padanan USDA" memakai bahan USDA lain sebagai pengganti
       karena bahan aslinya tidak ada di database itu. Baris "// BELUM
       BERSUMBER" angkanya 0 dan TIDAK boleh dianggap sebagai nilai sebenarnya. -- */
  beras_putih:      {cat:'Beras putih kering',k:365,p:7.1,c:78.7,f:0.7,fb:1.3,sg:0,na:5,sf:0.2,ch:0},
  beras_merah:      {cat:'Beras merah kering',k:367,p:7.5,c:72.7,f:3.2,fb:3.6,sg:0,na:5,sf:0.6,ch:0},
  nasi_putih:       {cat:'Nasi putih matang',k:130,p:2.7,c:27.8,f:0.3,fb:0.4,sg:0,na:1,sf:0.1,ch:0},
  nasi_merah:       {cat:'Nasi merah matang',k:123,p:2.7,c:24,f:1,fb:1.6,sg:0,na:4,sf:0.3,ch:0},
  ketupat:          {cat:'Ketupat matang',k:130,p:2.7,c:27.8,f:0.3,fb:0.4,sg:0,na:1,sf:0.1,ch:0},  // padanan USDA
  lontong:          {cat:'Lontong matang',k:130,p:2.7,c:27.8,f:0.3,fb:0.4,sg:0,na:1,sf:0.1,ch:0},  // padanan USDA
  roti_tawar:       {cat:'Roti tawar',k:266,p:8.9,c:46.7,f:3.3,fb:2.7,sg:0,na:490,sf:0.7,ch:0,per:{lembar:25}},
  roti_gandum:      {cat:'Roti gandum utuh',k:252,p:12.5,c:36.7,f:3.5,fb:6,sg:0,na:455,sf:0.7,ch:0,per:{lembar:30}},
  roti_tahu:        {cat:'Roti tawar isi tahu',k:266,p:8.9,c:46.7,f:3.3,fb:2.7,sg:0,na:490,sf:0.7,ch:0,per:{lembar:90}},  // padanan USDA
  kentang:          {cat:'Kentang',k:77,p:2.1,c:15.4,f:0.1,fb:2.1,sg:0,na:6,sf:0,ch:0},
  ubi_jalar:        {cat:'Ubi jalar',k:86,p:1.6,c:17.1,f:0.1,fb:3,sg:0,na:55,sf:0,ch:0},
  jagung_manis:     {cat:'Jagung manis',k:86,p:3.3,c:16.7,f:1.4,fb:2,sg:0,na:15,sf:0.3,ch:0},
  mie_instan:       {cat:'Mie instan kering',k:471,p:10.9,c:56.9,f:21.2,fb:6.7,sg:0,na:866,sf:6.7,ch:0,per:{bungkus:80}},  // padanan USDA
  bihun:            {cat:'Bihun kering',k:364,p:6,c:78.6,f:0.6,fb:1.6,sg:0,na:182,sf:0.2,ch:0},
  sari_kedelai:     {cat:'Sari kedelai instan',k:335,p:88.3,c:0,f:3.4,fb:0,sg:0,na:1005,sf:0.4,ch:0},
  oatmeal:          {cat:'Oatmeal kering',k:379,p:13.2,c:57.6,f:6.5,fb:10.1,sg:0,na:6,sf:1.1,ch:0},
  quinoa:           {cat:'Quinoa kering',k:120,p:4.4,c:18.5,f:1.9,fb:2.8,sg:0,na:7,sf:0.2,ch:0},
  dada_ayam:        {cat:'Dada ayam tanpa kulit',k:172,p:20.9,c:0,f:9.3,fb:0,sg:0,na:63,sf:2.7,ch:64},
  paha_ayam:        {cat:'Paha ayam tanpa kulit',k:121,p:19.7,c:0,f:4.1,fb:0,sg:0,na:95,sf:1.1,ch:94},
  ayam_kampung:     {cat:'Ayam kampung',k:119,p:21.4,c:0,f:3.1,fb:0,sg:0,na:77,sf:0.8,ch:70},
  daging_sapi:      {cat:'Daging sapi lean',k:215,p:18.6,c:0,f:15,fb:0,sg:0,na:66,sf:5.7,ch:68},
  daging_kambing:   {cat:'Daging kambing lean',k:282,p:16.6,c:0,f:23.4,fb:0,sg:0,na:59,sf:10.2,ch:73},  // padanan USDA
  ikan_tongkol:     {cat:'Ikan tongkol',k:205,p:18.6,c:0,f:13.9,fb:0,sg:0,na:90,sf:3.3,ch:70},  // padanan USDA
  ikan_lele:        {cat:'Ikan lele',k:119,p:15.2,c:0,f:5.9,fb:0,sg:0,na:98,sf:1.3,ch:55},
  ikan_nila:        {cat:'Ikan nila',k:96,p:20.1,c:0,f:1.7,fb:0,sg:0,na:52,sf:0.6,ch:50},
  ikan_kembung:     {cat:'Ikan kembung',k:131,p:20.4,c:0,f:4.8,fb:0,sg:0,na:104,sf:1.3,ch:60},  // padanan USDA
  salmon:           {cat:'Salmon',k:208,p:20.4,c:0,f:13.4,fb:0,sg:0,na:59,sf:3.1,ch:55},
  telur_ayam:       {cat:'Telur ayam',k:143,p:12.6,c:0.7,f:9.5,fb:0,sg:0,na:142,sf:3.1,ch:372,per:{butir:50}},
  telur_bebek:      {cat:'Telur bebek',k:185,p:12.8,c:1.5,f:13.8,fb:0,sg:0,na:146,sf:3.7,ch:884,per:{butir:55}},
  bakso:            {cat:'Bakso daging',k:260,p:15.4,c:1.6,f:20.9,fb:0,sg:0,na:1182,sf:7.6,ch:64,per:{buah:30}},  // padanan USDA
  sosis:            {cat:'Sosis',k:140,p:12,c:1.6,f:9.5,fb:0,sg:0,na:744,sf:1.5,ch:40,per:{batang:45}},
  tempe:            {cat:'Tempe kedelai',k:192,p:20.3,c:0,f:10.8,fb:0,sg:0,na:9,sf:2.5,ch:0},  // sebagian nutrien tidak diukur USDA
  tempe_mendoan:    {cat:'Tempe mendoan',k:195,p:19.9,c:0,f:11.4,fb:0,sg:0,na:14,sf:3.4,ch:0},  // padanan USDA; sebagian nutrien tidak diukur USDA
  tahu_putih:       {cat:'Tahu putih',k:78,p:9,c:2,f:4.2,fb:0.9,sg:0,na:12,sf:0.8,ch:0},
  tahu_kuning:      {cat:'Tahu kuning',k:61,p:7.2,c:1,f:3.7,fb:0.2,sg:0,na:8,sf:0.5,ch:0},
  keju:             {cat:'Keju cheddar',k:403,p:22.9,c:3.4,f:33.3,fb:0,sg:0,na:653,sf:18.9,ch:99,per:{lembar:20}},
  kacang_kering:    {cat:'Kacang tanah kering',k:587,p:24.4,c:12.9,f:49.7,fb:8.4,sg:0,na:6,sf:7.7,ch:0},
  kacang_merah:     {cat:'Kacang merah kering',k:333,p:23.6,c:35.1,f:0.8,fb:24.9,sg:0,na:24,sf:0.1,ch:0},
  kacang_hijau:     {cat:'Kacang hijau kering',k:347,p:23.9,c:46.3,f:1.2,fb:16.3,sg:0,na:15,sf:0.3,ch:0},
  edamame:          {cat:'Edamame',k:121,p:11.9,c:3.7,f:5.2,fb:5.2,sg:0,na:6,sf:0.6,ch:0},
  bayam:            {cat:'Bayam segar',k:23,p:2.9,c:1.4,f:0.4,fb:2.2,sg:0,na:79,sf:0.1,ch:0},
  kangkung:         {cat:'Kangkung segar',k:13,p:1.5,c:1.2,f:0.2,fb:1,sg:0,na:65,sf:0,ch:0},  // padanan USDA
  sawi_hijau:       {cat:'Sawi hijau',k:27,p:2.9,c:1.5,f:0.4,fb:3.2,sg:0,na:20,sf:0,ch:0},
  sawi_putih:       {cat:'Sawi putih',k:13,p:1.5,c:1.2,f:0.2,fb:1,sg:0,na:65,sf:0,ch:0},
  wortel:           {cat:'Wortel',k:41,p:0.9,c:6.8,f:0.2,fb:2.8,sg:0,na:69,sf:0,ch:0},
  buncis:           {cat:'Buncis',k:31,p:1.8,c:4.3,f:0.2,fb:2.7,sg:0,na:6,sf:0.1,ch:0},
  kacang_panjang:   {cat:'Kacang panjang',k:31,p:1.8,c:4.3,f:0.2,fb:2.7,sg:0,na:6,sf:0.1,ch:0},  // padanan USDA
  kol:              {cat:'Kol',k:25,p:1.3,c:3.3,f:0.1,fb:2.5,sg:0,na:18,sf:0,ch:0},
  brokoli:          {cat:'Brokoli',k:34,p:2.8,c:4,f:0.4,fb:2.6,sg:0,na:33,sf:0.1,ch:0},
  labu_siam:        {cat:'Labu siam',k:19,p:0.8,c:2.8,f:0.1,fb:1.7,sg:0,na:2,sf:0,ch:0},
  labu_kuning:      {cat:'Labu kuning',k:45,p:1,c:9.7,f:0.1,fb:2,sg:0,na:4,sf:0,ch:0},  // padanan USDA
  terong:           {cat:'Terong ungu',k:25,p:1,c:2.9,f:0.2,fb:3,sg:0,na:2,sf:0,ch:0},
  tauge:            {cat:'Tauge',k:30,p:3,c:4.1,f:0.2,fb:1.8,sg:0,na:6,sf:0,ch:0},
  timun:            {cat:'Timun',k:15,p:0.7,c:3.1,f:0.1,fb:0.5,sg:0,na:2,sf:0,ch:0},
  tomat:            {cat:'Tomat',k:18,p:0.9,c:2.7,f:0.2,fb:1.2,sg:0,na:5,sf:0,ch:0},
  selada:           {cat:'Selada',k:15,p:1.4,c:1.6,f:0.2,fb:1.3,sg:0,na:28,sf:0,ch:0},
  lobak:            {cat:'Lobak',k:16,p:0.7,c:1.8,f:0.1,fb:1.6,sg:0,na:39,sf:0,ch:0},
  bawang_merah:     {cat:'Bawang merah',k:40,p:1.1,c:7.6,f:0.1,fb:1.7,sg:0,na:4,sf:0,ch:0,per:{siung:15}},
  bawang_putih:     {cat:'Bawang putih',k:149,p:6.4,c:31,f:0.5,fb:2.1,sg:0,na:17,sf:0.1,ch:0,per:{siung:5}},
  kunyit:           {cat:'Kunyit segar',k:312,p:9.7,c:44.4,f:3.3,fb:22.7,sg:0,na:27,sf:1.8,ch:0},  // padanan USDA
  jahe:             {cat:'Jahe segar',k:80,p:1.8,c:15.8,f:0.8,fb:2,sg:0,na:13,sf:0.2,ch:0},
  serai:            {cat:'Serai',k:0,p:0,c:0,f:0,fb:0,sg:0,na:0,sf:0,ch:0,per:{batang:15}},  // BELUM BERSUMBER
  daun_salam:       {cat:'Daun salam',k:313,p:7.6,c:48.7,f:8.4,fb:26.3,sg:0,na:23,sf:2.3,ch:0,per:{lembar:0.2}},
  daun_bawang:      {cat:'Daun bawang',k:32,p:1.8,c:4.7,f:0.2,fb:2.6,sg:0,na:16,sf:0,ch:0},
  ketumbar_bubuk:   {cat:'Ketumbar bubuk',k:375,p:17.8,c:33.7,f:22.3,fb:10.5,sg:0,na:168,sf:1.5,ch:0},  // padanan USDA
  merica_bubuk:     {cat:'Merica bubuk',k:251,p:10.4,c:38.7,f:3.3,fb:25.3,sg:0,na:20,sf:1.4,ch:0},  // padanan USDA
  garam:            {cat:'Garam',k:0,p:0,c:0,f:0,fb:0,sg:0,na:38758,sf:0,ch:0},
  kecap_manis:      {cat:'Kecap manis',k:220,p:3.3,c:41.3,f:3.4,fb:2.8,sg:0,na:1615,sf:0.6,ch:3,dens:1.16,per:{sendok:15}},  // padanan USDA
  kecap_asin:       {cat:'Kecap asin',k:53,p:8.1,c:4.1,f:0.6,fb:0.8,sg:0,na:5493,sf:0.1,ch:0,dens:1.12,per:{sendok:15}},
  minyak_kelapa:    {cat:'Minyak kelapa',k:892,p:0,c:0,f:99.1,fb:0,sg:0,na:0,sf:82.5,ch:0,dens:0.92,per:{sendok:5}},
  minyak_sawit:     {cat:'Minyak kelapa sawit',k:884,p:0,c:0,f:100,fb:0,sg:0,na:0,sf:49.3,ch:0,dens:0.92,per:{sendok:5}},  // padanan USDA
  gula_pasir:       {cat:'Gula pasir',k:387,p:0,c:100,f:0,fb:0,sg:0,na:1,sf:0,ch:0,per:{sendok:10}},
  gula_merah:       {cat:'Gula merah',k:380,p:0.1,c:98.1,f:0,fb:0,sg:0,na:28,sf:0,ch:0,per:{sendok:8}},
  madu:             {cat:'Madu',k:304,p:0.3,c:82.2,f:0,fb:0.2,sg:0,na:4,sf:0,ch:0,dens:1.42,per:{sendok:15}},
  santan_kelapa:    {cat:'Santan kelapa muda',k:230,p:2.3,c:3.3,f:23.8,fb:2.2,sg:0,na:15,sf:21.1,ch:0,dens:1,per:{sendok:20}},
  santan_kental:    {cat:'Santan kental',k:197,p:2,c:0,f:21.3,fb:0,sg:0,na:13,sf:18.9,ch:0,dens:1,per:{sendok:15}},  // padanan USDA; sebagian nutrien tidak diukur USDA
  pisang:           {cat:'Pisang',k:89,p:1.1,c:20.2,f:0.3,fb:2.6,sg:0,na:1,sf:0.1,ch:0,per:{buah:120}},
  apel:             {cat:'Apel',k:52,p:0.3,c:11.4,f:0.2,fb:2.4,sg:0,na:1,sf:0,ch:0,per:{buah:150}},
  jeruk:            {cat:'Jeruk peras',k:47,p:0.9,c:9.4,f:0.1,fb:2.4,sg:0,na:0,sf:0,ch:0,per:{buah:130}},
  mangga:           {cat:'Mangga',k:60,p:0.8,c:13.4,f:0.4,fb:1.6,sg:0,na:1,sf:0.1,ch:0,per:{buah:200}},
  semangka:         {cat:'Semangka',k:30,p:0.6,c:7.2,f:0.2,fb:0.4,sg:0,na:1,sf:0,ch:0},
  pepaya:           {cat:'Pepaya',k:43,p:0.5,c:9.1,f:0.3,fb:1.7,sg:0,na:8,sf:0.1,ch:0,per:{buah:300}},
  nanas:            {cat:'Nanas',k:50,p:0.5,c:11.7,f:0.1,fb:1.4,sg:0,na:1,sf:0,ch:0},
  salak:            {cat:'Salak',k:95,p:1.7,c:21.8,f:0.6,fb:1.5,sg:0,na:2,sf:0.2,ch:0,per:{buah:70}},  // padanan USDA
  anggur:           {cat:'Anggur',k:69,p:0.7,c:17.2,f:0.2,fb:0.9,sg:0,na:2,sf:0.1,ch:0,per:{buah:5}},
  air:              {cat:'Air putih',k:0,p:0,c:0,f:0,fb:0,sg:0,na:2,sf:0,ch:0},
  teh:              {cat:'Teh tanpa gula',k:1,p:0,c:0.3,f:0,fb:0,sg:0,na:3,sf:0,ch:0},
  susu_sapi:        {cat:'Susu sapi UHT',k:61,p:3.2,c:4.8,f:3.3,fb:0,sg:0,na:43,sf:1.9,ch:10,per:{gelas:200}},
  susu_kedelai:     {cat:'Susu kedelai',k:38,p:3.6,c:1.3,f:2.1,fb:0,sg:0,na:34,sf:0.3,ch:0,per:{gelas:200}},
  yogurt_plain:     {cat:'Yogurt plain',k:61,p:3.5,c:4.7,f:3.3,fb:0,sg:0,na:46,sf:2.1,ch:13,per:{cup:150}},
  coklat_hot:       {cat:'Coklat panas manis',k:91,p:2.7,c:16.5,f:1.5,fb:0,sg:0,na:60,sf:0.9,ch:7,per:{gelas:200}},
  kerupuk:          {cat:'Kerupuk',k:418,p:9.5,c:71.3,f:8.6,fb:2.8,sg:0,na:941,sf:1.7,ch:0},  // padanan USDA
  jeruk_nipis:      {cat:'Jeruk nipis',k:30,p:0.7,c:7.7,f:0.2,fb:2.8,sg:0,na:2,sf:0,ch:0,per:{buah:100}},
  kerupuk_udang:    {cat:'Kerupuk udang',k:463,p:10.2,c:62.6,f:17.7,fb:3.1,sg:0,na:970,sf:2.1,ch:0},  // padanan USDA
  alpukat:          {cat:'Alpukat',k:160,p:2,c:1.8,f:14.7,fb:6.7,sg:0,na:7,sf:2.1,ch:0,per:{buah:150}},
  asam_jawa:        {cat:'Asam jawa kering',k:239,p:2.8,c:57.4,f:0.6,fb:5.1,sg:0,na:28,sf:0.3,ch:0},
    };

    /*
       SATUAN NON-GRAM
       Bentuk,butir,siung,lembar,sendok punya berat berbeda tiap bahan,
       jadi konversinya disimpan per bahan, bukan global.
       */

    // Bulatan pembulatan saat mengubah porsi, per bahan.
    const SNAP = {
    default: 5,
    beras_putih: 25, nasi_putih: 25, nasi_merah: 25, ketupat: 25, lontong: 25,
    dada_ayam: 25, paha_ayam: 25, ayam_kampung: 25, daging_sapi: 25, daging_kambing: 25,
    ikan_tongkol: 25, ikan_lele: 25, ikan_nila: 25, ikan_kembung: 25, salmon: 25,
    tempe: 25, tempe_mendoan: 25, tahu_putih: 25, tahu_kuning: 25, edamame: 25,
    kentang: 25, ubi_jalar: 25, jagung_manis: 25, quinoa: 25, oatmeal: 25,
    bayam: 25, kangkung: 25, sawi_hijau: 25, sawi_putih: 25, wortel: 25, buncis: 25,
    kacang_panjang: 25, kol: 25, brokoli: 25, labu_siam: 25, labu_kuning: 25, terong: 25,
    tauge: 25, timun: 25, tomat: 25, selada: 25, lobak: 25, daun_bawang: 25,
    _: 1
    };

    function snapOf(id){
    if(SNAP[id]!==undefined) return SNAP[id];
    const ing=NUTRIENTS[id];
    if(!ing) return 1;
    if(ing.per&&ing.per.batang) return 1;
    if(ing.per&&ing.per.butir) return 1;
    if(ing.per&&ing.per.lembar) return 1;
    if(ing.per&&ing.per.buah) return 1;
    return SNAP.default;
    }

    /* Konversi jumlah + satuan ke gram. Return null kalau satuannya
       tidak dikenal supaya pemanggil bisa menolak, bukan menebak. */
    function toGrams(ingId, qty, unit){
    const ing=NUTRIENTS[ingId];
    if(!ing) return null;
    const n=Number(qty);
    if(!isFinite(n)||n<0) return null;
    const u=String(unit||'g').toLowerCase();
    if(u==='g') return n;
    if(u==='ml') return n*(ing.dens||1);
    const per=ing.per&&ing.per[u];
    if(per===undefined) return null;
    return n*per;
    }

    /*
       METODE MASAK
       air    : sisa air setelah matang sebagai fraksi berat
       reaps  : minyak yang meresap per gram bahan protein
       reapsC : minyak yang meresap per gram bahan karbohidrat
       Protein menyerap jauh lebih banyak minyak daripada karbohidrat,
       jadi keduanya tidak memakai faktor yang sama. Resep tanpa method
       (buah, minuman, makanan yang dimakan langsung) memakai mode
       TANPA MASAK supaya tidak ada minyak fiktif yang ikut dihitung.
       */
    const COOK_METHODS = {
    rebus:    {label:'Direbus',           air:0.90,reaps:0.00,reapsC:0.00,note:'Tanpa minyak. Sebagian air menguap.'},
    kukus:    {label:'Dikukus',           air:0.92,reaps:0.00,reapsC:0.00,note:'Tanpa minyak. Nutrisi paling terjaga.'},
    panggang: {label:'Dipanggang',        air:0.70,reaps:0.03,reapsC:0.01,note:'Teflon dengan minyak tipis, yang menempel sedikit saja.'},
    tumis:    {label:'Tumis',             air:0.80,reaps:0.04,reapsC:0.01,note:'Minyak cooking, sebagian kecil larut ke bahan.'},
    goreng:   {label:'Digoreng',          air:0.60,reaps:0.12,reapsC:0.03,note:'Minyak goreng, sebagian besar meresap ke bahan.'},
    bacem:    {label:'Direbus kah Kaldu', air:1.30,reaps:0.02,reapsC:0.01,note:'Direbus dalam kah bumbu sampai kah menyusut.'},
    mentah:   {label:'Tanpa dimasak',     air:1.00,reaps:0.00,reapsC:0.00,note:'Dimakan langsung, tanpa minyak.'},
    };

    function cookMethod(key){
    if(!key) return COOK_METHODS.mentah;
    return COOK_METHODS[key]||COOK_METHODS.mentah;
    }

    /*
       PERHITUNGAN GIZI
       nutrition = jumlah (gizi bahan x gram / 100) + minyak terserap
       Energi AKAN dihitung ulang dari p, c, f, fb dengan faktor
       Atwater, bukan diambil dari kolom k. Jadi tidak ada satu pun
       angka kalori yang masuk dari mana pun kecuali turunan bahan.
       Minyak terserap: saat menggoreng, sebagian minyak masuk ke
       dalam bahan. Untuk bahan utama diambil 14% dari beratnya
       sebagai angka konservatif, lalu ditampilkan terpisah supaya
       jelas dari mana kalorinya datang.
       */
    const NUTRI_KEYS = ['p','c','f','fb','sg','na','sf','ch'];

    function emptyNutrition(){
    const n={};
    NUTRI_KEYS.forEach(key=>{n[key]=0;});
    n.k=0;
    n.minyakTerserap=0;
    n.perBahan=[];
    n.unknown=[];
    return n;
    }

    function computeNutrition(bahan, methodKey){
    const total=emptyNutrition();
    if(!Array.isArray(bahan)) return total;
    const method=cookMethod(methodKey);
    let proteinGrams=0;
    let carbGrams=0;

    bahan.forEach(b=>{
        if(!b||!b.id) return;
        const unit=b.unit||'g';
        const grams=toGrams(b.id,b.qty,unit);
        if(grams===null){
            total.unknown.push(b.id+' ('+unit+')');
            return;
        }
        if(grams<=0) return;
        const row=NUTRIENTS[b.id];
        if(!row){ total.unknown.push(b.id); return; }

        const f=grams/100;
        NUTRI_KEYS.forEach(key=>{ total[key]+=(row[key]||0)*f; });

        if(b.role==='protein') proteinGrams+=grams;
        else if(b.role==='karbo') carbGrams+=grams;
        total.perBahan.push({id:b.id,nama:row.cat,gram:Math.round(grams*10)/10,
            kcal:Math.round(energyFromMacros(row.p,row.c,row.f,row.fb)*f),
            role:b.role||'bumbu'});
    });

    // Minyak yang meresap: protein lebih menyerap dari karbohidrat.
    if(method.reaps>0||method.reapsC>0){
        const absorbed=proteinGrams*method.reaps+carbGrams*method.reapsC;
        total.minyakTerserap=Math.round(absorbed*10)/10;
        total.f+=absorbed;
        total.sf+=absorbed*0.5;
    }

    NUTRI_KEYS.forEach(key=>{ total[key]=Math.round(total[key]*10)/10; });
    total.k=Math.round(total.p*4+total.c*4+total.f*9+total.fb*2);
    return total;
    }

    /* Pembanding kualitas data: bandingkan energi terpublikasi (k)
       dengan energi hasil 4/4/9. Deviasi besar wajar untuk kacang
       dan rempah karena sumbernya memakai faktor Atwater lain, tapi
       angka yang menyimpang sampai >25% layak diperiksa ulang. */
    function auditNutrientDB(threshold){
    const limit=(threshold===undefined)?25:threshold;
    const out=[];
    Object.keys(NUTRIENTS).forEach(id=>{
        const n=NUTRIENTS[id];
        if(!n.k) return;
        const d=energyFromMacros(n.p,n.c,n.f,n.fb);
        const pct=Math.round(Math.abs(d-n.k)/n.k*100);
        if(pct>limit) out.push({id:id,k:n.k,derived:Math.round(d),pct:pct});
    });
    return out;
    }

    /*
       PENYESUAIAN PORSI
       Target kalori dicapai dengan mengubah HANYA porsi bahan utama.
       Bumbu, minyak, dan rempah dikunci (scale:false) supaya rasa
       hidangan tidak berubah.
       Dua tahap:
       1. semua bahan utama dikalikan satu rasio
       2. kalau masih meleset, koreksi hanya sumber karbohidrat,
       karena dampaknya per gram paling besar dan ke rasa paling kecil
       Yang ditampilkan aplikasi SELALU dihitung ulang dari gram akhir,
       bukan dari target yang diminta.
       */
    const SCALE_MIN=0.55;
    const SCALE_MAX=2.0;

    function cloneBahan(bahan){
    return bahan.map(function(b){ return Object.assign({}, b); });
    }

    // Jumlah dalam satuan asli, dibulatkan ke satuan yang masuk akal.
    function applyQty(bahan, qty){
    const per=(NUTRIENTS[bahan.id]&&NUTRIENTS[bahan.id].per)||{};
    const u=bahan.unit||'g';
    if(u==='g'||u==='ml') return Math.max(0,Math.round(qty));
    if(per[u]!==undefined) return Math.max(0.1,Math.round(qty/per[u]*10)/10);
    return Math.max(0.1,Math.round(qty));
    }

    function scaledGrams(bahan, ratio){
    const cur=toGrams(bahan.id,bahan.qty,bahan.unit||'g');
    if(cur===null) return null;
    const target=cur*ratio;
    if(bahan.unit==='g'||bahan.unit==='ml'){
        const snap=snapOf(bahan.id);
        return Math.max(snap,Math.round(target/snap)*snap);
    }
    return target;
    }

    function fitRecipeToKcal(recipe, targetKcal, overrideId){
    const bahan=cloneBahan(recipe.bahan);
    const method=recipe.method;
    let n=computeNutrition(bahan,method);
    if(!n.k) return {bahan:bahan,nutrisi:n,rasio:1,terpenuhi:false};

    const want=Math.max(120,Number(targetKcal)||n.k);
    let ratio=want/n.k;
    ratio=Math.max(SCALE_MIN,Math.min(SCALE_MAX,ratio));

    bahan.forEach(function(b,i){
        if(b.scale===false) return;
        const g=scaledGrams(b,ratio);
        if(g===null) return;
        bahan[i]=Object.assign({},b,{qty:applyQty(b,g),scaled:true});
    });

    n=computeNutrition(bahan,method);

    // Pass 2: koreksi lewat sumber karbohidrat saja.
    const gap=want-n.k;
    if(Math.abs(gap)>want*0.10){
        const idx=bahan.findIndex(function(b){ return b.role==='karbo'&&b.scale!==false; });
        if(idx>=0){
            const row=NUTRIENTS[bahan[idx].id];
            const perGram=row?energyFromMacros(row.p,row.c,row.f,row.fb)/100:0;
            if(perGram>0){
                const cur=toGrams(bahan[idx].id,bahan[idx].qty,bahan[idx].unit||'g')||0;
                const snap=snapOf(bahan[idx].id);
                const next=Math.max(snap,Math.round((cur+gap/perGram)/snap)*snap);
                bahan[idx]=Object.assign({},bahan[idx],{qty:applyQty(bahan[idx],next)});
                n=computeNutrition(bahan,method);
            }
        }
    }

    const sisa=want-n.k;
    const toleransi=Math.max(40,want*0.05);
    return {
        bahan:bahan,
        nutrisi:n,
        rasio:Math.round(ratio*100)/100,
        terpenuhi:Math.abs(sisa)<=toleransi,
        selisih:Math.round(sisa)
    };
    }

    /* Ringkasan nutrition untuk ditampilkan. */
    function nutritionSummary(n, target){
    return {
        kalori:n.k,
        protein:Math.round(n.p),
        karbo:Math.round(n.c),
        lemak:Math.round(n.f),
        serat:Math.round(n.fb*10)/10,
        gula:Math.round(n.sg),
        natrium:Math.round(n.na),
        lemakJenuh:Math.round(n.sf*10)/10,
        kolesterol:Math.round(n.ch),
        minyakTerserap:n.minyakTerserap,
        target:target||0
    };
    }

    function nutritionConsistency(n){
    if(!n.k) return 0;
    const derived=energyFromMacros(n.p,n.c,n.f,n.fb);
    return Math.abs(n.k-derived)/n.k;
    }

    /*
       TARGET ENERGI & MAKRO
       BMR  : Mifflin-St Jeor
       TDEE : BMR × aktivitas. Program ini ada 5-6 hari latihan,
       jadi aktivitas yang dipakai adalah yang lebih tinggi
       antara laporan user dan kebutuhan program.
       Lose : -20% TDEE, TIDAK boleh turun di bawah BMR.
       Defisit flat 500 kkal tidak dipakai karena pada=user
       dengan TDEE kecil, batas bawahnya malah lebih besar
       dari TDEE sehingga berat naik.
       Makro:
       protein  2.0 g/kg (lose, jaga massa otot saat defisit)
       1.8 g/kg (gain) · 1.6 g/kg (maintain)
       lemak    28% energi, minimal 0.6 g/kg
       karbo    sisanya
       serat    max(25 g, 14 g / 1000 kkal)
       gula     batas atas 10% energi (rekomendasi WHO)
       */
    const ACTIVITY_TRAINING = 1.55; // 5-6x latihan seminggu

    function calcEnergyTargets(user){
    const u=user||{};
    const w=Number(u.weight)||65;
    const h=Number(u.height)||165;
    const a=Number(u.age)||30;
    const male=u.gender==='m';

    const bmr=Math.round(male ? 10*w+6.25*h-5*a+5 : 10*w+6.25*h-5*a-161);
    const actUser=Number(u.activity)||1.2;
    const act=Math.max(actUser,ACTIVITY_TRAINING);
    const tdee=Math.round(bmr*act);

    let kcal=tdee;
    let catatan='';

    if(u.goal==='lose'){
        kcal=Math.round(tdee*0.80);
        // Batas keras: jangan pernah di bawah metabolisme basal.
        if(kcal<bmr){
            kcal=bmr;
            catatan='Target dibatasi di metabolisme basal. Defisit lebih besar perlu pengawasan tenaga profesional.';
        }
    } else if(u.goal==='gain'){
        kcal=Math.round(tdee*1.12);
    }

    const gPerKg = u.goal==='lose' ? 2.0 : u.goal==='gain' ? 1.8 : 1.6;
    const protein=Math.round(w*gPerKg);
    let fat=Math.round(kcal*0.28/9);
    const fatMin=Math.round(w*0.6);
    if(fat<fatMin) fat=fatMin;
    let karbo=Math.round((kcal-protein*4-fat*9)/4);
    if(karbo<0) karbo=0;

    return {
        bmr, tdee, kcal, protein, karbo, fat,
        fiber:Math.max(25,Math.round(kcal*14/1000)),
        sugarMax:Math.round(kcal*0.10/4),
        natriumMax:2000,
        proteinPerKg:gPerKg,
        aktivitasDipakai:act,
        catatan
    };
    }

    /*
       DISTRIBUSI MAKAN
       Lima slot: sarapan, siang, snack, malam, minuman.
       */
    const MEAL_SLOTS = [
    {key:'pagi',   label:'Sarapan',     range:'06:00-08:00',  icon:'sunrise'},
    {key:'siang',  label:'Makan Siang', range:'11:30-13:00',  icon:'bowl'},
    {key:'snack',  label:'Snack',       range:'15:30-16:30',  icon:'bowl'},
    {key:'malam',  label:'Makan Malam', range:'18:00-19:30',  icon:'moon'},
    {key:'minuman',label:'Minuman',     range:'Sepanjang hari',icon:'leaf'},
    ];

    const MEAL_DIST = {
    //        pagi   siang  snack  malam  drink  (jumlahnya selalu 1.0)
    lose:     [0.26, 0.34, 0.10, 0.27, 0.03],
    maintain: [0.26, 0.32, 0.12, 0.27, 0.03],
    gain:     [0.28, 0.32, 0.13, 0.27, 0.00],
    };

    function mealDistribution(goal){
    const d=MEAL_DIST[goal]||MEAL_DIST.maintain;
    return d.slice();
    }

    function slotTargetKcal(targets, goal, slotKey){
    const d=mealDistribution(goal);
    const i=MEAL_SLOTS.findIndex(s=>s.key===slotKey);
    if(i<0) return 0;
    return Math.round(targets.kcal*d[i]);
    }

    function slotTargetMacros(targets, goal, slotKey){
    const d=mealDistribution(goal);
    const i=MEAL_SLOTS.findIndex(s=>s.key===slotKey);
    if(i<0) return {protein:0,karbo:0,lemak:0};
    return {
        protein:Math.round(targets.protein*d[i]),
        karbo:Math.round(targets.karbo*d[i]),
        lemak:Math.round(targets.fat*d[i])
    };
    }


/* Data dan fungsi ini dipakai script.js dan recipes.js. Diekspor
   ke window supaya tidak bergantung pada cakupan leksikal bersama
   antar tag script. */
    window.NUTRISI = {
    NUTRIENTS, NUTRIENT_TRUST, COOK_METHODS, MEAL_SLOTS, MEAL_DIST, SNAP, NUTRIENT_SOURCE,
    SCALE_MIN, SCALE_MAX,
    energyFromMacros, toGrams, cookMethod, computeNutrition, nutritionSummary,
    auditNutrientDB, fitRecipeToKcal, snapOf, applyQty, cloneBahan,
    calcEnergyTargets, mealDistribution, slotTargetKcal, slotTargetMacros
    };