require('./misc/index.scss')

const TransferView = require('agencyCenter/views/userTransfer')

const LowLevelManageView = require('agencyCenter/views/lowLevelManage')

const LowLevelBettingRecordsView = require('fundCenter/gameRecord/bettingRecords')

const LowLevelAccountDetailView = require('agencyCenter/views/lowLevelManage-accountDetail')
// const LowLevelSendMessageView = require('agencyCenter/views/lowLevelManage-sendMessage')

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

    // 'ac/llm': 'lowLevelManage', // 下级管理
    // // 'ac/llm/rebate/:userId': 'rebateManage', // 升点(返点)管理
    //
    // 'ac/llm/detail/:userId': 'lowLevelDetail', // 下级管理详情
    //
    // 'ac/llm/message/:userId': 'sendMessage', // 发消息
    // 'ac/tr/:userId': 'transfer', // 转账
    // 'ac/oam': 'openAccountManage', // 开户
    //
    // 'ac/tbr': 'teamBettingRecord', // 团队投注记录-ticket
    // // 'ac/gbr': 'gameBettingRecord', // 团队投注记录-game
    //
    // 'ac/oam/pd/:ticket': 'openAccountManagePrice',
    // 'ac/rm': 'reportManage', // 报表查询
    // // 'ac/rm/betting/:userId': 'bettingRecords4Report', // 账变
    // 'ac/td': 'teamDynamic',
    //
    // 'ac/spl': 'profitAndLoss', // 盈亏报表--total
    // 'ac/pl': 'ticketProfitAndLoss', // 盈亏报表--ticket
    // 'ac/gpl': 'gameProfitAndLoss', // 盈亏报表--game
    //
    //
    // // 'ac/betting/:userId': 'bettingRecords', // 投注
    // // 'ac/track/:userId': 'trackRecords', // 追号
    // // 'ac/account/:userId': 'accountDetail', // 账变
    // // 'ac/betting/:userId/detail/:betId': 'bettingDetail', // 投注详情
    // // 'ac/track/:userId/detail/:tradeNo': 'trackDetail', // 追号详情
    //
    //
    // 'ac/rp': 'redPacket', // 红包查询
    //
    // 'ac/reb': 'rebateReport', // 返点查询
    // 'ac/div': 'dividendReport', // 分红查询
    //
    // 'ac/dm': 'dividendManage', // 分红管理
    // 'ac/ld': 'directAgentGrant', // 下级分红发放
    // 'ac/lg': 'lowLevelGrant', // 下级分红发放
    // 'ac/sum': 'signUserManage', // 签约用户管理
    // 'ac/su': 'signUser', // 签约用户
    // 'ac/am': 'agreementManagement', // 签约信息管理，查看，签约，修改


    // 'ac/tad': 'teamAccountDetail', // 账变
    // 'ac/to': 'teamOverview', // 账变
    // 'ac/tr': 'transfer', // 资金管理-转账

export default [
  {
    path: '/ac/llm',
    component: function() {
      RouterController.changeMainReginView(new LowLevelManageView(), {
        main: {
          title: '下级管理',
          titleDes: '',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/llm/detail/:userId',
    component: function() {

      RouterController.changeSubReginView(new LowLevelDetailView({
        userId: $route.params.userId,
      }), {
        main: {
          title: `查看${_.getUrlParam('name')}的详情`,
        },
        parentRouter: 'ac/llm',
      })
    },
  },
  {
    path: '/ac/tr/:userId',
    component: function() {

      RouterController.changeMainReginView(new TransferView({
        userId: $route.params.userId,
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
  },
  {
    path: '/ac/oam',
    component: function() {
      RouterController.changeMainReginView(new OpenAccountManageView(), {
        main: {
          title: '开户管理',
          titleDes: '<div class="js-ac-open-limit"></div>',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/tbr',
    component: function() {
      RouterController.changeMainReginView(new teamBettingRecordView({
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
  },
  {
    path: '/ac/oam/pd/:ticket',
    component: function() {
      RouterController.changeSubReginView(new OpenAccountManagePriceView({
        triggerTab: $route.params.ticket,
        rebate: _.getUrlParam('rebate'),
      }), {
        main: {
          title: '奖金详情',
        },
        parentRouter: 'ac/oam',
      })
    },
  },
  {
    path: '/ac/rm',
    component: function() {
      RouterController.changeMainReginView(new ReportManageView(), {
        main: {
          title: '报表查询',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/td',
    component: function() {
      RouterController.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlSr' }), {
        main: {
          title: '团队盈亏',
          titleDes: '团队盈亏记录只保留近35天数据',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/spl',
    component: function() {
      RouterController.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlSr' }), {
        main: {
          title: '团队盈亏',
          titleDes: '团队盈亏记录只保留近35天数据',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/pl',
    component: function() {
      RouterController.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlTr' }), {
        main: {
          title: '团队盈亏',
          titleDes: '团队盈亏记录只保留近35天数据',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/gpl',
    component: function() {
      RouterController.changeMainReginView(new ProfitAndLossView({ triggerTab: 'jsAcPlGr' }), {
        main: {
          title: '团队盈亏',
          titleDes: '团队盈亏记录只保留近35天数据',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/reb',
    component: function() {
      RouterController.changeMainReginView(new RebateReportView(), {
        main: {
          title: '返点查询',
          titleDes: '每天派发前一天的返点金额，返点金额 = 我的下级团队当日的有效投注总额 * 我的返点比例',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/rp',
    component: function() {
      RouterController.changeMainReginView(new RedPacketView(), {
        main: {
          title: '红包查询',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/div',
    component: function() {
      RouterController.changeMainReginView(new DividendReportView(), {
        main: {
          title: '分红查询',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/dm',
    component: function() {
      RouterController.changeMainReginView(new DividendMangeView(), {
        main: {
          title: '我的分红',
          titleDes: '彩票分红每月1号和16号结算，游戏分红每月1号结算',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/ld',
    component: function() {
      RouterController.changeMainReginView(new DividendMangeView({ triggerTab: 'jsAcDmDirectAgent' }), {
        main: {
          title: '分红管理',
        },
        sidebar,
        activeMenu: 'ac/dm',
      })
    },
  },
  {
    path: '/ac/lg',
    component: function() {
      RouterController.changeMainReginView(new LowLevelGrantView(), {
        main: {
          title: '下级分红',
          titleDes: '彩票分红每月1号和16号结算，游戏分红每月1号结算，若未按时下发给下级平台会强制发放',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/sum',
    component: function() {
      RouterController.changeMainReginView(new TabView(), {
        main: {
          title: '签约用户',
          titleDes: '<div class="js-ac-sign-user-tip"></div>',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/su',
    component: function() {
      RouterController.changeMainReginView(new TabView(), {
        main: {
          title: '签约用户',
          titleDes: '<div class="js-ac-sign-user-tip"></div>',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/am',
    component: function() {
      const username = _.getUrlParam('username')
      RouterController.changeSubReginView(new SignUserView(), {
        main: {
          title: `${username}的分红协议`,
        },
        sidebar,
        parentRouter: 'ac/dm',
      })
    },
  },
  {
    path: '/ac/tad',
    component: function() {
      RouterController.changeMainReginView(new TeamAccountDetailView({
        userName: _.getUrlParam('name') || '',
      }), {
        main: {
          title: '团队账变',
          titleDes: '团队账变记录只保留近30天数据',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/to',
    component: function() {
      RouterController.changeMainReginView(new TeamOverviewView(), {
        main: {
          title: '团队总览',
          titleDes: '团队总览记录只保留近30天数据',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/tr',
    component: function() {
      RouterController.changeMainReginView(new TransferView({
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
  },
]
