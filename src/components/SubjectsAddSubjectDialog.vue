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
          <div class="col-xs-12 col-md-2">
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
          <div v-for="sem in subjectForm.marks" :key="sem.id" class="col-xs-12 col-md-2 text-center">
            <div class="q-ma-2">
             <q-checkbox v-model="sem.isActive" label="تفعيل" />
            </div>
            <div class="row q-my-sm">
              <q-form @submit.prevent="addEvaluationsCriteria(sem.option,sem.options)">
                <q-list style="width: 100%">
                  <q-item>
                    <q-item-section class="justify-start" avatar>
                      <q-btn :disable="!sem.isActive" dense round size="sm" color="primary" type="submit">
                        <q-icon name="o_add" />
                      </q-btn>
                    </q-item-section>
                    <q-item-section class="q-mt-lg">
                      <q-input
                        :disable="!sem.isActive"
                        style="width: 200px"
                        v-model="sem.option.text"
                        label="تفاصيل"
                        dense
                        filled
                        :rules="[val => val && val.length > 0 || 'ادخل تفاصيل الدرجة']"
                      ></q-input>
                    </q-item-section>
                    <q-item-section class="q-mt-lg" side>
                      <q-input
                       :disable="!sem.isActive"
                        style="width: 100px"
                        type="number"
                        v-model="sem.option.mark"
                        label="الدرجة"
                        dense
                        filled
                        :rules="[val => val && val > 0 || 'ادخل الدرجة']"
                      ></q-input>
                    </q-item-section>
                  </q-item>
                  <q-item v-for="(option, i) in sem.options" :key="i">
                    <q-item-section avatar>
                      <q-btn dense round size="sm" color="red" 
                      @click="removeExamMarksOption(sem.options,i)">
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
      subjectForm: {
        name: "",
        description: "",
        files: [],
        status: "Active",
        createdAt: "",
        createdBy: "",
        year: "",
        marks : null,
      },
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
    }),
  },
  methods: {
    ...mapActions({
      REGISTER_SUBJECT: ACTIONS.SUBJECTS.REGISTER_SUBJECT,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    addEvaluationsCriteria(option,evaluations) {
      evaluations.push({
        id : evaluations.length +1,
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
        this.subjectForm.marks = this.subjectForm.marks.map(sem => ({
          semesterId : sem.id,
          criteria : sem.isActive ?  sem.options : [],
          isActive : sem.isActive
        }));
        console.log(this.subjectForm);
        this.REGISTER_SUBJECT(this.subjectForm);
        this.$emit("close");
      }
    },
  },
    watch: {
    GET_YEAR_INFO: function(newState, oldState) {
      if (Object.keys(newState).length > 0) {
        this.subjectForm.marks = newState.semesters.map(sem =>({
        id : sem.id,
        name : sem.name,
        options : [],
        totalMarks : 0,
        isActive : false,
        option : {
          text : "", 
          mark : "",
        }
      }));
      }
    },
    }
};
</script>
