<template>
  <q-page>

    <div class="row justify-center q-pa-lg">

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
        view="week-agenda"
        :weekdays="day"
        locale="ar"
        no-scroll
      >
        <template #day-label="{ timestamp }">
          
        </template>

        <template #day-body="{ timestamp }">
          <template v-for="(agenda,i) in getSchedual(timestamp)">
            <div
              :key="i"
              :label="agenda.group"
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
                <p style="font-size: 20px; margin-bottom:-3px;" v-html="agenda.name"></p>
              </div>
              <div class="row justify-center">
                <p style="font-size: 16px; margin-bottom:-3px;" v-html="agenda.group"></p>
              </div>
              <div class="row justify-center">{{ agenda.fromTime }} - {{ agenda.toTime }}</div>
   
            </div>
          </template>
        </template>
      </q-calendar>

    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../../config/constants";
const moment = require("moment");

export default {
  data() {
    return {
      day : [new Date().getDay()],
      schedual: {
      },
    };
  },

  methods: {
    ...mapActions({
      FETCH_SCHEDUAL : ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
    }),
    // getGroupSchedual(){
    //   console.log('group',this.group);
      
    //    this.schedual = this.GET_SCHADUALS.find((s) => s.group.value == this.group);
    //    console.log('shedual',this.schedual)
    // },
    getSchedual(day) {
      let sessios = [];
      this.GET_SCHADUALS.forEach(s => {
        let ses = s[parseInt(day.weekday, 10)]
       .filter(session => session.teacher.id == this.GET_USER.id)
        .map(session => ({ group : s.group.label, fromTime : session.fromTime 
        ,toTime : session.toTime , name : session.subject.name }));
        console.log('ses',ses)
       Array.prototype.push.apply(sessios ,ses)
      });
       console.log('sessions',sessios)
      return sessios;
    },
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_USER : GETTERS.AUTH.GET_USER,
      GET_SCHADUALS : GETTERS.SETTINGS.GET_SCHADUALS,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
    }),
  },

  async created() {
    await this.FETCH_SCHEDUAL();
    this.FETCH_YEAR_INFO();
  },
};
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>