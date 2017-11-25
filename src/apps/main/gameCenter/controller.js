'use scrict'

const RouterController = require('skeleton/controllers/router')

const menuConfig = Global.ui.menu.get('uc')

const GameRecordView = require('gameCenter/gameRecord/index')
// var RealBetRecordView = require('gameCenter/real/betRecord');
// var SlotBetRecordView = require('gameCenter/slot/betRecord');
// var SportBetRecordView = require('gameCenter/sport/betRecord');
// var FisherBetRecordView = require('gameCenter/fisher/betRecord');
const SlotCenterView = require('gameCenter/slot/slotTab')

const VipCenterController = RouterController.extend({

  ticketRecord() {
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
        title: '游戏记录',
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
  // realBetRecord: function() {
  //   this.changeMainReginView(new RealBetRecordView(), {
  //     main: {
  //       icon: menuConfig.icon,
  //       title: '真人投注'
  //     },
  //     sidebar: menuConfig
  //   });
  // },
  // slotBetRecord: function() {
  //   this.changeMainReginView(new SlotBetRecordView(), {
  //     main: {
  //       icon: menuConfig.icon,
  //       title: '老虎机投注'
  //     },
  //     sidebar: menuConfig
  //   });
  // },
  // sportBetRecord: function() {
  //   this.changeMainReginView(new SportBetRecordView(), {
  //     main: {
  //       icon: menuConfig.icon,
  //       title: '体育投注'
  //     },
  //     sidebar: menuConfig
  //   });
  // },
  // fisherBetRecord: function() {
  //   this.changeMainReginView(new FisherBetRecordView(), {
  //     main: {
  //       icon: menuConfig.icon,
  //       title: '捕鱼投注'
  //     },
  //     sidebar: menuConfig
  //   });
  // },
  slotCenter() {
    this.changeMainReginView(new SlotCenterView({ triggerTab: 'jsPTSlot' }), {
      main: {
        title: '老虎机',
      },
    })
  },
  slotCenterMG() {
    this.changeMainReginView(new SlotCenterView({ triggerTab: 'jsMGSlot' }), {
      main: {
        title: '老虎机',
      },
    })
  },


})

module.exports = VipCenterController
