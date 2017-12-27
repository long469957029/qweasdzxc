const zero2nine = _.range(10)

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
}

const TopOp = {
  all: {
    currMissing: true,
    maxMissing: true,
    auto: true,
    clear: true,
  },
  none: {
    currMissing: false,
    maxMissing: false,
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
  format,
  formatToNum = false,
  create = _.noop,
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
      keyPosition,
      list,
      optionals,
      format,
      formatToNum,
      type,
      limits,
      algorithm,
      algorithmProps,
      style,
      create,
      topOp: TopOp[topOp],
    },
  })
}

function createList(titles, options) {
  options = _(options || {}).defaults({
    items: zero2nine,
    operate: 'all',
    limits: [],
    doublenum: false,
    htmlNeedInfo: {},
  })

  return _(titles).map((title) => {
    if (_.isObject(title)) {
      return {
        isShow: title.title !== null,
        title: title.title,
        items: title.items || options.items,
        showItems: title.showItems || options.showItems || options.items,
        op: op[title.operate || options.operate],
        limits: title.limits || options.limits,
        doubleNum: title.doubleNum || options.doubleNum,
        htmlNeedInfo: options.htmlNeedInfo,
      }
    }
    return {
      isShow: title !== null,
      title,
      items: options.items,
      showItems: options.showItems || options.items,
      op: op[options.operate],
      limits: options.limits,
      doubleNum: options.doubleNum,
      htmlNeedInfo: options.htmlNeedInfo,
    }
  })
}

function createHandicapList(titles, options) {
  options = _(options || {}).defaults({
    operate: 'all',
  })

  return _(titles).map((title) => {
    if (_.isObject(title)) {
      return {
        title: title.title,
        items: title.items || options.items,
        showOdds: title.showOdds,
        op: op[title.operate || options.operate],
      }
    }
    return {
      title,
      items: options.items,
      op: op[options.operate],
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
  format,
  showOdds = true,
  formatToNum = false,
  bettingArea = ['top', 'bottom'],
  topOp = 'all',
}) {
  betRules.push({
    playId: Number(`${ids[0]}${ids[1]}`),
    rule: {
      list,
      type,
      format,
      showOdds,
      formatToNum,
      algorithm,
      algorithmProps,
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
