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
      <div v-for="session in  getSchedual(getDay)" :key="session.id" class="col-2">
          <q-card class="my-card" :color="red" style="margin:10px;">
      <div class="row justify-center">
        <p style="font-size:20px; margin-top:10px">
          {{ session.subject.label }} <br>
        </p>
      </div>
      <div class="row justify-center" style="marjin-top:-20px;">
        <p style="font-size:15px; margin-top:-10px">
          {{ session.subject.label }} <br>
        </p>
      </div>

      <q-card-actions align="right">
        <q-btn flat round color="green" icon="how_to_reg" />
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
const moment = require("moment");

export default {
  data() {
    return {
      isSelected: false,
      selectedDate: new Date(),
      isSelectSubjectOpen: false,
      isEdit: false,
      index: -1,
      day: -1,
      session: {
        time: "",
        subject: null,
        id: 0,
      },
      group: "",
      groups: [],
      schedual: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
      },
    };
  },

  methods: {
    ...mapActions({
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
    }),
    getSchedual(day) {
      return this.schedual[day];
    },
    changeGroup() {
      this.isSelected = true;
      let schedual = this.GET_SCHADUALS.find(
        (s) => s.group.value == this.group.value
      );
      if (schedual != undefined) {
        this.schedual = schedual;
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
    addSubject(subject) {
      console.log(subject);

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
        this.updateFullDaySchedual(this.day);
      } else {
        let fdate = moment("2020-03-02" + " " + "08:00");
        let day = new Date(this.selectedDate).getDay();
        let schedual = this.schedual[day];

        if (schedual.length > 0) {
          fdate = moment(
            "2020-03-02" + " " + schedual[schedual.length - 1].toTime
          );
        }
        let tdate = moment(fdate).add(parseInt(subject.time), "m");

        let session = {
          id: Math.random() * 10000,
          fromTime: fdate.format("hh:mm"),
          toTime: tdate.format("hh:mm"),
          time: subject.time,
          subject: subject.subject,
          avatar: subject.avatar,
        };
        this.schedual[day].push(session);
      }

      this.session.subject = null;
      (this.session.time = ""), (this.session.id = 0);
    },
    update(session, day, index) {
      this.session.time = session.time;
      (this.session.subject = session.subject),
        (this.index = index),
        (this.session.id = session.id);
      this.day = parseInt(day.weekday, 10);
      this.isEdit = true;
      this.isSelectSubjectOpen = true;
    },
    updateFullDaySchedual(day) {
      this.schedual[this.day].forEach((session, i) => {
        let fdate =
          i > 0
            ? moment("2020-03-02" + " " + this.schedual[day][i - 1].toTime)
            : moment("2020-03-02" + " " + "08:00");

        let tdate = moment(fdate).add(parseInt(session.time), "m");
        session.fromTime = fdate.format("hh:mm");
        session.toTime = tdate.format("hh:mm");
      });
    },
    removeSession(index, day) {
      let i = parseInt(day.weekday, 10);
      this.schedual[i].splice(index, 1);
    },
  },
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
    }),
    getDay() {
      return [this.selectedDate.getDay()];
    },
  },
  async created() {
    await this.FETCH_GROUPS();
    await this.FETCH_SCHEDUAL();
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