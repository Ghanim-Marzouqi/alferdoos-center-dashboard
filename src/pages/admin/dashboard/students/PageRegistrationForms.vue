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
  </q-page>
</template>

<script>
import { date, Dialog } from "quasar";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "PageRegistrationForms",
  data() {
    return {
      showLink: "/student-dashboard",
      filter: "",
      loading: false,
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
    this.FETCH_REGIETERED_STUDENTS();
  },
  computed: {
    ...mapGetters("admins", ["GET_REGISTERED_STUDENTS", "GET_LOADER"])
  },
  methods: {
    ...mapActions("admins", ["FETCH_REGIETERED_STUDENTS"]),
    deleteStudentRegistrationForm(id) {
      console.log("Deleted ID", id);
    },
    showStudentDialog(student) {
      Dialog.create({
        title: student.name,
        html: true
      });
    }
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