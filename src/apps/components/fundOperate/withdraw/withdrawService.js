/**
 * Created by steven on 2017/12/22.
 */
const bankConfig = require('userCenter/misc/bankConfigForFund')

module.exports = {
  getBankData(cardList, selectedCardId) {
    const selected = []
    const bankItems = []
    let selectedData = []
    if (selectedCardId === undefined) {
      selectedData = _(cardList).findWhere({
        cardId: cardList[0].cardId,
      })
    } else {
      selectedData = _(cardList).findWhere({
        cardId: selectedCardId,
      })
    }
    const name = selectedData.bankName
    const bankId = selectedData.bankId
    const cardId = selectedData.cardId
    const cardNo = selectedData.cardNo
    const logo = bankConfig.get(bankId).className
    selected.push(`<div class="js-wd-bank-selectedItem" data-bankid="${bankId}" data-cardid="${cardId}">`)
    selected.push(`<span class="js-wd-bank-icon rc-icon ${logo}"></span>`)
    selected.push(`<span class="js-wd-bank-name rc-name">${name}（${cardNo}）</span>`)
    if (cardList.length >= 2) {
      selected.push('<span class="js-wd-bank-desc rc-desc-more">其他银行</span>')//
      selected.push('<span class="select-down js-select-bank-down"></span></div>')
    }

    // 取未选中的支付方式信息并赋值
    const unSelectedData = _(cardList).without(selectedData)
    _(unSelectedData).each((item) => {
      const itemList = []
      const itemBankId = item.bankId
      itemList.push(`<span class="js-wd-bank-icon rc-icon ${bankConfig.get(itemBankId).className}"></span>`)
      itemList.push(`<span class="js-wd-bank-name rc-name">${item.bankName}（${item.cardNo}）</span>`)
      bankItems.push(`<div class="js-wd-bank-item fc-wd-bank-item" data-bankid="${item.bankId}" data-cardid="${item.cardId}">${itemList.join('')}</div>`)
    })
    return {
      selected: selected.join(''),
      bankItems: bankItems.join(''),
    }
  },
  getFeeData(data, amount, selectedId) {
    let maxMoney = ''// 超过金额收取手续费
    _(data.cardList).each((item) => {
      if (item.bankId === selectedId) {
        maxMoney = _(item.minMoneyLimit).formatDiv(10000)
      }
    })
    const charge = _(data.fee).formatDiv(10000) // 手续费
    const maxChargeMoney = _(data.feeLimit).formatDiv(10000)// 最高手续费
    let chargeMoney = 0
    let trueMoney = 0
    if (amount >= maxMoney) {
      if (data.feeType === 'percent') {
        chargeMoney = Math.floor(amount * charge) < maxChargeMoney ? Math.floor(amount * charge) : maxChargeMoney
      } else {
        chargeMoney = charge < maxChargeMoney ? charge : maxChargeMoney
      }
      trueMoney = amount - chargeMoney
    }
    return {
      fee: chargeMoney,
      amount: trueMoney,
    }
  },
  getTips(data, bankId) {
    const html = []
    const firstHtml = []
    let minFee = ''
    let maxFee = ''
    _(data.cardList).each((item) => {
      if (item.bankId === bankId) {
        minFee = _(item.minMoneyLimit).formatDiv(10000)
        maxFee = _(item.maxMoneyLimit).formatDiv(10000)
      }
    })
    firstHtml.push(`<span>1.单笔最低提现金额<span class="text-account-fund">${minFee}</span>元，最高提现限额<span class="text-account-fund">${maxFee}</span>元，`)
    firstHtml.push(`今日还可以免费提现<span class="text-account-fund">${data.remainTimes}</span>次。`)
    if (data.feeType === 'percent') {
      firstHtml.push(`超过次数按 <span class="text-account-fund">${_(data.fee).formatDiv(100)}%</span>收取手续费。</div>`)
    }
    if (data.feeType === 'fix') {
      firstHtml.push(`超过次数按每笔<span class="text-account-fund">${_(data.fee).formatDiv(10000)}元</span>收取手续费</div>`)
    }
    html.push(firstHtml.join(''))
    html.push('<div>2.新绑定的提款银行卡需要3小时后才能发起提款</div>')
    return {
      tipsHtml: html.join(''),
      minInput: minFee,
    }
  },
  getPreWithdrawTips(status) {
    const pwdTips = '设置资金密码'
    const cardTips = '绑定提现银行卡'
    let tips = ''
    if (status === 3) {
      tips = pwdTips
    }
    if (status === 2) {
      tips = cardTips
    }
    if (status === 0) {
      tips = pwdTips + '并' + cardTips
    }
    const html = []
    html.push('<div class=" fc-wd-set-view"><div class="fc-wd-set-img sfa sfa-icon-recharge-warning"></div>')
    html.push(`<div class="fc-wd-set-tips">为了您的资金安全，提现前请先<span class="jc-wd-set-tips-text wd-set-tips-text">${tips}</span></div><div class="fc-wd-set-goTo">`)
    if (status === 3 || status === 0) {
      html.push('<button class="js-wd-goTo-fundPwd btn btn-wd-submit">去设置</button></div></div>')
    } else if (status === 2) {
      html.push('<button class="js-wd-goTo-bankCard btn btn-wd-submit">去绑定</button></div></div>')
    }
    return html.join('')

  },
}

