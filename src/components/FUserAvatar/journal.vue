<template>
    <div
        class="flex flex-items-center flex-row"
        style="cursor: pointer; color: #667799;"
        @click="gotoUserInfoArticles(user.user_id, user.name)"
    >
        <div class="inline-flex mr-2">
            <el-avatar :src="user.avatar" fit="cover" />
        </div>
        <div class="flex flex-col text-start">
            <div class="color-slate-500 mt-1" style="font-size: 1.2rem">
                {{ user.name }}
            </div>
            <div class="color-stone-400 break-keep mt-1" style="font-size: 0.6rem">{{ create_time }}</div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
        create_time: {
            type: String,
        },
    });
    const user = ref(props.user);
    const create_time = ref(props.create_time);
    // 跳转到用户信息
    const gotoUserInfoArticles = (user_id: any, name: any) => {
        const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
        window.open(href, '_blank');
    }
</script>