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
          <template v-if="veteranShares.data && veteranShares.data.veteranShares">
            <div 
              class="flex flex-row mt-3"
              v-for="(item, index) in veteranShares.data.veteranShares"
              :key="index"
              style="cursor: pointer;"
              @click="gotoVeteranShares(item.href)"
            >
              <el-avatar :size="60" :src="item.extra.avatar" />
              <div class="flex flex-col ml-3 justify-between">
                <span class="flex font-700 font-size-4">{{ item.title }}</span>
                <span class="flex font-size-3">{{ item.extra.author }}</span>
                <span class="flex font-size-3">{{ item.extra.share_time }}</span>
              </div>
            </div>
          </template>
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

  interface GroupData {
    data: any;
    error: any;
  }
  interface VeteranShares {
    data: any;
    error: any;
  }

  const route = useRoute();
  const groupInfo = reactive<GroupData>({
    data: null,
    error: null,
  });

  const veteranShares = reactive<VeteranShares>({
    data: null,
    error: null,
  });
  
  const loading = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '高手分享';

  let request;
  let group;
  let paramData = {
    group_id : 0,
    id: route.params.id,
  };
  
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

  const getVeteranShareInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getVeteranShareInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        veteranShares.data = response;
        loading.value = false;
      } else {
        loading.value = false;
        throw new Error('Invalid response data');
      }
    }catch (error: any) {
      veteranShares.error = error.message;
      console.log('activityError:', veteranShares.error);
    }
  }

  const parseUrl = async (item: any) => {
    const request = post({
      baseURL: import.meta.env.VITE_BASE_URL,
      url: '/parseUrl',
      data: {
        'url': item,
      },
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    })
    return await request
  }

  const gotoVeteranShares = (item: any) => {
    let href;
    parseUrl(item).then((data) => {
      const parsedUrl = data.parsedUrl;
      if (parsedUrl.startsWith('https://shengcaiyoushu01.feishu.cn')) {
        href = parsedUrl;
        window.open(href, '_blank');
      } else if (parsedUrl.startsWith('https://search01.shengcaiyoushu.com/docx/')) {
        const urlPart = parsedUrl.split('/');
        const docx = urlPart[urlPart.length - 1];
        href = '#/docx/' + docx;
      }
    })
  }
  

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getVeteranShareInfo();
  })
</script>

<style scoped></style>
