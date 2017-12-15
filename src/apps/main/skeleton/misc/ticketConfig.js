

const defaultSelectSSC = '4'
const defaultSelect115 = '4,0,4'
const defaultSelectDPC = '0'
const defaultSelectQW = '趣味'

const numberColor = {
  redArr: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
  blueArr: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
  greenArr: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
}

const sscConfig = {
  id: 'ssc',
  title: '时时彩',
  ticketName: '经典模式',
  icon: 'ssc',
  titleIcon: 'ssc_nav_icon',
  list: [
    {
      id: 27,
      mark: 'dj',
      zhName: '东京1.5分彩',
      quickShowName: "东京<br/><span style='font-size: 10px;'>1.5分彩</span>",
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
      showNumberDetail: true, // 鼠标滑过开奖号码显示尾号详情
    },
    {
      id: 25,
      mark: 'xjp',
      zhName: '新加坡2分彩',
      quickShowName: '新加坡<br/>2分彩',
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
      showNumberDetail: true,
    },
    {
      id: 13,
      mark: 'sfc',
      zhName: '无限三分彩',
      quickShowName: '无限<br />三分彩',
      hasMargin: true,
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
    },
    {
      id: 32,
      mark: 'qq30s',
      zhName: 'QQ30秒',
      quickShowName: 'QQ30秒',
      defaultSelectPlay: defaultSelectQW,
      badge: 'hot',
      showNumberDetail: false,
    },
    {
      id: 19,
      mark: 'wx',
      zhName: '无限秒秒彩',
      quickShowName: '无限<br/>秒秒彩',
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
    },

    {
      id: 10,
      mark: 'ffc',
      zhName: '无限分分彩',
      quickShowName: '无限<br />分分彩',
      hasMargin: true,
      defaultSelectPlay: defaultSelectSSC,
      badge: 'fire',
    },
    {
      id: 1,
      mark: 'cq',
      zhName: '重庆时时彩',
      quickShowName: '重庆<br/>时时彩',
      defaultSelectPlay: defaultSelectSSC,
      badge: 'hot',
    },
    {
      id: 21,
      mark: 'hg',
      zhName: '韩国乐透1.5',
      quickShowName: "韩国<br/><span style='font-size: 10px;'>1.5分彩</span>",
      defaultSelectPlay: defaultSelectSSC,
      badge: '',
      showNumberDetail: true, // 鼠标滑过开奖号码显示尾号详情
    },
  ],
}

const oneFiveConfig = {
  id: 'num',
  title: '11选5',
  ticketName: '十一选五',
  icon: 'num',
  titleIcon: 'ele_nav_icon',
  list: [
    {
      id: 14,
      mark: 'ffc',
      zhName: '11选5分分彩',
      quickShowName: '11选5<br/>分分彩',
      defaultSelectPlay: defaultSelect115,
      badge: '',
    },
    {
      id: 5,
      mark: 'sd',
      zhName: '山东11选5',
      quickShowName: '山东<br/>11选5',
      defaultSelectPlay: defaultSelect115,
    },
    {
      id: 4,
      mark: 'gd',
      zhName: '广东11选5',
      quickShowName: '广东<br/>11选5',
      defaultSelectPlay: defaultSelect115,
    },
    {
      id: 11,
      mark: 'jx',
      zhName: '江西11选5',
      quickShowName: '江西<br/>11选5',
      defaultSelectPlay: defaultSelect115,
    },
  ],
}
const threeDConfig = [
  {
    id: 16,
    mark: '3d-ffc',
    zhName: '3D分分彩',
    quickShowName: '3D<br>分分彩',
    hasMargin: true,
    defaultSelectPlay: defaultSelectDPC,
    badge: 'hot',
  },
  {
    id: 6,
    mark: '3d',
    zhName: '3D',
    quickShowName: '3D',
    hasMargin: true,
    defaultSelectPlay: defaultSelectDPC,
  },
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
  {
    id: 7,
    mark: 'p5p3',
    zhName: 'P3/P5',
    quickShowName: 'P3/P5',
    defaultSelectPlay: defaultSelectDPC,
    hasMargin: true,
  },
]

const bjPKConfig = [
  {
    id: 18,
    mark: 'pk10',
    zhName: '北京赛车/PK10',
    quickShowName: '北京<br/>/PK10',
    defaultSelectPlay: defaultSelectSSC,
    hasMargin: true,
    badge: 'hot',
  },
]

const quickConfig = [
  {
    id: 29,
    mark: 'jsk3',
    zhName: '江苏快三',
    quickShowName: '江苏<br/>快三',
    defaultSelectPlay: defaultSelectSSC,
    hasMargin: true,
    badge: 'new',
  },
  {
    id: 35,
    mark: '5mark6',
    zhName: '无限六合彩',
    quickShowName: '无限六合彩',
    defaultSelectPlay: defaultSelectDPC,
    hasMargin: true,
    badge: 'new',
    numberColor,
  },
]

const happyConfig = {
  id: 'happy',
  title: '快乐彩',
  ticketName: '快乐彩',
  icon: 'happy',
  titleIcon: 'hap_nav_icon',
  list: bjPKConfig.concat(quickConfig),
  // list: bjPKConfig
}

const mark6Config = [
  {
    id: 34,
    mark: 'mark6',
    zhName: '香港六合彩',
    quickShowName: '香港六合彩',
    defaultSelectPlay: defaultSelectDPC,
    hasMargin: true,
    badge: 'new',
    numberColor,
  }, /* ,
  {
    id: 35,
    mark: '5mark6',
    zhName: "无限六合彩",
    quickShowName: "无限六合彩",
    defaultSelectPlay: defaultSelectDPC,
    hasMargin: true,
    badge: 'new',
    numberColor: numberColor
  } */
]

const lowConfig = {
  id: 'low',
  title: '低频彩',
  ticketName: '低频彩',
  icon: 'low',
  titleIcon: 'low_nav_icon',
  list: threeDConfig.concat(p5p3Config).concat(mark6Config),
}

// var allConfig = sscConfig.list.concat(oneFiveConfig.list, threeDConfig.list, threeDConfig, p5p3Config, happyConfig.list, quickConfig.list);
const allConfig = sscConfig.list.concat(oneFiveConfig.list, lowConfig.list, happyConfig.list)// quickConfig

const completeAllConfig = [sscConfig, oneFiveConfig, lowConfig, happyConfig]

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

module.exports = {
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
        title: '经典模式',
        desc: '经典元角分投注模式',
        list: [
          sscConfig.list,
          oneFiveConfig.list,
          threeDConfig.concat(p5p3Config, mark6Config),
          bjPKConfig.concat(this.getById(29)), // 北京pk10, 江苏快三
        ],
      },
      handicap: {
        title: '盘口模式',
        desc: '金额自定义/多种玩法同时投注',
        list: [
          _.filter(sscConfig.list, (item) => { return item.id === 27 }), // 除了东京1.5的所有时时彩彩种
          bjPKConfig.concat(this.getById(34), this.getById(35)), // ['北京PK10', '香港六合彩', '无限六合彩'],
        ],
      },
    }
  },
  getMark6List() {
    // 彩种id被移除出六合彩系列，导致页面无法获取玩法，
    return mark6Config.concat(this.getById(35))
  },
  getById(id) {
    return _(allConfig).find((item) => {
      return item.id === id
    })
  },
  // 获取六合彩系类彩种id
  getMark6TicketIdArr() {
    const mark6TicketIdArr = []
    _(mark6Config.concat(this.getById(35))).each((item) => {
      mark6TicketIdArr.push(item.id)
    })
    return mark6TicketIdArr
  },
}
