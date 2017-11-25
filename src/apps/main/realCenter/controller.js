

const RouterController = require('skeleton/controllers/router')

const RealCenterView = require('realCenter/index')

const RealCenterController = RouterController.extend({

  realCenter() {
    this.changeMainReginView(new RealCenterView())
  },
})

module.exports = RealCenterController
