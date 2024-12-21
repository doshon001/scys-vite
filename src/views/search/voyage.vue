<template>
  <div class="dark:text-slate-400 dark:bg-slate-900">
    <f-header />
    <div style="margin-top: 6.5rem">
      <f-search />
    </div>
  </div>
</template>

<script setup lang="ts">
  import FHeader from '/@/components/FHeader/voyageHead.vue';
  import FSearch from '/@/components/FSearch/voyage.vue';
</script>

<style lang="less" scoped></style>
