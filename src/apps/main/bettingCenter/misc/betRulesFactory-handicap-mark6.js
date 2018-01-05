import factory from 'bettingCenter/misc/betRulesFactory'
import { chunk } from 'lodash'
import betFormat from './betFormat'

const algorithm = require('bettingCenter/misc/betRulesAlgorithm')

const redList = ['01', '02', '07', '08', '12', '13', '18', '19', '23', '24', '29', '30', '34', '35', '40', '45', '46']
const blueList = ['03', '04', '09', '10', '14', '15', '20', '25', '26', '31', '36', '37', '41', '42', '47', '48']
const greenList = ['05', '06', '11', '16', '17', '21', '22', '27', '28', '32', '33', '38', '39', '43', '44', '49']

const fortyNine = _.range(1, 50)

const getFortyNine = () => {
  return _.map(fortyNine, (num) => {
    num = num < 10 ? `0${num}` : `${num}`
    if (_.indexOf(redList, num) > -1) {
      return {
        num,
        title: num,
        style: 'red circle',
      }
    } else if (_.indexOf(blueList, num) > -1) {
      return {
        num,
        title: num,
        style: 'blue circle',
      }
    } else if (_.indexOf(greenList, num) > -1) {
      return {
        num,
        title: num,
        style: 'green circle',
      }
    }
  })
}

const getSpecialFortyNine = () => {
  return _.chain(getFortyNine()).groupBy((item) => { return item.num[item.num.length - 1] })
    .values().sortBy((itemList) => { return itemList[0].num })
    .flatten()
    .value()
}

const shuangMian = [
  [
    {
      title: '特大',
      num: '100',
      showOdds: true,
    },
    {
      title: '特小',
      num: '101',
      showOdds: true,
    },
  ],
  [
    {
      title: '特单',
      num: '104',
      showOdds: true,
    },
    {
      title: '特双',
      num: '105',
      showOdds: true,
    },
  ],
  [
    {
      title: '和大',
      num: '102',
      showOdds: true,
    },
    {
      title: '和小',
      num: '103',
      showOdds: true,
    },
  ],
  [
    {
      title: '和单',
      num: '106',
      showOdds: true,
    },
    {
      title: '和双',
      num: '107',
      showOdds: true,
    },
  ],
  [
    {
      title: '尾大',
      num: '110',
      showOdds: true,
    },
    {
      title: '尾小',
      num: '111',
      showOdds: true,
    },
  ],
]

const teMaWeiShu = [
  [
    {
      title: '尾0',
      num: '205',
      showOdds: true,
    },
    {
      title: '尾5',
      num: '210',
      showOdds: true,
    },
  ],
  [
    {
      title: '尾1',
      num: '206',
      showOdds: true,
    },
    {
      title: '尾6',
      num: '211',
      showOdds: true,
    },
  ],
  [
    {
      title: '尾2',
      num: '207',
      showOdds: true,
    },
    {
      title: '尾7',
      num: '212',
      showOdds: true,
    },
  ],
  [
    {
      title: '尾3',
      num: '208',
      showOdds: true,
    },
    {
      title: '尾8',
      num: '213',
      showOdds: true,
    },
  ],
  [
    {
      title: '尾4',
      num: '209',
      showOdds: true,
    },
    {
      title: '尾9',
      num: '214',
      showOdds: true,
    },
  ],
]

const shengXiao = [
  {
    title: '鼠',
    numList: ['10', '22', '34', '46'],
  },
  {
    title: '牛',
    numList: ['09', '21', '33', '45'],
  },
  {
    title: '虎',
    numList: ['08', '20', '32', '44'],
  },
  {
    title: '兔',
    numList: ['07', '19', '31', '43'],
  },
  {
    title: '龙',
    numList: ['06', '18', '30', '42'],
  },
  {
    title: '蛇',
    numList: ['05', '17', '29', '41'],
  },
  {
    title: '马',
    numList: ['04', '16', '28', '40'],
  },
  {
    title: '羊',
    numList: ['03', '15', '27', '39'],
  },
  {
    title: '猴',
    numList: ['02', '14', '26', '38'],
  },
  {
    title: '鸡',
    numList: ['01', '13', '25', '37', '49'],
  },
  {
    title: '狗',
    numList: ['12', '24', '36', '48'],
  },
  {
    title: '猪',
    numList: ['11', '23', '35', '47'],
  },
]

const teXiao = [
  [
    {
      title: '鼠',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '鼠' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '0',
    },
    {
      title: '牛',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '牛' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '1',
    },
    {
      title: '虎',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '虎' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '2',
    },
    {
      title: '兔',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '兔' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '3',
    },
    {
      title: '龙',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '龙' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '4',
    },
    {
      title: '蛇',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '蛇' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '5',
    },
  ],
  [
    {
      title: '马',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '马' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '6',
    },
    {
      title: '羊',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '羊' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '7',
    },
    {
      title: '猴',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '猴' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '8',
    },
    {
      title: '鸡',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '鸡' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '9',
    },
    {
      title: '狗',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '狗' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '10',
    },
    {
      title: '猪',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '猪' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '11',
    },
  ],
]

const yiXiao = [
  [
    {
      title: '鼠',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '鼠' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '100',
    },
    {
      title: '牛',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '牛' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '101',
    },
    {
      title: '虎',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '虎' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '102',
    },
    {
      title: '兔',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '兔' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '103',
    },
    {
      title: '龙',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '龙' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '104',
    },
    {
      title: '蛇',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '蛇' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '105',
    },
  ],
  [
    {
      title: '马',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '马' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '106',
    },
    {
      title: '羊',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '羊' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '107',
    },
    {
      title: '猴',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '猴' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '108',
    },
    {
      title: '鸡',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '鸡' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '109',
    },
    {
      title: '狗',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '狗' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '110',
    },
    {
      title: '猪',
      row: _.filter(getFortyNine(), (numInfo) => { return _.indexOf(_.findWhere(shengXiao, { title: '猪' }).numList, numInfo.num) !== -1 }),
      showOdds: true,
      num: '111',
    },
  ],
]

const zongHe = [
  [
    {
      title: '大',
      num: '0',
      showOdds: true,
    },
    {
      title: '小',
      num: '1',
      showOdds: true,
    },
  ],
  [
    {
      title: '单',
      num: '2',
      showOdds: true,
    },
    {
      title: '双',
      num: '3',
      showOdds: true,
    },
  ],
  [
    {
      title: '大单',
      num: '4',
      showOdds: true,
    },
    {
      title: '大双',
      num: '5',
      showOdds: true,
    },
  ],
  [
    {
      title: '小单',
      num: '6',
      showOdds: true,
    },
    {
      title: '小双',
      num: '7',
      showOdds: true,
    },
  ],
]

function _create(ticketId) {
  // 特码
  factory.addHandicapRule([ticketId, '210101'], {
    list: factory.createHandicapList([
      {
        title: '特码',
        items: chunk(getFortyNine(), 10),
        showOdds: false,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'handicap',
      },
      {
        title: '双面',
        items: shuangMian,
        showOdds: false,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '特码尾数',
        items: teMaWeiShu,
        showOdds: false,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  // 生肖
  factory.addHandicapRule([ticketId, '220101'], {
    list: factory.createHandicapList([
      {
        title: '特肖',
        items: teXiao,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
      {
        title: '一肖',
        items: yiXiao,
        showItemOdds: true,
        showMoneyInput: true,
        operate: 'none',
      },
    ]),
    bettingArea: ['top', 'bottom'],
  })

  // 不中

  // 五不中
  factory.addHandicapRule([ticketId, '230101'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 5,
    },
    list: factory.createHandicapList([
      {
        title: '五不中',
        items: chunk(getSpecialFortyNine(), 5),
        showItemOdds: false,
        showMoneyInput: false,
        operate: 'none',
      },
    ]),
    showItemOdds: false,
    showMoneyInput: false,
    bettingArea: ['bottom'],
    format: betFormat.multiFirst,
    showFormat: betFormat.handicapSpecial
  })

  // 六不中
  factory.addHandicapRule([ticketId, '230102'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 6,
    },
    list: factory.createHandicapList([
      {
        title: '六不中',
        items: chunk(getSpecialFortyNine(), 5),
        showItemOdds: false,
        showMoneyInput: false,
        operate: 'none',
      },
    ]),
    showItemOdds: false,
    showMoneyInput: false,
    bettingArea: ['bottom'],
    format: betFormat.multiFirst,
    showFormat: betFormat.handicapSpecial
  })

  // 七不中
  factory.addHandicapRule([ticketId, '230103'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 7,
    },
    list: factory.createHandicapList([
      {
        title: '七不中',
        items: chunk(getSpecialFortyNine(), 5),
        showItemOdds: false,
        showMoneyInput: false,
        operate: 'none',
      },
    ]),
    showItemOdds: false,
    showMoneyInput: false,
    bettingArea: ['bottom'],
    format: betFormat.multiFirst,
    showFormat: betFormat.handicapSpecial
  })

  // 八不中
  factory.addHandicapRule([ticketId, '230104'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 8,
    },
    list: factory.createHandicapList([
      {
        title: '八不中',
        items: chunk(getSpecialFortyNine(), 5),
        showItemOdds: false,
        showMoneyInput: false,
        operate: 'none',
      },
    ]),
    showItemOdds: false,
    showMoneyInput: false,
    bettingArea: ['bottom'],
    format: betFormat.multiFirst,
    showFormat: betFormat.handicapSpecial
  })

  // 九不中
  factory.addHandicapRule([ticketId, '230105'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 9,
    },
    list: factory.createHandicapList([
      {
        title: '九不中',
        items: chunk(getSpecialFortyNine(), 5),
        showItemOdds: false,
        showMoneyInput: false,
        operate: 'none',
      },
    ]),
    showItemOdds: false,
    showMoneyInput: false,
    bettingArea: ['bottom'],
    format: betFormat.multiFirst,
    showFormat: betFormat.handicapSpecial
  })

  // 十不中
  factory.addHandicapRule([ticketId, '230106'], {
    algorithm: algorithm.group,
    algorithmProps: {
      mainRow: 0,
      cTimes: 10,
    },
    list: factory.createHandicapList([
      {
        title: '十不中',
        items: chunk(getSpecialFortyNine(), 5),
        showItemOdds: false,
        showMoneyInput: false,
        operate: 'none',
      },
    ]),
    showItemOdds: false,
    showMoneyInput: false,
    bettingArea: ['bottom'],
    format: betFormat.multiFirst,
    showFormat: betFormat.handicapSpecial
  })

  // 总和
  factory.addHandicapRule([ticketId, '240101'], {
    list: factory.createHandicapList([
      {
        title: '总和',
        items: zongHe,
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
