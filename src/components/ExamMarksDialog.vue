<template>
  <q-dialog v-model="isExamDialogOpen">
    <q-card>
      <q-card-section>
        <div class="q-ma-2">
          <q-input
            filled
            v-model="marks"
            :value="examMarks"
            :label="inputLabel"
            type="number"
            :rules="[val => val > 0 || 'الرجاء إدخال رقم أكبر من صفر']"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="$emit('closeExamDialog', false)">إلغاء</q-btn>
        <q-btn
          dense
          flat
          color="primary"
          :loading="loading"
          @click="$emit('setExamMarks', { examType, examMarks: marks })"
          :disable="isButtonDisabled"
        >حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "ExamMarksDialog",
  props: {
    isExamDialogOpen: {
      type: Boolean,
      default: false
    },
    examMarks: {
      type: String,
      default: ""
    },
    inputLabel: {
      type: String,
      required: true
    },
    examType: {
      type: String,
      required: true
    },
    isButtonDisabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      marks: ""
    };
  }
};
</script>

<style>
</style>