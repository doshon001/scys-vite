<template>
    <span
        style="cursor: pointer; color: #667799; background-color: rgb(237, 242, 254); border-radius: 20px;"
        @click="gotoUserInfoArticles(user?.user_id, user?.name)"
    >
        <span class="color-slate-500" style="font-size: 1rem;">
            <img :src="user?.avatar" style="width: 1rem; height: 1rem; border-radius: 10px; margin-right: 2px;">
            {{ user?.name }}
        </span>
    </span>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const props = defineProps({
        user: {
            type: Object,
        },
    });
    const user = ref(props.user);
    // 跳转到用户信息
    const gotoUserInfoArticles = (user_id: any, name: any) => {
        const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
        window.open(href, '_blank');
    }
</script>