

const TabView = require('com/tabView')

const loginPwdView = require('accountCenter/views/passwordManage-loginPwd')
const fundPwdView = require('accountCenter/views/passwordManage-fundPwd')
const findPwdView = require('accountCenter/views/passwordManage-findPwd')

const passwordManageView = TabView.extend({

  events: {},

  className: 'as-passwordManage',

  initialize() {
    _(this.options).extend({
      tabs: [
        {
          label: '修改登录密码',
          name: 'modifyLogPwd',
          id: 'jsLogManage',
          router: 'as/pl',
          view: loginPwdView,
        },
        {
          label: '修改资金密码',
          name: 'modifyFundPwd',
          id: 'jsFundManage',
          router: 'as/pf',
          view: fundPwdView,
        },
        {
          label: '找回资金密码',
          name: 'modifyFindPwd',
          id: 'jsFindManage',
          router: 'as/pfi',
          view: findPwdView,
        },
      ],
    })
  },
})

module.exports = passwordManageView
