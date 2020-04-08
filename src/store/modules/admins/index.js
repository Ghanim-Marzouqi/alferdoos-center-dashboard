import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const state = {
  user: {},
  errors: [],
  messages: [],
  chapters: [
    { id: 1, name: "الأول" },
    { id: 2, name: "الثاني" },
    { id: 3, name: "الثالث" },
    { id: 4, name: "الرابع" },
    { id: 5, name: "الخامس" },
    { id: 6, name: "السادس" },
    { id: 7, name: "السابع" },
    { id: 8, name: "الثامن" },
    { id: 9, name: "التاسع" },
    { id: 10, name: "العاشر" },
    { id: 11, name: "الحادي عشر" },
    { id: 12, name: "الثاني عشر" },
    { id: 13, name: "الثالث عشر" },
    { id: 14, name: "الرابع عشر" },
    { id: 15, name: "الخامس عشر" },
    { id: 16, name: "السادس عشر" },
    { id: 17, name: "السابع عشر" },
    { id: 18, name: "الثامن عشر" },
    { id: 19, name: "التاسع عشر" },
    { id: 20, name: "العشرون" },
    { id: 21, name: "الحادي والعشرون" },
    { id: 22, name: "الثاني والعشرون" },
    { id: 23, name: "الثالث والعشرون" },
    { id: 24, name: "الرابع والعشرون" },
    { id: 25, name: "الخامس والعشرون" },
    { id: 26, name: "السادس والعشرون" },
    { id: 27, name: "السابع والعشرون" },
    { id: 28, name: "الثامن والعشرون" },
    { id: 29, name: "التاسع والعشرون" },
    { id: 30, name: "الثلاثون" }
  ],
  surahs: [
    { id: 1, name: "الفاتحة", chapter: 1, phrases: 7 },
    { id: 2, name: "البقرة", chapter: 1, phrases: 286 },
    { id: 3, name: "آل عمران", chapter: 4, phrases: 200 },
    { id: 4, name: "النساء", chapter: 5, phrases: 176 },
    { id: 5, name: "المائدة", chapter: 6, phrases: 120 },
    { id: 6, name: "الأنعام", chapter: 7, phrases: 165 },
    { id: 7, name: "الأعراف", chapter: 8, phrases: 206 },
    { id: 8, name: "الأنفال", chapter: 9, phrases: 75 },
    { id: 9, name: "التوبة", chapter: 10, phrases: 129 },
    { id: 10, name: "يونس", chapter: 11, phrases: 109 },
    { id: 11, name: "هود", chapter: 11, phrases: 123 },
    { id: 12, name: "يوسف", chapter: 12, phrases: 111 },
    { id: 13, name: "الرعد", chapter: 13, phrases: 43 },
    { id: 14, name: "إبراهيم", chapter: 13, phrases: 52 },
    { id: 15, name: "الحجر", chapter: 14, phrases: 99 },
    { id: 16, name: "النحل", chapter: 14, phrases: 128 },
    { id: 17, name: "الإسراء", chapter: 15, phrases: 111 },
    { id: 18, name: "الكهف", chapter: 15, phrases: 110 },
    { id: 19, name: "مريم", chapter: 16, phrases: 98 },
    { id: 20, name: "طه", chapter: 16, phrases: 135 },
    { id: 21, name: "الأنبياء", chapter: 17, phrases: 112 },
    { id: 22, name: "الحج", chapter: 17, phrases: 78 },
    { id: 23, name: "المؤمنون", chapter: 18, phrases: 118 },
    { id: 24, name: "النور", chapter: 18, phrases: 64 },
    { id: 25, name: "الفرقان", chapter: 18, phrases: 77 },
    { id: 26, name: "الشعراء", chapter: 19, phrases: 227 },
    { id: 27, name: "النمل", chapter: 20, phrases: 93 },
    { id: 28, name: "القصص", chapter: 20, phrases: 88 },
    { id: 29, name: "العنكبوت", chapter: 20, phrases: 69 },
    { id: 30, name: "الروم", chapter: 21, phrases: 60 },
    { id: 31, name: "لقمان", chapter: 21, phrases: 34 },
    { id: 32, name: "السجدة", chapter: 21, phrases: 30 },
    { id: 33, name: "الأحزاب", chapter: 21, phrases: 73 },
    { id: 34, name: "سبأ", chapter: 22, phrases: 54 },
    { id: 35, name: "فاطر", chapter: 22, phrases: 45 },
    { id: 36, name: "يس", chapter: 22, phrases: 83 },
    { id: 37, name: "الصافات", chapter: 23, phrases: 182 },
    { id: 38, name: "ص", chapter: 23, phrases: 88 },
    { id: 39, name: "الزمر", chapter: 23, phrases: 75 },
    { id: 40, name: "غافر", chapter: 24, phrases: 85 },
    { id: 41, name: "فصلت", chapter: 24, phrases: 54 },
    { id: 42, name: "الشورى", chapter: 25, phrases: 53 },
    { id: 43, name: "الزخرف", chapter: 25, phrases: 89 },
    { id: 44, name: "الدخان", chapter: 25, phrases: 59 },
    { id: 45, name: "الجاثية", chapter: 25, phrases: 37 },
    { id: 46, name: "الأحقاف", chapter: 26, phrases: 35 },
    { id: 47, name: "محمد", chapter: 26, phrases: 38 },
    { id: 48, name: "الفتح", chapter: 26, phrases: 29 },
    { id: 49, name: "الحجرات", chapter: 26, phrases: 18 },
    { id: 50, name: "ق", chapter: 26, phrases: 45 },
    { id: 51, name: "الذاريات", chapter: 26, phrases: 60 },
    { id: 52, name: "الطور", chapter: 27, phrases: 49 },
    { id: 53, name: "النجم", chapter: 27, phrases: 62 },
    { id: 54, name: "القمر", chapter: 27, phrases: 55 },
    { id: 55, name: "الرحمن", chapter: 27, phrases: 78 },
    { id: 56, name: "الواقعة", chapter: 27, phrases: 96 },
    { id: 57, name: "الحديد", chapter: 27, phrases: 29 },
    { id: 58, name: "المجادلة", chapter: 28, phrases: 22 },
    { id: 59, name: "الحشر", chapter: 28, phrases: 24 },
    { id: 60, name: "الممتحنة", chapter: 28, phrases: 13 },
    { id: 61, name: "الصف", chapter: 28, phrases: 14 },
    { id: 62, name: "الجمعة", chapter: 28, phrases: 11 },
    { id: 63, name: "المنافقون", chapter: 28, phrases: 11 },
    { id: 64, name: "التغابن", chapter: 28, phrases: 18 },
    { id: 65, name: "الطلاق", chapter: 28, phrases: 12 },
    { id: 66, name: "التحريم", chapter: 28, phrases: 12 },
    { id: 67, name: "الملك", chapter: 29, phrases: 30 },
    { id: 68, name: "القلم", chapter: 29, phrases: 52 },
    { id: 69, name: "الحاقة", chapter: 29, phrases: 52 },
    { id: 70, name: "المعارج", chapter: 29, phrases: 44 },
    { id: 71, name: "نوح", chapter: 29, phrases: 28 },
    { id: 72, name: "الجن", chapter: 29, phrases: 28 },
    { id: 73, name: "المزمل", chapter: 29, phrases: 20 },
    { id: 74, name: "المدثر", chapter: 29, phrases: 56 },
    { id: 75, name: "القيامة", chapter: 29, phrases: 40 },
    { id: 76, name: "الإنسان", chapter: 29, phrases: 31 },
    { id: 77, name: "المرسلات", chapter: 29, phrases: 50 },
    { id: 78, name: "النبأ", chapter: 30, phrases: 40 },
    { id: 79, name: "النازعات", chapter: 30, phrases: 46 },
    { id: 80, name: "عبس", chapter: 30, phrases: 42 },
    { id: 81, name: "التكوير", chapter: 30, phrases: 29 },
    { id: 82, name: "الانفطار", chapter: 30, phrases: 19 },
    { id: 83, name: "المطففين", chapter: 30, phrases: 36 },
    { id: 84, name: "الانشقاق", chapter: 30, phrases: 25 },
    { id: 85, name: "البروج", chapter: 30, phrases: 22 },
    { id: 86, name: "الطارق", chapter: 30, phrases: 17 },
    { id: 87, name: "الأعلى", chapter: 30, phrases: 19 },
    { id: 88, name: "الغاشية", chapter: 30, phrases: 26 },
    { id: 89, name: "الفجر", chapter: 30, phrases: 30 },
    { id: 90, name: "البلد", chapter: 30, phrases: 20 },
    { id: 91, name: "الشمس", chapter: 30, phrases: 15 },
    { id: 92, name: "الليل", chapter: 30, phrases: 21 },
    { id: 93, name: "الضحى", chapter: 30, phrases: 11 },
    { id: 94, name: "الشرح", chapter: 30, phrases: 8 },
    { id: 95, name: "التين", chapter: 30, phrases: 8 },
    { id: 96, name: "العلق", chapter: 30, phrases: 19 },
    { id: 97, name: "القدر", chapter: 30, phrases: 5 },
    { id: 98, name: "البينة", chapter: 30, phrases: 8 },
    { id: 99, name: "الزلزلة", chapter: 30, phrases: 8 },
    { id: 100, name: "العاديات", chapter: 30, phrases: 11 },
    { id: 101, name: "القارعة", chapter: 30, phrases: 11 },
    { id: 102, name: "التكاثر", chapter: 30, phrases: 8 },
    { id: 103, name: "العصر", chapter: 30, phrases: 3 },
    { id: 104, name: "الهمزة", chapter: 30, phrases: 9 },
    { id: 105, name: "الفيل", chapter: 30, phrases: 5 },
    { id: 106, name: "قريش", chapter: 30, phrases: 4 },
    { id: 107, name: "الماعون", chapter: 30, phrases: 7 },
    { id: 108, name: "الكوثر", chapter: 30, phrases: 3 },
    { id: 109, name: "الكافرون", chapter: 30, phrases: 6 },
    { id: 110, name: "النصر", chapter: 30, phrases: 3 },
    { id: 111, name: "المسد", chapter: 30, phrases: 5 },
    { id: 112, name: "الإخلاص", chapter: 30, phrases: 4 },
    { id: 113, name: "الفلق", chapter: 30, phrases: 5 },
    { id: 114, name: "الناس", chapter: 30, phrases: 6 }
  ],
  loading: false,
  is_user_registered: false,
  registeredStudents: []
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
};
