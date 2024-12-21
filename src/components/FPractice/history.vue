<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <el-card class="mt">
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
          <el-checkbox-group v-model="checkList" @change="handleCheckBox">
            <div
              class="mt-2 flex flex-row flex-items-center"
              v-for="(item, index) in historyLists"
              :key="index"
              style="font-size: 2rex; line-height: 2.5rex; cursor: pointer;"
            >
              <el-checkbox
                :value="index"
                v-show="checkboxShow"
              />
              <div 
                class="flex flex-row flex-items-center w-full"
                @click="gotoTopicInfo(item.topic_id)"
              >
                <template v-if="item.type === 'talk'">
                  <div>
                    <el-avatar :size="30" :src="item.talk.owner.avatar_url" />
                  </div>
                  <div class="flex flex-1 flex-col ml">
                    <div>
                      <el-text size="large" :line-clamp="1" v-html="item.talk.text"></el-text>
                    </div>
                    <div class="flex flex-row flex-items-center justify-between color-gray-400">
                      <div>{{ item.talk.owner.name }}</div>
                      <div>{{ handleTime(item.create_time) }}</div>
                    </div>
                  </div>
                </template>
                <template v-if="item.type === 'task'">
                  <div>
                    <el-avatar :size="30" :src="item.task.owner.avatar_url" />
                  </div>
                  <div class="flex flex-col ml">
                    <div>
                      <el-text size="large" :line-clamp="1" v-html="item.task.text"></el-text>
                    </div>
                    <div class="flex flex-row flex-items-center justify-between color-gray-400">
                      <div>{{ item.task.owner.name }}</div>
                      <div>{{ handleTime(item.create_time) }}</div>
                    </div>
                  </div>
                </template>
                <template v-if="item.type === 'q&a'">
                  <div>
                    <el-avatar :size="30" :src="item.question.questionee.avatar_url" />
                  </div>
                  <div class="flex flex-col ml">
                    <div>
                      <el-text size="large" :line-clamp="1" v-html="item.question.text"></el-text>
                    </div>
                    <div class="flex flex-row flex-items-center justify-between color-gray-400">
                      <div>{{ item.question.questionee.name }}</div>
                      <div>{{ handleTime(item.create_time) }}</div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </el-checkbox-group>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted, watch } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore, useFollowStore } from '/@/store/index';
  import { useRouter } from 'vue-router';

  interface GroupInfo {
    data: any;
    error: any;
  }
  interface HistoryList {
    type: any;
    create_time: any;
    talk: any;
    task: any;
    question: any;
    topic_id: any;
  }

  const router = useRouter();
  const groupInfo = reactive<GroupInfo>({
    data: null,
    error: null,
  });
  
  const loading = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '浏览历史';
  header.historyCheckBox = '';
  header.historyState = false;

  const followStore = useFollowStore();

  const historyLists = followStore.historyLists as HistoryList[];
  
  let group;
  const paramData = reactive({
    group_id: 0,
  });
  
  const checkboxShow = ref(false);
  const checkList = ref([]);

  const handleCheckBox = (val: any) => {
    header.historyCheckBox = val;
  }

  watch(header, () => {
    if(header.settingVisible) {
      checkboxShow.value = true;
    } else {
      checkboxShow.value = false;
    }
  })

  watch(header, () => {
    if(header.historyState) {
      checkList.value.splice(0, checkList.value.length);
      header.historyState = false;
    }
  })
  
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

  const handleTime = (time: string) => {
    const date = new Date(time).toLocaleString();
    return date;
  }

  const gotoTopicInfo = (topic_id: number) => {
    const { href } = router.resolve({ name: 'topicInfo', params: { topic_id: topic_id }});
    window.open(href, '_blank');
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
  })
</script>

<style scoped></style>
