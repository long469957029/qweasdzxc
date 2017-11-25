

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')
const statusModule = require('../modules/pickUp/statusModule')

const MyGiftExchangeView = SearchGrid.extend({

  template: require('./giftExchange.html'),

  startOnLoading: true,

  events: {
    'click .js-edit-address': 'editAddressHandler',
  },
  serializeData() {
    return {
      loading: Global.ui.loader.get(),
    }
  },
  initialize () {
    _(this.options).extend({
      footerClass: 'mall-te-footer',
      tableClass: 'table table-bordered table-center no-margin',
      columns: [
        {
          name: '兑换时间',
          width: '15%',
        },
        {
          name: '礼物',
          width: '25%',
        },
        {
          name: '参考价格',
          width: '10%',
        },
        {
          name: '收货信息',
          width: '25%',
        },
        {
          name: '消耗积分值',
          width: '10%',
        },
        {
          name: '状态',
          width: '15%',
        },
      ],
      gridOps: {
        emptyTip: '亲，暂时没有记录~',
        // emptyClass:'sfa-mall-grid-empty'
      },
      ajaxOps: {
        url: '/mall/gift/myGiftList.json',
        abort: false,
      },
      reqData: {
        pageSize: 10,
      },
      listProp: 'root.records',
      height: 500,
      pageStyle: 'mall',
    })
  },
  onRender() {
    const self = this
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startTime: 'startDate',
      endTime: 'endDate',
      startDefaultDate: _(moment().startOf('day')).toDate(),
      endDefaultDate: _(moment().endOf('day')).toDate(),
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
      showIcon: true,
    }).render()

    SearchGrid.prototype.onRender.apply(this, arguments)
  },
  renderGrid(gridData) {
    const num = 0
    const rowsData = _(gridData.records).map(function(bet, index, betList) {
      return {
        columnEls: this.formatRowData(bet, index, betList),
        dataAttr: bet,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })

    // 加上统计行
    this.grid.addFooterRows({
      trClass: 'mall-footer',
      columnEls: [
        '所有页总计', '', '', '',
        _(gridData.dataTotal.totalIntegral).formatDiv(10000, { fixed: 2, clear: true }),
        '',
      ],
    }).hideLoading()
  },
  formatRowData (rowInfo) {
    const row = []

    row.push(_(rowInfo.exchangeDate).toTime())
    row.push(`<div class="text-left p-left-xs"><img src="${rowInfo.picUrl}" class="gift-img inline-block m-right-sm"><span class="inline-block">${rowInfo.itemName}</span></div>`)
    row.push(rowInfo.refPrice ? _(rowInfo.refPrice).convert2yuan() : '')
    row.push(`${'<div class="relative">' +
      '<div class="text-left">'}${_(rowInfo.exName).isNull() ? '暂无' : rowInfo.exName}</div>` +
      `<div class="text-left">${_(rowInfo.exPhone).isNull() ? '暂无' : rowInfo.exPhone}</div>` +
      `<div class="clearfix"><div class="pull-left text-left"></div><div class="pull-left text-left address-info">${_(rowInfo.exAddr).isNull() ? '暂无' : rowInfo.exAddr}</div></div>${ 
        rowInfo.itemStatus === 0 ? '<div class="pull-right js-edit-address edit-address"></div>' : '' 
      }</div>`)
    row.push(_(rowInfo.requireIntegral).convert2yuan())
    row.push(rowInfo.itemStatus === 0 ? '未发货' : `<div class="text-center">${rowInfo.exStore}</div><div class="text-center">${rowInfo.exTradeId}</div>`)
    return row
  },
  editAddressHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const info = $target.closest('tr')
    const data = {
      type: 'form',
      title: '收货信息',
      itemId: info.data('item-id'),
      exName: info.data('ex-name'),
      exAddr: info.data('ex-addr'),
      exPhone: info.data('ex-phone'),
    }
    const $dialog = Global.ui.dialog.show({
      anySize: '500',
      anyPosition: '170',
      body: '<div class="js-mall-gift-form mall-gift-form"></div>',
      bodyClass: 'mc-pick-up-module-body',
    })
    const $container = $dialog.find('.js-mall-gift-form')
    this.$statusModule = new statusModule(data).on('refresh:list', () => {
      self._getGridXhr()
    }).on('hidden.dialog', () => {
      $dialog.modal('hide')
    })
    $container.html(this.$statusModule.render().el)

    $dialog.on('hidden.modal', function (e) {
      $(this).remove()
      delete self.$statusModule
    })
  },
})

module.exports = MyGiftExchangeView
