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
          <div class="flex flex-items-center justify-center w-full border-l border-slate-200 dark:border-slate-800">
            <el-icon size="large" class="mr" @click="handleClosePage"><ArrowLeft /></el-icon>
            <el-autocomplete
              v-model="searchContent"
              :fetch-suggestions="querySearch"
              style="width: 90%;"
              clearable
              placeholder="搜索主题"
              @select="handleSelect"
              @change="handleSelectChange"
            >
              <template #suffix>
                <el-icon @click="handleIconClick">
                  <Search />
                </el-icon>
              </template>
              <template #default="{ item }">
                <span class="flex flex-justify-between items-center">
                  {{ item.value }}
                  <el-icon v-if="item !== ''" @click.stop="handleDeleteClick(item)">
                    <Close />
                  </el-icon>
                </span>
              </template>
            </el-autocomplete> 
            <el-icon size="large" class="mr"></el-icon>
          </div>
        </el-card>
        <el-card body-style="padding: 0.5rem">
          <div class="flex flex-justify-between border-l border-slate-200 dark:border-slate-800">
            <div class="self-center">
              <el-switch 
                v-model="switchValue" 
                @change="handleSwitchChange" 
                inline-prompt active-text="精" 
                inactive-text="精" 
                style="margin-left: 1rem;"
              />
            </div>
            <div class="self-center">
              <el-dropdown style="margin-right: 1rem;" @command="handleLikesCommand">
                <span class="el-dropdown-link">
                  点赞区间
                  <el-icon>
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="100+">100+</el-dropdown-item>
                    <el-dropdown-item command="50-100">50-100</el-dropdown-item>
                    <el-dropdown-item command="10-50">10-50</el-dropdown-item>
                    <el-dropdown-item command="0-10">0-10</el-dropdown-item>
                    <el-dropdown-item command="清空">清空</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-dropdown style="margin-right: 1rem;" @command="handleOrderCommand">
                <span class="el-dropdown-link" :orderList="orderList">
                  {{ orderList }}
                  <el-icon >
                    <arrow-down />
                  </el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="智能排序">智能排序</el-dropdown-item>
                    <el-dropdown-item command="最新发布">最新发布</el-dropdown-item>
                    <el-dropdown-item command="评论最多">评论最多</el-dropdown-item>
                    <el-dropdown-item command="点赞最多">点赞最多</el-dropdown-item>
                    <el-dropdown-item command="最早发布">最早发布</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Search, ArrowDown, Close, ArrowLeft } from '@element-plus/icons-vue';
  import { useHeaderStore } from '/@/store/index';

  const header = useHeaderStore();
  const searchContent = defineModel('');
  header.searchValue = '';
  const loading = ref(false);
  const switchValue = ref(header.searchSwitchValue);
  const orderList = ref('智能排序');
  header.searchLikesValue = [];
  header.searchOrderValue = 'create_desc';
  
  interface LinkItem {
    value: string
  }
  const querySearch = (queryString: string, cb: any) => {
    const results = queryString
      ? header.searchList.filter(createFilter(queryString))
      : header.searchList
    cb(results)
  }
  const createFilter = (queryString: any) => {
    return (restaurant: any) => {
      return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
      )
    }
  }

  const handleClosePage = () => {
    window.close();
  }
  const handleSelect = (item: LinkItem) => {
    searchContent.value = item.value;
    header.searchValue = item.value;
    let isContained = header.searchList.some(arg => arg.value === item.value);
    if (searchContent.value !== '' && !isContained) {
      header.searchList.unshift(item);
    } else if (isContained) {
      const itemIndex = header.searchList.findIndex(arg => arg.value === item.value);
      header.searchList.splice(itemIndex, 1);
      header.searchList.unshift(item);
    }
  }
  const handleSelectChange = (item: any) => {
    if (item) {
      header.searchValue = item;
      let searchObj = { value: item };
      let isContained = header.searchList.some(arg => arg.value === searchObj.value);
      if (searchContent.value !== '' && !isContained) {
        header.searchList.unshift(searchObj);
      } else if (isContained) {
        const itemIndex = header.searchList.findIndex(arg => arg.value === searchObj.value);
        header.searchList.splice(itemIndex, 1);
        header.searchList.unshift(searchObj);
      }
    }
  }

  const handleIconClick = () => {
    if (searchContent.value) {
      header.searchValue = searchContent.value;
    }
  }

  const handleDeleteClick = (item: any) => {
    const itemIndex = header.searchList.findIndex(arg => arg.value === item.value);
    if (itemIndex !== -1) {
      header.searchList.splice(itemIndex, 1);
    }
  }
  
  const handleSwitchChange = () => {
    header.searchSwitchValue = !header.searchSwitchValue;
    switchValue.value = header.searchSwitchValue;
    window.scrollTo(0, 0);
  };
  const handleOrderCommand = (command: string | number | object) => {
    if (command === '智能排序') {
      orderList.value = '智能排序';
      header.searchOrderValue = 'create_desc';
    } else if (command === '最新发布') {
      orderList.value = '最新发布';
      header.searchOrderValue = 'create_desc';
    } else if (command === '评论最多') {
      orderList.value = '评论最多';
      header.searchOrderValue = 'comments_count';
    } else if (command === '点赞最多') {
      orderList.value = '点赞最多';
      header.searchOrderValue = 'likes_count';
    } else if (command === '最早发布') {
      orderList.value = '最早发布';
      header.searchOrderValue = 'create_asc';
    }
  };
  const handleLikesCommand = (command: string | number | object) => {
    if (command === '100+') {
      header.searchLikesValue = [];
      header.searchLikesValue = [100];
    } else if (command === '50-100') {
      header.searchLikesValue = [];
      header.searchLikesValue = [50, 100];
    } else if (command === '10-50') {
      header.searchLikesValue = [];
      header.searchLikesValue = [10, 50];
    } else if (command === '0-10') {
      header.searchLikesValue = [];
      header.searchLikesValue = [0, 10];
    } else if (command === '清空') {
      header.searchLikesValue = [];
    }
  };
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
