<template>
  <q-page padding>
    
    <p class="text-h6">إعدادات المواد الدراسية</p>
        <div class="q-pa-md">
      <!-- Horizontal Stepper -->
      <q-stepper
        id="horizontal-stepper"
        v-model="hStep"
        ref="hStepper"
        color="primary"
        animated
      >
        <q-step
          :name="3"
          title="بيانات إضافية"
          icon="assignment"
          active-icon="assignment"
        >
          <div class="row">
            <div class="col-6">
              <q-form ref="hMoretInfoForm">
                            <div class="text-weight-bold">أسم الطالب:</div>
            <div class="row">
              <div class="col-8">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="subjectForm.name"
                  type="text"
                  label="الأسم المادة"
                  lazy-rules
                  :rules="[
                    val => (val && val.length > 0) || 'الرجاء كتابة الأسم الأول'
                  ]"
                />
              </div>
            </div>
                <div class="row">
                  <div class="q-gutter-sm">
                    <div class="text-weight-bold">
                      توصيف للمادة ؟
                    </div>
                    <div class="col-12">
                      <q-input
                        class="q-ma-sm"
                        style="width: 400px;"
                        dense
                        square
                        outlined
                        :autogrow="false"
                        clearable
                        v-model="subjectForm.description"
                        type="textarea"
                        label="اكتب المهارات التي يمتلكها الطالب"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="q-gutter-sm">
                    <div class="text-weight-bold">المرفقات</div>
                    <div class="col-6">
                      <q-file
                        v-model="subjectForm.files"
                        label="المرفقات"
                        dense
                        outlined
                        use-chips
                        multiple
                        style="width: 400px"
                        class="q-ma-sm"
                        accept=".pdf"
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                  </div>
                </div>
              </q-form>
            </div>
            <div class="col-6">
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn
              :loading="GET_LOADING"
              label="إرسال"
              color="primary"
              @click="onSubmit('hMoretInfoForm')"
            />
            <q-btn
              label="رجوع"
              flat
              type="reset"
              color="primary"
              class="q-ml-sm text-weight-bold"
              :disable="!isRegistrationEnabled"
              @click="() => (hStep = 2)"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </div>
  </q-page>
  
</template>



<script>
import { mapGetters, mapActions } from "vuex";
import {
  CHAPTERS,
  SURAHS,
  VILLAGES,
  KNOWN_BY,
  GETTERS,
  ACTIONS,
  STUDENT_STATUS
} from "../../../config/constants";

export default {
  name: "PageEditSubjects",
  components : {
    AddSubjectDialog : ()=> import("components/SubjectAddCourseDialog.vue")
  },
  data() {
    return {
      hStep:3,
      vStep:3,
      isRegistrationEnabled: false,
      subjectForm: {
        name: "",
        description: "",
        files: [],
        status : "Active",
        createdAt : "",
        createdBy :"",
        year : ""
      },
      villages: VILLAGES,
      centerKnownList: KNOWN_BY
    };
  },
  created() {
    this.CLEAR_ERRORS_AND_MESSAGES();
    this.FETCH_REGISTRATION_PERIOD();
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters({
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_REGISTRATION_PERIOD: GETTERS.SETTINGS.GET_REGISTRATION_PERIOD
    }),

  },
  methods: {
    ...mapActions({
      FETCH_REGISTRATION_PERIOD: ACTIONS.SETTINGS.FETCH_REGISTRATION_PERIOD,
      REGISTER_SUBJECT: ACTIONS.SUBJECTS.REGISTER_SUBJECT,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    onSelectFile(file) {
      
    },
    async onSubmit(form) {
      let valid = await this.$refs[form].validate();

      if (valid) {
        this.REGISTER_SUBJECT(this.subjectForm);
      }
    }
  },
  watch: {
    GET_MESSAGES: function(newState, oldState) {

    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 598px) {
  #horizontal-stepper {
    display: none;
  }
}

@media screen and (min-width: 599px) {
  #vertical-stepper {
    display: none;
  }
}
</style>