

const betStatusConfig = require('userCenter/misc/betStatusConfig')
const ticketConfig = require('skeleton/misc/ticketConfig')
const Mark6Factory = require('bettingCenter/misc/betRulesFactory-mark6')

const OptionalBettingDetailView = require('userCenter/views/optionalBettingDetail')

const BettingDetailView = Base.ItemView.extend({

  template: require('userCenter/templates/bettingDetail.html'),

  printLogo: require('../../../../base/images/m-logo-name.png'),

  startOnLoading: true,

  events: {
    'click .js-uc-bdCancelBetting': 'cancelBettingHandler',
    'click .js-uc-betDetail-optional-betNum': 'showBettingDetailOfOptionalHandler',
    'click .js-uc-bdPrint': 'printBettingDetailHandler',
    'click .js-uc-betDetail-off': 'offbBetDetailHandler',
  },

  className: 'main-bettingDetail',

  getBetDetailXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/bet/detail.json',
      data,
    })
  },

  cancelBettingXhl(data) {
    return Global.sync.ajax({
      url: '/ticket/bet/cancel.json',
      data,
    })
  },

  confirmCancelBetting(e) {
    const self = this
    const $target = $(e.currentTarget)
    $target.button('loading')
    const data = { betId: this.$('#jsTicketBetId').val() }
    this.cancelBettingXhl(data)
      .always(() => {
        $target.button('reset')
      })
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('取消投注成功', {
            type: 'success',
          })
          self.render()
        } else {
          if (res.msg.indexOf('fail') !== -1) {
            Global.ui.notification.show('取消投注失败!')
          } else {
            Global.ui.notification.show(`取消投注失败：${res.msg}`)
          }
          self.render()
        }
      })
  },

  initialize() {
    _(this.options).defaults({
      detailPrevUrl: '#gc/cr/detail/',
    })
    this.mark6TicketIdArr = ticketConfig.getMark6TicketIdArr()
  },

  onRender() {
    const self = this
    this.maxLength = 20
    this.getBetDetailXhr({
      userId: this.options.userId,
      tradeNo: this.options.tradeNo,
    }).always(() => {
      self.loadingFinish()
    }).done((res) => {
      let data
		    if (res && res.result === 0) {
				    data = res.root || {}
				    self.isSelf = !(!_(self.options.userId).isUndefined() && (`${Global.memoryCache.get('acctInfo').userId}` !== `${self.options.userId}`)) 
				    self.is11xuan5 = self.is11X5(data.ticketName)
				    self.isPk10 = self.isPK10(data.ticketName)
				    self.renderBetInfo(data)
				    self.renderBetGrid(data.chaseTicketPlayDetail, data)
		    } else {
				    Global.ui.notification.show('操作失败。')
		    }
    }).then(() => {
		    self.renderBetPrint()
    })
  },

  is11X5(ticketName) {
    return ticketName.indexOf('11选5') !== -1
  },

  isPK10(ticketName) {
    return ticketName.indexOf('PK10') !== -1
  },

  renderBetInfo(betInfo) {
    this.$('#jsPaTicketName').html(betInfo.ticketName)
    if (betInfo.ticketPlanId === 'mmc') {
      this.$('#jsPaTicketPlanId').html('/')
    } else {
      this.$('#jsPaTicketPlanId').html(betInfo.ticketPlanId)
    }

    this.$('#jsPaBetTime').html(_(betInfo.betTime).toTime())
    this.$('#jsPaTicketBetNo').html(betInfo.ticketBetNo)
    this.$('#jsPaBetAllMoney').html(_(betInfo.betAllMoney).fixedConvert2yuan())
    this.$('#jsPaMoney').html(_(betInfo.money).convert2yuan())

    if (betInfo.ticketChaseNo) {
      this.$('.js-pa-link-track').attr('href', this.options.detailPrevUrl + betInfo.ticketChaseNo + _.getUrlParamStr()).removeClass('hidden')
    }

    const openNum = betInfo.openNum ? betInfo.openNum : '等,待,开,奖'

    // 如果是六合彩系类，改变球号颜色
    if (betInfo.openNum && (_.indexOf(this.mark6TicketIdArr, parseInt(betInfo.chaseTicketPlayDetail[0].ticketPlayId.toString().substring(0, 2))) > -1)) {
      const mark6NumberColor = Mark6Factory.getMark6NumberColor()
      this.$('#jsPaOpenNum').html(_(openNum.split(',')).map((openNum) => {
        let color = 'green'
        if (_.indexOf(mark6NumberColor.redArr, parseInt(openNum)) > -1) {
          color = 'red'
        } else if (_.indexOf(mark6NumberColor.blueArr, parseInt(openNum)) > -1) {
          color = 'blue'
        }
        return `<span class="text-circle text-circle-sm text-circle-pleasant m-right-sm ${color}">${openNum}</span>`
      }).join(''))
    } else {
      this.$('#jsPaOpenNum').html(_(openNum.split(',')).map((openNum) => {
        return `<span class="text-circle text-circle-sm text-circle-pleasant m-right-sm">${openNum}</span>`
      }).join(''))
    }

    if (betInfo.canCancel && this.isSelf) {
      this.$('.js-uc-bdCancelBetting').removeClass('hidden')
    }
    this.$('#jsTicketBetId').val(betInfo.ticketBetId)

    const selfName = Global.memoryCache.get('acctInfo').username

    if (!_(selfName).isUndefined() && !_(betInfo.username).isUndefined() && selfName !== betInfo.username) {
      this.$('.js-bd-title').html(`查看${betInfo.username}的投注详情`)
    }
  },

  renderBetPrint () {
    const self = this

    self.$('.print-table-header').css({
      background: `#FFFFFF url(${this.printLogo}) no-repeat 20px 15px`,
    })
    self.$('.js-print-title').html(self.$('#jsPaTicketName').html())
    self.$('.js-print-issue').html(self.$('#jsPaTicketPlanId').html())
    self.$('.js-print-bettime').html(self.$('#jsPaBetTime').html())
    self.$('.js-print-betno').html(self.$('#jsPaTicketBetNo').html())
    self.$('.js-print-betmoney').html(`${self.$('#jsPaBetAllMoney').html()}元`)

    let trs = ''
    this.$('.js-pa-play-detail .js-gl-static-tr').each((i, item) => {
      let numberList = $(item).data('bet-nums').toString().replace(/ /g, '')
      if (numberList.length > 500) {
        numberList = `${numberList.substring(0, 500)}......`
      }
      trs += `${'<tr>' +
              '<th>玩法</th><td>'}${$(item).data('ticket-level-name')}-${$(item).data('ticket-play-name')}</td>` +
              `<th>奖金模式</th><td>${$(item).find('td:eq(6)').html()}</td>` +
              `<th>注数/倍数/模式</th><td>${$(item).data('bet-num')}注/${$(item).data('bet-multiple')}倍/${$(item).find('td:eq(7)').html()}</td>` +
              '</tr>' +
              '<tr>' +
              `<th>投注内容</th><td colspan="5" width="90%" class="print-number-list">${numberList}</td>` +
              '</tr>'
    })
    this.$('.js-print-table tbody').append(trs)
  },

  renderBetGrid(row, data) {
    const self = this
    this.$('.js-pa-play-detail').staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      height: 366,
      colModel: [
        { label: '玩法群', name: 'ticketLevelName', width: '10%' },
        { label: '玩法', name: 'ticketPlayName', width: '10%' },
        {
          label: '投注号码',
          name: 'betNums',
          width: '15%',
          formatter(val, index, thisRow) {
            let html = (self.is11xuan5 || self.isPk10) ? val : val.replace(/ /g, '')
            if (thisRow.rx) {
              html = `<a class="js-uc-betDetail-optional-betNum btn-link btn-link-cool" data-id="${thisRow.ticketBetPlayId}" data-loading-text="处理中">详细号码</a>`
            } else if (html.length > self.maxLength) {
              html = '<a class="js-uc-betDetail-betNum btn-link btn-link-cool">详细号码</a>'
            }
            return html
          }, 
        },
        { label: '注数', name: 'betNum', width: '8%' },
        { label: '倍数', name: 'betMultiple', width: '8%' },
        {
          label: '投注金额',
          name: 'betMoney',
          width: '10%',
          formatter(val) {
            return `<span class="text-bold-cool">${_(val).fixedConvert2yuan()}</span>`
          }, 
        },
        {
          label: '奖金模式',
          name: 'singleMoney',
          width: '14%',
          formatter(val, index, info) {
            let cell = null
            // 如果是六合彩系类，奖金模式显示的文字更改
            if (_.indexOf(self.mark6TicketIdArr, parseInt(info.ticketPlayId.toString().substring(0, 2))) > -1) {
              if (info.betMethod === 0) {
                cell = '高奖金模式'
              } else {
                cell = '高返点模式'
              }
            } else {
              cell = _(val).chain().div(10000).mul(info.moneyMethod)
                .convert2yuan()
                .value()
              if (info.betMethod === 0) {
                cell = `${+cell}/0.0%`
              } else {
                cell = `${+cell}/${_(info.userRebate).formatDiv(10)}%`
              }
            }
            return cell
          },
        },
        {
          label: '投注模式',
          name: 'moneyMethod',
          width: '10%',
          formatter(val) {
            return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ? '分' : '厘'
          }, 
        },
        {
          label: '状态',
          name: 'money',
          width: '10%',
          formatter(val, index, thisRow) {
            let status = ''

            if (data.ticketBetStatus === 2) {
              status = '用户撤单'
            } else if (data.ticketBetStatus === 3) {
              status = '系统撤单'
            } else if (data.hasException) {
              status = '等待开奖'
            } else if (data.openNum === null) {
              if (data.ticketOpenStatus > 0) {
                status = '未中奖'
              } else {
                status = '等待开奖'
              }
            } else if (val === 0) {
              status = '未中奖'
            } else {
              status = `<span class="text-bold-pleasant">${_(val).convert2yuan()}</span>`
            }

            return status
          }, 
        },
      ],
      row,
    })
    let no = 0
    _(row).each(function(item) {
      item.betNums = (self.is11xuan5 || self.isPk10) ? item.betNums : item.betNums.replace(/ /g, '')
      if (item.betNums.length > self.maxLength && !item.rx) {
        $(self.$('.js-uc-betDetail-betNum')[no++]).popover({
          title: '详细号码<span class="js-uc-betDetail-off" style="float:right;cursor:pointer">X</span>',
          trigger: 'click',
          html: true,
          container: this.$el,
          content: `<div class="js-pf-popover"><span class="word-break">${item.betNums}</span></div>`,
          placement: 'right',
        })
      }
    }, this)
  },

  offbBetDetailHandler () {
    $('.js-uc-betDetail-betNum').popover('hide')
  },

  cancelBettingHandler(e) {
    const self = this
    const html = '<p>确定撤消订单？</p>'
    $(document).confirm({
      content: html,
      agreeCallback() {
        self.confirmCancelBetting(e)
      },
    })
  },
  showBettingDetailOfOptionalHandler (e) {
    const $target = $(e.currentTarget)
    const ticketBetPlayId = $target.data('id')
    let chaseView
    const $dialog = Global.ui.dialog.show({
      title: '详细号码',
      size: 'modal-lg',
      body: '<div class="js-ac-betDetail-container"></div>',
      bodyClass: 'no-padding',
      footer: '',
    })

    const $chaseContainer = $dialog.find('.js-ac-betDetail-container')

    $dialog.on('hidden.modal', function() {
      $(this).remove()
      chaseView.destroy()
    })

    chaseView = new OptionalBettingDetailView({
      el: $chaseContainer,
      ticketBetPlayId,
    }).render()
  },

  printBettingDetailHandler () {
		  const nowTime = `打印时间：${_(new Date()).toTime()}`
		  this.$('.js-print-time').html(nowTime)
    this.$('.js-print-contain').printThis({
      importCSS: false,
    })
    // var pristr = this.$('.js-print-contain').html();
    // var priWindow = window.open();
    // priWindow.document.write("<title>无限娱乐投注记录</title>");
    // priWindow.document.write(pristr);
    // setTimeout(function(){
    //   priWindow.print();
    //   priWindow.close();
    // },1);
  },
})

module.exports = BettingDetailView
