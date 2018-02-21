/**
 * Created by dean on 2017/9/9.
 */


require('./index.scss')

const signInView = Base.ItemView.extend({
  template: require('./index.html'),
  events: {
    'click .js-sg-sign-up-btn': 'signUpHandler',
  },

  getSignDateXHR () {
    return Global.sync.ajax({
      url: '/mall/mission/signInfo.json',
    })
  },

  doSignInXHR () {
    return Global.sync.ajax({
      url: '/mall/mission/sign.json',
    })
  },
  onRender() {
    const self = this
    self.$bgBody = self.$('.js-sign-up-bg-body')
    self.$smBody = self.$('.js-success-sign-up')
    self.$getIntegral = self.$('.js-get-integral-value')
    self.$signTimes = self.$('.js-sign-up-times')
    self.$signBtn = self.$('.js-sg-sign-up-btn')
    self.ifSignBtn = self.$('.js-if-sign-btn')
    self.calendarCreate()
    self.getSignDateXHR()
      .done((res) => {
        if (res.result == 0) {
          self.$signTimes.text(res.root.combo)
          self.alreadySignUpDay(res.root.signDate, res.root.currentDate)
          self.writeRules(res.root.cfgs, res.root.integral)
          if (res.root.isReceiveToday == true) {
            self.$('.js-sg-sign-up-btn').addClass('sg-already-sign-up-btn')
            self.$signBtn.attr('disabled', true)
            self.ifSignBtn.text('今日已签到')
          }
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
      .fail((res) => {

      })
  },
  serializeData () {
    /*    var options = {
     };
     _.extend(options, {
     });
     return options; */
  },

  calendarCreate() {
    const self = this
    self.$dayList = self.$('.js-day-list')
    const myDate = new Date()
    let html = ''
    self.$('.js-date-today').text(`${myDate.getFullYear()}年${parseInt(myDate.getMonth() + 1)}月${myDate.getDate()}日`)
    const d = new Date(myDate.getFullYear(), parseInt(myDate.getMonth() + 1), 0)
    const totalDay = d.getDate() // 获取当前月的天数
    const monthFirst = new Date(myDate.getFullYear(), parseInt(myDate.getMonth()), 1).getDay()// 本月一号周几
    self.$today = myDate.getDate()
    const totalNum = 42
    for (let i = 0; i < totalNum; i++) {
      if (i >= monthFirst && i < totalDay + monthFirst) {
        html += `<li class="day-icon js-date-list${i - monthFirst + 1}">${i - monthFirst + 1}</li>`
      } else {
        html += '<li class="day-icon"></li>'
      }
    }
    self.$dayList.html(html)
    self.$('.day-icon').eq(monthFirst + self.$today - 1).removeClass('day-icon').addClass('today-icon')
  },
  alreadySignUpDay (data, currentDate) {
    const self = this
    if (data.length > 0) {
      const current = new Date(currentDate)
      const thisMonth = current.getMonth() + 1
      _(data).map((item, index) => {
        const theDate = new Date(item)
        if (theDate.getDate() == self.$today) {
          self.$(`.js-date-list${theDate.getDate()}`).addClass('mc-today-all-ready')
          return
        }
        if ((theDate.getMonth() + 1) === thisMonth) {
          self.$(`.js-date-list${theDate.getDate()}`).addClass('mc-all-ready')
        }
      })
    }
  },
  writeRules (data, integral) {
    const self = this
    let rules = `<strong>签到规则</strong><p>1、首次签到获得${_(integral).formatDiv(10000)}</p>`
    if (data.length > 0) {
      _(data).map((item, index) => {
        rules += `<p>${index + 2}、连续签到${item.day}天后积分奖励增至${_(item.integral).formatDiv(10000)}</p>`
      })
      self.$('.js-rule-list').html(rules)
    }
  },
  signUpHandler () {
    const self = this
    self.doSignInXHR()
      .done((res) => {
        if (res.result == 0) {
          self.$bgBody.hide()
          const $height = $(window).height()
          const $width = $(window).width()
          self.$('.js-all-sign-days').text(res.root.combo)
          self.$('.js-get-integral-value').text(_(res.root.reveiveIntegral).formatDiv(10000))
          self.$smBody.css({
            top: '5%',
            left: `${($width - self.$smBody.width()) / 2}px`,
          }).show()
          self.trigger('update:userInfo')
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
      .fail((res) => {

      })
  },
})
module.exports = signInView
