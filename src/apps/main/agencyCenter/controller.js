

const RouterController = require('skeleton/controllers/router')

const LowLevelManageView = require('agencyCenter/views/lowLevelManage')
const LowLevelRebateView = require('agencyCenter/views/lowLevelManage-rebate')

const LowLevelBettingRecordsView = require('userCenter/views/bettingRecords')
const LowLevelBettingDetailView = require('agencyCenter/views/lowLevelManage-bettingDetail')

const LowLevelTrackRecordsView = require('userCenter/views/trackRecords')
const LowLevelTrackDetailView = require('agencyCenter/views/lowLevelManage-trackDetail')

const LowLevelAccountDetailView = require('agencyCenter/views/lowLevelManage-accountDetail')
const LowLevelSendMessageView = require('agencyCenter/views/lowLevelManage-sendMessage')
const LowLevelTransferView = require('agencyCenter/views/lowLevelManage-transfer')

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


const AgencyCenterController = RouterController.extend({

  lowLevelManage() {
    this.changeMainReginView(new LowLevelManageView(), {
      main: {
        title: '团队管理',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  rebateManage(userId) {
    this.changeSubReginView(new LowLevelRebateView({
      userId,
    }), {
      main: {
        title: `编辑${_.getUrlParam('name')}的返点`,
      },
      parentRouter: 'ac/llm',
    })
  },

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

  bettingRecords(userId) {
    this.changeSubReginView(new LowLevelBettingRecordsView({
      reqData: {
        userId,
      },
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的投注记录`,
      },
      parentRouter: 'ac/llm',
    })
  },

  bettingDetail(userId, betId) {
    this.changeSubReginView(new LowLevelBettingDetailView({
      userId,
      tradeNo: betId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的投注详情`,
      },
      parentRouter: 'ac/llm',
    })
  },

  trackRecords(userId) {
    this.changeSubReginView(new LowLevelTrackRecordsView({
      reqData: {
        userId,
      },
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的追号记录`,
      },
      parentRouter: 'ac/llm',
    })
  },

  trackDetail(userId, tradeNo) {
    this.changeSubReginView(new LowLevelTrackDetailView({
      userId,
      tradeNo,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的追号详情`,
      },
      parentRouter: 'ac/llm',
    })
  },

  openAccountManage() {
    this.changeMainReginView(new OpenAccountManageView(), {
      main: {
        title: '开户管理',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  teamBettingRecord() {
    this.changeMainReginView(new teamBettingRecordView({ triggerTab: 'jsAcBrTr' }), {
      main: {
        title: '团队投注',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  reportManage() {
    this.changeMainReginView(new ReportManageView(), {
      main: {
        title: '报表查询',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  profitAndLoss() {
    this.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlSr' }), {
      main: {
        title: '团队盈亏',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  ticketProfitAndLoss() {
    this.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlTr' }), {
      main: {
        title: '团队盈亏',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },
  gameProfitAndLoss() {
    this.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlGr' }), {
      main: {
        title: '团队盈亏',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  teamDynamic() {
    this.changeMainReginView(new TeamDynamicView(), {
      main: {
        title: '团队动态',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  accountDetail(userId) {
    this.changeSubReginView(new LowLevelAccountDetailView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的账变记录`,
      },
      parentRouter: 'ac/llm',
    })
  },

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

  transfer(userId) {
    this.changeSubReginView(new LowLevelTransferView({
      userId,
    }), {
      main: {
        title: '下级转账',
      },
      parentRouter: 'ac/llm',
    })
  },

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
        title: '分红管理',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  redPacket() {
    this.changeMainReginView(new RedPacketView(), {
      main: {
        title: '红包查询',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  rebateReport() {
    this.changeMainReginView(new RebateReportView(), {
      main: {
        title: '返点查询',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },
  dividendReport() {
    this.changeMainReginView(new DividendReportView(), {
      main: {
        title: '分红查询',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },
  directAgentGrant() {
    this.changeMainReginView(new DividendMangeView({ triggerTab: 'jsAcDmDirectAgent' }), {
      main: {
        title: '分红管理',
      },
      sidebar: Global.ui.menu.get('ac'),
      activeMenu: 'ac/dm',
    })
  },
  lowLevelGrant() {
    this.changeMainReginView(new DividendMangeView({ triggerTab: 'jsAcDmLowLevelGrant' }), {
      main: {
        title: '分红管理',
      },
      sidebar: Global.ui.menu.get('ac'),
      activeMenu: 'ac/dm',
    })
  },
  signUserManage() {
    this.changeMainReginView(new DividendMangeView({ triggerTab: 'jsAcDmUserManage' }), {
      main: {
        title: '分红管理',
      },
      sidebar: Global.ui.menu.get('ac'),
      activeMenu: 'ac/dm',
    })
  },
  signUser() {
    this.changeMainReginView(new DividendMangeView({ triggerTab: 'jsAcDmSignUser' }), {
      main: {
        title: '分红管理',
      },
      sidebar: Global.ui.menu.get('ac'),
      activeMenu: 'ac/dm',
    })
  },
  agreementManagement() {
    const username = _.getUrlParam('username')
    this.changeSubReginView(new SignUserView(), {
      main: {
        title: `${username}的分红协议`,
      },
      sidebar: Global.ui.menu.get('ac'),
      parentRouter: 'ac/dm',
    })
  },
  gameBettingRecord() {
    this.changeMainReginView(new teamBettingRecordView({ triggerTab: 'jsAcBrGr' }), {
      main: {
        title: '团队投注',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },
  teamAccountDetail() {
    this.changeMainReginView(new TeamAccountDetailView(), {
      main: {
        title: '团队账变',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },

  teamOverview() {
    this.changeMainReginView(new TeamOverviewView(), {
      main: {
        title: '团队总览',
      },
      sidebar: Global.ui.menu.get('ac'),
    })
  },


})

module.exports = AgencyCenterController
