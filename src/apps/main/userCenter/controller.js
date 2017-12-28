'use scrict'

const RouterController = require('skeleton/controllers/router')

const PersonalManageView = require('userCenter/views/personalManage')
const CardManageView = require('userCenter/views/cardManage')
const CardBindingView = require('userCenter/views/cardBinding')
const PriceDetailsView = require('userCenter/views/priceDetails')


// const ucMenuConfig = Global.ui.menu.get('uc')
// const gcMenuConfig = Global.ui.menu.get('gc')
const sidebar = Global.ui.menu.get(['fc', 'uc'])

const UserCenterController = RouterController.extend({
  personalManage() {
    this.changeMainReginView(new PersonalManageView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '个人资料',
      },
      sidebar,
    })
  },

  cardManage() {
    this.changeMainReginView(new CardManageView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '银行卡管理',
      },
      sidebar,
    })
  },
  cardBinding() {
    this.changeSubReginView(new CardBindingView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '银行卡管理',
      },
      parentRouter: 'uc/cm',
    })
  },

  priceDetails() {
    this.changeMainReginView(new PriceDetailsView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '奖金详情',
      },
      sidebar,
    })
  },

})

module.exports = UserCenterController
