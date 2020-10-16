<template>
    <q-dialog
    @before-show="initValues"
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
           <p class="text-h6 text-weight-bold">الأنشطة</p>

    <div class="row q-pa-md">
      <div class="col-12">
        <q-table :data="activities" :columns="columns" row-key="id" :loading="GET_LOADING">
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
                      <tr>
                        <td class="text-left">
                          <p style="color:red; font-size:22px">تقرير الآداء:</p>
                          {{ props.row.feedback }}</td>
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
const moment = require("moment");
export default {
  name: "ParentShowActivitesDialog",
  props : {
    groupId : {
      type : String,
      default : ""
    },isOpen:{
      type : Boolean,
      default : false,
    },
    isPending:{
      type : Boolean,
      default : false,
    },
  },
  data() {
    return {
      isEdit: true,
      activity : {},
      activities :[],
      isCloseActivityDialogOpen : false,
      isActivityDialogOpen : false,
      title : "تعديل نشاط",
      maximizedToggle: true,
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
      ],
    };
  },
  created() {
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_ACTIVITIES : GETTERS.STUDNETS.GET_ACTIVITIES,
    }),
  },
  methods: {
     ...mapActions({
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
    }),
    initValues()
    {
      
      this.activities = this.GET_ACTIVITIES.filter(b => {
        let dates = b.endDate.split('/')
        let endDate = moment(dates[2]+'-'+dates[1]+'-'+dates[0])
        console.log(moment())
      return  b.group.value == this.groupId
      && moment(moment()).isBefore(endDate);
      });
    }

  },

};
</script>

<style lang="scss" scoped>
.q-card {
  height: 200px;
}
</style>
