<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">طلب تسجيل طالب جديد</p>
    <div class="q-pa-md">
      <q-form>
        <q-stepper
          id="horizontal-stepper"
          v-model="hStep"
          ref="hStepper"
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="البيانات الأساسية"
            icon="person"
            active-icon="person"
            :done="hStep > 1"
          >
            <div class="text-weight-bold">أسم الطالب:</div>
            <div class="row">
              <div class="col-3">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.firstName"
                  type="text"
                  label="الأسم الأول"
                  lazy-rules
                  :rules="[
                    val => (val && val.length > 0) || 'الرجاء كتابة الأسم الأول'
                  ]"
                />
              </div>
              <div class="col-3">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.secondName"
                  type="text"
                  label="الأسم الثاني"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0) || 'الرجاء كتابة الأسم الثاني'
                  ]"
                />
              </div>
              <div class="col-3">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.thirdName"
                  type="text"
                  label="الأسم الثالث"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0) || 'الرجاء كتابة الأسم الثالث'
                  ]"
                />
              </div>
              <div class="col-3">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.familyName"
                  type="text"
                  label="القبيلة"
                  lazy-rules
                  :rules="[
                    val => (val && val.length > 0) || 'الرجاء كتابة القبيلة'
                  ]"
                />
              </div>
            </div>
            <div class="row">
              <div class="q-gutter-sm">
                <div class="text-weight-bold">انهى الصف:</div>
                <q-radio
                  v-model="studentForm.finishedClass"
                  val="grade_seven"
                  label="السابع"
                />
                <q-radio
                  v-model="studentForm.finishedClass"
                  val="grade_eight"
                  label="الثامن"
                />
                <q-radio
                  v-model="studentForm.finishedClass"
                  val="grade_nine"
                  label="التاسع"
                />
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">رقم ولي الأمر والإقامة:</div>
            <div class="row">
              <div class="col-4">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.parentPhone1"
                  type="text"
                  label="رقم هاتف ولي الأمر الأول"
                  lazy-rules
                  :rules="[
                    val =>
                      (val && val.length > 0) ||
                      'الرجاء ادخال رقم هاتف ولي الأمر الأول'
                  ]"
                />
              </div>
              <div class="col-4">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.parentPhone2"
                  type="text"
                  label="رقم هاتف ولي الأمر الثاني (إختياري)"
                />
              </div>
              <div class="col-4">
                <q-select
                  v-model="studentForm.village"
                  class="q-ma-sm"
                  dense
                  outlined
                  :options="villages"
                  label="القرية"
                />
              </div>
            </div>
          </q-step>

          <q-step
            :name="2"
            title="بيانات المواد الدراسية والحفظ"
            icon="local_library"
            active-icon="local_library"
            :done="hStep > 2"
          >
            <div class="text-weight-bold q-mt-md">
              تقدير علامات المواد الدراسية:
            </div>
            <div class="row">
              <div class="col-6">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.subjectANumber"
                  type="number"
                  label="عدد المواد التي حصل الطالب فيها على تقدير (أ)"
                  lazy-rules
                  :rules="[val => val >= 0 || 'عدد المواد غير صحيح']"
                />
              </div>
              <div class="col-6">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.subjectBNumber"
                  type="number"
                  label="عدد المواد التي حصل الطالب فيها على تقدير (ب)"
                  lazy-rules
                  :rules="[val => val >= 0 || 'عدد المواد غير صحيح']"
                />
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">
              الأجزاء التي يحفظها الطالب:
            </div>
            <div class="row q-ma-sm">
              <div class="q-gutter-xs">
                <q-chip
                  v-for="surah in savedQuranChapters"
                  :key="surah.title"
                  :selected.sync="surah.selected"
                  color="primary"
                  text-color="white"
                >
                  {{ surah.title }}
                </q-chip>
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">
              السور التي يحفظها الطالب:
            </div>
            <div class="row">
              <div class="col-4">
                <q-select
                  v-model="studentForm.quranChapter"
                  class="q-ma-sm"
                  dense
                  outlined
                  :options="savedQuranChapters.title"
                  label="الجزء"
                />
              </div>
              <div class="col-4">
                <q-select
                  v-model="studentForm.quranSurah"
                  class="q-ma-sm"
                  dense
                  outlined
                  :options="savedQuranSurahs.name"
                  label="السورة"
                />
              </div>
              <div class="col-4">
                <q-btn
                  class="q-ma-sm"
                  label="إضافة"
                  unelevated
                  color="primary"
                />
              </div>
            </div>
            <div class="q-pa-md">
              <q-markup-table separator="horizontal" flat bordered>
                <thead class="bg-grey-4">
                  <tr>
                    <th class="text-left">الجزء</th>
                    <th class="text-left">السورة</th>
                    <th class="text-center">
                      حذف
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-left">الأول</td>
                    <td class="text-left">الفاتحة</td>
                    <td class="text-center">
                      <q-btn flat>
                        <q-icon name="delete" color="red" />
                      </q-btn>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">الأول</td>
                    <td class="text-left">البقرة</td>
                    <td class="text-center">
                      <q-btn flat>
                        <q-icon name="delete" color="red" />
                      </q-btn>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-left">الأول</td>
                    <td class="text-left">آل عمران</td>
                    <td class="text-center">
                      <q-btn flat>
                        <q-icon name="delete" color="red" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-step>

          <q-step
            :name="3"
            title="بيانات إضافية"
            icon="assignment"
            active-icon="assignment"
          >
            Try out different ad text to see what brings in the most customers,
            and learn how to enhance your ads using features like ad extensions.
            If you run into any problems with your ads, find out how to tell if
            they're running and how to resolve approval issues.
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                @click="$refs.hStepper.next()"
                color="primary"
                :label="hStep === 3 ? 'إرسال' : 'متابعة'"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>

      <q-form>
        <q-stepper
          id="vertical-stepper"
          v-model="vStep"
          ref="vStepper"
          vertical
          color="primary"
          animated
        >
          <q-step
            :name="1"
            title="البيانات الأساسية"
            icon="person"
            active-icon="person"
            :done="vStep > 1"
          >
            For each ad campaign that you create, you can control how much
            you're willing to spend on clicks and conversions, which networks
            and geographical locations you want your ads to show on, and more.
          </q-step>

          <q-step
            :name="2"
            title="بيانات المواد الدراسية والحفظ"
            icon="local_library"
            active-icon="local_library"
            :done="vStep > 2"
          >
            An ad group contains one or more ads which target a shared set of
            keywords.
          </q-step>

          <q-step
            :name="3"
            title="بيانات إضافية"
            icon="assignment"
            active-icon="assignment"
          >
            Try out different ad text to see what brings in the most customers,
            and learn how to enhance your ads using features like ad extensions.
            If you run into any problems with your ads, find out how to tell if
            they're running and how to resolve approval issues.
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn
                @click="$refs.vStepper.next()"
                color="primary"
                :label="vStep === 3 ? 'إرسال' : 'متابعة'"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "PageParentStudentRegister",
  data() {
    return {
      hStep: 1,
      vStep: 1,
      studentForm: {
        firstName: "",
        secondName: "",
        thirdName: "",
        familyName: "",
        finishedClass: "grade_seven",
        parentPhone1: "",
        parentPhone2: "",
        village: "معمد",
        subjectANumber: "",
        subjectBNumber: "",
        quranChapter: "",
        quranSurah: ""
      },
      villages: [
        "معمد",
        "المعري",
        "البلاد",
        "الفيقين",
        "البياض",
        "الشعيبة",
        "حي جامع",
        "المعيول",
        "عز",
        "متان"
      ],
      savedQuranChapters: [
        {
          title: "الأول",
          value: 1,
          selected: false
        },
        {
          title: "الثاني",
          value: 2,
          selected: false
        },
        {
          title: "الثالث",
          value: 3,
          selected: false
        },
        {
          title: "الرابع",
          value: 4,
          selected: false
        },
        {
          title: "الخامس",
          value: 5,
          selected: false
        },
        {
          title: "السادس",
          value: 6,
          selected: false
        },
        {
          title: "السابع",
          value: 7,
          selected: false
        },
        {
          title: "الثامن",
          value: 8,
          selected: false
        },
        {
          title: "التاسع",
          value: 9,
          selected: false
        },
        {
          title: "العاشر",
          value: 10,
          selected: false
        },
        {
          title: "الحادي عشر",
          value: 11,
          selected: false
        },
        {
          title: "الثاني عشر",
          value: 12,
          selected: false
        },
        {
          title: "الثالث عشر",
          value: 13,
          selected: false
        },
        {
          title: "الرابع عشر",
          value: 14,
          selected: false
        },
        {
          title: "الخامس عشر",
          value: 15,
          selected: false
        },
        {
          title: "السادس عشر",
          value: 16,
          selected: false
        },
        {
          title: "السابع عشر",
          value: 17,
          selected: false
        },
        {
          title: "الثامن عشر",
          value: 18,
          selected: false
        },
        {
          title: "التاسع عشر",
          value: 19,
          selected: false
        },
        {
          title: "العشرون",
          value: 20,
          selected: false
        },
        {
          title: "الحادي والعشرون",
          value: 21,
          selected: false
        },
        {
          title: "الثاني والعشرون",
          value: 22,
          selected: false
        },
        {
          title: "الثالث والعشرون",
          value: 23,
          selected: false
        },
        {
          title: "الرابع والعشرون",
          value: 24,
          selected: false
        },
        {
          title: "الخامس والعشرون",
          value: 25,
          selected: false
        },
        {
          title: "السادس والعشرون",
          value: 26,
          selected: false
        },
        {
          title: "السابع والعشرون",
          value: 27,
          selected: false
        },
        {
          title: "الثامن والعشرون",
          value: 28,
          selected: false
        },
        {
          title: "التاسع والعشرون",
          value: 29,
          selected: false
        },
        {
          title: "الثلاثون",
          value: 30,
          selected: false
        }
      ],
      savedQuranSurahs: [
        {
          name: "الفاتحة",
          value: 1,
          chapterId: 1
        },
        {
          name: "البقرة",
          value: 2,
          chapterId: 1
        },
        {
          name: "آل عمران",
          value: 3,
          chapterId: 1
        }
      ]
    };
  },
  mounted() {
    if (Object.keys(this.GET_PARENT).length > 0) {
      this.studentForm.parentPhone1 = `${this.GET_PARENT.phone}`.slice(4);
    }
  },
  computed: {
    ...mapGetters("parents", ["GET_PARENT"])
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 598px) {
  #horizontal-stepper {
    display: none;
  }
}

@media screen and (min-width: 599px) {
  #vertical-stepper {
    display: none;
  }
}
</style>
