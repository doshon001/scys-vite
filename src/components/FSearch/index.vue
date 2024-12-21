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
              <template v-if="item.user ? true : false">
                <div class="flex flex-1 flex-content-start flex-row">
                  <f-user-avatar :user="item.user" :create_time="item.create_time" :digested="item.digested" />
                </div>
              </template>
              <template v-if="item.content">
                <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                  <el-text size="large" :line-clamp="item.content.length > 250 ? 5 : ''">
                    <f-em-tag :text="item.content" :keyword="paramData['keyword']"/>
                  </el-text>
                  <el-text size="large" class="flex flex-row justify-between">
                    <a 
                      class="flex"
                      @click="gotoTopicInfo(item.topic_id)"
                    >
                      查看全文
                    </a>
                    <span class="flex flex-items-center" style="opacity: 0.5;">
                      <el-icon>
                        <Flag />
                      </el-icon>
                      <span class="mr-2">
                        {{ item.likes_count }}
                      </span>
                      <el-icon>
                        <ChatLineRound />
                      </el-icon>
                      <span>
                        {{ item.comments_count }}
                      </span>
                    </span>
                  </el-text>
                </div>
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
  import { useRoute, useRouter } from 'vue-router';
  import { Flag, ChatLineRound, Document } from '@element-plus/icons-vue';
  import FEmTag from '/@/components/FEmTag/search.vue';
  import FUserAvatar from '/@/components/FUserAvatar/index.vue';

  interface ListData {}
  interface ParamData {
    digested: any;
    user_id: any;
    end_time: any;
    keyword: any;
    likesCount: any;
    sortBy: any;
    group_id: any;
  }
  interface GroupData {
    data: any;
    error: any;
  }
  interface TopicIndex {
    data: any;
    end_iso: any;
    error: any;
  }

  const route = useRoute();
  const router = useRouter();
  const word = route.params.word;
  const topicIndex = reactive<TopicIndex>({
    data: [],
    end_iso: null,
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
    digested: false,
    user_id: '',
    end_time: '',
    keyword: '',
    likesCount: 0,
    sortBy: '',
    group_id: 0,
  });

  const handleParam = () => {
    if (header.searchSwitchValue) {
      paramData['digested'] = true;
    } else {
      delete paramData['digested'];
    };
    if (route.params.user_id) {
      paramData['user_id'] = route.params.user_id;
    } else {
      delete paramData['user_id'];
    };
    if (topicIndex.end_iso) {
      paramData['end_time'] = {
        __type: 'Date',
        iso: topicIndex.end_iso,
      };
    } else {
      delete paramData['end_time'];
    };
    if (header.searchValue) {
      paramData['keyword'] = header.searchValue;
    } else {
      delete paramData['keyword'];
    };
    if (header.searchLikesValue) {
      paramData['likesCount'] = header.searchLikesValue;
    } else {
      delete paramData['likesCount'];
    };
    if (header.searchOrderValue) {
      paramData['sortBy'] = header.searchOrderValue;
    } else {
      delete paramData['sortBy'];
    };
  };

  // 跳转到文章
  const gotoTopicInfo = (topic_id: any) => {
    const { href } = router.resolve({ name: 'topicInfo', params: { topic_id: topic_id } });
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
        url: '/getSearchInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response.length !== 0) {
        let len = response.length - 1;
        topicIndex.end_iso = response[len].create_time;
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
    handleParam();
    await getSearchInfo();
  }

  // DOM挂载之后执行
  onMounted(async () => {
    header.searchValue = word;
    handleParam();
    await getGroupInfo();
  })

  // digested开关
  watch(header, async () => {
    topicIndex.end_iso = '';
    listData = [];
    loading.value = false;
    await loadInfo();
  });
</script>

<style>
  em {
    color: #ef4444;
    font-style: normal !important;
  }
</style>
