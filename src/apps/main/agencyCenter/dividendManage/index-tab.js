

const TabView = require('com/tabView')

// const MyDividView = require('agencyCenter/dividendManage/myDivid')
// const DirectAgentView = require('agencyCenter/dividendManage/directAgent')
// const LowLevelGrantView = require('agencyCenter/dividendManage/lowLevelGrant')
const UserManageView = require('agencyCenter/dividendManage/userManage')
const SignUserView = require('agencyCenter/dividendManage/signUser')

const DividendManageTabView = TabView.extend({

  template: require('./index-tab.html'),

  className: 'ac-dm-page',

  initialize() {
    const tabs = [
      {
        label: '签约用户管理',
        name: 'jsAcDmUserManage',
        id: 'jsAcDmUserManage',
        router: 'ac/sum',
        view: UserManageView,
      },
      {
        label: '+签约用户',
        name: 'jsAcDmSignUser',
        id: 'jsAcDmSignUser',
        router: 'ac/su',
        view: SignUserView,
      }]
    _(this.options).extend({
      tabs,
    })
  },

  setUserManageData(data) {
    if (data) {
      $('.js-ac-sign-user-tip').html(`您的剩余可签名额<span class="text-prominent">${data.leftQuota}</span>个，已签约用户<span class="text-prominent">${data.usedQuota}</span>个`)
    }
  },
})

module.exports = DividendManageTabView
