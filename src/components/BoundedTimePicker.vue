<template>
  <q-dialog v-model="isOpen">
    
    <q-card style="width: 500px">
     
      <q-card-section>
        {{ time }}
        <q-time
        v-model="time"
        landscape
      />
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="$emit('cancel', false)">إلغاء</q-btn>
        <q-btn dense flat color="primary" :loading="GET_LOADING" @click="saveNewTime">حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { GETTERS } from "../config/constants";
const moment = require("moment");

export default {
  name: "TimePickerDialog",
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    fromTime: {
      type: String,
      required: true,
    },
    toTime : {
      type: String,
      required: true,
    },

  },
  data () {
    return {
      time : ""
    }
  },
  computed: mapGetters({ GET_LOADING: GETTERS.UI.GET_LOADING }),
  methods : {
    saveNewTime()
    {
      let from = moment(this.fromTime+"am", 'h:mma');
      let to = moment(this.toTime+"am", 'h:mma');
      let t = moment(this.time+"am", 'h:mma');
      if (t.isBefore(to) && t.isAfter(from))
      {
      this.$emit('saveTime',{time : t , mins : t.diff(from ,'minutes')} );
      this.time = "";
      this.$emit('cancel');
      
      }else
      {
            this.$q.dialog({
            title: "خطأ",
            message: "يجب أن يكون الوقت أثناء توقيت الحصة",
          });               
      }
    }
  },
};
</script>