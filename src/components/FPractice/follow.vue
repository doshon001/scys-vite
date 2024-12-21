<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
    <el-card 
      class="mt"
      v-for="(item, index) in followUsers"
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
          <div class="flex flex-row justify-between" style="align-items: center;">
            <div class="flex flex-row" @click="gotoUserInfoArticles(item.user_id, item.name)" style="cursor: pointer; align-items: center;">
              <el-avatar size="large" :src="item.avatar_url" />
              <div class="felx flex-col ml">
                <span class="flex font-700 text-size-4">{{ item.name }}</span>
                <span class="flex mt-2 text-size-4" v-if="item.location">{{ item.location }}</span>
              </div>
            </div>
            <div class="felx">
              <el-button
                class="mt-2" 
                :type="followed(item) ? '' : 'primary'"
                @click="handleFollow(item)"
              >
                {{ followed(item) ? '已关注' : '关注' }}
              </el-button>
            </div>
          </div>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useHeaderStore, useFollowStore } from '/@/store/index';
  import { useRouter } from 'vue-router';

  interface FollowUser {
    user_id: any;
    name: any;
    avatar_url: any;
    location: any;
  }
  interface Follows {
    [key: string]: boolean;
  }

  const router = useRouter();
  
  const loading = ref(false);
  const header = useHeaderStore();
  const followStore = useFollowStore();
  header.detailHeadValue = '关注';

  const followUsers = followStore.followUsers as FollowUser[];

  const follows = reactive<Follows>({});
  followStore.followUsers.forEach((item: any) => {
    follows[item.user_id] = true;
  })
  
  const followed = computed(() => {
    return (item: FollowUser) => {
      return !!follows[item.user_id]
    }
  })

  const handleFollow = (item: FollowUser) => {
    follows[item.user_id] = !follows[item.user_id];
    if(follows[item.user_id]) {
      followStore.addFollowUser(item);
    } else {
      followStore.removeFollowUser(item);
    }
  }

  const gotoUserInfoArticles = (user_id: number, name: string) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
  }
</script>

<style scoped></style>
