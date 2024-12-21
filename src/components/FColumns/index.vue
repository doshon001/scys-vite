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
          <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
            <div
              v-for="(item, index) in activity.data"
              @click="gotoCollection(item.cid)"
            >
              <div class="flex justify-between">
                <div class="flex-col">
                  <div class="font-bold font-size-4">{{ item.name }}</div>
                  <div class="mt-2 color-gray-400">{{ item.description }}</div>
                </div>
                <div class="color-gray-500">
                  {{ handleTime(item.gmt_create.iso) }}
                </div>
              </div>
              <div v-if="index !== activity.data.length - 1">
                <el-divider style="margin: 0.7rem 0 !important;" />
              </div>
            </div>
          </ul>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRouter } from 'vue-router';

  interface Activity {
    data: any,
    error: null
  }

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
  const disabled = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '合集';
  
  let request;
  let group;
  let iso: any;
  let listData: any[];
  let paramData = reactive({
    endTime: {},
    group_id: 0,
  });
  
  const handleParam = () => {
    if(iso) {
      paramData.endTime = {
        __type: 'Date',
        iso: iso,
      };
    }
  }
  
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
      const id = response.group_id;
      paramData.group_id = parseInt(id);
    } catch (error: any) {
      groupInfo.error = error.message;
      console.log('groupError:', groupInfo.error);
    }
  }
  const getColumns = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getColumnsInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        listData = listData.concat(response);
        activity.data = listData;
        iso = response[response.length - 1].gmt_create.iso;
        loading.value = false;
        if(response.length < 10) {
          disabled.value = true;
          loading.value = false;
        }
      } else {
        loading.value = false;
        throw new Error('Invalid response data');
      }
    }catch (error: any) {
      activity.error = error.message;
      console.log('activityError:', activity.error);
    }
  }

  const handleTime = (time: string) => {
    return new Date(time).toLocaleString();
  }

  const gotoCollection = (cid: number) => {
    const { href } = router.resolve({ name: 'collections', params: { cid: cid } });
    window.open(href, '_blank');
  }

  // 无限滚动
  const loadInfo = async () => {
    handleParam();
    await getColumns();
  }

  const checkScorll = async() => {
    if(window.scrollY + window.innerHeight >= document.body.scrollHeight) {
      loadInfo();
    }
  }


  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await loadInfo();
    await checkScorll();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
