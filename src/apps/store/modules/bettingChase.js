import betting from '../../api/betting'


const initState = () => {
  return {
    plans: [],
    init: false
  }
}

// getters
const getters = {
}

// actions
const actions = {
  [types.GET_CHASE_PLANS] ({ commit }, {
    ticketId,
  }) {
    return new Promise((resolve) => {
      betting.getPlans(
        { ticketId },
        ({ data }) => {
          resolve(data)
          return commit(types.GET_CHASE_PLANS_SUCCESS, data)
        },
        () => { return commit(types.GET_CHASE_PLANS_FAILURE) },
      )
    })
  },
}

// this.on('change:multiple change:statistics change:userRebate change:betMethod', this.$_calculateByPrefab)
// mutations
const mutations = {
  [types.GET_CHASE_PLANS_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      state.plans = _(res.root).map((planInfo) => {
        return _(planInfo).extend({
          formatTicketStarttime: _(planInfo.ticketStarttime).toTime(),
          formatTicketEndtime: _(planInfo.ticketEndtime).toTime(),
          ticketOpentime: _(planInfo.ticketOpentime).toTime(),
        })
      })

      state.init = true
    }
  },
  [types.GET_CHASE_PLANS_FAILURE] ({ commit }, res) {
  },
  [types.KICK_CHASE_PLANS] (state) {
    state.plans.splice(0, 1)
  },
  [types.EMPTY_CHASE_PLANS] (state) {
    Object.assign(state, initState())
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
