

require('./index.scss')

const AgreementView = require('./agreement')
// const TabView = require('./index-tab')
const MyDividView = require('agencyCenter/dividendManage/myDivid')

const dividendConfig = require('./dividendConfig')


const DividendManageView = Base.ItemView.extend({

  template: '',

  className: 'ac-dm',

  onRender() {
    const self = this
    // 触发一次auth,获取账户状态，检查权限
    Global.m.oauth.check()
      .done(() => {
        self._render()
      })
  },
  _render() {
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (acctInfo.dividendStatus === dividendConfig.getByName('APPLYING').id) {
      // 申请中，渲染 签约页面
      this.$el.html(new AgreementView().render().$el)
    } else if (acctInfo.dividendStatus === dividendConfig.getByName('APPLIED').id || acctInfo.merchant) {
      // 已开通，渲染 tab页
      // this.$el.html(new TabView({ merchant: acctInfo.merchant, triggerTab: this.options.triggerTab }).render().$el)
      this.$el.html(new MyDividView().render().$el)
    }
  },
})

module.exports = DividendManageView
