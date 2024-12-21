import { defineStore } from 'pinia';

interface LinkItem {
  value: string;
}

export const useHeaderStore = defineStore('header', {
  state: () => {
    return {
      switchValue: false,
      userInfoSwitchValue: true,
      timepicker: '',
      searchValue: {},
      searchList: [] as LinkItem[],
      searchSwitchValue: true,
      searchLikesValue: [] as number[],
      searchOrderValue: '',
      docxValue: '',
      qaValue: '',
      journalValue: '',
      detailHeadValue: '',
      projects: [],
      settingVisible: false,
      historyCheckBox: '',
      historyState: false,
      expireDate: '',
    }
  },
  persist: true,
});

