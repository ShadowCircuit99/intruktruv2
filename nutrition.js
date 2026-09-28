

    
    function energyFromMacros(p, c, f, fb){
    return p*4 + c*4 + f*9 + fb*2;
    }

    
    const NUTRIENT_SOURCE = 'USDA FoodData Central (SR Legacy 2018-04, Foundation Food 2026-04-30, Survey/FNDDS 2024-10-31), diambil otomatis dari file CSV resmi; hanya serai yang belum bersumber dan 21 memakai padanan USDA - lihat catatan di tiap baris';

    
        
        
    /* Status sumber tiap bahan */
const NUTRIENT_TRUST={
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
  minyak_goreng:     'padanan',
  santan_kental:    'padanan',
  salak:            'padanan',
  kerupuk:          'padanan',
  kerupuk_udang:    'padanan',
  serai:            'belum bersumber',
    };

    
    /* Nomor FDC per bahan */
const SUMBER_GIZI={
    beras_putih:      {ds:'SR',fdc:168877,desc:'Rice, white, long-grain, regular, raw, enriched'},
    beras_merah:      {ds:'SR',fdc:169703,desc:'Rice, brown, long-grain, raw (Includes foods for USDA\'s Food Distribution Program)'},
    nasi_putih:       {ds:'SR',fdc:168878,desc:'Rice, white, long-grain, regular, enriched, cooked'},
    nasi_merah:       {ds:'SR',fdc:169704,desc:'Rice, brown, long-grain, cooked (Includes foods for USDA\'s Food Distribution Program)'},
    ketupat:          {ds:'SR',fdc:168878,desc:'Rice, white, long-grain, regular, enriched, cooked'},  // padanan
    lontong:          {ds:'SR',fdc:168878,desc:'Rice, white, long-grain, regular, enriched, cooked'},  // padanan
    roti_tawar:       {ds:'SR',fdc:174924,desc:'Bread, white, commercially prepared'},
    roti_gandum:      {ds:'SR',fdc:172688,desc:'Bread, whole-wheat, commercially prepared'},
    roti_tahu:        {ds:'SR',fdc:174924,desc:'Bread, white, commercially prepared'},  // padanan
    kentang:          {ds:'SR',fdc:170026,desc:'Potatoes, flesh and skin, raw'},
    ubi_jalar:        {ds:'SR',fdc:168482,desc:'Sweet potato, raw, unprepared (Includes foods for USDA\'s Food Distribution Program)'},
    jagung_manis:     {ds:'SR',fdc:169998,desc:'Corn, sweet, yellow, raw'},
    mie_instan:       {ds:'SR',fdc:168905,desc:'Noodles, chinese, chow mein'},  // padanan
    bihun:            {ds:'SR',fdc:169742,desc:'Rice noodles, dry'},
    sari_kedelai:     {ds:'SR',fdc:174276,desc:'Soy protein isolate'},
    oatmeal:          {ds:'SR',fdc:173904,desc:'Cereals, oats, regular and quick, not fortified, dry'},
    quinoa:           {ds:'SR',fdc:168917,desc:'Quinoa, cooked'},
    dada_ayam:        {ds:'SR',fdc:171474,desc:'Chicken, broilers or fryers, breast, meat and skin, raw'},
    paha_ayam:        {ds:'SR',fdc:173627,desc:'Chicken, broilers or fryers, dark meat, thigh, meat only, raw'},
    ayam_kampung:     {ds:'SR',fdc:171052,desc:'Chicken, broilers or fryers, meat only, raw'},
    daging_sapi:      {ds:'SR',fdc:171796,desc:'Beef, ground, 85% lean meat / 15% fat, raw'},
    daging_kambing:   {ds:'SR',fdc:174370,desc:'Lamb, ground, raw'},  // padanan
    ikan_tongkol:     {ds:'SR',fdc:175119,desc:'Fish, mackerel, Atlantic, raw'},  // padanan
    ikan_lele:        {ds:'SR',fdc:175165,desc:'Fish, catfish, channel, farmed, raw'},
    ikan_nila:        {ds:'SR',fdc:175176,desc:'Fish, tilapia, raw'},
    ikan_kembung:     {ds:'SR',fdc:174182,desc:'Fish, anchovy, european, raw'},  // padanan
    salmon:           {ds:'SR',fdc:175167,desc:'Fish, salmon, Atlantic, farmed, raw'},
    telur_ayam:       {ds:'SR',fdc:171287,desc:'Egg, whole, raw, fresh'},
    telur_bebek:      {ds:'SR',fdc:172189,desc:'Egg, duck, whole, fresh, raw'},
    bakso:            {ds:'SR',fdc:174587,desc:'Luncheon sausage, pork and beef'},  // padanan
    sosis:            {ds:'SR',fdc:167696,desc:'Frankfurter, beef, low fat'},
    tempe:            {ds:'SR',fdc:174272,desc:'Tempeh'},  // nutrien tidak lengkap
    tempe_mendoan:    {ds:'SR',fdc:172467,desc:'Tempeh, cooked'},  // padanan; nutrien tidak lengkap
    tahu_putih:       {ds:'SR',fdc:172448,desc:'Tofu, firm, prepared with calcium sulfate and magnesium chloride (nigari)'},
    tahu_kuning:      {ds:'SR',fdc:172449,desc:'Tofu, soft, prepared with calcium sulfate and magnesium chloride (nigari)'},
    keju:             {ds:'SR',fdc:173414,desc:'Cheese, cheddar'},
    kacang_kering:    {ds:'SR',fdc:173806,desc:'Peanuts, all types, dry-roasted, without salt'},
    kacang_merah:     {ds:'SR',fdc:175193,desc:'Beans, kidney, all types, mature seeds, raw'},
    kacang_hijau:     {ds:'SR',fdc:174256,desc:'Mung beans, mature seeds, raw'},
    edamame:          {ds:'SR',fdc:168411,desc:'edamame, frozen, prepared'},
    bayam:            {ds:'SR',fdc:168462,desc:'Spinach, raw'},
    kangkung:         {ds:'SR',fdc:170390,desc:'Cabbage, chinese (pak-choi), raw'},  // padanan
    sawi_hijau:       {ds:'SR',fdc:169256,desc:'Mustard greens, raw'},
    sawi_putih:       {ds:'SR',fdc:170390,desc:'Cabbage, chinese (pak-choi), raw'},
    wortel:           {ds:'SR',fdc:170393,desc:'Carrots, raw'},
    buncis:           {ds:'SR',fdc:169961,desc:'Beans, snap, green, raw'},
    kacang_panjang:   {ds:'SR',fdc:169961,desc:'Beans, snap, green, raw'},  // padanan
    kol:              {ds:'SR',fdc:169975,desc:'Cabbage, raw'},
    brokoli:          {ds:'SR',fdc:170379,desc:'Broccoli, raw'},
    labu_siam:        {ds:'SR',fdc:170402,desc:'Chayote, fruit, raw'},
    labu_kuning:      {ds:'SR',fdc:169295,desc:'Squash, winter, butternut, raw'},  // padanan
    terong:           {ds:'SR',fdc:169228,desc:'Eggplant, raw'},
    tauge:            {ds:'SR',fdc:169957,desc:'Mung beans, mature seeds, sprouted, raw'},
    timun:            {ds:'SR',fdc:168409,desc:'Cucumber, with peel, raw'},
    tomat:            {ds:'SR',fdc:170457,desc:'Tomatoes, red, ripe, raw, year round average'},
    selada:           {ds:'SR',fdc:169249,desc:'Lettuce, green leaf, raw'},
    lobak:            {ds:'SR',fdc:169276,desc:'Radishes, raw'},
    bawang_merah:     {ds:'SR',fdc:170000,desc:'Onions, raw'},
    bawang_putih:     {ds:'SR',fdc:169230,desc:'Garlic, raw'},
    kunyit:           {ds:'SR',fdc:172231,desc:'Spices, turmeric, ground'},  // padanan
    jahe:             {ds:'SR',fdc:169231,desc:'Ginger root, raw'},
    daun_salam:       {ds:'SR',fdc:170917,desc:'Spices, bay leaf'},
    daun_bawang:      {ds:'SR',fdc:170005,desc:'Onions, spring or scallions (includes tops and bulb), raw'},
    ketumbar_bubuk:   {ds:'SR',fdc:170923,desc:'Spices, cumin seed'},  // padanan
    merica_bubuk:     {ds:'SR',fdc:170931,desc:'Spices, pepper, black'},  // padanan
    garam:            {ds:'SR',fdc:173468,desc:'Salt, table'},
    kecap_manis:      {ds:'SR',fdc:172886,desc:'Sauce, hoisin, ready-to-serve'},  // padanan
    kecap_asin:       {ds:'SR',fdc:174277,desc:'Soy sauce made from soy and wheat (shoyu)'},
    minyak_goreng:    {ds:'SR',fdc:171015,desc:'Oil, palm'},  // padanan
    minyak_kelapa:    {ds:'SR',fdc:171412,desc:'Oil, coconut'},
    minyak_sawit:     {ds:'SR',fdc:171015,desc:'Oil, palm'},  // padanan
    gula_pasir:       {ds:'SR',fdc:169655,desc:'Sugars, granulated'},
    gula_merah:       {ds:'SR',fdc:168833,desc:'Sugars, brown'},
    madu:             {ds:'SR',fdc:169640,desc:'Honey'},
    santan_kelapa:    {ds:'SR',fdc:170172,desc:'Nuts, coconut milk, raw (liquid expressed from grated meat and water)'},
    santan_kental:    {ds:'SR',fdc:170173,desc:'Nuts, coconut milk, canned (liquid expressed from grated meat and water)'},  // padanan; nutrien tidak lengkap
    pisang:           {ds:'SR',fdc:173944,desc:'Bananas, raw'},
    apel:             {ds:'SR',fdc:171688,desc:'Apples, raw, with skin'},
    jeruk:            {ds:'SR',fdc:169097,desc:'Oranges, raw, all commercial varieties'},
    mangga:           {ds:'SR',fdc:169910,desc:'Mangos, raw'},
    semangka:         {ds:'SR',fdc:167765,desc:'Watermelon, raw'},
    pepaya:           {ds:'SR',fdc:169926,desc:'Papayas, raw'},
    nanas:            {ds:'SR',fdc:169124,desc:'Pineapple, raw, all varieties'},
    salak:            {ds:'SR',fdc:174687,desc:'Jackfruit, raw'},  // padanan
    anggur:           {ds:'SR',fdc:174683,desc:'Grapes, red or green (European type, such as Thompson seedless), raw'},
    air:              {ds:'SR',fdc:174158,desc:'Water, bottled, generic'},
    teh:              {ds:'SR',fdc:173227,desc:'Beverages, tea, black, brewed, prepared with tap water'},
    susu_sapi:        {ds:'SR',fdc:171265,desc:'Milk, whole, 3.25% milkfat, with added vitamin D'},
    susu_kedelai:     {ds:'FD',fdc:2705405,desc:'Soy milk, unsweetened'},
    yogurt_plain:     {ds:'SR',fdc:171284,desc:'Yogurt, plain, whole milk'},
    coklat_hot:       {ds:'FD',fdc:2705473,desc:'Hot chocolate / cocoa, made with whole or reduced fat (2%) milk'},
    kerupuk:          {ds:'SR',fdc:172746,desc:'Crackers, saltines (includes oyster, soda, soup)'},  // padanan
    jeruk_nipis:      {ds:'SR',fdc:168155,desc:'Limes, raw'},
    kerupuk_udang:    {ds:'SR',fdc:174098,desc:'Crackers, flavored, fish-shaped'},  // padanan
    alpukat:          {ds:'SR',fdc:171705,desc:'Avocados, raw, all commercial varieties'},
    asam_jawa:        {ds:'SR',fdc:167763,desc:'Tamarinds, raw'},
    serai:            {ds:'-',fdc:0,desc:'belum ada sumber USDA'},
    };

    window.SUMBER_GIZI = SUMBER_GIZI;

    /* Basis gizi per bahan */
const NUTRIENTS={
    
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
    minyak_goreng:    {cat:'Minyak goreng',k:884,p:0,c:0,f:100,fb:0,sg:0,na:0,sf:49.3,ch:0,dens:0.92,per:{sendok:5}},  // padanan USDA (Oil, palm)
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

    
    /* Metode masak */
const COOK_METHODS={
    rebus:    {label:'Direbus',           air:0.90,reaps:0.00,reapsC:0.00,note:'Tanpa minyak. Sebagian air menguap.'},
    kukus:    {label:'Dikukus',           air:0.92,reaps:0.00,reapsC:0.00,note:'Tanpa minyak. Nutrisi paling terjaga.'},
    panggang: {label:'Dipanggang',        air:0.70,reaps:0.03,reapsC:0.01,note:'Panggang dengan sedikit minyak, yang hanya menempel di permukaan.'},
    tumis:    {label:'Tumis',             air:0.80,reaps:0.04,reapsC:0.01,note:'Minyak goreng, sebagian kecil meresap ke bahan.'},
    goreng:   {label:'Digoreng',          air:0.60,reaps:0.12,reapsC:0.03,note:'Minyak goreng, sebagian besar meresap ke bahan.'},
    bacem:    {label:'Direbus Bumbu',     air:1.30,reaps:0.02,reapsC:0.01,note:'Direbus dalam kuah bumbu sampai kuahnya menyusut.'},
    mentah:   {label:'Tanpa dimasak',     air:1.00,reaps:0.00,reapsC:0.00,note:'Dimakan langsung, tanpa minyak.'},
    };

    function cookMethod(key){
    if(!key) return COOK_METHODS.mentah;
    return COOK_METHODS[key]||COOK_METHODS.mentah;
    }

    
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

    
    const SCALE_MIN=0.55;
    const SCALE_MAX=2.0;

    function cloneBahan(bahan){
    return bahan.map(function(b){ return Object.assign({}, b); });
    }

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

    
    const MEAL_SLOTS = [
    {key:'pagi',   label:'Sarapan',     range:'06:00-08:00',  icon:'sunrise'},
    {key:'siang',  label:'Makan Siang', range:'11:30-13:00',  icon:'bowl'},
    {key:'snack',  label:'Snack',       range:'15:30-16:30',  icon:'bowl'},
    {key:'malam',  label:'Makan Malam', range:'18:00-19:30',  icon:'moon'},
    {key:'minuman',label:'Minuman',     range:'Sepanjang hari',icon:'leaf'},
    ];

    const MEAL_DIST = {
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

    window.NUTRISI = {
    NUTRIENTS, NUTRIENT_TRUST, COOK_METHODS, MEAL_SLOTS, MEAL_DIST, SNAP, NUTRIENT_SOURCE,
    SCALE_MIN, SCALE_MAX,
    energyFromMacros, toGrams, cookMethod, computeNutrition, nutritionSummary,
    auditNutrientDB, fitRecipeToKcal, snapOf, applyQty, cloneBahan,
    calcEnergyTargets, mealDistribution, slotTargetKcal, slotTargetMacros
    };