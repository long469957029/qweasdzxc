

require('./index.scss')

const FastAdView = Base.ItemView.extend({

  isHave: 0,

  template: require('./index.html'),

  events: {
    'click .js-close-indexAd': 'closeIndexAd',
    'click .js-close-leftAd': 'closeLeftAd',
  },

  initialize() {
    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })
  },

  closeIndexAd() {
  	const maskNode = document.getElementsByClassName('js-indexAd')
  	maskNode[0].parentNode.removeChild(maskNode[0])
    this.isHave = 1

    const FastGiveWaterView = require('com/fastGiveWater')
    this.fastGiveWaterView = new FastGiveWaterView()
    this.fastGiveWaterView.checkState()
  },

  closeLeftAd() {
  	const maskNode = document.getElementsByClassName('js-leftAd')
  	maskNode[0].parentNode.removeChild(maskNode[0])
  },

  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState() {
    const self = this
    $('body').append(self.render().$el)

    if (Global.cookieCache.get('mmc_flag') == null) {
      Global.cookieCache.set('mmc_flag', '1')
    } else {
      $('.js-indexAd').addClass('hide')
    }

    const strHash = document.location.hash
    if (strHash.slice(0, 3) != '#bc') {
      $('.js-leftAd').addClass('hide')
    } else {
      $('.js-leftAd').removeClass('hide')
    }
  },
})

module.exports = FastAdView
