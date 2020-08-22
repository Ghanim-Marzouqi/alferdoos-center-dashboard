<template>
  <q-page padding>
    <div class="row">
      <div class="col-12 col-lg-3 col-md-6 col-sm-6 col-xs-12 q-pa-xs">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-body1 text-weight-bold">طلبات التسجيل</div>
                <div class="q-pt-md">
                  <p class="text-weight-bold text-h4">{{ getFormApplicationCount }}</p>
                </div>
              </div>
              <div class="col-4 flex flex-center">
                <q-icon color="blue" size="xl" name="fas fa-file-signature" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-lg-3 col-md-6 col-sm-6 col-xs-12 q-pa-xs">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-body1 text-weight-bold">الطلاب المقبولين</div>
                <div class="q-pt-md">
                  <p class="text-weight-bold text-h4">{{ getAdmittedStudentsCount }}</p>
                </div>
              </div>
              <div class="col-4 flex flex-center">
                <q-icon color="green" size="xl" name="fas fa-user-check" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-lg-3 col-md-6 col-sm-6 col-xs-12 q-pa-xs">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-body1 text-weight-bold">الطلاب المرفوضين</div>
                <div class="q-pt-md">
                  <p class="text-weight-bold text-h4">{{ getRejectedStudentsCount }}</p>
                </div>
              </div>
              <div class="col-4 flex flex-center">
                <q-icon color="red" size="xl" name="fas fa-user-times" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-lg-3 col-md-6 col-sm-6 col-xs-12 q-pa-xs">
        <q-card>
          <q-card-section>
            <div class="row">
              <div class="col-8">
                <div class="text-body1 text-weight-bold">الطلاب المنسحبين</div>
                <div class="q-pt-md">
                  <p class="text-weight-bold text-h4">{{ getWithdrawnStudentsCount }}</p>
                </div>
              </div>
              <div class="col-4 flex flex-center">
                <q-icon color="purple" size="xl" name="fas fa-sign-out-alt" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6 col-xs-12 q-pa-xl">
        <BarGraph
          :formApplicationCount="getFormApplicationCount"
          :admittedStudentsCount="getAdmittedStudentsCount"
          :rejectedStudentsCount="getRejectedStudentsCount"
          :withdrawnStudentsCount="getWithdrawnStudentsCount"
        />
      </div>
      <div class="col-12 col-md-6 col-xs-12 q-pa-xl">
        <DoughnutChart
          :formApplicationCount="getFormApplicationCount"
          :admittedStudentsCount="getAdmittedStudentsCount"
          :rejectedStudentsCount="getRejectedStudentsCount"
          :withdrawnStudentsCount="getWithdrawnStudentsCount"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, STUDENT_STATUS } from "../../config/constants";

export default {
  name: "PageHome",
  data() {
    return {
      students: [],
      applicationForms: "",
      admittedStudents: "",
      rejectedStudents: "",
      withdrawnStudents: "",
    };
  },
  created() {
    this.FETCH_STUDENTS({ status: "" });
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
    }),
    getFormApplicationCount() {
      let students = this.GET_STUDENTS.filter(
        (student) => student.status === STUDENT_STATUS.REVIEW
      );
      if (students && students.length > 0) return students.length;
      else return 0;
    },
    getAdmittedStudentsCount() {
      let students = this.GET_STUDENTS.filter(
        (student) => student.status === STUDENT_STATUS.STUDY
      );
      if (students && students.length > 0) return students.length;
      else return 0;
    },
    getRejectedStudentsCount() {
      let students = this.GET_STUDENTS.filter(
        (student) => student.status === STUDENT_STATUS.REJECT
      );
      if (students && students.length > 0) return students.length;
      else return 0;
    },
    getWithdrawnStudentsCount() {
      let students = this.GET_STUDENTS.filter(
        (student) => student.status === STUDENT_STATUS.WITHDRAW
      );
      if (students && students.length > 0) return students.length;
      else return 0;
    },
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
    }),
  },
  components: {
    BarGraph: () => import("../../charts/StudentBarGraph"),
    DoughnutChart: () => import("../../charts/StudentDoughnutChart"),
  },
};
</script>
<style lang="scss" scoped>
.q-card {
  width: "100%";
}
</style>