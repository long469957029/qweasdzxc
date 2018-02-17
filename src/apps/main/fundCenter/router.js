
const AccountDetailsView = () => import(/* webpackChunkName: "fund-center" */ './accountDetail')
const FundRecordsView = () => import(/* webpackChunkName: "fund-center" */ './record')
const FundManageView = () => import(/* webpackChunkName: "fund-center" */ './fundManage')
const RebateRecordsView = () => import(/* webpackChunkName: "fund-center" */ './rebateRecord')
const RechargeView = () => import(/* webpackChunkName: "fund-center" */ './recharge')
const WithdrawView = () => import(/* webpackChunkName: "fund-center" */ './withdraw')
const GameRecordView = () => import(/* webpackChunkName: "fund-center" */ './gameRecord/index')
const BetDetailView = () => import(/* webpackChunkName: "fund-center" */ './gameRecord/betDetail')
const ChaseDetailView = () => import(/* webpackChunkName: "fund-center" */ './gameRecord/chaseDetail')

require('./misc/index.scss')

const menuConfig = Global.ui.menu.get('uc')
const sidebar = Global.ui.menu.get('uc')


  // // 'fc/tr/detail/:betId': 'bettingDetail', // 投注详情
  // // 'fc/cr/detail/:tradeNo/id/:chaseFormId': 'trackDetail', // 追号记录
  // // 'fc/cr/detail/:chaseTradeNo/detail/:tradeNo': 'trackBetDetail', // 追号投注记录

// 0是代理，1是玩家，玩家不显示平台转账
//TODO 暂时隐藏 权限相关不应该在此处处理
// const acctInfo = Global.memoryCache.get('acctInfo')
// if (acctInfo.userType === 1) {
//   delete fundRouter['fc/pt']
// }

export default [
  {
    path: '/fc/fm',
    component: function(resolve) {
      RouterController.async(resolve, FundManageView, {
        sidebar,
        activeMenu: 'fc/fm',
      })
    },
  },
  {
    path: '/fc/re',
    component: function(resolve) {
      RouterController.async(resolve, RechargeView, {
        main: {
          title: '在线充值',
          titleDes: '',
        },
        sidebar,
        // activeMenu: 'fc/fm'
      })
    },
  },
  {
    path: '/fc/wd',
    component: function(resolve) {
      RouterController.async(resolve, FundRecordsView,{
        triggerTab: 'record-withdraw'
      }, {
        main: {
          title: '充提记录',
          titleDes: '充提记录只保留30天数据。',
        },
        sidebar,
        activeMenu: '/fc/rd'
      })
    },
  },
  {
    path: '/fc/ad',
    component: function(resolve) {
      RouterController.async(resolve, AccountDetailsView, {
        triggerTab: 'jsFcMdCenter'
      }, {
        main: {
          title: '帐变明细',
          titleDes: '帐变明细只保留30天数据。',
        },
        sidebar,
      })
    },
  },
  {
    path: '/fc/rd',
    component: function(resolve) {
      RouterController.async(resolve, FundRecordsView, {
        main: {
          title: '充提记录',
          titleDes: '充提记录只保留30天数据。',
        },
        sidebar,
      })
    },
  },
  {
    path: '/fc/rb',
    component: function(resolve) {
      RouterController.async(resolve, RebateRecordsView, {
        main: {
          title: '返水记录',
        },
        sidebar,
      })
    },
  },
  {
    path: '/fc/td',
    component: function(resolve) {
      RouterController.async(resolve, GameRecordView, {
        triggerTab: 'jsGcGrTr'
      }, {
        main: {
          title: '投注记录',
          titleDes: '投注记录只保留30天记录。',
        },
        sidebar: menuConfig,
      })
    },
  },
  {
    path: '/fc/cr',
    component: function(resolve) {
      RouterController.async(resolve, GameRecordView, {
        triggerTab: 'jsGcGrCr'
      }, {
        main: {
          icon: menuConfig.icon,
          title: '追号记录',
        },
        sidebar: menuConfig,
      })
    },
  },
  {
    path: '/fc/gr',
    component: function(resolve) {
      RouterController.async(resolve, GameRecordView, {
        triggerTab: 'jsGcGrGr'
      }, {
        main: {
          icon: menuConfig.icon,
          title: '游戏记录',
        },
        sidebar: menuConfig,
      })
    },
  },
  {
    path: '/fc/bd',
    component: function(resolve) {
      RouterController.async(resolve, BetDetailView)
    },
  },
  {
    path: '/fc/cd',
    component: function(resolve) {
      RouterController.async(resolve, ChaseDetailView)
    },
  },
]
