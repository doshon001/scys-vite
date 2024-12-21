<template>
    <a class="mt" @click="aClick(text)">{{ handleArticle(text) }}</a>
</template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const { text } = defineProps<{
    text: {
        article_id: string;
        title: string;
    }
}>();

const gotoArticle = (article_id: string) => {
    const { href } = router.resolve({ name: 'article', params: { 'article_id': article_id } });
    window.open(href, '_blank');
};

// 点击em标签
const aClick = (text: any) => {
    const article_id = text.article_id;
    gotoArticle(article_id);
};

// 处理文章标题
const handleArticle = (text: any) => {
    const title = text.title;
    return title;
};
</script>