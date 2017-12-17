import betting from '../../api/betting'
import * as types from '../mutation-types'

const initState = () => {
  return {
    // 最后的开奖期号
    lastOpenId: '',
    // 最后的开奖号码
    lastOpenNum: [],
    // 当前期期号
    planId: '',
    // 当前期剩余时间
    leftSecond: 0,
    // 当前期总共时间
    totalSecond: 0,
    // 下一期期号
    nextPlanId: '',
    // 下一期总共时间
    nextTotalSecond: 0,
    // openVideoUrl: [],
    // totalTime: 60000,
    // 是否处于销售状态
    sale: true,
    ticketId: '',
    init: true,
    // 加拿大3.5分彩特有参数，pending:true的话，是暂停销售
    pending: false,
  }
}

// getters
const getters = {
  getAll: (state) => { return state },
}

// actions
const actions = {
  getTicketInfo ({ commit }, ticketId) {
    commit(types.CHECKOUT_TICKET_INFO)
    betting.getTicketInfo(
      ticketId,
      () => { return commit(types.CHECKOUT_SUCCESS) },
      () => { return commit(types.CHECKOUT_FAILURE) },
    )
  },
}

// mutations
const mutations = {
  [types.CHECKOUT_TICKET_INFO] (state) {
    // clear
    Object.assign(state, initState())
  },

  [types.GET_TICKET_INFO_SUCCESS] (state) {
    state.checkoutStatus = 'successful'
  },

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
