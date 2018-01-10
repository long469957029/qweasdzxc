import betting from '../../../api/betting'

const initState = () => {
  return {
    ticketIds: []
  }
}

// getters
const getters = {
  fTickets: (state) => {
    return state.ticketIds.map(id => {
      return ticketConfig.getById(id)
    })
  }
}

// actions
const actions = {
  [types.GET_TOP_TICKETS] ({ commit }) {
    return new Promise((resolve) => {
      betting.getTopTickets(
        ({ data }) => {
          resolve(data)
          return commit(types.GET_TOP_TICKETS_SUCCESS, data)
        },
        () => { return commit(types.GET_TOP_TICKETS_FAILURE) },
      )
    })
  },

  [types.SET_TOP_CURRENT_TICKET] ({ commit }, {
    ticketId
  }) {
    return new Promise((resolve) => {
      betting.setTopCurrentTicket(
        { ticketId },
        ({ data }) => {
          resolve(data)
          return commit(types.SET_TOP_CURRENT_TICKET_SUCCESS, data)
        },
      )
    })
  },
}

// mutations
const mutations = {
  [types.CHECKOUT_TICKET_RULES] (state) {
    // clear
    Object.assign(state, initState())
  },

  [types.GET_TOP_TICKETS_SUCCESS] (state, res) {
    let data = []

    if (res && res.result === 0) {
      data = res.root && res.root.ticketIds || []
    }
    state.ticketIds = data
  },

  [types.SET_TOP_CURRENT_TICKET_SUCCESS] (state, res) {
    let data = []

    if (res && res.result === 0) {
      data = res.root && res.root.ticketIds || []
    }
    state.ticketIds = data
  },

  [types.GET_TOP_TICKETS_FAILURE] (state) {
    state.checkoutStatus = 'failed'
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
