
import DashboardView from './dashboard.vue'

// const NoticeDetailView = require('dynamicCenter/views/noticeDetail')

export default [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: ':anything',
    redirect: {
      name: 'dashboard',
    }
  },
  {
    path: '*',
    redirect: {
      name: 'dashboard',
    }
  }
]
