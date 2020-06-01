<template>
  <q-page padding>
    <p class="text-h6">إعداد الإختبارات</p>

    <!-- Written Exam Marks Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">مجموع درجات الإختبار التحريري</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">{{ getWrittenExamMarks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="isWrittenExamDialogOpen = true">
                  <q-icon name="o_edit" color="primary" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Recite Exam Marks Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">مجموع درجات التسميع</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">{{ getReciteExamMarks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="isReciteExamDialogOpen = true">
                  <q-icon name="o_edit" color="primary" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Written Exam Table -->
    <div class="row q-pa-md">
      <q-btn
        class="q-mb-md"
        color="primary"
        @click="isAddQuestionDialogOpen = true"
        >إضافة سؤال جديد</q-btn
      >
      <div class="col-12">
        <q-table
          title="اسئلة الإختبار التحريري"
          :columns="columns"
          :data="data"
          row-key="text"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
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
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <span v-html="col.value"></span>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <ol>
                    <li v-for="(answer, i) in props.row.answers" :key="i">
                      <span
                        :style="
                          answer.isCorrect ? 'color: green' : 'color: red'
                        "
                        >{{ answer.name }}</span
                      >
                    </li>
                  </ol>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Written Exam Dialog -->
    <q-dialog v-model="isWrittenExamDialogOpen">
      <q-card>
        <q-card-section>
          <div class="q-ma-2">
            <q-input
              filled
              v-model="writtenExamMarks"
              label="درجة الإختبار التحريري"
              type="number"
              :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
            />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn
            dense
            flat
            color="primary"
            @click="isWrittenExamDialogOpen = false"
            >إلغاء</q-btn
          >
          <q-btn
            dense
            flat
            color="primary"
            @click="setWrittenExamMarks"
            :disable="disableWrittenExamButton"
            >حفظ</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Recite Exam Dialog -->
    <q-dialog v-model="isReciteExamDialogOpen">
      <q-card>
        <q-card-section>
          <div class="q-ma-2">
            <q-input
              filled
              v-model="reciteExamMarks"
              label="درجة التسميع"
              type="number"
              :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
            />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn
            dense
            flat
            color="primary"
            @click="isReciteExamDialogOpen = false"
            >إلغاء</q-btn
          >
          <q-btn
            dense
            flat
            color="primary"
            @click="setReciteExamMarks"
            :disable="disableReciteExamButton"
            >حفظ</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Question Dialog -->
    <q-dialog v-model="isAddQuestionDialogOpen">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">إضافة سؤال</div>
          <div class="q-ma-2">
            <q-input
              class="q-mt-sm"
              filled
              v-model="question.text"
              label="نص السؤال"
              type="text"
              :rules="[val => val.length > 0 || 'الرجاء إدخال نص السؤال']"
            />
            <q-input
              class="q-mt-sm"
              filled
              v-model="question.marks"
              label="درجة السؤال"
              type="number"
              :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
            />
            <div class="row q-my-sm">
              <div class="col-12">
                <p class="text-body1">
                  <q-btn
                    round
                    dense
                    color="primary"
                    @click="isAddOptionDialogOpen = true"
                  >
                    <q-icon name="add"></q-icon>
                  </q-btn>
                  <span class="q-pa-sm">إضافة خيار إلى السؤال</span>
                </p>
                <ol>
                  <li v-for="(option, i) in question.options" :key="i">
                    <span
                      :style="option.isCorrect ? 'color: green' : 'color: red'"
                      >{{ option.text }}</span
                    >
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="closeAddQuestionDialog"
            >إلغاء</q-btn
          >
          <q-btn dense flat color="primary">حفظ</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Option Dialog -->
    <q-dialog v-model="isAddOptionDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">إضافة خيار</div>
          <div class="q-ma-2">
            <q-input
              class="q-mt-sm"
              filled
              v-model="question.text"
              label="نص الخيار"
              type="text"
              :rules="[val => val.length > 0 || 'الرجاء إدخال نص السؤال']"
            />
            <q-select
              filled
              v-model="option.isCorrect"
              label="هل هذه هي الإجابة الصحيحة؟"
              :options="questionOptions"
              behavior="menu"
            />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="closeAddOptionDialog"
            >إلغاء</q-btn
          >
          <q-btn dense flat color="primary">حفظ</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      isWrittenExamDialogOpen: false,
      isReciteExamDialogOpen: false,
      isAddQuestionDialogOpen: false,
      isAddOptionDialogOpen: false,
      writtenExamMarks: "",
      reciteExamMarks: "",
      question: {
        text: "",
        marks: "",
        options: []
      },
      option: {
        text: "",
        isCorrect: "لا"
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
          name: "edit",
          required: true,
          label: "تعديل السؤال",
          field: "icon",
          align: "right"
        }
      ],
      data: [
        {
          text: "كم عدد سور القرآن الكريم؟",
          marks: 10,
          icon: "<button style='cursor: pointer'>تعديل</button>",
          answers: [
            { name: "14", isCorrect: false },
            { name: "104", isCorrect: false },
            { name: "114", isCorrect: true },
            { name: "116", isCorrect: false }
          ]
        },
        {
          text: "من هو الصحابي الملقب بأبي هريرة؟",
          marks: 10,
          icon: "<button style='cursor: pointer'>تعديل</button>",
          answers: [
            { name: "عبد الرحمن بن عوف", isCorrect: false },
            { name: "عبد الرحمن بن صخر", isCorrect: true },
            { name: "عمر بن العاص", isCorrect: false },
            { name: "زيد بن حارث", isCorrect: false }
          ]
        }
      ]
    };
  },
  created() {
    this.FETCH_YEAR_INFO();
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    }),
    getWrittenExamMarks() {
      let marks =
        typeof this.GET_YEAR_INFO.writtenExamMarks !== "undefined"
          ? this.GET_YEAR_INFO.writtenExamMarks
          : 0;
      return marks;
    },
    getReciteExamMarks() {
      let marks =
        typeof this.GET_YEAR_INFO.reciteExamMarks !== "undefined"
          ? this.GET_YEAR_INFO.reciteExamMarks
          : 0;
      return marks;
    },
    disableWrittenExamButton() {
      if (
        Number.parseInt(this.writtenExamMarks) <= 0 ||
        this.writtenExamMarks === ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    disableReciteExamButton() {
      if (
        Number.parseInt(this.reciteExamMarks) <= 0 ||
        this.reciteExamMarks === ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions({
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      SET_EXAM_TOTAL_MARKS: ACTIONS.SETTINGS.SET_EXAM_TOTAL_MARKS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    setWrittenExamMarks() {
      this.SET_EXAM_TOTAL_MARKS({
        examType: EXAM_TYPE.WRITTEN,
        writtenExamMarks: Number.parseInt(this.writtenExamMarks)
      });
      this.isWrittenExamDialogOpen = false;
    },
    setReciteExamMarks() {
      this.SET_EXAM_TOTAL_MARKS({
        examType: EXAM_TYPE.RECITE,
        reciteExamMarks: Number.parseInt(this.reciteExamMarks)
      });
      this.isReciteExamDialogOpen = false;
    },
    closeAddQuestionDialog() {
      this.question = {
        text: "",
        marks: "",
        answers: []
      };

      this.isAddQuestionDialogOpen = false;
    },
    closeAddOptionDialog() {
      this.option = {
        text: "",
        isCorrect: "لا"
      };

      this.isAddOptionDialogOpen = false;
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
          this.FETCH_YEAR_INFO();

          // Display Success Message
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث درجات اللإختبار بنجاح"
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
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  min-width: 290px;
}
</style>
