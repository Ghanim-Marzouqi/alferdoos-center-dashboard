<template>
  <div>
    <q-dialog
      v-model="isDialogOpen"
      maximized
      persistent
      transition-show="slide-up"
      transition-hide="slide-down"
      @before-show="prepareQuestions"
      @hide="resetValues"
    >
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" @click="closeDialog">
            <q-tooltip content-class="bg-white text-primary">إغلاق</q-tooltip>
          </q-btn>
        </q-bar>
        <q-card-section class="text-weight-bold text-h6">
          {{ title }}
          <span
            class="text-red text-weight-bold"
            v-if="isStudentTakenExam"
          >(لا يمكن للطالب تقديم الإختبار مرة أخرى)</span>
        </q-card-section>
        <q-card-section>
          <q-card v-for="(question, i) in questions" :key="i" class="bg-white text-black q-ma-lg">
            <q-card-section>
              <div class="row">
                <span class="text-weight-bold">{{ question.text }}</span>
                <q-space />
                <span>درجة السؤال: {{ question.marks }}</span>
              </div>
              <div class="column">
                <q-radio
                  v-for="(option, i) in question.options"
                  :key="i"
                  v-model="question.answer"
                  :val="option.text"
                  :label="option.text"
                  :disable="isStudentTakenExam"
                  @input="(value, e) => storeAnswers(value, question.id, option.isCorrect.value, question.marks)"
                />
              </div>
            </q-card-section>
          </q-card>
          <q-btn
            class="q-ml-lg text-weight-bold"
            color="blue text-white"
            :disable="isStudentTakenExam"
            @click="isSubmitAnswersDialogOpen = true"
          >تسليم الإختبار</q-btn>
          <q-btn class="q-ml-md text-weight-bold" color="red text-white" @click="closeDialog">إغلاق</q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Submit Answers Dialog -->
    <SubmitAnswersDialog
      :isAlertDialogOpen="isSubmitAnswersDialogOpen"
      alertTitle="تسليم الإجابات وإغلاق الإختبار؟"
      @alertAction="submitStudentAnswers"
      @closeAlertDialog="closeSubmitAnswersDialog"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, EXAM_TYPE } from "../config/constants";

export default {
  name: "TakeExamDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    studentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      questions: [],
      answers: [],
      isSubmitAnswersDialogOpen: false
    };
  },
  created() {
    this.FETCH_QUESTIONS();
    this.FETCH_STUDENTS_MARKS();
  },
  computed: {
    ...mapGetters({
      GET_QUESTIONS: GETTERS.SETTINGS.GET_QUESTIONS,
      GET_STUDENTS_MARKS: GETTERS.STUDNETS.GET_STUDENTS_MARKS,
      GET_STUDENT_ANSWERS: GETTERS.STUDNETS.GET_STUDENT_ANSWERS
    }),
    isStudentTakenExam() {
      let studentMarks = this.GET_STUDENTS_MARKS.find(
        mark => mark.studentId === this.studentId
      );

      if (studentMarks && typeof studentMarks.commonKnowledge !== "undefined") {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions({
      FETCH_QUESTIONS: ACTIONS.SETTINGS.FETCH_QUESTIONS,
      FETCH_STUDENTS_MARKS: ACTIONS.STUDNETS.FETCH_STUDENTS_MARKS,
      SET_STUDENT_ANSWERS: ACTIONS.STUDNETS.SET_STUDENT_ANSWERS,
      FETCH_STUDENT_ANSWERS_BY_ID: ACTIONS.STUDNETS.FETCH_STUDENT_ANSWERS_BY_ID
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    async prepareQuestions() {
      if (this.isStudentTakenExam) {
        await this.FETCH_STUDENT_ANSWERS_BY_ID({ studentId: this.studentId });
        if (
          this.GET_STUDENT_ANSWERS &&
          typeof this.GET_STUDENT_ANSWERS.answers !== "undefined"
        ) {
          this.GET_QUESTIONS.forEach(question => {
            let studentAnswer = this.GET_STUDENT_ANSWERS.answers.find(
              a => a.questionId === question.id
            );
            if (studentAnswer) {
              this.questions.push({
                id: question.id,
                createdAt: question.createdAt,
                marks: question.marks,
                options: question.options,
                text: question.text,
                answer: studentAnswer.answer
              });
            } else {
              this.questions.push({
                id: question.id,
                createdAt: question.createdAt,
                marks: question.marks,
                options: question.options,
                text: question.text,
                answer: ""
              });
            }
          });
        }
      } else {
        let shuffledArr = this.shuffle(this.GET_QUESTIONS);

        if (shuffledArr.length >= 10) {
          for (let i = 0; i < 10; i++) {
            let item = shuffledArr[i];
            this.questions.push({
              id: item.id,
              createdAt: item.createdAt,
              marks: item.marks,
              options: item.options,
              text: item.text,
              answer: ""
            });
          }
        } else {
          shuffledArr.forEach(item => {
            this.questions.push({
              id: item.id,
              createdAt: item.createdAt,
              marks: item.marks,
              options: item.options,
              text: item.text,
              answer: ""
            });
          });
        }
      }
    },
    shuffle(array) {
      let tmp,
        current,
        top = array.length;
      if (top)
        while (--top) {
          current = Math.floor(Math.random() * (top + 1));
          tmp = array[current];
          array[current] = array[top];
          array[top] = tmp;
        }
      return array;
    },
    storeAnswers(answer, questionId, isCorrect, mark) {
      let found = this.answers.find(a => a.questionId === questionId);

      if (!found) {
        this.answers.push({
          questionId,
          answer,
          isCorrect,
          marks: isCorrect ? Number.parseInt(mark) : 0
        });
      } else {
        let answerIdx = this.answers.findIndex(
          a => a.questionId === questionId
        );
        this.answers.splice(answerIdx, 1);
        this.answers.push({
          questionId,
          answer,
          isCorrect,
          marks: isCorrect ? Number.parseInt(mark) : 0
        });
      }
    },
    submitStudentAnswers() {
      let totalMarks = 0;
      this.answers.forEach(answer => {
        totalMarks = totalMarks + answer.marks;
      });
      this.SET_STUDENT_ANSWERS({
        studentId: this.studentId,
        totalMarks: totalMarks,
        answers: this.answers
      });
      this.closeSubmitAnswersDialog(false);
    },
    closeSubmitAnswersDialog(value) {
      this.isSubmitAnswersDialogOpen = value;
      this.closeDialog();
    },
    resetValues() {
      this.questions = [];
      this.answers = [];
    }
  },
  components: {
    SubmitAnswersDialog: () => import("components/AlertDialog.vue")
  }
};
</script>