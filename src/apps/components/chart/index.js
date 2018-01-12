/**
 * chart 图表view
 *
 * @description
 *
 * @api
 *
 * @example
 *
 * @author
 *   xiami
 */

const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/chart/pie')
require('echarts/lib/component/legend')
require('echarts/lib/component/tooltip')

const Chart = Base.PrefabView.extend({

  initialize() {
  },

  // common APIs

  render() {
    const self = this

    this._checkVisible()


    return this
  },

  renderChart(data) {
    data = data || this.options.data
    this.options.data = data
    if (!this.isVisible) {
      return false
    }
    if (!data) {
      return false
    }

    if (!this.eChart) {
      this.eChart = echarts.init(this.$el[0], 'infographic')// 'macarons'

      this.eChart.showLoading()
      $(window).on('resize.chart', this.eChart.resize)
    }
    this.eChart.resize()

    this.eChart.hideLoading()

    // 为eCharts对象加载数据
    this.eChart.setOption(data, true)
  },

  // 只有当dom拥有了宽高的时候才进行chart的render
  _checkVisible() {
    const self = this

    this.timer = setInterval(() => {
      if (self.$el.height() > 0 && self.$el.width() > 0) {
        clearInterval(self.timer)
        self.timer = null

        self.isVisible = true
        self.renderChart()
      }
    }, 100)
  },

  showLoading() {
    if (this.eChart) {
      this.eChart.showLoading()
    }
  },

  resize() {
    if (this.eChart) {
      this.eChart.resize()
    }
  },

  refresh() {
    if (this.eChart) {
      this.eChart.refresh()
    }
  },

  restore() {
    if (this.eChart) {
      this.eChart.restore()
    }
  },

  clear() {
    if (this.eChart) {
      this.eChart.clear()
    }
  },

  dispose() {
    $(window).off('resize.chart', this.eChart.resize)
    this.eChart.dispose()
  },

  getChart() {
    return this.eChart
  },
})

module.exports = Chart
