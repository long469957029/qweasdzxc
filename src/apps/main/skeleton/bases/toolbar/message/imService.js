/**
 * Created by steven on 2018/1/5.
 */
// const avatarConf = require('userCenter/misc/avatarConfig')

module.exports = {
  // 获取左边联系人系统管理员样式
  getAdmin() {
    const html = []
    html.push('<div class="js-contact-systemAdmin  person-item" data-name="系统管理员"><span class="sfa sfa-avata-admin"></span>' +
      '<span class="js-contact-online-status"></span><span class="js-contact-admin contact-name">系统管理员</span></div>')
    return html.join('')
  },
  // 获取左边联系人我的上级样式
  getSuperior(parentInfo) {
    const supersiorHtml = []
    if (parentInfo.userId !== 0) {
      if (parentInfo.online) {
        supersiorHtml.push(`<div class="js-contact-onePerson  person-item" data-id="${parentInfo.userId}" data-name="我的上级"><span class="sfa sfa-avatar-online"></span>` +
          '<span class="text-circle contact-status"></span> <span class="contact-name">我的上级</span></div>')
      } else {
        supersiorHtml.push(`<div class="js-contact-onePerson person-item" data-id="${parentInfo.userId}" data-name="我的上级">` +
          '<span class="sfa sfa-avatar-online avatar-gray"></span><span class="contact-name" >我的上级</span></div>')
      }
    }
    return supersiorHtml.join('')
  },
  // 获取左边联系人，搜索界面联系人样式
  getItemsHtml(userList) {
    const userHtml = []
    _(userList).each((user) => {
      const item = []
      const name = user.userName
      if (name === '系统管理员') {
        item.push('<div class="js-contact-systemAdmin person-item" data-name="系统管理员">')
      } else if (name === '我的上级') {
        item.push(`<div class="js-contact-onePerson person-item" data-id="${user.userId}" data-name="我的上级">`)
      } else {
        item.push(`<div class="js-contact-onePerson person-item" data-id="${user.userId}" data-name="${name}">`)
      }
      if (user.online) {
        item.push('<span class="sfa sfa-avatar-online"></span><span class="text-circle contact-status"></span> ')
      } else {
        item.push('<span class="sfa sfa-avatar-online avatar-gray"></span>')
      }
      item.push(`<span class="contact-name">${name}</span></div>`)
      userHtml.push(item.join(''))
    })
    return userHtml.join('')
  },
  // 获取搜索结果list，将我的上级和系统管理员放入结果list
  getUserList(data, parentId) {
    const userList = data.subList
    if (parentId !== 0) {
      userList.push({
        newMsgNum: data.parent.newMsgNum,
        online: data.parent.online,
        userId: data.parent.userId,
        userName: '我的上级',
      })
    }
    userList.push({
      newMsgNum: data.admin.newMsgNum,
      online: true,
      userId: data.admin.userId,
      userName: '系统管理员',
    })
    return userList
  },
  // 判断上下级中是否包含搜索字样的名字，如果有，返回结果list
  getSearchResult(userList, name) {
    const resultList = []
    _(userList).each((user) => {
      if (user.userName.match(name)) {
        resultList.push(user)
      }
    })
    return resultList
  },
  // 获取左边近期聊天未读信息显示
  getNewMessageNumHtml(num) {
    const html = []
    html.push(`<div class="recently-newMessage-num-text inline-block">${num}</div>`)
    return html
  },
  // 处理近期联系人显示
  getRecentlyItemHtml(records, parents) {
    const html = []
    let newMsgNum = 0
    _(records).each((item) => {
      if (item.userId !== undefined && item.userId !== null && item.userId !== '') {
        const itemHtml = []
        if (item.userId === parents) {
          itemHtml.push(`<div class="js-contact-onePerson recently-item" data-id="${item.userId}" data-name="我的上级">`)
        } else {
          itemHtml.push(`<div class="js-contact-onePerson recently-item" data-id="${item.userId}" data-name="${item.userName}">`)
        }
        if (item.online) {
          itemHtml.push('<span class="sfa sfa-avatar-online recently-item-img inline-block"></span>')
          itemHtml.push('<span class="text-circle contact-status"></span>')
        } else {
          itemHtml.push('<span class="sfa sfa-avatar-online recently-item-img inline-block avatar-gray"></span>')
        }
        if (item.newMsgNum > 0) {
          itemHtml.push('<div class="recently-item-info inline-block">')
          itemHtml.push(`<div class="recently-name">${item.userName}</div>`)
          itemHtml.push(`<div class="recently-desc">${item.lastMessage}</div>`)
          itemHtml.push(`</div><div class=" recently-item-info-num"><div class="recently-newMessage-num-text inline-block">${item.newMsgNum}</div></div></div>`)
          newMsgNum += item.newMsgNum
        } else {
          itemHtml.push('<div class="recently-item-info inline-block no">')
          itemHtml.push(`<div class="recently-name">${item.userName}</div></div></div>`)
        }
        html.push(itemHtml.join(''))
      } else if (item.groupId !== undefined && item.groupId !== null && item.groupId !== '') {
        const itemHtml = []
        itemHtml.push('<div class="js-im-mass-message recently-item">')
        itemHtml.push('<span class="sfa sfa-avata-persons inline-block"></span>')
        itemHtml.push('<div class="recently-item-info inline-block no">')
        itemHtml.push('<div class="recently-name">群消息</div>')
        itemHtml.push('</div><span class="js-recently-message-close sfa sfa-icon-im-close recently-message-close"></span></div></div>')
        html.push(itemHtml.join(''))
      }
      // html.push(itemsHtml.join(''))
    })
    return {
      result: html.join(''),
      num: newMsgNum,
    }
  },
  // 将聊天记录通过日期重新排序，生成以日期为key的聊天记录，并重新排序
  getChatMessageByDate(dateList) {
    return _.chain(dateList).sortBy((dateItem) => {
      return dateItem.sendTime
    }).groupBy((item) => { return _(item.sendTime).toDate() }).value()
  },
  // 将重新排序的数据进行进行渲染
  getChatMessageByDateHtml(dateList) {
    const sortList = this.getChatMessageByDate(dateList)
    const result = []
    // result.push('<div class="js-private-chat-container">')
    if (dateList.length >= 30) {
      result.push('<div class="chat-more-content">载入更多信息</div>')
    }
    _.each(sortList, (items, key) => {
      const dateHtml = []
      if (dateList.length < 30) {
        dateHtml.push(`<div class="chat-day-time lessRecord">${key}</div>`)
      } else {
        dateHtml.push(`<div class="chat-day-time">${key}</div>`)
      }
      dateHtml.push('<div class="chat-content-container">')
      // const items = val
      _(items).each((item) => {
        const itemHtml = []
        const sendTime = _(item.sendTime).toTime('HH:mm')
        itemHtml.push('<div class="chat-item"> <div class="sfa sfa-avatar-online chat-item-avatar inline-block"></div> <div class="inline-block chat-item-detail">')
        itemHtml.push(`<div class="chat-item-name">${item.userName}</div><div class="chat-item-message">${item.content}</div>`)
        itemHtml.push(`</div><div class="inline-block chat-item-time pull-right">${sendTime}</div></div>`)
        dateHtml.push(itemHtml.join(''))
      })
      dateHtml.push('</div>')
      result.push(dateHtml.join(''))
    })
    // result.push('</div>')
    return result.join('')
  },
}
