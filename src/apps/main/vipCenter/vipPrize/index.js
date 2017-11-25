

require('./style.scss')

const TabView = require('com/tabView')

const GetPrizeView = require('./getPrize')
const PrizeRecordView = require('./prizeRecord')

const VipPrizeView = TabView.extend({

  className: 'vipPrize-view',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '领取奖金',
          name: 'getPrize',
          id: 'jsGetPrize',
          view: GetPrizeView,
        },
        {
          label: '加奖记录',
          name: 'prizeRecord',
          id: 'jsPrizeRecord',
          view: PrizeRecordView,
        },
      ],
    })
  },
})

module.exports = VipPrizeView
