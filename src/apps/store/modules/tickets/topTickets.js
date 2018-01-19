import betting from '../../../api/betting'

const initState = () => {
  return {
    [consts.TICKET_NORMAL_TYPE]: [],
    [consts.TICKET_HANDICAP_TYPE]: [],
    normalPromise: null,
    handicapPromise: null,
    type: 0,
  }
}

// getters
const getters = {
  fTickets: (state) => {
    return state[state.type]
  },
  topClassicalTicket: (state) => {
    return _.first(state[consts.TICKET_NORMAL_TYPE])
  },
  topHandicapTicket: (state) => {
    return _.first(state[consts.TICKET_HANDICAP_TYPE])
  }
}

// actions
const actions = {
  [types.GET_TOP_TICKETS] ({state, commit}, {
    type
  }) {
    return new Promise((resolve) => {
      if (!_.isEmpty(state[type])) {
        resolve()
        return
      }

      betting.getTopTickets(
        { type },
        ({ data }) => {
          resolve(data)
          return commit(types.GET_TOP_TICKETS_SUCCESS, {
            res: data,
            type
          })
        },
        () => { return commit(types.GET_TOP_TICKETS_FAILURE) },
      )
    })
  },

  [types.SET_TOP_CURRENT_TICKET] ({} , {
    ticketId,
    type,
  }) {
    return new Promise((resolve) => {
      betting.setTopCurrentTicket(
        { ticketId, type },
        ({ data }) => {
          resolve(data)
        },
      )
    })
  },
}

// mutations
const mutations = {
  [types.TOGGLE_TOP_TICKETS_BY_TYPE] (state, {type}) {
    state.type = type
  },

  [types.USER_LOGIN_SUCCESS] (state) {
    state.normalPromise = this.dispatch(types.GET_TOP_TICKETS, {
      type: consts.TICKET_NORMAL_TYPE
    })
    state.handicapPromise = this.dispatch(types.GET_TOP_TICKETS, {
      type: consts.TICKET_HANDICAP_TYPE
    })
  },
  // [types.CHECKOUT_TICKET_RULES] (state) {
  //   // clear
  //   Object.assign(state, initState())
  // },

  [types.GET_TOP_TICKETS_SUCCESS] (state, {res, type}) {
    let data = []

    if (res && res.result === 0) {
      data = res.root && res.root.ticketIds || []
    }

    state[type] = _.map(data, (id, index) => {
      const ticket = ticketConfig.getById(id)
      Vue.set(ticket, 'active', index === 0)
      return ticket
    })
  },

  [types.GET_TOP_TICKETS_FAILURE] (state) {
    state.checkoutStatus = 'failed'
  },

  [types.ACTIVE_TOP_TICKETS] (state, {currentId}) {
    state.handicapPromise.then(() => {
      this.commit(types.__ACTIVE_TOP_TICKETS, {currentId})
    })
  },
  [types.__ACTIVE_TOP_TICKETS] (state, {currentId}) {
    const curTicket = _.findWhere(state[state.type], {
      id: currentId
    })

    _.each(state[state.type], (ticket) => {
      ticket.active = ticket === curTicket
    })
  },

  [types.RESORT_TOP_TICKETS] (state, {currentId}) {
    state.normalPromise.then(() => {
      this.commit(types.__RESORT_TOP_TICKETS, {currentId})
    })
  },
  [types.__RESORT_TOP_TICKETS] (state, {currentId}) {
    const curTicket = _.findWhere(state[state.type], {
      id: currentId
    })
    if (curTicket) {
      state[state.type] = _.sortBy(state[state.type], (ticket) => {
        ticket.active = false
        return ticket !== curTicket
      })
      curTicket.active = true
    } else {
      _.each(state[state.type], (ticket) => {
        ticket.active = false
      })
      state[state.type].pop()
      state[state.type].unshift(Object.assign(ticketConfig.getById(currentId), {
        active: true
      }))
      // ticketConfig.getById(id)
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
