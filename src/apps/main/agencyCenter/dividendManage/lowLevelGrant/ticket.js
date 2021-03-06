

const SearchGrid = require('com/searchGrid')

const grantConfig = require('../grantConfig')

const DividendDetailView = require('agencyCenter/dividendManage/dividendDetail')

const TicketDividView = SearchGrid.extend({

  template: require('./common.html'),

  events: {
    'click .js-ac-grant': 'grantHandler',
    'click .js-ac-multi-grant': 'multiGrantHandler',
    'click .js-ac-detail': 'detailHandler',
  },

  giveOutXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/give.json',
      data,
    })
  },

  initialize() {
    _(this.options).extend({
      columns: [
        {
          name: '用户名',
          width: '12%',
        },
        {
          name: '总投注额',
          width: '12%',
        },
        {
          name: '日均投注额',
          width: '12%',
        },
        {
          name: '总盈亏',
          width: '12%',
        },
        {
          name: '分红比',
          width: '12%',
        },
        {
          name: '分红金额',
          width: '12%',
        },
        {
          name: '状态',
          width: '12%',
        },
        {
          name: '操作',
          width: '16%',
        },
      ],
      gridOps: {
        emptyTip: '没有发放记录',
      },
      ajaxOps: {
        url: '/fund/divid/findsubdivid.json',
      },
      reqData: {
        type: this.options.type,
        month: this.options.month,
        halfMonth: this.options.halfMonth,
        userName: this.options.userName,
        status: this.options.status,
        pageSize: 12,
      },
      // checkable: true,
      listProp: 'root.records',
      // tip: '<span class="m-right-sm vertical-middle"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      // '<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      // '<div class="btn-group"><button class="js-ac-multi-grant btn btn-sm">发放</button></div>',
      height: 492,
    })
  },
  //
  // serializeData: function() {
  //  return {
  //    type: this.options.type,
  //    month: this.options.month,
  //    halfMonth: this.options.halfMonth,
  //    userName: this.options.userName,
  //    status: this.options.status
  //   };
  // },

  onRender() {
    SearchGrid.prototype.onRender.apply(this, arguments)
    return this
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.records).map(function(info, index, list) {
      return {
        id: info.dividId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })

    // 加上统计行
    // "dataTotal":{
    //   "profitTotal":"0",
    //     "dividTotal":"0",
    //     "betTotal":"0",
    //     "dailyBetTotal":"0"
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '所有页总计：',
        _(gridData.dataTotal && gridData.dataTotal.betTotal).convert2yuan(),
        _(gridData.dataTotal && gridData.dataTotal.dailyBetTotal).convert2yuan(),
        _(gridData.dataTotal && gridData.dataTotal.profitTotal).convert2yuan(),
        '',
        _(gridData.dataTotal && gridData.dataTotal.dividTotal).convert2yuan(),
        '',
        '',
      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    // "userId":256,
    // "dividTotal":"0",
    // "dividTotal":"0",
    // "status": 9

    row.push(rowInfo.userName)
    row.push(_(rowInfo.betTotal).convert2yuan())
    row.push(_(rowInfo.dailyBetTotal).convert2yuan())
    row.push(_(rowInfo.profitTotal).convert2yuan())
    row.push(`${_(rowInfo.divid).formatDiv(100)}%`)
    row.push(_(rowInfo.dividTotal).convert2yuan())
    row.push(grantConfig.getZh(rowInfo.status))

    const operate = []

    if (rowInfo.status === grantConfig.getByName('WAIT').id) {
      operate.push('<button class="js-ac-grant btn btn-link btn-link-pleasant">发放</button>')
    }

    // if (rowInfo.status === grantConfig.getByName('DONE').id) {
    //   operate.push(`<a href="#fc/ad?tradeNo=${rowInfo.tradeNo}" class="btn btn-link btn-link-pleasant">查看</a>`)
    // }

    // operate.push('<button class="js-ac-detail btn btn-link btn-link-cool">明细</button>');
    row.push(operate.join(''))

    return row
  },

  _giveOut($target, data) {
    const self = this

    $(document).confirm({
      title: '提示',
      content: '确定将分红发放至下级？',
      agreeCallback() {
        $target.button('loading')
        self.giveOutXhr(data)
          .always(() => {
            $target.button('reset')
          })
          .done((res) => {
            if (res && res.result === 0) {
              self._getGridXhr()
            } else {
              Global.ui.notification.show(res.msg || '')
            }
          })
      },
    })
  },

  // event handlers

  grantHandler(e) {
    const $target = $(e.currentTarget)
    const data = this.grid.getRowData($target)

    this._giveOut($target, {
      dividId: data.dividId,
      type: 0,
    })
  },

  multiGrantHandler(e) {
    const $target = $(e.currentTarget)
    const ids = this.grid.getChk().ids

    if (!ids) {
      return false
    }

    this._giveOut($target, {
      dividId: ids.join(','),
    })
  },

  detailHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const data = this.grid.getRowData($target)

    const $dialog = Global.ui.dialog.show({
      title: `${data.username}的分红明细`,
      size: 'modal-lg',
      body: '<div class="js-ac-detail"></div>',
      footer: '',
    })

    const $detail = $dialog.find('.js-ac-detail')

    $dialog.on('hidden.modal', function() {
      $(this).remove()
      self.dividendDetailView.destroy()
    })

    this.dividendDetailView = new DividendDetailView({
      dividId: data.dividId,
      userId: data.userId,
      el: $detail,
    }).render()
  },
})

module.exports = TicketDividView
