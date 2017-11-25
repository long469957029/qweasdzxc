define((require, exports, module) => {
  const UIModule = Base.Module.extend({

    startWithParent: false,

    initialize(options, moduleName, app) {
      this._initPortletCollapse()
    },

    _initPortletCollapse() {
      const $activeWidget = ''
      $('body').on('click', '.portlet-collapse-option', function() {
        let $activeWidget = $(this).parent().parent().parent()

        $activeWidget.find('.portlet-inner').slideToggle()
        $activeWidget.toggleClass('portlet-collapsed')

        const $activeSpinIcon = $activeWidget.find('.refresh-icon-animated').fadeIn()

        setTimeout(() => {
          $activeSpinIcon.fadeOut()
        }, 500)

        $activeWidget = ''

        return false
      })
    },

  })

  module.exports = UIModule
})
