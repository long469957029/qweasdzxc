/**
 * Created by steven on 2018/3/19.
 */
const personalMenu = [
  {
    id: 100,
    title: '资金管理',
    icon: 'sfa-sidebar-fund',
    child: [
      {
        id: 101,
        title: '资金总览',
        name: 'assetOverview',
      },
      {
        id: 102,
        title: '账变明细',
        name: '#/fc/ad',
      },
      {
        id: 103,
        title: '充提记录',
        name: '#/fc/rd',
      },
      {
        id: 104,
        title: '投注记录',
        name: '#/fc/td',
      },
    ]
  },
  {
    id: 200,
    title: '个人中心',
    icon: 'sfa-sidebar-user',
    child: [
      {
        id: 201,
        title: '个人资料',
        name: '#/uc/pm',
      },
      {
        id: 202,
        title: '银行卡管理',
        name: '#/uc/cm',
      },
      {
        id: 2,
        title: '账户安全',
        name: '#/uc/pl',
      },
      {
        id: 203,
        title: '我的奖金',
        name: '#/uc/pd',
      },
      {
        id: 204,
        title: '我的消息',
        name: '#/uc/mg',
      },
      {
        id: 205,
        title: '优惠券',
        name: '#/uc/cp',
      },
    ]
  }
]
module.exports = {
  getAll() {
    return personalMenu
  },
}
