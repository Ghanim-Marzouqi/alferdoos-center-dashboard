<template>
  <q-dialog v-model="isTeacherDialogOpen" @before-show="intializeValues">
    <q-card style="width: 400px">
      <q-form ref="teacherForm" @submit="onSubmit" class="q-gutter-md">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
          <div class="q-mt-lg">
            <q-input
              class="q-mt-sm"
              filled
              v-model="teacherData.teacherName"
              label="اسم المعلم"
              type="text"
              :rules="[val => val.length > 0 || 'الرجاء ادخال اسم المعلم']"
            />

            <q-input
              class="q-mt-sm"
              filled
              v-model="teacherData.teacherEmail"
              label="البريد الإلكتروني"
              type="email"
              :rules="[
                val => (val && val.length > 0) || 'الرجاء كتابة البريد الإلكتروني',
                val => isEmailValid(val) || 'البريد الإلكتروني غير صحيح'
              ]"
            />
            <q-input
              class="q-mt-sm"
              filled
              v-model="teacherData.teacherPhone"
              label="رقم الهاتف"
              type="number"
              :rules="[
                val => (val !== null && val !== '') || 'الرجاء كتابة رقم الهاتف',
                val => val.length === 8 || 'رقم الهاتف غير صحيح',
                val => val.substring(0, 1) === '9' || val.substring(0, 1) == '7' || 'رقم الهاتف غير صحيح'
              ]"
            />
            <q-select
              filled
              v-model="teacherData.isTeacherActive"
              :options="isActiveOptions"
              label="حالة الحساب"
              v-if="getStatus"
              @input="changeStatus"
            />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="closeTeacherDialog">إلغاء</q-btn>
          <q-btn dense flat color="primary" type="submit" :loading="GET_LOADING">حفظ</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "TeacherDialog",
  props: {
    isTeacherDialogOpen: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    teacher: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      teacherData: {
        teacherId: "",
        teacherName: "",
        teacherEmail: "",
        teacherPhone: "",
        isTeacherActive: "",
      },
      isActiveOptions: [
        {
          label: "نشط",
          value: true,
        },
        {
          label: "موقوف",
          value: false,
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
    getStatus() {
      if (this.teacher && Object.keys(this.teacher).length > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    ...mapActions({
      ADD_TEACHER: ACTIONS.TEACHERS.ADD_TEACHER,
      EDIT_TEACHER: ACTIONS.TEACHERS.EDIT_TEACHER,
    }),
    intializeValues() {
      if (this.teacher && Object.keys(this.teacher).length > 0) {
        this.teacherData.teacherId = this.teacher.id;
        this.teacherData.teacherName = this.teacher.name;
        this.teacherData.teacherEmail = this.teacher.email;
        this.teacherData.teacherPhone = this.teacher.phone;
        this.teacherData.isTeacherActive = this.teacher.isActive
          ? "نشط"
          : "موقوف";
      }
    },
    isEmailValid(email) {
      return email == "" ? "" : this.reg.test(email) ? true : false;
    },
    changeStatus(status) {
      this.teacherData.isTeacherActive = status.label;
    },
    async onSubmit() {
      let valid = await this.$refs["teacherForm"].validate();

      if (valid) {
        this.editTeacher();
      }
    },
    editTeacher() {
      if (this.teacherData.teacherId !== "") {
        this.EDIT_TEACHER({
          id: this.teacherData.teacherId,
          name: this.teacherData.teacherName,
          email: this.teacherData.teacherEmail,
          phone: this.teacherData.teacherPhone,
          isActive: this.teacherData.isTeacherActive === "نشط" ? true : false,
        });
      } else {
        this.ADD_TEACHER({
          name: this.teacherData.teacherName,
          email: this.teacherData.teacherEmail,
          phone: this.teacherData.teacherPhone,
        });
      }
    },
    closeTeacherDialog() {
      this.teacherId = "";
      this.teacherName = "";
      this.teacherEmail = "";
      this.teacherPhone = "";
      this.isTeacherActive = "";
      this.$emit("closeTeacherDialog", false);
    },
  },
};
</script>