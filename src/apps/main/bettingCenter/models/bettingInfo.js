

const Model = require('skeleton/model')

const BettingModel = Model.extend({

  // common APIs

  changeToUpdate() {
    this.set('init', false)
  },
})

module.exports = BettingModel
