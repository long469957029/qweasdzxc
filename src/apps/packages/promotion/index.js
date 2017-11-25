/**
 * Created by Administrator on 2016/12/12.
 */


const HomeView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    // $('body').addClass('hidden');
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
    })
  },

  onRender() {
    const self = this

    require.ensure(['./js/year_celebrate/effect.js', './js/jquery.mousewheel.js', './js/createjs-2015.11.26.min.js', './js/effect_01.js', './js/effect_02.js'], (require) => {
      require('./js/year_celebrate/effect.js')
      require('./js/jquery.mousewheel.js')
      require('./js/createjs-2015.11.26.min.js')
      require('./js/effect_01.js')
      require('./js/effect_02.js')
    })
  },


})

$('.js-package').html(new HomeView().render().$el)
$('body').css('background-color', '#fff')
