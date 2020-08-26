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
        <q-btn @click="saveSchedual" round color="amber" glossy text-color="white" icon="save" />
      </div>
    </div>

        <div class="row">
      <div v-for="ses in sessions" :key="ses.id" class="col-1">

     <q-chip clickable @click="changeSession(ses)" square :outline="!ses.selected" :color="ses.selected ? 'red' : 'green'" text-color="white" icon="event">
      {{ ses.name }}
    </q-chip>
      </div>
    </div>


        <div class="row">
      <div v-for="student in  students" :key="student.id" class="col-2">
          <q-card v-if="isSelected" class="my-card" style="margin:10px;">
      <div class="row justify-center">
        <p style="font-size:20px; margin-top:10px">
          {{ student.id }} <br>
        </p>
      </div>
      <div class="row justify-center" style="marjin-top:-20px;">
        <p style="font-size:15px; margin-top:-10px">
          {{ student.name }} <br>
        </p>
      </div>

      <q-card-actions align="right">
        <q-btn flat round @click="student.attendence = !student.attendence " :color="student.attendence ? 'green' : 'red'" icon="how_to_reg" />
        <q-btn flat round :color="student.late > 0 ? 'red' :'green'" icon="alarm" />
        <q-btn flat round :color="student.leave > 0 ? 'red' :'green'" icon="follow_the_signs" />
      </q-card-actions>
    </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import subjects from "../../../store/modules/subjects";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../../../config/constants";
import students from 'src/store/modules/students';
const moment = require("moment");

export default {
  data() {
    return {
      isSelected: false,
      teacherId : "",
      selectedSession : {},
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
      FETCH_STUDENTS : ACTIONS.STUDNETS.FETCH_STUDENTS
    }),
    changeSession(ses){
      console.log(ses);
      this.sessions.forEach(session => {
        ses.id == session.id ? session.selected = true  : session.selected = false;
        this.selectedSession = ses;
        })

    },
    changeGroup() {
      this.isSelected = true;
      let schedual = this.GET_SCHADUALS.find(
        (s) => s.group.value == this.group.value
      );
      if (schedual != undefined) {
        let day = new Date().getDay();
        this.sessions = schedual[day]
        .filter(session => session.teacher.id == this.GET_USER.id)
                      .map(session => (
                        { id : session.id ,
                         name : session.subject.name ,
                        day : day ,
                        selected : false}));
        this.students = this.students.filter(student => student.groupId == this.group.value);
        
      } else {
        this.schedual = {
          0: [],
          1: [],
          2: [],
          3: [],
          4: [],
        };
      }
    },
    saveSchedual() {
      this.schedual.group = this.group;
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
    getDay() {
      return [this.selectedDate.getDay()];
    },
  },
  watch : {
    GET_STUDENTS : function(oldState,newState) {
      this.students = newState.filter(student => student.groupId != undefined).map(student => ({
        date :  moment(new Date()).format("DD/MM/YYYY"),
        id : student.Id,
        name : student.name,
        groupId : student.groupId,
        takingBy : { id : this.GET_USER.Id, name : this.GET_USER.name },
        notes : "",
        day : 0,
        validExecuse : true,
        attendence : true,
        late : 0,
        leave : 0,
        session : ""
      }));
    },
    GET_SCHADUALS : function(oldState,newState) {
      this.schedual = newState;
    }
  },
  async created() {
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