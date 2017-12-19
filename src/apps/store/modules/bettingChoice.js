import betting from '../../api/betting'
import * as types from '../mutation-types'

const initState = () => {
  return {
    // groupId: 1,
    // groupName: '',
    // levelId: 1,
    // levelName: '',
    // multiple: 1,
    // playId: 1,
    // playName: '',
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
  [types.GO_TO_NEXT_PLAN] (state) {
    state.lastPlanId = state.planId
    state.planId = state.nextPlanId
    state.leftSecond = state.nextTotalSecond
    state.totalSecond = state.nextTotalSecond
  },

  [types.CHECKOUT_TICKET_INFO] (state) {
    // clear
    Object.assign(state, initState())
  },

  [types.GET_TICKET_INFO_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      const data = res.root || {}

      // 格式化开奖结果
      data.lastOpenNum = (data.lastOpenNum || '').split(',') || []

      Object.assign(state, data)
    }
  },

  // 暂时没有处理失败的逻辑
  [types.GET_TICKET_INFO_FAILURE] (state) {
    state.checkoutStatus = 'failed'
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
