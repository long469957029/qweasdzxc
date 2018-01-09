import Vue from 'vue'
import ticketConfig from 'skeleton/misc/ticketConfig'

import store from '../../store/index'
import bettingCenterTpl from './bettingCenter.html'

// vue components
import BettingQuickNav from './betting-quick-nav'
import TicketInfoBanner from './ticket-info-banner'
import BettingMainArea from './betting-main-area'
import BettingMainAreaHandicap from './betting-main-area-handicap'

Object.defineProperty(Vue.prototype, '_', { value: _ })

const BettingCenterView = Base.ItemView.extend({

  template: bettingCenterTpl,

  onShow() {
    this.options.ticketInfo = ticketConfig.getComplete(this.options.ticketId)

    this.bettingCenter = new Vue({
      el: '#js-bc-main',
      components: {
        BettingQuickNav,
        TicketInfoBanner,
        BettingMainArea,
        BettingMainAreaHandicap,
      },
      store,
      data: {
        ticketId: Number(this.options.ticketId),
        ticketInfo: this.options.ticketInfo,
        ticketList: ticketConfig.getCompleteAll(),
        bettingType: this.options.type,
      },
      methods: {
      },
    })

    // 暂时在这重置bettingChoice
    store.commit(types.RESET_BETTING_CHOICE)

    // 取得当前彩票信息
    this.bettingCenter.$store.dispatch('getTicketInfo', {
      ticketId: this.options.ticketId,
      type: this.options.type,
    })
    // 取得当前彩票规则
    this.bettingCenter.$store.dispatch('getTicketRules', {
      ticketId: this.options.ticketId,
      type: this.options.type,
    })
  },
  onDestroy() {
    this.bettingCenter.$destroy()
  },
})

export default BettingCenterView
