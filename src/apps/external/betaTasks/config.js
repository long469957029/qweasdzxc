

const config = [
  {
    id: 1,
    btnType: 1,
    light: require('./images/icon_01.png'),
    gray: require('./images/icon_01_gray.png'),
    content: '《初出江湖》<br>完成新手指引<br>奖励：1',
  },
  {
    id: 2,
    btnType: 1,
    light: require('./images/icon_02.png'),
    gray: require('./images/icon_02_gray.png'),
    content: '《颇具潜力》<br>设置资金密码 绑定银行卡',
  },
  {
    id: 3,
    btnType: 2,
    light: require('./images/icon_03.png'),
    gray: require('./images/icon_03_gray.png'),
    content: '《初显锋芒》<br>设置密保问题',
  },
  {
    id: 4,
    btnType: 2,
    light: require('./images/icon_04.png'),
    gray: require('./images/icon_04_gray.png'),
    content: '《小有名气》<br>完成快捷入口定制操作',
  },
  {
    id: 5,
    btnType: 1,
    light: require('./images/icon_05.png'),
    gray: require('./images/icon_05_gray.png'),
    content: '《声名鹊起》<br>完成一次开户操作',
  },
  {
    id: 6,
    btnType: 1,
    light: require('./images/icon_06.png'),
    gray: require('./images/icon_06_gray.png'),
    content: '《锋芒毕露》<br>完成一次充值操作（充值1元即可）',
  },
  {
    id: 7,
    btnType: 1,
    light: require('./images/icon_07.png'),
    gray: require('./images/icon_07_gray.png'),
    content: '《声名显赫》<br>完成11选5彩种20个不同玩法的有效投注',
  },
  {
    id: 8,
    btnType: 1,
    light: require('./images/icon_08.png'),
    gray: require('./images/icon_08_gray.png'),
    content: '《如雷贯耳》<br>完成时时彩彩种40个不同玩法的有效投注',
  },
  {
    id: 9,
    btnType: 1,
    light: require('./images/icon_09.png'),
    gray: require('./images/icon_09_gray.png'),
    content: '《威风八面》<br>完成分分彩彩种60个不同玩法的有效投注',
  },
  {
    id: 10,
    btnType: 1,
    light: require('./images/icon_10.png'),
    gray: require('./images/icon_10_gray.png'),
    content: '《德高望重》<br>完成问卷调查',
  },
  {
    id: 11,
    btnType: 2,
    light: require('./images/icon_11.png'),
    gray: require('./images/icon_11_gray.png'),
    content: '《威镇九州》<br>完成P5/P3彩种12个不同玩法的有效投注',
  },
  {
    id: 12,
    btnType: 2,
    light: require('./images/icon_12.png'),
    gray: require('./images/icon_12_gray.png'),
    content: '《常胜将军》<br>完成3D彩种9个不同玩法的有效投注',
  },
  {
    id: 13,
    btnType: 3,
    light: require('./images/icon_13.png'),
    gray: require('./images/icon_13_gray.png'),
    content: '《战无不胜》<br>完成意见反馈或BUG提交',
  },
]

module.exports = {
  getAll() {
    return config
  },

  get(id) {
    return _(config).findWhere({
      id,
    })
  },
}
