

const RainView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .btn_io': 'getRewardHandler',
    'click .btn_03': 'confirmHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/rechargeactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  confirmXhr() {
    return Global.sync.ajax({
      url: '/info/rechargeactivity/doget.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.$('.js-from-date').text(_(data.fromDate).toDate('MM.DD'))
          self.$('.js-end-date').text(_(data.endDate).toDate('MM.DD'))
        }
      })
  },

  onRender() {
    const self = this

    this.updateInfo()
    setInterval(() => {
      self.updateInfo()
    }, 30000)

    const $btn = $('.btn_01,.btn_02')
    this.$fullscreen = $('.fullscreen')
    this.$pop_lump = $('.pop_lump')
    const $close = $('.close')
    $close.click(() => {
      self.$fullscreen.hide()
      self.$pop_lump.hide()
    })
    $btn.click(() => {
      self.$fullscreen.hide()
      self.$pop_lump.hide()
    })
  },

  getReward(data) {
    const window_width = $(window).innerWidth()
    const window_height = $(window).innerHeight()

    this.$pop_lump.css({
      top: `${window_height / 2 - this.$pop_lump.width() / 2}px`,
      left: `${window_width / 2 - this.$pop_lump.height() / 2}px`,
    })

    this.$('.js-recharge-amount').text(_(data.rechargeAmout).convert2yuan())
    this.$('.js-bet-amount').text(_(data.betAmount).convert2yuan())
    this.$('.js-bonus').text(_(data.bonus).convert2yuan())

    this.$pop_lump.eq(data.status).show()
    this.$fullscreen.show()
  },

  getRewardHandler() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.getReward(res.root)
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },

  confirmHandler() {
    const self = this
    this.confirmXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          if (data.status === 0) {
            self.$pop_lump.hide()
            self.$pop_lump.eq(5).show()
          } else {
            self.$pop_lump.eq(data.status).show()
            self.$fullscreen.show()
          }
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
})

module.exports = RainView
