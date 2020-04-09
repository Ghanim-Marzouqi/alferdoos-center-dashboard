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
          <q-form ref="hStudentInfoForm">
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
            <q-btn label="متابعة" color="primary" @click="goToNextStep(2, 'hStudentInfoForm')" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="بيانات المواد الدراسية والحفظ"
          icon="local_library"
          active-icon="local_library"
          :done="hStep > 2"
        >
          <q-form ref="hSubjectInfoForm">
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
            <div class="row">
              <div class="col-6">
                <q-select
                  v-model="studentForm.quranChapter"
                  class="q-ma-sm"
                  dense
                  outlined
                  :options="getAllChapters"
                  label="الجزء"
                />
              </div>
              <div class="col-6">
                <q-btn
                  class="q-ma-sm"
                  label="إضافة"
                  unelevated
                  color="primary"
                  @click="addSavedChapter(studentForm.quranChapter)"
                />
              </div>
            </div>
            <div class="q-pa-sm">
              <q-markup-table separator="horizontal" flat bordered>
                <thead class="bg-grey-4">
                  <tr>
                    <th class="text-left">الجزء</th>
                    <th class="text-center">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(chapter, i) in studentForm.savedChapters" :key="i">
                    <td class="text-left">{{ chapter.name }}</td>
                    <td class="text-center">
                      <q-btn dense flat @click="removeChapter(i)">
                        <q-icon color="red" name="o_delete" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
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
            <div class="q-pa-sm">
              <q-markup-table separator="horizontal" flat bordered>
                <thead class="bg-grey-4">
                  <tr>
                    <th class="text-left">السورة</th>
                    <th class="text-center">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(surah, i) in studentForm.savedSurahs" :key="i">
                    <td class="text-left">{{ surah.name }}</td>
                    <td class="text-center">
                      <q-btn dense flat @click="removeSurah(i)">
                        <q-icon color="red" name="o_delete" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-form>
          <q-stepper-navigation>
            <q-btn label="متابعة" color="primary" @click="goToNextStep(3, 'hSubjectInfoForm')" />
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
          <q-form ref="hMoretInfoForm">
            <div class="row">
              <div class="q-gutter-sm">
                <div class="text-weight-bold">هل سبق للطالب التعلم في مركز لحفظ القرآن الكريم؟</div>
                <q-radio v-model="studentForm.isLearntInCenterBefore" val="yes" label="نعم" />
                <q-radio v-model="studentForm.isLearntInCenterBefore" val="no" label="لا" />
              </div>
              <div class="col-12">
                <q-input
                  v-show="studentForm.isLearntInCenterBefore === 'yes'"
                  class="q-ma-sm"
                  style="width: 400px;"
                  dense
                  square
                  outlined
                  :autogrow="false"
                  clearable
                  v-model="studentForm.oldCenterName"
                  label="اين؟"
                />
              </div>
            </div>
            <div class="row">
              <div class="q-gutter-sm">
                <div class="text-weight-bold">ما هي المهارات التي يمتلكها الطالب؟</div>
                <div class="col-12">
                  <q-input
                    class="q-ma-sm"
                    style="width: 400px;"
                    dense
                    square
                    outlined
                    :autogrow="false"
                    clearable
                    v-model="studentForm.skills"
                    type="textarea"
                    label="اكتب المهارات التي يمتلكها الطالب"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="q-gutter-sm">
                <div class="text-weight-bold">الحالة الصحية للطالب ؟</div>
                <q-radio v-model="studentForm.studentState" val="healthy" label="سليم" />
                <q-radio v-model="studentForm.studentState" val="sick" label="مريض" />
                <q-input
                  v-if="studentForm.studentState === 'sick'"
                  class="q-ma-sm"
                  style="width: 400px"
                  dense
                  square
                  outlined
                  :autogrow="false"
                  clearable
                  v-model="studentForm.diseases"
                  type="textarea"
                  label="الأمراض او الأعراض التي يعاني منها الطالب"
                />
              </div>
            </div>
            <div class="row">
              <div class="q-gutter-sm">
                <div class="text-weight-bold">المرفقات</div>
                <div class="col-6">
                  <q-file
                    v-model="studentForm.image"
                    label="صورة الطالب"
                    dense
                    outlined
                    use-chips
                    style="width: 400px"
                    class="q-ma-sm"
                    accept=".jpg, image/*"
                    lazy-rules
                    :rules="[ val => !!val || 'الرجاء ارفاق صورة الطالب' ]"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="col-6">
                  <q-file
                    v-model="studentForm.certificates"
                    label="شهادات الطالب"
                    dense
                    outlined
                    use-chips
                    multiple
                    style="width: 400px"
                    class="q-ma-sm"
                    accept=".pdf, .jpg, image/*"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="q-gutter-sm q-mt-sm">
                <div class="text-weight-bold">كيف عرفت عن مركز الفردوس الاعلى ومن شجعك للتسجيل فيه؟</div>
                <div class="col-6">
                  <q-select
                    v-model="studentForm.centerKnownBy"
                    class="q-ma-sm"
                    dense
                    outlined
                    :options="centerKnownList"
                    label="طرق معرفة المركز"
                    style="width: 400px"
                  />
                </div>
              </div>
            </div>
          </q-form>
          <q-stepper-navigation>
            <q-btn
              :loading="GET_LOADER"
              label="إرسال"
              color="primary"
              @click="onSubmit('hMoretInfoForm')"
            />
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

      <!-- Vertical Stepper -->
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
          <q-form ref="vStudentInfoForm">
            <div class="text-weight-bold">أسم الطالب:</div>
            <div class="row">
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
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
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
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
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
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
              <div class="col-12">
                <q-input
                  class="q-my-sm"
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
              <div class="q-gutter-xs">
                <div class="text-weight-bold">انهى الصف:</div>
                <q-radio v-model="studentForm.finishedClass" val="grade_seven" label="السابع" />
                <q-radio v-model="studentForm.finishedClass" val="grade_eight" label="الثامن" />
                <q-radio v-model="studentForm.finishedClass" val="grade_nine" label="التاسع" />
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">رقم ولي الأمر والإقامة:</div>
            <div class="row">
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
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
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model="studentForm.parentPhone2"
                  type="number"
                  label="هاتف ولي الأمر الثاني (إختياري)"
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="studentForm.village"
                  class="q-mt-sm"
                  dense
                  outlined
                  :options="villages"
                  label="القرية"
                />
              </div>
            </div>
          </q-form>
          <q-stepper-navigation>
            <q-btn label="متابعة" color="primary" @click="goToNextStep(2, 'vStudentInfoForm')" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          title="بيانات المواد الدراسية والحفظ"
          icon="local_library"
          active-icon="local_library"
          :done="vStep > 2"
        >
          <q-form ref="vSubjectInfoForm">
            <div class="text-weight-bold q-mt-md">تقدير علامات المواد الدراسية:</div>
            <div class="row">
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model.number="studentForm.subjectANumber"
                  type="number"
                  label="عدد المواد بتقدير (أ)"
                  lazy-rules
                  :rules="[
                    val => val >= 0 || 'عدد المواد غير صحيح',
                    val => val !== '' || 'الرجاء كتابة عدد المواد'
                  ]"
                />
              </div>
              <div class="col-12">
                <q-input
                  class="q-mt-sm"
                  dense
                  square
                  outlined
                  clearable
                  v-model.number="studentForm.subjectBNumber"
                  type="number"
                  label="عدد المواد بتقدير (ب)"
                  lazy-rules
                  :rules="[
                    val => val >= 0 || 'عدد المواد غير صحيح',
                    val => val !== '' || 'الرجاء كتابة عدد المواد'
                  ]"
                />
              </div>
            </div>
            <div class="text-weight-bold q-mt-md">الأجزاء التي يحفظها الطالب:</div>
            <div class="row">
              <div class="col-8">
                <q-select
                  v-model="studentForm.quranChapter"
                  class="q-mt-sm"
                  dense
                  outlined
                  :options="getAllChapters"
                  label="الجزء"
                />
              </div>
              <div class="col-4">
                <q-btn
                  class="q-mt-sm q-ml-sm"
                  label="إضافة"
                  unelevated
                  color="primary"
                  @click="addSavedChapter(studentForm.quranChapter)"
                />
              </div>
            </div>
            <div class="q-mt-sm">
              <q-markup-table separator="horizontal" flat bordered>
                <thead class="bg-grey-4">
                  <tr>
                    <th class="text-left">الجزء</th>
                    <th class="text-center">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(chapter, i) in studentForm.savedChapters" :key="i">
                    <td class="text-left">{{ chapter.name }}</td>
                    <td class="text-center">
                      <q-btn dense flat @click="removeChapter(i)">
                        <q-icon color="red" name="o_delete" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
            <div class="text-weight-bold q-mt-md">السور التي يحفظها الطالب حالياً:</div>
            <div class="row">
              <div class="col-8">
                <q-select
                  v-model="studentForm.quranSurah"
                  class="q-mt-sm"
                  dense
                  outlined
                  :options="getAllSurahs"
                  label="السورة"
                />
              </div>
              <div class="col-4">
                <q-btn
                  class="q-mt-sm q-ml-sm"
                  label="إضافة"
                  unelevated
                  color="primary"
                  @click="addSavedSurah(studentForm.quranSurah)"
                />
              </div>
            </div>
            <div class="q-mt-sm">
              <q-markup-table separator="horizontal" flat bordered>
                <thead class="bg-grey-4">
                  <tr>
                    <th class="text-left">السورة</th>
                    <th class="text-center">حذف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(surah, i) in studentForm.savedSurahs" :key="i">
                    <td class="text-left">{{ surah.name }}</td>
                    <td class="text-center">
                      <q-btn dense flat @click="removeSurah(i)">
                        <q-icon color="red" name="o_delete" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>
            </div>
          </q-form>
          <q-stepper-navigation>
            <q-btn label="متابعة" color="primary" @click="goToNextStep(3, 'vSubjectInfoForm')" />
            <q-btn
              label="رجوع"
              flat
              type="reset"
              color="primary"
              class="q-ml-sm text-weight-bold"
              @click="() => vStep = 1"
            />
          </q-stepper-navigation>
        </q-step>

        <q-step :name="3" title="بيانات إضافية" icon="assignment" active-icon="assignment">
          <q-form ref="vMoretInfoForm">
            <div class="row">
              <div class="q-gutter-sm">
                <div class="text-weight-bold">هل سبق للطالب التعلم في مركز لحفظ القرآن الكريم؟</div>
                <q-radio v-model="studentForm.isLearntInCenterBefore" val="yes" label="نعم" />
                <q-radio v-model="studentForm.isLearntInCenterBefore" val="no" label="لا" />
              </div>
              <q-input
                v-show="studentForm.isLearntInCenterBefore === 'yes'"
                class="q-ma-sm"
                style="width: 400px;"
                dense
                square
                outlined
                :autogrow="false"
                clearable
                v-model="studentForm.oldCenterName"
                label="اين؟"
              />
            </div>
            <div class="text-weight-bold">ما هي المهارات التي يمتلكها الطالب؟</div>
            <div class="q-mt-xs">
              <q-input
                dense
                square
                outlined
                :autogrow="false"
                clearable
                v-model="studentForm.skills"
                type="textarea"
                label="اكتب المهارات"
              />
            </div>
            <div class="row q-mt-sm">
              <div class="q-gutter-sm">
                <div class="col-12">
                  <div class="text-weight-bold">الحالة الصحية للطالب ؟</div>
                  <q-radio v-model="studentForm.studentState" val="healthy" label="سليم" />
                  <q-radio v-model="studentForm.studentState" val="sick" label="مريض" />
                </div>
              </div>
            </div>
            <div>
              <q-input
                v-if="studentForm.studentState === 'sick'"
                dense
                square
                outlined
                :autogrow="false"
                clearable
                v-model="studentForm.diseases"
                type="textarea"
                label="اكتب الأعراض"
              />
            </div>
            <div class="text-weight-bold q-mt-sm">المرفقات</div>
            <div>
              <q-file
                class="q-mt-xs"
                v-model="studentForm.image"
                label="صورة الطالب"
                dense
                outlined
                use-chips
                accept=".jpg, image/*"
                lazy-rules
                :rules="[ val => !!val || 'الرجاء ارفاق صورة الطالب' ]"
              >
                <template v-slot:after>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div>
              <q-file
                class="q-mt-xs"
                v-model="studentForm.certificates"
                label="شهادات الطالب"
                dense
                outlined
                use-chips
                multiple
                accept=".pdf, .jpg, image/*"
              >
                <template v-slot:after>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
            <div class="row">
              <div class="q-gutter-sm q-mt-sm">
                <div class="text-weight-bold">كيف عرفت عن مركز الفردوس الاعلى ومن شجعك للتسجيل فيه؟</div>
                <q-select
                  v-model="studentForm.centerKnownBy"
                  dense
                  outlined
                  :options="centerKnownList"
                  label="طرق معرفة المركز"
                />
              </div>
            </div>
          </q-form>
          <q-stepper-navigation>
            <q-btn
              :loading="GET_LOADER"
              label="إرسال"
              color="primary"
              @click="onSubmit('vMoretInfoForm')"
            />
            <q-btn
              label="رجوع"
              flat
              type="reset"
              color="primary"
              class="q-ml-sm text-weight-bold"
              @click="() => vStep = 2"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
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
        quranSurah: "",
        savedChapters: [],
        savedSurahs: [],
        isLearntInCenterBefore: "no",
        oldCenterName: "",
        skills: "",
        centerKnownBy: "",
        studentState: "healthy",
        diseases: "",
        image: null,
        certificates: []
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
        "متان",
        "اخرى"
      ],
      centerKnownList: [
        "مواقع التواصل الإجتماعي",
        "إعلان",
        "اصدقاء",
        "ولي الأمر",
        "الموقع",
        "اخرى"
      ]
    };
  },
  created() {
    this.CLEAR_ERRORS_AND_MESSAGES();
  },
  mounted() {
    if (Object.keys(this.GET_USER).length > 0) {
      this.studentForm.parentPhone1 = `${this.GET_USER.phone}`.slice(4);
    }
  },
  computed: {
    ...mapGetters("parents", [
      "GET_USER",
      "GET_CHAPTERS",
      "GET_SURAHS",
      "GET_MESSAGES",
      "GET_ERRORS",
      "GET_LOADER"
    ]),
    getFirstPhoneNumber() {
      return `${this.GET_USER.phone}`.slice(4);
    },
    getAllChapters() {
      let chapters = this.GET_CHAPTERS.map(chapter => chapter.name);
      return chapters;
    },
    getAllSurahs() {
      let surahs = this.GET_SURAHS.map(surah => surah.name);
      return surahs;
    }
  },
  methods: {
    ...mapActions("parents", ["REGISTER_STUDENT", "CLEAR_ERRORS_AND_MESSAGES"]),
    async goToNextStep(step, form) {
      let valid = await this.$refs[form].validate();
      if (valid) {
        this.hStep = step;
        this.vStep = step;
      }
    },
    addSavedChapter(chapter) {
      let found = this.GET_CHAPTERS.find(value => value.name === chapter);

      if (found) {
        this.studentForm.savedChapters.push(found);
        console.log(this.studentForm.savedChapters);
      }
    },
    addSavedSurah(surah) {
      let found = this.GET_SURAHS.find(value => value.name === surah);

      if (found) {
        this.studentForm.savedSurahs.push(found);
        console.log(this.studentForm.savedSurahs);
      }
    },
    removeChapter(index) {
      this.studentForm.savedChapters.splice(index, 1);
    },
    removeSurah(index) {
      this.studentForm.savedSurahs.splice(index, 1);
    },
    async onSubmit(form) {
      let valid = await this.$refs[form].validate();

      if (valid) {
        this.REGISTER_STUDENT({
          firstName: this.studentForm.firstName.trim(),
          secondName: this.studentForm.secondName.trim(),
          thirdName: this.studentForm.thirdName.trim(),
          familyName: this.studentForm.familyName.trim(),
          finishedClass: this.studentForm.finishedClass,
          parentPhone1: this.studentForm.parentPhone1,
          parentPhone2: this.studentForm.parentPhone2,
          village: this.studentForm.village,
          subjectANumber: this.studentForm.subjectANumber,
          subjectBNumber: this.studentForm.subjectBNumber,
          savedChapters: this.studentForm.savedChapters,
          savedSurahs: this.studentForm.savedSurahs,
          isLearntInCenterBefore: this.studentForm.isLearntInCenterBefore,
          oldCenterName: this.studentForm.oldCenterName.trim(),
          skills: this.studentForm.skills.trim(),
          centerKnownBy: this.studentForm.centerKnownBy,
          studentState: this.studentForm.studentState,
          diseases: this.studentForm.diseases.trim(),
          image: this.studentForm.image,
          certificates: this.studentForm.certificates,
          parentId: this.GET_USER.id,
          parentName: this.GET_USER.name
        });
      }
    }
  },
  watch: {
    GET_MESSAGES: function(newState, oldState) {
      if (newState.length > 0) {
        this.studentForm = {
          firstName: "",
          secondName: "",
          thirdName: "",
          familyName: "",
          finishedClass: "grade_seven",
          parentPhone1: this.getFirstPhoneNumber,
          parentPhone2: "",
          village: "معمد",
          subjectANumber: "",
          subjectBNumber: "",
          quranChapter: "",
          quranSurah: "",
          savedChapters: [],
          savedSurahs: [],
          isLearntInCenterBefore: "no",
          oldCenterName: "",
          skills: "",
          centerKnownBy: "",
          studentState: "healthy",
          diseases: "",
          image: null,
          certificates: []
        };

        this.hStep = 1;
        this.vStep = 1;
      }
    },
    GET_ERRORS: function(value) {
      console.log(value);
    }
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
