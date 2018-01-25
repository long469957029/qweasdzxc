import '../index.scss'

const rechargeService = require('../recharge/rechargeService')
const transferService = require('./transferService')
const TransferConfirmView = require('./transferConfirm')

const TransferView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .js-rc-next-step': 'submitPlatformTransferHandler',
    'click .js-fc-rc-pre': 'preStepHandler',
    // 'click .js-tr-select-out-down': 'selectOutDownHandler',
    // 'click .js-tr-select-in-down': 'selectInDownHandler',
    'click .js-tr-out-select': 'selectOutDownHandler',
    'click .js-tr-in-select': 'selectInDownHandler',
    'click .js-fc-tr-change': 'changeInOutStatusHandler',
    'click .js-tr-out-item': 'selectFromGameHandler',
    'click .js-tr-in-item': 'selectInGameHandler',
    'click .js-tr-select-quickSet': 'selectQuickSetHandler',
    'focus .js-fc-tr-change': 'focusInOutStatusHandler',
  },

  initialize() {
  },
  // 获取平台转账信息
  getPlatformInfoXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/gametransferinfo.json',
      data,
      abort: false,
    })
  },
  getPlatformTransferXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/gametransfer.json',
      data,
      tradition: true,
    })
  },
  getActivityInfo () {
    return Global.sync.ajax({
      async: false,
      url: '/info/activityCenter/fundList.json',
    })
  },
  onRender() {
    const self = this
    this.getActivityInfo()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          // 生成充值页广告
          this.$('.jc-rc-activity').html(rechargeService.getFunActivity(this.options.ac))
        } else {
          Global.ui.notification.show('服务器异常')
        }
      })
    // 初始化转出钱包选择框
    const fromData = transferService.getFromData()
    this.$('.js-tr-out-selected').html(fromData.fromSelected)
    this.$('.js-tr-out-items').html(fromData.fromItems)

    // 初始化转入钱包选择框
    const toData = transferService.getToData(fromData.fromSelected.id)
    this.$('.js-tr-in-selected').html(toData.toSelected)
    this.$('.js-tr-in-items').html(toData.toItems)
    // 初始化面板数据
    this.initTransferData()
    // 生成充值页广告
    this.$('.jc-rc-activity').html(rechargeService.getFunActivity(this.options.ac))
    // 初始化内容滑动效果数据
    this.conInnerConWidth = 740
    this.conSize = this.$('.jc-fc-rc-view').size()
    this.cur = this.options.cur
    // if (!this.cur) {
    //   this.cur = 0
    // }
    this.platformParsley = this.$('.js-fc-tr-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
  },
  // 初始化转账面板数据
  initTransferData() {
    const self = this
    const $from = this.$('.js-tr-out-selectedItem').data('id')
    const $to = this.$('.js-tr-in-selectedItem').data('id')
    this.getPlatformInfoXhr({channelId: Number($to) || Number($from) || '1'}).always(() => {
      this.loadingFinish()
    }).done((res) => {
      if (res.result === 0) {
        self.plaftfromData = res.root
        this.$('.fc-tr-amount-tips').toggleClass('hidden', false)
        this.$('.fc-rc-leftBar-bottom-area').css('top', '235px')
        self.renderPlatformTransferTypeLimit()
      }
    })
  },
  // 修改面板规则及展示数据
  renderPlatformTransferTypeLimit() {
    const prop = this.plaftfromData
    // this.platformParsley = this.$platformForm.parsley({
    //   errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
    //   errorTemplate: '<div class="tooltip-inner">',
    //   trigger: 'blur',
    // })
    const data = prop
    const to = this.$('.js-tr-in-selectedItem').data('id')
    if (to === 0) { // 从其他钱包转入中心钱包
      data.minMoney = prop.inMin
      data.maxMoney = prop.inMax
      data.tradeNum = prop.leftInTimes
      data.confNum = prop.inTimes
      data.validBalance = prop.gameValid
    } else { // 从中心钱包转入到其他钱包
      data.minMoney = prop.outMin
      data.maxMoney = prop.outMax
      data.tradeNum = prop.leftOutTimes
      data.confNum = prop.outTimes
      data.validBalance = prop.balance
    }
    // var valMin = _(data.minMoney).convert2yuan();
    // var valMax = _(data.maxMoney).convert2yuan();
    let valMin = data.minMoney
    let valMax = data.maxMoney
    let valTradeNum = data.tradeNum
    // let desMin = ''
    // let desMax = ''
    // let desTradeNum = ''

    if (valMin === 0) {
      valMin = 1
      // desMin = '（单笔最低转账金额无限制'
    }
    // else {
    //   desMin = `（最低转账金额<span class="js-fc-tf-minLimit text-pleasant">${valMin}</span>元`
    // }
    if (valMax === 0) {
      valMax = 5000000
      // desMax = ',最高转账金额无限制'
    }
    // else {
    //   desMax = `,最高转账金额<span class="js-fc-tf-maxLimit text-pleasant">${valMax}</span>元`
    // }
    if (data.confNum === 0) {
      valTradeNum = -1
      // desTradeNum = ',转账次数无限制）'
    }
    // else {
    //   desTradeNum = `,今日还可以转账<span class="text-pleasant">${valTradeNum}次</span>）`
    // }
    // 获取充值初始化金额
    const amountList = transferService.getQuickAmountHtml(data.amount)
    this.$('.js-tr-amount-input').val(amountList.amount)
    //  遍历取快捷金额配置
    this.$('.js-tr-quickPay-select').html(amountList.setHtml)
    this.$('.js-tr-balance').html(_(data.validBalance).convert2yuan())

    this.$('.js-tr-amount-input').attr('data-parsley-range', `[${valMin},${valMax}]`)
    this.$('.js-tr-amount-input').attr('data-parsley-max', _(data.validBalance).convert2yuan())
    this.$('.js-tr-tradeNum').val(valTradeNum)
    if (valTradeNum === 0) {
      this.$('.fc-rc-leftBar-submit').prop('disabled', true)
    } else {
      this.$('.fc-rc-leftBar-submit').prop('disabled', false)
    }
  },
  // 转出钱包列表下拉事件
  selectOutDownHandler() {
    // const from=this.$('.')
    const con = this.$('.js-tr-out-select').height()
    if (con < 100) {
      this.$('.js-tr-out-select').addClass('side-down')
      this.$('.js-tr-select-out-down').addClass('up')
    } else {
      this.$('.js-tr-out-select').removeClass('side-down')
      this.$('.js-tr-select-out-down').removeClass('up')
    }
  },
  // 转入钱包列表下拉事件
  selectInDownHandler() {
    const con = this.$('.js-tr-in-select').height()
    if (con < 100) {
      this.$('.js-tr-in-select').addClass('side-down')
      this.$('.js-tr-select-in-down').addClass('up')
    } else {
      this.$('.js-tr-in-select').removeClass('side-down')
      this.$('.js-tr-select-in-down').removeClass('up')
    }
  },
  // 选择转出钱包
  selectFromGameHandler(e) {
    const $target = $(e.currentTarget)
    this.$('.js-tr-out-select').removeClass('side-down').scrollTop(0)
    this.$('.js-tr-select-out-down').removeClass('up')
    const selectId = $target.data('id')
    const toId = this.$('.js-tr-in-selectedItem').data('id')
    if (selectId === 0) {
      // 重新初始化转出钱包框
      const fromData = transferService.getFromData(0)
      this.$('.js-tr-out-selected').html(fromData.fromSelected)
      this.$('.js-tr-out-items').html(fromData.fromItems)
      // 重新初始化转入钱包框
      if (toId === 0) {
        const toData = transferService.getToData()
        this.$('.js-tr-in-selected').html(toData.toSelected)
        this.$('.js-tr-in-items').html(toData.toItems)
      } else {
        const toData = transferService.getToData(toId)
        this.$('.js-tr-in-selected').html(toData.toSelected)
        this.$('.js-tr-in-items').html(toData.toItems)
      }
    } else {
      // 重新初始化转出钱包框
      const fromData = transferService.getFromData(selectId)
      this.$('.js-tr-out-selected').html(fromData.fromSelected)
      this.$('.js-tr-out-items').html(fromData.fromItems)
      const toData = transferService.getToData(0)
      this.$('.js-tr-in-selected').html(toData.toSelected)
      this.$('.js-tr-in-items').html(toData.toItems)
    }
    this.getPlatformInfoXhr({channelId: Number(toId) || Number(selectId) || '1'}).done((res) => {
      if (res.result === 0) {
        this.renderPlatformTransferTypeLimit()
      }
    })
  },
  // 选择转入钱包
  selectInGameHandler(e) {
    const $target = $(e.currentTarget)
    this.$('.js-tr-in-select').removeClass('side-down').scrollTop(0)
    this.$('.js-tr-select-in-down').removeClass('up')
    const selectId = $target.data('id')
    const fromId = this.$('.js-tr-out-selectedItem').data('id')
    if (selectId === 0) {
      // 重新初始化转出钱包框
      const toData = transferService.getToData(0)
      this.$('.js-tr-in-selected').html(toData.toSelected)
      this.$('.js-tr-in-items').html(toData.toItems)
      // 重新初始化转入钱包框
      if (fromId === 0) {
        const fromData = transferService.getFromData(1)
        this.$('.js-tr-out-selected').html(fromData.fromSelected)
        this.$('.js-tr-out-items').html(fromData.fromItems)
      } else {
        const fromData = transferService.getFromData(selectId)
        this.$('.js-tr-out-selected').html(fromData.fromSelected)
        this.$('.js-tr-out-items').html(fromData.fromItems)
      }
    } else {
      // 重新初始化转出钱包框
      const fromData = transferService.getFromData(0)
      this.$('.js-tr-out-selected').html(fromData.fromSelected)
      this.$('.js-tr-out-items').html(fromData.fromItems)
      const toData = transferService.getToData(selectId)
      this.$('.js-tr-in-selected').html(toData.toSelected)
      this.$('.js-tr-in-items').html(toData.toItems)
    }
    this.getPlatformInfoXhr({channelId: Number(selectId) || Number(fromId) || '1'}).done((res) => {
      if (res.result === 0) {
        this.renderPlatformTransferTypeLimit()
      }
    })
  },
  // // 点击充值确定按钮下一步操作判断
  // nextStepHandler() {
  //   if (this.cur < this.conSize - 1) {
  //     this.slide(this.conInnerConWidth, this.cur + 1)
  //   }
  //   const transferConfirmView = new TransferConfirmView()
  //   this.$('.jc-tr-confirm-view').html(transferConfirmView.render().el)
  //   this.submitPlatformTransferHandler()
  //   setInterval(this.redirect())
  // },
  preStepHandler() {
    if (this.cur > 0) {
      this.slide(this.conInnerConWidth, this.cur - 1)
    }
    this.render()
  },
  redirect() {
    const self = this
    let time = 3
    clearInterval(this.countdown)
    this.countdown = setInterval(() => {
      time -= 1
      this.$('.js-tr-leftSecond').text(time)
      if (time < 0) {
        self.countDownSecond = time
        clearInterval(self.countdown)
        this.preStepHandler()
      }
    }, 1000)
  },
  slide(conInnerConWidth, index) {
    this.$('.jc-fc-rc-maskCon').animate({marginLeft: `${-index * conInnerConWidth}px`})
    this.cur = index
  },
  focusInOutStatusHandler() {
    this.$('.js-fc-tr-change').toggleClass('sfa-icon-change', false)
    this.$('.js-fc-tr-change').toggleClass('sfa-icon-change-Deep', true)
  },
  // 切换转入转出位置
  changeInOutStatusHandler(e) {
    this.$('.js-fc-tr-change').toggleClass('sfa-icon-change', false)
    this.$('.js-fc-tr-change').toggleClass('sfa-icon-change-Deep', true)
    if (this.getInOutDataFlag) {
      return
    }
    this.getInOutDataFlag = true
    setTimeout(() => {
      this.getInOutDataFlag = false
    }, 1000)
    const $target = $(e.currentTarget)
    const fromChannel = this.$('.js-tr-out-selectedItem').data('id')
    const toChannel = this.$('.js-tr-in-selectedItem').data('id')
    // 重新初始化转出钱包框
    const fromData = transferService.getFromData(toChannel)
    this.$('.js-tr-out-selected').html(fromData.fromSelected)
    this.$('.js-tr-out-items').html(fromData.fromItems)
    // 重新初始化转入钱包框
    const toData = transferService.getToData(fromChannel)
    this.$('.js-tr-in-selected').html(toData.toSelected)
    this.$('.js-tr-in-items').html(toData.toItems)
    this.getPlatformInfoXhr({channelId: Number(toChannel) || Number(fromChannel) || '1'}).done((res) => {
      if (res.result === 0) {
        this.renderPlatformTransferTypeLimit()
      }
    })
    // 定义翻转动画
    const defaults = {
      speed: 200, // 翻转速度
    }
    const option = $.extend(defaults, $target)
    const parent = this.$('.js-tr-select').eq(1)
    // const parent = $(this).parents('.js-tr-select')
    const prevItem = this.$('.js-tr-select').eq(0)
    // if (prevItem.length === 0) {
    //   return
    // }
    const parentTop = $('.js-tr-select').eq(1).css('top')
    const prevItemTop = $('.js-tr-select').eq(0).css('top')
    $('.js-tr-select').eq(1).css('visibility', 'hidden')

    $('.js-tr-select').eq(0).css('visibility', 'hidden')
    parent.clone().insertAfter($('.js-tr-select').eq(1)).css({
      position: 'absolute',
      visibility: 'visible',
      top: parentTop,
    }).animate({top: prevItemTop}, option.speed, function () {
      $(this).remove()
      parent.insertBefore(prevItem).css('visibility', 'visible')
      // option.callback()
    })
    prevItem.clone().insertAfter($('.js-tr-select').eq(0)).css({
      position: 'absolute',
      visibility: 'visible',
      top: prevItemTop,
    }).animate({top: parentTop}, option.speed, function () {
      $(this).remove()
      prevItem.css('visibility', 'visible')
    })
    this.$('.js-fc-tr-change').toggleClass('sfa-icon-change', true)
    this.$('.js-fc-tr-change').toggleClass('sfa-icon-change-Deep', false)
  },
  submitPlatformTransferHandler() {
    if (this.$('.js-tr-tradeNum').val() === '' || Number(this.$('.js-tr-tradeNum').val()) === 0) {
      this.$('.js-fc-tr-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
        '<span class="parsley-error-text">可转账次数不足。</span><div>')
      return false
    }
    if (!this.platformParsley.validate()) {
      return false
    }
    // this.#$.button('loading')
    this.getPlatformTransferXhr({
      // moneyPwd: this.$('.js-fc-tfp-payPwd').val(),
      amount: this.$('.js-tr-amount-input').val(),
      fromChannelId: this.$('.js-tr-out-selectedItem').data('id'),
      toChannelId: this.$('.js-tr-in-selectedItem').data('id'),
    })
      .done((res) => {
        if (res && res.result === 0) {
          if (this.cur < this.conSize - 1) {
            this.slide(this.conInnerConWidth, this.cur + 1)
          }
          const transferConfirmView = new TransferConfirmView()
          this.$('.jc-tr-confirm-view').html(transferConfirmView.render().el)
          setInterval(this.redirect())
        } else {
          this.$('.js-fc-tr-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
            `<span class="parsley-error-text">${res.msg}</span><div>`)
        }
      })
  },
  // 选择快捷金额事件
  selectQuickSetHandler(e) {
    const $target = $(e.currentTarget)
    // 取消当前选择的快捷金额
    this.$('.js-tr-quickPay-select').find('.active').removeClass('active')
    // 选择当前选择的快捷金额
    $target.addClass('active')
    // 充值金额重新赋值
    const amount = $target.data('value')
    this.$('.js-tr-amount-input').val(amount)
  },
})

export default TransferView
