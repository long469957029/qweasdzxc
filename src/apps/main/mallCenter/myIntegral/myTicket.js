

const couponCenterViewInfo = require('../couponCenter/index')

const MyTicketView = Base.ItemView.extend({

  template: require('./myTicket.html'),

  startOnLoading: true,

  events: {
  },
  serializeData() {
    return {
      loading: Global.ui.loader.get(),
    }
  },

  onRender() {
    const self = this
    this.$('.js-my-ticket-main').html(new couponCenterViewInfo({ from: 1 }).render().el)
    this.loadingFinish()
  },
})

module.exports = MyTicketView
