<template>
  <div 
    class="antialiased text-slate-500 dark:text-slate-400 dark:bg-slate-900 max-w-screen-md mx-auto"
    style="width: 98%; height: 100vh; align-content: center; text-align: center;"
  >
    <el-input v-model="activationCode" style="width: 240px;" placeholder="请输入激活码"></el-input>
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { post } from '/@/utils/http/axios';
  import { setToken } from '/@/utils/auth';
  import router from '/@/router/index';
  import { ElMessage } from 'element-plus'

  const activationCode = ref('');
  const params = {
    activationCode: ''
  }
  const handleSubmit = async () => {
    params.activationCode = activationCode.value;
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
      if (!response.success) {
        ElMessage({
          message: response.message,
          type: 'warning',
        });
      } else {
        setToken(response.data);
        router.push({ name: 'index' });
      }
    } catch (error: any) {
      console.log('Error:', error.message);
    }
  }
</script>

<style scoped></style>


