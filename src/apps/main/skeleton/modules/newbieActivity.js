

const NewbieModule = Base.Module.extend({

  startWithParent: false,

  checkLoginXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/newuserlogin.json',
      data: {
        activityId: 14,
      },
    })
  },

  checkRechargeXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/newuserrecharge.json',
      data: {
        activityId: 14,
      },
    })
  },

  checkBettingXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/newuserbet.json',
      data: {
        activityId: 14,
      },
    })
  },

  checkWithdrawalXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/newuserwithdraw.json',
      data: {
        activityId: 14,
      },
    })
  },

  checkAgentXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/agentsublist.json',
      data: {
        activityId: 14,
      },
    })
  },

  checkLogin() {
    this.checkLoginXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          if (data.valid) {
            Global.ui.notification.show(`有${_(data.bonus).convert2yuan()}元彩金可领取，是否领取？`, {
              notiType: 'cloud',
              btnContent: '马上查看',
              event() {
                window.open('activity.html?id=14')
              },
            })
          }
        }
      })
  },

  checkRecharge() {
    this.checkRechargeXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          if (data.valid) {
            Global.ui.notification.show(`新用户首次充值，可领取${_(data.bonus).convert2yuan()}元奖金，<br />` +
              `最高${_(data.totalBonus).convert2yuan()}元彩金等您领！`, {
              notiType: 'cloud',
              btnContent: '马上充值',
            })
          }
        }
      })
  },

  checkBetting() {
    this.checkBettingXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}

          if (data.finish) {
            Global.ui.notification.show(`恭喜达到消费${_(data.betLimit).convert2yuan() 
            }元，现在可领取${_(data.bonus).convert2yuan()}元奖励。`, {
              notiType: 'cloud',
              btnContent: '立即领取',
              event() {
                window.open('activity.html?id=14')
              },
            })
            return false
          }
          if (data.valid) {
            Global.ui.notification.show(`新用户消费流水达${_(data.betLimit).convert2yuan() 
            }元，即可领取${_(data.bonus).convert2yuan()}元彩金。`, {
              notiType: 'cloud',
              btnContent: '确认',
            })
          }
        }
      })
  },

  checkWithdrawal() {
    return this.checkWithdrawalXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}

          if (data.valid) {
            Global.ui.notification.show(`新用户首次提现再奖${_(data.bonus).convert2yuan() 
            }元，最高奖${_(data.bonusTotal).convert2yuan()}元。`, {
              notiType: 'cloud',
              btnContent: '了解详情',
              event() {
                window.open('activity.html?id=14')
              },
            })

            return false
          }

          if (data.finish) {
            Global.ui.notification.show(`提现成功，可领取${_(data.bonus).convert2yuan() 
            }奖金，马上去领取吧。`, {
              notiType: 'cloud',
              btnContent: '立即领取',
              event() {
                window.open('activity.html?id=14')
              },
            })
          }
        }
      })
  },

  checkAgent() {
    this.checkAgentXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          if (data.valid) {
            Global.ui.notification.show('现在邀请好友注册，发展下属会员，参与排名，最高奖5888元！', {
              notiType: 'cloud',
              btnContent: '查看详情',
              event() {
                window.open('activity.html?id=14')
              },
            })

            return false
          }

          if (data.dataValid) {
            if (data.userCount > 0) {
              Global.ui.notification.show(`您当前发展会员${data.userCount}位，目前排名${data.ranking 
              }名，加油！<br />最高5888元奖金等您拿！`, {
                notiType: 'cloud',
                btnContent: '查看详情',
                event() {
                  window.open('activity.html?id=14')
                },
              })
            } else {
              Global.ui.notification.show('您当前还未发展任何有效会员，暂无排名！ ', {
                notiType: 'cloud',
                btnContent: '确认',
              })
            }
          }
        }
      })
  },
})

module.exports = NewbieModule
