import factory from 'bettingCenter/misc/betRulesFactory'

const algorithm = require('bettingCenter/misc/betRulesAlgorithm')

const ten = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']

const danshuang = ['大', '小', '单', '双']

const splitReg = /[\r\n,;:\|]+/

function _create(ticketId) {
  //= =================================================
  // 猜前一

  // 直选复式
  factory.addRule([ticketId, '010101'], {
    algorithm: algorithm.mulAllNotRepeat,
    keyPosition: ['冠军'],
    list: factory.createList(['冠军'], {
      items: ten,
    }),
    format: { symbol: ' ' },
    create: algorithm.getCreateFunc(2, {
      range: ten,
      matching: true,
    }),
  })

  //= =============================
  // 猜前二

  // 直选复式
  factory.addRule([ticketId, '020101'], {
    algorithm: algorithm.mulAllNotRepeat,
    keyPosition: ['冠军', '亚军'],
    list: factory.createList(['冠军', '亚军'], {
      items: ten,
    }),
    format: { symbol: ' ' },
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
    format: { symbol: ' ' },
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
    keyPosition: ['冠军', '亚军', '季军'],
    list: factory.createList(['冠军', '亚军', '季军'], {
      items: ten,
    }),
    format: { symbol: ' ' },
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
    format: { symbol: ' ' },
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
    keyPosition: ['冠军', '亚军', '季军', '第四名'],
    list: factory.createList(['冠军', '亚军', '季军', '第四名'], {
      items: ten,
    }),
    format: { symbol: ' ' },
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
    format: { symbol: ' ' },
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
    keyPosition: ['冠军', '亚军', '季军', '第四名', '第五名'],
    list: factory.createList(['冠军', '亚军', '季军', '第四名', '第五名'], {
      items: ten,
    }),
    format: { symbol: ' ' },
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
    format: { symbol: ' ' },
    create: algorithm.getCreateFunc(5, {
      range: ten,
      repeat: true,
      innerSort: false,
    }),
  })

  //= ============================
  // 定位胆

  factory.addRule([ticketId, '060101'], {
    // type: 'multiPage',
    page: 5,
    algorithm: algorithm.addAll,
    list: factory.createList(['冠军', '亚军', '季军', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名'], {
      items: ten,
    }),
    format: { symbol: ' ' },
    create: algorithm.getCreateFunc(2, {
      range: ten,
      matching: true,
    }),
  })

  //= =========================
  // 大小单双

  factory.addRule([ticketId, '070101'], {
    algorithm: algorithm.addAll,
    keyPosition: ['冠军', '亚军', '季军'],
    list: factory.createList(['冠军', '亚军', '季军'], {
      items: danshuang,
      operate: 'none',
    }),
    format: { symbol: ' ' },
    formatToNum: true,
    analysis: false,
    create: algorithm.getCreateFunc(2, {
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
    list: factory.createList([''], {
      items: _.range(3, 20),
      operate: 'none',
    }),
  })

  // 冠亚季军和值
  factory.addRule([ticketId, '170102'], {
    algorithm: algorithm.addAll,
    formType: 'SUM',
    keyPosition: ['冠军', '亚军', '季军'],
    analysis: false,
    list: factory.createList([''], {
      items: _.range(6, 28),
      operate: 'none',
    }),
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
