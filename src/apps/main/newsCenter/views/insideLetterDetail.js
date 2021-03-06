

const bannerConfig = require('dynamicCenter/misc/bannerConfig')

const Chat = require('com/chat')

const InsideLetterDetailView = Base.ItemView.extend({

  template: require('newsCenter/templates/insideLetterDetail.html'),

  bannerTpl: _(require('dashboard/templates/banner.html')).template(),

  startOnLoading: true,

  className: 'il-detail nc-panel-wrapper',

  events: {
    'submit .js-nc-il-detail-form': 'sendChatHandler',
  },

  getChatXhr(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/getletdetaillist.json',
      data,
    })
  },

  sendChatXhr(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/saveletterdetail.json',
      abort: false,
      data,
    })
  },

  getAdXhr() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getletteradvertise.json',
      data: {
        pageSize: 1,
      },
    })
  },

  initialize() {
    this._lastId = null
  },

  onRender() {
    const self = this

    this.$content = this.$('.js-nc-il-content')
    this.$chatForm = this.$('.js-nc-il-detail-form')
    this.$chat = this.$('.js-nc-chat-container')
    this.$ad = this.$('.js-nc-ad')
    this.$ol = this.$('.js-nc-ol')

    let init = true

    Global.polling.start('chat:update', () => {
      self.pullChat(init)
        .always(() => {
          init = false

          Global.polling.next('chat:update', {
            interval: 3000,
          })
        })
    })

    this.getAdXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root ? res.root : bannerConfig

          self.$ad.html(self.bannerTpl({
            data,
          }))

          self.$ol.html(_(data).map((info, index) => {
            return `<li data-target="#jsCarousel" data-slide-to="${index}" ${ 
              index ? '' : 'class="active"'}></li>`
          }).join(''))
        }
      })
  },

  pullChat(init) {
    const self = this

    return this.getChatXhr({
      titleId: this.options.titleId,
      letterId: this.options.letterId,
    })
      .always(() => {
        if (init) {
          self.loadingFinish()
        }
      })
      .done((res) => {
        let list
        let hasNew
        res.root = res.root || {}
        if (res && res.result === 0) {
          self._titleId = res.root.titleId
          if (init) {
            self.renderBasicInfo(res.root)
          }

          list = res.root.detailResult && res.root.detailResult.detailList || []

          hasNew = self._lastId !== list[0].detailId

          if (hasNew) {
            self._lastId = list[0] && list[0].detailId
            self.renderLetterChat(list)
          }

          if (init || hasNew) {
            self.$chat.scrollTop(self.chat.height())
          }
        } else {
          Global.ui.notification.show('系统异常，请稍后再试')
        }
      })
  },

  renderBasicInfo(info) {
    // this.$('.js-nc-il-title').html(info.title);
    // this.$('.js-nc-il-sender').html(info.sender);
    this.$('.js-nc-il-other').html(info.recevier === '我' ? info.sender : info.recevier)
    // this.$('.js-nc-il-time').html(_(info.time).toTime());
  },

  renderLetterChat(chatData) {
    chatData = _(chatData).reduceRight((chatData, chat) => {
      chatData.push({
        sender: chat.sendName,
        content: chat.content,
        sendTime: chat.sendTime,
        isSender: chat.sendId === Global.memoryCache.get('acctInfo').userId,
      })

      return chatData
    }, [])

    if (!this.chat) {
      this.chat = new Chat()

      this.$chat.html(this.chat.render(chatData).el)
    } else {
      this.$chat.html(this.chat.render(chatData).el)
    }
  },

  // event handlers

  sendChatHandler(e) {
    const reqData = _(this.$chatForm.serializeArray()).serializeObject()

    reqData.Content = _(reqData.Content).chain().trim().escape()
      .value()
    if (!reqData.Content) {
      return false
    }

    this.chat.add({
      sender: '我',
      content: reqData.Content,
      sendTime: _(_.now()).toTime(),
      isSender: true,
    })

    this.$content.val('')
    this.$chat.scrollTop(this.chat.height())

    this.sendChatXhr(_(reqData).extend({
      titleId: this._titleId,
    }))
      .done((res) => {
        if (res && res.result !== 0) {
          Global.ui.notification.show('系统异常，发送失败')
        }
      })
  },

  destroy() {
    Global.polling.stop('chat:update')

    Base.ItemView.prototype.destroy.apply(this, arguments)
  },
})

module.exports = InsideLetterDetailView
