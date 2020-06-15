<template>
  <q-page padding>
    <p class="text-h6">إعداد الإختبارات</p>

    <!-- Exam Marks Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">نوع الإختبار</th>
              <th class="text-center">مجموع الدرجات</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">الإملاء</td>
              <td class="text-center">{{ getExam("written").marks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onExamDialogOpened('درجة الإملاء', 'written')">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">التسميع</td>
              <td class="text-center">{{ getExam("recite").marks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onExamDialogOpened('درجة التسميع', 'recite')">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">التلاوة</td>
              <td class="text-center">{{ getExam("reading").marks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onExamDialogOpened('درجة التلاوة', 'reading')">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">الثقافة العامة</td>
              <td class="text-center">{{ getExam("commonKnowledge").marks }} درجة</td>
              <td class="text-right">
                <q-btn
                  dense
                  flat
                  @click="
                    onExamDialogOpened('درجة الثقافة العامة', 'commonKnowledge')
                  "
                >
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">المهارات الشخصية</td>
              <td class="text-center">{{ getExam("personal").marks }} درجة</td>
              <td class="text-right">
                <q-btn
                  dense
                  flat
                  @click="
                    onExamDialogOpened('درجة المهارات الشخصية', 'personal')
                  "
                >
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-bold">المجموع الكلي للدرجات</td>
              <td class="text-center text-weight-bold">{{ getExamTotalMarks }} درجة</td>
              <td class="text-right"></td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Written Exam Questions Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">أسئلة الثقافة العامة</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="isAddQuestionDialogOpen = true"
        >إضافة سؤال جديد</q-btn>
      </div>
      <div class="col-12">
        <q-table :columns="columns" :data="GET_QUESTIONS" row-key="text">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="
                    props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                />
              </q-td>
              <q-td auto-width>{{ props.row.text }}</q-td>
              <q-td auto-width class="text-center">{{ props.row.marks }}</q-td>
              <q-td auto-width class="text-right">
                <q-btn dense flat color="red" @click="onDeleteQuestion(props.row)">
                  <q-icon name="o_delete"></q-icon>
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <ol>
                    <li v-for="(option, i) in props.row.options" :key="i">
                      <span
                        :style="
                          option.isCorrect.value ? 'color: green' : 'color: red'
                        "
                      >{{ option.text }}</span>
                    </li>
                  </ol>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Exam Marks Dialog -->
    <ExamMarksDialog
      :isExamDialogOpen="isExamDialogOpen"
      :examTitle="examTitle"
      :examType="examType"
      :examOptions="[...examOptions]"
      @closeExamMarksDialog="closeExamMarksDialog"
    />

    <!-- Add Question Dialog -->
    <AddQuestionDialog
      :isAddQuestionDialogOpen="isAddQuestionDialogOpen"
      @closeAddQuestionDialog="closeAddQuestionDialog"
    />

    <!-- Delete Question Dialog -->
    <DeleteQuestionDialog
      :isAlertDialogOpen="isDeleteQuestionDialogOpen"
      alertTitle="هل أنت متأكد من حذف السؤال؟"
      @alertAction="deleteQuestion"
      @closeAlertDialog="closeDeleteQuestionDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ACTIONS,
  EXAM_TYPE,
  MESSAGES,
  ERRORS
} from "../../../config/constants";

export default {
  name: "PagePrepareExams",
  data() {
    return {
      isExamDialogOpen: false,
      isAddQuestionDialogOpen: false,
      isDeleteQuestionDialogOpen: false,
      examMarks: "",
      examTitle: "",
      examType: "",
      examOptions: [],
      question: {
        text: "",
        marks: "",
        options: []
      },
      option: {
        text: "",
        isCorrect: {
          label: "لا",
          value: false
        }
      },
      questionOptions: [
        {
          label: "لا",
          value: false
        },
        {
          label: "نعم",
          value: true
        }
      ],
      columns: [
        {
          name: "question",
          required: true,
          label: "السؤال",
          field: row => row.text,
          align: "left"
        },
        {
          name: "marks",
          required: true,
          label: "الدرجة",
          field: row => row.marks,
          align: "center"
        },
        {
          name: "delete",
          required: true,
          label: "حذف",
          field: "delete",
          align: "right"
        }
      ]
    };
  },
  created() {
    this.FETCH_EXAM_TOTAL_MARKS();
    this.FETCH_QUESTIONS();
  },
  computed: {
    ...mapGetters({
      GET_EXAM_MARKS: GETTERS.SETTINGS.GET_EXAM_MARKS,
      GET_QUESTIONS: GETTERS.SETTINGS.GET_QUESTIONS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    }),
    getExamTotalMarks() {
      let total = 0;

      this.GET_EXAM_MARKS.forEach(exam => {
        total = total + exam.marks;
      });

      return total;
    }
  },
  methods: {
    ...mapActions({
      FETCH_EXAM_TOTAL_MARKS: ACTIONS.SETTINGS.FETCH_EXAM_TOTAL_MARKS,
      FETCH_QUESTIONS: ACTIONS.SETTINGS.FETCH_QUESTIONS,
      SET_EXAM_TOTAL_MARKS: ACTIONS.SETTINGS.SET_EXAM_TOTAL_MARKS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
      SET_QUESTION: ACTIONS.SETTINGS.SET_QUESTION,
      DELETE_QUESTION: ACTIONS.SETTINGS.DELETE_QUESTION
    }),
    getExam(examType) {
      let exam = this.GET_EXAM_MARKS.find(exam => exam.id === examType);
      if (exam) return exam;
      else return { marks: 0 };
    },
    closeAddQuestionDialog() {
      this.isAddQuestionDialogOpen = false;
    },
    addQuestionOption() {
      this.question.options.push({
        text: this.option.text,
        isCorrect: this.option.isCorrect
      });

      // Reset Option
      this.option = {
        text: "",
        isCorrect: {
          label: "لا",
          value: false
        }
      };
    },
    removeQuestionOption(index) {
      this.question.options.splice(index, 1);
    },
    addQuestion() {
      this.SET_QUESTION({
        text: this.question.text,
        marks: Number.parseInt(this.question.marks),
        options: this.question.options
      });
    },
    onDeleteQuestion(question) {
      this.question = question;
      this.isDeleteQuestionDialogOpen = true;
    },
    closeDeleteQuestionDialog(value) {
      this.question = {
        text: "",
        marks: "",
        options: []
      };

      this.isDeleteQuestionDialogOpen = value;
    },
    deleteQuestion() {
      let questionId = this.question.id;
      this.DELETE_QUESTION(questionId);
    },
    onExamDialogOpened(examTitle, examType) {
      this.examTitle = examTitle;
      this.examType = examType;
      let exam = this.GET_EXAM_MARKS.find(exam => exam.id === examType);
      if (exam && exam.marksDistribution && exam.marksDistribution.length > 0) {
        this.examOptions = exam.marksDistribution;
      } else {
        this.examOptions = [];
      }
      this.isExamDialogOpen = true;
    },
    closeExamMarksDialog(value) {
      this.examTitle = "";
      this.examType = "";
      this.examOptions = [];
      this.isExamDialogOpen = value;
    }
  },
  watch: {
    GET_MESSAGES: function(newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.EXAM_MARKS_UPDATED) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Get Updated Exam Marks
          this.FETCH_EXAM_TOTAL_MARKS();

          // Dismiss Dialog
          this.isExamDialogOpen = false;

          // Display Success Message
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث درجات اللإختبار بنجاح"
          });
        }

        if (messageCode === MESSAGES.DATABASE.QUESTION_ADDED) {
          // Fetch Questions
          this.FETCH_QUESTIONS();

          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Reset Question
          this.question = {
            text: "",
            marks: "",
            options: []
          };

          // Dismiss Add Question Dialog
          this.isAddQuestionDialogOpen = false;

          // Display Success Message
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تمت إضافة سؤال جديد بنجاح"
          });
        }

        if (messageCode === MESSAGES.DATABASE.QUESTION_DELETED) {
          // Fetch Questions
          this.FETCH_QUESTIONS();

          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Reset Question
          this.question = {
            text: "",
            marks: "",
            options: []
          };

          // Dismiss Delete Question Dialog
          this.isDeleteQuestionDialogOpen = false;

          // Display Success Message
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف السؤال بنجاح"
          });
        }
      }
    },
    GET_ERRORS: function(newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.SET_EXAM_MARKS_ERROR) {
          // Clear Errors
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Display Error Dialog
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث درجات الإختبار"
          });
        }

        if (errorCode === ERRORS.DATABASE.SET_QUESTION_ERROR) {
          // Clear Errors
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Display Error Dialog
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة سؤال جديد الإختبار"
          });
        }

        if (errorCode === ERRORS.DATABASE.DELETE_QUESTION_ERROR) {
          // Clear Errors
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Display Error Dialog
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف السؤال"
          });
        }
      }
    }
  },
  components: {
    ExamMarksDialog: () => import("components/ExamMarksDialog.vue"),
    AddQuestionDialog: () => import("components/AddQuestionDialog.vue"),
    DeleteQuestionDialog: () => import("components/AlertDialog.vue")
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  min-width: 290px;
}
</style>
