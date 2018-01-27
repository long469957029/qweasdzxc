import {getColdHotApi, getCurrentMissApi} from 'api/betting'

const initState = () => {
  return {
    coldHot: [],
    currentMiss: [],
  }
}

// getters
const getters = {
}

// 时时彩
//
// 五星:20001
// 四星:20002
// 前三星:20003
// 中三星:20004
// 后三星:20005
// 前二星:20006
// 后二星:20007
//
// 11选5
//
// 五星:20013
// 前三星:20014
// 前二星:20015
//
// 3D
//
// 3D_三星 20016
// 3D_前二星 20017
// 3D_后二星 20018

// const getPlaySeriesId = (ticketId) => {
//   let playSeriesId
//     //ssc
//   if (_.indexOf([1, 19, 27, 25, 13, 32, 19, 10, 1, 21], ticketId) !== -1) {
//     playSeriesId = 20001
//     //115
//   } else if (_.indexOf([14, 5, 4, 11], ticketId) !== -1) {
//     playSeriesId = 20013
//     //3d
//   } else if (_.indexOf([6, 16], ticketId) !== -1) {
//     playSeriesId = 20016
//     //pk10
//   } else if (_.indexOf([18], ticketId) !== -1) {
//     playSeriesId = 20019
//   }
//
//   return playSeriesId
// }

// actions
const actions = {
  [types.GET_COLD_HOT] ({ commit }, { ticketId, playSeriesId, type = 'normal' }) {
    getColdHotApi(
      {
        ticketId,
        playSeriesId,
        type
      },
      (data) => { return commit(types.GET_COLD_HOT_SUCCESS, data) },
    )
  },

  [types.GET_CURRENT_MISS] ({ commit }, { ticketId, playSeriesId, type = 'normal' }) {
    getCurrentMissApi(
      {
        ticketId,
        playSeriesId,
        type
      },
      (data) => { return commit(types.GET_CURRENT_MISS_SUCCESS, data) }
    )
  },
}

const formatNum = (list) => {
  return _.chain(list).map((row) => {
    const max = _.max(row)
    const min = _.min(row)

    return _.map(row, (num) => {
      const item = {
        num,
        style: '',
      }
      if (num === max) {
        item.style = 'max'
      }
      if (num === min) {
        item.style = 'min'
      }

      return item
    })
  }).value()
}

// mutations
const mutations = {
  [types.GET_COLD_HOT_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      state.coldHot = formatNum(res.root || [])
    }
  },

  [types.GET_CURRENT_MISS_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      state.currentMiss = formatNum(res.root || [])
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
