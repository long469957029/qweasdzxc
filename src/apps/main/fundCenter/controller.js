import RouterController from 'skeleton/controllers/router'

import AccountDetailsView from 'fundCenter/accountDetail'
import FundRecordsView from 'fundCenter/record'
import FundManageView from 'fundCenter/fundManage'
import RebateRecordsView from 'fundCenter/rebateRecord'
import RechargeView from 'fundCenter/recharge'
import WithdrawView from 'fundCenter/withdraw'
import TransferView from 'fundCenter/transfer'


const GameRecordView = require('fundCenter/gameRecord/index')

const menuConfig = Global.ui.menu.get(['fc', 'uc'])
require('./misc/index.scss')

const sidebar = Global.ui.menu.get(['fc', 'uc'])

const FundCenterController = RouterController.extend({

  fundManage() {
    this.changeMainReginView(new FundManageView(), {
      main: {
        title: '资金管理',
      },
      sidebar,
      activeMenu: 'fc/fm',
    })
  },
  recharge() {
    this.changeMainReginView(new RechargeView(), {
      main: {
        title: '在线充值',
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

  transfer() {
    this.changeMainReginView(new TransferView(), {
      main: {
        title: '平台转账',
      },
      sidebar,
      // activeMenu: 'fc/fm'
    })
  },

  accountDetails() {
    this.changeMainReginView(new AccountDetailsView({ triggerTab: 'jsFcMdCenter' }), {
      main: {
        title: '账户明细',
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
      },
      sidebar,
    })
  },
  ticketRecordDetail() {
    this.changeMainReginView(new GameRecordView({ triggerTab: 'jsGcGrTr' }), {
      main: {
        icon: menuConfig.icon,
        title: '游戏记录',
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
})

export default FundCenterController
