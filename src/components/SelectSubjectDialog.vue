<template>
  <q-dialog v-model="isOpen" @before-show="intializeValues">
    
    <q-card style="width: 400px">
      <q-form ref="selectSubject">
      <q-card-section>
        <div class="text-h6">المادة</div>
        <div class="q-ma-2">
          <q-select filled v-model="session.subject" :options="GET_SUBJECTS"
          :option-value="sub => sub"
          :option-label="sub => sub.name"
          @input="val => teachers = val.teachers"
          :rules="[val => val && val.length > 0 || 'اخر مادة']"
           label="إختر مادة" />
           <div class="text-h6">المعلم</div>

            <q-select filled v-model="session.teacher" :options="teachers"
          :option-label="teacher => teacher.name"
          :rules="[val => val && val.length > 0 || 'اخر معلم']"
           label="إختر معلم" />
           <div class="text-h6">الوقت (بالدقائق)</div>
          <q-input
            class="q-mt-sm"
            filled
            type="number"
            v-model="session.time"
            label="الوقت"
            :rules="[val => val.length > 0 || 'الرجاء ادخال الوقت']"
          />
          
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeDialog">إلغاء</q-btn>
        <q-btn dense flat type="submit" color="primary" :loading="GET_LOADING" @click="saveSubject">حفظ</q-btn>
      </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";
import subjects from 'src/store/modules/subjects';

export default {
  name: "SelectSubjectDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },session: {
      type: Object
    },
  },
  data() {
    return {
      teachers : [],
      subjects: [],
    };
  },
  async created() {
    this.FETCH_SUBJECTS({ year : ""/*YEAR_INFO*/ });

  },
  computed: {
    ...mapGetters({
      GET_SUBJECTS: GETTERS.SUBJECTS.GET_SUBJECTS,
      YEAR_INFO : GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_SUBJECTS: ACTIONS.SUBJECTS.FETCH_SUBJECTS
    }),
    intializeValues() {},
    saveSubject() {
      this.$emit("input", {
            id : this.session.id,
            time: this.session.time,
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            subject: { id : this.session.subject.id , name : this.session.subject.name},
            teacher : this.session.teacher,
     });
     this.time = "",
      this.$emit("close", false); 
    },
    closeDialog() {
      this.time = "",

      this.$emit("close", false);
    },
  },
};
</script>