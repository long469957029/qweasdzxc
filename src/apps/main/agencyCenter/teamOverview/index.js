

let Chart

const Timeset = require('com/timeset')
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
    this.$NewUser = this.$('.js-ac-to-nu')
    this.$Recharge = this.$('.js-ac-to-re')
    this.$Withdraw = this.$('.js-ac-to-wi')
    this.$Bet = this.$('.js-ac-to-be')
    this.$Bonus = this.$('.js-ac-to-bo')
    this.$Rebate = this.$('.js-ac-to-reb')
    this.$Activity = this.$('.js-ac-to-ac')
    this.$Profit = this.$('.js-ac-to-pr')
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
      if (res.result == 0) {
        self.$('.js-ac-to-co').html(res.root.count)
        self.$('.js-ac-to-ba').html(_(res.root.balance).convert2yuan())
      }
    })
  },
  renderOtherData(reqData) {
    const self = this
    this.getNewUserActiveUserXhr(reqData).done((res) => {
      if (res.result == 0) {
        self.$NewUser.html(`${res.root.newSub}/${res.root.active}`)
      }
    })
    this.getRechargeWithdrawlXhr(reqData).done((res) => {
      if (res.result == 0) {
        self.$Recharge.html(_(res.root.recharge).convert2yuan())
        self.$Withdraw.html(_(res.root.withdraw).convert2yuan())
      }
    })
    this.getProfitXhr(reqData).done((res) => {
      if (res.result == 0) {
        self.$Bet.html(_(res.root.bet).convert2yuan())
        self.$Bonus.html(_(res.root.prize).convert2yuan())
        self.$Rebate.html(_(res.root.rebate).convert2yuan())
        self.$Activity.html(_(res.root.activity).convert2yuan())
        self.$Profit.html(_(res.root.profit).convert2yuan())
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
      size: 'input-sm',
      startTimeHolder: '起始日期',
      endTimeHolder: '结束日期',
      startOps: {
        format: 'YYYY-MM-DD',
      },
      endOps: {
        format: 'YYYY-MM-DD',
      },
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
    _(_(1).range(16)).each((i) => {
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
      legend: {
        data: ['充值', '提现', '投注', '中奖', '返点', '活动', '盈亏'],
        selected: {
          充值: true,
          提现: true,
          投注: true,
          中奖: false,
          返点: false,
          活动: false,
          盈亏: false,
        },
      },
      calculable: true,
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
        },
      ],
      series: [
        {
          name: '充值',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '提现',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '投注',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '中奖',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '返点',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '活动',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: '盈亏',
          type: 'line',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
    }

    this.getOverviewXhr()
      .done((res) => {
        if (res && res.result === 0) {
          const ydata = res.root || []
          if (!_.isEmpty(ydata)) {
            _(ydata).each((item, index) => {
              option.series[Number(item.id) - 1].data = _(item.data).map((item, index) => {
                return _(item).convert2yuan()
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
