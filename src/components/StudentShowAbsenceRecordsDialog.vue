<template>
  <q-dialog
  @before-show="getAbsenceRecords"
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

      <q-card-section>
        <div class="text-h6"></div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-h6 text-weight-bold">الحضور و الإنصراف</p>

        <div class="row q-pa-md">
          <div class="col-12">
            <q-table
              :data="data"
              :columns="columns2"
              row-key="id"
              :loading="GET_LOADING"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    >{{ col.label }}</q-th
                  >
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn
                      size="sm"
                      color="primary"
                      round
                      dense
                      @click="props.expand = !props.expand"
                      :icon="
                        props.expand
                          ? 'keyboard_arrow_up'
                          : 'keyboard_arrow_down'
                      "
                    />
                  </q-td>
                  <q-td key="absence" :props="props">{{
                    props.row.data.absence
                  }}</q-td>
                  <q-td key="late" :props="props">{{
                    props.row.data.late
                  }}</q-td>
                  <q-td key="leave" :props="props">{{
                    props.row.data.leave
                  }}</q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <q-table
                      :data="props.row.details"
                      :columns="columns"
                      row-key="id"
                      :loading="GET_LOADING"
                    >
                      <template v-slot:body="props">
                        <q-tr :props="props">
 
                          <q-td key="date" :props="props">{{
                            props.row.date
                          }}</q-td>
                          <q-td key="session" :props="props">{{
                            props.row.session.name
                          }}</q-td>
                          <q-td key="absence" :props="props">
                            <q-btn
                              flat
                              round
                              :color="props.row.record.attend ? 'green' : 'red'"
                              icon="how_to_reg"
                            />
                          </q-td>
                          <q-td key="late" :props="props">
                            <q-btn
                              flat
                              round
                              :color="props.row.record.isLate ? 'red' : 'green'"
                              icon="alarm"
                            />
                            <p v-if="props.row.record.isLate">{{ props.row.record.late }}</p>
                          </q-td>
                          <q-td key="leave" :props="props">
                            <q-btn
                              flat
                              round
                              :color="props.row.record.isLeave ? 'red' : 'green'"
                              icon="follow_the_signs"
                            />
                            <p v-if="props.row.record.isLeave">
                              {{ props.row.record.leave }}
                            </p>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </div>
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
    studentId: {
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
      data : [],
      records : [],
       columns: [
        {
          name: "date",
          required: true,
          label: "التاريخ",
          field: "date",
          align: "center",
        },
        {
          name: "session",
          required: true,
          label: "الحصة",
          field: "session",
          align: "center",
        },
        {
          name: "absence",
          required: true,
          label: "الغياب",
          field: "absence",
          align: "center",
        },
        {
          name: "late",
          required: false,
          label: "التأخير",
          field: "late",
          align: "center",
        },

        {
          name: "leave",
          required: true,
          label: "الإنصراف المبكر",
          field: "leave",
          align: "center",
        },
      ],
      
       columns2: [

        {
          name: "absence",
          required: true,
          label: "الغياب",
          field: "absence",
          align: "center",
        },
        {
          name: "late",
          required: false,
          label: "التأخير",
          field: "late",
          align: "center",
        },

        {
          name: "leave",
          required: true,
          label: "الإنصراف المبكر",
          field: "leave",
          align: "center",
        },
      ],
    
      };
  },
  created() {},
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_ATTENDANCE_BY_GRP: GETTERS.STUDNETS.GET_ATTENDANCE_BY_GRP,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_ATTENDANCE_BY_GROUP: ACTIONS.STUDNETS.FETCH_ATTENDANCE_BY_GROUP,
    }),

    async getAbsenceRecords() {
      await this.FETCH_ATTENDANCE_BY_GROUP({
        group: this.groupId,
      });
      let recs  = this.GET_ATTENDANCE_BY_GRP.map(x => ({
        record : x.attendance.find(x => x.studentId == this.studentId),
        session : x.session,
        date : x.date,
      }))

      recs = recs.filter(x => x.record != undefined);


      let leave = 0,absence = 0,late = 0; 
      recs.forEach(v => {
        if (v.record && v.record.attend) {
            v.record.isLeave ? (leave += 1) : (leave = leave);
            v.record.isLate ? (late += 1) : (late = late);
          } else {
            absence += 1;
          }
      });
      this.data.push({
          data: {
            id: this.studentId,
            leave: leave,
            late: late,
            absence: absence,
          },
          details: recs,
        });

    },

  },
};
</script>

<style lang="scss" scoped>
.q-card {
  height: 200px;
}
</style>
