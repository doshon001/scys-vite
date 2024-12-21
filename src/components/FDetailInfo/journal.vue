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
          <template v-if="qaInfo.data.user">
            <div class="flex flex-1 flex-content-start flex-row">
              <f-user-avatar :user="qaInfo.data.user" :create_time="new Date(qaInfo.data.gmt_create * 1000).toLocaleString()"/>
            </div>
          </template>
          <template v-if="qaInfo.data.form">
            <div 
              v-for="(item, index) in qaInfo.data.form"
              :key="index"
              class="mt"
              style="color: #080808;"
            >
              <div class="font-600">{{ item.title }}</div>
              <div class="mt-1 whitespace-pre-wrap">{{ handleData(qaInfo.data.data, item) }}</div>
            </div>
          </template>
          <template v-if="handleImage(qaInfo.data.data)">
            <f-image
              :style="{
                'margin-top': '0.5rem',
                'margin-right': '10px',
                width: '130px',
                height: '130px',
              }"
              :images="imgList(qaInfo.data.data)"
            />
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
  import FUserAvatar from '/@/components/FUserAvatar/journal.vue';
  import FImage from '/@/components/FImage/index.vue';

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
    data: {},
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  header.detailHeadValue = '航海日志';
  
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

  const handleData = (data: any, item: any) => {
    const id = item.id;
    const value = data[id];
    if (value === undefined) {
      return '';
    }
    if (value.startsWith('{"')) {
      return value.replace(/({")|("})/g, '').replace(/(":")/g, ':');
    }
    if (/^\d+(,\d+)*$/.test(value)) {
      var label = '';
      const ach_nums = value.split(",").map(Number);
      for (let i = 0; i < ach_nums.length; i++) {
        const ach_num = ach_nums[i];
        item.options_list.map((arg: any) => {
          if (arg.value == ach_num) {
            label = label + arg.label + '\n';
          }
        });
      }
      return label
    }
    return value
  };

  const handleImage = (data: any) => {
    for(let key in data) {
      if (key.endsWith('image')) {
        return true;
      }
    }
    return false;
  };

  const imgList = (data: any) => {
    const imgList = [];
    for(let key in data) {
      if (key.endsWith('image')) {
        const value = data[key];
        if (value) {
          const imgsSrc = value.split(',');
          for (let i = 0; i < imgsSrc.length; i++) {
            const imgSrc = imgsSrc[i];
            imgList.push(imgSrc);
          }
        }
      }
    }
    return imgList;
  };

  // 请求topicIndex数据 
  const getQADetailInfo = async () => {
    try {
      loading.value = true;
      paramData.qid = qid;
      paramData.category = '船员好事';
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
