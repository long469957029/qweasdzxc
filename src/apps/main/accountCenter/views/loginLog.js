

const LoginLogView = Base.ItemView.extend({

  template: require('accountCenter/templates/loginLog.html'),

  className: 'as-loginLog',

  events: {},

  onRender () {
    const self = this

    this.$('#jsACLLjqGrid').staticGrid({
      tableClass: 'table table-bordered table-hover table-center',
      wrapperClass: 'border-table-bottom',

      colModel: [
        {
          label: '登录时间  ',
          name: 'loginTime',
          key: true,
          width: 150,
          formatter(val) {
            return _(val).toTime()
          }, 
        },
        { label: '设备', name: 'loginDevice', width: 150 },
        { label: 'IP', name: 'loginIp', width: 150 },
        { label: '地区', name: 'loginAddress', width: 150 },
      ],
      height: 370,
      url: '/acct/login/loginhistory.json',
    })
  },
})

module.exports = LoginLogView
