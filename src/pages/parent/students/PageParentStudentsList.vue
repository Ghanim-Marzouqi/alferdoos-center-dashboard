<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">الطلاب</p>

    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">قائمة الطلاب</p>

      </div>
      <div class="col-12">
        <!-- <q-table :data="getStudents" :columns="columns" row-key="id" :loading="GET_LOADING">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="marks" :props="props">
                <q-btn dense flat @click="selectedStudent=props.row.id, isMarksPageOpened = true" >
                  <q-icon color="teal" name="fas fa-poll" />
                </q-btn>
              </q-td>
              <q-td key="goodBehaviors" :props="props">
                      <q-chip @click="selectedStudent=props.row.id, isBehaviorDialogOpened = true , btype=Good" clickable>
                    <q-avatar color="green" icon="fas fa-thumbs-up" text-color="white"> </q-avatar>
                   {{ props.row.goodBehaviors }}
                  </q-chip>
              </q-td>
              <q-td key="badBehaviors" :props="props">
                      <q-chip clickable @click="btype=Bad, selectedStudent=props.row.id, isBehaviorDialogOpened = true">
                    <q-avatar color="red" icon="fas fa-thumbs-down" text-color="white"> </q-avatar>
                    {{ props.row.badBehaviors }}
                  </q-chip>
              </q-td>
              <q-td key="activities" :props="props">
                <q-btn dense flat @click="selectedStudent=props.row.id, isActivitiesDialogOpen = true" >
                  <q-icon color="teal" name="o_note_add" />
                </q-btn>
              </q-td>
            </q-tr>
         
          </template>
        </q-table> -->

        <div v-for="student in  getStudents" :key="student.id" class="col-md-3">
        <q-card class="my-card q-ma-md" style="margin-top:10px;">
          <div class="row justify-center q-ma-md">
            <p style="font-size:15px; margin-top:10px">
              {{ student.name }}
              <br />
            </p>
          </div>
          <q-card-actions align="center">
                <q-btn dense flat @click="showScheduale(student)" >
                  <q-icon color="teal" name="fas fa-calendar-alt" />
                </q-btn>
            <q-btn dense flat @click="selectedStudent=student.id, isMarksPageOpened = true" >
                  <q-icon color="teal" name="fas fa-poll" />
                </q-btn>
            <q-chip @click="selectedStudent=student.id, isBehaviorDialogOpened = true , btype=Good" clickable>
                    <q-avatar color="green" icon="fas fa-thumbs-up" text-color="white"> </q-avatar>
                   {{ student.goodBehaviors }}
                  </q-chip>
            <q-chip clickable @click="btype=Bad, selectedStudent=student.id, isBehaviorDialogOpened = true">
                    <q-avatar color="red" icon="fas fa-thumbs-down" text-color="white"> </q-avatar>
                    {{ student.badBehaviors }}
                  </q-chip>
            <q-btn dense flat @click="selectedStudent=student.id,isPending = true , isActivitiesDialogOpen=true" >
                  <q-icon color="teal" name="o_note_add" />
                </q-btn>
              <q-btn dense flat @click="selectedStudent=student.id,isPending = false , isActivitiesDialogOpen=true" >
                  <q-icon color="red" name="o_note_add" />
                </q-btn>
          </q-card-actions>
        </q-card>
      </div>

      </div>
    </div>

    <MarksDialog
    :isOpen="isMarksPageOpened"
    :studentId="selectedStudent"
    @close="isMarksPageOpened = false,selectedStudent = ''"/>

    <BehaviorDialog
    :isOpen="isBehaviorDialogOpened"
    :studentId="selectedStudent"
    :btype="btype"
    @close="isBehaviorDialogOpened = false,selectedStudent = ''"/>

    <ActivitiesDialog
    :isOpen="isActivitiesDialogOpen"
    :studentId="selectedStudent"
    :isPending="isPending"
    @close="isActivitiesDialogOpen = false,selectedStudent = ''"/>


  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";
import groups from "src/store/modules/groups";
import students from 'src/store/modules/students';
export default {
  name: "PageStudentsList",
  components : {
    MarksDialog : ()=> import('components/StudentSubjectMarksDialog'),
    BehaviorDialog : ()=> import('components/StudentShowBehaviorsDialog'),
    ActivitiesDialog : ()=> import('components/ParentShowActivitesDialog'),
  },
  data() {
    return {
      Good: "P",
      Bad: "N",
      isPending : false,
      selectedStudent : "",
      isMarksPageOpened : false,
      btype : '',
      isBehaviorDialogOpened : false,
      isActivitiesDialogOpen : false,
      columns: [
        {
          name: "name",
          required: true,
          label: "اسم المجموعة",
          field: (row) => row.name,
          align: "left",
        },
        {
          name: "marks",
          required: true,
          label: "الدرجات",
          field: "marks",
          align: "center",
        },
        {
          name: "goodBehaviors",
          required: true,
          label: "السلوكيات الحسنة",
          field: "goodBehaviors",
          align: "center",
        },
        {
          name: "badBehaviors",
          required: true,
          label: "السلوكيات السيئة",
          field: "badBehaviors",
          align: "center",
        },
        {
          name: "activities",
          required: true,
          label: "الأنشطة",
          field: "activities",
          align: "right",
        },
      ],
    };
  },

  created() {
    this.FETCH_STUDENTS({ status: "" });
    this.FETCH_BEHAVIOR({ year : "2020"});
    this.FETCH_ACTIVITIES({ year : "2020"})
  },
  computed: {
    ...mapGetters({
      GET_STUDENTS: GETTERS.STUDNETS.GET_STUDENTS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_BEHAVIORS : GETTERS.STUDNETS.GET_BEHAVIORS
    }),
      getStudents(){
        // TODO change this filter to take students of the parent only
      return this.GET_STUDENTS.filter(x => x.groupId != undefined).map(
        s => ({
          id : s.id,
          name : s.name,
          group : s.groupId,
          goodBehaviors : this.getTotal(this.Good,s.id),
          badBehaviors : this.getTotal(this.Bad,s.id)
        })
      );
    }
  },
  methods: {
    ...mapActions({
      FETCH_STUDENTS: ACTIONS.STUDNETS.FETCH_STUDENTS,
      FETCH_BEHAVIOR: ACTIONS.STUDNETS.FETCH_BEHAVIOR,
      FETCH_ACTIVITIES: ACTIONS.STUDNETS.FETCH_ACTIVITIES,
    }),
    showScheduale(student){
       this.$router.push({ name: "student-sheduale", params : { group : student.group }});
    },
    getTotal(type,sid){
     let behs =  this.GET_BEHAVIORS.filter(b => b.behaviorType == type && b.student.id == sid)
     return behs.length;
    },

     },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.GROUP_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isAddGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة مجموعة جديدة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isEditGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث اسم المجموعة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isDeleteGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المجموعة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_MEMORIZATIONS_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isAddMemorizationToGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة المحفوظات إلى المجموعة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.GROUP_MEMORIZATIONS_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_GROUPS();
          this.isDeleteMemorizationFromGroupDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المحفوظ من المجموعة بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ADD_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة مجموعة جديدة",
          });
        }

        if (errorCode === ERRORS.DATABASE.EDIT_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث اسم المجموعة",
          });
        }

        if (errorCode === ERRORS.DATABASE.DELETE_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المجموعة",
          });
        }

        if (errorCode === ERRORS.DATABASE.ADD_MEMORIZATION_TO_GROUP_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء إضافة المحفوظات إلى المجموعة",
          });
        }

        if (
          errorCode === ERRORS.DATABASE.DELETE_MEMORIZATION_FROM_GROUP_ERROR
        ) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المحفوظ من المجموعة",
          });
        }
      }
    },
  },
};
</script>
