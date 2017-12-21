const navItemType = {
  dropdown: 1,
  outerLink: 2,
  jsClass: 3,
  link: 4,
}

const dropdownType = {
  list: 1,
  entry: 2,
  classifyList: 3,
}

// 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
const channelId = {
  ag: 1,
  ebet: 2,
  bbin: 3,
  pt: 4,
  mg: 5,
  gg: 6,
  sport: 7,
}

const menuConfig = [
  {
    router: 'uc',
    name: '个人中心',
    first: 'uc/pm',
    icon: 'user',
    notNav: true,
    sub: [
      // {
      //   id: 500,
      //   router: 'fc/fm',
      //   name: '资金总览',
      //   notShow: true,
      //   quickShowName: '资金<br/>管理',
      // },
      // {
      //   id: 504,
      //   router: 'fc/ad',
      //   name: '账变明细',
      //   quickShowName: '账户<br/>明细',
      // }, {
      //   id: 506,
      //   router: 'fc/re',
      //   name: '充提记录',
      //   quickShowName: '充提<br/>记录',
      // },
      // {
      //   id: 306,
      //   router: 'gc/tr',
      //   name: '游戏记录',
      //   quickShowName: '游戏<br/>记录',
      // },
      {
        id: 300,
        router: 'uc/pm',
        name: '个人资料',
        quickShowName: '个人<br/>资料',
      },
      {
        id: 301,
        router: 'uc/cm',
        name: '银行卡管理',
        quickShowName: '银行卡<br/>管理',
      },
      {
        id: 303,
        router: 'uc/pl',
        name: '帐户安全',
        quickShowName: '帐户<br/>安全',
      },
      // {
      //   id: 304,
      //   router: 'as/sq',
      //   name: '密保问题',
      //   quickShowName: '密保<br/>问题',
      // },
      {
        id: 302,
        router: 'uc/pd',
        name: '我的奖金',
        quickShowName: '我的<br/>奖金',
      },
      {
        id: 306,
        router: 'uc/mg',
        name: '我的消息',
        quickShowName: '我的<br/>消息',
      },
      // {
      //   id: 305,
      //   router: 'as/ll',
      //   name: '登录日志',
      //   quickShowName: '登录<br/>日志',
      // },
    ],
  },
  {
    router: 'ac',
    name: '团队中心',
    agency: true, // 代理账号专用
    first: 'ac/to',
    icon: 'agency',
    notNav: true,
    sub: [
      {
        id: 400,
        router: 'ac/to',
        name: '团队总览',
        quickShowName: '团队<br/>总览',
      },
      {
        id: 401,
        router: 'ac/llm',
        name: '团队管理',
        quickShowName: '下级<br/>管理',
      },
      {
        id: 402,
        router: 'ac/spl',
        name: '团队盈亏',
        quickShowName: '团队<br/>盈亏',
      },
      {
        id: 403,
        router: 'ac/tbr',
        name: '团队投注',
        quickShowName: '团队<br/>投注',
      },
      {
        id: 404,
        router: 'ac/tad',
        name: '团队账变',
        quickShowName: '团队<br/>账变',
      },
      {
        id: 406,
        router: 'ac/oam',
        name: '开户管理',
        quickShowName: '开户<br/>管理',
      },
      {
        id: 407,
        router: 'ac/dm',
        name: '分红管理',
        needAuth: true,
        quickShowName: '分红<br/>管理',
      },
      {
        id: 408,
        router: 'ac/rp',
        name: '红包查询',
        needAuth: true,
        quickShowName: '红包<br/>查询',
      },
      {
        id: 409,
        router: 'ac/reb',
        name: '返点查询',
        needAuth: true,
        quickShowName: '返点<br/>查询',
      },
    ],
  },
  {
    router: 'fc',
    name: '资金管理',
    first: 'fc/fm',
    icon: 'fund',
    notNav: true,
    sub: [
      {
        id: 500,
        router: 'fc/fm',
        name: '资金总览',
        notShow: true,
        quickShowName: '资金<br/>总览',
      },
      // {
      //   id: 501,
      //   router: 'fc/re',
      //   name: '在线充值',
      //   notShow: true,
      //   quickShowName: '在线<br/>充值',
      // },
      // {
      //   id: 502,
      //   router: 'fc/wd',
      //   name: '在线提现',
      //   notShow: true,
      //   quickShowName: '在线<br/>提现',
      // },
      // {
      //   id: 503,
      //   router: 'fc/tr',
      //   name: '平台转账',
      //   notShow: true,
      //   quickShowName: '平台<br/>转账',
      // },
      {
        id: 504,
        router: 'fc/ad',
        name: '账变明细',
        quickShowName: '账变<br/>明细',
      },
      // {
      //   id: 505,
      //   router: 'fc/rb',
      //   name: '返水记录',
      //   quickShowName: '返水<br/>记录',
      // },
      {
        id: 506,
        router: 'fc/rd',
        name: '充提记录',
        quickShowName: '充提<br/>记录',
      },
      {
        id: 306,
        router: 'fc/td',
        name: '投注记录',
        quickShowName: '投注<br/>记录',
      },
      // {
      //   id: 507,
      //   router: 'fc/wr',
      //   name: '提现记录',
      //   quickShowName: '提现<br/>记录',
      // },
      // {
      //   id: 508,
      //   router: 'fc/tfr',
      //   name: '转账记录',
      //   quickShowName: '转账<br/>记录',
      // },
    ],
  },
  {
    router: '',
    name: '首页',
    navItemType: navItemType.link,
    mask: true,
  },
  {
    name: '体育',
    router: 'sp',
    navItemType: navItemType.dropdown,
    hasDropdown: true,
    dropdownType: dropdownType.list,
    bannerTitle: '体育投注 Sports',
    bannerDesc: '赛事应有尽有，玩法一应俱全',
    subGame: [
      {
        channelName: '足球',
        gameLink: 'sport/football',
      },
      {
        channelName: '蓝球',
        gameLink: 'sport/basketball',
      },
      {
        channelName: '板球',
        gameLink: 'sport/ben',
      },
      {
        channelName: '足球',
        gameLink: 'sport/football',
      },
      {
        channelName: '蓝球',
        gameLink: 'sport/basketball',
      },
      {
        channelName: '板球',
        gameLink: 'sport/ben',
      },
    ],
  },
  {
    name: '娱乐场',
    router: 'rc',
    navItemType: navItemType.dropdown,
    hasDropdown: true,
    dropdownType: dropdownType.entry,
    bannerPicClass: 'realPic',
    subGame: [
      {
        channelId: channelId.ag,
        gameId: 1,
        channelName: 'AG娱乐场',
        desc: '最具创新人气最旺',
        imgSrc: 'icon-real-ag',
        router: 'rc',
      },
      {
        channelId: channelId.ebet,
        gameId: 2,
        channelName: 'EBET娱乐场',
        desc: '亚洲最稳健的平台',
        imgSrc: 'icon-real-ebet',
        router: 'rc',
      },
      {
        channelId: channelId.bbin,
        gameId: 3,
        channelName: 'BBIN娱乐场',
        desc: '移动娱乐第一品牌',
        imgSrc: 'icon-real-bbin',
        router: 'rc',
      },

    ],
  },
  {
    name: '老虎机',
    type: 3,
    router: 'sc',
    navItemType: navItemType.dropdown,
    hasDropdown: true,
    dropdownType: dropdownType.entry,
    bannerPicClass: 'slotPic',
    subGame: [
      {
        channelId: channelId.pt,
        channelName: 'PT老虎机',
        desc: '玩法丰富，实力超群',
        imgSrc: 'icon-slot-pt',
        router: '#sc?channelId=4',
      },
      {
        channelId: channelId.mg,
        channelName: 'MG老虎机',
        desc: '欧美最流行老虎机',
        // router: '#gc/scmg',
        imgSrc: 'icon-slot-mg',
        router: '#sc?channelId=5',
      },
    ],
  },
  {
    name: '捕鱼',
    router: 'fc',
    navItemType: navItemType.dropdown,
    hasDropdown: true,
    dropdownType: dropdownType.entry,
    bannerPicClass: 'fishPic',
    subGame: [
      {
        channelId: channelId.ag,
        gameId: 5,
        channelName: 'AG捕鱼王',
        desc: '纯3D捕鱼，百万奖金',
        imgSrc: 'icon-fish-ag',
        router: 'fc',
      },
      {
        channelId: channelId.gg,
        gameId: 6,
        channelName: 'GG捕鱼天下',
        desc: '高清全景游戏画面',
        imgSrc: 'icon-fish-gg',
        router: 'fc',
      },
    ],
  },
  {
    router: 'bc/19',
    name: '彩票',
    navItemType: navItemType.dropdown,
    hasDropdown: true,
    dropdownType: dropdownType.classifyList,
    bannerPicClass: 'ticketPic',
  },
  {
    router: 'aa',
    name: '优惠活动',
    navItemType: navItemType.link,
  },
  {
    router: 'newDownload.html',
    name: '手机投注',
    navItemType: navItemType.outerLink,
  },

  {
    router: '#ma?type=0',
    name: '积分商城',
    navItemType: navItemType.outerLink,
    className: 'js-nav-mall nav-right',
  },
]

function getRouter(router) {
  if (_(router).isArray()) {
    return _(router).map((item) => {
      return _(menuConfig).findWhere({
        router: item,
      })
    })
  }
  return _(menuConfig).findWhere({
    router,
  })
}

export {
  navItemType,
  dropdownType,
  channelId,
  menuConfig,
  getRouter,
}
