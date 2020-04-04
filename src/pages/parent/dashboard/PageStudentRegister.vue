<template>
  <q-page padding>
    <p class="text-h6 text-weight-bold">طلب تسجيل طالب جديد</p>
    <div class="q-pa-md">
      <q-stepper id="horizontal-stepper" v-model="hStep" ref="hStepper" color="primary" animated>
        <q-step
          :name="1"
          title="البيانات الأساسية"
          icon="person"
          active-icon="person"
          :done="hStep > 1"
        >
          <q-form ref="hStudentInfoForm" @reset="onHorizontalFormReset">
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
                <q-radio v-model="studentForm.finishedClass" val="grade_seven" label="السابع" />
                <q-radio v-model="studentForm.finishedClass" val="grade_eight" label="الثامن" />
                <q-radio v-model="studentForm.finishedClass" val="grade_nine" label="التاسع" />
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
                  type="number"
                  label="رقم هاتف ولي الأمر الأول"
                  lazy-rules
                  :rules="[
                    val => (val && val.length > 0) || 'الرجاء ادخال رقم هاتف ولي الأمر الأول',
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
                  type="number"
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
          </q-form>
          <q-stepper-navigation>
            <q-btn
              label="متابعة"
              color="primary"
              @click="goToNextHorizontalStep(2, 'hStudentInfoForm')"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="بيانات المواد الدراسية والحفظ"
          icon="local_library"
          active-icon="local_library"
          :done="hStep > 2"
        >
          <q-form ref="hSubjectInfoForm" @reset="onHorizontalFormReset">
            <div class="text-weight-bold q-mt-md">تقدير علامات المواد الدراسية:</div>
            <div class="row">
              <div class="col-6">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model.number="studentForm.subjectANumber"
                  type="number"
                  label="عدد المواد التي حصل الطالب فيها على تقدير (أ)"
                  lazy-rules
                  :rules="[
                    val => val >= 0 || 'عدد المواد غير صحيح',
                    val => val !== '' || 'الرجاء كتابة عدد المواد'
                  ]"
                />
              </div>
              <div class="col-6">
                <q-input
                  class="q-ma-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model.number="studentForm.subjectBNumber"
                  type="number"
                  label="عدد المواد التي حصل الطالب فيها على تقدير (ب)"
                  lazy-rules
                  :rules="[
                    val => val >= 0 || 'عدد المواد غير صحيح',
                    val => val !== '' || 'الرجاء كتابة عدد المواد'
                  ]"
                />
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">الأجزاء التي يحفظها الطالب:</div>
            <div class="row q-ma-sm">
              <div class="q-gutter-xs">
                <q-chip
                  v-for="chapter in savedChapters"
                  :key="chapter.name"
                  :selected.sync="chapter.selected"
                  color="primary"
                  text-color="white"
                >{{ chapter.name }}</q-chip>
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">السور التي يحفظها الطالب حالياً:</div>
            <div class="row">
              <div class="col-6">
                <q-select
                  v-model="studentForm.quranSurah"
                  class="q-ma-sm"
                  dense
                  outlined
                  :options="getAllSurahs"
                  label="السورة"
                />
              </div>
              <div class="col-6">
                <q-btn
                  class="q-ma-sm"
                  label="إضافة"
                  unelevated
                  color="primary"
                  @click="addSavedSurah(studentForm.quranSurah)"
                />
              </div>
            </div>
            <div class="q-pa-md">
              <q-markup-table separator="horizontal" flat bordered>
                <thead class="bg-grey-4">
                  <tr>
                    <th class="text-left">السورة</th>
                    <th class="text-center">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(surah, i) in savedSurahs" :key="i">
                    <td class="text-left">{{ surah.name }}</td>
                    <td class="text-center">
                      <q-btn flat @click="removeSurah(i)">
                        <q-icon name="delete" color="red" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-form>
          <q-stepper-navigation>
            <q-btn
              label="متابعة"
              color="primary"
              @click="goToNextHorizontalStep(3, 'hSubjectInfoForm')"
            />
            <q-btn
              label="رجوع"
              flat
              type="reset"
              color="primary"
              class="q-ml-sm text-weight-bold"
              @click="() => hStep = 1"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="بيانات إضافية" icon="assignment" active-icon="assignment">
          <q-form>
            Try out different ad text to see what brings in the most customers,
            and learn how to enhance your ads using features like ad extensions.
            If you run into any problems with your ads, find out how to tell if
            they're running and how to resolve approval issues.
          </q-form>
          <q-stepper-navigation>
            <q-btn label="إرسال" color="primary" />
            <q-btn
              label="رجوع"
              flat
              type="reset"
              color="primary"
              class="q-ml-sm text-weight-bold"
              @click="() => hStep = 2"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>

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

          <q-step :name="3" title="بيانات إضافية" icon="assignment" active-icon="assignment">
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
import { mapGetters, mapActions } from "vuex";

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
      savedChapters: [],
      savedSurahs: []
    };
  },
  created() {
    this.FETCH_CHAPTERS();
    this.FETCH_SURAHS();
  },
  mounted() {
    if (Object.keys(this.GET_USER).length > 0) {
      this.studentForm.parentPhone1 = `${this.GET_USER.phone}`.slice(4);
    }

    // set chapters
    this.savedChapters = this.GET_CHAPTERS;
  },
  computed: {
    ...mapGetters("parents", ["GET_USER", "GET_CHAPTERS", "GET_SURAHS"]),
    getAllSurahs() {
      let surahs = this.GET_SURAHS.map(surah => surah.name);
      return surahs;
    }
  },
  methods: {
    ...mapActions("parents", ["FETCH_CHAPTERS", "FETCH_SURAHS"]),
    async goToNextHorizontalStep(step, form) {
      let valid = await this.$refs[form].validate();
      if (valid) {
        this.hStep = step;
      }
    },
    addSavedSurah(surah) {
      let found = this.GET_SURAHS.find(value => value.name === surah);

      if (found) {
        this.savedSurahs.push(found);
        console.log(this.savedSurahs);
      }
    },
    removeSurah(index) {
      this.savedSurahs.splice(index, 1);
    },
    onHorizontalFormReset() {}
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
