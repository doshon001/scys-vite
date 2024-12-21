<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <template v-if="paramData['keyword']">
      <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
        <el-card 
          v-for="(item, index) in topicIndex.data"
          :key="index"
          class="mt-3"
        >
          <el-skeleton :loading="loading" animated>
            <template #template>
              <div class="flex flex-1 flex-content-start flex-row flex-items-center">
                <div class="inline-flex mr-2">
                  <el-skeleton-item variant="circle" style="width: 45px; height: 45px;" />
                </div>
                <div class="flex flex-col">
                  <div class="mb-1">
                    <el-skeleton-item variant="text" style="width: 50px;" />
                  </div>
                  <div>
                    <el-skeleton-item variant="text" style="width: 80px;" />
                  </div>
                </div>
              </div>
              <div class="mt-2">
                <el-skeleton-item variant="h3" style="width: 50%; margin-bottom: 5px" />
                <el-skeleton-item variant="h3" style="margin-bottom: 5px" />
                <el-skeleton-item variant="h3" style="width: 30%" />
              </div>
              <div class="mt-2">
                <el-skeleton-item variant="button" style="width: 10%; height: 30px; margin-bottom: 5px;" />
              </div>
              <div class="text-end mt-1">
                <span class="mr-3">
                  <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px;" />
                </span>
                <span>
                  <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px;" />
                </span>
              </div>
              <div class="flex flex-col mt-2">
                <el-skeleton-item variant="text" style="width: 40%; margin-bottom: 5px;" />
                <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 5px;" />
                <el-skeleton-item variant="text" style="width: 30%;" />
              </div>
            </template>
            <template #default>
              <template v-if="paramData['type'] === 'docx'">
                <div @click="gotoDocxInfo(item.docId)">
                  <template v-if="item.title">
                    <div class="flex flex-1 flex-content-start flex-row font-600">
                      <el-text style="color: #111827; font-size: 1.25rem;" v-html="item.title"></el-text>
                    </div>
                  </template>
                  <template v-if="item.content">
                    <div class="mt-2 color-black font-400" style="font-size: 1.2em">
                      <el-text class="inline-block break-all break-words" v-html="item.content" line-clamp="3"></el-text>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="paramData['type'] === 'qa'">
                <div @click="gotoQAInfo(item.qid)">
                  <template v-if="item.title">
                    <div class="flex flex-item-start flex-row">
                      <span class="inline-block v-text-middle font-600 color-orange-600">Q：</span>
                      <span class="inline-block v-text-middle ml-2" style="color: #030712; font-size: 1.1rem; line-height: 1.25rem;" v-html="item.title"></span>
                    </div>
                  </template>
                  <template v-if="item.content">
                    <div class="mt flex flex-item-start flex-row" >
                      <span class="v-text-middle font-600">A：</span>
                      <div class="flex ml-2" style="line-height: 1.25rem;">
                        <el-text class="inline-block break-all break-words" v-html="item.content" line-clamp="3"></el-text>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
              <template v-if="paramData['type'] === 'journal'">
                <template v-if="item.user">
                  <div class="flex flex-1 flex-content-start flex-row">
                    <f-user-avatar :user="item.user" :create_time="item.gmt_create"/>
                  </div>
                </template>
                <template v-if="item.content">
                  <div class="flex mt-1" @click="gotoJournalInfo(item.qid)">
                    <el-text class="inline-block break-all break-words" v-html="item.content" line-clamp="3"></el-text>
                  </div>
                </template>
              </template>
            </template>
          </el-skeleton>
        </el-card>
      </ul>
    </template>
    <template v-else>
      <el-card class="flex justify-center" style="text-align: center">
        <el-icon
          class="flex"
          size="100"
          style="opacity: 0.2;"
        >
          <Document />
        </el-icon>
        <span class="flex text-size-lg mt color-true-gray-500">请输入关键词进行搜索</span>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRouter } from 'vue-router';
  import { Document } from '@element-plus/icons-vue';
  import FUserAvatar from '/@/components/FUserAvatar/journal.vue';

  interface ListData {}
  interface ParamData {
    page: any;
    keyword: any;
    type: any;
    group_id: any;
  }
  interface GroupData {
    data: any;
    error: any;
  }
  interface TopicIndex {
    data: any;
    error: any;
  }

  const router = useRouter();

  const topicIndex = reactive<TopicIndex>({
    data: [],
    error: null,
  });
  const groupInfo = reactive<GroupData>({
    data: null,
    error: null,
  });
  
  const loading = ref(true);
  const disabled = ref(false);
  const header = useHeaderStore();
  let request;
  let group;
  let listData: ListData[] = [];
  let paramData = reactive<ParamData>({
    page: 0,
    keyword: '',
    type: '',
    group_id: 0,
  });
  let page = 0;

  const handleParam = () => {
    paramData['page'] = page;
    if (header.searchValue) {
      paramData['keyword'] = header.searchValue;
    } else {
      delete paramData['keyword'];
    };
    if (header.docxValue) {
      paramData['type'] = header.docxValue;
    } else if (header.qaValue) {
      paramData['type'] = header.qaValue;
    } else if (header.journalValue) {
      paramData['type'] = header.journalValue;
    } else {
      delete paramData['type'];
    };
  };

  // 跳转到文章
  const gotoDocxInfo = (doc_id: any) => {
    const { href } = router.resolve({ name: 'docx', params: { docId: doc_id } });
    window.open(href, '_blank');
  }

  // 跳转到百问百答/精选日志
  const gotoQAInfo = (qid: any) => {
    header.detailHeadValue = '百问百答';
    const { href } = router.resolve({ name: 'qa', params: { qid: qid } });
    window.open(href, '_blank');
  }
  const gotoJournalInfo = (qid: any) => {
    header.detailHeadValue = '船员好事';
    const { href } = router.resolve({ name: 'journal', params: { qid: qid } });
    window.open(href, '_blank');
  }

  // 请求group数据
  const getGroupInfo = async () => {
    try {
      groupInfo.data = window.location.hostname;
      group = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getScysInfo',
        data: {'hostname': groupInfo.data},
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await group;
      const id = response.group_id
      paramData.group_id = parseInt(id);
    } catch (error: any) {
      groupInfo.error = error.message;
      console.log('groupError:', groupInfo.error);
    }
  }

  // 请求topicIndex数据
  const getSearchInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getVoyageSearch',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response.length !== 0) {
        listData = listData.concat(response);
        topicIndex.data = listData;
        loading.value = false;
      } else {
        loading.value = false;
        disabled.value = true;
        throw new Error('Invalid response data');
      }
    } catch (error: any) {
      topicIndex.error = error.message;
      console.log('Error:', topicIndex.error);
    }
  }

  // 无限滚动
  const loadInfo = async () => {
    if(loading.value == false) {
      page++;
      handleParam();
      await getSearchInfo();
    }
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await loadInfo();
  })

  // digested开关
  watch(header, async () => {
    listData = [];
    loading.value = false;
    page = 0;
    handleParam();
    await loadInfo();
  });
</script>

<style>
  em {
    color: #ef4444;
    font-style: normal !important;
  }
</style>
