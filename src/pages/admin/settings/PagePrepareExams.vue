<template>
  <q-page padding>
    <p class="text-h6">إعداد الإختبارات</p>

    <!-- Written Exam Table -->
    <div class="row q-pa-md">
      <q-btn class="q-mb-md" color="primary">إضافة سؤال جديد</q-btn>
      <div class="col-12">
        <q-table
          title="اسئلة الإختبار التحريري"
          :columns="columns"
          :data="data"
          row-key="text"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="
                    props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
                  "
                />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <span v-html="col.value"></span>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <div class="text-left">
                  <ul>
                    <li v-for="(answer, i) in props.row.answers" :key="i">
                      <span
                        :style="
                          answer.isCorrect ? 'color: green' : 'color: red'
                        "
                        >{{ answer.name }}</span
                      >
                    </li>
                  </ul>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <!-- Year Name Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">التسميع</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">10 درجات</td>
              <td class="text-right">
                <q-btn dense flat>
                  <q-icon name="o_edit" color="primary" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: "PagePrepareExams",
  data() {
    return {
      columns: [
        {
          name: "question",
          required: true,
          label: "السؤال",
          field: row => row.text,
          align: "left"
        },
        {
          name: "edit",
          required: true,
          label: "تعديل السؤال",
          field: "icon",
          align: "right"
        }
      ],
      data: [
        {
          text: "كم عدد سور القرآن الكريم؟",
          marks: 10,
          icon: "<button style='cursor: pointer'>تعديل</button>",
          answers: [
            { name: "14", isCorrect: false },
            { name: "104", isCorrect: false },
            { name: "114", isCorrect: true },
            { name: "116", isCorrect: false }
          ]
        },
        {
          text: "من هو الصحابي الملقب بأبي هريرة؟",
          marks: 10,
          icon: "<button style='cursor: pointer'>تعديل</button>",
          answers: [
            { name: "عبد الرحمن بن عوف", isCorrect: false },
            { name: "عبد الرحمن بن صخر", isCorrect: true },
            { name: "عمر بن العاص", isCorrect: false },
            { name: "زيد بن حارث", isCorrect: false }
          ]
        }
      ]
    };
  }
};
</script>

<style></style>
