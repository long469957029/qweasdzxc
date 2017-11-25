const RouterController = require('skeleton/controllers/router')

const ActiveCenterView = require('activeCenter/activeCenter')

const ActiveCenterController = RouterController.extend({

  activeCenter() {
    this.changeMainReginView(new ActiveCenterView(), {
      main: {
        title: '活动中心',
      },
    })
  },
})

module.exports = ActiveCenterController
