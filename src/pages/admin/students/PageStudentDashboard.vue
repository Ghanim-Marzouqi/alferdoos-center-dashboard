<template>
  <q-page padding>
    <div class="fit row inline wrap items-center">
      <q-btn flat color="primary" to="/admin/student-list">
        <q-icon name="keyboard_arrow_right" size="md"></q-icon>
      </q-btn>
      <p class="text-h6 text-weight-bold q-ma-sm">{{ student.name }}</p>
    </div>
    <div class="row">
      <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12">
        <div
          class="row"
          style="
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div class="col-6">
            <p class="text-weight-bold">المجموعة:</p>
            <p class="text-blue" style="font-size: 20px">
              {{ GET_STUDENT_GROUP.groupName }}
            </p>
          </div>
          <div class="col-6">
            <p class="text-weight-bold">ولي الأمر:</p>
            <p class="text-blue" style="font-size: 20px">
              {{ student.parentName }}
            </p>
          </div>
        </div>
        <div
          class="row student-info-row"
          style="
            height: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div class="col-6">
            <p class="text-weight-bold">أنهى الصف:</p>
            <p class="text-blue" style="font-size: 20px">
              {{ getStudentClass }}
            </p>
          </div>
          <div class="col-6">
            <p class="text-weight-bold">رقم ولي الأمر:</p>
            <p class="text-blue" style="font-size: 20px">
              {{ student.firstPhoneNumber }}
            </p>
          </div>
        </div>
      </div>
      <div class="col-xl-4 col-md-4 col-sm-12 col-xs-12">
        <q-img
          :src="student.imageURL"
          :ratio="4 / 3"
          style="height: auto; width: 100%"
          class="q-pa-md"
          position="50% 30%"
        >
          <template v-slot:error>
            <div class="absolute-full flex flex-center bg-negative text-white">
              لا يمكن تحميل الصورة
            </div>
          </template>
        </q-img>
      </div>
    </div>
    <div class="q-mt-md">
      <div class="row wrap justify-center items-center">
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon
              style="font-size: 75px"
              color="primary"
              name="o_thumbs_up_down"
            ></q-icon>
            <p style="font-size: 30px; font-weight: bold">سلوكيات الطالب</p>

            <q-card-actions align="center">
              <q-chip
                @click="(isBehaviorDialogOpened = true), (btype = Good)"
                clickable
              >
                <q-avatar
                  color="green"
                  icon="fas fa-thumbs-up"
                  text-color="white"
                >
                </q-avatar>
                {{ student.goodBehaviors }}
              </q-chip>
              <q-chip
                clickable
                @click="(btype = Bad), (isBehaviorDialogOpened = true)"
              >
                <q-avatar
                  color="red"
                  icon="fas fa-thumbs-down"
                  text-color="white"
                >
                </q-avatar>
                {{ student.badBehaviors }}
              </q-chip>
            </q-card-actions>
          </q-card>
        </div>
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon
              clickable
              @click="isAbsenceRecordsDialogOpen = true"
              style="font-size: 75px"
              color="primary"
              name="o_flaky"
            ></q-icon>
            <p style="font-size: 30px; font-weight: bold">الحضور والإنصراف</p>
          </q-card>
        </div>
      </div>
    </div>
    <div class="q-mt-md">
      <div class="row wrap justify-center items-center">
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon
            @click="isMemoMarksDialogOpen = true"
              style="font-size: 75px"
              color="primary"
              name="o_menu_book"
            ></q-icon>
            <p style="font-size: 30px; font-weight: bold">المحفوظات</p>
          </q-card>
        </div>
        <div class="col-6">
          <q-card class="column justify-center items-center">
            <q-icon
              clickable
              @click="isSchedualDialogOpen = true"
              style="font-size: 75px"
              color="primary"
              name="o_book"
            ></q-icon>
            <p style="font-size: 30px; font-weight: bold">
              المواد والحصص الدراسية
            </p>
          </q-card>
        </div>
      </div>
    </div>

    <BehaviorDialog
      :isOpen="isBehaviorDialogOpened"
      :studentId="student.id"
      :btype="btype"
      @close="isBehaviorDialogOpened = false"
    />

    <SchedualDialog
      :isOpen="isSchedualDialogOpen"
      :groupId="student.groupId"
      @close="isSchedualDialogOpen = false"
    />

<MemoMarksDialog
      :isOpen="isMemoMarksDialogOpen"
      :studentId="student.id"
      :groupId="student.groupId"
      @close="isMemoMarksDialogOpen = false"
    />
    <AbsenceDialog
      :isOpen="isAbsenceRecordsDialogOpen"
      :studentId="student.id"
      :groupId="student.groupId"
      @close="isAbsenceRecordsDialogOpen = false"
    />
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
  components: {
    BehaviorDialog: () => import("components/StudentShowBehaviorsDialog"),
    AbsenceDialog: () => import("components/StudentShowAbsenceRecordsDialog"),
    SchedualDialog: () => import("components/StudentShowSchedualDialog"),
    MemoMarksDialog: () => import("components/StudentShowMemoMarksDialog"),
    
  },
  data() {
    return {
      isMemoMarksDialogOpen : false,
      isBehaviorDialogOpened: false,
      isAbsenceRecordsDialogOpen: false,
      isSchedualDialogOpen: false,
      btype: "",
      Good: "P",
      Bad: "N",
      studentId: "",
      student: {},
    };
  },
  async created() {
    this.studentId = this.$route.params.id;
    await this.FETCH_YEAR_INFO();
    await this.FETCH_BEHAVIOR({ year: this.GET_YEAR_INFO.name });
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
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
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
      FETCH_BEHAVIOR: ACTIONS.STUDNETS.FETCH_BEHAVIOR,
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
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