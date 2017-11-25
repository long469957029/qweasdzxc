

const newbieConfig = require('./config.js')

const Newbie = Base.PrefabView.extend({

  template: require('./index.html'),

  className: 'newbie',

  options: {
    prevClass: 'js-pf',
  },

  events: {
    'click .js-pf-next': 'nextHandler',
    'click .js-pf-finish': 'finishHandler',
  },

  finishXhr() {
    return Global.sync.ajax({
      url: '/info/task/newbie.json',
    })
  },

  render() {
    const $body = $('body')
    const bodyWidth = $body.width()

    // 大小屏幕不显示帮助
    if (bodyWidth > 1920 || bodyWidth < 1366) {
      this.finish()
      return this
    }

    location.href = '#'

    const fix = (1920 - $('body').width()) / 2

    this.$newbies = _(this.template).template()({
      newbies: newbieConfig.getAll(fix),
    })

    this.$el.append(this.$newbies)

    $('body').addClass('overflow-hidden')

    return this
  },

  finish() {
    $('body').removeClass('overflow-hidden')

    this.finishXhr()

    this.trigger('newbie:finish')

    this.destroy()
  },

  nextHandler(e) {
    const $target = $(e.currentTarget)
    const $current = $target.closest('.js-pf-newbie')
    const $next = $current.next('.js-pf-newbie')
    const currentConfig = newbieConfig.get($current.index())

    $current.addClass('hidden')
    if ($next.length) {
      $next.removeClass('hidden')
    } else {
      this.finish()
    }

    if (currentConfig.callback) {
      currentConfig.callback()
    }
  },

  finishHandler(e) {
    this.finish()
  },
})

module.exports = Newbie
