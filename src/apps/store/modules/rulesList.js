import betting from '../../api/betting'
import * as types from '../mutation-types'

const initState = () => {
  return []
}

// getters
const getters = {
  getAll: (state) => { return state },
}

// actions
const actions = {
  getTicketInfo ({ commit }, ticketId) {
    commit(types.CHECKOUT_TICKET_RULES)
    betting.getTicketInfo(
      ticketId,
      (res) => { return commit(types.GET_TICKET_INFO_SUCCESS, res) },
      () => { return commit(types.GET_TICKET_INFO_FAILURE) },
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
