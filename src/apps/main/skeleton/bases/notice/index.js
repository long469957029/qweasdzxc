import './index.scss'
import tpl from './index.html'

export default Base.ItemView.extend({

  template: tpl,

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
      data: {version: 2},
    })
  },

  initialize() {
    _(this.options || {}).extend({
      spacing: 50,
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
    this.$bulletinTotal = this.$('.js-db-bulletin-total')
    this.$bulletinCur = this.$('.js-db-bulletin-cur')

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
    this.$bulletinTotal.html(this.options.total)
    showList = showList.concat(this.noticeList)
    showList = showList.concat(this.noticeList)
    this.options.index = 1
    this.$bulletinCur.html(this.options.index)
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
      self.$content.prepend(self.$content.find('li').last()).css('top', 0)
      self.options.index -= 1
      if (self.options.index < 1) {
        self.options.index = self.options.total
      }
      self.$bulletinCur.html(self.options.index)
    })

    return false
  },

  pnDownHandler() {
    const self = this

    if (this.$content.is(':animated')) {
      return false
    }

    this.$content.animate({
      top: -this.options.spacing,
    }, 500, () => {
      self.$content.append(self.$content.find('li').first()).css('top', 0)
      self.options.index += 1
      if (self.options.index > self.options.total) {
        self.options.index = 1
      }
      self.$bulletinCur.html(self.options.index)
    })

    return false
  },

  closeHandler() {
    this.$el.addClass('hidden')
    this.manualClose = true
    return false
  },

})
