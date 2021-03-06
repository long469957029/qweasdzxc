import {setTopCurrentTicketApi, getTopTicketsApi} from 'api/betting'

const initState = () => {
  return {
    [consts.TICKET_NORMAL_TYPE]: [ticketConfig.getById(10)],
    [consts.TICKET_HANDICAP_TYPE]: [{...ticketConfig.getById(1), ...{active: true}}],
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
    Global.m.publish('ticketId:updating', _.first(state[consts.TICKET_NORMAL_TYPE]))
    return _.first(state[consts.TICKET_NORMAL_TYPE])
  },
  topHandicapTicket: (state) => {
    return _.findWhere(state[consts.TICKET_HANDICAP_TYPE], {
      active: true
    })
  }
}

// actions
const actions = {
  [types.GET_TOP_TICKETS] ({state, commit}, {
    type
  }) {
    return new Promise((resolve) => {
      if (state[type].length > 1) {
        resolve()
        return
      }

      getTopTicketsApi(
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
    return setTopCurrentTicketApi(
      {
        ticketId,
        type
      },
    )
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

    state[type] = _.chain(data).map((id) => {
      const ticket = _.cloneDeep(ticketConfig.getById(id, type))
      if (ticket) {
        ticket.active = false
      }
      return ticket
    }).compact().value()

    //盘口暂时一直保持此顺序

    if (type === consts.TICKET_HANDICAP_TYPE) {
      state[type] = _.sortBy(state[type], (ticketInfo, index) => {
        if (index === 0) {
          ticketInfo.active = true
        }
        return ticketInfo.id
      })

    }
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
