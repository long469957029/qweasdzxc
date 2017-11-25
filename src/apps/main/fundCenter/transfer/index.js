

require('./index.scss')
const TabView = require('com/tabView')

const PlatformTransferView = require('fundCenter/transfer/platform')
const UserTransferView = require('fundCenter/transfer/userTransfer')

const WithdrawRecordsView = TabView.extend({

  className: 'fc-transfer-tab-view',


  initialize() {
    _(this.options).extend({
      tabs: [

      ],
    })
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (acctInfo.userRebate <= 128) {
      this.options.tabs = this.options.tabs.concat({
        label: '平台转账',
        name: 'jsfctfpt',
        id: 'jsfctfpt',
        view: PlatformTransferView,
        options: this.options,
      })
    }

    if (acctInfo.userType == 0) {
      this.options.tabs = this.options.tabs.concat({
        label: '上下级转账',
        name: 'jsfctfut',
        id: 'jsfctfut',
        view: UserTransferView,
        options: this.options,
      })
    }
  },

  
})

module.exports = WithdrawRecordsView
