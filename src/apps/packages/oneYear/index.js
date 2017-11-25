// require('./index.scss');
// require('./../../../base/flat/red.css');
// require('./jquery-ui');
// require('./../misc/common-init.js');
// require('./event');
$.widget('gl.oneYear', {

  template: require('./index.html'),

  _create () {
    const self = this
    this.element.html(_(this.template).template()())
    $(() => {
      setTimeout(() => {
        $('.loading').addClass('hidden')
        self.loadAnimate()
      }, 3000)
    })


    // $(window).load(function () {
    // 	setTimeout(function(){
    // 		$('.loading').addClass('hidden');
    // 		self.loadAnimate();
    // 	},300)
    // });
  },
  loadAnimate() {
    this.element.find('#fullpage').fullpage({
      verticalCentered: false,
      css3: true,
      navigation: true,
      loopBottom: true,
      afterLoad(anchorLink, index) {
        if (index == 1) {
          $('.one-body,.one-body-light').addClass('active')
        } else if (index == 2) {
          $('.two-logo,.two-text').addClass('active')
        } else if (index == 3) {
          $('.three-logo,.three-text').addClass('active')
        } else if (index == 4) {
          $('.four-logo,.four-text,.four-bg').addClass('active')
        } else if (index == 5) {
          $('.five-logo,.five-text,.five-bg').addClass('active')
        }
      },

      onLeave(index, nextIndex, direction) {
        if (index == 1) {
          $('.one-body,.one-body-light').removeClass('active')
        } else if (index == 2) {
          $('.two-logo,.two-text').removeClass('active')
        } else if (index == 3) {
          $('.three-logo,.three-text').removeClass('active')
        } else if (index == 4) {
          $('.four-logo,.four-text,.four-bg').removeClass('active')
        } else if (index == 5) {
          $('.five-logo,.five-text,.five-bg').removeClass('active')
        }
      },
    })
  },


})
$(document).ready(() => {
  require.ensure(['./index.scss', './images/bg1.png', './images/bg2.png', './images/bg3.png', './images/bg4.png', './images/bg5.png', './images/fourbodybg.png', './images/onebody.png', './images/onebodyLight.png'], (require) => {
    require('./index.scss')

    $('.js-package').oneYear()
  }, 'onebody')
})

