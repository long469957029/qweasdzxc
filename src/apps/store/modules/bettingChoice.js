import betting from '../../api/betting'
import * as types from '../mutation-types'

const initState = () => {
  return {
    levelId: -1,
    levelName: '',
    groupId: -1,
    groupName: '',
    multiple: 1,
    playId: -1,
    playName: '',
    betBonus: {},
    maxBonus: 195000,
    unit: 10000,
    formatUnit: '元',
    statistics: 0,
    userRebate: 0,
    previewList: [],
    buyList: [],
    totalInfo: {},
    buyInfo: {},
    usePack: 0,
    // ticketId:
  }
}

// getters
const getters = {
}

// actions
const actions = {
  getTicketInfo ({ commit }, ticketId) {
    commit(types.CHECKOUT_TICKET_INFO)
    betting.getTicketInfo(
      ticketId,
      (res) => { return commit(types.GET_TICKET_INFO_SUCCESS, res) },
      () => { return commit(types.GET_TICKET_INFO_FAILURE) },
    )
  },
}

// mutations
const mutations = {
  [types.SET_LEVEL] (state, { levelId, levelName }) {
    // 变更所选基本玩法
    state.levelId = levelId
    state.levelName = levelName
  },

  [types.SET_PLAY] (state, {
    groupId, groupName, playId, playName,
  }) {
    // 变更所选基本玩法
    state.groupId = groupId
    state.groupName = groupName
    state.playId = playId
    state.playName = playName
  },
  [types.SET_MULTIPLE] (state, num) {
    state.multiple = Number(num)
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
