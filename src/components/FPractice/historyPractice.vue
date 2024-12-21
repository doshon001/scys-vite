<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
      <el-card 
        class="mt"
        v-for="(item, index) in practice.data"
        :key="index"
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
            <div class="flex flex-row" @click="gotoActivityDetail(item.id, item.name)" style="cursor: pointer;">
              <el-avatar shape="square" size="large" :src="item.template.avatar" />
              <div class="flex w-full justify-between ml-2" style="align-items: center;">
                <div class="felx flex-col">
                  <span class="flex font-700 text-size-4">{{ item.name }}</span>
                  <span class="flex mt-2 text-size-4">{{ item.article_tag }}</span>
                </div>
                <div class="felx flex-col">
                  <span class="flex justify-center color-gray-400">{{ item.join_cnt }}人报名</span>
                  <el-button class="mt-2" type="primary">查看活动</el-button>
                </div>
              </div>
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
  import { useRouter } from 'vue-router';

  interface GroupInfo {
    data: any;
    error: any;
  }
  interface Practice {
    data: any;
    error: any;
  }
  interface ListData {}

  const router = useRouter();
  const groupInfo = reactive<GroupInfo>({
    data: null,
    error: null,
  });

  const practice = reactive<Practice>({
    data: null,
    error: null,
  });
  
  const loading = ref(false);
  const disabled = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '往期实战';

  let request;
  let group;
  let listData = [] as ListData[];
  let page = 0;
  const paramData = reactive({
    group_id: 0,
    page: 0,
    isCurrent: true,
  });
  const handleParam = () => {
    paramData['page'] = page;
    paramData.isCurrent = false;
  }

  const isNotNull = ref(true)
  
  
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

  const getPracticeInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getPracticeInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        let resData = response[0].data.data.activity
        listData = listData.concat(resData );
        practice.data = listData;
        if(resData .length < 10) {
          isNotNull.value = false;
        }
        loading.value = false;
      } else {
        loading.value = false;
        disabled.value = true;
        throw new Error('Invalid response data');
      }
    }catch (error: any) {
      practice.error = error.message;
      console.log('practiceError:', practice.error);
    }
  }

  const gotoActivityDetail = (id: any, name: any) => {
    header.detailHeadValue = name;
    const { href } = router.resolve({ name: 'activity', params: { id: id }});
    window.open(href, '_blank');
  }

  // 无限滚动
  const loadInfo = async () => {
    if(isNotNull.value) {
      page++;
      handleParam();
      await getPracticeInfo();
    }
  }
  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await loadInfo();
  })
</script>

<style scoped></style>
