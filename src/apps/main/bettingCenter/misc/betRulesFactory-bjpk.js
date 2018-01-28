import factory from 'bettingCenter/misc/betRulesFactory'

const algorithm = require('bettingCenter/misc/betRulesAlgorithm')

const ten = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']

const danshuang = [
  {
    title: '大',
    num: 1
  },
  {
    title: '小',
    num: 2
  },
  {
    title: '单',
    num: 3
  },
  {
    title: '双',
    num: 4
  },
]
const longhu = [
  {
    title: '龙',
    num: 0
  },
  {
    title: '虎',
    num: 1
  }
]

const splitReg = /[\r\n,;:\|]+/

function _create(ticketId) {
  //= =================================================
  // 猜前一

  // 直选复式
  factory.addRule([ticketId, '010101'], {
    algorithm: algorithm.mulAllNotRepeat,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: 0,
    },
    keyPosition: ['冠军'],
    list: factory.createList(['冠军'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: ten,
      matching: true,
    }),
  })

  //= =============================
  // 猜前二

  // 直选复式
  factory.addRule([ticketId, '020101'], {
    algorithm: algorithm.mulAllNotRepeat,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: 0,
    },
    keyPosition: ['冠军', '亚军'],
    list: factory.createList(['冠军', '亚军'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: ten,
      matching: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '020102'], {
    type: 'input',
    keyPosition: ['冠军', '亚军'],
    splitReg,
    validate: algorithm.getValidateFunc(2, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: ten,
      repeat: true,
      innerSort: false,
    }),
  })

  //= =============================
  // 猜前三

  // 直选复式
  factory.addRule([ticketId, '030101'], {
    algorithm: algorithm.mulAllNotRepeat,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: 0,
    },
    keyPosition: ['冠军', '亚军', '季军'],
    list: factory.createList(['冠军', '亚军', '季军'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: ten,
      matching: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '030102'], {
    type: 'input',
    keyPosition: ['冠军', '亚军', '季军'],
    splitReg,
    validate: algorithm.getValidateFunc(3, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: ten,
      repeat: true,
      innerSort: false,
    }),
  })

  //= =============================
  // 猜前四

  // 直选复式
  factory.addRule([ticketId, '040101'], {
    algorithm: algorithm.mulAllNotRepeat,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: 0,
    },
    keyPosition: ['冠军', '亚军', '季军', '第四名'],
    list: factory.createList(['冠军', '亚军', '季军', '第四名'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(4, {
      range: ten,
      matching: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '040102'], {
    type: 'input',
    keyPosition: ['冠军', '亚军', '季军', '第四名'],
    splitReg,
    validate: algorithm.getValidateFunc(4, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(4, {
      range: ten,
      repeat: true,
      innerSort: false,
    }),
  })

  //= =============================
  // 猜前五

  // 直选复式
  factory.addRule([ticketId, '050101'], {
    algorithm: algorithm.mulAllNotRepeat,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: 0,
    },
    keyPosition: ['冠军', '亚军', '季军', '第四名', '第五名'],
    list: factory.createList(['冠军', '亚军', '季军', '第四名', '第五名'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(5, {
      range: ten,
      matching: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '050102'], {
    type: 'input',
    keyPosition: ['冠军', '亚军', '季军', '第四名', '第五名'],
    splitReg,
    validate: algorithm.getValidateFunc(5, {
      range: ten,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(5, {
      range: ten,
      repeat: true,
      innerSort: false,
    }),
  })

  //= ============================
  // 定位胆

  factory.addRule([ticketId, '060102'], {
    algorithm: algorithm.addAll,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: 0,
    },
    list: factory.createList(['冠军', '亚军', '季军', '第四名', '第五名'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: ten,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '060103'], {
    algorithm: algorithm.addAll,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20019,
      startPos: -5,
    },
    list: factory.createList(['第六名', '第七名', '第八名', '第九名', '第十名'], {
      items: ten,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: ten,
      matching: true,
    }),
  })

  // =========================
  // 龙虎
  factory.addRule([ticketId, '160101'], {
    formType: 'DRAGON',
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '160102'], {
    formType: 'DRAGON',
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })


  factory.addRule([ticketId, '160103'], {
    formType: 'DRAGON',
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })


  factory.addRule([ticketId, '160104'], {
    formType: 'DRAGON',
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })


  factory.addRule([ticketId, '160105'], {
    formType: 'DRAGON',
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })


  // =========================
  // 大小单双

  factory.addRule([ticketId, '070101'], {
    algorithm: algorithm.addAll,
    keyPosition: ['冠军', '亚军', '季军'],
    list: factory.createList(['冠军', '亚军', '季军'], {
      items: danshuang,
      operate: 'none',
    }),
    format: {symbol: ' '},
    formatToNum: true,
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: danshuang,
      matching: true,
    }),
  })

  // 冠亚军和值
  factory.addRule([ticketId, '170101'], {
    algorithm: algorithm.addAll,
    formType: 'SUM',
    keyPosition: ['冠军', '亚军'],
    analysis: false,
    list: factory.createList(['号码'], {
      items: _.range(3, 20),
      operate: 'none',
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(3, 20),
      matching: true,
    }),
  })

  // 冠亚季军和值
  factory.addRule([ticketId, '170102'], {
    algorithm: algorithm.addAll,
    formType: 'SUM',
    keyPosition: ['冠军', '亚军', '季军'],
    analysis: false,
    list: factory.createList(['号码'], {
      items: _.range(6, 28),
      operate: 'none',
    }),
    create: algorithm.getCreateFunc(1, {
      range: _.range(6, 28),
      matching: true,
    }),
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
