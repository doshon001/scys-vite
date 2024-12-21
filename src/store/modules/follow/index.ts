import { defineStore } from 'pinia';
import { ref } from 'vue';
interface User {
  user_id: string;
}
interface Topic {
  user_id: string;
}

export const useFollowStore = defineStore('followStore', () => {
  const followUsers = ref<User[]>([]);
  const collectTopics = ref<string[]>([]);
  const historyLists = ref<Topic[]>([]);

  const addFollowUser = (user: any) => {
    followUsers.value.unshift(user);
  }
  const removeFollowUser = (user: any) => {
    followUsers.value = followUsers.value.filter(item => item.user_id !== user.user_id);
  }

  const addCollect = (topicId: string) => {
    collectTopics.value.unshift(topicId);
  }

  const removeCollect = (topicId: string) => {
    collectTopics.value = collectTopics.value.filter(item => item !== topicId);
  }

  
  const addHistory = (topic: any) => {
    historyLists.value.unshift(topic);
  }

  const removeHistory = (topic: object) => {
    historyLists.value = historyLists.value.filter(item => item !== topic);
  }

  return { followUsers, collectTopics, historyLists, addFollowUser, removeFollowUser, addCollect, removeCollect, addHistory, removeHistory }
},{ persist: true }
);
