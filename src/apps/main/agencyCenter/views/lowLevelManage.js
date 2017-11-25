

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

const LowLevelManageView = SearchGrid.extend({

  template: require('agencyCenter/templates/lowLevelManage.html'),

  className: 'lowLevelManage-view',

  events: {
    'click .js-ac-expend-btn': 'expendHandler',
    'click .js-ac-llm-cp': 'checkPayPwdSet',
  },

  initialize() {
    _(this.options).extend({
      footerClass: 'border-cool-top',
      height: 340,
      title: '下级管理',
      columns: [
        {
          name: '用户名',
          width: '12%',
        },
        {
          name: '返点',
          width: '12%',
        },
        {
          name: '个人余额',
          width: '10%',
        },
        {
          name: '团队余额',
          width: '12%',
        },
        {
          name: '注册时间',
          width: '16%',
        },
        {
          name: '<i class="js-ac-uDays sfa sfa-help-tip cursor-pointer vertical-middle"></i> 不活跃天数',
          width: '12%',
        },
        {
          name: '操作',
          width: '20%',
        },
      ],
      // gridOps: {
      //  emptyTip: '无记录'
      // },
      ajaxOps: {
        url: '/acct/subacctinfo/getsubacctlist.json',
      },
      subOps: {
        data: ['userParentId'],
      },
    })

    this.on('router:back', function() {
      this._getGridXhr()
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'regTimeStart',
      endTime: 'regTimeEnd',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)

    this.$('.js-ac-uDays').popover({
      trigger: 'hover',
      html: true,
      content: '<strong>不活跃天数定义</strong> <br />连续多少天内无任何账变，即为不活跃的天数',
      placement: 'bottom',
    })


    Global.newbieActivity.checkAgent()
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.subAcctList).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet,
      }
    }, this)

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map((parent, index) => {
        return {
          data: {
            userParentId: parent.userId,
          },
          label: parent.userName,
        }
      })
      this.renderBread()
    }

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })
      .hideLoading()

    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>总计</strong>',
        '',
        _(gridData.balanceTotal).convert2yuan(),
        _(gridData.subBalanceTotal).convert2yuan(),
        '',
        '',
        '',
      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []

    if (rowInfo.userSubAcctNum) {
      row.push(`<a class="js-pf-sub btn-link text-cool" data-label="${rowInfo.userName 
      }" data-user-parent-id="${rowInfo.userId}" href="javascript:void(0)">${ 
        rowInfo.userName}(${rowInfo.userSubAcctNum})</a> `)
    } else {
      row.push(`<span class="text-cool">${rowInfo.userName}</span>`)
    }

    row.push(`${_(rowInfo.rebate).formatDiv(10, { fixed: 1 })}%`)

    row.push(`<span class="text-bold-pleasant">${_(rowInfo.balance).convert2yuan()}</span>`)
    row.push(`<span class="text-bold-pleasant">${_(rowInfo.subBalance).convert2yuan()}</span>`)
    row.push(_(rowInfo.regTime).toTime())
    row.push(rowInfo.uDays)
    row.push(this._formatOperation(rowInfo))

    return row
  },

  _formatOperation(rowInfo) {
    let html = []
    const cell = []
   
    const acctInfo = Global.memoryCache.get('acctInfo')
    
    cell.push(`<a href="${_.getUrl(`/detail/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link text-cool">详情</a>`)

    if (rowInfo.direct && !this.isSub()) {
      if (!acctInfo.merchant) {
    	  cell.push(`<a href="${_.getUrl(`/rebate/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link">升点</a>`)
      }
      cell.push(`<a href="${_.getUrl(`/message/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link">发消息</a>`)
    }

    cell.push('<a href="javascript:void(0);"  class="js-ac-llm-cp btn btn-link ">转账</a>')
    cell.push(`<a href="${_.addHrefArgs(`#ac/betting/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link">投注</a>`)
    cell.push(`<a href="${_.addHrefArgs(`#ac/track/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link">追号</a>`)
    cell.push(`<a href="${_.addHrefArgs(`#ac/account/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link">账变</a>`)

    html.push('<div class="relative">')
    html = html.concat(cell.splice(0, 3))
    html.push('<i class="js-ac-expend-btn ac-expend-btn fa fa-angle-double-up fa-rotate-180 fa-2x"></i>')
    html.push('</div>')

    html.push('<div class="js-ac-expend ac-expend no-height">')
    html = html.concat(cell)
    html.push('</div>')

    return html.join('')
  },

  // event handlers

  expendHandler(e) {
    const $target = $(e.currentTarget)
    const $currentTr = $target.closest('tr')
    const $currentExpend = $target.closest('td').find('.js-ac-expend')
    if ($target.hasClass('fa-rotate-180')) {
      $currentExpend.css('height', 25)
    } else {
      $currentExpend.css('height', '')
    }
    $target.toggleClass('fa-rotate-180')

    $currentTr.siblings().find('.js-ac-expend').css('height', '').end()
      .find('.js-ac-expend-btn')
      .addClass('fa-rotate-180')
  },

  checkPayPwdXhr() {
    return Global.sync.ajax({
      url: '/fund/moneypd/checkpaypwd.json',
    })
  },

  checkPayPwdSet (e) {
    const $target = $(e.currentTarget)
    const rowInfo = this.grid.getRowData($target)

    if (Global.memoryCache.get('acctInfo').foundsLock) {
      Global.ui.notification.show('资金已锁定，请先' + '<a href="javascript:void(0);" onclick="document.querySelector(\'.js-gl-hd-lock\').click();" class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>' + '。')
      return false
    }

    this.checkPayPwdXhr()
      .done((res) => {
        if (res && res.result === 0) {
          // 设置了则弹出验证框
          // $(document).verifyFundPwd({parentView:self});
          Global.appRouter.navigate(`#ac/llm/transfer/${rowInfo.userId}?name=${rowInfo.userName}`, { trigger: true, replace: false })
        } else if (res && res.result === 1) {
          // 未设置则弹出链接到资金密码设置页面的提示框
          $(document).securityTip({
            content: '请补充完您的安全信息后再转账',
            showMoneyPwd: true,
            hasMoneyPwd: false,
            showBankCard: false,
            hasBankCard: false,
          })
          // self.$('.js-uc-cm-fundPwdSetNotice').removeClass('hidden');
          // self.$el.removeClass('hidden');
        }
      })
  },
})

module.exports = LowLevelManageView
