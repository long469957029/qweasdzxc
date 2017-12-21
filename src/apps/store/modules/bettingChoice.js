import * as types from '../mutation-types'

const initState = () => {
  return {
    levelId: -1,
    levelName: '',
    groupId: -1,
    groupName: '',
    multiple: 1,
    playId: -1,
    playName: '',
    betBonus: 0,
    fBetBonus: 0,
    betMethod: 0,
    maxBonus: 195000,
    unit: 10000,
    formatUnit: '元',
    statistics: 0,
    userRebate: 0,
    previewList: [],
    buyList: [],
    totalInfo: {},
    buyInfo: {},
    usePack: 0,
    prefabMoney: 0,
    rebateMoney: 0,
    fPrefabMoney: 0,
    fRebateMoney: 0,
    // ticketId:
  }
}

// getters
const getters = {
}

// actions
const actions = {
}

// this.on('change:multiple change:statistics change:userRebate change:betMethod', this.$_calculateByPrefab)
// mutations
const mutations = {
  [types.SET_LEVEL] (state, { levelId, levelName }) {
    // 变更所选基本玩法
    state.levelId = levelId
    state.levelName = levelName
  },

  [types.SET_PLAY] (state, {
    groupId, groupName, playId, playName,
  }) {
    // 变更所选基本玩法
    state.groupId = groupId
    state.groupName = groupName
    state.playId = playId
    state.playName = playName
  },
  [types.SET_MULTIPLE] (state, num) {
    state.multiple = Number(num)
    $_calculateByPrefab(state)
  },
  [types.SET_UNIT] (state, unit) {
    state.unit = Number(unit)
    let formatUnit = ''
    switch (state.unit) {
      case 10000:
        formatUnit = '元'
        break
      case 1000:
        formatUnit = '角'
        break
      case 100:
        formatUnit = '分'
        break
      case 10:
        formatUnit = '厘'
        break
      default:
        break
    }
    state.formatUnit = formatUnit

    $_calculateByPrefab(state)
  },
  [types.SET_STATISTICS] (state, statistics) {
    state.statistics = Number(statistics)
    $_calculateByPrefab(state)
  },
  [types.SET_PLAY_INFO] (state, playInfo) {
    state.playInfo = playInfo
    let betBonus = 0

    if (playInfo.betBonus == null) {
      betBonus = playInfo.betMethodMax
    }

    state.betBonus = betBonus

    state.fBetBonus = _(betBonus).chain().div(10000).mul(state.unit)
      .convert2yuan()
      .value()
  },
  // indexs 被选中号码的索引
  [types.UPDATE_BONUS] (state, indexs) {
    let betBonus = 0
    const playInfo = state.playInfo

    if (playInfo.betBonus == null) {
      betBonus = playInfo.betMethodMax
    } else if (!_.isEmpty(indexs)) {
      const selectBonus = _(state.playInfo.betBonus).chain().sortBy((info) => {
        return info.betType
      }).filter((item, index) => {
        return _(indexs).contains(index)
      })
        .value()

      betBonus = _(selectBonus).max((item) => {
        return item.betMethodMax
      })

      betBonus = betBonus.betMethodMax
    }

    state.betBonus = betBonus

    state.fBetBonus = _(betBonus).chain().div(10000).mul(state.unit)
      .convert2yuan()
      .value()
  },

  // 清空选择
  [types.SET_CHECKOUT_CHOICE](state) {
    state.prefabMoney = 0
    state.rebateMoney = 0
    state.fPrefabMoney = 0
    state.fRebateMoney = 0
    state.statistics = 0
  },
  [types.SET_CHOICE_EMPTY](state) {
    debugger
  },

  [types.ADD_PREV_BET](state, bettingInfo, options) {
    if (state.statistics) {
      if (!_.isNull(state.maxBetNums) && state.statistics > state.maxBetNums) {
        this.$_addBets([bettingInfo], _(options || {}).extend({statistics: state.statistics}, { buy: true }))
        return { MaxBetNums: this.get('maxBetNums') }
      }
      this.emptyBuyBetting()
      return this.$_addBets([bettingInfo], _(options || {}).extend({statistics: state.statistics}))
    }
    return false
  },


  [types.EMPTY_PREV_BETTING](state) {
    state.previewList = []
  },

  $_addBets(bettingList, options) {
    const items = []
    const sameBets = []

    options = _(options || {}).defaults({
    })

    _(bettingList).each(function(bettingInfo) {
      let sameBet
      let statistics

      if (bettingInfo.statistics) {
        statistics = bettingInfo.statistics
      } else {
        statistics = options.statistics
      }

      let item = {
        levelName: state.levelName,
        playId: state.playId,
        playName: state.playName,
        bettingNumber: this.formatBettingNumber(bettingInfo.lotteryList, {
          selectOptionals: bettingInfo.selectOptionals,
          formatToNum: bettingInfo.formatToNum,
          playId: state.playId,
          ticketId: state.ticketId,
          formatToNumInfo: bettingInfo.formatToNumInfo || false,
        }),
        // 显示用
        formatBettingNumber: this.formatBettingNumber(bettingInfo.lotteryList, {
          type: 'display',
          format: bettingInfo.format,
        }),
        type: bettingInfo.type,
        formatBonusMode: state.formatBonusMode,
        multiple: state.multiple,
        unit: state.unit,
        statistics,
        formatUnit: state.formatUnit,
        betMethod: state.betMethod,
        userRebate: state.userRebate,
        rebateMoney: state.rebateMoney,
        maxMultiple: state.formatMaxMultiple,
        maxBonus: state.maxBonus,
        formatMaxBonus: state.formatMaxBonus,
      }

      // 判断是否有相同的投注,几个方面比较playId,unit,betMethod,bettingNumber
      if (!options.buy) {
        sameBet = _(state.previewList).findWhere({
          playId: item.playId,
          unit: item.unit,
          betMethod: item.betMethod,
          bettingNumber: item.bettingNumber,
        })

        if (sameBet) {
          sameBet.multiple = _(sameBet.multiple).add(item.multiple)
          // if (sameBet.multiple > sameBet.maxMultiple) {
          //  sameBet.multiple = sameBet.maxMultiple;
          // }
          item = sameBet
        }
      }

      // 计算prefabMoney 和 rebateMoney

      item.prefabMoney = _(2).chain()
        .mul(item.multiple).mul(item.statistics)
        .mul(item.unit)
        .value()

      if (sameBet) {
        sameBets.push(item)
      } else {
        items.splice(0, 0, item)
      }
    }, this)

    if (!options.buy) {
      state.previewList = items.concat(state.previewList)
    } else {
      state.buyList = items.concat(state.buyList)
    }

    return sameBets
  },
}


const $_calculateByPrefab = (state) => {
  let prefabMoney = 0
  const rebateMoney = 0

  if (state.statistics && state.multiple) {
    prefabMoney = _(state.statistics).chain().mul(state.multiple).mul(2)
      .mul(state.unit)
      .value()

    state.prefabMoney = prefabMoney
    state.rebateMoney = state.betMethod === 1 ? _(prefabMoney).chain().mul(state.userRebate).div(1000)
      .value() : 0
  }

  state.prefabMoney = prefabMoney
  state.rebateMoney = rebateMoney
  state.fPrefabMoney = _(prefabMoney).convert2yuan()
  state.fRebateMoney = rebateMoney.convert2yuan
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
