<template>
  <q-dialog
    v-model="isDialogOpen"
    maximized
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" @click="closeDialog">
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
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
                v-model="answer"
                :key="i"
                :val="option.text"
                :label="option.text"
              />
            </div>
          </q-card-section>
        </q-card>
        <q-btn class="q-ml-lg text-weight-bold" color="white text-black">تسليم الإختبار</q-btn>
        <q-btn class="q-ml-md text-weight-bold" color="red text-white" @click="closeDialog">إغلاق</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
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
      questions: [
        {
          text: "كم عدد سور القرآن الكريم؟",
          marks: 1,
          options: [
            {
              text: "104",
              isCorrect: {}
            },
            {
              text: "114",
              isCorrect: {}
            },
            {
              text: "124",
              isCorrect: {}
            },
            {
              text: "134",
              isCorrect: {}
            }
          ]
        },
        {
          text: "من هو الصحابي الجليل الملقب بأبي هريرة؟",
          marks: 1,
          options: [
            {
              text: "عمر بن العاص",
              isCorrect: {}
            },
            {
              text: "عبد الرحمن بن عوف",
              isCorrect: {}
            },
            {
              text: "عبد الرحمن بن صخر",
              isCorrect: {}
            },
            {
              text: "علي بن ابي طالب",
              isCorrect: {}
            }
          ]
        },
        {
          text: "من هي أم النبي محمد عليه الصلاة والسلام؟",
          marks: 1,
          options: [
            {
              text: "آمنة بنت وهب",
              isCorrect: {}
            },
            {
              text: "حليمة السعدية",
              isCorrect: {}
            },
            {
              text: "عائشة بنت ابي بكر",
              isCorrect: {}
            },
            {
              text: "ام كلثوم",
              isCorrect: {}
            }
          ]
        },
        {
          text: "كم عدد سور القرآن الكريم؟",
          marks: 1,
          options: [
            {
              text: "104",
              isCorrect: {}
            },
            {
              text: "114",
              isCorrect: {}
            },
            {
              text: "124",
              isCorrect: {}
            },
            {
              text: "134",
              isCorrect: {}
            }
          ]
        },
        {
          text: "من هو الصحابي الجليل الملقب بأبي هريرة؟",
          marks: 1,
          options: [
            {
              text: "عمر بن العاص",
              isCorrect: {}
            },
            {
              text: "عبد الرحمن بن عوف",
              isCorrect: {}
            },
            {
              text: "عبد الرحمن بن صخر",
              isCorrect: {}
            },
            {
              text: "علي بن ابي طالب",
              isCorrect: {}
            }
          ]
        },
        {
          text: "من هي أم النبي محمد عليه الصلاة والسلام؟",
          marks: 1,
          options: [
            {
              text: "آمنة بنت وهب",
              isCorrect: {}
            },
            {
              text: "حليمة السعدية",
              isCorrect: {}
            },
            {
              text: "عائشة بنت ابي بكر",
              isCorrect: {}
            },
            {
              text: "ام كلثوم",
              isCorrect: {}
            }
          ]
        }
      ],
      answer: ""
    };
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", false);
    }
  }
};
</script>