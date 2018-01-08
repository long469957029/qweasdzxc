import './index.scss'

const imService = require('./imService')

const MessageView = Base.ItemView.extend({

  template: require('./index.html'),
  adminTpl: require('./adminChat.html'),
  onePersonTpl: require('./onePersonChat.html'),
  massMessageTpl: require('./massMessageChat.html'),

  events: {
    'keyup .js-im-contact-search': 'searchCheckHandler',
    'blur .js-im-contact-search': 'outUserSearchHandler',
    'click .js-im-contact': 'selectContactHandler',
    'click .js-im-recently': 'selectRecentlyHandler',
    'click .js-contact-systemAdmin': 'contactWithAdminHandler',
    'click .js-contact-onePerson': 'contactWithOnePersonHandler',
    'keyup .js-chat-input': 'inputChangeHandler',
    'blur .js-chat-input': 'outInputHandler',
    'click .js-im-mass-message': 'massMessageHandle',
    'click .js-select-panel-hidden': 'hiddenSelectPanelHandle',
    'click .js-select-panel-show': 'showSelectPanelHandle',
    'focus .js-im-contact-search': 'searchPanelChangeHandle',
    'click .js-search-input-cancel': 'cancelSearchInputHandle',
    'keydown .js-chat-input': 'sendChatHandle',
  },
  getChatTotalXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/chatStat.json',
      data,
    })
  },
  getRecentChatStatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/recentChatStat.json',
      data,
    })
  },
  getUserChatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/chatList.json',
      data,
    })
  },
  sendMyChatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/send.json',
      data,
    })
  },
  initialize() {
    this.privateList = []
    this.pageIndex = 0
  },


  onRender() {
    this.getChatTotalXhr()
      .done((res) => {
        if (res.result === 0) {
          this.renderContactData(res.root)
          this.parentId = res.root.parent.userId
          this.userList = imService.getUserList(res.root, this.parentId)
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
    this.getRecentChatStatXhr()
      .done((res) => {
        if (res.result === 0) {
          this.renderRecentlyData(res.root)
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  renderRecentlyData(data) {
    // 处理新记录数量
    const recentlyResult = imService.getRecentlyItemHtml(data.records, this.parentId)
    if (recentlyResult.num > 0) {
      this.$('.js-recently-newMessage-num').addClass('hasNum')
      this.$('.js-recently-newMessage-num').html(imService.getNewMessageNumHtml(recentlyResult.num))
    }
    this.$('.js-recently-container').html(recentlyResult.result)
  },
  rendUserChatHandler(e) {
    const $target = $(e.currentTarget)
    const data = {
      userId: $target.data('id'),
    }
    this.getUserChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // const root = res.root
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 取消输入框默认回车
  sendChatHandle(e) {
    let code
    if (!e) {
      e = window.event
    }
    if (e.keyCode) {
      code = e.keyCode
    } else if (e.which) {
      code = e.which
    }
    if (code === 13 && window.event) {
      e.preventDefault()
      e.returnValue = false
      this.rendPrivateMessageHandle()
    } else if (code === 13) {
      e.preventDefault()
      this.rendPrivateMessageHandle()
    }
  },
  // 发送私人消息
  rendPrivateMessageHandle() {
    const typeContent = this.$('.js-chat-input').val()
    const toUserId = this.$('.js-contact-toUser').val()
    if (typeContent !== '') {
      this.$('.js-chat-input').val('')

      const data = {
        content: typeContent,
        toUser: toUserId,
      }
      this.getUserChatDetailXhl(toUserId)
      this.sendMyChatXhr(data)
        .done((res) => {
          if (res.result === 0) {
            this.getUserChatDetailXhl(toUserId)
          } else {
            Global.ui.notification.show('未知错误')
          }
        })
    }
  },
  // 处理私聊数据并生成html
  renderPrivateChatDetailHandle(data) {
    this.$('.js-chat-message-content').html(imService.getChatMessageByDateHtml(data))
    const $content = this.$('.js-chat-message-content')
    $content.scrollTop($content[0].scrollHeight)
    this.onRender()
  },
  // 获取后台私聊记录
  getUserChatDetailXhl(id) {
    const data = {
      userId: id,
      pageIndex: this.pageIndex,
      pageSize: 30,
    }
    this.getUserChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          this.privateList = res.root.records
          this.renderPrivateChatDetailHandle(res.root.records)
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 显示私聊面板
  contactWithOnePersonHandler(e) {
    const $target = $(e.currentTarget)
    this.clearContainerActiveHandle()
    $target.addClass('active')
    this.$('.js-content-rightBar').html(this.onePersonTpl)
    this.checkMassMessageButtonStatus()
    const toUserId = $target.data('id')
    this.$('.js-contact-name').html($target.data('name'))
    this.$('.js-contact-toUser').val(toUserId)
    this.getUserChatDetailXhl(toUserId)
    // this.$('.js-content-rightBar-empty').addClass('hidden')
  },
  //  获取左侧联系人菜单信息
  renderContactData(data) {
    // 显示系统管理员状态
    this.$('.js-contact-admin').html(imService.getAdmin())
    // 显示上级状态
    this.$('.js-contact-superior').html(imService.getSuperior(data.parent))
    // 显示下级列表
    this.$('.js-person-sub-container').html(imService.getItemsHtml(data.subList))
  },
  // 显示群发面板
  massMessageHandle() {
    this.$('.js-im-mass-message').addClass('active')
    this.$('.js-content-rightBar').html(this.massMessageTpl)
    this.clearContainerActiveHandle()
  },
  // 显示管理员面板
  contactWithAdminHandler(e) {
    const $target = $(e.currentTarget)
    this.clearContainerActiveHandle()
    $target.addClass('active')
    this.$('.js-content-rightBar').html(this.adminTpl)
    // this.$('.js-content-rightBar-empty').addClass('hidden')
    this.checkMassMessageButtonStatus()
  },
  checkMassMessageButtonStatus() {
    if (this.$('.js-im-mass-message').hasClass('active')) {
      this.$('.js-im-mass-message').removeClass('active')
    }
  },
  clearContainerActiveHandle() {
    this.$('.js-contact-container').find('.active').removeClass('active')
    this.$('.js-recently-container').find('.active').removeClass('active')
  },
  // 输入搜索样式事件
  searchCheckHandler() {
    const name = this.$('.js-im-contact-search').val()
    // 处理搜索联系人列表
    const searchResult = imService.getSearchResult(this.userList, name)
    if (searchResult.length > 0 && name !== '') {
      this.$('.js-search-container-hasResult').removeClass('hidden')
      this.$('.js-search-container-noResult').addClass('hidden')
      this.$('.js-search-container-hasResult').html(imService.getItemsHtml(searchResult))
    } else {
      if (this.$('.js-search-container-noResult').is(':hidden')) {
        this.$('.js-search-container-noResult').removeClass('hidden')
      }
      if (!this.$('.js-search-container-hasResult').is(':hidden')) {
        this.$('.js-search-container-hasResult').addClass('hidden')
      }
    }
    // 处理点击搜索时搜索框样式
    if (name.length > 0) {
      this.$('.js-im-contact-search').addClass('active')
    } else {
      this.$('.js-im-contact-search').removeClass('active')
    }
  },
  // 当鼠标移入搜索框时，隐藏用户栏，显示搜索结果框
  searchPanelChangeHandle() {
    // 处理搜索时联系人面板样式
    if (!this.$('.js-content-leftBar-general').is(':hidden')) {
      this.$('.js-content-leftBar-general').addClass('hidden')
    }
    if (this.$('.js-content-leftBar-search').is(':hidden')) {
      this.$('.js-content-leftBar-search').removeClass('hidden')
    }
  },
  // 取消搜索输入框内容
  cancelSearchInputHandle() {
    this.$('.js-im-contact-search').val('')
    this.searchCheckHandler()
  },
  selectContactHandler() {
    if (!this.$('.js-im-contact').hasClass('active')) {
      this.$('.js-im-contact').addClass('active')
    }
    if (this.$('.js-contact-container').is(':hidden')) {
      this.$('.js-contact-container').removeClass('hidden')
    }
    if (this.$('.js-im-recently').hasClass('active')) {
      this.$('.js-im-recently').removeClass('active')
    }
    if (!this.$('.js-recently-container').is(':hidden')) {
      this.$('.js-recently-container').addClass('hidden')
    }
  },
  selectRecentlyHandler() {
    if (!this.$('.js-im-recently').hasClass('active')) {
      this.$('.js-im-recently').addClass('active')
    }
    if (this.$('.js-recently-container').is(':hidden')) {
      this.$('.js-recently-container').removeClass('hidden')
    }
    if (this.$('.js-im-contact').hasClass('active')) {
      this.$('.js-im-contact').removeClass('active')
    }
    if (!this.$('.js-contact-container').is(':hidden')) {
      this.$('.js-contact-container').addClass('hidden')
    }
  },
  inputChangeHandler() {
    const content = this.$('.js-chat-input').val()
    this.$('.js-content-editable').html(content)
    if (content !== undefined && content.length > 0) {
      if (!this.$('.js-chat-footer-send').hasClass('.active')) {
        this.$('.js-chat-footer-send').addClass('active')
      }
    }
  },
  // 判断焦点移出聊天框事件
  outInputHandler() {
    const content = this.$('.js-chat-input').val()
    if (content === undefined || content === null || content === '') {
      this.$('.js-chat-footer-send').removeClass('active')
    }
  },
  // 判断焦点移出左侧查询栏事件
  outUserSearchHandler() {
    const content = this.$('.js-im-contact-search').val()
    if (content === undefined || content === null || content === '') {
      this.$('.js-content-leftBar-general').removeClass('hidden')
      this.$('.js-content-leftBar-search').addClass('hidden')
    }
  },
  hiddenSelectPanelHandle(e) {
    const $target = $(e.currentTarget)
    this.$('.chat-select-container').addClass('sideUp')
    $target.addClass('hidden')
    this.$('.js-select-panel-show').removeClass('hidden')
  },
  showSelectPanelHandle(e) {
    const $target = $(e.currentTarget)
    this.$('.chat-select-container').removeClass('sideUp')
    $target.addClass('hidden')
    this.$('.js-select-panel-hidden').removeClass('hidden')
  },
  // 滚动条固定在最底部
  scrollbarBottomHandler() {
    const now = new Date()
    const div = this.$('.js-chat-message-content')
    div.innerHTML = `${div.innerHTML}time_${now.getTime()}<br />`
    div.scrollTop = div.scrollHeight
  },
})

module.exports = MessageView
