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
      <div v-for="student in  students" :key="student.id" class="col-2">
          <q-card v-if="isGroupSelecte" class="my-card" style="margin:10px;">
      <div class="row justify-center" style="marjin-top:-20px;">
        <p style="font-size:15px; margin-top:10px">
          {{ student.name }} <br>
        </p>
      </div>

      <q-card-actions align="right">
        <q-btn :disable="student.isLate || student.isLeave" flat round @click="student.attend = !student.attend,changeHappen = true " :color="student.attend ? 'green' : 'red'" icon="how_to_reg" />
        <q-btn :disable="!student.attend" flat round @click="timeType = 'late', TimerDialog = true ,selectedStudent = student,changeHappen = true" :color="student.late > 0 ? 'red' :'green'" icon="alarm" />
        <q-btn :disable="!student.attend" flat round @click="timeType = 'leave', TimerDialog = true ,selectedStudent = student,changeHappen = true" :color="student.leave > 0 ? 'red' :'green'" icon="follow_the_signs" />
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
  },
  data() {
    return {
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
      students : [],
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
    }),

    changeGroup() {
        this.students = this.allStudents.filter(student => student.groupId == this.group.value);
    },
    saveBehavior() {
     
    },
  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_USER : GETTERS.AUTH.GET_USER,
      GET_STUDENTS : GETTERS.STUDNETS.GET_STUDENTS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
    }),
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
        isLate : false,
        isLeave : false,
      }));
    },
    GET_SCHADUALS : function(oldState,newState) {
      Object.values(newState)
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