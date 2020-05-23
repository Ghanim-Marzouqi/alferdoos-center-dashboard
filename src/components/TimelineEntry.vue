<template>
  <q-timeline-entry
    :title="title"
    :subtitle="getFormatedDate"
    :color="color"
    :icon="icon"
  >
    <div>
      {{ description }}
    </div>
  </q-timeline-entry>
</template>

<script>
export default {
  name: "TimelineEntry",
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    subtitle: {
      type: Date
    },
    color: {
      type: String,
      default: "orange"
    },
    icon: {
      type: String
    }
  },
  computed: {
    getFormatedDate() {
      return getFormatedDate(this.subtitle);
    }
  }
};
</script>
