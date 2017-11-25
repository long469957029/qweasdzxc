

const newsConfig = require('newsCenter/misc/newsConfig')

const PlatformNewsSettingView = Base.ItemView.extend({

  template: require('newsCenter/templates/platformNewsSetting.html'),

  startOnLoading: true,

  settingItemTpl: _(require('newsCenter/templates/platformNewsSetting-item.html')).template(),

  events: {
    'click .js-nc-smSetting-submit': 'saveSettingHandler',
  },

  onRender() {
    const self = this

    this.getPlatformNewsSettingItemXhr()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res.result === 0) {
          const html = self.generateHtml(res.root.allConf)
          self.$('.js-nc-smSetting-container').html(html)
          self.selectItem(res.root.userConf)
        } else {
          Global.ui.notification.show('获取下级用户列表失败')
        }
      })
  },

  getPlatformNewsSettingItemXhr() {
    return Global.sync.ajax({
      url: '/acct/usernotice/getnoticeconf.json',
    })
  },

  generateHtml(confArr) {
    const length = confArr.length
    const divHtmlArr = _.map(confArr, function(conf, num) {
      return this.settingItemTpl({
        typeName: conf.typeName,
        confList: conf.confList,
        name: newsConfig.get(conf.typeId).name,
      })
    }, this)
    return divHtmlArr.join('')
  },

  selectItem(userConfArr) {
    _(userConfArr).each(function(userConf) {
      this.$(`input[value=${userConf}]:checkbox`).prop('checked', true)
    }, this)
  },

  saveSettingHandler() {
    Global.sync.ajax({
      url: '/acct/usernotice/savenoticeconf.json',
      data: _(this.$('.js-nc-setting-form').serializeArray()).serializeObject(),
      tradition: true,
    }).done((res) => {
      if (res.result === 0) {
        Global.ui.notification.show('通知设置保存成功', {
          type: 'success',
        })
      } else {
        Global.ui.notification.show('通知设置保存失败')
      }
    })
  },

})

module.exports = PlatformNewsSettingView
