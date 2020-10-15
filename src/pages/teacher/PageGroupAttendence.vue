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

      <div class="col-12 col-md-4">
        <q-btn @click="saveSchedual" round color="primary" text-color="white" icon="save" />
      </div>
    </div>

        <div class="row">
      <div v-for="ses in sessions" :key="ses.id" class="col-1">

     <q-chip clickable @click="changeSession(ses)" square :outline="!ses.selected" :color="ses.selected ? 'red' : 'green'" text-color="white" icon="event">
      {{ ses.name }}
    </q-chip>
      </div>
    </div>

    <div class="row justify-center">
      <h5 v-if="isGroupSelected && sessions.length == 0">لا توجد حصص مسجلة لهذه المجموعة</h5>
    </div>
        <div class="row">
      <div v-for="student in  attendanceRecords" :key="student.id" class="col-2">
          <q-card v-if="isGroupSelected && sessions.length > 0 && isSessoinSelected" class="my-card" style="margin:10px;">
      <div class="row justify-center" style="marjin-top:-20px;">
        <p style="font-size:15px; margin-top:10px">
          {{ student.name }} <br>
        </p>
      </div>

      <q-card-actions align="right">
        <q-btn :disable="student.isLate || student.isLeave" flat round @click="student.attend = !student.attend,changeHappen = true " :color="student.attend ? 'green' : 'red'" icon="how_to_reg" />
        <q-btn :disable="!student.attend" flat round @click="timeType = 'late',toTime= getTime(2), time = getTime(1),isTimeDialogOpen = true ,selectedStudent = student,changeHappen = true" :color="student.late > 0 ? 'red' :'green'" icon="alarm" />
        <q-btn :disable="!student.attend" flat round @click="timeType = 'leave', toTime= getTime(2), time = getTime(1),isTimeDialogOpen = true ,selectedStudent = student,changeHappen = true" :color="student.leave > 0 ? 'red' :'green'" icon="follow_the_signs" />
      </q-card-actions>
    </q-card>
      </div>
    </div>
    <TimeDialog
    :isOpen="TimerDialog"
    :student="selectedStudent"
    :type="timeType"
    :dialogTitle="title"
    @closeDialog="TimerDialog = false"
    />

   <TimePicker :isOpen="isTimeDialogOpen" 
     :fromTime="time"
     :toTime="toTime"
     @clear="clearResult"
     @cancel="isTimeDialogOpen = false"
     @saveTime="saveArrivalTime" />

  </q-page>
</template>

<script>
import subjects from "../../store/modules/subjects";
import students from "../../store/modules/students";
import { GETTERS, ACTIONS } from "../../config/constants";
import { mapGetters, mapActions } from "vuex";
const moment = require("moment");

export default {
  components : { 
    TimeDialog :()=> import("components/AttendenceTimeDialog.vue"),
    TimePicker : ()=> import('components/BoundedTimePicker.vue')
  },
  data() {
    return {
      time : "",
      toTime : "",
      isTimeDialogOpen : false,
      timeType : "",
      changeHappen : false,
      selectedStudent : {},
      updatedRecordId : 0,
      isSessoinSelected : false,
      date : moment(new Date()).format("DD/MM/YYYY"),
      title : "الوقت بالدقائق",
      TimerDialog : false,
      isEdit : false,
      isGroupSelected: false,
      teacherId : "",
      allStudents : [],
      attendanceRecords : [],
      selectedDate: new Date(),
      sessions : [],  
      group: "",
      groups: [],
    };
  },

  methods: {
    ...mapActions({
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_STUDENTS : ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_ATTENDANCE : ACTIONS.STUDNETS.FETCH_ATTENDANCE,
      SAVE_ATTENDEANCE : ACTIONS.STUDNETS.SAVE_ATTENDEANCE,
      UPDATE_ATTENDANCE : ACTIONS.STUDNETS.UPDATE_ATTENDANCE
    }),
    clearResult(){
      
    },
    getTime(type){
      let session = this.sessions.find(ses => ses.selected);
      return type ==1 ? session.fromTime : session.toTime;
    },
    saveArrivalTime(time){
     this.timeType == 'late' ? this.selectedStudent.late = time.mins : this.selectedStudent.leave = time.mins
     this.timeType == 'late' ? this.selectedStudent.isLate = true  : this.selectedStudent.isLeave = true;
     this.timeType == 'late' ? this.selectedStudent.arrivalTime = time.time.format("hh:mm") : this.selectedStudent.leavTime = time.time.format("hh:mm")
    },
    cancel(){
      this.selectedStudent = "";
      this.timeType = "";
      this.isTimeDialogOpen = false;

    },
    changeSession(ses){
      this.isSessoinSelected = true;
      this.changeHappen = false;
      let selected = {};
      this.sessions.forEach(session => {
        ses.id == session.id ? session.selected = true  : session.selected = false; 
        });

      if (this.GET_ATTENDANCE.some(record => record.session.id == ses.id)){
            let record = this.GET_ATTENDANCE.find( rec => rec.session.id == ses.id && rec.date == this.date);
            this.updatedRecordId = record.id;
            this.attendanceRecords = record.attendance;
            this.isEdit = true;
          } else{
            this.updatedRecordId = 0;
           this.isEdit = false;
           this.attendanceRecords = this.allStudents.filter(student => student.groupId == this.group.value)
    }
    },
    changeGroup() {
      this.isSessoinSelected = false;
      this.isGroupSelected = true;
      let schedual = this.GET_SCHADUALS.find((s) => s.group.value == this.group.value);
      if (schedual != undefined) {
        let day = new Date().getDay();
        this.sessions = schedual[day]
        .filter(session => session.teacher.id == this.GET_USER.id)
        .map(session => ({ toTime : session.toTime, fromTime : session.fromTime, id : session.id , name : session.subject.name ,day : day , selected : false}));
        this.attendanceRecords = this.allStudents.filter(student => student.groupId == this.group.value);
      }
    },
    saveSchedual() {
      if (this.isEdit)
        this.updateAttendance();
      else{
      let doc = { session : this.sessions.find(x => x.selected) , 
        date  :  this.date,
        group : this.group.value,
        takingBy : { id : this.GET_USER.id, name : this.GET_USER.name },
        attendance : this.attendanceRecords }
      this.SAVE_ATTENDEANCE(doc)
      }
      this.changeHappen = false;
    },
    updateAttendance(){
      let doc = {
        id : this.updatedRecordId,
        attendance : this.attendanceRecords
      }
      this.UPDATE_ATTENDANCE(doc);
      this.changeHappen = false;
    }

  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_USER : GETTERS.AUTH.GET_USER,
      GET_STUDENTS : GETTERS.STUDNETS.GET_STUDENTS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
      GET_ATTENDANCE : GETTERS.STUDNETS.GET_ATTENDANCE
    }),
    getDay() {
      return [this.selectedDate.getDay()];
    },
  },
  watch : {
    GET_STUDENTS : function(oldState,newState) {
      this.allStudents = newState.filter(student => student.groupId != undefined).map(student => ({
        studentId : student.id,
        name : student.name,
        groupId : student.groupId,
        notes : "",
        validExecuse : false,
        attend : true,
        late : 0,
        leave : 0,
        arrivalTime : "",
        leavTime : "",
        isLate : false,
        isLeave : false,
      }));
    },
    GET_SCHADUALS : function(oldState,newState) {
      this.schedual = newState;
    }
  },
  async created() {
    await this.FETCH_ATTENDANCE({ type : 1, year : moment(new Date()).format("DD/MM/YYYY")});
    await this.FETCH_GROUPS();
    await this.FETCH_SCHEDUAL();
    this.FETCH_STUDENTS({ status: "" });
    if (this.GET_GROUPS.length > 0) {
      this.groups = this.GET_GROUPS.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    }
  },
};
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>