export type Adhkar = {
  arab: string;
  latin: string;
  meaning: string;
  repeat: number;
};

export const DZIKIR_PAGI: Adhkar[] = [
  {
    arab: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    latin: "A'udzu billahi minasy syaithanir rajim",
    meaning: "Aku berlindung kepada Allah dari godaan setan yang terkutuk",
    repeat: 1,
  },
  {
    arab:
      "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    latin: "Allahu la ilaha illa huwal hayyul qayyum",
    meaning:
      "Ayat Kursi - Allah, tidak ada Tuhan selain Dia Yang Maha Hidup lagi terus-menerus mengurus makhluk-Nya",
    repeat: 1,
  },
  { arab: "قُلْ هُوَ اللَّهُ أَحَدٌ", latin: "Qul huwallahu ahad", meaning: "Surah Al-Ikhlas", repeat: 3 },
  {
    arab: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
    latin: "Qul a'udzu birabbil falaq",
    meaning: "Surah Al-Falaq",
    repeat: 3,
  },
  {
    arab: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    latin: "Qul a'udzu birabbin nas",
    meaning: "Surah An-Nas",
    repeat: 3,
  },
  {
    arab: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    latin: "Ashbahna wa ashbahal mulku lillah walhamdulillah",
    meaning:
      "Kami telah memasuki waktu pagi dan kerajaan hanyalah milik Allah, segala puji bagi Allah",
    repeat: 1,
  },
  {
    arab: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    latin:
      "Allahumma bika ashbahna wa bika amsaina wa bika nahya wa bika namutu wa ilaikan nusyur",
    meaning:
      "Ya Allah, dengan rahmat-Mu kami memasuki pagi, sore, hidup, dan mati. Hanya kepada-Mu kami dibangkitkan",
    repeat: 1,
  },
  {
    arab: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي",
    latin:
      "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi bashari",
    meaning: "Ya Allah, sehatkanlah badanku, pendengaranku, dan penglihatanku",
    repeat: 3,
  },
  {
    arab:
      "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    latin:
      "La ilaha illallahu wahdahu la syarika lah, lahul mulku wa lahul hamdu wa huwa ala kulli syai-in qadir",
    meaning:
      "Tidak ada Tuhan selain Allah semata, tiada sekutu bagi-Nya; milik-Nya kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu",
    repeat: 10,
  },
  { arab: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", latin: "Subhanallahi wa bihamdih", meaning: "Maha Suci Allah dengan segala puji-Nya", repeat: 100 },
  { arab: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", latin: "Astaghfirullaha wa atubu ilaih", meaning: "Aku memohon ampun kepada Allah dan bertaubat kepada-Nya", repeat: 100 },
  {
    arab: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    latin: "Allahumma sholli wa sallim 'ala nabiyyina Muhammad",
    meaning: "Ya Allah, limpahkanlah shalawat dan keselamatan kepada Nabi kami Muhammad",
    repeat: 10,
  },
];

export const DZIKIR_PETANG: Adhkar[] = [
  {
    arab: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    latin: "Amsaina wa amsal mulku lillah walhamdulillah",
    meaning: "Kami telah memasuki waktu petang dan kerajaan hanyalah milik Allah, segala puji bagi Allah",
    repeat: 1,
  },
  {
    arab: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    latin: "Allahumma bika amsaina wa bika ashbahna wa bika nahya wa bika namutu wa ilaikal mashir",
    meaning:
      "Ya Allah, dengan rahmat-Mu kami memasuki sore dan pagi, kami hidup dan mati. Hanya kepada-Mu tempat kembali",
    repeat: 1,
  },
  {
    arab: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    latin: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana abduk",
    meaning:
      "Doa Sayyidul Istighfar - Ya Allah, Engkau Tuhanku, tiada Tuhan selain Engkau. Engkau menciptakanku dan aku hamba-Mu",
    repeat: 1,
  },
  {
    arab: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    latin: "A'udzu bikalimatillahit tammati min syarri ma khalaq",
    meaning: "Aku berlindung dengan kalimat-kalimat Allah yang sempurna dari kejahatan makhluk-Nya",
    repeat: 3,
  },
  {
    arab: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    latin: "Allahumma inni as-alukal 'afwa wal 'afiyah fid dunya wal akhirah",
    meaning: "Ya Allah, aku memohon ampunan dan keselamatan di dunia dan akhirat",
    repeat: 3,
  },
  {
    arab: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    latin:
      "Bismillahilladzi la yadhurru ma'asmihi syai-un fil ardhi wa la fis sama-i wa huwas sami'ul 'alim",
    meaning:
      "Dengan nama Allah yang dengan nama-Nya sesuatu tidak berbahaya di bumi dan langit. Dan Dia Maha Mendengar lagi Maha Mengetahui",
    repeat: 3,
  },
  {
    arab: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ نَبِيًّا",
    latin: "Radhitu billahi rabba wa bil islami dina wa bi muhammadin nabiyya",
    meaning: "Aku rela Allah sebagai Tuhanku, Islam sebagai agamaku, dan Muhammad sebagai nabiku",
    repeat: 3,
  },
  { arab: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", latin: "Subhanallahi wa bihamdih", meaning: "Maha Suci Allah dengan segala puji-Nya", repeat: 100 },
  { arab: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", latin: "Astaghfirullaha wa atubu ilaih", meaning: "Aku memohon ampun kepada Allah dan bertaubat kepada-Nya", repeat: 100 },
  {
    arab: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    latin: "Allahumma sholli wa sallim 'ala nabiyyina Muhammad",
    meaning: "Ya Allah, limpahkanlah shalawat dan keselamatan kepada Nabi kami Muhammad",
    repeat: 10,
  },
];