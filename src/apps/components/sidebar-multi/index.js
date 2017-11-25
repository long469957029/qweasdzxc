

const slimscroll = require('jquery-slimscroll')

require('./index.scss')

const MultiSidebarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-com-multi-item': 'multiItemSelectHandler',
  },

  serializeData() {
    const sidebar = _(this.options.sidebar).clone()

    return {
      menus: sidebar,
    }
  },

  onRender() {
    this.$multiMain = this.$('.js-com-multi-main')

    this.$multiMain.slimScroll({
      height: this.options.height,
      alwaysVisible: true,
    })
  },

  goTo(page, type) {
    this.$(`[data-args="${page}"]`).trigger('click', type)
  },

  multiItemSelectHandler(e, type) {
    const $target = $(e.currentTarget)

    this.trigger('change:select', $target.data('args'), type === 'goTo' ? '' : $target.attr('href'), $target)

    return false
  },
})

module.exports = MultiSidebarView
