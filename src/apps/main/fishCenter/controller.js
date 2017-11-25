

const RouterController = require('skeleton/controllers/router')

const FishCenterView = require('fishCenter/index')

const FishCenterController = RouterController.extend({

  fishCenter() {
    this.changeMainReginView(new FishCenterView())
  },
})

module.exports = FishCenterController
