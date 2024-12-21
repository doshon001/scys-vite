import { createApp } from 'vue'
import App from './App.vue'

import router from './router';
import piniaStore from './store';

import '/@/styles/reset.less';
import 'uno.css';
import 'video.js/dist/video-js.css';

// 引入Element Plus 所需
import ElementPlus from 'element-plus'; 
import 'element-plus/dist/index.css'; 
// 引入Element Plus 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'; 

import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});
app.use(router);
app.use(piniaStore);
app.use(Viewer, {
  defaultOptions: {
    rotatable: false,
    scalable: false,
    fullscreen: false,
    movable: false,
  },
});

app.mount('#app')
