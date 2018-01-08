import RouterController from 'skeleton/controllers/router'

import AccountDetailsView from 'fundCenter/accountDetail'
import FundRecordsView from 'fundCenter/record'
import FundManageView from 'fundCenter/fundManage'
import RebateRecordsView from 'fundCenter/rebateRecord'
import RechargeView from 'fundCenter/recharge'
import WithdrawView from 'fundCenter/withdraw'

const GameRecordView = require('fundCenter/gameRecord/index')

const BetDetailView = require('fundCenter/gameRecord/betDetail')
const ChaseDetailView = require('fundCenter/gameRecord/chaseDetail')

const menuConfig = Global.ui.menu.get('uc')
require('./misc/index.scss')

const sidebar = Global.ui.menu.get('uc')

const FundCenterController = RouterController.extend({

  fundManage() {
    this.changeMainReginView(new FundManageView(), {
      sidebar,
      activeMenu: 'fc/fm',
    })
  },
  recharge() {
    this.changeMainReginView(new RechargeView(), {
      main: {
        title: '在线充值',
        titleDes: '',
      },
      sidebar,
      // activeMenu: 'fc/fm'
    })
  },

  withdrawal() {
    this.changeMainReginView(new WithdrawView(), {
      main: {
        title: '在线提现',
      },
      sidebar,
      // activeMenu: 'fc/fm'
    })
  },

  accountDetails() {
    this.changeMainReginView(new AccountDetailsView({ triggerTab: 'jsFcMdCenter' }), {
      main: {
        title: '帐变明细',
        titleDes: '帐变明细只保留30天数据。',
      },
      sidebar,
    })
  },
  // platformAccountDetails: function() {
  //   this.changeMainReginView(new AccountDetailsView({triggerTab:'jsFcMdPlatform'}), {
  //     main: {
  //       title: '账户明细'
  //     },
  //     sidebar
  //   });
  // },

  rebateRecords() {
    this.changeMainReginView(new RebateRecordsView(), {
      main: {
        title: '返水记录',
      },
      sidebar,
    })
  },

  records() {
    this.changeMainReginView(new FundRecordsView(), {
      main: {
        title: '充提记录',
        titleDes: '充提记录只保留30天数据。',
      },
      sidebar,
    })
  },
  ticketRecordDetail() {
    this.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrTr' }), {
      main: {
        title: '投注记录',
        titleDes: '投注记录只保留30天记录。',
      },
      sidebar: menuConfig,
    })
  },
  chaseRecord() {
    this.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrCr' }), {
      main: {
        icon: menuConfig.icon,
        title: '追号记录',
      },
      sidebar: menuConfig,
    })
  },
  gameRecord() {
    this.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrGr' }), {
      main: {
        icon: menuConfig.icon,
        title: '游戏记录',
      },
      sidebar: menuConfig,
    })
  },
  betDetailView() {
    this.changeMainReginView(new BetDetailView())
  },
  chaseDetailView() {
    this.changeMainReginView(new ChaseDetailView())
  },
})

export default FundCenterController
