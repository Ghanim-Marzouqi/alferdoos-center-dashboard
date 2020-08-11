<template>
  <div class="row justify-center q-pa-lg">
      <q-calendar
        v-model="selectedDate"
        view="week-agenda"
        :weekdays="[0,1,2,3,4]"
        locale="ar"
        no-scroll
      >
        <template #day-label="{ timestamp }">
          <q-btn @click=" isSelectSubjectOpen = true" round color="amber" glossy text-color="black" icon="layers_clear" />
        </template>

        <template #day-body="{ timestamp }">
          <template v-for="(agenda) in getAgenda(timestamp)">
            <div
              :key="timestamp.date + agenda.time"
              :label="agenda.time"
              class="justify-start q-ma-sm shadow-5 bg-grey-4"
            >
              <div v-if="agenda.avatar" class="row justify-center" style="margin-top: 30px; width: 100%;">
                <q-avatar style="margin-top: -25px; margin-bottom: 10px; font-size: 60px; max-height: 50px;">
                  <img :src="agenda.avatar" style="border: #e0e0e0 solid 5px;">
                </q-avatar>
              </div>
              <div class="col-12 q-px-sm q-mt-sm">
                {{ agenda.subject }}
              </div>
              <div v-if="agenda.desc" class="col-12 q-px-sm q-pt-sm">
                {{ agenda.time }}
              </div>
            </div>
          </template>
        </template>

      </q-calendar>
      <SelectSubjecDialog :isOpen="isSelectSubjectOpen" @input="addSubject" @close="isSelectSubjectOpen = false" />
  </div>
</template>

<script>
import subjects from '../../../store/modules/subjects';
export default {
  components : {
    SelectSubjecDialog : () => import("components/SelectSubjectDialog.vue"),
  },
  data () {
    return {
      selectedDate: '2019-05-03',
      isSelectSubjectOpen : false,
      days : {
        6 : 0,
        0 : 1,
        1 : 2,
        2 : 3,
        3 : 4,
      },
      agenda: {
        0: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            desc: 'Meeting with CEO'
          },
        ],
        1: [
          {
            time: '08:00',
            avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
            desc: 'Meeting with CEO'
          },
        ],
        2: [
          {
            time: '11:30',
            avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
            desc: 'Meeting with Alisha'
          },
        ],
        3: [
          {
            time: '13:00',
            avatar: 'https://cdn.quasar.dev/img/avatar1.jpg'
          }
        ],
        4: [
          {
            time: '09:00',
            avatar: 'https://cdn.quasar.dev/img/avatar3.jpg'
          },
        ]
      }
    }
  },

  methods: {
    getAgenda (day) {
      return this.agenda[parseInt(day.weekday, 10)]
    },
    addSubject(subecjt){
       let day = (new Date(this.selectedDate)).getDay();
       this.agenda[this.days[day]].push(subecjt);
    }
    
  }
}
</script>

<style lang="sass">
.content-bordered
  border: 1px solid #e0e0e0
</style>