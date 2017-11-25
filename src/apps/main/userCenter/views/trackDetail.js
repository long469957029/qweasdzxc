

const OptionalBettingDetailView = require('userCenter/views/optionalBettingDetail')

const TrackDetailView = Base.ItemView.extend({

  template: require('userCenter/templates/trackDetail.html'),

  printLogo: require('../../../../base/images/m-logo-name.png'),

  startOnLoading: true,

  className: 'uc-trackDetail-view',

  events: {
    'click .js-uc-td-cancelAllTrack': 'cancelAllBettingHandler',
    'click .js-uc-td-cancel': 'cancelBettingHandler',
    'click .js-uc-betDetail-optional-betNum': 'showBettingDetailOfOptionalHandler',
    'click .js-uc-bdPrint': 'printBettingDetailHandler',
  },

  getBetDetailXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/chase/detail.json',
      data,
    })
  },

  initialize () {
    _(this.options).defaults({
      detailPrevUrl: '#gc/tr/detail/',
    })
  },

  cancelTrackXhl(data) {
    return Global.sync.ajax({
      url: '/ticket/chase/cancel.json',
      data,
    })
  },

  confirmCancelAllTrack(e) {
    const self = this
    const $target = $(e.currentTarget)
    $target.button('loading')
    const data = { chaseId: this.$('#jsPaChaseFormId').val() }
    this.cancelTrackXhl(data).always(() => {
      $target.button('reset')
    })
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('终止追号成功', {
            type: 'success',
          })
          self.render()
        } else if (res.msg.indexOf('fail') !== -1) {
          Global.ui.notification.show('终止追号失败!')
        } else {
          Global.ui.notification.show(`终止追号失败：${res.msg}`)
        }
      })
  },
  cancelAllBettingHandler(e) {
    const self = this
    const html = '<p>确定终止追号？</p>'
    $(document).confirm({
      content: html,
      agreeCallback() {
        self.confirmCancelAllTrack(e)
      },
    })
  },

  confirmCancelTrack(e) {
    const self = this
    const $target = $(e.currentTarget)
    $target.button('loading')
    const chasePlanId = $target.data('chaseplanid')
    const data = { chasePlanId, chaseId: this.$('#jsPaChaseFormId').val() }
    this.cancelTrackXhl(data).always(() => {
      $target.button('reset')
    })
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('撤销追号成功', {
            type: 'success',
          })
          self.render()
        } else if (res.msg.indexOf('fail') !== -1) {
          Global.ui.notification.show('撤销追号失败!')
        } else {
          Global.ui.notification.show(`撤销追号失败：${res.msg}`)
        }
      })
  },

  cancelBettingHandler(e) {
    const self = this
    const html = '<p>确定撤销本期追号？</p>'
    $(document).confirm({
      content: html,
      agreeCallback() {
        self.confirmCancelTrack(e)
      },
    })
  },

  onRender() {
    const self = this
    this.maxLength = 20

    this.getBetDetailXhr({
      userId: this.options.userId,
      chaseFormId: this.options.chaseFormId,
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
        self.renderHeadInfo(data)
        self.renderPlayGrid(data.chaseTicketPlayDetail)
        self.renderPlanGrid(data.chaseTicketPlanDetail)
      } else {
        Global.ui.notification.show(res.msg)
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

  renderHeadInfo(info) {
    this.$('#jsPaTicketName').html(info.ticketName)
    this.$('#jsPaChaseStart').html(info.chaseStart)
    this.$('#jsPaChaseTime').html(_(info.chaseTime).toTime())
    this.$('#jsPaChaseFormNo').html(info.chaseFormNo)
    this.$('#jsPaStop').html(Number(info.suspend) ? '是' : '否')
    this.$('#jsPaPeriod').html(`${info.chasePeriods}/${info.chaseAllPeriods}`)
    this.$('#jsPaChaseAllAmount').html(_(info.chaseAllAmount).fixedConvert2yuan())
    this.$('#jsPaChaseAmount').html(_(info.chaseAmount).fixedConvert2yuan())
    this.$('#jsPaMoney').html(_(info.money).convert2yuan())
    this.$('#jsPaChaseFormId').val(info.chaseFormId)
  },
  renderBetPrint() {
    const self = this
    self.$('.print-table-header').css({
      background: `#FFFFFF url(${this.printLogo}) no-repeat 20px 15px`,
    })
    self.$('.js-print-title').html(self.$('#jsPaTicketName').html())
    self.$('.js-print-issue').html(self.$('#jsPaChaseStart').html())
    self.$('.js-print-bettime').html(self.$('#jsPaChaseTime').html())
    self.$('.js-print-betno').html(self.$('#jsPaChaseFormNo').html())
    self.$('.js-print-pastop').html(self.$('#jsPaStop').html())
    self.$('.js-print-totalIssue').html(self.$('#jsPaPeriod').html().replace(/[\s\S]*\//, ''))
    self.$('.js-print-betmoney').html(`${self.$('#jsPaChaseAllAmount').html()}元`)

    let trs = ''
    this.$('.js-pa-play-detail .js-gl-static-tr').each((i, item) => {
      let numberList = $(item).data('bet-nums').replace(/ /g, '')
      if (numberList.length > 500) {
        numberList = `${numberList.substring(0, 500)}......`
      }
      trs += `${'<tr>' +
        '<th>玩法</th><td>'}${$(item).attr('data-ticket-level-name')}-${$(item).attr('data-ticket-play-name')}</td>` +
        `<th>奖金模式</th><td>${$(item).find('td:eq(4)').html()}</td>` +
        `<th>注数/倍数/模式</th><td>${$(item).attr('data-bet-num')}注/${$(item).find('td:eq(5)').html()}</td>` +
        '</tr>' +
        '<tr>' +
        `<th>投注内容</th><td colspan="5" width="88%" class="print-number-list">${numberList}</td>` +
        '</tr>'
    })
    this.$('.js-print-table tbody').append(trs)
  },

  renderPlayGrid(row) {
    const self = this
    this.$('.js-pa-play-detail').staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      height: 75,
      colModel: [
        { label: '玩法群', name: 'ticketLevelName', width: '15%' },
        { label: '玩法', name: 'ticketPlayName', width: '15%' },
        {
          label: '投注号码',
          name: 'betNums',
          width: '15%',
          formatter(val, index, thisRow) {
            let html = (self.is11xuan5 || self.isPk10) ? val : val.replace(/ /g, '')
            // if(thisRow.rx){
            //  html  = '<a class="js-uc-betDetail-optional-betNum btn-link btn-link-cool" data-id="'+thisRow.ticketBetPlayId+'" data-loading-text="处理中">详细号码</a>';
            // }else
            if (html.length > self.maxLength) {
              html = '<a class="js-uc-trackDetail-betNum btn-link btn-link-cool">详细号码</a>'
            }
            return html
          },
        },
        { label: '注数', name: 'betNum', width: '15%' },
        {
          label: '奖金模式',
          name: 'singleMoney',
          width: '15%',
          formatter(val, index, info) {
            let cell = _(val).chain().div(10000).mul(info.moneyMethod)
              .convert2yuan()
              .value()

            if (info.betMethod === 0) {
              cell = `${+cell}/0.0%`
            } else {
              cell = `${+cell}/${_(info.userRebate).formatDiv(10)}%`
            }

            return cell
          }, 
        },
        {
          label: '投注模式',
          name: 'moneyMethod',
          width: '15%',
          formatter(val, info) {
            return val === 10000 ? '元' : val === 1000 ? '角' : val === 100 ? '分' : '厘'
          },
        },
      ],
      row,
    })
    let no = 0
    _(row).each(function(item) {
      item.betNums = (self.is11xuan5 || self.isPk10) ? item.betNums : item.betNums.replace(/ /g, '')
      if (item.betNums.length > self.maxLength) {
        $(self.$('.js-uc-trackDetail-betNum')[no++]).popover({
          title: '详细号码',
          trigger: 'click',
          html: true,
          container: this.$el,
          content: `<div class="js-pf-popover"><span class="word-break">${item.betNums}</span></div>`,
          placement: 'right',
        })
      }
    }, this)
  },

  renderPlanGrid(row) {
    const self = this
    this.$('.js-pa-plan-detail').staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      height: 230,
      colModel: [
        { label: '奖期', name: 'ticketPlanId', width: '15%' },
        {
          label: '开奖号码',
          name: 'ticketResult',
          width: '15%',
          formatter(val) {
            return val ? val.split(',') : ''
          }, 
        },
        { label: '倍数', name: 'betMultiple', width: '15%' },
        {
          label: '投注金额',
          name: 'amount',
          width: '15%',
          formatter(val) {
            return `<span class="text-bold-cool">${_(val).fixedConvert2yuan()}</span>`
          },
        },
        {
          label: '状态',
          name: 'money',
          width: '15%',
          formatter(val, index, thisRow) {
            let status = ''
            if (thisRow.planStatus === 4) {
              status = '未开始'
            } else if (thisRow.planStatus === 2) {
              status = '用户撤单'
            } else if (thisRow.planStatus === 3) {
              status = '系统撤单'
            } else if (thisRow.hasException) {
              status = '等待开奖'
            } else if (thisRow.ticketResult === null) {
              if (thisRow.ticketOpenStatus > 0) {
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
        {
          label: '操作',
          name: 'betStatus',
          width: '15%',
          formatter(val, index, thisRow) {
            if (thisRow.canCancel && self.isSelf) {
              self.$('.js-uc-td-cancelAllTrack').removeClass('hidden')
              return `<a class="js-uc-td-cancel btn btn-link btn-link-cool" href="javascript:void(0)" data-chasePlanId="${thisRow.chasePlanId}">撤销</a>`
            } 
            if (thisRow.tradeId) {
              return `<a class="js-uc-td-view router btn btn-link btn-link-cool" href="${self.options.detailPrevUrl}${thisRow.tradeId}${_.getUrlParamStr()}">查看</a>`
            }
            return ''
          }, 
        },
      ],
      row,
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
  },
})

module.exports = TrackDetailView
