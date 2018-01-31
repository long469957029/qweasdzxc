import {getVouchersApi} from 'api/betting'

const initState = () => {
  return {
    list: [
      {
        "rid": 35,
        "ticketId": 1,
        "betAmount": 100000000,
        "bonus": 10000000,
        "validStartDate": 1517370920705,
        "validEndDate": 1517821199000
      },
      {
        "rid": 37,
        "ticketId": 1,
        "betAmount": 10000000,
        "bonus": 1000000,
        "validStartDate": 1517370920705,
        "validEndDate": 1517821189000
      },
      {
        "rid": 38,
        "ticketId": 1,
        "betAmount": 10000000,
        "bonus": 1000000,
        "validStartDate": 1517370920705,
        "validEndDate": 1517821117000
      }
    ]
  }
}

// getters
const getters = {
}

// actions
const actions = {

  [types.GET_VOUCHERS]({commit}, {
    ticketId,
  }) {
    getVouchersApi(
      { ticketId },
      ({ data }) => {
        return commit(types.GET_VOUCHERS_SUCCESS, {data})
      },
    )
  },
}

// this.on('change:multiple change:statistics change:userRebate change:betMethod', this.$_calculateByPrefab)
// mutations
const mutations = {
  [types.CHECKOUT_VOUCHERS] (state) {
    Object.assign(state, initState())
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
