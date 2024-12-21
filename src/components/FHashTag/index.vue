<template>
    <span v-for="(hashTag, hashIndex) in getHashTags(hashTags)" :key="hashIndex" style="margin-right: 0.25rem">
        <el-tag style="cursor: pointer;" @click="gotoHashTag(hashTag.hid, hashTag.title)">{{ hashTag.title }}</el-tag>
    </span>
</template>
  
<script setup lang="ts">
    import { useRouter } from 'vue-router';
    const router = useRouter();

    const props = defineProps({
        hashTags: {
            type: String,
        },
    });
    const hashTags = props.hashTags;

    // 处理hashtags
    const strToObj = (str: any) => {
        const keyValuePairs: Record<string, string> = {};
        for (const pairStr of str.split(' ')) {
            const [key, value] = pairStr.split('=');
            keyValuePairs[key] = value;
    }
    return keyValuePairs;
    }
    const getHashTags = (tags: any) => {
        var patten = /<e.*?hid=.*?(\/e>|\/>)/g;
        var tagsMatch = tags.match(patten);
        var tagList = [];
        if(tagsMatch) {
            const uniqueTags: Record<string, boolean> = {}
            for (var i=0, len = tagsMatch.length; i < len; i++) {
                if(tagsMatch[i]) {
                    var tagMatch = tagsMatch[i];
                    var decTag = decodeURIComponent(tagMatch).replace(/[#"]/g, '');
                    var tag = strToObj(decTag);
                    if (!uniqueTags[decTag]) {
                        uniqueTags[decTag] = true;
                        tagList.push(tag);
                    }
                }
            }
            return tagList
        }
    }
    const gotoHashTag = (hid: any, title: any) => {
        const { href } = router.resolve({ name: 'hashArticles', params: { hid: hid, title: title } });
        window.open(href, '_blank');
    }
</script>