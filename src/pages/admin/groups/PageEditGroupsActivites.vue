<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">الأنشطة</p>

    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">أنشطة المجموعات</p>
        <q-btn class="q-mb-md" color="primary" @click="openAddActivityDialog"
          >إضافة نشاط جديدة</q-btn
        >
      </div>
      <div class="col-12">
                <q-table :data="GET_ACTIVITIES" :columns="columns" row-key="id" :loading="GET_LOADING">
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
                  color="green"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                />
              </q-td>
              <q-td key="title" :props="props">{{ props.row.title }}</q-td>
              <q-td key="startDate" :props="props">{{ props.row.startDate }}</q-td>
              <q-td key="endDate" :props="props">{{ props.row.endDate }}</q-td>
              <q-td key="semester" :props="props">{{ props.row.semester.name }}</q-td>
              <q-td key="close" :props="props">               
                 {{ props.row.group.label }}
              </q-td>
              <q-td key="edit" :props="props">               
                 <q-btn  dense flat @click.stop="onEditClick(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn dense  flat @click.stop="onDeleteClick(props.row.id)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <q-markup-table flat bordered>
                    <thead>
                      <tr class="bg-primary text-white">
                        <th class="text-left">
                          <strong>تفاصيل أكثر</strong>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr> 
                        <td class="text-left"><p style="color:red; font-size:22px">توصيف:</p>
                        {{ props.row.description }}</td>
                      </tr>
                      <!-- <tr>
                        <td class="text-left">
                          <p style="color:red; font-size:22px">تقرير الآداء:</p>
                          {{ props.row.feedback }}</td>
                      </tr> -->
                    </tbody>
                  </q-markup-table>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

        <ActivityDialog
      :isOpen="isActivityDialogOpen"
      :activity="activity"
      :id="activityId"
      :isEdit="isEdit"
      @close="closeDialog"
    />


  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../../../config/constants";
import groups from "src/store/modules/groups";
export default {
  name: "PageGroupsActivites",
  data() {
    return {
      isActivityDialogOpen: false,
      isEdit: false,
      activityId : "",
      activity: {
        year : "",
        isDone : false,
        endDate: "",
        startDate: "",
        semester: "",
        title: "",
        description: "",
        feedback : "",
        group: "",
        createdBy: "",
        createdAt : "",
      },
       columns: [
        {
          name: "title",
          required: true,
          label: "عنوان",
          field: (row) => row.title,
          align: "left",
        },
        {
          name: "startDate",
          required: true,
          label: "بدء النشاط",
          field: "startDate",
          align: "center",
        },
        {
          name: "endDate",
          required: true,
          label: "نهاية النشاط",
          field: "endDate",
          align: "center",
        },
        {
          name: "semester",
          required: true,
          label: "الفصل",
          field: "semester",
          align: "center",
        },
        {
          name: "close",
          required: true,
          label: "أنهاء النشاط",
          field: "close",
          align: "center",
        },
        {
          name: "edit",
          required: true,
          label: "تعديل",
          field: "edit",
          align: "center",
        },
        {
          name: "delete",
          required: true,
          label: "حذف",
          field: "delete",
          align: "center",
        },
      ],
    };
  },
  async created() {
    this.FETCH_GROUPS();
    await this.FETCH_YRAT_INFO();
    await this.FETCH_ACTIVITIES({ year : this.GET_YEAR_INFO.name})
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_ACTIVITIES : GETTERS.STUDNETS.GET_ACTIVITIES,
      GET_USER: GETTERS.AUTH.GET_USER,
      GET_GROUPS: GETTERS.GROUPS.GET_GROUPS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_YRAT_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      FETCH_GROUPS: ACTIONS.GROUPS.FETCH_GROUPS,
      FETCH_ACTIVITIES: ACTIONS.STUDNETS.FETCH_ACTIVITIES,
      DELETE_ACTIVITY : ACTIONS.STUDNETS.DELETE_ACTIVITY,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    closeDialog(){
      this.isActivityDialogOpen = false
      this.isEdit = false;
      this.id = "",
      this.activity = {
        year : "",
        isDone : false,
        endDate: "",
        startDate: "",
        semester: "",
        title: "",
        description: "",
        feedback : "",
        group: "",
        createdBy: "",
        createdAt : "",
      }

    },
    onDeleteClick(id){
      this.DELETE_ACTIVITY(id)
    },
    onEditClick(activity){
      this.activityId = activity.id
      this.isEdit = true;
      this.activity = activity;
      this.isActivityDialogOpen = true;
    },
    openAddActivityDialog() {
      let sem = this.GET_YEAR_INFO.semesters.find((sem) => sem.isCurrent);
      this.activity.createdBy = {
        id: this.GET_USER.id,
        name: this.GET_USER.name,
      };
      this.activity.semester = sem;
      this.activity.year = this.GET_YEAR_INFO.id;
      this.isActivityDialogOpen = true;
    },
  },
  watch: {
    GET_LOADING: function (newState) {
      newState ? this.$q.loading.show() : this.$q.loading.hide();
    },
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.ACTIVITY_UPDATED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_ACTIVITIES({ year: "2020" });
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تمت تحديث النشاط بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.STUDENT_ACTIVITY_DELETED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_ACTIVITIES({ year: "2020" });
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف النشاط بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.ACTIVITY_ADDED) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.FETCH_ACTIVITIES({ year: "2020" });
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة النشاط بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.UPDATE_ACTIVITY_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء محاولة تحديث النشاط",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.STUDENT_DELETE_ACTIVITY_ERROR) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء محاولة حذف النشاط",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }

        if (errorCode === ERRORS.DATABASE.ADD_ACTIVITY_FAIL) {
          this.$q.dialog({
            title: "فشلت العملية",
            message: "حدث خطأ أثناء إضافة نشاط جديد",
          });
          this.CLEAR_ERRORS_AND_MESSAGES();
        }
      }
    },
  },
  components: {
    ActivityDialog : () => import("components/GroupAddActivityDialog.vue"),   
  },
};
</script>
