
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
        }, {
          label: '建议反馈<span class="js-uc-feed-unRead-main"></span>',
          name: 'jsFeedback',
          id: 'jsFeedback',
          view: FeedBackInfoView,
        },
      ],
    })
  },
})

export default MyMessageView
