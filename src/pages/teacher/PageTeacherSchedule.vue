<template>
  <q-page>

    <div class="row justify-center q-pa-lg">
      <q-btn icon="fas fa-arrow-alt-circle-right" flat dense round @click="addDay(-1)" />

      <q-btn icon="fas fa-arrow-alt-circle-left" flat dense round @click="addDay(1)" />
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
                <p style="font-size: 20px; margin-bottom:-3px;" v-html="agenda.subject.name"></p>
              </div>
              <div class="row justify-center">
                <p style="font-size: 16px; margin-bottom:-3px;" v-html="agenda.group"></p>
              </div>
              <div class="row justify-center">{{ agenda.fromTime }} - {{ agenda.toTime }}</div>
                            <div>
                <q-chip
                  v-for="(file, i) in getFiles(agenda.subject.id)"
                  :key="i"
                  clickable
                  icon-right="o_get_app"
                  @click="downloadFile(file)"
                  >{{ file.name }}</q-chip
                >
              </div>
   
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
       FETCH_SUBJECTS: ACTIONS.SUBJECTS.FETCH_SUBJECTS,
    }),

        getFiles(id) {
      return this.GET_SUBJECTS.find((x) => x.id == id)?.uplodedFiles;
    },
    addDay(num){
      if (num == -1)
          this.day[0] == 0 ? this.day = [6] : this.day = [this.day[0] -1];
      else
         this.day[0] == 6 ? this.day = [0] : this.day = [this.day[0] +1];
    },
    downloadFile(file) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = file.name;
          link.click();
        };
        xhr.open("GET", file.fileUrl);
        xhr.send();
      } catch (error) {
        switch (error.code) {
          case ERRORS.STORAGE.OBJECT_NOT_FOUND:
            this.SET_ERROR(ERRORS.STORAGE.OBJECT_NOT_FOUND);
            break;
          case ERRORS.STORAGE.UNAUTHORIZED:
            this.SET_ERROR(ERRORS.STORAGE.UNAUTHORIZED);
            break;
          case ERRORS.STORAGE.CANCELED:
            this.SET_ERROR(ERRORS.STORAGE.CANCELED);
            break;
          case ERRORS.STORAGE.UNKNOWN:
            this.SET_ERROR(ERRORS.STORAGE.UNKNOWN);
            break;
        }
      }
    },

    getSchedual(day) {
      let sessios = [];
      this.GET_SCHADUALS.forEach(s => {
        let ses = s[parseInt(day.weekday, 10)]
       .filter(session => session.teacher.id == this.GET_USER.id)
        .map(session => ({ subject : session.subject, group : s.group.label, fromTime : session.fromTime 
        ,toTime : session.toTime }));
        
       Array.prototype.push.apply(sessios ,ses)
      });
      return sessios;
    },
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SUBJECTS: GETTERS.SUBJECTS.GET_SUBJECTS,
      GET_USER : GETTERS.AUTH.GET_USER,
      GET_SCHADUALS : GETTERS.SETTINGS.GET_SCHADUALS,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
    }),
  },

  async created() {
    await this.FETCH_SUBJECTS();
    await this.FETCH_SCHEDUAL();
    this.FETCH_YEAR_INFO();
  },
};
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>