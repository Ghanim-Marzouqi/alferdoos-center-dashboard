<template>
  <q-dialog v-model="isOpen">
    <q-card>
      <q-card-section>
        <div class="q-ma-2">
          مجموع {{ examTitle }}:
          <span class="text-weight-bold">{{ getTotalMarks }}</span>
        </div>
        <div class="row q-my-sm">
          <q-form @submit.prevent="addExamMarksOption">
            <q-list style="width: 100%">
              <q-item>
                <q-item-section class="justify-start" avatar>
                  <q-btn dense round size="sm" color="primary" type="submit">
                    <q-icon name="o_add" />
                  </q-btn>
                </q-item-section>
                <q-item-section class="q-mt-lg">
                  <q-input
                    style="width: 200px"
                    v-model="option.text"
                    label="تفاصيل"
                    dense
                    filled
                    :rules="[val => val && val.length > 0 || 'ادخل تفاصيل الدرجة']"
                  ></q-input>
                </q-item-section>
                <q-item-section class="q-mt-lg" side>
                  <q-input
                    style="width: 100px"
                    type="number"
                    v-model="option.marks"
                    label="الدرجة"
                    dense
                    filled
                    :rules="[val => val && val > 0 || 'ادخل الدرجة']"
                  ></q-input>
                </q-item-section>
              </q-item>
              <q-item v-for="(option, i) in marksOptions" :key="i">
                <q-item-section avatar>
                  <q-btn dense round size="sm" color="red" @click="removeExamMarksOption(i)">
                    <q-icon name="o_remove" />
                  </q-btn>
                </q-item-section>
                <q-item-section>{{ option.text }}</q-item-section>
                <q-item-section class="text-center" style="width: 100%">
                  {{
                  option.marks
                  }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-form>
        </div>
      </q-card-section>
      <q-card-section></q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeExamMarksDialog">إلغاء</q-btn>
        <q-btn
          dense
          flat
          color="primary"
          :loading="GET_LOADING"
          @click="setExamMarks"
          :disable="disableSubmitButton"
        >حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, EXAM_TYPE } from "../config/constants";

export default {
  name: "ExamMarksDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    subjectTitle: {
      type: String,
      required: true
    },
    marksOptions: {
      type: Array
    }
  },
  data() {
    return {
      option: {
        text: "",
        marks: ""
      },
      options: []
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    }),
    getTotalMarks() {
      let count = 0;

      this.options.forEach(option => {
        count = count + option.marks;
      });

      return count;
    },
    disableSubmitButton() {
      return this.options.length === 0 ? true : false;
    }
  },
  methods: {
    ...mapActions({
      SET_EXAM_TOTAL_MARKS: ACTIONS.SETTINGS.SET_EXAM_TOTAL_MARKS
    }),
    addExamMarksOption() {
      this.options.push({
        text: this.option.text,
        marks: Number.parseInt(this.option.marks)
      });

      this.option = {
        text: "",
        marks: ""
      };
    },
    removeExamMarksOption(index) {
      this.options.splice(index, 1);
    },
    setExamMarks() {
      switch (this.examType) {
        case EXAM_TYPE.WRITTEN:
          this.SET_EXAM_TOTAL_MARKS({
            examType: EXAM_TYPE.WRITTEN,
            marks: this.getTotalMarks,
            marksDistribution: this.options
          });
          break;
        case EXAM_TYPE.RECITE:
          this.SET_EXAM_TOTAL_MARKS({
            examType: EXAM_TYPE.RECITE,
            marks: this.getTotalMarks,
            marksDistribution: this.options
          });
          break;
        case EXAM_TYPE.READING:
          this.SET_EXAM_TOTAL_MARKS({
            examType: EXAM_TYPE.READING,
            marks: this.getTotalMarks,
            marksDistribution: this.options
          });
          break;
        case EXAM_TYPE.COMMON_KNOWLEDGE:
          this.SET_EXAM_TOTAL_MARKS({
            examType: EXAM_TYPE.COMMON_KNOWLEDGE,
            marks: this.getTotalMarks,
            marksDistribution: this.options
          });
          break;
        case EXAM_TYPE.PERSONAL:
          this.SET_EXAM_TOTAL_MARKS({
            examType: EXAM_TYPE.PERSONAL,
            marks: this.getTotalMarks,
            marksDistribution: this.options
          });
          break;
      }
    },
    closeExamMarksDialog() {
      this.option = {
        text: "",
        marks: ""
      };
      this.options = [];
      this.$emit("closeExamMarksDialog", false);
    }
  }
};
</script>