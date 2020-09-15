<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">سجلات الغياب</p>
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <div class="col-12 col-md-3">
          <q-select v-model="group" filled :options="groups" @input="changeGroup" label="إختر مجموعة" />
        </div>

        <div class="col-12 col-md-3">
          <q-input
            ref="date"
            filled
            :disable="group == ''"
            v-model="recordsDate"
            label="إختر تاريخ"
            lazy-rules
            :rules="[ val => val !== null && val !== '' || 'الرجاء إختيار تاريخ']"
            @click="$refs.qDateProxy.show()"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy">
                  <q-date
                    v-model="recordsDate"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-3">
          <q-select
            filled
            v-model="selectedSession"
            multiple
            :option-label="s => s.name"
            :option-value="s => s.id"
            :options="sessions"
            use-chips
            stack-label
            label="الحصص"
          />
        </div>

        <q-btn class="q-mb-md" color="primary" @click="getAbsenceRecords">بحث</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="records" :columns="columns" row-key="id" :loading="GET_LOADING">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="session" :props="props">{{ props.row.session.name }}</q-td>
              <q-td key="absence" :props="props">
                <q-icon name="how_to_reg" size="sm" :color="!props.row.attend ? 'red' :'green'" />
              </q-td>
              <q-td key="late" :props="props">
                <q-icon name="alarm" size="sm" :color="props.row.isLate ? 'red' :'green'" />
                <p v-if="props.row.isLate ">{{ props.row.late }}</p>
              </q-td>
              <q-td key="leave" :props="props">
                 <q-icon name="follow_the_signs" size="sm" :color="props.row.isLeave ? 'red' :'green'" />
                <p v-if="props.row.isLeave">{{ props.row.leave }}</p>
              </q-td>
              <q-td key="execuse" :props="props">
                  <q-icon color="green" v-if="props.row.validExecuse" size="sm" name="check_circle" />
                
                <q-btn dense v-if="!props.row.validExecuse" flat @click.stop="addExecuse(props.row)">
                  <q-icon color="red" name="o_edit" />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <AddExecuseDialog
      :isOpen="isAddExecuseDialogOpen"
      @close="isAddExecuseDialogOpen = false"
      :execuse="record"
    />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";
import groups from "src/store/modules/groups";
const moment = require("moment");
export default {
  name: "PageStudentAbsenceRecords",
  components: {
    AddExecuseDialog: () => import("components/AttendanceAddExecuseDialog"),
  },
  data() {
    return {
      group: '',
      sessions: [],
      students: [],
      selectedSession: [],
      isAddExecuseDialogOpen: false,
      groups: [],
      record: {
        files: [],
        title: "",
        description: "",
        docId: 0,
        date: "",
        session: "",
        group: "",
        student: "",
      },
      recordsDate: "",
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
          name: "session",
          required: true,
          label: "الحصة",
          field: "session",
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
        {
          name: "execuse",
          required: true,
          label: "العذر",
          field: "execuse",
          align: "right",
        },
      ],
    };
  },
  async created() {
    this.FETCH_SCHEDUAL();
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
      GET_ATTENDANCE: GETTERS.STUDNETS.GET_ATTENDANCE,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_EXECUSES : GETTERS.STUDNETS.GET_EXECUSES,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_ATTENDANCE: ACTIONS.STUDNETS.FETCH_ATTENDANCE,
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_EXECUSES: ACTIONS.STUDNETS.FETCH_EXECUSES,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    changeGroup() {
      if (this.recordsDate != "") {
        let schedual = this.GET_SCHADUALS.find(
          (s) => s.group.value == this.group.value
        );
        if (schedual != undefined) {
          let ar = this.recordsDate.split("/");
          let day = new Date(
            parseInt(ar[2]),
            parseInt(ar[1]) - 1,
            parseInt(ar[0])
          ).getDay();
          console.log(day);
          this.sessions = schedual[day].map((session) => ({
            id: session.id,
            name: session.subject.name,
            day: day,
            selected: false,
          }));
          this.selectedSession = this.sessions;
        }
      }
    },
    async getAbsenceRecords() {
      await this.FETCH_ATTENDANCE({ type : 1, year: this.recordsDate });
      await this.FETCH_EXECUSES({ year: this.recordsDate });
      let execuses = this.GET_EXECUSES;
      this.records = this.GET_ATTENDANCE.filter(
        (c) => c.group == this.group.value
      );
      // this code to include the session and date in the student record
      // it was common to all the document so i make it in each student record (attendance array) 
      this.records.forEach((c) =>
        c.attendance.forEach((a) => {
          // check if there is any execuse added.
          a.validExecuse = execuses.some(e => e.student == a.studentId && c.session.id == e.session.id);
          a.session = c.session;
          a.date = c.date;
          a.docId = c.id
        })
      );
      // this first code will give a code of records for each session of the day, 
      // here im gonna merge all
      this.records = [].concat.apply([],this.records.map((c) => c.attendance))
      .filter((r) =>(!r.attend || r.isLate || r.isLeave) &&
            this.selectedSession.map((ss) => ss.id).includes(r.session.id));
      console.log(this.records);
    },
    addExecuse(row) {
      (this.record.date = this.recordsDate),
        (this.record.session = row.session),
        (this.record.group = this.group.value),
        (this.record.student = row.studentId);
      this.isAddExecuseDialogOpen = true;
    },
  },
  watch: {
    recordsDate: function (newState) {
      this.changeGroup();
    },
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

        console.log(MESSAGES.DATABASE.EXECUSE_ADDED)
        console.log(messageCode)
        

        if (messageCode === MESSAGES.DATABASE.EXECUSE_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.getAbsenceRecords();
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
