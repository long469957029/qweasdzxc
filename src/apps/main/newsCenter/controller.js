'use script'

require('./misc/index.scss')

const RouterController = require('skeleton/controllers/router')

const PlatformNewsView = require('newsCenter/views/platformNews')
const PlatformNewsDetailView = require('newsCenter/views/platformNewsDetail')
const PlatformNewsSettingView = require('newsCenter/views/platformNewsSetting')
const InsideLetterDetailView = require('newsCenter/views/insideLetterDetail')
const InsideLetterSendView = require('newsCenter/views/insideLetterSend')


const NewsCenterController = RouterController.extend({

  platformNews() {
    this.changeMainReginView(new PlatformNewsView(), {
      main: {
        title: '消息中心',
      },
    })
  },

  platformNewsDetail(noticeId) {
    this.changeMainReginView(new PlatformNewsDetailView({
      noticeId,
    }), {
      main: {
        title: '消息中心',
        subReturn: true,
      },
      parentRouter: 'nc/pn',
    })
  },

  platformNewsSetting() {
    this.changeMainReginView(new PlatformNewsSettingView(), {
      main: {
        title: '通知设置',
        subReturn: true,
      },
      parentRouter: 'nc/pn',
    })
  },

  insideLetter() {
    this.changeMainReginView(new PlatformNewsView({
      triggerTab: 'insideLetter',
    }), {
      main: {
        title: '消息中心',
      },
    })
  },

  insideLetterDetail(titleId, letterId) {
    this.changeMainReginView(new InsideLetterDetailView({
      titleId,
      letterId,
    }), {
      main: {
        title: '消息中心',
        subReturn: true,
      },
      parentRouter: 'nc/il',
    })
  },

  insideLetterSend() {
    this.changeMainReginView(new InsideLetterSendView(), {
      main: {
        title: '发送站内信',
        subReturn: true,
      },
      parentRouter: 'nc/il',
    })
  },
})

module.exports = NewsCenterController
