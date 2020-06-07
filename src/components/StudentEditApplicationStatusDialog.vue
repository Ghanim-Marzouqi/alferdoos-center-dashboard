<template>
  <q-dialog
    v-model="isEditApplicationDailogOpen"
    @before-show="setStudentData"
    @hide="resetStudntData"
  >
    <q-card style="min-width: 300px">
      <q-card-section>
        <div class="text-h5">تعديل حالة الطلب</div>
      </q-card-section>
      <q-card-section style="margin-top: -20px">
        <div>
          <q-radio
            v-model="applicationStatus"
            val="exam"
            label="قبول لأداء الأختبار"
          />
        </div>
        <div>
          <q-radio
            v-model="applicationStatus"
            val="reject"
            label="رفض الطالب"
          />
          <q-input
            class="textarea"
            v-if="applicationStatus === 'reject'"
            v-model="applicationStatusReasons"
            filled
            label="أسباب الرفض"
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn
          flat
          label="إلغاء"
          color="primary"
          @click="$emit('closeApplicationStatusDialog')"
        />
        <q-btn
          flat
          label="حفظ"
          color="primary"
          :loading="GET_LOADING"
          @click="editApplicationStatus"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ACTIONS, GETTERS } from "../config/constants";

export default {
  name: "StudentEditApplicationStudentDialog",
  props: {
    isEditApplicationDailogOpen: {
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
    reasons: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      registeredStudent: {},
      applicationStatus: "",
      applicationStatusReasons: ""
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
        this.applicationStatus = this.status;
        this.applicationStatusReasons = this.reasons;
      }
    },
    editApplicationStatus() {
      this.EDIT_STUDENT_STATUS({
        id: this.registeredStudent.id,
        status: this.applicationStatus,
        reasons: this.applicationStatusReasons
      });

      this.$emit("closeApplicationStatusDialog");
    },
    resetStudntData() {
      this.registeredStudent = {};
    }
  }
};
</script>
