

const findPwdView = Base.ItemView.extend({

  template: require('userCenter/templates/passwordManage-findPwd.html'),

  // 构造通过安全问题找回资金密码页面
  bySQTpl: _.template(require('userCenter/templates/passwordManage-bySQ.html')),
  // 构造通过银行卡信息找回资金密码页面
  byCITpl: _.template(require('userCenter/templates/passwordManage-byCI.html')),

  events: {
    // 选择找回资金密码的方式
    'click .js-ac-findBySQBtn': 'findBySqHandler',
    // 选择找回资金密码的方式
    'click .js-ac-findByCIBtn': 'findByCIHandler',

    'click .js-ac-return-select': 'returnSelectHandler',

    // 验证安全问题
    'click .js-ac-securityQuestionAnswer-submit': 'inputSecurityQuestionHandler',
    'change .js-ac-findByQuestionSelect': 'questionSelectChangeHandler',
    // 验证银行卡信息
    'click .js-ac-cardInfo-submit': 'inputCardInfoHandler',
    // 返回按钮
    'click .js-ac-findFundGoStep': 'findFundGoStepHandler',
    // 重置资金密码
    'click .js-as-resetFundPassword-submit': 'resetFundPasswordHandler',
  },

  getRechargeBaseInfoXhr() {
    return Global.sync.ajax({
      url: '/fund/recharge/rechargetype.json',
    })
  },

  // 渲染时绑定事件、创建的对象、执行初始化
  onRender() {
    const self = this
    // 找回资金密码Container
    this.$findFundPasswordContainer = this.$('.js-ac-findFundPasswordContainer')

    // 初始化分步操作控件js-findFundPassword-div
    this._initSteps()

    this.$selectWay = this.$('.js-ac-selectWay')
    this.$validate = this.$('.js-ac-validate')

    // 获取展示不同找回密码方式页面的区域
    this.$resetContainer = this.$('.js-ac-validate')

    const $findWayContainer = this.$('.js-ac-findWayContainer')

    Global.sync.ajax({
      url: '/acct/usersecurity/getsecurity.json',
    })
      .fail(() => {
      //  Global.ui.notification.show('获取密保问题配置信息失败');
      })
      .done((res) => {
        if (res && res.result === 0) {
          // 0表示密保问题不存在，则不能通过密保问题找回资金密码
          // 隐藏立即找回按钮
          self.$('.js-ac-findBySQBtn').addClass('hidden')
          // 显示为不可用的提示文字
          self.$('.js-ac-findBySQ-notice').removeClass('hidden')
          $findWayContainer.removeClass('hidden')
        } else if (res && res.result === 1) {
          // 1表示密保问题存在
          self.$('.js-ac-findBySQBtn').removeClass('hidden')
          // 显示为不可用的提示文字
          self.$('.js-ac-findBySQ-notice').addClass('hidden')
          $findWayContainer.removeClass('hidden')
        } else {
          // 其他情况隐藏该页面
        }
      })

    this.getRechargeBaseInfoXhr()
      .done((res) => {
        if (res.result === 0) {
          self.responseData = res.root
          const hasBankCard = !!self.responseData.hasBankCard

          if (hasBankCard) {
            // 0表示密保问题不存在，则不能通过密保问题找回资金密码
            // 隐藏立即找回按钮
            self.$('.js-ac-findByCIBtn').removeClass('hidden')
            // 显示为不可用的提示文字
            self.$('.js-ac-findByCI-notice').addClass('hidden')
            $findWayContainer.removeClass('hidden')
          } else {
            // 1表示密保问题存在
            self.$('.js-ac-findByCIBtn').addClass('hidden')
            // 显示为不可用的提示文字
            self.$('.js-ac-findByCI-notice').removeClass('hidden')
            $findWayContainer.removeClass('hidden')
          }
        }
      })
  },

  _initSteps() {
    this.$findFundPasswordContainer.steps({
      headerTag: 'h3',
      bodyTag: '.js-ac-steps',
      forceMoveForward: false,
      enablePagination: false,
      transitionEffect: 'slideLeft',
      onStepChanging(event, currentIndex, newIndex) {
        return newIndex !== 3
      },
    })
  },

  findBySqHandler() {
    const self = this

    this.$validate.html(this.bySQTpl())

    this.$selectWay.addClass('hidden')
    this.$validate.removeClass('hidden')

    Global.sync.ajax({
      url: '/acct/usersecurity/getuserecurityqes.json',
    })
      .done((res) => {
        if (res && res.result === 0) {
          // 添加密保问题到下拉框，验证时只需要两个即可
          self.$('.js-ac-findByQuestionSelect').append(_(res.root).map((option) => {
            return `<option value="${option.userSecurityId}">${option.userSecurityQuestion}</option>`
          }).join(''))
        } else {
          // fail
          Global.ui.notification.show('获取密保问题失败')
          // alert(res.root);
        }
      })
  },

  // 3.2.1选择找回资金密码的方式时展示不同页面
  findByCIHandler() {
    this.$validate.html(this.byCITpl())

    this.$selectWay.addClass('hidden')
    this.$validate.removeClass('hidden')
  },

  returnSelectHandler() {
    this.$selectWay.removeClass('hidden')
    this.$validate.addClass('hidden')
  },

  inputCardInfoHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const clpValidate = this.$resetContainer.parsley().validate()

    if (clpValidate) {
      // 设置按钮为处理中状态
      $target.button('loading')
      Global.sync.ajax({
        url: '/fund/bankcard/verifycard.json',
        data: {
          name: this.$('#account-name').val(),
          cardNo: this.$('#card-no').val(),
        },
      })
        .always(() => {
          // 恢复确认按钮的状态
          $target.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            // suc
            // 设置验证token到页面，用于重置资金密码
            self.$('.js-as-resetFundPassword-submit').data('type', res.root)
            // 验证成功则跳转资金密码重置页
            self.$findFundPasswordContainer.steps('goTo', 1)
          } else if (res.root != null && _(res.root).isNumber()) {
            if (res.root > 0) {
              self.$('.js-ac-valCardNotice-div').html(self._getErrorMsg(`验证失败,剩余${res.root}次机会。`))
            } else {
              self.$('.js-ac-valCardNotice-div').html(self._getErrorMsg('验证失败,请一个小时后再验证！'))
            }
          } else {
            self.$('.js-ac-valCardNotice-div').html(self._getErrorMsg(`验证失败,${res.msg}`))
          }
        })
    }
  },

  // 3.2.3验证安全问题
  inputSecurityQuestionHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const clpValidate = this.$resetContainer.parsley().validate()
    if (clpValidate) {
      $target.button('loading')

      Global.sync.ajax({
        url: '/acct/usersecurity/verqesforpaypwd.json',
        data: {
          'secrityList[0].securityId': this.$('#jsASQuestion1').find('option:selected').val(),
          'secrityList[0].securityQes': this.$('#jsASQuestion1').find('option:selected').text(),
          'secrityList[0].securityAsw': this.$('#jsASAsw1').val(),
          'secrityList[1].securityId': this.$('#jsASQuestion2').find('option:selected').val(),
          'secrityList[1].securityQes': this.$('#jsASQuestion2').find('option:selected').text(),
          'secrityList[1].securityAsw': this.$('#jsASAsw2').val(),
        },
      })
        .always(() => {
          $target.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            // suc
            // 设置验证token到页面，用于重置资金密码
            self.$('.js-as-resetFundPassword-submit').data('type', res.root)
            // 跳转页面
            self.$findFundPasswordContainer.steps('goTo', 1)
          } else if (res.root != null && _(res.root).isNumber()) {
            if (res.root > 0) {
              self.$('.js-ac-valSQNotice-div').html(self._getErrorMsg(`验证失败,剩余${res.root}次机会。`))
            } else {
              self.$('.js-ac-valSQNotice-div').html(self._getErrorMsg('验证失败,请一个小时后再验证！'))
            }
          } else {
            self.$('.js-ac-valSQNotice-div').html(self._getErrorMsg(`验证失败,${res.msg}`))
          }
        })
    }
  },

  // 下拉框选择的事件,用于控制不会重复选择
  questionSelectChangeHandler (e) {
    const $target = $(e.currentTarget)
    const $option = $target.find('option:selected')

    const selectedValue = $option.siblings('.selected').removeClass('selected').val()
    const selectingValue = $target.val()
    const $select = this.$('.js-ac-findByQuestionSelect')

    $select.not($target).find(`option[value=${selectedValue}]`).removeClass('hidden')
    $select.not($target).find(`option[value=${selectingValue}]`).addClass('hidden')

    $option.addClass('selected')
  },

  resetFundPasswordHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type') // token 存放在按钮的data-type中
    const clpValidate = this.$('.js-ac-resetPayPwd-form').parsley().validate()

    if (clpValidate) {
      // alert(1);
      Global.sync.ajax({
        url: '/fund/moneypd/updatepaypwd.json',
        data: {
          payPwd: this.$('#newFundPassword').val(),
          pwdToken: type,
        },
      })
        .always(() => {
          // 恢复确认按钮的状态
          $target.button('reset')
        })
        .done((res) => {
          if (res.result === 0) {
            self.$findFundPasswordContainer.steps('goTo', 2)
          } else {
            self.$('.js-ac-resetNotice-div').html(self._getErrorMsg(`重置失败，${res.msg}`))
          }
        })
    }
  },

  findFundGoStepHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')// 需要返回的步骤记录在此
    this.$findFundPasswordContainer.steps('goTo', type)
  },

  // 组装错误提示框
  _getErrorMsg (text) {
    return `${'<ul class="parsley-errors-list filled font-sm text-center m-top-smd">' +
      '<li class="login-error-message parsley-required">'}${text}</li>` +
      '</ul>'
  },
})

module.exports = findPwdView
