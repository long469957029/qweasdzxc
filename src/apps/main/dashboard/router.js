
import DashboardView from './dashboard.vue'

const NoticeDetailView = require('dynamicCenter/views/noticeDetail')

const Init = {
  template: `<div></div>`
}
// '': 'dashboard', // 概览
//   ':anything': 'dashboard', // 概览
//   'nb/detail/:noticeId': 'noticeDetail', // 公告详情
export default [
  {
    path: '/',
    // component() {
    //   RouterController.changeMainReginView(new DashboardView())
    // }
    component: DashboardView,
  },
  {
    path: '/nb/detail/:noticeId',
    component() {
      RouterController.changeMainReginView(new NoticeDetailView({
        noticeId: $route.params.noticeId,
      }), {
        main: {
          title: '平台动态',
          subReturn: true,
        },
        parentRouter: '#',
      })
    }
  },
  {
    path: '/i',
    component: Init,
  },
  {
    path: '*',
    component() {
      RouterController.changeMainReginView(new DashboardView())
    }
  }
]
