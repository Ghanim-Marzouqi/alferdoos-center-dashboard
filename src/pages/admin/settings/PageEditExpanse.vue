<template>
  <q-page padding>
    <p class="text-h6">إعدادات المحاضر</p>

    <!-- Memorization Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">محاضر الإجتماعات</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click="expance.isDebit = true , expance.isCredit = false ,addExpanceDialog = true"
        >إضافةإنفاق</q-btn>
         <q-btn
          class="q-mb-md"
          color="primary"
          @click="expance.isDebit = false , expance.isCredit = true ,addExpanceDialog = true"
        >إضافة مدخول</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_METTINGS" :columns="columns" row-key="id" :loading="GET_LOADING">
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
              <q-td key="title" :props="props">{{ props.row.title }}</q-td>
              <q-td key="view" :props="props">
                <q-btn dense flat @click.stop="onViewClick(props.row)">
                  <q-icon color="gray" name="remove_red_eye" />
                </q-btn>
              </q-td>
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="onEditClick(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="onDeleteClick(props.row)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <p> {{ props.row.description }} </p>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <addExpance :isOpen="addExpanceDialog" :expance="expance" />

  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { MESSAGES, ERRORS, GETTERS, ACTIONS } from "../../../config/constants";

export default {
  name: "PageEditExpance",
  components : {
    addExpance : ()=> import("components/AddExpanceDialog.vue")
  },

  data() {
    return {
      addExpanceDialog : false,
      expance : {
        isCredit : false,
        isDebit : false,
        amount : 0,
        description : "",
        date : "",
        title : "",
        isReapted : false,
        repeatation : ""
      },

      columns: [
        {
          name: "title",
          required: true,
          label: "عنوان المحضر",
          field: (row) => row.name,
          align: "left",
        },
        {
          name: "view",
          required: true,
          label: "عرض",
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
      ],
    };
  },
  created() {
    this.FETCH_EXPANCE();
  },
  computed: {
    ...mapGetters({
      GET_EXPANCE: GETTERS.SETTINGS.GET_METTINGS,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_EXPANCE: ACTIONS.SETTINGS.FETCH_EXPANCE,
      DELETE_EXPANCE: ACTIONS.SETTINGS.DELETE_EXPANCE,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    onAddNewMEETINGS(){
      this.$router.push({name : 'add-meetings-page', params : { action : "add", isEdit : false }});
    },
    onViewClick(meeting) {
      this.$router.push({name : 'add-meetings-page', params : { id : meeting.id, action : "view", isEdit : false }});
    },
    onEditClick(meeting) {
      this.$router.push({name : 'add-meetings-page', params : { id : meeting.id, action : "edit", isEdit : true }});
    },
    onDeleteClick(meeting) {
       this.DELETE_MEETINGS(meeting.id)
    },
    

  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.MEETINGS_DELETED) {
          this.FETCH_MEETINGS();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المحضر بنجاح",
          });
        }

        
        }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.DELETE_MEETING_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المحضر",
          });
        }
        
        }
    },
  },
};
</script>

<style>
</style>