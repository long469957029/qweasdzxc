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
        if (res.root.ticketName.indexOf("六合彩") === 0) {
          _(openArr).each((num, index) => {
            const mark6Conf = bettingTypes.MARK6.getNum()
            const styleConf = _(mark6Conf).findWhere({
              num: num
            })
            if (index === openArr.length - 1) {
              openNumHtml.push(`<div class="add">+</div>`)
            }
            openNumHtml.push(`<li class="mark6 sm-ball ${styleConf.style}"><div class="gr-bet-num">${num}</div>`)
            openNumHtml.push(`<div class="gr-bet-sx">${styleConf.sx}</div></li>`)
          })
        } else {
          _(openArr).each((num) => {
            openNumHtml.push(`<li class="${ballClass} style"><span class="js-gr-bet-num">${num}</span></li>`)
          })
        }
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
        let betMoneyDesc = ''
        if (res.root.handicap) {
          const betMoneyDesc = '（${betMethod}*${info.betMultiple}倍*${info.betNum}注）'
        }
        self.$('.js-gr-bet-money').html(`${_(res.root.betAllMoney).formatDiv(10000)}元${betMoneyDesc}`)
        if (res.root.canCancel && this.isSelf) {
          self.$('.js-gr-bet-detail-win').addClass('hidden')
          self.$('.js-gr-bet-detail-profit').addClass('hidden')
          self.$('.js-gr-submit-container').removeClass('hidden')
        } else {
          if (res.root.money > 0) {
            self.$('.js-gr-bet-win').html(`<span class="text-account-cut">${_(res.root.money).formatDiv(10000)}</span>`)
          } else {
            self.$('.js-gr-bet-win').html(`<span>${_(res.root.money).formatDiv(10000)}</span>`)
          }

          let profit = _(res.root.money - res.root.betAllMoney).formatDiv(10000)
          if (res.root.ticketBetStatus === 2 || res.root.ticketBetStatus === 3) {
            profit = 0
          }
          if (profit > 0) {
            self.$('.js-gr-bet-profit').html(`<span class="text-account-cut">${profit}</span>`)
          } else if (profit === 0) {
            self.$('.js-gr-bet-profit').html(`<span>${profit}</span>`)
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
