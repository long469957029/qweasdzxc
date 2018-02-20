import './index.scss'

const RecordView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},
  getGameSummaryXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/gameAndTicketHistory.json',
      data,
    })
  },
  initialize() {
    this.GameXhr = this.getGameSummaryXhr()
  },
  onRender() {
    const self = this
    $.when(this.GameXhr).done((res) => {
      if (res.result === 0) {
        self.$('.js-sideBar-Bet-Today').html(_(res.root.dataTotal.betTotal).convert2yuan())// 总余额
        self.$('.js-sideBar-Profit-Today').html(_(res.root.dataTotal.profitTotal).convert2yuan())// 可用余额
        if (res.root.records.length > 0) {
          this.renderData(res.root.records)
        } else {
          this.$('.js-sideBar-record-items-empty').removeClass('hidden')
        }
      }
    })
  },
  renderData(data) {
    const itemHtml = []
    _(data).each((game) => {
      const html = []
      const createTime = _(game.date).toTime()
      const betAmount = _(game.bet).convert2yuan()


      // 0:未中奖，1：已中奖，2：用户撤单，3：系统撤单,ticketResult,prizeTotalMoney
      // 状态
      let status = ''
      if (game.status === 2) {
        status = '用户撤单'
      } else if (game.status === 3) {
        status = '系统撤单'
      } else if (game.hasException) {
        status = '等待开奖'
      } else if (game.ticketResult === null) {
        if (game.status > 0) {
          status = '未中奖'
        } else {
          status = '等待开奖'
        }
      } else if (game.price === 0) {
        status = '未中奖'
      } else {
        // status = `中奖<span class="text-account-cut">${_(game.price).convert2yuan()}</span>`
        status = `中奖<span style="color:#f09932;">${_(game.price).convert2yuan()}</span>`
      }
      html.push(`<div class="js-gl-bet-detail-dialog recent-game-item " data-id="${game.ticketTradeNo}">`)
      html.push(`<div class="game-title">${game.name}-${game.playName}</div>`)
      html.push(`<div class="game-amount">${betAmount}</div>`)
      html.push(`<div class="game-date">${createTime}</div>`)
      // html.push(`<div class="game-type">${game.playName}</div>`)
      html.push(`<div class="game-state">${status}</div>`)
      html.push('<div class="clearfix"></div>')
      html.push('</div>')
      itemHtml.push(html.join(''))
    })
    this.$('.js-recent-game-items').html(itemHtml.join(''))
  },
})

module.exports = RecordView
