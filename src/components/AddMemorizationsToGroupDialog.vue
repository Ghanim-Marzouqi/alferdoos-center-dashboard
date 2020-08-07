<template>
  <q-dialog
    v-model="isAddMemorizationToGroupDialogOpen"
    @before-show="intializeValues"
    @hide="resetValues"
  >
    <q-card style="width: 400px">
      <q-card-section>
        <div class="text-h6">إضافة محفوظات إلى مجموعة</div>
        <div class="q-ma-md">
          <q-option-group
            :options="options"
            label="إختر المحفوظ"
            type="checkbox"
            v-model="selectedMemorizations"
          />
        </div>
      </q-card-section>
      <q-card-actions>
        <q-space></q-space>
        <q-btn dense flat color="primary" @click="closeAddMemorizationToGroupDialog">إلغاء</q-btn>
        <q-btn
          dense
          flat
          color="primary"
          :disable="selectedMemorizations.length < 1"
          :loading="GET_LOADING"
          @click="addMemorizationToGroupDialog"
        >حفظ</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GETTERS, ACTIONS } from "../config/constants";

export default {
  name: "AddMemorizationToGroupDialog.vue",
  props: {
    isAddMemorizationToGroupDialogOpen: {
      type: Boolean,
      default: false,
    },
    group: {
      type: Object,
      default: () => {},
      required: true,
    },
    memorizations: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      options: [],
      selectedMemorizations: [],
    };
  },
  created() {
    this.FETCH_MEMORIZATIONS();
  },
  computed: {
    ...mapGetters({
      GET_MEMORIZATIONS: GETTERS.SETTINGS.GET_MEMORIZATIONS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_MEMORIZATIONS: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS,
      ADD_MEMORIZATION_TO_GROUP: ACTIONS.GROUPS.ADD_MEMORIZATION_TO_GROUP,
    }),
    intializeValues() {
      this.options = this.GET_MEMORIZATIONS.map((memorization) => ({
        label: memorization.name,
        value: memorization.id,
      }));
    },
    addMemorizationToGroupDialog() {
      if (
        Object.keys(this.group).length > 0 &&
        this.selectedMemorizations.length > 0
      ) {
        this.ADD_MEMORIZATION_TO_GROUP({
          groupId: this.group.id,
          memorizations: this.selectedMemorizations,
        });
      }
    },
    closeAddMemorizationToGroupDialog() {
      this.options = [];
      this.selectedMemorizations = [];
      this.$emit("closeAddMemorizationToGroupDialog", false);
    },
    resetValues() {
      this.options = [];
      this.selectedMemorizations = [];
    },
  },
};
</script>