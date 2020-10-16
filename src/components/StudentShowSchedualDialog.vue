<template>
  <q-dialog
    @before-show="initData"
    v-model="isOpen"
    persistent
    full-height
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-primary text-white">
      <q-bar>
        <q-space />

        <q-btn dense flat icon="close" @click="$emit('close')">
          <q-tooltip content-class="bg-white text-primary">إغلاق</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section class="q-pt-none">
        <p class="text-h6 text-weight-bold">الجدول و المواد الدراسية</p>

        <div class="row justify-center q-pa-lg">
          <q-calendar
            v-model="selectedDate"
            view="week-agenda"
            :weekdays="[0, 1, 2, 3, 4, 5, 6]"
            locale="ar"
            no-scroll
          >
            <template #day-label="{ timestamp }">
 
            </template>

            <template #day-body="{ timestamp }">
              <template v-for="(agenda, i) in getSchedual(timestamp)">
                <div
                  :key="agenda.id"
                  :label="agenda.subject.time"
                  class="justify-start q-ma-sm shadow-5 bg-grey-4"
                >
                  <div
                    v-if="agenda.avatar"
                    class="row justify-center"
                    style="margin-top: 30px; width: 100%"
                  >
                    <q-avatar
                      style="
                        margin-top: -25px;
                        margin-bottom: 5px;
                        font-size: 50px;
                        max-height: 40px;
                      "
                    >
                      <img
                        :src="agenda.avatar"
                        style="border: #e0e0e0 solid 5px"
                      />
                    </q-avatar>
                  </div>
                  <div class="row justify-center">
                    <p
                      style="font-size: 20px; color:black; margin-bottom: -3px"
                      v-html="agenda.subject.name"
                    ></p>
                  </div>
                  <div  style="font-size: 20px; color:black; margin-bottom: -3px" class="row justify-center">
                    {{ agenda.fromTime }} - {{ agenda.toTime }}
                  </div>

                </div>
              </template>
            </template>
          </q-calendar>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../config/constants";
import groups from "src/store/modules/groups";
import { storage } from "firebase";
export default {
  name: "PageStudentMarksDetails",
  props: {
    groupId: {
      type: String,
      default: "",
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      maximizedToggle: true,
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
  created() {
    this.FETCH_SCHEDUAL();
    this.FETCH_YEAR_INFO();
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
    }),
    getSchedual(day) {
      return this.schedual[parseInt(day.weekday, 10)];
    },
    initData() {
      this.schedual = this.GET_SCHADUALS.find(
        (s) => s.group.value == this.groupId
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.q-card {
  height: 200px;
}
</style>
