

const AccountCenterController = require('accountCenter/controller')

exports.install = function() {
  window.Global.appRouter.processAppRoutes(new AccountCenterController(), {
    'as/pl': 'loginPwd', // 密码管理
    'as/pf': 'fundPwd', // 密码管理
    'as/pfi': 'findPwd', // 密码管理
    'as/sq': 'securityQuestion', // 密保问题
    'as/ll': 'loginLog', // 登录日志
  })
}
