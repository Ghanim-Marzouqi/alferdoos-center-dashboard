<template>
  <q-page padding>
    <div class="fit row inline wrap items-center">
      <q-btn flat color="primary" to="/admin/exams-dashboard">
        <q-icon name="keyboard_arrow_right" size="md"></q-icon>
      </q-btn>
      <p class="text-h6 text-weight-bold q-ma-sm">تقديم الإختبار</p>
    </div>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلاب المؤهلين لأداء الإختبار"
        :data="GET_STUDENTS_AND_MARKS"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="GET_LOADING"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="بحث">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="createdAt" :props="props">{{ props.row.createdAt | formatDate }}</q-td>
            <q-td key="file" :props="props">
              <q-btn
                dense
                flat
                color="blue"
                icon="o_visibility"
                @click.stop="showStudentDialog(props.row)"
              />
            </q-td>
            <q-td key="write" :props="props">
              <q-btn
                dense
                flat
                color="teal"
                icon="o_edit"
                @click.stop="showMarkDialog('درجة إختبار الإملاء', 'written', props.row.id)"
              >
                <q-badge
                  v-if="props.row.written && props.row.written.length > 0"
                  color="green"
                  floating
                  transparent
                >✔</q-badge>
              </q-btn>
            </q-td>
            <q-td key="recite" :props="props">
              <q-btn
                dense
                flat
                color="brown"
                icon="o_hearing"
                @click.stop="showMarkDialog('درجة إختبار التسميع', 'recite', props.row.id)"
              >
                <q-badge
                  v-if="props.row.recite && props.row.recite.length > 0"
                  color="green"
                  floating
                  transparent
                >✔</q-badge>
              </q-btn>
            </q-td>
            <q-td key="read" :props="props">
              <q-btn
                dense
                flat
                color="purple"
                icon="o_record_voice_over"
                @click.stop="showMarkDialog('درجة إختبار التلاوة', 'reading', props.row.id)"
              >
                <q-badge
                  v-if="props.row.reading && props.row.reading.length > 0"
                  color="green"
                  floating
                  transparent
                >✔</q-badge>
              </q-btn>
            </q-td>
            <q-td key="commoknowledge" :props="props">
              <q-btn
                dense
                flat
                color="indigo"
                icon="o_local_library"
                @click.stop="showTakeExamDialog('إختبار الثقافة العامة', 'commonKnowledge', props.row.id)"
              >
                <q-badge
                  v-if="typeof props.row.commonKnowledge !== 'undefined'"
                  color="green"
                  floating
                  transparent
                >✔</q-badge>
              </q-btn>
            </q-td>
            <q-td key="personal" :props="props">
              <q-btn
                dense
                flat
                color="pink"
                icon="o_sentiment_satisfied_alt"
                @click.stop="showMarkDialog('درجة اللجنة الرئيسية', 'personal', props.row.id)"
              >
                <q-badge
                  v-if="props.row.personal && props.row.personal.length > 0"
                  color="green"
                  floating
                  transparent
                >✔</q-badge>
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- Student Registration Info Dialog -->
    <StudentRegistrationInfoDialog
      :isStudentDialogOpen="isStudentDialogOpen"
      :student="registeredStudent"
      @closeStudentRegistrationInfoDialog="isStudentDialogOpen = false"
    />

    <!-- Add Student Mark Dialog -->
    <AddStudentMarkDialog
      :isDialogOpen="isAddStudentMarkDialogOpen"
      :title="examTitle"
      :exam="examDetails"
      :studentId="studentId"
      :marks="studentMarks"
      @closeDialog="closeAddStudentMarkDialog"
    />

    <!-- Take Exam Dialog -->
    <TakeExamDialog
      :isDialogOpen="isTakeExamDialogOpen"
      :title="examTitle"
      :studentId="studentId"
      @closeDialog="closeTakeExamDialog"
    />
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ACTIONS,
  STUDENT_STATUS,
  EXAM_TYPE,
  MESSAGES,
  ERRORS,
} from "../../../config/constants";

export default {
  name: "PageStudentExams",
  data() {
    return {
      filter: "",
      examType: "",
      examTitle: "",
      examDetails: {},
      isAddStudentMarkDialogOpen: false,
      isStudentDialogOpen: false,
      isTakeExamDialogOpen: false,
      isErrorDialogOpen: false,
      students: [],
      registeredStudent: {},
      studentId: "",
      studentMarks: {},
      errorTitle: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم الطالب",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
        },
        {
          name: "createdAt",
          required: true,
          label: "وقت وتاريخ تقديم الطلب",
          align: "center",
          field: (row) => row.createdAt,
          format: (val) => `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`,
        },
        {
          name: "file",
          align: "center",
          label: "الملف الشخصي",
          field: "file",
        },
        {
          name: "write",
          align: "center",
          label: "الإملاء",
          field: "write",
        },
        {
          name: "recite",
          align: "center",
          label: "التسميع",
          field: "recite",
        },
        {
          name: "read",
          align: "center",
          label: "التلاوة",
          field: "read",
        },
        {
          name: "commoknowledge",
          align: "center",
          label: "الثقافة العامة",
          field: "commoknowledge",
        },
        {
          name: "personal",
          align: "center",
          label: "اللجنة الرئيسية",
          field: "personal",
        },
      ],
    };
  },
  created() {
    this.getUpdatedStudentRecords();
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_STUDENTS_MARKS: GETTERS.STUDNETS.GET_STUDENTS_MARKS,
      GET_EXAM_MARKS: GETTERS.SETTINGS.GET_EXAM_MARKS,
      GET_STUDENTS_AND_MARKS: GETTERS.STUDNETS.GET_STUDENTS_AND_MARKS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      DELETE_STUDENT: ACTIONS.STUDNETS.DELETE_STUDENT,
      EDIT_STUDENT_STATUS: ACTIONS.STUDNETS.EDIT_STUDENT_STATUS,
      FETCH_STUDENTS_MARKS: ACTIONS.STUDNETS.FETCH_STUDENTS_MARKS,
      SET_STUDENTS_AND_MARKS: ACTIONS.STUDNETS.SET_STUDENTS_AND_MARKS,
      FETCH_EXAM_TOTAL_MARKS: ACTIONS.SETTINGS.FETCH_EXAM_TOTAL_MARKS,
      SET_ERROR: ACTIONS.UI.SET_ERROR,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    showStudentDialog(student) {
      this.registeredStudent = student;
      this.isStudentDialogOpen = true;
    },
    showMarkDialog(examTitle, examType, studentId) {
      this.examTitle = examTitle;
      this.examDetails = this.GET_EXAM_MARKS.find(
        (exam) => exam.id === examType
      );
      this.studentId = studentId;
      let studentMarks = this.GET_STUDENTS_MARKS.find(
        (marks) => marks.studentId === studentId
      );
      if (studentMarks) this.studentMarks = studentMarks;
      else this.studentMarks = {};
      this.isAddStudentMarkDialogOpen = true;
    },
    showTakeExamDialog(examTitle, examType, studentId) {
      this.examTitle = examTitle;
      this.studentId = studentId;
      this.isTakeExamDialogOpen = true;
    },
    closeAddStudentMarkDialog(value) {
      this.examTitle = "";
      this.examDetails = {};
      this.registeredStudent = {};
      this.studentId = "";
      this.studentMarks = {};
      this.isAddStudentMarkDialogOpen = value;
    },
    closeTakeExamDialog(value) {
      this.examTitle = "";
      this.studentId = "";
      this.isTakeExamDialogOpen = value;
    },
    async getUpdatedStudentRecords() {
      await this.FETCH_STUDENTS({ status: "" });
      await this.FETCH_EXAM_TOTAL_MARKS();
      await this.FETCH_STUDENTS_MARKS();

      let students = [];

      for (let i = 0; i < this.GET_STUDENTS.length; i++) {
        let student = this.GET_STUDENTS[i];

        if (student.status !== STUDENT_STATUS.REVIEW) {
          let studentMark = this.GET_STUDENTS_MARKS.find(
            (mark) => mark.studentId === student.id
          );
          students.push({
            ...student,
            ...studentMark,
          });
        }
      }

      this.SET_STUDENTS_AND_MARKS({ updatedStudents: students });
    },
  },
  filters: {
    formatDate(val) {
      return `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`;
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.STUDENT_MARK_UPDATED) {
          this.isAddStudentMarkDialogOpen = false;
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث درجات الطالب بنجاح",
          });

          this.getUpdatedStudentRecords();
        }

        if (messageCode === MESSAGES.DATABASE.STUDENT_ANSWERS_SUBMITTED) {
          this.isTakeExamDialogOpen = false;
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تسليم إجابات إختبار الثقافة العامة بنجاح",
          });

          this.getUpdatedStudentRecords();
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.EDIT_STUDENT_MARK_ERROR) {
          this.isAddStudentMarkDialogOpen = false;
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء تحديث درجات الطالب",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.STUDENT_ANSWERS_SUBMIT_ERROR) {
          this.isTakeExamDialogOpen = false;
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء تسليم إجابات الثقافة العامة",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.STUDENT_ALREADY_TAKEN_EXAM) {
          this.isTakeExamDialogOpen = false;
          this.$q.dialog({
            title: "فشلت العملية",
            message: "لا يمكن للطالب تقديم الإختبار مرة أخرى",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    },
  },
  components: {
    StudentRegistrationInfoDialog: () =>
      import("components/StudentRegistrationInfoDialog.vue"),
    AddStudentMarkDialog: () => import("components/AddStudentMarkDialog.vue"),
    TakeExamDialog: () => import("components/TakeExamDialog.vue"),
  },
};
</script>
