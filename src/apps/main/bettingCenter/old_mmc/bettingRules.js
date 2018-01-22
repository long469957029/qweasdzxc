const Collection = require('skeleton/collection')

const BettingRulesCollection = Collection.extend({

  url: '/ticket/ticketmod/ticketplaylist.json',

  parse(res) {
    let data

    if (res && res.result === 0) {
      data = res.root && res.root.ticketPlayLevelInfo || []
      this.limitMoney = res.root && res.root.limitMoney
    }

    return data
  },

  // common APIs

  setTicketInfo(ticketInfo) {
    this.ticketInfo = ticketInfo
  },


  getPlayLevels() {
    const normalList = []
    const specialList = []
    this.each((ruleModel) => {
      // if (ruleModel.get('playLevelName').indexOf('任选') === -1) {
      normalList.push({
        type: 'normal',
        id: ruleModel.get('playLevelId'),
        title: ruleModel.get('playLevelName'),
      })
      // } else {
      //  specialList.push({
      //    id: ruleModel.get('playLevelId'),
      //    title: ruleModel.get('playLevelName')
      //  });
      // }
    })

    if (specialList.length) {
      normalList.push({
        type: 'special',
        title: '任选',
      })
    }

    return {
      normalList,
      specialList,
    }
  },

  getPlayGroups(levelId) {
    const levelInfoModel = this.findWhere({
      playLevelId: levelId,
    })
    const groups = levelInfoModel && levelInfoModel.get('ticketPlayGroupInfo') || []

    this.currentLevel = groups

    return _(groups).map((group) => {
      return {
        id: group.playGroupId,
        title: group.playGroupName,
        playList: _(group.ticketPlayInfo).map((play) => {
          return {
            id: play.playId,
            title: play.playName,
          }
        }),
      }
    })
  },

  getPlayInfo(groupId, playId) {
    const groupInfo = _(this.currentLevel).findWhere({
      playGroupId: groupId,
    })


    const playInfo = _(groupInfo.ticketPlayInfo).findWhere({
      playId,
    })

    // this.currentGroup = groupInfo
    this.currentPlay = playInfo

    return this.currentPlay
  },

  getCurrentPlay() {
    return this.currentPlay
  },

})

module.exports = BettingRulesCollection
