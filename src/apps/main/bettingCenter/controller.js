

require('./misc/index.scss')

const RouterController = require('skeleton/controllers/router')

const BettingCenterView = require('bettingCenter/views/bettingCenter')

const BettingDetailView = require('bettingCenter/views/bettingCenter-detail')

const MMCBettingCenterView = require('bettingCenter/mmc')

const BettingCenterController = RouterController.extend({

  bettingCenter(ticketId) {
    if (Number(ticketId) === 19) {
      this.changeMainReginView(new MMCBettingCenterView({
        ticketId: Number(ticketId),
      }))
    } else {
      this.changeMainReginView(new BettingCenterView({
        ticketId: Number(ticketId),
      }))
      this.resizeFooter()
    }
  },

  // bettingCenter: function(ticketId) {
  //  this.changeMainReginView(new BettingCenterView({
  //    ticketId: Number(ticketId)
  //  }));
  //
  // },

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
  // 刷新页面时，六合彩选号区内容过长，footer调整
  resizeFooter () {
    const playArea = $('.js-bc-play-area')[0]
    if (playArea.scrollHeight > 290) {
      $('#footer').addClass('mark6-footer')
    } else {
      $('#footer').removeClass('mark6-footer')
    }
  },
})

module.exports = BettingCenterController
