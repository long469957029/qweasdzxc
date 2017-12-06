

const ticketConfig = require('skeleton/misc/ticketConfig')

const BettingCenterHisAnalysisDetailView = Base.ItemView.extend({

  template: require('bettingCenter/templates/bettingCenter-historical-analysis.html'),

  height: 700,

  tableClass: 'table table-center table-default',

  url: '/ticket/ticketmod/openhistory.json',

  events: {
  },

  GridOps: {
    ssc: {
      pageSize: 15,
      formats: [
        function(val) {
          return val
        },
        function(val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index]) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function(val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType)
        },
      ],
    },
    115: {
      pageSize: 15,
      formats: [
        null,
        function(val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          _(numList).each((num) => {
            html.push(`<span>${num}</span>`)
          }, this)
          html.push('</div>')

          return html.join('')
        },
        null,
      ],
    },
    DPC: {
      pageSize: 15,
      formats: [
        function (val) {
          return val.substring(4)
        },
        function(val) {
          const html = ['<div class="open-nums">']
          const numList = val.split(',')
          _(numList).each(function (num, index) {
            if (this.playRule && this.playRule.keyPosition && this.playRule.keyPosition[index] && this.playRule.keyPosition.indexOf(null) > -1) {
              html.push(`<span class="key-num">${num}</span>`)
            } else {
              html.push(`<span>${num}</span>`)
            }
          }, this)
          html.push('</div>')

          return html.join('')
        },
        function(val) {
          return this.getFormType(val, this.playRule && this.playRule.keyPosition, this.playRule && this.playRule.formType)
        },
      ],
    },
    pk10: {
      pageSize: 15,
      formats: [
        null,
        function(val) {
          let nums = val.split('\,')
          if (nums.length === 10) {
            nums = _(nums).map((item) => {
              if (item.indexOf('0') === 0) {
                return item.substr(1)
              }
              return item
            })
          }
          val = nums.join(',')
          return val
        },
      ],
    },
  },

  serializeData () {
    return {
      ticketId: this.options.ticketId,
    }
  },

  initialize() {

  },

  onRender() {
    this.$hisNum = this.$('.js-bc-his-num')
    this.$drawRecords = this.$('.js-his-draw')
    this.$numInput = this.$('.js-his-num-input')
    this.$hisHoth = this.$('.js-his-both')
    this.$sscMain = this.$('.js-ssc-main')
    this.$hisList = this.$('.js-his-both-list')
    // this.renderDrawRecords()
  },
  update () {
    this.renderDrawRecords()
  },
  updateByPlayRule (playRule) {
    this.playRule = playRule

    if (this.drawRecords) {
      this.drawRecords.reformat(this.generateGridOptions(this.gridOps))
    }
  },
  renderDrawRecords() {
    if (!this.drawRecords) {
      let gridTable = {}
      const sscTicketIdArr = _(ticketConfig.getSccList()).pluck('id')
      const c115TicketIdArr = _(ticketConfig.getChoose5List()).pluck('id')
      const dpcTicketIdArr = _(ticketConfig.getLowList()).pluck('id')
      const bjpk10TicketIdArr = _(ticketConfig.getHappyList()).pluck('id')
      // const threeDTicketIdArr = _(ticketConfig.get3DList()).pluck('id')

      if (_(sscTicketIdArr).contains(this.options.ticketId)) {
        this.gridOps = this.GridOps.ssc
      } else if (_(c115TicketIdArr).contains(this.options.ticketId)) {
        this.gridOps = this.GridOps['115']
      } else if (_(dpcTicketIdArr).contains(this.options.ticketId)) {
        this.gridOps = this.GridOps.DPC
      } else if (_(bjpk10TicketIdArr).indexOf(this.options.ticketId) !== -1) {
        this.gridOps = this.GridOps.pk10
      }
      gridTable = this.generateGridOptions(this.gridOps)
      this.drawRecords = this.$drawRecords.staticGrid(gridTable).staticGrid('instance')
    } else {
      this.drawRecords.update()
    }
  },
  generateGridOptions (ops) {
    const self = this
    const options = {
      tableClass: this.tableClass,
      url: this.url,
      // emptyTip: '最近无开奖记录',
      emptyTip: '',
      abort: false,
      height: this.height,
      colModel: [],
      data: {
        pageSize: ops.pageSize,
        ticketId: this.options.ticketId,
      },
      dataProp: 'root.openedList',
    }

    options.colModel.push({
      label: '期号',
      name: 'ticketPlanId',
      width: '32%',
      formatter: ops.formats && ops.formats[0] ? function () {
        return ops.formats[0].apply(self, arguments)
      } : null,
    })

    options.colModel.push({
      label: '开奖号码',
      name: 'ticketOpenNum',
      width: '50%',
      formatter: ops.formats && ops.formats[1] ? function () {
        return ops.formats[1].apply(self, arguments)
      } : null,
    })

    if (this.playRule && this.playRule.formType && ops.formats && ops.formats[2]) {
      const fromData = ops.formats[2].apply(self, arguments)
      options.colModel.push({
        label: fromData.name,
        name: fromData.keyName,
        width: '18%',
        // formatter: ops.formats && ops.formats[2] ? function () {
        //   return ops.formats[2].apply(self, arguments)
        // } : null,
      })
    }

    return options
  },
  // 取得形态
  getFormType(nums, keyPosition, type) {
    let formType
    // const numList = nums.split(',')
    switch (type) {
      case 'SUM':
        formType = this.getFormSumAndSpan(keyPosition, 1)
        break
      case 'SPAN':
        formType = this.getFormSumAndSpan(keyPosition, 2)
        break
      case 'GROUP':
        formType = this.getFormGroup(keyPosition)
        break
      case 'PAIR':
        formType = this.getFormPair(keyPosition)
        break
      case 'DRAGON':
        formType = this.getFormDragon(keyPosition)
        break
      default:
        formType = ''
        break
    }

    return formType
  },
  getFormSumAndSpan (keyPosition, type) { // type 1 代表和值 2代表跨度
    const formType = {
      name: type === 1 ? '和值' : '跨度',
      keyName: '',
    }
    const tempList = _(keyPosition).filter((val) => {
      return val
    })
    if (tempList.length === 3) {
      if (!_.isNull(keyPosition[0])) {
        formType.keyName = type === 1 ? 'sum.qianSan' : 'span.qianSan'
      } else if (_.isNull(keyPosition[0]) && !_.isNull(keyPosition[1])) {
        formType.keyName = type === 1 ? 'sum.zhongSan' : 'span.zhongSan'
      } else {
        formType.keyName = type === 1 ? 'sum.houSan' : 'span.houSan'
      }
    } else if (tempList.length === 2) {
      if (!_.isNull(keyPosition[0]) && !_.isNull(keyPosition[1])) {
        formType.keyName = type === 1 ? 'sum.qianEr' : 'span.qianEr'
      } else if (!_.isNull(keyPosition[3]) && !_.isNull(keyPosition[4])) {
        formType.keyName = type === 1 ? 'sum.houEr' : 'span.houEr'
      }
    }
    return formType
  },
  getFormGroup (keyPosition) {
    const formType = {
      name: '形态',
      keyName: '',
    }

    const tempList = _(keyPosition).filter((val) => {
      return val
    })
    if (tempList.length === 5) {
      formType.keyName = 'star5Type'
    } else if (tempList.length === 4) {
      formType.keyName = 'star4Type'
    } else if (tempList.length === 3) {
      if (!_.isNull(keyPosition[0])) {
        formType.keyName = 'qianSan'
      } else if (_.isNull(keyPosition[0]) && !_.isNull(keyPosition[1])) {
        formType.keyName = 'zhongSan'
      } else {
        formType.keyName = 'houSan'
      }
    }
    return formType
  },

  getFormDragon (keyPosition) {
    const formType = {
      name: '形态',
      keyName: '',
    }
    const v = _(keyPosition).filter((val) => {
      return val
    })
    const keys = _(keyPosition).findKey(v)

    console.log(keys)

    // const tempList = _(numList).filter((val, index) => {
    //   return keyPosition[index]
    // })
    // if (tempList[0] > tempList[1]) {
    //   formType = '龙'
    // } else if (tempList[0] < tempList[1]) {
    //   formType = '虎'
    // } else {
    //   formType = '和'
    // }
    return formType
  },

})

module.exports = BettingCenterHisAnalysisDetailView
