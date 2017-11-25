

require('./index.scss')
require('gsap')

const AnimateBg = Base.ItemView.extend({
  template: require('./index.html'),

  render () {
    this.$el.html(_(this.template).template()(this.options))

    TweenLite.set('.js-leaf-fall', { perspective: 600 })
    TweenLite.set('img', { xPercent: '-50%', yPercent: '-50%' })

    const total = 8
    const warp = document.querySelector('.js-leaf-fall')
    const w = window.innerWidth
    const h = window.innerHeight


    for (let i = 0; i < total; i++) {
      (function (i) {
        const index = (i % 4) + 1
        const Div = document.createElement('div')
        TweenLite.set(Div, {
          attr: {
            class: `leaf${index}`,
          },
          x: R(0, w),
          y: R(-200, -150),
          z: R(-200, 200),
        })
        warp.appendChild(Div)
        animm(Div)
      }(i))
    }

    function animm(elm) {
      TweenMax.to(elm, R(6, 15), {
        y: h + 500, ease: Linear.easeNone, repeat: -1, delay: -15, 
      })
      TweenMax.to(elm, R(4, 4), {
        x: '+=100', rotationZ: R(0, 180), repeat: -1, yoyo: true, ease: Sine.easeInOut, 
      })
      TweenMax.to(elm, R(2, 8), {
        rotationX: R(0, 120), rotationY: R(0, 360), repeat: -1, yoyo: true, ease: Sine.easeInOut, delay: -5,
      })
    }

    function R(min, max) { return min + Math.random() * (max - min) }
  },
})

module.exports = AnimateBg
