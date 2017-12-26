import Vue from 'vue'
import ticketConfig from 'skeleton/misc/ticketConfig'

import store from '../../../store/index'
import bettingCenterTpl from '../templates/bettingCenter.html'

// vue components
import bettingQuickNav from './betting-quick-nav'
import ticketInfoBanner from './ticket-info-banner'
import bettingMainArea from './betting-main-area'


import over from '../misc/over.wav'
import prize from '../misc/prize.wav'
import openCode from '../misc/openCode.wav'

const audio = { over, prize, openCode }

const BettingCenterView = Base.ItemView.extend({

  template: bettingCenterTpl,

  initialize () {
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()
  },

  onShow() {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId)
    const ticketInfo = this.options.ticketInfo

    let ticketParameter = ''
    if (ticketInfo.info.id === 29) {
      ticketParameter = 'quick3'
    } else if (_.indexOf(this.mark6TicketIdArr, ticketInfo.info.id) > -1) {
      ticketParameter = 'mark6'
    } else {
      ticketParameter = ticketInfo.id
    }

    this.bettingCenter = new Vue({
      el: '#js-bc-main',
      components: {
        bettingQuickNav,
        ticketInfoBanner,
        bettingMainArea,
      },
      store,
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

    // 取得当前彩票信息
    this.bettingCenter.$store.dispatch('getTicketInfo', {
      ticketId: this.options.ticketId,
    })
    // 取得当前彩票规则
    this.bettingCenter.$store.dispatch('getTicketRules', {
      ticketId: this.options.ticketId,
    })
  },
  onDestroy() {
    this.bettingCenter.$destroy()
  },
})

export default BettingCenterView
