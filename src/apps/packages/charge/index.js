require('./index.scss')
const imgSuccess = require('./charge-success.png')
const imgFain = require('./charge-fail.png')

$.widget('gl.charge', {

  template: require('./index.html'),

  _create() {
    const type = _.getUrlParam('type')
    let imgUrl = imgSuccess
    let content = '<span class="font-md">充值成功，请返回平台查看充值结果！</span>'
    if (type === '1') {
      imgUrl = imgFain
      content = '<span class="font-md">充值异常！</span><br/><span class="font-sm">因为网络延迟以及第三方支付系统的延迟有可能导致您的到账较慢，</span><br/><span class="font-sm">请耐心等待。</span>'
    }
    this.element.html(_(this.template).template()({ imgUrl, content }))
  },
})

$(document).ready(() => {
  $('.js-package').charge()
})
