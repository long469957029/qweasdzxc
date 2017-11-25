

const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

const Timeset = require('com/timeset')

const RebateReportView = SearchGrid.extend({

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      height: 335,
      title: '报表查询',
      columns: [
        {
          name: '日期',
          width: '20%',
        },
        {
          name: '下级团队当日有效投注总额',
          width: '25%', 
        },
        {
          name: '我的返点比例',
          width: '20%', 
        },
        {
          name: '返点金额',
          width: '15%', 
        },
        {
          name: '派发时间',
          width: '20%', 
        },  
      ],
      gridOps: {
        emptyTip: '没有返点记录',
      },
      ajaxOps: {
        url: '/fund/merchantBonus/bonusinfo.json',
      },
      //      ,subOps: {
      //        url: '/fund/fundreport/profitdetail.json',
      //        data: ['userId']
      //      }
     
      //      , listProp: 'root.dataList'
    	  
      tip: '<div class="tip-hot"><span>提示</span> 每天派发前一天的返点金额，返点金额 = 我的下级团队当日的有效投注总额 * 我的返点比例。</div>',
    })
  },

  onRender () {
    // 初始化时间选择
    new Timeset({
      el: this.$('.js-ac-timeSel'),
      startTime: 'fromDate',
      endTime: 'endDate',
      startTimeHolder: '起始日期',
      startDefaultDate: _(moment().add('day', -1)).toDate(),
      endTimeHolder: '结束日期',
      endDefaultDate: _(moment().add('day', -1)).toDate(),
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
    }).render()
    
    new Timeset({
      el: this.$('.js-ac-timeSend'),
      startTime: 'fromTime',
      endTime: 'endTime',
      startTimeHolder: '起始日期',
      //        startDefaultDate: _(moment()).toDate(),
      endTimeHolder: '结束日期',
      //        endDefaultDate: _(moment()).toDate(),
      startOps: {
        format: 'YYYY-MM-DD HH:mm:ss',	
      },
      endOps: {
        format: 'YYYY-MM-DD HH:mm:ss', 
      },
    }).render()
    
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
        '',
        '',
        gridData.bonusTotal / 10000,
        '',
      ],
    })
      .hideLoading()
    this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.date)
    row.push(rowInfo.betTotal / 10000)
    row.push(rowInfo.rebate / 100)
    row.push(rowInfo.bonus / 10000)
    row.push(_(rowInfo.createTime).toTime())
   
    return row
  },
  
   
})

module.exports = RebateReportView
