const TabView = require('com/tabView')

const OpenAccountManageManualView = require('agencyCenter/views/openAccountManage-manual')
const OpenAccountManageAutoView = require('agencyCenter/views/openAccountManage-auto')

const OnlineRechargeView = TabView.extend({

  // template: require('userCenter/templates/priceDetails.html'),

  getSubAcctXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json',
    })
  },

  className: 'ac-openAccount-view',

  initialize() {
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (!acctInfo.merchant) {
      _(this.options).extend({
        tabs: [
          {
            label: '手动开户',
            name: 'manual',
            id: 'jsAcManualAccount',
            view: OpenAccountManageManualView,
          },
          {
            label: '链接开户',
            name: 'auto',
            id: 'jsAcAutoAccount',
            view: OpenAccountManageAutoView,
          },
        ],
      })
    } else {
      _(this.options).extend({
        tabs: [
          {
            label: '手动开户',
            name: 'manual',
            id: 'jsAcManualAccount',
            view: OpenAccountManageManualView,
          },
        ],
      })
    }

    this.subSubAcctXhr = this.getSubAcctXhr()
  },

  renderLimit($limit, limitList) {
    const html = []
    let flag = false
    if (!_(limitList).isEmpty()) {
      _(limitList).each((limit) => {
        if (limit.quotaLimit > 0) {
          flag = true
        }
        html.push(`${_(limit.quotaLevel).formatDiv(10)}配额&nbsp;${limit.quotaLimit}&nbsp;个`)
      })
      if (flag) {
        $limit.find('.js-ac-open-limit').html(`${html.join('，')}，此后奖金组配额无限制`)
        $limit.removeClass('hidden')
      }
    }
  },
})

module.exports = OnlineRechargeView
