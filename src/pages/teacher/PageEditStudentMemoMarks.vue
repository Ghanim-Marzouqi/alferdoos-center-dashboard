<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="col-12 col-md-4">
        <q-select
          filled
          @input="changeGroup"
          v-model="group"
          :options="groups"
          label="إختر مجموعة"
        />
      </div>
      <div class="col-12 col-md-4 q-m-lg">
        <q-select
          filled
          @input="changeMemoDetails"
          v-model="selectdMemo"
          :options="memorizations"
          :option-label="(i) => i.name"
          label="اختر محفوظ"
        />
      </div>
    </div>

    <div class="row">
      <div v-for="student in students" :key="student.id" class="col-md-3">
        <q-card class="my-card q-ma-md" style="margin-top: 10px">
          <div class="row justify-center q-mt-md"></div>
          <div class="row justify-center q-ma-md">
            <p style="font-size: 15px; margin-top: 10px">
              {{ student.name }}
              <br />
            </p>
          </div>

          <q-list style="width: 100%">
            <q-item v-for="(detail, i) in selectdMemo.details" :key="i">
              <q-item-section class="justify-start" avatar>
                <q-btn
                  dense
                  round
                  size="sm"
                  color="primary"
                  @click="
                    (isAddMemoMarksDialogOpen = true),
                      (selectdStudent = student.id),
                      (memoDetail = detail),
                      (selectdMemoId = selectdMemo.id),
                      (repeat = setRepeat(student.id,selectdMemo.id,detail)),
                      (nextPage = setPageNext(student.id,selectdMemo.id,detail))
                  "
                >
                  <q-icon name="o_add" />
                </q-btn>
              </q-item-section>
              <q-item-section>
                {{ detail.name }}
              </q-item-section>
              <q-item-section>
              </q-item-section>
              <q-item-section side>
                {{ setPageNext(student.id,selectdMemo.id,detail) }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <AddMemoMarksDialog
      @closeDialog="isAddMemoMarksDialogOpen = false,repeat = 0"
      :isDialogOpen="isAddMemoMarksDialogOpen"
      :detail="memoDetail"
      :memoId="selectdMemoId"
      :student="selectdStudent"
      :page="nextPage"
      :repeat="repeat"
    />
  </q-page>
</template>

<script>
import subjects from "../../store/modules/subjects";
import students from "../../store/modules/students";
import { GETTERS, ACTIONS, MESSAGES } from "../../config/constants";
import { mapGetters, mapActions } from "vuex";
const moment = require("moment");

export default {
  components: {
    AddMemoMarksDialog: () => import("components/AddMemoMarksDialog.vue"),
  },
  data() {
    return {
      repeat : 0,
      groups: [],
      memoDetails: [],
      memorizations: [],
      memoDetail: {},
      selectdMemoId: "",
      selectdStudent: "",
      isAddMemoMarksDialogOpen: false,
      selectdMemo: "",
      nextPage: 100,
      selectedStudent: "",
      date: moment(new Date()).format("DD/MM/YYYY"),
      allStudents: [],
      students: [],
      group: "",
    };
  },
  async created() {
    await this.FETCH_GROUPS();
    await this.FETCH_MEMORIZATIONS();
    await this.FETCH_STUDENTS({ status: "" });
    await this.FETCH_YRAT_INFO();
    await this.FETCH_MEMO_MARKS();
    await this.FETCH_SCHEDUAL();

    this.GET_SCHADUALS.forEach((sch) => {
      Object.values(sch).forEach((day) => {
        if (Array.isArray(day)) {
          !day.some((session) => session.teacher.id == this.GET_USER.id)
            ? ""
            : !this.groups.some((g) => g.value == sch.group.value)
            ? this.groups.push(sch.group)
            : "";
        }
      });
    });
  },
  methods: {
    ...mapActions({
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_MEMORIZATIONS: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_MEMO_MARKS: ACTIONS.SETTINGS.FETCH_MEMO_MARKS,
      FETCH_ENTRIES: ACTIONS.SETTINGS.FETCH_ENTRIES,
      FETCH_YRAT_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    setRepeat(sid,mid,detail)
    {
      let repeat = 0;
      let marks = this.GET_MEMO_MARKS
      .filter(x => x.studentId === sid && x.memoId === mid && detail.uid === x.detailsId);

      if (marks.length > 0){
         let currentPage = Math.max.apply(Math, marks.map(x => parseInt(x.page)));
         let currentRecords = marks.filter(x => x.page == currentPage);
         let lastRecordNum = Math.max.apply(Math, currentRecords.map(x => parseInt(x.repeat)));
         let currentRecord = currentRecords.find(x => x.repeat == lastRecordNum);
         console.log(currentRecord);
         if (!currentRecord.status)
            repeat = currentRecord.repeat + 1;
        }
        
      return repeat;
    },
    setPageNext(sid,mid,detail)
    {

      let page = 0;
      let marks = this.GET_MEMO_MARKS
      .filter(x => x.studentId === sid && x.memoId === mid && detail.uid === x.detailsId);

      if (marks.length > 0){
         let currentPage = Math.max.apply(Math, marks.map(x => parseInt(x.page)));
         let currentRecords = marks.filter(x => x.page == currentPage);
         let lastRecordNum = Math.max.apply(Math, currentRecords.map(x => parseInt(x.repeat)));
         let currentRecord = currentRecords.find(x => x.repeat == lastRecordNum);
         console.log(currentRecord);
         if (currentRecord.status)
           page  = currentPage +1;
        else{
          page = currentPage;
        }
        
      }
      else 
         page = detail.pageNumberFrom;
         
      return page;

    },

    changeMemoDetails() {
      console.log(this.selectdMemo);
      this.memoDetails = this.memorizations.filter(
        (x) => x.id === this.selectdMemo
      ).details;
      this.students = this.GET_STUDENTS.filter(
        (student) =>
          student.groupId != undefined && student.groupId == this.group.value
      );
    },
    changeGroup() {
      this.memorizations = [];
      this.students = [];
      let groupMemorizations = this.GET_GROUPS.find(
        (x) => x.id == this.group.value
      ).memorizations;
      this.memorizations = groupMemorizations?.map((memo) => {
        let original = this.GET_MEMORIZATIONS.find(
          (m) => m.id === memo.memorizationId
        );
        return {
          id: original.id,
          name: original.name,
          details: original.details.filter((d) =>
            memo.memorizationDetailsUID.includes(d.uid)
          ),
        };
      });
    },
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_MEMORIZATIONS: GETTERS.SETTINGS.GET_MEMORIZATIONS,
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_MEMO_MARKS: GETTERS.SETTINGS.GET_MEMO_MARKS,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
    }),
  },
  watch: {
    GET_LOADING: function (newState) {
      newState ? this.$q.loading.show() : this.$q.loading.hide();
    },
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.MEMO_MARK_SAVED) {
          this.CLEAR_ERRORS_AND_MESSAGES();

          this.FETCH_MEMO_MARKS({ year: "2020" });
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حفظ الدرجة بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_MEMO_ERROR) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناءحفظ الدرجة",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    },
  },
};
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>
<style lang="scss" scoped>
.q-card {
  height: 200px;
  width: 95%;
  margin: 10px;
}
</style>