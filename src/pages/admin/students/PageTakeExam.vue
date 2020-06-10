<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">تقديم الإختبار</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلاب المؤهلين لأداء الإختبار"
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
            <q-td key="file" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="write" :props="props">
              <q-btn dense flat>
                <q-icon color="teal" name="o_edit" />
              </q-btn>
            </q-td>
            <q-td key="recite" :props="props">
              <q-btn dense flat>
                <q-icon color="brown" name="o_hearing" />
              </q-btn>
            </q-td>
            <q-td key="read" :props="props">
              <q-btn dense flat>
                <q-icon color="purple" name="o_record_voice_over" />
              </q-btn>
            </q-td>
            <q-td key="commoknowledge" :props="props">
              <q-btn dense flat>
                <q-icon color="indigo" name="o_local_library" />
              </q-btn>
            </q-td>
            <q-td key="personal" :props="props">
              <q-btn dense flat>
                <q-icon color="pink" name="o_sentiment_satisfied_alt" />
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
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, STUDENT_STATUS } from "../../../config/constants";

export default {
  name: "PageStudentExams",
  data() {
    return {
      filter: "",
      examType: "",
      isErrorDialogOpen: false,
      isStudentDialogOpen: false,
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
          name: "file",
          align: "center",
          label: "الملف الشخصي",
          field: "file"
        },
        {
          name: "write",
          align: "center",
          label: "الإملاء",
          field: "write"
        },
        {
          name: "recite",
          align: "center",
          label: "التسميع",
          field: "recite"
        },
        {
          name: "read",
          align: "center",
          label: "التلاوة",
          field: "read"
        },
        {
          name: "commoknowledge",
          align: "center",
          label: "الثقافة العامة",
          field: "commoknowledge"
        },
        {
          name: "personal",
          align: "center",
          label: "المهارات الشخصية",
          field: "personal"
        }
      ]
    };
  },
  created() {
    this.FETCH_STUDENTS({ status: STUDENT_STATUS.EXAM });
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
    showStudentDialog(student) {
      this.registeredStudent = student;
      this.isStudentDialogOpen = true;
    }
  },
  filters: {
    formatDate(val) {
      return `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`;
    }
  },
  components: {
    StudentRegistrationInfoDialog: () =>
      import("components/StudentRegistrationInfoDialog.vue")
  }
};
</script>
