import betFormat from './betFormat'
import betMaxPrize from './bet-max-prize'

const op = {
  all: {
    all: true,
    big: true,
    small: true,
    odd: true,
    even: true,
    clear: true,
  },
  none: {
    all: false,
    big: false,
    small: false,
    odd: false,
    even: false,
    clear: false,
  },
  clear: {
    clear2: true,
  },
  handicap: {
    full: true,
  },
}

const TopOp = {
  all: {
    currMissing: true,
    coldHot: true,
    auto: true,
    clear: true,
  },
  none: {
    currMissing: false,
    coldHot: false,
    auto: false,
    clear: false,
  },
}

const betRules = []

function addRule(ids, {
  formType = '',
  keyPosition = [],
  optionals = {},
  list = [],
  // 投注方式：输入还是选择
  type = 'select',
  // 球上的样式和数据
  limits = [],
  // 注数的算法
  algorithm = _.noop,
  algorithmProps = {},
  formHighlight,
  analysisProps,
  format,
  splitReg,
  validate,
  formatToNum = false,
  create = _.noop,
  maxPrizeAlgorithm = betMaxPrize.normal,
  maxPrizeAlgorithmProps = {},
  style = {
    numType: 'circle',
    position: 'default',
    row: 1,
    operate: 'inline',
  },
  topOp = 'all',
}) {
  _(list).each((item, index) => { // list标示需要显示的行的数组
    item.id = index// 标记选号的第几行

    if (optionals[index]) {
      optionals[index].id = index
    }
  })

  betRules.push({
    playId: Number(`${ids[0]}${ids[1]}`),
    rule: {
      formType,
      formHighlight,
      keyPosition,
      list,
      optionals,
      format,
      formatToNum,
      splitReg,
      validate,
      type,
      limits,
      analysisProps,
      algorithm,
      algorithmProps,
      maxPrizeAlgorithm,
      maxPrizeAlgorithmProps,
      style,
      create,
      topOp: TopOp[topOp],
    },
  })
}

function createList(titles, options) {
  options = _(options || {}).defaults({
    items: bettingTypes.SSC.range,
    operate: 'all',
    limits: [],
    doublenum: false,
  })

  return _(titles).map((title) => {
    const items = _.map(title && title.items || options.items, item => {
      if (!_.isObject(item)) {
        item = {
          title: item,
          num: item,
        }
      }
      return item
    })

    if (_.isObject(title)) {
      return {
        isShow: title.title !== null,
        title: title.title,
        items,
        op: op[title.operate || options.operate],
        limits: title.limits || options.limits,
        doubleNum: title.doubleNum || options.doubleNum,
      }
    }
    return {
      isShow: title !== null,
      title,
      items,
      op: op[options.operate],
      limits: options.limits,
      doubleNum: options.doubleNum,
    }
  })
}

function createHandicapList(titles, options) {
  options = _(options || {}).defaults({
    operate: 'none',
  })

  return _(titles).map((title) => {
    _.chain(title.items).flatten().each((item) => {
      if (!_.isEmpty(item)) {
        item.selected = false
        item.betMoney = null
      }
    })
    return {
      title: title.title,
      items: title.items,
      showItemOdds: title.showItemOdds,
      showMoneyInput: title.showMoneyInput,
      op: op[title.operate || options.operate],
      betMoney: 0,
    }
  })
}

function addHandicapRule(ids, {
  list = [],
  // 投注方式：输入还是选择
  type = 'handicap',
  // 注数的算法
  algorithm = _.noop,
  algorithmProps = {},
  keyPosition = [],
  format = betFormat.star,
  showFormat = betFormat.handicapNormal,
  showOdds = true,
  calculateType = 'separate',
  showItemOddsAtTitle = false,
  showMoneyInput = true,
  showItemOdds = true,
  bettingArea = ['top', 'bottom'],
  topOp = 'all',
}) {
  betRules.push({
    playId: Number(`${ids[0]}${ids[1]}`),
    rule: {
      list,
      type,
      format,
      showFormat,
      showOdds,
      algorithm,
      keyPosition,
      algorithmProps,
      calculateType,
      showItemOddsAtTitle,
      showMoneyInput,
      showItemOdds,
      bettingArea,
      topOp: TopOp[topOp],
    },
  })
}

export default {
  betRules,
  addRule,
  createList,
  addHandicapRule,
  createHandicapList,
}
