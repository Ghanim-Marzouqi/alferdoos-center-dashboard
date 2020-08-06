<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">قائمة الطلاب المقبولين</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلاب القبولين للدراسة في المركز"
        :data="students"
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
            <q-td key="group" :props="props">{{ showStudentGroup(props.row) }}</q-td>
            <q-td key="dashboard" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="show" :props="props">
              <q-btn dense flat @click.stop="goToStudentDashboard(props.row)">
                <q-icon color="purple" name="o_assignment_ind" />
              </q-btn>
            </q-td>
            <q-td key="edit" :props="props">
              <q-btn dense flat @click.stop="showJoinGroupDialog(props.row)">
                <q-icon color="teal" name="o_login" />
              </q-btn>
            </q-td>
            <q-td key="withdraw" :props="props">
              <q-btn dense flat @click.stop="showWithdrawDialog(props.row)">
                <q-icon color="red" name="o_clear" />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <!-- Join Group Dialog -->
    <JoinGroupDialog
      :isJoinGroupDialogOpen="isJoinGroupDialogOpen"
      :student="selectedStudent"
      :groupId="selectedGroupId"
      @closeJoinGroupDialog="closeJoinGroupDialog"
    />

    <!-- Student Registration Info Dialog -->
    <StudentRegistrationInfoDialog
      :isStudentDialogOpen="isStudentDialogOpen"
      :student="selectedStudent"
      @closeStudentRegistrationInfoDialog="isStudentDialogOpen = false"
    />

    <!-- Withdraw Dialog -->
    <WithDrawDialog
      :isPromptDialogOpen="isWithdrawDialogOpen"
      promptTitle="هل أنت متأكد من إنسحاب الطالب؟"
      promptLabel="أسباب الإنسحاب"
      @closePromptDialog="closeWithdrawDialog"
      @promptAction="withdrawStudent"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ACTIONS,
  STUDENT_STATUS,
  MESSAGES,
  ERRORS,
} from "../../../config/constants";

export default {
  name: "PageStudentList",
  data() {
    return {
      isJoinGroupDialogOpen: false,
      isStudentDialogOpen: false,
      isWithdrawDialogOpen: false,
      filter: "",
      students: [],
      selectedStudent: {},
      selectedGroupId: "",
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم الطالب",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
        },
        {
          name: "group",
          required: true,
          label: "اسم المجموعة",
          align: "left",
          field: (row) => row.groupName,
          format: (val) => `${val}`,
        },
        {
          name: "show",
          align: "center",
          label: "الملف الشخصي",
          field: "show",
        },
        {
          name: "dashboard",
          align: "center",
          label: "سجل الطالب",
          field: "dashboard",
        },
        {
          name: "edit",
          align: "center",
          label: "إنضمام إلى مجموعة",
          field: "edit",
        },
        {
          name: "withdraw",
          align: "center",
          label: "إنسحاب",
          field: "withdraw",
        },
      ],
    };
  },
  created() {
    this.loadStudentData();
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_STUDENT_GROUP: GETTERS.GROUPS.GET_STUDENT_GROUP,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETECH_GROUP_BY_ID: ACTIONS.GROUPS.FETECH_GROUP_BY_ID,
      EDIT_STUDENT_STATUS: ACTIONS.STUDNETS.EDIT_STUDENT_STATUS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    async loadStudentData() {
      await this.FETCH_STUDENTS({ status: STUDENT_STATUS.STUDY });
      if (this.GET_STUDENTS.length > 0) {
        this.students = [];
        this.GET_STUDENTS.forEach(async (student) => {
          if (
            typeof student.groupId !== "undefined" &&
            student.groupId !== ""
          ) {
            await this.FETECH_GROUP_BY_ID({ groupId: student.groupId });
            if (Object.keys(this.GET_STUDENT_GROUP).length > 0) {
              this.students.push({
                ...student,
                groupId: this.GET_STUDENT_GROUP.groupId,
                groupName: this.GET_STUDENT_GROUP.groupName,
              });
            } else {
              this.students.push({
                ...student,
                groupId: "",
                groupName: "",
              });
            }
          } else {
            this.students.push({
              ...student,
              groupId: "",
              groupName: "",
            });
          }
        });
      }
    },
    showStudentGroup(student) {
      if (student.groupName) {
        return student.groupName;
      } else {
        return "لم يتم الإنضمام إلى مجموعة";
      }
    },
    showStudentDialog(student) {
      this.selectedStudent = student;
      this.isStudentDialogOpen = true;
    },
    goToStudentDashboard(student) {
      if (student.groupId && student.groupId !== "") {
        this.$router.push(`/admin/${student.id}/student-dashboard`);
      } else {
        this.$q.dialog({
          title: "تنبيه",
          message: "يجب إضافة الطالب إلى مجموعة قبل عرض سجل الطالب",
        });
      }
    },
    showJoinGroupDialog(student) {
      this.selectedStudent = student;

      if (this.selectedStudent.groupId) {
        this.selectedGroupId = this.selectedStudent.groupId;
      }

      this.isJoinGroupDialogOpen = true;
    },
    showWithdrawDialog(student) {
      this.selectedStudent = student;
      this.isWithdrawDialogOpen = true;
    },
    withdrawStudent(value) {
      this.EDIT_STUDENT_STATUS({
        id: this.selectedStudent.id,
        status: STUDENT_STATUS.WITHDRAW,
        reasons: value,
      });
    },
    closeJoinGroupDialog(value) {
      this.isJoinGroupDialogOpen = value;
    },
    closeWithdrawDialog(value) {
      this.isWithdrawDialogOpen = value;
    },
  },
  watch: {
    GET_MESSAGES: async function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.STUDENT_GROUP_JOINED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.selectedStudent = {};
          this.isJoinGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة الطالب إلى المجموعة",
          });
          this.loadStudentData();
        }

        if (messageCode === MESSAGES.DATABASE.STUDENT_STATUS_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.selectedStudent = {};
          this.isWithdrawDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث حالة الطالب",
          });
          this.loadStudentData();
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.JOIN_STUDENT_TO_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.selectedStudent = {};
          this.isJoinGroupDialogOpen = false;
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء إضافة الطالب إلى مجموعة",
          });
        }
      }
    },
  },
  components: {
    JoinGroupDialog: () => import("components/JoinGroupDialog.vue"),
    StudentRegistrationInfoDialog: () =>
      import("components/StudentRegistrationInfoDialog.vue"),
    WithDrawDialog: () => import("components/PromptDialog.vue"),
  },
};
</script>
