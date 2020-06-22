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
              <q-btn dense flat @click.stop="goToStudentDashboard(props.row.id)">
                <q-icon color="blue" name="o_visibility" />
              </q-btn>
            </q-td>
            <q-td key="edit" :props="props">
              <q-btn dense flat @click.stop="showEditStudentDialog(props.row)">
                <q-icon color="teal" name="o_edit" />
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
  name: "PageStudentList",
  data() {
    return {
      filter: "",
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
          label: "إستعراض",
          field: "show"
        },
        {
          name: "edit",
          align: "center",
          label: "تعديل",
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
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS
    }),
    goToStudentDashboard(studentId) {
      this.$router.push(`/admin/${studentId}/student-dashboard`);
    },
    showEditStudentDialog(student) {}
  }
};
</script>
