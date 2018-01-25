require('./register.scss')
require('packages/misc/common-init.js')
// require('./jquery-ui.js');
// const logo = require('skeleton/bases/footer/footerLogo.png')
// const calendar = require('skeleton/bases/footer/footerCalendar.png')
const qrcode = require('packages/newDownload/qrCode/iso-download.png')

// var footer = require('skeleton/base/footer');

$.widget('gl.registers', {

  template: require('./register.html'),

  checkNameExistXhr(data) {
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/userexist.json',
      data,
    })
  },
  checkUNameExistXhr(data) {
    const self = this
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/checkuname.json',
      data,
    })
  },
  registerXhr (data) {
    return $.ajax({
      type: 'POST',
      url: '/acct/reg/doreg.json',
      data,
    })
  },

  _create () {
    this.element.html(_(this.template).template()())
    this._setupForm()
    this._bindEvent()
  },
  _setupForm () {
    var self = this
    const linkId = _.getUrlParam('linkId')
    this.$linkId = this.element.find('.js-re-linkId')
    this.$linkId.val(linkId)
    this.$username = this.element.find('.js-reg-username')
    this.$password = this.element.find('.js-reg-pwd')
    this.$slider = this.element.find('#slider')
    this.$msg = this.element.find('.js-input-err-msg')
    this.$submit = this.element.find('.js-reg-submit')

    this.canReg = true
    this.$slider.draggable({
      axis: 'x',
      containment: 'parent',
      drag(event, ui) {
        if (ui.position.left > 380) {
          self.element.find('#well').fadeOut()
          self.canReg = true
          // self.$submit.prop('disabled',false);
        } else {
          // Apparently Safari doesn't allow partial opacity on text with background clip? Not sure.
          // $("h2 span").css("opacity", 100 - (ui.position.left / 5))
        }
      },
      stop(event, ui) {
        if (ui.position.left < 380) {
          $(this).animate({
            left: 0,
          })
        }
      },
    })

    // this.$slider.on('touchmove', function(event) {
    //   event.preventDefault();
    //   var el = event.target;
    //   var touch = event.touches[0];
    //   curX = touch.pageX - this.offsetLeft - 73;
    //   if(curX <= 0) return;
    //   if(curX > 430){
    //     $('#well').fadeOut();
    //   }
    //   el.style.webkitTransform = 'translateX(' + curX + 'px)';
    // });
    //
    // this.$slider.on('touchend', function(event) {
    //   this.style.webkitTransition = '-webkit-transform 0.3s ease-in';
    //   this.addEventListener( 'webkitTransitionEnd', function( event ) { this.style.webkitTransition = 'none'; }, false );
    //   this.style.webkitTransform = 'translateX(0px)';
    // });

    // 初始化footer
    this.$footer = this.element.find('#js-reg-footer')
    this.$code = this.element.find('.js-footer-code')// 二维码
    this.$desc = this.element.find('.js-footer-desc')// 描述
    this.$code.attr('src', qrcode)
    this.$desc.html('下载最新横屏手机客户端')
    var self = this
    // this.element.find('.js-footer-logo').attr('src', logo)
    // this.element.find('.js-footer-calendar-icon').attr('src', calendar)
    this.$calendarText = this.element.find('.js-footer-calendar-text')
    let bonus = 290861502// 1499500814494
    const now = ((moment().valueOf() - 1499500814494) / 1000).toFixed(0)
    bonus += Number(now)
    const $amount = this.element.find('.js-reg-bonus-amount')
    setInterval(() => {
      self.$calendarText.html(_(new Date()).formatTime('YYYY-MM-DD HH:mm:ss'))
      bonus += Number((Math.random() * 10).toFixed())
      const arr = bonus + ''.split('')
      _($amount.find('span')).each((span, index) => {
        $(span).html(arr[index])
      })
    }, 1000)
  },
  // 绑定事件
  _bindEvent () {
    this._on({
      'click .js-reg-submit': 'submitHandler', // 校验用户名
      'blur .js-reg-username': 'checkNameExistHandler', // 校验用户名是否存在
      'blur .js-reg-pwd': 'valPasswordHandler',

    })
  },
  submitHandler(e) {
    this.registerHandler(e)
  },
  showMsg(msg) {
    this.$msg.html(msg)
  },

  // touchMoveSlide: function(event) {
  //   event.preventDefault();
  //   var el = event.target;
  //   var touch = event.touches[0];
  //   curX = touch.pageX - this.offsetLeft - 73;
  //   if(curX <= 0) return;
  //   if(curX > 550){
  //     $('#well').fadeOut();
  //   }
  //   el.style.webkitTransform = 'translateX(' + curX + 'px)';
  // },
  //
  // touchEndSlide: function(event) {
  //   this.style.webkitTransition = '-webkit-transform 0.3s ease-in';
  //   this.addEventListener( 'webkitTransitionEnd', function( event ) { this.style.webkitTransition = 'none'; }, false );
  //   this.style.webkitTransform = 'translateX(0px)';
  // },


  registerHandler (e) {
    const self = this
    if (self.$username.val() === '') {
      self.showMsg('用户名不能为空')
      return
    }
    if (!this._valPassword()) {
      return false
    }
    Global.cookieCache.set('token', '')
    this.element.find('.js-re-uname').val(this.$username.val())
    this.checkNameExistXhr({ username: this.$username.val() }).fail(() => {
      // self._showValResult(1,self.$usernameValDes,"用户名验证出错",self.$usernameValRes);
      self.showMsg('请求失败！')
    }).done((res) => {
      if (res.result === 0) {
        self.showMsg('')
        if (self.canReg) {
          self.registerUser(e)
        } else {
          self.showMsg('请先滑动滑块解锁。')
        }
      } else {
        self.showMsg(res.msg)
      }
    })
  },
  registerUser(e) {
    const self = this
    const $target = $(e.currentTarget)
    // $target.button('loading');
    const $registerForm = this.element.find('.js-reg-form')
    const data = _($registerForm.serializeArray()).serializeObject()
    this.registerXhr(data).always(() => {
      // $target.button('reset');
    }).fail(() => {
      Global.ui.notification.show('注册失败！', {
        btnContent: '重新注册',
        event() {
          self._create()
        },
      })
    }).done((res) => {
      if (res.result === 0) {
        _czc.push(['_trackEvent', 'PC新注册页', '创建成功'])
        // Global.ui.notification.show('注册成功！',{type:'success',btnContent:'登陆',event:function(){
        //   Global.cookieCache.set('token', res.root.token);
        //   window.location.href = 'index.html';
        // }});
        Global.cookieCache.set('token', res.root.token)
        window.location.href = 'index.html'
        // self.element.find('.js-re-notice').html(self._getErrorEl('注册成功！'));
      } else {
        // self.element.find('.js-re-notice').html(self._getErrorEl('注册失败！' + res.msg));
        let msg = '注册失败！'
        if (res.msg !== 'fail') {
          msg = res.msg
          Global.ui.notification.show(msg, {
            btnContent: '确定',
            event() {
              self._create()
            },
          })
        } else {
          Global.ui.notification.show(msg, {
            btnContent: '重新注册',
            event() {
              self._create()
            },
          })
        }
      }
    })
  },

  _valPassword() {
    const password = this.$password.val()
    if (password === '') {
      this.showMsg('密码不能为空')
      return false
    }
    if (password.length < 6 || password.length > 20) {
      this.showMsg('密码长度限制6-20位字符')
      return false
    }

    if (!isNaN(password) && password.length < 9) {
      this.showMsg('不能是9位以下的纯数字（≤8个阿拉伯数字）')
      return false
    }
    return true
  },

  valPasswordHandler() {
    this._valPassword()
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
  checkNameExistHandler(e) {
    const self = this
    const cookie = new Base.Storage({
      name: 'appstorage',
      type: 'cookie',
    })
    const data = {
      username: this.$username.val(),
    }
    if (this.$username.val() === '') {
      // self._showValResult(1,this.$usernameValDes,"用户名不能为空",self.$usernameValRes);
      this.showMsg('用户名不能为空')
      return false
    }
    const myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
    if (!myReg.test(this.$username.val())) {
      // self._showValResult(1,this.$usernameValDes,"仅支持4-16位字母和数字，不能以数字开头",self.$usernameValRes);
      this.showMsg('仅支持4-16位字母和数字，不能以数字开头')
      return false
    }
  },
  // checkUNameExistHandler: function(e){
  //  var self = this;
  //  var cookie = new Base.Storage({
  //    name: 'appstorage',
  //    type: 'cookie'
  //  });
  //  var data = {
  //    uname:this.$userUName.val()
  //  };
  //  if(this.$userUName.val()==''){
  //    self._showValResult(1,self.$userUNameValDes,"昵称不能为空",this.$userUNameValRes);
  //    return;
  //  }else {
  //    var myReg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
  //    if (myReg.test(this.$userUName.val())) {
  //       if(!(this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length >= 4 && this.$userUName.val().replace(/[\u4e00-\u9fa5]/g, '**').length <= 16)){
  //         self._showValResult(1,self.$userUNameValDes,"昵称仅支持4-16个字符，",this.$userUNameValRes);
  //         return false;
  //       }
  //    }else{
  //      self._showValResult(1,self.$userUNameValDes,"昵称仅支持英文和数字，不能以数字开头",this.$userUNameValRes);
  //      return false;
  //    }
  //  }
  //  this.checkUNameExistXhr(data).fail(function(){
  //    self._showValResult(1,self.$userUNameValDes,"昵称验证失败",self.$userUNameValRes);
  //  }).done(function(res){
  //    if(res.result===0){
  //      //self.element.find('.js-re-uName-tip').addClass('hidden');
  //      self._showValResult(0,self.$userUNameValDes,"",self.$userUNameValRes);
  //    }else{
  //      //self.element.find('.js-re-uName-tip').removeClass('hidden').html(res.msg);
  //      self._showValResult(1,self.$userUNameValDes,res.msg,self.$userUNameValRes);
  //    }
  //  });
  // },
  refreshValCodeHandler() {
    this.$valImg.attr('src', '')
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
    this.$valCodeRes.val('1')
    this.$valCode.val('')
    this.$valCode.focus()
    this.$valCodeDes.html('')
  },
  refreshValCodeOnly() {
    this.$valImg.attr('src', '')
    this.$valImg.attr('src', `${this.codeUrl}?_t=${_.now()}`)
  },

  valCodeHandler (e) {
    const self = this
    if (self.$valCode && self.$valCode.val() != '' && self.$valCode.val().length === 4) {
      $.ajax({
        type: 'POST',
        url: '/acct/imgcode/val.json',
        data: {
          code: self.$valCode.val(),
        },
      }).done((data, status, xhr) => {
        if (data.result === 0) {
          self._showValResult(0, self.$valCodeDes, '', self.$valCodeRes)
          self.registerHandler(e)
        } else {
          self._showValResult(1, self.$valCodeDes, '验证码输入有误', self.$valCodeRes)
          // self.refreshValCodeHandler();
          self.refreshValCodeOnly()
        }
      }).fail(() => {
        self._showValResult(1, self.$valCodeDes, '验证码输入有误', self.$valCodeRes)
        // self.refreshValCodeHandler();
        self.refreshValCodeOnly()
      })
    } else {
      self.$valCodeRes.val('1')
      self.$valCodeDes.html('')
      if (self.$valCode.val() === '' || self.$valCodeRes.val() === '1') {
        self._showValResult(1, self.$valCodeDes, '请输入正确的验证码', self.$valCodeRes)
        // self.refreshValCodeHandler();
        flag = false
      }
    }
  },
  _showValResult(result, $container, msg, $valResult, notShowRightTag) {
    const wrong = `<span class="text-danger">${msg}</span>`
    let right = ''
    if (!notShowRightTag) {
      right = ''
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
  renderError(text) {
    this.$form.find('.login-error-message').html(text)
  },


})

$(document).ready(() => {
  $('.js-package').registers()
})
