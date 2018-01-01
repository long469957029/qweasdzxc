import factory from 'bettingCenter/misc/betRulesFactory'

const algorithm = require('bettingCenter/misc/betRulesAlgorithm')

const redArr = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blueArr = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const greenArr = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

// 特码-色波
const tm_sebo = [
  { name: '红', value: 0, color: 'red' }, { name: '红大', value: 1, color: 'red' }, { name: '红小', value: 2, color: 'red' },
  { name: '红单', value: 3, color: 'red' }, { name: '红双', value: 4, color: 'red' }, { name: '红大单', value: 5, color: 'red' },
  { name: '红大双', value: 6, color: 'red' }, { name: '红小单', value: 7, color: 'red' }, { name: '红小双', value: 8, color: 'red' },
  { name: '蓝', value: 9, color: 'blue' }, { name: '蓝大', value: 10, color: 'blue' }, { name: '蓝小', value: 11, color: 'blue' },
  { name: '蓝单', value: 12, color: 'blue' }, { name: '蓝双', value: 13, color: 'blue' }, { name: '蓝大单', value: 14, color: 'blue' },
  { name: '蓝大双', value: 15, color: 'blue' }, { name: '蓝小单', value: 16, color: 'blue' }, { name: '蓝小双', value: 17, color: 'blue' },
  { name: '绿', value: 18, color: 'green' }, { name: '绿大', value: 19, color: 'green' }, { name: '绿小', value: 20, color: 'green' },
  { name: '绿单', value: 21, color: 'green' }, { name: '绿双', value: 22, color: 'green' }, { name: '绿大单', value: 23, color: 'green' },
  { name: '绿大双', value: 24, color: 'green' }, { name: '绿小单', value: 25, color: 'green' }, { name: '绿小双', value: 26, color: 'green' },
]

// 特码-双面
const tm_lm = [
  { name: '大', value: 0 }, { name: '小', value: 1 }, { name: '合大', value: 2 }, { name: '合小', value: 3 },
  { name: '单', value: 4 }, { name: '双', value: 5 }, { name: '合单', value: 6 }, { name: '合双', value: 7 },
  { name: '大肖', value: 8 }, { name: '小肖', value: 9 }, { name: '尾大', value: 10 }, { name: '尾小', value: 11 },
]

// 正码-两面
const zm_lm = [
  { name: '大', value: 0 }, { name: '小', value: 1 }, { name: '合大', value: 2 }, { name: '合小', value: 3 }, { name: '红', value: 12, color: 'red' },
  { name: '单', value: 4 }, { name: '双', value: 5 }, { name: '合单', value: 6 }, { name: '合双', value: 7 }, { name: '蓝', value: 13, color: 'blue' },
  { name: '大肖', value: 8 }, { name: '小肖', value: 9 }, { name: '尾大', value: 10 }, { name: '尾小', value: 11 }, { name: '绿', value: 14, color: 'green' },
]

// 生肖-特肖
const sx_sx = [
  { id: 0, name: '鼠', value: 0 }, { id: 1, name: '牛', value: 1 }, { id: 2, name: '虎', value: 2 }, { id: 3, name: '兔', value: 3 },
  { id: 4, name: '龙', value: 4 }, { id: 5, name: '蛇', value: 5 }, { id: 6, name: '马', value: 6 }, { id: 7, name: '羊', value: 7 },
  { id: 8, name: '猴', value: 8 }, { id: 9, name: '鸡', value: 9 }, { id: 10, name: '狗', value: 10 }, { id: 11, name: '猪', value: 11 },
]

// 头尾-头尾
const tw_tw = [
  { name: '尾0', nums: ['10', '20', '30', '40'], value: 5 }, { name: '尾1', nums: ['01', '11', '21', '31', '41'], value: 6 },
  { name: '尾2', nums: ['02', '12', '22', '32', '42'], value: 7 }, { name: '尾3', nums: ['03', '13', '23', '33', '43'], value: 8 },
  { name: '尾4', nums: ['04', '14', '24', '34', '44'], value: 9 }, { name: '尾5', nums: ['05', '15', '25', '35', '45'], value: 10 },
  { name: '尾6', nums: ['06', '16', '26', '36', '46'], value: 11 }, { name: '尾7', nums: ['07', '17', '27', '37', '47'], value: 12 },
  { name: '尾8', nums: ['08', '18', '28', '38', '48'], value: 13 }, { name: '尾9', nums: ['09', '19', '29', '39', '49'], value: 14 },
  { name: '头0', nums: ['01', '02', '03', '04', '05', '06', '07', '08', '09'], value: 0 },
  { name: '头1', nums: ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'], value: 1 },
  { name: '头2', nums: ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29'], value: 2 },
  { name: '头3', nums: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39'], value: 3 },
  { name: '头4', nums: ['40', '41', '42', '43', '44', '45', '46', '47', '48', '49'], value: 4 },
]

// 总和-总和
const zh_zh = [
  { name: '大', value: 0 }, { name: '小', value: 1 }, { name: '单', value: 2 }, { name: '双', value: 3 },
  { name: '大单', value: 4 }, { name: '大双', value: 5 }, { name: '小单', value: 6 }, { name: '小双', value: 7 },
]


const fortyNine = []
for (let i = 1; i < 50; i++) {
  let color = 'green'
  if (_.indexOf(redArr, i) > -1) {
    color = 'red'
  } else if (_.indexOf(blueArr, i) > -1) {
    color = 'blue'
  }
  if (i < 10) {
    fortyNine.push({ number: `0${i}`, color })
  } else {
    fortyNine.push({ number: i.toString(), color })
  }
}

function _create(ticketId) {
  // 特码-特码-特码
  factory.addRule([ticketId, '010101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-tm-tm-select', // 球上的样式
          // data: {//需要绑定到球上的数据
          //   num: 0
          // }
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-tm',
        playClassName: 'mark6-tm-tm',
        numberClassName: 'mark6-tm-tm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true, // 生肖选号，大小单双选号,头尾换号
      },
    }),
  })

  // 特码-特码-两面
  factory.addRule([ticketId, '010102'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: tm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-tm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-tm',
        playClassName: 'mark6-tm-lm',
        numberClassName: 'mark6-tm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: tm_lm,
  })

  // 特码-特码-色波
  factory.addRule([ticketId, '010103'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: tm_sebo,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-tm-sebo-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-tm',
        playClassName: 'mark6-tm-sebo',
        numberClassName: 'mark6-tm-sebo-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: tm_sebo,
  })

  // 正码-正码-正码
  factory.addRule([ticketId, '020101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-正码-正码1
  factory.addRule([ticketId, '020102'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-正码-正码2
  factory.addRule([ticketId, '020103'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-正码-正码3
  factory.addRule([ticketId, '020104'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-正码-正码4
  factory.addRule([ticketId, '020105'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-正码-正码5
  factory.addRule([ticketId, '020106'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-正码-正码6
  factory.addRule([ticketId, '020107'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-zm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-zm',
        numberClassName: 'mark6-zm-zm-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        groupSelect: true,
      },
    }),
  })

  // 正码-两面-正码1
  factory.addRule([ticketId, '020201'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-lm',
        numberClassName: 'mark6-zm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zm_lm,
  })

  // 正码-两面-正码2
  factory.addRule([ticketId, '020202'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-lm',
        numberClassName: 'mark6-zm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zm_lm,
  })

  // 正码-两面-正码3
  factory.addRule([ticketId, '020203'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-lm',
        numberClassName: 'mark6-zm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zm_lm,
  })

  // 正码-两面-正码4
  factory.addRule([ticketId, '020204'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-lm',
        numberClassName: 'mark6-zm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zm_lm,
  })

  // 正码-两面-正码5
  factory.addRule([ticketId, '020205'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-lm',
        numberClassName: 'mark6-zm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zm_lm,
  })

  // 正码-两面-正码6
  factory.addRule([ticketId, '020206'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zm_lm,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zm-lm-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zm',
        playClassName: 'mark6-zm-lm',
        numberClassName: 'mark6-zm-lm-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zm_lm,
  })

  // 生肖-生肖-特肖
  factory.addRule([ticketId, '030101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: sx_sx, // 显示的数据bettingCenter.js renderPlayArea方法中作了处理
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-sx-sx-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-sx',
        playClassName: 'mark6-sx-sx',
        numberClassName: 'mark6-sx-sx-select-number',
        sxColorArr: {
          redArr,
          blueArr,
          greenArr,
        },
      },
    }),
    formatToNum: true,
    formatToNumInfo: sx_sx,
  })

  // 生肖-生肖-正肖
  /* factory.addRule([ticketId, '030102'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: {},  // 显示的数据bettingCenter.js renderPlayArea方法中作了处理
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-sx-sx-select' //球上的样式
        }
      ],
      htmlNeedInfo: {
        listClassName: "mark6",
        levelClassName: "mark6-sx",
        playClassName: "mark6-sx-sx",
        numberClassName: "mark6-sx-sx-select-number",
        peilvNum: 7.8,
        sxColorArr: {
          redArr: redArr,
          blueArr: blueArr,
          greenArr: greenArr
        }
      }
    }),
    formatToNum: true,
    formatToNumInfo: sx_sx
  }); */

  // 生肖-生肖-一肖
  factory.addRule([ticketId, '030103'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: sx_sx, // 显示的数据bettingCenter.js renderPlayArea方法中作了处理
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-sx-sx-select', // 球上的样式
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-sx',
        playClassName: 'mark6-sx-sx',
        numberClassName: 'mark6-sx-sx-select-number',
        sxColorArr: {
          redArr,
          blueArr,
          greenArr,
        },
      },
    }),
    formatToNum: true,
    formatToNumInfo: sx_sx,
  })

  // 头尾数-头尾数-头尾数
  factory.addRule([ticketId, '040101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: tw_tw,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-tw-tw-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-tw',
        playClassName: 'mark6-tw-tw',
        numberClassName: 'mark6-tw-tw-select-number',
        twColorArr: {
          redArr,
          blueArr,
          greenArr,
        },
      },
    }),
    formatToNum: true,
    formatToNumInfo: tw_tw,
  })

  // 总和-总和-总和
  factory.addRule([ticketId, '050101'], {
    algorithm: algorithm.addAll,
    list: factory.createList(['无'], {
      items: zh_zh,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-zh-zh-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-zh',
        playClassName: 'mark6-zh-zh',
        numberClassName: 'mark6-zh-zh-select-number',
      },
    }),
    formatToNum: true,
    formatToNumInfo: zh_zh,
  })

  // 不中-不中-五不中
  factory.addRule([ticketId, '060101'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 5,
    },
    create: algorithm.getCreateFunc(5, {
      outerSort: true,
    }),
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-bz-bz-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-bz',
        playClassName: 'mark6-bz-bz',
        numberClassName: 'mark6-bz-bz-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        oddsLabelText: '五不中赔率',
      },
    }),
  })

  // 不中-不中-六不中
  factory.addRule([ticketId, '060102'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 6,
    },
    create: algorithm.getCreateFunc(6, {
      outerSort: true,
    }),
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-bz-bz-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-bz',
        playClassName: 'mark6-bz-bz',
        numberClassName: 'mark6-bz-bz-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        oddsLabelText: '六不中赔率',
      },
    }),
  })

  // 不中-不中-七不中
  factory.addRule([ticketId, '060103'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 7,
    },
    create: algorithm.getCreateFunc(7, {
      outerSort: true,
    }),
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-bz-bz-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-bz',
        playClassName: 'mark6-bz-bz',
        numberClassName: 'mark6-bz-bz-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        oddsLabelText: '七不中赔率',
      },
    }),
  })

  // 不中-不中-八不中
  factory.addRule([ticketId, '060104'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 8,
    },
    create: algorithm.getCreateFunc(8, {
      outerSort: true,
    }),
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-bz-bz-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-bz',
        playClassName: 'mark6-bz-bz',
        numberClassName: 'mark6-bz-bz-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        oddsLabelText: '八不中赔率',
      },
    }),
  })

  // 不中-不中-九不中
  factory.addRule([ticketId, '060105'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 9,
    },
    create: algorithm.getCreateFunc(9, {
      outerSort: true,
    }),
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-bz-bz-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-bz',
        playClassName: 'mark6-bz-bz',
        numberClassName: 'mark6-bz-bz-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        oddsLabelText: '九不中赔率',
      },
    }),
  })

  // 不中-不中-十不中
  factory.addRule([ticketId, '060106'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 10,
    },
    create: algorithm.getCreateFunc(10, {
      outerSort: true,
    }),
    list: factory.createList(['无'], {
      items: fortyNine,
      operate: 'none',
      limits: [
        {
          name: 'treble1 mark6-bz-bz-select',
        },
      ],
      htmlNeedInfo: {
        listClassName: 'mark6',
        levelClassName: 'mark6-bz',
        playClassName: 'mark6-bz-bz',
        numberClassName: 'mark6-bz-bz-select-number',
        colorArr: {
          redArr,
          blueArr,
          greenArr,
        },
        oddsLabelText: '十不中赔率',
      },
    }),
  })
}

module.exports = {
  install (ticketId) {
    _create(ticketId)
  },
  // 返回六合彩号码球颜色
  getMark6NumberColor () {
    return {
      redArr,
      blueArr,
      greenArr,
    }
  },
  getMark6SpecialInfo () {
    // 六合彩、无限六合彩
    return {
      // 生肖组LevelId
      sxLevelIdArr: [3403, 3503],
      // 头尾组LevelId
      twLevelIdArr: [3404, 3504],
      // 特码-特码、正码-正码、正码-正码1、正码-正码2、正码-正码3、正码-正码4、正码-正码5、正码-正码6
      tm_zm_playIdArr: [34010101, 34020101, 34020102, 34020103, 34020104, 34020105, 34020106, 34020107,
        35010101, 35020101, 35020102, 35020103, 35020104, 35020105, 35020106, 35020107],
      // 特码-两面，特码-色波，正码-两面1，正码-两面2，正码-两面3，正码-两面4，正码-两面5，正码-两面6，生肖-特肖，生肖-一肖，头尾-头尾，总和-总和
      tm_zm_sx_tw_zh_playIdArr: [34010102, 34010103, 34020201, 34020202, 34020203, 34020204, 34020205, 34020206, 34030101, 34030103, 34040101, 34050101,
        35010102, 35010103, 35020201, 35020202, 35020203, 35020204, 35020205, 35020206, 35030101, 35030103, 35040101, 35050101],
      // 正码-两面类型
      zm_groupIdArr: [340202, 350202],
      bz_groupIdArr: [340601, 350601],
    }
  },
}
