import {getHandicapSpNumApi} from 'api/betting'

const initState = () => {
  return {
    spNumList: [],
    mouse: 0,
    cow: 1,
    tiger: 2,
    rabbit: 3,
    dragon: 4,
    snack: 5,
    horse: 6,
    sheep: 7,
    monkey: 8,
    chicken: 9,
    dog: 10,
    pig: 11,
  }
}

// getters
const getters = {
  /**
   * 通过生肖英文名查找
   * @param state
   * @returns {function(*)}
   */
  numBySx: (state) => (sxName) => {
    return state.spNumList.find(sx => sx.id === state[sxName])
  },
  // zhNameByName: (state) => (name) => {
  //   return _.chain(state.spNumList).find((sx) => {
  //     sx.name === name
  //   })
  // },
  sxNameByNum: (state) => (num) => {
    return state.spNumList.find(sx => {
      if (_.contains(sx.nums, num)) {
        return true
      }
    }).name
  }

}

// actions
const actions = {

  [types.GET_MARK6_SX]({commit}, {
    ticketId = 34,
  } = {ticketId: 34}) {
    getHandicapSpNumApi(
      {ticketId},
      ({data}) => {
        commit(types.GET_MARK6_SX_SUCCESS, {data})
        return data
      },
    )
  },
}

// mutations
const mutations = {
  [types.GET_MARK6_SX_SUCCESS](state, {data}) {
    if (data && data.result === 0) {
      state.spNumList = data.root.spNums || []
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
