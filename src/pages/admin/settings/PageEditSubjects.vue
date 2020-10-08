<template>

 <q-page padding>
    <p class="text-h6">إعدادات المواد الدراسية</p>
    <!-- Groups Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">المواد</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click=" isOpenDialog = true"
        >إضافة مادة جديدة</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_SUBJECTS" :columns="columns" row-key="name" :loading="GET_LOADING">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="view" :props="props">
                <q-btn dense flat @click.stop="editSubject('view',props.row)">
                  <q-icon color="gray" name="remove_red_eye" />
                </q-btn>
              </q-td>
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="editSubject('edit',props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>

              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="deleteSubjet(props.row.id)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add Group Dialog -->
    <AddSubjectDialog
      :isOpen="isOpenDialog"
      :marks="marks"
      :action="action"
      :subject="subjectForm"
      @close='resrtForm'
    />

  
  </q-page>
</template>



<script>
import { mapGetters, mapActions } from "vuex";
import {
  GETTERS,
  ERRORS,
  MESSAGES,
  ACTIONS,
} from "../../../config/constants";

export default {
  name: "PageEditSubjects",
  components : {
    AddSubjectDialog : ()=> import("components/SubjectsAddSubjectDialog.vue")
  },
  data() {
    return {
      isOpenDialog : false,
      marks : [],
      action : "",
      subjectForm: {
        id : "",
        year : 0,
        name: "",
        description: "",
        files: [],
        teachers : [],
      },
      columns: [
        {
          name: "name",
          label: "اسم المادة",
          field: "name",
          required: true,
          align: "left",
        },
                {
          name: "view",
          required: true,
          label: "استعراض",
          field: "view",
          align: "right",
        },
        {
          name: "edit",
          required: true,
          label: "تعديل",
          field: "edit",
          align: "right",
        },
        {
          name: "delete",
          required: true,
          label: "حذف",
          field: "delete",
          align: "right",
        },
      ]     
    };
  },
  created() {
    this.CLEAR_ERRORS_AND_MESSAGES();
    this.FETCH_TEACHERS();
    this.FETCH_YEAR_INFO();
    this.FETCH_SUBJECTS();
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS : GETTERS.UI.GET_ERRORS,
      GET_SUBJECTS : GETTERS.SUBJECTS.GET_SUBJECTS,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
       GET_TEACHERS: GETTERS.TEACHERS.GET_TEACHERS
    }),
  },
  methods: {
    ...mapActions({
      REGISTER_SUBJECT: ACTIONS.SUBJECTS.REGISTER_SUBJECT,
      DELETE_SUBJECT : ACTIONS.SUBJECTS.DELETE_SUBJECT,
      FETCH_SUBJECTS : ACTIONS.SUBJECTS.FETCH_SUBJECTS,
      FETCH_YEAR_INFO : ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      FETCH_TEACHERS : ACTIONS.TEACHERS.FETCH_TEACHERS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    deleteSubjet(id){
      //TODO make sure this is not used in any timetable
      this.DELETE_SUBJECT(id);
    },
    resrtForm(){
      this.isOpenDialog = false;
      this.subjectForm = {
        id : "",
        year : this.GET_YEAR_INFO.name,
        name: "",
        description: "",
        files: [],
        teachers : []
      },
      this.marks = this.GET_YEAR_INFO.semesters.map(sem =>({
        id : sem.id,
        name : sem.name,
        options : [],
        totalMarks : 0,
        isActive : false,
        option : {
          text : "", 
          mark : "",
        }
      }));
      
    },
    editSubject(action ,sub)
    {
      let subject = this.GET_SUBJECTS.find(subj => subj.id == sub.id);
      this.action = action
      this.subjectForm.id = subject.id,
      this.subjectForm.year = subject.year;
      this.subjectForm.name = subject.name;
      this.subjectForm.files = [],
      this.subjectForm.uplodedFiles = subject.uplodedFiles;
      this.subjectForm.teachers = subject.teachers != undefined ? subject.teachers.map(t => this.GET_TEACHERS.find( te=> te.id == t.id)) : [];
      this.subjectForm.description = subject.description;
      this.marks = subject.marks.map(sem =>
      ({
        id : sem.semesterId,
        name : this.marks.find(m => m.id == sem.semesterId).name,
        options : sem.criteria.length > 0 ? sem.criteria : [],
        totalMarks :  sem.criteria.length > 0 ? sem.criteria.reduce((a,b) => ({ mark : a.mark + b.mark})).mark : 0,
        isActive : sem.criteria.length > 0 ? true : false,
        option : {
          text : "", 
          mark : "",
        }
      }));
      
      this.isOpenDialog = true;
    }

  },
   watch:{
    GET_MESSAGES: function(newState, oldState) {
            if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.SUBJECT_DELETED) {
          this.FETCH_SUBJECTS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المادة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.SUBJECT_SAVED) {
          this.FETCH_SUBJECTS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حفظ المادة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.SUBJECT_UPDATED) {
          this.FETCH_SUBJECTS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث المادة بنجاح",
          });
        }

        

        

        
        }      

    },
    GET_ERRORS : function(newState, oldState) {
            if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.DELETE_SUBJECT_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المادة",
          });
        }

        
        if (errorCode === ERRORS.DATABASE.ADD_SUBJECT_FAIL) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حفظ المادة",
          });
        }

                if (errorCode === ERRORS.DATABASE.UPDATE_SUBJECT_FAIL) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث المادة",
          });
        }

        

        
        
        }

    },
     GET_YEAR_INFO: function(newState, oldState) {
      if (Object.keys(newState).length > 0) {
        this.subjectForm.year = newState.name;
        this.marks = newState.semesters.map(sem =>({
        id : sem.id,
        name : sem.name,
        options : [],
        totalMarks : 0,
        isActive : false,
        option : {
          text : "", 
          mark : "",
        }
      }));
      }
    },
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 598px) {
  #horizontal-stepper {
    display: none;
  }
}

@media screen and (min-width: 599px) {
  #vertical-stepper {
    display: none;
  }
}
</style>