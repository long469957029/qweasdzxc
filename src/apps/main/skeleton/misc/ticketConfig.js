const defaultSelectQW = '趣味'

const numberColor = {
  redArr: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
  blueArr: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
  greenArr: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
}

const sscConfig = {
  id: 'ssc',
  title: '时时彩',
  icon: 'ssc',
  titleIcon: 'ssc_nav_icon',
  list: [
    Object.assign({
      id: 27,
      mark: 'dj',
      zhName: '东京1.5分彩',
      badge: '',
      showNumberDetail: true, // 鼠标滑过开奖号码显示尾号详情
    }, bettingTypes.SSC),
    Object.assign({
      id: 25,
      mark: 'xjp',
      zhName: '新加坡2分彩',
      badge: '',
      showNumberDetail: true,
    }, bettingTypes.SSC),
    Object.assign({
      id: 13,
      mark: 'sfc',
      zhName: '无限三分彩',
      hasMargin: true,
      badge: '',
    }, bettingTypes.SSC),
    Object.assign({
      id: 32,
      mark: 'qq30s',
      zhName: 'QQ30秒',
      badge: 'hot',
      showNumberDetail: false,
    }, bettingTypes.SSC),
    Object.assign({
      id: 19,
      mark: 'wx',
      zhName: '无限秒秒彩',
      badge: '',
    }, bettingTypes.SSC),
    Object.assign({
      id: 10,
      mark: 'ffc',
      zhName: '无限分分彩',
      badge: 'fire',
    }, bettingTypes.SSC),
    Object.assign({
      id: 1,
      mark: 'cq',
      zhName: '重庆时时彩',
      badge: 'hot',
    }, bettingTypes.SSC),
    Object.assign({
      id: 21,
      mark: 'hg',
      zhName: '韩国乐透1.5',
      badge: '',
      showNumberDetail: true, // 鼠标滑过开奖号码显示尾号详情
    }, bettingTypes.SSC),
  ],
}

const oneFiveConfig = {
  id: 'num',
  title: '11选5',
  icon: 'num',
  titleIcon: 'ele_nav_icon',
  list: [
    Object.assign({
      id: 14,
      mark: 'ffc',
      zhName: '11选5分分彩',
      badge: '',
    }, bettingTypes.CHOOSE15),
    Object.assign({
      id: 5,
      mark: 'sd',
      zhName: '山东11选5',
    }, bettingTypes.CHOOSE15),
    Object.assign({
      id: 4,
      mark: 'gd',
      zhName: '广东11选5',
    }, bettingTypes.CHOOSE15),
    Object.assign({
      id: 11,
      mark: 'jx',
      zhName: '江西11选5',
    }, bettingTypes.CHOOSE15),
  ],
}
const threeDConfig = [
  Object.assign({
    id: 16,
    mark: '3d-ffc',
    zhName: '3D分分彩',
    hasMargin: true,
    badge: 'hot',
  }, bettingTypes.CHOOSE15),
  Object.assign({
    id: 6,
    mark: '3d',
    zhName: '3D',
    hasMargin: true,
  }, bettingTypes.CHOOSE15),
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
  }, bettingTypes.P5P3),
]

const bjPKConfig = [
  Object.assign({
    id: 18,
    mark: 'pk10',
    zhName: '北京赛车/PK10',
    hasMargin: true,
    badge: 'hot',
  }, bettingTypes.PK10),
]

const quickConfig = {
  id: 'quick3',
  title: '快三',
  ticketName: '快三',
  titleIcon: 'hap_nav_icon',
  list: [
    Object.assign({
      id: 29,
      mark: 'jsk3',
      zhName: '江苏快三',
      hasMargin: true,
      badge: 'new',
    }, bettingTypes.QUICK3),
  ],
}

const happyConfig = {
  id: 'happy',
  title: '快乐彩',
  ticketName: '快乐彩',
  icon: 'happy',
  titleIcon: 'hap_nav_icon',
  list: bjPKConfig,
}

const handicapMark6Config = [
  Object.assign({
    id: 34,
    mark: 'mark6',
    zhName: '香港六合彩',
    hasMargin: true,
    badge: 'new',
    numberColor,
  }, bettingTypes.MARK6),
]

const handicapSscConfig = [
  {
    id: 1,
    mark: 'ssc',
    zhName: '重庆时时彩',
    hasMargin: true,
    badge: 'new',
    numberColor,
  },
]

const handicapPk10Config = [
  {
    id: 1,
    mark: 'ssc',
    zhName: '北京PK10',
    hasMargin: true,
    badge: 'new',
    numberColor,
  },
]

const lowConfig = {
  id: 'low',
  title: '低频彩',
  ticketName: '低频彩',
  icon: 'low',
  titleIcon: 'low_nav_icon',
  list: threeDConfig.concat(p5p3Config).concat(handicapMark6Config),
}

const allConfig = sscConfig.list.concat(oneFiveConfig.list, lowConfig.list, happyConfig.list, quickConfig.list)

const completeAllConfig = [sscConfig, oneFiveConfig, lowConfig, happyConfig, quickConfig]

// //--begin 彩种导航特殊配置
// var hotTicketIdList = [19,32,10,1,21];
// var sscCopy = _(sscConfig).deepCopy();
// var lowCopy = _(lowConfig).deepCopy();

// var newSSCCopy = [];
// var newLowCopy = [];


// _(sscCopy.list).each(function(item){
//   if(item && !_(hotTicketIdList).contains(item.id)){
//     newSSCCopy.push(item);
//   }

// });

// _(lowCopy.list).each(function(item){
//   if(item && !_(hotTicketIdList).contains(item.id)){
//     newLowCopy.push(item);
//   }

// });

// sscCopy.list = newSSCCopy;
// lowCopy.list = newLowCopy;

// var newCompleteAllConfig = [ sscCopy, oneFiveConfig, lowCopy, happyConfig];
// --end

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
    return quickConfig.list
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
          sscConfig.list,
          oneFiveConfig.list,
          threeDConfig.concat(p5p3Config).concat(happyConfig.list).concat(quickConfig.list),
        ],
      },
      handicap: {
        // 重庆时时彩  无限秒秒彩  无限分分彩  北京PK10  香港六合彩
        list: [
          _.filter(sscConfig.list, (item) => { return item.id === 1 || item.id === 10 || item.id === 19 }),
          bjPKConfig.concat(this.getById(34)),
        ],
      },
    }
  },
  getById(id) {
    return _(allConfig).find((item) => {
      return item.id === id
    })
  },
}
