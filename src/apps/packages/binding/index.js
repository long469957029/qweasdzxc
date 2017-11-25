require('./index.scss')

$.widget('gl.binding', {

  template: require('./index.html'),

  _create() {
    const self = this

    this._on({
      'click .js-binding-btn': 'getBindingHandler',
      'click .js-login-btn': 'getLoginHandler',
      'click .js-sure-btn': 'getSureHandler',
      'click .js-back-btn-01': 'getBack01Handler',
      'click .js-back-btn-02': 'getBack02Handler',
    })

    this.element.html(_(this.template).template()())

    try {
      this.username = window.android.get()
    } catch (e) {
      console.log(e.message)
      // this.username = "leoleo";
    }

    // alert(this.username);

    this.$contentMain01 = this.element.find('.js-content-main-01')
    this.$contentMain02 = this.element.find('.js-content-main-02')
    this.$contentMain03 = this.element.find('.js-content-main-03')
    this.$contentMain04 = this.element.find('.js-content-main-04')
    this.$contentMain05 = this.element.find('.js-content-main-05')
    this.$contentMain06 = this.element.find('.js-content-main-06')

    this.$tm = this.element.find('.js-t-m')
    this.$ts = this.element.find('.js-t-s')
    this.$username = this.element.find('.js-username')

    self.myurl = this.GetQueryString('device')
    // if(!_.isNull(self.myurl)){
    //   alert(self.myurl);
    // }
    if (_.isString(this.username) && this.username.length > 1) {
      this.getSqHandler()
    }
  },

  GetQueryString (name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`)
    const r = window.location.search.substr(1).match(reg)
    if (r != null) return unescape(r[2]); return null
  },

  getBindingHandler () {
    const self = this

    self.usernameInput = this.element.find('.js-username-input').val()
    self.usernameSure = this.element.find('.js-username-sure').val()

    if (self.usernameInput == self.usernameSure) {
      $.ajax({
        type: 'POST',
        url: '/acct/security/bind.json',
        data: {
          username: self.usernameInput,
          device: self.myurl,
        },
      })
        .done((res) => {
          if (res && res.result == 0) {
            self.$contentMain01.addClass('hidden')
            self.$contentMain03.removeClass('hidden')
            self.$username.html(self.usernameInput)
            try {
              window.android.save(self.usernameInput)
            } catch (e) {
              console.log(e.message)
            }
          } else {
            self.$contentMain01.addClass('hidden')
            self.$contentMain06.removeClass('hidden')
          }
        })
    }
  },

  getLoginHandler () {
    const self = this

    self.usernameInput = this.element.find('.js-username-input').val()
    self.usernameSure = this.element.find('.js-username-sure').val()

    if (self.usernameInput == self.usernameSure) {
      // window.setTimeout(function() {

      $.ajax({
        type: 'POST',
        url: '/acct/security/req.json',
        data: {
          username: self.usernameInput,
          device: self.myurl,
        },
      })
        .done((res) => {
          if (res && res.result == 0) {
            const intDiff = parseInt(59000 / 1000)
            self.GetRTime(intDiff)
            self.$contentMain02.addClass('hidden')
            self.$contentMain05.removeClass('hidden')
            window.setTimeout(() => {
              self.$contentMain02.removeClass('hidden')
              self.$contentMain05.addClass('hidden')
            }, 59000)
          } else {
            self.$contentMain02.addClass('hidden')
            self.$contentMain04.removeClass('hidden')
          }
        })
      // }, 120000);
    }
  },

  GetRTime (intDiff) {
    const self = this
    window.clearInterval(this.time)

    this.time = window.setInterval(() => {
      let day = 0, 
        hour = 0, 
        minute = 0, 
        second = 59// 时间默认值
      if (intDiff > 0) {
        day = Math.floor(intDiff / (60 * 60 * 24))
        hour = Math.floor(intDiff / (60 * 60)) - (day * 24)
        minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60)
        second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
      }
      if (hour <= 9) hour = `0${hour}`
      if (minute <= 9) minute = `0${minute}`
      if (second <= 9) second = `0${second}`
      // $('#t_d').html(day+"天");
      // $('#t_h').html(hour+'时');
      self.$tm.html(minute)
      self.$ts.html(second)
      intDiff--
    }, 1000)
  },

  getSureHandler () {
    const self = this

    self.$contentMain03.addClass('hidden')
    self.$contentMain02.removeClass('hidden')
  },

  getSqHandler () {
    const self = this
    self.$username.html(self.username)
    self.$contentMain01.addClass('hidden')
    self.$contentMain02.removeClass('hidden')
    this.element.find('.js-username-input').val(self.username)
    this.element.find('.js-username-sure').val(self.username)
  },

  getBack01Handler () {
    const self = this

    self.$contentMain04.addClass('hidden')
    self.$contentMain02.removeClass('hidden')
  },

  getBack02Handler () {
    const self = this

    self.$contentMain06.addClass('hidden')
    self.$contentMain01.removeClass('hidden')
  },
})

$(document).ready(() => {
  $('.js-package').binding().addClass('main-404-div')
})
