/**
 * Created by steven on 2017/12/22.
 */
const quickPayConfig = require('com/fundOperate/quickPayConfig')
const bankConfig = require('com/fundOperate/bankConfig')

module.exports = {
  // 获取当前充值使用类型数据
  getPaymentInfo(type, data) {
    const lastPayInfo = []
    _(data).each((item) => {
      if (type === item.paymentType) {
        lastPayInfo.push(item)
        return false
      }
    })
    return lastPayInfo[0]
  },
  // 生成温馨提示语句
  get(id, min, max, fee, maxFee) {
    const onceMinCharge = `单次充值金额最低<span class="text-account-fund">${min}</span>元，`
    const onceMaxCharge = `最高<span class="text-account-fund">${max}</span>元，`
    const feeTips = `收取<span class="text-account-fund">${fee}%</span>手续费，`
    const maxFeeTips = `最高不超过<span class="text-account-fund">${maxFee}</span>元`
    let feeTotalTips = ''
    if (fee === 0 ) {
      feeTotalTips = '免手续费'
    } else {
      feeTotalTips = `${feeTips}${maxFeeTips}`
    }
    const html = []
    const tip1Html = []
    tip1Html.push(`${onceMinCharge}`)
    tip1Html.push(`${onceMaxCharge}`)
    tip1Html.push(`${feeTotalTips}`)
    html.push('1.')
    html.push(`<span>${tip1Html.join('')}</span></br>`)
    if (id === 6) {
      html.push('<span>2.晚上23:30-01:00，使用支付宝转账到银行卡时如果提示第二天到账，请勿付款</span></br>')
      html.push('<span>3.平台账户会不定时更换，请在获得最新信息后充值，否则损失自负</span>')
    } else if (id === 11) {
      html.push('<span>2.平台账户会不定时更换，请在获得最新信息后充值，否则损失自负</span></br>')
    }else if(id===16){
      html.push('<span>2.晚上23:30-01:00，使用微信转账到银行卡时如果提示第二天到账，请勿付款</span></br>')
      html.push('<span>3.平台账户会不定时更换，请在获得最新信息后充值，否则损失自负</span>')
    }
    return html.join('')
  },
  // 计算手续费，到账金额
  getFee(amount, feeChargeAmount, feeLimit, maxFeeLimit, type) {
    let fare = Number(amount) > feeChargeAmount ? _(amount).chain().formatMul(feeLimit).formatDiv(100, {fixed: 4})
      .value() : 0

    if (fare >= maxFeeLimit) {
      fare = maxFeeLimit
    }
    // 支付宝转账、银行卡转账，返还手续费
    if (parseInt(type, 10) === 6 || parseInt(type, 10) === 11) {
      amount = _.add(amount, fare)
    } else {
      amount -= fare
    }
    return {
      fareValue: _.isNaN(fare) ? 0 : fare,
      amountValue: _.isNaN(amount) ? 0 : amount,
    }
  },
  // 获取快捷金额html文件
  getQuickAmountHtml(lastPayInfo, type) {
    const setList = []
    let initAmount = 0
    if (lastPayInfo !== undefined) {
      _(lastPayInfo.keyAmount).each((amount, index) => {
        setList.push('<li class="js-rc-select-quickSet')
        if (index === 0) { // 默认选择第一个配置，并初始化充值金额的值
          setList.push(' active')
          initAmount = amount
        }
        setList.push(`" data-type='${type}' data-value='${amount}'>${amount}</li>`)
      })
    }
    return {
      setHtml: setList.join(''),
      amount: initAmount,
    }
  },
  // 获取充值页广告
  getFunActivity(activityList) {
    const definePic = []
    definePic.push('/info/imgs/public/27137')
    definePic.push('/info/imgs/public/27136')
    const viewHtml = '<a class="js-rc-close-dialog fc-rc-rightBar-ac-link btn-link" >查看更多优惠>></a>'
    const activityHtml = []
    let activityLength = 2
    _(activityList).each((ac) => {
      activityHtml.push(`<div class="js-rc-close-dialog fc-rc-rightBar-ac"><a class="ad-link" ><img src="${ac.bannerListUrl}"></a></div>`)
      activityLength -= 1
    })
    for (let i = 0; i < activityLength; i++) {
      activityHtml.push(`<div class="js-rc-close-dialog fc-rc-rightBar-ac"><a class="ad-link"><img src="${definePic[i]}"></a></div>`)
    }
    activityHtml.push(viewHtml)
    return activityHtml.join('')
  },
  // 处理手续费数据
  doFeeData(payInfo) {
    let minAmount = 0
    let maxAmount = 0
    let maxFeeLimit = 0
    let feeLimit = 0
    let feeChargeAmount = 0
    if (payInfo !== undefined) {
      minAmount = _(payInfo.minMoneyLimit).convert2yuan({fixed: 0})
      maxAmount = _(payInfo.maxMoneyLimit).convert2yuan({fixed: 0})
      maxFeeLimit = _(payInfo.maxFeeLimit).convert2yuan({fixed: 0})
      feeLimit = parseFloat(payInfo.feeLimit) / 100
      feeChargeAmount = _(payInfo.feeChargeAmount).convert2yuan({fixed: 0})
    }
    if (minAmount === 0) {
      minAmount = 1
    }
    if (maxAmount === 0) {
      maxAmount = 1000000
    }
    return {
      min: minAmount,
      max: maxAmount,
      limit: feeLimit,
      maxLimit: maxFeeLimit,
      charge: feeChargeAmount,
    }
  },
  // 获取支付列表信息并分类
  getPaymentTypeList(type, data) {
    const selected = []
    const items = []
    // 取已选中的支付方式信息并赋值
    let selectedData = _(data).findWhere({
      paymentType: type,
    })
    if (selectedData === undefined) {
      type = 1
      selectedData = _(data).findWhere({
        paymentType: 1,
      })
    }
    const logo = quickPayConfig.get(selectedData.paymentType).className
    const name = quickPayConfig.get(selectedData.paymentType).zhName
    selected.push(`<div class="js-fc-rc-payType-selectedItem" data-type="${selectedData.paymentType}" data-name="${name}"  data-id="${selectedData.paymentId}">`)
    selected.push(`<span class="js-rc-type-icon rc-icon ${logo}"></span>`)
    selected.push(`<span class="js-rc-type-name rc-name">${name}</span>`)
    selected.push('<span class="js-rc-type-desc rc-desc-more">其他支付方式</span>')//其他支付方式
    selected.push('<span class="select-down js-select-type-down"></span></div>')

    // 取未选中的支付方式信息并赋值
    const unSelectedData = _(data).without(selectedData)
    _(unSelectedData).each((item) => {
      const itemList = []
      const itemLogo = quickPayConfig.get(item.paymentType).className
      const itemName = quickPayConfig.get(item.paymentType).zhName
      itemList.push(`<span class="js-rc-type-icon rc-icon ${itemLogo}"></span>`)
      itemList.push(`<span class="js-rc-type-name rc-name">${itemName}</span>`)
      let desc = ''
      if (item.paymentType === 1 || item.paymentType === 4 || item.paymentType === 5) {
        desc = '<span class="js-rc-type-desc rc-desc">快捷，大额支付</span>'
      } else if (item.paymentType === 6 || item.paymentType === 11) {
        desc = '<span class="js-rc-type-desc rc-desc">稳定，成功率高</span>'
      } else if (item.paymentType === 14) {
        desc = '<span class="js-rc-type-desc rc-desc">手机银行支付必选</span>'
      } else {
        desc = '<span class="js-rc-type-desc rc-desc"></span>'
      }
      itemList.push(desc)
      items.push(`<div class="js-fc-rc-payType-item fc-rc-payType-item" data-type="${item.paymentType}">${itemList.join('')}</div>`)
    })
    return {
      selectedItem: selected.join(''),
      items: items.join(''),
      type: type,
    }
  },
  getBankList(type, data, id) {
    const selected = []
    const items = []
    let defaultID = ''
    let selectedData = []
    const typeData = _(data).findWhere({
      paymentType: type,
    })
    let unSelectedData = []

    // 如果是银行卡转账，银行数据从配置文件中获取
    if (type === 1 || type === 4 || type === 5) {
      if (id) {
        defaultID = id
      } else {
        defaultID = typeData.bankList[0].bankId
      }
      selectedData = _(typeData.bankList).findWhere({
        bankId: defaultID,
      })
      unSelectedData = _(typeData.bankList).without(selectedData)
    } else {
      if (id) {
        defaultID = id
      } else {
        defaultID = bankConfig.get(1).id
      }
      selectedData = _(bankConfig.getAll()).findWhere({
        id: defaultID,
      })
      unSelectedData = _(bankConfig.getAll()).without(selectedData)
    }

    // 取银行列表中第一行数据作为默认显示的银行
    const logo = bankConfig.get(defaultID).className

    const name = bankConfig.get(defaultID).zhName
    if(type===11){
      selected.push(`<div class="js-fc-rc-bank-selectedItem" data-type="${type}" data-name="${name}" data-id="${defaultID}">`)
    }else{
      selected.push(`<div class="js-fc-rc-bank-selectedItem" data-type="${type}" data-name="${name}" data-id="${defaultID}" data-code="${selectedData.bankCode}">`)
    }
    selected.push(`<span class="js-rc-type-icon rc-icon ${logo}"></span>`)
    selected.push(`<span class="js-rc-type-name rc-name">${name}</span>`)
    selected.push('<span class="js-rc-type-desc rc-desc-more">其他支付银行</span>')//其他支付银行
    selected.push('<span class="select-down js-select-bank-down"></span></div>')

    // 取未选中的支付方式信息并赋值

    _(unSelectedData).each((item) => {
      const itemList = []
      let bId = ''
      if (type === 11) {
        bId = item.id
      } else {
        bId = item.bankId
      }
      const itemLogo = bankConfig.get(bId).className
      const itemName = bankConfig.get(bId).zhName
      itemList.push(`<span class="js-rc-bank-icon rc-icon ${itemLogo}"></span>`)
      itemList.push(`<span class="js-rc-bank-name rc-name">${itemName}</span>`)
      items.push(`<div class="js-fc-rc-bank-item fc-rc-bank-item" data-id="${bId}" data-type="${type}">${itemList.join('')}</div>`)
    })
    return {
      selectedItem: selected.join(''),
      items: items.join(''),
    }
  },
  // // 初始化支付方式选择框
  // getSelectedPayHtml() {
  //
  // },
  // // 初始化其他支付方式
  // getPayItemsHtml() {
  // },
}

