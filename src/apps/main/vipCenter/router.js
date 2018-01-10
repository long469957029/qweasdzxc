const menuConfig = Global.ui.menu.get('vip')

const VipHomeView = () => import(/* webpackChunkName: "vip-center" */ './vipHome')

const VipLevelView = () => import(/* webpackChunkName: "vip-center" */ './vipLevel')
const VipPointView = () => import(/* webpackChunkName: "vip-center" */ './vipPoint')
const VipCashView = () => import(/* webpackChunkName: "vip-center" */ './vipCash')
const VipPrizeView = () => import(/* webpackChunkName: "vip-center" */ './vipPrize')
const VipCreditView = () => import(/* webpackChunkName: "vip-center" */ './vipCredit')
const VipAwardView = () => import(/* webpackChunkName: "vip-center" */ './vipAward')
const VipFestivalView = () => import(/* webpackChunkName: "vip-center" */ './vipFestival')
const VipCardView = () => import(/* webpackChunkName: "vip-center" */ './vipCard')
const VipReturnVisitView = () => import(/* webpackChunkName: "vip-center" */ './vipReturnVisit')


  // 'vip/home': 'vipHome',
  // 'vip/level': 'vipLevel',
  // 'vip/point': 'vipPoint',
  // 'vip/cash': 'vipCash',
  // 'vip/prize': 'vipPrize',
  // 'vip/credit': 'vipCredit',
  // 'vip/award': 'vipAward',
  // 'vip/festival': 'vipFestival',
  // 'vip/card': 'vipCard',
  // 'vip/rv': 'vipReturnVisit',

export default [
  {
    path: '/vip/home',
    component: function(resolve) {
      RouterController.async(resolve, VipHomeView, {
        main: {
          icon: menuConfig.icon,
          title: '我的爵位',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/level',
    component: function(resolve) {
      RouterController.async(resolve, VipLevelView, {
        main: {
          icon: menuConfig.icon,
          title: '爵士成长足迹',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/point',
    component: function(resolve) {
      RouterController.async(resolve, VipPointView, {
        main: {
          icon: menuConfig.icon,
          title: '爵士贡献值',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/cash',
    component: function(resolve) {
      RouterController.async(resolve, VipCashView, {
        main: {
          icon: menuConfig.icon,
          title: '爵士礼金',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/prize',
    component: function(resolve) {
      RouterController.async(resolve, VipPrizeView, {
        main: {
          icon: menuConfig.icon,
          title: '周末加奖',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/credit',
    component: function(resolve) {
      RouterController.async(resolve, VipCreditView, {
        main: {
          icon: menuConfig.icon,
          title: '信誉基金',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/award',
    component: function(resolve) {
      RouterController.async(resolve, VipAwardView, {
        main: {
          icon: menuConfig.icon,
          title: '月度奖励',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/festival',
    component: function(resolve) {
      RouterController.async(resolve, VipFestivalView, {
        main: {
          icon: menuConfig.icon,
          title: '节日奖励',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/card',
    component: function(resolve) {
      RouterController.async(resolve, VipCardView, {
        main: {
          icon: menuConfig.icon,
          title: '我的特权卡',
        },
        sidebar: menuConfig,
      })
    }
  },
  {
    path: '/vip/rv',
    component: function(resolve) {
      RouterController.async(resolve, VipReturnVisitView, {
        main: {
          icon: menuConfig.icon,
          title: '电话回访',
        },
        sidebar: menuConfig,
      })
    }
  },
]
