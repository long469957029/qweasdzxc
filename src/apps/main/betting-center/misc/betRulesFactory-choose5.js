import factory from './betRulesFactory'
import betMaxPrize from './bet-max-prize'

const algorithm = require('./betRulesAlgorithm')

const eleven = bettingTypes.CHOOSE15.range

const splitReg = /[\r\n,;:\|]+/

function createDanTuo(num) {
  return [
    {
      title: '胆码',
      items: eleven,
      operate: 'none',
      limits: [
        {
          name: 'conflict-x',
          data: {
            num,
          },
        },
        {name: 'conflict-y'},
      ],
    }, {
      title: '拖码',
      items: eleven,
      limits: [{name: 'conflict-y'}],
    },
  ]
}

function _create(ticketId) {
  //= =================================================
  // 前三

  // 直选复式
  factory.addRule([ticketId, '010101'], {
    keyPosition: ['万位', '千位', '百位', null, null],
    analysisProps: {
      type: 'normal',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['第一位', '第二位', '第三位'], {
      items: eleven,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '010102'], {
    type: 'input',
    splitReg,
    keyPosition: ['万位', '千位', '百位', null, null],
    validate: algorithm.getValidateFunc(3, {
      range: eleven,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSplit: ' ',
      slice: [2],
      repeat: true,
      innerSort: false,
    }),
  })

  // 组选复式
  factory.addRule([ticketId, '010201'], {
    keyPosition: ['万位', '千位', '百位', null, null],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20014,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3,
    },
    list: factory.createList(['前三组选'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      outerSort: true,
      slice: false,
    }),
  })

  // 组选单式
  factory.addRule([ticketId, '010202'], {
    type: 'input',
    keyPosition: ['万位', '千位', '百位', null, null],
    splitReg,
    validate: algorithm.getValidateFunc(3, {
      range: eleven,
      innerSort: true,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSplit: ' ',
      slice: [2],
      outerSort: true,
    }),
  })

  // 组选胆拖
  factory.addRule([ticketId, '010203'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 3,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(2)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  //= =============================
  // 前二

  // 直选复式
  factory.addRule([ticketId, '020101'], {
    keyPosition: ['万位', '千位', null, null, null],
    analysisProps: {
      type: 'normal',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.mulAllNotRepeat,
    list: factory.createList(['第一位', '第二位'], {
      items: eleven,
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '020102'], {
    type: 'input',
    keyPosition: ['万位', '千位', null, null, null],
    splitReg,
    validate: algorithm.getValidateFunc(2, {
      range: eleven,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: eleven,
      repeat: true,
      innerSort: false,
    }),
  })

  // 组选复式
  factory.addRule([ticketId, '020201'], {
    keyPosition: ['万位', '千位', null, null, null],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20015,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    list: factory.createList(['前二组选'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(2, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 组选单式
  factory.addRule([ticketId, '020202'], {
    type: 'input',
    keyPosition: ['万位', '千位', null, null, null],
    splitReg,
    validate: algorithm.getValidateFunc(2, {
      range: eleven,
      innerSort: true,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: eleven,
      repeat: true,
      innerSort: false,
    }),
  })

  // 组选胆拖
  factory.addRule([ticketId, '020203'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 2,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(1)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  //= =============================
  // 不定位

  // 前三一码不定位
  factory.addRule([ticketId, '030101'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20014,
      startPos: 0,
    },
    keyPosition: ['万位', '千位', '百位', null, null],
    algorithm: algorithm.addAll,
    list: factory.createList(['号码'], {
      items: eleven,
    }),
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 3,
      k: 1
    },
    create: algorithm.getCreateFunc(1, {
      range: eleven,
      matching: true,
    }),
  })

  //= ============================
  // 定位胆

  factory.addRule([ticketId, '040101'], {
    keyPosition: ['万位', '千位', '百位', null, null],
    analysisProps: {
      type: 'normal',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    maxPrizeAlgorithm: betMaxPrize.addAllNotRepeat,
    list: factory.createList(['第一位', '第二位', '第三位'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(1, {
      range: eleven,
      matching: true,
    }),
  })

  //= =========================
  // 任选复式

  // 任选一中一
  factory.addRule([ticketId, '050101'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    maxPrizeAlgorithm: betMaxPrize.nInN,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 1
    },
    list: factory.createList(['号码'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(1, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选二中二
  factory.addRule([ticketId, '050102'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.nInN,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 2
    },
    list: factory.createList(['选二中二'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(2, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 任选三中三
  factory.addRule([ticketId, '050103'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3,
    },
    maxPrizeAlgorithm: betMaxPrize.nInN,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 3
    },
    list: factory.createList(['选三中三'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 任选四中四
  factory.addRule([ticketId, '050104'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 4,
    },
    maxPrizeAlgorithm: betMaxPrize.nInN,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 4
    },
    list: factory.createList(['选四中四'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(4, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 任选五中五
  factory.addRule([ticketId, '050105'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 5,
    },
    maxPrizeAlgorithm: betMaxPrize.nInN,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 5
    },
    list: factory.createList(['选五中五'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(5, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 任选六中五
  factory.addRule([ticketId, '050106'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 6,
    },
    maxPrizeAlgorithm: betMaxPrize.overNInN,
    maxPrizeAlgorithmProps: {
      min: 6,
      n: 6,
      k: 1
    },
    list: factory.createList(['选六中五'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(6, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 任选七中五
  factory.addRule([ticketId, '050107'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 7,
    },
    maxPrizeAlgorithm: betMaxPrize.overNInN,
    maxPrizeAlgorithmProps: {
      min: 7,
      n: 6,
      k: 2
    },
    list: factory.createList(['选七中五'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(7, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  // 任选八中五
  factory.addRule([ticketId, '050108'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20013,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 8,
    },
    maxPrizeAlgorithm: betMaxPrize.overNInN,
    maxPrizeAlgorithmProps: {
      min: 8,
      n: 6,
      k: 3
    },
    list: factory.createList(['选八中五'], {
      items: eleven,
    }),
    create: algorithm.getCreateFunc(8, {
      range: eleven,
      innerSort: true,
      slice: false,
    }),
  })

  //= ============================
  // 任选单式

  // 任选一中一
  factory.addRule([ticketId, '060101'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(1, {
      range: eleven,
      acceptRepeat: 1,
      split: ' ',
      innerSplit: ' ',
    }),
    maxPrizeAlgorithm: betMaxPrize.inputNInN,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 1
    },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选二中二
  factory.addRule([ticketId, '060102'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(2, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 2
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(2, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选三中三
  factory.addRule([ticketId, '060103'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(3, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 3
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选四中四
  factory.addRule([ticketId, '060104'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(4, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 4
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(4, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选五中五
  factory.addRule([ticketId, '060105'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(5, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 5
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(5, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选六中五
  factory.addRule([ticketId, '060106'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(6, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 5
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(6, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选七中五
  factory.addRule([ticketId, '060107'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(7, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 5
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(7, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选八中五
  factory.addRule([ticketId, '060108'], {
    type: 'input',
    splitReg,
    validate: algorithm.getValidateFunc(8, {
      range: eleven,
      acceptRepeat: 1,
      innerSort: true,
      outerSort: true,
      split: ' ',
      innerSplit: ' ',
    }),
    // maxPrizeAlgorithm: betMaxPrize.inputNInN,
    // maxPrizeAlgorithmProps: {
    //   n: 5,
    //   k: 5
    // },
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(6, {
      range: eleven,
      innerSort: true,
    }),
  })

  //= ============================
  // 任选胆拖

  // 任选二中二
  factory.addRule([ticketId, '070101'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 2,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(1)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选三中三
  factory.addRule([ticketId, '070102'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 3,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(2)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选四中四
  factory.addRule([ticketId, '070103'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 4,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(3)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选五中五
  factory.addRule([ticketId, '070104'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 5,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(4)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选六中五
  factory.addRule([ticketId, '070105'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 6,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(5)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选七中五
  factory.addRule([ticketId, '070106'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 7,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(6)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })

  // 任选八中五
  factory.addRule([ticketId, '070107'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 8,
    },
    format: {symbol: ' '},
    list: factory.createList(createDanTuo(7)),
    create: algorithm.getCreateFunc(3, {
      range: eleven,
      innerSort: true,
    }),
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
