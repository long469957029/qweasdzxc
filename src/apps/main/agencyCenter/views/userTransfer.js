
// const LowMultiSelect = require('com/lowMultiSelect')

const MoneyTransferView = Base.ItemView.extend({

  template: require('agencyCenter/templates/userTransfer.html'),

  className: 'ac-moneyTransfer-view',

  startOnLoading: true,

  events: {
    'click .js-ac-btn-submit': 'submitHandler',
    'click .js-transfer-type': 'renderTransferTypeLimit',
    'keyup .js-ac-input-search-user': 'searchHandler',
    'click .js-ac-selected-user': 'cancelSelectHandler',
    'click .js-user-select-all': 'selectAllHandler',
    'click .js-ac-more': 'acMoreHandler',
    'keyup .js-ac-tf-amount': 'keyUpHandler',
    'blur .js-ac-tf-amount': 'amountBlurHandler',
    'blur .js-ac-tf-payPwd': 'payPwdBlurHandler',
  },

  // 获取转账信息
  getInfoXhr() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/gettradeinfo.json',
      abort: false,
    })
  },

  getTransferXhr(data) {
    return Global.sync.ajax({
      url: '/fund/transfer/transfer.json',
      data,
      tradition: true,
    })
  },

  getSearchXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getSubAcctBameByNameLike.json',
      data,
    })
  },

  getLowLevelXhr() {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getuserrelation.json',
      abort: false,
    })
  },

  getLowLevelByIdXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subacctinfo/getsubacctnamebyid.json',
      data,
    })
  },

  initialize() {
    this.selectedUsers = []
  },

  onRender() {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')

    if (!acctInfo || acctInfo.userStatus === 100) {
      this.$('.js-ac-btn-submit').prop('disabled', true)

      Global.ui.notification.show('用户已被冻结，无法进行转账操作。')
    }

    this.$form = this.$('.js-ac-transfer-form')
    this.$lowLevelSelect = this.$('.js-ac-lowLevelSelect')
    this.$btnSubmit = this.$('.js-ac-btn-submit')

    this.$selectedContainer = this.$('.js-selected-container')
    this.$selectedShortContainer = this.$('.js-selected-short-container')
    this.$searchContainer = this.$('.js-ac-search-container')
    this.$selectContainer = this.$('.js-user-tree-list')
    this.$chooseListEmpty = this.$('.js-choose-list-empty')
    this.$errorText = this.$('.js-error-text')
    this.$acAmount = this.$('.js-ac-tf-amount')
    this.$acPayPwd = this.$('.js-ac-tf-payPwd')

    this.getInfoXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        self.data = res.root || {}
        if (res && res.result === 0) {
          if (self.renderBasicInfo(self.data)) {
            self.initUserList()
            // self.parsley = self.$form.parsley({
            //   errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
            //   errorTemplate: '<div class="tooltip-inner">',
            //   trigger: 'change',
            // })
            const optionsHtml = ['<option value="0">普通转账</option>']// 0普通转账, 1活动转账, 2分红转账
            // 开启活动转账
            if (res.root.activeTransStatus === 0) {
              optionsHtml.push('<option value="1">活动转账</option>')
            }
            // 开启分红转账
            if (res.root.dividTransferCfg && res.root.dividTransferCfg.open) {
              optionsHtml.push('<option value="2">分红转账</option>')
            }
            self.$('.js-transfer-type').html(optionsHtml.join(''))
          }
        } else {
          Global.ui.notification.show('获取转账相关信息失败。')
        }
      })
  },
  initUserList() {
    const self = this

    this.treeView = this.$('.js-user-tree-list').treeView({
      onClick(e, id, data) {
        self.selectUserClick(e, id, data)
        // self.selectUser(id, data.text)
      },
      onCollapsed(e, id, data, collapsed) {
        if (!collapsed) {
          self.renderLowLevel(e, id)
        }
      },
      checkIcon: true,
      showHeaderImg: true,
    }).treeView('instance')
    this.searchTreeView = this.$('.js-ac-search-container').treeView({
      onClick(e, id, data) {
        self.selectUserClick(e, id, data)
      },
      onCollapsed(e, id, data, collapsed) {
        if (!collapsed) {
          self.renderLowLevel(e, id)
        }
      },
      checkIcon: true,
      showHeaderImg: true,
    }).treeView('instance')

    this.getLowLevelXhr()
      .done((res) => {
        const data = res.root || {}
        if (res && res.result === 0) {
          if (res.root.sStatus === 0) {
            self.$('.js-ac-input-search-user').removeClass('hidden')
            self.treeView.insertNode(_(data.subNameList).map((sub) => {
              return {
                text: sub.subAcctName,
                value: sub.subAcctId,
                subItem: false,
                img: sub.img,
              }
            }))
            self.initRequestParams()
          }
        }
      })
  },

  initRequestParams() {
    const username = this.options.username
    const userId = this.options.userId
    if (!_(userId).isUndefined() && userId !== '' && !_(username).isUndefined() && !_(username).isNull()) {
      const user = {
        id: Number(userId),
        name: username,
      }
      this.selectedUsers.push(user)
      this.$(`.js-wt-title[data-no=${Number(userId)}]`).addClass('active')
      this.renderSelectedUsers()
    }
  },

  selectUserClick(e, id, data) {
    const $target = $(e.currentTarget)
    $target.toggleClass('active')
    if ($target.hasClass('active')) {
      this.selectUser(id, data.text)
    } else {
      this.cancelSelectHandler(e)
    }
  },

  selectUser(id, name) {
    const user = {
      id,
      name,
    }

    const find = _(this.selectedUsers).findWhere(user)
    if (!find) {
      this.selectedUsers.push(user)

      this.renderSelectedUsers()
    }
  },

  renderSelectedUsers() {
    if (_(this.selectedUsers).size() < 1) {
      this.$chooseListEmpty.removeClass('hidden')
      this.$selectedContainer.html('')
      this.$selectedShortContainer.html('')
    } else {
      this.$chooseListEmpty.addClass('hidden')
      const userArr = _(this.selectedUsers).chain().map((user) => {
        return `<li class="cursor-pointer m-left-sm" >
                  <span>${user.name}</span>
                  <a class="js-ac-selected-user text-inverse font-lg" data-id="${user.id}">&times;</a>
                  </li>`
      })
        .reverse()
        .value()
      let arr = userArr
      if (userArr.length > 10) {
        arr = userArr.slice(0, 10)
        arr.push('<a class="btn btn-link font-sm m-left-sm js-ac-more" data-type="open">展开更多<i class="fa fa-chevron-down" aria-hidden="true"></i></a>')
        userArr.push('<a class="btn btn-link font-sm m-left-sm m-top-sm js-ac-more" data-type="close">收起更多<i class="fa fa-chevron-down fa-rotate-180" aria-hidden="true"></i></a>')
      }
      this.$selectedShortContainer.html(arr.join(''))
      this.$selectedContainer.html(userArr.join(''))
    }
  },

  getAll() {
    return this.selectedUsers
  },

  searchHandler(e) {
    const self = this
    const $target = $(e.currentTarget)

    const val = _($target.val()).trim()

    if (val) {
      this.$searchContainer.removeClass('hidden')
      this.$selectContainer.addClass('hidden')

      this.getSearchXhr({
        subAcctName: val,
      })
        .done((res) => {
          const data = res.root || []
          if (res && res.result === 0) {
            if (_(data.subUsers).isEmpty()) {
              self.$searchContainer.html('<div class="text-center">没有匹配用户</div>')
            } else {
              self.searchTreeView.insertNode(_(data.subUsers).map((sub) => {
                return {
                  text: sub.subAcctName,
                  value: sub.subAcctId,
                  subItem: false,
                  img: sub.img,
                }
              }))
            }
          } else {
            self.$searchContainer.html('<div class="text-center">没有匹配用户</div>')
          }
        })
    } else {
      this.$searchContainer.addClass('hidden')
      this.$selectContainer.removeClass('hidden')
    }
  },

  renderBasicInfo() {
    const data = this.data
    if (data.pStatus === 1 && data.sStatus === 1) {
      this.$('.js-ac-transfer-form').removeClass('hidden')
      this.$('.js-ac-transfer-form').html('<div class="text-center m-top-lg">非常抱歉，平台转账功能目前已经关闭，如有疑问请联系在线客服。</div>')
      return false
    }
    if (!data.hasMoneyPwd) {
      if (this.securityTip) {
        this.securityTip.destroy()
      }
      this.securityTip = this.$el.securityTip({
        content: '请补充完您的安全信息后再转账',
        hasMoneyPwd: data.hasMoneyPwd,
        hasBankCard: true,
        showBankCard: false,
        body: this.$el,
      }).securityTip('instance')
      return
    }

    this.$('.js-ac-transfer-form').removeClass('hidden')
    this.$('.js-ac-avail-money').html(_(data.balance).convert2yuan())

    this.renderTransferTypeLimit()

    return true
  },

  renderTransferTypeLimit() {
    const data = this.data
    const type = this.$('.js-transfer-type').val()
    let valMin = _(data.minMoney).convert2yuan()
    let valMax = _(data.maxMoney).convert2yuan()
    let valTradeNum = data.tradeNum
    let desMin = ''
    let desMax = ''
    let desTradeNum = ''
    if (type === 2 && data.dividTransferCfg && data.dividTransferCfg.open) {
      valMin = _(data.dividTransferCfg.minMoneyLimit).convert2yuan()
      valMax = _(data.dividTransferCfg.maxMoneyLimit).convert2yuan()
      valTradeNum = data.dividTransferCfg.tradeNum
    }
    if (valMin === 0) {
      valMin = 1
      desMin = '（单笔最低转账金额无限制'
    } else {
      desMin = `（最低转账金额<span class="js-ac-tf-minLimit text-prominent">${valMin}</span>元`
    }
    if (valMax === 0) {
      valMax = 5000000
      desMax = ',最高转账金额无限制'
    } else {
      desMax = `,最高转账金额<span class="js-ac-tf-maxLimit text-prominent">${valMax}</span>元`
    }
    if (data.confNum === 0) {
      valTradeNum = -1
      desTradeNum = ',转账次数无限制）'
    } else {
      desTradeNum = `,今日还可以转账<span class="text-prominent">${valTradeNum}次</span>）`
    }
    this.valMin = valMin
    this.valMax = valMax

    this.$acAmount.attr('data-parsley-range', `[${valMin},${valMax}]`)
    $('.js-ac-user-transfer').html(desMin + desMax + desTradeNum)
    this.$('.js-ac-mt-tradeNum').val(valTradeNum)
    if (valTradeNum === 0) {
      this.$('.js-ac-btn-submit').prop('disabled', true)
    }
  },
  getErrorTool (errorText) {
    const errorHtml =
      `${'<div class="tooltip parsley-errors-list tooltip-error filled">' +
      '<span class="sfa sfa-error-icon vertical-sub pull-left"></span>' +
      '<div class="tooltip-inner">'}${errorText}</div>` +
      '</div>'
    this.$errorText.html(errorHtml)
  },
  changeEleClass ($ele, status) {
    if (status === 'success') {
      $ele.addClass('parsley-success').removeClass('parsley-error')
    } else if (status === 'error') {
      $ele.addClass('parsley-error').removeClass('parsley-success')
    }
  },
  // event handlers

  amountBlurHandler() {
    const val = this.$acAmount.val()
    let isValidate = false
    if (val === '') {
      this.changeEleClass(this.$acAmount, 'error')
      this.getErrorTool('请输入转账金额')
    } else if (Number(val) > this.valMax || Number(val) < this.valMin) {
      this.changeEleClass(this.$acAmount, 'error')
      this.getErrorTool(`转账金额最低${this.valMin}元，最高${this.valMax}元`)
    } else {
      this.$errorText.empty()
      this.changeEleClass(this.$acAmount, 'success')
      isValidate = true
    }
    return isValidate
  },
  payPwdBlurHandler() {
    const val = this.$acPayPwd.val()
    let isValidate = false
    if (val === '') {
      this.changeEleClass(this.$acPayPwd, 'error')
      this.getErrorTool('请输入资金密码')
    } else {
      this.$errorText.empty()
      this.changeEleClass(this.$acPayPwd, 'success')
      isValidate = true
    }
    return isValidate
  },

  submitHandler() {
    const self = this
    const sub = _(this.getAll()).pluck('id')
    if (this.$('.js-ac-mt-tradeNum').val() === '' || Number(this.$('.js-ac-mt-tradeNum').val()) === '0') {
      this.getErrorTool('可转账次数不足')
      return false
    }

    if (sub === null || _(sub).size() < 1) {
      this.getErrorTool('您还没有选择转账人')
      return false
    }

    const validBalance = Number(this.$('.js-ac-avail-money').html())
    if (_(validBalance).isNumber() && _(validBalance).isFinite()) {
      this.$acAmount.attr('data-parsley-max', _(validBalance).formatDiv(_(sub).size(), {
        fixed: false,
      }))
    } else {
      this.getErrorTool('可转账余额不足')
      return false
    }
    if (this.amountBlurHandler() && this.payPwdBlurHandler()) {
      this.$btnSubmit.button('loading')

      this.getTransferXhr({
        moneyPwd: this.$('.js-ac-tf-payPwd').val(),
        tradeMoney: this.$acAmount.val(),
        sub,
        type: this.$('.js-transfer-type').val(),
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
              self.getErrorTool(`验证失败，您还有${res.root}次输入机会`)
            }
            if (res.root === 0) {
              self.getErrorTool('验证失败，请一个小时后再尝试！')
            }
          } else {
            self.getErrorTool(`验证失败，${res.msg}`)
          }
        })
    }
  },
  cancelSelectHandler(e) {
    const $target = $(e.currentTarget)

    this.selectedUsers = _(this.selectedUsers).without(_(this.selectedUsers).findWhere({
      id: $target.data('id') || $target.data('no'),
    }))
    this.$(`.js-wt-title[data-no=${$target.data('id')}]`).removeClass('active')
    this.renderSelectedUsers()
  },
  selectAllHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    this.selectedUsers = []
    if (type === 'all') {
      this.$('.js-wt-title').addClass('active')
      _(this.$('.js-wt-title')).each((item) => {
        self.selectUser($(item).data('no'), $(item).data('data').text)
      })
    } else {
      this.$selectedContainer.empty()
      this.$('.js-wt-title').removeClass('active')
    }
    this.renderSelectedUsers()
  },
  acMoreHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    if (type === 'open') {
      this.$selectedContainer.removeClass('hidden')
      this.$selectedShortContainer.addClass('hidden')
    } else {
      this.$selectedContainer.addClass('hidden')
      this.$selectedShortContainer.removeClass('hidden')
    }
  },
  keyUpHandler(e) {
    const $target = $(e.currentTarget)
    const val = $target.val()
    const myReg = /^\d+(\.\d*)?$/
    const reg = myReg.test(val)
    if (!reg) {
      $target.val('')
    }
  },
})

module.exports = MoneyTransferView
