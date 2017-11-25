

const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

const Timeset = require('com/timeset')


const DividendReportSubView = SearchGrid.extend({

  template: require('agencyCenter/templates/dividend-sub.html'),

  events: {},

  initialize () {
    _(this.options).extend({
    	
      height: 305,
      title: '报表查询',
      columns: [
        {
          name: '用户名',
          width: '15%',
        },
        {
          name: '上半月团队总盈亏',
          width: '20%', 
        },
        {
          name: '上半月分红',
          width: '15%', 
        },
        {
          name: '下半月团队总盈亏',
          width: '20%', 
        },
        {
          name: '下半月分红',
          width: '15%', 
        },
        {
          name: '全月分红',
          width: '15%', 
        }, 
      ],
      // tip: '<div class="tip-hot"><span>提示</span>报表只保留最近35天的数据。</div>',
     
      ajaxOps: {
        url: '/fund/merchantBonus/dividsubinfo.json',
      },
      gridOps: {
        emptyTip: '没有资金变更记录',
      },
      //      ,subOps: {
      //        url: '/fund/fundreport/profitdetail.json',
      //        data: ['userId']
      //      }
    })
  },

  onRender () {
    // 初始化时间选择
	  this.$('.js-ac-timeSel').datetimepicker({
	      useCurrent: false,
	      format: 'YYYY-MM',
	      defaultDate: _(moment().add('days', -1)).toDate(),
	      minDate: moment().add('days', -330),
	    })
    // 初始化彩种
    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.dataList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace,
      }
    }, this)

    this.grid.refreshRowData(rowsData, undefined, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false,
    })

    //    if (!_(gridData.parents).isEmpty()) {
    //      this._breadList = _(gridData.parents).map(function(parent, index) {
    //        return {
    //          data: {
    //            userId: parent.userId
    //          },
    //          label: parent.userName
    //        };
    //      });
    //      this.renderBread();
    //    }
    
    this.grid.addFooterRows({
      trClass: 'tr-footer',
      columnEls: [
        '<strong>总计</strong>',
        gridData.dataTotal == null ? 0 : gridData.dataTotal.preProfitTotal / 10000,
        gridData.dataTotal == null ? 0 : gridData.dataTotal.preDividTotal / 10000,
        gridData.dataTotal == null ? 0 : gridData.dataTotal.nextProfitTotal / 10000,
        gridData.dataTotal == null ? 0 : gridData.dataTotal.nextDividTotal / 10000,
        gridData.dataTotal == null ? 0 : gridData.dataTotal.dividTotal / 10000,
      ],
    })
      .hideLoading()
    this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.userName)
    row.push(rowInfo.preProfitTotal / 10000)
    row.push(rowInfo.preDividTotal / 10000)
    row.push(rowInfo.nextProfitTotal / 10000)
    row.push(rowInfo.nextDividTotal / 10000)
    row.push(rowInfo.dividTotal / 10000)
    return row
  },
})

module.exports = DividendReportSubView
