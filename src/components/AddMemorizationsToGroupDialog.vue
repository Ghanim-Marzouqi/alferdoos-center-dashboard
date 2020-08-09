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
          <q-select
            filled
            v-model="selectedOption"
            :options="options"
            label="إحتر المحفوظ"
            @input="onSelectedMemorization"
          />
          <q-option-group
            :options="optionDetails"
            label="إختر من بين الخيارات المطروحة"
            type="checkbox"
            v-model="selectedOptionDetails"
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
          :disable="selectedOptionDetails.length < 1"
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
      selectedOption: "",
      optionDetails: [],
      selectedOptionDetails: [],
    };
  },
  created() {
    this.FETCH_MEMORIZATIONS();
  },
  computed: {
    ...mapGetters({
      GET_MEMORIZATIONS: GETTERS.SETTINGS.GET_MEMORIZATIONS,
      GET_LOADING: GETTERS.UI.GET_LOADING,
      GET_MEMORIZATION: GETTERS.SETTINGS.GET_MEMORIZATION,
    }),
  },
  methods: {
    ...mapActions({
      FETCH_MEMORIZATIONS: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS,
      ADD_MEMORIZATION_TO_GROUP: ACTIONS.GROUPS.ADD_MEMORIZATION_TO_GROUP,
      FETCH_MEMORIZATIONS_BY_ID: ACTIONS.SETTINGS.FETCH_MEMORIZATIONS_BY_ID,
    }),
    intializeValues() {
      this.options = this.GET_MEMORIZATIONS.map((memorization) => ({
        label: memorization.name,
        value: memorization.id,
      }));
    },
    async onSelectedMemorization(memorization) {
      await this.FETCH_MEMORIZATIONS_BY_ID(memorization.value);
      this.optionDetails = this.GET_MEMORIZATION.details.map((detail) => ({
        label: `${detail.name} (${detail.pageNumberFrom} - ${detail.pageNumberTo})`,
        value: detail.uid,
      }));
      console.log("memo", this.selectedOption);
    },
    addMemorizationToGroupDialog() {
      if (
        Object.keys(this.group).length > 0 &&
        this.selectedOptionDetails.length > 0
      ) {
        this.ADD_MEMORIZATION_TO_GROUP({
          groupId: this.group.id,
          memorizationId: this.selectedOption.value,
          memorizationDetails: this.selectedOptionDetails,
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
      this.selectedOption = "";
      this.optionDetails = [];
      this.selectedOptionDetails = [];
    },
  },
};
</script>