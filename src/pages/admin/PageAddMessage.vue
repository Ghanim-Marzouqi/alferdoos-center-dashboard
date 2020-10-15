<template>
  <q-page padding>
    <q-form ref="hStudentInfoForm">
      <div class="text-weight-bold">رسالة إلى :</div>
      <div class="row">
        <div class="col-5 q-ml-xs">
          <q-checkbox
            v-show="action != 'view'"
            v-model="allGroups"
            @input="
              allGroups ? (selectedGroups = groups) : (selectedGroups = [])
            "
            label="الكل"
          />
          <q-select
            v-model="selectedGroups"
            outlined
            multiple
            :options="groups"
            label="إختر مجموعة"
          />
        </div>

        <div class="col-5 q-ml-xs">
          <q-checkbox
            v-show="action != 'view'"
            v-model="allStudents"
            @input="
              allStudents
                ? (selectedStudents = students)
                : (selectedStudents = [])
            "
            label="الكل"
          />
          <q-select
            v-model="selectedStudents"
            multiple
            outlined
            :options="students"
            label="إختر الطلاب"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-5 q-ml-xs">
          <q-checkbox
            v-show="action != 'view'"
            v-model="allTeachers"
            @input="
              allTeachers
                ? (selectedTeachers = teachers)
                : (selectedTeachers = [])
            "
            label="الكل"
          />
          <q-select
            v-model="selectedTeachers"
            outlined
            multiple
            :options="teachers"
            label="إختر المعلمين"
          />
        </div>
      </div>

      <div class="text-weight-bold q-mt-xl">الموضوع :</div>

      <div class="row">
        <div class="col-5 q-ml-xs">
          <q-input
            dense
            square
            outlined
            clearable
            v-model="message.title"
            :disable="action == 'view'"
            type="text"
            label="الموضوع"
            lazy-rules
            :rules="[(val) => (val && val.length > 0) || 'الموضوع مطلوب']"
          />
        </div>

        <div class="col-3"></div>
      </div>
      <div class="text-weight-bold">المرفقات :</div>
      <div class="row">
        <div class="col-10">
          <q-file
            v-if="action != 'view'"
            v-model="message.files"
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
            v-for="(file, i) in message.uplodedFiles"
            :key="i"
            clickable
            :icon-right="action == 'view' ? 'o_get_app' : 'delete'"
            @click="action == 'view' ? downloadFile(file) : removeFile(i)"
            >{{ file.name }}</q-chip
          >
        </div>
      </div>
      <div class="text-weight-bold q-mt-md">محتوى الرسالة</div>
      <div class="row">
        <div class="col-10">
          <q-input
            dense
            square
            outlined
            :disable="action == 'view'"
            :autogrow="false"
            clearable
            v-model="message.content"
            :rules="[(val) => (val && val.length > 0) || 'محتوى الرسالة']"
            type="textarea"
            label="المحتوى"
          />
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-2 q-ml-xs">
          <q-btn
            v-if="action != 'view'"
            outline
            color="primary"
            label="إرسال"
            @click="saveMeetings"
          />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { MESSAGES, ERRORS, GETTERS, ACTIONS } from "../../config/constants";
import { date } from "quasar";
import students from "src/store/modules/students";
import teachers from 'src/store/modules/teachers';

export default {
  name: "PageAddMessage",
  props: {
    id: { type: String, required: false },
    action: { type: String, required: true },
  },
  data() {
    return {
      groups: [],
      students: [],
      teachers: [],
      allGroups: false,
      allStudents: false,
      allTeachers: false,
      selectedGroups: [],
      selectedStudents: [],
      selectedTeachers: [],
      message: {
        title: "",
        date: "",
        content: "",
        sender: "",
        files: [],
        groups : [],
        recipients: [],
      },
    };
  },

  async created() {
    this.FETCH_STUDENTS({ status: "" });
    await this.FETCH_GROUPS();
    if (this.GET_GROUPS.length > 0) {
      this.groups = this.GET_GROUPS.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    }
    await this.FETCH_TEACHERS();
    if (this.GET_TEACHERS.length > 0) {
      this.teachers = this.GET_TEACHERS.map((teacher) => ({
        label: teacher.name,
        value: teacher.id,
      }));
    }
  },
  computed: {
    ...mapGetters({
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_TEACHERS: GETTERS.TEACHERS.GET_TEACHERS,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_TEACHERS: ACTIONS.TEACHERS.FETCH_TEACHERS,
      ADD_MESSAGE: ACTIONS.SETTINGS.ADD_MESSAGE,
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    saveMeetings() {
      let recps = this.selectedTeachers.concat(this.selectedStudents);
      this.message.sender ={ id : this.GET_USER.id , name : this.GET_USER.name },
      this.message.date = Date.now();
      this.message.groups = this.allStudents ? this.selectedGroups : [];
      this.message.recipients = this.allStudents ? this.selectedTeachers : recps;
      this.ADD_MESSAGE(this.message);
    },
  },
  watch: {
    selectedGroups: function (newState) {
      let groupIds = this.selectedGroups.map((x) => x.id);
      this.students = this.GET_STUDENTS.filter((s) =>
        groupIds.some((id) => id == s.groupId)
      ).map((s) => ({ label: s.name, value: s.id }));
      this.selectedStudents = this.allGroups ? this.students : [];
      this.allStudents = this.allGroups;
    },
    GET_LOADING: function (newState) {
      newState ? this.$q.loading.show() : this.$q.loading.hide();
    },
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.MESSAGE_ADDED) {
        
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q
            .dialog({
              title: "تمت العملية بنجاح",
              message: "تم إرسال الرسالة بنجاح",
            })
            .onOk(() => {
              this.$router.push({ path: "admin-message-page" });
            });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_MESSAGE_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إرسال الرسالة",
          });
        }
      }
    },
  },
};
</script>

<style>
</style>