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
          <div class="flex flex-row w-full justify-between">
            <template v-if="activity.data.ajaxResult && activity.data.ajaxResult.data['航海手册'] && activity.data.ajaxResult.data['航海手册'].items">
              <div class="flex flex-col" style="align-items: center;" @click="gotoDocxInfo(activity.data.ajaxResult)">
                <el-button class="flex" type="danger" size="large" :icon="Reading" circle />
                <span class="flex mt-2 font-700 font-size-4">航海手册</span>
              </div>
            </template>
            <template v-if="activity.data.veteranShares">
              <div class="flex flex-col" style="align-items: center;" @click="gotoVeteranShares(activity.data.activity_id)">
                <el-button class="flex" type="danger" size="large" :icon="Collection" circle />
                <span class="flex mt-2 font-700 font-size-4">高手分享</span>
              </div>
            </template>
            <template v-if="activity.data.ajaxResult && activity.data.ajaxResult.data['百问百答'] && activity.data.ajaxResult.data['百问百答'].items">
              <div class="flex flex-col" style="align-items: center;" @click="gotoQAsInfo(activity.data.activity_id)">
                <el-button class="flex" type="danger" size="large" :icon="Comment" circle />
                <span class="flex mt-2 font-700 font-size-4">百问百答</span>
              </div>
            </template>
            <template v-if="activity.data.ajaxResult && activity.data.ajaxResult.data['实用工具'] && activity.data.ajaxResult.data['实用工具'].items">
              <div class="flex flex-col" style="align-items: center;" @click="gotoToolsInfo(activity.data.ajaxResult.data['实用工具'].items[0].href)">
                <el-button class="flex" type="danger" size="large" :icon="Scissor" circle />
                <span class="flex mt-2 font-700 font-size-4">实用工具</span>
              </div>
            </template>
            <template v-if="activity.data.ajaxResult && activity.data.ajaxResult.data['精选日志'] && activity.data.ajaxResult.data['精选日志'].items">
              <div class="flex flex-col" style="align-items: center;" @click="gotoToolsInfo(activity.data.ajaxResult.data['精选日志'].items[0].href)">
                <el-button class="flex" type="danger" size="large" :icon="Memo" circle />
                <span class="flex mt-2 font-700 font-size-4">精选日志</span>
              </div>
            </template>
            <template v-if="1">
              <div class="flex flex-col" style="align-items: center;" @click="gotoQAGoodsInfo(activity.data.activity_id)">
                <el-button class="flex" type="danger" size="large" :icon="Management" circle />
                <span class="flex mt-2 font-700 font-size-4">船员好事</span>
              </div>
            </template>
          </div>
        </el-card>
        <template v-if="activity.data.landingResult && activity.data.landingResult.data && activity.data.landingResult.data.activity && activity.data.landingResult.data.activity.template && activity.data.landingResult.data.activity.template.template">
          <el-card 
            class="mt"
            v-for="(item, index) in activity.data.landingResult.data.activity.template.template"
            :key="index"
          >
            <template v-if="item.title === '航海好事'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div class="mt-2" v-for="(content_item, content_index) in item.content" :key="content_index">
                <span class="color-orange-400">{{ content_item.username }}</span>
                <span class="ml-2">{{ content_item.text }}</span>
              </div>
            </template>
            <template v-if="item.title === '项目简介'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div class="mt-2" v-for="(content_item, content_index) in item.content" :key="content_index">
                <span>{{ content_item.text }}</span>
              </div>
            </template>
            <template v-if="item.title === '项目关键步骤'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div 
                class="flex mt-2" 
                v-for="(content_item, content_index) in item.content" 
                :key="content_index"
              >
                <span v-if="content_item.order" class="font-size-5 color-orange-300">•</span>
                <span class="ml-2" v-html="content_item.text"></span>
              </div>
            </template>
            <template v-if="item.title === '开船前必备工具'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div 
                class="flex mt-2" 
                v-for="(content_item, content_index) in item.content" 
                :key="content_index"
              >
                <span v-if="content_item.order" class="font-size-5 color-orange-300">•</span>
                <span class="ml-2" v-html="content_item.text"></span>
              </div>
            </template>
            <template v-if="item.title === '风险挑战和应对建议'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div 
                class="flex mt-2" 
                v-for="(content_item, content_index) in item.content" 
                :key="content_index"
              >
                <span v-if="content_item.order" class="font-size-5 color-orange-300">•</span>
                <span class="ml-2" v-html="content_item.text"></span>
              </div>
            </template>
            <template v-if="item.title === '适合人群'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div 
                class="flex mt-2" 
                v-for="(content_item, content_index) in item.content" 
                :key="content_index"
              >
                <span v-if="content_item.order" class="font-size-5 color-orange-300">•</span>
                <span class="ml-2" v-html="content_item.text"></span>
              </div>
            </template>
            <template v-if="item.title === '航线图'">
              <div class="font-700 font-size-5">{{ item.title }}</div>
              <div 
                class="flex mt-2" 
                v-for="(content_item, content_index) in item.content" 
                :key="content_index"
              >
                <span v-if="content_item.type !== 'week'" class="color-orange-400"> {{ content_item.type }}</span>
                <div class="flex flex-row" v-else-if="content_item.type === 'week'" > 
                  <span class="color-orange-400">{{ content_item.title }}</span>
                  <div class="ml-2">
                    <span>{{ content_item.children[content_item.children.length-1].text }}</span>
                    <span>{{ content_item.children[content_item.children.length-1].time }}</span>
                    <div
                      style="cursor: pointer; text-decoration: underline"
                      v-for="(children_item, children_index) in content_item.children"
                      :key="children_index"
                      @click="gotoChildUrl(children_item.url)"
                    >
                      <template v-if="children_index !== content_item.children.length-1">
                        <span>{{ children_index + 1 }}.</span>
                        <span>{{ children_item.text }}</span>
                        <span>{{ children_item.time }}</span>
                      </template>
                    </div>
                  </div>
                </div>
                <span class="ml-2" v-html="content_item.text"></span>
              </div>
            </template>
          </el-card>
        </template>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRoute, useRouter } from 'vue-router';
  import { Reading, Collection, Comment, Scissor, Memo, Management } from '@element-plus/icons-vue';

  interface Activity {
    data: any;
    error: any;
  }
  interface GroupInfo {
    data: any;
    error: any;
  }

  const route = useRoute();
  const router = useRouter();
  const groupInfo = reactive<GroupInfo>({
    data: null,
    error: null,
  });

  const activity = reactive<Activity>({
    data: null,
    error: null,
  });
  
  const loading = ref(true);
  const header = useHeaderStore();
  
  let request;
  let group;
  const paramData = reactive({
    group_id: 0,
    id: route.params.id,
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

  const getActivityInfo = async () => {
    try {
      loading.value = true;
      request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getActivityInfo',
        data: paramData,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      if (response) {
        activity.data = response
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

  const gotoDocxInfo = (item: any) => {
    if(item && item.data && item.data['航海手册'] && item.data['航海手册'].items.length > 0) {
      const href = '/#' + item.data['航海手册'].items[0].href;
      window.open(href, '_blank');
    }
  }

  const gotoVeteranShares = (id: Number) => {
    const { href } = router.resolve({ name: 'veteranShares', params: { id: id.toString() }});
    window.open(href, '_blank');
  }

  const gotoQAsInfo = (id: Number) => {
    const { href } = router.resolve({ name: 'qas', params: { activity_id: id.toString() }});
    window.open(href, '_blank');
  }

  const gotoToolsInfo = (href: any) => {
    window.open(href, '_blank');
  }

  const gotoQAGoodsInfo = (id: Number) => {
    const { href } = router.resolve({ name: 'journals', params: { activity_id: id.toString() }});
    window.open(href, '_blank');
  }

  const gotoChildUrl = (url: String) => {
    if (url.startsWith('https://scys.com/view/docx/') && url.includes('#')) {
      const urlPart = url.split('/');
      const anchor = urlPart[urlPart.length - 1];
      const href = '#/docx/' + anchor;
      window.open(href, '_blank');
    }
  }


  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
    await getActivityInfo();
    header.detailHeadValue = activity.data.landingResult.data.activity.name;
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
