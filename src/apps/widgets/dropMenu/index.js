

require('./index.scss')

$.widget('gl.dropMenu', {

  options: {
    namespace: 'dropMenu',
  },

  _create() {
    // $menu = $('.access-menu');
    // $menuItem = $menu.find('> li > a');

    this.$subMenu = this.element.find('.drop-submenu')
    this._bindEvents()
  },

  _bindEvents() {
    this._on({
      'mouseover .drop-menu > li': 'hoverHandler',
      'mouseout .drop-menu > li': 'outHandler',
      'click .drop-submenu > li > a': 'itemClickHandler',
    })
  },

  // event handlers

  hoverHandler(e) {
    const $target = $(e.currentTarget)
    this.$subMenu.removeClass('is-show')
    $target.find('.drop-submenu').addClass('is-show')
  },

  outHandler(e) {
    const $target = $(e.currentTarget)
    $target.find('.drop-submenu').removeClass('is-show')
  },

  itemClickHandler(e) {
    $(e.currentTarget).closest('.drop-submenu').removeClass('is-show')
  },
})

module.exports = $.gl.numRange
