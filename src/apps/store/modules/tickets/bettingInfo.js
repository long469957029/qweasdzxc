import betting from '../../../api/betting'

const initState = () => {
  return {
    // 最后的开奖期号
    lastOpenId: '-',
    // 最后的开奖号码
    lastOpenNum: [],
    lastOrgOpenNum: '',
    // 当前期期号
    planId: '------------',
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
    ticketId: 0,
    init: true,
    // 加拿大3.5分彩特有参数，pending:true的话，是暂停销售
    pending: false,
  }
}

// getters
const getters = {
}

// actions
const actions = {
  getTicketInfo ({ commit }, { ticketId, type }) {
    // commit(types.CHECKOUT_TICKET_INFO)
    return betting.getTicketInfo(
      {
        ticketId,
        type,
      },
      ({ data }) => { return commit(types.GET_TICKET_INFO_SUCCESS, data) },
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
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
