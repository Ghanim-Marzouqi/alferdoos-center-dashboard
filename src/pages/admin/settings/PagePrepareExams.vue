<template>
  <q-page padding>
    <p class="text-h6">إعداد الإختبارات</p>

    <!-- Year Name Table -->
    <div class="row q-pa-md">
      <div class="col-12">
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">نوع الإختبار</th>
              <th class="text-right">تعديل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left">الإختبار التحريري</td>
              <td class="text-right">
                <q-btn dense flat @click="isErrorDialogOpen = true">
                  <q-icon name="o_edit" color="primary" />
                </q-btn>
              </td>
            </tr>
            <tr>
              <td class="text-left">التسميع</td>
              <td class="text-right">
                <q-btn dense flat @click="isErrorDialogOpen = true">
                  <q-icon name="o_edit" color="primary" />
                </q-btn>
              </td>
            </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>

    <!-- Error Dialog -->
    <q-dialog v-model="isErrorDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h5">حصل خطأ</div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  name: "PagePrepareExams",
  data() {
    return {
      isErrorDialogOpen: false
    };
  }
};
</script>

<style></style>
