

require('./style.scss')

const SearchGrid = require('com/searchGrid')

const VipLevelView = SearchGrid.extend({

  className: 'vipLevel-view',

  template: require('./index.html'),

  events: {},

  initialize () {
    _(this.options).extend({
      columns: [
        {
          name: '日期',
          width: '20%',
        },
        {
          name: '原爵位',
          width: '20%',
        },
        {
          name: '新爵位',
          width: '20%',
        },
        {
          name: '调整类型',
          width: '20%',
        },
        {
          name: '等级租金',
          width: '20%',
        },
      ],
      gridOps: {
        emptyTip: '没有记录',
      },
      ajaxOps: {
        url: '/acct/vip/vipChange.json',
        abort: false,
      },
      reqData: {
        subUser: 0,
      },
      tip: '<div class="m-left-md"><span>提示：</span> 每月初根据积分情况重新调整vip等级。</div>',
      listProp: 'root.dataList',
      height: 375,
    })
  },

  onRender() {
    SearchGrid.prototype.onRender.apply(this, arguments)

    const acctInfo = Global.memoryCache.get('acctInfo')
    
    this.$('.js_vipLevel').html(this.levelName(acctInfo.memberLevel))
  },

  levelName (level) {
    let levelName = ''
    switch (parseInt(level)) {
      case 0: levelName = '骑士'; break
      case 1: levelName = '男爵'; break
      case 2: levelName = '子爵'; break
      case 3: levelName = '伯爵'; break
      case 4: levelName = '侯爵'; break
      case 5: levelName = '公爵'; break
      case 6: levelName = '大公'; break
    }
    return levelName
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

    })
      .hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.date)
    row.push(this.levelName(rowInfo.beforeLevel))
    row.push(this.levelName(rowInfo.afterLevel))
    row.push(rowInfo.upgradeType)
    row.push(rowInfo.remark)
    return row
  },

})

module.exports = VipLevelView
