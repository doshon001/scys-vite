<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto"
    style="width: 98%">
    <el-card class="mt">
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
          <div v-if="article.data.htmlContent" v-html="handleHtml(article.data.htmlContent)"></div>
          <div v-else>加载中...</div>
        </template>
      </el-skeleton>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { post } from '/@/utils/http/axios';
import { useRoute } from 'vue-router';

interface ParamData {
  article_id?: string;
}
interface ArticleData {
  htmlContent?: string;
}

const route = useRoute();

const article = reactive({
  data: {} as ArticleData,
  end_iso: null,
  error: null,
});

const loading = ref(true);
let request;
const paramData = reactive<ParamData>({});

// 请求topicIndex数据 
const getArticle = async () => {
  try {
    loading.value = true;
    paramData['article_id'] = Array.isArray(route.params.article_id) ? route.params.article_id[0] : route.params.article_id;
    request = post({
      baseURL: import.meta.env.VITE_BASE_URL,
      url: '/getArticle',
      data: paramData,
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    });
    const response = await request;
    if (response) {
      article.data = response;
      loading.value = false;
    } else {
      throw new Error('Invalid response data');
    }
  } catch (error: any) {
    article.error = error.message;
    console.log('Error:', article.error);
  }
}

// 处理HTML
const handleHtml = (content: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  const headElement = doc.querySelector('head');
  const styleElement = headElement?.querySelector('style');
  const targetDiv = doc.querySelector('.post');
  const conDiv = doc.querySelector('.content-container');
  if (targetDiv) {
    const previewElement = targetDiv.querySelector('.milkdown-preview');
    if (previewElement) {
      targetDiv.removeChild(previewElement);
    }
    const qrcode = targetDiv?.querySelector('#qrcode-url');
    if (qrcode) {
      targetDiv.removeChild(qrcode);
    }
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = 'https://articles.zsxq.com/css/article.css'; 
    document.body.appendChild(linkElement);
    return targetDiv.outerHTML.trim();
  }
  if (conDiv) {
    if (styleElement) {
      document.head.appendChild(styleElement);
    }
    return conDiv.outerHTML.trim(); // 返回匹配到的 <div> 内容
  }
}

// DOM挂载之后执行
onMounted(async () => {
  await getArticle();
})
</script>

<style scoped></style>


