

const lockView = Base.ItemView.extend({

  template: require('fundCenter/fundManage/lock.html'),

  events: {},

  onRender() {
    const self = this
    this.$('.js-locktip').removeClass('hidden')
  },
})

module.exports = lockView
