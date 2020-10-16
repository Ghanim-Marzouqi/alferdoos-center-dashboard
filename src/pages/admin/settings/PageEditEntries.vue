<template>

 <q-page padding>
    <p class="text-h6">إعدادات المدخلات للأنشطة و السلوكيات</p>
    <!-- Groups Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-between items-center content-start">
        <p class="text-body1 text-weight-bold">المدخلات</p>
        <q-btn
          class="q-mb-md"
          color="primary"
          @click=" isOpenDialog = true"
        >إضافة مدخل جديد</q-btn>
      </div>
      <div class="col-12">
        <q-table :data="GET_ENTRIES" :columns="columns" row-key="name" :loading="GET_LOADING">
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
               <q-td key="type" :props="props">{{ props.row.type.val }}</q-td>
              
              <q-td key="view" :props="props">
                <q-btn dense flat @click.stop="editEntry('view',props.row)">
                  <q-icon color="gray" name="remove_red_eye" />
                </q-btn>
              </q-td>
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="editEntry('edit',props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>

              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="deleteEntry(props.row.id)">
                  <q-icon color="red" name="o_delete" />
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Add Group Dialog -->
    <AddEntriesDialog
      :isOpen="isOpenDialog"
      :action="action"
      :entry="entry"
      @close="resetForm"
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
  name: "PageEditEntries",
  components : {
    AddEntriesDialog : ()=> import("components/SettingsAddEntriesDialog.vue")
  },
  data() {
    return {
      isOpenDialog : false,
      marks : [],
      action : "add",
           entry: {
        type: "",
        name: "",
        year: "",
      },
      columns: [
        {
          name: "name",
          label: "اسم المدخل",
          field: "name",
          required: true,
          align: "left",
        },
                {
          name: "type",
          label: "نوع المدخل",
          field: "type",
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
    this.FETCH_ENTRIES();
    this.FETCH_YEAR_INFO();
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS : GETTERS.UI.GET_ERRORS,
      GET_ENTRIES : GETTERS.SETTINGS.GET_ENTRIES,
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
    }),
  },
  methods: {
    ...mapActions({
      DELETE_ENTRY : ACTIONS.SETTINGS.DELETE_ENTRY,
      FETCH_ENTRIES : ACTIONS.SETTINGS.FETCH_ENTRIES,
      FETCH_YEAR_INFO : ACTIONS.SETTINGS.FETCH_YEAR_INFO,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    resetForm()
    {
      this.entry.name = "";
      this.entry.type = "";
      this.isOpenDialog = false
    },
    editEntry(action,entry)
    {
      this.action = action;
      this.entry.id = entry.id
      this.entry.name = entry.name;
      this.entry.type = entry.type;
      this.entry.year = entry.year;
      this.isOpenDialog = true;
    },
    deleteEntry(id){
      this.DELETE_ENTRY(id);
    },

  },
   watch:{
    GET_MESSAGES: function(newState, oldState) {
            if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.ENTRY_ADDED) {
          this.FETCH_ENTRIES();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم أضافة المدخل بنجاح",
          });
        }

                if (messageCode === MESSAGES.DATABASE.ENTRY_UPDATED) {
          this.FETCH_ENTRIES();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث المدخل بنجاح",
          });
        }

                if (messageCode === MESSAGES.DATABASE.ENTRY_DELETED) {
          this.FETCH_ENTRIES();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المدخل بنجاح",
          });
        }
        }      

    },
    GET_ERRORS : function(newState, oldState) {
            if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (errorCode === ERRORS.DATABASE.ENTRY_DELETE_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المدخل",
          });
        }

        
        if (errorCode === ERRORS.DATABASE.ADD_ENTRY_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حفظ المدخل",
          });
        }

                if (errorCode === ERRORS.DATABASE.ENTRY_UPDATE_RROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث المدخل",
          });
        }

        
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