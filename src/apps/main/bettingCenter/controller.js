import BettingCenterView from './bettingCenter'

import './misc/index.scss'

const RouterController = require('skeleton/controllers/router')

const BettingDetailView = require('./bettingCenter-detail')

const MMCBettingCenterView = require('./mmc')

export default RouterController.extend({

  bettingCenter(ticketId, type = 0) {
    if (Number(ticketId) === 19) {
      this.changeMainReginView(new MMCBettingCenterView({
        ticketId: Number(ticketId),
        type,
      }))
    } else {
      this.changeMainReginView(new BettingCenterView({
        ticketId: Number(ticketId),
        type,
      }))
    }
  },

  bettingDetail(ticketId, tradeNo) {
    this.changeMainReginView(new BettingDetailView({
      tradeNo,
    }), {
      main: {
        title: '投注详情',
        subReturn: true,
      },
      sidebar: Global.ui.menu.get('uc'),
      parentRouter: `bc/${ticketId}`,
    })
  },
})
