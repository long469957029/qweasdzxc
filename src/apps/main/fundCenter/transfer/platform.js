
require('./index.scss')
const LowMultiSelect = require('com/lowMultiSelect')

const MoneyTransferView = Base.ItemView.extend({

  template: require('fundCenter/transfer/platform.html'),

  className: 'fc-transfer-view',

  startOnLoading: true,

  events: {
    'click .js-fc-tfp-change': 'changeFromTOHandler',
    'click .js-fc-tfp-submit': 'submitPlatformTransferHandler',
    'change .js-fc-tfp-from': 'fromToChangeHandler',
    'change .js-fc-tfp-to': 'fromToChangeHandler',
  },


  // 获取转账信息
  getInfoXhr() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/gettradeinfo.json',
      abort: false,
    })
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


  getTransferXhr(data) {
    return Global.sync.ajax({
      url: '/fund/transfer/transfer.json',
      data,
      tradition: true,
    })
  },

  getLowLevelXhr() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getuserrelation.json',
      abort: false,
    })
  },

  initialize () {
  },

  onRender() {
    const self = this
    // this._parentView.renderAccountInfo();
    const acctInfo = Global.memoryCache.get('acctInfo')

    if (!acctInfo || acctInfo.userStatus === 100) {
      this.$('.js-fc-btn-submit').prop('disabled', true)

      Global.ui.notification.show('用户已被冻结，无法进行转账操作。')
    }

    this.$form = this.$('.js-fc-tru-form')
    this.$platformForm = this.$('.js-fc-tfp-form')
    this.$lowLevelSelect = this.$('.js-fc-lowLevelSelect')
    this.$btnSubmit = this.$('.js-fc-btn-submit')
    // 根据fromId和toId判断是否平台转账
    this.fromId = _.getUrlParam('fromId')
    this.toId = _.getUrlParam('toId')
    this.$from = this.$('.js-fc-tfp-from')
    this.$to = this.$('.js-fc-tfp-to')
    this.initPlatformTransferInfo()
  },

  initPlatformTransferInfo() {
    const self = this
    this.$('.js-fc-tru-form').toggleClass('hidden', true)
    this.$('.js-fc-tfp-form').toggleClass('hidden', true)
    // 选中转账from ,to
    if (this.fromId) {
      this.$('.js-fc-tfp-from').find(`option[value=${this.fromId}]`).prop('selected', true)
      this.$('.js-fc-tfp-from').trigger('change')
    }
    if (this.toId) {
      this.$('.js-fc-tfp-to').find(`option[value=${this.toId}]`).prop('selected', true)
      this.$('.js-fc-tfp-to').trigger('change')
    }
    this.getPlatformInfoXhr({ channelId: Number(this.toId) || Number(this.fromId) || '1' }).always(() => {
      self.loadingFinish()
    }).done((res) => {
      if (res.result == 0) {
        self.plaftfromData = res.root
        self.renderPlatformBasicInfo()
      } else {

      }
    })
  },
  renderPlatformBasicInfo() {
    const data = this.plaftfromData
    // if(data.pStatus === 1 && data.sStatus === 1) {
    //   this.$('.js-fc-tfp-form').removeClass('hidden');
    //   this.$('.js-fc-tfp-form').html('<div class="text-center m-top-lg">非常抱歉，平台转账功能目前已经关闭，如有疑问请联系在线客服。</div>');
    //   return false;
    // }
    // todo
    if (!data.hasMoneyPwd) {
      if (this.SecurityTip) {
        this.SecurityTip.destroy()
      }
      this.SecurityTip = this.$el.securityTip({
        content: '请补充完您的安全信息后再转账',
        hasMoneyPwd: data.hasMoneyPwd,
        hasBankCard: true,
        showBankCard: false,
        body: this.$el,
      }).securityTip('instance')
      return false
    }

    this.$('.js-fc-tfp-form').toggleClass('hidden', false)
    this.renderPlatformTransferTypeLimit()

    return true
  },
  renderPlatformTransferTypeLimit() {
    const prop = this.plaftfromData
    this.platformParsley = this.$platformForm.parsley({
      errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><div class="tooltip-arrow"></div></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'blur',
    })
    const data = prop
    const to = this.$to.val()
    if (to == 0) { // 转入中心
      data.minMoney = prop.inMin
      data.maxMoney = prop.inMax
      data.tradeNum = prop.leftInTimes
      data.confNum = prop.inTimes
      data.validBalance = prop.gameValid
    } else { // 转入游戏
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
    let desMin = ''
    let desMax = ''
    let desTradeNum = ''

    if (valMin === 0) {
      valMin = 1
      desMin = '（单笔最低转账金额无限制'
    } else {
      desMin = `（最低转账金额<span class="js-fc-tf-minLimit text-pleasant">${valMin}</span>元`
    }
    if (valMax === 0) {
      valMax = 5000000
      desMax = ',最高转账金额无限制'
    } else {
      desMax = `,最高转账金额<span class="js-fc-tf-maxLimit text-pleasant">${valMax}</span>元`
    }
    if (data.confNum === 0) {
      valTradeNum = -1
      desTradeNum = ',转账次数无限制）'
    } else {
      desTradeNum = `,今日还可以转账<span class="text-pleasant">${valTradeNum}次</span>）`
    }
    this.$('.js-fc-tfp-balance').html(_(data.validBalance).convert2yuan())
    const validBalance = Number(this.$('.js-fc-avail-money').html())
    this.$('.js-fc-tfp-amount').attr('data-parsley-range', `[${valMin},${valMax}]`)
    this.$('.js-fc-tfp-amount').attr('data-parsley-max', _(data.validBalance).convert2yuan())
    // this.$('.js-fc-tfp-valDesc').html(desMin+desMax+desTradeNum);
    this.$('.js-fc-tfp-tradeNum').val(valTradeNum)
    if (valTradeNum === 0) {
      this.$('.js-fc-tfp-submit').prop('disabled', true)
    } else {
      this.$('.js-fc-tfp-submit').prop('disabled', false)
    }
  },


  fromToChangeHandler(e) {
    const $target = $(e.currentTarget)
    const self = this
    const type = $target.data('type')
    const id = $target.val()
    const toId = this.$from.val()
    const fromId = this.$to.val()
    if (id == 0) {
      if (type == 'from') {
        this.$to.val(1)
      } else {
        this.$from.val(1)
      }
    } else if (type == 'from') {
      this.$to.val(0)
    } else {
      this.$from.val(0)
    }
    this.$from.trigger('blur')
    this.$to.trigger('blur')
    this.getPlatformInfoXhr({ channelId: Number(toId) || Number(fromId) || '1' }).done((res) => {
      if (res.result == 0) {
        self.plaftfromData = res.root
        self.renderPlatformTransferTypeLimit()
      }
    })
  },

  submitPlatformTransferHandler(e) {
    const self = this
    if (this.$('.js-fc-tfp-tradeNum').val() === '' || Number(this.$('.js-fc-tfp-tradeNum').val()) === '0') {
      Global.ui.notification.show('可转账次数不足。')
      return false
    }
    // var validBalance = Number(this.$('.js-fc-tfp-balance').html());
    // if(_(validBalance).isNumber() && _(validBalance).isFinite()) {
    //
    // } else {
    //   Global.ui.notification.show('可转账余额不足。');
    //   return false;
    // }

    if (!this.platformParsley.validate()) {
      return false
    }

    this.$btnSubmit.button('loading')

    this.getPlatformTransferXhr({
      moneyPwd: this.$('.js-fc-tfp-payPwd').val(),
      amount: this.$('.js-fc-tfp-amount').val(),
      fromChannelId: this.$from.val(),
      toChannelId: this.$to.val(),
    })
      .always(() => {
        self.$btnSubmit.button('reset')
      })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('转账成功。', {
            type: 'success',
          })
          self.render()
        } else if (_(res.root).isNumber()) {
          if (res.root > 0) {
            Global.ui.notification.show(`验证失败，您还有${res.root}次输入机会`)
          }
          if (res.root === 0) {
            Global.ui.notification.show('验证失败，请一个小时后再尝试！')
          }
        } else {
          Global.ui.notification.show(`验证失败，${res.msg}`)
        }
      })
  },
  changeFromTOHandler() {
    const fromChannel = this.$from.val()
    const toChannel = this.$to.val()
    this.$from.find(`option[value=${toChannel}]`).prop('selected', true)
    this.$to.find(`option[value=${fromChannel}]`).prop('selected', true)
    this.renderPlatformTransferTypeLimit()
  },
  transferCategoryClickHandler(e) {
    const $target = $(e.currentTarget)
    const category = $target.data('category')
    $target.addClass('active').siblings().removeClass('active')

    if (category == 1) {
      this.initUserTransferInfo()
    } else {
      this.initPlatformTransferInfo()
    }
  },
})

module.exports = MoneyTransferView
