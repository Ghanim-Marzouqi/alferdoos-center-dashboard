<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">قائمة الطلاب المسجلين</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلاب المسجلين للدراسة في المركز"
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
            <q-td key="show" :props="props">
              <q-btn dense flat @click.stop="goToStudentDashboard(props.row)">
                <q-icon color="blue" name="o_assignment_ind" />
              </q-btn>
            </q-td>
            <q-td key="edit" :props="props">
              <q-btn dense flat @click.stop="showJoinGroupDialog(props.row)">
                <q-icon color="teal" name="o_login" />
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
      @closeJoinGroupDialog="closeJoinGroupDialog"
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
  ERRORS
} from "../../../config/constants";

export default {
  name: "PageStudentList",
  data() {
    return {
      isJoinGroupDialogOpen: false,
      filter: "",
      selectedStudent: {},
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
          name: "show",
          align: "center",
          label: "سجل الطالب",
          field: "show"
        },
        {
          name: "edit",
          align: "center",
          label: "إنضمام إلى مجموعة",
          field: "edit"
        }
      ]
    };
  },
  created() {
    this.FETCH_STUDENTS({ status: STUDENT_STATUS.STUDY });
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
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    goToStudentDashboard(student) {
      if (student.groupId && student.groupId !== "") {
        this.$router.push(`/admin/${student.id}/student-dashboard`);
      } else {
        this.$q.dialog({
          title: "تنبيه",
          message: "يجب إضافة الطالب إلى مجموعة قبل عرض سجل الطالب"
        });
      }
    },
    showJoinGroupDialog(student) {
      if (student.groupId && student.groupId !== "") {
        this.$q.dialog({
          title: "تنبيه",
          message: "تم إضافة الطالب إلى مجموعة مسبقا"
        });
      } else {
        this.selectedStudent = student;
        this.isJoinGroupDialogOpen = true;
      }
    },
    closeJoinGroupDialog(value) {
      this.isJoinGroupDialogOpen = value;
    }
  },
  watch: {
    GET_MESSAGES: async function(newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.STUDENT_GROUP_JOINED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.selectedStudent = {};
          this.isJoinGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة الطالب إلى المجموعة"
          });
          this.FETCH_STUDENTS({ status: STUDENT_STATUS.STUDY });
        }
      }
    },
    GET_ERRORS: function(newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.JOIN_STUDENT_TO_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.selectedStudent = {};
          this.isJoinGroupDialogOpen = false;
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء إضافة الطالب إلى مجموعة"
          });
        }
      }
    }
  },
  components: {
    JoinGroupDialog: () => import("components/JoinGroupDialog.vue")
  }
};
</script>
