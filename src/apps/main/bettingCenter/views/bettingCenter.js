import Vue from 'vue'

// import './bettingQuickNav'

const ticketConfig = require('skeleton/misc/ticketConfig')

const audio = {
  over: require('bettingCenter/misc/over.wav'),
  prize: require('bettingCenter/misc/prize.wav'),
  openCode: require('bettingCenter/misc/openCode.wav'),
}

const BettingCenterView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter.html'),

  initialize () {
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()
  },

  onShow() {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId)
    const ticketInfo = this.options.ticketInfo

    let ticketParameter = null
    if (ticketInfo.info.id === 29) {
      ticketParameter = 'quick3'
    } else if (_.indexOf(this.mark6TicketIdArr, ticketInfo.info.id) > -1) {
      ticketParameter = 'mark6'
    } else {
      ticketParameter = ticketInfo.id
    }

    new Vue({
      el: '#js-bc-main',
      data: {
        ticketId: Number(this.options.ticketId),
        ticketInfo: this.options.ticketInfo,
        mark6TicketIdArr: this.mark6TicketIdArr,
        audio,
        ticketList: ticketConfig.getCompleteAll(),

        ticketParameter,
      },
      methods: {
      },
    })
  },
})

module.exports = BettingCenterView
