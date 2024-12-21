<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <el-card 
      class="mt"
    >
      <el-skeleton :loading="loading" animated>
        <template #template>
          <div class="flex flex-1 flex-content-start flex-row flex-items-center">
            <div class="inline-flex mr-2">
              <el-skeleton-item variant="circle" style="width: 45px; height: 45px" />
            </div>
            <div class="flex flex-col">
              <div class="mb-1">
                <el-skeleton-item variant="text" style="width: 50px" />
              </div>
              <div>
                <el-skeleton-item variant="text" style="width: 80px" />
              </div>
            </div>
          </div>
          <div class="mt-2">
            <el-skeleton-item variant="h3" style="width: 50%; margin-bottom: 5px" />
            <el-skeleton-item variant="h3" style="margin-bottom: 5px" />
            <el-skeleton-item variant="h3" style="width: 30%" />
          </div>
          <div class="mt-2">
            <el-skeleton-item variant="button" style="width: 10%; height: 30px; margin-bottom: 5px" />
          </div>
          <div class="text-end mt-1">
            <span class="mr-3">
              <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px" />
            </span>
            <span class="mr-3">
              <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px" />
            </span>
            <span>
              <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px" />
            </span>
          </div>
          <div class="flex flex-col mt-2">
            <el-skeleton-item variant="text" style="width: 40%; margin-bottom: 5px" />
            <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 5px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </template>
        <template #default>
          <div>
            <template v-if="qaInfo.data.title">
              <div class="flex flex-item-start flex-row">
                <span class="inline-block v-text-middle font-600 color-orange-600">Q：</span>
                <span class="inline-block v-text-middle ml-2" style="color: #030712; font-size: 1rem; line-height: 1.25rem;" v-html="qaInfo.data.title"></span>
              </div>
            </template>
            <template v-if="qaInfo.data.content">
              <div class="mt flex flex-item-start flex-row" >
                <span class="v-text-middle font-600">A：</span>
                <div class="flex ml-2" style="line-height: 1.25rem;">
                  <el-text class="inline-block break-all break-words" style="color: #080808;" v-html="qaInfo.data.content"></el-text>
                </div>
              </div>
            </template>
            <div class="mt">
              <span class="mr" style="opacity: 0.5;">{{ qaInfo.data.createdAt.split('.')[0] }}</span>
              <span v-for="(tag, Index) in qaInfo.data.tag" :key="Index" style="margin-right: 0.25rem">
                <el-tag>{{ tag }}</el-tag>
              </span>
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRoute } from 'vue-router';

  interface QaInfo {
    data: any;
    end_iso: any;
    error: any;
  }
  interface GroupInfo {
    data: any;
    error: any;
  }

  const route = useRoute();
  const qid = route.params.qid;

  const qaInfo = reactive<QaInfo>({
    data: {},
    end_iso: null,
    error: null,
  });
  const groupInfo = reactive<GroupInfo>({
    data: null,
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = '百问百答';
  
  let request;
  let group;
  const paramData = reactive({
    group_id: 0,
    qid: qid,
    category: '',
  });
  
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
  const getQADetailInfo = async () => {
    try {
      loading.value = true;
      paramData.qid = qid;
      paramData.category = '百问百答';
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getQADetailInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        qaInfo.data = response;
        loading.value = false;
      } else {
        loading.value = false;
        throw new Error('Invalid response data');
      }
    } catch (error: any) {
      qaInfo.error = error.message;
      console.log('Error:', qaInfo.error);
    }
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getQADetailInfo();
  })
</script>

<style scoped></style>
