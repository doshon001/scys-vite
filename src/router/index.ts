import { createRouter, createWebHashHistory } from 'vue-router'
import routes from 'virtual:generated-pages';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { roots } from './root';
import { getToken } from '/@/utils/auth';
import { ElMessage } from 'element-plus'
import { post } from '/@/utils/http/axios';


//console.log('header', header)
//routes.push({
  //path: '/',
  //redirect: '/login',
//});

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

const params = {
  activationCode: ''
}
const handleSubmit = async (code: string) => {
  params.activationCode = code.slice(2);
  if(!params.activationCode) {
    return false;
  }
  try {
    const request = post({
      baseURL: import.meta.env.VITE_BASE_URL,
      url: '/getVerifyCode',
      data: params,
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    });
    const response = await request;
    return response;
  } catch (error: any) {
    console.log('Error:', error.message);
  }
}

roots.forEach((root) => {
  router.addRoute(root);
});

router.beforeEach(async (_to, _from, next) => {
  NProgress.start();
  if(_to.name !== 'activate') {
    const session =  getToken();
    if (!session) {
      ElMessage.error('请先登录');
      next({ name: 'login' }); // 假设有一个登录页面
      return;
    }
    const result = await handleSubmit(session)
    if(result.success) {
      next();
    } else {
      ElMessage.error(result.message);
      next({ name: 'activate' });
    }
  } else {
    next();
  }
});

router.afterEach((_to) => {
  NProgress.done();
});

export default router;