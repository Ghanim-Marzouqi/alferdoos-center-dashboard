<template>
  <q-page padding>
    <p class="text-h6">الرسائل</p>

    <!-- Memorization Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-table
          :data="getEmails"
          :columns="columns"
          row-key="id"
          :loading="GET_LOADING"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
                col.label
              }}</q-th>
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
                    props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                />
              </q-td>
              <q-td key="title" :props="props">{{ props.row.title }}</q-td>
              <q-td key="sender" :props="props">{{
                props.row.sender.name
              }}</q-td>
              <q-td key="date" :props="props">{{
                props.row.date | formatDate
              }}</q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <p>المجموعات</p>
                  <q-chip
                    v-for="(rec, i) in props.row.groups"
                    :key="i"
                    color="red"
                    text-color="white"
                    >{{ rec.label }}</q-chip
                  >
                </div>
                <div class="text-left">
                  <p>الأفراد</p>
                  <q-chip v-for="(rec, i) in props.row.recipients" :key="i">{{
                    rec.label
                  }}</q-chip>
                </div>
                <div class="text-left">
                  <p>المرفقات</p>
                  <q-chip
                    v-for="(file, i) in props.row.uplodedFiles"
                    :key="i"
                    clickable
                    icon-right="o_get_app"
                    @click=" downloadFile(file)"
                    >{{ file.name }}</q-chip
                  >
                </div>
              </q-td>
            </q-tr>

            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <p style="font-size: 20px; color: red">نص الرسالة</p>
                  <p>{{ props.row.content }}</p>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { MESSAGES, ERRORS, GETTERS, ACTIONS } from "../../config/constants";

export default {
  name: "PageAdminMessages",
  data() {
    return {
      columns: [
        {
          name: "title",
          required: true,
          label: "الموضوع",
          field: (row) => row.title,
          align: "left",
        },
        {
          name: "sender",
          required: true,
          label: "المرسل",
          field: (row) => row.sender,
          align: "left",
        },
        {
          name: "date",
          required: true,
          label: "تاريخ الإرسال",
          field: "date",
          align: "left",
          format: (val) => `${date.formatDate(val, "DD/MMMM/YYYY")}`,
        },
      ],
    };
  },
  created() {
    this.FETCH_EMAILS();
  },
  computed: {
    ...mapGetters({
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_EMAILS: GETTERS.SETTINGS.GET_EMAILS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
    getEmails() {
      return this.GET_EMAILS.filter((x) =>
        x.recipients.some((rec) => rec.value == this.GET_USER.id)
      );
    },
  },
  filters: {
    formatDate(val) {
      return `${date.formatDate(val, "DD/MMMM/YYYY - hh:mm a")}`;
    },
  },
  methods: {
    ...mapActions({
      FETCH_EMAILS: ACTIONS.SETTINGS.FETCH_EMAILS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
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
    onAddNewMessage() {
      this.$router.push({
        name: "add-message-page",
        params: { action: "add", isEdit: false },
      });
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {},
    GET_ERRORS: function (newState, oldState) {},
  },
};
</script>

<style>
</style>