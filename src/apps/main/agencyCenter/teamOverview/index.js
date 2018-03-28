let Chart

import Timeset from 'com/timeset'
const BtnGroup = require('com/btnGroup')
require('./index.scss')

const TeamOverviewView = Base.ItemView.extend({

  template: require('agencyCenter/teamOverview/index.html'),

  startOnLoading: true,

  className: 'ac-so-view',

  events: {
    // 'click .js-ac-statistic-type': 'statisticTypeChangeHandler'
  },
  // 团队总览-人数和余额
  // root:{  count:50,   // 团队总人数  balance:1000000 // 团队余额}
  getBalanceXhr() {
    return Global.sync.ajax({
      url: '/info/gamereport/balance.json',
    })
  },
  // 团队总览-新增人数/活跃人数
  // root:{  newSub:50,  // 新增人数  active:1000000  // 活跃人数}
  getNewUserActiveUserXhr(data) {
    return Global.sync.ajax({
      url: '/info/gamereport/count.json',
      data,
    })
  },
  // 团队总览-充值/提现
  // root:{  recharge:10000, // 充值金额  withdraw:1000000    // 提现金额}
  getRechargeWithdrawlXhr(data) {
    return Global.sync.ajax({
      url: '/info/gamereport/recharge.json',
      data,
    })
  },
  // 团队总览--盈亏（投注/派奖/返点/活动/盈亏）/
  // root:{  bet:10000,  // 投注  prize:1000000,  // 派奖  rebate:1000000, // 返点  activity:1000000,   // 活动  profit:100000   /盈亏}
  getProfitXhr(data) {
    return Global.sync.ajax({
      url: '/info/gamereport/profit.json',
      data,
    })
  },
  // 团队总览-最近15天动态数据
  getOverviewXhr(data) {
    return Global.sync.ajax({
      url: '/fund//dashboard/teamChart.json',
      data,
    })
  },
  initialize () {

  },

  onRender() {
    const self = this
    this.$Count = this.$('.js-ac-to-co')
    this.$NewUser = this.$('.js-ac-to-new')
    this.$Online = this.$('.js-ac-to-online')
    this.$Active = this.$('.js-ac-to-active')
    this.$NoActive = this.$('.js-ac-to-noActive')
    this.$Recharge = this.$('.js-ac-to-re')
    this.$Withdraw = this.$('.js-ac-to-wi')
    this.$Bet = this.$('.js-ac-to-be')
    this.$Bonus = this.$('.js-ac-to-bo')
    this.$Rebate = this.$('.js-ac-to-reb')
    this.$Activity = this.$('.js-ac-to-ac')
    this.$Profit = this.$('.js-ac-to-pr')
    this.$Water = this.$('.js-ac-to-water')
    this.$Commission = this.$('.js-ac-to-commission')
    this.$Balance = this.$('.js-ac-to-balance')
    self._onRender()
    // 按需加载
    require.ensure(['com/chart'], (require) => {
      Chart = require('com/chart')

      self.loadingFinish()
      self.renderOverview()
    }, 'chart')
    this.renderBalance()
  },
  renderBalance() {
    const self = this
    this.getBalanceXhr().done((res) => {
      if (res.result === 0) {
        self.$Count.html(res.root.count)
        self.$Balance.html(_(res.root.balance).format2yuan())
      }
    })
  },
  renderOtherData(reqData) {
    const self = this
    this.getNewUserActiveUserXhr(reqData).done((res) => {
      if (res.result === 0) {
        self.$NewUser.html(res.root.newSub)
        self.$Active.html(res.root.active)
        self.$Online.html(res.root.onlineCount)
        self.$NoActive.html(res.root.noActive)
      }
    })
    this.getRechargeWithdrawlXhr(reqData).done((res) => {
      if (res.result === 0) {
        self.$Recharge.html(_(res.root.recharge).format2yuan())
        self.$Withdraw.html(_(res.root.withdraw).format2yuan())
      }
    })
    this.getProfitXhr(reqData).done((res) => {
      if (res.result === 0) {
        self.$Bet.html(_(res.root.bet).format2yuan())
        self.$Bonus.html(_(res.root.prize).format2yuan())
        self.$Rebate.html(_(res.root.rebate).format2yuan())
        self.$Activity.html(_(res.root.activity).format2yuan())
        self.$Profit.html(_(res.root.profit).format2yuan())
        self.$Water.html(_(res.root.gameRebate).format2yuan())
        self.$Commission.html(_(res.root.commission).format2yuan())
      }
    })
  },

  _onRender() {
    const self = this
    this.$btnGroup = this.$('.js-ac-btnGroup')
    this.$timeset = this.$('.js-ac-timeset')
    this.$chart = this.$('.js-ac-to-chart')

    this.timeset = new Timeset({
      el: this.$timeset,
      size: 'input-md',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
      showIcon: true,
    }).render()

    this.timeset.$startDate.on('dp.change', () => {
      if (self.btnGroup) {
        self.btnGroup.clearSelect()
      }
      const reqData = {
        startTime: self.timeset.$startDate.val(),
        endTime: self.timeset.$endDate.val(),
      }
      self.renderOtherData(reqData)
    })

    this.timeset.$endDate.on('dp.change', () => {
      if (self.btnGroup) {
        self.btnGroup.clearSelect()
      }
      const reqData = {
        startTime: self.timeset.$startDate.val(),
        endTime: self.timeset.$endDate.val(),
      }
      self.renderOtherData(reqData)
    })

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      onBtnClick(offset) {
        self.timeset.$startDate.data('DateTimePicker').date(moment().add(offset, 'days').startOf('day'))
        self.timeset.$endDate.data('DateTimePicker').date(moment().add(offset < 0 ? -1 : 0, 'days').endOf('day'))
      },
    }).render()
  },

  renderOverview() {
    const self = this
    this.chart = new Chart({
      el: this.$chart,
    }).render()
    this.chart.showLoading()
    const xdate = []
    const past = moment().add('day', -15)
    _(_(1).range(16)).each(() => {
      xdate.push(past.add('day', 1).format('MM-DD'))
    })
    const option = {
      title: {
        // text: '最近15天数据动态',
        // subtext: ''
      },
      tooltip: {
        trigger: 'axis',
      },

      width: '1090',
      color: [
        '#e6c1ae',
        '#bacce7',
        '#eddeba',
        '#aeeed1',
        '#c8c3e6',
        '#a1e4f2',
        '#a4d2c8',
        '#e09ab7',
        '#83c3c7',
      ],
      legend: {
        data: ['充值', '提现', '投注', '派奖', '返点', '返水', '佣金', '活动', '盈亏'],
        right: 0,
        selected: {
          充值: true,
          提现: true,
          投注: true,
          派奖: false,
          返点: false,
          活动: false,
          盈亏: false,
          啦啦: false,
        },
      },
      calculable: true,
      axes: [
        {
          type: 'all',
          axisLineColor: '#d7d7d7',
          axisTickColor: '#d7d7d7',
          splitLineColor: [
            '#e6e6e6',
          ],
        },
      ],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: xdate,
        },
      ],
      yAxis: [
        {
          type: 'value',
          gridLines: {
            color: "#d7d7d7",
          },
        },
      ],
      series: [
        {
          id: 1,
          name: '充值',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 2,
          name: '提现',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 3,
          name: '投注',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 4,
          name: '派奖',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 5,
          name: '返点',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 9,
          name: '返水',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 8,
          name: '佣金',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 6,
          name: '活动',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
        {
          id: 7,
          name: '盈亏',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          smooth: true,
          symbol: 'emptyCircle',
          symbolSize: '10',
          itemStyle: {
            normal: {
              borderWidth: '3',
            },
          },
        },
      ],
    }

    this.getOverviewXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const ydata = res.root || []
          if (!_.isEmpty(ydata)) {
            _(option.series).each((item, index) => {
              option.series[index].data = _(_(ydata).findWhere({id: item.id}).data).map((info) => {
                return _(info).convert2yuan()
              })
            })
          }

          self.chart.renderChart(option)
        } else {
          Global.ui.notification.show('加载数据失败')
        }
      })
  },

})

module.exports = TeamOverviewView
