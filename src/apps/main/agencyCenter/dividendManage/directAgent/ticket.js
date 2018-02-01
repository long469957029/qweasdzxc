

const SearchGrid = require('com/searchGrid')

const grantConfig = require('../grantConfig')

const DividendDetailView = require('agencyCenter/dividendManage/dividendDetail')

const GameDividView = SearchGrid.extend({

  template: require('./common.html'),

  events: {
    'click .js-ac-dm-lg-type-btn': 'lowLevelDividendTypeChangeHandler',
    'click .js-ac-grant': 'grantHandler',
    'click .js-ac-multi-grant': 'multiGrantHandler',
    'click .js-ac-detail': 'detailHandler',
  },

  lowLevelDividendTypeChangeHandler(e) {
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    // this.$('.js-ac-dm-lg-type').val(type);
    // this.$('button[type=submit]').trigger('click');
    this.options.type = type
    this.options.cycle = this.$('select[name=cycle]').val()
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
          name: '分红周期',
          width: '12%',
        },
        {
          name: '团队总投注额',
          width: '12%',
        },
        {
          name: '团队总盈亏',
          width: '12%',
        },
        {
          name: '分红比例',
          width: '12%',
        },
        {
          name: '分红金额',
          width: '12%',
        },
      ],
      gridOps: {
        emptyTip: '没有分红记录',
      },
      ajaxOps: {
        url: '/fund/merchantBonus/finddividsubinfo.json',
      },
      reqData: {
        type: this.options.type,
        month: this.options.month,
        halfMonth: this.options.halfMonth,
        userName: this.options.userName,
      },
      // checkable: true,
      listProp: 'root.records',
      // tip: '<span class="m-right-sm vertical-middle"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      // '<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      // '<div class="btn-group"><button class="js-ac-multi-grant btn btn-sm">发放</button></div>',
      height: 600,
    })
  },

  // serializeData: function() {
  //   return {
  //     type: this.options.type,
  //     month: this.options.month,
  //     halfMonth: this.options.halfMonth,
  //     userName: this.options.userName,
  //     status: this.options.status
  //   };
  //
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
        '所有页总计：', '',
        _(gridData.dataTotal && gridData.dataTotal.betTotal).convert2yuan(),
        _(gridData.dataTotal && gridData.dataTotal.profitTotal).convert2yuan(),
        '',
        _(gridData.dataTotal && gridData.dataTotal.dividTotal).convert2yuan(),
      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.userName)
    row.push(rowInfo.cycle)
    row.push(_(rowInfo.betTotal).convert2yuan())
    row.push(_(rowInfo.profitTotal).convert2yuan())
    row.push(_(rowInfo.divid).formatDiv(100))
    row.push(_(rowInfo.dividTotal).convert2yuan())
    return row
  },


})

module.exports = GameDividView
