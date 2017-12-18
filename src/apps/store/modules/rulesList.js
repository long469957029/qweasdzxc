import betting from '../../api/betting'
import * as types from '../mutation-types'

const initState = () => {
  return []
}

// getters
const getters = {
  playLevels: (state) => {
    const normalList = []
    const specialList = []
    state.forEach((rule) => {
      // if (ruleModel.get('playLevelName').indexOf('任选') === -1) {
      normalList.push({
        type: 'normal',
        id: rule.playLevelId,
        title: rule.playLevelName,
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

  playGroups: () => {
    return (levelId) => {
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
    }
  },

  playInfo: () => {
    return (groupId, playId) => {
      const groupInfo = _(this.currentLevel).findWhere({
        playGroupId: groupId,
      })


      const playInfo = _(groupInfo.ticketPlayInfo).findWhere({
        playId,
      })

      this.currentPlay = playInfo

      return this.currentPlay
    }
  },

  currentPlay() {
    return this.currentPlay
  },
}

// actions
const actions = {
  getTicketRules ({ commit }, ticketId) {
    commit(types.CHECKOUT_TICKET_RULES)
    betting.getTicketRules(
      ticketId,
      (res) => { return commit(types.GET_TICKET_RULES_SUCCESS, res) },
      () => { return commit(types.GET_TICKET_RULES_FAILURE) },
    )
  },
}

// mutations
const mutations = {
  [types.CHECKOUT_TICKET_RULES] (state) {
    // clear
    Object.assign(state, initState())
  },

  [types.GET_TICKET_RULES_SUCCESS] (state, res) {
    let data = []

    if (res && res.result === 0) {
      data = res.root && res.root.ticketPlayLevelInfo || []
      // this.limitMoney = res.root && res.root.limitMoney
    }
    Object.assign(state, data)
  },

  // 暂时没有处理失败的逻辑
  [types.GET_TICKET_RULES_FAILURE] (state) {
    state.checkoutStatus = 'failed'
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
