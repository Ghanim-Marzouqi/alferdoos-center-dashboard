<template>
  <q-page>
    <div class="row q-pa-lg">
      <div class="col-12 col-md-4 q-ma-xs">
        <q-select
          outlined
          @input="changeGroup"
          v-model="group"
          :options="groups"
          label="إختر مجموعة"
        />
      </div>
      <div class="col-12 col-md-4 q-ma-xs">
        <q-select
          outlined
          :disable="!isGroupSelected"
          @input="changeSubject"
          v-model="subject"
          :options="groupSubjects"
          label="إختر مادة"
        />
      </div>

            <div class="col-12 col-md-3 q-ma-xs">
        <q-btn color="primary" icon="save" @click="saveMarks('')" label="حفظ" />
         <q-btn color="primary" class="q-ml-xs" icon="save" @click="saveMarks('final')" label="تسليم الدرجات" />
      </div>


      
    </div>

    <div class="row justify-center">
      <div v-for="student in  students" :key="student.id" class="col-md-3">
        <q-card class="my-card q-pa-md q-ml-md" style="margin-top:10px;">
          <div class="row justify-center">
            <p style="font-size:15px; margin-top:10px">
              {{ student.name }}
              <br />
            </p>
          </div>
          <q-item v-for="(option, i) in getSemester(student.semesters).criteria" :key="i">
     
            <q-item-section><p class="red" style="font-size:10px; margin-top:10px">
              {{ option.text }}/{{ option.max }}
              <br />
            </p></q-item-section>
            <q-item-section class="text-center">
              <q-input
                            
                            style="width: 80px"
                            type="number"
                            v-model="option.mark"
                            :disable="getSemester(student.semesters).isSubmited"
                            dense
                            filled
                            :rules="[val => val && val > 0  || 'ادخل الدرجة',
                            val => val <= option.max || 'تجاوز الحد الأقصى ']"
                          ></q-input>
            </q-item-section>
          </q-item>
          <q-separator />
        </q-card>
      </div>
    </div>


  </q-page>
</template>

<script>
import subjects from "../../store/modules/subjects";
import students from "../../store/modules/students";
import { GETTERS, ACTIONS, MESSAGES } from "../../config/constants";
import { mapGetters, mapActions } from "vuex";
const moment = require("moment");

export default {
  data() {
    return {
      semesterId : -1,
      documentId : "",
      isEdit : false,
      groupSubjects : [],
      groups: [],
      allStudents: [],
      students: [],
      subjects: [],
      subject: "",
      isGroupSelected: false,
      isSubjectSelected: false,
      group: "",
    };
  },
  async created() {
    this.FETCH_SUBJECTS();
    this.FETCH_MARKS();
    this.FETCH_STUDENTS({ status: "" });
    this.FETCH_YRAT_INFO();
    await this.FETCH_SCHEDUAL();
    this.GET_SCHADUALS.forEach((sch) => {
        Object.values(sch).forEach((sessions) => {
          if (
            Array.isArray(sessions) &&
            sessions.some((session) => session.teacher.id == this.GET_USER.id)
          ) {
            !this.groups.some(g => g.value == sch.group.value) ? this.groups.push(sch.group) : "";
            sessions.forEach((d) =>
              !this.subjects.some(s => s.value == d.subject.id && s.group == sch.group.value) ?
              this.subjects.push({ group : sch.group.value, value: d.subject.id, label: d.subject.name }) : ""
            );
          }
        });
      });

  },
  methods: {
    ...mapActions({
      FETCH_MARKS : ACTIONS.SUBJECTS.FETCH_MARKS,
      SAVE_MARKS : ACTIONS.SUBJECTS.SAVE_MARKS,
      UPDATE_MARKS : ACTIONS.SUBJECTS.UPDATE_MARKS,
      FETCH_SUBJECTS: ACTIONS.SUBJECTS.FETCH_SUBJECTS,
      FETCH_SCHEDUAL: ACTIONS.SETTINGS.FETCH_SCHEDUAL,
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_YRAT_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    getSemester(marks){
      console.log(this.semesterId);
      console.log(marks.map(x => x.semester));
      let mark = marks.find(m => m.semester == this.semesterId);
      console.log("Marks",mark);
      return mark;
    },
    saveMarks(status){

      if (status == 'final')
      {
        this.students.forEach(s => {
          s.semesters.find(m => m.semester == this.semesterId).isSubmited = true;})
      }
      let marks = {
        subject : this.subject,
        group : this.group,
        students : this.students
      }

      if (this.isEdit){
        this.UPDATE_MARKS({ id : this.documentId , object : marks})
      }else{
        this.SAVE_MARKS(marks)
      }
      
    },
    changeSubject() {

    let marks  = this.GET_MARKS.find(m => m.group.value == this.group.value 
    && m.subject.value == this.subject.value);

     
    if(marks != undefined )
    {
      this.students = marks.students;
      this.documentId = marks.id;
      this.isEdit = true;
      return;
    }


      let studentMarks = this.GET_SUBJECTS.find((s) => s.id == this.subject.value).marks;
      studentMarks = studentMarks.map(mark => ({
        semester : mark.semesterId,
        isSubmited : false,
        criteria : mark.criteria.map((m) => ({
          mark: 0,
          text: m.text,
          max: m.mark }))
      }))

    
      
      this.students = this.allStudents.filter(
        (student) => student.group == this.group.value
      );
      
      this.students.forEach((s) => s.semesters = Array.from(studentMarks) );
     
    },
    resetForm(){
          this.isEdit = false;
          this.students = [],
          this.group = "",
          this.isGroupSelected = false;
          this.subject = "";
    },
    changeGroup() {
      this.isGroupSelected = true;
      this.groupSubjects = this.subjects.filter(s => s.group == this.group.value)
      this.students = [];
      this.subject = "";
    },
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_BEHAVIORS: GETTERS.STUDNETS.GET_BEHAVIORS,
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_MARKS : GETTERS.SUBJECTS.GET_MARKS,
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_SCHADUALS: GETTERS.SETTINGS.GET_SCHADUALS,
      GET_SUBJECTS: GETTERS.SUBJECTS.GET_SUBJECTS,
    }),
  },
  watch: {
    GET_YEAR_INFO : function(newState){
      this.semesterId = newState.semesters.find(sem => sem.isCurrent).id;
    },
    GET_LOADING: function (newState) {
      newState ? this.$q.loading.show() : this.$q.loading.hide();
    },
    GET_STUDENTS: function (oldState, newState) {
      this.allStudents = newState
        .filter((student) => student.groupId != undefined)
        .map((s) => ({
          id: s.id,
          name: s.name,
          group: s.groupId,
          semesters: [],
        }));
    },
    GET_MESSAGES: function (newState, oldState) {
      
      if (newState.length > 0) {
        let messageCode = newState[0].code;
        if (messageCode === MESSAGES.DATABASE.MARKS_SAVED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_MARKS();
          this.resetForm();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حفظ الدرجات بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.MARKS_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_MARKS();
          this.resetForm();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تعديل الدرجات بنجاح",
          });
        }

        

      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.MARKS_SAVING_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء حفظ الدرجات",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

                if (errorCode === ERRORS.DATABASE.MARKS_UPDATE_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء تعديل الدرجات",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

      }
    },
  },
};
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>