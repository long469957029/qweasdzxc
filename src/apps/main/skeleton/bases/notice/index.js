

require('./index.scss')

const NoticeView = Base.ItemView.extend({

  template: require('./index.html'),

  className: 'hidden',

  events: {
    'click .js-close': 'closeHandler',
    'click .js-wt-pn-up': 'pnUpHandler',
    'click .js-wt-pn-down': 'pnDownHandler',
  },

  noticeList: [],
  manualClose: false,

  getXhr() {
    return Global.sync.ajax({
      url: '/info/activitylist/geturgentbulletinlist.json',
    })
  },

  initialize() {
    _(this.options || {}).extend({
      spacing: 20,
      total: 0,
      index: 1,
    })
  },

  serializeData() {
    return this.options
  },

  onRender() {
    const self = this

    this.$content = this.$('.js-gl-notice-content')
    this.$pnDown = this.$('.js-wt-pn-down')

    this.handleGetXhr()
    window.setInterval(() => {
      self.handleGetXhr()
    }, 30000)

    setInterval(() => {
      self.$pnDown.trigger('click')
    }, 5000)
  },

  handleGetXhr() {
    const self = this

    this.getXhr()
      .done((res) => {
        if (res && res.result === 0) {
          self.updateNotice(res.root || [])
        }
      })
  },

  updateNotice(noticeList) {
    const self = this
    let showList = []
    let hasDiff = false

    if (!noticeList.length) {
      noticeList = []
    }

    _(noticeList).each((notice) => {
      const hasFind = _(self.noticeList).findWhere({
        bulletionId: notice.bulletionId,
      })
      if (!hasFind) {
        self.noticeList.push(notice)
        hasDiff = true
      }
    })

    if (!hasDiff) {
      if (!this.manualClose) {
        this.$el.toggleClass('hidden', _(this.noticeList).isEmpty())
      }
    } else {
      this.manualClose = false
      this.$el.removeClass('hidden')
    }

    this.options.total = this.noticeList.length

    showList = showList.concat(this.noticeList)
    showList = showList.concat(this.noticeList)

    this.$content.html(_(showList).map((notice) => {
      return `<li><a class="router" href="#nc/nb/detail/${notice.bulletionId}">${notice.title}</a></li>`
    }))
  },

  // common APIs

  isShow() {
    return !!this.$('.js-gl-notice-content').length
  },

  // event handlers

  pnUpHandler() {
    const self = this

    if (this.$content.is(':animated')) {
      return false
    }

    this.$content.animate({
      top: 0,
    }, 500, () => {
      self.$content.prepend(self.$content.find('li').last()).css('top', -self.options.spacing)
    })

    return false
  },

  pnDownHandler() {
    const self = this

    if (this.$content.is(':animated')) {
      return false
    }

    this.$content.animate({
      top: -this.options.spacing * 2,
    }, 500, () => {
      self.$content.append(self.$content.find('li').first()).css('top', -self.options.spacing)
    })

    return false
  },

  closeHandler() {
    this.$el.addClass('hidden')
    this.manualClose = true
    return false
  },

})

module.exports = NoticeView
