/**
 * Created by steven on 2018/3/6.
 */
/**
 * 获取站内聊天联系人列表
 * @param then
 * @param fail
 */
const getImContactApi = (then, fail) => {
  return $http({
    url: '/acct/userChat/chatStat.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取站内聊天近期联系人列表
 * @param then
 * @param fail
 */
const getImRecentlyApi = (then, fail) => {
  return $http({
    url: '/acct/userChat/recentChatStat.json',
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取站内聊天记录
 * @param then
 * @param fail
 */
const getImChatListApi = ({userId,pageSize,lastChatId},then, fail) => {
  return $http({
    url: '/acct/userChat/chatList.json',
    data: {
      userId,
      pageSize,
      lastChatId,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 发送个人聊天消息
 * @param content
 * @param toUser
 * @param then
 * @param fail
 */
const sendPeosonalMessageApi = ({content,toUser},then, fail) => {
  return $http({
    url: '/acct/userChat/send.json',
    data: {
      content,
      toUser,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 发送群消息
 * @param content
 * @param groupId
 * @param then
 * @param fail
 */
const sendMessMessageApi = ({content,groupId},then, fail) => {
  return $http({
    url: '/acct/userChat/sendGroup.json',
    data: {
      content,
      groupId,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 创建群聊
 * @param userIds
 * @param then
 * @param fail
 */
const createMessGroupApi = ({userIds},then, fail) => {
  return $http({
    url: '/acct/userChat/createGroupChat.json',
    data: {
      userIds,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 获取群聊记录
 * @param then
 * @param fail
 */
const getMessGroupMessageApi = ({groupId,pageSize,lastChatId},then, fail) => {
  return $http({
    url: '/acct/userChat/groupChat.json',
    data: {
      groupId,
      pageSize,
      lastChatId,
    },
  })
    .then(then)
    .catch(fail)
}
/**
 * 删除近期联系人
 * @param chatType
 * @param chatId
 * @param then
 * @param fail
 */
const delRecentlyContactApi = ({chatId,chatType},then, fail) => {
  return $http({
    url: '/acct/userChat/delRecentChat.json',
    data: {
      chatId,
      chatType,
    },
  })
    .then(then)
    .catch(fail)
}

export {
  getImContactApi,
  getImRecentlyApi,
  getImChatListApi,
  sendPeosonalMessageApi,
  sendMessMessageApi,
  createMessGroupApi,
  getMessGroupMessageApi,
  delRecentlyContactApi,
}
