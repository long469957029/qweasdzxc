require('./resetPassword.scss')
require('./../misc/common-init.js')

const header = require('../misc/header.html')
const footer = require('../misc/footer.html')

$.widget('gl.resetPassword', {

  template: require('./resetPassword.html'),

  _create () {
    this.element.html(_(this.template).template()())
    this.$resetPasswordMain = this.element.find('.js-rp-resetPassword-main')
    this._initSteps()
    // 需在initSteps()后获取对象
    this.$step1Form = this.element.find('.js-rp-verifyUNContainer')
    this.$username = this.element.find('.js-rp-userName')
    this.$valCode = this.element.find('.js-rp-valCode')
    this.$valImg = this.element.find('.js-rp-valImg')
    this.$valResult = this.element.find('.js-rp-valResult')
    this.$valResultDiv = this.element.find('.js-rp-val-result-div')
    this.$valCodeResult = this.element.find('.js-re-val-res')
    const url = window.self.location.toString()
    this.codeUrl = `${url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3))}/acct/imgcode/code`
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)

    this.$step2Div = this.element.find('.js-rp-step2-div')
    this.$step2Form = this.element.find('.js-rp-findWayContainer')
    this.$validateForm1 = this.element.find('.js-rp-validateContainer1')
    this.$validateForm2 = this.element.find('.js-rp-validateContainer2')
    this.$findBySQBtn = this.element.find('.js-rp-findBySQBtn')
    this.$noticeSQ = this.element.find('.js-rp-noticeSQ')
    this.$findByFPBtn = this.element.find('.js-rp-findByFPBtn')
    this.$noticeFP = this.element.find('.js-rp-noticeFP')

    this.$questionSelect = this.element.find('.js-rp-questionSelect')

    this.$step3Form = this.element.find('.js-rp-resetLPContainer')

    this._bindEvent()
    // this._setupForm();
  },
  // listenFieldStatus : function($target){
  //  $target.parsley().on('field:success', function() {
  //    this._ui.$errorsWrapper.removeClass('val-img-times');
  //    this._ui.$errorsWrapper.addClass('val-img-check');
  //  });
  //  $target.parsley().on('field:error', function() {
  //    this._ui.$errorsWrapper.removeClass('val-img-check');
  //    this._ui.$errorsWrapper.addClass('val-img-times');
  //  });
  // },
  // _onPageLoaded: function() {
  //  $(window).load(function() {
  //    $('body').removeClass('overflow-hidden');
  //    $('.wrapper').removeClass('preload');
  //  });
  // },
  // 初始化找回登录密码的分步操作页面
  _initSteps () {
    const self = this
    this.$resetPasswordMain.steps({
      headerTag: 'h3',
      bodyTag: 'div',
      forceMoveForward: false, // 阻止返回
      enablePagination: false,
      transitionEffect: 'slideLeft',
      onStepChanging (event, currentIndex, newIndex) {
        return newIndex !== 5
      },
      onStepChanged (event, currentIndex, newIndex) {
        self.element.find(`.steps ul li[role=tab]:gt(${newIndex})`).removeClass('done').addClass('disabled')
      },
    })
  },

  _bindEvent () {
    const self = this
    // 绑定事件
    this._on({
      'click .js-rp-valImg': 'refreshValCodeHandler', // 刷新验证码
      'click .js-rp-step1-returnBtn': 'returnToLoginHandler',
      'click .js-rp-verifyUNBtn': 'verifyUNHandler', // 校验用户名

      'click .js-rp-findBySQBtn': 'findBySQHandler', // 通过密保找回
      'click .js-rp-findByFPBtn': 'findByFPHandler', // 通过资金密码找回
      'click .js-rp-step2-returnBtn': 'returnToStep1Handler',
      'change .js-rp-questionSelect': 'questionSelectChangeHandler', // 控制三个下拉框的值不能重复选择
      'click .js-rp-verifySQABtn': 'verifySQAHandler', // 验证密保问题
      'click .js-rp-verifyFPBtn': 'verifyFPHandler', // 验证资金密码
      'click .js-rp-Step3-returnBtn': 'goStep2Handler',
      'click .js-rp-Step2-val-returnBtn': 'valPageReturnHandler', // 验证页面的返回按钮

      'click .js-rp-setLPBtn': 'setLPHandler', // 设置登录密码
    })
    this.element.find('.js-rp-valCode').on('keyup', () => {
      self.valCodeHandler()
    })
  },

  refreshValCodeHandler() {
    this.$valImg.attr('src', '')
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    this.$valResult.val('1')
    this.$valCode.val('')
    this.$valCode.focus()
    this.$valCodeResult.html('')
  },

  valCodeHandler () {
    const self = this
    if (self.$valCode && self.$valCode.val() != '' && self.$valCode.val().length === 4) {
      Global.sync.ajax({
        type: 'POST',
        url: '/acct/imgcode/val.json',
        data: {
          code: self.$valCode.val(),
        },
      }).done((data, status, xhr) => {
        if (data.result === 0) {
          self._showValResult(0, self.$valCodeResult, '', self.$valResult)
        } else {
          self._showValResult(1, self.$valCodeResult, '验证码错误', self.$valResult)
          self.refreshValCodeHandler()
        }
      }).fail(() => {
        self._showValResult(1, self.$valCodeResult, '验证码错误', self.$valResult)
        self.refreshValCodeHandler()
      })
    } else {
      // self._showValResult(1,self.$valResultDiv);
      // self._showValResult(1,self.$valCodeResult,'验证码错误' ,self.$valResult);
      self.$valResult.val('1')
      self.$valCodeResult.html('')
    }
  },
  renderError(text) {
    this.element.find('.js-rp-notice-page1').html(self._getErrorMsg(text))
  },
  returnToLoginHandler(e) {
    window.location.href = './login.html'
  },
  // TODO 待添加用户验证
  verifyUNHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const clpValidate = this.$step1Form.parsley().validate()
    if (self.$valCode.val() === '' || self.$valResult.val() === '1') {
      self._showValResult(1, self.$valCodeResult, '请输入正确的验证码', self.$valResult)
      self.refreshValCodeHandler()
      return false
    }
    if (clpValidate) {
      $target.button('loading')
      self.element.find('.js-rp-userNameContainer').val('')
      self.element.find('.js-rp-tokenContainer').val('')
      // 校验验证码
      this.verifyUserNameXhr().always(() => {
        $target.button('reset')
      }).fail(() => {
        self.element.find('.js-rp-notice-page1').html(self._getErrorMsg('验证用户名请求失败'))
        self.refreshValCodeHandler()
      }).done((res) => {
        if (res && res.result === 0) {
          // todo 获取密保及资金密码设置状态 控制第二步页面的显示
          if (res.root.qesStatus === 1) { // 1代表设置了该方式
            self.$findBySQBtn.addClass('hidden')
            self.$noticeSQ.removeClass('hidden')
          } else {
            self.$findBySQBtn.removeClass('hidden')
            self.$noticeSQ.addClass('hidden')
          }
          if (res.root.payPwdStatus === 1) {
            self.$findByFPBtn.removeClass('hidden')
            self.$noticeFP.addClass('hidden')
          } else {
            self.$findByFPBtn.addClass('hidden')
            self.$noticeFP.removeClass('hidden')
          }
          self.element.find('.js-rp-userNameContainer').val(self.$username.val())
          self.element.find('.js-rp-tokenContainer').val(res.root.pwdToken)
          // self.$step2Div.addClass('hidden');
          self.$step2Form.removeClass('hidden')
          self.$validateForm1.addClass('hidden')
          self.$validateForm1[0].reset()
          self.$validateForm2.addClass('hidden')
          self.$validateForm2[0].reset()
          self.$resetPasswordMain.steps('goTo', 1)
        } else {
          self.element.find('.js-rp-notice-page1').html(self._getErrorMsg('用户名验证失败'))
          self.refreshValCodeHandler()
        }
      })
    }
  },

  // TODO Deferred 验证用户，用户名和验证码,待修改参数名
  verifyUserNameXhr () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/login/verifyusername.json',
      data: {
        username: this.$username.val(),
        verifyCode: this.$valCode.val(),
      },
    })
  },


  findBySQHandler (e) {
    const self = this
    // this.$validateForm1.removeClass('hidden');
    // this.$validateForm2.addClass('hidden');
    // TODO获取密保问题，添加到页面中
    self.getSecurityQuestion().fail(() => {
      self.element.find('.js-rp-notice-page2').html(self._getErrorMsg('密保问题获取请求服务失败'))
    }).done((res) => {
      if (res && res.result === 0) {
        // 成功后,将问题列表加载在下拉框中
        self.$questionSelect.html('<option value="">请选择密保问题</option>')
        self.$questionSelect.append(_(res.root).map((option) => {
          return `<option value="${option.qesId}">${option.question}</option>`
        }).join(''))
        // 隐藏当前step2的form1，展示form2
        self.$step2Form.addClass('hidden')
        self.$validateForm1.removeClass('hidden')
        self.$validateForm2.addClass('hidden')
      } else {
        self.element.find('.js-rp-notice-page2').html(self._getErrorMsg('密保问题获取失败'))
      }
    })
  },
  // 下拉框选择的事件,用于控制不会重复选择
  questionSelectChangeHandler (e) {
    const $target = $(e.currentTarget)
    const $option = $target.find('option:selected')

    const selectedValue = $option.siblings('.selected').removeClass('selected').val()
    const selectingValue = $target.val()

    this.$questionSelect.not($target).find(`option[value=${selectedValue}]`).removeClass('hidden')
    this.$questionSelect.not($target).find(`option[value=${selectingValue}]`).addClass('hidden')

    $option.addClass('selected')
  },

  // TODO 待修改参数名
  getSecurityQuestion () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/usersecurity/getqesforloginpwd.json',
      data: {
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val(),

      },
    })
  },

  findByFPHandler (e) {
    this.$step2Form.addClass('hidden')
    this.$validateForm1.addClass('hidden')
    this.$validateForm2.removeClass('hidden')
  },
  //
  returnToStep1Handler(e) {
    this.$resetPasswordMain.steps('goTo', 0)
    this.$step2Form.removeClass('hidden')
    this.$validateForm1.addClass('hidden')
    this.$validateForm2.addClass('hidden')
  },

  // TODO 验证密保问题
  verifySQAHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    // var type = $target.data('type');
    const clpValidate = this.$validateForm1.parsley().validate()
    if (clpValidate) {
      $target.button('loading')
      this.verifySecurityQuestion().always(() => {
        $target.button('reset')
      }).fail(() => {
        self.element.find('.js-rp-notice-page31').html(self._getErrorMsg('密保问题验证请求失败'))
      }).done((res) => {
        if (res && res.result === 0) {
          self.$resetPasswordMain.steps('goTo', 2)
        } else if (res.root != null && _(res.root).isNumber()) {
          if (res.root > 0) {
            self.element.find('.js-rp-notice-page31').html(self._getErrorMsg(`验证失败,剩余${res.root}次机会。`))
          } else {
            self.element.find('.js-rp-notice-page31').html(self._getErrorMsg('验证失败,请一个小时后再验证！'))
          }
        } else {
          self.element.find('.js-rp-notice-page31').html(self._getErrorMsg(`验证失败,${res.msg}`))
        }
      })
    }
  },

  // TODO 验证密保 ，待修改参数名
  verifySecurityQuestion () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/usersecurity/verqesforloginpwd.json',
      data: {
        'secrityList[0].securityId': this.element.find('#jsRPQuestion1').find('option:selected').val(),
        'secrityList[0].securityQes': this.element.find('#jsRPQuestion1').find('option:selected').text(),
        'secrityList[0].securityAsw': this.element.find('#jsRPAsw1').val(),
        'secrityList[1].securityId': this.element.find('#jsRPQuestion2').find('option:selected').val(),
        'secrityList[1].securityQes': this.element.find('#jsRPQuestion2').find('option:selected').text(),
        'secrityList[1].securityAsw': this.element.find('#jsRPAsw2').val(),
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val(),

      },
    })
  },

  verifyFPHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')

    // var type = $target.data('type');
    const clpValidate = this.$validateForm2.parsley().validate()
    if (clpValidate) {
      $target.button('loading')
      this.verifyFundPassword().always(() => {
        $target.button('reset')
      }).fail(() => {
        self.element.find('.js-rp-notice-page32').html(self._getErrorMsg('资金密码验证请求失败'))
        // this.$resetPasswordMain.steps('goTo', 3);
      }).done((res) => {
        if (res && res.result === 0) {
          self.$resetPasswordMain.steps('goTo', 2)
        } else {
          // self.$resetPasswordMain.steps('goTo', 3);
          if (res.root != null && _(res.root).isNumber()) {
            if (res.root > 0) {
              self.element.find('.js-rp-notice-page32').html(self._getErrorMsg(`验证失败,剩余${res.root}次机会。`))
            } else {
              self.element.find('.js-rp-notice-page32').html(self._getErrorMsg('验证失败,请一个小时后再验证！'))
            }
          } else {
            self.element.find('.js-rp-notice-page32').html(self._getErrorMsg(`验证失败,${res.msg}`))
          }
        }
      })
    }
  },

  // TODO 验证资金密码 ，待修改参数名
  verifyFundPassword () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/fund/moneypd/verpwdforloginpwd.json',
      data: {
        payPwd: this.element.find('.js-rp-fundPassword').val(),
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val(),
      },
    })
  },

  // 返回按钮事件
  goStep2Handler (e) {
    this.$resetPasswordMain.steps('goTo', 1)
  },
  // 设置登录密码
  setLPHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    const $resetLPContainer = this.$step3Form
    // var type = $target.data('type');
    const clpValidate = $resetLPContainer.parsley().validate()
    if (clpValidate) {
      $target.button('loading')
      this.resetLoginPwd().always(() => {
        $target.button('reset')
      }).fail(() => {
        self.element.find('.js-rp-notice-page4').html(self._getErrorMsg('设置登录密码请求失败'))
        // self.$resetPasswordMain.steps('goTo', 4);
      }).done((res) => {
        if (res && res.result === 0) {
          self.$resetPasswordMain.steps('goTo', 3)
        } else {
          self.element.find('.js-rp-notice-page4').html(self._getErrorMsg(res.msg))
        }
      })
    }
  },
  // TODO 重置登录密码 ，待修改参数名
  resetLoginPwd() {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/userinfo/resetloginpwd.json',
      data: {
        loginPwd: this.element.find('#jsRPLoginPwd1').val(),
        username: this.element.find('.js-rp-userNameContainer').val(),
        loginToken: this.element.find('.js-rp-tokenContainer').val(),
      },
    })
  },

  // 组装错误提示框
  _getErrorMsg (text) {
    return `${'<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> '}${text 
    }</div>`
  },

  _showValResult(result, $container, msg, $result) {
    const wrong = `<div class="val-img-times"><span class="text-danger">${msg}</span></div>`
    const right = '<div class="val-img-check">&nbsp;</div>'
    if (result === 0) {
      $container.html(right)
      if ($result) {
        $result.val('0')
      }
    } else if (result === 1) {
      $container.html(wrong)
      if ($result) {
        $result.val('1')
      }
    } else {
      $container.html('')
    }
  },
  valPageReturnHandler(e) {
    this.$step2Form.removeClass('hidden')
    this.$validateForm1.addClass('hidden')
    this.$validateForm2.addClass('hidden')
  },


})

$(document).ready(() => {
  $('.js-package').before(_(header).template()({})).after(footer)
  $('.js-package').resetPassword()
})
