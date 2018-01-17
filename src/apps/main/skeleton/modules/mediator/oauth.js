const NewsMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  login: true,

  onStart() {
    const self = this

    _.delay(() => {
      Global.polling.start('oauth:request', () => {
        self.check()
          .always(() => {
            Global.polling.next('oauth:request', {
              interval: self.interval,
            })
          })
      })
    }, this.interval)
  },

  check(options) {
    const self = this
    const oauthXhr = Global.oauth.check(options)
      .done((res) => {
        const acctInfo = res.root || {}

        acctInfo.fBalance = _(acctInfo.balance).convert2yuan()
        acctInfo.fLastLoginTime = _(acctInfo.lastLoginTime).toTime()
        acctInfo.fLoginTime = _(acctInfo.loginTime).toTime()

        if (self.login && acctInfo.outTime && acctInfo.outTime !== 0) {
          self.autoLogoutCountdown(acctInfo.outTime)
        }

        Global.memoryCache.set('acctInfo', acctInfo)

        Global.m.publish('acct:updating', acctInfo)

        this.$store.commit(types.USER_LOGIN_SUCCESS, acctInfo)

        self.login = false
      })

    // 因应二号改版偷跑 先忽略验证使用者
    // this._checkUserIsEffective(oauthXhr);

    return oauthXhr
  },

  autoLogoutCountdown(time) {
    let timer

    if (window.Global.appRouter) {
      window.Global.appRouter.addOnRouteHandler(() => {
        clearTimeout(timer)
        timer = _.delay(_autoLogoutCountdown, time * 1000 * 60)
      })
    }

    function _autoLogoutCountdown() {
      Global.sync.setLogout()
      Global.ui.notification.show('由于您长时间未操作，系统自动为您退出登录！', {
        event() {
          window.location.href = 'login.html'
        },
      })
    }
  },


  _checkUserIsEffective (oauthXhr) {
    oauthXhr.done((res) => {
      if (!res || (res.result !== 0 && res.root == undefined)) {
        Global.ui.notification.show(res.msg, {
          event () {
            window.location.href = 'login.html'
          },
        })
      } else if (!res || (res.result !== 0 && _([101, 103, 104, 105, 106]).indexOf(res.root.status) !== -1)) {
        Global.ui.notification.show('账号状态异常！', {
          event () {
            window.location.href = 'login.html'
          },
        })
      }
    })
  },

  onStop() {
    Global.polling.stop('oauth:request')
  },
})

module.exports = NewsMediatorModule
