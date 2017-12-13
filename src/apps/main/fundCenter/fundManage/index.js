require('./index.scss')

const Timeset = require('com/timeset')
const BtnGroup = require('com/btnGroup')

const FundManageView = Base.ItemView.extend({

  className: '',
  template: require('fundCenter/fundManage/index.html'),

  events: {
    'click .js-fc-tf-change': 'changeFromTOHandler',
    'click .js-fc-fm-re-btn': 'rechargeHandler',
    'click .js-fc-fm-wd-btn': 'withdrawHandler',
    'click .js-fc-fm-operation-btn': 'goToTransferHandler', // js-fc-fm-operation-btn
    'click .js-fc-fm-refresh': 'refreshHandler',
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
      this.getFundSummaryXhr()
        .always(() => {
          $target.removeClass('fa-spin')
        }).done((res) => {
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
})

module.exports = FundManageView
