/**
 * Created by steven on 2017/12/22.
 */
const walletConf = require('./walletConf')

module.exports = {
  getFromData(fromId) {
    let selectedId = ''
    const selected = []
    const fromItems = []
    const walletData = walletConf.getAll()
    if (fromId >= 0) {
      selectedId = fromId
    } else {
      selectedId = 0
    }
    // 获取已选择面板数据
    const selectedData = _(walletData).findWhere({
      id: selectedId,
    })
    const name = walletConf.get(selectedId).zhName
    const title = '转出钱包'
    selected.push(`<div class="js-tr-out-selectedItem" data-id="${selectedId}" data-name="${name}">`)
    selected.push(`<span class="js-tr-out-package-title tr-out-package-title"> ${title}</span>`)
    selected.push(`<span class="js-tr-out-name rc-desc">${name}</span>`)
    selected.push('<span class="select-down js-tr-select-out-down"></span></div>')

    // 取未选中的支付方式信息并赋值
    const unSelectedData = _(walletData).without(selectedData)
    _(unSelectedData).each((item) => {
      const itemList = []
      const itemName = walletConf.get(item.id).zhName
      itemList.push(`<span class="js-tr-out-name rc-name">${itemName}</span>`)
      fromItems.push(`<div class="js-tr-out-item fc-tr-out-item" data-id="${item.id}">${itemList.join('')}</div>`)
    })
    return {
      fromSelected: selected.join(''),
      fromItems: fromItems.join(''),
    }
  },
  getToData(toId) {
    let selectedId = ''
    const selected = []
    const toItems = []
    const walletData = walletConf.getAll()
    if (toId >= 0) {
      selectedId = toId
    } else {
      selectedId = 1
    }
    // 获取已选择面板数据
    const selectedData = _(walletData).findWhere({
      id: selectedId,
    })
    const name = walletConf.get(selectedId).zhName
    const title = '转入钱包'
    selected.push(`<div class="js-tr-in-selectedItem" data-id="${selectedId}" data-name="${name}">`)
    selected.push(`<span class="js-tr-in-package-title tr-in-package-title"> ${title}</span>`)
    selected.push(`<span class="js-tr-in-name rc-desc text-center">${name}</span>`)
    selected.push('<span class="select-down js-tr-select-in-down"></span></div>')

    // 取未选中的支付方式信息并赋值
    const unSelectedData = _(walletData).without(selectedData)
    _(unSelectedData).each((item) => {
      const itemList = []
      const itemName = walletConf.get(item.id).zhName
      itemList.push(`<span class="js-tr-in-name rc-name">${itemName}</span>`)
      toItems.push(`<div class="js-tr-in-item fc-tr-in-item" data-id="${item.id}">${itemList.join('')}</div>`)
    })
    return {
      toSelected: selected.join(''),
      toItems: toItems.join(''),
    }
  },
  getQuickAmountHtml(amountList) {
    const setList = []
    let initAmount = 0
    _(amountList).each((amount, index) => {
      setList.push('<li class="js-tr-select-quickSet')
      if (index === 0) { // 默认选择第一个配置，并初始化充值金额的值
        setList.push(' active')
        initAmount = amount
      }
      setList.push(`"data-value='${amount}'>${amount}</li>`)
    })
    return {
      setHtml: setList.join(''),
      amount: initAmount,
    }
  },
}

