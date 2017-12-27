import BettingCenterView from './views/bettingCenter'

import './misc/index.scss'

const RouterController = require('skeleton/controllers/router')

// const BettingCenterView = require('bettingCenter/views/bettingCenter_old1')

const BettingDetailView = require('bettingCenter/views/bettingCenter-detail')

const MMCBettingCenterView = require('bettingCenter/mmc')

const BettingCenterController = RouterController.extend({

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

module.exports = BettingCenterController
