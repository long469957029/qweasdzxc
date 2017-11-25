

const LossView = Base.ItemView.extend({

  template: require('./index.html'),
  events: {
    'click .js-pick-up': 'pickUpHandler',
    'click .js-close-msg': 'closeMsgHandler',
  },
  doPickXHR() {
    return Global.sync.ajax({
      url: '/info/lossWages/get.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },
  doGetXHR () {
    return Global.sync.ajax({
      url: '/info/lossWages/status.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },
  initialize() {
    const self = this

    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })

    this.on('available:false', () => {
      Global.ui.notification.show('很抱歉，您不满足活动条件。')
    })

    this.on('confirm', (data) => {

    })
  },
  onRender () {
    const self = this
    this.$fullscreen = this.$('.status_fullscreen')
    this.$failMsg = this.$('.js-fail-msg')
    this.width = $(window).innerWidth() / 2
    this.height = $(window).innerHeight() / 2

    self.doGetXHR()
      .done((data) => {
        if (data.result == 0) {
          self.handlingData(data.root)
        } else {
          self.openDialog(data.msg)
          self.$('.js-pick-up').text('不可用')
          self.$('.js-pick-up').attr({ disabled: 'disabled' }).css({ background: '#a61708' })
        }
      })
      .fail(() => {

      })
  },
  pickUpHandler () {
    const self = this
    this.doPickXHR()
      .done((data) => {
        if (data.result == 0) {
          self.$fullscreen.show()
          self.$('.js-smile-msg').show()
          self.$('.js-smile-msg').css({
            top: self.height - self.$failMsg.height() / 2,
            left: self.width - self.$failMsg.width() / 2,
          })
          self.$('.js-show-msg').text(`恭喜您，成功领取今日领取补贴${self.$('.js-profitTotal-num').text()}元!`)
          self.$('.js-pick-up').text('已领取')
          self.$('.js-pick-up').attr({ disabled: 'disabled' }).css({ background: '#a61708' })
        }
      })
      .fail(() => {

      })
  },
  handlingData (data) { // 4:未达到活动要求, 2:已领取, 3:非有效领取时间, 5:可以领, 0:不合法用户
    const self = this

    if (data.status == 0) {
      self.openDialog('很抱歉，用户不合法，暂不能领取奖励！')
      self.$('.js-pick-up').text('不可用')
      self.$('.js-pick-up').attr({ disabled: 'disabled' }).css({ background: '#a61708' })
    } else {
      self.$('.js-betTotal-num').text(_(data.agentWagesResult.profitTotal).formatDiv(10000))
      self.$('.js-percent-num').text(`${_(data.percent).formatDiv(100)}%`)
      self.$('.js-profitTotal-num').text(_(data.wagesAmount).formatDiv(10000))
      self.$('.js-validity-num').text(data.agentWagesResult.activeUser)
      self.$('.js-now-bet').text(_(data.profitTotalCfg).formatDiv(10000))
      self.$('.js-user-num').text(data.activeUserCfg)
      self.$('.js-true-num').text(_(data.activeBetCfg).formatDiv(10000))
      if (data.status == 4) {
        self.openDialog('很抱歉，您未达到活动要求，暂不能领取奖励！')
        self.$('.js-pick-up').text('不可用')
        self.$('.js-pick-up').attr({ disabled: 'disabled' }).css({ background: '#a61708' })
      }
      if (data.status == 2) {
        self.$('.js-pick-up').text('已领取')
        self.$('.js-pick-up').attr({ disabled: 'disabled' }).css({ background: '#a61708' })
      }
      if (data.status == 3) {
        self.openDialog('很抱歉，超过有效领取时间，暂不能领取奖励！')
        self.$('.js-pick-up').text('不可用')
        self.$('.js-pick-up').attr({ disabled: 'disabled' }).css({ background: '#a61708' })
      }
      if (data.status == 5) {
        self.$('.js-pick-up').text('立即领取')
      }
    }
  },
  openDialog(msg) {
    this.$fullscreen.show()
    this.$failMsg.show()
    this.$failMsg.css({
      top: this.height - this.$failMsg.height() / 2,
      left: this.width - this.$failMsg.width() / 2,
    })
    this.$('.js-show-msg').text(msg)
  },
  closeMsgHandler () {
    this.$fullscreen.hide()
    this.$failMsg.hide()
    this.$('.js-smile-msg').hide()
  },
})
module.exports = LossView
