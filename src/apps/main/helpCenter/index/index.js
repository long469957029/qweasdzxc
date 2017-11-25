

const MultiSidebarView = require('com/sidebar-multi')

let helpConfig

const HelpCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
  },

  onRender() {
    const self = this
    require.ensure(['./config'], (require) => {
      helpConfig = require('./config')
      self._onRender()

      self.loadingFinish()
    }, 'help')
  },

  _onRender() {
    const self = this
    this.$sidebar = this.$('.js-gl-sidebar')
    this.$main = this.$('.js-hc-main')
    this.$mainTilte = this.$('.js-hc-main-title')

    this.multiSidebarView = new MultiSidebarView({
      el: this.$sidebar,
      sidebar: helpConfig.getAll(),
      height: 472,
    })
      .on('change:select', (arg, href) => {
        const selectInfo = helpConfig.get(arg)
        if (selectInfo) {
          self.$mainTilte.text(selectInfo.name)
          self.$main.html(selectInfo.html)

          if (href) {
            Global.appRouter.navigate(href, { trigger: false, replace: false })
          }

          const accordion = _.getUrlParam('accordion')

          if (accordion) {
            self.timer = setInterval(() => {
              if (self.$main.height() > 0 && self.$main.width() > 0) {
                clearInterval(self.timer)
                const $accordion = self.$main.find(`#${accordion}`)
                self.$main.scrollTop($accordion.closest('.accordion-group').offset().top)
                $accordion.collapse('toggle')
              }
            }, 100)
          } else {
            self.timer = setInterval(() => {
              if (self.$main.height() > 0 && self.$main.width() > 0) {
                clearInterval(self.timer)
                self.$main.find('.collapse').eq(0).collapse('toggle')
                self.$main.scrollTop(0)
              }
            }, 100)
          }
        } else {
          console.log('该帮助页面内容不存在.')
        }
      })
      .render()

    const page = _.getUrlParam('page')
    if (page) {
      this.multiSidebarView.goTo(`page=${page}`, 'goTo')
    }
  },
})

module.exports = HelpCenterView
