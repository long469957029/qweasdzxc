require('./misc/index.scss')

const PlatformNewsView = require('newsCenter/views/platformNews')
const PlatformNewsDetailView = require('newsCenter/views/platformNewsDetail')
const PlatformNewsSettingView = require('newsCenter/views/platformNewsSetting')
const InsideLetterDetailView = require('newsCenter/views/insideLetterDetail')
const InsideLetterSendView = require('newsCenter/views/insideLetterSend')


export default [
  {
    path: '/nc/pn',
    component: function() {
      RouterController.changeMainReginView(new PlatformNewsView(), {
        main: {
          title: '消息中心',
        },
      })
    },
  },
  {
    path: '/nc/pn/detail/:noticeId',
    component: function() {
      RouterController.changeMainReginView(new PlatformNewsDetailView({
        noticeId: $route.params.noticeId,
      }), {
        main: {
          title: '消息中心',
          subReturn: true,
        },
        parentRouter: 'nc/pn',
      })
    },
  },
  {
    path: '/nc/pn/setting',
    component: function() {
      RouterController.changeMainReginView(new PlatformNewsSettingView(), {
        main: {
          title: '通知设置',
          subReturn: true,
        },
        parentRouter: 'nc/pn',
      })
    },
  },
  {
    path: '/nc/il',
    component: function() {
      RouterController.changeMainReginView(new PlatformNewsView({
        triggerTab: 'insideLetter',
      }), {
        main: {
          title: '消息中心',
        },
      })
    },
  },
  {
    path: '/nc/il/detail/:titleId/:letterId',
    component: function() {
      RouterController.changeMainReginView(new InsideLetterDetailView({
        titleId: $route.params.titleId,
        letterId: $route.params.letterId,
      }), {
        main: {
          title: '消息中心',
          subReturn: true,
        },
        parentRouter: 'nc/il',
      })
    },
  },
  {
    path: '/nc/il/send',
    component: function() {
      RouterController.changeMainReginView(new InsideLetterSendView(), {
        main: {
          title: '发送站内信',
          subReturn: true,
        },
        parentRouter: 'nc/il',
      })
    },
  },
]
