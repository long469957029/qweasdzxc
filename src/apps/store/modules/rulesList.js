import betting from '../../api/betting'
import * as types from '../mutation-types'

const initState = () => {
  return {
    playLevels: [],
    limitMoney: 0,
  }
}

// getters
const getters = {
  playLevels: (state) => {
    const normalList = []

    state.playLevels.forEach((rule) => {
      normalList.push({
        type: 'normal',
        id: rule.playLevelId,
        title: rule.playLevelName,
        selected: false,
      })
    })

    return normalList
  },

  playGroups: (state) => {
    return (levelId) => {
      const levelInfo = _(state.playLevels).findWhere({
        playLevelId: levelId,
      })
      const groups = levelInfo.ticketPlayGroupInfo || []

      state.currentLevel = groups

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

  playInfo: (state) => {
    return (playId, groupId) => {
      const groupInfo = _(state.currentLevel).findWhere({
        playGroupId: groupId,
      })


      const playInfo = _(groupInfo.ticketPlayInfo).findWhere({
        playId,
      })

      state.playInfo = playInfo

      return state.playInfo
    }
  },

  curPlayInfo: (state) => {
    return state.playInfo
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
      state.limitMoney = res.root && res.root.limitMoney
    }
    state.playLevels = data
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
