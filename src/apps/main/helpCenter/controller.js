

const RouterController = require('skeleton/controllers/router')

const HelpCenterView = require('helpCenter/index')

const HelpCenterController = RouterController.extend({

  helpCenter() {
    this.changeMainReginView(new HelpCenterView())
  },

})

module.exports = HelpCenterController
