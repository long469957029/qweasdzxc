import factory from './betRulesFactory'
import betMaxPrize from './bet-max-prize'

const algorithm = require('./betRulesAlgorithm')

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
  },
  {
    title: '和',
    num: 2
  }
]

function _create(ticketId) {
  //= =================================================
  // 五星

  // 复式
  factory.addRule([ticketId, '010101'], {
    formType: 'GROUP',
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    algorithm: algorithm.mulAll,
    analysisProps: {
      type: 'normal',
      playSeriesId: 20001,
      startPos: 0,
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(5, {
      repeat: true,
    }),
  })

  // 单式
  factory.addRule([ticketId, '010102'], {
    type: 'input',
    formType: 'GROUP',
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    validate: algorithm.getValidateFunc(5),
    create: algorithm.getCreateFunc(5, {
      slice: [4],
      repeat: true,
      innerSort: false,
    }),
  })

  // 组选120
  factory.addRule([ticketId, '010201'], {
    formType: 'GROUP',
    formHighlight: ['组选120'],
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 5,
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(5, {
      outerSort: true,
      slice: false,
    }),
  })

  // 组选60
  factory.addRule([ticketId, '010202'], {
    formType: 'GROUP',
    formHighlight: ['组选60'],
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 3,
    },
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(4, {
      slice: [0, 3],
    }),
  })

  // 组选30
  factory.addRule([ticketId, '010203'], {
    formType: 'GROUP',
    formHighlight: ['组选30'],
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [1, 2],
    }),
  })

  // 组选20
  factory.addRule([ticketId, '010204'], {
    formType: 'GROUP',
    formHighlight: ['组选20'],
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 2,
    },
    list: factory.createList(['三重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [0, 2],
    }),
  })

  // 组选10
  factory.addRule([ticketId, '010205'], {
    formType: 'GROUP',
    formHighlight: ['组选10'],
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    list: factory.createList(['三重号位', '二重号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1],
    }),
  })

  // 组选5
  factory.addRule([ticketId, '010206'], {
    formType: 'GROUP',
    formHighlight: ['组选5'],
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    list: factory.createList(['四重号位', '单号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1],
    }),
  })

  // 二码不定位
  factory.addRule([ticketId, '080301'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 2
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true,
      slice: false,
    }),
  })

  // 三码不定位
  factory.addRule([ticketId, '080302'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 3
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: false,
    }),
  })

  //= =================================================
  // 四星

  // 复式
  factory.addRule([ticketId, '020101'], {
    formType: 'GROUP',
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'normal',
      playSeriesId: 20002,
      startPos: 1,
    },
    algorithm: algorithm.mulAll,
    list: factory.createList([null, '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(4, {
      repeat: true,
      matching: true,
    }),
  })

  // 单式
  factory.addRule([ticketId, '020102'], {
    formType: 'GROUP',
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    type: 'input',
    validate: algorithm.getValidateFunc(4),
    create: algorithm.getCreateFunc(4, {
      slice: [3],
      repeat: true,
      innerSort: false,
    }),
  })

  // 组选24
  factory.addRule([ticketId, '020201'], {
    formType: 'GROUP',
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    formHighlight: ['组选24'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20002,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 4,
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(4, {
      outerSort: true,
      slice: false,
    }),
  })

  // 组选12
  factory.addRule([ticketId, '020202'], {
    formType: 'GROUP',
    formHighlight: ['组选12'],
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20002,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 2,
    },
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [0, 2],
    }),
  })

  // 组选6
  factory.addRule([ticketId, '020203'], {
    formType: 'GROUP',
    formHighlight: ['组选6'],
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20002,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    list: factory.createList(['二重号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1],
      slice: false,
    }),
  })

  // 组选4
  factory.addRule([ticketId, '020204'], {
    formType: 'GROUP',
    formHighlight: ['组选4'],
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20002,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    list: factory.createList(['三重号位', '单号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1],
    }),
  })

  // 一码不定位
  factory.addRule([ticketId, '080201'], {
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20002,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 4,
      k: 1
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(1),
  })

  // 二码不定位
  factory.addRule([ticketId, '080202'], {
    keyPosition: [null, '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20002,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 4,
      k: 2
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true,
      slice: false,
    }),
  })

  //= =================================================
  // 三星
  function addThreeRules(rules, {playSeriesId, startPos}) {
    // 复式
    factory.addRule(rules[0].ids, {
      formType: 'GROUP',
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'normal',
        playSeriesId,
        startPos,
      },
      algorithm: algorithm.mulAll,
      list: factory.createList(rules[0].list),
      create: algorithm.getCreateFunc(3, {
        repeat: true,
        matching: true,
      }),
    })

    // 单式
    factory.addRule(rules[1].ids, {
      type: 'input',
      formType: 'GROUP',
      keyPosition: rules[0].list,
      validate: algorithm.getValidateFunc(3),
      create: algorithm.getCreateFunc(3, {
        slice: [2],
        repeat: true,
        innerSort: false,
      }),
    })

    // 直选和值
    factory.addRule(rules[2].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      algorithm: algorithm.statistics,
      algorithmProps: {
        selectCount: 3,
      },
      analysis: false,
      list: factory.createList(['号码'], {
        items: _.range(28),
        operate: 'none',
      }),
      create: algorithm.getCreateFunc(1, {
        range: _.range(28),
      }),
    })

    // 跨度
    factory.addRule(rules[3].ids, {
      formType: 'SPAN',
      keyPosition: rules[0].list,
      algorithm: algorithm.fromConfig,
      algorithmProps: {
        config: [10, 54, 96, 126, 144, 150, 144, 126, 96, 54],
      },
      analysis: false,
      list: factory.createList(['号码']),
      create: algorithm.getCreateFunc(1),
    })

    // 组三
    factory.addRule(rules[4].ids, {
      formType: 'GROUP',
      formHighlight: ['组三'],
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
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
    factory.addRule(rules[5].ids, {
      formType: 'GROUP',
      formHighlight: ['组六'],
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
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
    factory.addRule(rules[6].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
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

    // 组选包胆
    factory.addRule(rules[7].ids, {
      formType: 'GROUP',
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
        startPos: 0,
      },
      algorithm: algorithm.staticVal,
      algorithmProps: {
        val: 54,
      },
      list: factory.createList(['号码'], {
        operate: 'none',
        limits: [
          {
            name: 'conflict-x', // 球上的样式
            data: {// 需要绑定到球上的数据
              num: 1,
            },
          },
        ],
      }),
      create: algorithm.getCreateFunc(1),
    })

    // 混合组选
    factory.addRule(rules[8].ids, {
      type: 'input',
      formType: 'GROUP',
      keyPosition: rules[0].list,
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

    // //组三单式
    // factory.addRule(rules[9].ids, {
    //  type: 'input',
    //  validate: getValidateFunc(3, {
    //    acceptRepeat: 1,
    //    maxRepeat: 2,
    //    minRepeat: 2,
    //    innerSort: true
    //  }),
    //  create: getCreateFunc(3, {
    //    acceptRepeat: 1,
    //    minRepeat: 2,
    //    maxRepeat: 2,
    //    slice: [2]
    //  })
    // });
    // //组六单式
    // factory.addRule(rules[10].ids, {
    //  type: 'input',
    //  validate: getValidateFunc(3, {
    //    acceptRepeat: 0,
    //    innerSort: true
    //  }),
    //  create: getCreateFunc(3, {
    //    //outerSort: true,
    //    slice: [2]
    //  })
    // });

    // 一码不定位
    factory.addRule(rules[11].ids, {
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
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
    factory.addRule(rules[12].ids, {
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
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

  // 前三
  addThreeRules([
    {
      ids: [ticketId, '030101'],
      list: ['万位', '千位', '百位', null, null],
    },
    {ids: [ticketId, '030102']},
    {ids: [ticketId, '030103']},
    {ids: [ticketId, '030104']},
    {ids: [ticketId, '030201']},
    {ids: [ticketId, '030202']},
    {ids: [ticketId, '030203']},
    {ids: [ticketId, '030204']},
    {ids: [ticketId, '030205']},
    {ids: [29]},
    {ids: [30]},
    {ids: [ticketId, '080101']},
    {ids: [ticketId, '080102']},
  ], {
    playSeriesId: 20003,
    startPos: 0,
  })

  //= =================================================
  // 中三
  addThreeRules([
    {
      ids: [ticketId, '040101'],
      list: [null, '千位', '百位', '十位', null],
    },
    {ids: [ticketId, '040102']},
    {ids: [ticketId, '040103']},
    {ids: [ticketId, '040104']},
    {ids: [ticketId, '040201']},
    {ids: [ticketId, '040202']},
    {ids: [ticketId, '040203']},
    {ids: [ticketId, '040204']},
    {ids: [ticketId, '040205']},
    {ids: [42]},
    {ids: [43]},
    {ids: [ticketId, '080103']},
    {ids: [ticketId, '080104']},
  ], {
    playSeriesId: 20004,
    startPos: 1,
  })

  //= =================================================
  // 后三

  addThreeRules([
    {
      ids: [ticketId, '050101'],
      list: [null, null, '百位', '十位', '个位'],
    },
    {ids: [ticketId, '050102']},
    {ids: [ticketId, '050103']},
    {ids: [ticketId, '050104']},
    {ids: [ticketId, '050201']},
    {ids: [ticketId, '050202']},
    {ids: [ticketId, '050203']},
    {ids: [ticketId, '050204']},
    {ids: [ticketId, '050205']},
    {ids: [55]},
    {ids: [56]},
    {ids: [ticketId, '080105']},
    {ids: [ticketId, '080106']},
  ], {
    playSeriesId: 20005,
    startPos: 2,
  })

  //= =================================================
  // 二星

  function addTwoRules(rules, {playSeriesId, startPos}) {
    // 直选复式
    factory.addRule(rules[0].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'normal',
        playSeriesId,
        startPos,
      },
      algorithm: algorithm.mulAll,
      list: factory.createList(rules[0].list),
      create: algorithm.getCreateFunc(2, {
        repeat: true,
        matching: true,
      }),
    })
    // 直选单式
    factory.addRule(rules[1].ids, {
      formType: 'SUM',
      type: 'input',
      keyPosition: rules[0].list,
      validate: algorithm.getValidateFunc(2),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        repeat: true,
        innerSort: false,
      }),
    })

    // 直选和值
    factory.addRule(rules[2].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      algorithm: algorithm.statistics,
      algorithmProps: {
        selectCount: 2,
      },
      analysis: false,
      list: factory.createList(['号码'], {
        items: _.range(19),
        operate: 'none',
      }),
      create: algorithm.getCreateFunc(1, {
        range: _.range(19),
      }),
    })
    // 跨度
    factory.addRule(rules[3].ids, {
      formType: 'SPAN',
      keyPosition: rules[0].list,
      algorithm: algorithm.fromConfig,
      algorithmProps: {
        config: [10, 18, 16, 14, 12, 10, 8, 6, 4, 2],
      },
      analysis: false,
      list: factory.createList(['号码']),
      create: algorithm.getCreateFunc(1),
    })
    // 组选复式
    factory.addRule(rules[4].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
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
    // 组选单式
    factory.addRule(rules[5].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      type: 'input',
      validate: algorithm.getValidateFunc(2, {
        acceptRepeat: 0,
        innerSort: true,
      }),
      create: algorithm.getCreateFunc(2, {
        slice: [1],
        outerSort: true,
      }),
    })

    // 组选和值
    factory.addRule(rules[6].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      algorithm: algorithm.fromConfig,
      algorithmProps: {
        config: [null, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1],
      },
      list: factory.createList(['号码'], {
        items: _.range(1, 18),
        operate: 'none',
      }),
      analysis: false,
      create: algorithm.getCreateFunc(1, {
        range: _.range(1, 18),
      }),
    })

    // 组选包胆
    factory.addRule(rules[7].ids, {
      formType: 'SUM',
      keyPosition: rules[0].list,
      analysisProps: {
        type: 'distribution',
        playSeriesId,
        startPos: 0,
      },
      algorithm: algorithm.staticVal,
      algorithmProps: {
        val: 9,
      },
      list: factory.createList(['号码'], {
        operate: 'none',
        limits: [
          {
            name: 'conflict-x',
            data: {
              num: 1,
            },
          },
        ],
      }),
      create: algorithm.getCreateFunc(1),
    })
  }

  // 前二

  addTwoRules([
    {
      ids: [ticketId, '560151'],
      list: ['万位', '千位', null, null, null],
    },
    {ids: [ticketId, '560152']},
    {ids: [ticketId, '560153']},
    {ids: [ticketId, '560154']},
    {ids: [ticketId, '560251']},
    {ids: [ticketId, '560252']},
    {ids: [ticketId, '560253']},
    {ids: [ticketId, '560254']},
  ], {
    playSeriesId: 20006,
    startPos: 0,
  })

  //= =================================================
  // 后二

  addTwoRules([
    {
      ids: [ticketId, '570151'],
      list: [null, null, null, '十位', '个位'],
    },
    {ids: [ticketId, '570152']},
    {ids: [ticketId, '570153']},
    {ids: [ticketId, '570154']},
    {ids: [ticketId, '570251']},
    {ids: [ticketId, '570252']},
    {ids: [ticketId, '570253']},
    {ids: [ticketId, '570254']},
  ], {
    playSeriesId: 20007,
    startPos: 3,
  })

  //= =================================================
  // 定位胆

  factory.addRule([ticketId, '070101'], {
    analysisProps: {
      type: 'normal',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    maxPrizeAlgorithm: betMaxPrize.addAll,
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(1, {
      matching: true,
    }),
  })

  //= =================================================
  // 任选二

  // 复式
  factory.addRule([ticketId, '590151'], {
    analysisProps: {
      type: 'normal',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.optionalDouble,
    algorithmProps: {
      coefficient: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.combinations,
    maxPrizeAlgorithmProps: {
      k: 2
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(2, {
      repeat: true,
      matching: true,
    }),
  })

  // 单式
  factory.addRule([ticketId, '590152'], {
    type: 'input',
    validate: algorithm.getValidateFunc(2),
    optionals: algorithm.getOptionals(2),
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 2
    },
    create: algorithm.getCreateFunc(2, {
      slice: [1],
      repeat: true,
      innerSort: false,
    }),
  })

  // 和值
  factory.addRule([ticketId, '590153'], {
    algorithm: algorithm.statistics,
    algorithmProps: {
      selectCount: 2,
    },
    optionals: algorithm.getOptionals(2),
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 2
    },
    list: factory.createList(['号码'], {
      items: _.range(19),
      operate: 'none',
    }),
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: _.range(19),
    }),
  })

  // 组选复式
  factory.addRule([ticketId, '590154'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 2
    },
    optionals: algorithm.getOptionals(2),
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true,
      slice: false,
    }),
  })

  // 组选单式
  factory.addRule([ticketId, '590155'], {
    type: 'input',
    validate: algorithm.getValidateFunc(2, {
      acceptRepeat: 0,
      innerSort: true,
    }),
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 2
    },
    optionals: algorithm.getOptionals(2),
    create: algorithm.getCreateFunc(2, {
      slice: [1],
      outerSort: true,
    }),
  })

  // 组选和值
  factory.addRule([ticketId, '590156'], {
    algorithm: algorithm.fromConfig,
    algorithmProps: {
      config: [null, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1],
    },
    optionals: algorithm.getOptionals(2),
    list: factory.createList(['号码'], {
      items: _.range(1, 18),
      operate: 'none',
    }),
    analysis: false,
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 2
    },
    create: algorithm.getCreateFunc(1, {
      range: _.range(1, 18),
    }),
  })

  //= =================================================
  // 任选三

  // 复式
  factory.addRule([ticketId, '590251'], {
    analysisProps: {
      type: 'normal',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.optionalDouble,
    algorithmProps: {
      coefficient: 3,
    },
    maxPrizeAlgorithm: betMaxPrize.combinations,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(3, {
      repeat: true,
      matching: true,
    }),
  })

  // 单式
  factory.addRule([ticketId, '590252'], {
    type: 'input',
    validate: algorithm.getValidateFunc(3),
    optionals: algorithm.getOptionals(3),
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    create: algorithm.getCreateFunc(3, {
      slice: [2],
      repeat: true,
      innerSort: false,
    }),
  })

  // 直选和值
  factory.addRule([ticketId, '590253'], {
    algorithm: algorithm.statistics,
    algorithmProps: {
      selectCount: 3,
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList(['号码'], {
      items: _.range(28),
      operate: 'none',
    }),
    analysis: false,
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    create: algorithm.getCreateFunc(1, {
      range: _.range(28),
    }),
  })

  // 组三
  factory.addRule([ticketId, '590254'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.factorial,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(2, {
      outerSort: true,
      slice: false,
    }),
  })
  // 组六
  factory.addRule([ticketId, '590255'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: false,
    }),
  })

  // 混合组选
  factory.addRule([ticketId, '590256'], {
    type: 'input',
    validate: algorithm.getValidateFunc(3, {
      acceptRepeat: 1,
      maxRepeat: 2,
      minRepeat: 1,
      innerSort: true,
    }),
    analysis: false,
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    optionals: algorithm.getOptionals(3),
    create: algorithm.getCreateFunc(3, {
      outerSort: true,
      slice: [2],
    }),
  })

  // 组选和值
  factory.addRule([ticketId, '590257'], {
    algorithm: algorithm.fromConfig,
    algorithmProps: {
      config: [null, 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1],
    },
    optionals: algorithm.getOptionals(3),
    list: factory.createList(['号码'], {
      items: _.range(1, 27),
      operate: 'none',
    }),
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 3
    },
    analysis: false,
    create: algorithm.getCreateFunc(1, {
      range: _.range(1, 27),
    }),
  })

  //= =================================================
  // 任选四

  // 复式
  factory.addRule([ticketId, '590351'], {
    analysisProps: {
      type: 'normal',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.optionalDouble,
    algorithmProps: {
      coefficient: 4,
    },
    maxPrizeAlgorithm: betMaxPrize.combinations,
    maxPrizeAlgorithmProps: {
      k: 4
    },
    list: factory.createList(['万位', '千位', '百位', '十位', '个位']),
    create: algorithm.getCreateFunc(4, {
      repeat: true,
      matching: true,
    }),
  })

  // 单式
  factory.addRule([ticketId, '590352'], {
    type: 'input',
    validate: algorithm.getValidateFunc(4),
    optionals: algorithm.getOptionals(4),
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 4
    },
    create: algorithm.getCreateFunc(4, {
      slice: [3],
      repeat: true,
      innerSort: false,
    }),
  })

  // 组选24
  factory.addRule([ticketId, '590353'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 4,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 4
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(4, {
      outerSort: true,
      slice: false,
    }),
  })

  // 组选12
  factory.addRule([ticketId, '590354'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 4
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['二重号位', '单号位']),
    create: algorithm.getCreateFunc(3, {
      slice: [0, 2],
    }),
  })

  // 组选6
  factory.addRule([ticketId, '590355'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 4
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['二重号位']),
    create: algorithm.getCreateFunc(2, {
      // slice: [0, 1],
      slice: false,
    }),
  })

  // 组选4
  factory.addRule([ticketId, '590356'], {
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 1,
    },
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    maxPrizeAlgorithm: betMaxPrize.optional,
    maxPrizeAlgorithmProps: {
      k: 4
    },
    optionals: algorithm.getOptionals(4),
    list: factory.createList(['三重号位', '单号位']),
    create: algorithm.getCreateFunc(2, {
      slice: [0, 1],
      // slice: false,
    }),
  })

  //= =================================================
  // 趣味
  // 后二大小单双
  factory.addRule([ticketId, '670151'], {
    keyPosition: [null, null, null, '十位', '个位'],
    algorithm: algorithm.mulAll,
    maxPrizeAlgorithm: betMaxPrize.daxiaodanshuang,
    list: factory.createList(['十位', '个位'], {
      items: danshuang,
      operate: 'none',
    }),
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(2, {
      range: danshuang,
      repeat: true,
      matching: true,
    }),
  })

  // 后三大小单双
  factory.addRule([ticketId, '670152'], {
    keyPosition: [null, null, '百位', '十位', '个位'],
    algorithm: algorithm.mulAll,
    maxPrizeAlgorithm: betMaxPrize.daxiaodanshuang,
    list: factory.createList(['百位', '十位', '个位'], {
      items: danshuang,
      operate: 'none',
    }),
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(3, {
      range: danshuang,
      repeat: true,
      matching: true,
    }),
  })

  // 前二大小单双
  factory.addRule([ticketId, '670153'], {
    keyPosition: ['万位', '千位', null, null, null],
    algorithm: algorithm.mulAll,
    maxPrizeAlgorithm: betMaxPrize.daxiaodanshuang,
    list: factory.createList(['万位', '千位'], {
      items: danshuang,
      operate: 'none',
    }),
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(2, {
      range: danshuang,
      repeat: true,
      matching: true,
    }),
  })
  // 前三大小单双
  factory.addRule([ticketId, '670154'], {
    keyPosition: ['万位', '千位', '百位', null, null],
    algorithm: algorithm.mulAll,
    maxPrizeAlgorithm: betMaxPrize.daxiaodanshuang,
    list: factory.createList(['万位', '千位', '百位'], {
      items: danshuang,
      operate: 'none',
    }),
    format: {symbol: ' '},
    analysis: false,
    create: algorithm.getCreateFunc(3, {
      range: danshuang,
      repeat: true,
      matching: true,
    }),
  })


  // 一帆风顺
  factory.addRule([ticketId, '680151'], {
    formType: 'GROUP',
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    maxPrizeAlgorithm: betMaxPrize.group,
    maxPrizeAlgorithmProps: {
      n: 5,
      k: 1
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(1),
  })

  // 好事成双
  factory.addRule([ticketId, '680152'], {
    formType: 'GROUP',
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    maxPrizeAlgorithm: betMaxPrize.addAllRow,
    maxPrizeAlgorithmProps: {
      max: 2
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(1),
  })

  // 三星报喜
  factory.addRule([ticketId, '680153'], {
    formType: 'GROUP',
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(1),
  })

  // 四季发财
  factory.addRule([ticketId, '680154'], {
    formType: 'GROUP',
    keyPosition: ['万位', '千位', '百位', '十位', '个位'],
    analysisProps: {
      type: 'distribution',
      playSeriesId: 20001,
      startPos: 0,
    },
    algorithm: algorithm.addAll,
    algorithmProps: {
      mainRow: 0,
      cTimes: 1,
    },
    list: factory.createList(['号码']),
    create: algorithm.getCreateFunc(1),
  })

  // 龙虎和
  factory.addRule([ticketId, '660151'], {
    formType: 'DRAGON',
    keyPosition: ['万位', '千位', null, null, null],
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

  factory.addRule([ticketId, '660152'], {
    formType: 'DRAGON',
    keyPosition: ['万位', null, '百位', null, null],
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

  factory.addRule([ticketId, '660153'], {
    formType: 'DRAGON',
    keyPosition: ['万位', null, null, '十位', null],
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

  factory.addRule([ticketId, '660154'], {
    formType: 'DRAGON',
    keyPosition: ['万位', null, null, null, '个位'],
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

  factory.addRule([ticketId, '660155'], {
    formType: 'DRAGON',
    keyPosition: [null, '千位', '百位', null, null],
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    analysis: false,
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '660156'], {
    formType: 'DRAGON',
    keyPosition: [null, '千位', null, '十位', null],
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    analysis: false,
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '660157'], {
    formType: 'DRAGON',
    keyPosition: [null, '千位', null, null, '个位'],
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    analysis: false,
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '660158'], {
    formType: 'DRAGON',
    keyPosition: [null, null, '百位', '十位', null],
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    analysis: false,
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '660159'], {
    formType: 'DRAGON',
    keyPosition: [null, null, '百位', null, '个位'],
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    analysis: false,
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })

  factory.addRule([ticketId, '660160'], {
    formType: 'DRAGON',
    keyPosition: [null, null, null, '百位', '个位'],
    algorithm: algorithm.addAll,
    list: factory.createList([''], {
      items: longhu,
      operate: 'none',
    }),
    style: {
      numType: 'longhu',
      position: 'center',
    },
    analysis: false,
    format: {symbol: ' '},
    create: algorithm.getCreateFunc(1, {
      range: longhu,
      matching: true,
    }),
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
