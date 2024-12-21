<template>
  <div>
    <el-skeleton style="width: 100%" :loading="loading" :count="3" animated>
      <template #template>
        <div class="flex my">
          <el-skeleton-item variant="h3" style="width: 30%" />
        </div>
        <div class="flex my">
          <el-skeleton-item variant="h3" style="width: 90%" />
        </div>
        <div class="flex my">
          <el-skeleton-item variant="h3" style="width: 90%" />
        </div>
      </template>
      <template #default>
        <div class="flex flex-col">
          <div class="flex flex-row flex-justify-between">
            <div>
              <el-button link @click="gotoLatestPractice()">
                <div>
                  <div>
                    <el-icon size="30"><Notification /></el-icon>
                  </div>
                  <div class="color-black">最新实战</div>
                </div>
              </el-button>
            </div>
            <div>
              <el-button link @click="gotoHistoryPractice()">
                <div>
                  <div>
                    <el-icon size="30"><Notification /></el-icon>
                  </div>
                  <div class="color-black">往期实战</div>
                </div>
              </el-button>
            </div>
            <div>
              <el-button link @click="gotoFollow()">
                <div>
                  <div>
                    <el-badge :value="followStore.followUsers.length ? followStore.followUsers.length: ''">
                      <el-icon size="30"><User /></el-icon>
                    </el-badge>
                  </div>
                  <div class="color-black">关注</div>
                </div>
              </el-button>
            </div>
            <div>
              <el-button link @click="gotoCollet()">
                <div>
                  <div>
                    <el-badge :value="followStore.collectTopics.length ? followStore.collectTopics.length: ''">
                      <el-icon size="30"><Star /></el-icon>
                    </el-badge>
                  </div>
                  <div class="color-black">收藏</div>
                </div>
              </el-button>
            </div>
            <div>
              <el-button link @click="gotoHistory()">
                <div>
                  <div>
                    <el-badge :value="followStore.historyLists.length ? followStore.historyLists.length: ''">
                      <el-icon size="30"><Clock /></el-icon>
                    </el-badge>
                  </div>
                  <div class="color-black">历史</div>
                </div>
              </el-button>
            </div>
          </div>
          <div class="flex justify-center">
            <el-divider style="width: 80%">导航</el-divider>
          </div>
          <div class="flex flex-wrap">
            <div class="mt-2 mr-2" v-for="list in lists" :key="list">
              <el-button size="small" round @click="gotoUrl(list)">
                <div class="color-teal-900">
                  {{ handleTitle(list.title) }}
                </div>
              </el-button>
            </div>
          </div>
          <div class="flex flex-wrap mt-2">
            <el-button 
              style="width: 100%" 
              round
              @click="gotoSearch()"
            >
              <div class="color-black">星球内容索引工具</div>
            </el-button>
          </div>
          <div class="flex flex-wrap mt-2">
            <el-button 
              style="width: 100%" 
              round
              @click="gotoVoyageSearch()"
            >
              <div class="color-black">航海内容索引工具</div>
            </el-button>
          </div>
          <div class="mt-2">
            <el-button
              class="nav-btn"
              :shape="'circle'"
              type="info"
              plain
              :icon="theme === 'dark' ? Sunny : Moon"
              circle
              size="small"
              @click="toggleTheme()"
            />
          </div>
          <div class="flex flex-wrap mt-2">
            <el-button style="width: 100%" round>
              <div class="color-black">输入新的注册码</div>
            </el-button>
          </div>
          <div class="flex flex-wrap mt-2 color-black">有效期至: {{ expireDate }}</div>
          <div class="flex flex-wrap mt-2 color-rose-600" style="font-size: 0.6rem">
            *续期提醒: 本站没有自动续期功能，使用新的激活码才能续期*
          </div>
          <div class="flex mt-2">
            <div class="text-wrap self-center mr-2 color-black">重置码: 5354f4608b...c1a12015d2</div>
            <div class="self-center">
              <el-button round size="small">
                <div class="color-black">复制</div>
              </el-button>
            </div>
          </div>
          <div class="flex text-wrap mt-2 color-black text-start" style="font-size: 0.7rem">
            *外泄重置码将导致账号丢失，务必妥善保存，重置码是找回凭证，可用于换绑浏览器或者找回账号*
          </div>
          <div class="flex flex-wrap text-wrap mt-2 color-black text-start font-600" style="font-size: 0.7rem">
            请勿清除浏览器缓存,任何问题请联系客服!
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { Notification, User, Star, Clock } from '@element-plus/icons-vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore } from '/@/store';
  import { Sunny, Moon } from '@element-plus/icons-vue';
  import { useRouter } from 'vue-router';
  import { useHeaderStore, useFollowStore } from '/@/store/index';
  import { nav } from '/@/utils/nav';
  import { getToken } from '/@/utils/auth';
  import { post } from '/@/utils/http/axios';

  const router = useRouter();
  const appStore = useAppStore();
  const theme = computed(() => {
    return appStore.theme;
  });
  const isDark = useDark({
    selector: 'body',
    onChanged(dark: boolean) {
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);
  const loading = ref(false);
  const lists = nav;
  const header = useHeaderStore();
  const followStore = useFollowStore();
  const expireDate = ref('');

  const params = {
    activationCode: ''
  }
  const handleSubmit = async (code: string) => {
    params.activationCode = code.slice(2);
    if(!params.activationCode) {
      return false;
    }
    try {
      const request = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getVerifyCode',
        data: params,
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await request;
      expireDate.value = new Date(response.expireDate).toLocaleString();
    } catch (error: any) {
      console.log('Error:', error.message);
    }
  }
  
  // 跳转到搜索页
  const gotoSearch = () => {
    const { href } = router.resolve({ name: 'search' });
    window.open(href, '_blank');
  }
  // 跳转到航海搜索页
  const gotoVoyageSearch = () => {
    const { href } = router.resolve({ name: 'voyagesearch' });
    window.open(href, '_blank');
  }

  const gotoLatestPractice = () => {
    header.detailHeadValue = '最新实战';
    const { href } = router.resolve({ name: 'latestPractice' });
    window.open(href, '_blank');
  }

  const gotoHistoryPractice = () => {
    header.detailHeadValue = '往期实战';
    const { href } = router.resolve({ name: 'historyPractice' });
    window.open(href, '_blank');
  }

  const gotoFollow = () => {
    header.detailHeadValue = '关注';
    const { href } = router.resolve({ name: 'follow' });
    window.open(href, '_blank');
  }

  const gotoCollet = () => {
    header.detailHeadValue = '收藏';
    const { href } = router.resolve({ name: 'collect' });
    window.open(href, '_blank');
  }

  const gotoHistory = () => {
    header.detailHeadValue = '历史';
    const { href } = router.resolve({ name: 'history' });
    window.open(href, '_blank');
  }

  const handleTitle = (item: string) => {
    let title = decodeURIComponent(item);
    if (title.startsWith('#')) {
      title = title.replace(/#/g, '');
    }
    return title
  };

  const gotoUrl = (item: any) => {
    if (item.url) {
      if(item.url.startsWith('#/article')) {
        const href = item.url.replace(/\/article\//g, 'topicInfo/');
        window.open(href, '_blank');
      } else if (item.url.startsWith('#/activity')) {
        header.detailHeadValue = '生财思维课';
        const resource_id = item.url.split('/').pop();
        const { href } = router.resolve({ name: 'knowResource', params: { resource_id: resource_id } });
        window.open(href, '_blank');
      } else {
        const href = item.url;
        window.open(href, '_blank');
      }
    } else if (item.hashtag_id) {
      const hid = item.hashtag_id;
      const title = handleTitle(item.title);
      const { href } = router.resolve({ name: 'hashArticles', params: { hid: hid, title: title } });
      window.open(href, '_blank');
    }
  }

  onMounted(async () => {
    const code = getToken();
    if(code) {
      await handleSubmit(code);
    }
  })
</script>

<style scoped></style>
