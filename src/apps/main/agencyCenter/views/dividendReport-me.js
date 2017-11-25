

const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

const Timeset = require('com/timeset')


const DividendReportMeView = SearchGrid.extend({

  template: require('agencyCenter/templates/dividend-me.html'),

  events: {
	  'click .js-ac-application': 'applicationInfoHandler',
  },

  initialize () {
    _(this.options).extend({
    	
      height: 245,
      title: '报表查询',
      columns: [
        {
          name: '下级团队月度总盈亏',
          width: '18%',
        },
        {
          name: '下级直属号月度总分红',
          width: '18%', 
        },
        {
          name: '我的月度返点总额',
          width: '15%', 
        },
        {
          name: '我的分红比例',
          width: '12%', 
        },
        {
          name: '我的分红金额',
          width: '12%', 
        },
        {
          name: '结算日期',
          width: '11%', 
        },
        {
          name: '状态',
          width: '8%', 
        }, 
      ],
      tip: '<button type="button" class="js-ac-application btn ac-open-account-manual-button" data-loading-text="提交中">申请发放</button></br></br></br>' +  
    	  '<div class="tip-hot"><span>提示</span>  月度分红 = （下级团队的月度总盈亏 - 下级直属号的月度总分红 - 我的月度返点总额 ）* 我的分红比例。</div>' + 
      		
      		'',
      gridOps: {
        emptyTip: '没有资金变更记录',
      },
      ajaxOps: {
        url: '/fund/merchantBonus/dividinfo.json',
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
    const dataList = []
    dataList.push(gridData)
	  
    const rowsData = _(dataList).map(function(fundTrace, index, betList) {
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
     
    this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    this.$('.js-ac-dividId').val(rowInfo.dividId) 
    const row = []
    row.push(rowInfo.profitTotal / 10000)
    row.push(rowInfo.dividTotal / 10000)
    row.push(rowInfo.bonusTotal / 10000)
    row.push(rowInfo.divid / 100)
    row.push(rowInfo.dividAmount / 10000)
    row.push(rowInfo.closingDate)
    row.push(rowInfo.status)
    if (rowInfo.status == '未申请') {
    	$('.js-ac-application').show()
    } else {
    	$('.js-ac-application').hide()
    } 
    return row
  },
  
  applicationInfoHandler (e) {
      	const self = this
    Global.sync.ajax({
      url: '/fund/merchantBonus/get.json',
      data: {
        	 dividId: this.$('.js-ac-dividId').val(), 
      },
    })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('申请成功，等待审核', {
            type: 'success',
          })
          self.render()
        } else {
          Global.ui.notification.show(`申请失败，${res.msg}`)
        }
      })
  },
})

module.exports = DividendReportMeView
