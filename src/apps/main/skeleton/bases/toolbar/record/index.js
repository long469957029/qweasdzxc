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
      let gameStatus = ''
      if (game.type === 1) {
        if (game.status === 0) {
          gameStatus = '等待开奖'
        } else if (game.status === 1) {
          gameStatus = '已中奖'
        } else if (game.status === 2) {
          gameStatus = '未中奖'
        }
      }
      html.push('<div class="recent-game-item">')
      html.push(`<div class="game-title">${game.name}</div>`)
      html.push(`<div class="game-date">${createTime}</div>`)
      html.push(`<div class="game-type">${game.playName}</div>`)
      html.push(`<div class="game-amount">${betAmount}</div>`)
      html.push(`<div class="game-state">${gameStatus}</div>`)
      html.push('<div class="clearfix"></div>')
      html.push('</div>')
      itemHtml.push(html.join(''))
    })
    this.$('.js-recent-game-items').html(itemHtml.join(''))
  },
})

module.exports = RecordView
