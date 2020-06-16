<template>
  <q-dialog v-model="isDialogOpen">
    <q-card>
      <q-form @submit.prevent="saveStudentMarks()">
        <q-card-section class="text-weight-bold">{{ title }}</q-card-section>
        <q-card-section>
          <div class="row q-my-sm">
            <q-list style="width: 100%">
              <q-item v-for="(distribution, i) in exam.marksDistribution" :key="i">
                <q-item-section>{{ distribution.text }}</q-item-section>
                <q-item-section>
                  <div class="row items-center">
                    <q-input
                      v-model="input[i]"
                      style="width: 100px; margin-top: 21px"
                      dense
                      filled
                      label="درجة الطالب"
                      :rules="[val => val && val > 0 || 'حقل مطلوب']"
                    ></q-input>
                    <strong class="q-ml-sm">/ {{ distribution.marks }}</strong>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
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
import { GETTERS } from "src/config/constants";

export default {
  name: "AddStudentMarkDialog.vue",
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
    }
  },
  data() {
    return {
      input: [],
      studentMarks: []
    };
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING
    })
  },
  methods: {
    saveStudentMarks() {
      this.exam.marksDistribution.forEach((distribution, i) => {
        this.studentMarks.push({
          key: distribution.text,
          value: this.input[i]
        });
      });

      console.log("Student Marks", {
        examType: this.exam.id,
        marks: this.studentMarks
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.q-card {
  width: 400px;
}
</style>