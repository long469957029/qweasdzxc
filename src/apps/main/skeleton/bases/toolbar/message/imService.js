/**
 * Created by steven on 2018/1/5.
 */
const avatarConf = require('userCenter/misc/avatarConfig')

module.exports = {
  // 获取左边联系人系统管理员样式
  getAdmin(active) {
    const html = []
    let status = ''
    if (active.type === 'admin' && active.id === 'admin') {
      status = 'active'
    }
    html.push(`<div class="js-contact-systemAdmin  person-item ${status}" data-name="系统管理员" data-id="admin" ><span class="sfa sfa-avata-admin"></span>` +
      '<span class="js-contact-online-status"></span><span class="js-contact-admin contact-name">系统管理员</span></div>')
    return html.join('')
  },
  // 获取左边联系人我的上级样式
  getSuperior(parentInfo, active) {
    const supersiorHtml = []
    let status = ''
    if (active.type === 'user' && active.id === parentInfo.userId) {
      status = 'active'
    }
    if (parentInfo.userId !== 0) {
      let onlineCircle = '<span class="text-circle contact-status"></span>'
      let offLineStatus = 'avatar-gray'
      if (parentInfo.online) {
        offLineStatus = ''
      } else {
        onlineCircle = ''
      }
      const avatarPic = avatarConf.get(_(parentInfo.headIconId).toString()).logo
      supersiorHtml.push(`<div class="js-contact-onePerson person-item ${status}" data-id="${parentInfo.userId}" data-name="我的上级">` +
        `<span class="sfa sfa-avatar-online ${offLineStatus} person-item-avatar"><img src='${avatarPic}'  /></span>${onlineCircle}<span class="contact-name" >我的上级</span></div>`)
    }
    return supersiorHtml.join('')
  },
  // 获取左边联系人，搜索界面联系人样式
  getItemsHtml(userList, parentId, active) {
    const userHtml = []
    _(userList).each((user) => {
      const item = []
      const name = user.userName
      if (name === '系统管理员') {
        let status = ''
        if (active.type === 'user' && active.id === 'admin') {
          status = 'active'
        }
        item.push(`<div class="js-contact-systemAdmin person-item ${status}" data-name="系统管理员"> data-id="admin"`)
      } else if (name === '我的上级') {
        let status = ''
        if (active.type === 'user' && active.id === parentId) {
          status = 'active'
        }
        let onlineCircle = '<span class="text-circle contact-status"></span>'
        let offLineStatus = 'avatar-gray'
        if (user.online) {
          offLineStatus = ''
        } else {
          onlineCircle = ''
        }
        const avatarPic = avatarConf.get(_(user.headIconId).toString()).logo
        item.push(`<div class="js-contact-onePerson person-item ${status}" data-id="${user.userId}" data-name="我的上级">` +
          `<span class="sfa sfa-avatar-online ${offLineStatus} person-item-avatar"><img src='${avatarPic}'  /></span>${onlineCircle}<span class="contact-name" >我的上级</span></div>`)
      } else {
        let status = ''
        if (active.type === 'user' && active.id === user.userId) {
          status = 'active'
        }
        item.push(`<div class="js-contact-onePerson person-item ${status}" data-id="${user.userId}" data-name="${name}">`)
      }
      let onlineCircle = '<span class="text-circle contact-status"></span>'
      let offLineStatus = 'avatar-gray'
      if (user.online) {
        offLineStatus = ''
      } else {
        onlineCircle = ''
      }
      const avatarPic = avatarConf.get(_(user.headIconId).toString()).logo
      item.push(`<span class="sfa sfa-avatar-online ${offLineStatus} person-item-avatar"><img src='${avatarPic}'  /></span>${onlineCircle}`)
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
  getRecentlyItemHtml(records, parents, active) {
    const html = []
    let newMsgNum = 0
    _(records).each((item) => {
      newMsgNum += item.newMsgNum
      if (item.userId !== undefined && item.userId !== null && item.userId !== '') {
        const itemHtml = []
        if (item.userId === parents) {
          let status = ''
          if (active.type === 'user' && active.id === parents) {
            status = 'active'
          }
          let onlineCircle = '<span class="text-circle contact-status"></span>'
          let offLineStatus = 'avatar-gray'
          if (item.online) {
            offLineStatus = ''
          } else {
            onlineCircle = ''
          }
          let cancel = `<span class="js-recently-message-close sfa sfa-icon-im-contact-close recently-message-close parents" data-type="user" data-id="${item.userId}"></span>`
          const avatarPic = avatarConf.get(_(item.headIconId).toString()).logo
          itemHtml.push(`<div class="js-contact-onePerson recently-item ${status}" data-id="${item.userId}" data-name="我的上级">` +
            `<span class="sfa sfa-avatar-online ${offLineStatus} person-item-avatar"><img src='${avatarPic}'  /></span>${onlineCircle}<span class="contact-name" >我的上级</span>${cancel}</div>`)
        } else {
          let status = ''
          if (active.type === 'user' && active.id === item.userId) {
            status = 'active'
          }
          itemHtml.push(`<div class="js-contact-onePerson recently-item ${status}" data-id="${item.userId}" data-name="${item.userName}" >`)

          let onlineCircle = '<span class="text-circle contact-status"></span>'
          let offLineStatus = 'avatar-gray'
          if (item.online) {
            offLineStatus = ''
          } else {
            onlineCircle = ''
          }
          const avatarPic = avatarConf.get(_(item.headIconId).toString()).logo
          itemHtml.push(`<span class="sfa sfa-avatar-online ${offLineStatus} person-item-avatar"><img src='${avatarPic}'  /></span>${onlineCircle}`)

          let cancel = `<span class="js-recently-message-close sfa sfa-icon-im-contact-close recently-message-close" data-type="user" data-id="${item.userId}"></span>`
          if (item.newMsgNum > 0) {
            cancel = ''
            itemHtml.push('<div class="recently-item-info inline-block">')
            itemHtml.push(`<div class="recently-name">${item.userName}</div>`)
            itemHtml.push(`<div class="recently-desc">${item.lastMessage}</div>`)
            itemHtml.push(`</div><div class=" recently-item-info-num"><div class="recently-newMessage-num-text inline-block">${item.newMsgNum}</div></div>${cancel}</div>`)
          } else {
            itemHtml.push('<div class="recently-item-info inline-block no">')
            itemHtml.push(`<div class="recently-name">${item.userName}</div></div>${cancel}</div>`)
          }
        }
        html.push(itemHtml.join(''))
      } else if (item.groupId !== undefined && item.groupId !== null && item.groupId !== '') {
        const itemHtml = []
        let status = ''
        if (active.type === 'group' && active.id === item.groupId) {
          status = 'active'
        }
        itemHtml.push(`<div class="js-recently-mass-message recently-item ${status}" data-id='${item.groupId}'>`)
        itemHtml.push('<span class="sfa sfa-avata-persons inline-block"></span>')
        itemHtml.push('<div class="recently-item-info inline-block no">')
        itemHtml.push('<div class="recently-name">群消息</div>')
        itemHtml.push(`</div><span class="js-recently-message-close sfa sfa-icon-im-contact-close recently-message-close" data-type="group" data-id="${item.groupId}"></span></div></div>`)
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
  getChatMessageByDate(dateList, type) {
    if (type && type === 'mess') {
      return _.chain(dateList).sortBy((dateItem) => {
        return dateItem.createTime
      }).groupBy((item) => {
        return _(item.createTime).toDate()
      }).value()
    } else {
      return _.chain(dateList).sortBy((dateItem) => {
        return dateItem.sendTime
      }).groupBy((item) => {
        return _(item.sendTime).toDate()
      }).value()
    }
  },
  // 将重新排序的数据进行进行渲染
  getChatMessageByDateHtml(dateList, type, length, pageIndex, rowCount) {
    const sortList = this.getChatMessageByDate(dateList, type)
    const result = []
    // result.push('<div class="js-private-chat-container">')
    let moreChatTitle = ''
    const moreChatIndex = (pageIndex * 30) + length
    if (moreChatIndex <= rowCount && length === 30) {
      moreChatTitle = '<div class="chat-more-content-text">载入更多信息</div>'
    }
    let moreChatType = 'js-chat-more-content'
    if (type === 'mess') {
      moreChatType = 'js-mess-more-content'
    } else if (type === 'admin') {
      moreChatType = 'js-admin-more-content'
    }
    result.push(`<div class="${moreChatType} chat-more-content">${moreChatTitle}</div>`)
    // let dateIndex = 0
    _.each(sortList, (items, key, index) => {
      const dateHtml = []
      let dateStatus = ''
      if (index === 0 && length < 30) {
        dateStatus = 'lessRecord'
      }
      const date = _(key).toDate('YYYY年M月D日')
      dateHtml.push(`<div class="chat-day-time ${dateStatus}">${date}</div>`)
      // dateHtml.push('<div class="chat-content-container">')
      // const items = val
      _(items).each((item) => {
        const itemHtml = []
        let sendTime = ''
        if (type && type === 'mess') {
          sendTime = _(item.createTime).formatAMPM()
        } else {
          sendTime = _(item.sendTime).formatAMPM()
        }
        let userName = item.userName
        let userAvatar = item.headIconId
        let avatarPic = ''
        if (item.userName === 'admin') {
          userName = '系统管理员'
          userAvatar = 'sfa-avata-admin'
        } else {
          avatarPic = avatarConf.get(_(userAvatar).toString()).logo
        }
        itemHtml.push(`<div class="chat-item" data-id='${item.rid}'> <div class="sfa ${userAvatar} chat-item-avatar inline-block"><img src='${avatarPic}'  /></div> `)
        itemHtml.push(`<div class="inline-block chat-item-detail"><div class="chat-item-name">${userName}</div><div class="chat-item-message">${item.content}</div>`)
        itemHtml.push(`</div><div class="inline-block chat-item-time pull-right">${sendTime}</div></div>`)
        dateHtml.push(itemHtml.join(''))
        // dateIndex += 1
      })
      // dateHtml.push('</div>')
      result.push(dateHtml.join(''))
    })
    // result.push('</div>')
    return result.join('')
  },
  insertChat(userPic, userName, content) {
    const html = []
    const sendTime = _(new Date()).formatAMPM()
    // html.push('<div class="chat-content-container">')
    html.push('<div class="chat-item"> <div class="sfa chat-item-avatar inline-block"></div> <div class="inline-block chat-item-detail">')
    html.push(`<div class="chat-item-name">${userName}</div><div class="chat-item-message">${content}</div>`)
    html.push(`</div><div class="inline-block chat-item-time pull-right">${sendTime}</div>`)
    return html.join('')
  },
  getMessContact(userlist, selectedList) {
    const html = []
    // 不显示系统管理员与我的上级
    const admin = _(userlist).findWhere({
      userId: null,
      userName: '系统管理员',
    })
    const sendList = _(userlist).without(admin)
    const superior = _(sendList).findWhere({
      userName: '我的上级',
    })
    // if (superior !== null && superior !== undefined) {
    //   html.push(`<div class="js-mess-select-contact select-superior" data-id='${superior.userId}' data-name="我的上级">我的上级</div>`)
    // }
    const subList = _(sendList).without(superior)
    if (subList.length > 0) {
      // html.push('<div class="select-sub"><span class="select-sub-img"><i class="fa fa-caret-right" aria-hidden="true"></i></span><span class="select-sub-text">我的下级</span></div>')
      html.push('<div class="select-sub-container"><div class="js-select-sub-items select-sub-items">')
      _(subList).each((item) => {
        let onlineCircle = '<span class="text-circle contact-status"></span>'
        let offLineStatus = 'avatar-gray'
        if (item.online) {
          offLineStatus = ''
        } else {
          onlineCircle = ''
        }
        const avatarPic = avatarConf.get(_(item.headIconId).toString()).logo
        let select = ''
        let selected = 'hidden'
        let userSelect = ''
        if (selectedList !== undefined) {
          const selectUser = _(selectedList).findWhere({
            userId: item.userId,
          })
          if (selectUser !== undefined && selectUser !== '') {
            select = 'hidden'
            selected = ''
            userSelect = 'selected'
          } else {
            select = ''
            selected = 'hidden'
          }
        }
        let action = 'js-select-sub-item '
        if (selectedList === 'edit') {
          select = 'hidden'
          selected = 'hidden'
          action = ''
        }
        html.push(`<div class="${action} select-sub-item" data-id='${item.userId}' data-name='${item.userName}' data-type="${userSelect}">` +
          `<span class="sfa sfa-avatar-online ${offLineStatus} person-item-avatar">` +
          `<img src='${avatarPic}'  /></span>${onlineCircle}<span class="contact-name">${item.userName}</span><label class="js-mess-select-contact sub-item-checkbox-panel ${select}"></label>` +
          `<label class="js-mess-selected-contact sub-item-checkbox inline-block ${selected}"><checkbox></checkbox></label>` +
          // '<i class="fa fa-check pull-right select-sub-item-isSelect" aria-hidden="true"></i>' +
          '</div>')
      })
      html.push('</div></div>')
    }
    return html.join('')
  },
  // getMessSelectedHtml(userlist, groupId) {
  //   const html = []
  //   const admin = _(userlist).findWhere({
  //     userId: null,
  //     userName: '系统管理员',
  //   })
  //   const sendList = _(userlist).without(admin)
  //   let cancel = ''
  //   if (groupId === undefined) {
  //     cancel = '<i class="js-selected-sub-item-cancel fa fa-times pull-right selected-sub-item-cancel" aria-hidden="true"></i>'
  //   }
  //   _(sendList).each((sub) => {
  //     html.push(`<div class="js-selected-sub-item selected-sub-item" data-id='${sub.userId}'>${sub.userName}${cancel}</div>`)
  //   })
  //   return html.join('')
  // },
  getSelectMessContact(userlist, selectedList) {
    const html = []
    const admin = _(userlist).findWhere({
      userId: null,
      userName: '系统管理员',
    })
    const sendList = _(userlist).without(admin)
    const superior = _(sendList).findWhere({
      userName: '我的上级',
    })

    if (superior !== null && superior !== undefined) {
      let active = ''
      _(selectedList).each((selected) => {
        if (superior.userId === selected.userId) {
          active = 'active'
        }
      })
      html.push(`<div class="js-mess-select-contact select-superior ${active}" data-id='${superior.userId}' data-name="我的上级">我的上级</div>`)
    }
    const subList = _(sendList).without(superior)
    if (subList.length > 0) {
      html.push('<div class="select-sub"><span class="select-sub-img"><i class="fa fa-caret-right" aria-hidden="true"></i></span><span class="select-sub-text">我的下级</span></div>')
      html.push('<div class="select-sub-container"><div class="select-sub-items">')
      _(subList).each((item) => {
        let active = ''
        _(selectedList).each((selected) => {
          if (item.userId === selected.userId) {
            active = 'active'
          }
        })
        html.push(`<div class="js-mess-select-contact select-sub-item ${active}" data-id='${item.userId}' data-name='${item.userName}'>${item.userName}` +
          '<i class="fa fa-check pull-right select-sub-item-isSelect" aria-hidden="true"></i></div>')
      })
      html.push('</div></div>')
    }
    return html.join('')
  },
  // 刷新近期记录中已读的记录状态
  refreshActiveRecentlyStatus(recentlyList, active) {
    const resultData = []
    let numData = 0
    if (active.type === 'user') {
      _(recentlyList).each((item) => {
        if (active.id === item.userId) {
          numData = item.newMsgNum
          item.newMsgNum = 0
        }
        resultData.push(item)
      })
    } else if (active.type === 'group') {
      _(recentlyList).each((item) => {
        if (active.id === item.groupId) {
          numData = item.newMsgNum
          item.newMsgNum = 0
        }
        resultData.push(item)
      })
    }
    return {
      result: resultData,
      num: numData,
    }
  },
  delRecentlyFromList(recentlyList, active) {
    let result = []
    let delItem = []
    if (active.type === 'user') {
      delItem = _(recentlyList).findWhere({
        userId: active.id,
      })
      result = _(recentlyList).without(delItem)
    } else if (active.type === 'group') {
      delItem = _(recentlyList).findWhere({
        groupId: active.id,
      })
      result = _(recentlyList).without(delItem)
    }
    return result
  },
  insertChatList(realList, cacheList) {
    let result = []
    // const typeList = []
    // 判断cache中的数据是不是有用户但后台还未保存输入的数据
    let cacheIsUserType = false
    _(cacheList).each((cache) => {
      if (!Number.isInteger(cache.rid)) {
        cacheIsUserType = true
        return false
      }
    })
    if (cacheIsUserType) {
      result = realList
      // _(cacheList).each((cache) => {
      //   if (!Number.isInteger(cache.rid)) {
      //     // typeList.push(cache)
      //     result.unshift(cache)
      //   }
      // })
      // _(cacheList).each((cache) => {
      //   result.unshift(cache)
      // })
    } else {
      result = result.concat(cacheList)
      _(realList).each((item) => {
        let has = false
        _(cacheList).each((cache) => {
          if (item.rid === cache.rid) {
            has = true
          }
        })
        if (!has) {
          result.push(item)
        }
      })
    }
    return result
  },
  getChatLastRecordId(recordList) {
    let id = ''
    _(recordList).each((item, index) => {
      if (index === recordList.length - 1) {
        id = item.rid
      }
    })
    return id
  },
}
