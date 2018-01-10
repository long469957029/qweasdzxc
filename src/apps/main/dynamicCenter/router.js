const NoticeBoardView = () => import(/* webpackChunkName: "dynamic-center" */ './views/noticeBoard')
const NoticeDetailView = () => import(/* webpackChunkName: "dynamic-center" */ './views/noticeDetail')

require('./misc/index.scss')


export default [
  {
    path: '/nc/nb',
    component: function(resolve) {
      RouterController.async(resolve, NoticeBoardView, {
        main: {
          title: '平台动态',
        },
      })
    },
  },
  {
    path: '/nc/nb/detail/:noticeId',
    component: function(resolve) {
      RouterController.async(resolve, NoticeDetailView, {
        noticeId: $route.params.noticeId,
      }, {
        main: {
          title: '平台动态',
          subReturn: true,
        },
        parentRouter: 'nc/nb',
      })
    },
  },
]
