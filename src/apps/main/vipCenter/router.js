const menuConfig = Global.ui.menu.get('vip')

const VipHomeView = require('vipCenter/vipHome')
const VipLevelView = require('vipCenter/vipLevel')
const VipPointView = require('vipCenter/vipPoint')
const VipCashView = require('vipCenter/vipCash')
const VipPrizeView = require('vipCenter/vipPrize')
const VipCreditView = require('vipCenter/vipCredit')
const VipAwardView = require('vipCenter/vipAward')
const VipFestivalView = require('vipCenter/vipFestival')
const VipCardView = require('vipCenter/vipCard')
const VipReturnVisitView = require('vipCenter/vipReturnVisit')


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
    component: function() {
      RouterController.changeMainReginView(new VipHomeView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipLevelView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipPointView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipCashView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipPrizeView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipCreditView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipAwardView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipFestivalView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipCardView(), {
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
    component: function() {
      RouterController.changeMainReginView(new VipReturnVisitView(), {
        main: {
          icon: menuConfig.icon,
          title: '电话回访',
        },
        sidebar: menuConfig,
      })
    }
  },
]
