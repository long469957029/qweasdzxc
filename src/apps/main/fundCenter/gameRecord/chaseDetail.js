/**
 * Created by steven on 2017/12/18.
 */
require('./index.scss')

const BetDetailView = Base.ItemView.extend({

  template: require('fundCenter/gameRecord/chaseDetail.html'),

  events: {
    'click .js-cd-bet-select-content': 'selectContentHandle',
    'click .js-cd-bet-select-no': 'selectNoHandle',
    'click .js-cd-cancelAllTrack': 'cancelAllBettingHandler',
    'click .js-cd-cancel': 'cancelBettingHandler',
  },

  getBetDetailXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/chase/detail.json',
      data,
    })
  },
  cancelTrackXhl(data) {
    return Global.sync.ajax({
      url: '/ticket/chase/cancel.json',
      data,
    })
  },
  onRender() {
    this.$('.js-cd-bet-select-content').addClass('active')
    this.getChaseData()
  },
  getChaseData(){
    const self = this
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
        // self.is11xuan5 = self.is11X5(data.ticketName)
        // self.isPk10 = self.isPK10(data.ticketName)
        self.renderGeneralInfo(data)
        // self.renderPlayGrid(data.chaseTicketPlayDetail)
        self.renderPlanGrid(data.chaseTicketPlanDetail)
        if (data.ticketChaseStatus === 0 || data.ticketChaseStatus === 1) {
          this.$('.js-gr-submit-container').removeClass('hidden')
        }
      } else {
        Global.ui.notification.show(res.msg)
      }
    })
  },

  // 编辑一般数据
  renderGeneralInfo(info) {
    this.$('.jc-cd-chase-no').html(info.chaseFormNo)
    this.$('.jc-cd-chase-status').removeClass('hidden')
    switch (info.ticketChaseStatus) {
      case 0:
        this.$('.jc-cd-chase-status').html('未开始')
        break
      case 1:
        this.$('.jc-cd-chase-status').html('进行中')
        break
      case 2:
        this.$('.jc-cd-chase-status').html('已完成')
        break
      case 3:
        this.$('.jc-cd-chase-status').html('已终止')
        break
      default:
        break
    }
    this.$('.jc-cd-total-ticketName').html(info.ticketName)
    this.$('.jc-cd-total-plan').html(_(info.chaseAllAmount).fixedConvert2yuan())
    this.$('.jc-cd-total-bet').html(_(info.chaseAmount).fixedConvert2yuan())
    this.$('.jc-cd-total-win').html(_(info.money).fixedConvert2yuan())
    this.$('.js-cd-time').html(_(info.chaseTime).toTime())
    this.$('.js-cd-info-no').html(info.chasePeriods)
    this.$('.js-cd-info-total-no').html(info.chaseAllPeriods)
    this.$('.js-cd-info-isStop').html(Number(info.suspend) ? '是' : '否')
    const playData = info.chaseTicketPlayDetail[0]
    this.$('.js-cd-content-play').html(playData.playName)
    let betMethod = ''
    if (info.chaseTicketPlayDetail[0].moneyMethod === 10000) {
      betMethod = 2
    } else if (info.chaseTicketPlayDetail[0].moneyMethod === 1000) {
      betMethod = 0.2
    } else if (info.chaseTicketPlayDetail[0].moneyMethod === 100) {
      betMethod = 0.02
    } else if (info.chaseTicketPlayDetail[0].moneyMethod === 10) {
      betMethod = 0.002
    }
    // this.$('.js-cd-content-bet').html(`${_(playData.singleMoney).formatDiv(10000)}元（${betMethod}*${playData.betMethod}倍*${playData.betNum}注）`)
    this.$('.js-cd-content-bet').html(`${_(playData.singleMoney).formatDiv(10000)}元`)

    this.$('.js-cd-content-num').html(playData.betNums)
    this.$('.js-cd-ticketBetId').val(info.chaseFormId)
  },
  // 编辑奖期数据
  renderPlanGrid(row) {
    const self = this
    this.$('.js-cd-no-container').staticGrid({
      tableClass: 'table  table-hover table-center fc-cd-chase-no-table',
      height: 230,
      tableHeaderClass: 'fc-cd-chase-no-table-header',
      tableBodyClass: 'fc-cd-chase-no-table-body',
      colModel: [
        {label: '', name: '', width: '2%'},
        {label: '奖期', name: 'ticketPlanId', width: '15%'},
        {
          label: '开奖号码',
          name: 'ticketResult',
          width: '15%',
          formatter(val) {
            return val ? val.split(',') : ''
          },
        },
        {label: '倍数', name: 'betMultiple', width: '15%'},
        {
          label: '投注金额',
          name: 'amount',
          width: '15%',
          formatter(val) {
            return _(val).fixedConvert2yuan()
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
              status = `<span class="text-account-fund">${_(val).convert2yuan()}</span>`
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
              return `<button class="js-cd-cancel btn btn-link btn-link-red" type="button" data-chasePlanId="${thisRow.chasePlanId}">撤销</button>`
            }
            // if (thisRow.tradeId) {
            //   return `<a class="js-uc-td-view router btn btn-link btn-link-cool" href="${self.options.detailPrevUrl}${thisRow.tradeId}${_.getUrlParamStr()}">查看</a>`
            // }
            return ''
          },
        },
        {label: '', name: '', width: '2%'},
      ],
      row,
    })
  },
  // 终止所有追号
  cancelAllBettingHandler(e) {
    const self = this
    const html = '<p>确定停止追号？</p>'
    $(document).confirm({
      content: html,
      agreeCallback() {
        self.confirmCancelAllTrack(e)
      },
    })
  },
  confirmCancelAllTrack(e) {
    const self = this
    const $target = $(e.currentTarget)
    $target.button('loading')
    const data = {chaseId: this.$('.js-cd-ticketBetId').val()}
    this.cancelTrackXhl(data).always(() => {
      $target.button('reset')
    })
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('终止追号成功', {
            type: 'success',
          })
          // this.getChaseData()
          self.render()
          self.selectNoHandle()
          $('.js-fc-gr-tr-query').trigger('click'); //模拟点击事件刷新追号列表
          // self._getGridXhr()
        } else if (res.msg.indexOf('fail') !== -1) {
          Global.ui.notification.show('终止追号失败!')
        } else {
          Global.ui.notification.show(`终止追号失败：${res.msg}`)
        }
      })
  },
  // 取消单期追号
  cancelBettingHandler(e) {
    const self = this
    const html = '<p>确定撤销本期追号？</p>'
    $(document).confirm({
      content: html,
      modalDialogShadow: 'modal-dialog-shadow',
      agreeCallback() {
        self.confirmCancelTrack(e)
      },
    })
  },
  confirmCancelTrack(e) {
    const self = this
    const $target = $(e.currentTarget)
    $target.button('loading')
    const chasePlanId = $target.data('chaseplanid')
    const data = {chasePlanId, chaseId: this.$('.js-cd-ticketBetId').val()}
    this.cancelTrackXhl(data).always(() => {
      $target.button('reset')
    })
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('撤销追号成功', {
            type: 'success', modalDialogShadow: 'modal-dialog-shadow'
          })
          self.render()
          self.selectNoHandle()
        } else if (res.msg.indexOf('fail') !== -1) {
          Global.ui.notification.show('撤销追号失败!',{
            modalDialogShadow: 'modal-dialog-shadow'
          })
        } else {
          Global.ui.notification.show(`撤销追号失败：${res.msg}`,{
            modalDialogShadow: 'modal-dialog-shadow'
          })
        }
      })
  },
  selectContentHandle() {
    this.$('.js-cd-content-container').removeClass('hidden')
    this.$('.js-cd-no-container').addClass('hidden')

    this.$('.js-cd-bet-select-content').addClass('active')
    this.$('.js-cd-bet-select-no').removeClass('active')
  },
  selectNoHandle() {
    this.$('.js-cd-content-container').addClass('hidden')
    this.$('.js-cd-no-container').removeClass('hidden')

    this.$('.js-cd-bet-select-content').removeClass('active')
    this.$('.js-cd-bet-select-no').addClass('active')
  },
})
module.exports = BetDetailView
