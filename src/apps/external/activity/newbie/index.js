

require('./effect')

const NewbieView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-get-award': 'awardHandler',
    'click .js-check-agent': 'checkAgentHandler',
    'click .js-check-ranking': 'checkRankingHandler',
  },

  getInfoXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/info.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  getAgentInfoXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/agnetinfo.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  doGetXhr(data) {
    return Global.sync.ajax({
      url: '/info/friendactivity/doget.json',
      data: _(data).extend({
        activityId: this.options.activityId,
      }),
    })
  },

  getChartInfoXhr() {
    return Global.sync.ajax({
      url: '/info/friendactivity/chartinfo.json',
      data: {
        activityId: this.options.activityId,
      },
    })
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  updateInfo() {
    const self = this
    this.getInfoXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const data = self.data = res.root
          self.betLimit = data.betLimit
          self.$('.js-from-date').text(_(data.fromDate).toDate('MM.DD'))
          self.$('.js-end-date').text(_(data.endDate).toDate('MM.DD'))
          self.$('.js-open-date').text(_(moment(data.endDate).add('1', 'days')).toDate('MM月DD日'))
          self.$('.js-bet-limit').text(_(data.betLimit).convert2yuan())

          _(data.cftList).each((info) => {
            self.$(`.js-winner-count-${info.type}`).text(info.count)
            self.$(`.js-winner-bonus-${info.type}`).text(_(info.bonus).convert2yuan())
          })

          self.totalBonus = data.betBonus + data.rechargeBonus + data.registerBonus + data.withdrawBonus

          self.changeBtnStatus('register', data.registerFlag)
          self.changeBtnStatus('recharge', data.rechargeFlag)
          self.changeBtnStatus('bet', data.betFlag)
          self.changeBtnStatus('withdraw', data.withdrawFlag)

          self.$rankList.addClass('hidden')

          _(data.chartList).each((info, index) => {
            const $rank = self.$rankList.filter(`.js-rank-${index + 1}`)
            $rank.find('span').html(`<span>${info.userName 
            }</span> <span>${info.validUserCount}</span>`)
            $rank.removeClass('hidden')
          })
          // self.roll.roll(data.dataList);
        }
      })
  },

  onRender() {
    const self = this

    this.$getBtns = this.$('.js-get-award')
    this.$rankList = this.$('.js-rank-list li')

    this.updateInfo()
    setInterval(() => {
      self.updateInfo()
    }, 30000)

    const $rollLump = $('.prompt_content ul')
    $rollLump.setRoll()
  },

  changeBtnStatus(className, status) {
    const $btn = this.$getBtns.filter(`.${className}`)
    switch (status) {
      case 1:
        $btn.addClass('disabled').text('不可领取')
        break
      case 2:
        $btn.removeClass('disabled').text('领取')
        break
      case 3:
        $btn.addClass('disabled').text('已领取')
        break
    }
  },

  modalFailure(status) {
    let msg
    if (status === 1) {
      msg = '您的帐户不符合领取条件，有可能是：<br>1、同一IP下只能有一个帐户参与活动'
    } else if (status === 3) {
      msg = '当前任务未完成，暂无法领取该彩金！<br>加油吧！'
    } else if (status === 2) {
      msg = '今天的彩金已经被领完了，请明天早点过来领取吧！'
    }
    Global.ui.notification.show(msg, {
      notiType: 'cloud',
      btnContent: '返回',
    })
  },

  doGet(type, successMsg) {
    const self = this

    this.doGetXhr({
      type,
    })
      .done((res) => {
        let data
        let msg
        if (res && res.result === 0) {
          data = res.root || {}
          // (0：成功 1:未达标 2：前置任务未完成 3：奖金领完)
          if (data.status === 0) {
            msg = successMsg.replace(/%bonus/, _(data.bonus).convert2yuan())
            msg = msg.replace(/%nextBonus/, _(data.nextBonus).convert2yuan())
            Global.ui.notification.show(msg, {
              notiType: 'cloud',
              btnContent: '确认',
              event() {
                self.updateInfo()
              },
            })
          } else {
            self.modalFailure(data.status)
          }
        } else {
          Global.ui.notification.show(`您的帐户不符合领取条件，有可能是：<br>${res.msg}`)
        }
      })
  },

  // event handlers

  awardHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    if ($target.hasClass('disabled')) {
      return
    }

    switch ($target.data('type')) {
      case 'register':
        Global.ui.notification.show(`${'您正在参与“呼朋唤友”系列活动，活动期间任务未完成之前不可提现，' +
          '活动结束之后未完成任务将扣除彩金，完成全套任务可获得'}${_(self.totalBonus).convert2yuan()}元高额彩金。<br/>是否领取彩金参与该活动？`, {
          notiType: 'cloud',
          btnContent: '领取奖金',
          event() {
            self.doGet(1, '恭喜您获得%bonus元彩金，已打入您的帐户，请留意查收！<br>首次充值成功后，还可领取%nextBonus元，加油哦！')
          },
        })
        break
      case 'recharge':
        self.doGet(2, `恭喜您获得%bonus元奖金，已打入您的帐户，请留意查收！<br>消费达到${_(self.betLimit).convert2yuan()}元，还可领取%nextBonus元现金哦！`)
        break
      case 'bet':
        self.doGet(3, '恭喜您获得%bonus元奖金，已打入您的帐户，请留意查收！<br>提现成功后，还有%nextBonus元奖金奖励，加油哦！')
        break
      case 'withdraw':
        self.doGet(4, '恭喜您获得%bonus元奖金，已打入您的帐户，请留意查收！')
        break
    }
  },

  checkAgentHandler() {
    const self = this
    this.getAgentInfoXhr()
      .done((res) => {
        let data
        let msg
        if (res && res.result === 0) {
          data = res.root || {}

          if (_(data).isEmpty()) {
            Global.ui.notification.show('暂无可领取的奖金，有可能是：<br>' +
              '1、还未邀请好友注册<br>' +
              '2、您已经领取过奖金了<br>' +
              '3、您邀请的好友还未完成活动任务', {
              notiType: 'cloud',
            })
            return false
          }

          const html = []
          html.push('<table border="0" cellspacing="0" cellpadding="0"><tr> <td class="tb_gray">日期</td> <td class="tb_gray">已发展会员</td> <td class="tb_gray">有效会员</td> <td class="tb_gray">已领取奖金</td> <td class="tb_gray">可领取奖金</td></tr>')
          // if (!_(data).isEmpty()) {
          html.push(`<tr><td>${_(data.date).toDate('YYYY.MM.DD')}</td>`)
          html.push(`<td>${data.userCount}</td>`)
          html.push(`<td>${data.validUserCount}</td>`)
          html.push(`<td>${_(data.gotBonus).convert2yuan()}元</td>`)
          html.push(`<td>${_(data.bonus).convert2yuan()}元</td></tr>`)
          // }
          html.push('</table>')
          html.push('<div class="m-TB-md text-center">')
          html.push('<button type="button" class="js-pf-confirm btn btn-cloud btn-linear">确认</button>')
          html.push('<a href="index.html#ac/llm" target="_blank" class="js-pf--btn btn btn-cloud btn-linear">' +
            '查看下属详情</a>')
          html.push('</div>')

          const $dialog = Global.ui.notification.show(html.join(''), {
            notiType: 'cloud',
            btnContent: '确认',
            hasFooter: false,
            event() {
              self.updateInfo()
            },
          })

          $dialog.on('click', '.js-pf-confirm', () => {
            self.doGetXhr({
              type: 5,
            })
              .done((res) => {
                let data
                let msg
                if (res && res.result === 0) {
                  data = res.root || {}
                  if (data.status === 0) {
                    Global.ui.notification.show(`恭喜您获得${_(data.bonus).convert2yuan()}元奖金，已打入您的帐户，请留意查收！<br>` +
                      '<p class="font-xs">温馨提示：继续加油，进入排行，最高可领取5888元现金奖励！</p>', {
                      notiType: 'cloud',
                      btnContent: '查看我的排名',
                      event() {
                        self.$('.js-check-ranking').click()
                      },
                    })
                  } else {
                    if (data.status === 1) {
                      Global.ui.notification.show('暂无可领取的奖金，有可能是：<br>' +
                        '1、还未邀请好友注册<br>' +
                        '2、您已经领取过奖金了<br>' +
                        '3、您邀请的好友还未完成活动任务', {
                        notiType: 'cloud',
                      })
                      return false
                    }
                    self.modalFailure(data.status)
                  }
                } else {
                  Global.ui.notification.show('暂无可领取的奖金，有可能是：<br>' +
                    '1、还未邀请好友注册<br>' +
                    '2、您已经领取过奖金了<br>' +
                    '3、您邀请的好友还未完成活动任务', {
                    notiType: 'cloud',
                  })
                }
              })
          })
        } else {
          Global.ui.notification.show(`您的帐户不符合领取条件，有可能是：<br>${res.msg}`)
        }
      })
  },

  checkRankingHandler(e) {
    this.getChartInfoXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          if (data.validUserCount > 0) {
            Global.ui.notification.show(`您当前已邀请${data.userCount}位好友，其中有效会员${data.validUserCount 
            }位，目前排名${data.ranking}名！加油！`, {
              notiType: 'cloud',
              btnContent: '确认',
            })
          } else {
            Global.ui.notification.show('您当前还未发展任何有效会员，暂无排名！ ', {
              notiType: 'cloud',
              btnContent: '确认',
            })
          }
        }
      })
  },
})

module.exports = NewbieView
