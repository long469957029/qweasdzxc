'use scrict'

const RouterController = require('skeleton/controllers/router')


// var RealBetRecordView = require('gameCenter/real/betRecord');
// var SlotBetRecordView = require('gameCenter/slot/betRecord');
// var SportBetRecordView = require('gameCenter/sport/betRecord');
// var FisherBetRecordView = require('gameCenter/fisher/betRecord');
const SlotCenterView = require('gameCenter/slot/slotTab')

const VipCenterController = RouterController.extend({

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
