<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">المعلمين المسجلين</p>

    <!-- Teachers Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">قائمة المعلمين</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="isAddTeacherDialogOpen = true"
        >إضافة معلم جديد</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_TEACHERS" :columns="columns" row-key="name" :loading="GET_LOADING">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="email" :props="props">{{ props.row.email }}</q-td>
              <q-td key="phone" :props="props">{{ props.row.phone | getPhoneString }}</q-td>
              <q-td key="isActive" :props="props">{{ props.row.isActive | getArabicStatus }}</q-td>
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="showEditTeacherDialog(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="showDeleteTeacherDialog(props.row)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add Teacher Dialog -->
    <AddTeacherDialog
      :isTeacherDialogOpen="isAddTeacherDialogOpen"
      dialogTitle="إضافة معلم جديد"
      @closeTeacherDialog="isAddTeacherDialogOpen = false"
    />

    <!-- Edit Teacher Dialog -->
    <EditTeacherDialog
      :isTeacherDialogOpen="isEditTeacherDialogOpen"
      dialogTitle="تحديث بيانات معلم مسجل"
      :teacher="selectedTeacher"
      @closeTeacherDialog="closeEditTeacherDialog"
    />

    <!-- Delete Teacher Dialog -->
    <DeleteTeacherDialog
      :isAlertDialogOpen="isDeleteTeacherDialogOpen"
      alertTitle="هل أنت متأكد من حذف المعلم؟"
      @alertAction="deleteTeacher"
      @closeAlertDialog="closeDeleteTeacherDialog"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";

export default {
  name: "PageRegisteredTeachers",
  data() {
    return {
      isAddTeacherDialogOpen: false,
      isEditTeacherDialogOpen: false,
      isDeleteTeacherDialogOpen: false,
      selectedTeacher: {},
      columns: [
        {
          name: "name",
          label: "اسم المعلم",
          field: "name",
          required: true,
          align: "left",
        },
        {
          name: "email",
          label: "البريد الإلكتروني",
          field: "email",
          required: true,
          align: "left",
        },
        {
          name: "phone",
          label: "رقم الهاتف",
          field: "phone",
          required: true,
          align: "left",
        },
        {
          name: "isActive",
          label: "الحالة",
          field: "isActive",
          required: true,
          align: "left",
        },
        {
          name: "edit",
          required: true,
          label: "تعديل",
          field: "edit",
          align: "right",
        },
        {
          name: "delete",
          required: true,
          label: "حذف",
          field: "delete",
          align: "right",
        },
      ],
    };
  },
  created() {
    this.FETCH_TEACHERS();
  },
  computed: {
    ...mapGetters({
      GET_TEACHERS: GETTERS.TEACHERS.GET_TEACHERS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      ADD_TEACHER: ACTIONS.TEACHERS.ADD_TEACHER,
      EDIT_TEACHER: ACTIONS.TEACHERS.EDIT_TEACHER,
      DELETE_TEACHER: ACTIONS.TEACHERS.DELETE_TEACHER,
      FETCH_TEACHERS: ACTIONS.TEACHERS.FETCH_TEACHERS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    showEditTeacherDialog(teacher) {
      this.selectedTeacher = {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        phone: `${teacher.phone}`.slice(4),
        isActive: teacher.isActive,
      };

      this.isEditTeacherDialogOpen = true;
    },
    showDeleteTeacherDialog(teacher) {
      this.selectedTeacher = teacher;
      this.isDeleteTeacherDialogOpen = true;
    },
    deleteTeacher() {
      if (Object.keys(this.selectedTeacher).length > 0) {
        this.DELETE_TEACHER(this.selectedTeacher.id);
      }
    },
    closeEditTeacherDialog(value) {
      this.selectedTeacher = {};
      this.isEditTeacherDialogOpen = value;
    },
    closeDeleteTeacherDialog(value) {
      this.selectedTeacher = {};
      this.isDeleteTeacherDialogOpen = value;
    },
  },
  filters: {
    getArabicStatus(value) {
      if (value) return "نشط";
      else return "موقوف";
    },
    getPhoneString(value) {
      if (typeof value === "undefined") {
        return "غير مسجل";
      } else {
        return `${value}`.slice(4);
      }
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.TEACHER_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_TEACHERS();
          this.isAddTeacherDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تمت إضافة معلم جديد بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.TEACHER_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_TEACHERS();
          this.isEditTeacherDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث بيانات المعلم بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.TEACHER_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_TEACHERS();
          this.isDeleteTeacherDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف بيانات المعلم بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_TEACHER_ERROR) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء محاولة إضافة معلم جديد",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.TEACHER_ALREADY_EXISTED) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "المعلم مسجل بالفعل، الرجاء التأكد من بيانات المعلم",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.EDIT_TEACHER_ERROR) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ اثناء محاولة تحديث بيانات المعلم",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.DELETE_TEACHER_ERROR) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ اثناء محاولة حذف بيانات المعلم",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    },
  },
  components: {
    AddTeacherDialog: () => import("components/TeacherDialog.vue"),
    EditTeacherDialog: () => import("components/TeacherDialog.vue"),
    DeleteTeacherDialog: () => import("components/AlertDialog.vue"),
  },
};
</script>