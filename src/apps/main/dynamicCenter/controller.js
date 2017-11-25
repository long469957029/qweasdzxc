'use script'

require('./misc/index.scss')

const RouterController = require('skeleton/controllers/router')

const NoticeBoardView = require('dynamicCenter/views/noticeBoard')
const NoticeDetailView = require('dynamicCenter/views/noticeDetail')

const DynamicCenterController = RouterController.extend({

  noticeBoard() {
    this.changeMainReginView(new NoticeBoardView(), {
      main: {
        title: '平台动态',
      },
    })
  },

  noticeDetail(noticeId) {
    this.changeMainReginView(new NoticeDetailView({
      noticeId,
    }), {
      main: {
        title: '平台动态',
        subReturn: true,
      },
      parentRouter: 'nc/nb',
    })
  },

})

module.exports = DynamicCenterController
