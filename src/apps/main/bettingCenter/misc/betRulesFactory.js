define((require, exports, module) => {
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
    optionals = {},
    list = [],
    // 投注方式：输入还是选择
    type = 'select',
    // 球上的样式和数据
    limits = [],
    // 注数的算法
    algorithm = _.noop,
    algorithmProps = {},
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
        list,
        optionals,
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
          showItems: title.showItems || options.showTimes || options.items,
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

  return {
    betRules,
    addRule,
    createList,
  }
})
