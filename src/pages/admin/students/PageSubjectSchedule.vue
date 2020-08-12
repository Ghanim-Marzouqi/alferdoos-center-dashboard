<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="q-ma-3">
        <q-select filled v-model="group"  :options="groups" label="إختر مادة" />
      </div>

      <div class="q-ma-3">
        <q-btn
            @click=" isSelectSubjectOpen = true"
            round
            color="amber"
            glossy
            text-color="black"
            icon="layers_clear"
          />
      </div>
    </div>
    <div class="row justify-center q-pa-lg">
      <q-calendar
        v-model="selectedDate"
        view="week-agenda"
        :weekdays="[0,1,2,3,4]"
        locale="ar"
        no-scroll
      >
        <template #day-label="{ timestamp }">
          <q-btn
            @click=" isSelectSubjectOpen = true"
            round
            color="amber"
            glossy
            text-color="black"
            icon="layers_clear"
          />
        </template>

        <template #day-body="{ timestamp }">
          <template v-for="(agenda) in getSchedual(timestamp)">
            <div
              :key="timestamp.date + agenda.subject.time"
              :label="agenda.subject.time"
              class="justify-start q-ma-sm shadow-5 bg-grey-4"
            >
              <div
                v-if="agenda.avatar"
                class="row justify-center"
                style="margin-top: 30px; width: 100%;"
              >
                <q-avatar
                  style="margin-top: -25px; margin-bottom: 10px; font-size: 60px; max-height: 50px;"
                >
                  <img :src="agenda.avatar" style="border: #e0e0e0 solid 5px;" />
                </q-avatar>
              </div>
              <div class="col-12 q-px-sm q-mt-sm">{{ agenda.subject.label}}</div>
              <div
                v-if="agenda.time"
                class="col-12 q-px-sm q-pt-sm"
              >{{ agenda.fromTime }} - {{ agenda.toTime }}</div>
            </div>
          </template>
        </template>
      </q-calendar>
      <SelectSubjecDialog
        :isOpen="isSelectSubjectOpen"
        @input="addSubject"
        @close="isSelectSubjectOpen = false"
      />
    </div>
  </q-page>
</template>

<script>
import subjects from "../../../store/modules/subjects";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../../../config/constants";
const moment = require("moment");

export default {
  components: {
    SelectSubjecDialog: () => import("components/SelectSubjectDialog.vue"),
  },
  data() {
    return {
      selectedDate: "2019-05-03",
      isSelectSubjectOpen: false,
      group : "",
      groups : [],
      days: {
        6: 0,
        0: 1,
        1: 2,
        2: 3,
        3: 4,
      },
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
    }),
    getSchedual(day) {
      return this.schedual[parseInt(day.weekday, 10)];
    },
    addSubject(subject) {
      console.log(subject);

      let fdate = moment("2020-03-02" + " " + "08:00");

      let day = new Date(this.selectedDate).getDay();
      let schedual = this.schedual[this.days[day]];

      if (schedual.length > 0) {
        fdate = moment(
          "2020-03-02" + " " + schedual[schedual.length - 1].toTime
        );
      }
      let tdate = moment(fdate).add(parseInt(subject.time), "m");

      let session = {
        fromTime: fdate.format("hh:mm"),
        toTime: tdate.format("hh:mm"),
        time: subject.time,
        subject: subject.subject,
        avatar: subject.avatar,
      };
      this.schedual[this.days[day]].push(session);
    },
    getSession() {
      let session = {};
    },
  },
    computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
    async created() {
    await this.FETCH_GROUPS();

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