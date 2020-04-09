<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">طلبات التسجيل</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلاب المتقدمين للمركز"
        :data="GET_REGISTERED_STUDENTS"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="GET_LOADER"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="بحث">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="createdAt" :props="props">{{ props.row.createdAt | formatDate }}</q-td>
            <q-td key="show" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn dense flat @click.stop="deleteStudentRegistrationForm(props.row.id)">
                <q-icon color="red" name="o_delete" />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- Registered Student Dialog -->
    <q-dialog v-model="showStudentModal" full-width persistent @hide="resetStudntData">
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
                  <span class="text-weight-bold text-blue">{{ getStudentGrade }}</span>
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
                />
              </div>
            </div>
            <div class="row q-ml-md">
              <div class="col-xs-12 col-md-4">
                <P class="text-weight-bold">معلومات الحالة الصحية للطالب:</P>
                <p>
                  هل يعاني الطالب أي مرض:
                  <strong
                    class="text-blue"
                  >{{ registeredStudent.studentState === 'health' ? 'لا' : 'نعم' }}</strong>
                </p>
                <p>
                  الأعراض والأمراض التي يعاني منها الطالب:
                  <span
                    class="text-weight-bold"
                  >{{ registeredStudent.diseases === '' ? 'لا يوجد' : registeredStudent.diseases }}</span>
                </p>
              </div>
              <div class="col-xs-12 col-md-4">
                <P class="text-weight-bold">معلومات دراسية سابقة:</P>
                <p>
                  هل سبق للطالب التعلم في مركز لحفظ القرآن الكريم:
                  <strong
                    class="text-blue"
                  >{{ registeredStudent.isLearntInCenterBefore === "yes" ? 'نعم' : 'لا' }}</strong>
                </p>
                <p>
                  المكان:
                  <span
                    class="text-weight-bold"
                  >{{ registeredStudent.oldCenterName === '' ? 'لم يسبق للطالب التعلم في مدرسة لتحفيظ القرآن' : registeredStudent.oldCenterName }}</span>
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
                  >{{ registeredStudent.firstPhoneNumber }}</span> -
                  <span
                    class="text-weight-bold text-blue"
                  >{{ registeredStudent.secondPhoneNumber === '' ? 'لا يوجد' : registeredStudent.secondPhoneNumber }}</span>
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
          <q-btn flat label="حسنا" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PageRegistrationForms",
  data() {
    return {
      showLink: "/student-dashboard",
      filter: "",
      loading: false,
      showStudentModal: false,
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
          name: "show",
          align: "center",
          label: "إستعراض",
          field: "show"
        },
        {
          name: "delete",
          align: "center",
          label: "حذف",
          field: "delete"
        }
      ]
    };
  },
  created() {
    this.FETCH_REGISTERED_STUDENTS();
  },
  computed: {
    ...mapGetters("admins", [
      "GET_REGISTERED_STUDENTS",
      "GET_LOADER",
      "GET_MESSAGES",
      "GET_ERRORS"
    ]),
    getStudentGrade() {
      if (Object.keys(this.registeredStudent).length > 0) {
        if (this.registeredStudent.finishedClass === "grade_seven") {
          return "السابع";
        } else if (this.registeredStudent.finishedClass === "grade_eight") {
          return "الثامن";
        } else if (this.registeredStudent.finishedClass === "grade_nine") {
          return "التاسع";
        } else {
          return "غير معروف";
        }
      } else {
        return "غير معروف";
      }
    }
  },
  methods: {
    ...mapActions("admins", [
      "FETCH_REGISTERED_STUDENTS",
      "DELETE_REGISTERED_STUDENT",
      "CLEAR_ERRORS_AND_MESSAGES"
    ]),
    deleteStudentRegistrationForm(id) {
      this.$q
        .dialog({
          title: "تنبيه",
          message: "هل أنت واثق من أنك تريد حذف هذا الطلب؟",
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.DELETE_REGISTERED_STUDENT(id);
        });
    },
    showStudentDialog(student) {
      this.registeredStudent = student;
      this.showStudentModal = true;
    },
    downloadFile(fileURL) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function(event) {
          var blob = xhr.response;
        };
        xhr.open("GET", fileURL);
        xhr.send();

        console.log(xhr);
      } catch (error) {
        switch (error.code) {
          case "storage/object-not-found":
            console.log("File Does Not Exists");
            break;
          case "storage/unauthorized":
            console.log("User doesn't have permission to access the object");
            break;
          case "storage/canceled":
            console.log("User canceled the upload");
            break;
          case "storage/unknown":
            console.log("Unknown error occurred, inspect the server response");
            break;
          default:
            console.log(error);
        }
      }
    },
    resetStudntData() {
      this.registeredStudent = {};
    }
  },
  filters: {
    formatDate(val) {
      return `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`;
    }
  },
  watch: {
    GET_MESSAGES: function(newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === "database/student-form-record-deleted") {
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف الطلب بنجاح"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_REGISTERED_STUDENTS();
        }
      }
    },
    GET_ERRORS: function(newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === "database/student-form-record-not-deleted") {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ اثناء حذف المستخدم"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    }
  }
};
</script>

<style>
</style>