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
          <el-tabs
            v-model="activeName" 
            @tab-click="handleClick"
          >
            <el-tab-pane 
              v-for="(item, index) in projectTabs"
              :key="index"
              :label=item.name 
              :name=item.id
            >
              <div 
                class="flex flex-col mt-2"
                v-for="(pro_item, pro_index) in projectList.items"
                :key="pro_index"
              >
                <div class="flex flex-1 flex-content-start flex-row justify-between">
                  <f-user-avatar :user="handleUserInfo(pro_item.create_user_id, projectList.extra)" :digested="pro_item.is_digested" />
                </div>
                <div 
                  class="mt-2" 
                  v-html="pro_item.article_content"
                  style="cursor: pointer;"
                  @click="gotoTopicInfo(pro_item.topic_id)"
                ></div>
                <div class="mt-2 color-gray-400">{{ handleCreateTime(pro_item.gmt_create) }}</div>
              </div>
            </el-tab-pane>
          </el-tabs>
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
  import type { TabsPaneContext } from 'element-plus';
  import FUserAvatar from '/@/components/FUserAvatar/project.vue';

  interface ProjectList {
    items: any[];
    extra: any;
  }
  interface ProjectTab {
  id: string;
  name: string;
}

  const route = useRoute();
  const router = useRouter();

  const projectList = reactive<ProjectList>({
    items: [],
    extra: {},
  });
  
  const handleClick = async (tab: TabsPaneContext) => {
    const id = tab.props.name;
    request = post({
      baseURL: import.meta.env.VITE_BASE_URL,
      url: '/getProjectInfo',
      data: {menu_id: id},
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    });
    const response = await request;
    projectList.items = response.data.data.items;
    projectList.extra = response.data.data.extra;
  }
  const handleUserInfo = (user_id: number, extra: any) => {
    const user = extra.user.find((item: any) => item.user_id === user_id);
    return user
  }
  const handleCreateTime = (item: any) => {      
    const date = new Date(parseInt(item, 10) * 1000).toLocaleString();
    return date
  }
  const gotoTopicInfo = (topic_id: any) => {
    const { href } = router.resolve({ name: 'topicInfo', params: { topic_id: topic_id } });
    window.open(href, '_blank');
  }

  const projectParam = route.params.project;
  let projectObj: any;
  if (Array.isArray(projectParam)) {
    projectObj = JSON.parse(projectParam[0]);
  } else {
    projectObj = JSON.parse(projectParam);
  }
  const title = ref(projectObj.title);


  const groupInfo = reactive({
    data: window.location.hostname,
    error: null,
  });

  const activity = reactive({
    data: null,
    error: null,
  });
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = title.value;
  const projectTabs = reactive<Array<ProjectTab>>(header.projects[title.value] || []);
  const activeName = ref(projectTabs.length > 0 ? projectTabs[0].id : '');
  const handleFirstProject = async () => {
    const id = projectTabs[0].id;
    request = post({
      baseURL: import.meta.env.VITE_BASE_URL,
      url: '/getProjectInfo',
      data: {menu_id: id},
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    });
    const response = await request;
    projectList.items = response.data.data.items;
    projectList.extra = response.data.data.extra;
  }

  let request;
  let group;
  const paramData = reactive({
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
  const getProjectsInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getProjectsInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        activity.data = response.data.data.project
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

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getProjectsInfo();
    await handleFirstProject();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
