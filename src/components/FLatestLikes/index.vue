<template>
    <div class="flex flex-items-center mt text-size-base whitespace-pre color-slate-500 flex-wrap">
        <el-icon style="margin-right: 0.5rem"><Flag /></el-icon>
        <span
            v-for="(fLatestLike, index) in fLatestLikes"
            :key="index"
        >
            <span style="cursor: pointer;" @click="gotoUserInfoArticles(fLatestLike.owner.user_id, fLatestLike.owner.name)">
                {{ fLatestLike.owner.name }}
            </span>
            <span v-if="parseInt(index) < 9 && parseInt(index) !== length-1">，</span>
        </span>
        <span v-if="likes_count > 10 ? true : false">
            等{{ likes_count }}人
        </span>
        <span> 点赞</span>
    </div>
</template>
  
<script setup lang="ts">
import { Flag } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    fLatestLikes: {
        type: Object,
        required: true,
    },
    likes_count: {
        type: Number,
        default: 0,
    },
});

const length = props.fLatestLikes.length;

const gotoUserInfoArticles = (user_id: any, name: any) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
}
</script>