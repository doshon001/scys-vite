<template>
    <div class="flex flex-items-center mt text-size-base whitespace-pre flex-wrap" style="color: #ef4444;">
        <el-icon color="#ef4444"><GoldMedal /></el-icon>
        <span
            class="flex flex-content-center color-slate-600"
            v-for="(fReward, index) in fRewards"
            :key="index"
        >
            <span style="color: #ef4444; cursor: pointer;" @click="gotoUserInfoArticles(fReward.owner.user_id, fReward.owner.name)">
                {{ fReward.owner.name }}({{ fReward.amount }})
            </span>
            <template v-if="parseInt(index) !== length - 1 ? true : false">
                <span style="color: #ef4444;">,</span>
            </template>
        </span>
        <span class="flex v-middle"> 赞赏</span>
    </div>
</template>
  
<script setup lang="ts">
import { GoldMedal } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    fRewards: {
        type: Object,
        required: true,
    },
});

const length = props.fRewards.length;

const gotoUserInfoArticles = (user_id: any, name: any) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
}
</script>