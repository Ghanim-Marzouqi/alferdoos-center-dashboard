<template>
  <div class="fixed-center text-center">
    <p>
      <img src="~assets/sad.svg" style="width:30vw;max-width:150px;" />
    </p>
    <h5 class="text-faded">عذراً ولكن الصفحة التي طلبتها غير موجودة</h5>
    <q-btn color="primary" style="width:200px;" to="/" label="الرجوع للصفحة الرئيسية" />
  </div>
</template>

<script>
export default {
  name: "PageError404"
};
</script>
