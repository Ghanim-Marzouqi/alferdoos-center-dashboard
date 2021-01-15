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

      <!-- <div class="col-12 col-md-4">
        <q-btn
            @click="saveSchedual"
            round
            color="primary"
            text-color="white"
            icon="save"
          />
      </div> -->
    </div>
    <div class="row justify-center q-pa-lg">
      <q-calendar
        v-model="selectedDate"
        view="week-agenda"
        :weekdays="[0,1,2,3,4,5,6]"
        locale="ar"
        no-scroll
      >
        <template #day-label="{ timestamp }">
          <q-btn
            @click=" isSelectSubjectOpen = true"
            round
            :disable="!isSelected"
            color="primary"
            text-color="white"
            icon="add_circle"
          />
        </template>

        <template #day-body="{ timestamp }">
          <template v-for="(agenda,i) in getSchedual(timestamp)">
            <div
              :key="agenda.id"
              :label="agenda.subject.time"
              class="justify-start q-ma-sm shadow-5 bg-grey-4"
            >
              <div
                v-if="agenda.avatar"
                class="row justify-center"
                style="margin-top: 30px; width: 100%;"
              >
                <q-avatar
                  style="margin-top: -25px; margin-bottom: 5px; font-size: 50px; max-height: 40px;"
                >
                  <img :src="agenda.avatar" style="border: #e0e0e0 solid 5px;" />
                </q-avatar>
              </div>
              <div class="row justify-center">
                <p style="font-size: 10px; margin-bottom:-3px;" v-html="agenda.teacher.name"></p>
              </div>
              <div class="row justify-center">
                <p style="font-size: 20px; margin-bottom:-3px;" v-html="agenda.subject.name"></p>
              </div>
              <div class="row justify-center">{{ agenda.fromTime }} - {{ agenda.toTime }}</div>
              <div class="row justify-center">
                <q-btn
                  @click="update(agenda,timestamp,i)"
                  round
                  color="white"
                  size="xs"
                  text-color="black"
                  icon="edit"
                />
                <q-btn
                  @click="removeSession(i,timestamp)"
                  round
                  color="white"
                  size="xs"
                  text-color="black"
                  icon="clear"
                />
              </div>
            </div>
          </template>
        </template>
      </q-calendar>
      <SelectSubjecDialog
        :isOpen="isSelectSubjectOpen"
        :isEdit="isEdit"
        :session="session"
        @input="addSubject"
        @close="isSelectSubjectOpen = false"
      />
    </div>
  </q-page>
</template>

<script>
import subjects from "../../../store/modules/subjects";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS , MESSAGES, ERRORS } from "../../../config/constants";
import groups from 'src/store/modules/groups';
const moment = require("moment");

export default {
  components: {
    SelectSubjecDialog: () => import("components/SelectSubjectDialog.vue"),
  },
  data() {
    return {
      isSelected: false,
      selectedDate: "2019-05-03",
      isSelectSubjectOpen: false,
      isEdit : false,
      index : -1 ,
      day : -1,
      session :{
        time : "",
        subject : null,
        teacher : null,
        id : 0,
      },
      group: "",
      groups: [],
      schedual: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      },
    };
  },

  methods: {
    ...mapActions({
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      ADD_SCHEDUAL: ACTIONS.SETTINGS.ADD_SCHEDUAL,
      UPDATE_SETTINGS : ACTIONS.SETTINGS.UPDATE_SETTINGS,
      FETCH_SCHEDUAL : ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    getSchedual(day) {
      return this.schedual[parseInt(day.weekday, 10)];
    },
    changeGroup() {
      this.isSelected = true;
      let schedual = this.GET_SCHADUALS.find(s => s.group.value == this.group.value);
      
      if (schedual != undefined)
      {
        this.schedual = schedual
      }else
      {
        this.schedual =  {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
      };
      }
    },
    saveSchedual() {
      this.schedual.group = this.group;
      this.schedual.settings = this.GET_YEAR_INFO.session;
      this.ADD_SCHEDUAL(this.schedual);
    },
    updateAfterSettingsChanged() {
      this.schedual.group = this.group;
      this.schedual.settings = this.GET_YEAR_INFO.session;
      this.UPDATE_SETTINGS(this.schedual);
    },
    addSubject(subject) {

      if (this.isEdit) {
        let session = this.schedual[this.day][this.index];
        session.subject = subject.subject;
        let time = moment("2020-03-02" + " " + session.fromTime).add(
          parseInt(subject.time),
          "m"
        );
        session.toTime = time.format("hh:mm");
        session.time = subject.time;
        this.isEdit = false;
        this.index = -1;
        this.updateFullDaySchedual(this.day)
      }else{

      let fdate = moment("2020-03-02" + " " + this.GET_YEAR_INFO.session.start);
      let day = new Date(this.selectedDate).getDay();
      let schedual = this.schedual[day];

      if (schedual.length > 0) {
        fdate = moment(
          "2020-03-02" + " " + schedual[schedual.length - 1].toTime
        ).add(this.GET_YEAR_INFO.session.break,"m");
      }
      let tdate = moment(fdate).add(parseInt(subject.time), "m");

      let session = {
        id : Math.random() * 10000,
        fromTime: fdate.format("hh:mm"),
        toTime: tdate.format("hh:mm"),
        time: subject.time,
        subject: subject.subject,
        teacher : subject.teacher,
        avatar: subject.avatar,
      };
      this.schedual[day].push(session);
      }
      this.saveSchedual();
      this.session.subject = null;
      this.session.time = "",
      this.session.teacher = null;
      this.session.id = 0;
    },
    update(session, day, index) {
      this.session.time = session.time;
      this.session.subject = session.subject,
      this.session.teacher = session.teacher,
      this.index = index,
      this.session.id = session.id
      this.day = parseInt(day.weekday, 10);
      this.isEdit = true;
      this.isSelectSubjectOpen = true;
      },
    updateFullDaySchedual(day){
        this.schedual[day].forEach((session,i) => {
          let fdate = i > 0 ?  moment("2020-03-02" + " " + this.schedual[day][i-1].toTime).add(this.GET_YEAR_INFO.session.break,"m")
                      :  moment("2020-03-02" + " " + this.GET_YEAR_INFO.session.start);

        let tdate = moment(fdate).add(parseInt(session.time), "m");
        session.fromTime = fdate.format("hh:mm");
        session.toTime = tdate.format("hh:mm");
      });
    },
    removeSession(index, day) {
      let i = parseInt(day.weekday, 10);
     this.schedual[i].splice(index,1);
     this.updateFullDaySchedual(i);
     this.saveSchedual();
    },
  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS : GETTERS.SETTINGS.GET_SCHADUALS,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES, 
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
  },
  watch: {

    GET_LOADING : function (newState) {
     newState ? this.$q.loading.show() : this.$q.loading.hide();
  },

    GET_SCHADUALS : function(newState)
    {

      // here im checking if the sessions settings had been changed or not
      newState.forEach(group =>{
        if (group.settings.break != this.GET_YEAR_INFO.session.break
            || group.settings.start != this.GET_YEAR_INFO.session.start)
            {
              this.group = group.group;
              this.schedual = group;
              for (let i = 0; i < 7; i++) {
                this.updateFullDaySchedual(i)
              }
              this.saveSchedual();
            }
      })
    },
    GET_MESSAGES : function(newState){

       if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.SCHEDUAL_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_SCHEDUAL();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث الجدول بنجاح",
          });
        }
       }
    },

    GET_ERRORS:  function(newState){
       if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_EXECUSE_FAIL) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث الجدول",
          });
        }
      }
    }
  
  },
  async created() {
    await this.FETCH_GROUPS();
    await this.FETCH_SCHEDUAL();
    this.FETCH_YEAR_INFO();
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