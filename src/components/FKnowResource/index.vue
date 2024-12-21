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
          <template v-if="resource_id.startsWith('course_')">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                v-for="(item, index) in activity.data.content"
                :title="item.chapter_title" 
                :name="index"
                @click.once="handleChapterId(item.chapter_id, index)"
              >
                <div
                  v-for="(chapter_item, chapter_index) in chapter.data[index]"
                  :key="chapter_index"
                  @click="gotoChapter(chapter_item.chapter_id)"
                  style="cursor: pointer;"
                >
                  <span>{{ chapter_index + 1 }}.</span>
                  <span>{{ chapter_item.chapter_title }}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
          <template v-else-if="resource_id.startsWith('p_')">
            <el-collapse v-model="activeNames">
              <el-collapse-item
                v-for="(item, index) in activity.data.content"
                :title="item.resource_title" 
                :name="index"
                @click.once="handleChapterId(item.resource_id, index)"
              >
                <div
                  v-for="(chapter_item, chapter_index) in chapter.data[index]"
                  :key="chapter_index"
                  @click="gotoChapter(chapter_item.resource_id)"
                  style="cursor: pointer;"
                >
                  <span>{{ chapter_index + 1 }}.</span>
                  <span>{{ chapter_item.resource_name }}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template>
          <template v-else-if="resource_id.startsWith('v_')">
            <div 
              v-for="(item, index) in activity.data.content"
              :key="index"
            >
              <img 
                class="w-full" 
                v-for="(img, img_index) in handleDesc(item.descrb)"
                :key="img_index"
                :src="img" 
              />
            </div>
          </template>
          <template v-else>
            <div 
              v-for="(item, index) in activity.data.content"
              :key="index"
              v-html="handleHtml(item)"
            >
            </div>
          </template>
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
    data: any,
    error: any
  }
  
  interface Charter {
    data: any,
    error: any
  }

  const route = useRoute();
  const router = useRouter();

  const activeNames = ref(['1'])
  const resource_id = ref<string>(Array.isArray(route.params.resource_id) ? route.params.resource_id[0] : route.params.resource_id);
  const groupInfo = reactive({
    data: window.location.hostname,
    error: null,
  });

  const activity = reactive<Activity>({
    data: null,
    error: null,
  });
  const chapter = reactive<Charter>({
    data: [],
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = '生财思维课';
  
  let request;
  let group;
  let paramData = reactive({
    group_id: 0,
    resource_id: route.params.resource_id,
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
  const getActivityInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getResourceInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        activity.data = response
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

  const handleChapterId = async (chapter_id: String, index: number) => {
    try {
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getResourceInfo',
        data: { resource_id: chapter_id },
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request; 
      if (response && response.content) {
        chapter.data[index] = response.content;
      }
    }catch (error: any) {
      chapter.error = error.message;
      console.log('chapterError:', chapter.error);
    }
  }

  const handleDesc = (descrb: any) => {
    let imgs = [];
    const items = JSON.parse(descrb);
    for (let i = 0; i < items.length; i++) {
      const value = items[i].value;
      imgs.push(value)
    }
    return imgs;
  }

  const handleHtml = (item: any) => {
    header.detailHeadValue = item.resource_name;
    return item.org_content
  }

  const gotoChapter = (chapter_id: String) => {
    header.detailHeadValue = '生财思维课';
    const { href } = router.resolve({ name: 'knowResource', params: { resource_id: chapter_id } });
    window.open(href, '_blank');
  }



  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getActivityInfo();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
