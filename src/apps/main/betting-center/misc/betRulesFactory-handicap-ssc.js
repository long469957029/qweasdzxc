import factory from './betRulesFactory'

const fifty = _.range(0, 50)

const getFifty = () => {
  return _.map(fifty, (num, index) => {
    const fNum = `${(num % 10 + (100 * Math.ceil((index + 1) / 10)))}`
    return {
      num: fNum,
      title:  num % 10,
      posName: getPosName(fNum),
      // title: num !== 0 && num % 10 === 0 ? 10 : (num % 10),
      style: 'gray circle',
    }
  })
}

const getPosName = (fNum) => {
  switch (fNum[0]) {
    case '1':
      return '万位'
    case '2':
      return '千位'
    case '3':
      return '百位'
    case '4':
      return '十位'
    case '5':
      return '个位'
  }
}

const getBalls = () => {
  return [
    [
      {
        num: '0',
        title: '0',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '5',
        title: '5',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '101',
        title: '大',
        showOdds: true,
      },
    ],
    [
      {
        num: '1',
        title: '1',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '6',
        title: '6',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '102',
        title: '小',
        showOdds: true,
      },
    ],
    [
      {
        num: '2',
        title: '2',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '7',
        title: '7',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '103',
        title: '单',
        showOdds: true,
      },
    ],
    [
      {
        num: '3',
        title: '3',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '8',
        title: '8',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '104',
        title: '双',
        showOdds: true,
      },
    ],
    [
      {
        num: '4',
        title: '4',
        style: 'gray circle',
        showOdds: true,
      },
      {
        num: '9',
        title: '9',
        style: 'gray circle',
        showOdds: true,
      },
    ],
  ]
}


function _create(ticketId) {
  // 两面盘
  factory.addHandicapRule([ticketId, '210101'], {
    list: factory.createHandicapList([
      {
        title: ['第一球 - 万', '第二球 - 千', '第三球 - 百', '第四球 - 十', '第五球 - 个'],
        items: [
          [
            {
              num: '1',
              title: '大',
              playName: '大小',
              posName: '万位',
              showOdds: true,
            },
            {
              num: '2',
              title: '小',
              playName: '大小',
              posName: '万位',
              showOdds: true,
            },
            {
              num: '3',
              title: '单',
              playName: '单双',
              posName: '万位',
              showOdds: true,
            },
            {
              num: '4',
              title: '双',
              playName: '单双',
              posName: '万位',
              showOdds: true,
            },
          ],
          [
            {
              num: '11',
              title: '大',
              playName: '大小',
              posName: '千位',
              showOdds: true,
            },
            {
              num: '12',
              title: '小',
              playName: '大小',
              posName: '千位',
              showOdds: true,
            },
            {
              num: '13',
              title: '单',
              playName: '单双',
              posName: '千位',
              showOdds: true,
            },
            {
              num: '14',
              title: '双',
              playName: '单双',
              posName: '千位',
              showOdds: true,
            },
          ],
          [
            {
              num: '21',
              title: '大',
              playName: '大小',
              posName: '百位',
              showOdds: true,
            },
            {
              num: '22',
              title: '小',
              playName: '大小',
              posName: '百位',
              showOdds: true,
            },
            {
              num: '23',
              title: '单',
              playName: '单双',
              posName: '百位',
              showOdds: true,
            },
            {
              num: '24',
              title: '双',
              playName: '单双',
              posName: '百位',
              showOdds: true,
            },
          ],
          [
            {
              num: '31',
              title: '大',
              playName: '大小',
              posName: '十位',
              showOdds: true,
            },
            {
              num: '32',
              title: '小',
              playName: '大小',
              posName: '十位',
              showOdds: true,
            },
            {
              num: '33',
              title: '单',
              playName: '单双',
              posName: '十位',
              showOdds: true,
            },
            {
              num: '34',
              title: '双',
              playName: '单双',
              posName: '十位',
              showOdds: true,
            },
          ],
          [
            {
              num: '41',
              title: '大',
              playName: '大小',
              posName: '个位',
              showOdds: true,
            },
            {
              num: '42',
              title: '小',
              playName: '大小',
              posName: '个位',
              showOdds: true,
            },
            {
              num: '43',
              title: '单',
              playName: '单双',
              posName: '个位',
              showOdds: true,
            },
            {
              num: '44',
              title: '双',
              playName: '单双',
              posName: '个位',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和单',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              playName: '总和',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //趣味盘
  factory.addHandicapRule([ticketId, '220101'], {
    list: factory.createHandicapList([
      {
        title: '前三码',
        items: [
          [
            {
              num: '1',
              title: '豹子',
              posName: '前三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '2',
              title: '顺子',
              posName: '前三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '3',
              title: '对子',
              posName: '前三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '4',
              title: '杂六',
              posName: '前三码',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '中三码',
        items: [
          [
            {
              num: '11',
              title: '豹子',
              posName: '中三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '12',
              title: '顺子',
              posName: '中三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '13',
              title: '对子',
              posName: '中三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '14',
              title: '杂六',
              posName: '中三码',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '后三码',
        items: [
          [
            {
              num: '21',
              title: '豹子',
              posName: '后三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '22',
              title: '顺子',
              posName: '后三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '23',
              title: '对子',
              posName: '后三码',
              showOdds: true,
            },
          ],
          [
            {
              num: '24',
              title: '杂六',
              posName: '后三码',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //数字盘
  factory.addHandicapRule([ticketId, '230101'], {
    list: factory.createHandicapList([
      {
        title: ['第一球 - 万', '第二球 - 千', '第三球 - 百', '第四球 - 十', '第五球 - 个'],
        items: _.chunk(getFifty(), 10),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //第一球
  factory.addHandicapRule([ticketId, '310101'], {
    list: factory.createHandicapList([
      {
        title: ['选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   '],
        items: getBalls(),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和单',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //第二球
  factory.addHandicapRule([ticketId, '320101'], {
    list: factory.createHandicapList([
      {
        title: ['选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   '],
        items: getBalls(),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和单',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //第三球
  factory.addHandicapRule([ticketId, '330101'], {
    list: factory.createHandicapList([
      {
        title: ['选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   '],
        items: getBalls(),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和单',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //第四球
  factory.addHandicapRule([ticketId, '340101'], {
    list: factory.createHandicapList([
      {
        title: ['选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   '],
        items: getBalls(),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和单',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //第五球
  factory.addHandicapRule([ticketId, '350101'], {
    list: factory.createHandicapList([
      {
        title: ['选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   ', '选项 赔率        下注   '],
        items: getBalls(),
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '总和/龙虎',
        items: [
          [
            {
              num: '1001',
              title: '总和大',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1097',
              title: '龙',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1002',
              title: '总和小',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1098',
              title: '虎',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1003',
              title: '总和单',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
            {
              num: '1099',
              title: '和',
              levelName: '双面盘',
              playName: '龙虎',
              showOdds: true,
            },
          ],
          [
            {
              num: '1004',
              title: '总和双',
              levelName: '双面盘',
              playName: '总和',
              showOdds: true,
            },
          ],
        ],
        showOdds: true,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  //龙虎斗
  factory.addHandicapRule([ticketId, '250101'], {
    list: factory.createHandicapList([
      {
        title: ['万 VS 千', '万 VS 百', '万 VS 十', '万 VS 个'],
        items: [
          [
            {
              num: '241',
              title: '龙',
              posName: '万VS千',
              showOdds: true,
            },
            {
              num: '242',
              title: '虎',
              posName: '万VS千',
              showOdds: true,
            },
            {
              num: '243',
              title: '和',
              posName: '万VS千',
              showOdds: true,
            },
          ],
          [
            {
              num: '201',
              title: '龙',
              posName: '万VS百',
              showOdds: true,
            },
            {
              num: '202',
              title: '虎',
              posName: '万VS百',
              showOdds: true,
            },
            {
              num: '203',
              title: '和',
              posName: '万VS百',
              showOdds: true,
            },
          ],
          [
            {
              num: '181',
              title: '龙',
              posName: '万VS十',
              showOdds: true,
            },
            {
              num: '182',
              title: '虎',
              posName: '万VS十',
              showOdds: true,
            },
            {
              num: '183',
              title: '和',
              posName: '万VS十',
              showOdds: true,
            },
          ],
          [
            {
              num: '171',
              title: '龙',
              posName: '万VS个',
              showOdds: true,
            },
            {
              num: '172',
              title: '虎',
              posName: '万VS个',
              showOdds: true,
            },
            {
              num: '173',
              title: '和',
              posName: '万VS个',
              showOdds: true,
            },
          ],
        ],
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: ['千 VS 百', '千 VS 十', '千 VS 个', ''],
        items: [
          [
            {
              num: '121',
              title: '龙',
              posName: '千VS百',
              showOdds: true,
            },
            {
              num: '122',
              title: '虎',
              posName: '千VS百',
              showOdds: true,
            },
            {
              num: '123',
              title: '和',
              posName: '千VS百',
              showOdds: true,
            },
          ],
          [
            {
              num: '101',
              title: '龙',
              posName: '千VS十',
              showOdds: true,
            },
            {
              num: '102',
              title: '虎',
              posName: '千VS十',
              showOdds: true,
            },
            {
              num: '103',
              title: '和',
              posName: '千VS十',
              showOdds: true,
            },
          ],
          [
            {
              num: '91',
              title: '龙',
              posName: '千VS个',
              showOdds: true,
            },
            {
              num: '92',
              title: '虎',
              posName: '千VS个',
              showOdds: true,
            },
            {
              num: '93',
              title: '和',
              posName: '千VS个',
              showOdds: true,
            },
          ],
          []
        ],

        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: ['百 VS 十', '百 VS 个', '十 VS 个', ''],
        items: [
          [
            {
              num: '61',
              title: '龙',
              posName: '百VS十',
              showOdds: true,
            },
            {
              num: '62',
              title: '虎',
              posName: '百VS十',
              showOdds: true,
            },
            {
              num: '63',
              title: '和',
              posName: '百VS十',
              showOdds: true,
            },
          ],
          [
            {
              num: '51',
              title: '龙',
              posName: '百VS个',
              showOdds: true,
            },
            {
              num: '52',
              title: '虎',
              posName: '百VS个',
              showOdds: true,
            },
            {
              num: '53',
              title: '和',
              posName: '百VS个',
              showOdds: true,
            },
          ],
          [
            {
              num: '31',
              title: '龙',
              posName: '十VS个',
              showOdds: true,
            },
            {
              num: '32',
              title: '虎',
              posName: '十VS个',
              showOdds: true,
            },
            {
              num: '33',
              title: '和',
              posName: '十VS个',
              showOdds: true,
            },
          ],
          []
        ],

        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })
}

module.exports = {
  install(ticketId) {
    _create(ticketId)
  },
}
