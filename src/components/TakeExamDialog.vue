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
        <q-card-section class="text-weight-bold text-h6">{{ title }}</q-card-section>
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
                  @input="(value, e) => storeAnswers(value, question.id, option.isCorrect.value, question.marks)"
                />
              </div>
            </q-card-section>
          </q-card>
          <q-btn
            class="q-ml-lg text-weight-bold"
            color="blue text-white"
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
import { GETTERS, ACTIONS } from "../config/constants";

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
  },
  computed: {
    ...mapGetters({
      GET_QUESTIONS: GETTERS.SETTINGS.GET_QUESTIONS
    })
  },
  methods: {
    ...mapActions({
      FETCH_QUESTIONS: ACTIONS.SETTINGS.FETCH_QUESTIONS,
      SET_STUDENT_ANSWERS: ACTIONS.STUDNETS.SET_STUDENT_ANSWERS
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    prepareQuestions() {
      let shuffledArr = this.shuffle(this.GET_QUESTIONS);
      this.questions = shuffledArr.map(item => ({
        id: item.id,
        createdAt: item.createdAt,
        marks: item.marks,
        options: item.options,
        text: item.text,
        answer: ""
      }));
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