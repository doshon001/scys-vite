<template>
  <div class="dark:text-slate-400 dark:bg-slate-900">
    <f-header />
    <div style="margin-top: 4rem">
      <f-user-articles />
      <f-main />
    </div>
  </div>
</template>

<script setup lang="ts">
  import FHeader from '/@/components/FHeader/userInfo.vue';
  import FUserArticles from '/@/components/FUserArticles/index.vue';
  import FMain from '/@/components/FMain/index.vue';
</script>

<style lang="less" scoped></style>
