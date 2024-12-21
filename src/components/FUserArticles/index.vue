<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <el-card class="mt">
      <div class="flex flex-1 flex-content-start flex-col">
        <template v-if="userInfo.data ? true : false">
          <el-avatar 
            size="large" 
            :src="userInfo.data.avatar_url" 
            fit="cover" 
            style="cursor: pointer;"
            @click="gotoUserInfoArticles(userInfo.data.user_id, userInfo.data.name)"
          />
          <div class="color-black mt-1" style="font-size: 1.8em">{{ userInfo.data.name }}</div>
        </template>
        <template v-if="userInfo.data.unique_id ? true : false">
          <div class="color-black mt-1" style="font-size: 1.1em">知识号:{{ userInfo.data.unique_id }}</div>
        </template>
        <template v-if="userInfo.data.location ? true : false">
          <div class="color-black mt-1" style="font-size: 1.1em">属地:{{ userInfo.data.location }}</div>
        </template>
        <template v-if="userInfo.data.introduction ? true : false">
          <div class="color-black mt-3">
            <span style="font-size: 1.1em; word-break: break-all; white-space: pre-wrap;" v-html="userInfo.data.introduction"></span>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useRoute, useRouter } from 'vue-router';


  interface UserInfo{
    data: any;
    error: any;
  }

  const route = useRoute();
  const router = useRouter();
  
  const userInfo = reactive<UserInfo>({
    data: {},
    error: null,
  });

  const gotoUserInfoArticles = (user_id: any, name: any) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
  }

  // 请求userArticle数据
  const getUserInfo = async () => {
    const userInfoId = route.params.user_id;
    try {
      const postUserInfo = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getUserInfo',
        data: {'user_id': userInfoId},
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await postUserInfo;
      if (response) {
        userInfo.data = response;
      }
    } catch (error: any) {
      userInfo.error = error.message;
      console.log('userInfoError:', userInfo.error);
    }
  }
  // DOM挂载之后执行
  onMounted(async () => {
    await getUserInfo();
  })
</script>

<style scoped></style>
