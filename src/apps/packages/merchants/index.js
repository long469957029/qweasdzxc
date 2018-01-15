

require('./index.scss')
require('./../misc/common-init.js')

const Router = require('./router')
// const HeaderView = require('./header/index')

require('com/fullpage')

$('body').addClass('loaded').find('.wm-loader-wrapper').remove()

$('.js-wrapper').removeClass('hidden')

// $('body').on('webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend', '.animate', function(e) {
//  var $target = $(e.currentTarget);
//  $target.removeClass($target.data('class'));
// });

window.Global.addRegions({
  // headerRegin: '#header2',
  mainRegin: '#main',
})

// window.Global.headerRegin.show(new HeaderView())

new Router()

Backbone.history.start()

