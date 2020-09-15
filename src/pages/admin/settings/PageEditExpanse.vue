<template>
  <q-page padding>
    <p class="text-h6">المصروفات و الإيرادات</p>

    <!-- Memorization Table -->
    <div class="row q-pa-md">
      <div class="fit row wrap justify-end items-center content-start">
        <q-btn
          class="q-ma-xs"
          color="primary"
          @click="expance.isDebit = true , expance.isCredit = false ,addExpanceDialog = true"
        >إضافةإنفاق</q-btn>
        <q-btn
          class="q-ma-xs"
          color="primary"
          @click="expance.isDebit = false , expance.isCredit = true ,addExpanceDialog = true"
        >إضافة مدخول</q-btn>
      </div>
      <div class="col-12">
        <q-tabs
          v-model="tab"
          align="left"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab name="expance" label="المعاملات المالية" />
          <q-tab name="repeatedExpence" label="المعاملات المتكررة" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="expance">
            <!-- <q-btn
              class="q-mb-md"
              color="primary"
              :disable="GET_EXPANCE.length == 0"
              @click="getExcelFile"
            >حفظ الأكسل</q-btn>-->
            <div class="col-12">
              <q-table :data="GET_EXPANCE" :columns="columns" row-key="id" :loading="GET_LOADING">
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
                    <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                    <q-td
                      key="credit"
                      :props="props"
                    >{{ props.row.isCredit ? props.row.amount : "" }}</q-td>
                    <q-td key="debit" :props="props">{{ props.row.isDebit ? props.row.amount : "" }}</q-td>
                    <q-td key="edit" :props="props">
                      <q-btn
                        flat
                        round
                        @click="editExpance(props.row)"
                        color="green"
                        icon="o_edit"
                      />
                    </q-td>
                    <q-td key="delete" :props="props">
                      <q-btn flat round @click="deleteExpanse(1,props.row.id)" color="red" icon="o_delete" />
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <div class="row">
                        <div class="col-3">
                          <p>{{ props.row.description }}</p>
                        </div>
                        <div class="col-3">
                          <q-chip
                            v-for="(file, i) in props.row.filesUrl"
                            :key="i"
                            clickable
                            icon-right="o_get_app"
                            @click="downloadFile(file)"
                          >ملف {{ i + 1 }}</q-chip>
                        </div>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="repeatedExpence">
            <div class="col-12">
              <q-table
                :data="GET_REPEATED_EXPANCE"
                :columns="columns1"
                row-key="id"
                :loading="GET_LOADING"
              >
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
                    <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
                    <q-td key="months" :props="props">{{ props.row.months }}</q-td>
                    <q-td key="lastPayment" :props="props">{{ props.row.startDate }}</q-td>
                    <q-td key="totalAmount" :props="props">{{ props.row.months * props.row.amount }}</q-td>
                    <q-td key="restAmount" :props="props">{{ getRestAmount(props.row) }}</q-td>
                    <q-td key="edit" :props="props">
                      <q-btn flat round color="green" @click="editExpance(props.row)" icon="o_edit" />
                    </q-td>
                    <q-td key="delete" :props="props">
                      <q-btn flat round color="red" @click="deleteExpanse(2,props.row.id)" icon="o_delete" />
                    </q-td>
                  </q-tr>
                  <q-tr v-show="props.expand" :props="props">
                    <q-td colspan="100%">
                      <div class="row q-mb-xs">
                        <div class="col-12">
                          <q-markup-table flat bordered>
                            <thead>
                              <tr class="bg-primary text-white">
                                <th class="text-left">
                                  <strong>التوصيف</strong>
                                </th>
                                <th class="text-left">
                                  <strong>الملفات</strong>
                                </th>
                                <th class="text-center">
                                  <strong>إضافة دفعة</strong>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td class="text-left">{{ props.row.description }}</td>
                                <td class="text-left">
                                  <q-chip
                                    v-for="(file, i) in props.row.filesUrl"
                                    :key="i"
                                    clickable
                                    icon-right="o_get_app"
                                    @click="downloadFile(file)"
                                  >ملف {{ i + 1 }}</q-chip>
                                </td>
                                <td class="text-center">
                                  <q-btn
                                    class="q-mb-md"
                                    color="primary"
                                    @click="expance.ref = props.row.id , 
                                    expance.isDebit = false ,
                                    expance.title = 'دفعة مقدمة من '+props.row.title
                                     expance.isCredit = true ,
                                     addExpanceDialog = true"
                                  >إضافة دفعة</q-btn>
                                </td>
                              </tr>
                            </tbody>
                          </q-markup-table>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <q-table
                            :data="getExpanseBrRef(props.row.id)"
                            :columns="columns2"
                            :color="'red'"
                            row-key="id"
                            :loading="GET_LOADING"
                          >
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
                                <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                                <q-td
                                  key="credit"
                                  :props="props"
                                >{{ props.row.isCredit ? props.row.amount : "" }}</q-td>
                                <q-td key="edit" :props="props">
                                  <q-btn
                                    flat
                                    round
                                    @click="editExpance(props.row)"
                                    color="green"
                                    icon="o_edit"
                                  />
                                </q-td>
                                <q-td
                                  key="delete"
                                  :props="props"
                                >
                                  <q-btn flat round  
                                   color="red" icon="o_delete" />
                                </q-td>
                              </q-tr>
                              <q-tr v-show="props.expand" :props="props">
                                <q-td colspan="100%">
                                  <div class="row">
                                    <div class="col-3">
                                      <p>{{ props.row.description }}</p>
                                    </div>
                                    <div class="col-3">
                                      <q-chip
                                        v-for="(file, i) in props.row.filesUrl"
                                        :key="i"
                                        clickable
                                        icon-right="o_get_app"
                                        @click="downloadFile(file)"
                                      >ملف {{ i + 1 }}</q-chip>
                                    </div>
                                  </div>
                                </q-td>
                              </q-tr>
                            </template>
                          </q-table>
                        </div>
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
    <addExpance :isEdit="isEdit" :expanse="expance" :isOpen="addExpanceDialog" @close="resetForm" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { MESSAGES, ERRORS, GETTERS, ACTIONS } from "../../../config/constants";

export default {
  name: "PageEditExpance",
  components: {
    addExpance: () => import("components/AddExpanceDialog.vue"),
  },

  data() {
    return {
      tab: "expance",
      addExpanceDialog: false,
      isEdit: false,
      expance: {
        ref: "",
        title: "",
        files: [],
        filesUrl: [],
        isCredit: false,
        isDebit: false,
        amount: 0,
        months: 1,
        description: "",
        date: "",
        isReapted: false,
        repeatation: "شهري",
      },
      columns2: [
        {
          name: "details",
          required: true,
          label: "",
          field: (row) => row.title,
          align: "center",
        },
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
          field: (row) => row.date,
          align: "left",
        },
        {
          name: "credit",
          required: true,
          label: "إيراد",
          field: (row) => row.amount,
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
      ],
    
      columns1: [
        {
          name: "details",
          required: true,
          label: "",
          field: (row) => row.title,
          align: "center",
        },
        {
          name: "title",
          required: true,
          label: "عنوان",
          field: (row) => row.title,
          align: "center",
        },
        {
          name: "amount",
          required: true,
          label: "القيمة",
          field: (row) => row.amount,
          align: "center",
        },
        {
          name: "months",
          required: true,
          label: "مدة الدفع",
          field: (row) => row.months,
          align: "center",
        },
        {
          name: "lastPayment",
          required: true,
          label: "آخر دفعة",
          field: (row) => row.lastPayment,
          align: "center",
        },
        ,
        {
          name: "totalAmount",
          required: true,
          label: "مجموع  المبلغ",
          align: "center",
        },
        ,
        {
          name: "restAmount",
          required: true,
          label: "المتبقي",
          align: "center",
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
      columns: [
        {
          name: "details",
          required: true,
          label: "",
          field: (row) => row.title,
          align: "center",
        },
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
          field: (row) => row.date,
          align: "left",
        },
        {
          name: "credit",
          required: true,
          label: "إيراد",
          field: (row) => row.amount,
          align: "left",
        },
        {
          name: "debit",
          required: true,
          label: "مصروف",
          field: (row) => row.amount,
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
      ],
    };
  },
  created() {
    this.FETCH_EXPANCE();
    this.FETCH_REPEATED_EXPANCE();
  },
  computed: {
    ...mapGetters({
      GET_EXPANCE: GETTERS.SETTINGS.GET_EXPENCE,
      GET_REPEATED_EXPANCE: GETTERS.SETTINGS.GET_REPEATED_EXPENCE,
      GET_MESSAGES: GETTERS.UI.GET_MESSAGES,
      GET_ERRORS: GETTERS.UI.GET_ERRORS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_EXPANCE: ACTIONS.SETTINGS.FETCH_EXPANCE,
      FETCH_REPEATED_EXPANCE: ACTIONS.SETTINGS.FETCH_REPEATED_EXPANCE,
      DELETE_REPEATED_EXPANCE: ACTIONS.SETTINGS.DELETE_REPEATED_EXPANCE,
      DELETE_EXPANCE: ACTIONS.SETTINGS.DELETE_EXPANCE,
      CLEAR_ERRORS_AND_MESSAGES: ACTIONS.UI.CLEAR_ERRORS_AND_MESSAGES,
    }),
    deleteExpanse(type, id) {
      console.log('ffffff');
      if (type == 1) {
        this.DELETE_EXPANCE(id);
      } else {
        this.DELETE_REPEATED_EXPANCE(id)
      }
    },
    getExpanseBrRef(id) {
      return this.GET_EXPANCE.filter((exp) => exp.ref == id);
    },
    getTotalPaidAmount(id) {
      let expances = this.getExpanseBrRef(id);
      console.log(expances);
      return expances.length > 0
        ? expances.length == 1
          ? expances[0].amount
          : expances.reduce((s, b) => ({ amount: s.amount + b.amount }))
        : 0;
    },
    getRestAmount(expance) {
      return (
        expance.months * expance.amount - this.getTotalPaidAmount(expance.id)
      );
    },
    editExpance(expance) {
      this.expance = {
        ref: expance.ref,
        id: expance.id,
        title: expance.title,
        filesUrl: expance.filesUrl,
        files: [],
        isCredit: expance.isCredit,
        isDebit: expance.isDebit,
        amount: expance.amount,
        months: expance.months ? expance.months : 1,
        totalAmount: expance.amount * expance.months,
        description: expance.description,
        date: expance.isReapted ? expance.startDate : expance.date,
        isReapted: expance.isReapted ? expance.isReapted : false,
        repeatation: expance.isReapted ? expance.repeatation : "",
      };
      this.addExpanceDialog = true;
      this.isEdit = true;
    },
    getExcelFile() {},
    downloadFile(fileURL) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `certificate_${date.formatDate(
            Date.now(),
            "YYYY_MM_DD_HH_mm_ss_a"
          )}`;
          link.click();
        };
        xhr.open("GET", fileURL);
        xhr.send();
      } catch (error) {
        switch (error.code) {
          case ERRORS.STORAGE.OBJECT_NOT_FOUND:
            this.SET_ERROR(ERRORS.STORAGE.OBJECT_NOT_FOUND);
            break;
          case ERRORS.STORAGE.UNAUTHORIZED:
            this.SET_ERROR(ERRORS.STORAGE.UNAUTHORIZED);
            break;
          case ERRORS.STORAGE.CANCELED:
            this.SET_ERROR(ERRORS.STORAGE.CANCELED);
            break;
          case ERRORS.STORAGE.UNKNOWN:
            this.SET_ERROR(ERRORS.STORAGE.UNKNOWN);
            break;
        }
      }
    },
    resetForm() {
      (this.expance = {
        ref: "",
        title: "",
        files: [],
        filesUrl: [],
        isCredit: false,
        isDebit: false,
        amount: 0,
        months: 1,
        description: "",
        date: "",
        isReapted: false,
        repeatation: "شهري",
      }),
        (this.addExpanceDialog = false);
      this.isEdit = false;
    },
  },
  watch: {
    GET_MESSAGES: function (newState, oldState) {
      if (newState.length > 0) {
        let messageCode = newState[0].code;

        if (messageCode === MESSAGES.DATABASE.EXPANCE_ADDED) {
          this.FETCH_EXPANCE();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة المعاملة بنجاح",
          });
        }
        if (messageCode === MESSAGES.DATABASE.EXPANCE_UPDATED) {
          this.FETCH_EXPANCE();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث المعاملة بنجاح",
          });
        }

         if (messageCode === MESSAGES.DATABASE.EDIT_REPEATED_EXPANC) {
          this.FETCH_REPEATED_EXPANCE();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم تحديث المعاملة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.EXPANCE_DELETED) {
          this.FETCH_EXPANCE();
          this.FETCH_REPEATED_EXPANCE();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم حذف المعاملة بنجاح",
          });
        }

        if (messageCode === MESSAGES.DATABASE.REPEATED_EXPANCE_ADDED) {
          this.FETCH_REPEATED_EXPANCE();
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.isAddMutationDialogOpen = false;
          this.$q.dialog({
            title: "تمت العملية بنجاح",
            message: "تم إضافة المعاملة بنجاح",
          });
        }
      }
    },
    GET_ERRORS: function (newState, oldState) {
      if (newState.length > 0) {
        let errorCode = newState[0].code;

        if (
          errorCode === ERRORS.DATABASE.ADD_PEXPANCE_ERROR ||
          errorCode === ERRORS.DATABASE.ADD_EXPANCE_ERROR
        ) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حفظ المعاملة",
          });
        }

        

                if (errorCode === ERRORS.DATABASE.DELETE_EXPANCE_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء حذف المعاملة",
          });
        }

        if (errorCode === ERRORS.DATABASE.EDIT_EXPANCE_ERROR) {
          this.CLEAR_ERRORS_AND_MESSAGES();
          this.$q.dialog({
            title: "خطأ",
            message: "حدث خطأ أثناء تحديث المعاملة",
          });
        }
      }
    },
  },
};
</script>

<style>
</style>