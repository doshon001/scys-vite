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
          <template v-if="1">
            <el-collapse v-model="activeNames">
              <el-collapse-item 
                v-for="(item, index) in activity.data"
                :key="index"
                :name="index"
                class="mt-2"
              >
                <template #title>
                  <img style="width: 50px; height: 50px;" :src="handleImg(item.name)" />
                  <span class="ml">{{ item.name }}</span>
                </template>
                <div
                  v-for="(child_item, child_index) in item.children"
                  :key="child_index"
                  class="flex justify-between mt-2"
                  style="cursor: pointer;"
                  @click="gotoProject(child_item)"
                >
                  <div class="flex-col">
                    <div class="font-bold">{{ child_item.name }}</div>
                    <div class="color-gray-400">已收录{{ child_item.project_cnt }}个项目 {{ child_item.article_cnt }}篇精华贴</div>
                  </div>
                  <div class="color-green-600">查看</div>
                </div>
              </el-collapse-item>
            </el-collapse>
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

  interface GroupInfo {
    data: any,
    error: any,
  }
  interface Activity {
    data: any,
    error: any,
  }

  const route = useRoute();
  const router = useRouter();

  const activeNames = ref(['1'])
  const groupInfo = reactive<GroupInfo>({
    data: window.location.hostname,
    error: null,
  });

  const activity = reactive<Activity>({
    data: null,
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = '项目库';
  
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

  const handleImg = (name: any) => {
    return `/src/assets/images/menu/${name}.png`;
  }

  const gotoProject = (item: any) => {
    const title = item.name;
    const tabs = [];
    const children = item.children;
    header.projects[title] = children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const id = child.id;
      tabs.push(id);
    }
    const projectData = {
      title: title,
      tabs: tabs,
    };
    const project = JSON.stringify(projectData);

    const { href } = router.resolve({ name: 'project', params: { project: project } });
    window.open(href, '_blank');
  }


  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getProjectsInfo();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
