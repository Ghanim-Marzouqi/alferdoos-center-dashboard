<template>
  <q-dialog v-model="isOpen" width="600px" persistent>
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">إضافة مدخل</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="$emit('close')" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col">
            <q-card style="margin: 10px" class="full-height">
              <q-card-section>
                <q-form>
                  <div class="text-weight-bold">عنوان المدخل:</div>
                  <div class="row">
                    <div class="col-12">
                      <q-input
                        dense
                        square
                        outlined
                        clearable
                        v-model="entry.name"
                        type="text"
                        label="عنوان المدخل:"
                        lazy-rules
                        :rules="[
                          (val) =>
                            (val && val.length > 0) ||
                            'الرجاء كتابة عنوان المدخل:',
                        ]"
                      />
                    </div>
                  </div>

                  <div class="text-weight-bold">نوع المدخل</div>
                  <q-select
                    v-model="entry.type"
                    :options="getTypes()"
                    :option-label="val => val.lbl"
                    :option-value="val => val.val"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'الرجاء إختيار نوع المدخل',
                    ]"
                    stack-label
                    dense
                    outlined
                    label="نوع المدخل"
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="حسنا" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ACTIONS, ERRORS, STUDENT_GRADE, GETTERS } from "../config/constants";

export default {
  name: "SettingsAddEntryDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    entry : {
      type : Object,
      required : true
    },
    action: { type: String, default: "add" },
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters({
      GET_YEAR_INFO: GETTERS.SETTINGS.GET_YEAR_INFO,
      GET_ENTRIES: GETTERS.SETTINGS.GET_ENTRIES,
    }),
  },
  methods: {
    ...mapActions({
      REGISTER_ENTRY: ACTIONS.SETTINGS.REGISTER_ENTRY,
      UPDATE_ENTRY: ACTIONS.SETTINGS.UPDATE_ENTRY,
    }),
    getTypes() {
      return [
        { lbl: "سلوك إيجابي", val: "سلوك إيجابي" },
        { lbl: "سلوك سلبي", val: "سلوك سلبي" },
        { lbl: "نشاط", val: "نشاط" },
      ];
    },
    async onSubmit() {
      if (this.action === "add") {
        this.entry.year = this.GET_YEAR_INFO.name;
        this.REGISTER_ENTRY(this.entry);
      } else if(this.action === "edit") {
        this.entry.year = this.GET_YEAR_INFO.name;
        let obj = {id : this.entry.id,data : {name : this.entry.name,type : this.entry.type}}
        this.UPDATE_ENTRY(obj);
      }
      

      this.$emit("close");
    },
  },
};
</script>
