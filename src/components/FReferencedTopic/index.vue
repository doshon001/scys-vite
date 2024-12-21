<template>
    <div class="p-2" style="background: rgb(245, 245, 245)">
        <template v-if="!referencedTopic.invisible  &&  referencedTopic.topic.type === 'talk'">
            <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                <el-text size="large" :line-clamp="referencedTopic.topic.talk.text.length > 250 ? 6 : null">
                    <span
                        style="cursor: pointer; color: #667799;"
                        @click="gotoUserInfoArticles(referencedTopic.topic.talk.owner.user_id, referencedTopic.topic.talk.owner.name)"
                    >
                        {{ referencedTopic.topic.talk.owner.name }}
                </span>
                    <span>:</span>
                    <f-em-tag :text="referencedTopic.topic.talk.text" />
                </el-text>
            </div>
            <template v-if="referencedTopic.topic.talk.images ? true : false">
                <f-image
                    :style="{
                        'margin-top': '0.25rem',
                        'margin-right': '10px',
                        width: '130px',
                        height: referencedTopic.topic.talk.images.length < 2 ? (referencedTopic.topic.talk.images[0].thumbnail.height * 130) / referencedTopic.topic.talk.images[0].thumbnail.width + 'px' : '130px',
                    }"
                    :images="imgList(referencedTopic.topic.talk.images)"
                />
            </template>
            <template v-if="referencedTopic.topic.talk.video ? true : false">
                <f-video
                    :videoSource="referencedTopic.topic.talk.video"
                />
            </template>
            <div class="mt pb">
                <el-text size="large">
                <a class="mt" @click="aClick(referencedTopic.topic.topic_id)">查看原主题</a>
                </el-text>
            </div>
        </template>
        <template v-if="!referencedTopic.invisible  &&  referencedTopic.topic.type === 'task'">
            <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                <el-text size="large" :line-clamp="referencedTopic.topic.task.text.length > 250 ? 6 : null">
                    <span 
                        style="cursor: pointer; color: #667799;"
                        @click="gotoUserInfoArticles(referencedTopic.topic.task.owner.user_id, referencedTopic.topic.task.owner.name)"
                    >
                        {{ referencedTopic.topic.task.owner.name }}
                    </span>
                    <span>:</span>
                    <f-em-tag :text="referencedTopic.topic.task.text" />
                </el-text>
            </div>
            <template v-if="referencedTopic.topic.task.images ? true : false">
                <f-image
                    :style="{
                        'margin-top': '0.25rem',
                        'margin-right': '10px',
                        width: '130px',
                        height: referencedTopic.topic.task.images.length < 2 ? (referencedTopic.topic.task.images[0].thumbnail.height * 130) / referencedTopic.topic.task.images[0].thumbnail.width + 'px' : '130px',
                    }"
                    :images="imgList(referencedTopic.topic.task.images)"
                />
            </template>
            <div class="mt pb">
                <el-text size="large">
                <a class="mt" @click="aClick(referencedTopic.topic.topic_id)">查看原主题</a>
                </el-text>
            </div>
        </template>
        <template v-if="!referencedTopic.invisible  &&  referencedTopic.topic.type === 'q&a'">
            <div class="mt-1 color-black font-400 break-all break-words whitespace-pre-line" style="font-size: 1.2em">
                <el-text size="large" :line-clamp="referencedTopic.topic.question.text.length > 250 ? 6 : null">
                    <template v-if="referencedTopic.topic.question.anonymous === false">
                        <span 
                            style="cursor: pointer; color: #667799;"
                            @click="gotoUserInfoArticles(referencedTopic.topic.question.owner.user_id, referencedTopic.topic.question.owner.name)"
                        >
                            {{ referencedTopic.topic.question.owner.name }}
                    </span>
                    </template>
                    <span>:</span>
                    <f-em-tag :text="referencedTopic.topic.question.text" />
                </el-text>
            </div>
            <template v-if="referencedTopic.topic.question.images ? true : false">
                <f-image
                    :style="{
                        'margin-top': '0.25rem',
                        'margin-right': '10px',
                        width: '130px',
                        height: referencedTopic.topic.question.images.length < 2 ? (referencedTopic.topic.question.images[0].thumbnail.height * 130) / referencedTopic.topic.question.images[0].thumbnail.width + 'px' : '130px',
                    }"
                    :images="imgList(referencedTopic.topic.question.images)"
                />
            </template>
            <template v-if="referencedTopic.topic.question.video ? true : false">
                <f-video
                    :videoSource="referencedTopic.topic.question.video"
                />
            </template>
            <div class="mt pb">
                <el-text size="large">
                <a class="mt" @click="aClick(referencedTopic.topic.topic_id)">查看原主题</a>
                </el-text>
            </div>
        </template>
        <template v-if="referencedTopic.invisible === true">
            <div class="mt pb">
                <el-text size="large">
                <span class="mt color-stone-800">该主题已不存在</span>
                </el-text>
            </div>
        </template>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import FEmTag from '/@/components/FEmTag/index.vue';
import FImage from '/@/components/FImage/index.vue';
import FVideo from '/@/components/FVideo/index.vue';

interface ImageObject {
    original?: { url: string };
    large?: { url: string };
    thumbnail: { url: string };
}

const router = useRouter();

const props = defineProps({
    referencedTopic: {
        type: Object,
        required: true,
    },
});
const referencedTopic = ref(props.referencedTopic);

// 跳转到用户信息
const gotoUserInfoArticles = (user_id: any, name: any) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
}

const gotoTopic = (topic_id: any) => {
    const { href } = router.resolve({ name: 'topicInfo', params: { topic_id: topic_id } });
    window.open(href, '_blank');
};

// 点击em标签
const aClick = (topic_id: any) => {
    gotoTopic(topic_id);
};

  // 处理image的集合
  const imgList = (imgs: ImageObject[]) => {
    const list: string[] = [];
    for (const img of imgs) {
      if (img.original) {
        list.push(img.original.url);
      } else if (img.large) {
        list.push(img.large.url);
      } else {
        list.push(img.thumbnail.url);
      }
    }
    return list;
  };
</script>