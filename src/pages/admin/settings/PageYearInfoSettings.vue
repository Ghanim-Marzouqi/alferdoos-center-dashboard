<template>
  <q-page padding>
    <p class="text-h6">إعدادات السنة الدراسية</p>

    <!-- Year Name Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">السنة الدراسية</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">{{ GET_YEAR_INFO.name }}</td>
              <td class="text-right">
                <q-btn dense flat @click="isYearDialogOpen = true">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Registration Period Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">فترة التسجيل</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">
                {{ GET_YEAR_INFO.startPeriodDate | getDate }} -
                {{ GET_YEAR_INFO.endPeriodDate | getDate }}
              </td>
              <td class="text-right">
                <q-btn dense flat @click="isDateDialogOpen = true">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Seesion Time And Break Period Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">إعداد عامة</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">توقيت بداية الحصص : {{ session.start }}</td>
              <td class="text-right">
                <q-btn dense flat @click="isTimeDialogOpen = true">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">
                إستراحة بين الحصص (دقائق) : {{ session.break }}
              </td>
              <td class="text-right">
                <q-btn dense flat @click="isBreakDialogOpen = true">
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Semesters Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">الفصول الدراسية</th>
              <th class="text-right">
                <q-btn
                  dense
                  round
                  size="sm"
                  @click="isAddSemesterDialogOpen = true"
                  color="primary"
                >
                  <q-icon name="o_add" />
                </q-btn>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sem, i) in semesters" :key="sem.id">
              <td class="text-left">
                {{ sem.name }}
              </td>
              <td class="text-right">
                <q-btn
                  dense
                  flat
                  :disable="sem.isCurrent"
                  @click="updateCurrentSemester(sem.id)"
                >
                  <q-icon
                    :color="sem.isCurrent ? 'primary' : 'black'"
                    size="xs"
                    :name="
                      sem.isCurrent ? 'check_circle' : 'check_circle_outline'
                    "
                  />
                </q-btn>
                <q-btn
                  dense
                  flat
                  @click="
                    (isAddSemesterDialogOpen = true),
                      (selectedSemId = sem.id),
                      (semesterTitle = sem.name)
                  "
                >
                  <q-icon name="o_edit" color="teal" />
                </q-btn>
                <q-btn dense flat color="red" @click="onDeleteSemeter(i)">
                  <q-icon name="o_delete"></q-icon>
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Year Name Dialog -->
    <q-dialog v-model="isYearDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">السنة الدراسية</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            outlined
            v-model="currentYear"
            autofocus
            @keyup.enter="isYearDialogOpen = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="إلغاء" v-close-popup />
          <q-btn
            flat
            label="حفظ"
            @click="saveCurrentYear"
            :loading="GET_LOADING"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Registration Period Dialog -->
    <q-dialog v-model="isDateDialogOpen" persistent>
      <q-card>
        <q-card-section>
          <div class="text-h6">السنة الدراسية</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="startPeriodDate" outlined readonly mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qStartDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="startPeriodDate"
                    mask="YYYY/MM/DD"
                    @input="() => $refs.qStartDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="endPeriodDate"
            outlined
            readonly
            mask="date"
            class="q-mt-md"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  ref="qEndDateProxy"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="endPeriodDate"
                    mask="YYYY/MM/DD"
                    @input="() => $refs.qEndDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="إلغاء" v-close-popup />
          <q-btn
            flat
            label="حفظ"
            @click="onPeriodFormSubmit"
            :loading="GET_LOADING"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Seesion Start Dialog -->
    <q-dialog
      v-model="isTimeDialogOpen"
      @before-show="onSessionStartTimeDialogShown"
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">وقت بداية الحصة</div>
        </q-card-section>
        <q-card-section>
          <q-time v-model="sesstionStartTime" landscape />
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="إلغاء"
            v-close-popup
            @click="isTimeDialogOpen = false"
          />
          <q-btn
            flat
            label="حفظ"
            @click="updateSessionStartTime"
            :loading="GET_LOADING"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Break Dialog -->
    <q-dialog
      v-model="isBreakDialogOpen"
      @before-show="onSessionBreakDialogShown"
      persistent
    >
      <q-card>
        <q-card-section>
          <div class="text-h6">الإستراحة بين الحصص</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            outlined
            v-model="sessionBreak"
            autofocus
            @keyup.enter="isBreakDialogOpen = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="إلغاء"
            v-close-popup
            @click="isBreakDialogOpen = false"
          />
          <q-btn
            flat
            label="حفظ"
            @click="updateSessionBreak"
            :loading="GET_LOADING"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add Semester Dialog -->
    <q-dialog v-model="isAddSemesterDialogOpen" persistent>
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">اسم الفصل</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            dense
            outlined
            v-model="semesterTitle"
            autofocus
            @keyup.enter="isAddSemesterDialogOpen = false"
            :rules="[
              (val) => val.length > 0 || 'الرجاء كتابة أسم الفصل الدراسي',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn
            flat
            label="إلغاء"
            v-close-popup
            @click="isAddSemesterDialogOpen = false"
          />
          <q-btn
            flat
            label="حفظ"
            @click="addNewSemester"
            :loading="GET_LOADING"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { date, uid } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";

// Get Today's Date
const today = new Date();

export default {
  name: "PageYearInfoSettings",
  data() {
    return {
      isTimeDialogOpen: false,
      isBreakDialogOpen: false,
      sesstionStartTime: "",
      sessionBreak: "",
      session: { break: 0, start: "" },
      yearInfo: {},
      currentYear: "",
      semesterTitle: "",
      selectedSemId: -1,
      semesters: [],
      startPeriodDate: date.formatDate(today, "YYYY/MM/DD"),
      endPeriodDate: date.formatDate(today, "YYYY/MM/DD"),
      isYearDialogOpen: false,
      isDateDialogOpen: false,
      isAddSemesterDialogOpen: false,
    };
  },
  created() {
    // Fetch Year Info
    this.FETCH_YEAR_INFO();
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
    }),
    getTodayDate() {
      return date.toISOString.split("T")[0].split("-").join("/");
    },
  },
  methods: {
    ...mapActions({
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      SET_YEAR_NAME: ACTIONS.SETTINGS.SET_YEAR_NAME,
      SET_REGISTRATION_PERIOD: ACTIONS.SETTINGS.SET_REGISTRATION_PERIOD,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
      SET_YEAR_SEMESTERS: ACTIONS.SETTINGS.SET_YEAR_SEMESTERS,
      SET_SESSION_SETTINGS: ACTIONS.SETTINGS.SET_SESSION_SETTINGS,
      UPDATE_YEAR_SEMESTERS: ACTIONS.SETTINGS.UPDATE_YEAR_SEMESTERS,
    }),
    updateCurrentSemester(id) {
      let updatedSemesters = this.GET_YEAR_INFO.semesters.map((s) => {
        return {
          isCurrent: s.id === id ? true : false,
          id: s.id,
          name: s.name,
        };
      });

      // console.log("Updated Semesters", updatedSemesters);

      this.UPDATE_YEAR_SEMESTERS({
        year: this.GET_YEAR_INFO.id,
        semesters: updatedSemesters,
      });
    },
    onSessionStartTimeDialogShown() {
      this.sesstionStartTime = this.GET_YEAR_INFO.session.start;
    },
    updateSessionStartTime() {
      this.session = { ...this.session, start: this.sesstionStartTime };
      this.SET_SESSION_SETTINGS({ session: this.session });
    },
    onSessionBreakDialogShown() {
      this.sessionBreak = this.GET_YEAR_INFO.session.break;
    },
    updateSessionBreak() {
      this.session = { ...this.session, break: this.sessionBreak };
      this.SET_SESSION_SETTINGS({ session: this.session });
    },
    saveSemestersIntoDb() {
      this.SET_YEAR_SEMESTERS(this.semesters);
    },
    // TODO add validation not allowing to delte while there is subjects using that semester
    onDeleteSemeter(index) {
      this.semesters.splice(index, 1);
      this.saveSemestersIntoDb();
    },
    addNewSemester() {
      if (this.semesterTitle !== "") {
        // Get Length of Semeter Array
        if (Object.keys(this.GET_YEAR_INFO).length > 0) {
          this.SET_YEAR_SEMESTERS({
            id: uid(),
            isCurrent: false,
            name: this.semesterTitle,
          });
        }
      }
    },
    saveCurrentYear() {
      if (this.currentYear === "") return;
      // Set Current Year Name
      this.SET_YEAR_NAME(this.currentYear);
    },
    onPeriodFormSubmit() {
      // Get Timestamps
      let startDateTimestamp = Date.parse(this.startPeriodDate);
      let endDateTimestamp = Date.parse(this.endPeriodDate);

      // Check if Start Period Date Is Less Or Equal To End Period Date
      if (startDateTimestamp > endDateTimestamp) {
        this.$q.dialog({
          title: "تنبيه",
          message:
            "يجب أن يكون تاريخ بداية التسجيل أصغر من أو يساوي تاريخ إنتهاء التسجيل",
        });
        return;
      }

      // Set Registration Period Dates
      this.SET_REGISTRATION_PERIOD({
        startPeriodDate: startDateTimestamp,
        endPeriodDate: endDateTimestamp,
      });
    },
  },
  filters: {
    getDate(val) {
      return date.formatDate(val, "YYYY/MM/DD");
    },
  },
  watch: {
    GET_YEAR_INFO: function (newState, oldState) {
      if (Object.keys(newState).length > 0) {
        console.log(newState);
        this.currentYear = newState.name;
        this.semesters = newState.semesters;
        this.session = newState.session;
        let time = this.session.start.split(":");
        if (time[0].length == 1) {
          this.session.start = "0" + time[0] + ":" + time[1];
        }
        (this.startPeriodDate = date.formatDate(
          newState.startPeriodDate,
          "YYYY/MM/DD"
        )),
          (this.endPeriodDate = date.formatDate(
            newState.endPeriodDate,
            "YYYY/MM/DD"
          ));
      }
    },
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        // Get Message Code
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.YEAR_INFO_CREATED) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Fetch Year Info
          this.FETCH_YEAR_INFO();

          // Display Success Dialog
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة بيانات السنة الدراسية بنجاح",
          });

          // Dismiss Dialog
          this.isYearDialogOpen = false;
          this.isAddSemesterDialogOpen = false;
        }

        if (messageCode === MESSAGES.DATABASE.YEAR_INFO_UPDATED) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Fetch Year Info
          this.FETCH_YEAR_INFO();

          // Display Success Dialog
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث بيانات السنة الدراسية بنجاح",
          });

          // Dismiss Dialog
          this.isYearDialogOpen = false;
          this.isAddSemesterDialogOpen = false;
          this.semesterTitle = "";
        }

        if (
          messageCode ===
          MESSAGES.DATABASE.YEAR_INFO_REGISTRATION_PERIOD_UPDATED
        ) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Fetch Year Info
          this.FETCH_YEAR_INFO();

          // Display Success Dialog
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث بيانات السنة الدراسية بنجاح",
          });

          // Dismiss Dialog
          this.isDateDialogOpen = false;
          this.isTimeDialogOpen = false;
          this.isBreakDialogOpen = false;
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        // Get Message Code
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.YEAR_INFO_ERROR) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Display Success Dialog
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ اثناء إضافة / تحديث بيانات السنة الدراسية",
          });
        }
      }
    },
  },
};
</script>

<style></style>
