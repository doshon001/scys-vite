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
          <div class="flex flex-justify-between border-l border-slate-200 dark:border-slate-800">
            <div class="self-center border-l border-slate-200 dark:border-slate-800">
              <el-button @click="drawer = true" circle :icon="Menu" link>
                <el-drawer v-model="drawer" class="w-md" direction="ltr" :close-on-press-escape="true">
                  <div>
                    <f-menu-list />
                  </div>
                </el-drawer>
              </el-button>
            </div>
            <div class="self-center">
              <div class="block overflow-hidden">
                <el-date-picker
                  v-model="vtimepicker"
                  @change="handletimepicker"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="small"
                  style="width: 240px"
                />
              </div>
            </div>
            <div class="self-center">
              <el-switch v-model="switchValue" @change="handleSwitchChange" inline-prompt active-text="精" inactive-text="精" />
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Menu } from '@element-plus/icons-vue';
  import FMenuList from '/@/components/FMenu/index.vue';
  import { useHeaderStore } from '/@/store/index';

  const vtimepicker = defineModel();
  const drawer = ref(false);
  const loading = ref(false);
  const switchValue = ref(false);
  const header = useHeaderStore();

  // 初始化日期
  if (header.timepicker) {
    vtimepicker.value = header.timepicker;
  }
  // 初始化开关
  if(header.switchValue) {
    switchValue.value = header.switchValue;
  }

  const handletimepicker = () => {
    header.timepicker = vtimepicker.value as string;
    window.scrollTo(0, 0);
  };

  const handleSwitchChange = () => {
    header.timepicker = '';
    vtimepicker.value = '';
    header.switchValue = !header.switchValue;
    window.scrollTo(0, 0);
  };
</script>

<style lang="less" scoped>
  @media screen and (max-width: 28rem) {
    //::v-deep .el-drawer {
    :deep(.el-drawer) {
      width: 90% !important;
    }
  }
</style>
