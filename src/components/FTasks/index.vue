<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
      <el-card 
        v-for="(item, index) in topicIndex.data"
        :key="index"
        class="mt"
      >
        <el-skeleton :loading="loading" animated>
          <template #template>
            <div class="flex flex-1 flex-content-start flex-row flex-items-center">
              <div class="inline-flex mr-2">
                <el-skeleton-item variant="circle" style="width: 45px; height: 45px;" />
              </div>
              <div class="flex flex-col">
                <div class="mb-1">
                  <el-skeleton-item variant="text" style="width: 50px;" />
                </div>
                <div>
                  <el-skeleton-item variant="text" style="width: 80px;" />
                </div>
              </div>
            </div>
            <div class="mt-2">
              <el-skeleton-item variant="h3" style="width: 50%; margin-bottom: 5px" />
              <el-skeleton-item variant="h3" style="margin-bottom: 5px" />
              <el-skeleton-item variant="h3" style="width: 30%" />
            </div>
            <div class="mt-2">
              <el-skeleton-item variant="button" style="width: 10%; height: 30px; margin-bottom: 5px;" />
            </div>
            <div class="text-end mt-1">
              <span class="mr-3">
                <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px;" />
              </span>
              <span>
                <el-skeleton-item variant="button" style="width: 10%; height: 20px; margin-bottom: 5px;" />
              </span>
            </div>
            <div class="flex flex-col mt-2">
              <el-skeleton-item variant="text" style="width: 40%; margin-bottom: 5px;" />
              <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 5px;" />
              <el-skeleton-item variant="text" style="width: 30%;" />
            </div>
          </template>
          <template #default>
            <template v-if="item.content.type === 'task'">
              <template v-if="item.content.task.owner">
                <div class="flex flex-1 flex-content-start flex-row">
                  <f-user-avatar :user="item.content.task.owner" :create_time="item.content.create_time" :digested="item.content.digested" />
                </div>
              </template>
              <template v-if="item.content.task.text ? true : false">
                <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                  <el-text size="large" :line-clamp="item.content.task?.text.length > 250 ? 3 : ''">
                    <f-em-tag :text="item.content.task.text" />
                  </el-text>
                  <el-text size="large" v-if="item.content.task.text.length > 250 ? true : false">
                    <a 
                      class="flex"
                      @click="gotoTopicInfo(item.content.topic_id)"
                    >
                      查看全文
                    </a>
                  </el-text>
                </div>
              </template>
              <template v-if="item.content.task.images ? true : false">
                <f-image
                  :style="{
                    'margin-top': '0.25rem',
                    'margin-right': '10px',
                    width: '130px',
                    height: item.content.task.images.length < 2 ? (item.content.task.images[0].thumbnail.height * 130) / item.content.task.images[0].thumbnail.width + 'px' : '130px',
                  }"
                  :images="imgList(item.content.task.images)"
                />
              </template>
              <template v-if="item.hashtags ? true : false">
                <div class="mt-1">
                  <f-hash-tag :hashTags="item.content.task.text" />
                </div>
              </template>
              <template v-if="item.content.task.owner">
                <f-feature-icon :user="item.content.task.owner" :topicId="item.content.topic_id" />
              </template>
              <template v-if="item.content.rewards ? true : false">
                <f-rewards :fRewards="item.content.rewards" />
              </template>
              <template v-if="item.content.latest_likes ? true : false">
                <f-latest-likes :fLatestLikes="item.content.latest_likes" :likes_count="item.content.likes_count" />
              </template>
              <template v-if="item.show_comments ? true : false">
                <f-comments :fComments="item.comments" />
              </template>
              <a 
                style="font-size: 1.2em" 
                class="mt-1"
                @click="gotoTopicInfo(item.content.topic_id)"
              >
                查看更多评论
              </a>
            </template>
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
  import FImage from '/@/components/FImage/index.vue';
  import FEmTag from '/@/components/FEmTag/index.vue';
  import FUserAvatar from '/@/components/FUserAvatar/index.vue';
  import FHashTag from '/@/components/FHashTag/index.vue';
  import FFeatureIcon from '/@/components/FeatureIcon/index.vue';
  import FRewards from '/@/components/FRewards/index.vue';
  import FLatestLikes from '/@/components/FLatestLikes/index.vue';
  import FComments from '/@/components/FComments/index.vue';

  interface ListData {}
  interface GroupData {
    data: any;
    error: any;
  }
  interface TopicIndex {
    data: any;
    end_iso: any;
    error: any;
  }
  interface ImageObject {
    original?: { url: string };
    large?: { url: string };
    thumbnail: { url: string };
  }

  const router = useRouter();

  const topicIndex = reactive<TopicIndex>({
    data: [],
    end_iso: null,
    error: null,
  });
  const groupInfo = reactive<GroupData>({
    data: null,
    error: null,
  });
  
  const loading = ref(false);
  const disabled = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '作业';
  let request;
  let group;
  let listData: ListData[] = [];
  let paramData = reactive({
    'type': 'task',
    group_id: 0,
  });


  // 跳转到文章
  const gotoTopicInfo = (topic_id: any) => {
    const { href } = router.resolve({ name: 'topicInfo', params: { topic_id: topic_id } });
    window.open(href, '_blank');
  }

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

  // 请求topicIndex数据
  const getTopicIndexInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getQuestionsInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response.length !== 0) {
        let len = response.length - 1;
        topicIndex.end_iso = response[len].create_time.iso;
        listData = listData.concat(response);
        topicIndex.data = listData;
        loading.value = false;
      } else {
        loading.value = false;
        disabled.value = true;
        throw new Error('Invalid response data');
      }
    } catch (error: any) {
      topicIndex.error = error.message;
      console.log('Error:', topicIndex.error);
    }
  }
  
  // 处理image的集合
  const imgList = (imgs: ImageObject[]) => {
    const list: string[] = [];
    for (const img of imgs) {
      if (img.original) {
        list.push(img.original.url);
      } else if (img.large) {
        list.push(img.large.url);
      } else {
        list.push(img.thumbnail.url);
      }
    }
    return list;
  };

  // 无限滚动
  const loadInfo = async () => {
    if(loading.value == false) {
      //handleParam();
      await getTopicIndexInfo();
    }
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await loadInfo();
  })
</script>

<style scoped></style>
