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
           <p class="text-h6 text-weight-bold">السلوكيات</p>

    <div class="row q-pa-md">
      <div class="col-12">
        <q-table :data="getBehaviors" :columns="columns" row-key="id" :loading="GET_LOADING">
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
                  :color="btype == 'P' ?  'green' : 'red'"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                />
              </q-td>
              <q-td key="title" :props="props">{{ props.row.title }}</q-td>
              <q-td key="date" :props="props">{{ props.row.date }}</q-td>
              <q-td key="semester" :props="props">{{ props.row.semester.name }}</q-td>
              <q-td key="edit" :props="props">               
                 <q-btn dense flat @click.stop="onEditClick(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn></q-td>
              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="onDeleteClick(props.row.id)">
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
                        <td class="text-left">{{ props.row.description }}</td>
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
      
      <BehaviorDialog
      :isOpen="isBehaviorDialogOpen"
      :behavior="behavior"
      :isEdit="isEdit"
      :title="title"
      @close="isBehaviorDialogOpen = false"
    />

    </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS, MESSAGES, ERRORS } from "../config/constants";
import groups from "src/store/modules/groups";
import { storage } from 'firebase';
export default {
  name: "PageStudentMarksDetails",
    components: {
    BehaviorDialog: () => import("components/StudentAddPosBehaviorDialog.vue")
  },
  props : {
    studentId : {
      type : String,
      default : ""
    },isOpen:{
      type : Boolean,
      default : false,
    },
    btype : {
      type : String,
      required : true 
    }
  },
  data() {
    return {
      isEdit: true,
      behavior : {},
      isBehaviorDialogOpen : false,
      title : "تعديل سلوك",
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
          name: "date",
          required: true,
          label: "التاريخ",
          field: "date",
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
  created() {
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_BEHAVIORS : GETTERS.STUDNETS.GET_BEHAVIORS,
    }),
    getBehaviors(){
     return this.GET_BEHAVIORS.filter(b => b.behaviorType == this.btype && b.student.id == this.studentId)
    }
  },
  methods: {
     ...mapActions({
      FETCH_YEAR_INFO: ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      DELETE_BEHAVIOR : ACTIONS.STUDNETS.DELETE_BEHAVIOR
    }),
    onEditClick(behavior){
      behavior.type = this.btype;
      this.behavior = behavior;
      this.isBehaviorDialogOpen = true;
    },
    onDeleteClick(id){
      this.DELETE_BEHAVIOR(id)
    },
  },

};
</script>

<style lang="scss" scoped>
.q-card {
  height: 200px;
}
</style>
