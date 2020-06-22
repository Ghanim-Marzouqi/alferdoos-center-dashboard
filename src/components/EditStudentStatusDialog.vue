<template>
  <q-dialog v-model="isDailogOpen" @before-show="setStudentData" @hide="resetStudntData">
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h5">تعديل حالة الطالب</div>
      </q-card-section>
      <q-card-section style="margin-top: -20px">
        <div>
          <q-radio v-model="studentStatus" :val="statusVal" :label="statusLabel" />
        </div>
        <div>
          <q-radio v-model="studentStatus" val="reject" label="رفض الطالب" />
          <q-input
            class="textarea"
            v-if="studentStatus === 'reject'"
            v-model="rejectionReasons"
            filled
            label="أسباب الرفض"
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn flat label="إلغاء" color="primary" @click="closeDialog" />
        <q-btn flat label="حفظ" color="primary" :loading="GET_LOADING" @click="editStudentStatus" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ACTIONS, GETTERS } from "../config/constants";

export default {
  name: "EditStudentStatusDialog",
  props: {
    isDailogOpen: {
      type: Boolean,
      default: false
    },
    student: {
      type: Object,
      required: true,
      default: {}
    },
    status: {
      type: String,
      default: ""
    },
    statusLabel: {
      type: String,
      required: true
    },
    statusVal: {
      type: String,
      required: true
    },
    reasons: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      registeredStudent: {},
      studentStatus: "",
      rejectionReasons: ""
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    ...mapActions({
      EDIT_STUDENT_STATUS: ACTIONS.STUDNETS.EDIT_STUDENT_STATUS
    }),
    setStudentData() {
      if (Object.keys(this.student).length > 0) {
        this.registeredStudent = this.student;
        this.studentStatus = this.status;
        this.rejectionReasons = this.reasons;
      }
    },
    editStudentStatus() {
      this.EDIT_STUDENT_STATUS({
        id: this.registeredStudent.id,
        status: this.studentStatus,
        reasons: this.rejectionReasons
      });

      this.closeDialog();
    },
    resetStudntData() {
      this.registeredStudent = {};
    },
    closeDialog() {
      this.registeredStudent = {};
      this.studentStatus = "";
      this.rejectionReasons = "";
      this.$emit("closeDialog", false);
    }
  }
};
</script>
