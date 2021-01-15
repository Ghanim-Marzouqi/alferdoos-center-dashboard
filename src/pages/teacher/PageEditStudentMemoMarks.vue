<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="col-12 col-md-4">
        <q-select
          filled
          @input="changeGroup"
          v-model="group"
          :option-label="(obj) => obj.name"
          :option-value="(obj) => obj.id"
          :options="GET_GROUPS"
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
      <div v-for="student in students" :key="student.id" class="col-md-6">
        <q-card class="q-ma-md full-height" style="margin-top: 10px">
          <q-card-section>
            <div class="row justify-center q-mt-md"></div>
            <div class="row justify-center q-ma-md">
              <p style="font-size: 15px; margin-top: 10px">
                {{ student.name }}
                <br />
              </p>
            </div>

            <q-markup-table flat bordered>
              <tbody>
                <tr dense v-for="(detail, i) in getDetails(student.id)" :key="i">
                  <td>
                    <q-btn
                      dense
                      round
                      size="sm"
                      color="primary"
                      @click="
                    (isAddMemoMarksDialogOpen = true),
                      (selectdStudent = student.id),
                      (memoDetail = detail.detail),
                      (selectdMemoId = selectdMemo.id),
                      (repeat = detail.repeat),
                      (nextPage = detail.page)"
                    >
                      <q-icon name="o_add" />
                    </q-btn>
                  </td>
                  <td>{{ detail.detail.name }}<br>
                    {{ detail.date  }}
                  </td>
                  <td></td>
                  <td>{{ detail.page }}</td>
                  
                </tr>
              </tbody>
            </q-markup-table>

            <!-- <q-list style="width: 100%">
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
                        (nextPage = setPageNext(
                          student.id,
                          selectdMemo.id,
                          detail
                        ))
                    "
                  >
                    <q-icon name="o_add" />
                  </q-btn>
                </q-item-section>
                <q-item-section> </q-item-section>
                <q-item-section> </q-item-section>
                <q-item-section side>
                  {{ setPageNext(student.id, selectdMemo.id, detail) }}
                </q-item-section>
              </q-item>
            </q-list> -->
          </q-card-section>
          <!-- <q-list style="width: 100%">
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
          </q-list> -->
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
import { max } from 'moment';
import { date } from "quasar";
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
         // get the max page number 
         let currentPage = Math.max.apply(Math, marks.map(x => parseInt(x.page)));
         // get the last mark recorded according to the page number
         let currentRecords = marks.filter(x => x.page == currentPage);
         
         let lastRecordNum = Math.max.apply(Math, currentRecords.map(x => parseInt(x.repeat)));
         
         let currentRecord = currentRecords?.find(x => x.repeat == lastRecordNum);
         if (!currentRecord.status)
            repeat = currentRecord?.repeat + 1;
        }
        
      return repeat;
    },
    getLastUpdated(sid,mid,detail)
    {

      let page = 0;
      let marks = this.GET_MEMO_MARKS.filter(
        (x) =>
          x.studentId === sid && x.memoId === mid && detail.uid === x.detailsId
      );

      if (marks.length > 0){
       
         let currentPage = Math.max.apply(Math, marks.map(x => parseInt(x.page)));

         // get the last mark recorded according to the page number
         let currentRecords = marks.filter(x => x.page == currentPage).map(x => x.date);

         // get the hieghst repeat
         let lastRecordNum = Math.max.apply(Math, currentRecords.map(x => parseInt(x.repeat)));

         // get the record with the last repeat
         var maxDate=new Date(Math.max.apply(null,currentRecords));
         
         return maxDate ?date.formatDate(maxDate, "DD/MMMM/YYYY")  : ""
         
    }
    },
    getDetails(sid){
      
      return this.selectdMemo.details.map(detail => {
      let page = 0;
      let repeat = 0;
      let marks = this.GET_MEMO_MARKS.filter(
        (x) =>
          x.studentId === sid && x.memoId === this.selectdMemo.id && detail.uid === x.detailsId
      );

      if (marks.length > 0){
         // get the max page number 
         let currentPage = Math.max.apply(Math, marks.map(x => parseInt(x.page)));
         // get the last mark recorded according to the page number
         let currentRecords = marks.filter(x => x.page == currentPage);
         // convert last records to date object to take the hieghst date
         let dates = currentRecords.map(x => x.date);
         // get the hieghst repeat
         let lastRecordNum = Math.max.apply(Math, currentRecords.map(x => parseInt(x.repeat)));
         // get the record with the last repeat
         let currentRecord = currentRecords?.find(x => x.repeat == lastRecordNum);
         // get the hieghst date
         var maxDate=new Date(Math.max.apply(null,dates));
         maxDate = maxDate ? date.formatDate(maxDate, "DD/MMMM/YYYY")  : ""
         // if the currect page stattus was success then get the next page ,
         // otherwaise increase the repeat by one and set the page as same
         if (currentRecord?.status)
           page  = currentPage +1;
        else{
          page = currentPage;
          repeat = currentRecord?.repeat + 1
        }
        
      }
      else 
         page = detail.pageNumberFrom;

        // the convered object, carrying the detail object , plus the page number, the repeat ,
        // and the lastupdateddate
        return {
          detail : detail,
          page : page,
          repeat : repeat,
          date : maxDate
        }



      });
     

    },

    changeMemoDetails() {
      console.log(this.selectdMemo);
      this.memoDetails = this.memorizations.filter(
        (x) => x.id === this.selectdMemo
      ).details;
      this.students = this.GET_STUDENTS.filter(
        (student) =>
          student.groupId != undefined && student.groupId == this.group.id
      );
    },
    changeGroup() {
      this.memorizations = [];
      this.students = [];
      let groupMemorizations = this.GET_GROUPS.find(
        (x) => x.id == this.group.id
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