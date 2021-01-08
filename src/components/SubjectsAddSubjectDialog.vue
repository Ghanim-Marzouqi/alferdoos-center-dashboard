<template>
  <q-dialog v-model="isOpen" full-width persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إضافة مادة</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-card style="margin:10px;" class="full-height">
              <q-card-section>
                <q-form ref="subjectForm">
                  <div class="text-weight-bold">إسم المادة:</div>
                  <div class="row">
                    <div class="col-8">
                                        <q-input
                    dense
                    square
                    outlined
                    clearable
                    v-model="subject.name"
                    type="text"
                    label="إسم المادة"
                    lazy-rules
                    :rules="[ val => (val && val.length > 0) || 'الرجاء كتابة إسم المادة']"
                  />
                    </div>
                    <div class="col-3" style="margin-right:20px">
                    <q-input
                    dense
                    square
                    outlined
                    clearable
                    type="number"
                    disable
                    :label="getTotal(0)+''"
                    lazy-rules
                    :rules="[ val => (val && val < 100) || 'الرجاء إضافة الدرجات']"
                  />
                    </div>
                  </div>


                  <div class="text-weight-bold">المعلمين</div>
                  <q-select
                    v-model="subject.teachers"
                    multiple
                    :options="GET_TEACHERS"
                    :rules="[ val => (val && val.length > 0) || 'الرجاء إختيار المعلمين']"
                    :option-label="obj => obj.name"
                    :option-value="obj => obj.id"
                    use-chips
                    stack-label
                    dense
                    outlined
                    label="إختر المعلمين"
                  />

                  <div class="text-weight-bold">توصيف للمادة ؟</div>

                  <q-input
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="subject.description"
                    :rules="[ val => (val && val.length > 0) || 'أضف توصيفا للمادة']"
                    type="textarea"
                    label="مختصر بسيط للمادة"
                  />

                  <div class="text-weight-bold">المرفقات</div>

                  <q-file
                    v-model="subject.files"
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
                  <div>
                    <q-chip
                      v-for="(file, i) in subject.uplodedFiles"
                      :key="i"
                      clickable
                      :icon-right="action == 'view' ? 'o_get_app' : 'delete'"
                      @click="action == 'edit' ?  removeFile(i) : downloadFile(file)"
                    >{{ file.name }}</q-chip>
                  </div>
                </q-form>
              </q-card-section>
            </q-card>
          </div>
          <div v-for="sem in marks" :key="sem.id" class="col">
            <q-card style="margin: 10px;" class="full-height">
              <q-card-section>
                <div class="q-ma-2">
                  <q-checkbox v-model="sem.isActive" :label="sem.name" />
                </div>
                <div class="q-ma-2">
                  <label>المجموع:</label><label>{{ sem.totalMarks }}</label>
                </div>
                <div class="row q-my-sm">
                  <q-form @submit.prevent="addEvaluationsCriteria(sem.option,sem)">
                    <q-list style="width: 100%">
                      <q-item>
                        <q-item-section class="justify-start" avatar>
                          <q-btn
                            :disable="!sem.isActive"
                            dense
                            round
                            size="sm"
                            color="primary"
                            type="submit"
                          >
                            <q-icon name="o_add" />
                          </q-btn>
                        </q-item-section>
                        <q-item-section class="q-mt-lg">
                          <q-input
                            :disable="!sem.isActive"
                            style="width: 130px"
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
                            :rules="[val => val && val > 0  || 'ادخل الدرجة',
                            val => getTotal(val) <= 100 || 'تجاوز الحد الأقصى 100']"
                          ></q-input>
                        </q-item-section>
                      </q-item>
                      <q-item v-for="(option, i) in sem.options" :key="i">
                        <q-item-section avatar>
                          <q-btn
                            dense
                            round
                            size="sm"
                            color="red"
                            @click="removeExamMarksOption(sem,i)"
                          >
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
              </q-card-section>
            </q-card>
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
  name: "SubjectAddSubjectDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    subject: {
      type: Object,
    },
    marks: {
      type: Array,
      default: [],
    },
    action: {type : String,
    default : "add"}
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_TEACHERS: GETTERS.TEACHERS.GET_TEACHERS,
    }),
  },
  methods: {
    ...mapActions({
      REGISTER_SUBJECT: ACTIONS.SUBJECTS.REGISTER_SUBJECT,
      UPDATE_SUBJECT: ACTIONS.SUBJECTS.UPDATE_SUBJECT,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    emoveFile(index){
      this.subject.uplodedFiles.splice(index,1);
    },
    downloadFile(file) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = file.name;
          link.click();
        };
        xhr.open("GET", file.fileUrl);
        xhr.send();
      } catch (error) {
        switch (error.code) {
          case ERRORS.STORAGE.OBJECT_NOT_FOUND:
            this.SET_ERROR(ERRORS.STORAGE.OBJECT_NOT_FOUND);
            break;
          case ERRORS.STORAGE.UNAUTHORIZED:
            this.SET_ERROR(ERRORS.STORAGE.UNAUTHORIZED);
            break;
          case ERRORS.STORAGE.CANCELED:
            this.SET_ERROR(ERRORS.STORAGE.CANCELED);
            break;
          case ERRORS.STORAGE.UNKNOWN:
            this.SET_ERROR(ERRORS.STORAGE.UNKNOWN);
            break;
        }
      }
    },
    
    getTotal(val){
      let total = this.marks.length > 1 ? this.marks.reduce((a,b) => ({totalMarks :a.totalMarks+ b.totalMarks })).totalMarks
      : this.marks.length > 0 ? this.marks[0].totalMarks : 0;
      console.log();
      return parseInt(total) + parseInt(val);
    },
    addEvaluationsCriteria(option, semester) {
      semester.options.push({
        id: semester.options.length + 1,
        mark: parseInt(option.mark),
        text: option.text,
      });
      semester.totalMarks = semester.totalMarks+parseInt(option.mark);
      
      option.mark = 0;
      option.text = "";
    },
    removeExamMarksOption(evaluations, i) {
      console.log(evaluations)
      evaluations.options.splice(i, 1);
      evaluations.totalMarks = evaluations.options.length > 1 ?
       evaluations.options.reduce((a,b) => ({ mark : a.mark + b.mark})).mark
       : evaluations.options.length > 0 ? evaluations.options[0].mark : 0
    },
    async onSubmit() {

      let valid = this.$refs.subjectForm.validate() && this.getTotal(0) == 100;

      if (valid) {
        let markCriteria = this.marks.map((sem) => ({
          semesterId: sem.id,
          criteria: sem.isActive ? sem.options : [],
          isActive: sem.isActive,
        }));

        let subject = {
          name: this.subject.name,
          description: this.subject.description,
          files: this.subject.files,
          uplodedFiles : this.subject.uplodedFiles,
          teachers : this.subject.teachers.map(teacher => ({ id : teacher.id, name : teacher.name })),
          status: "Active",
          createdAt: "",
          createdBy: "",
          year: this.subject.year,
          marks: markCriteria,
        };

        
        
        if (valid){
          if (this.subject.id === "") {
              this.subject.year = this.GET_YEAR_INFO.name;
              this.REGISTER_SUBJECT(subject);
          }else {
            subject.id = this.subject.id;
            this.UPDATE_SUBJECT(subject);
          }
        }

        this.$emit("close");
      }
    },
  },
};
</script>
