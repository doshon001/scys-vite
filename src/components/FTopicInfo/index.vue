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
          <template v-if="topicInfo.data.content.type === 'talk'">
            <template v-if="topicInfo.data.content.talk.owner">
              <div class="flex flex-1 flex-content-start flex-row">
                <f-user-avatar :user="topicInfo.data.content.talk.owner" :create_time="topicInfo.data.content.create_time" :digested="topicInfo.data.content.digested" />
              </div>
            </template>
            <template v-if="topicInfo.data.content.talk.text ? true : false">
              <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                <el-text size="large">
                  <f-em-tag :text="topicInfo.data.content.talk.text" />
                </el-text>
              </div>
            </template>
            <template v-if="topicInfo.data.content.talk.article ? true : false">
              <el-text size="large">
                <f-article-title :text="topicInfo.data.content.talk.article" />
              </el-text>
            </template>
            <template v-if="topicInfo.data.content.talk.images ? true : false">
              <f-image
                :style="{
                  'margin-top': '0.25rem',
                  'margin-right': '10px',
                  width: '130px',
                  height: topicInfo.data.content.talk.images.length < 2 
                    ? (topicInfo.data.content.talk.images[0].thumbnail.height * 130) / topicInfo.data.content.talk.images[0].thumbnail.width + 'px'
                    : '130px',
                }"
                :images="imgList(topicInfo.data.content.talk.images)"
              />
            </template>
            <template v-if="topicInfo.data.content.talk.video ? true : false">
              <f-video
                :videoSource="topicInfo.data.content.talk.video"
              />
            </template>
            <template v-if="topicInfo.data.content.referenced_topic ? true : false">
              <f-referenced-topic :referencedTopic="topicInfo.data.content.referenced_topic" />
            </template>
            <template v-if="topicInfo.data.hashtags ? true : false">
              <div class="mt-1">
                <f-hash-tag :hashTags="topicInfo.data.content.talk.text" />
              </div>
            </template>
            <template v-if="topicInfo.data.content.talk.owner">
              <f-feature-icon :user="topicInfo.data.content.talk.owner" :topicId="topicInfo.data.content.topic_id" />
            </template>
            <template v-if="topicInfo.data.content.rewards ? true : false">
              <f-rewards :fRewards="topicInfo.data.content.rewards" />
            </template>
            <template v-if="topicInfo.data.content.latest_likes ? true : false">
              <f-latest-likes :fLatestLikes="topicInfo.data.content.latest_likes" :likes_count="topicInfo.data.content.likes_count" />
            </template>
            <template v-if="topicInfo.data.comments ? true : false">
              <f-comments :fComments="topicInfo.data.comments" />
            </template>
          </template>
          <template v-if="topicInfo.data.content.type === 'task'">
            <template v-if="topicInfo.data.content.task.owner">
              <div class="flex flex-1 flex-content-start flex-row">
                <f-user-avatar :user="topicInfo.data.content.task.owner" :create_time="topicInfo.data.content.create_time" :digested="topicInfo.data.content.digested" />
              </div>
            </template>
            <template v-if="topicInfo.data.content.task.text ? true : false">
              <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                <el-text style="display: flex;" size="large">
                  作业题目
                </el-text>
                <el-text size="large">
                  <f-em-tag :text="topicInfo.data.content.task.text" />
                </el-text>
              </div>
            </template>
            <template v-if="topicInfo.data.content.task.images ? true : false">
              <f-image
                :style="{
                  'margin-top': '0.25rem',
                  'margin-right': '10px',
                  width: '130px',
                  height: topicInfo.data.content.task.images.length < 2 
                    ? (topicInfo.data.content.task.images[0].thumbnail.height * 130) / topicInfo.data.content.task.images[0].thumbnail.width + 'px' 
                    : '130px',
                }"
                :images="imgList(topicInfo.data.content.task.images)"
              />
            </template>
            <template v-if="topicInfo.data.hashtags ? true : false">
              <div class="mt-1">
                <f-hash-tag :hashTags="topicInfo.data.content.task.text" />
              </div>
            </template>
            <template v-if="topicInfo.data.content.task.owner">
              <f-feature-icon :user="topicInfo.data.content.task.owner" :topicId="topicInfo.data.content.topic_id" />
            </template>
            <template v-if="topicInfo.data.content.rewards ? true : false">
              <f-rewards :fRewards="topicInfo.data.content.rewards" />
            </template>
            <template v-if="topicInfo.data.content.latest_likes ? true : false">
              <f-latest-likes :fLatestLikes="topicInfo.data.content.latest_likes" :likes_count="topicInfo.data.content.likes_count" />
            </template>
            <template v-if="topicInfo.data.comments ? true : false">
              <f-comments :fComments="topicInfo.data.comments" />
            </template>
          </template>
          <template v-if="topicInfo.data.content.type === 'q&a'">
            <template v-if="topicInfo.data.content.question.questionee">
              <div class="flex flex-1 flex-content-start flex-row">
                <f-user-avatar :user="topicInfo.data.content.question.questionee" :create_time="topicInfo.data.content.create_time" :digested="topicInfo.data.content.digested" />
              </div>
            </template>
            <template v-if="topicInfo.data.content.question.text ? true : false">
              <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em; border-left: 1.5px solid grey; padding-left: 1rem;">
                <el-text size="large">
                  <template v-if="topicInfo.data.content.question.anonymous === true">
                    <span>匿名提问</span>
                  </template>
                  <template v-else>
                    <span>
                      <span
                        style="cursor: pointer;"
                        @click="gotoUserInfoArticles(topicInfo.data.content.question.owner.user_id, topicInfo.data.content.question.owner.name)"
                      >
                        {{ topicInfo.data.content.question.owner.name }}
                    </span>
                      提问
                    </span>
                  </template>
                  <f-em-tag :text="topicInfo.data.content.question.text" />
                </el-text>
              </div>
            </template>
            <template v-if="topicInfo.data.content.answer.text ? true : false">
              <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                <el-text size="large">
                  <f-em-tag :text="topicInfo.data.content.answer.text" />
                </el-text>
              </div>
            </template>
            <template v-if="topicInfo.data.hashtags ? true : false">
              <div class="mt-1">
                <f-hash-tag :hashTags="topicInfo.data.content.answer.text" />
              </div>
            </template>
            <template v-if="topicInfo.data.content.question.questionee">
              <f-feature-icon :user="topicInfo.data.content.question.questionee" :topicId="topicInfo.data.content.topic_id" />
            </template>
            <template v-if="topicInfo.data.content.rewards ? true : false">
              <f-rewards :fRewards="topicInfo.data.content.rewards" />
            </template>
            <template v-if="topicInfo.data.content.latest_likes ? true : false">
              <f-latest-likes :fLatestLikes="topicInfo.data.content.latest_likes" :likes_count="topicInfo.data.content.likes_count" />
            </template>
            <template v-if="topicInfo.data.comments ? true : false">
              <f-comments :fComments="topicInfo.data.comments" />
            </template>
          </template>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useFollowStore } from '/@/store/index';
  import { useRoute, useRouter } from 'vue-router';
  import FImage from '/@/components/FImage/index.vue';
  import FVideo from '/@/components/FVideo/index.vue';
  import FEmTag from '/@/components/FEmTag/index.vue';
  import FArticleTitle from '/@/components/FArticleTitle/index.vue';
  import FUserAvatar from '/@/components/FUserAvatar/index.vue';
  import FHashTag from '/@/components/FHashTag/index.vue';
  import FFeatureIcon from '/@/components/FeatureIcon/index.vue';
  import FRewards from '/@/components/FRewards/index.vue';
  import FLatestLikes from '/@/components/FLatestLikes/index.vue';
  import FComments from '/@/components/FComments/index.vue';
  import FReferencedTopic from '/@/components/FReferencedTopic/index.vue';

  interface ImageObject {
    original?: { url: string };
    large?: { url: string };
    thumbnail: { url: string };
  }
  interface ParamData {
    group_id?: number;
    topic_id?: string;
  }

  const route = useRoute();
  const router = useRouter();
  const followStore = useFollowStore();
  const gotoUserInfoArticles = (user_id: string | number, name: string) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
  }
  const topic_id = route.params.topic_id;

  const topicInfo = reactive({
    data: {} as any,
    error: null,
  });
  const groupInfo = reactive({
    data: null as string | null,
    error: null,
  });
  
  const loading = ref(true);
  let request;
  let group;
  const paramData = reactive<ParamData>({});
  
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
      paramData.topic_id = topic_id as string;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getTopicInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        topicInfo.data = response;
        loading.value = false;
      } else {
        loading.value = false;
        throw new Error('Invalid response data');
      }
    } catch (error: any) {
      topicInfo.error = error.message;
      console.log('Error:', topicInfo.error);
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

  const handleHistory = async () => {
    if (topicInfo.data && topicInfo.data.content && topicInfo.data.content.topic_id) {
      const exists = followStore.historyLists.find((item: any) => item?.topic_id === topicInfo.data.content.topic_id);
      if (!exists) {
        followStore.addHistory(topicInfo.data.content);
      }
    }
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getTopicIndexInfo();
    await handleHistory();
  })
</script>

<style scoped></style>
