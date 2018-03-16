import {pushBettingApi, pushChaseApi, pushMmcBettingApi} from 'api/betting'
import {formatOptionals} from 'build'

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
    formatMaxBonus: 0,
    unit: 10000,
    formatUnit: '元',
    statistics: 0,
    userRebate: 0,
    previewList: [],
    buyList: [],
    totalInfo: {
      totalLottery: 0,
      totalMoney: 0,
      totalBetBonus: 0,
      fTotalMoney: 0,
      fTotalBetBonus: 0,
    },
    buyInfo: {},
    usePack: 0,
    prefabMoney: 0,
    rebateMoney: 0,
    fPrefabMoney: 0,
    fRebateMoney: 0,
    maxBetBonus: 0,
    minBetBonus: 0,
    fMaxBetBonus: 0,
    fMinBetBonus: 0,
    maxMultiple: 100,
    formatMaxMultiple: 100,
    limitMoney: 0,
    maxPrizeMultiple: 1,
    totalBetBonus: 0,
    fTotalBetBonus: 0,
  }
}

// getters
const getters = {
  playId: (state) => {
    return state.playId
  },
  groupId: (state) => {
    return state.groupId
  },
  // playInfo: (state) => {
  //   return state.playInfo
  // },
}

// actions
const actions = {
  [types.PUSH_BETTING]({ state, commit }, {
    planId,
    prevVoucher,
    type = 'previewList',
  }) {
    const bettingList = state[type]
    let amount = 0
    const bet = _(bettingList).reduce((list, item) => {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        // 0 高奖金 1 有返点
        betMethod: item.betMethod,
      })

      amount += item.fPrefabMoney

      return list
    }, [])

    return pushBettingApi(
      { planId, bet, amount, couponRid: !_.isEmpty(prevVoucher) ? prevVoucher.rid : 0 },
      ({ data }) => {
        commit(types.PUSH_BETTING_SUCCESS, { res: data, type })
        return data
      }
    )
  },

  [types.PUSH_CHASE] ({ state, commit }, {
    plan,
    suspend,
    amount,
  }) {
    const bettingList = state.previewList
    const play = _(bettingList).reduce((list, item) => {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        betMethod: item.betMethod,
      })
      return list
    }, [])

    return pushChaseApi(
      {
        plan, play, suspend, usePack: state.usePack, amount,
      },
      ({ data }) => {
        commit(types.PUSH_CHASE_SUCCESS, data)

        return data
      },
    )
  },

  [types.PUSH_MMC_BETTING] ({ state, commit }, {
    bettingList,
    prevVoucher,
  }) {
    let amount = 0

    const bet = _(bettingList).reduce((list, item) => {
      list.push({
        betNum: item.bettingNumber,
        playId: item.playId,
        betMultiple: item.multiple,
        moneyMethod: item.unit,
        // 0 高奖金 1 有返点
        betMethod: item.betMethod,
      })

      amount += item.fPrefabMoney

      return list
    }, [])


    return new Promise((resolve) => {
      pushMmcBettingApi(
        { bet, amount, couponRid: !_.isEmpty(prevVoucher) ? prevVoucher.rid : 0 },
        ({ data }) => {
          resolve(data)
        },
        () => { return commit(types.PUSH_BETTING_FAILURE) },
      )
    })
  },
}

// this.on('change:multiple change:statistics change:userRebate change:betMethod', this.$_calculateByPrefab)
// mutations
const mutations = {
  [types.RESET_BETTING_CHOICE] (state) {
    Object.assign(state, initState())
  },

  [types.PUSH_BETTING_SUCCESS] (state, { res, type }) {
    if (res && res.result === 0) {
      if (type === 'previewList') {
        this.commit(types.EMPTY_PREV_BETTING)
      } else {
        this.commit(types.EMPTY_BUY_BETTING)
      }
    }
  },
  [types.PUSH_BETTING_FAILURE] () {
  },

  [types.PUSH_CHASE_SUCCESS] (state, res) {
    if (res && res.result === 0) {
      this.commit(types.EMPTY_PREV_BETTING)
    }
  },
  [types.PUSH_CHASE_FAILURE] () {
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
  [types.SET_MAX_BONUS] (state, maxBonus) {
    state.maxBonus = maxBonus
    $_calculateByPrefab(state)
  },
  [types.SET_MULTIPLE] (state, num) {
    state.multiple = Number(num)
    $_calculateByPrefab(state)
  },
  [types.SET_MAX_PRIZE_MULTIPLE] (state, maxPrizeMultiple) {
    state.maxPrizeMultiple = maxPrizeMultiple

    $_calculateByPrefab(state)

    this.commit(types.UPDATE_FORMAT_MAX_MULTIPLE)
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

    if (playInfo.betBonus == null) {
      //奖金统一
      state.betBonus = playInfo.betMethodMax

      state.fBetBonus = _(state.betBonus).chain().div(10000).mul(state.unit)
        .convert2yuan()
        .value()
      state.maxMultiple = playInfo.betMultiLimitMax

      state.maxBetBonus = state.minBetBonus = state.fMaxBetBonus = state.fMinBetBonus = 0
    } else {
      //奖金不统一
      this.commit(types.SET_CLAMP_BONUS, playInfo)
    }

    this.commit(types.UPDATE_FORMAT_MAX_MULTIPLE)
  },
  [types.SET_CLAMP_BONUS](state, playInfo) {
    state.maxBetBonus = _.chain(playInfo.betBonus).map('betMethodMax').max().value()
    state.minBetBonus = _.chain(playInfo.betBonus).map('betMethodMax').min().value()
    state.fMaxBetBonus = _(state.maxBetBonus).chain().div(10000).mul(state.unit)
      .convert2yuan()
      .value()
    state.fMinBetBonus = _(state.minBetBonus).chain().div(10000).mul(state.unit)
      .convert2yuan()
      .value()
    state.maxMultiple = playInfo.betMultiLimitMax

    state.betBonus = state.fBetBonus = 0
  },
  /**
   * 更新奖金以及最大投注限制
   * @param state
   * @param indexs - 被选中号码们的索引
   */
  [types.UPDATE_BONUS] (state, indexs) {
    const playInfo = state.playInfo

    if (playInfo.betBonus == null) {
      state.betBonus = playInfo.betMethodMax
      state.maxMultiple = playInfo.betMultiLimitMax
    } else if (!_.isEmpty(indexs)) {
      const selectBonus = _(state.playInfo.betBonus).chain().sortBy((info) => {
        return info.betType
      }).filter((item, index) => {
        return _(indexs).contains(index)
      })
        .value()

      const betBonus = _(selectBonus).max((item) => {
        return item.betMethodMax
      })

      state.betBonus = betBonus.betMethodMax
      state.maxMultiple = betBonus.betMultiLimitMax
    } else {
      this.commit(types.SET_CLAMP_BONUS, playInfo)
    }



    state.fBetBonus = _(state.betBonus).chain().div(10000).mul(state.unit)
      .convert2yuan()
      .value()

    this.commit(types.UPDATE_FORMAT_MAX_MULTIPLE)
  },

  [types.UPDATE_FORMAT_MAX_MULTIPLE](state) {
    state.formatMaxMultiple = Math.floor(_(state.maxMultiple).chain().mul(10000).div(state.maxPrizeMultiple).div(state.unit)
      .value())
  },

  // 清空选择
  [types.SET_CHECKOUT_CHOICE](state) {
    state.prefabMoney = 0
    state.rebateMoney = 0
    state.fPrefabMoney = 0
    state.fRebateMoney = 0
    state.statistics = 0
    this.commit(types.SET_MAX_PRIZE_MULTIPLE, 1)
  },

  [types.SET_PREVIEW_MULTIPLE](state, { num, index }) {
    const previewItem = state.previewList[index]
    previewItem.multiple = Number(num)
    $_calculateByPrefab(previewItem)
  },

  [types.ADD_PREV_BET](state, { bettingInfo, options = {} }) {
    if (options.type !== 'auto') {
      if (state.statistics) {
        this.commit(types.EMPTY_BUY_BETTING)

        if (!_.isNull(state.playInfo.maxBetNums) && state.statistics > state.playInfo.maxBetNums) {
          this.commit(types.ADD_BETS, {
            bettingList: [bettingInfo],
            options: _(options).extend({ statistics: state.statistics }, options),
          })
          state.addPrevBetResult = { maxBetNums: state.playInfo.maxBetNums }
        } else {
          this.commit(types.ADD_BETS, {
            bettingList: [bettingInfo],
            options: _(options).extend({ statistics: state.statistics }),
          })
        }

        this.commit(types.SET_CHECKOUT_CHOICE)
      } else {
        state.addPrevBetResult = false
      }
    } else {
      this.commit(types.ADD_BETS, {
        bettingList: [bettingInfo],
        options,
      })
      state.addPrevBetResult = {}
    }
  },

  [types.ADD_HANDICAP_BET](state, { bettingInfo }) {
    this.commit(types.EMPTY_BUY_BETTING)

    this.commit(types.ADD_HANDICAP_BETS, {
      bettingList: [bettingInfo],
    })

    this.commit(types.CALCULATE_TOTAL, state.buyList)

    if (!_.isNull(state.playInfo.maxBetNums) && state.statistics > state.playInfo.maxBetNums) {
      state.addPrevBetResult = { maxBetNums: state.playInfo.maxBetNums }
    }

    // this.commit(types.SET_CHECKOUT_CHOICE)
  },


  [types.EMPTY_PREV_BETTING](state, { index } = {}) {
    if (_.isNumber(index)) {
      state.previewList.splice(index, 1)
    } else {
      state.previewList = []
    }
  },

  [types.CALCULATE_TOTAL](state, list = state.previewList) {
    const totalInfo = _(list).reduce((info, item) => {
      info.totalLottery = _(info.totalLottery).add(item.statistics)
      info.totalMoney = _(info.totalMoney).add(item.prefabMoney)
      info.totalBetBonus = _(info.totalBetBonus).add(item.formatMaxBonus)
      return info
    }, {
      totalLottery: 0,
      totalMoney: 0,
      totalBetBonus: 0,
    })

    totalInfo.fTotalMoney = _(totalInfo.totalMoney).convert2yuan()
    totalInfo.fTotalBetBonus = _(totalInfo.totalBetBonus).convert2yuan()

    state.totalInfo = totalInfo
  },

  [types.CHANGE_PREV_BETTING](state, { index, unit }) {
    const previewItem = state.previewList[index]
    previewItem.unit = unit

    Object.assign(previewItem, $_setUnit(unit, previewItem))

    $_calculateByPrefab(previewItem)
  },

  [types.EMPTY_BUY_BETTING](state) {
    state.buyList = []
  },

  [types.ADD_BETS](state, { bettingList, options = {} }) {
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
        groupId: state.groupId,
        groupName: state.groupName,
        playName: state.playName,
        bettingNumber: formatBettingNumber(bettingInfo.lotteryList, {
          selectOptionals: bettingInfo.selectOptionals,
        }),
        // 显示用
        formatBettingNumber: formatBettingNumber(bettingInfo.lotteryList, {
          type: 'display',
          selectOptionals: bettingInfo.selectOptionals,
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
        //最大奖金倍数
        maxPrizeMultiple: state.maxPrizeMultiple
      }

      // 判断是否有相同的投注,几个方面比较playId,unit,betMethod,bettingNumber
      if (options.type !== 'buy') {
        sameBet = _(state.previewList).findWhere({
          playId: item.playId,
          unit: item.unit,
          betMethod: item.betMethod,
          bettingNumber: item.bettingNumber,
        })

        if (sameBet) {
          sameBet.multiple = _(sameBet.multiple).add(item.multiple)
          if (sameBet.multiple > sameBet.maxMultiple) {
           sameBet.multiple = sameBet.maxMultiple;
          }
          item = sameBet
        }
      }

      // 计算prefabMoney 和 rebateMoney

      $_calculateByPrefab(item)
      // item.prefabMoney = _(2).chain()
      //   .mul(item.multiple).mul(item.statistics)
      //   .mul(item.unit)
      //   .value()

      if (sameBet) {
        sameBets.push(item)
      } else {
        items.splice(0, 0, item)
      }
    })

    if (options.type !== 'buy') {
      state.previewList = items.concat(state.previewList)
    } else {
      state.buyList = items.concat(state.buyList)
    }

    state.addPrevBetResult = sameBets
  },

  [types.ADD_HANDICAP_BETS](state, { bettingList, options = {} }) {
    const items = []

    _(bettingList).each((bettingInfo) => {
      let statistics

      if (state.statistics && state.statistics !== 0) {
        statistics = state.statistics
      } else {
        statistics = bettingInfo.lotteryList.length
      }

      //盘口的显示和普通玩法不一致 采用的格式化后的formattedList来显示
      //并取消原先的formatBettingNumber参数
      const item = {
        levelName: state.levelName,
        playId: state.playId,
        playName: state.playName,
        bettingNumber: bettingInfo.format(bettingInfo.lotteryList),
        // 显示用
        formattedList: bettingInfo.showFormat(bettingInfo.lotteryList, state),
        // formatBettingNumber: bettingInfo.showFormat(bettingInfo.lotteryList),
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

      items.splice(0, 0, item)

      // 计算prefabMoney 和 rebateMoney

      if (bettingInfo.calculateType === 'separate') {
        item.prefabMoney = _.chain(bettingInfo.lotteryList).reduce((total, item) => { return total + item.betMoney }, 0)
          .mul(item.unit)
          .value()
      } else if (bettingInfo.calculateType === 'unite') {
        //只取一个价格
        item.prefabMoney = _.chain(bettingInfo.lotteryList[0].betMoney)
          .mul(item.statistics)
          .mul(item.unit)
          .value()
      }
    })

    state.buyList = items.concat(state.buyList)

    state.addPrevBetResult = []
  },
}

const formatBettingNumber = (bettingNumber, options) => {
  let number = ''
  options = _(options || {}).defaults({
    type: 'data',
  })

  if (!_.isEmpty(options.selectOptionals)) {
    if (options.type === 'display') {
      number += `${formatOptionals(options.selectOptionals).join(',')}|`
    } else {
      number += `${options.selectOptionals.join(',')}|`
    }
  }

  if (bettingNumber.length === 1) {
    // number += bettingNumber[0][options.type === 'display' ? 'title' : 'num']
    number += _.pluck(bettingNumber[0], options.type === 'display' ? 'title' : 'num').join(',')
  } else {
    number += _(bettingNumber).map((row) => {
      if (_.isEmpty(row)) {
        row = [{
          title: '-',
          num: '-'
        }]
      }

      // 如果有值，则用该符号隔开number
      if (options.format) {
        return _.pluck(row, options.type === 'display' ? 'title' : 'num').join(options.format.symbol)
      }
      // 同行是否用空格隔开
      return _.pluck(row, options.type === 'display' ? 'title' : 'num').join(options.type === 'display' ? '' : ' ')
    }).join(',')
  }


  return number
}

const $_calculateByPrefab = (data) => {
  let prefabMoney = 0
  // const rebateMoney = 0

  if (data.statistics && data.multiple) {
    prefabMoney = _(data.statistics).chain().mul(data.multiple).mul(2)
      .mul(data.unit)
      .value()

    data.prefabMoney = prefabMoney
    // data.rebateMoney = data.betMethod === 1 ? _(prefabMoney).chain().mul(data.userRebate).div(1000)
    //   .value() : 0
  }


  if (data.multiple) {
    data.formatMaxBonus = _.chain(data.betBonus)
      .mul(data.unit)
      .mul(data.multiple)
      .convert2yuan()
      .value()
  }

  // data.rebateMoney = rebateMoney
  // data.fRebateMoney = rebateMoney.convert2yuan

  data.prefabMoney = prefabMoney
  data.fPrefabMoney = _(prefabMoney).convert2yuan()
  data.fBetBonus = _(data.betBonus).chain().div(10000).mul(data.unit)
    .convert2yuan()
    .value()

  data.totalBetBonus = _.chain(data.betBonus).formatMul(data.multiple).formatMul(data.maxPrizeMultiple).value()
  data.fTotalBetBonus = _(data.totalBetBonus).chain().div(10000).mul(data.unit)
    .convert2yuan()
    .value()
}


const $_setUnit = (unit, { maxMultiple, maxPrizeMultiple }) => {
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

  const formatMaxMultiple = Math.floor(_(maxMultiple).chain().mul(10000).div(maxPrizeMultiple).div(unit)
    .value())

  return {
    formatUnit,
    formatMaxMultiple,
  }
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}
