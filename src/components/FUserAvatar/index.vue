<template>
    <div
        class="flex flex-items-center flex-row"
        style="cursor: pointer; color: #667799;"
        @click="gotoUserInfoArticles(user.user_id, user.name)"
    >
        <div class="inline-flex mr-2">
            <el-avatar :src="user.avatar_url" fit="cover" />
        </div>
        <div class="flex flex-col text-start">
            <div class="color-slate-500 mt-1" style="font-size: 1.2rem">
                {{ user.name }}
                <template v-if="digested === true">
                    <el-tag type="warning" size="small" style="padding: 0 2px; border-style: none;">
                        <el-icon><Trophy /></el-icon>
                        精华
                    </el-tag>
                </template>
            </div>
            <div class="color-stone-400 break-keep mt-1" style="font-size: 0.6rem">{{ create_time.split('.')[0] }}</div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { Trophy } from '@element-plus/icons-vue';

    const router = useRouter();

    const props = defineProps({
        user: {
            type: Object,
            required: true,
        },
        create_time: {
            type: String,
            required: true,
        },
        digested: {
            type: Boolean,
        },
    });

    const user = ref(props.user);
    const create_time = ref(props.create_time);
    const digested = ref(props.digested);

    // 跳转到用户信息
    const gotoUserInfoArticles = (user_id: any, name: any) => {
        const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
        window.open(href, '_blank');
    }
</script>