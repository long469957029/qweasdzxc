require('./../misc/common-init.js')
require('./login.scss')
require('./step-progress.scss')
require('../../../base/scripts/jquery.qrcode.min')

const AnimateBg = require('../../components/animateBg')
const FooterView = require('../../components/footer')
const HeaderView = require('../../components/header')
const LoadingView = require('../../components/loading')

const Socket = require('skeleton/modules/socket.js')
const Encryption = require('com/encryption')


$.widget('gl.login', {

  template: require('./index.html'),


  // 获得登入二维码token
  getScanTokenXhr () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/wxws/login/createScanToken.json',
    })
  },

  registerXhr (data) {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/reg/doreg.json',
      data,
    })
  },

  checkNameExistXhr (data) {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/reg/userexist.json',
      data,
    })
  },

  // 扫码登入
  loginByScanXhr (data) {
    return Global.sync.ajax({
      type: 'POST',
      url: '/wxws/login/scanLogin.json',
      data,
    })
  },

  // 轮询用 查看扫码登入状态
  checkLoginStateXhr (data) {
    return Global.sync.ajax({
      type: 'POST',
      url: '/wxws/login/checkScanToken.json',
      data,
    })
  },


  _bindEvent () {
    const self = this
    this._on({
      'click .js-login-login-btn': 'valCodeHandler', // 验证验证码并登录
      'click .js-login-valImg': 'refreshValCodeHandler', // 刷新验证码
      'click .js-to-login, .js-to-register, .js-to-qrcode': 'toggleDialogHandler', // 切换扫码或密码登录

      'click .js-register-register-btn': 'registerValCodeHandler',
      'blur .js-register-password': 'valPasswordHandler',
      'blur .js-register-username': 'checkNameExistHandler', // 校验用户名是否存在
      'click .js-register-valImg': 'registerRefreshValCodeHandler', // 刷新验证码
    })
  },

  _create () {
    const self = this
    this.element.html(_(this.template).template()({
      remember: Global.localCache.get('account.remember'),
    }))


    // 页首页尾背景
    this.$header = this.element.find('.js-header')
    this.$footer = this.element.find('.js-footer')
    this.$bg = this.element.find('.js-bg')
    this.$loading = this.element.find('.js-loading')

    // 登录表单
    this.$loginForm = this.element.find('#loginForm')
    this.$username = this.element.find('.js-login-user')
    this.$password = this.element.find('.js-login-password')
    this.$valRegion = this.element.find('.js-login-valRegion')
    this.$valCode = this.element.find('.js-login-valCode')
    this.$valImg = this.element.find('.js-login-valImg')
    this.$valResult = this.element.find('.js-login-valResult')
    this.$submit = this.element.find('.js-login-login-btn')
    this.$errMsg = this.element.find('.login-error-message')
    this.$remember = this.element.find('#jsRemember')

    // 注册表单
    this.$registerForm = this.element.find('#registerForm')
    this.$registerUsername = this.element.find('.js-register-username')
    this.$registerPassword = this.element.find('.js-register-password')
    this.$registerValRegion = this.element.find('.js-register-valRegion')
    this.$registerValCode = this.element.find('.js-register-valCode')
    this.$registerValImg = this.element.find('.js-register-valImg')
    this.$registerSubmit = this.element.find('.js-register-register-btn')
    this.$registerUsernameErr = this.element.find('.js-register-username-err')
    this.$registerPasswordErr = this.element.find('.js-register-password-err')
    this.$registerValCodeErr = this.element.find('.js-register-valcode-err')
    this.$usernameValidate = this.element.find('.js-username-validate')
    this.$passwordValidate = this.element.find('.js-password-validate')
    this.$valcodeValidate = this.element.find('.js-valcode-validate')

    // 渲染页首，页尾，动态背景
    new LoadingView({
      el: this.$loading,
    }).render()
    new AnimateBg({
      el: this.$bg,
      season: 'fall', // 根据季节变换背景
    }).render()
    new HeaderView({
      el: this.$header,
      hasCollect: false, // 加到最爱
    }).render()
    new FooterView({
      el: this.$footer,
    }).render()

    const url = window.self.location.toString()
    // 验证码
    this.codeUrl = `${url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3))}/acct/imgcode/code`
    this.$registerValImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    const cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie',
    })


    // 获取二维码token 并连接Socket (改成轮询 战时屏蔽)
    // this.createQRandSocket();

    // 超过十分钟刷新二维码及重启websocket (改成轮询 战时屏蔽)
    // this.intervalSocket = setInterval(function () {
    //   self.restartSocket()
    // }, 600 * 1000);


    // this.username = cookie.get('username');

    this._onPageLoaded()

    this.loginParsley = this.$loginForm.parsley({
      priorityEnabled: false,
    })

    this._bindEvent()

    // 如果是从开户链结跳转过来的 判断 linkId
    const linkId = _.getUrlParam('linkId')
    if (linkId) {
      console.log(linkId)
      $('.js-re-linkId').val(linkId)
      $('.js-to-register').first().trigger('click')
    } else {
      $('.js-to-register').addClass('hidden')
    }
  },

  restartIntervalCheckLoginState () {
    const self = this
    clearInterval(self.intervalCheckLoginState)
    self.checkLoginState()
  },

  checkLoginState () {
    const self = this
    self.getScanTokenXhr()
      .done((res) => {
        if (res.result === 0) {
          const scanToken = res.root.token
          $('.js-qrcode').empty().qrcode({
            text: scanToken,
            size: 177,
          })
          self.intervalCheckLoginState = setInterval(() => {
            self.checkLoginStateXhr({scanToken})
              .done((res) => {
                if (res.result === 0) {
                  if (res.root.token) {
                    const token = res.root.token
                    Global.cookieCache.set('token', token, 90)
                    Global.cookieCache.set('loginState', true)
                    window.location.href = 'index.html'

                    // 清除 2 秒轮询
                    clearInterval(self.intervalCheckLoginState)
                    // 清除 3 分钟轮询
                    clearInterval(self.intervalRefreshScanToken)
                  }
                }
              })
          }, 1000 * 2)
        }
      })
  },

  getMessage (data) {
    const self = this
    if (data.root) { // App 登陆成功，socket 回传 token
      const token = data.root.token
      Global.cookieCache.set('token', data.root.token, 90)
      Global.cookieCache.set('loginState', true)
      window.location.href = 'index.html'
      // 清除 websocket
      self.exit()
      // 清除 10 分钟轮询 重启 websocket
      clearInterval(self.intervalSocket)
    }
  },

  exit () {
    if (this.socket) { // 释放socket
      this.socket.release()
      delete this.socket
      console.log('socket status close')
    }
  },

  // 获取二维码token 并连接Socket
  createQRandSocket () {
    const self = this
    self.getScanTokenXhr()
      .done((res) => {
        if (res.result === 0) {
          const token = res.root.token
          $('.js-qrcode').empty().qrcode({
            text: token,
            size: 177,
          })


          // 扫码登入改成轮询 战时屏蔽
          // var tokenUrl = '/wxws/websocket?scanToken=';
          // if (!self.socket) {
          //   self.initWebSocket(token, tokenUrl)
          // }
        }
      })
  },

  restartSocket () {
    const self = this
    self.exit()
    self.createQRandSocket()
  },

  initWebSocket (token, tokenUrl) {
    const self = this
    this.socket = new Socket({
      fail: self.exit.bind(this),
      close: self.exit.bind(this),
      token,
      tokenUrl,
      messageHandler (data) {
        self.getMessage(data)
      },
    })
  },

  _onPageLoaded () {
    setTimeout(() => {
      $('.js-loading').addClass('hidden')
    }, 1500)
  },

  loginHandler () {
    const self = this
    const encryption = new Encryption()
    const param = encryption.encryptSha(`${new Date().valueOf()}`)
    const entPassword = encryption.encrypt(self.$password.val(), param)

    if (!this.loginParsley.validate()) {
      self.renderError('用户名或密码错误')
      return false
    }
    if (self.$valResult.val() !== '0') {
      if (this.$valCode.hasClass('hidden')) {
        self.$valRegion.removeClass('hidden')
        $('.input-control').removeClass('two-input')
        $('.login-form').removeClass('two-input')
        self.$valCode.removeClass('hidden')
        self.$valCode.attr('type', 'text')
        self.renderError('请输入验证码！')
        self.refreshValCodeHandler()
      } else {
        self.renderError('验证码输入有误！')
      }
      return false
    }

    Global.sync.ajax({
      type: 'POST',
      url: '/acct/login/dologin.json',
      data: {
        username: self.$username.val(),
        loginPwd: entPassword,
        param,
        code: self.$valCode.val(),
      },
      beforeSend (xhr, settings) {
        self.$submit.button('loading')
      },
    })
      .always(() => {
        self.$submit.button('reset')
      })
      .done((data, status, xhr) => {
        if (data.result === 0) {
          if (self.$remember.prop('checked')) {
            Global.localCache.set('account.remember', self.$username.val())
          } else {
            Global.localCache.clear('account.remember')
          }

          Global.cookieCache.set('token', data.root.token, 90)
          Global.cookieCache.set('loginState', true)
          Global.m.oauth.check()
          status = Number(data.root.userStatus)
          // 状态的值
          // int WOKRING = 0;// 正常
          // int DISABLED = 100;// 冻结,只登录
          // int DEEP_DISABLED = 101;// 冻结，完全冻结
          // int ENABLED = 102;// 解冻
          // int RECOVER = 103;// 回收
          // int RESET = 104;// 重置
          // int BYPARENT = 105;// 手工开户
          // int BYSUPER = 106;// 总代开户
          status = Number(status)
          if (status === 0 || status === 100 || status === 102) {
            window.location.href = 'index.html'
          } else if (status === 103 || status === 104 || status === 105 || status === 106) {
            const ur = `userName=${data.root.username}${data.root.uName ? `&uName=${data.root.uName}` : ''}&status=${status}`
            window.location.href = `updateUserInfo.html?${encodeURI(ur)}`
          } else if (status === 101) {
            self.renderError('完全冻结的用户无法登录')
          } else {
            window.location.href = 'index.html'
          }
        } else if (data.msg.indexOf('验证码') !== -1) {
          if (self.$valCode.hasClass('hidden')) {
            self.$valRegion.removeClass('hidden')
            $('.input-control').removeClass('two-input')
            $('.login-form').removeClass('two-input')
            self.$valCode.removeClass('hidden')
            self.$valCode.attr('type', 'text')
            self.$valResult.val('1')
            // 验证码
            self.$valImg.attr('src', `${self.codeUrl}?_t=${_.now()}`)
            self.renderError('请输入验证码！')
            self.$valCode.focus()
          } else {
            self.renderError('验证码输入有误！')
            self.refreshValCodeHandler()
          }
        } else {
          self.renderError(data.msg)
          // self.refreshValCodeHandler();
        }
      })
      .fail(() => {
        self.renderError('服务端异常，请稍后登录')
        if (!self.$valRegion.hasClass('hidden')) {
          self.$valImg.trigger('click')
        }
      })

    return false
  },

  // 校对验证码并登录
  valCodeHandler () {
    const self = this
    if (self.$valRegion.hasClass('hidden')) {
      self.loginHandler()
    } else if (self.$valCode && self.$valCode.val() != '' && self.$valCode.val().length === 4) {
      Global.sync.ajax({
        type: 'POST',
        url: '/acct/imgcode/val.json',
        data: {
          code: self.$valCode.val(),
        },
      }).done((data, status, xhr) => {
        if (data.result === 0) {
          self.$valResult.val('0')
          self.renderError('')
          self.loginHandler()
        } else {
          self.$valResult.val('1')
          if (self.$valRegion.hasClass('hidden')) {
            self.renderError('请输入验证码！')
          } else {
            self.renderError('验证码输入有误！')
          }
          self.refreshValCodeHandler()
        }
      }).fail(() => {
        self.renderError('验证失败！')
        self.refreshValCodeHandler()
      })
    } else {
      self.renderError('请输入验证码！')
    }
  },

  // 校对验证码并注册
  registerValCodeHandler (e) {
    const self = this
    if (self.$registerValCode && self.$registerValCode.val() != '' && self.$registerValCode.val().length === 4) {
      Global.sync.ajax({
        type: 'POST',
        url: '/acct/imgcode/val.json',
        data: {
          code: self.$registerValCode.val(),
        },
      }).done((data, status, xhr) => {
        if (data.result === 0) {
          self._showValResult(0, self.$registerValCodeErr, '', self.$valcodeValidate)
          self.registerHandler(e)
        } else {
          self.registerHandler(e)
          self._showValResult(1, self.$registerValCodeErr, '验证码输入有误', self.$valcodeValidate)
          self.registerRefreshValCodeHandler()
        }
      }).fail(() => {
        self.registerHandler(e)
        self._showValResult(1, self.$registerValCodeErr, '验证码输入有误', self.$valcodeValidate)
        self.registerRefreshValCodeHandler()
      })
    } else {
      self.$valcodeValidate.val('1')
      self.$registerValCodeErr.html('')
      if (self.$valCode.val() === '' || self.$valcodeValidate.val() === '1') {
        self._showValResult(1, self.$registerValCodeErr, '请输入正确的验证码', self.$valcodeValidate)
        self.registerRefreshValCodeHandler()
      }
    }
  },

  // 注册表单显示错误讯息
  _showValResult (result, $container, msg, $validationValue) {
    const right = ''

    if (result === 0) {
      $container.removeClass('red').html('')
      if ($validationValue) {
        $validationValue.val('0')
      }
    } else if (result === 1) {
      $container.addClass('red').html(msg)
      if ($validationValue) {
        $validationValue.val('1')
      }
    } else {
      $container.removeClass('red').html('')
    }
  },

  registerHandler (e) {
    const self = this
    const $target = $(e.currentTarget)

    const encryption = new Encryption()
    const param = encryption.encryptSha(`${new Date().valueOf()}`)
    const entPassword = encryption.encrypt(self.$registerPassword.val(), param)

    let flag = true
    if (self.$valcodeValidate.val() !== '0') {
      self._showValResult(1, self.$registerValCodeErr, '验证码输入有误', self.$valcodeValidate)
      self.registerRefreshValCodeHandler()
      flag = false
    }

    if (!self.valPasswordHandler()) {
      flag = false
    }

    if (self.$registerValCode.val() === '' || self.$valcodeValidate.val() === '1') {
      self._showValResult(1, self.$registerValCodeErr, '请输入正确的验证码', self.$valcodeValidate)
      self.registerRefreshValCodeHandler()
      flag = false
    }

    const clearRegisterForm = function () {
      self.$registerUsername.val('')
      self.$registerPassword.val('')
      self.$registerValRegion.val('')
      self.registerRefreshValCodeHandler()
      self._showValResult(0, self.$registerPasswordErr, '', self.$passwordValidate)
    }

    if (flag) {
      $target.button('loading')
      const data = _(self.$registerForm.serializeArray()).serializeObject()
      self.registerXhr(data)
        .always(() => {
          $target.button('reset')
        })
        .fail(() => {
          Global.ui.notification.show('注册失败！', {
            btnContent: '重新注册',
            event () {
              clearRegisterForm()
            },
          })
        })
        .done((res) => {
          if (res.result === 0) {
            Global.ui.notification.show('注册成功！', {
              type: 'success',
              btnContent: '登陆',
              event () {
                clearRegisterForm()
                $('.js-to-login').trigger('click')
              },
            })
          } else {
            let msg = '注册失败！'
            if (res.msg !== 'fail') {
              msg = res.msg
              Global.ui.notification.show(msg, {
                btnContent: '确定',
                event () {
                  clearRegisterForm()
                },
              })
            } else {
              Global.ui.notification.show(msg, {
                btnContent: '重新注册',
                event () {
                  clearRegisterForm()
                },
              })
            }
          }
        })
    } else {
      self.registerRefreshValCodeHandler()
    }
  },

  // 注册表单 判断密码格式
  valPasswordHandler () {
    const self = this
    const password = this.$registerPassword.val()
    let msg = '密码为6-20位字符组成（不含空格），区分大小写，不能是9位以下的纯数字'

    if (password === '') {
      msg = '登录密码不能为空'
      this._showValResult(1, this.$registerPasswordErr, msg, this.$passwordValidate)

      return false
    }

    let validationStatus = true
    const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/

    if (password.length < 9 && this.strBetweenIsNumber(password, 0, 7)) {
      validationStatus = false
    } else if (!pwReg.test(password)) {
      validationStatus = false
    }

    if (validationStatus) {
      this._showValResult(0, this.$registerPasswordErr, '', this.$passwordValidate)
      return true
    }
    this._showValResult(1, this.$registerPasswordErr, msg, this.$passwordValidate)
    return false
  },

  strBetweenIsNumber (str, star, end) {
    const strArr = str.split('').slice(star, end)
    let isHasNumber = true
    $.each(strArr, (index, item) => {
      if (!$.isNumeric(item)) {
        isHasNumber = false
      }
    })
    return isHasNumber
  },

  // 注册表单 判断用户名是否存在
  checkNameExistHandler (e) {
    const self = this
    const data = {
      username: this.$registerUsername.val(),
    }

    if (this.$registerUsername.val() === '') {
      self._showValResult(1, this.$registerUsernameErr, '用户名不能为空', self.$usernameValidate)
      return false
    }

    const myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
    if (!myReg.test(this.$registerUsername.val())) {
      self._showValResult(1, this.$registerUsernameErr, '仅支持4-16位字母和数字，不能以数字开头', self.$usernameValidate)
      return false
    }


    this.checkNameExistXhr(data).fail((res) => {
      self._showValResult(1, self.$registerUsernameErr, res.msg, self.$usernameValidate)
    }).done((res) => {
      if (res.result === 0) {
        self._showValResult(0, self.$registerUsernameErr, '', self.$usernameValidate)
      } else {
        if (res.msg == 'invalid user token') {
          res.msg = '操作异常，请清除浏览器缓存'
        }
        self._showValResult(1, self.$registerUsernameErr, res.msg, self.$usernameValidate)
      }
    })
    // this.checkUNameExistHandler();
  },

  // 刷新登录表单验证码
  refreshValCodeHandler () {
    this.$valImg.attr('src', '')
    // 验证码
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    this.$valCode.val('')
    this.$valCode.focus()
    this.$valResult.val('1')
  },

  // 刷新注册验证码
  registerRefreshValCodeHandler () {
    this.$registerValImg.attr('src', '')
    // 验证码
    this.$registerValImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    this.$registerValCode.val('')
    this.$registerValCode.focus()
    this.$valcodeValidate.val('1')
  },

  renderError (text) {
    this.$errMsg.html(text)
  },

  toggleDialogHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    if ($target.hasClass('js-to-login')) {
      self.element.find('.js-register-dialog').addClass('hidden')
      self.element.find('.js-qrcode-dialog').addClass('hidden')
      self.element.find('.js-default-dialog').removeClass('hidden')
      // 清除 2 秒轮询
      clearInterval(self.intervalCheckLoginState)
      // 清除 3 分钟轮询
      clearInterval(self.intervalRefreshScanToken)
    } else if ($target.hasClass('js-to-qrcode')) {
      self.element.find('.js-qrcode-dialog').removeClass('hidden')
      self.element.find('.js-default-dialog').addClass('hidden')
      // 轮询用 取得扫码token后查询登入状态
      this.checkLoginState()

      this.intervalRefreshScanToken = setInterval(() => {
        self.restartIntervalCheckLoginState()
      }, 1000 * 180)
    } else if ($target.hasClass('js-to-register')) {
      self.element.find('.js-register-dialog').removeClass('hidden')
      self.element.find('.js-qrcode-dialog').addClass('hidden')
      self.element.find('.js-default-dialog').addClass('hidden')
      // 清除 2 秒轮询
      clearInterval(self.intervalCheckLoginState)
      // 清除 3 分钟轮询
      clearInterval(self.intervalRefreshScanToken)
    }
  },

})

$(document).ready(() => {
  new LoadingView({
    el: $('.js-package'),
  }).render()
  setTimeout(() => {
    $('.js-package').login()
  }, 500)
})
