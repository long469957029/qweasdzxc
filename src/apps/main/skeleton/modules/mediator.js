

// 中间者启动必要文件,用于配置权限等

const MediatorModule = Base.Module.extend({

  startWithParent: false,

  initialize() {
    Base.SubscribePermissions.init({
      'news:updating': {
        news: true,
      },
      'acct:updating': {
        acct: true,
      },
      'bet:updating': {
        bet: true,
      },
      'redNum:updating': {
        redNum: true,
      },
    })

    _(this).extend(Base.MediatorFacade)
  },

})

module.exports = MediatorModule
