
const AgencyCenterController = RouterController.extend({

  lowLevelManage() {
  },

  // rebateManage(userId) {
  //   this.changeSubReginView(new LowLevelRebateView({
  //     userId,
  //   }), {
  //     main: {
  //       title: `编辑${_.getUrlParam('name')}的返点`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  lowLevelDetail(userId) {
    this.changeSubReginView(new LowLevelDetailView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的详情`,
      },
      parentRouter: 'ac/llm',
    })
  },

  // bettingRecords(userId) {
  //   this.changeSubReginView(new LowLevelBettingRecordsView({
  //     reqData: {
  //       userId,
  //     },
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的投注记录`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  // bettingDetail(userId, betId) {
  //   this.changeSubReginView(new LowLevelBettingDetailView({
  //     userId,
  //     tradeNo: betId,
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的投注详情`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  // trackRecords(userId) {
  //   this.changeSubReginView(new LowLevelTrackRecordsView({
  //     reqData: {
  //       userId,
  //     },
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的追号记录`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  // trackDetail(userId, tradeNo) {
  //   this.changeSubReginView(new LowLevelTrackDetailView({
  //     userId,
  //     tradeNo,
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的追号详情`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  openAccountManage() {
    this.changeMainReginView(new OpenAccountManageView(), {
      main: {
        title: '开户管理',
        titleDes: '<div class="js-ac-open-limit"></div>',
      },
      sidebar,
    })
  },

  teamBettingRecord() {
    this.changeMainReginView(new teamBettingRecordView({
      triggerTab: 'jsAcBrTr',
      userName: _.getUrlParam('name'),
    }), {
      main: {
        title: '团队投注',
        titleDes: '团队投注记录只保留近30天数据',
      },
      sidebar,
    })
  },

  profitAndLoss() {
  },

  ticketProfitAndLoss() {
  },
  gameProfitAndLoss() {
  },

  teamDynamic() {
  },

  // accountDetail(userId) {
  //   this.changeSubReginView(new LowLevelAccountDetailView({
  //     userId,
  //   }), {
  //     main: {
  //       title: `查看${_.getUrlParam('name')}的账变记录`,
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  sendMessage(userId) {
    this.changeSubReginView(new LowLevelSendMessageView({
      userId,
    }), {
      main: {
        title: '发送站内信',
      },
      parentRouter: 'ac/llm',
    })
  },

  // transfer(userId) {
  //   this.changeSubReginView(new LowLevelTransferView({
  //     userId,
  //   }), {
  //     main: {
  //       title: '下级转账',
  //     },
  //     parentRouter: 'ac/llm',
  //   })
  // },

  bettingRecords4Report(userId) {
    this.changeSubReginView(new LowLevelBettingRecordsView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的投注记录`,
      },
      parentRouter: 'ac/rm',
    })
  },

  accountDetail4Report(userId) {
    this.changeSubReginView(new LowLevelAccountDetailView({
      userId,
    }), {
      main: {
        title: `查看${_.getUrlParam('name')}的账变记录`,
      },
      parentRouter: 'ac/rm',
    })
  },
  openAccountManagePrice(ticket) {
    this.changeSubReginView(new OpenAccountManagePriceView({
      triggerTab: ticket,
      rebate: _.getUrlParam('rebate'),
    }), {
      main: {
        title: '奖金详情',
      },
      parentRouter: 'ac/oam',
    })
  },

  dividendManage() {
  },

  redPacket() {
  },

  rebateReport() {
  },
  dividendReport() {
  },
  directAgentGrant() {
  },
  lowLevelGrant() {
  },
  signUserManage() {
  },
  signUser() {
  },
  agreementManagement() {
  },
  // gameBettingRecord() {
  //   this.changeMainReginView(new teamBettingRecordView({ triggerTab: 'jsAcBrGr' }), {
  //     main: {
  //       title: '团队投注',
  //       titleDes: '团队投注记录只保留近30天数据',
  //     },
  //     sidebar,
  //   })
  // },
  teamAccountDetail() {
  },

  teamOverview() {
  },
  transfer(userId) {
  },

})

module.exports = AgencyCenterController
