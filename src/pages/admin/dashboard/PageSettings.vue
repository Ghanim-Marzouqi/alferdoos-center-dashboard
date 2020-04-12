<template>
  <q-page padding>
    <p class="text-h6">الإعدادات</p>

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
              <td class="text-left">{{ currentYear }}</td>
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
              <td class="text-left">{{ startPeriodDate | getDate }} - {{ endPeriodDate | getDate }}</td>
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
          <q-btn flat label="حفظ" @click="saveCurrentYear" v-close-popup />
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
          <q-input v-model="endPeriodDate" outlined readonly mask="date" class="q-mt-md">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qEndDateProxy" transition-show="scale" transition-hide="scale">
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
          <q-btn flat label="حفظ" @click="onPeriodFormSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// Get Current Date
const date = new Date();

export default {
  name: "PageSettings",
  data() {
    return {
      yearInfo: {},
      currentYear: `${date.getFullYear()}/${date.getFullYear() + 1}`,
      startPeriodDate: `${date.toISOString()}`,
      endPeriodDate: `${date.toISOString()}`,
      isYearDialogOpen: false,
      isDateDialogOpen: false
    };
  },
  created() {
    // Fetch Year Info
    this.FETCH_YEAR_INFO();
  },
  computed: {
    ...mapGetters("admins", ["GET_LOADER", "GET_YEAR_INFO"])
  },
  methods: {
    ...mapActions("admins", [
      "FETCH_YEAR_INFO",
      "SET_YEAR_NAME",
      "SET_REGISTRATION_PERIOD"
    ]),
    saveCurrentYear() {
      if (this.currentYear === "") return;

      // store current year name
    },
    onPeriodFormSubmit() {
      if (Date.parse(this.startPeriodDate) > Date.parse(this.endPeriodDate)) {
        this.$q.dialog({
          title: "تنبيه",
          message:
            "يجب أن يكون تاريخ بداية التسجيل أصغر من أو يساوي تاريخ إنتهاء التسجيل"
        });
        return;
      } else {
        console.log("Submit");
        this.isDateDialogOpen = false;
      }
    }
  },
  filters: {
    getDate(val) {
      return val
        .split("T")[0]
        .split("-")
        .join("/");
    }
  },
  watch: {
    startPeriodDate: function(value) {
      console.log("Start Date", Date.parse(value));
    },
    endPeriodDate: function(value) {
      console.log("End Date", Date.parse(value));
    }
  }
};
</script>

<style>
</style>