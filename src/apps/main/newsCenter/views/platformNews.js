

const TabView = require('com/tabView')

const PlatformView = require('newsCenter/views/platformNews-platform')
const LetterView = require('newsCenter/views/platformNews-letter')

const PlatformNewsView = TabView.extend({

  events: {},

  className: 'nc-platformNews',

  initialize () {
    _(this.options).extend({
      tabs: [
        {
          label: '系统通知<span class="js-nc-unRead-main">（<span class="js-nc-noticeTab-unRead text-bold-pleasant">-</span>）</span>',
          name: 'platform',
          id: 'jsNcPlatform',
          router: 'nc/pn',
          view: PlatformView,
        },
        {
          label: '站内信<span class="js-nc-unRead-main">（<span class="js-nc-letterTab-unRead text-bold-pleasant">-</span>）</span>',
          name: 'insideLetter',
          id: 'jsNcInsideLetter',
          router: 'nc/il',
          view: LetterView,
        },
      ],
    })

    _.bindAll(this, 'renderUnread')
  },

  onRender() {
    TabView.prototype.onRender.apply(this, arguments)

    this.$unReadNotice = this.$('.js-nc-noticeTab-unRead')
    this.$unReadLetter = this.$('.js-nc-letterTab-unRead')

    this.subscribe('news', 'news:updating', this.renderUnread)
  },

  renderUnread(model) {
    const unReadNotice = model.get('unReadNotice')
    const unReadLetter = model.get('unReadLetter')
    if (unReadNotice === 0) {
      this.$unReadNotice.closest('.js-nc-unRead-main').addClass('hidden')
    } else {
      this.$unReadNotice.closest('.js-nc-unRead-main').removeClass('hidden')
    }
    this.$unReadNotice.text(unReadNotice)

    if (unReadLetter === 0) {
      this.$unReadLetter.closest('.js-nc-unRead-main').addClass('hidden')
    } else {
      this.$unReadLetter.closest('.js-nc-unRead-main').removeClass('hidden')
    }

    this.$unReadLetter.text(unReadLetter)
  },
})

module.exports = PlatformNewsView
