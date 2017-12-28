import betting from '../../api/betting'


const initState = () => {
  return {
    plans: [],
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
    }
  },
  [types.GET_CHASE_PLANS_FAILURE] ({ commit }, res) {
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
