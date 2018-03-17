import factory from './betRulesFactory'
import betMaxPrize from './bet-max-prize'

const algorithm = require('./betRulesAlgorithm')

function _create(ticketId) {
  //= =================================================
  // 前三

  // 直选复式
  factory.addRule([ticketId, '010101'], {
    formType: 'GROUP',
    keyPosition: ['百位', '十位', '个位'],
    analysisProps: {
      type: 'normal',
      playSeriesId: 20016,
      startPos: 0,
    },
    algorithm: algorithm.mulAll,
    list: factory.createList(['百位', '十位', '个位']),
    create: algorithm.getCreateFunc(3, {
      repeat: true,
    }),
  })

  // 直选单式
  factory.addRule([ticketId, '010102'], {
    type: 'input',
    formType: 'GROUP',
    keyPosition: ['百位', '十位', '个位'],
    validate: algorithm.getValidateFunc(3),
    create: algorithm.getCreateFunc(3, {
      slice: [2],
      repeat: true,
      innerSort: false,
    }),
  })

  // 直选和值
  factory.addRule([ticketId, '010103'], {
    formType: 'SUM',
    keyPosition: ['百位', '十位', '个位'],
    algorithm: algorithm.statistics,
    algorithmProps: {
      selectCount: 3,
    },
    list: factory.createList(['号码'], {
      items: _.range(28),
      operate: 'none',
    }),
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: _.range(28),
    }),
  })

  // 组三
  factory.addRule([ticketId, '010201'], {
    formType: 'GROUP',
    formHighlight: ['组三'],
    keyPosition: ['百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20016,
      startPos: 0,
    },
    algorithm: algorithm.factorial,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true,
      slice: false,
    }),
  })

  // 组六
  factory.addRule([ticketId, '010202'], {
    formType: 'GROUP',
    formHighlight: ['组六'],
    keyPosition: ['百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20016,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3,
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: false,
    }),
  })

  // 组选和值
  factory.addRule([ticketId, '010203'], {
    formType: 'SUM',
    keyPosition: ['百位', '十位', '个位'],
    algorithm: algorithm.fromConfig,
    algorithmProps: {
      config: [null, 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1],
    },
    list: factory.createList(['号码'], {
      items: _.range(1, 27),
      operate: 'none',
    }),
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: _.range(1, 27),
    }),
  })

  // 混合组选
  factory.addRule([ticketId, '010204'], {
    type: 'input',
    formType: 'GROUP',
    keyPosition: ['百位', '十位', '个位'],
    validate: algorithm.getValidateFunc(3, {
      acceptRepeat: 1,
      maxRepeat: 2,
      minRepeat: 1,
      innerSort: true,
    }),
    analysis: false,
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: [2],
    }),
  })

  //= =================================================
  // 二星

  function addTwoRules(rules, {list}) {
    let rule = rules.shift()
    // 直选复式
    factory.addRule(rule.ids, {
      keyPosition: list,
      analysisProps: {
        type: 'normal',
        playSeriesId: 20016,
        startPos: 0,
      },
      algorithm: algorithm.mulAll,
      list: factory.createList(list),
      create: algorithm.getCreateFunc(2, {
        repeat: true,
        matching: true,
      }),
    })

    rule = rules.shift()
    // 直选单式
    factory.addRule(rule.ids, {
      type: 'input',
      keyPosition: list,
      validate: algorithm.getValidateFunc(2),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        repeat: true,
        innerSort: false,
      }),
    })

    rule = rules.shift()
    // 组选复式
    factory.addRule(rule.ids, {
      keyPosition: list,
      analysisProps: {
        type: 'normal',
        playSeriesId: 20016,
        startPos: 0,
      },
      algorithm: algorithm.group,
      algorithmProps: {
        mainRow: 0,
        cTimes: 2,
      },
      list: factory.createList(['号码']),
      create: algorithm.getCreateFunc(2, {
        outerSort: true,
        slice: false,
      }),
    })

    rule = rules.shift()
    // 组选单式
    factory.addRule(rule.ids, {
      type: 'input',
      keyPosition: list,
      validate: algorithm.getValidateFunc(2, {
        acceptRepeat: 0,
        innerSort: true,
      }),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        outerSort: true,
      }),
    })
  }

  // 前二

  addTwoRules([
    {ids: [ticketId, '020101']},
    {ids: [ticketId, '020102']},
    {ids: [ticketId, '020201']},
    {ids: [ticketId, '020202']},
  ], {
    list: ['百位', '十位', null],
  })

  //= =================================================
  // 后二

  addTwoRules([
    {ids: [ticketId, '020103']},
    {ids: [ticketId, '020104']},
    {ids: [ticketId, '020203']},
    {ids: [ticketId, '020204']},
  ], {
    list: [null, '十位', '个位'],
  })

  //= =================================================
  // 定位胆

  factory.addRule([ticketId, '030101'], {
    keyPosition: ['百位', '十位', '个位'],
    analysisProps: {
      type: 'normal',
      playSeriesId: 20016,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    maxPrizeAlgorithm: betMaxPrize.addAll,
    list: factory.createList(['百位', '十位', '个位']),
    create: algorithm.getCreateFunc(1, {
      matching: true,
    }),
  })

  //= ================================================
  // 不定位

  // 一码不定位
  factory.addRule([ticketId, '040101'], {
    keyPosition: ['百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20016,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 3,
      k: 1
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(1),
  })

  // 二码不定位
  factory.addRule([ticketId, '040102'], {
    keyPosition: ['百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20016,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 3,
      k: 2
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true,
      slice: false,
    }),
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
