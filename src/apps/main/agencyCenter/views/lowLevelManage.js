const SearchGrid = require('com/searchGrid')

// const Timeset = require('com/timeset')
const LowLevelRebateView = require('agencyCenter/views/lowLevelManage-rebate')

const LowLevelManageView = SearchGrid.extend({

  template: require('agencyCenter/templates/lowLevelManage.html'),

  className: 'lowLevelManage-view basic-black border-top p-bottom-lg',

  events: {
    'click .js-ac-expend-btn': 'expendHandler',
    'click .js-ac-llm-cp': 'checkPayPwdSet',
    'change .js-select-type': 'selectChangeHandler',
    'click .js-ac-point-up': 'pointUpHandler',
    'click .js-low-sub': 'subUserHandler',
  },

  initialize() {
    _(this.options).extend({
      footerClass: 'border-cool-top',
      height: 598,
      title: '下级管理',
      columns: [
        {
          name: '用户名',
          width: '12%',
        },
        {
          name: '类型',
          width: '10%',
        },
        {
          name: '返点',
          width: '10%',
          sortable: true,
          id: 1,
        },
        {
          name: '个人余额',
          width: '10%',
          sortable: true,
          id: 2,
        },
        {
          name: '团队余额',
          width: '12%',
          sortable: true,
          id: 5,
        },
        {
          name: '注册时间',
          width: '16%',
          sortable: true,
          id: 3,
        },
        {
          name: '不活跃天数',
          width: '10%',
          sortable: true,
          id: 4,
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
      reqData: {
        pageSize: 12,
      },
      subBreadCallBack:(e) => {
        this.subUserHandler(e)
      }
    })

    this.on('router:back', function () {
      this._getGridXhr()
    })
  },

  onRender() {
    this.acctInfo = Global.memoryCache.get('acctInfo')
    SearchGrid.prototype.onRender.apply(this, arguments)
    this.$personalBalance = this.$('.js-personal-balance')
    this.$teamBalance = this.$('.js-team-balance')
    this.$personalInput = this.$('.js-personal-input')
    this.$teamInput = this.$('.js-team-input')
    // Global.newbieActivity.checkAgent()
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.subAcctList).map(function (bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet,
      }
    }, this)

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map((parent) => {
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

    // this.grid.addFooterRows({
    //   trClass: 'tr-footer',
    //   columnEls: [
    //     '<strong>总计</strong>',
    //     '',
    //     _(gridData.balanceTotal).convert2yuan(),
    //     _(gridData.subBalanceTotal).convert2yuan(),
    //     '',
    //     '',
    //     '',
    //   ],
    // })
    //   .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    const sameUserId = rowInfo.userId === this.userParentId
    const textClass = sameUserId ? 'text-pleasant' : ''
    const freeze = (rowInfo.userStatus === 100 || rowInfo.userStatus === 101) ? '<span class="sfa sfa-freeze vertical-middle"></span>' : ''
    const online = rowInfo.online ? '<span class="text-circle-online inline-block"></span>' : ''
    if (!sameUserId && rowInfo.userSubAcctNum) {
      row.push(`${freeze}<a class="js-pf-sub js-low-sub btn-link ${textClass}" data-label="${rowInfo.userName}" data-user-parent-id="${rowInfo.userId}" href="javascript:void(0)">${
        rowInfo.userName}(${rowInfo.userSubAcctNum})</a>${online} `)
    } else {
      row.push(`${freeze}<span class="${textClass}">${rowInfo.userName}</span>`)
    }
    row.push(`<span class="${textClass}">${rowInfo.userType === 0 ? '代理' : '会员'}</span>`)
    row.push(`<span class="${textClass}">${_(rowInfo.rebate).formatDiv(10, {fixed: 1})}%</span>`)

    row.push(`<span class="${textClass}">${_(rowInfo.balance).convert2yuan()}</span>`)
    row.push(`<span class="${textClass}">${_(rowInfo.subBalance).convert2yuan()}</span>`)
    row.push(`<span class="${textClass}">${_(rowInfo.regTime).toTime()}</span>`)
    row.push(`<span class="${textClass}">${rowInfo.uDays}</span>`)
    row.push(this._formatOperation(rowInfo))

    return row
  },

  _formatOperation(rowInfo) {
    let html = []
    const cell = []

    const acctInfo = Global.memoryCache.get('acctInfo')

    // cell.push(`<a href="${_.getUrl(`/detail/${rowInfo.userId}`, 'name', rowInfo.userName)}" class="router btn btn-link text-cool">详情</a>`)

    if (rowInfo.direct && !this.isSub()) {
      cell.push(`<button class="btn btn-link btn-im js-toolbar-im-dialog" data-id="${rowInfo.userId}">站内信</button>`)
      if (!acctInfo.merchant) {
        cell.push(`<a class="btn btn-link js-ac-point-up" data-userid="${rowInfo.userId}" data-username="${rowInfo.userName}">升点</a>`)
        cell.push('<a href="javascript:void(0);"  class="js-ac-llm-cp btn btn-link ">转账</a>')
        cell.push(`<div class="llm-operator-sub"><a href="${_.addHrefArgs('#/ac/tbr', 'name', rowInfo.userName)}" class="router btn btn-link">投注</a>`)
        cell.push(`<a href="${_.addHrefArgs('#/ac/tad', 'name', rowInfo.userName)}" class="router btn btn-link">账变</a></div>`)
      } else {
        cell.push(`<a href="${_.addHrefArgs('#/ac/tbr', 'name', rowInfo.userName)}" class="router btn btn-link">投注</a>`)
        cell.push(`<a href="${_.addHrefArgs('#/ac/tad', 'name', rowInfo.userName)}" class="router btn btn-link">账变</a>`)
      }
    }else{
      cell.push(`<div class="text-center"><a href="${_.addHrefArgs('#/ac/tbr', 'name', rowInfo.userName)}" class="router btn btn-link">投注</a>`)
      cell.push(`<a href="${_.addHrefArgs('#/ac/tad', 'name', rowInfo.userName)}" class="router btn btn-link">账变</a></div>`)
    }

    if (cell.length > 3) {
      html.push('<div class="relative">')
      html = html.concat(cell.splice(0, 3))
      html.push('<i class="js-ac-expend-btn ac-expend-btn fa fa-angle-up fa-rotate-180 fa-2x"></i>')

      html.push('<div class="js-ac-expend ac-expend hidden">')
      html = html.concat(cell.splice(cell.length - 2, cell.length))
      html.push('</div></div>')
    } else {
      html = [...cell]
    }


    return html.join('')
  },

  // event handlers

  expendHandler(e) {
    const $target = $(e.currentTarget)
    const $currentTr = $target.closest('tr')
    const $currentExpend = $target.closest('td').find('.js-ac-expend')
    if ($target.hasClass('fa-rotate-180')) {
      $currentExpend.removeClass('hidden')
    } else {
      $currentExpend.addClass('hidden')
    }
    $target.toggleClass('fa-rotate-180')

    $currentTr.siblings().find('.js-ac-expend').addClass('hidden').end()
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
      Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
        'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
      return false
    }

    this.checkPayPwdXhr()
      .done((res) => {
        if (res && res.result === 0) {
          // 设置了则弹出验证框
          // $(document).verifyFundPwd({parentView:self});
          Global.router.goTo(`ac/tr/${rowInfo.userId}?name=${rowInfo.userName}`, {
            trigger: true,
            replace: false,
          })
        } else if (res && res.result === 1) {
          // 未设置则弹出链接到资金密码设置页面的提示框
          $(document).securityTip({
            showMoneyPwd: true,
            hasMoneyPwd: false,
            showBankCard: false,
            hasBankCard: false,
            content: '资金密码未设置，请先设置资金密码后再转账',
          })
          // self.$('.js-uc-cm-fundPwdSetNotice').removeClass('hidden');
          // self.$el.removeClass('hidden');
        }
      })
  },
  selectChangeHandler(e) {
    const $target = $(e.currentTarget)
    const val = Number($target.val())
    if (val === 1) {
      this.$personalBalance.removeClass('hidden')
      this.$teamBalance.addClass('hidden')
      this.$teamInput.val('')
    } else if (val === 2) {
      this.$personalBalance.addClass('hidden')
      this.$teamBalance.removeClass('hidden')
      this.$personalInput.val('')
    }
  },
  pointUpHandler(e) {
    const $target = $(e.currentTarget)
    const userId = $target.data('userid')
    const userName = $target.data('username')
    const $dialog = Global.ui.dialog.show({
      closeBtn: false,
      anySize: 480,
      bodyClass: 'no-padding',
      body: '<div class="js-ac-point-up-dialog"></div>',
    })
    const $dialogContant = $dialog.find('.js-ac-point-up-dialog')
    const rebataView = new LowLevelRebateView({
      userId,
      userName,
    })
    $dialogContant.html(rebataView.render().el)

    $dialog.on('hidden.modal', function () {
      $(this).remove()
      rebataView.destroy()
    })
  },
  subUserHandler(e){
    const $target = $(e.currentTarget)
    this.userParentId = $target.data('user-parent-id')
  }
})

module.exports = LowLevelManageView
