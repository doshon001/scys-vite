<template>
  <div class="dark:text-slate-400 dark:bg-slate-900">
    <f-header />
    <div style="margin-top: 3rem">
      <f-knowledgebase />
    </div>
  </div>
</template>

<script setup lang="ts">
  import FHeader from '/@/components/FHeader/detailHead.vue';
  import FKnowledgebase from '/@/components/FKnowledgebase/index.vue';
</script>

<style lang="less" scoped></style>
