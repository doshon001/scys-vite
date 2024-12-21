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
          <div class="flex items-center justify-center w-full font-600 color-gray-900 border-l border-slate-200 dark:border-slate-800">
            <el-icon size="large" class="mr" @click="handleClosePage"><ArrowLeft /></el-icon>
            <el-text size="large" style="width: 90%; text-align: center;">{{ handleHeader(header.detailHeadValue) }}</el-text>
            <el-icon size="large" class="mr"></el-icon>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { ArrowLeft } from '@element-plus/icons-vue';
  import { useHeaderStore } from '/@/store/index';

  const header = useHeaderStore();
  header.searchValue = '';
  const loading = ref(false);

  const handleHeader = (value: any) => {
    if(value === '船员好事') {
      return '航海日志';
    } else {
      return value
    }
  };

  const handleClosePage = () => {
    window.close();
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
