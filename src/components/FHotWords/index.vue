<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
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
        <el-card class="mt">
          <el-collapse>
            <el-collapse-item 
              v-for="item in activity.data?.data.category"
              :title="item"
            >
              <div class="flex flex-row flex-wrap">
                <div
                  class="mr color-red-400"
                  style="cursor: pointer;"
                  v-for="item_item in activity.data?.data.words[item].items"
                  @click="gotoWords(item_item.word)"
                >
                  {{ item_item.word }}
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRoute, useRouter } from 'vue-router';

  interface Activity {
    data: any;
    error: any;
  }

  const route = useRoute();
  const router = useRouter();

  const groupInfo = reactive({
    data: window.location.hostname,
    error: null,
  });

  const activity = reactive<Activity>({
    data: {},
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = '热搜词';
  
  let request;
  let group;
  let paramData = reactive({
    group_id: 0,
    cid: route.params.cid,
  });
  // 请求group数据
  const getGroupInfo = async () => {
    try {
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
  const getCollection = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getHotWordsInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        activity.data = response;
        loading.value = false;
      } else {
        loading.value = false;
        throw new Error('Invalid response data');
      }
    }catch (error: any) {
      activity.error = error.message;
      console.log('activityError:', activity.error);
    }
  }

  const gotoWords = (word: string) => {
    const { href } = router.resolve({ name: 'searchWord', params: { word: word } });
    window.open(href, '_blank');
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getCollection();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
