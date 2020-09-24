<template>
    <q-dialog
      v-model="isOpen"
      persistent
      full-height
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >

      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />

          <q-btn dense flat icon="close" @click="$emit('close')">
            <q-tooltip content-class="bg-white text-primary">إغلاق</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6"></div>
        </q-card-section>

        <q-card-section class="q-pt-none">
           <p class="text-h6 text-weight-bold">المواد</p>

    <div class="row q-pa-md">
      <div class="col-12">
        <q-table :data="getSubjects" :columns="columns" row-key="id" :loading="GET_LOADING">
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                />
              </q-td>
              <q-td key="name" :props="props">{{ props.row.subject.label }}</q-td>
              <q-td key="result" :props="props">
                100 / {{ getTotal(props.row.result)}}
                <q-chip text-color="white" :color="isAllSubmited(props.row.result) ? 'green' : 'red'"  large>
                                
                                {{  isAllSubmited(props.row.result) ? 'تم إعتماد الدرجات  ' : 'لم يتم إكمال الدرجات' }}
                              </q-chip>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <q-markup-table flat bordered>
                    <thead>
                      <tr class="bg-primary text-white">
                        <th class="text-left">
                          <strong>الفصل</strong>
                        </th>
                        <th class="text-left">
                          <strong>الدرجات</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(semester, i) in props.row.result" :key="i">
                        <td class="text-left">{{ getSemesterName(semester.semester) }}</td>
                        <td class="text-left">
                          <q-chip text-color="white" :color="semester.isSubmited ? 'green' : 'red'"  large>
                                
                                {{  semester.isSubmited ? 'تم إعتماد الدرجات  ' : 'لم يتم إكمال الدرجات' }}
                              </q-chip>

                                <q-chip  v-for="(cri, j) in semester.criteria" :key="j" large>
                                <q-avatar color="green" text-color="white">{{ cri.mark}}</q-avatar>
                                {{ cri.text }}/{{ cri.max}}
                              </q-chip>
                                
                          
                        </td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
        </q-card-section>
      </q-card>


    </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../config/constants";
import groups from "src/store/modules/groups";
import { storage } from 'firebase';
export default {
  name: "StudentSubjectMarksDialog",
  props : {
    studentId : {
      type : String,
      default : ""
    },isOpen:{
      type : Boolean,
      default : false,
    }
  },
  data() {
    return {
      maximizedToggle: true,
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم المادة",
          field: (row) => row.name,
          align: "left",
        },
        {
          name: "result",
          required: true,
          label: "النتيجة الكلية",
          field: "result",
          align: "center",
        },
      ],
    };
  },
  created() {

    this.FETCH_MARKS();
    this.FETCH_YEAR_INFO();
  },
  computed: {
    ...mapGetters({
      GET_MARKS: GETTERS.SUBJECTS.GET_MARKS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_YEAR_INFO : GETTERS.SETTINGS.GET_YEAR_INFO
    }),
    getSubjects(){
      let studentMarks = [];
     this.GET_MARKS.forEach(marks => {
       if (marks.students.some(s => s.id == this.studentId ))
       {
         
         let s = marks.students.find(st => st.id == this.studentId)
         studentMarks.push({ subject : marks.subject , result : s.semesters})
       }
     });
     console.log(studentMarks);
     return studentMarks;

    }
  },
  methods: {
     ...mapActions({
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      FETCH_MARKS: ACTIONS.SUBJECTS.FETCH_MARKS,
    }),
    isAllSubmited(semesters){
      let submit = true;
      semesters.forEach(sem => {
        console.log('isSubmited',sem.isSubmited)
        if (!sem.isSubmited)
        {
          submit = false;
        }
      })

      return submit;
    },
    getTotal(semesters){
      let total = 0;
      semesters.forEach(sem =>{
        total += sem.isSubmited ? parseInt(sem.criteria.reduce((a,b) => ({mark : a.mark+b.mark})).mark) : 0;
      })

      return total
    },
    getSemesterName(id){
     return this.GET_YEAR_INFO.semesters.find(s => s.id == id).name;
    }
  },
  watch: {
},
};
</script>

<style lang="scss" scoped>
.q-card {
  height: 200px;
}
</style>
