<template>
    <div class="mt" >
        <div 
            v-for="(comment, index) in fComments" :key="index"
            style="font-size: 1rem;"
        >
            <div class="flex flex-1 flex-content-start flex-row">
                <f-user-avatar :user="comment.owner" :create_time="comment.create_time" />
            </div>
            <f-em-tag :text="comment.text" />
            <template v-if="comment.images ? true : false">
                <f-image
                :style="{
                    'margin-top': '0.25rem',
                    'margin-right': '10px',
                    width: '130px',
                    height: comment.images.length < 2 ? (comment.images[0].thumbnail.height * 130) / comment.images[0].thumbnail.width + 'px' : '130px',
                }"
                :images="imgList(comment.images)"
                />
            </template>
            <template v-if="comment.replied_comments ? true : false">
                <f-replied-comments :replied_comments="comment.replied_comments" />
            </template>
            <template v-if="parseInt(index) !== last">
                <el-divider style="margin: 0.5rem;" />
            </template>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import FUserAvatar from '/@/components/FUserAvatar/index.vue';
import FEmTag from '/@/components/FEmTag/index.vue';
import FImage from '/@/components/FImage/index.vue';
import FRepliedComments from '/@/components/FRepliedComments/index.vue';

interface ImageObject {
    original?: { url: string };
    large?: { url: string };
    thumbnail: { url: string };
}

const props = defineProps({
    fComments: {
        type: Object,
        required: true,
    },
});

const last = props.fComments.length - 1;

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