
const AccountDetailsView = () => import(/* webpackChunkName: "fund-center" */ './accountDetail')
const FundRecordsView = () => import(/* webpackChunkName: "fund-center" */ './record')
const FundManageView = () => import(/* webpackChunkName: "fund-center" */ './fundManage')
const RebateRecordsView = () => import(/* webpackChunkName: "fund-center" */ './rebateRecord')

const GameRecordView = () => import(/* webpackChunkName: "fund-center" */ './gameRecord/index')
const BetDetailView = () => import(/* webpackChunkName: "fund-center" */ './gameRecord/betDetail')
const ChaseDetailView = () => import(/* webpackChunkName: "fund-center" */ './gameRecord/chaseDetail')

require('./misc/index.scss')

const menuConfig = Global.ui.menu.get('uc')
const sidebar = Global.ui.menu.get('uc')

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
