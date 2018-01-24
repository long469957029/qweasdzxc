require('./updateUserInfo.scss')
require('./../misc/common-init.js')

const header = require('../misc/header.html')
const footer = require('../misc/footer.html')

$.widget('gl.updateUserInfo', {

  template: require('./updateUserInfo.html'),

  _bindEvent () {
    // 绑定事件
    //    this._on(this.$form.find('.js-uu-uName'), {
    //      'blur': 'checkUNameExistHandler'//校验验证码
    //    });
    this._on({
      'blur .js-uu-uName': 'checkUNameExistHandler', // 校验昵称是否存在
      'blur #oldLoginPassword': 'valPasswordOldHandler',
      'blur #newLoginPassword': 'valPasswordHandler',
      'blur #newLoginPassword1': 'valPassword1Handler',
      'click .js-uu-changePassword-return': 'quitHandler',
    })
  },
  checkUNameExistXhr(data) {
    const self = this
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/userinfo/checkuname.json',
      data,
      async: false,
    })
  },
  _create () {
    this.element.html(_(this.template).template()())
    this.$form = this.element.find('.js-uu-updateUUContainer')

    this.$userUName = this.element.find('.js-uu-uName')
    this.$userUNameValRes = this.element.find('.js-uu-uName-val-res')
    this.$userUNameValDes = this.element.find('.js-uu-verify-userUName')

    this.$passwordOld = this.element.find('#oldLoginPassword')
    this.$passwordOldValRes = this.element.find('.js-uu-passwordOld-val-res')
    this.$passwordOldValDes = this.element.find('.js-uu-verify-passwordOld')

    this.$password = this.element.find('#newLoginPassword')
    this.$passwordValRes = this.element.find('.js-uu-password-val-res')
    this.$passwordValDes = this.element.find('.js-uu-verify-password')

    this.$password1 = this.element.find('#newLoginPassword1')
    this.$password1ValRes = this.element.find('.js-uu-password1-val-res')
    this.$password1ValDes = this.element.find('.js-uu-verify-password1')
    this._setupForm()

    this._bindEvent()
  },

  _setupForm () {
    const self = this
    const userName = _.getUrlParam('userName')
    const uName = _.getUrlParam('uName')
    const status = Number(_.getUrlParam('status'))
    this.$form.find('.js-uu-status').val(status)
    //
    this.$form.find('.js-uu-userName').val(userName)
    this.$form.find('.js-uu-uName').val(uName)
    if (status === 105 || status === 106) {
      // 手工开户，总代开户
      this.$form.find('.js-uu-fundPwdContainer').addClass('hidden')

      this.$form.find('#jsUUOldFundPassword').attr('type', 'hidden')
      this.$form.find('#jsUUNewFundPassword').attr('type', 'hidden')
      this.$form.find('#jsUUNewFundPassword1').attr('type', 'hidden')

      this.$form.removeClass('hidden')
    } else if (status === 103 || status === 104) {
      // 回收,重置
      this.$form.find('.js-uu-fundPwdContainer').addClass('hidden')

      this.$form.find('#jsUUOldFundPassword').attr('type', 'hidden')
      this.$form.find('#jsUUNewFundPassword').attr('type', 'hidden')
      this.$form.find('#jsUUNewFundPassword1').attr('type', 'hidden')

      // this.$form.find('#jsUUOldFundPassword').attr('type', 'password');
      // this.$form.find('#jsUUNewFundPassword').attr('type', 'password');
      // this.$form.find('#jsUUNewFundPassword1').attr('type', 'password');

      this.$form.removeClass('hidden')
    } else {
      // 其他
      this.$form.addClass('hidden')
    }

    this.$form.parsley().subscribe('parsley:form:success', (formInstance) => {
      // if (self.$form.find('#newLoginPassword1').val() === self.$form.find('#jsUUNewFundPassword').val()) {
      //  self.$form.find('.js-uu-notice-page1').html(self._getLoginErrorEl('新资金密码和新登陆密码不能一致'));
      //  return false;
      // }
      let flag = true

      if (!self.checkUNameExistHandler()) {
        flag = false
      }

      if (!self.valPasswordOldHandler()) {
        flag = false
      }

      if (!self.valPasswordHandler()) {
        flag = false
      }

      if (!self.valPassword1Handler()) {
        flag = false
      }

      if (!flag) {
        return
      }

      formInstance.submitEvent.preventDefault()

      const cookie = new Base.Storage({
        name: 'appstorage',
        type: 'cookie',
      })

      self.token = cookie.get('token')
      let functionExe
      // if (status === 105 || status === 106) {
      functionExe = self.updateLoginPwdAndUName()
      // }
      // else if (status === 103 || status === 104) {
      //  functionExe =  self.updateLoginPwdAndUNameAndFundPwd();
      // }

      functionExe.always(() => {
        self.$form.find('button[type="submit"]').text('确定').removeClass('disabled')
      })
        .done((data) => {
          if (data.result === 0) {
            Global.ui.notification.show('修改成功，请重新使用新密码登录！', {
              type: 'success',
              btnContent: '立即登陆',
              event() {
                window.location.href = 'index.html'
              },
            })
          } else {
            Global.ui.notification.show(`修改失败！${data.msg}`, {
              btnContent: '重新修改',
              event() {
                self._create()
              },
            })
          }
        })
        .fail(() => {
          // self.$form.find('.js-uu-notice-page1').html(self._getLoginErrorEl('服务端异常，请稍后登录。'));
          Global.ui.notification.show('修改失败！', {
            btnContent: '重新修改',
            event() {
              self._create()
            },
          })
        })
    })
  },

  updateLoginPwdAndUName () {
    const self = this
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/userinfo/updateloginpwd.json',
      data: {
        token: this.token,
        uName: this.$form.find('.js-uu-uName').val(),
        oldPwd: this.$form.find('#oldLoginPassword').val(),
        newPwd: this.$form.find('#newLoginPassword').val(),
      },
      beforeSend (xhr, settings) {
        self.$form.find('button[type="submit"]').text('登录中...').addClass('disabled')
      },
    })
  },
  updateLoginPwdAndUNameAndFundPwd () {
    const self = this
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/userinfo/updatepwds.json',
      data: {
        token: self.token,
        uName: self.$form.find('.js-uu-uName').val(),
        oldPwd: self.$form.find('#oldLoginPassword').val(),
        newPwd: self.$form.find('#newLoginPassword').val(),
        oldPayPwd: self.$form.find('#jsUUOldFundPassword').val(),
        newPayPwd: self.$form.find('#jsUUNewFundPassword').val(),

        beforeSend (xhr, settings) {
          self.$form.find('button[type="submit"]').text('登录中...').addClass('disabled')
        },
      },
    })
  },

  _getLoginErrorEl (text) {
    return `${'<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> '}${text 
    }</div>`
  },
  getUrlParams () {
    // 获取当前URL地址
    const search = window.location.search
    // 从search中抽取从 1 开始到search.length字符，并以&分割获取写入字符串
    const tmparray = search.substr(1, search.length).split('&')
    const paramsArray = []
    if (tmparray) {
      for (let i = 0; i < tmparray.length; i++) {
        // 用=进行拆分，但不包括==
        const reg = /[=|^==]/
        // 用&替换reg
        const set1 = tmparray[i].replace(reg, '&')
        // 以&分割获取
        const tmpStr2 = set1.split('&')
        const array = []
        array[tmpStr2[0]] = tmpStr2[1]
        // 将array添加到paramsArray中，并返回长度
        paramsArray.push(array)
      }
    }
    // 返回参数数组
    return paramsArray
  },
  checkUNameExistHandler(e) {
    const self = this
    const cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie',
    })
    const data = {
      token: cookie.get('token'),
      uname: this.$userUName.val(),
    }
    let isValidate = false
    if (this.$userUName.val() === '') {
      self._showValResult(1, self.$userUNameValDes, '昵称不能为空', this.$userUNameValRes)
      return isValidate
    }
    const myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/
    if (myReg.test(this.$userUName.val())) {
      if (!(this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length <= 16)) {
        self._showValResult(1, self.$userUNameValDes, '昵称仅支持4-16个字符', this.$userUNameValRes)
        return isValidate
      }
    } else {
      self._showValResult(1, self.$userUNameValDes, '昵称仅支持英文和数字，不能以数字开头', this.$userUNameValRes)
      return isValidate
    }

    this.checkUNameExistXhr(data).fail(() => {
      self._showValResult(1, self.$userUNameValDes, '昵称验证失败', self.$userUNameValRes)
    }).done((res) => {
      if (res.result === 0) {
        self._showValResult(0, self.$userUNameValDes, '', self.$userUNameValRes)
        isValidate = true
      } else {
        self._showValResult(1, self.$userUNameValDes, res.msg, self.$userUNameValRes)
      }
    })
    return isValidate
  },

  valPasswordOldHandler() {
    // this._valPassword(this.$passwordOld,this.$passwordOldValRes,this.$passwordOldValDes,null,null,this.$password,this.$passwordValRes);

    const passwordOld = this.$passwordOld.val()
    const msg = '旧登录密码不能为空'

    if (passwordOld === '') {
      this._showValResult(1, this.$passwordOldValDes, msg, this.$passwordOldValRes)
      return false
    }
    this._showValResult(0, this.$passwordOldValDes, '', this.$passwordOldValRes)
    return true
  },
  valPasswordHandler() {
    // this._valPassword(this.$password,this.$passwordValRes,this.$passwordValDes,this.$password1,this.$password1ValRes,this.$passwordOld,this.$passwordOldValRes);
    const password = this.$password.val()
    let msg = '您填写的密码不符合要求，请重新填写'

    if (password === '') {
      msg = '新登录密码不能为空'
      this._showValResult(1, this.$passwordValDes, msg, this.$passwordValRes)
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
      this._showValResult(0, this.$passwordValDes, '', this.$passwordValRes)
      return true
    }
    this._showValResult(1, this.$passwordValDes, msg, this.$passwordValRes)
    return false
  },
  valPassword1Handler() {
    // this._valPassword(this.$password1,this.$password1ValRes,this.$password1ValDes,this.$password,this.$passwordValRes);
    const password = this.$password.val()
    const password1 = this.$password1.val()

    let msg = '两次输入的密码不一致'
    if (password1 === '') {
      msg = '确认新密码不能为空'
      this._showValResult(1, this.$password1ValDes, msg, this.$password1ValRes)
      return false
    } else if (password1 !== password) {
      this._showValResult(1, this.$password1ValDes, msg, this.$password1ValRes)
      return false
    }
    this._showValResult(0, this.$password1ValDes, '', this.$password1ValRes)
    return true
  },
  _valPassword($password, $result, $describe, $target, $targetResult, $notEqual, $notEqualResult) {
    const password = $password.val()
    const myReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
    const msg = []
    if (password.length < 6 || password.length > 20) {
      msg.push('密码长度限制6-20位字符')
    }
    if (!myReg.test(password)) {
      msg.push('不能使用特殊符号')
    }
    if ($target && password !== '' && $target.val() !== '') {
      if (password !== $target.val()) {
        msg.push('两次输入的密码不一致')
      } else if (_(msg).isEmpty() && $targetResult.val() === '1') {
        this._showValResult(0, $describe, '', $result)
        $target.trigger('blur')
      }
    }
    if ($notEqual && $notEqual.val() !== '' && password !== '') {
      if (password === $notEqual.val()) {
        msg.push('新旧密码不能一致')
      } else {
      //  $notEqual.trigger('blur');
        if (_(msg).isEmpty() && $notEqualResult !== null && $notEqualResult.val() === '1') {
          this._showValResult(0, $describe, '', $result)
          $notEqual.trigger('blur')
        }
      }
    }

    if (_(msg).size() > 0) {
      this._showValResult(1, $describe, msg.join(','), $result)
      return false
    }
    this._showValResult(0, $describe, '', $result)
    return true
  },

  _showValResult(result, $container, msg, $valResult, notShowRightTag) {
    const wrong = `<div class="val-img-times"><span class="text-danger">${msg}</span></div>`
    let right = ''
    if (!notShowRightTag) {
      right = '<div class="val-img-check">&nbsp;</div>'
    }
    if (result === 0) {
      $container.html(right)
      if ($valResult) {
        $valResult.val('0')
      }
    } else if (result === 1) {
      $container.html(wrong)
      if ($valResult) {
        $valResult.val('1')
      }
    } else {
      $container.html('')
    }
  },
  quitHandler() {
    window.location.href = 'index.html'
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
})

$(document).ready(() => {
  $('.js-package').before(_(header).template()({})).after(footer)
  $('.js-package').updateUserInfo()
})
