<template>
  <q-dialog v-model="isOpen">
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">{{ dialogTitle }}</div>
        <div class="q-mt-md">
          <q-input
            filled
            v-model="TimeInMinuts"
            label="الوقت بالدقائق"
            type="text"
            :rules="[val => val.length > 0 || 'الرجاء إدخال الوقت']"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeGroupDialog">إلغاء</q-btn>
        <q-btn dense flat color="primary" @click="save">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "TimeDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      required: true,
    },
    type : {
     type : String,
     required : true
    },
    student :{
      type : Object,
      required : true,
    }
  },
  data() {
    return {
      TimeInMinuts: "",
    };
  },
  computed: {

  },
  methods: {
    closeGroupDialog() {
      this.TimeInMinuts = "";
      this.$emit("closeDialog", false);
    },
    save(){
      if (this.type == "late")
      {
        this.tudent.late = parseInt(this.TimeInMinuts);
      }else
      {
        this.student.leave = parseInt(this.TimeInMinuts);
      }
      this.closeGroupDialog();
    }
  },
};
</script>