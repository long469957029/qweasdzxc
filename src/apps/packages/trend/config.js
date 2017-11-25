

const sscPositions = ['万位', '千位', '百位', '十位', '个位']
const sscOneDay = 120

const PK10Positions = ['第一名', '第二名', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名']

const mark6NumColor = {
  redArr: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
  blueArr: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
  greenArr: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
}

const sscConfig = [
  {
    id: 19,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: -1,
    zhName: '秒秒彩',
  },
  {
    id: 10,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 1440,
    zhName: '加州分分彩',
  },
  {
    id: 13,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 480,
    zhName: '无限三分彩',
  },
  {
    id: 12,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 288,
    zhName: '加州五分彩',
  },
  {
    id: 1,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    zhName: '重庆时时彩',
  },
  {
    id: 2,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    zhName: '江西时时彩',
  },
  {
    id: 3,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    zhName: '新疆时时彩',
  },
  {
    id: 8,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    zhName: '天津时时彩',
  },
  {
    id: 9,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: sscOneDay,
    zhName: '黑龙江时时彩',
  },
  {
    id: 18,
    count: 10,
    num: _.range(1, 11),
    positions: PK10Positions,
    oneDay: 179,
    zhName: '北京赛车/PK10',
  },
  {
    id: 21,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 960,
    zhName: '韩国1.5分彩',
    viewNumber: true, // 查看原始号源
  },
  {
    id: 24,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 288,
    zhName: '台湾5分彩',
    viewNumber: true,
  },
  {
    id: 25,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 660,
    zhName: '新加坡2分彩',
    viewNumber: true,
  },
  {
    id: 26,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 179,
    zhName: '北京快乐8',
    viewNumber: true,
  },
  {
    id: 28,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 960,
    zhName: '加州1.5分彩',
    viewNumber: true,
  },
  {
    id: 27,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 920,
    zhName: '东京1.5分彩',
    viewNumber: true,
  },
  {
    id: 30,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 395,
    zhName: '加拿大3.5分彩',
    viewNumber: true,
  },
  {
    id: 31,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 1440,
    zhName: '腾讯分分彩',
    viewNumber: true,
  },
  {
    id: 32,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 2880,
    zhName: 'QQ30秒',
    viewNumber: true,
  },
  {
    id: 33,
    count: 5,
    num: _.range(10),
    positions: sscPositions,
    oneDay: 960,
    zhName: 'QQ1.5分彩',
    viewNumber: true,
  },
]

const oneFivePosition = ['第一位', '第二位', '第三位', '第四位', '第五位']

const oneFiveConfig = [
  {
    id: 14,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 1440,
    zhName: '11选5分分彩',
  },
  {
    id: 15,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 480,
    zhName: '11选5三分彩',
  },
  {
    id: 5,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 78,
    zhName: '山东11选5',
  },
  {
    id: 4,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 84,
    zhName: '广东11选5',
  },
  {
    id: 11,
    count: 5,
    num: _.range(1, 12),
    positions: oneFivePosition,
    oneDay: 84,
    zhName: '江西11选5',
  },
]

const threeDConfig = [
  {
    id: 16,
    count: 3,
    num: _.range(10),
    positions: ['百位', '十位', '个位'],
    oneDay: 1440,
    zhName: '3D分分彩',
  },
  {
    id: 17,
    count: 3,
    num: _.range(10),
    positions: ['百位', '十位', '个位'],
    oneDay: 288,
    zhName: '3D五分彩',
  },
  {
    id: 6,
    count: 3,
    num: _.range(10),
    positions: ['百位', '十位', '个位'],
    zhName: '3D',
  },
]
const p5p3Config = [
  {
    id: 7,
    count: 5,
    num: _.range(10),
    positions: ['万位', '千位', '百位', '十位', '个位'],
    zhName: 'P5/P3',
  },
]

const quickConfig = [
  {
    id: 29,
    count: 3,
    num: _.range(1, 7, 1),
    positions: ['万位', '千位', '百位'],
    zhName: '江苏快3',
  },
]

const mark6Config = [
  {
    id: 34,
    zhName: '香港六合彩',
    color: mark6NumColor,
  },
  {
    id: 35,
    zhName: '无限六合彩',
    color: mark6NumColor,
  },
]

const allConfig = sscConfig.concat(oneFiveConfig, threeDConfig, p5p3Config, quickConfig, mark6Config)

module.exports = {
  get(id) {
    return _(allConfig).findWhere({
      id,
    })
  },
  // 获取六合彩系类彩种id
  getMark6TicketIdArr () {
    const mark6TicketIdArr = []
    _(mark6Config).each((item) => {
      mark6TicketIdArr.push(item.id)
    })
    return mark6TicketIdArr
  },
}
