<template>
  <q-dialog v-model="isDialogOpen" @hide="onHideDialog">
    <q-card style="width: 400px">
      <q-form @submit.prevent="addMemorizationDetails">
        <q-card-section>
          <div class="text-h6">إضافة تفاصيل المحفوظ</div>
          <div class="q-ma-2">
            <div class="row q-gutter-2">
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="pageNumberFrom"
                  label="الصفحات (من)"
                  type="number"
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="pageNumberTo"
                  label="الصفحات (إلى)"
                  type="number"
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="pageMarks"
                  label="درجة كل صفحة"
                  mask="#.#"
                  fill-mask="0"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="mistakeMarks"
                  label="درجة الخطأ"
                  mask="#.#"
                  fill-mask="0"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="cautionMarks"
                  label="درجة التنبيه"
                  mask="#.#"
                  fill-mask="0"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="repeatNumber"
                  label="عدد مرات التكرار"
                  type="number"
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="failMarks"
                  label="درجة الرسوب"
                  mask="#.#"
                  fill-mask="0"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="closeDialog">إلغاء</q-btn>
          <q-btn dense flat color="primary" :loading="GET_LOADING" type="submit">حفظ</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { uid } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemorizationDetailsDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false,
    },
    memorization: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      pageNumberFrom: "",
      pageNumberTo: "",
      pageMarks: "",
      mistakeMarks: "",
      cautionMarks: "",
      repeatNumber: "",
      failMarks: "",
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      ADD_MEMORIZATION_DETAILS: ACTIONS.SETTINGS.ADD_MEMORIZATION_DETAILS,
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    addMemorizationDetails() {
      if (Object.keys(this.memorization).length > 0) {
        this.ADD_MEMORIZATION_DETAILS({
          id: this.memorization.id,
          uid: uid(),
          pageNumberFrom: Number.parseInt(this.pageNumberFrom),
          pageNumberTo: Number.parseInt(this.pageNumberTo),
          pageMarks: Number.parseFloat(this.pageMarks),
          mistakeMarks: Number.parseFloat(this.mistakeMarks),
          cautionMarks: Number.parseFloat(this.cautionMarks),
          repeatNumber: Number.parseInt(this.repeatNumber),
          failMarks: Number.parseFloat(this.failMarks),
        });
      }
    },
    onHideDialog() {
      this.pageNumberFrom = "";
      this.pageNumberTo = "";
      this.pageMarks = "";
      this.mistakeMarks = "";
      this.cautionMarks = "";
      this.repeatNumber = "";
      this.failMarks = "";
    },
  },
};
</script>