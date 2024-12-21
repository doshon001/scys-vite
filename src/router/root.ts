export const roots = [
  {
    path: '/activate',
    name: 'activate',
    meta: {
      title: '激活',
    },
    props: true,
    component: () => import('/@/views/activate/index.vue'),
  },
  {
    path: '/topicIndex',
    name: 'topicIndex',
    meta: {
      title: '首页',
    },
    props: true,
    component: () => import('/@/views/index.vue'),
  },
  {
    path: '/topicInfo/:topic_id',
    name: 'topicInfo',
    meta: {
      title: '主题页',
    },
    props: true,
    component: () => import('/@/views/topicInfo/index.vue'),
  },
  {
    path: '/userArticles/user_id/:user_id/name/:name',
    name: 'userArticles',
    meta: {
      title: '用户页',
    },
    props: true,
    component: () => import('/@/views/userArticles/index.vue'),
  },
  {
    path: '/hashArticles/hid/:hid/title/:title',
    name: 'hashArticles',
    meta: {
      title: '标签页',
    },
    props: true,
    component: () => import('/@/views/hashArticles/index.vue'),
  },
  {
    path: '/article/:article_id',
    name: 'article',
    meta: {
      title: '文章页',
    },
    props: true,
    component: () => import('/@/views/article/index.vue'),
  },
  {
    path: '/collection/:collection_id',
    name: 'collection',
    meta: {
      title: '集合页',
    },
    props: true,
    component: () => import('/@/views/collection/index.vue'),
  },
  {
    path: '/search',
    name: 'search',
    meta: {
      title: '搜索页',
    },
    props: true,
    component: () => import('/@/views/search/index.vue'),
  },
  {
    path: '/search/:word',
    name: 'searchWord',
    meta: {
      title: '搜索页',
    },
    props: true,
    component: () => import('/@/views/search/index.vue'),
  },
  {
    path: '/voyagesearch',
    name: 'voyagesearch',
    meta: {
      title: '航海搜索页',
    },
    props: true,
    component: () => import('/@/views/search/voyage.vue'),
  },
  {
    path: '/qa/:qid',
    name: 'qa',
    meta: {
      title: '百问百答',
    },
    props: true,
    component: () => import('/@/views/voyage/qa.vue'),
  },
  {
    path: '/journal/:qid',
    name: 'journal',
    meta: {
      title: '精选日志',
    },
    props: true,
    component: () => import('/@/views/voyage/journal.vue'),
  },
  {
    path: '/docx/:docId',
    name: 'docx',
    meta: {
      title: '航海资料',
    },
    props: true,
    component: () => import('/@/views/voyage/docx.vue'),
  },
  {
    path: '/latestPractice',
    name: 'latestPractice',
    meta: {
      title: '最新实战',
    },
    props: true,
    component: () => import('/@/views/voyage/latestPractice.vue'),
  },
  {
    path: '/historyPractice',
    name: 'historyPractice',
    meta: {
      title: '往期实战',
    },
    props: true,
    component: () => import('/@/views/voyage/historyPractice.vue'),
  },
  {
    path: '/follow',
    name: 'follow',
    meta: {
      title: '关注',
    },
    props: true,
    component: () => import('/@/views/header/follow.vue'),
  },
  {
    path: '/collect',
    name: 'collect',
    meta: {
      title: '收藏',
    },
    props: true,
    component: () => import('/@/views/header/collect.vue'),
  },
  {
    path: '/history',
    name: 'history',
    meta: {
      title: '历史',
    },
    props: true,
    component: () => import('/@/views/header/history.vue'),
  },
  {
    path: '/activityDetail/:id',
    name: 'activity',
    meta: {
      title: '实战活动',
    },
    props: true,
    component: () => import('/@/views/voyage/activity.vue'),
  },
  {
    path: '/veteranShares/:id',
    name: 'veteranShares',
    meta: {
      title: '高手分享',
    },
    props: true,
    component: () => import('/@/views/voyage/veteranShares.vue'),
  },
  {
    path: '/qas/:activity_id',
    name: 'qas',
    meta: {
      title: '百问百答',
    },
    props: true,
    component: () => import('/@/views/voyage/qas.vue'),
  },
  {
    path: '/journals/:activity_id',
    name: 'journals',
    meta: {
      title: '船员好事',
    },
    props: true,
    component: () => import('/@/views/voyage/journals.vue'),
  },
  {
    path: '/activity/:resource_id',
    name: 'knowResource',
    meta: {
      title: '生财思维课',
    },
    props: true,
    component: () => import('/@/views/header/knowResource.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    meta: {
      title: '项目库',
    },
    props: true,
    component: () => import('/@/views/header/projects.vue'),
  },
  {
    path: '/project/:project',
    name: 'project',
    meta: {
      title: '项目',
    },
    props: true,
    component: () => import('/@/views/header/project.vue'),
  },
  {
    path: '/knowledgebase',
    name: 'knowledgebase',
    meta: {
      title: '知识库',
    },
    props: true,
    component: () => import('/@/views/header/knowledgebase.vue'),
  },
  {
    path: '/qunxiangcourses',
    name: 'qunxiangcourses',
    meta: {
      title: '群响课程',
    },
    props: true,
    component: () => import('/@/views/header/qunXiangCourses.vue'),
  },
  {
    path: '/qunxiang/:id',
    name: 'qunxiang',
    meta: {
      title: '群响课程',
    },
    props: true,
    component: () => import('/@/views/header/qunXiang.vue'),
  },
  {
    path: '/columns',
    name: 'columns',
    meta: {
      title: '合集',
    },
    props: true,
    component: () => import('/@/views/header/columns.vue'),
  },
  {
    path: '/collections/:cid',
    name: 'collections',
    meta: {
      title: '合集',
    },
    props: true,
    component: () => import('/@/views/header/collection.vue'),
  },
  {
    path: '/hotwords',
    name: 'hotwords',
    meta: {
      title: '热搜词',
    },
    props: true,
    component: () => import('/@/views/header/hotwords.vue'),
  },
  {
    path: '/questions',
    name: 'questions',
    meta: {
      title: '问答',
    },
    props: true,
    component: () => import('/@/views/header/questions.vue'),
  },
  {
    path: '/tasks',
    name: 'tasks',
    meta: {
      title: '作业',
    },
    props: true,
    component: () => import('/@/views/header/tasks.vue'),
  },
];
