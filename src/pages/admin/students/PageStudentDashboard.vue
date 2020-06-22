<template>
  <q-page padding>
    <div class="fit row inline wrap items-center">
      <q-btn flat color="primary" to="/admin/student-list">
        <q-icon name="keyboard_arrow_right" size="md"></q-icon>
      </q-btn>
      <p class="text-h6 text-weight-bold q-ma-sm">{{ student.name }}</p>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, STUDENT_STATUS } from "../../../config/constants";

export default {
  name: "PageStudentDashboard",
  data() {
    return {
      studentId: "",
      student: {}
    };
  },
  created() {
    this.studentId = this.$route.params.id;
  },
  mounted() {
    if (this.GET_STUDENTS && this.GET_STUDENTS.length > 0) {
      this.student = this.GET_STUDENTS.find(
        student => student.id === this.studentId
      );
    }
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS
    })
  }
};
</script>

<style>
</style>