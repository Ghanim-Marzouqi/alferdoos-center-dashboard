// Firestore Collections
const COLLECTIONS = {
  MESSAGES : "messages",
  ACTIVITIES : "activities",
  MARKS: "marks",
  ADMINS: "admins",
  EXECUSES : "execuses",
  SUBJECTS : "subjects",
  ENTRIES : "entries",
  PARENTS: "parents",
  TEACHERS: "teachers",
  STUDENTS: "students",
  ATTENDANCE : "attendance",
  YEARS: "years",
  QUESTIONS: "questions",
  EXAM_MARKS: "examMarks",
  STUDENT_EXAM_MARKS: "studentExamMarks",
  STUDENT_QUESTION_MARKS: "studentQuestionMarks",
  GROUPS: "groups",
  MEMORIZATIONS: "memorizations",
  SCHEDUALS : "Schedules",
  MEETINGS : "meetings",
  EXPANCE : "expense",
  REPEATED_EXPANCE : "repeated_expense",
  BEHAVIORS : "behaviors"
};

const STUDENT_GRADE = {
  GRADE_SEVEN: "grade_seven",
  GRADE_EIGHT: "grade_eight",
  GRADE_NINE: "grade_nine"
};

// Student Statuses
const STUDENT_STATUS = {
  REVIEW: "review",
  EXAM: "exam",
  STUDY: "study",
  REJECT: "reject",
  WITHDRAW: "withdraw"
};

// Quaran Chapters
const CHAPTERS = [
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
];

// Quaran Surahs
const SURAHS = [
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
];

// Villages
const VILLAGES = [
  "معمد",
  "المعري",
  "البلاد",
  "الفيقين",
  "البياض",
  "الشعيبة",
  "حي جامع",
  "المعيول",
  "عز",
  "متان",
  "اخرى"
];

const KNOWN_BY = [
  "مواقع التواصل الإجتماعي",
  "إعلان",
  "اصدقاء",
  "ولي الأمر",
  "الموقع",
  "اخرى"
];

const EXAM_TYPE = {
  WRITTEN: "written",
  RECITE: "recite",
  READING: "reading",
  COMMON_KNOWLEDGE: "commonKnowledge",
  PERSONAL: "personal"
};

// Vuex Getters
const GETTERS = {
  GET_EXECUSES : "GET_EXECUSES",
  AUTH: {
    GET_USER: "GET_USER",
    GET_USER_REGISTRATION_STATE: "GET_USER_REGISTRATION_STATE"
  },
  GROUPS: {
    GET_GROUPS: "GET_GROUPS",
    GET_STUDENT_GROUP: "GET_STUDENT_GROUP"
  },
  SETTINGS: {
    GET_YEAR_INFO: "GET_YEAR_INFO",
    GET_REGISTRATION_PERIOD: "GET_REGISTRATION_PERIOD",
    GET_QUESTIONS: "GET_QUESTIONS",
    GET_EXAM_MARKS: "GET_EXAM_MARKS",
    GET_GROUPS: "GET_GROUPS",
    GET_MEMORIZATIONS: "GET_MEMORIZATIONS",
    GET_SCHADUALS :"GET_SCHADUALS",
    GET_MEMORIZATION: "GET_MEMORIZATION",
    GET_METTINGS : "GET_METTINGS",
    GET_REPEATED_EXPENCE : "GET_REPEATED_EXPENCE",
    GET_EXPENCE : "GET_EXPENCE",
    GET_ENTRIES : "GET_ENTRIES",
    GET_EMAILS : "GET_EMAILS"
  },
  STUDNETS: {
    GET_ACTIVITIES: "GET_ACTIVITIES",
    GET_BEHAVIORS : "GET_BEHAVIORS",
    GET_STUDENTS: "GET_STUDENTS",
    GET_STUDENTS_MARKS: "GET_STUDENTS_MARKS",
    GET_STUDENT_ANSWERS: "GET_STUDENT_ANSWERS",
    GET_STUDENTS_AND_MARKS: "GET_STUDENTS_AND_MARKS",
    GET_ATTENDANCE : "GET_ATTENDANCE",
    GET_ATTENDANCE_RANGE_DATE : "GET_ATTENDANCE_RANGE_DATE",
    GET_EXECUSES : "GET_EXECUSES"
  },
  SUBJECTS :{
    GET_SUBJECTS : "GET_SUBJECTS",
    GET_MARKS : "GET_MARKS"
  },
  TEACHERS: {
    GET_TEACHERS: "GET_TEACHERS",
    GET_TEACHER: "GET_TEACHER"
  },
  UI: {
    GET_LOADING: "GET_LOADING",
    GET_ERRORS: "GET_ERRORS",
    GET_MESSAGES: "GET_MESSAGES"
  }
};

// Vuex Actions
const ACTIONS = {
  AUTH: {
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    TRIGGER_USER_REGISTRATION_STATE: "TRIGGER_USER_REGISTRATION_STATE",
    TRIGGER_USER_STATE: "TRIGGER_USER_STATE",
    RESET_PASSWORD: "RESET_PASSWORD",
    LOGOUT: "LOGOUT"
  },
  GROUPS: {
    ADD_GROUP: "ADD_GROUP",
    EDIT_GROUP: "EDIT_GROUP",
    DELETE_GROUP: "DELETE_GROUP",
    FETCH_GROUPS: "FETCH_GROUPS",
    FETECH_GROUP_BY_ID: "FETECH_GROUP_BY_ID",
    ADD_MEMORIZATION_TO_GROUP: "ADD_MEMORIZATION_TO_GROUP",
    DELETE_MEMORIZATION_FROM_GROUP: "DELETE_MEMORIZATION_FROM_GROUP"
  },
  SUBJECTS: {
    DELETE_SUBJECT : "DELETE_SUBJECT",
    REGISTER_SUBJECT : "REGISTER_SUBJECT",
    UPDATE_SUBJECT : "UPDATE_SUBJECT",
    FETCH_SUBJECTS : "FETCH_SUBJECTS",
    UPDATE_MARKS : "UPDATE_MARKS",
    SAVE_MARKS : "SAVE_MARKS",
    FETCH_MARKS : "FETCH_MARKS"
  },

  SETTINGS: {
    FETCH_YEAR_INFO: "FETCH_YEAR_INFO",
    SET_YEAR_NAME: "SET_YEAR_NAME",
    SET_REGISTRATION_PERIOD: "SET_REGISTRATION_PERIOD",
    FETCH_REGISTRATION_PERIOD: "FETCH_REGISTRATION_PERIOD",
    SET_EXAM_TOTAL_MARKS: "SET_EXAM_TOTAL_MARKS",
    SET_QUESTION: "SET_QUESTION",
    FETCH_QUESTIONS: "FETCH_QUESTIONS",
    DELETE_QUESTION: "DELETE_QUESTION",
    FETCH_EXAM_TOTAL_MARKS: "FETCH_EXAM_TOTAL_MARKS",
    ADD_MEMORIZATION: "ADD_MEMORIZATION",
    EDIT_MEMORIZATION: "EDIT_MEMORIZATION",
    EDIT_REPEATED_EXPANCE: "EDIT_REPEATED_EXPANCE",
    FETCH_MEMORIZATIONS: "FETCH_MEMORIZATIONS",
    DELETE_MEMORIZATION: "DELETE_MEMORIZATION",
    DELETE_REPEATED_EXPANCE :"DELETE_REPEATED_EXPANCE",
    ADD_MEMORIZATION_DETAILS: "ADD_MEMORIZATION_DETAILS",
    DELETE_MEMORIZATION_DETAILS: "DELETE_MEMORIZATION_DETAILS",
    ADD_REPEATED_EXPANCE : "ADD_REPEATED_EXPANCE",
    ADD_EXPANCE : "ADD_EXPANCE",
    ADD_SCHEDUAL : "ADD_SCHEDUAL",
    FETCH_SCHEDUAL : "FETCH_SCHEDUAL",
    SET_YEAR_SEMESTERS : "SET_YEAR_SEMESTERS",
    FETCH_MEMORIZATIONS_BY_ID: "FETCH_MEMORIZATIONS_BY_ID",
    SET_SESSION_SETTINGS : "SET_SESSION_SETTINGS",
    FETCH_MEETINGS : "FETCH_MEETINGS",
    DELETE_MEETINGS : "DELET_MEETINGS",
    SET_MEETINGS : "SET_MEETINGS",
    EDIT_MEETING : "EDIT_MEETING",
    DELETE_MEETINGS : "DELETE_MEETINGS",
    FETCH_EXPANCE : "FETCH_EXPANCE",
    FETCH_REPEATED_EXPANCE : "FETCH_REPEATED_EXPANCE",
    DELETE_EXPANCE : "DELETE_EXPANCE",
    EDIT_EXPANCE : "EDIT_EXPANCE",
    UPDATE_SETTINGS : "UPDATE_SETTINGS",
    REGISTER_ENTRY : "REGISTER_ENTRY",
    UPDATE_ENTRY : "UPDATE_ENTRY",
    FETCH_ENTRIES : "FETCH_ENTRIES",
    DELETE_ENTRY : "DELETE_ENTRY",
    FETCH_EMAILS : "FETCH_EMAILS",
    ADD_MESSAGE : "ADD_MESSAGE"
  },
  STUDNETS: {
    FETCH_ACTIVITIES : "FETCH_ACTIVITIES",
    DELETE_ACTIVITY : "DELETE_ACTIVITY",
    ADD_ACTIVITY : "ADD_ACTIVITY",
    UPDATE_ACTIVITY : "UPDATE_ACTIVITY",
    DELETE_BEHAVIOR : "DELETE_BEHAVIOR",
    FETCH_BEHAVIOR : "FETCH_BEHAVIOR",
    FETCH_STUDENTS: "FETCH_STUDENTS",
    FETCH_STUDENTS_BY_PARENT_ID: "FETCH_STUDENTS_BY_PARENT_ID",
    REGISTER_STUDENT: "REGISTER_STUDENT",
    DELETE_STUDENT: "DELETE_STUDENT",
    EDIT_STUDENT_STATUS: "EDIT_STUDENT_STATUS",
    EDIT_STUDENT_MARK: "EDIT_STUDENT_MARK",
    FETCH_STUDENTS_MARKS: "FETCH_STUDENTS_MARKS",
    SET_STUDENT_ANSWERS: "SET_STUDENT_ANSWERS",
    FETCH_STUDENT_ANSWERS_BY_ID: "FETCH_STUDENT_ANSWERS_BY_ID",
    SET_STUDENTS_AND_MARKS: "SET_STUDENTS_AND_MARKS",
    JOIN_STUDENT_TO_GROUP: "JOIN_STUDENT_TO_GROUP",
    RESET_STUDENTS: "RESET_STUDENTS",
    SAVE_ATTENDEANCE : "SAVE_ATTENDEANCE",
    FETCH_ATTENDANCE : "FETCH_ATTENDANCE",
    UPDATE_ATTENDANCE : "UPDATE_ATTENDANCE",
    ADD_EXECUSE : "ADD_EXECUSE",
    FETCH_EXECUSES : "FETCH_EXECUSES",
    RESET_ATTENDANCE_RANGE_DATE : "RESET_ATTENDANCE_RANGE_DATE",
    ADD_BEHAVIOR : "ADD_BEHAVIOR",
    UPDATE_BEHAVIOR : "UPDATE_BEHAVIOR"
  },
  TEACHERS: {
    ADD_TEACHER: "ADD_TEACHER",
    EDIT_TEACHER: "EDIT_TEACHER",
    DELETE_TEACHER: "DELETE_TEACHER",
    FETCH_TEACHERS: "FETCH_TEACHERS",
    FETECH_TEACHER_BY_ID: "FETECH_TEACHER_BY_ID"
  },
  UI: {
    SET_MESSAGE: "SET_MESSAGE",
    SET_ERROR: "SET_ERROR",
    SET_LOADING: "SET_LOADING",
    CLEAR_ERRORS_AND_MESSAGES: "CLEAR_ERRORS_AND_MESSAGES"
  }
};

// Vuex Mutations
const MUTATIONS = {
  AUTH: {
    SET_USER: "SET_USER",
    SET_REGISTRATION_STATE: "SET_REGISTRATION_STATE"
  },
  GROUPS: {
    SET_GROUPS: "SET_GROUPS",
    SET_STUDENT_GROUP: "SET_STUDENT_GROUP"
  },
  SUBJECTS : {
    SET_MARKS : "SET_MARKS",
    SET_SUBJECTS : "SET_SUBJECTS",
  },
  SETTINGS: {
    SET_EMAILS : "SET_EMAILS",
    SET_YEAR_INFO: "SET_YEAR_INFO",
    SET_REGISTRATION_PERIOD: "SET_REGISTRATION_PERIOD",
    SET_QUESTIONS: "SET_QUESTIONS",
    SET_EXAM_MARKS: "SET_EXAM_MARKS",
    SET_MEMORIZATIONS: "SET_MEMORIZATIONS",
    SET_SCHEDUALS : "SET_SCHEDUALS",
    SET_MEMORIZATION: "SET_MEMORIZATION",
    SET_MEETINGS : "SET_MEETINGS",
    SET_REPEATED_EXPENCE : "SET_REPEATED_EXPENCE",
    SET_EXPENCE : "SET_EXPENCE",
    SET_ENTRIES : "SET_ENTRIES"
   },
  STUDNETS: {
    SET_ACTIVITIES : "SET_ACTIVITIES",
    SET_STUDENTS: "SET_STUDENTS",
    SET_STUDENTS_MARKS: "SET_STUDENTS_MARKS",
    SET_STUDENT_ANSWERS: "SET_STUDENT_ANSWERS",
    SET_STUDENTS_AND_MARKS: "SET_STUDENTS_AND_MARKS",
    SET_ATTENDANCE : "SET_ATTENDANCE",
    SET_ATTENDANCE_RANGE_DATE : "SET_ATTENDANCE_RANGE_DATE",
    RESET_ATTENDANCE_RANGE_DATE : "RESET_ATTENDANCE_RANGE_DATE",
    SET_EXECUSES : "SET_EXECUSES",
    SET_BEHAVIORS : "SET_BEHAVIORS"
  },
  TEACHERS: {
    SET_TEACHERS: "SET_TEACHERS",
    SET_TEACHER: "SET_TEACHER"
  },
  UI: {
    SET_LOADING: "SET_LOADING",
    SET_MESSAGE: "SET_MESSAGE",
    SET_ERROR: "SET_ERROR",
    RESET_ERRORS_AND_MESSAGES: "RESET_ERRORS_AND_MESSAGES"
  }
};

// Message Codes
const MESSAGES = {
  AUTH: {},
  DATABASE: {
    MESSAGE_ADDED : "database/message-added",
    ENTRY_DELETED : "database/entry-deleted",
    ENTRY_UPDATED : "database/entry-updated",
    ENTRY_ADDED : "database/entry-added",
    SUBJECT_UPDATED :  "database/subject-updated",
    SUBJECT_SAVED : "database/subject-saved",
    SUBJECT_DELETED : "database/subject-deleted",
    ACTIVITY_UPDATED : "database/activity-updated",
    ACTIVITY_ADDED : "database/activity-added",
    STUDENT_BEHAVIOR_DELETED : "database/behavior-deleted",
    STUDENT_ACTIVITY_DELETED : "database/activity-deleted",
    MARKS_UPDATED : "database/marks-updated",
    MARKS_SAVED : "database/marks-saved",
    EXPANCE_DELETED : "database/expance-added",
    EXECUSE_ADDED : "database/execuse-added",
    STUDENT_FORM_RECORD_DELETED: "database/student-form-record-deleted",
    STUDENT_STATUS_UPDATED: "database/student-status-updated",
    STUDENT_ATTENDANCE_UPDATED: "database/student-attendance-status-updated",
    YEAR_INFO_CREATED: "database/year-info-created",
    YEAR_INFO_UPDATED: "database/year-info-updated",
    SCHEDUAL_ADDED : "database/schedual been saved",
    YEAR_INFO_REGISTRATION_PERIOD_UPDATED:
      "database/year-info-registration-period-updated",
    EXAM_MARKS_UPDATED: "database/exam_marks_updated",
    QUESTION_ADDED: "database/question-added",
    QUESTION_DELETED: "database/question-deleted",
    STUDENT_MARK_UPDATED: "database/student-mark-updated",
    STUDENT_ANSWERS_SUBMITTED: "database/student-answers-submitted",
    GROUP_ADDED: "database/group-added",
    GROUP_UPDATED: "database/group-updated",
    MEETING_UPDATED: "database/meeting-updated",
    GROUP_DELETED: "database/group-deleted",
    STUDENT_GROUP_JOINED: "database/student-group-joined",
    MEMORIZATION_ADDED: "database/memorization-added",
    MEMORIZATION_UPDATED: "database/memorization-updated",
    MEMORIZATION_DELETED: "database/memorization-deleted",
    MEMORIZATION_DETAILS_ADDED: "database/memorization-details-added",
    MEMORIZATION_DETAILS_DELETED: "database/memorization-details-deleted",
    TEACHER_ADDED: "database/teacher-added",
    TEACHER_UPDATED: "database/teacher-updated",
    TEACHER_DELETED: "database/teacher-deleted",
    GROUP_MEMORIZATIONS_ADDED: "database/group-memorizations-added",
    GROUP_MEMORIZATIONS_DELETED: "database/group-memorization-deleted",
    MEETINGS_ADDED : "database/menute-added-successfully",
    MEETINGS_DELETED : "database/menute-deleted-successfully",
    REPEATED_EXPANCE_ADDED : "database/REPEATED-expance-added-successfully",
    REPEATED_EXPANCE_UPDATED : "database/REPEATED-expance-updated-successfully",
    EXPANCE_ADDED : "database/expance-added-successfully",
    EXPANCE_UPDATED : "database/expance-updated-successfully",
    BEHAVIOR_UPDATED : "database/behavior-updated-successfully",
    BEHAVIOR_ADDED : "database/behavior-added-successfully",
  }
};

// Error Codes
const ERRORS = {
  AUTH: {
    USER_NOT_FOUND: "auth/user-not-found",
    YEAR_SEMESTERS_ERROR : "db/error while saving semsters",
    PHONE_NOT_FOUND: "auth/phone-not-found",
    EMAIL_NOT_VERIFIED: "auth/email-not-verified",
    EMAIL_OR_PHONE_INACTIVE: "auth/email-or-phone-inactive",
    EMAIL_ALREADY_IN_USE: "auth/email-already-in-use",
    WRONG_PASSWORD: "auth/wrong-password",
    OTP_NOT_SENT: "auth/otp-not-sent",
    OTP_NOT_VERIFIED: "auth/otp-not-verified"
  },
  DATABASE: {
    ADD_MESSAGE_ERROR : "database/add-message-error",
    ENTRY_DELETE_ERROR  : "database/delete-entry-error",
    ENTRY_UPDATE_RROR : "database/update-entry-error",
    ADD_ENTRY_ERROR : "database/add-entry-error",
    UPDATE_SUBJECT_FAIL : "database/update-subject-error",
    DELETE_SUBJECT_ERROR : "database/delete-subject-error",
    UPDATE_ACTIVITY_FAIL : "database/update-activity-error",
    STUDENT_DELETE_ACTIVITY_ERROR : "database/delete-activity-error",
    ADD_ACTIVITY_ERROR : "database/add-activity-error",
    STUDENT_DELETE_BEHAVIOER_ERROR: "database/delete-behavior-error",
    MARKS_UPDATE_FAIL :  "database/update-marks-error",
    MARKS_SAVING_FAIL : "database/add-marks-error",
    ADD_BEHAVIOR_FAIL : "database/add-behavior-error",
    UPDATE_BEHAVIOR_FAIL : "database/update-behavior-error",
    DELETE_EXPANCE_ERROR : "database/delete-pexpense-error",
    EDIT_PEXPANCE_ERROR  : "database/edit-pexpense-error",
    EDIT_EXPANCE_ERROR  : "database/edit-expense-error",
    ADD_PEXPANCE_ERROR  : "database/add-pexpense-error",
    ADD_EXPANCE_ERROR : "database/add-expense-error",
    SET_MEETINGS_ERROR : "database/add-mintue-error",
    ADD_SUBJECT_FAIL : "database/register-subject-error",
    ADD_EXECUSE_FAIL : "database/add-execuse-fail",
    FETCH_SUBJECTS_FAIL : "database/fetch-subjects-error",
    USER_INACTIVE: "databse/user-inactive",
    USER_NOT_FOUND: "database/user-not-found",
    STUDENT_FORM_RECORD_NOT_DELETED: "database/student-form-record-not-deleted",
    STUDENT_NOT_FOUND: "database/student-not-found",
    ATTENDANCE_RECORD_NOT_FOUND: "database/atteendance-record-not-found",
    EDIT_STUDENT_STATUS_ERROR: "database/edit-student-status-error",
    UPDATE_ATTENDANCE_STATUS_ERROR: "database/update-attendance-status-error",
    YEAR_INFO_ERROR: "database/year-info-error",
    YEAR_INFO_NOT_FOUND: "database/year-info-not-found",
    FETCH_REGISTRATION_PERIOD_ERROR: "database/fetch-registration-period-error",
    SET_EXAM_MARKS_ERROR: "database/set_exam_marks_error",
    SET_QUESTION_ERROR: "database/set_question_error",
    DELETE_QUESTION_ERROR: "database/delete-question-error",
    FETCH_EXAM_TOTAL_MARKS_ERROR: "database/fetch-exam-total-marks-error",
    EDIT_STUDENT_MARK_ERROR: "database/edit-student-mark-error",
    STUDENT_ANSWERS_SUBMIT_ERROR: "database/student-answers-submit-error",
    STUDENT_ALREADY_TAKEN_EXAM: "student-already-taken-exam",
    ADD_SCHEDUAL_ERROR:"Error while saving",
    FETCH_STUDENT_ANSWERS_BY_ID_ERROR:
      "database/fetch-student-answers-by-id-error",
    ADD_GROUP_ERROR: "database/add-group-error",
    EDIT_GROUP_ERROR: "database/edit-group-error",
    EDIT_MEETING_ERROR: "database/edit-meeting-error",
    DELETE_GROUP_ERROR: "database/delete-group-error",
    DELETE_MEETING_ERROR: "database/delete-meeting-error",
    JOIN_STUDENT_TO_GROUP_ERROR: "database/join-student-to-group-error",
    ADD_MEMORIZATION_ERROR: "database/add-memorization-error",
    EDIT_MEMORIZATION_ERROR: "database/edit-memorization-error",
    DELETE_MEMORIZATION_ERROR: "database/delete-memorization-error",
    ADD_MEMORIZATION_DETAILS_ERROR: "database/add-memorization-details-error",
    DELETE_MEMORIZATION_DETAILS_ERROR:
      "database/delete-memorization-details-error",
    ADD_TEACHER_ERROR: "database/add-teacher-error",
    EDIT_TEACHER_ERROR: "database/edit-teacher-error",
    DELETE_TEACHER_ERROR: "database/delete-teacher-error",
    TEACHER_ALREADY_EXISTED: "database/teacher-already-existed",
    ADD_MEMORIZATION_TO_GROUP_ERROR: "database/add-memorization-to-group-error",
    DELETE_MEMORIZATION_FROM_GROUP_ERROR:
      "database/delete-memorization-from-group-error"
  },
  STORAGE: {
    OBJECT_NOT_FOUND: "storage/object-not-found",
    UNAUTHORIZED: "storage/unauthorized",
    CANCELED: "storage/canceled",
    UNKNOWN: "storage/unknown"
  }
};

//  Admin Email
const ADMIN_EMAIL = "altomohcompany1@gmail.com";

// Export Constants
export {
  COLLECTIONS,
  ADMIN_EMAIL,
  STUDENT_GRADE,
  STUDENT_STATUS,
  CHAPTERS,
  SURAHS,
  VILLAGES,
  KNOWN_BY,
  EXAM_TYPE,
  GETTERS,
  ACTIONS,
  MUTATIONS,
  ERRORS,
  MESSAGES
};
