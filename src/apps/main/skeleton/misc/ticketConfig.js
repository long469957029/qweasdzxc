const trendMmcPeriods = [
  {
    title: '近30期',
    name: 'pageSize',
    value: 30,
  },
  {
    title: '近50期',
    name: 'pageSize',
    value: 50,
  },
  {
    title: '近100期',
    name: 'pageSize',
    value: 100,
  },
]

const trendPeriods = [
  {
    title: '近30期',
    name: 'pageSize',
    value: 30,
  },
  {
    title: '近50期',
    name: 'pageSize',
    value: 50,
  },
  {
    title: '今日数据',
    name: 'date',
    value: 1,
  },
  {
    title: '近2天',
    name: 'date',
    value: 2,
  },
]

const trendLowPeriods = [
  ...trendPeriods,
  {
    title: '近5天',
    name: 'date',
    value: 5,
  },
]

const sscConfig = {
  id: 'ssc',
  title: '时时彩',
  icon: 'ssc',
  titleIcon: 'ssc_nav_icon',
  list: [
    Object.assign({
      id: 19,
      mark: 'wx',
      zhName: '无限秒秒彩',
      badge: '',
      trendOps: {
        distribution: true,
        periods: trendMmcPeriods,
        split: 1,
      },
      trendType: 'old',
    }, bettingTypes.SSC),
    Object.assign({
      id: 32,
      mark: 'qq30s',
      zhName: 'QQ30秒',
      badge: 'hot',
      showNumberDetail: false,
      openWhenTimeout: true,
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 10,
      mark: 'ffc',
      zhName: '无限分分彩',
      badge: 'hot',
      // badge: 'fire',
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      }
    }, bettingTypes.SSC),
    Object.assign({
      id: 13,
      mark: 'sfc',
      zhName: '无限三分彩',
      badge: '',
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      }
    }, bettingTypes.SSC),
    Object.assign({
      id: 1,
      mark: 'cq',
      zhName: '重庆时时彩',
      badge: 'hot',
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 31,
      mark: 'qqffc',
      zhName: 'QQ分分彩',
      badge: 'new',
      showNumberDetail: false,
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 37,
      mark: 'tx',
      zhName: '腾讯分分彩',
      badge: 'new',
      showNumberDetail: false,
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 21,
      mark: 'hg',
      zhName: '韩国乐透1.5',
      badge: '',
      showNumberDetail: true, // 鼠标滑过开奖号码显示尾号详情
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 27,
      mark: 'dj',
      zhName: '东京1.5分彩',
      badge: '',
      showNumberDetail: true, // 鼠标滑过开奖号码显示尾号详情
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 25,
      mark: 'xjp',
      zhName: '新加坡2分彩',
      badge: '',
      showNumberDetail: true,
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 3,
      mark: 'xj',
      zhName: '新疆时时彩',
      badge: '',
      showNumberDetail: true,
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 9,
      mark: 'hlj',
      zhName: '黑龙江时时彩',
      badge: '',
      showNumberDetail: true,
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 8,
      mark: 'tj',
      zhName: '天津时时彩',
      badge: '',
      showNumberDetail: true,
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 1,
      },
      isOfficial: true,
    }, bettingTypes.SSC),
  ],
}

const oneFiveConfig = {
  id: 'num',
  title: '十一选五',
  icon: 'num',
  titleIcon: 'ele_nav_icon',
  list: [
    Object.assign({
      id: 14,
      mark: 'ffc',
      zhName: '11选5分分彩',
      badge: '',
      trendOps: {
        distribution: true,
        periods: trendPeriods,
        split: 2,
      }
    }, bettingTypes.CHOOSE15),
    Object.assign({
      id: 5,
      mark: 'sd',
      zhName: '山东11选5',
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 2,
      },
      isOfficial: true,
    }, bettingTypes.CHOOSE15),
    Object.assign({
      id: 4,
      mark: 'gd',
      zhName: '广东11选5',
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 2,
      },
      isOfficial: true,
    }, bettingTypes.CHOOSE15),
    Object.assign({
      id: 11,
      mark: 'jx',
      zhName: '江西11选5',
      trendOps: {
        distribution: true,
        periods: trendLowPeriods,
        split: 2,
      },
      isOfficial: true,
    }, bettingTypes.CHOOSE15),
  ],
}
const threeDConfig = [
  Object.assign({
    id: 36,
    mark: '3d-ffc',
    zhName: 'QQ3D分分彩',
    hasMargin: true,
    badge: 'new',
    trendOps: {
      distribution: true,
      periods: trendPeriods,
      split: 1,
    }
  }, bettingTypes.THREED),
  Object.assign({
    id: 6,
    mark: '3d',
    zhName: '3D',
    hasMargin: true,
    trendOps: {
      distribution: true,
      periods: trendLowPeriods,
      split: 1,
    },
    isOfficial: true,
  }, bettingTypes.THREED),
  // {
  //  id: 17,
  //  mark: '3d-wfc',
  //  zhName: "3D五分彩",
  //  quickShowName: "3D<br>五分彩",
  //  hasMargin: true,
  //  defaultSelectPlay: defaultSelectDPC,
  //  badge: 'hot'
  // },
]

const p5p3Config = [
  Object.assign({
    id: 7,
    mark: 'p5p3',
    zhName: 'P3/P5',
    hasMargin: true,
    trendOps: {
      distribution: true,
      periods: trendLowPeriods,
      split: 1,
    },
    isOfficial: true,
  }, bettingTypes.P5P3),
]

const bjPKConfig = [
  Object.assign({
    id: 18,
    mark: 'pk10',
    zhName: 'PK10',
    hasMargin: true,
    badge: 'hot',
    trendOps: {
      periods: trendLowPeriods,
      split: 2,
      distribution: false,
      splitTrend: [
        {
          title: '前五名',
          pos: [0, 5]
        },
        {
          title: '后五名',
          pos: [5, 10]
        }
      ]
    },
    isOfficial: true,
  }, bettingTypes.PK10),
]

const quickConfig = [
  Object.assign({
    id: 29,
    mark: 'jsk3',
    zhName: '江苏快三',
    hasMargin: true,
    trendOps: {
      periods: trendLowPeriods,
      distribution: true,
      split: 1,
    },
    isOfficial: true,
  }, bettingTypes.QUICK3)
]

const happyConfig = {
  id: 'happy',
  title: '快乐彩',
  icon: 'happy',
  titleIcon: 'hap_nav_icon',
  list: bjPKConfig.concat(quickConfig),
}

const handicapMark6Config = [
  Object.assign({
    id: 34,
    mark: 'mark6',
    zhName: '香港六合彩',
    badge: 'new',
    isOfficial: true,
  }, bettingTypes.MARK6),
]

const handicapSscConfig = [
  Object.assign({
    id: 1,
    mark: 'cq',
    zhName: '重庆时时彩',
    badge: 'new',
    roadBalls: true,
    twoSide: true,
    isOfficial: true,
  }, bettingTypes.SSC),
  Object.assign({
    id: 10,
    mark: 'ffc',
    zhName: '无限分分彩',
    badge: 'new',
    twoSide: true,
    roadBalls: true,
  }, bettingTypes.SSC),
]

const handicapPk10Config = [
  Object.assign({
    id: 18,
    mark: 'pk10',
    zhName: 'PK10',
    badge: 'new',
    roadBalls: true,
    twoSide: true,
    isOfficial: true,
  }, bettingTypes.PK10),
]

const lowConfig = {
  id: 'low',
  title: '低频彩',
  icon: 'low',
  titleIcon: 'low_nav_icon',
  list: threeDConfig.concat(p5p3Config),
}

const allConfig = sscConfig.list.concat(
  oneFiveConfig.list,
  lowConfig.list,
  happyConfig.list,
  handicapMark6Config,
  // handicapSscConfig,
  // handicapPk10Config,
)

const allHandicapConfig = [
  ...handicapMark6Config,
  ...handicapPk10Config,
  ...handicapSscConfig,
]

const completeAllConfig = [sscConfig, oneFiveConfig, lowConfig, happyConfig]

/** @typedef {Object} ticketConfig */
export default {
  getSccList() {
    return sscConfig.list
  },

  getCompleteSccList() {
    return sscConfig
  },

  getChoose5List() {
    return oneFiveConfig.list
  },

  getCompleteChoose5List() {
    return oneFiveConfig
  },

  get3DList() {
    return threeDConfig
  },

  getP5P3List() {
    return p5p3Config
  },

  getBjPkList() {
    return bjPKConfig
  },

  getQuickList() {
    return quickConfig
  },

  getMark6List() {
    return handicapMark6Config
  },

  getHandicapSscList() {
    return handicapSscConfig
  },

  getHandicapPk10List() {
    return handicapPk10Config
  },

  getHappyList() {
    return happyConfig.list
  },

  getLowList() {
    return lowConfig.list
  },

  getAll() {
    return allConfig
  },

  getAllBy(props) {
    return _.where(allConfig, props)
  },

  getCompleteAll() {
    return completeAllConfig
  },

  get(index) {
    return _(allConfig).getConfig(index)
  },

  getComplete(id) {
    for (let i = 0; i < completeAllConfig.length; i += 1) {
      const find = _(completeAllConfig[i].list).findWhere({
        id,
      })
      if (find) {
        return _({
          info: find,
        }).extend(_(completeAllConfig[i]).pick('id', 'title', 'titleIcon', 'itemIcon'))
      }
    }
  },

  toZh(id) {
    return _(allConfig).getConfigById(id)
  },

  // 获取导览列采种配置
  getBeginlist() {
    return {
      classic: {
        list: [
          ...sscConfig.list,
          ...oneFiveConfig.list,
          ...threeDConfig.concat(p5p3Config).concat(happyConfig.list),
        ],
      },
      handicap: {
        // 重庆时时彩  无限秒秒彩  无限分分彩  北京赛车/PK拾  香港六合彩
        list: [
          ..._.filter(sscConfig.list, (item) => { return item.id === 1 || item.id === 10}),
          ...bjPKConfig.concat(this.getById(34)),
        ],
      },
    }
  },
  getById(id, type = consts.TICKET_NORMAL_TYPE) {
    if (type === consts.TICKET_NORMAL_TYPE) {
      return _(allConfig).findWhere({id})
    } else {
      return _(allHandicapConfig).findWhere({id})
    }
  },
}
