

const dashboardRouter = require('dashboard/router')
const userCenterRouter = require('userCenter/router')
const vipCenterRouter = require('vipCenter/router')
const accountCenterRouter = require('accountCenter/router')
const activeCenterRouter = require('activeCenter/router')
const realCenterRouter = require('realCenter/router')
const slotCenterRouter = require('slotCenter/router')
const fishCenterRouter = require('fishCenter/router')
const sportCenterRouter = require('sportCenter/router')
const agencyCenterRouter = require('agencyCenter/router')
const fundCenterRouter = require('fundCenter/router')
const bettingCenterRouter = require('bettingCenter/router')
const newsCenterRouter = require('newsCenter/router')
const dynamicCenterRouter = require('dynamicCenter/router')
const helpCenterRouter = require('helpCenter/router')
const gameCenterRouter = require('gameCenter/router')
const mallCenterRouter = require('mallCenter/router')

exports.install = function() {
  const acctInfo = Global.memoryCache.get('acctInfo')
  dashboardRouter.install()
  accountCenterRouter.install()
  activeCenterRouter.install()
  // 0是代理，1是玩家，玩家不显示代理中心
  if (acctInfo.userType !== 1) {
    agencyCenterRouter.install()
  }
  // 真人视讯大厅
  realCenterRouter.install()
  // 电子游戏大厅
  slotCenterRouter.install()
  // 捕鱼游戏大厅
  fishCenterRouter.install()
  // 体育游戏大厅
  sportCenterRouter.install()
  fundCenterRouter.install()
  userCenterRouter.install()
  vipCenterRouter.install()
  bettingCenterRouter.install()
  newsCenterRouter.install()
  dynamicCenterRouter.install()
  helpCenterRouter.install()
  gameCenterRouter.install()
  mallCenterRouter.install()
}
