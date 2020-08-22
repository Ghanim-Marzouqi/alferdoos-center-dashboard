<template>
  <q-dialog persistent v-model="isDialogOpen" @hide="resetValues">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="row">
          <div class="col-10">
            <q-input
              filled
              v-model="numOfRepeats"
              type="number"
              label="عدد مرات التكرار"
              :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
              @change="resetRepeats"
            />
          </div>
          <div class="col-2 q-pt-sm">
            <q-btn rounded class="q-ma-xs" color="primary" @click="addNumberOfRepeats">إضافة</q-btn>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row" v-for="(repeat, i) in repeats" :key="i">
          <div class="col-6">
            <q-input
              class="q-ma-xs"
              filled
              :value="repeat.name"
              type="number"
              label="رقم المحاولة"
              :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
            />
          </div>
          <div class="col-6">
            <q-input
              class="q-ma-xs"
              filled
              v-model="repeat.value"
              label="الدرجة"
              mask="#.#"
              fill-mask="0"
              reverse-fill-mask
              :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeDialog">إلغاء</q-btn>
        <q-btn dense flat color="primary" @click="addRepeats">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "AddRepeatDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      numOfRepeats: "",
      repeats: [],
    };
  },
  methods: {
    addNumberOfRepeats() {
      if (Number.parseInt(this.numOfRepeats) > 0) {
        for (let i = 1; i <= Number.parseInt(this.numOfRepeats); i++) {
          this.repeats.push({
            name: i,
            value: "",
          });
        }
      }
    },
    resetRepeats() {
      this.repeats = [];
      this.addNumberOfRepeats();
    },
    addRepeats() {
      this.$emit("setRepeats", this.repeats);
    },
    closeDialog() {
      this.$emit("closeDialog", false);
    },
    resetValues() {
      this.numOfRepeats = "";
      this.repeats = [];
    },
  },
};
</script>
