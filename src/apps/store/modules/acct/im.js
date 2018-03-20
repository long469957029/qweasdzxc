/**
 * 站内信操作
 */
import {
  getImContactApi, getImRecentlyApi, getImChatListApi, sendPeosonalMessageApi,
  sendMessMessageApi,
  createMessGroupApi,
  getMessGroupMessageApi,
  delRecentlyContactApi,
} from 'api/message'
import avatarConfig from 'userCenter/misc/avatarConfig'

const initState = () => {
  return {
    recentlyList: [],
    newMessageTotal: 0,
    contactSubList: [],
    contactParent: '',
    showSearchResultPanel: false,
    searchResultList: [],
    messagePanel: 0,  // 聊天面板类型，0：空面板，1：管理员面板，2：私聊面板，3：新建群聊面板，4：群消息面板
    messContacts: [], // 群聊联系人面板显示数据
    messSelectPanelOpened: false, //群聊联系人面板
    messContactSelected: [], // 已选中群聊联系人
    clickMessSelectPanelOutSide: 0,
    chatList: [],
    chatListLength: 0,
    contactUserInfo: '',
    contactPollingStopStatus: false,// 联系人列表轮询关闭状态、
    sendChatStatus: '',// 发送消息结果
    createMessGroupStatus: '',// 创建群聊结果
    delRecentlyRecordStatus: '', // 删除近期联系人记录
    is_send: '',//是否在发送
  }
}

// getters
const getters = {
  getRecentlyList: (state) => {
    return state.recentlyList
  },
  getRecentlyNewMessageNum: (state) => {
    return state.newMessageTotal
  },
  getContactSubList: (state) => {
    return state.contactSubList
  },
  getContactParent: (state) => {
    return state.contactParent
  },
  getSearchResultPanelStatus: (state) => {
    return state.showSearchResultPanel
  },
  getSearchResultList: (state) => {
    return state.searchResultList
  },
  getMessagePanelStatus: (state) => {
    return state.messagePanel
  },
  getContactUserInfo: (state) => {
    return state.contactUserInfo
  },
  getMessContact: (state) => {
    return state.messContacts
  },
  getMessContactPanelStatus: (state) => {
    return state.messSelectPanelOpened
  },
  getClickMessSelectPanelOutSideStatus: (state) => {
    return state.clickMessSelectPanelOutSide
  },
  getChatList: (state) => {
    return state.chatList
  },
  getChatListLength: (state) => {
    return state.chatListLength
  },
  getContactPollingStopStatus: (state) => {
    return state.contactPollingStopStatus
  },
  getSendChatStatus: (state) => {
    return state.sendChatStatus
  },
  getMessContactSelected: (state) => {
    return state.messContactSelected
  },
  getCreateMessGroupStatus: (state) => {
    return state.createMessGroupStatus
  },
  getDelRecentlyRecordStatus: (state) => {
    return state.delRecentlyRecordStatus
  },
  is_send_status: (state) => {
    return state.is_send
  },
}

// actions
const actions = {
  [types.GET_IM_RECENTLY_CONTACT]({commit}) {
    return getImRecentlyApi(
      ({data}) => {
        return commit(types.GET_IM_RECENTLY_CONTACT_SUCCESS, data)
      },
    )
  },
  [types.GET_IN_CONTACT]({commit}) {
    return getImContactApi(
      ({data}) => {
        return commit(types.GET_IN_CONTACT_SUCCESS, data)
      },
    )
  },
  [types.GET_IM_CONTACT_CHAT]({commit}, {userId, pageSize, lastChatId}) {
    getImChatListApi(
      {
        userId,
        pageSize,
        lastChatId,
      },
      (data) => {
        return commit(types.GET_IM_CONTACT_CHAT_SUCCESS, data)
      },
    )
  },
  [types.GET_IM_MESS_CHAT]({commit}, {groupId, pageSize, lastChatId}) {
    getMessGroupMessageApi(
      {
        groupId,
        pageSize,
        lastChatId,
      },
      (data) => {
        return commit(types.GET_IM_MESS_CHAT_SUCCESS, data)
      },
    )
  },
  [types.SEND_PEASONAL_CHAT]({commit}, {content, toUser}) {
    sendPeosonalMessageApi(
      {
        content,
        toUser,
      },
      ({data}) => {
        return commit(types.SEND_PEASONAL_CHAT_SUCCESS, data)
      }
    )
  },
  [types.SEND_MESS_CHAT]({commit}, {content, groupId}) {
    sendMessMessageApi(
      {
        content,
        groupId,
      },
      ({data}) => {
        return commit(types.SEND_MESS_CHAT_SUCCESS, data)
      }
    )
  },
  [types.CREATE_MESS_GROUP]({commit}, {userIds}) {
    createMessGroupApi(
      {
        userIds,
      },
      ({data}) => {
        return commit(types.CREATE_MESS_GROUP_SUCCESS, data)
      }
    )
  },
  [types.CLOSE_RENCENTLY_RECORD]({commit}, {chatId, chatType}) {
    delRecentlyContactApi(
      {
        chatId,
        chatType,
      },
      ({data}) => {
        return commit(types.CLOSE_RENCENTLY_RECORD_SUCCESS, data)
      }
    )
  },
}

// mutations
const mutations = {
  [types.GET_IM_RECENTLY_CONTACT_SUCCESS](state, res) {
    if (res && res.result === 0) {
      const data = res.root || {}
      const rList = data.records
      let newMessageNum = 0
      _(rList).each((item) => {
        // 近期列表记录状态，0：系统管理员，1：群聊，2：个人聊天
        if (item.groupId === null && item.userId !== null) {
          item.headIcon = avatarConfig.get(_(item.headIconId).toString()).logo
          item.type = 2
          item.name = item.userName
        } else if (item.userId === null && item.groupId !== null) {
          item.type = 1
          item.name = '群消息'
        } else {
          item.type = 0
          item.name = '系统管理员'
          item.userName = '系统管理员'
        }
        newMessageNum = newMessageNum + item.newMsgNum
        if (item.newMsgNum > 99) {
          item.newMsgNum = 99
        }
      })
      state.recentlyList = rList
      if (newMessageNum >= 99) {
        newMessageNum = 99
      }
      state.newMessageTotal = newMessageNum
    }
  },
  [types.GET_IN_CONTACT_SUCCESS](state, res) {
    if (res && res.result === 0) {
      const parentInfo = res.root.parent
      parentInfo.headIcon = avatarConfig.get(_(parentInfo.headIconId).toString()).logo
      parentInfo.userName = '我的上级'
      state.contactParent = parentInfo
      const subInfo = res.root.subList
      _(subInfo).each((item) => {
        item.headIcon = avatarConfig.get(_(item.headIconId).toString()).logo
      })
      state.contactSubList = subInfo
    }
  },
  [types.TOGGLE_IM_CONTACT_PANEL](state, data){
    state.showSearchResultPanel = data
  },
  [types.CONTACT_SEARCH_NAME](state, data){
    state.searchResultList = _(state.contactSubList).filter((item) => {
      return item.userName.indexOf(data) > -1
    })
  },
  [types.CLEAR_CONTACT_SEARCH_NAME](state){
    state.searchResultList = []
  },
  [types.TOGGLE_MESSAGE_PANEL](state, data){
    state.messagePanel = data
  },
  [types.UPDATE_CONTACT_USER_INFO](state, data){
    if (data === 'mess') {
      state.contactUserInfo = ''
      state.chatList = []
      state.chatListLength = 0
      state.messagePanel = 3
      state.messContact = []
      state.messContactSelected = []
    } else {
      state.contactUserInfo = data
    }
  },
  [types.CLEAR_IM_PROCESS](state){
    state.contactPollingStopStatus = true
    Object.assign(state, initState())
  },
  [types.TOGGLE_MESS_CONTACT_PANEL](state, data){
    state.messSelectPanelOpened = data
  },
  [types.GET_MESS_CONTACT](state, data){
    if (data === -1) {
      state.messContacts = _(state.contactSubList).each((item) => {
        item.selected = false
      })
    } else if (data === -2) {
      state.messContacts = _(state.messContactSelected).each((item) => {
        item.selected = true
      })
    } else {
      state.messContacts = _(state.contactSubList).filter((item) => {
        return item.userName.indexOf(data) > -1
      })
    }
  },
  [types.CLICK_MESS_SELECT_PANEL_OUTSIDE](state, data){
    let sum = state.clickMessSelectPanelOutSide + data
    state.clickMessSelectPanelOutSide = sum
  },
  [types.ADD_MESS_CONTACT](state, data){
    state.messContactSelected = data
  },
  [types.GET_IM_CONTACT_CHAT_SUCCESS](state, data){
    state.chatListLength = data.data.root.rowCount
    state.chatList = data.data.root.records
  },
  [types.GET_IM_MESS_CHAT_SUCCESS](state, data){
    state.chatListLength = data.data.root.messageCount
    state.messContactSelected = data.data.root.prepareReveicer
    state.chatList = _(data.data.root.messages).each((item) => {
      item.userName = '群发消息'
    })
  },
  [types.SEND_PEASONAL_CHAT_SUCCESS](state, data){
    state.sendChatStatus = data
  },
  [types.SEND_MESS_CHAT_SUCCESS](state, data){
    state.sendChatStatus = data
    state.messagePanel = 4
  },
  [types.CREATE_MESS_GROUP_SUCCESS](state, data){
    state.createMessGroupStatus = data
  },
  [types.CLOSE_RENCENTLY_RECORD_SUCCESS](state, data){
    state.delRecentlyRecordStatus = data
  },
  [types.IS_SEND](state, data){
    state.is_send = data
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
