const NewsMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  login: true,

  onStart({logoutWhenUnLogin = false} = {}, xhrOps) {
    _.delay(() => {
      Global.polling.start('oauth:request', () => {
        this.check({logoutWhenUnLogin}, xhrOps)
          .always(() => {
            Global.polling.next('oauth:request', {
              interval: this.interval,
            })
          })
      })
    }, this.interval)
  },

  check({logoutWhenUnLogin = false, checkStatusOnly = false} = {}, xhrOps) {
    const oauthXhr = Global.oauth.check(xhrOps)
      .done((res) => {
        const acctInfo = res.root || {}

        if (this.login && acctInfo.outTime && acctInfo.outTime !== 0) {
          this.autoLogoutCountdown(acctInfo.outTime)
        }

        window.store.commit(types.USER_LOGIN_SUCCESS, acctInfo)
        this.login = false
      })

    // 因应二号改版偷跑 先忽略验证使用者
    if (logoutWhenUnLogin) {
      this._checkUserIsEffective(oauthXhr);
    }
    return oauthXhr
  },

  checkLogin() {
    return this.check({logoutWhenUnLogin: true})
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
          window.location.href = 'index.html'
        },
      })
    }
  },


  _checkUserIsEffective (oauthXhr) {
    oauthXhr.done((res) => {
      if (!res || (res.result !== 0 && res.root === undefined)) {
        Global.ui.notification.show(res.msg, {
          event () {
            window.location.href = 'index.html'
          },
        })
      } else if (!res || (res.result !== 0 && _([101, 103, 104, 105, 106]).indexOf(res.root.status) !== -1)) {
        Global.ui.notification.show('账号状态异常！', {
          event () {
            window.location.href = 'index.html'
          },
        })
      }
    })
  },

  onStop() {
    Global.polling.stop('oauth:request')
  },
})

export default NewsMediatorModule
