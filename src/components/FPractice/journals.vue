<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
      <el-card 
        class="mt"
        v-for="(item, index) in journals.data" :key="index"
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
            <div style="cursor: pointer;" @click="gotoJournalInfo(item.qid)">
              <template v-if="item.user">
                <div class="flex flex-1 flex-content-start flex-row">
                  <f-user-avatar :user="item.user" :create_time="new Date(item.gmt_create * 1000).toLocaleString()"/>
                </div>
              </template>
              <template v-if="item.form">
                <div 
                  v-for="(item_item, item_index) in item.form"
                  :key="item_index"
                  class="mt"
                  style="color: #080808;"
                >
                  <div class="font-600">{{ item_item.title }}</div>
                  <div class="mt-1 whitespace-pre-wrap">{{ handleData(item.data, item_item) }}</div>
                </div>
              </template>
              <template v-if="handleImage(item.data)">
                <f-image
                  :style="{
                    'margin-top': '0.5rem',
                    'margin-right': '10px',
                    width: '130px',
                    height: '130px',
                  }"
                  :images="imgList(item.data)"
                />
              </template>
            </div>
          </template>
        </el-skeleton>
      </el-card>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRoute, useRouter } from 'vue-router';
  import FUserAvatar from '/@/components/FUserAvatar/journal.vue';
  import FImage from '/@/components/FImage/index.vue';

  interface GroupInfo {
    data: any;
    error: any;
  }
  interface Journals {
    data: any;
    end_iso: any;
    error: any;
  }
  interface ListData {}

  const route = useRoute();
  const router = useRouter();
  const activity_id = route.params.activity_id;

  const journals = reactive<Journals>({
    data: [],
    end_iso: null,
    error: null,
  });
  const groupInfo = reactive<GroupInfo>({
    data: null,
    error: null,
  });
  
  const loading = ref(true);
  const disabled = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '船员好事';

  let request;
  let group;
  let listData = [] as ListData[];
  let page = 0;
  const paramData = reactive({
    group_id: 0,
    page: 0,
    activity_id: activity_id,
    category: '船员好事'
  });
  const isNotNull = ref(true)

  const handleParam = () => {
    paramData.page = page;
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
  };

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
  const getJournalsInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getJournalsInfo',
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
        journals.data = listData;
        loading.value = false;
        if(response .length < 10) {
          isNotNull.value = false;
        }
      } else {
        loading.value = false;
        disabled.value = true;
        throw new Error('Invalid response data');
      }
    } catch (error: any) {
      journals.error = error.message;
      console.log('Error:', journals.error);
    }
  }

  const gotoJournalInfo = (id: any) => {
    const { href } = router.resolve({ name: 'journal', params: { qid: id }});
    window.open(href, '_blank');
  }

  // 无限滚动
  const loadInfo = async () => {
    if(isNotNull.value) {
      page++;
      handleParam();
      await getJournalsInfo();
    }
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await loadInfo();
  })
</script>

<style scoped></style>
