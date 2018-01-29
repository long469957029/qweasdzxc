const BettingCenterHisAnalysisDetailView = Base.ItemView.extend({

  template: require('./bettingCenter-historical-analysis.html'),

  height: 700,

  tableClass: 'table table-center table-default',

  url: '/ticket/ticketmod/openhistory.json',

  events: {},

  llhKeysArr: ['w', 'k', 'b', 's', 'g'],


  update() {
    this.renderDrawRecords()
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
  getFormSumAndSpan(keyPosition, type) { // type 1 代表和值 2代表跨度
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
  getFormGroup(keyPosition) {
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

  getFormDragon(keyPosition) {
    const formType = {
      name: '形态',
      keyName: '',
    }
    const v = _(keyPosition).filter((val) => {
      return val
    })
    const keys = _(v).map((item) => {
      return _(keyPosition).indexOf(item)
    })

    formType.keyName = this.getDragonValue(keys)

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
  getDragonValue(keys) {
    return `lhh.${this.llhKeysArr[keys[0]]}${this.llhKeysArr[keys[1]]}`
  },

})

module.exports = BettingCenterHisAnalysisDetailView
