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
                  <q-icon name="o_edit" color="primary" />
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
                  <q-icon name="o_edit" color="primary" />
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
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";

// Get Today's Date
const today = new Date();

export default {
  name: "PageYearInfoSettings",
  data() {
    return {
      yearInfo: {},
      currentYear: "",
      startPeriodDate: date.formatDate(today, "YYYY/MM/DD"),
      endPeriodDate: date.formatDate(today, "YYYY/MM/DD"),
      isYearDialogOpen: false,
      isDateDialogOpen: false
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
      GET_ERRORS: GETTERS.UI.GET_ERRORS
    }),
    getTodayDate() {
      return date.toISOString
        .split("T")[0]
        .split("-")
        .join("/");
    }
  },
  methods: {
    ...mapActions({
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      SET_YEAR_NAME: ACTIONS.SETTINGS.SET_YEAR_NAME,
      SET_REGISTRATION_PERIOD: ACTIONS.SETTINGS.SET_REGISTRATION_PERIOD,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
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
            "يجب أن يكون تاريخ بداية التسجيل أصغر من أو يساوي تاريخ إنتهاء التسجيل"
        });
        return;
      }

      // Set Registration Period Dates
      this.SET_REGISTRATION_PERIOD({
        startPeriodDate: startDateTimestamp,
        endPeriodDate: endDateTimestamp
      });
    }
  },
  filters: {
    getDate(val) {
      return date.formatDate(val, "YYYY/MM/DD");
    }
  },
  watch: {
    GET_YEAR_INFO: function(newState, oldState) {
      if (Object.keys(newState).length > 0) {
        this.currentYear = newState.name;
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
    GET_MESSAGES: function(newState, oldState) {
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
            message: "تم إضافة بيانات السنة الدراسية بنجاح"
          });

          // Dismiss Dialog
          this.isYearDialogOpen = false;
        }

        if (messageCode === MESSAGES.DATABASE.YEAR_INFO_UPDATED) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Fetch Year Info
          this.FETCH_YEAR_INFO();

          // Display Success Dialog
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث بيانات السنة الدراسية بنجاح"
          });

          // Dismiss Dialog
          this.isYearDialogOpen = false;
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
            message: "تم تحديث بيانات السنة الدراسية بنجاح"
          });

          // Dismiss Dialog
          this.isDateDialogOpen = false;
        }
      }
    },
    GET_ERRORS: function(newState, oldState) {
      if (newState.length > 0) {
        // Get Message Code
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.YEAR_INFO_ERROR) {
          // Clear Messages
          this.CLEAR_ERRORS_AND_MESSAGES();

          // Display Success Dialog
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ اثناء إضافة / تحديث بيانات السنة الدراسية"
          });
        }
      }
    }
  }
};
</script>

<style></style>
