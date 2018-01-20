
import TabView from 'com/tabView'
import SystemMessageInfoView from './systemMessage'
import FeedBackInfoView from './feedBack'

const MyMessageView = TabView.extend({

  events: {},

  className: 'uc-my-message',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '系统消息<span class="js-uc-sys-unRead-main"></span>',
          name: 'jsSystemMessage',
          id: 'jsSystemMessage',
          view: SystemMessageInfoView,
          options: { noticeId: this.options.noticeId },
        }, {
          label: '建议反馈<span class="js-uc-feed-unRead-main"></span>',
          name: 'jsFeedback',
          id: 'jsFeedback',
          view: FeedBackInfoView,
        },
      ],
    })
    _.bindAll(this, 'renderUnread')
  },
  onRender() {
    TabView.prototype.onRender.apply(this, arguments)

    this.$unReadNotice = this.$('.js-uc-sys-unRead-main')
    this.$unReadFeed = this.$('.js-uc-feed-unRead-main')
  },

  renderUnread(data) {
    if (data.unReadNotice === 0) {
      this.$unReadNotice.addClass('hidden')
    } else {
      this.$unReadNotice.removeClass('hidden')
    }
    this.$unReadNotice.html(`<span class="text-prominent">（${data.unReadNotice}）</span>`)

    if (data.newFeedbackCount === 0) {
      this.$unReadFeed.addClass('hidden')
    } else {
      this.$unReadFeed.removeClass('hidden')
    }

    this.$unReadFeed.html(`<span class="text-prominent">（${data.newFeedbackCount}）</span>`)
  },
})

export default MyMessageView
