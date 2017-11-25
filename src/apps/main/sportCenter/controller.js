

const RouterController = require('skeleton/controllers/router')

const SportCenterView = require('sportCenter/index')

const SportCenterController = RouterController.extend({

  sportCenter() {
    this.changeMainReginView(new SportCenterView())
  },
})

module.exports = SportCenterController
