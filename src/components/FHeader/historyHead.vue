<template>
  <header
    class="antialiased bg-white Male text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto fixed left-0 right-0 z-36"
    style="width: 98%; top: 0;"
  >
    <el-skeleton style="width: 100%;" :loading="loading" animated>
      <template #template>
        <el-card body-style="padding: 0.5rem">
          <div class="flex flex-row flex-justify-between border-l border-slate-200 dark:border-slate-800">
            <div class="self-center">
              <el-skeleton-item variant="button" style="width: 40px; height: 40px" />
            </div>
            <div class="self-center">
              <el-skeleton-item variant="text" style="width: 200px" />
            </div>
            <div class="self-center">
              <el-skeleton-item variant="text" style="width: 40px" />
            </div>
          </div>
        </el-card>
      </template>
      <template #default>
        <el-card body-style="padding: 0.5rem">
          <div class="flex items-center justify-between w-full font-600 color-gray-900 border-l border-slate-200 dark:border-slate-800">
            <el-icon size="large" class="mr" @click="handleClosePage" style="cursor: pointer;"><ArrowLeft /></el-icon>
            <template v-if="header.historyCheckBox.length > 0">
              <el-text>已选择{{ header.historyCheckBox.length }}项</el-text>
              <el-button type="primary" round @click="handleDelete(header.historyCheckBox)" size="small">删除</el-button>
            </template>
            <template v-else>
              <el-text size="large" style="width: 90%; text-align: center;">{{ header.detailHeadValue }}</el-text>
              <el-icon size="large" class="mr" @click="handleSetting" style="cursor: pointer;" color="gray"><Setting /></el-icon>
            </template>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ArrowLeft, Setting } from '@element-plus/icons-vue';
  import { useHeaderStore, useFollowStore } from '/@/store/index';

  const header = useHeaderStore();
  const followStore = useFollowStore();
  header.searchValue = '';
  const loading = ref(false);


  const handleClosePage = () => {
    window.close();
  }

  const handleSetting = () => {
    header.settingVisible = !header.settingVisible;
  }

  const handleDelete = (lists: any) => {
    if(!header.historyState) {
      const sortedUniqueIndexes = Array.from(new Set(lists)).sort((a, b) => b - a);
      sortedUniqueIndexes.forEach((index: any) => {
        followStore.historyLists.splice(index, 1);
      });
      header.historyState = true;
      //header.settingVisible = !header.settingVisible;
    }
  }
</script>

<style lang="less" scoped>
  @media screen and (max-width: 28rem) {
    //::v-deep .el-drawer {
    :deep(.el-drawer) {
      width: 90% !important;
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .el-dropdown-link:focus-visible {
    outline: none;
  }
</style>
