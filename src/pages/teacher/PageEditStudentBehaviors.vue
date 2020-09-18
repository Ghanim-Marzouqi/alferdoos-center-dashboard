<template>
  <q-page>
    <div class="row justify-center q-pa-lg">
      <div class="col-12 col-md-4">
        <q-select
          filled
          @input="changeGroup"
          v-model="group"
          :options="groups"
          label="إختر مجموعة"
        />
      </div>
    </div>

    <div class="row">
      <div v-for="student in  students" :key="student.id" class="col-md-3">
        <q-card class="my-card q-ma-md" style="margin-top:10px;">
          <div class="row justify-center q-mt-md" >
            <q-chip :clickable="getTotal(Good,student.id) > 0" @click="showBehaviors(Good,student.id)">
              <q-avatar color="green" text-color="white" />{{ getTotal(Good,student.id)}}
            </q-chip>
            <q-chip :clickable="getTotal(Bad,student.id) > 0" @click="showBehaviors(Bad,student)">
              <q-avatar color="red" text-color="white" />{{ getTotal(Bad,student.id)}}
            </q-chip>
          </div>
          <div class="row justify-center q-ma-md">
            <p style="font-size:15px; margin-top:10px">
              {{ student.name }}
              <br />
            </p>
          </div>
          <q-card-actions align="right">
            <q-btn
              flat
              @click="openDialog(Good,false,student)"
              round
              color="green"
              icon="fas fa-thumbs-up"
            />
            <q-btn @click="openDialog(Bad,false,student)" flat round color="red" icon="fas fa-thumbs-down" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <BehaviorDialog
      :isOpen="isBehaviorDialogOpen"
      :behavior="behavior"
      :isEdit="isEdit"
      :title="title"
      @close="isBehaviorDialogOpen = false"
    />
  </q-page>
</template>

<script>
import subjects from "../../store/modules/subjects";
import students from "../../store/modules/students";
import { GETTERS, ACTIONS, MESSAGES } from "../../config/constants";
import { mapGetters, mapActions } from "vuex";
const moment = require("moment");

export default {
  components: {
    BehaviorDialog: () => import("components/StudentAddPosBehaviorDialog.vue"),
  },
  data() {
    return {
      groups: [],
      Good: "P",
      Bad: "N",
      date: moment(new Date()).format("DD/MM/YYYY"),
      title: "الوقت بالدقائق",
      isEdit: false,
      isBehaviorDialogOpen: false,
      allStudents: [],
      students: [],
      group: "",
      behavior: {
        type: "",
        date: "",
        reportingDate: "",
        year: "",
        semester: "",
        title: "",
        description: "",
        student: {},
        createdBy: "",
      },
    };
  },
  async created() {
    await this.FETCH_SCHEDUAL();
    await this.FETCH_BEHAVIOR({ year : "2020"})
    this.FETCH_STUDENTS({ status: "" });
    this.FETCH_YRAT_INFO();
  },
  methods: {
    ...mapActions({
      FETCH_BEHAVIOR: ACTIONS.STUDNETS.FETCH_BEHAVIOR,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_YRAT_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    showBehaviors(type,sid){},
    getTotal(type,sid){
     let behavior = this.GET_BEHAVIORS.filter(b => b.behaviorType == type && b.student.id == sid);
     return behavior.length;
    },
    openDialog(beh, isEdit, student) {
      // TODO add active semester and handle it here
      this.title =
        beh == "P"
          ? isEdit
            ? "تعديل سلوك إيجابي"
            : "إضافة أسلوب إيجابي"
          : isEdit
          ? "تعديل سلوك سلبي"
          : "إضافة سلوك سلبي";

      let sem = this.GET_YEAR_INFO.semesters[0];
      this.behavior.createdBy = {
        id: this.GET_USER.id,
        name: this.GET_USER.name,
      };
      this.behavior.semester = sem;
      this.behavior.student = {id : student.id, name :student.name} ;
      (this.behavior.type = beh), (this.behavior.year = this.GET_YEAR_INFO.id);
      this.behavior.reportingDate = this.date;
      this.isBehaviorDialogOpen = true;
    },
    changeGroup() {
      this.students = this.allStudents.filter(
        (student) => student.groupId == this.group.value
      );
    },
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_BEHAVIORS: GETTERS.STUDNETS.GET_BEHAVIORS,
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
    }),
  },
  watch: {
    GET_LOADING: function (newState) {
      console.log("inside logging block");
      newState ? this.$q.loading.show() : this.$q.loading.hide();
    },
    GET_STUDENTS: function (oldState, newState) {
      this.allStudents = newState.filter(
        (student) => student.groupId != undefined
      );
    },
    GET_SCHADUALS: function (oldState, newState) {
      newState.forEach((sch) => {
        console.log(Object.values(sch));
        Object.values(sch).forEach((day) => {
          if (Array.isArray(day)) {
            day.some((session) => session.teacher.id == this.GET_USER.id)
              ? this.groups.push(sch.group)
              : "";
          }
        });
      });

      this.groups = this.groups.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    },
    GET_MESSAGES: function (newState, oldState) {
      console.log("inside messages block");
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.BEHAVIOR_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_BEHAVIOR();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تمت تحديث السلوك بنجاح بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.BEHAVIOR_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_BEHAVIOR();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة السلوك بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.TEACHER_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_TEACHERS();
          this.isDeleteTeacherDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف بيانات المعلم بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.UPDATE_BEHAVIOR_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء محاولة تحديث سلوك",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.ADD_BEHAVIOR_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء إضافة سلوك جديد",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    },
  },
};
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>
<style lang="scss" scoped>
.q-card {
  height: 200px;
  width : 95%;
  margin: 10px;
}
</style>