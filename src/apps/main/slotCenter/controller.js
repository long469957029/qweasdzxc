

const RouterController = require('skeleton/controllers/router')

const SlotCenterView = require('slotCenter/index')

const SlotCenterController = RouterController.extend({

  slotCenter() {
    this.changeMainReginView(new SlotCenterView())
  },
})

module.exports = SlotCenterController
