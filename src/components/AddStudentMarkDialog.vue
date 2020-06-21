<template>
  <q-dialog persistent v-model="isDialogOpen" @before-show="intializeValues" @hide="onHideDialog">
    <q-card>
      <q-form @submit.prevent="saveStudentMarks()">
        <q-card-section class="text-weight-bold">{{ title }}</q-card-section>
        <q-card-section>
          <div class="row q-my-sm">
            <q-list style="width: 100%">
              <q-item v-for="(distribution, i) in exam.marksDistribution" :key="i">
                <q-item-section style="max-width: 40%">{{ distribution.text }}</q-item-section>
                <q-item-section style="max-width: 60%">
                  <div class="row items-center">
                    <q-input
                      id="text-area"
                      v-model="mark[i]"
                      style="width: 130px; margin-top: 21px"
                      dense
                      filled
                      label="الدرجة"
                      :rules="[
                        val => val && val >= 0 || 'حقل مطلوب',
                        val => val <= distribution.marks || 'الدرجة غير صحيحة'
                      ]"
                    />
                    <strong class="q-ml-sm">/ {{ distribution.marks }}</strong>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div>
            <q-input v-model="notes" filled type="textarea" label="الملاحظات" />
          </div>
        </q-card-section>
        <q-card-actions>
          <q-space></q-space>
          <q-btn dense flat color="primary" @click="$emit('closeDialog', false)">إلغاء</q-btn>
          <q-btn dense flat color="primary" type="submit" :loading="GET_LOADING">حفظ</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, EXAM_TYPE } from "src/config/constants";

export default {
  name: "AddStudentMarkDialog",
  props: {
    isDialogOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    exam: {
      type: Object,
      required: true
    },
    studentId: {
      type: String,
      required: true
    },
    marks: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      mark: [],
      notes: "",
      studentMarks: []
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    ...mapActions({
      EDIT_STUDENT_MARK: ACTIONS.STUDNETS.EDIT_STUDENT_MARK
    }),
    intializeValues() {
      let oldMarks = [];
      if (Object.keys(this.marks).length > 0) {
        switch (this.exam.id) {
          case EXAM_TYPE.WRITTEN:
            if (this.marks.written && this.marks.written.length > 0) {
              oldMarks = this.marks.written.map(mark => mark.marks);
              this.mark = [...oldMarks];
              this.notes = this.marks.writtenNotes;
            }
            break;
          case EXAM_TYPE.RECITE:
            if (this.marks.recite && this.marks.recite.length > 0) {
              oldMarks = this.marks.recite.map(mark => mark.marks);
              this.mark = [...oldMarks];
              this.notes = this.marks.reciteNotes;
            }
            break;
          case EXAM_TYPE.READING:
            if (this.marks.reading && this.marks.reading.length > 0) {
              oldMarks = this.marks.reading.map(mark => mark.marks);
              this.mark = [...oldMarks];
              this.notes = this.marks.readingNotes;
            }
            break;
          case EXAM_TYPE.PERSONAL:
            if (this.marks.personal && this.marks.personal.length > 0) {
              oldMarks = this.marks.personal.map(mark => mark.marks);
              this.mark = [...oldMarks];
              this.notes = this.marks.personalNotes;
            }
            break;
        }
      }
    },
    saveStudentMarks() {
      this.exam.marksDistribution.forEach((distribution, i) => {
        this.studentMarks.push({
          text: distribution.text,
          marks: Number.parseInt(this.mark[i])
        });
      });

      this.EDIT_STUDENT_MARK({
        studentId: this.studentId,
        examType: this.exam.id,
        studentMarks: this.studentMarks,
        examNotes: this.notes
      });
    },
    onHideDialog() {
      this.mark = [];
      this.notes = "";
      this.studentMarks = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 400px;
}
textarea {
  resize: none !important;
}
</style>