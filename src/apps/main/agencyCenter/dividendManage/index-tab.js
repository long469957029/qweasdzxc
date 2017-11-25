

const TabView = require('com/tabView')

const MyDividView = require('agencyCenter/dividendManage/myDivid')
const DirectAgentView = require('agencyCenter/dividendManage/directAgent')
const LowLevelGrantView = require('agencyCenter/dividendManage/lowLevelGrant')
const UserManageView = require('agencyCenter/dividendManage/userManage')
const SignUserView = require('agencyCenter/dividendManage/signUser')

const DividendManageTabView = TabView.extend({

  template: require('./index-tab.html'),

  events: {
    'click .js-ac-dm-my-config': 'checkAgreement',
  },
  checkAgreement() {
    // Global.appRouter.navigate(_('#bc/'+ticketId).addHrefArgs('_t', _.now()), {trigger: true, replace: false});
    Global.router.goTo('#ac/am?operationStatus=3&username=我')
  },

  className: 'ac-dm-page',

  dividRoleXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/dividViewInfo.json',
      data,
    })
  },

  initialize() {
    this.DividRoleData = this.dividRoleXhr()
    let tabs = [
      {
        label: '我的分红',
        name: 'jsAcDmMyDivid',
        id: 'jsAcDmMyDivid',
        router: 'ac/dm',
        view: MyDividView,
      },
    ]
    if (this.options.merchant) {
      tabs.push({
        label: '下级直属分红',
        name: 'jsAcDmDirectAgent',
        id: 'jsAcDmDirectAgent',
        router: 'ac/ld',
        view: DirectAgentView,
      })
    } else {
      tabs = tabs.concat([{
        label: '下级分红发放',
        name: 'jsAcDmLowLevelGrant',
        id: 'jsAcDmLowLevelGrant',
        router: 'ac/lg',
        view: LowLevelGrantView,
      },
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
      }])
    }
    _(this.options).extend({
      tabs,
    })
  },
})

module.exports = DividendManageTabView
