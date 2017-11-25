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
  }

  const betRules = []

  function addRule(ids, rule) {
    rule.optionals = rule.optionals || []
    rule.type = rule.type || 'select'// 投注方式：输入还是选择
    rule.limits = rule.limits || []// 球上的样式和数据
    rule.algorithm = rule.algorithm || _.noop// 注数的算法

    _(rule.list).each((item, index) => { // list标示需要显示的行的数组
      item.id = index// 标记选号的第几行

      if (rule.optionals[index]) {
        rule.optionals[index].id = index
      }
    })

    betRules.push({
      playId: Number(`${ids[0]}${ids[1]}`),
      rule,
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
    if (_(options[0]).isArray()) {

    }

    return _(titles).map((title) => {
      if (_.isObject(title)) {
        return {
          isShow: title.title !== null,
          title: title.title,
          items: title.items || options.items,
          op: op[title.operate || options.operate],
          limits: title.limits || options.limits,
          doublenum: title.doublenum || options.doublenum,
          htmlNeedInfo: options.htmlNeedInfo,
        }
      } 
      return {
        isShow: title !== null,
        title,
        items: options.items,
        op: op[options.operate],
        limits: options.limits,
        doublenum: options.doublenum,
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
