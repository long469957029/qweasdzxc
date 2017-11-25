

require('./index.scss')

const JoinView = Base.ItemView.extend({

  template: require('./index.html'),

  className: 'join',

  events: {
    'click .js-valid-pic': 'changePicHandler',
    'submit .js-join': 'confirmHandler',
  },

  dividend: {
    our: [0.23, 0.26, 0.29, 0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5],
    other: [0.15, 0.17, 0.19, 0.21, 0.23, 0.25, 0.27, 0.29, 0.31, 0.33],
  },

  confirmJoinXhr(data) {
    return Global.sync.ajax({
      url: '/info/joinus/join.json',
      data,
    })
  },

  onRender() {
    const self = this

    this.$form = this.$('.js-join')
    this.$validPic = this.$('.js-valid-pic')
    this.$btnConfirm = this.$('.js-confirm')

    this.$form.parsley()
    this.$validPic.trigger('click')

    this.$slider = this.$('.js-slider')

    this.$ourDividend = this.$('.js-our-dividend')
    this.$ourDividendTilte = this.$('.js-our-dividend-val')
    this.$ourRebate = this.$('.js-our-rebate')
    this.$ourRebateTitle = this.$('.js-our-rebate-val')

    this.$otherDividend = this.$('.js-other-dividend')
    this.$otherDividendTitle = this.$('.js-other-dividend-val')

    this.$otherRebate = this.$('.js-other-rebate')
    this.$otherRebateTitle = this.$('.js-other-rebate-val')
    this.$currentNumber = this.$('.js-current-number')

    this.$slider.slider({
      range: 'min',
      max: 1000,
      step: 20,
      slide: refreshSwatch,
      change: refreshSwatch,
    }).slider('value', 500)

    function refreshSwatch(e, obj) {
      let index = Math.ceil(obj.value / 100) - 1
      if (index < 0) {
        index = 0
      }

      const ourDividend = Math.floor(0.022 * obj.value * 30 * self.dividend.our[index])
      self.$ourDividend.css('width', `${ourDividend / 500 * 100}%`)
      self.$ourDividendTilte.text(ourDividend)

      const ourRebate = Math.floor(obj.value * 30 * 0.001)

      self.$ourRebate.css('width', `${ourRebate / 500 * 100}%`)
      self.$ourRebateTitle.text(ourRebate)

      const otherDividend = Math.floor(0.022 * obj.value * 30 * self.dividend.other[index])
      self.$otherDividend.css('width', `${otherDividend / 500 * 100}%`)
      self.$otherDividendTitle.text(otherDividend)

      const otherRebate = Math.floor(obj.value * 30 * 0.001)

      self.$otherRebate.css('width', `${otherRebate / 500 * 100}%`)
      self.$otherRebateTitle.text(otherRebate)

      self.$currentNumber.css('left', `${obj.value / 10 - 2}%`).text(`${obj.value}万`)
    }
  },

  changePicHandler(e) {
    const $target = $(e.currentTarget)
    $target.attr('src', `/acct/imgcode/code?_t=${_.uniqueId()}`)
  },

  confirmHandler() {
    const self = this
    this.$btnConfirm.button('loading')

    this.confirmJoinXhr(_(this.$form.serializeArray()).serializeObject())
      .always(() => {
        self.$btnConfirm.button('reset')
        self.$validPic.trigger('click')
      })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('提交成功！稍后会有专员与您沟通！')
          self.$form[0].reset()
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },
})

module.exports = JoinView
