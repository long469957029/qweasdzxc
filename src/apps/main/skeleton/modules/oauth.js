

const OAuthModule = Base.Module.extend({

  startWithParent: false,

  check(options) {
    return Global.sync.ajax(_({
      url: '/acct/login/doauth.json',
    }).defaults(options))
  },

  logout() {
    return Global.sync.ajax({
      url: '/acct/login/dologout.json',
    })
  },
})

export default OAuthModule
