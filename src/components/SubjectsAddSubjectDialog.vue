<template>
  <q-dialog v-model="isOpen" full-width persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إضافة مادة</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row q-ml-md justify-around">
          <div class="col-xs-12 col-md-3">
            <q-form ref="hMoretInfoForm">
              <div class="text-weight-bold">إسم المادة:</div>
              <q-input
                dense
                square
                outlined
                clearable
                v-model="subjectForm.name"
                type="text"
                label="إسم المادة"
                lazy-rules
                :rules="[
                       val => (val && val.length > 0) || 'الرجاء كتابة الأسم الأول']"
              />

              <div class="text-weight-bold">توصيف للمادة ؟</div>

              <q-input
                dense
                square
                outlined
                :autogrow="false"
                clearable
                v-model="subjectForm.description"
                type="textarea"
                label="مختصر بسيط للمادة"
              />

              <div class="text-weight-bold">المرفقات</div>

              <q-file
                v-model="subjectForm.files"
                label="المرفقات"
                dense
                outlined
                use-chips
                multiple
                accept=".pdf"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </q-form>
          </div>
          <div class="col-xs-12 col-md-3 text-center">
            <div class="q-ma-2">
              مجموع الدرجات:
              <span class="text-weight-bold">{{ getTotalMarks1 }}</span>
            </div>
            <div class="row q-my-sm">
              <q-form @submit.prevent="addEvaluationsCriteria(option1,subjectForm.evaluations1)">
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
                        v-model="option1.text"
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
                        v-model="option1.mark"
                        label="الدرجة"
                        dense
                        filled
                        :rules="[val => val && val > 0 || 'ادخل الدرجة']"
                      ></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item v-for="(option, i) in subjectForm.evaluations1" :key="i">
                    <q-item-section avatar>
                      <q-btn dense round size="sm" color="red" 
                      @click="removeExamMarksOption(subjectForm.evaluations1,i)">
                        <q-icon name="o_remove" />
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{ option.text }}</q-item-section>
                    <q-item-section class="text-center" style="width: 100%">
                      {{
                      option.mark
                      }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-form>
            </div>
          </div>
          <div class="col-xs-12 col-md-3 text-center">
            <div class="q-ma-2">
              مجموع الدرجات:
              <span class="text-weight-bold">{{ getTotalMarks2 }}</span>
            </div>
            <div class="row q-my-sm">
              <q-form @submit.prevent="addEvaluationsCriteria(option2,subjectForm.evaluations2)">
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
                        v-model="option2.text"
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
                        v-model="option2.mark"
                        label="الدرجة"
                        dense
                        filled
                        :rules="[val => val && val > 0 || 'ادخل الدرجة']"
                      ></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item v-for="(option, i) in subjectForm.evaluations2" :key="i">
                    <q-item-section avatar>
                      <q-btn dense round size="sm" color="red" 
                      @click="removeExamMarksOption(subjectForm.evaluations2,i)">
                        <q-icon name="o_remove" />
                      </q-btn>
                    </q-item-section>
                    <q-item-section>{{ option.text }}</q-item-section>
                    <q-item-section class="text-center" style="width: 100%">
                      {{
                      option.mark
                      }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-form>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="حسنا" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ACTIONS, ERRORS, STUDENT_GRADE, GETTERS } from "../config/constants";

export default {
  name: "StudentRegistrationInfoDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      option1: {
        mark: 0,
        text: "",
      },
      option2: {
        mark: 0,
        text: "",
      },
      subjectForm: {
        name: "",
        description: "",
        files: [],
        status: "Active",
        createdAt: "",
        createdBy: "",
        year: "",
        evaluations1: [],
        evaluations2: [],
      },
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
    getTotalMarks1() {
      let count = 0;

      this.subjectForm.evaluations1.forEach((criteria) => {
        count = count + parseInt(criteria.mark);
      });

      return count;
    },
        getTotalMarks2() {
      let count = 0;

      this.subjectForm.evaluations2.forEach((criteria) => {
        count = count + parseInt(criteria.mark);
      });

      return count;
    },
  },
  methods: {
    ...mapActions({
      REGISTER_SUBJECT: ACTIONS.SUBJECTS.REGISTER_SUBJECT,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    addEvaluationsCriteria(option,evaluations) {
      evaluations.push({
        mark: parseInt(option.mark),
        text: option.text,
      });
      option.mark = 0;
      option.text = "";
    },
    removeExamMarksOption(evaluations,i) {
      evaluations.splice(i, 1);
    },
    async onSubmit() {
      let valid = true;

      if (valid) {
        this.REGISTER_SUBJECT(this.subjectForm);
        this.$emit("close");
      }
    },
  },
};
</script>
