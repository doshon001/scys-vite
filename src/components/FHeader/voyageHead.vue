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
          <div class="flex border-l border-slate-200 dark:border-slate-800">
            <el-button color="#107459" size="small" @click="handleDocx">航海资料</el-button>
            <el-button color="#107459" size="small" @click="handleQA">百问百答</el-button>
            <el-button color="#107459" size="small" @click="handleJournal">航海日志</el-button>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </header>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Search, Close, ArrowLeft } from '@element-plus/icons-vue';
  import { useHeaderStore } from '/@/store/index';

  const header = useHeaderStore();
  const searchContent = defineModel('');
  header.searchValue = '';
  header.docxValue = 'docx';
  const loading = ref(false);
  
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

  const handleDocx = () => {
    if(header.searchValue) {
      header.docxValue = 'docx';
      header.qaValue = '';
      header.journalValue = '';
    }
  }
  const handleQA = () => {
    if(header.searchValue) {
      header.docxValue = '';
      header.qaValue = 'qa';
      header.journalValue = '';
    }
  }
  const handleJournal = () => {
    if(header.searchValue) {
      header.docxValue = '';
      header.qaValue = '';
      header.journalValue = 'journal';
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
