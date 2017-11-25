'use scrict'

const RouterController = require('skeleton/controllers/router')

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

const VipCenterController = RouterController.extend({

  vipHome() {
    this.changeMainReginView(new VipHomeView(), {
      main: {
        icon: menuConfig.icon,
        title: '我的爵位',
      },
      sidebar: menuConfig,
    })
  },
  vipLevel() {
    this.changeMainReginView(new VipLevelView(), {
      main: {
        icon: menuConfig.icon,
        title: '爵士成长足迹',
      },
      sidebar: menuConfig,
    })
  },
  vipPoint() {
    this.changeMainReginView(new VipPointView(), {
      main: {
        icon: menuConfig.icon,
        title: '爵士贡献值',
      },
      sidebar: menuConfig,
    })
  },
  vipCash() {
    this.changeMainReginView(new VipCashView(), {
      main: {
        icon: menuConfig.icon,
        title: '爵士礼金',
      },
      sidebar: menuConfig,
    })
  },
  vipPrize() {
    this.changeMainReginView(new VipPrizeView(), {
      main: {
        icon: menuConfig.icon,
        title: '周末加奖',
      },
      sidebar: menuConfig,
    })
  },
  vipCredit() {
    this.changeMainReginView(new VipCreditView(), {
      main: {
        icon: menuConfig.icon,
        title: '信誉基金',
      },
      sidebar: menuConfig,
    })
  },
  vipAward() {
    this.changeMainReginView(new VipAwardView(), {
      main: {
        icon: menuConfig.icon,
        title: '月度奖励',
      },
      sidebar: menuConfig,
    })
  },
  vipFestival() {
    this.changeMainReginView(new VipFestivalView(), {
      main: {
        icon: menuConfig.icon,
        title: '节日奖励',
      },
      sidebar: menuConfig,
    })
  },
  vipCard() {
    this.changeMainReginView(new VipCardView(), {
      main: {
        icon: menuConfig.icon,
        title: '我的特权卡',
      },
      sidebar: menuConfig,
    })
  },
  vipReturnVisit() {
    this.changeMainReginView(new VipReturnVisitView(), {
      main: {
        icon: menuConfig.icon,
        title: '电话回访',
      },
      sidebar: menuConfig,
    })
  },


})

module.exports = VipCenterController
