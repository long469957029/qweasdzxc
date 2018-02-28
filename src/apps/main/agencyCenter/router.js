require('./misc/index.scss')

const TransferView = () => import(/* webpackChunkName: "agency-center" */ './views/userTransfer')

const LowLevelManageView = () => import(/* webpackChunkName: "agency-center" */ './views/lowLevelManage')

// const LowLevelBettingRecordsView = () => import(/* webpackChunkName: "agency-center" */ 'fundCenter/gameRecord/bettingRecords')
// const LowLevelAccountDetailView = require('agencyCenter/views/lowLevelManage-accountDetail')

// const LowLevelSendMessageView = require('agencyCenter/views/lowLevelManage-sendMessage')

const LowLevelDetailView = () => import(/* webpackChunkName: "agency-center" */ './views/lowLevelDetail')

const OpenAccountManageView = () => import(/* webpackChunkName: "agency-center" */ './views/openAccountManage')
const OpenAccountManagePriceView = () => import(/* webpackChunkName: "agency-center" */ './views/openAccountManage-price')

// const TeamDynamicView = require('agencyCenter/views/teamDynamic')
const ReportManageView = () => import(/* webpackChunkName: "agency-center" */ './reportManage')
const ProfitAndLossView = () => import(/* webpackChunkName: "agency-center" */ './profitAndLoss')

const AgreementView = () => import(/* webpackChunkName: "agency-center" */ './dividendManage/agreement')
const DividendMangeView = () => import(/* webpackChunkName: "agency-center" */ './dividendManage')
const SignUserView = () => import(/* webpackChunkName: "agency-center" */ './dividendManage/signUser')

const RedPacketView = () => import(/* webpackChunkName: "agency-center" */ './redPacket')

const RebateReportView = () => import(/* webpackChunkName: "agency-center" */ './rebateReport')
const DividendReportView = () => import(/* webpackChunkName: "agency-center" */ './views/dividendReport')

const teamBettingRecordView = () => import(/* webpackChunkName: "agency-center" */ './bettingRecord')
const TeamAccountDetailView = () => import(/* webpackChunkName: "agency-center" */ './teamAccountDetail')

const TeamOverviewView = () => import(/* webpackChunkName: "agency-center" */ './teamOverview')

const LowLevelGrantView = () => import(/* webpackChunkName: "agency-center" */ './dividendManage/lowLevelGrant')
const TabView = () => import(/* webpackChunkName: "agency-center" */ './dividendManage/index-tab')
const DirectAgentView = () => import(/* webpackChunkName: "agency-center" */ './dividendManage/directAgent')

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
    component: function(resolve) {
      RouterController.async(resolve, LowLevelManageView, {
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
    component: function(resolve) {
      RouterController.async(resolve, LowLevelDetailView, {
        userId: store.route.params.userId,
      }, {
        main: {
          title: `查看${_.getUrlParam('name')}的详情`,
        },
        parentRouter: 'ac/llm',
      })
    },
  },
  {
    path: '/ac/tr/:userId',
    component: function(resolve) {
      RouterController.async(resolve, TransferView, {
        userId: $route.params.userId,
        username: _.getUrlParam('name'),
      }, {
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
    component: function(resolve) {
      RouterController.async(resolve, OpenAccountManageView, {
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
    component: function(resolve) {
      RouterController.async(resolve, teamBettingRecordView, {
        triggerTab: 'jsAcBrTr',
        userName: _.getUrlParam('name'),
      }, {
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
    component: function(resolve) {
      RouterController.async(resolve, OpenAccountManagePriceView, {
        triggerTab: $route.params.ticket,
        rebate: _.getUrlParam('rebate'),
      }, {
        main: {
          title: '奖金详情',
          subReturn: true,
        },
        parentRouter: 'ac/oam',
      })
    },
  },
  {
    path: '/ac/rm',
    component: function(resolve) {
      RouterController.async(resolve, ReportManageView, {
        main: {
          title: '报表查询',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/td',
    component: function(resolve) {
      RouterController.async(resolve, ProfitAndLossView, {
        triggerTab: 'jsAcPlSr'
      }, {
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
    component: function(resolve) {
      RouterController.async(resolve, ProfitAndLossView, {
        triggerTab: 'jsAcPlSr'
      },{
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
    component: function(resolve) {
      RouterController.async(resolve, ProfitAndLossView, {
        triggerTab: 'jsAcPlTr'
      }, {
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
    component: function(resolve) {
      RouterController.async(resolve, ProfitAndLossView, {
        triggerTab: 'jsAcPlGr'
      }, {
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
    component: function(resolve) {
      RouterController.async(resolve, RebateReportView, {
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
    component: function(resolve) {
      RouterController.async(resolve, RedPacketView, {
        main: {
          title: '红包查询',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/div',
    component: function(resolve) {
      RouterController.async(resolve, DividendReportView, {
        main: {
          title: '分红查询',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/dm',
    component: function(resolve) {
      RouterController.async(resolve, DividendMangeView, {
        main: {
          title: '我的分红',
          titleDes: Global.memoryCache.get('acctInfo').merchant ? '彩票及游戏分红均于每月1号结算' : '彩票分红每月1日及16日结算，游戏分红每月1日结算',
        },
        sidebar,
        activeMenu: 'ac/dm',
      })
    },
    meta: {
      keepAlive: true,
      subRouter: ['/ac/sum/am']
    }
  },
  {
    path: '/ac/ag',
    component: function(resolve) {
      RouterController.async(resolve, AgreementView, {
        main: {
          title: '我的分红',
          titleDes: '彩票分红每月1号和16号结算，游戏分红每月1号结算',
          subReturn: Global.memoryCache.get('acctInfo').dividendStatus === 1 ? false : true,
        },
        sidebar,
        activeMenu: 'ac/dm',
        parentRouter: 'ac/dm',
      })
    },
  },
  {
    path: '/ac/ld',
    component: function(resolve) {
      RouterController.async(resolve, DirectAgentView, {
        triggerTab: 'jsAcDmDirectAgent'
      }, {
        main: {
          title: '下级直属分红',
        },
        sidebar,
        activeMenu: 'ac/ld',
      })
    },
  },
  {
    path: '/ac/lg',
    component: function(resolve) {
      RouterController.async(resolve, LowLevelGrantView, {
        main: {
          title: '下级分红',
          titleDes: '彩票及游戏分红均于每月1号结算，若未按时下发给下级平台会强制发放',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/sum',
    component: function(resolve) {
      RouterController.async(resolve, TabView, {
        main: {
          title: '签约用户',
          titleDes: '<div class="js-ac-sign-user-tip"></div>',
        },
        sidebar,
      })
    },
    meta: {
      keepAlive: true,
      subRouter: ['/ac/sum/am']
    }
  },
  {
    path: '/ac/su',
    component: function(resolve) {
      RouterController.async(resolve, TabView, {
        main: {
          title: '签约用户',
          titleDes: '<div class="js-ac-sign-user-tip"></div>',
        },
        sidebar,
      })
    },
  },
  {
    path: '/ac/sum/am',
    component: function(resolve) {
      const username = _.getUrlParam('username')

      RouterController.async(resolve, SignUserView, {
        main: {
          title: `${username}的分红协议`,
          subReturn: true,
        },
        sidebar,
        parentRouter: 'ac/sum',
      })
    },
  },
  {
    path: '/ac/tad',
    component: function(resolve) {
      RouterController.async(resolve, TeamAccountDetailView, {
        userName: _.getUrlParam('name') || '',
      }, {
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
    component: function(resolve) {
      RouterController.async(resolve, TeamOverviewView, {
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
    component: function(resolve) {
      RouterController.async(resolve, TransferView, {
        username: _.getUrlParam('name'),
      }, {
        main: {
          title: '平台转账',
          titleDes: '<div class="js-ac-user-transfer"></div>',
        },
        sidebar,
        activeMenu: 'ac/tr',
      })
    },
    beforeEnter: (to, from, next) => {
      const preStatus = window.Global.cookieCache.get('security')
      if(preStatus === 1 || preStatus === 2){
        next()
      }else{
        next(from)
        $(document).securityTip({
          content: '资金密码未设置，请先设置资金密码后再转账',
          hasMoneyPwd: false,
          hasBankCard: false,
          showBankCard: false,
        })
      }
    }
  },
]
