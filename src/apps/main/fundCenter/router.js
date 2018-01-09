import AccountDetailsView from 'fundCenter/accountDetail'
import FundRecordsView from 'fundCenter/record'
import FundManageView from 'fundCenter/fundManage'
import RebateRecordsView from 'fundCenter/rebateRecord'
import RechargeView from 'fundCenter/recharge'
import WithdrawView from 'fundCenter/withdraw'
const GameRecordView = require('fundCenter/gameRecord/index')
const BetDetailView = require('fundCenter/gameRecord/betDetail')
const ChaseDetailView = require('fundCenter/gameRecord/chaseDetail')

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
    component: function() {
      RouterController.changeMainReginView(new FundManageView(), {
        sidebar,
        activeMenu: 'fc/fm',
      })
    },
  },
  {
    path: '/fc/re',
    component: function() {
      RouterController.changeMainReginView(new RechargeView(), {
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
    component: function() {
      RouterController.changeMainReginView(new WithdrawView(), {
        main: {
          title: '在线提现',
        },
        sidebar,
        // activeMenu: 'fc/fm'
      })
    },
  },
  {
    path: '/fc/ad',
    component: function() {
      RouterController.changeMainReginView(new AccountDetailsView({ triggerTab: 'jsFcMdCenter' }), {
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
    component: function() {
      RouterController.changeMainReginView(new FundRecordsView(), {
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
    component: function() {
      RouterController.changeMainReginView(new RebateRecordsView(), {
        main: {
          title: '返水记录',
        },
        sidebar,
      })
    },
  },
  {
    path: '/fc/td',
    component: function() {
      RouterController.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrTr' }), {
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
    component: function() {
      RouterController.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrCr' }), {
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
    component: function() {
      RouterController.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrGr' }), {
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
    component: function() {
      RouterController.changeMainReginView(new BetDetailView())
    },
  },
  {
    path: '/fc/cd',
    component: function() {
      RouterController.changeMainReginView(new ChaseDetailView())
    },
  },
]
