/**
 * Created by steven on 2017/12/18.
 */
require('./index.scss')

const BetDetailView = Base.ItemView.extend({

  template: require('fundCenter/gameRecord/betDetail.html'),

  events: {
    'click .js-gr-submitBtn': 'cancelBetTicketHandle',
  },

  getBetDetailXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/bet/detail.json',
      data,
    })
  },
  onRender() {
    const self = this
    this.maxLength = 20
    this.getBetDetailXhr({
      tradeNo: this.options.tradeno,
    }).always(() => {
      self.loadingFinish()
    }).done((res) => {
      if (res && res.result === 0) {
        self.isSelf = !(!_(self.options.userId).isUndefined() && (`${Global.memoryCache.get('acctInfo').userId}` !== `${self.options.userId}`))
        self.$('.jc-gr-bet-type-name').html(res.root.ticketName)
        self.$('.jc-gr-bet-type-no').html(res.root.ticketPlanId)
        const info = res.root.chaseTicketPlayDetail[0]
        const openNum = res.root.openNum ? res.root.openNum : '等,待,开,奖'
        const openNumHtml = []
        const openArr = openNum.split(',')
        const ballClass = openArr.length === 10 ? 'sm-ball' : ''
        _(openArr).each((num) => {
          openNumHtml.push(`<li class="${ballClass}"><span class="js-gr-bet-num">${num}</span></li>`)
        })
        self.$('.js-fc-gr-bet-openNum').html(openNumHtml.join(''))
        self.$('.js-gr-bet-username').html(res.root.username)
        self.$('.js-gr-bet-tradeNo').html(res.root.ticketBetNo)
        self.$('.js-gr-time').html(_(res.root.betTime).toTime())
        self.$('.js-gr-bet-play').html(`${res.root.ticketName}-${info.ticketLevelName}-${info.ticketPlayName}`)

        let cell = _(res.root.singleMoney).convert2yuan()
        if (info.betMethod === 0) {
          cell = `${+cell}/0.0%`
        } else {
          cell = `${+cell}/${_(info.userRebate).formatDiv(10)}%`
        }
        self.$('.js-gr-bet-method').html(cell)


        self.$('.js-gr-bet-content').html(info.betNums)
        let betMethod = ''
        if (info.moneyMethod === 10000) {
          betMethod = 2
        } else if (info.moneyMethod === 1000) {
          betMethod = 0.2
        } else if (info.moneyMethod === 100) {
          betMethod = 0.02
        } else if (info.moneyMethod === 10) {
          betMethod = 0.002
        }
        self.$('.js-gr-ticketBetId').val(res.root.ticketBetId)
        self.$('.js-gr-bet-money').html(`${_(res.root.betAllMoney).convert2yuan()}元（${betMethod}*${info.betMultiple}倍*${info.betNum}注）`)
        if (res.root.canCancel && this.isSelf) {
          self.$('.js-gr-bet-detail-win').addClass('hidden')
          self.$('.js-gr-bet-detail-profit').addClass('hidden')
          self.$('.js-gr-submit-container').removeClass('hidden')
        } else {
          self.$('.js-gr-bet-win').html(`<span class="text-account-cut">${_(res.root.betAllMoney).convert2yuan()}</span>`)
          const profit = _(res.root.money).convert2yuan() - _(res.root.betAllMoney).convert2yuan()
          if (profit > 0) {
            self.$('.js-gr-bet-profit').html(`<span class="text-account-cut">${profit}</span>`)
          } else {
            self.$('.js-gr-bet-profit').html(`<span class="text-account-add">${profit}</span>`)
          }
        }
      } else {
        Global.ui.notification.show('操作失败。')
      }
    })
  },
})
module.exports = BetDetailView
