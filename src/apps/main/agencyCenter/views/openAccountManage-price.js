

const PriceDetailsView = require('userCenter/views/priceDetails')

const OnlineRechargeView = PriceDetailsView.extend({

  initialize() {
    PriceDetailsView.prototype.initialize.apply(this, arguments)
  },
})

module.exports = OnlineRechargeView
