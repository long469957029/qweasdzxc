

const RebateView = Base.ItemView.extend({

  template: require('./index.html'),

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
      const info = data.dataList[0]
      self.$('.js-money').text(info.result ? _(info.result).convert2yuan() : 0)
    })
  },
})

module.exports = RebateView
