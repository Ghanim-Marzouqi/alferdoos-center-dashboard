<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">طلبات التسجيل</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلبات المقدمة للمركز"
        :data="GET_STUDENTS"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="GET_LOADING"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="بحث"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="createdAt" :props="props">
              {{ props.row.createdAt | formatDate }}
            </q-td>
            <q-td key="status" :props="props">
              <p
                id="application-status"
                @click="showRegisteredApplicationStatusDialog(props.row)"
              >
                {{ props.row.status | getStatus }}
              </p>
            </q-td>
            <q-td key="show" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- Registered Student Dialog -->
    <q-dialog
      v-model="showStudentModal"
      full-width
      persistent
      @hide="resetStudntData"
    >
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ registeredStudent.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="q-pa-md">
            <P class="text-weight-bold text-indigo">معلومات الطالب الأساسية:</P>
            <div class="row q-ml-md">
              <div class="col-xs-12 col-md-8">
                <p class="text-weight-bold">
                  انهى الصف:
                  <span class="text-weight-bold text-blue">
                    {{ getStudentGrade }}
                  </span>
                </p>
                <div class="row">
                  <div class="col-xs-12 col-md-6">
                    <p class="text-weight-bold">
                      عدد المواد بتقدير (أ):
                      <strong class="text-blue">
                        {{ registeredStudent.subjectANumber }}
                      </strong>
                    </p>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <p class="text-weight-bold">
                      عدد المواد بتقدير (ب):
                      <strong class="text-blue">
                        {{ registeredStudent.subjectBNumber }}
                      </strong>
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
                      >
                        {{ chapter }}
                      </li>
                    </ul>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <strong>السور المحفوظة:</strong>
                    <ul>
                      <li
                        v-for="(surah, i) in registeredStudent.savedSurahs"
                        :key="i"
                      >
                        {{ surah }}
                      </li>
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
                    >شهادة {{ i + 1 }}</q-chip
                  >
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
                    >
                      لا يمكن تحميل الصورة
                    </div>
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
                      registeredStudent.studentState === "healthy"
                        ? "لا"
                        : "نعم"
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
            <P class="text-weight-bold text-indigo q-mt-md"
              >معلومات إضافية عن الطالب:</P
            >
            <div class="row q-ma-md">
              <div class="col-xs-12 col-md-4">
                <P class="text-weight-bold">معلومات ولي الأمر:</P>
                <p>
                  أسم ولي الأمر:
                  <span class="text-weight-bold text-blue">
                    {{ registeredStudent.parentName }}
                  </span>
                </p>
                <p>
                  ارقام الهواتف:
                  <span class="text-weight-bold text-blue">
                    {{ registeredStudent.firstPhoneNumber }}
                  </span>
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
                  <span class="text-weight-bold text-blue">
                    {{ registeredStudent.centerKnownBy }}
                  </span>
                </p>
              </div>
              <div class="col-xs-12 col-md-4"></div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="حسنا" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Registered Application Status -->
    <q-dialog
      v-model="showRegisteredApplicationStatusModal"
      @hide="resetStudntData"
    >
      <q-card>
        <q-card-section>
          <div class="text-h5">حالة الطلب</div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">{{ getApplicationStatus }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ACTIONS,
  STUDENT_GRADE,
  STUDENT_STATUS,
  ERRORS
} from "../../../config/constants";

export default {
  name: "PageRegistrationForms",
  data() {
    return {
      showLink: "/student-dashboard",
      filter: "",
      loading: false,
      showStudentModal: false,
      showRegisteredApplicationStatusModal: false,
      registeredStudent: {},
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم الطالب",
          align: "left",
          field: row => row.name,
          format: val => `${val}`
        },
        {
          name: "createdAt",
          required: true,
          label: "وقت وتاريخ تقديم الطلب",
          align: "center",
          field: row => row.createdAt,
          format: val => `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`
        },
        {
          name: "status",
          required: true,
          label: "حالة الطلب",
          align: "center",
          field: row => row.status,
          format: val => `${val}`
        },
        {
          name: "show",
          align: "center",
          label: "إستعراض",
          field: "show"
        }
      ]
    };
  },
  created() {
    if (Object.keys(this.GET_USER).length > 0) {
      this.FETCH_STUDENTS_BY_PARENT_ID({ parentId: this.GET_USER.id });
    }
  },
  computed: {
    ...mapGetters({
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    }),
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
    getApplicationStatus() {
      if (this.registeredStudent.status === STUDENT_STATUS.REVIEW) {
        return "الطلب قيد المراجعة";
      } else if (this.registeredStudent.status === STUDENT_STATUS.EXAM) {
        return "مقبول لأداء الإختبار";
      } else if (this.registeredStudent.status === STUDENT_STATUS.STUDY) {
        return "مقبول للدراسة في المركز";
      } else if (this.registeredStudent.status === STUDENT_STATUS.REJECT) {
        return `تم رفض الطالب للأسباب التالية: ${this.registeredStudent.rejectionReasons}`;
      } else {
        return "حالة الطلب غير معروفة";
      }
    }
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS_BY_PARENT_ID: ACTIONS.STUDNETS.FETCH_STUDENTS_BY_PARENT_ID,
      DELETE_STUDENT: ACTIONS.STUDNETS.DELETE_STUDENT,
      SET_ERROR: ACTIONS.UI.SET_ERROR,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    showStudentDialog(student) {
      this.registeredStudent = student;
      this.showStudentModal = true;
    },
    showRegisteredApplicationStatusDialog(student) {
      this.registeredStudent = student;
      this.showRegisteredApplicationStatusModal = true;
    },
    downloadFile(fileURL) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function(event) {
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
    getFormatedDate(unformatedDate) {
      return date.formatDate(unformatedDate, "DD/MMMM/YYYY - hh:mm a");
    },
    resetStudntData() {
      this.registeredStudent = {};
    }
  },
  filters: {
    formatDate(val) {
      return `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`;
    },
    getStatus(val) {
      if (val === STUDENT_STATUS.REVIEW) return "الطلب قيد المراجعة";
      else if (val === STUDENT_STATUS.EXAM) return "مقبول لأداء الإختبار";
      else if (val === STUDENT_STATUS.STUDY) return "مقبول للدراسة في المركز";
      else if (val === STUDENT_STATUS.REJECT) return "تم الرفض";
      else return "حالة الطلب غير معروفة";
    }
  },
  watch: {
    GET_ERRORS: function(newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.STORAGE.OBJECT_NOT_FOUND) {
          this.$q.dialog({
            title: "حدث خطأ",
            message: "لم يتم العثور على الملف"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.STORAGE.UNAUTHORIZED) {
          this.$q.dialog({
            title: "حدث خطأ",
            message: "لا تملك الصلاحيات لتحميل الملف"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.STORAGE.CANCELED) {
          this.$q.dialog({
            title: "حدث خطأ",
            message: "تم إلغاء تنزيل الملف"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.STORAGE.UNKNOWN) {
          this.$q.dialog({
            title: "حدث خطأ",
            message: "حدث خطأ اثناء تنزيل الملف"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#application-status:hover {
  cursor: pointer;
  color: blue;
}
</style>
