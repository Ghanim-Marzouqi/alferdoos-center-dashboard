<template>
  <q-page padding>
    <div class="fit row inline wrap items-center">
      <q-btn flat color="primary" to="/admin/exams-dashboard">
        <q-icon name="keyboard_arrow_right" size="md"></q-icon>
      </q-btn>
      <p class="text-h6 text-weight-bold q-ma-sm">نتائج الإختبار</p>
    </div>
    <div class="q-pa-md">
      <q-table
        title="قائمة نتائج الطلاب المتقدمين لإداء الإختبار"
        :data="tableData"
        :columns="columns"
        row-key="name"
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
            <q-td auto-width>
              <q-btn
                key="expand"
                size="sm"
                color="primary"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
              />
            </q-td>
            <q-td key="name" :props="props">{{ props.row.name }}</q-td>
            <q-td key="file" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row.file)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="write" :props="props">{{ props.row.write }}</q-td>
            <q-td key="recite" :props="props">{{ props.row.recite }}</q-td>
            <q-td key="read" :props="props">{{ props.row.read }}</q-td>
            <q-td key="commoknowledge" :props="props">{{ props.row.commoknowledge }}</q-td>
            <q-td key="personal" :props="props">{{ props.row.personal }}</q-td>
            <q-td key="total" class="text-weight-bold" :props="props">{{ props.row.total }}</q-td>
            <q-td key="status" :props="props">
              <q-btn dense flat @click.stop="showEditStudentStatusDialog(props.row)">
                <q-icon color="teal" name="o_edit" />
              </q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <q-markup-table separator="vertical" flat bordered>
                <thead>
                  <tr class="bg-primary text-white">
                    <th colspan="4" class="text-center">
                      <strong>الملاحظات</strong>
                    </th>
                  </tr>
                  <tr class="bg-primary text-white">
                    <th style="width: 25%" class="text-center">الإملاء</th>
                    <th style="width: 25%" class="text-center">التسميع</th>
                    <th style="width: 25%" class="text-center">التلاوة</th>
                    <th style="width: 25%" class="text-center">اللجنة الرئيسية</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="width: 25%" class="text-center">{{ props.row.writtenNotes }}</td>
                    <td style="width: 25%" class="text-center">{{ props.row.reciteNotes }}</td>
                    <td style="width: 25%" class="text-center">{{ props.row.readingNotes }}</td>
                    <td style="width: 25%" class="text-center">{{ props.row.personalNotes }}</td>
                  </tr>
                </tbody>
              </q-markup-table>
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

    <!-- Edit Student Status Dialog -->
    <EditStudentStatusDialog
      :isDailogOpen="isEditStudentStatusDialogOpen"
      :student="registeredStudent"
      :status="studentStatus"
      :reasons="rejectionReasons"
      statusLabel="قبول للدراسة في المركز"
      statusVal="study"
      @closeDialog="closeEditStudentStatusDialog"
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
  name: "PageExamResults",
  data() {
    return {
      isStudentDialogOpen: false,
      isEditStudentStatusDialogOpen: false,
      isAlertDialogOpen: false,
      registeredStudent: {},
      studentStatus: "",
      rejectionReasons: "",
      filter: "",
      tableData: [],
      columns: [
        {
          name: "expand",
          required: true,
          align: "center",
        },
        {
          name: "name",
          required: true,
          label: "اسم الطالب",
          align: "left",
          field: (row) => row.name,
          format: (val) => `${val}`,
        },
        {
          name: "file",
          align: "center",
          label: "الملف الشخصي",
          field: "file",
        },
        {
          name: "write",
          align: "center",
          label: "الإملاء",
          field: "write",
          sortable: true,
        },
        {
          name: "recite",
          align: "center",
          label: "التسميع",
          field: "recite",
          sortable: true,
        },
        {
          name: "read",
          align: "center",
          label: "التلاوة",
          field: "read",
          sortable: true,
        },
        {
          name: "commoknowledge",
          align: "center",
          label: "الثقافة العامة",
          field: "commoknowledge",
          sortable: true,
        },
        {
          name: "personal",
          align: "center",
          label: "اللجنة الرئيسية",
          field: "personal",
          sortable: true,
        },
        {
          name: "total",
          align: "center",
          label: "المجموع",
          field: "total",
          sortable: true,
        },
        {
          name: "status",
          align: "center",
          label: "تعدبل الحالة",
          field: "status",
        },
      ],
    };
  },
  created() {
    this.updateStudentTableData();
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_STUDENTS_MARKS: GETTERS.STUDNETS.GET_STUDENTS_MARKS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_STUDENTS_MARKS: ACTIONS.STUDNETS.FETCH_STUDENTS_MARKS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    async updateStudentTableData() {
      await this.FETCH_STUDENTS({ status: "" });
      await this.FETCH_STUDENTS_MARKS();

      if (
        this.GET_STUDENTS &&
        this.GET_STUDENTS.length > 0 &&
        this.GET_STUDENTS_MARKS &&
        this.GET_STUDENTS_MARKS.length > 0
      ) {
        this.GET_STUDENTS.forEach((student) => {
          if (student.status !== STUDENT_STATUS.REVIEW) {
            let studentMarks = this.GET_STUDENTS_MARKS.find(
              (s) => s.studentId === student.id
            );

            if (studentMarks) {
              this.tableData.push({
                id: student.id,
                name: student.name,
                file: student,
                status: student.status,
                write: this.sum(
                  "marks",
                  studentMarks.written &&
                    typeof studentMarks.written !== "undefined"
                    ? studentMarks.written
                    : []
                ),
                writtenNotes: studentMarks.writtenNotes,
                recite: this.sum(
                  "marks",
                  studentMarks.recite &&
                    typeof studentMarks.recite !== "undefined"
                    ? studentMarks.recite
                    : []
                ),
                reciteNotes: studentMarks.reciteNotes,
                read: this.sum(
                  "marks",
                  studentMarks.reading &&
                    typeof studentMarks.reading !== "undefined"
                    ? studentMarks.reading
                    : []
                ),
                readingNotes: studentMarks.readingNotes,
                personal: this.sum(
                  "marks",
                  studentMarks.personal &&
                    typeof studentMarks.personal !== "undefined"
                    ? studentMarks.personal
                    : []
                ),
                personalNotes: studentMarks.personalNotes,
                commoknowledge: studentMarks.commonKnowledge
                  ? studentMarks.commonKnowledge
                  : 0,
              });

              // Calculate Total Marks
              this.tableData = this.tableData.map((item) => ({
                id: item.id,
                name: item.name,
                file: item.file,
                status: item.status,
                write: item.write,
                writtenNotes: item.writtenNotes,
                recite: item.recite,
                reciteNotes: item.reciteNotes,
                read: item.read,
                readingNotes: item.readingNotes,
                personal: item.personal,
                personalNotes: item.personalNotes,
                commoknowledge: item.commoknowledge,
                total:
                  item.write +
                  item.recite +
                  item.read +
                  item.personal +
                  item.commoknowledge,
              }));

              // Sort Marks Based On Total
              this.tableData = this.tableData.sort(
                (a, b) => parseInt(b["total"]) - parseInt(a["total"])
              );
            }
          }
        });
      }
    },
    sum(key, array) {
      return array.reduce((a, b) => a + (b[key] || 0), 0);
    },
    showStudentDialog(student) {
      this.registeredStudent = student;
      this.isStudentDialogOpen = true;
    },
    showEditStudentStatusDialog(student) {
      if (
        student.status === STUDENT_STATUS.EXAM ||
        student.status === STUDENT_STATUS.REJECT
      ) {
        this.registeredStudent = student;
        this.studentStatus = student.status;
        this.rejectionReasons =
          typeof student.rejectionReasons !== "undefined" &&
          student.rejectionReasons !== ""
            ? student.rejectionReasons
            : "";
        this.isEditStudentStatusDialogOpen = true;
      } else {
        this.$q.dialog({
          title: "تنبيه",
          message: "لا يمكن تعديل حالة الطالب",
        });
      }
    },
    closeEditStudentStatusDialog(value) {
      this.registeredStudent = {};
      this.studentStatus = "";
      this.rejectionReasons = "";
      this.isEditStudentStatusDialogOpen = value;
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.STUDENT_STATUS_UPDATED) {
          this.tableData = [];
          this.isEditStudentStatusDialogOpen = false;
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تعديل حالة الطالب بنجاح",
          });

          this.updateStudentTableData();
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.EDIT_STUDENT_STATUS_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "حدث خطأ",
            message: "حدث خطأ أثناء تعديل حالة الطالب",
          });
        }
      }
    },
  },
  components: {
    StudentRegistrationInfoDialog: () =>
      import("components/StudentRegistrationInfoDialog.vue"),
    EditStudentStatusDialog: () =>
      import("components/EditStudentStatusDialog.vue"),
  },
};
</script>
