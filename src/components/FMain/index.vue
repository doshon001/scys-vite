<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
      <el-card 
        v-for="(item, index) in topicIndex.data"
        :key="index"
        class="mt"
      >
        <template v-if="item.content.type === 'talk'">
          <template v-if="item.content.talk.owner ? true : false">
            <div class="flex flex-1 flex-content-start flex-row">
              <f-user-avatar :user="item.content.talk.owner" :create_time="item.content.create_time" :digested="item.content.digested" />
            </div>
          </template>
          <template v-if="item.content.talk.text ? true : false">
            <div class="mt-1 color-black font-400 break-all break-words" style="font-size: 1.2em">
              <el-text size="large" :line-clamp="item.content.talk?.text.length > 250 ? 3 : ''">
                <f-em-tag :text="item.content.talk.text" />
              </el-text>
              <el-text size="large" v-if="item.content.talk.text.length > 250 ? true : false">
                <a 
                  class="flex"
                  @click="gotoTopicInfo(item.content.topic_id)"
                >
                  查看全文
                </a>
              </el-text>
            </div>
          </template>
          <template v-if="item.content.talk.article ? true : false">
            <el-text size="large">
              <f-article-title :text="item.content.talk.article" />
            </el-text>
          </template>
          <template v-if="item.content.talk.images ? true : false">
            <f-image
              :style="{
                'margin-top': '0.25rem',
                'margin-right': '10px',
                width: '130px',
                height: item.content.talk.images.length < 2 
                  ? (item.content.talk.images[0].thumbnail.height * 130) / item.content.talk.images[0].thumbnail.width + 'px' 
                  : '130px',
              }"
              :images="imgList(item.content.talk.images)"
            />
          </template>
          <template v-if="item.content.talk.video ? true : false">
            <f-video
              :videoSource="item.content.talk.video"
            />
          </template>
          <template v-if="item.content.referenced_topic ? true : false">
            <f-referenced-topic :referencedTopic="item.content.referenced_topic" />
          </template>
          <template v-if="item.hashtags ? true : false">
            <div class="mt-1">
              <f-hash-tag :hashTags="item.content.talk.text" />
            </div>
          </template>
          <template v-if="item.content.talk.owner">
            <f-feature-icon :user="item.content.talk.owner" :topicId="item.content.topic_id" />
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
                height: item.content.task.images.length < 2 
                  ? (item.content.task.images[0].thumbnail.height * 130) / item.content.task.images[0].thumbnail.width + 'px' 
                  : '130px',
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
        <template v-if="item.content.type === 'q&a'">
          <template v-if="item.content.question.questionee">
            <div class="flex flex-1 flex-content-start flex-row">
              <f-user-avatar :user="item.content.question.questionee" :create_time="item.content.create_time" :digested="item.content.digested" />
            </div>
          </template>
          <template v-if="item.content.question.text ? true : false">
            <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em; border-left: 1.5px solid grey; padding-left: 1rem;">
              <el-text size="large" :line-clamp="item.content.question?.text.length > 250 ? 5 : ''">
                <template v-if="item.content.question.anonymous === true">
                  <span>匿名提问</span>
                </template>
                <template v-else>
                  <span>
                    <span
                      style="cursor: pointer;"
                      @click="gotoUserInfoArticles(item.content.question.owner.user_id, item.content.question.owner.name)"
                    >
                      {{ item.content.question.owner.name }}
                  </span>
                    提问
                  </span>
                </template>
                <f-em-tag :text="item.content.question.text" />
              </el-text>
              <el-text size="large" v-if="item.content.question.text.length > 250 ? true : false">
                <a 
                  class="flex"
                  @click="gotoTopicInfo(item.content.topic_id)"
                >
                  查看全文
                </a>
              </el-text>
            </div>
          </template>
          <template v-if="item.content.answer.text ? true : false">
            <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
              <el-text size="large">
                <f-em-tag :text="item.content.answer.text" />
              </el-text>
            </div>
          </template>
          <template v-if="item.hashtags ? true : false">
            <div class="mt-1">
              <f-hash-tag :hashTags="item.content.answer.text" />
            </div>
          </template>
          <template v-if="item.content.question.questionee">
            <f-feature-icon :user="item.content.question.questionee" :topicId="item.content.topic_id" />
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
      </el-card>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
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

  interface ParamData {
    digested?: boolean;
    user_id?: string | number;
    hashtag?: string;
    start_time?: { __type: 'Date'; iso: string };
    end_time?: { __type: 'Date'; iso: string };
    group_id?: number;
  }
  interface ImageObject {
    original?: { url: string };
    large?: { url: string };
    thumbnail: { url: string };
  }

  const route = useRoute();
  const router = useRouter();

  const topicIndex = reactive({
    data: [] as any[],
    end_iso: '',
    error: null,
  });
  const groupInfo = reactive({
    data: '',
    error: null,
  });
  
  const disabled = ref(false);
  const header = useHeaderStore();
  let request;
  let group;
  let listData:any[] = [];
  let paramData = reactive<ParamData>({});

  const handleParam = () => {
    let startTime, endTime;

    paramData.digested = header.switchValue || undefined;

    paramData.user_id = route.params.user_id 
      ? (Array.isArray(route.params.user_id) ? route.params.user_id[0] : route.params.user_id)
      : undefined;

    paramData.hashtag = route.params.hid 
      ? (Array.isArray(route.params.hid) ? route.params.hid[0] : route.params.hid)
      : undefined;

    if (header.timepicker) {
      startTime = new Date(header.timepicker[0]).toISOString();
      endTime = new Date(header.timepicker[1]).toISOString();
      paramData.start_time = {
        __type: 'Date',
        iso: startTime,
      };

      paramData.end_time = {
        __type: 'Date',
        iso: topicIndex.end_iso && topicIndex.end_iso < endTime ? topicIndex.end_iso : endTime,
      };
    } else if (topicIndex.end_iso) {
      paramData.end_time = {
        __type: 'Date',
        iso: topicIndex.end_iso,
      };
    } else {
      delete paramData.start_time;
      delete paramData.end_time;
    }
  };

  // 跳转到用户文章
  const gotoUserInfoArticles = (user_id: string | number, name: string) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
  }

  // 跳转到文章
  const gotoTopicInfo = (topic_id: string | number) => {
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
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getTopicIndex',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response.length) {
        let len = response.length - 1;
        topicIndex.end_iso = response[len].create_time.iso;
        listData = listData.concat(response);
        topicIndex.data = listData;
      } else {
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
    handleParam();
    await getTopicIndexInfo();
  }

  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await loadInfo();
  })

  // digested开关
  watch(header, async () => {
    topicIndex.end_iso = '';
    listData = [];
    handleParam();
    await loadInfo();
  });
</script>

<style scoped></style>
