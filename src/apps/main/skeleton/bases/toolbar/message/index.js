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
    'click .js-im-mass-message': 'messMessageHandle',
    'click .js-select-panel-hidden': 'hiddenSelectPanelHandle',
    'click .js-select-panel-show': 'showSelectPanelHandle',
    'focus .js-im-contact-search': 'searchPanelChangeHandle',
    'click .js-search-input-cancel': 'cancelSearchInputHandle',
    'keydown .js-chat-input': 'sendChatHandle',
    'click .js-chat-more-content': 'showMoreChatHandler',
    'click .js-mess-select-contact': 'selectMessContactHandler',
    'click .selected-sub-item-cancel': 'cancelMessContactHandler',
    'click .js-mess-select-allContact': 'selectAllContactHandler',
    'click .js-mess-clear-allContact': 'clearAllContactHandler',
    'keyup .js-mess-search-panel-search': 'searchMessContactHandler',
    'click .js-recently-message-close': 'delRecentlyContactHandler',
    'click .js-recently-mass-message': 'clickRecentlyMessMassageHandler',
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
  sendMassChatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/sendGroup.json',
      data,
    })
  },
  createMassChatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/createGroupChat.json',
      data,
    })
  },
  getGroupChatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/groupChat.json',
      data,
    })
  },
  delRecentlyContactXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/delRecentChat.json',
      data,
    })
  },
  initialize() {
    this.pageIndex = 0
    this.activePerson = []
    this.chatList = []
    this.messContactSelectedList = []
    this.recentlyList = []
    this.newMessageNum = 0
    this.chatLastRecordId = ''
  },
  onRender() {
    const acctInfo = Global.memoryCache.get('acctInfo')
    this.username = acctInfo.username
    this.userPic = acctInfo.username
    this.renderGetContactInfoXhr()
    this.renderGetRecentlyInfoXhr()
    this.pollingContactInfoHandler()
  },
  // 公共显示方法
  // 触发查询联系人接口
  renderGetContactInfoXhr() {
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
  },
  // 查询右侧联系人接口
  renderGetRecentlyInfoXhr() {
    this.getRecentChatStatXhr()
      .done((res) => {
        if (res.result === 0) {
          this.recentlyList = res.root.records
          this.renderRecentlyData()
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 处理右侧近期显示数据
  renderRecentlyData() {
    const recentlyResult = imService.getRecentlyItemHtml(this.recentlyList, this.parentId, this.activePerson)
    this.newMessageNum = recentlyResult.num
    if (this.newMessageNum > 0) {
      this.$('.js-recently-newMessage-num').addClass('hasNum')
      this.$('.js-recently-newMessage-num').html(imService.getNewMessageNumHtml(this.newMessageNum))
    } else if (this.$('.js-recently-newMessage-num').hasClass('hasNum')) {
      this.$('.js-recently-newMessage-num').removeClass('hasNum')
    }
    this.$('.js-recently-container').html(recentlyResult.result)
  },
  //  获取左侧联系人菜单信息
  renderContactData(data) {
    // 显示系统管理员状态
    this.$('.js-contact-admin').html(imService.getAdmin(this.activePerson))
    // 显示上级状态
    this.$('.js-contact-superior').html(imService.getSuperior(data.parent, this.activePerson))
    // 显示下级列表
    this.$('.js-person-sub-container').html(imService.getItemsHtml(data.subList, this.parentId, this.activePerson))
  },

  // 私聊涉及方法
  // 获取用户私聊记录
  getUserChatDetailXhl(id) {
    const self = this
    let data = []
    data = {
      userId: id,
      pageSize: 30,
    }
    this.getUserChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // 处理私聊数据并生成html
          const chatData = res.root.records
          let chatResult = []
          const recordLastIndex = res.root.records.length - 1
          const lastRecordId = res.root.records[recordLastIndex].rid
          if (this.chatLastRecordId === '' || lastRecordId < this.chatLastRecordId) {
            this.chatLastRecordId = lastRecordId
          }
          if (_.isEmpty(this.chatList.chatData)) {
            chatResult = chatData
            // this.chatLastRecordId = imService.getChatLastRecordId(res.root.records)
          } else {
            chatResult = imService.insertChatList(chatData, this.chatList.chatData)
          }
          this.chatList = {
            chatUser: id,
            chatData: chatResult,
          }
          self.$('.js-chat-message-content-panel').html(imService.getChatMessageByDateHtml(this.chatList.chatData, null, res.root.records.length))
          this.scrollbarBottomHandler()

          // this.renderGetInfoXhr()
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 显示私聊面板
  contactWithOnePersonHandler(e) {
    const $target = $(e.currentTarget)
    // 切换点击状态
    this.clearContainerActiveHandle()
    $target.addClass('active')
    // 生成私聊面板
    this.$('.js-content-rightBar').html(this.onePersonTpl)
    // 当前用户ID，名称放回到私聊框头部
    const toUserId = $target.data('id')
    this.$('.js-contact-name').html($target.data('name'))
    this.$('.js-contact-toUser').val(toUserId)
    // 获取后台记录
    this.getUserChatDetailXhl(toUserId)
    // this.$('.js-chat-message-content').html(imService.getChatMessageByDateHtml(this.chatList.chatData))
    // 查询私聊轮询是否还在执行
    if (this.cartPolling) {
      clearInterval(this.cartPolling)
    }
    // 调用轮询方法，当点击联系人时开始当前用户的聊天记录轮流，
    this.pollingChatInfoHandler(toUserId)
    // 如果下方群聊按钮高亮则取消高亮
    this.checkMassMessageButtonStatus()
    // 保存当前选择的聊天人
    this.activePerson = {
      type: 'user',
      id: $target.data('id'),
    }
    this.pageIndex = 0
    this.chatList = []
    this.chatLastRecordId = ''
    // 刷新近期联系人状态
    const refreshActiveRecentlyResult = imService.refreshActiveRecentlyStatus(this.recentlyList, this.activePerson)
    this.recentlyList = refreshActiveRecentlyResult.result
    this.newMessageNum -= refreshActiveRecentlyResult.num
    this.renderRecentlyData()
    // this.activeParentContainer = $target.parentNode.data('id')
  },
  showMoreChatHandler() {
    this.pageIndex += 1
    this.getUserChatDetailXhl()
    const self = this
    let data = []
    data = {
      userId: this.$('.js-contact-toUser').val(),
      lastChatId: this.chatLastRecordId,
      pageSize: 30,
    }
    this.getUserChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // 处理私聊数据并生成html
          const list = this.chatList.chatData
          const recordLastIndex = res.root.records.length - 1
          this.chatLastRecordId = res.root.records[recordLastIndex].rid
          // this.chatList.chatData = list.unshift(res.root.records)
          this.chatList.chatData = res.root.records.concat(list)
          self.$('.js-chat-message-content-panel').html(imService.getChatMessageByDateHtml(this.chatList.chatData, null, res.root.records.length))
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 取消输入框默认回车
  sendChatHandle(e) {
    const type = $(e.currentTarget).data('type')
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
      if (type === 'mass') {
        this.sendMessMessageHandle()
      } else if (type === 'private') {
        this.sendPrivateMessageHandle()
      }
    } else if (code === 13) {
      e.preventDefault()
      if (type === 'mass') {
        this.sendMessMessageHandle()
      } else if (type === 'private') {
        this.sendPrivateMessageHandle()
      }
    }
  },
  // 发送私人消息
  sendPrivateMessageHandle() {
    const typeContent = this.$('.js-chat-input').val()
    const toUserId = this.$('.js-contact-toUser').val()
    if (typeContent !== '') {
      this.$('.js-chat-input').val('')
      const data = {
        content: typeContent,
        toUser: toUserId,
      }
      this.$('.js-chat-message-content-panel').append(imService.insertChat(this.userPic, this.username, typeContent))
      const today = new Date()
      this.chatList.chatData.push({
        content: typeContent,
        fromUserHeadIconId: null,
        isRead: true,
        rid: null,
        sendTime: today,
        toUserHeadIconId: null,
        type: null,
        userName: null,
      })
      this.scrollbarBottomHandler()
      this.sendMyChatXhr(data)
        .done((res) => {
          if (res.result === 0) {
            this.getUserChatDetailXhl(toUserId)
          } else {
            Global.ui.notification.show('未知错误')
          }
        })
      // this.getUserChatDetailXhl(toUserId)
    }
  },

  // 群发涉及方法
  // 点击下方群发面板创建群发消息
  messMessageHandle() {
    this.$('.js-im-mass-message').addClass('active')
    this.$('.js-content-rightBar').html(this.massMessageTpl)
    this.clearContainerActiveHandle()
    this.activePerson = []
    this.messContactSelectedList = []
    // 生成群发联系人面板
    this.$('.js-mess-select-container').html(imService.getMessContact(this.userList))
    // 查询私聊轮询是否还在执行
    if (this.cartPolling) {
      clearInterval(this.cartPolling)
    }
  },
  // 点击近期群消息显示当前群消息详情
  clickRecentlyMessMassageHandler(e) {
    const $target = $(e.currentTarget)
    const gId = $target.data('id')
    this.clearContainerActiveHandle()
    $target.addClass('active')
    this.messContactSelectedList = []
    this.activePerson = {
      type: 'group',
      id: gId,
    }
    const data = {
      groupId: gId,
    }
    this.getGroupChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          this.$('.js-content-rightBar').html(this.massMessageTpl)
          if (res.root.prepareReveicer.length === 0) {
            this.$('.js-mess-select-container').html(imService.getMessContact(this.userList, res.root.prepareReveicer))
            this.$('.js-selected-sub-items').html('')
          } else {
            this.$('.js-mess-select-container').html(imService.getSelectMessContact(this.userList, res.root.prepareReveicer))
            this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(res.root.prepareReveicer, this.activePerson.id))
          }
          this.$('.js-mess-select-allContact').addClass('hidden')
          this.$('.js-mess-clear-allContact').addClass('hidden')
          this.$('.js-mess-message-content').html(imService.getChatMessageByDateHtml(res.root.messages, 'mess', res.root.messages.length))
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
    // 查询私聊轮询是否还在执行
    if (this.cartPolling) {
      clearInterval(this.cartPolling)
    }
  },

  // 群发消息
  sendMessMessageHandle() {
    const typeContent = this.$('.js-chat-input').val()
    const userContainer = this.$('.js-selected-sub-item')
    const userList = []
    if (userContainer.length === 0) {
      if (this.$('.js-select-panel-hidden').is(':hidden')) {
        this.$('.js-select-panel-hidden').removeClass('hidden')
        this.$('.js-select-panel-show').addClass('hidden')
        this.$('.chat-select-container').removeClass('sideUp')
      }
      this.$('.js-selected-sub-items').html('<div class="tooltip parsley-errors-list filled" id="parsley-id-4"><span class="sfa sfa-error-icon vertical-sub pull-left">' +
        '</span><div class="tooltip-inner parsley-required">请选择要发送的用户</div></div>')
      return false
    }

    _(userContainer).each((item) => {
      userList.push(item.dataset.id)
    })
    const userString = userList.join(',')
    const data = {
      userIds: userString,
    }
    if (typeContent !== '') {
      this.$('.js-chat-input').val('')
      this.$('.js-chat-message-content-panel').after(imService.insertChat(this.userPic, this.username, typeContent))
      // 先创建群
      if (this.activePerson.length === 0) {
        this.createMassChatXhr(data)
          .done((res) => {
            if (res.result === 0) {
              const gId = res.root.groupId
              this.recentlyList.unshift({
                groupId: gId,
              })
              this.activePerson = {
                type: 'group',
                id: gId,
              }
              this.clearContainerActiveHandle()
              this.renderRecentlyData()
              this.$('.js-recently-mass-message[data-id="' + gId + '"]').addClass('active')
              this.$('.js-mess-select-container').html(imService.getSelectMessContact(this.userList, res.root.prepareReveicer))
              this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(res.root.prepareReveicer, this.activePerson.id))
              this.$('.js-mess-select-allContact').addClass('hidden')
              this.$('.js-mess-clear-allContact').addClass('hidden')
              // 先将获取的消息数据排序
              this.$('.js-mess-message-content').html(imService.getChatMessageByDateHtml(res.root.messages, 'mess'))
              // 再创建消息
              const sendData = {
                groupId: gId,
                content: typeContent,
              }
              this.sendMassChatXhr(sendData)
                .done((e) => {
                  if (e.result === 0) {
                    // this.getUserChatDetailXhl(toUserId)
                  } else {
                    Global.ui.notification.show('未知错误')
                  }
                })
            } else {
              Global.ui.notification.show('未知错误')
            }
          })
      }

      // this.getUserChatDetailXhl(toUserId)
    }
  },

  // 管理员面板操作
  // 删除近期联系人
  delRecentlyContactHandler(e) {
    let delId = ''
    let type = ''
    if (this.activePerson.type === 'user') {
      delId = $(e.currentTarget).closest('.js-contact-onePerson').data('id')
      type = 0
    } else if (this.activePerson.type === 'group') {
      delId = $(e.currentTarget).closest('.js-recently-mass-message').data('id')
      type = 1
    }
    const data = {
      chatId: delId,
      chatType: type,
    }
    this.delRecentlyContactXhr(data)
      .done((res) => {
        if (res.result === 0) {
          this.recentlyList = imService.delRecentlyFromList(this.recentlyList, this.activePerson)
          this.renderRecentlyData()
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
    // const $nextActive = this.$('.js-recently-container').find('.js-contact-onePerson')[0]
    // $nextActive.addClass('active')
  },
  // 显示管理员面板
  contactWithAdminHandler(e) {
    const $target = $(e.currentTarget)
    this.clearContainerActiveHandle()
    $target.addClass('active')
    this.$('.js-content-rightBar').html(this.adminTpl)
    this.checkMassMessageButtonStatus()
    // 保存当前选择的聊天人
    this.activePerson = $target.data('id')
    // 查询私聊轮询是否还在执行
    if (this.cartPolling) {
      clearInterval(this.cartPolling)
    }
  },
  checkMassMessageButtonStatus() {
    if (this.$('.js-im-mass-message').hasClass('active')) {
      this.$('.js-im-mass-message').removeClass('active')
    }
  },

  // 轮询联系列表信息
  pollingContactInfoHandler() {
    this.contactPolling = setInterval(() => {
      this.renderGetContactInfoXhr()
      this.renderGetRecentlyInfoXhr()
    }, 30000)
  },
  // 轮询聊天记录信息
  pollingChatInfoHandler(userId) {
    if (userId !== this.chatPerson) {
      this.chatPerson = userId
    }
    this.cartPolling = setInterval(() => {
      this.getUserChatDetailXhl(this.chatPerson)
    }, 3000)
  },

  // 公共操作方法，样式显示处理事件
  // 群发联系人搜索
  searchMessContactHandler() {
    const name = this.$('.js-mess-search-panel-search').val()
    // 处理搜索联系人列表
    const searchResult = imService.getSearchResult(this.userList, name)
    this.$('.js-mess-select-container').html(imService.getMessContact(searchResult))
  },
  // 群发消息选择全部联系人
  selectAllContactHandler() {
    this.$('.js-mess-select-contact').addClass('active')
    this.messContactSelectedList = this.userList
    this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(this.messContactSelectedList))
  },
  // 清除群发消息全部选中联系人
  clearAllContactHandler() {
    this.$('.js-mess-select-contact').removeClass('active')
    this.messContactSelectedList = []
    this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(this.messContactSelectedList))
  },
  // 群发消息联系人选择
  selectMessContactHandler(e) {
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    if (!$target.hasClass('active') && this.activePerson.type !== 'group') {
      $target.addClass('active')
      const selectedItem = _(this.userList).findWhere({
        userId: id,
      })
      this.messContactSelectedList.push(selectedItem)
      this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(this.messContactSelectedList))
    }
  },
  // 群发消息取消选中联系人
  cancelMessContactHandler(e) {
    const $target = $(e.currentTarget)
    const id = $target.closest('.js-selected-sub-item').data('id')
    this.$('.js-mess-select-contact[data-id="' + id + '"]').removeClass('active')
    const cancelItem = _(this.messContactSelectedList).find({
      userId: id,
    })
    this.messContactSelectedList = _(this.messContactSelectedList).without(cancelItem)
    this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(this.messContactSelectedList))
  },
  // 当点击用户时，取消当前选择的用户
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
  // 选择联系人面板，取消其他面板
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
    const $div = this.$('.js-chat-message-content-panel')
    $div.scrollTop($div[0].scrollHeight)
  },
  // 关闭弹窗时销毁轮询
  onDestroy() {
    clearInterval(this.contactPolling)
    clearInterval(this.cartPolling)
    Global.ui.notification.setPrevent(false)
  },
})

module.exports = MessageView
