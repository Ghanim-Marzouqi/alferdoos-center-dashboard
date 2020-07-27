<template>
  <q-dialog
    v-model="isStudentDialogOpen"
    full-width
    persistent
    @before-show="setStudentData"
    @hide="resetStudntData"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ registeredStudent.name }}</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('closeStudentRegistrationInfoDialog')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="q-pa-md">
          <P class="text-weight-bold text-indigo">معلومات الطالب الأساسية:</P>
          <div class="row q-ml-md">
            <div class="col-xs-12 col-md-8">
              <p class="text-weight-bold">
                انهى الصف:
                <span class="text-weight-bold text-blue">
                  {{
                  getStudentGrade
                  }}
                </span>
              </p>
              <div class="row">
                <div class="col-xs-12 col-md-6">
                  <p class="text-weight-bold">
                    عدد المواد بتقدير (أ):
                    <strong
                      class="text-blue"
                    >{{ registeredStudent.subjectANumber }}</strong>
                  </p>
                </div>
                <div class="col-xs-12 col-md-6">
                  <p class="text-weight-bold">
                    عدد المواد بتقدير (ب):
                    <strong
                      class="text-blue"
                    >{{ registeredStudent.subjectBNumber }}</strong>
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col-xs-12 col-md-6">
                  <strong>الأجزاء المحفوظة:</strong>
                  <ul>
                    <li
                      v-for="(chapter, i) in registeredStudent.savedChapters"
                      :key="i"
                    >{{ chapter }}</li>
                  </ul>
                </div>
                <div class="col-xs-12 col-md-6">
                  <strong>السور المحفوظة:</strong>
                  <ul>
                    <li v-for="(surah, i) in registeredStudent.savedSurahs" :key="i">{{ surah }}</li>
                  </ul>
                </div>
              </div>
              <strong>الشهادات:</strong>
              <div>
                <q-chip
                  v-for="(certificate, i) in registeredStudent.certificates"
                  :key="i"
                  clickable
                  icon-right="o_get_app"
                  @click="downloadFile(certificate)"
                >شهادة {{ i + 1 }}</q-chip>
              </div>
            </div>
            <div class="col-xs-12 col-md-4 text-center">
              <q-img
                :src="registeredStudent.imageURL"
                :ratio="1"
                style="height: 200px; width: 200px"
                class="q-ma-sm"
              >
                <template v-slot:error>
                  <div
                    class="absolute-full flex flex-center bg-negative text-white"
                  >لا يمكن تحميل الصورة</div>
                </template>
              </q-img>
            </div>
          </div>
          <div class="row q-ml-md">
            <div class="col-xs-12 col-md-4">
              <P class="text-weight-bold">معلومات الحالة الصحية للطالب:</P>
              <p>
                هل يعاني الطالب أي مرض:
                <strong class="text-blue">
                  {{
                  registeredStudent.studentState === "healthy" ? "لا" : "نعم"
                  }}
                </strong>
              </p>
              <p>
                الأعراض والأمراض التي يعاني منها الطالب:
                <span class="text-weight-bold">
                  {{
                  registeredStudent.diseases === ""
                  ? "لا يوجد"
                  : registeredStudent.diseases
                  }}
                </span>
              </p>
            </div>
            <div class="col-xs-12 col-md-4">
              <P class="text-weight-bold">معلومات دراسية سابقة:</P>
              <p>
                هل سبق للطالب التعلم في مركز لحفظ القرآن الكريم:
                <strong class="text-blue">
                  {{
                  registeredStudent.isLearntInCenterBefore === "yes"
                  ? "نعم"
                  : "لا"
                  }}
                </strong>
              </p>
              <p>
                المكان:
                <span class="text-weight-bold">
                  {{
                  registeredStudent.oldCenterName === ""
                  ? "لم يسبق للطالب التعلم في مدرسة لتحفيظ القرآن"
                  : registeredStudent.oldCenterName
                  }}
                </span>
              </p>
            </div>
            <div class="col-xs-12 col-md-4"></div>
          </div>
          <P class="text-weight-bold text-indigo q-mt-md">معلومات إضافية عن الطالب:</P>
          <div class="row q-ma-md">
            <div class="col-xs-12 col-md-4">
              <P class="text-weight-bold">معلومات ولي الأمر:</P>
              <p>
                أسم ولي الأمر:
                <span
                  class="text-weight-bold text-blue"
                >{{ registeredStudent.parentName }}</span>
              </p>
              <p>
                ارقام الهواتف:
                <span
                  class="text-weight-bold text-blue"
                >{{ registeredStudent.firstPhoneNumber }}</span>
                -
                <span class="text-weight-bold text-blue">
                  {{
                  registeredStudent.secondPhoneNumber === ""
                  ? "لا يوجد"
                  : registeredStudent.secondPhoneNumber
                  }}
                </span>
              </p>
            </div>
            <div class="col-xs-12 col-md-4">
              <P class="text-weight-bold">معلومات عن المركز:</P>
              <p>
                كيف عرفت عن المركز:
                <span
                  class="text-weight-bold text-blue"
                >{{ registeredStudent.centerKnownBy }}</span>
              </p>
            </div>
            <div class="col-xs-12 col-md-4"></div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="حسنا" @click="$emit('closeStudentRegistrationInfoDialog')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { ACTIONS, ERRORS, STUDENT_GRADE } from "../config/constants";

export default {
  name: "StudentRegistrationInfoDialog",
  props: {
    isStudentDialogOpen: {
      type: Boolean,
      default: false,
    },
    student: {
      type: Object,
      required: true,
      default: {},
    },
  },
  data() {
    return {
      registeredStudent: {},
    };
  },
  computed: {
    getStudentGrade() {
      if (Object.keys(this.registeredStudent).length > 0) {
        if (
          this.registeredStudent.finishedClass === STUDENT_GRADE.GRADE_SEVEN
        ) {
          return "السابع";
        } else if (
          this.registeredStudent.finishedClass === STUDENT_GRADE.GRADE_EIGHT
        ) {
          return "الثامن";
        } else if (
          this.registeredStudent.finishedClass === STUDENT_GRADE.GRADE_NINE
        ) {
          return "التاسع";
        } else {
          return "غير معروف";
        }
      } else {
        return "غير معروف";
      }
    },
  },
  methods: {
    ...mapActions({
      SET_ERROR: ACTIONS.UI.SET_ERROR,
    }),
    setStudentData() {
      if (Object.keys(this.student).length > 0) {
        this.registeredStudent = this.student;
      }
    },
    downloadFile(fileURL) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `certificate_${date.formatDate(
            Date.now(),
            "YYYY_MM_DD_HH_mm_ss_a"
          )}`;
          link.click();
        };
        xhr.open("GET", fileURL);
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
    resetStudntData() {
      this.registeredStudent = {};
    },
  },
};
</script>
