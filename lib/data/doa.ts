export type Doa = {
  title: string;
  icon: string;
  cat: "sehari-hari" | "masjid" | "wudhu" | "perjalanan";
  arab: string;
  latin: string;
  meaning: string;
};

export const DOA_CATEGORIES: { key: string; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "sehari-hari", label: "Doa Harian" },
  { key: "masjid", label: "Masjid" },
  { key: "wudhu", label: "Wudhu" },
  { key: "perjalanan", label: "Perjalanan" },
];

export const DOA_LIST: Doa[] = [
  {
    title: "Doa Sebelum Tidur",
    icon: "fa-bed",
    cat: "sehari-hari",
    arab: "بِاسْمِكَ اللَّهُمَّ أَحْيَا وَبِاسْمِكَ أَمُوتُ",
    latin: "Bismikallahumma ahya wa bismika amut",
    meaning: "Dengan nama-Mu ya Allah aku hidup dan dengan nama-Mu aku mati",
  },
  {
    title: "Doa Bangun Tidur",
    icon: "fa-sun",
    cat: "sehari-hari",
    arab: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    latin: "Alhamdulillahilladzi ahyana ba'da ma amatana wa ilaihin nusyur",
    meaning:
      "Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan hanya kepada-Nya kami dikembalikan",
  },
  {
    title: "Doa Sebelum Makan",
    icon: "fa-utensils",
    cat: "sehari-hari",
    arab: "اَللَّهُمَّ بَارِكْ لَنَا فِيْمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ",
    latin: "Allahumma barik lana fi ma razaqtana wa qina 'adzaban nar",
    meaning: "Ya Allah, berkahilah rezeki yang Engkau berikan kepada kami dan jauhkan kami dari siksa neraka",
  },
  {
    title: "Doa Sesudah Makan",
    icon: "fa-hand-peace",
    cat: "sehari-hari",
    arab: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    latin: "Alhamdulillahilladzi ath'amana wa saqona wa ja'alana muslimin",
    meaning: "Segala puji bagi Allah yang telah memberi makan dan minum kepada kami serta menjadikan kami orang-orang muslim",
  },
  {
    title: "Doa Naik Kendaraan",
    icon: "fa-car",
    cat: "perjalanan",
    arab: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    latin: "Subhanalladzi sakh-khara lana hadza wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun",
    meaning:
      "Maha Suci Allah yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami",
  },
  {
    title: "Doa Masuk Rumah",
    icon: "fa-home",
    cat: "sehari-hari",
    arab: "اَللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    latin: "Allahumma inni as-aluka khairal mauliji wa khairal makhraji bismillahi walajna wa bismillahi khorojna wa 'alallahi robbana tawakkalna",
    meaning:
      "Ya Allah, aku memohon kepada-Mu sebaik-baik tempat masuk dan sebaik-baik tempat keluar. Dengan nama Allah kami masuk, dan dengan nama Allah kami keluar, dan kepada Allah Tuhan kami kami bertawakal",
  },
  {
    title: "Doa Masuk Masjid",
    icon: "fa-mosque",
    cat: "masjid",
    arab: "اَللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    latin: "Allahummaftah li abwaba rohmatik",
    meaning: "Ya Allah, bukakanlah pintu rahmat-Mu untukku",
  },
  {
    title: "Doa Keluar Masjid",
    icon: "fa-hand-sparkles",
    cat: "masjid",
    arab: "اَللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    latin: "Allahumma inni as-aluka min fadlik",
    meaning: "Ya Allah, aku memohon kepada-Mu karunia-Mu",
  },
  {
    title: "Doa Sebelum Wudhu",
    icon: "fa-bath",
    cat: "wudhu",
    arab: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ",
    latin: "Bismillahirrahmanirrahim",
    meaning: "Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang",
  },
  {
    title: "Doa Sesudah Wudhu",
    icon: "fa-water",
    cat: "wudhu",
    arab: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    latin: "Asyhadu alla ilaha illallahu wahdahu la syarika lahu wa asyhadu anna muhammadan 'abduhu wa rasuluh",
    meaning:
      "Aku bersaksi bahwa tiada Tuhan selain Allah semata tiada sekutu bagi-Nya, dan aku bersaksi bahwa Muhammad adalah hamba dan utusan-Nya",
  },
];