

const RouterController = require('skeleton/controllers/router')

const DashboardView = require('dashboard/views/dashboard')

const NoticeDetailView = require('dynamicCenter/views/noticeDetail')

const DashboardController = RouterController.extend({

  dashboard() {
    Base.log('路由 -> 概览')
    this.changeMainReginView(new DashboardView())
  },

  noticeDetail(noticeId) {
    this.changeMainReginView(new NoticeDetailView({
      noticeId,
    }), {
      main: {
        title: '平台动态',
        subReturn: true,
      },
      parentRouter: '#',
    })
  },

})

module.exports = DashboardController
