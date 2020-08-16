<template>

 <q-page padding>
    <p class="text-h6">إعدادات المواد الدراسية</p>

    {{ isOpenDialog }}
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
              <q-td key="edit" :props="props">
                <q-btn dense flat @click.stop="showEditGroupDialog(props.row)">
                  <q-icon color="teal" name="o_edit" />
                </q-btn>
              </q-td>
              <q-td key="delete" :props="props">
                <q-btn dense flat @click.stop="showDeleteGroupDialog(props.row)">
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
      @close='isOpenDialog = false'
    />

  
  </q-page>
</template>



<script>
import { mapGetters, mapActions } from "vuex";
import {
  CHAPTERS,
  SURAHS,
  VILLAGES,
  KNOWN_BY,
  GETTERS,
  ACTIONS,
  STUDENT_STATUS
} from "../../../config/constants";

export default {
  name: "PageEditSubjects",
  components : {
    AddSubjectDialog : ()=> import("components/SubjectsAddSubjectDialog.vue")
  },
  data() {
    return {
      isOpenDialog : false,
      subjectForm: {
        name: "",
        description: "",
        files: [],
        status : "Active",
        createdAt : "",
        createdBy :"",
        year : ""
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
    this.FETCH_SUBJECTS();
  },
  mounted() {
    
  },
  computed: {
    ...mapGetters({
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_SUBJECTS : GETTERS.SUBJECTS.GET_SUBJECTS
    }),
  },
  methods: {
    ...mapActions({
      REGISTER_SUBJECT: ACTIONS.SUBJECTS.REGISTER_SUBJECT,
      FETCH_SUBJECTS : ACTIONS.SUBJECTS.FETCH_SUBJECTS,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES
    }),
    async onSubmit(form) {
      let valid = await this.$refs[form].validate();

      if (valid) {
        this.REGISTER_SUBJECT(this.subjectForm);
      }
    }
  },
  watch: {
    GET_MESSAGES: function(newState, oldState) {

    }
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