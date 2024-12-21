<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <ul v-infinite-scroll="loadInfo" infinite-scroll-immediate="false" :infinite-scroll-disabled="disabled">
      <el-card 
        v-for="(item, index) in topicIndex.data"
        :key="index"
        class="mt"
      >
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
            <f-feature-icon :user="item.content.question.questionee" ::topicId="item.content.topic_id" />
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
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRouter } from 'vue-router';
  import FEmTag from '/@/components/FEmTag/index.vue';
  import FUserAvatar from '/@/components/FUserAvatar/index.vue';
  import FHashTag from '/@/components/FHashTag/index.vue';
  import FFeatureIcon from '/@/components/FeatureIcon/index.vue';
  import FRewards from '/@/components/FRewards/index.vue';
  import FLatestLikes from '/@/components/FLatestLikes/index.vue';
  import FComments from '/@/components/FComments/index.vue';

  interface TopicIndex {
    data: any;
    end_iso: any;
    error: any;
  }
  interface GroupInfo {
    data: any;
    error: any;
  }
  interface ListData {}

  const router = useRouter();

  const topicIndex = reactive<TopicIndex>({
    data: [],
    end_iso: null,
    error: null,
  });
  const groupInfo = reactive<GroupInfo>({
    data: null,
    error: null,
  });
  
  const loading = ref(false);
  const disabled = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '问答';
  let request;
  let group;
  let listData: ListData[] = [];
  let paramData = reactive({
    'type': 'q&a',
    group_id: 0,
  });

  // 跳转到用户文章
  const gotoUserInfoArticles = (user_id: any, name: any) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
  }

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
