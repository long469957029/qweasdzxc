

require('./misc/index.scss')

const RouterController = require('skeleton/controllers/router')

const PasswordManageView = require('accountCenter/views/passwordManage')
const SecurityQuestionView = require('accountCenter/views/securityQuestion')
const LoginLogView = require('accountCenter/views/loginLog')

const ucMenuConfig = Global.ui.menu.get(['fc', 'uc'])

const AccountCenterController = RouterController.extend({

  loginPwd() {
    this.changeMainReginView(new PasswordManageView(), {
      main: {
        title: '密码管理',
      },
      sidebar: ucMenuConfig,
    })
  },

  fundPwd() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFundPwd',
    }), {
      main: {
        title: '密码管理',
      },
      sidebar: ucMenuConfig,
    })
  },

  findPwd() {
    this.changeMainReginView(new PasswordManageView({
      triggerTab: 'modifyFindPwd',
    }), {
      main: {
        title: '密码管理',
      },
      sidebar: ucMenuConfig,
    })
  },

  securityQuestion() {
    this.changeMainReginView(new SecurityQuestionView(), {
      main: {
        title: '密保问题',
      },
      sidebar: ucMenuConfig,
    })
  },

  loginLog() {
    this.changeMainReginView(new LoginLogView(), {
      main: {
        title: '登录日志',
      },
      sidebar: ucMenuConfig,
    })
  },
})

module.exports = AccountCenterController
