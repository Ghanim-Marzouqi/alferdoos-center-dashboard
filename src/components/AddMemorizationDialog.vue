<template>
  <q-dialog v-model="isDialogOpen">
    <q-card style="width: 600px">
      <q-form @submit.prevent="addMemorization" @reset="resetMemorization">
        <q-card-section>
          <div class="text-h6">إضافة محفوظ جديد</div>
          <div class="q-ma-2">
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">أسم المحفوظ</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="name"
                  label="أسم المحفوظ"
                  type="text"
                  :rules="[val => val.length > 0 || 'الرجاء إدخال أسم المحفوظ']"
                />
              </div>
            </div>
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">عدد الصفحات</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="pageNumber"
                  label="عدد الصفحات"
                  type="number"
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
              </div>
            </div>
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">درجة كل صفحة</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="pageMark"
                  label="درجة كل صفحة"
                  mask="#.#"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
              </div>
            </div>
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">الدرجة لكل خطأ</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="mistakeMark"
                  label="الدرجة لكل خطأ"
                  mask="#.#"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
              </div>
            </div>
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">الدرجة لكل تنبيه</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="cautionMark"
                  label="الدرجة لكل تنبيه"
                  mask="#.#"
                  reverse-fill-mask
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
              </div>
            </div>
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">عدد مرات التكرار</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="repeatNumber"
                  label="عدد مرات التكرار"
                  type="number"
                  :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
                />
              </div>
            </div>
            <div class="row q-gutter-2">
              <div class="col text-subtitle1">
                <p class="q-ma-md">درجة الرسوب</p>
              </div>
              <div class="col">
                <q-input
                  class="q-mt-sm"
                  filled
                  v-model="failMark"
                  label="درجة الرسوب"
                  mask="#.#"
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
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemorizationDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      name: "",
      pageNumber: "",
      pageMark: "",
      mistakeMark: "",
      cautionMark: "",
      repeatNumber: "",
      failMark: ""
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    ...mapActions({
      ADD_MEMORIZATION: ACTIONS.SETTINGS.ADD_MEMORIZATION
    }),
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    addMemorization() {
      this.ADD_MEMORIZATION({
        name: this.name,
        pageNumber: Number.parseInt(this.pageNumber),
        pageMark: Number.parseFloat(this.pageMark),
        mistakeMark: Number.parseFloat(this.mistakeMark),
        cautionMark: Number.parseFloat(this.cautionMark),
        repeatNumber: Number.parseInt(this.repeatNumber),
        failMark: Number.parseFloat(this.failMark)
      });
    },
    resetMemorization() {
      this.name = "";
      this.pageNumber = "";
      this.pageMark = "";
      this.mistakeMark = "";
      this.cautionMark = "";
      this.repeatNumber = "";
      this.failMark = "";
    }
  }
};
</script>