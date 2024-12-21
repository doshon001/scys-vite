import vue from '@vitejs/plugin-vue';
import { PluginOption } from 'vite';
import { ConfigPagesPlugin } from './pages';
import { ConfigUnocssPlugin } from './unocss';

export function createVitePlugins() {
  
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // vue支持
    vue(),
    // JSX支持
    //vueJsx(),
    // setup语法糖组件名支持
    //vueSetupExtend(),
    // 提供https证书
    //VitePluginCertificate({
      //source: 'coding',
    //}),
  ];
  
  // 自动生成路由
  vitePlugins.push(ConfigPagesPlugin());
  // Unocss
  vitePlugins.push(ConfigUnocssPlugin())

  return vitePlugins;
}
