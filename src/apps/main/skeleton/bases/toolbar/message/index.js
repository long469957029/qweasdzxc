import './index.scss'
// import './emoji/emocss.min.css'
// import './emoji/emoji.min.css'
// import EmbedJS from 'embed-js'
// import url from 'embed-plugin-url'
// import emoji from 'embed-plugin-emoji'

const imService = require('./imService')


const MessageView = Base.ItemView.extend({

  template: require('./index.html'),
  adminTpl: require('./adminChat.html'),
  // onePersonTpl: require('./onePersonChat.html'),
  massMessageTpl: _.template(require('./massMessageChat.html'))(),
  onePersonTpl: _.template(require('./onePersonChat.html'))(),
  // massMessageTpl: require('./massMessageChat.html'),

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
    'click .js-select-panel-show': 'showSelectPanelHandle', // 打开群发联系人界面
    'click .js-select-panel-edit': 'showSelectPanelHandle', // 打开群发联系人界面
    'focus .js-im-contact-search': 'searchPanelChangeHandle',
    'click .js-search-input-cancel': 'cancelSearchInputHandle',
    'keydown .js-chat-input': 'sendChatHandle',
    'click .js-chat-footer-send': 'sendPrivateMessageHandle',
    'click .js-chat-more-content': 'showMoreChatHandler',
    'click .js-select-sub-item': 'selectMessContactHandler',
    'click .js-mess-contact-add': 'selectAllMessContactHandler', // 在侧边栏中添加联系人
    'click .js-mess-contact-cancel': 'cancelMessContactHandler',
    'click .js-mess-select-allContact': 'selectAllContactHandler',
    'click .js-mess-selected-allContact': 'clearAllContactHandler',
    'keyup .js-mess-search-panel-search': 'searchMessContactHandler',
    'keydown .js-mess-input': 'sendChatHandle',
    'keyup .js-mess-input': 'messInputChangeHandler',
    'click .js-mess-footer-send': 'sendMessMessageHandle',
    'click .js-recently-message-close': 'delRecentlyContactHandler',
    'click .js-recently-mass-message': 'clickRecentlyMessMassageHandler',
    'click .js-mess-more-content': 'showMoreMessHandler',
    'click .js-admin-more-content': 'showMoreAdminHandler',
    'click .js-admin-message-change': 'changeToAdminMessageUrlHandler',

    'click .js-chat-exp-pack': 'toggleExpPackHandler',
    'click .js-chat-exp': 'selectExpHandler',
    'click .js-chat-im-panel-content': 'contentClickHandler',
    'click .js-chat-select-container': 'chatSelectContainerClickHandler'
  },
  chatSelectContainerClickHandler(e) {
    e.stopPropagation()
    e.preventDefault()
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
    this.messContactSelectedList = []  //临时选中的待发送联系人名单
    this.finalMessContactSelectedList = [] //最终确定的待发送联系人名单
    this.recentlyList = []
    this.newMessageNum = 0
    this.chatLastRecordId = ''
    this.lastRecordsHeight = ''
  },
  onRender() {
    const self = this
    const acctInfo = Global.memoryCache.get('acctInfo')
    this.username = acctInfo.username
    this.contactUser = this.options.userId

    // const x = new EmbedJS({
    //   input: this.$('.js-chat-emoji-container')[0],
    //   plugins: [
    //     url(),
    //     emoji()
    //   ]
    // })
    // x.render()


    this.renderGetContactInfoXhr()
    this.renderGetRecentlyInfoXhr()
    this.pollingContactInfoHandler()
    // 监听click事件,监听群发消息选择侧边栏
    window.addEventListener('click', (e) => {
      const $target = $(e.target)
      const messBarWidth = self.$('.chat-select-container').hasClass('sideLeft')
      if (messBarWidth && !$target.hasClass('.chat-select-container')) {
        this.cancelMessContactHandler()
      }
    }, false)
  },
  // 公共显示方法
  // 触发查询联系人接口
  renderGetContactInfoXhr() {
    const self = this
    this.getChatTotalXhr()
      .done((res) => {
        if (res.result === 0) {
          this.renderContactData(res.root)
          this.parentId = res.root.parent.userId
          this.userList = imService.getUserList(res.root, this.parentId)
          if (self.options.userId) {
            self.$(`.js-contact-onePerson[data-id=${self.options.userId}]`).trigger('click')
          }
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
    if (recentlyResult.num > 0) {
      this.$('.js-recently-newMessage-num').addClass('hasNum')
      this.$('.js-recently-newMessage-num').html(imService.getNewMessageNumHtml(this.newMessageNum))
    } else {
      this.$('.js-recently-newMessage-num').removeClass('hasNum')
      this.$('.js-recently-newMessage-num').addClass('hidden')
    }
    this.$('.js-recently-container').html(recentlyResult.result)
  },
  //  获取左侧联系人菜单信息
  renderContactData(data) {
    let acPerson = this.activePerson
    if (this.contactUser != undefined) {
      acPerson = {
        type: 'user',
        id: this.contactUser
      }
      this.activePerson = acPerson
    }
    // 显示系统管理员状态
    this.$('.js-contact-admin').html(imService.getAdmin(acPerson))
    // 显示上级状态
    this.$('.js-contact-superior').html(imService.getSuperior(data.parent, acPerson))
    // 显示下级列表，如果不是玩家用户，显示我的下级列表
    if (window.store.getters.getUserType) {
      this.$('.js-person-sub-title').removeClass('hidden')
      this.$('.js-person-sub-container').html(imService.getItemsHtml(data.subList, this.parentId, acPerson))
    } else {
      // 如果是玩家用户，隐藏群发消息按钮
      this.$('.js-contact-mass-message').addClass('hidden')
      this.$('.js-im-mass-message').addClass('player')
    }
  },

  // 私聊涉及方法
  // 获取用户私聊记录
  getUserChatDetailXhl(id, type) {
    const self = this
    let data = []
    if (id === 'admin') {
      data = {
        pageSize: 2,
      }
    } else {
      data = {
        userId: id,
        pageSize: 30,
      }
    }
    this.getUserChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          if (res.root.records.length > 0) {
            // 处理私聊数据并生成html
            const chatData = res.root.records
            let chatResult = []
            let recordLastIndex = res.root.records.length - 1
            if (recordLastIndex < 0) {
              recordLastIndex = 0
            }
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
            if (id === 'admin') {
              self.$('.js-chat-admin-content').html(imService.getChatMessageByDateHtml(this.chatList.chatData, 'admin', res.root.records.length, this.pageIndex, res.root.rowCount))
              // 当点击联系人时将下拉框滚动至最下方
              if (type === 'scroll') {
                const $div = this.$('.js-chat-admin-content')
                $div.scrollTop($div[0].scrollHeight)
              }
            } else {
              self.$('.js-chat-message-content-panel').html(imService.getChatMessageByDateHtml(this.chatList.chatData, null, res.root.records.length, this.pageIndex, res.root.rowCount))
              // 当点击联系人时将下拉框滚动至最下方
              if (type === 'scroll') {
                this.scrollbarBottomHandler()
              }
            }
          }
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 显示私聊面板
  contactWithOnePersonHandler(e) {
    this.pageIndex = 0
    this.chatList = []
    this.chatLastRecordId = ''
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
    this.getUserChatDetailXhl(toUserId, 'scroll')
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
    // 刷新近期联系人状态
    const refreshActiveRecentlyResult = imService.refreshActiveRecentlyStatus(this.recentlyList, this.activePerson)
    this.recentlyList = refreshActiveRecentlyResult.result
    this.newMessageNum -= refreshActiveRecentlyResult.num
    this.renderRecentlyData()
    // this.activeParentContainer = $target.parentNode.data('id')
  },
  // 点击打开更多私聊记录
  showMoreChatHandler(id) {
    this.pageIndex += 1
    // this.getUserChatDetailXhl()
    let data = []
    if (id === 'admin') {
      data = {
        lastChatId: this.chatLastRecordId,
        pageSize: 30,
      }
    } else {
      data = {
        userId: this.$('.js-contact-toUser').val(),
        lastChatId: this.chatLastRecordId,
        pageSize: 30,
      }
    }

    this.getUserChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // 获取点击前框高度
          let selectDiv = this.$('.js-chat-message-content-panel')
          let type = null
          if (id === 'admin') {
            selectDiv = this.$('.js-chat-admin-content')
            type = 'admin'
          }
          const $div = selectDiv
          const beforeHeight = $div[0].scrollHeight
          // 处理私聊数据并生成html
          const list = this.chatList.chatData
          let recordLastIndex = res.root.records.length - 1
          if (recordLastIndex < 0) {
            recordLastIndex = 0
          }
          this.chatLastRecordId = res.root.records[recordLastIndex].rid
          // this.chatList.chatData = list.unshift(res.root.records)
          this.chatList.chatData = res.root.records.concat(list)
          selectDiv.html(imService.getChatMessageByDateHtml(this.chatList.chatData, type, res.root.records.length, this.pageIndex, res.root.rowCount))
          // 获取点击后框高度
          const $afterDiv = selectDiv
          const afterHeight = $afterDiv[0].scrollHeight
          // 将下拉条滚动至原有加载文字所在处
          $div.scrollTop(afterHeight - beforeHeight)
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
        content: typeContent.replace(/\[\-f(\w+)\-\]/g, '<span class="chat-exp-text face-$1"></span>'),
        toUser: toUserId,
      }
      this.$('.js-chat-message-content-panel').append(imService.insertChat(this.userPic, this.username, typeContent))
      const today = new Date()
      if (this.chatList.chatData == undefined) {
        this.chatList.chatData = []
      }
      this.chatList.chatData.push({
        content: typeContent.replace(/\[\-f(\w+)\-\]/g, '<span class="chat-exp-text face-$1"></span>'),//reqData.content.replace(/\[\-f(\w+)\-\]/g, '<span class="chat-exp face-$1"></span>'),
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
    this.finalMessContactSelectedList = []
    this.pageIndex = 0
    this.chatList = []
    this.chatLastRecordId = ''
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
    // 初始化数据
    this.messContactSelectedList = []
    this.finalMessContactSelectedList  = []
    this.chatList = []
    this.chatLastRecordId = ''
    this.pageIndex = 0
    this.activePerson = {
      type: 'group',
      id: gId,
    }
    const data = {
      groupId: gId,
      pageSize: 30,
    }
    this.getGroupChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // 初始化群发消息列表及最后一条记录ID
          this.initMessChatList(res.root.messages, gId)
          this.$('.js-content-rightBar').html(this.massMessageTpl)
          if (res.root.prepareReveicer.length === 0) {
            this.$('.js-select-panel-show').removeClass('hidden')
            this.$('.js-select-panel-edit').addClass('hidden')
            this.$('.js-mess-select-container').html(imService.getMessContact(res.root.prepareReveicer))
          } else {
            this.$('.js-select-panel-show').addClass('hidden')
            this.$('.js-select-panel-edit').removeClass('hidden')
            this.$('.js-select-panel-edit-num').html(res.root.prepareReveicer.length)
            this.$('.js-mess-contact-num').html(res.root.prepareReveicer.length)
            this.$('.js-select-panel-edit').addClass('edit')
            this.$('.js-mess-select-container').addClass('edit')
            this.$('.js-mess-select-container').html(imService.getMessContact(res.root.prepareReveicer, 'edit'))
          }
          this.$('.js-mess-message-content').html(imService.getChatMessageByDateHtml(this.chatList.chatData, 'mess', res.root.messages.length, this.pageIndex, res.root.messageCount))
          const $div = this.$('.js-mess-message-content')
          $div.scrollTop($div[0].scrollHeight)
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
    const typeContent = this.$('.js-mess-input').val()
    // const userContainer = this.$('.js-selected-sub-item')
    const userContainer = this.finalMessContactSelectedList
    const userList = []
    if (userContainer.length === 0) {
      if (this.$('.js-select-panel-hidden').is(':hidden')) {
        this.$('.js-select-panel-hidden').removeClass('hidden')
        this.$('.js-select-panel-show').addClass('hidden')
        this.$('.chat-select-container').removeClass('sideLeft')
      }
      this.$('.chat-message-noContact').removeClass('hidden')
      // this.$('.chat-message-content').html('<div class="chat-message-noContact"><div class="sfa sfa-info-icon vertical-sub pull-left">' +
      //   '</div><div class="chat-message-noContact-text">请先添加联系人</div></div>')
      return false
    }

    _(userContainer).each((item) => {
      userList.push(item.userId)
    })
    const userString = userList.join(',')
    const data = {
      userIds: userString,
    }
    if (typeContent !== '') {
      this.$('.js-mess-input').val('')
      this.$('.js-chat-message-content-panel').after(imService.insertChat(this.userPic, this.username, typeContent))
      // 先创建群
      if (_.isEmpty(this.activePerson)) {
        this.createMassChatXhr(data)
          .done((res) => {
            if (res.result === 0) {
              const gId = res.root.groupId
              this.recentlyList.unshift({
                groupId: gId,
                groupSize: userContainer.length,
              })
              this.activePerson = {
                type: 'group',
                id: gId,
              }
              this.initMessChatList(res.root.messages, gId)
              this.clearContainerActiveHandle()
              this.renderRecentlyData()
              this.$('.js-recently-mass-message[data-id="' + gId + '"]').addClass('active')
              // this.$('.js-mess-select-container').html(imService.getSelectMessContact(this.userList, res.root.prepareReveicer))
              // this.$('.js-selected-sub-items').html(imService.getMessSelectedHtml(res.root.prepareReveicer, this.activePerson.id))
              this.$('.js-mess-select-container').html(imService.getMessContact(this.userList, res.root.prepareReveicer))
              this.$('.js-mess-select-allContact').addClass('hidden')
              this.$('.js-mess-clear-allContact').addClass('hidden')
              this.$('.js-mess-select-container').addClass('edit')
              // 将获取的消息数据排序
              this.$('.js-mess-message-content').html(imService.getChatMessageByDateHtml(this.chatList.chatData, 'mess', res.root.messages.length, this.pageIndex, res.root.messageCount))
              // 再创建消息
              this.sendMessMessageXhlHandle(gId, typeContent)
            } else {
              Global.ui.notification.show('未知错误')
            }
          })
      } else {
        this.sendMessMessageXhlHandle(this.activePerson.id, typeContent)
      }
    }
  },

  // 发送群消息接口
  sendMessMessageXhlHandle(gId, typeContent) {
    const sendData = {
      groupId: gId,
      content: typeContent.replace(/\[\-f(\w+)\-\]/g, '<span class="chat-exp-text face-$1"></span>'),
    }
    this.sendMassChatXhr(sendData)
      .done((e) => {
        if (e.result === 0) {
          const groupData = {
            groupId: gId,
            pageSize: 30,
          }
          this.getGroupChatXhr(groupData)
            .done((res) => {
              if (res.result === 0) {
                this.$('.js-mess-message-content').html(imService.getChatMessageByDateHtml(res.root.messages, 'mess', res.root.messages.length))
                const $div = this.$('.js-mess-message-content')
                this.$('.js-select-panel-edit').addClass('edit')
                $div.scrollTop($div[0].scrollHeight)
              } else {
                Global.ui.notification.show('未知错误')
              }
            })
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 点击群发消息查看更多
  showMoreMessHandler() {
    // 初始化数据
    this.pageIndex += 1
    let data = []
    data = {
      groupId: this.activePerson.id,
      lastChatId: this.chatLastRecordId,
      pageSize: 30,
    }
    this.getGroupChatXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // 获取加载数据前高度
          const $div = this.$('.js-mess-message-content')
          const beforeHeight = $div[0].scrollHeight
          // 将新获取数据拼接至list前面
          const list = this.chatList.chatData
          const recordLastIndex = res.root.messages.length - 1
          this.chatLastRecordId = res.root.messages[recordLastIndex].rid
          this.chatList.chatData = res.root.messages.concat(list)
          this.$('.js-mess-message-content').html(imService.getChatMessageByDateHtml(this.chatList.chatData, 'mess', res.root.messages.length, this.pageIndex, res.root.messageCount))
          // 获取加载数据之后的高度
          const $divAfter = this.$('.js-mess-message-content')
          const afterHeight = $divAfter[0].scrollHeight
          // 将下拉条滚动至原有加载文字所在处
          $div.scrollTop(afterHeight - beforeHeight)
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
  },
  // 初始化聊天消息及最后一条记录ID
  initMessChatList(records, gId) {
    this.chatList = {
      chatData: records,
      id: gId,
    }
    this.chatLastRecordId = imService.getChatLastRecordId(records)
  },
  // 删除近期联系人
  delRecentlyContactHandler(e) {
    const $target = $(e.currentTarget)
    let delId = ''
    let type = ''
    if ($target.data('type') === 'user') {
      delId = $target.data('id')
      type = 0
    } else if ($target.data('type') === 'group') {
      delId = $target.data('id')
      type = 1
    }
    const data = {
      chatId: delId,
      chatType: type,
    }
    const activePerson = {
      type: $target.data('type'),
      id: delId
    }
    $target.parent().remove()
    this.recentlyList = imService.delRecentlyFromList(this.recentlyList, activePerson)
    this.delRecentlyContactXhr(data)
      .done((res) => {
        if (res.result === 0) {
          // this.recentlyList = imService.delRecentlyFromList(this.recentlyList, this.activePerson)
          this.renderRecentlyData()
        } else {
          Global.ui.notification.show('未知错误')
        }
      })
    e.preventDefault()
    e.stopPropagation()
  },
  // 管理员面板操作
  // 显示管理员面板
  contactWithAdminHandler(e) {
    const $target = $(e.currentTarget)
    this.clearContainerActiveHandle()
    $target.addClass('active')
    // 初始化数据
    this.chatList = []
    this.chatLastRecordId = ''
    this.pageIndex = 0
    this.activePerson = {
      type: 'admin',
      id: 'admin',
    }
    this.$('.js-content-rightBar').html(this.adminTpl)
    this.checkMassMessageButtonStatus()
    // 查询管理员记录
    this.getUserChatDetailXhl('admin', 'scroll')
    // 查询私聊轮询是否还在执行
    if (this.cartPolling) {
      clearInterval(this.cartPolling)
    }
  },
  // 点击查看更多管理员消息
  showMoreAdminHandler() {
    this.showMoreChatHandler('admin')
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
    }, 5000)
    this.recentlyPolling = setInterval(() => {
      this.renderGetRecentlyInfoXhr()
    }, 5000)
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
    // this.$('.js-mess-select-allContact').addClass('active')
    this.$('.js-mess-select-allContact').toggleClass('hidden', true)
    this.$('.js-mess-selected-allContact').toggleClass('hidden', false)
    this.messContactSelectedList = this.userList
    this.$('.js-mess-select-container').html(imService.getMessContact(this.userList, this.messContactSelectedList))
  },
  // 清除群发消息全部选中联系人
  clearAllContactHandler() {
    this.$('.js-mess-select-contact').removeClass('active')
    this.$('.js-mess-select-allContact').toggleClass('hidden', false)
    this.$('.js-mess-selected-allContact').toggleClass('hidden', true)
    this.messContactSelectedList = []
    this.$('.js-mess-select-container').html(imService.getMessContact(this.userList, this.messContactSelectedList))
  },
  // 群发消息联系人选择
  selectMessContactHandler(e) {
    const $target = $(e.currentTarget)
    const id = Number($target.attr('data-id'))
    const type = $target.attr('data-type')
    if (type === 'selected') {
      const cancelItem = _(this.messContactSelectedList).find({
        userId: id,
      })
      this.messContactSelectedList = _(this.messContactSelectedList).without(cancelItem)
      $target.find('.js-mess-select-contact').removeClass('hidden')
      $target.find('.js-mess-selected-contact').addClass('hidden')
      $target.attr('data-type', '')
    } else {
      const selectedItem = _(this.userList).findWhere({
        userId: id,
      })
      this.messContactSelectedList.push(selectedItem)
      $target.find('.js-mess-select-contact').addClass('hidden')
      $target.find('.js-mess-selected-contact').removeClass('hidden')
      $target.attr('data-type', 'selected')
      // this.$('.js-selected-sub-items').html(imService.getMessContact(this.userList,this.messContactSelectedList))
    }
  },
  // 侧边栏添加所有选择联系人
  selectAllMessContactHandler(e){
    const $target = $(e.currentTarget)
    const subItem=$target.closest('.js-chat-select-container').find('.js-select-sub-item[data-type="selected"]')
    this.$('.chat-select-container').removeClass('sideLeft')
    this.$('.js-select-panel-edit-num').html(subItem.length)
    if (subItem.length > 0) {
      this.$('.js-select-panel-show').addClass('hidden')
      this.$('.js-select-panel-edit').removeClass('hidden')
      this.$('.js-select-panel-edit').addClass('edit')
      if (!this.$('.chat-message-noContact').hasClass('hidden')) {
        this.$('.chat-message-noContact').addClass('hidden')
      }
    } else if (!this.$('.js-select-panel-edit').hasClass('hidden')) {
      this.$('.js-select-panel-show').removeClass('hidden')
      this.$('.js-select-panel-edit').addClass('hidden')
    }
    this.finalMessContactSelectedList = this.messContactSelectedList
  },
  // 群发消息取消选中联系人
  cancelMessContactHandler() {
    this.$('.chat-select-container').removeClass('sideLeft')
    // if (!this.$('.js-select-panel-edit').hasClass('hidden')) {
    //   this.$('.js-select-panel-show').removeClass('hidden')
    // }
  },
  // 当点击用户时，取消当前选择的用户
  clearContainerActiveHandle() {
    this.$('.js-contact-container').find('.active').removeClass('active')
    this.$('.js-recently-container').find('.active').removeClass('active')
    this.$('.js-content-leftBar-search').find('.active').removeClass('active')
  },
  // 输入搜索样式事件
  searchCheckHandler() {
    const name = this.$('.js-im-contact-search').val()
    // 处理搜索联系人列表
    this.$('.js-content-rightBar').html('<div class="js-content-rightBar-empty content-rightBar-empty">请在左侧列表选择您要联系的上下级 </div>')
    const searchResult = imService.getSearchResult(this.userList, name)
    if (searchResult.length > 0 && name !== '') {
      this.$('.js-search-container-hasResult').removeClass('hidden')
      this.$('.js-search-container-noResult').addClass('hidden')
      this.$('.js-search-container-hasResult').html(imService.getItemsHtml(searchResult, this.parentId, this.activePerson))
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
    this.$('.js-search-container-noResult').toggleClass('hidden', true)
    this.$('.js-content-leftBar-general').toggleClass('hidden', false)
    this.$('.js-im-contact-search').toggleClass('active', false)
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
  messInputChangeHandler() {
    const content = this.$('.js-mess-input').val()
    this.$('.js-content-editable').html(content)
    if (content !== undefined && content.length > 0) {
      if (!this.$('.js-mess-footer-send').hasClass('.active')) {
        this.$('.js-mess-footer-send').addClass('active')
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
    this.$('.chat-select-container').addClass('sideLeft')
    $target.addClass('hidden')
    this.$('.js-select-panel-show').removeClass('hidden')
  },
  showSelectPanelHandle(e) {
    const $target = $(e.currentTarget)
    this.$('.chat-select-container').addClass('sideLeft')
    // $target.addClass('hidden')
    if ($target.hasClass('edit')) {
      this.$('.js-chat-person-panel-title').addClass('hidden')
      this.$('.js-search-panel').addClass('hidden')
      //分阶段隐藏，先隐藏未选中的联系人
      let $unSelected = this.$('.js-mess-selected-contact.hidden')
      $unSelected.closest('.js-select-sub-item').addClass('hidden')
      //分阶段隐藏，再隐藏选中的标识，及触发事件的样式，防止选中事件触发样式显隐
      this.$('.js-select-sub-item').removeClass('js-select-sub-item')
      this.$('.js-mess-select-contact').addClass('hidden')
      this.$('.js-mess-selected-contact').addClass('hidden')

      this.$('.js-mess-select-container-footer').addClass('hidden')
      this.$('.js-chat-person-panel-title-edit').removeClass('hidden')
      this.$('.js-mess-contact-num').html(this.$('.js-select-panel-edit-num').html())
      // this.$('.js-mess-contact-num').html(this.messContactSelectedList.length)
      // this.$('.js-mess-select-container').html(imService.getMessContact(this.messContactSelectedList, 'edit'))
    }
    e.preventDefault()
    e.stopPropagation()

    // this.$('.js-select-panel-hidden').removeClass('hidden')
  },
  // 滚动条固定在最底部
  scrollbarBottomHandler() {
    const $div = this.$('.js-chat-message-content-panel')
    $div.scrollTop($div[0].scrollHeight)
  },

  toggleExpPackHandler: function (e) {
    var $target = $(e.currentTarget);
    if ($target.hasClass('disabled')) {
      return;
    }
    $target.toggleClass('sfa-icon-smile-green')
    this.$el.find('.js-chat-exp-pack-inner').toggleClass('hidden');
    e.stopPropagation()
    e.preventDefault()
  },
  selectExpHandler: function (e) {
    var $target = $(e.currentTarget);
    var expId = $target.data('id');
    var $content = ''
    if (this.activePerson.type === 'user') {
      $content = this.$el.find('.js-chat-input')
    } else {
      $content = this.$el.find('.js-mess-input')
    }
    $content.val($content.val() + expId)
      .trigger('input').trigger('keyup');
    $content.focus()
  },
  contentClickHandler() {
    let $emoji = this.$('.js-chat-exp-pack')
    let $emojiPanel = $emoji.find('.js-chat-exp-pack-inner')
    if (!$emojiPanel.hasClass('hidden')) {
      $emoji.toggleClass('sfa-icon-smile-green', false);
      $emojiPanel.toggleClass('hidden', true)
    }
  },
  // 关闭弹窗时销毁轮询
  onDestroy() {
    clearInterval(this.contactPolling)
    clearInterval(this.cartPolling)
    clearInterval(this.recentlyPolling)
    Global.ui.notification.setPrevent(false)
  },

})

module.exports = MessageView
