/**
 * Created by ABCD on 2015/10/23.
 */
const BettingDetailView = require('userCenter/views/bettingDetail')

const BettingCenterBettingDetailView = BettingDetailView.extend({

  initialize(options) {
    BettingDetailView.prototype.initialize.apply(this, arguments)
    _(this.options).extend({
      tradeNo: options.tradeNo,
    })
  },

  onRender() {
    BettingDetailView.prototype.onRender.apply(this, arguments)
    // this.$('.js-bd-title').html('查看' + _.getUrlParam('name') + '的投注详情');
  },
})

module.exports = BettingCenterBettingDetailView
