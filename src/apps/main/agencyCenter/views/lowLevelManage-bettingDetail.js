

const BettingDetailView = require('userCenter/views/bettingDetail')

const LowLevelBettingDetailView = BettingDetailView.extend({

  initialize(options) {
    BettingDetailView.prototype.initialize.apply(this, arguments)

    this.options.detailPrevUrl = `#ac/track/${this.options.userId}/detail/`
  },

  onRender() {
    BettingDetailView.prototype.onRender.apply(this, arguments)

    this.$('.js-bd-title').html(`查看${_.getUrlParam('name')}的投注详情`)
  },
})

module.exports = LowLevelBettingDetailView
