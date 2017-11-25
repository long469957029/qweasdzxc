

const SearchGrid = require('com/searchGrid')


const GetPrizeView = SearchGrid.extend({

  template: require('./getPrize.html'),

  events: {
    'click .js-getPrize': 'getPrizeHandler',
  },

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '时间',
          width: '40%',
        },
        {
          name: '累积中奖金额',
          width: '20%',
        },
        {
          name: '加奖比例',
          width: '20%',
        },
        {
          name: '加奖金额',
          width: '20%',
        },
      ],
      gridOps: {
        emptyTip: '没有可领取的加奖金额',
      },
      ajaxOps: {
        url: '/acct/vip/queryPlusAward.json',
      },
      listProp: 'root.dataList',
      height: 200,
      tip: '<div style="display: none" class="js-divFlag"><button style="margin-left:336px;" class="js-getPrize btn btn-sun btn-linear input-lg vc-gp-get " >领取</button></div>',
    })
  },

  onRender() {
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
      initPagination: false,
    })

    // 加上统计行

    this.grid.addFooterRows({

    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    this.$('.js-divFlag').show()
    const row = []
    row.push(`${rowInfo.currentDate} ${rowInfo.startTime}至${rowInfo.endTime}`)
    row.push(rowInfo.cumulatePrize / 10000)
    row.push(`${rowInfo.proportion / 10000}%`)
    row.push(rowInfo.money / 10000)
    return row
  },

  getPrizeInfoXhr() {
    return Global.sync.ajax({
      url: '/acct/vip/receivePrize.json',
    })
  },

  getPrizeHandler() {
    const self = this
    this.getPrizeInfoXhr()
      .done((res) => {
        const self1 = self
        if (res && res.result === 0) {
          Global.ui.notification.show('领取成功', {
            type: 'success',
          })
          self1.onRender()
          self1.$('.js-divFlag').hide()
        } else {
          Global.ui.notification.show(`领取失败，有可能是：<br>${res.msg}`)
        }
      })
  },
})

module.exports = GetPrizeView
