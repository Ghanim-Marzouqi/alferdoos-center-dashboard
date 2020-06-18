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
        row-key="id"
        :filter="filter"
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
            <q-td key="file" :props="props">
              <q-btn dense flat @click.stop="showStudentDialog(props.row)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="write" :props="props">{{ props.row.write }}</q-td>
            <q-td key="recite" :props="props">{{ props.row.recite }}</q-td>
            <q-td key="read" :props="props">{{ props.row.read }}</q-td>
            <q-td key="commoknowledge" :props="props">{{ props.row.commoknowledge }}</q-td>
            <q-td key="personal" :props="props">{{ props.row.personal }}</q-td>
            <q-td
              key="total"
              class="text-weight-bold"
              :props="props"
            >{{ (props.row.write + props.row.recite + props.row.read + props.row.commoknowledge + props.row.personal) }}</q-td>
            <q-td key="status" :props="props">
              <q-btn dense flat @click.stop="editStudentStatus(props.row)">
                <q-icon color="primary" name="o_edit" />
              </q-btn>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, STUDENT_STATUS } from "../../../config/constants";

export default {
  name: "PageExamResults",
  data() {
    return {
      filter: "",
      tableData: [],
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
        },
        {
          name: "total",
          align: "center",
          label: "المجموع"
        },
        {
          name: "status",
          align: "center",
          label: "حالة القبول",
          field: "status"
        }
      ]
    };
  },
  created() {
    this.FETCH_STUDENTS({ status: STUDENT_STATUS.EXAM });
    this.FETCH_STUDENTS_MARKS();
  },
  mounted() {
    if (
      this.GET_STUDENTS &&
      this.GET_STUDENTS.length > 0 &&
      this.GET_STUDENTS_MARKS &&
      this.GET_STUDENTS_MARKS.length > 0
    ) {
      this.GET_STUDENTS.forEach(student => {
        let studentMarks = this.GET_STUDENTS_MARKS.find(
          s => s.studentId === student.id
        );

        if (studentMarks) {
          this.tableData.push({
            studentId: student.id,
            name: student.name,
            file: student,
            write: this.sum(
              "marks",
              studentMarks.written &&
                typeof studentMarks.written !== "undefined"
                ? studentMarks.written
                : []
            ),
            recite: this.sum(
              "marks",
              studentMarks.recite && typeof studentMarks.recite !== "undefined"
                ? studentMarks.recite
                : []
            ),
            read: this.sum(
              "marks",
              studentMarks.reading &&
                typeof studentMarks.reading !== "undefined"
                ? studentMarks.reading
                : []
            ),
            personal: this.sum(
              "marks",
              studentMarks.personal &&
                typeof studentMarks.personal !== "undefined"
                ? studentMarks.personal
                : []
            ),
            commoknowledge: studentMarks.commonKnowledge
              ? studentMarks.commonKnowledge
              : 0
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_STUDENTS_MARKS: GETTERS.STUDNETS.GET_STUDENTS_MARKS
    })
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_STUDENTS_MARKS: ACTIONS.STUDNETS.FETCH_STUDENTS_MARKS
    }),
    sum(key, array) {
      return array.reduce((a, b) => a + (b[key] || 0), 0);
    },
    showStudentDialog(student) {},
    editStudentStatus(student) {}
  }
};
</script>
