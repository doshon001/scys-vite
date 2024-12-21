<template>
  <div class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto" style="width: 98%">
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
        <el-card class="mt">
          <el-collapse>
            <template v-for="(item, index) in knowledgebase" :key="index">
              <template v-if="'href' in item">
                <div @click="gotoHref(item.href)">
                  {{ item.title }}
                </div>
              </template>
              <template v-else>
                <el-collapse-item :title="item.title">
                  <template v-for="(children_item, children_index) in item.children" :key="children_index">
                    <template v-if="'href' in children_item">
                      <div @click="gotoHref(children_item.href)">
                        {{ children_item.title }}
                      </div>
                    </template>
                    <template v-else>
                      <el-collapse-item :title="children_item.title">
                        <template v-for="(children_item_item, children_item_index) in children_item.children" :key="children_item_index">
                          <template v-if="'href' in children_item_item">
                            <div class="mt-2" style="cursor: pointer;" @click="gotoHref(children_item_item.href)">
                              {{ children_item_item.title }}
                            </div>
                          </template>
                          <template v-else>
                            <el-collapse-item :title="children_item_item.title">
                              <template v-for="(children_item_item_item, children_item_item_index) in children_item_item.children" :key="children_item_item_index">
                                <template v-if="'href' in children_item_item_item">
                                  <div class="mt-2" style="cursor: pointer;" @click="gotoHref(children_item_item_item.href)">
                                    {{ children_item_item_item.title }}
                                  </div>
                                </template>
                                <template v-else>
                                  <el-collapse-item :title="children_item_item_item.title">
                                    <template v-for="(children_item_item_item_item, children_item_item_item_index) in children_item_item_item.children" :key="children_item_item_item_index">
                                      <template v-if="'href' in children_item_item_item_item">
                                        <div class="mt-2" style="cursor: pointer;" @click="gotoHref(children_item_item_item_item.href)">
                                         {{ children_item_item_item_item.title }}
                                        </div>
                                      </template>
                                      <template v-else>
                                        <el-collapse-item :title="children_item_item_item_item.title">
                                        </el-collapse-item>
                                      </template>
                                    </template>
                                  </el-collapse-item>
                                </template>
                              </template>
                            </el-collapse-item>
                          </template>
                        </template>
                      </el-collapse-item>
                    </template>
                  </template>
                </el-collapse-item>
              </template>
            </template>
          </el-collapse>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue';
  import { post } from '/@/utils/http/axios';
  import { useHeaderStore } from '/@/store/index';
  import { useRoute, useRouter } from 'vue-router';
  import { knowledgebase } from '/@/utils/knowledgebase';


  const route = useRoute();
  const router = useRouter();

  const groupInfo = reactive({
    data: window.location.hostname,
    error: null,
  });
  
  const loading = ref(false);
  const header = useHeaderStore();
  header.detailHeadValue = '知识库';
  
  let group;
  let paramData = reactive({
    group_id: 0,
    resource_id: route.params.resource_id,
  });
  
  // 请求group数据
  const getGroupInfo = async () => {
    try {
      group = post({
        baseURL: import.meta.env.VITE_BASE_URL,
        url: '/getScysInfo',
        data: {'hostname': groupInfo.data},
        timeout: 10000,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json',
        },
      });
      const response = await group;
      const id = response.group_id
      paramData.group_id = parseInt(id);
    } catch (error: any) {
      groupInfo.error = error.message;
      console.log('groupError:', groupInfo.error);
    }
  }

  const gotoHref = (item: any) => {
    const id = item.split('/').pop();
    const { href } = router.resolve({ name: 'topicInfo', params: { topic_id: id } });
    window.open(href, '_blank');
  }


  // DOM挂载之后执行
  onMounted(async () => {
    await getGroupInfo();
  })
</script>

<style>
  em {
    color: #e08142;
  }
</style>
