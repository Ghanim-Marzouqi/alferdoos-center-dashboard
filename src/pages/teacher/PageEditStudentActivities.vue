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
            <q-chip :clickable="getPendingTotal(student.id,false) > 0" 
              @click="isPending=true,selectedStudent = student.id,isShowActivitDialogOpened = true">
              <q-avatar color="green" text-color="white" />{{ getPendingTotal(student.id,false)}}
            </q-chip>
            <q-chip :clickable="getTotal(student.id,true) > 0" 
              @click="isPending = false,selectedStudent = student.id,isShowActivitDialogOpened = true">
              <q-avatar color="red" text-color="white" />{{ getTotal(student.id,true)}}
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
              @click="openDialog(false,student)"
              round
              color="green"
              icon="fas fa-folder-plus"
            /></q-card-actions>
        </q-card>
      </div>
    </div>

    <ActivityDialog
      :isOpen="isActivityDialogOpen"
      :activity="activity"
      :isEdit="isEdit"
      @close="isActivityDialogOpen = false"
    />

    <ShowActivitesDialog
    :isOpen="isShowActivitDialogOpened"
    :studentId="selectedStudent"
    :isPending="isPending"
    @close="isShowActivitDialogOpened = false,selectedStudent = ''"/>

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
    ActivityDialog : () => import("components/StudentAddActivityDialog.vue"),
    ShowActivitesDialog : ()=> import('components/StudentManageActivitesDialog')
  },
  data() {
    return {
      groups: [],
      selectedStudent : "",
      isEdit: false,
      isActivityDialogOpen: false,
      isShowActivitDialogOpened : false,
      allStudents: [],
      students: [],
      isPending : false,
      group: "",
      activity: {
        year : "",
        isDone : false,
        endDate: "",
        startDate: "",
        semester: "",
        title: "",
        description: "",
        student: {},
        createdBy: "",
      },
    };
  },
  async created() {
    await this.FETCH_STUDENTS({ status: "" });
    await this.FETCH_SCHEDUAL();
    await this.FETCH_ACTIVITIES({ year : "2020"})
    this.GET_SCHADUALS.forEach((sch) => {
        Object.values(sch).forEach((day) => {
          if (Array.isArray(day)) {
            !day.some((session) => session.teacher.id == this.GET_USER.id)
              ? ""
              : !this.groups.some(g => g.value == sch.group.value) ?
               this.groups.push(sch.group) : "";
          }
        });
      });

    this.FETCH_YRAT_INFO();
  },
  methods: {
    ...mapActions({
      FETCH_ACTIVITIES: ACTIONS.STUDNETS.FETCH_ACTIVITIES,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_YRAT_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    getTotal(sid,status){
     let activites = this.GET_ACTIVITIES.filter(b => b.student.id == sid && b.isDone );
     return activites.length;
    },
    getPendingTotal(sid,status){
     let activites = this.GET_ACTIVITIES.filter(b => b.student.id == sid && !b.isDone );
     return activites.length;
    },
    openDialog(isEdit, student) {

      let sem = this.GET_YEAR_INFO.semesters[0];
      this.activity.createdBy = {
        id: this.GET_USER.id,
        name: this.GET_USER.name,
      };
      this.activity.semester = sem;
      this.activity.student = {id : student.id, name : student.name} ;
      this.activity.year = this.GET_YEAR_INFO.id;
      this.isActivityDialogOpen = true;
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
      GET_ACTIVITIES: GETTERS.STUDNETS.GET_ACTIVITIES,
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
    }),
  },
  watch: {
    GET_LOADING: function (newState) {
      
      newState ? this.$q.loading.show() : this.$q.loading.hide();
    },
    GET_STUDENTS: function (oldState, newState) {
      this.allStudents = newState.filter(
        (student) => student.groupId != undefined
      );
    },
    GET_MESSAGES: function (newState, oldState) {
      
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.ACTIVITY_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();

          this.FETCH_ACTIVITIES({year : "2020"});
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تمت تحديث النشاط بنجاح",
          });
        }

                if (messageCode === MESSAGES.DATABASE.STUDENT_ACTIVITY_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_ACTIVITIES({year : "2020"});
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف النشاط بنجاح",
          });
        }

        

        if (messageCode === MESSAGES.DATABASE.ACTIVITY_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_ACTIVITIES({year : "2020"});
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة النشاط بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.UPDATE_ACTIVITY_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء محاولة تحديث النشاط",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.STUDENT_DELETE_ACTIVITY_ERROR) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء محاولة حذف النشاط",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        

        if (errorCode === ERRORS.DATABASE.ADD_ACTIVITY_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء إضافة نشاط جديد",
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