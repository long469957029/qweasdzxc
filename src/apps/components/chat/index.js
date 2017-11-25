

require('./index.scss')

const Chat = Base.PrefabView.extend({
  template: require('./index.html'),

  className: 'chat',

  tagName: 'ul',

  options: {
    prevClass: 'js-pf',
  },

  initialize() {
    this._chatData = []
  },

  render(chatData) {
    this.$el.html(_(this.template).template()({
      chatData: this._push(chatData),
    }))

    return this
  },

  add(chatInfo) {
    this.$el.append(_(this.template).template()({
      chatData: [this._push(chatInfo)],
    }))

    return this
  },

  empty() {
    return this.$el.empty()
  },

  height() {
    return this.$el.height()
  },

  _push(chatData) {
    if (_(chatData).isArray()) {
      _(chatData).reduce((prevTime, chatInfo) => {
        chatInfo.hasTitle = Math.abs(chatInfo.sendTime - prevTime) > 60000
        return chatInfo.sendTime
      }, 0)
      this._chatData = chatData
    } else {
      const prevInfo = _(this._chatData).last()
      chatData.hasTitle = Math.abs(chatData.sendTime - prevInfo.sendTime) > 60000

      this._chatData.push(chatData)
    }

    return chatData
  },
})

module.exports = Chat
