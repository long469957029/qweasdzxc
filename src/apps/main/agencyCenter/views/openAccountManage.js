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

  renderLimit(limitList) {
    const html = []
    let flag = false
    const $limitList = $('.js-ac-open-limit')
    console.log($limitList[0])
    if (!_(limitList).isEmpty()) {
      _(limitList).each((limit) => {
        if (limit.quotaLimit > 0) {
          flag = true
        }
        html.push(`<span class="text-prominent">${_(limit.quotaLevel).formatDiv(10)}</span>配额&nbsp;<span class="text-prominent">${limit.quotaLimit}</span>&nbsp;个`)
      })
      if (flag) {
        $limitList.html(`您目前拥有${html.join('，')}，此后奖金组配额无限制`)
        $limitList.removeClass('hidden')
      }
    }
  },
})

module.exports = OnlineRechargeView
