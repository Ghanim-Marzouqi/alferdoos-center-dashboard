<template>
  <q-page padding>
    {{ updateMeeting() }}
    <q-form ref="hStudentInfoForm">
      <div class="text-weight-bold">عنوان المحضر :</div>
      
      <div class="row">
        <div class="col-5 q-ml-xs">
          <q-input
            dense
            square
            outlined
            clearable
            v-model="meeting.title"
            :disable="action == 'view'"
            type="text"
            label="عنوان المحضر"
            lazy-rules
            :rules="[
                    val => (val && val.length > 0) || 'عنوان المحضر'
                  ]"
          />
        </div>
        <div class="col-4 q-ml-xs">
          <q-input
            ref="date"
            :disable="action == 'view'"
            dense
            square
            outlined
            clearable
            v-model="meeting.date"
            label="إختر تاريخ"
            lazy-rules
            :rules="[ val => val !== null && val !== '' || 'الرجاء إختيار تاريخ']"
            @click="$refs.qDateProxy.show()"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy">
                  <q-date
                    v-model="meeting.date"
                    mask="DD/MM/YYYY"
                    @input="() => $refs.qDateProxy.hide()"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-1 q-ml-xs">
          <q-btn
            v-if="action != 'view'"
            outline
            color="primary"
            label="حفظ"
            @click="saveMeetings"
          />
        </div>
        <div class="col-3"></div>
      </div>
       <div class="text-weight-bold">المرفقات :</div>
      <div class="row">
        <div class="col-10">
                <q-file
                v-if="action != 'view'"
            v-model="meeting.files"
            label="المرفقات"
            dense
            use-chips
            outlined
            multiple
            accept=".pdf"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
          
          <q-chip
            v-for="(file, i) in meeting.uplodedFiles"
            :key="i"
            clickable
            :icon-right="action == 'view' ? 'o_get_app' : 'delete'"
            @click="action == 'view' ? downloadFile(file) : removeFile(i)"
          >{{ file.name }}</q-chip>
          
        </div>
      </div>
      <div class="text-weight-bold q-mt-md">ملخص المحضر</div>
      <div class="row">
        <div class="col-10">
          <q-input
            dense
            square
            outlined
            :disable="action == 'view'"
            :autogrow="false"
            clearable
            v-model="meeting.description"
            :rules="[ val => (val && val.length > 0) || 'ملخص المحضر']"
            type="textarea"
            label="ملخص المحضر"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { MESSAGES, ERRORS, GETTERS, ACTIONS } from "../../../config/constants";
import { date } from "quasar";

export default {
  name: "PageEditMemorizations",
  props: {
    id: { type: String, required: false },
    action: { type: String, required: true },
    isEdit: { type: Boolean, required: true },
  },
    data() {
    return {
      meeting: { 
        title: "", 
        date: "", 
        description: "",
        files : [] },
    };
  },

  created() {},
  computed: {
    ...mapGetters({
      GET_METTINGS: GETTERS.SETTINGS.GET_METTINGS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_MEETINGS: ACTIONS.SETTINGS.FETCH_MEETINGS,
      SET_MEETINGS: ACTIONS.SETTINGS.SET_MEETINGS,
      EDIT_MEETING: ACTIONS.SETTINGS.EDIT_MEETING,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    removeFile(index){
      this.meeting.files.splice(index,1);
    },
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
    
    saveMeetings() {
      this.action == "edit"
        ? this.EDIT_MEETING(this.meeting)
        : this.SET_MEETINGS(this.meeting);
    },
    updateMeeting() {
      if (this.id != undefined)
       { this.meeting = this.GET_METTINGS.find((m) => m.id == this.id); }
    },
  },
  watch: {
    GET_LOADING : function (newState) {
     newState ? this.$q.loading.show() : this.$q.loading.hide();
  },
    id: function (newState) {
      this.meeting = this.GET_METTINGS.find((m) => m.id == newState);
    },
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.MEETINGS_ADDED) {
          this.FETCH_MEETINGS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q
            .dialog({
              title: "تمت العملية بنجاح",
              message: "تم إضافة محضر جديد بنجاح",
            })
            .onOk(() => {
              this.$router.push({ path: "edit-meetings" });
            });
        }

        if (messageCode === MESSAGES.DATABASE.MEETING_UPDATED) {
          this.FETCH_MEETINGS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q
            .dialog({
              title: "تمت العملية بنجاح",
              message: "تم تحديث المحضر بنجاح",
            })
            .onOk(() => {
              this.$router.push({ path: "edit-meetings" });
            });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.SET_MEETINGS_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة محضر جديد",
          });
        }

        if (errorCode === ERRORS.DATABASE.EDIT_MEETING_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث المحضر جديد",
          });
        }
      }
    },
  },
};
</script>

<style>
</style>