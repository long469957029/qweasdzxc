
// const LowMultiSelect = require('com/lowMultiSelect')

const MoneyTransferView = Base.ItemView.extend({

  template: require('agencyCenter/templates/userTransfer.html'),

  className: 'fc-moneyTransfer-view',

  startOnLoading: true,

  events: {
    'click .js-fc-btn-submit': 'submitHandler',
    'click .js-transfer-type': 'renderTransferTypeLimit',
    'keyup .js-ac-input-search-user': 'searchHandler',
    'click .js-ac-selected-user': 'cancelSelectHandler',
    'click .js-user-select-all': 'selectAllHandler',
    'click .js-ac-more': 'acMoreHandler',
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
      this.$('.js-fc-btn-submit').prop('disabled', true)

      Global.ui.notification.show('用户已被冻结，无法进行转账操作。')
    }

    this.$form = this.$('.js-fc-transfer-form')
    this.$lowLevelSelect = this.$('.js-fc-lowLevelSelect')
    this.$btnSubmit = this.$('.js-fc-btn-submit')

    this.$selectedContainer = this.$('.js-selected-container')
    this.$selectedShortContainer = this.$('.js-selected-short-container')
    this.$searchContainer = this.$('.js-ac-search-container')
    this.$selectContainer = this.$('.js-user-tree-list')
    this.$chooseListEmpty = this.$('.js-choose-list-empty')

    this.getInfoXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        self.data = res.root || {}
        if (res && res.result === 0) {
          if (self.renderBasicInfo(self.data)) {
            self.initUserList()
            self.initRequestParams()
            self.parsley = self.$form.parsley({
              errorsWrapper: '<div class="tooltip bottom parsley-errors-list tooltip-error"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
              errorTemplate: '<div class="tooltip-inner">',
              trigger: 'change',
            })
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
            // const list = _(data.subNameList).map((sub) => {
            //   return `<li><a class="js-ac-user-info" ></a></li>`
            // })
            self.treeView.insertNode(_(data.subNameList).map((sub) => {
              return {
                text: sub.subAcctName,
                value: sub.subAcctId,
                subItem: false,
                img: sub.img,
              }
            }))
          }
        }
      })
  },

  initRequestParams() {
    let username
    if (this.options.reqData) {
      const userId = this.options.reqData.userId
      if (!_(userId).isUndefined() && userId !== '') {
        username = this.options.reqData.username
        this.lowMultiSelect.selectUser(Number(userId), username)
      }
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
      this.$('.js-fc-transfer-form').removeClass('hidden')
      this.$('.js-fc-transfer-form').html('<div class="text-center m-top-lg">非常抱歉，平台转账功能目前已经关闭，如有疑问请联系在线客服。</div>')
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

    this.$('.js-fc-transfer-form').removeClass('hidden')
    this.$('.js-fc-avail-money').html(_(data.balance).convert2yuan())

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
      desMin = `（最低转账金额<span class="js-fc-tf-minLimit text-prominent">${valMin}</span>元`
    }
    if (valMax === 0) {
      valMax = 5000000
      desMax = ',最高转账金额无限制'
    } else {
      desMax = `,最高转账金额<span class="js-fc-tf-maxLimit text-prominent">${valMax}</span>元`
    }
    if (data.confNum === 0) {
      valTradeNum = -1
      desTradeNum = ',转账次数无限制）'
    } else {
      desTradeNum = `,今日还可以转账<span class="text-prominent">${valTradeNum}次</span>）`
    }

    this.$('.js-fc-tf-amount').attr('data-parsley-range', `[${valMin},${valMax}]`)
    $('.js-ac-user-transfer').html(desMin + desMax + desTradeNum)
    this.$('.js-fc-mt-tradeNum').val(valTradeNum)
    if (valTradeNum === 0) {
      this.$('.js-fc-btn-submit').prop('disabled', true)
    }
  },

  // event handlers

  submitHandler() {
    const self = this
    const sub = _(this.getAll()).pluck('id')
    if (this.$('.js-fc-mt-tradeNum').val() === '' || Number(this.$('.js-fc-mt-tradeNum').val()) === '0') {
      Global.ui.notification.show('可转账次数不足。')
      return false
    }

    if (sub === null || _(sub).size() < 1) {
      Global.ui.notification.show('请先选择需要转账的用户。')
      return false
    }

    const validBalance = Number(this.$('.js-fc-avail-money').html())
    if (_(validBalance).isNumber() && _(validBalance).isFinite()) {
      this.$('.js-fc-tf-amount').attr('data-parsley-max', _(validBalance).formatDiv(_(sub).size(), {
        fixed: false,
      }))
    } else {
      Global.ui.notification.show('可转账余额不足。')
      return false
    }

    if (!this.parsley.validate()) {
      return false
    }

    this.$btnSubmit.button('loading')

    this.getTransferXhr({
      moneyPwd: this.$('.js-fc-tf-payPwd').val(),
      tradeMoney: this.$('.js-fc-tf-amount').val(),
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
})

module.exports = MoneyTransferView
