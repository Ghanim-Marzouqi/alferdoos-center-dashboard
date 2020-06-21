<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">طلبات التسجيل</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة طلبات التقدم للمركز"
        :data="GET_STUDENTS"
        :columns="columns"
        row-key="id"
        :filter="filter"
        :loading="GET_LOADING"
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
            <q-td key="status" :props="props">{{ props.row.status | getStatus }}</q-td>
            <q-td key="show" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="edit" :props="props">
              <q-btn dense flat @click.stop="showApplicationStatusDialog(props.row)">
                <q-icon color="teal" name="o_edit" />
              </q-btn>
            </q-td>
            <q-td key="delete" :props="props">
              <q-btn dense flat @click.stop="deleteStudentRegistrationForm(props.row)">
                <q-icon color="red" name="o_delete" />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- Student Registration Info Dialog -->
    <StudentRegistrationInfoDialog
      :isStudentDialogOpen="isStudentDialogOpen"
      :student="registeredStudent"
      @closeStudentRegistrationInfoDialog="isStudentDialogOpen = false"
    />

    <!-- Student Edit Application Status Dialog -->
    <StudentEditApplicationStatusDialog
      :isEditApplicationDailogOpen="isEditApplicationDailogOpen"
      :student="registeredStudent"
      :status="applicationStatus"
      :reasons="applicationStatusReasons"
      @closeApplicationStatusDialog="closeApplicationStatusDialog"
    />
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ACTIONS,
  STUDENT_GRADE,
  MESSAGES,
  ERRORS,
  STUDENT_STATUS
} from "../../../config/constants";

export default {
  name: "PageRegistrationForms",
  data() {
    return {
      showLink: "/student-dashboard",
      filter: "",
      loading: false,
      isStudentDialogOpen: false,
      isEditApplicationDailogOpen: false,
      registeredStudent: {},
      applicationStatus: "",
      applicationStatusReasons: "",
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
        },
        {
          name: "edit",
          align: "center",
          label: "تعديل",
          field: "edit"
        },
        {
          name: "delete",
          align: "center",
          label: "حذف",
          field: "delete"
        }
      ],
      statuses: [
        {
          label: "قبول لأداء الإختبار",
          value: "accept_for_exam"
        },
        {
          label: "رفض الطلب",
          value: "reject"
        }
      ]
    };
  },
  created() {
    this.FETCH_STUDENTS({ status: "" });
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    })
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      DELETE_STUDENT: ACTIONS.STUDNETS.DELETE_STUDENT,
      EDIT_STUDENT_STATUS: ACTIONS.STUDNETS.EDIT_STUDENT_STATUS,
      SET_ERROR: ACTIONS.UI.SET_ERROR,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    deleteStudentRegistrationForm(student) {
      if (student.status === STUDENT_STATUS.REVIEW) {
        this.$q
          .dialog({
            title: "تنبيه",
            message: "هل أنت واثق من أنك تريد حذف هذا الطلب؟",
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            this.DELETE_STUDENT(student.id);
          });
      } else {
        this.$q.dialog({
          title: "تنبيه",
          message: "لا يمكن حذف طالب حالته ليست قيد المراجعة"
        });
      }
    },
    showStudentDialog(student) {
      this.registeredStudent = student;
      this.isStudentDialogOpen = true;
    },
    showApplicationStatusDialog(student) {
      console.log("Student", student);
      this.registeredStudent = student;
      this.applicationStatus = student.status;
      this.applicationStatusReasons =
        typeof student.rejectionReasons !== "undefined" &&
        student.rejectionReasons !== ""
          ? student.rejectionReasons
          : "";
      this.isEditApplicationDailogOpen = true;
    },
    closeApplicationStatusDialog() {
      this.registeredStudent = {};
      this.applicationStatus = "";
      this.applicationStatusReasons = "";
      this.isEditApplicationDailogOpen = false;
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
    GET_MESSAGES: function(newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.STUDENT_FORM_RECORD_DELETED) {
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف الطلب بنجاح"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_STUDENTS({ status: "" });
        }

        if (messageCode === MESSAGES.DATABASE.STUDENT_STATUS_UPDATED) {
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تعديل حالة الطلب بنجاح"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_STUDENTS({ status: "" });
        }
      }
    },
    GET_ERRORS: function(newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.STUDENT_FORM_RECORD_NOT_DELETED) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ اثناء حذف المستخدم"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

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

        if (errorCode === ERRORS.DATABASE.STUDENT_NOT_FOUND) {
          this.$q.dialog({
            title: "حدث خطأ",
            message: "لم يتم العثور على بيانات الطالب"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.EDIT_STUDENT_STATUS_ERROR) {
          this.$q.dialog({
            title: "حدث خطأ",
            message: "حدث خطأ أثناء تعديل حالة الطلب"
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    }
  },
  components: {
    StudentRegistrationInfoDialog: () =>
      import("components/StudentRegistrationInfoDialog.vue"),
    StudentEditApplicationStatusDialog: () =>
      import("components/StudentEditApplicationStatusDialog.vue")
  }
};
</script>

<style lang="scss">
textarea {
  resize: none !important;
}
</style>
