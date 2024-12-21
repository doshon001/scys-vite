<template>
    <div 
        class="mt-1" 
        style="font-size: 1rem;"
        v-for="(replied_comment, repliedIndex) in replied_comments" :key="repliedIndex"
    >
        <span style="cursor: pointer; color: #667799;" @click="gotoUserInfoArticles(replied_comment.owner.user_id, replied_comment.owner.name)">{{ replied_comment.owner.name }}</span>
        <span>回复</span>
        <span style="cursor: pointer; color: #667799;" @click="gotoUserInfoArticles(replied_comment.repliee.user_id, replied_comment.repliee.name)">{{ replied_comment.repliee.name }}</span>
        <span>：</span>
        <f-em-tag :text="replied_comment.text" />
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FEmTag from '/@/components/FEmTag/index.vue';

const router = useRouter();

const props = defineProps({
    replied_comments: {
        type: Object,
        required: true,
    },
});

const replied_comments = ref(props.replied_comments)


// 跳转到用户信息
const gotoUserInfoArticles = (user_id: any, name: any) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
}

</script>