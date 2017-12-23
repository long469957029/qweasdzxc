import ticketConfig from 'skeleton/misc/ticketConfig'
import betting from '../../api/betting'

const mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()

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
    maxMultiple: 100,
    formatMaxMultiple: 100,
    limitMoney: 0,
  }
}

// getters
const getters = {
}

// actions
const actions = {
  pushBetting ({ state, commit }, planId) {
    const bet = _(state.buyList).reduce((list, item) => {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        // 0 高奖金 1 有返点
        betMethod: item.betMethod,
      })

      return list
    }, [])

    return new Promise((resolve) => {
      betting.pushBetting(
        { planId, bet, usePack: state.usePack },
        ({ data }) => {
          resolve(data)
          return commit(types.PUSH_BETTING_SUCCESS, data)
        },
        () => { return commit(types.PUSH_BETTING_FAILURE) },
      )
    })
  },
}

// this.on('change:multiple change:statistics change:userRebate change:betMethod', this.$_calculateByPrefab)
// mutations
const mutations = {
  [types.PUSH_BETTING_SUCCESS] ({ commit }, res) {
    if (res && res.result === 0) {
      commit(types.EMPTY_BUY_BETTING)
    }
  },
  [types.PUSH_BETTING_FAILURE] ({ commit }, res) {
  },

  [types.SET_LIMIT_MONEY] (state, { limitMoney }) {
    state.limitMoney = limitMoney
  },

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

    Object.assign(state, $_setUnit(unit, state))

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

    state.maxMultiple = playInfo.betMultiLimitMax
    state.formatMaxMultiple = _(state.maxMultiple).chain().mul(10000).div(state.unit)
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

  [types.SET_PREVIEW_MULTIPLE](state, { num, index }) {
    const previewItem = state.previewList[index]
    previewItem.multiple = Number(num)
    $_calculateByPrefab(previewItem)
  },

  [types.ADD_PREV_BET](state, { bettingInfo, options }) {
    if (state.statistics) {
      if (!_.isNull(state.playInfo.maxBetNums) && state.statistics > state.playInfo.maxBetNums) {
        this.commit(types.ADD_BETS, {
          bettingList: [bettingInfo],
          options: _(options || {}).extend({ statistics: state.statistics }, { buy: true }),
        })
        state.addPrevBetResult = { MaxBetNums: state.playInfo.maxBetNums }
      }

      this.commit(types.EMPTY_BUY_BETTING)

      this.commit(types.ADD_BETS, {
        bettingList: [bettingInfo],
        options: _(options || {}).extend({ statistics: state.statistics }),
      })
    } else {
      state.addPrevBetResult = false
    }
  },


  [types.EMPTY_PREV_BETTING](state, {index}) {
    if (index) {
      state.previewList.splice(index, 1)
    } else {
      state.previewList = []
    }
  },

  [types.CHANGE_PREV_BETTING](state, {index, unit}) {
    const previewItem = state.previewList[index]
    previewItem.unit = unit

    Object.assign(previewItem, $_setUnit(unit, previewItem))

    $_calculateByPrefab(previewItem);
  },

  [types.EMPTY_BUY_BETTING](state) {
    state.buyList = []
  },

  [types.ADD_BETS](state, { bettingList, options }) {
    const items = []
    const sameBets = []

    options = _(options || {}).defaults({
    })

    _(bettingList).each((bettingInfo) => {
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
        bettingNumber: formatBettingNumber(bettingInfo.lotteryList, {
          selectOptionals: bettingInfo.selectOptionals,
          formatToNum: bettingInfo.formatToNum,
          playId: state.playId,
          ticketId: state.ticketId,
          formatToNumInfo: bettingInfo.formatToNumInfo || false,
        }),
        // 显示用
        formatBettingNumber: formatBettingNumber(bettingInfo.lotteryList, {
          type: 'display',
          format: bettingInfo.format,
        }),
        type: bettingInfo.type,
        formatBonusMode: state.formatBonusMode,
        multiple: state.multiple,
        unit: state.unit,
        statistics,
        formatUnit: state.formatUnit,
        betBonus: state.betBonus,
        fBetBonus: state.fBetBonus,
        fPrefabMoney: state.fPrefabMoney,
        betMethod: state.betMethod,
        userRebate: state.userRebate,
        rebateMoney: state.rebateMoney,
        maxMultiple: state.maxMultiple,
        formatMaxMultiple: state.formatMaxMultiple,
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
    })

    if (!options.buy) {
      state.previewList = items.concat(state.previewList)
    } else {
      state.buyList = items.concat(state.buyList)
    }

    state.addPrevBetResult = sameBets
  },
}

const formatBettingNumber = (bettingNumber, options) => {
  let number = ''
  options = _(options || {}).defaults({
    type: 'data',
  })

  if (!_.isEmpty(options.selectOptionals)) {
    number += `${options.selectOptionals.join(',')}|`
  }

  if (bettingNumber.length === 1) {
    number += bettingNumber[0].join(',')
  } else {
    number += _(bettingNumber).map((row) => {
      if (_.isEmpty(row)) {
        row = ['-']
      }

      // 如果有值，则用该符号隔开number
      if (options.format) {
        return row.join(options.format.symbol)
      }
      // 同行是否用空格隔开
      return row.join(options.type === 'display' ? '' : ' ')
    }).join(',')
  }

  if (options.formatToNum) {
    number = _formatToNum(number, options)
  }

  return number
}

// 将球上的文字转换成对应的数值
const _formatToNum = (betNum, options) => {
  let newNum = betNum
  if (_.indexOf(mark6TicketIdArr, parseInt(options.ticketId, 10)) > -1) {
    if (options.formatToNumInfo) {
      const newNumArr = []
      const replaceArr = options.formatToNumInfo
      const selectArr = newNum.split(',')
      _(selectArr).each((text) => {
        _(replaceArr).each((item) => {
          if (text === item.name) {
            newNumArr.push(item.value)
          }
        })
      })
      newNum = newNumArr.join()
    }
  } else {
    while (newNum.indexOf('大') !== -1 || newNum.indexOf('小') !== -1 || newNum.indexOf('单') !== -1 || newNum.indexOf('双') !== -1
    || newNum.indexOf('龙') !== -1 || newNum.indexOf('虎') !== -1 || newNum.indexOf('和') !== -1 || newNum.indexOf('三同号通选') !== -1 || newNum.indexOf('三连号通选') !== -1) {
      newNum = newNum.replace('大', 1)
      newNum = newNum.replace('小', 2)
      newNum = newNum.replace('单', 3)
      newNum = newNum.replace('双', 4)
      newNum = newNum.replace('龙', 0)
      newNum = newNum.replace('虎', 1)
      newNum = newNum.replace('和', 2)
      newNum = newNum.replace('三同号通选', 0)
      newNum = newNum.replace('三连号通选', 0)
    }
  }
  return newNum
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

  state.fBetBonus = _(state.betBonus).chain().div(10000).mul(state.unit)
    .convert2yuan()
    .value()
}


const $_setUnit = (unit, {maxMultiple}) => {
  let formatUnit = ''
  switch (unit) {
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

  const formatMaxMultiple = _(maxMultiple).chain().mul(10000).div(unit)
    .value()

  return {
    formatUnit,
    formatMaxMultiple
  }
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
