

const TabView = require('com/tabView')

const OpenMydivView = require('agencyCenter/views/dividendReport-me')
const OpenSubdivView = require('agencyCenter/views/dividendReport-sub')

const DividendReportView = TabView.extend({

  // template: require('userCenter/templates/priceDetails.html'),

  getSubAcctXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacct.json',
    })
  },

  className: 'ac-openAccount-view',

  initialize() {
	  const acctInfo = Global.memoryCache.get('acctInfo')
	   _(this.options).extend({
		   tabs: [
			       {
			         label: '我的分红',
			         name: 'mydiv',
			         id: 'jsMydiv',
			         view: OpenMydivView,
			       },
			       {
			         label: '下级直属号分红',
			         name: 'subdiv',
			         id: 'jsSubdiv',
			         view: OpenSubdivView,
			       },
			     ],
		   })

    this.subSubAcctXhr = this.getSubAcctXhr()
  },

  renderLimit($limit, limitList) {
    const html = []
    let flag = false
    if (!_(limitList).isEmpty()) {
      _(limitList).map((limit) => {
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

module.exports = DividendReportView
