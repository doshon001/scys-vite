<template>
    <span @click="emClick" v-html="handleEmtags(text)"></span>
</template>
  
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { emoji } from '/@/utils/emoji';
interface EmList {
    hid: string,
    title: string,
    realHref: string,
    uid: string,
}
const router = useRouter();

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    keyword: {
        type: String || null,
    },
});

const emList: EmList[] = [];

// 跳转到标签连接
const gotoHashTag = (hid: any, title: string) => {
    const { href } = router.resolve({ name: 'hashArticles', params: { hid: hid, title: title } });
    window.open(href, '_blank');
}

// 跳转到用户信息
const gotoUserInfoArticles = (user_id: any, name: string) => {
    const { href } = router.resolve({ name: 'userArticles', params: { user_id: user_id, name: name } });
    window.open(href, '_blank');
}


// 表情文字转表情
const textToEmoji = (allText: any) => {
    const emojiReg = /(\[\p{Unified_Ideograph}+\]|\p{Emoji_Presentation})/gu;
    let emojiObj: any;
    let argStr: any;
    let endStr;
    const textToEmojied = allText.replace(emojiReg, (arg: any) => {
        if (arg.includes('[')) {
        const lastLen = arg.length - 1;
        argStr = arg.substring(1, lastLen);
        } else {
        argStr = arg;
        }
        emoji.map((obj) => {
        if (obj.title == argStr) {
            emojiObj = obj;
        }
        });
        if (emojiObj) {
        endStr =
            "<span style='display: inline-flex; vertical-align: middle'><img style='width: 20px; height: 20px;' title='" +
            emojiObj.title +
            "' src='/src/" +
            emojiObj.source +
            "'></span>";
        return endStr;
        } else {
        return arg;
        }
    });
    return textToEmojied;
}

// e标签转em标签
const etagsToEmtags = (allText: any) => {
    const eTagReg = /<e.*?(\/e>|\/>)/g;
    const emTag = allText.replace(eTagReg, (arg: any) => {
        if (arg.includes('type="hashtag"')) {
            const emObj = {
                realHref: '',
                title: '',
                hid: '',
                uid: ''
            };
            const hidReg = /hid=\"(.*?)\"/;
            const titleReg = /title=\"(.*?)\"/;
            const hidMatch = arg.match(hidReg);
            const hid = hidMatch[1];
            const titleMatch = arg.match(titleReg);
            const title = decodeURIComponent(titleMatch[1]);
            emObj['hid'] = hid;
            emObj['title'] = title;
            emList.push(emObj);
            const argStr = `<em style='color: rgb(102, 119, 153); cursor: pointer;'>${title}</em>`;
            return argStr;
        }
        if (arg.includes('type="web"')) {
            const emObj = {
                realHref: '',
                title: '',
                hid: '',
                uid: ''
            };
            let realHref;
            const hrefReg = /href=\"(.*?)\"/;
            const titleReg = /title=\"(.*?)\"/;
            //const idReg = /id=(\w+)/;
            const hrefMatch = arg.match(hrefReg);
            const strHref = decodeURIComponent(hrefMatch[1]);
            const titleMatch = arg.match(titleReg);
            const title = decodeURIComponent(titleMatch[1]);
            const argStr = '<a>' + title + '</a>';
            if (strHref.startsWith('https://i.shengcaiyoushu.com')) {
                const collection_id = strHref.split('=').pop();
                realHref = 'http://localhost:3000/#/collection/' + collection_id;
            };
            // !strHref.startsWith('https://i.shengcaiyoushu.com') && !strHref.startsWith('https://search01.shengcaiyoushu.com')
            if (strHref.startsWith('http') && !strHref.includes('shengcaiyoushu.com')) {
                realHref = strHref;
            };
            if (strHref.startsWith('#/article')) {
                const topic_id = strHref.split('/').pop();
                realHref = 'http://localhost:3000/#/topicInfo/' + topic_id;
            };
            if (strHref.startsWith('/docx/')) {
                const doc_id = strHref.split('/').pop();
                realHref = 'http://localhost:3000/#/' + doc_id;
            };
            if(realHref) {
                emObj['realHref'] = realHref;
            }
            emObj['title'] = title;
            emList.push(emObj);
            return argStr;
        }
        if (arg.includes('type="mention"')) {
            const emObj = {
                realHref: '',
                title: '',
                hid: '',
                uid: ''
            };
            const uidReg = /uid=\"(.*?)\"/;
            const titleReg = /title=\"(.*?)\"/;
            const uidMatch = arg.match(uidReg);
            const uid = uidMatch[1];
            const titleMatch = arg.match(titleReg);
            const title = decodeURIComponent(titleMatch[1]);
            emObj['uid'] = uid;
            emObj['title'] = title;
            emList.push(emObj);
            const argStr = `<em style='color: rgb(102, 119, 153); cursor: pointer;'>${title}</em>`;
            return argStr;
        }
    });
    return emTag;
}

// 点击em标签
const emClick = (e: any) => {
    const target = e.target;
    if (target.localName === 'a') {
        var emTitle = target.textContent.trim();
        var emItem = emList.find(item => item.title === emTitle);
        if (emItem?.realHref) {
            window.open(emItem.realHref, '_blank');                   
        }
    }
    if (target.localName === 'em') {
        if (target.innerText.startsWith('#')) {
            var emTitle = target.textContent.trim();
            var title = emTitle.replace(/[#"]/g, '')
            var emItem = emList.find(item => item.title === emTitle);
            if(emItem?.hid) {
                gotoHashTag(emItem?.hid, title);
            }
        }
        if (target.innerText.startsWith('@')) {
            var emTitle = target.textContent.trim();
            var title = emTitle.replace(/[@"]/g, '')
            var emItem = emList.find(item => item.title === emTitle);
            if(emItem?.uid) {
                gotoUserInfoArticles(emItem.uid, title);
            }
        }
    }
};
const keySearchWord = props.keyword;
// e标签转em标签
const keywordToEmtags = (allText: any, keyword: any) => {
    const keywordReg = RegExp(keyword, 'gi');
    const emTag = allText.replace(keywordReg, () => {
        const argStr = `<em style='color: #fb7185;'>${keyword}</em>`;
        return argStr;
    });
    return emTag;
}

// 处理标签
const handleEmtags = (allText: any) => {
    const textToEmojied = textToEmoji(allText);
    var emtaged = etagsToEmtags(textToEmojied);
    if (typeof(keySearchWord) === 'string') {
        emtaged = keywordToEmtags(emtaged, keySearchWord);
    }
    
    return emtaged;
}
</script>