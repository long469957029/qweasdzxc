require('./register.scss')
require('./../misc/common-init.js')

// var header = require('../misc/header.html');
// var footer = require('../misc/footer.html');

const bannerConfig = require('./bannerConfig')

$.widget('gl.register', {

  template: require('./register.html'),

  _bindEvent () {
    const self = this
    // 绑定事件
    this._on({
      'click .js-re-register-submit': 'valCodeHandler', // 校验用户名
      'blur .js-re-userName': 'checkNameExistHandler', // 校验用户名是否存在
      // 'blur .js-re-uName': 'checkUNameExistHandler',//校验昵称是否存在
      'click .js-re-valImg': 'refreshValCodeHandler', // 刷新验证码
      'blur #jsRELoginPassword': 'valPasswordHandler',
      'click .js-promise-open': 'openPromiseHandler',
      'click .js-promise-close': 'closePromiseHandler',
      'click .js-move-down': 'movedownHandler',
      // 'blur #jsRELoginPassword1': 'valPassword1Handler'
    })
    // this.element.find('.js-re-valCode').on('blur', function() {
    //  self.valCodeHandler();//校验验证码
    // });
  },
  movedownHandler () {
    $.fn.fullpage.moveSectionDown()
  },

  openPromiseHandler (e) {
    const self = this
    self.$promiseModal.removeClass('hidden', true)
    $.fn.fullpage.setAllowScrolling(false)
  },

  closePromiseHandler (e) {
    const self = this
    self.$promiseModal.addClass('hidden', true)
    $.fn.fullpage.setAllowScrolling(true)
  },

  checkRegisterTypeXhr (data) {
    const self = this
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/reg/viewType.json',
      data,
    })
  },
  checkNameExistXhr (data) {
    const self = this
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/reg/userexist.json',
      data,
    })
  },
  checkUNameExistXhr (data) {
    const self = this
    return Global.sync.ajax({
      type: 'POST',
      async: false,
      url: '/acct/reg/checkuname.json',
      data,
    })
  },

  registerXhr (data) {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/reg/doreg.json',
      data,
    })
  },

  getBannerADXhr () {
    return Global.sync.ajax({
      type: 'POST',
      url: '/acct/usernotice/getregadvertise.json',
    })
  },

  _create () {
    const self = this
    this.element.html(_(this.template).template()())
    self._setupForm()
    self._bindEvent()
    $(() => {
      setTimeout(() => {
        $('.loading').addClass('hidden')
        $('#fullpage').removeClass('opacity-0')
        self.loadAnimate()
      }, 500)
    })
  },

  loadAnimate () {
    const self = this
    this.element.find('#fullpage').fullpage({
      verticalCentered: false,
      css3: true,
      navigation: true,
      loopBottom: true,
      afterLoad (anchorLink, index) {
        const selectorHeader = `#section${index} .section-header`
        const selectorContent = `#section${index} .section-content`
        $(selectorHeader).addClass('active')
        $(selectorContent).addClass('active')
      },

      onLeave (index, nextIndex, direction) {
        const selectorHeader = `#section${index} .section-header`
        const selectorContent = `#section${index} .section-content`
        $(selectorHeader).removeClass('active')
        $(selectorContent).removeClass('active')
      },
    })
  },


  registerHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const $registerForm = this.element.find('.js-re-registerForm')
    // var clpValidate = $registerForm.parsley().validate();

    let flag = true
    if (self.$username.val() === '' || self.$usernameValRes.val() === '1') {
      self._showValResult(1, self.$usernameValDes, '仅支持4-16位字母和数字，不能以数字开头', self.$usernameValRes)
      flag = false
    }
    // if(self.$userUName.val()==='' || self.$userUNameValRes.val()==='1'){
    //   self._showValResult(1,self.$userUNameValDes,'请输入有效的昵称',self.$userUNameValRes);
    //   flag =  false;
    // }
    if (!self.valPasswordHandler()) {
      flag = false
    }

    // if(!self.valPassword1Handler()){
    //   flag =  false;
    // }

    if (self.$valCode.val() === '' || self.$valCodeRes.val() === '1') {
      self._showValResult(1, self.$valCodeDes, '请输入正确的验证码', self.$valCodeRes)
      self.refreshValCodeHandler()
      flag = false
    }

    if (flag) {
      $target.button('loading')
      const data = _($registerForm.serializeArray()).serializeObject()
      this.registerXhr(data).always(() => {
        $target.button('reset')
      }).fail(() => {
        Global.ui.notification.show('注册失败！', {
          btnContent: '重新注册',
          event () {
            window.location.reload()
          },
        })
      }).done((res) => {
        if (res.result === 0) {
          registerVA()
          Global.ui.notification.show('注册成功！', {
            type: 'success',
            btnContent: '登陆',
            event () {
              window.location.href = 'login.html'
            },
          })
          // self.element.find('.js-re-notice').html(self._getErrorEl('注册成功！'));
        } else {
          // self.element.find('.js-re-notice').html(self._getErrorEl('注册失败！' + res.msg));
          let msg = '注册失败！'
          if (res.msg !== 'fail') {
            msg = res.msg
            Global.ui.notification.show(msg, {
              btnContent: '确定',
              event () {
                window.location.reload()
              },
            })
          } else {
            Global.ui.notification.show(msg, {
              btnContent: '重新注册',
              event () {
                window.location.reload()
              },
            })
          }
        }
      })
    } else {
      self.refreshValCodeHandler()
    }
  },

  valPasswordHandler () {
    const password = this.$password.val()
    let msg = '密码为6-20位字符组成（不含空格），区分大小写，不能是9位以下的纯数字'

    if (password === '') {
      msg = '登录密码不能为空'
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
  // valPassword1Handler: function(){

  //   var password = this.$password.val();
  //   var password1 = this.$password1.val();

  //   var msg = '两次输入的密码不一致';
  //   if(password1===''){
  //     msg = '确认密码不能为空';
  //     this._showValResult(1, this.$password1ValDes, msg, this.$password1ValRes);
  //     return false;
  //   }else if(password1!==password){
  //     this._showValResult(1, this.$password1ValDes, msg, this.$password1ValRes);
  //     return false;
  //   }else{
  //     this._showValResult(0, this.$password1ValDes, '', this.$password1ValRes);
  //     return true;
  //   }
  // },

  _setupForm () {
    const self = this
    this.element.html(_(this.template).template()())

    this.$promiseModal = this.element.find('.js-promise-mask')
    this.$username = this.element.find('.js-re-userName')
    this.$usernameValRes = this.element.find('.js-re-username-val-res')
    this.$usernameValDes = this.element.find('.js-re-verify-username')
    // this.$userUName = this.element.find('.js-re-uName');
    // this.$userUNameValRes = this.element.find('.js-re-uName-val-res');
    // this.$userUNameValDes = this.element.find('.js-re-verify-userUName');

    this.$password = this.element.find('#jsRELoginPassword')
    this.$passwordValRes = this.element.find('.js-re-password-val-res')
    this.$passwordValDes = this.element.find('.js-re-verify-password')

    this.$checkPromise = this.element.find('.js-promise-check')
    this.$checkPromiseValDes = this.element.find('.js-promise-check-val-des')

    // this.$password1 = this.element.find('#jsRELoginPassword1');
    // this.$password1ValRes = this.element.find('.js-re-password1-val-res');
    // this.$password1ValDes = this.element.find('.js-re-verify-password1');

    this.$valCode = this.element.find('.js-re-valCode')
    this.$valImg = this.element.find('.js-re-valImg')
    this.$valCodeRes = this.element.find('.js-re-valCode-val-res')
    this.$valCodeDes = this.element.find('.js-re-valCode-val-des')
    const url = window.self.location.toString()
    this.codeUrl = `${url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3))}/acct/imgcode/code`
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    const linkId = _.getUrlParam('linkId')
    this.element.find('.js-re-linkId').val(linkId)
    // 加载广告信息
    this.renderRegistrationBannerAD()
  },
  renderRegistrationBannerAD () {
    const self = this
    this.getBannerADXhr().done((res) => {
      if (res.result === 0) {
        self.generateBannerAD(res.root)
      }
    })
  },
  generateBannerAD (data) {
    const liList = []
    const divList = []

    if (_(data).isEmpty()) {
      data = bannerConfig
    }

    _(data).each((item, index) => {
      const div = []
      div.push(`<div class="item${index === 0 ? ' active' : ''}">`)
      div.push(`<a href="${item.advUrl ? item.advUrl : 'javascript:void(0)'}" target="_blank"><img src="${item.picUrl}" alt="${item.advName}"></a>`)
      div.push('</div>')
      divList.push(div.join(''))
      liList.push(`<li data-target="#jsREADCarousel" data-slide-to="${index}${index === 0 ? '" class="active"' : '"'}></li>`)
    })
    if (_(liList).size() > 1) {
      this.element.find('.js-re-navigate').html(liList.join(''))
    }
    this.element.find('.js-re-ad-container').html(divList.join(''))
  },


  // 拼装广告；
  _generateAD (adList) {
    const self = this
    _(adList).each((ad, index) => {
      let li = `<li data-target = "#jsREADCarousel" data-slide-to = "${index}`
      if (index === 0) {
        li += '" class = "active" '
      }
      li += '"> < / li >'
      self.element.find('.js-re-navigate').append(li)

      let div = ` <div class="item"> <img src="${ad.picUrl}" class = "item `
      if (index === 0) {
        li += ' active '
      }
      div = `${div}" alt> <div class="carousel-caption"><h4>${ad.advName}</h4><p></p></div></div>`
      self.element.find('.js-re-ad-container').append(div)
    })
  },

  _getErrorEl (text) {
    return `${'<div class="alert alert-danger alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<i class="fa fa-times-circle m-right-xs"></i>' +
      '<strong>提示！</strong> '}${text 
    }</div>`
  },
  checkNameExistHandler (e) {
    const self = this
    $('.js-re-uName').val(this.$username.val())
    // var cookie = new Base.Storage({
    //   name: 'appstorage',
    //   type: 'cookie'
    // });
    const data = {
      username: this.$username.val(),
    }

    if (this.$username.val() === '') {
      self._showValResult(1, this.$usernameValDes, '用户名不能为空', self.$usernameValRes)
      return false
    }
    // else if(!this.checkUNameExistHandler()){
    //   self._showValResult(1,this.$usernameValDes,"用户名已存在",self.$usernameValRes);
    //   return false;
    // }
    
    var myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
    if (!myReg.test(this.$username.val())) {
      self._showValResult(1, this.$usernameValDes, '仅支持4-16位字母和数字，不能以数字开头', self.$usernameValRes)
      return false
    }
    
    if (this.$username.val() === '') {
      self._showValResult(1, this.$usernameValDes, '用户名不能为空', self.$usernameValRes)
      return false
    } 
    var myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
    if (!myReg.test(this.$username.val())) {
      self._showValResult(1, this.$usernameValDes, '仅支持4-16位字母和数字，不能以数字开头', self.$usernameValRes)
      return
    }
    
    this.checkNameExistXhr(data).fail(() => {
      self._showValResult(1, self.$usernameValDes, '仅支持4-16位字母和数字，不能以数字开头', self.$usernameValRes)
    }).done((res) => {
      if (res.result === 0) {
        self._showValResult(0, self.$usernameValDes, '', self.$usernameValRes)
      } else {
        if (res.msg == 'invalid user token') {
          res.msg = '操作异常，请清除浏览器缓存'
        }
        self._showValResult(1, self.$usernameValDes, res.msg, self.$usernameValRes)
      }
    })
    // this.checkUNameExistHandler();
  },
  // checkUNameExistHandler: function(e){
  //   var self = this;
  //   var flag;
  //   var cookie = new Base.Storage({
  //     name: 'appstorage',
  //     type: 'cookie'
  //   });
  //   var data = {
  //     uname:this.$userUName.val()
  //   };
  //   if(this.$userUName.val()==''){
  //     self._showValResult(1,self.$userUNameValDes,"昵称不能为空",this.$userUNameValRes);
  //     return;
  //   }else {
  //     var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
  //     if (myReg.test(this.$userUName.val())) {
  //        if(!(this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length <= 16)){
  //          self._showValResult(1,self.$userUNameValDes,"昵称仅支持4-16个字符，",this.$userUNameValRes);
  //          return false;
  //        }
  //     }else{
  //       self._showValResult(1,self.$userUNameValDes,"昵称仅支持英文和数字，不能以数字开头",this.$userUNameValRes);
  //       return false;
  //     }
  //   }
  //   this.checkUNameExistXhr(data).fail(function(){
  //     self._showValResult(1,self.$userUNameValDes,"昵称验证失败",self.$userUNameValRes);
  //   }).done(function(res){
  //     if(res.result===0){
  //       flag = true;
  //       //self.element.find('.js-re-uName-tip').addClass('hidden');
  //       self._showValResult(0,self.$userUNameValDes,"",self.$userUNameValRes);
  //     }else{
  //       flag = false;
  //       //self.element.find('.js-re-uName-tip').removeClass('hidden').html(res.msg);
  //       self._showValResult(1,self.$userUNameValDes,res.msg,self.$userUNameValRes);
  //     }
  //   });
  //   return flag;
  // },
  refreshValCodeHandler () {
    this.$valImg.attr('src', '')
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    this.$valCodeRes.val('1')
    this.$valCode.val('')
    this.$valCode.focus()
    // this.$valCodeDes.html('');
  },
  refreshValCodeOnly () {
    this.$valImg.attr('src', '')
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
  },

  valCodeHandler (e) {
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
          self._showValResult(0, self.$valCodeDes, '', self.$valCodeRes)
          if (self.$checkPromise.is(':checked')) {
            self._showValResult(0, self.$checkPromiseValDes, '尚未同意平台政策与隐私声明协议')
            self.registerHandler(e)
          } else {
            self._showValResult(1, self.$checkPromiseValDes, '尚未同意平台政策与隐私声明协议')
          }
        } else {
          self._showValResult(1, self.$valCodeDes, '验证码输入有误', self.$valCodeRes)
          self.refreshValCodeHandler()
          self.refreshValCodeOnly()
        }
      }).fail(() => {
        self._showValResult(1, self.$valCodeDes, '验证码输入有误', self.$valCodeRes)
        self.refreshValCodeHandler()
        self.refreshValCodeOnly()
      })
    } else {
      self.$valCodeRes.val('1')
      self.$valCodeDes.html('')
      if (self.$valCode.val() === '' || self.$valCodeRes.val() === '1') {
        self._showValResult(1, self.$valCodeDes, '请输入正确的验证码', self.$valCodeRes)
        self.refreshValCodeHandler()
      }
    }
  },
  _showValResult (result, $container, msg, $valResult, notShowRightTag) {
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
  renderError (text) {
    this.$form.find('.login-error-message').html(text)
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
  const href = window.location.href
  const paramStr = href.substring(href.lastIndexOf('?'))
  const param = paramStr.split('=')

  Global.sync.ajax({
    url: '/acct/reg/linkView.json',
    data: { linkId: param[1] },
  }).done((res) => { })


  const linkId = _.getUrlParam('linkId')

  Global.sync.ajax({
    url: '/acct/reg/viewType.json',
    data: { linkUrl: linkId, type: 0 },
    withoutToken: true,
  }).done((res) => {
    if (res.result == 0) {
      if (res.root.type == 1) {
        // $('.js-package').before(_(header).template()({
        //   extra: '<span class="header-login">已有账号，<a class="text-pleasant" href="login.html">登录</a></span>'
        // })).after(footer);
        $('.js-package').register()
      } else if (res.root.type === 3) { // 跳转至登入页但保留linkId
        window.location.href = `login.html?linkId=${linkId}`
      } else {
        require('../registers/index.js')
      }
    } else {
      Global.ui.notification.show('无效的链接，可能无法注册成功！')
      // $('.js-package').before(_(header).template()({
      //   extra: '<span class="header-login">已有账号，<a class="text-pleasant" href="login.html">登录</a></span>'
      // })).after(footer);
      $('.js-package').register()
    }
  })
})
