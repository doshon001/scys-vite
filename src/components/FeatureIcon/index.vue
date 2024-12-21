<template>
    <div class="text-end">
        <el-button @click="onCollect" link>
            <el-icon :size="25" :color="starColor === true ? '#E6A23C' : '#909399'">
                <StarFilled />
            </el-icon>
            <span class="color-slate-500">收藏</span>
        </el-button>
        <el-button @click="onFollowUser" link>
            <el-icon :size="20" :color="userColor === true ? '#E6A23C' : '#909399'">
                <UserFilled />
            </el-icon>
            <span class="color-slate-500">关注</span>
        </el-button>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { StarFilled, UserFilled } from '@element-plus/icons-vue';
import { useFollowStore } from '/@/store/index';

interface User {
    user_id: any;
}

const props = defineProps({
    user: {
        type: Object as () => User,
    },
    topicId: {
        type: Number,
    },
});
const followStore = useFollowStore();
const starColor = ref(false);
const userColor = ref(false);


const handleFollowColor = () => {
    return followStore.followUsers.some((arg: User) => arg.user_id === props.user?.user_id);
}
const handleStarColor = () => {
    return followStore.collectTopics.some(arg => arg === String(props.topicId));
};

const onFollowUser = () => {
    userColor.value = !userColor.value;
    if(userColor.value === true) {
        if (!followStore.followUsers.some((arg: User) => arg.user_id === props.user?.user_id)) {
            followStore.addFollowUser(props.user);
        }
    } else {
        followStore.removeFollowUser(props.user);
    }
};


const onCollect = () => {
    starColor.value = !starColor.value;
    if(starColor.value) {
        if (!followStore.collectTopics.includes(String(props.topicId))) {
            followStore.addCollect(String(props.topicId));
        }
    } else {
        followStore.removeCollect(String(props.topicId));
    }
};

onMounted(() => {
    userColor.value = handleFollowColor();
    starColor.value = handleStarColor();
});
</script>