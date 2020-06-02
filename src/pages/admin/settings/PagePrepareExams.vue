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
              <td class="text-center">{{ getWrittenExamMarks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onWrittenExamDialoqOpened">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">التسميع</td>
              <td class="text-center">{{ getReciteExamMarks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onReciteExamDialoqOpened">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">التلاوة</td>
              <td class="text-center">{{ getReadingExamMarks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onReadingExamDialoqOpened">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">الثقافة العامة</td>
              <td class="text-center">
                {{ getCommonKnowledgeExamMarks }} درجة
              </td>
              <td class="text-right">
                <q-btn dense flat @click="onCommonKnowledgeExamDialoqOpened">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">المهارات الشخصية</td>
              <td class="text-center">{{ getPersonalExamMarks }} درجة</td>
              <td class="text-right">
                <q-btn dense flat @click="onPersonalExamDialoqOpened">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left text-weight-bold">المجموع الكلي للدرجات</td>
              <td class="text-center text-weight-bold">
                {{ getTotalMarks }} درجة
              </td>
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
          >إضافة سؤال جديد</q-btn
        >
      </div>
      <div class="col-12">
        <q-table :columns="columns" :data="GET_QUESTIONS" row-key="text">
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
              <q-td auto-width>
                {{ props.row.text }}
              </q-td>
              <q-td auto-width class="text-center">
                {{ props.row.marks }}
              </q-td>
              <q-td auto-width class="text-right">
                <q-btn dense flat color="teal">
                  <q-icon name="o_edit"></q-icon>
                </q-btn>
              </q-td>
              <q-td auto-width class="text-right">
                <q-btn dense flat color="red">
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
                        >{{ option.text }}</span
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
              label="درجة إختبار الإملاء"
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

    <!-- Personal Exam Dialog -->
    <q-dialog v-model="isPersonalExamDialogOpen">
      <q-card>
        <q-card-section>
          <div class="q-ma-2">
            <q-input
              filled
              v-model="personalExamMarks"
              label="درجة إختبار المهارات الشخصية"
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
            @click="isPersonalExamDialogOpen = false"
            >إلغاء</q-btn
          >
          <q-btn
            dense
            flat
            color="primary"
            @click="setPersonalExamMarks"
            :disable="disablePersonalExamButton"
            >حفظ</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Reading Exam Dialog -->
    <q-dialog v-model="isReadingExamDialogOpen">
      <q-card>
        <q-card-section>
          <div class="q-ma-2">
            <q-input
              filled
              v-model="readingExamMarks"
              label="درجة إختبار التلاوة"
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
            @click="isReadingExamDialogOpen = false"
            >إلغاء</q-btn
          >
          <q-btn
            dense
            flat
            color="primary"
            @click="setReadingExamMarks"
            :disable="disableReadingExamButton"
            >حفظ</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Common Knowledge Exam Dialog -->
    <q-dialog v-model="isCommonKnowledgeExamDialogOpen">
      <q-card>
        <q-card-section>
          <div class="q-ma-2">
            <q-input
              filled
              v-model="commonKnowledgeExamMarks"
              label="درجة إختبار الثقافة العامة"
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
            @click="isCommonKnowledgeExamDialogOpen = false"
            >إلغاء</q-btn
          >
          <q-btn
            dense
            flat
            color="primary"
            @click="setCommonKnowledgeExamMarks"
            :disable="disableCommonKnowledgeExamButton"
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
              <q-list style="width: 100%">
                <q-item>
                  <q-item-section avatar>
                    <q-btn
                      dense
                      round
                      size="sm"
                      color="primary"
                      @click="addQuestionOption"
                    >
                      <q-icon name="o_add" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-input
                      v-model="option.text"
                      label="إضف خيار للسؤال"
                      dense
                      filled
                    ></q-input>
                  </q-item-section>
                  <q-item-section side>
                    <q-select
                      v-model="option.isCorrect"
                      :value="option.isCorrect"
                      :options="questionOptions"
                      dense
                      filled
                    ></q-select>
                  </q-item-section>
                </q-item>
                <q-item v-for="(option, i) in question.options" :key="i">
                  <q-item-section avatar>
                    <q-btn
                      dense
                      round
                      size="sm"
                      color="primary"
                      @click="removeQuestionOption(i)"
                    >
                      <q-icon name="o_remove" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    {{ option.text }}
                  </q-item-section>
                  <q-item-section class="text-center" style="width: 100%">
                    {{ option.isCorrect.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="closeAddQuestionDialog"
            >إلغاء</q-btn
          >
          <q-btn
            dense
            flat
            color="primary"
            :loading="GET_LOADING"
            @click="addQuestion"
            >حفظ</q-btn
          >
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
      isPersonalExamDialogOpen: false,
      isReadingExamDialogOpen: false,
      isCommonKnowledgeExamDialogOpen: false,
      isAddQuestionDialogOpen: false,
      isAddOptionDialogOpen: false,
      writtenExamMarks: "",
      reciteExamMarks: "",
      personalExamMarks: "",
      readingExamMarks: "",
      commonKnowledgeExamMarks: "",
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
          name: "edit",
          required: true,
          label: "تعديل",
          field: "edit",
          align: "right"
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
    this.FETCH_YEAR_INFO();
    this.FETCH_QUESTIONS();
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_QUESTIONS: GETTERS.SETTINGS.GET_QUESTIONS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
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
    getPersonalExamMarks() {
      let marks =
        typeof this.GET_YEAR_INFO.personalExamMarks !== "undefined"
          ? this.GET_YEAR_INFO.personalExamMarks
          : 0;
      return marks;
    },
    getReadingExamMarks() {
      let marks =
        typeof this.GET_YEAR_INFO.readingExamMarks !== "undefined"
          ? this.GET_YEAR_INFO.readingExamMarks
          : 0;
      return marks;
    },
    getCommonKnowledgeExamMarks() {
      let marks =
        typeof this.GET_YEAR_INFO.commonKnowledgeExamMarks !== "undefined"
          ? this.GET_YEAR_INFO.commonKnowledgeExamMarks
          : 0;
      return marks;
    },
    getTotalMarks() {
      return (
        this.getWrittenExamMarks +
        this.getReciteExamMarks +
        this.getPersonalExamMarks +
        this.getReadingExamMarks +
        this.getCommonKnowledgeExamMarks
      );
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
    },
    disablePersonalExamButton() {
      if (
        Number.parseInt(this.personalExamMarks) <= 0 ||
        this.personalExamMarks === ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    disableReadingExamButton() {
      if (
        Number.parseInt(this.readingExamMarks) <= 0 ||
        this.readingExamMarks === ""
      ) {
        return true;
      } else {
        return false;
      }
    },
    disableCommonKnowledgeExamButton() {
      if (
        Number.parseInt(this.commonKnowledgeExamMarks) <= 0 ||
        this.commonKnowledgeExamMarks === ""
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
      FETCH_QUESTIONS: ACTIONS.SETTINGS.FETCH_QUESTIONS,
      SET_EXAM_TOTAL_MARKS: ACTIONS.SETTINGS.SET_EXAM_TOTAL_MARKS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
      SET_QUESTION: ACTIONS.SETTINGS.SET_QUESTION
    }),
    onWrittenExamDialoqOpened() {
      this.writtenExamMarks = this.getWrittenExamMarks;
      this.isWrittenExamDialogOpen = true;
    },
    onReciteExamDialoqOpened() {
      this.reciteExamMarks = this.getReciteExamMarks;
      this.isReciteExamDialogOpen = true;
    },
    onPersonalExamDialoqOpened() {
      this.personalExamMarks = this.getPersonalExamMarks;
      this.isPersonalExamDialogOpen = true;
    },
    onReadingExamDialoqOpened() {
      this.readingExamMarks = this.getReadingExamMarks;
      this.isReadingExamDialogOpen = true;
    },
    onCommonKnowledgeExamDialoqOpened() {
      this.commonKnowledgeExamMarks = this.getCommonKnowledgeExamMarks;
      this.isCommonKnowledgeExamDialogOpen = true;
    },
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
    setPersonalExamMarks() {
      this.SET_EXAM_TOTAL_MARKS({
        examType: EXAM_TYPE.PERSONAL,
        personalExamMarks: Number.parseInt(this.personalExamMarks)
      });
      this.isPersonalExamDialogOpen = false;
    },
    setReadingExamMarks() {
      this.SET_EXAM_TOTAL_MARKS({
        examType: EXAM_TYPE.READING,
        readingExamMarks: Number.parseInt(this.readingExamMarks)
      });
      this.isReadingExamDialogOpen = false;
    },
    setCommonKnowledgeExamMarks() {
      this.SET_EXAM_TOTAL_MARKS({
        examType: EXAM_TYPE.COMMON_KNOWLEDGE,
        commonKnowledgeExamMarks: Number.parseInt(this.commonKnowledgeExamMarks)
      });
      this.isCommonKnowledgeExamDialogOpen = false;
    },
    closeAddQuestionDialog() {
      this.question = {
        text: "",
        marks: "",
        answers: []
      };

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
