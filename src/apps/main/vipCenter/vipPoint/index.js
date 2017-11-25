

require('./style.scss')
// var SearchGrid = require('com/searchGrid');
// var FilterHelper = require('skeleton/misc/filterHelper');

const Chart = require('com/chart')

const VipPointView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  // initialize: function () {
  //   _(this.options).extend({
  //     columns: [
  //       {
  //         name: ' ',
  //         width: '23%'
  //       },
  //       {
  //         name: 'V0',
  //         width: '11%'
  //       },
  //       {
  //         name: 'V1',
  //         width: '11%'
  //       },
  //       {
  //         name: 'V2',
  //         width: '11%'
  //       },
  //       {
  //         name: 'V3',
  //         width: '11%'
  //       },
  //       {
  //         name: 'V4',
  //         width: '11%'
  //       },
  //       {
  //         name: 'V5',
  //         width: '11%'
  //       },
  //       {
  //         name: 'V6',
  //         width: '11%'
  //       }
  //     ],
  //     gridOps: {
  //       emptyTip: ''
  //     },
  //     ajaxOps: {
  //       url: '/acct/vip/vipIntegral.json'
  //     },
  //     tip: '<div class="m-left-md"><span>提示：</span> 只保留最近35天的记录。</div>',
  //     height: 500,
  //     showHeadr: false
  //   });
  // },

  onRender() {
    const self = this
    this.$chart = this.$('.js-ac-chart')

    const chart = new Chart({
      el: this.$chart,
    }).render()


    // this.getConfigInfoXhr()
    //   .done(function(res) {
    //     // console.log(res)
    //   })

    this.getChartInfoXhr().done((res) => {
      chart.renderChart(self.chartOption(res.root.dataList))
    })

    // this.filterHelper = new FilterHelper();
    // this.$grid = this.$('.js-nc-platform-grid');
    // this.initGrid(this.$grid);
  },

  getConfigInfoXhr() {
    return Global.sync.ajax({
      url: '/acct/vip/queryVipIntegralCfg.json',
    })
  },

  getChartInfoXhr () {
    return Global.sync.ajax({
      url: '/acct/vip/vipIntegral.json',
    })
  },

  chartOption (data) {
    const currentDate = []
    const integral = []

    _(data).map((items, index) => {
      currentDate.push(items.currentDate)
      integral.push(_(items.integral).formatDiv(10000))
    })

    const option = {
      tooltip: {
        show: true,
        formatter (params) {
          const res = `${params.seriesName}：${params.value}`
          return res
        },
      },
      legend: {
        data: ['贡献值'],
      },
      xAxis: [
        {
          type: 'category',
          data: currentDate.reverse(),
          axisLabel: {
            show: true,
            textStyle: {
              color: '#2a2a2a',
            },
            interval: 0,
            rotate: 40,
          },
          axisLine: { // 轴线
            show: true,
            lineStyle: {
              color: '#057f84',
              type: 'solid',
              width: 2,
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: { // 轴线
            show: true,
            lineStyle: {
              color: '#057f84',
              type: 'solid',
              width: 2,
            },
          },
        },
      ],
      series: [
        {
          name: '贡献值',
          type: 'line',
          data: integral.reverse(),
        },
      ],
    }
    return option
  },

  // _getGridXhr: function() {
  //   var self = this;
  //   var filters = this.filterHelper.get();
  //   this.grid
  //     .clean()
  //     .showLoading();
  //
  //   Global.sync.ajax({
  //     url: this.options.ajaxOps.url,
  //     data: _(filters).extend(this.options.reqData)
  //   })
  //     .fail(function(def, type) {
  //       if (type !== 'abort') {
  //         //Global.ui.notification.show('服务器异常，无法加载列表');
  //         self.grid.hideLoading();
  //       }
  //     })
  //     .done(function(res) {
  //       if (res && res.result === 0) {
  //         self.renderGrid(res.root, res);
  //         //Global.m.news.updateUnReadNum({unReadNotice:res.root.unReadNotice});
  //       }
  //     });
  //
  //   return this;
  // },


  // initGrid: function($grid) {
  //   var self = this;
  //   $grid.grid({
  //     tableClass: 'table table-unbordered  no-margin' ,
  //     height:500,
  //     checkable: false,
  //     columnDefinitions: this.options.columns,
  //     emptyTip: this.options.gridOps.emptyTip,
  //     showHeader: false
  //   });
  //
  //   this.grid = $grid.grid('instance');
  //
  //   return this;
  // },

  // renderGrid: function(gridData) {
  //   var rowsData = _(gridData.dataList).map(function(info, index, list) {
  //     return {
  //       id: info.noticeId,
  //       columnEls: this.formatRowData(info, index, list),
  //       dataAttr: info
  //     };
  //   }, this);
  //
  //   if (gridData && gridData.length) {
  //     this.grid.hideEmpty();
  //   } else {
  //     this.grid.renderEmpty();
  //   }
  //
  //   this.grid.refreshRowData(rowsData, 35, {
  //     pageIndex: this.filterHelper.get('pageIndex'),
  //     initPagination: false
  //   })
  //     .hideLoading();
  //
  //   this.grid.$pagination.addClass('hidden');
  // },

  // formatRowData: function(rowInfo) {
  //
  //
  //   var currentDate = rowInfo.currentDate; //"2016-06-10";//当前日期
  //   var integral = rowInfo.integral/10000; //"100" ; //用户积分
  //
  //   var row = [];
  //   row.push('<span class="pull-left">' + currentDate + '</span>');
  //   var v0 = $('.js-vip0').html();
  //   var v1 = $('.js-vip1').html();
  //   var v2 = $('.js-vip2').html();
  //   var v3 = $('.js-vip3').html();
  //   var v4 = $('.js-vip4').html();
  //   var v5 = $('.js-vip5').html();
  //   var v6 = $('.js-vip6').html();
  //   var pointLevels = [v0,v1,v2,v3,v4,v5,v6];
  //   var tempValue = 0;
  //   var tempIndex = 0;
  //   var tempNext = 0;
  //   for(var i=1; i<pointLevels.length;i++) {
  //     if(pointLevels[i] >= integral) {
  //         tempValue = pointLevels[i-1];
  //         tempIndex = i-1;
  //         tempNext = pointLevels[i];
  //          break;
  //     }
  //   }
  //   var cvalue = 14.2857;
  //   var withValue = tempIndex* cvalue + ( (integral-tempValue)/(tempNext - tempValue))*cvalue ;
  //
  //   var vippoints = '<div class="progressbar_1" >'+
  //                   '<div class="bar" style="width: '+withValue+'%"></div><span style="margin-left: '+withValue+'% " >'+integral+'</span>'+
  //                   '</div>';
  //   row.push(vippoints);
  //
  //   return row;
  // }
})


module.exports = VipPointView
