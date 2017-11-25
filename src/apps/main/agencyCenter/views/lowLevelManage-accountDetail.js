import MoneyDetailsView from 'fundCenter/accountDetail'

const LowLevelMoneyDetailsView = MoneyDetailsView.extend({

  initialize(options) {
    this.options.betDetailPrevUrl = `#ac/betting/${this.options.userId}/detail/`
    this.options.chaseDetailPrevUrl = `#ac/track/${this.options.userId}/detail/`

    _(this.options).extend({
      reqData: {
        userId: options.userId,
        username: _.getUrlParam('name'),
      },
    })
    MoneyDetailsView.prototype.initialize.apply(this, arguments)
  },
})

module.exports = LowLevelMoneyDetailsView
