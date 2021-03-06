/**
 * Created by steven on 2017/12/18.
 */

import {formatOptionals} from 'build'

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
        self.isSelf = Global.memoryCache.get('acctInfo').username === res.root.username
        self.$('.jc-gr-bet-type-name').html(res.root.ticketName)
        if (res.root.ticketPlanId !== 'mmc') {
          self.$('.jc-gr-bet-type-no-panel').html('第<span class="jc-gr-bet-type-no fc-gr-bet-type-no">' + res.root.ticketPlanId + '</span>期')
        }
        const info = res.root.chaseTicketPlayDetail[0]
        let openNum = ''
        if (res.root.ticketBetStatus === 2) {
          openNum = '用,户,撤,单'
        } else if (res.root.ticketBetStatus === 3) {
          openNum = '系,统,撤,单'
        } else {
          openNum = res.root.openNum ? res.root.openNum : '等,待,开,奖'
        }

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

        let playDesc = `${res.root.ticketName} - ${res.root.chaseTicketPlayDetail[0].playName}`

        //增加任选处理逻辑
        //如果是任选号码 将号码格式化，去除位数，并将位数接在玩法后
        let splitNum = info.betNums.split('|')
        let fotmattedNum = ''
        if (splitNum.length > 1) {
          playDesc += `（${formatOptionals(splitNum[0]).join(',')}）`
          fotmattedNum = splitNum[1]
        } else {
          fotmattedNum = info.betNums
        }

        // if (!res.root.handicap) {
        //   self.$('.js-gr-bet-play').html(`${res.root.ticketName}-${info.ticketLevelName}-${info.ticketPlayName}`)
        // } else {
        self.$('.js-gr-bet-play').html(playDesc)
        // }


        let cell = _(res.root.chaseTicketPlayDetail[0].singleMoney).convert2yuan()
        // if (info.betMethod === 0) {
        //   cell = `${+cell} / 0.0 % `
        // } else {
        //   cell = `${+cell} /${_(info.userRebate).formatDiv(10)} % `
        // }
        self.$('.js-gr-bet-method').html(cell)


        self.$('.js-gr-bet-content').html(fotmattedNum)
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
        if (!res.root.handicap) {
          betMoneyDesc = `<span class="m-left-md">(${_.convert2yuan(res.root.chaseTicketPlayDetail[0].moneyMethod * 2)}*${res.root.chaseTicketPlayDetail[0].betMultiple}倍*${res.root.chaseTicketPlayDetail[0].betNum}注)</span>`
        }
        self.$('.js-gr-bet-money').html(`${_(res.root.betAllMoney).formatDiv(10000)}元${betMoneyDesc}`
        )
        if (res.root.canCancel && this.isSelf) {
          // self.$('.js-gr-bet-detail-win').addClass('hidden')
          // self.$('.js-gr-bet-detail-profit').addClass('hidden')
          if (!res.root.handicap) {
            self.$('.js-gr-submit-container').removeClass('hidden')
          }
        } else {
          if (!res.root.openNum && res.root.handicap) {
            // self.$('.js-gr-bet-detail-win').addClass('hidden')
            // self.$('.js-gr-bet-detail-profit').addClass('hidden')
          }
          if (res.root.money > 0) {
            self.$('.js-gr-bet-win').html(
              `<span class="text-account-cut">${_(res.root.money).formatDiv(10000)}</span>`
            )
          } else if (openNum !== '等,待,开,奖') {
            self.$('.js-gr-bet-win').html(
              `<span>${_(res.root.money).formatDiv(10000)}</span>`
            )
          }

          let profit = _(res.root.money - res.root.betAllMoney).formatDiv(10000)
          if (res.root.ticketBetStatus === 2 || res.root.ticketBetStatus === 3) {
            profit = 0
          }
          if (profit > 0) {
            self.$('.js-gr-bet-profit').html(
              `<span class="text-account-cut">${profit}</span>`
            )
          } else if (profit === 0 && openNum !== '等,待,开,奖') {
            self.$('.js-gr-bet-profit').html(
              `<span>${profit}</span>`
            )
          } else if (openNum !== '等,待,开,奖') {
            self.$('.js-gr-bet-profit').html(
              `<span class="text-account-add">${profit}</span>`
            )
          }
        }
      } else {
        Global.ui.notification.show('操作失败。')
      }
    })
  },
})
module.exports = BetDetailView
