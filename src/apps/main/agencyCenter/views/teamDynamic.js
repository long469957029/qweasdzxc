

let Chart

import Timeset from 'com/timeset'
const BtnGroup = require('com/btnGroup')

const LowLevelDynamicView = Base.ItemView.extend({

  template: require('agencyCenter/templates/teamDynamic.html'),

  startOnLoading: true,

  className: 'ac-teamDynamic-view',

  events: {
    'click .js-ac-statistic-type': 'statisticTypeChangeHandler',
  },

  getLowLevelStatusXhr(data) {
    return Global.sync.ajax({
      url: '/info/teamreport/subuserstat.json',
      data,
    })
  },

  getNewLowLevelXhr(data) {
    return Global.sync.ajax({
      url: '/info/teamreport/newsubusers.json',
      data,
    })
  },

  getNotActiveLowLevelXhr(data) {
    return Global.sync.ajax({
      url: '/info/teamreport/unactiveusers.json',
      data,
    })
  },

  getLowLevelPlayXhr(data) {
    return Global.sync.ajax({
      url: '/info/teamreport/ticketplay.json',
      data,
    })
  },

  initialize () {
  },

  onRender() {
    const self = this

    // 按需加载
    require.ensure(['com/chart'], (require) => {
      Chart = require('com/chart')
      self._onRender()

      self.loadingFinish()
    }, 'chart')
  },

  _onRender() {
    const self = this
    this.$btnGroup = this.$('.js-ac-btnGroup')
    this.$timeset = this.$('.js-ac-timeset')
    this.$type = this.$('.js-ac-statistic-type')
    this.$chart = this.$('.js-ac-chart')
    this.$grid = this.$('.js-ac-chart-grid')
    this.$newSubUserCount = this.$('.js-ac-new-user-count')
    this.subUserCount = 0
    this.unActiveSubUserCount = 0
    this.$unActiveSubUserRate = this.$('.js-ac-unActive-user-rate')
    this.$gridTitle = this.$('.js-ac-grid-title')
    this.$gridTitleLogo = this.$('.js-ac-grid-title-logo')
    this.$gridDiv = this.$('.js-ac-td-grid')

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

      self.chart.showLoading()
      self._renderStatus()
        .always(() => {
          self._render()
        })
    })

    this.timeset.$endDate.on('dp.change', () => {
      if (self.btnGroup) {
        self.btnGroup.clearSelect()
      }

      self.chart.showLoading()
      self._renderStatus()
        .always(() => {
          self._render()
        })
    })

    this.chart = new Chart({
      el: this.$chart,
    }).render()

    this.btnGroup = new BtnGroup({
      el: this.$btnGroup,
      onBtnClick(offset) {
        self.timeset.$startDate.data('DateTimePicker').date(moment().add(offset, 'days').startOf('day'))
        self.timeset.$endDate.data('DateTimePicker').date(moment().add(offset < 0 ? -1 : 0, 'days').endOf('day'))
      },
    }).render()

    this.$('.js-ac-unActive-tip').popover({
      trigger: 'hover',
      // title: '',
      html: true,
      container: 'body',
      content: '<strong>不活跃下级定义</strong><br />在查询日期内无任何帐变，即为不活跃的用户',
      placement: 'bottom',
    })

    this.$('.js-ac-statistic-type').eq(0).click()
  },

  renderNewLowLevel(reqData) {
    const self = this
    const option = {
      title: {
      //  text: '新增下级人数',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: { trigger: 'axis' },
      // toolbox: {
      //  show: true,
      //  color : ['#fff','#fff','#fff','#fff'],
      //  feature: {
      //    magicType: {show: true, type: ['line', 'bar']},
      //    restore: {show: true},
      //    saveAsImage: {show: true}
      //  }
      // },
      yAxis: [{
        type: 'value',
        axisLabel: {
          formatter: '{value} ',
          textStyle: {
            color: '#8c8d8d',
          },
        },
        axisLine: { // 轴线
          show: true,
          lineStyle: {
            color: '#fe6760',
            type: 'solid',
            width: 2,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#8c8d8d',
            type: 'solid',
            width: 0.5,
          },
        },
      }],
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          textStyle: {
            color: '#8c8d8d',
          },
        },
        axisLine: { // 轴线
          show: true,
          lineStyle: {
            color: '#fe6760',
            type: 'solid',
            width: 2,
          },
        },
        axisTick: { // 轴标记
          show: false,
          length: 10,
          lineStyle: {
            color: '#25bccc',
            type: 'solid',
            width: 2,
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#8c8d8d',
            type: 'solid',
            width: 0.5,
          },
        },
      }],
      series: [{
        name: '注册人数',
        type: 'line',
        itemStyle: {
          normal: {
            lineStyle: {
              color: '#f36161',
              type: 'solid',
              width: 2,
            },
          },
        },
        markLine: {
          data: [
            { type: 'average', name: '平均值' },
          ],
          itemStyle: {
            normal: {
              color: '#f36161',
            },
          },
        },
      }],
      noDataLoadingOption: {
        text: '暂无数据',
        effect: 'ring',
      },
    }

    this.getNewLowLevelXhr(reqData)
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root.countList

          if (!_.isEmpty(data)) {
            option.xAxis[0].data = _(data).pluck('time')
            option.series[0].data = _(data).pluck('count')
          } else {
            // option.series[0] = {};
            option.xAxis[0].data = [reqData.startTime, reqData.endTime]
            option.series[0].data = [0, 0]
          }

          self.chart.renderChart(option)
          self.renderStaticGrid('直属下级开户排名', '新增团队人数', res.root.leaderboards, true)
          self.$gridTitleLogo.addClass('ac-td-oa-title')
          self.$gridTitleLogo.removeClass('ac-td-uu-title')
        } else {
          Global.ui.notification.show('加载数据失败')
        }
      })
  },

  renderStaticGrid(title, secondColTitle, dataList, order) {
    if (this.grid) {
      this.grid.destroy()
      this.$gridDiv.addClass('hidden')
      this.$gridTitle.addClass('hidden')
      this.$gridTitleLogo.addClass('hidden')
    }

    if (title && secondColTitle) {
      this.$gridDiv.removeClass('hidden')
      this.$gridTitle.html(title).removeClass('hidden')
      this.$gridTitleLogo.removeClass('hidden')

      this.grid = this.$grid.staticGrid({
        tableClass: 'table table-bordered table-hover table-center',
        colModel: [
          {
            label: '名次',
            name: 'index',
            formatter(val, index) {
              let css = ''
              if (order) {
                if (index === 0) {
                  css = 'ac-tm-oa-order1'
                } else if (index === 1) {
                  css = 'ac-tm-oa-order2'
                } else if (index === 2) {
                  css = 'ac-tm-oa-order3'
                }
              }
              return `<span class="${css} pull-left"></span>${index + 1}`
            },
            width: 200,
          },
          { label: secondColTitle, name: 'count', width: 200 },
          { label: '直属用户名', name: 'userName', width: 300 },
        ],
        height: 148,
        row: dataList,
        startOnLoading: false,
      }).staticGrid('instance')
    } else {
      this.$grid.empty()
    }
  },

  renderNotActiveLowLevel(reqData) {
    const self = this
    const option = {
      title: {
        text: self.$unActiveSubUserRate.text(),
        textStyle: {
          color: '#ff6347',
        },
        subtext: `(下级人数：${self.subUserCount}人）`,
        subtextStyle: {
          color: '#ff6347',
        },
        x: 'center',
        y: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['活跃下级占比', '不活跃下级占比'],
      },
      // toolbox: {
      //  show : true,
      //  color : ['#fff','#fff'],
      //  feature : {
      //    restore : {show: true},
      //    saveAsImage : {show: true}
      //  }
      // },
      //   calculable : true,
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          data: [
            { value: self.subUserCount - self.unActiveSubUserCount, name: '活跃下级占比' },
            { value: self.unActiveSubUserCount, name: '不活跃下级占比' },
          ],
        },
      ],
      color: ['#4196b5', '#e85f4d', '#ff6347', '#40e0d0', '#cd5c5c', '#30e0e0', '#ffa500',
        '#7b68ee', '#00fa9a', '#ffd700', '#1e90ff', '#6495ed',
        '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#ff7f50',
        '#ff69b4', '#87cefa', '#da70d6', '#32cd32', '#ba55d3'],
    }

    this.getNotActiveLowLevelXhr(reqData)
      .done((res) => {
        let data
        if (res && res.result === 0) {
          self.chart.renderChart(option)
          self.renderStaticGrid('不活跃直属下级排名', '不活跃团队人数', res.root.leaderboards, false)
          self.$gridTitleLogo.removeClass('ac-td-oa-title')
          self.$gridTitleLogo.addClass('ac-td-uu-title')
        } else {
          Global.ui.notification.show('加载数据失败')
        }
      })
  },

  renderLowLevelPlay(reqData) {
    const self = this
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      //  show : true,
      //  color : ['#fff','#fff','#fff','#fff'],
      //  feature : {
      //    magicType: {show: true, type: ['line', 'bar']},
      //    restore : {show: true},
      //    saveAsImage : {show: true}
      //  }
      // },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            show: true,
            textStyle: {
              color: '#2a2a2a',
            },
            interval: 0,
            rotate: 30,
          },
          axisLine: { // 轴线
            show: true,
            lineStyle: {
              color: '#8c8d8d',
              type: 'solid',
              width: 0.5,
            },
          },
          axisTick: { // 轴标记
            show: false,
            // length: 10,
            // lineStyle: {
            //  color: '#25bccc',
            //  type: 'solid',
            //  width: 2
            // }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#8c8d8d',
              type: 'solid',
              width: 1,
            },
          },
          data: ['重庆时时彩', '江西时时彩', '亿贝分分彩', '山东十一选五', '广东十一选五', '3D', '排列3/5'],
        },
      ],
      yAxis: [
        {
          type: 'value',
          position: 'left',
          //  boundaryGap: [0, 0.1],
          axisLabel: {
            formatter: '{value} ',
            show: true,
            textStyle: {
              color: '#8c8d8d',
            },
          },
          axisLine: { // 轴线
            show: false,
            // onZero: true,
            lineStyle: {
              color: '#8c8d8d',
              type: 'solid',
              width: 2,
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#8c8d8d',
              type: 'solid',
              width: 0.5,
            },
          },
        },
        // {
        //  type: 'value',
        //  position: 'right',
        //  axisLine: {    // 轴线
        //    show: true,
        //    //onZero: true,
        //    lineStyle: {
        //      color: '#25bccc',
        //      type: 'solid',
        //      width: 1
        //    }
        //  }
        // }
      ],

      series: [
        {
          name: '玩彩人数',
          type: 'bar',
          barMinHeight: 1,
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'top',
                color: '#2a2a2a',
              },
              color: '#e8675d',
            },
          },
          data: [0, 0, 0, 0, 0, 0, 0],
        },
      ],
    }

    this.getLowLevelPlayXhr(reqData)
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root

          if (!_.isEmpty(data)) {
            const ticketOrder = ['分分彩', '重庆时时彩', '江西时时彩', '新疆时时彩', '天津时时彩', '黑龙江时时彩', '山东11选5', '广东11选5', '江西11选5', '福彩3D', 'P5/P3']
            data = _(data).sortBy((item) => {
              return _(ticketOrder).indexOf(item.ticketName)
            })
            option.xAxis[0].data = _(data).pluck('ticketName')
            option.series[0].data = _(data).pluck('count')
          } else {
            option.series[0] = {}
          }


          self.chart.renderChart(option)
          self.renderStaticGrid()
        } else {
          Global.ui.notification.show('加载数据失败')
        }
      })
  },

  _renderStatus() {
    const self = this

    const reqData = {
      startTime: this.timeset.$startDate.val(),
      endTime: this.timeset.$endDate.val(),
    }
    return this.getLowLevelStatusXhr(reqData)
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          self.$newSubUserCount.text(data.newSubUserCount)
          self.subUserCount = data.subUserCount
          self.unActiveSubUserCount = data.unActiveSubUserCount

          let rate = 0
          if (data.subUserCount !== 0 && data.unActiveSubUserCount !== 0) {
            rate = _(data.unActiveSubUserCount).chain().div(data.subUserCount).formatMul(100, { fixed: 2 })
          }
          self.$unActiveSubUserRate.text(`${rate}%`)
        }
      })
  },

  _render(xhr) {
    const type = this.$type.filter('.active').data('type')

    const reqData = {
      startTime: this.timeset.$startDate.val(),
      endTime: this.timeset.$endDate.val(),
    }

    switch (type) {
      case 'newLowLevel':
        this.renderNewLowLevel(reqData)
        break
      case 'notActiveLowLevel':
        this.renderNotActiveLowLevel(reqData, xhr)
        break
      case 'lowLevelPlay':
        this.renderLowLevelPlay(reqData)
        break
    }

    this.chart.showLoading()
  },

  // event handlers

  statisticTypeChangeHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    this._render()
  },
})

module.exports = LowLevelDynamicView
