export type Bacaan = { arab: string; latin: string; meaning: string };
export type Guide = { title: string; icon: string; steps: string[]; note?: string };

export const PRAYER_TABS: { key: string; label: string }[] = [
  { key: "wajib", label: "Sholat Wajib" },
  { key: "sunnah", label: "Sholat Sunnah" },
  { key: "wudhu", label: "Niat Wudhu" },
  { key: "histep", label: "Tata Cara Sholat" },
  { key: "dzikir", label: "Dzikir & Doa" },
];

// Niat sholat wajib
export const NIAT_WAJIB: Bacaan[] = [
  {
    arab: "أُصَلِّي فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushalli fardhash shubhi rak'ataini mustaqbilal qiblati ada-an lillahi ta'ala",
    meaning: "Aku berniat shalat fardhu Subuh dua rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushalli fardhadz dzuhri arba'a raka'atin mustaqbilal qiblati ada-an lillahi ta'ala",
    meaning: "Aku berniat shalat fardhu Dzuhur empat rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushalli fardhal 'ashri arba'a raka'atin mustaqbilal qiblati ada-an lillahi ta'ala",
    meaning: "Aku berniat shalat fardhu Ashar empat rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushalli fardhal maghribi tsalatsa raka'atin mustaqbilal qiblati ada-an lillahi ta'ala",
    meaning: "Aku berniat shalat fardhu Maghrib tiga rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushalli fardhal 'isya'i arba'a raka'atin mustaqbilal qiblati ada-an lillahi ta'ala",
    meaning: "Aku berniat shalat fardhu Isya empat rakaat menghadap kiblat karena Allah Ta'ala",
  },
];

export const NIAT_SUNNAH: Bacaan[] = [
  {
    arab: "أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    latin: "Ushalli sunnatadh dhuha rak'ataini mustaqbilal qiblati lillahi ta'ala",
    meaning: "Aku berniat shalat sunnah Dhuha dua rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    latin: "Ushalli sunnatat tahajjudi rak'ataini mustaqbilal qiblati lillahi ta'ala",
    meaning: "Aku berniat shalat sunnah Tahajud dua rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي سُنَّةَ الْوِتْرِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ لِلَّهِ تَعَالَى",
    latin: "Ushalli sunnatal witri tsalatsa raka'atin mustaqbilal qiblati lillahi ta'ala",
    meaning: "Aku berniat shalat sunnah Witir tiga rakaat menghadap kiblat karena Allah Ta'ala",
  },
  {
    arab: "أُصَلِّي فَرْضَ الْجُمُعَةِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلَّهِ تَعَالَى",
    latin: "Ushalli fardhal jumu'ati rak'ataini mustaqbilal qiblati ada-an lillahi ta'ala",
    meaning: "Aku berniat shalat fardhu Jumat dua rakaat menghadap kiblat karena Allah Ta'ala",
  },
];

export const NIAT_WUDHU: Bacaan[] = [
  {
    arab: "نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى",
    latin: "Nawaitul wudhuu-a liraf'il hadatsil ashghari fardhan lillahi ta'ala",
    meaning: "Aku berniat wudhu untuk menghilangkan hadas kecil, fardhu karena Allah Ta'ala",
  },
  {
    arab: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    latin: "Asyhadu alla ilaha illallahu wahdahu la syarika lahu wa asyhadu anna muhammadan abduhu wa rasuluh",
    meaning: "Aku bersaksi bahwa tiada Tuhan selain Allah semata tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya",
  },
  {
    arab: "اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
    latin: "Allahummaj'alni minat tawwabina waj'alni minal mutathahhirin",
    meaning: "Ya Allah, jadikanlah aku termasuk orang-orang yang bertaubat dan jadikanlah aku termasuk orang-orang yang bersuci",
  },
];

export const TATA_CARA_SHOLLAT: Guide = {
  title: "Urutan Sholat (Rakaat Pertama)",
  icon: "fa-list-ol",
  steps: [
    "Niat dalam hati seraya berdiri menghadap kiblat.",
    "Takbiratul Ihram - mengangkat kedua tangan lalu bersedekap, membaca Allahu Akbar.",
    "Doa Iftitah (sunnah) - diikuti Al-Fatihah lalu surah pendek.",
    "Ruku' - membungkuk dengan punggung lurus, membaca Subhana rabbiyal 'adzim 3x.",
    "I'tidal - bangun dari ruku' sambil membaca Sami'allahu liman hamidah, lalu Rabbana lakal hamd.",
    "Sujud - bersujud, membaca Subhana rabbiyal a'la 3x.",
    "Duduk di antara dua sujud - membaca Rabbighfirli 3x.",
    "Sujud kedua - sama seperti sujud pertama.",
    "Berdiri lagi untuk rakaat berikutnya (ulangi langkah 3-8).",
    "Tasyahud akhir - duduk tasyahud membaca tasyahud, shalawat Ibrahimiyah.",
    "Salam - menoleh ke kanan lalu ke kiri, membaca Assalamu'alaikum warahmatullah.",
  ],
  note: "Jumlah rakaat: Subuh 2, Dzuhur 4, Ashar 4, Maghrib 3, Isya 4. Tahiyat awal dikerjakan pada rakaat ke-2 untuk sholat 3/4 rakaat.",
};

export const TATA_CARA_WUDHU: Guide = {
  title: "Urutan Wudhu",
  icon: "fa-hand-sparkles",
  steps: [
    "Membaca Bismillah dan niat wudhu dalam hati.",
    "Membasuh telapak tangan 3x.",
    "Berkumur, membersihkan hidung 3x.",
    "Membasuh wajah 3x.",
    "Membasuh tangan kanan lalu kiri hingga siku 3x.",
    "Mengusap kepala dan kedua telinga 1x.",
    "Membasuh kaki kanan lalu kiri hingga mata kaki 3x.",
    "Membaca doa sesudah wudhu (Asyhadu alla ilaha illallah...).",
  ],
};

export const DZIKIR_SETELAH_SHOLAT: Bacaan[] = [
  {
    arab: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
    latin: "Astaghfirullahal 'adzim",
    meaning: "Aku memohon ampun kepada Allah Yang Maha Agung",
  },
  {
    arab: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
    latin: "Allahumma antas salam wa minkas salam tabarakta ya dzal jalali wal ikram",
    meaning: "Ya Allah, Engkau adalah keselamatan, dan dari-Mu lah keselamatan, Maha Suci Engkau wahai Tuhan Yang Memiliki Keagungan dan Kemuliaan",
  },
  { arab: "سُبْحَانَ اللَّهِ", latin: "Subhanallah", meaning: "Maha Suci Allah" },
  { arab: "الْحَمْدُ لِلَّهِ", latin: "Alhamdulillah", meaning: "Segala puji bagi Allah" },
  { arab: "اللَّهُ أَكْبَرُ", latin: "Allahu Akbar", meaning: "Allah Maha Besar" },
  {
    arab: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin: "La ilaha illallahu wahdahu la syarika lahu, lahul mulku wa lahul hamdu wa huwa 'ala kulli syai-in qadir",
    meaning: "Tidak ada Tuhan selain Allah semata, tidak ada sekutu bagi-Nya, milik-Nya segala kerajaan dan bagi-Nya segala puji, dan Dia Maha Kuasa atas segala sesuatu",
  },
];

export const DZIKIR_COUNT: { [key: number]: string } = { 0: "3x", 1: "1x", 2: "33x", 3: "33x", 4: "33x", 5: "1x" };