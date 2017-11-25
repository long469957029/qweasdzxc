

const SearchGrid = require('com/searchGrid')

const Timeset = require('com/timeset')

const VipReturnVisitView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '发放时间',
          width: '25%',
        },
        {
          name: '礼金名称',
          width: '25%',
        },
        {
          name: '金额',
          width: '25%',
        },
        {
          name: '备注',
          width: '25%',
        },
      ],
      gridOps: {
        emptyTip: '没有记录',
      },
      ajaxOps: {
        url: '/acct/vip/vipincitelist.json',
        abort: false,
      },
      reqData: {
        subUser: 0,
      },
      listProp: 'root.dataList',
      height: 380,
    })
  },

  onRender() {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-pf-timeset'),
      startDefaultDate: this.options.startTime ? this.options.startTime : _(moment().startOf('day')).toTime(),
      endDefaultDate: this.options.endTime ? this.options.endTime : _(moment().endOf('day')).toTime(),
      endOps: {
        viewMode: 'years',
        format: 'YYYY-MM H:mm:ss',
      },
      startOps: {
        viewMode: 'years',
        format: 'YYYY-MM H:mm:ss',
      },
    }).render()


    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.dataList).map(function(info, index, list) {
      return {
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })

    // 加上统计行

    this.grid.addFooterRows({
      // trClass: 'tr-footer',
      columnEls: [
        '', '<div class="text-hot">总计</div>',
        `<div class="text-hot">${gridData.bonusTotal / 10000}</div>`, '',
      ],
    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    // console.log(rowInfo)
    const row = []
    // row.push(_(rowInfo.createTime).toTime());
    var strType = '/'
    if (rowInfo.type == 2) {
      strType = '月度亏损转运金'
    }
    if (rowInfo.type == 1) {
      strType = '月度盈利激励金'
    }
    row.push(_(rowInfo.createTime).toTime())

    var strType = '/'
    if (rowInfo.type == 2) {
      strType = '月度亏损转运金'
    }
    if (rowInfo.type == 1) {
      strType = '月度盈利激励金'
    }

    row.push(strType)
    row.push(rowInfo.bonus / 10000)
    row.push(rowInfo.month)
    return row
  },
})

module.exports = VipReturnVisitView
