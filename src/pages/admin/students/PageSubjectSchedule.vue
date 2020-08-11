<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">جدول الحصص الدراسية</p>
  <div class="row justify-center full-width">
    <q-calendar
      v-model="selectedDate"
      view="day-resource"
      :resources="resources"
      :resource-height="80"
      :interval-minutes="intervalTime"
      :interval-count="intervals"
      :interval-start="startTime"
      bordered
      locale="ar"
    />
  </div>
  </q-page>
</template>

<script>
export default {
  name: "PageSubjectSchedule",
    data () {
    return {
      intervals : 6,
      intervalTime : 60,
      startTime : 8,
      selectedDate: '2019-04-01',
      resources: [
        { label: 'الأحد' },
        { label: 'الإثنين' },
        { label: 'الثلاثاء' },
        { label: 'الأربعاء' },
        { label: 'الخميس' },
      ]
    
};
    }
}
</script>
