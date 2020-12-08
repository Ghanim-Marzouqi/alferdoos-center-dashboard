<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">تقارير الحضور و الإنصراف</p>
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <div class="col-12 col-md-3">
          <q-select
            filled
            v-model="group"
            :options="groups"
            label="إختر مجموعة"
          />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            ref="date"
            filled
            :disable="group == ''"
            v-model="fromDate"
            label="إختر تاريخ"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'الرجاء إختيار تاريخ',
            ]"
            @click="$refs.qDateProxyfrom.show()"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxyfrom">
                  <q-date
                    v-model="fromDate"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxyfrom.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-input
            ref="date"
            filled
            :disable="fromDate == ''"
            v-model="toDate"
            label="إختر تاريخ"
            lazy-rules
            :rules="[
              (val) => (val !== null && val !== '') || 'الرجاء إختيار تاريخ',
            ]"
            @click="$refs.qDateProxy.show()"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy">
                  <q-date
                    v-model="toDate"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <q-btn class="q-mb-md" color="primary" @click="getAbsenceRecords"
          >بحث</q-btn
        >
      </div>

      <div class="col-12">
        <q-tabs
          filled
          v-model="tab"
          align="left"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab name="all" label="الكل" />
          <q-tab name="byStudent" label="ملخص" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="all">
            <q-btn
              class="q-mb-md"
              color="primary"
              :disable="records.length == 0"
              @click="getExcelFile"
              >حفظ الأكسل</q-btn
            >
            <div class="col-12">
              <q-table
                :data="records"
                :columns="columns"
                row-key="id"
                :loading="GET_LOADING"
              >
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                    <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                    <q-td key="session" :props="props">{{
                      props.row.session.name
                    }}</q-td>
                    <q-td key="absence" :props="props">
                      <q-btn
                        flat
                        round
                        :color="props.row.attend ? 'green' : 'red'"
                        icon="how_to_reg"
                      />
                    </q-td>
                    <q-td key="late" :props="props">
                      <q-btn
                        flat
                        round
                        :color="props.row.isLate ? 'red' : 'green'"
                        icon="alarm"
                      />
                      <p v-if="props.row.isLate">{{ props.row.late }}</p>
                    </q-td>
                    <q-td key="leave" :props="props">
                      <q-btn
                        flat
                        round
                        :color="props.row.isLeave ? 'red' : 'green'"
                        icon="follow_the_signs"
                      />
                      <p v-if="props.row.isLeave">{{ props.row.leave }}</p>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="byStudent">
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
                    <q-td key="name" :props="props">{{
                      props.row.data.name
                    }}</q-td>
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
                            <q-td key="name" :props="props">{{
                              props.row.name
                            }}</q-td>
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
                                :color="props.row.attend ? 'green' : 'red'"
                                icon="how_to_reg"
                              />
                            </q-td>
                            <q-td key="late" :props="props">
                              <q-btn
                                flat
                                round
                                :color="props.row.isLate ? 'red' : 'green'"
                                icon="alarm"
                              />
                              <p v-if="props.row.isLate">
                                {{ props.row.late }}
                              </p>
                            </q-td>
                            <q-td key="leave" :props="props">
                              <q-btn
                                flat
                                round
                                :color="props.row.isLeave ? 'red' : 'green'"
                                icon="follow_the_signs"
                              />
                              <p v-if="props.row.isLeave">
                                {{ props.row.leave }}
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
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";
import groups from "src/store/modules/groups";
import XLSX from "xlsx";
const moment = require("moment");
export default {
  name: "PageStudentAbsenceRecords",
  data() {
    return {
      tab: "all",
      group: "",
      students: [],
      groups: [],
      data: [],
      fromDate: "",
      toDate: "",
      records: [],
      columns: [
        {
          name: "name",
          required: true,
          label: "الاسم",
          field: "name",
          align: "left",
        },
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
          name: "name",
          required: true,
          label: "الاسم",
          field: "name",
          align: "left",
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
    };
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
  computed: {
    ...mapGetters({
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_ATTENDANCE: GETTERS.STUDNETS.GET_ATTENDANCE_RANGE_DATE,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_ATTENDANCE: ACTIONS.STUDNETS.FETCH_ATTENDANCE,
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
      RESET_ATTENDANCE_RANGE_DATE: ACTIONS.STUDNETS.RESET_ATTENDANCE_RANGE_DATE,
    }),
    getExcelFile() {
      const data = XLSX.utils.json_to_sheet(this.records);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, "data");
      XLSX.writeFile(wb, "demo.xlsx");
    },
    async getAbsenceRecords() {
      this.RESET_ATTENDANCE_RANGE_DATE();
      let fdate = moment(this.fromDate, "DD/MM/YYYY");
      let tdate = moment(this.toDate, "DD/MM/YYYY");
      while (fdate.isBefore(tdate) || fdate.isSame(tdate)) {
        await this.FETCH_ATTENDANCE({
          type: 2,
          year: fdate.format("DD/MM/YYYY"),
        });
        fdate = fdate.add(1, "days");
      }

      this.records = this.GET_ATTENDANCE.filter((ar) => ar.length != 0);
      // its comming array of dates -> array of sessions -> array of students ,
      // so this code to concatunate all the arrays of students
      this.records = [].concat.apply([], [].concat.apply([], this.records));

      // group by students to do calculations
      let map = this.groupBy(this.records, (rec) => rec.studentId);

      // iterate through the resulted map of grouping
      for (let [key, value] of map) {
        let leave = 0,
          absence = 0,
          late = 0;
        let name = "";
        value.forEach((v) => {
          name = v.name;
          if (v.attend) {
            v.isLeave ? (leave += 1) : (leave = leave);
            v.isLate ? (late += 1) : (late = late);
          } else {
            absence += 1;
          }
        });
        this.data.push({
          data: {
            id: key,
            name: name,
            leave: leave,
            late: late,
            absence: absence,
          },
          details: value,
        });
      }
    },
    groupBy(list, keyGetter) {
      const map = new Map();
      list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
          map.set(key, [item]);
        } else {
          collection.push(item);
        }
      });
      return map;
    },
  },
  watch: {
    GET_STUDENTS: function (oldState, newState) {
      this.students = newState
        .filter((student) => student.groupId != undefined)
        .map((student) => ({
          studentId: student.id,
          name: student.name,
          groupId: student.groupId,
          notes: "",
          validExecuse: true,
          attend: true,
          late: 0,
          leave: 0,
          isLate: false,
          isLeave: false,
        }));
    },
    GET_SCHADUALS: function (oldState, newState) {
      this.schedual = newState;
    },
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.EXECUSE_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isAddGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة العذر بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_EXECUSE_FAIL) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة العذر",
          });
        }
      }
    },
  },
};
</script>
