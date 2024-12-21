import { createPinia } from 'pinia';
import { useHeaderStore } from './modules/header';
import { useFollowStore } from './modules/follow';
import { useAppStore } from './modules/app';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export { useHeaderStore, useAppStore, useFollowStore };
export default pinia;
