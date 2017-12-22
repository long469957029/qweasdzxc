'use scrict'

const RouterController = require('skeleton/controllers/router')

const BettingRecordView = require('userCenter/views/bettingRecords')
const BettingDetailView = require('userCenter/views/bettingDetail')

const TrackRecordView = require('userCenter/views/trackRecords')
const TrackDetailView = require('userCenter/views/trackDetail')

const PersonalManageView = require('userCenter/views/personalManage')
const CardManageView = require('userCenter/views/cardManage')
const CardBindingView = require('userCenter/views/cardBinding')
const PriceDetailsView = require('userCenter/views/priceDetails')
const AccountSafeViewInfo = require('userCenter/views/accountSafe')
const MyMessageViewInfo = require('userCenter/views/myMessage')

// const ucMenuConfig = Global.ui.menu.get('uc')
// const gcMenuConfig = Global.ui.menu.get('gc')
const sidebar = Global.ui.menu.get(['fc', 'uc'])

const UserCenterController = RouterController.extend({

  bettingRecords() {
    this.changeMainReginView(new BettingRecordView(), {
      main: {
        // icon: gcMenuConfig.icon,
        title: '投注记录',
      },
      sidebar,
    })
  },

  bettingDetail(tradeNo) {
    this.changeSubReginView(new BettingDetailView({
      tradeNo,
    }), {
      main: {
        title: '投注详情',
      },
      parentRouter: 'gc/tr',
      destroyDiff: false,
    })
  },

  trackRecords() {
    this.changeMainReginView(new TrackRecordView(), {
      main: {
        // icon: gcMenuConfig.icon,
        title: '追号记录',
      },
      sidebar,
    })
  },
  // 追号详情
  trackDetail(tradeNo, chaseFormId) {
    this.changeSubReginView(new TrackDetailView({
      tradeNo,
      chaseFormId,
    }), {
      main: {
        title: '追号详情',
      },
      parentRouter: 'gc/tr',
      destroyDiff: false,
    })
  },
  // 追号详情跳投注记录
  trackBetDetail(chaseFormId, tradeNo) {
    this.changeSubReginView(new BettingDetailView({
      tradeNo,
    }), {
      parentRouter: 'gc/tr',
    })
  },

  personalManage() {
    this.changeMainReginView(new PersonalManageView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '个人资料',
      },
      sidebar,
    })
  },

  cardManage() {
    this.changeMainReginView(new CardManageView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '银行卡管理',
      },
      sidebar,
    })
  },
  cardBinding() {
    this.changeSubReginView(new CardBindingView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '银行卡管理',
      },
      parentRouter: 'uc/cm',
    })
  },

  priceDetails() {
    this.changeMainReginView(new PriceDetailsView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '奖金详情',
      },
      sidebar,
    })
  },
  accountSafe() {
    this.changeMainReginView(new AccountSafeViewInfo(), {
      main: {
        title: '账户安全',
      },
      sidebar,
    })
  },
  myMessage() {
    this.changeMainReginView(new MyMessageViewInfo(), {
      main: {
        title: '我的消息',
      },
      sidebar,
    })
  },
})

module.exports = UserCenterController
