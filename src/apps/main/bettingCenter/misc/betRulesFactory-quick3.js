'use scrict'

const factory = require('bettingCenter/misc/betRulesFactory')
const algorithm = require('bettingCenter/misc/betRulesAlgorithm')

const six = ['1', '2', '3', '4', '5', '6']

const trebleSameTongxuan = ['三同号通选']
const trebleDanxuan = ['111', '222', '333', '444', '555', '666']

const trebleSerialTongxuan = ['三连号通选']

const doubleFuxuan = ['11', '22', '33', '44', '55', '66']

function createDanTuo(num) {
  return [
    {
      title: '胆码',
      items: six,
      operate: 'none',
      limits: [
        {
          name: 'conflict-x',
          data: {
            num,
          },
        },
        { name: 'conflict-y' },
      ],
    }, {
      title: '拖码',
      items: six,
      operate: 'none',
      limits: [{ name: 'conflict-y' }],
    },
  ]
}

function _create(ticketId) {
  //= =================================================
  // 和值

  factory.addRule([ticketId, '170101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: _.range(3, 19),
      // operate: 'none'
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
      row: 2,
      operate: 'block',
    },
  })


  //= =============================
  // 三同号通选

  factory.addRule([ticketId, '180101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: ['0'],
      showItems: trebleSameTongxuan,
      operate: 'clear',
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
    formatToNum: true,
  })


  //= =============================
  // 三同号单选

  factory.addRule([ticketId, '180102'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: trebleDanxuan,
      doublenum: true,
      operate: 'clear',
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
  })


  //= =============================
  // 三不同号

  // 标准
  factory.addRule([ticketId, '190101'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 3,
    },
    list: factory.createList(['无'], {
      items: six,
      operate: 'clear',
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
  })

  // 胆拖
  factory.addRule([ticketId, '190102'], {
    algorithm: algorithm.banker,
    algorithmProps: {
      num: 3,
    },
    format: { symbol: ' ' },
    list: factory.createList(createDanTuo(2)),
    create: algorithm.getCreateFunc(3, {
      range: six,
      innerSort: true,
    }),
  })

  // factory.addRule([ticketId, '040102'], {
  //   algorithm: algorithm.banker,
  //   algorithmProps: {
  //     num: 2
  //   },
  //   format: {symbol: ' '},
  //   list: factory.createList(createDanTuo(1)),
  //   create: algorithm.getCreateFunc(3, {
  //     range: six,
  //     innerSort: true
  //   })
  // });

  //= =============================
  // 三连号通选
  factory.addRule([ticketId, '200101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: ['0'],
      showItems: trebleSerialTongxuan,
      operate: 'clear',
      limits: [
        {
          name: 'treble1', // 球上的样式
          // data: {//需要绑定到球上的数据
          //   num: 0
          // }
        },
      ],
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
    formatToNum: true,
  })

  //= ============================
  // 二同号复选

  factory.addRule([ticketId, '210101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: doubleFuxuan,
      doublenum: true,
      operate: 'clear',
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
  })

  factory.addRule([ticketId, '210102'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 1,
      cTimes: 1,
    },
    // format: {symbol: ' '},
    list: factory.createList([
      {
        title: '二同号',
        items: six,
        showItems: doubleFuxuan,
        operate: 'clear',
        limits: [
          { name: 'conflict-y' },
        ],
        doubleNum: true,
      },
      {
        title: '不同号',
        items: six,
        showItems: six,
        operate: 'clear',
        limits: [{ name: 'conflict-y' }],
      },
    ]),
    topOp: 'none',
    style: {
      numType: 'square square-big',
      position: 'center-2',
    },
    create: algorithm.getCreateFunc(3, {
      range: six,
      innerSort: true,
    }),
  })

  // ==========================
  // 二不同号

  // 标准
  factory.addRule([ticketId, '220101'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 2,
    },
    list: factory.createList(['无'], {
      items: six,
      operate: 'clear',
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
  })

  // 胆拖
  // factory.addRule([ticketId, '220102'], {
  //   algorithm: algorithm.banker,
  //   algorithmProps: {
  //     num: 3,
  //   },
  //   format: { symbol: ' ' },
  //   list: factory.createList(createDanTuo(2)),
  //   create: algorithm.getCreateFunc(3, {
  //     range: six,
  //     innerSort: true,
  //   }),
  // })

  // ==========================
  // 猜就中一个号码
  factory.addRule([ticketId, '230101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: six,
      operate: 'clear',
    }),
    topOp: 'none',
    style: {
      numType: 'square',
      position: 'center',
    },
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
