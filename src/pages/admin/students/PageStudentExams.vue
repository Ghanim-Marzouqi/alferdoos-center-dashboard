<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">الإختبارات</p>
    <div class="q-pa-md">
      <q-table
        title="قائمة الطلاب المؤهلين لإداء الإختبار"
        :data="GET_TO_BE_EXAMMED_STUDENTS"
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
            <q-td key="write" :props="props">
              <q-btn dense flat>
                <q-icon color="teal" name="o_edit" />
              </q-btn>
            </q-td>
            <q-td key="recite" :props="props">
              <q-btn dense flat>
                <q-icon color="blue" name="o_hearing" />
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
import { date } from "quasar";

export default {
  name: "PageStudentExams",
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
          name: "createdAt",
          required: true,
          label: "وقت وتاريخ تقديم الطلب",
          align: "center",
          field: row => row.createdAt,
          format: val => `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`
        },
        {
          name: "write",
          align: "center",
          label: "إختبار تحريري",
          field: "write"
        },
        {
          name: "recite",
          align: "center",
          label: "تسميع",
          field: "recite"
        }
      ]
    };
  },
  created() {
    this.FETCH_TO_BE_EXAMMED_STUDENTS();
  },
  computed: {
    ...mapGetters("admins", [
      "GET_TO_BE_EXAMMED_STUDENTS",
      "GET_LOADER",
      "GET_MESSAGES",
      "GET_ERRORS"
    ])
  },
  methods: {
    ...mapActions("admins", [
      "FETCH_TO_BE_EXAMMED_STUDENTS",
      "DELETE_REGISTERED_STUDENT",
      "CLEAR_ERRORS_AND_MESSAGES",
      "EDIT_APPLICATION_STATUS",
      "SET_ERROR"
    ])
  },
  filters: {
    formatDate(val) {
      return `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`;
    }
  }
};
</script>

<style>
</style>