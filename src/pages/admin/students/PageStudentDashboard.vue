<template>
  <q-page padding>
    <div class="fit row inline wrap items-center">
      <q-btn flat color="primary" to="/admin/student-list">
        <q-icon name="keyboard_arrow_right" size="md"></q-icon>
      </q-btn>
      <p class="text-h6 text-weight-bold q-ma-sm">{{ student.name }}</p>
    </div>
    <div class="row">
      <div class="col-8">
        <div
          class="row"
          style="height: 50%; display: flex; justify-content: center; align-items: center;"
        >
          <div class="col-6">
            <p class="text-weight-bold">المجموعة:</p>
            <p class="text-blue" style="font-size: 20px">{{ GET_STUDENT_GROUP.groupName }}</p>
          </div>
          <div class="col-6">
            <p class="text-weight-bold">ولي الأمر:</p>
            <p class="text-blue" style="font-size: 20px">{{ student.parentName }}</p>
          </div>
        </div>
        <div
          class="row student-info-row"
          style="height: 50%; display: flex; justify-content: center; align-items: center;"
        >
          <div class="col-6">
            <p class="text-weight-bold">أنهى الصف:</p>
            <p class="text-blue" style="font-size: 20px">{{ getStudentClass }}</p>
          </div>
          <div class="col-6">
            <p class="text-weight-bold">القرية / مكان الإقامة:</p>
            <p class="text-blue" style="font-size: 20px">{{ student.village }}</p>
          </div>
        </div>
      </div>
      <div class="col-4">
        <q-img
          :src="student.imageURL"
          :ratio="1"
          style="height: 200px; width: 200px"
          class="q-ma-sm"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">لا يمكن تحميل الصورة</div>
          </template>
        </q-img>
      </div>
    </div>
    <div class="q-mt-md">
      <div class="row wrap justify-center items-center">
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon style="font-size: 75px" color="primary" name="o_thumbs_up_down"></q-icon>
            <p style="font-size: 30px; font-weight: bold">سلوكيات الطالب</p>
          </q-card>
        </div>
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon style="font-size: 75px" color="primary" name="o_flaky"></q-icon>
            <p style="font-size: 30px; font-weight: bold">الحضور والإنصراف</p>
          </q-card>
        </div>
      </div>
    </div>
    <div class="q-mt-md">
      <div class="row wrap justify-center items-center">
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon style="font-size: 75px" color="primary" name="o_menu_book"></q-icon>
            <p style="font-size: 30px; font-weight: bold">المحفوظات</p>
          </q-card>
        </div>
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon style="font-size: 75px" color="primary" name="o_book"></q-icon>
            <p style="font-size: 30px; font-weight: bold">المواد والحصص الدراسية</p>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ACTIONS,
  STUDENT_STATUS,
  STUDENT_GRADE,
} from "../../../config/constants";

export default {
  name: "PageStudentDashboard",
  data() {
    return {
      studentId: "",
      student: {},
    };
  },
  created() {
    this.studentId = this.$route.params.id;
  },
  mounted() {
    if (this.GET_STUDENTS && this.GET_STUDENTS.length > 0) {
      this.student = this.GET_STUDENTS.find(
        (student) => student.id === this.studentId
      );
      this.FETECH_GROUP_BY_ID({
        groupId: this.student.groupId,
      });
    }
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_STUDENT_GROUP: GETTERS.GROUPS.GET_STUDENT_GROUP,
    }),
    getStudentClass() {
      switch (this.student.finishedClass) {
        case STUDENT_GRADE.GRADE_SEVEN:
          return "السابع";
        case STUDENT_GRADE.GRADE_EIGHT:
          return "الثامن";
        case STUDENT_GRADE.GRADE_NINE:
          return "التاسع";
        default:
          return "غير معروف";
      }
    },
  },
  methods: {
    ...mapActions({
      FETECH_GROUP_BY_ID: ACTIONS.GROUPS.FETECH_GROUP_BY_ID,
    }),
  },
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 95%;
  height: 200px;
  cursor: pointer;
}
</style>