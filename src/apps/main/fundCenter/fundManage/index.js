require('./index.scss')
const transferService = require('com/fundOperate/transfer/transferService')

const Timeset = require('com/timeset')
const BtnGroup = require('com/btnGroup')

const FundManageView = Base.ItemView.extend({

  className: '',
  template: require('fundCenter/fundManage/index.html'),

  events: {
    // 'click .js-fc-tf-change': 'changeFromTOHandler',
    'click .js-fc-fm-re-btn': 'submitPlatformTransferHandler',
    'click .js-fc-fm-wd-btn': 'withdrawHandler',
    'click .js-fc-fm-operation-btn': 'goToTransferHandler', // js-fc-fm-operation-btn
    'click .js-fc-fm-refresh': 'refreshHandler',
    'click .js-fm-select-out-down': 'selectOutDownHandler',
    'click .js-fm-select-in-down': 'selectInDownHandler',
    'click .js-fm-out-item': 'selectFromGameHandler',
    'click .js-fm-in-item': 'selectInGameHandler',
    'click .js-fc-fm-change': 'changeInOutStatusHandler',
  },
  refreshHandler(e) {
    e.stopPropagation()
    e.preventDefault()
    const $target = $(e.currentTarget)

    // const id = $target.data('id')
    const time = $target.data('time')
    if (!time || time && (moment().valueOf() - Number(time)) > 30000) {
      $target.addClass('fa-spin')
      $target.data('time', moment().valueOf())
      this.getFundSummaryXhr().done((res) => {
        if (res.result === 0) {
          this.$('.js-fc-fm-to-mb').html(_(res.root.total).convert2yuan()) // 总余额
          this.$('.js-fc-fm-wv-mb').html(_(res.root.validBalance).convert2yuan()) // 可用余额
        }
      })
    } else {
      Global.ui.notification.show('请稍后再试!')
    }
  },
  rechargeHandler() {
    $('.js-gl-hd-re').trigger('click')
  },
  // withdrawHandler() {
  //   const acctInfo = Global.memoryCache.get('acctInfo')
  //
  //   if (!acctInfo || acctInfo.userStatus === 100) {
  //     Global.ui.notification.show('用户已被冻结，无法进行提现操作。')
  //     return false
  //   }
  //   if (Global.memoryCache.get('acctInfo').foundsLock) {
  //     Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
  //       'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
  //       'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
  //     return false
  //   }
  //
  //   Global.appRouter.navigate('#fc/wd', {trigger: true, replace: false})
  // },
  // 获取平台转账信息
  getPlatformInfoXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/gametransferinfo.json',
      data,
      abort: false,
    })
  },
  goToTransferHandler(e) {
    const $target = $(e.currentTarget)
    const channelId = $target.closest('.js-fc-fm-channel-operation').data('channelid')
    const type = $target.data('type')
    if (type === 0) {
      Global.router.goTo(`fc/tr?fromId=${channelId}`)
    } else {
      Global.router.goTo(`fc/tr?toId=${channelId}`)
    }
  },

  // getChannelAmountXhr(data) {
  //   return Global.sync.ajax({
  //     url: '/fund/balance/gamebalance.json',
  //     data,
  //   })
  // },

  // refreshChannelAmountXhr(data) {
  //   return Global.sync.ajax({
  //     url: '/fund/balance/balance.json',
  //     data,
  //   })
  // },
  getFundSummaryXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/summary.json',
      data,
    })
  },
  getPlatformTransferXhr(data) {
    return Global.sync.ajax({
      url: '/fund/balance/gametransfer.json',
      data,
      tradition: true,
    })
  },
  getRechargeWithdrawlXhr(data) {
    return Global.sync.ajax({
      url: '/info/gamereport/recharge.json',
      data,
    })
  },
  getProfitXhr(data) {
    return Global.sync.ajax({
      url: '/info/gamereport/profit.json',
      data,
    })
  },
  initialize() {
    // const acctInfo = Global.memoryCache.get('acctInfo')
    this.AccountXhr = this.getFundSummaryXhr()
  },
  onRender() {
    const self = this
    this.$btnGroup = this.$('.js-fm-btnGroup')
    this.$timeset = this.$('.js-fm-timeset')
    this.$Recharge = this.$('.js-fc-to-re')
    this.$Withdraw = this.$('.js-fc-to-wi')
    this.$Bet = this.$('.js-fc-to-be')
    this.$Bonus = this.$('.js-fc-to-bo')
    this.$Rebate = this.$('.js-fc-to-reb')
    this.$Activity = this.$('.js-fc-to-ac')
    this.$Profit = this.$('.js-fc-to-pr')
    this.$back = this.$('.js-fc-to-ba')

    // 根据fromId和toId判断是否平台转账
    this.fromId = _.getUrlParam('fromId')
    this.toId = _.getUrlParam('toId')
    this.$from = this.$('.js-fc-tf-from')
    this.$to = this.$('.js-fc-tf-to')

    this.timeset = new Timeset({
      el: this.$timeset,
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      startOps: {
        format: 'YYYY-MM-DD HH:MM:SS',
      },
      endOps: {
        format: 'YYYY-MM-DD HH:MM:SS',
      },
      showIcon: true,
      size: 'timer-record-input',
    }).render()

    this.timeset.$startDate.on('dp.change', () => {
      if (self.btnGroup) {
        self.btnGroup.clearSelect()
      }
      const reqData = {
        startTime: self.timeset.$startDate.val(),
        endTime: self.timeset.$endDate.val(),
      }
      self.renderOtherData(reqData)
    })

    this.timeset.$endDate.on('dp.change', () => {
      if (self.btnGroup) {
        self.btnGroup.clearSelect()
      }
      const reqData = {
        startTime: self.timeset.$startDate.val(),
        endTime: self.timeset.$endDate.val(),
      }
      self.renderOtherData(reqData)
    })

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      onBtnClick(offset) {
        self.timeset.$startDate.data('DateTimePicker').date(moment().add(offset, 'days').startOf('day'))
        self.timeset.$endDate.data('DateTimePicker').date(moment().add(offset < 0 ? -1 : 0, 'days').endOf('day'))
      },
    }).render()
    this.renderAccountInfo()

    // 初始化转出钱包选择框
    const fromData = transferService.getFundFromData()
    this.$('.js-fm-out-selected').html(fromData.fromSelected)
    this.$('.js-fm-out-items').html(fromData.fromItems)

    // 初始化转入钱包选择框
    const toData = transferService.getFundToData(fromData.fromSelected.id)
    this.$('.js-fm-in-selected').html(toData.toSelected)
    this.$('.js-fm-in-items').html(toData.toItems)

    this.platformParsley = this.$('.js-fc-fm-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
    const $from = this.$('.js-fm-out-selectedItem').data('id')
    const $to = this.$('.js-fm-in-selectedItem').data('id')
    this.getPlatformInfoXhr({ channelId: Number($to) || Number($from) || '1' }).always(() => {
      this.loadingFinish()
    }).done((res) => {
      if (res.result === 0) {
        self.plaftfromData = res.root
        self.renderPlatformTransferTypeLimit()
      }
    })
  },
  renderAccountInfo() {
    const self = this
    // const acctInfo = Global.memoryCache.get('acctInfo')
    // // if (acctInfo.userRebate <= 128) {
    // //   this.$('.js-fc-fm-channel-operation').removeClass('hidden')
    // // }
    // // 配置锁定
    // if (acctInfo.foundsLock) {
    //   this.$('.js-fc-fm-lock').html('资金解锁').data('status', '1')// sfa-h-locked
    // } else {
    //   this.$('.js-fc-fm-lock').html('资金锁定').data('status', '0')// sfa-h-unlocked
    // }
    $.when(this.AccountXhr).done((res) => {
      if (res.result === 0) {
        self.$('.js-fc-fm-to-mb').html(_(res.root.total).convert2yuan())// 总余额
        self.$('.js-fc-fm-wv-mb').html(_(res.root.validBalance).convert2yuan())// 可用余额
        _(res.root.gameBalance).each((game) => {
          const channelId = game.channelId
          if (channelId === 0) {
            self.$('.js-fc-fm-mb-ce').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) //  总钱包余额
          } else if (channelId === 1) {
            self.$('.js-fc-fm-mb-ag').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // ag余额
          } else if (channelId === 2) {
            self.$('.js-fc-fm-mb-ebet').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // ebet余额
          } else if (channelId === 3) {
            self.$('.js-fc-fm-mb-bbin').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // bbin
          } else if (channelId === 4) {
            self.$('.js-fc-fm-mb-pt').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // pt余额
          } else if (channelId === 5) {
            self.$('.js-fc-fm-mb-mg').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // mg余额
          } else if (channelId === 6) {
            self.$('.js-fc-fm-mb-gg').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // gg余额
          } else if (channelId === 7) {
            self.$('.js-fc-fm-mb-188').find('.js-fc-fm-channel-amount').html(_(game.balance).convert2yuan()) // 188余额
          }
        })
      }
    })
  },
  renderOtherData(reqData) {
    const self = this
    // this.getNewUserActiveUserXhr(reqData).done((res) => {
    //   if (res.result == 0) {
    //     self.$NewUser.html(`${res.root.newSub}/${res.root.active}`)
    //   }
    // })
    this.getRechargeWithdrawlXhr(reqData).done((res) => {
      if (res.result === 0) {
        if (res.root.recharge > 0) {
          self.$Recharge.closest('li').addClass('active')
          self.$Recharge.html(_(res.root.recharge).convert2yuan())
        }
        if (res.root.withdraw > 0) {
          self.$Withdraw.closest('li').addClass('active')
          self.$Withdraw.html(_(res.root.withdraw).convert2yuan())
        }
      }
    })
    this.getProfitXhr(reqData).done((res) => {
      if (res.result === 0) {
        if (res.root.bet > 0) {
          self.$Bet.closest('li').addClass('active')
          self.$Bet.html(_(res.root.bet).convert2yuan())
        }
        if (res.root.prize > 0) {
          self.$Bonus.closest('li').addClass('active')
          self.$Bonus.html(_(res.root.prize).convert2yuan())
        }
        if (res.root.rebate > 0) {
          self.$Rebate.closest('li').addClass('active')
          self.$Rebate.html(_(res.root.rebate).convert2yuan())
        }
        if (res.root.rebate > 0) {
          self.$back.closest('li').addClass('active')
          self.$back.html(_(res.root.rebate).convert2yuan())
        }
        if (res.root.activity > 0) {
          self.$Activity.closest('li').addClass('active')
          self.$Activity.html(_(res.root.activity).convert2yuan())
        }
        if (res.root.profit > 0) {
          self.$Profit.closest('li').addClass('active')
          self.$Profit.html(_(res.root.profit).convert2yuan())
        }
      }
    })
  },
  changeFromTOHandler() {
    const fromChannel = this.$from.val()
    const toChannel = this.$to.val()
    this.$from.find(`option[value=${toChannel}]`).prop('selected', true)
    this.$to.find(`option[value=${fromChannel}]`).prop('selected', true)
    // this.renderPlatformTransferTypeLimit()
  },
  // 转出钱包列表下拉事件
  selectOutDownHandler() {
    const con = this.$('.js-fm-out-select').height()
    if (con < 100) {
      this.$('.js-fm-out-select').addClass('side-down')
      this.$('.js-fm-select-out-down').addClass('up')
    } else {
      this.$('.js-fm-out-select').removeClass('side-down')
      this.$('.js-fm-select-out-down').removeClass('up')
    }
  },
  // 转入钱包列表下拉事件
  selectInDownHandler() {
    const con = this.$('.js-fm-in-select').height()
    if (con < 100) {
      this.$('.js-fm-in-select').addClass('side-down')
      this.$('.js-fm-select-in-down').addClass('up')
    } else {
      this.$('.js-fm-in-select').removeClass('side-down')
      this.$('.js-fm-select-in-down').removeClass('up')
    }
  },
  // 选择转出钱包
  selectFromGameHandler(e) {
    const $target = $(e.currentTarget)
    this.$('.js-fm-out-select').removeClass('side-down').scrollTop(0)
    this.$('.js-fm-select-out-down').removeClass('up')
    const selectId = $target.data('id')
    const toId = this.$('.js-fm-out-item').data('id')
    if (selectId === 0) {
      // 重新初始化转出钱包框
      const fromData = transferService.getFundFromData(0)
      this.$('.js-fm-out-selected').html(fromData.fromSelected)
      this.$('.js-fm-out-items').html(fromData.fromItems)
      // 重新初始化转入钱包框
      if (toId === 0) {
        const toData = transferService.getFundToData()
        this.$('.js-fm-in-selected').html(toData.toSelected)
        this.$('.js-fm-in-items').html(toData.toItems)
      } else {
        const toData = transferService.getFundToData(toId)
        this.$('.js-fm-in-selected').html(toData.toSelected)
        this.$('.js-fm-in-items').html(toData.toItems)
      }
    } else {
      // 重新初始化转出钱包框
      const fromData = transferService.getFundFromData(selectId)
      this.$('.js-fm-out-selected').html(fromData.fromSelected)
      this.$('.js-fm-out-items').html(fromData.fromItems)
      const toData = transferService.getFundToData(0)
      this.$('.js-fm-in-selected').html(toData.toSelected)
      this.$('.js-fm-in-items').html(toData.toItems)
    }
    this.getPlatformInfoXhr({ channelId: Number(toId) || Number(selectId) || '1' }).done((res) => {
      if (res.result === 0) {
        this.renderPlatformTransferTypeLimit()
      }
    })
  },
  // 选择转入钱包
  selectInGameHandler(e) {
    const $target = $(e.currentTarget)
    this.$('.js-fm-in-select').removeClass('side-down').scrollTop(0)
    this.$('.js-fm-select-in-down').removeClass('up')
    const selectId = $target.data('id')
    const fromId = this.$('.js-fm-out-selectedItem').data('id')
    if (selectId === 0) {
      // 重新初始化转出钱包框
      const toData = transferService.getFundToData(0)
      this.$('.js-fm-in-selected').html(toData.toSelected)
      this.$('.js-fm-in-items').html(toData.toItems)
      // 重新初始化转入钱包框
      if (fromId === 0) {
        const fromData = transferService.getFundFromData(1)
        this.$('.js-fm-out-selected').html(fromData.fromSelected)
        this.$('.js-fm-out-items').html(fromData.fromItems)
      } else {
        const fromData = transferService.getFundFromData(selectId)
        this.$('.js-fm-out-selected').html(fromData.fromSelected)
        this.$('.js-fm-out-items').html(fromData.fromItems)
      }
    } else {
      // 重新初始化转出钱包框
      const fromData = transferService.getFundFromData(0)
      this.$('.js-fm-out-selected').html(fromData.fromSelected)
      this.$('.js-fm-out-items').html(fromData.fromItems)
      const toData = transferService.getFundToData(selectId)
      this.$('.js-fm-in-selected').html(toData.toSelected)
      this.$('.js-fm-in-items').html(toData.toItems)
    }
    this.getPlatformInfoXhr({ channelId: Number(selectId) || Number(fromId) || '1' }).done((res) => {
      if (res.result === 0) {
        this.renderPlatformTransferTypeLimit()
      }
    })
  },

  changeInOutStatusHandler(e) {
    if (this.getInOutDataFlag) {
      return
    }
    this.getInOutDataFlag = true
    setTimeout(() => {
      this.getInOutDataFlag = false
    }, 1000)
    const $target = $(e.currentTarget)
    const fromChannel = this.$('.js-fm-out-selectedItem').data('id')
    const toChannel = this.$('.js-fm-in-selectedItem').data('id')
    // 重新初始化转出钱包框
    const fromData = transferService.getFundFromData(toChannel)
    this.$('.js-fm-out-selected').html(fromData.fromSelected)
    this.$('.js-fm-out-items').html(fromData.fromItems)
    // 重新初始化转入钱包框
    const toData = transferService.getFundToData(fromChannel)
    this.$('.js-fm-in-selected').html(toData.toSelected)
    this.$('.js-fm-in-items').html(toData.toItems)
    this.getPlatformInfoXhr({ channelId: Number(toChannel) || Number(fromChannel) || '1' }).done((res) => {
      if (res.result === 0) {
        this.renderPlatformTransferTypeLimit()
      }
    })
    // 定义翻转动画
    const defaults = {
      speed: 200, // 翻转速度
    }
    const option = $.extend(defaults, $target)
    const parent = this.$('.js-fm-select').eq(1)
    // const parent = $(this).parents('.js-tr-select')
    const prevItem = this.$('.js-fm-select').eq(0)
    // if (prevItem.length === 0) {
    //   return
    // }
    const parentTop = $('.js-fm-select').eq(1).css('top')
    const prevItemTop = $('.js-fm-select').eq(0).css('top')
    $('.js-fm-select').eq(1).css('visibility', 'hidden')

    $('.js-fm-select').eq(0).css('visibility', 'hidden')
    parent.clone().insertAfter($('.js-fm-select').eq(1)).css({
      position: 'absolute',
      visibility: 'visible',
      top: parentTop,
    }).animate({ top: prevItemTop }, option.speed, function () {
      $(this).remove()
      parent.insertBefore(prevItem).css('visibility', 'visible')
      // option.callback()
    })
    prevItem.clone().insertAfter($('.js-fm-select').eq(0)).css({
      position: 'absolute',
      visibility: 'visible',
      top: prevItemTop,
    }).animate({ top: parentTop }, option.speed, function () {
      $(this).remove()
      prevItem.css('visibility', 'visible')
    })
  },
  // 修改面板规则及展示数据
  renderPlatformTransferTypeLimit() {
    const prop = this.plaftfromData
    const data = prop
    const to = this.$('.js-fm-in-selectedItem').data('id')
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
    this.$('.js-fm-out-money').val(amountList.amount)
    //  遍历取快捷金额配置
    this.$('.js-fm-out-money').attr('data-parsley-range', `[${valMin},${valMax}]`)
    this.$('.js-fm-out-money').attr('data-parsley-max', _(data.validBalance).convert2yuan())
    this.$('.js-fm-tradeNum').val(valTradeNum)
    if (valTradeNum === 0) {
      this.$('.js-fc-tf-button').prop('disabled', true)
    } else {
      this.$('.js-fc-tf-button').prop('disabled', false)
    }
  },
  submitPlatformTransferHandler() {
    if (this.$('.js-fm-tradeNum').val() === '' || Number(this.$('.js-fm-tradeNum').val()) === 0) {
      this.$('.js-fc-fm-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
        '<span class="parsley-error-text">可转账次数不足。</span><div>')
      return false
    }
    if (!this.platformParsley.validate()) {
      return false
    }
    // this.#$.button('loading')
    this.getPlatformTransferXhr({
      // moneyPwd: this.$('.js-fc-tfp-payPwd').val(),
      amount: this.$('.js-fm-out-money').val(),
      fromChannelId: this.$('.js-fm-out-selectedItem').data('id'),
      toChannelId: this.$('.js-fm-in-selectedItem').data('id'),
    })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('转账成功。', {
            type: 'success',
          })
        } else {
          this.$('.js-fc-fm-error-container').html('<div class="parsley-error-line"><span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
            `<span class="parsley-error-text">${res.msg}</span><div>`)
        }
      })
  },
})

module.exports = FundManageView
