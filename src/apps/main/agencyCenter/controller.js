
const TransferView = require('agencyCenter/views/userTransfer')
const RouterController = require('skeleton/controllers/router')

const LowLevelManageView = require('agencyCenter/views/lowLevelManage')
// const LowLevelRebateView = require('agencyCenter/views/lowLevelManage-rebate')

const LowLevelBettingRecordsView = require('fundCenter/gameRecord/bettingRecords')
// const LowLevelBettingDetailView = require('agencyCenter/views/lowLevelManage-bettingDetail')

// const LowLevelTrackRecordsView = require('userCenter/views/trackRecords')
// const LowLevelTrackDetailView = require('agencyCenter/views/lowLevelManage-trackDetail')

const LowLevelAccountDetailView = require('agencyCenter/views/lowLevelManage-accountDetail')
const LowLevelSendMessageView = require('agencyCenter/views/lowLevelManage-sendMessage')
// const LowLevelTransferView = require('agencyCenter/views/lowLevelManage-transfer')

const LowLevelDetailView = require('agencyCenter/views/lowLevelDetail')

const OpenAccountManageView = require('agencyCenter/views/openAccountManage')
const OpenAccountManagePriceView = require('agencyCenter/views/openAccountManage-price')

const TeamDynamicView = require('agencyCenter/views/teamDynamic')
const ReportManageView = require('agencyCenter/reportManage')
const ProfitAndLossView = require('agencyCenter/profitAndLoss')

const DividendMangeView = require('./dividendManage')
const SignUserView = require('./dividendManage/signUser')

const RedPacketView = require('./redPacket')

const RebateReportView = require('agencyCenter/rebateReport')
const DividendReportView = require('agencyCenter/views/dividendReport')

const teamBettingRecordView = require('agencyCenter/bettingRecord')
const TeamAccountDetailView = require('agencyCenter/teamAccountDetail')

const TeamOverviewView = require('agencyCenter/teamOverview')

const LowLevelGrantView = require('agencyCenter/dividendManage/lowLevelGrant')
const TabView = require('agencyCenter/dividendManage/index-tab')

const sidebar = Global.ui.menu.get('ac')

const AgencyCenterController = RouterController.extend({

  lowLevelManage() {
    this.changeMainReginView(new LowLevelManageView(), {
      main: {
        title: '下级管理',
        titleDes: '',
      },
      sidebar,
    })
  },

  // rebateManage(userId) {
  //   this.changeSubReginView(new LowLevelRebateView({
  //     userId,
  //   }), {
  //     main: {
  //       title: `编辑${_.getUrlParam('name')}的返点`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  lowLevelDetail(userId) {
    this.changeSubReginView(new LowLevelDetailView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的详情`,
      },
      parentRouter: 'ac/llm',
    })
  },

  // bettingRecords(userId) {
  //   this.changeSubReginView(new LowLevelBettingRecordsView({
  //     reqData: {
  //       userId,
  //     },
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的投注记录`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  // bettingDetail(userId, betId) {
  //   this.changeSubReginView(new LowLevelBettingDetailView({
  //     userId,
  //     tradeNo: betId,
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的投注详情`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  // trackRecords(userId) {
  //   this.changeSubReginView(new LowLevelTrackRecordsView({
  //     reqData: {
  //       userId,
  //     },
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的追号记录`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  // trackDetail(userId, tradeNo) {
  //   this.changeSubReginView(new LowLevelTrackDetailView({
  //     userId,
  //     tradeNo,
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的追号详情`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  openAccountManage() {
    this.changeMainReginView(new OpenAccountManageView(), {
      main: {
        title: '开户管理',
        titleDes: '<div class="js-ac-open-limit"></div>',
      },
      sidebar,
    })
  },

  teamBettingRecord() {
    this.changeMainReginView(new teamBettingRecordView({
      triggerTab: 'jsAcBrTr',
      userName: _.getUrlParam('name'),
    }), {
      main: {
        title: '团队投注',
        titleDes: '团队投注记录只保留近30天数据',
      },
      sidebar,
    })
  },

  reportManage() {
    this.changeMainReginView(new ReportManageView(), {
      main: {
        title: '报表查询',
      },
      sidebar,
    })
  },

  profitAndLoss() {
    this.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlSr' }), {
      main: {
        title: '团队盈亏',
        titleDes: '团队盈亏记录只保留近35天数据',
      },
      sidebar,
    })
  },

  ticketProfitAndLoss() {
    this.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlTr' }), {
      main: {
        title: '团队盈亏',
        titleDes: '团队盈亏记录只保留近35天数据',
      },
      sidebar,
    })
  },
  gameProfitAndLoss() {
    this.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlGr' }), {
      main: {
        title: '团队盈亏',
        titleDes: '团队盈亏记录只保留近35天数据',
      },
      sidebar,
    })
  },

  teamDynamic() {
    this.changeMainReginView(new TeamDynamicView(), {
      main: {
        title: '团队动态',
      },
      sidebar,
    })
  },

  // accountDetail(userId) {
  //   this.changeSubReginView(new LowLevelAccountDetailView({
  //     userId,
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的账变记录`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  sendMessage(userId) {
    this.changeSubReginView(new LowLevelSendMessageView({
      userId,
    }), {
      main: {
        title: '发送站内信',
      },
      parentRouter: 'ac/llm',
    })
  },

  // transfer(userId) {
  //   this.changeSubReginView(new LowLevelTransferView({
  //     userId,
  //   }), {
  //     main: {
  //       title: '下级转账',
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  bettingRecords4Report(userId) {
    this.changeSubReginView(new LowLevelBettingRecordsView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的投注记录`,
      },
      parentRouter: 'ac/rm',
    })
  },

  accountDetail4Report(userId) {
    this.changeSubReginView(new LowLevelAccountDetailView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的账变记录`,
      },
      parentRouter: 'ac/rm',
    })
  },
  openAccountManagePrice(ticket) {
    this.changeSubReginView(new OpenAccountManagePriceView({
      triggerTab: ticket,
      rebate: _.getUrlParam('rebate'),
    }), {
      main: {
        title: '奖金详情',
      },
      parentRouter: 'ac/oam',
    })
  },

  dividendManage() {
    this.changeMainReginView(new DividendMangeView(), {
      main: {
        title: '我的分红',
        titleDes: '彩票分红每月1号和16号结算，游戏分红每月1号结算',
      },
      sidebar,
    })
  },

  redPacket() {
    this.changeMainReginView(new RedPacketView(), {
      main: {
        title: '红包查询',
      },
      sidebar,
    })
  },

  rebateReport() {
    this.changeMainReginView(new RebateReportView(), {
      main: {
        title: '返点查询',
        titleDes: '每天派发前一天的返点金额，返点金额 = 我的下级团队当日的有效投注总额 * 我的返点比例',
      },
      sidebar,
    })
  },
  dividendReport() {
    this.changeMainReginView(new DividendReportView(), {
      main: {
        title: '分红查询',
      },
      sidebar,
    })
  },
  directAgentGrant() {
    this.changeMainReginView(new DividendMangeView({ triggerTab: 'jsAcDmDirectAgent' }), {
      main: {
        title: '分红管理',
      },
      sidebar,
      activeMenu: 'ac/dm',
    })
  },
  lowLevelGrant() {
    this.changeMainReginView(new LowLevelGrantView(), {
      main: {
        title: '下级分红',
        titleDes: '彩票分红每月1号和16号结算，游戏分红每月1号结算，若未按时下发给下级平台会强制发放',
      },
      sidebar,
    })
  },
  signUserManage() {
    this.changeMainReginView(new TabView(), {
      main: {
        title: '签约用户',
        titleDes: '<div class="js-ac-sign-user-tip"></div>',
      },
      sidebar,
    })
  },
  signUser() {
    this.changeMainReginView(new TabView(), {
      main: {
        title: '签约用户',
        titleDes: '<div class="js-ac-sign-user-tip"></div>',
      },
      sidebar,
    })
  },
  agreementManagement() {
    const username = _.getUrlParam('username')
    this.changeSubReginView(new SignUserView(), {
      main: {
        title: `${username}的分红协议`,
      },
      sidebar,
      parentRouter: 'ac/dm',
    })
  },
  // gameBettingRecord() {
  //   this.changeMainReginView(new teamBettingRecordView({ triggerTab: 'jsAcBrGr' }), {
  //     main: {
  //       title: '团队投注',
  //       titleDes: '团队投注记录只保留近30天数据',
  //     },
  //     sidebar,
  //   })
  // },
  teamAccountDetail() {
    this.changeMainReginView(new TeamAccountDetailView({
      userName: _.getUrlParam('name') || '',
    }), {
      main: {
        title: '团队账变',
        titleDes: '团队账变记录只保留近30天数据',
      },
      sidebar,
    })
  },

  teamOverview() {
    this.changeMainReginView(new TeamOverviewView(), {
      main: {
        title: '团队总览',
        titleDes: '团队总览记录只保留近30天数据',
      },
      sidebar,
    })
  },
  transfer(userId) {
    this.changeMainReginView(new TransferView({
      userId,
      username: _.getUrlParam('name'),
    }), {
      main: {
        title: '平台转账',
        titleDes: '<div class="js-ac-user-transfer"></div>',
      },
      sidebar,
      activeMenu: 'ac/tr',
    })
  },

})

module.exports = AgencyCenterController
