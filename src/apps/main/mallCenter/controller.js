'use scrict'

const RouterController = require('skeleton/controllers/router')

const MallCenterView = require('mallCenter/index/index')

const instructionView = require('mallCenter/instruction/index')

const MallCenterController = RouterController.extend({

  mallCenter() {
    this.changeMainReginView(new MallCenterView(), {
      hideHeaderRight: true,
    })
  },
  instruction () {
    this.changeMainReginView(new instructionView(), {
      hideHeaderRight: true,
    })
  },
})

module.exports = MallCenterController
