const NoticeBoardView = require('dynamicCenter/views/noticeBoard')
const NoticeDetailView = require('dynamicCenter/views/noticeDetail')

require('./misc/index.scss')


export default [
  {
    path: '/nc/nb',
    component: function() {
      RouterController.changeMainReginView(new NoticeBoardView(), {
        main: {
          title: '平台动态',
        },
      })
    },
  },
  {
    path: '/nc/nb/detail/:noticeId',
    component: function() {
      RouterController.changeMainReginView(new NoticeDetailView({
        noticeId: $route.params.noticeId,
      }), {
        main: {
          title: '平台动态',
          subReturn: true,
        },
        parentRouter: 'nc/nb',
      })
    },
  },
]
