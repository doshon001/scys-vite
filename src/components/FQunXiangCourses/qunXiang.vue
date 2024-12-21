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
          <div >
            <img style="width: 100%" :src="activity.data.data.lesson.banner" />
          </div>
          <div class="mt-2">
            <div class="font-bold font-size-5">{{ activity.data.data.lesson.name }}</div>
            <div class="mt flex flex-row" style="align-items: center;">
              <div class="mr-2">
                <el-avatar :size="40" :src="activity.data.data.lesson.teacherAvatar" />
              </div>
              <div class="flex-col">
                <div class="font-bold font-size-4">{{ activity.data.data.lesson.teacherName }}</div>
                <div class="color-gray-400">{{ activity.data.data.lesson.teacherBio }}</div>
              </div>
            </div>
          </div>
          <div class="mt" @click="gotoVideo(qunXiang.data.feishuURL)">
            <el-button size="large" type="primary" style="width: 100%; font-size: large">
              <el-icon :size="20"><VideoPlay /></el-icon>
              <span class="ml-1">立即播放</span>
            </el-button>
          </div>
          <div class="mt" v-html="activity.data.data.lesson.description"></div>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRoute } from 'vue-router';
  import { VideoPlay } from '@element-plus/icons-vue';

  interface Activity {
    data: any;
    error: any;
  }
  interface QunXiang {
    data: any;
    error: any;
  }

  const route = useRoute();
  const id = route.params.id;

  const groupInfo = reactive({
    data: window.location.hostname,
    error: null,
  });

  const activity = reactive<Activity>({
    data: null,
    error: null,
  });
  const qunXiang = reactive<QunXiang>({
    data: null,
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = '群响课程';
  
  let request;
  let group;
  let paramData = reactive({
    id: id,
    group_id: 0,
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
  const getQunXiangCourse = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getqunXiangCourseInfo',
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
  const getQunXiangCourses = async () => {
    try {
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getqunXiangInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        qunXiang.data = response;
      } else {
        throw new Error('Invalid response data');
      }
    }catch (error: any) {
      qunXiang.error = error.message;
      console.log('activityError:', qunXiang.error);
    }
  }

  const gotoVideo = (href: any) => {
    window.open(href, '_blank');
  }


  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getQunXiangCourse();
    await getQunXiangCourses();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
