

require('./jQueryRotate.2.2')
require('./index.scss')

const Roll = require('../roll')

const RaffleView = Base.ItemView.extend({
  template: require('./index.html'),

  events: {
    'click .sure_btn': 'sureHandler',
    'click .lot-btn': 'lotHandler',
    'click .close_btn': 'closeHandler',
  },

  auto: true,

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/raffleactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  doRaffleXhr() {
    return Global.sync.ajax({
      url: '/info/raffleactivity/doraffle.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  onRender() {
    const self = this
    this.$get = this.$('.status_get')
    this.$false = this.$('.status_false')
    this.$fullscreen = this.$('.status_fullscreen')
    this.$image = this.$('#imgs')

    this.updateInfo()
    setInterval(() => {
      self.updateInfo()
    }, 30000)

    this.roll = new Roll({
      el: '.js-roll',
    }).render()

    this.rotation(10000)
  },

  rotation(duration) {
    const self = this

    if (!this.auto) {
      return
    }
    this.$image.rotate({
      angle: 0,
      animateTo: 360,
      duration,
      callback() {
        self.rotation(duration)
      },
      easing (x, t, b, c, d) {
        // t: current time, b: begInnIng value, c: change In value, d: duration
        return c * (t / d) + b
      },
    })
  },

  updateInfo() {
    const self = this

    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-from-date').text(_(data.fromDate).toDate('YYYY年MM月DD日'))
          self.$('.js-end-date').text(_(data.endDate).toDate('YYYY年MM月DD日'))
          self.roll.roll(data.dataList)
        }
      })
  },

  openGetSure() {
    const temp_width = $(window).innerWidth() / 2
    const temp_height = $(window).innerHeight() / 2
    this.$get.css({
      top: temp_height - this.$get.height() / 2,
      left: temp_width - this.$get.width() / 2,
    })

    this.$get.show()
    this.$fullscreen.show()
  },

  lotHandler() {
    const self = this

    if (this.data.status === 0) {
      Global.ui.notification.show('活动未开始')
      return
    } else if (this.data.status === 2) {
      Global.ui.notification.show('活动已结束')
      return
    }

    if (!this.data.withdrawSuccess) {
      Global.ui.notification.show('您的账号还没有提现记录，一键搞定，资金轻松提取!<br />' +
        '<a class="btn-link btn-link-pleasant font-md" href="index.html#fc/wd" target="_blank">马上去提现</a>')
      return
    }

    if (this.data.totalRaffleTimes > 0) {
      this.doRaffleXhr()
        .done((res) => {
          if (res && res.result === 0) {
            self.rotation(500)

            window.setTimeout(() => {
              const data = res.root && res.root.raffleData[0]
              self.auto = false

              self.$image.rotate(self.gift(_(data.result).convert2yuan()))
              setTimeout(() => {
                self.openGetSure()
              }, 200)
            }, 1000)

            self.updateInfo()
          } else {
            Global.ui.notification.show(res.msg || '')
          }
        })
    } else {
      this.sureHandler()
    }
  },

  gift(money) {
    let gift
    const $setGiftName = $('.icon_smile_text span')

    switch (money) {
      case 8:
        gift = 38
        $setGiftName.html('8元')
        break
      case 12:
        gift = 328
        $setGiftName.html('12元')
        break
      case 16:
        gift = 268
        $setGiftName.html('16元')
        break
      case 20:
        gift = 205
        $setGiftName.html('20元')
        break
      case 24:
        gift = 145
        $setGiftName.html('24元')
        break
      case 28:
        gift = 89
        $setGiftName.html('28元')
        break
    }
    return gift
  },

  sureHandler() {
    const temp_width = $(window).innerWidth() / 2
    const temp_height = $(window).innerHeight() / 2

    if (!this.data.withdrawSuccess) {
      Global.ui.notification.show('您的账号还没有提现记录，一键搞定，资金轻松提取!<br />' +
        '<a class="btn-link btn-link-pleasant font-md" href="index.html#fc/wd" target="_blank">马上去提现</a>')
      return
    }

    this.$false.css({
      top: temp_height - this.$false.height() / 2,
      left: temp_width - this.$false.width() / 2,
    })

    if (this.data.totalRaffleTimes === 1) {
      this.$false.find('.hate_text').html('您还没有抽奖，提现完成后，赶紧来试试手气吧！')
    } else if (this.data.totalRaffleTimes === 0 && this.data.usedRaffleTimes === 0) {
      this.$false.find('.hate_text').html(`您的抽奖机会已经用完，<br />您之前已抽得<span class="bonus_cash">${_(_(this.data.raffleData).reduce((count, info) => {
        count += info.result
        return count
      }, 0)).convert2yuan()}</span>元的奖金！`)
    }

    this.$fullscreen.show()
    this.$false.show()
  },

  closeHandler(e) {
    const $target = $(e.currentTarget)
    $target.parent().hide()
    this.$fullscreen.hide()

    this.auto = true
    this.rotation(10000)
  },
})

module.exports = RaffleView
