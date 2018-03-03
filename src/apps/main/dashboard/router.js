
import DashboardView from './dashboard.vue'

// const NoticeDetailView = require('dynamicCenter/views/noticeDetail')

export default [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
  },
  // {
  //   path: '/nb/detail/:noticeId',
  //   component() {
  //     RouterController.changeMainReginView(new NoticeDetailView({
  //       noticeId: store.state.route.params.noticeId,
  //     }), {
  //       main: {
  //         title: '平台动态',
  //         subReturn: true,
  //       },
  //       parentRouter: '#',
  //     })
  //   }
  // },
  {
    path: ':anything',
    component: DashboardView,
    redirect: to => {
      $('#main').toggle(false)
      $('#main-vue').toggle(true)
      return to
    }
  },
  {
    path: '*',
    component: DashboardView,
    redirect: to => {
      $('#main').toggle(false)
      $('#main-vue').toggle(true)
      return to
    }
  }
]
