

const bankCard = require('./bankCard.png')
const fundPwd = require('./fundPwd.png')

$.widget('gl.securityTip', {

  options: {
    id: '',
    namespace: 'tip',
    title: '安全提示',
    content: '请补充完您的安全信息后再提现',
    customizeClass: '',
    hasMoneyPwd: false,
    hasSecurity: false,
    hasBankCard: false,
    showBankCard: true,
    showSecurity: false,
    showMoneyPwd: true,
  },

  _create() {
    const self = this

    const body = []
    body.push(`<div class="text-center fc-security-notice-div ${this.options.customizeClass}">`)
    body.push(`<div class="m-bottom-md font-md fc-security-notice-content">${this.options.content}</div>`)
    body.push('<div class="fc-security-notice-link">')

    if (this.options.showMoneyPwd) {
      body.push(`<div class="security-notice-type-div"><div class="security-notice-img"><img src="${fundPwd}"/></div>`)
      let fundPasswordHmtl = '<span class="security-notice-span text-left">资金密码已设置完毕</span>'
      if (!this.options.hasMoneyPwd) {
        fundPasswordHmtl = '<span class="security-notice-span text-left">资金密码未设置</span><a class="js-fc-aHref btn-link text-pleasant" href="#as/pf" >点击设置</a>'
      }
      body.push(`${fundPasswordHmtl}</div>`)
    }

    if (this.options.showBankCard) {
      body.push(`<div class="security-notice-type-div"><div class="security-notice-img"><img src="${bankCard}"/></div>`)
      let bankCardHtml = '<span class="security-notice-span text-left">银行卡已绑定</span>'
      if (!this.options.hasBankCard) {
        bankCardHtml = '<span class="security-notice-span text-left">银行卡未绑定</span><a class="js-fc-aHref  btn-link text-pleasant " href="#uc/cm" >点击绑定</a>'
      }
      body.push(`${bankCardHtml}</div>`)
    }

    if (this.options.showSecurity) {
      body.push('<div class="security-notice-type-div">')
      let securityHtml = '<span class="security-notice-span text-left">安全问题已绑定</span>'
      if (!this.options.hasSecurity) {
        securityHtml = '<span class="security-notice-span text-left">安全问题未设置</span><a class="js-fc-aHref  btn-link text-pleasant router" data-dismiss="modal" href="#as/sq" >点击绑定</a>'
      }
      body.push(`${securityHtml}</div>`)
    }

    body.push('</div>')
    body.push('</div>')

    this.uuid = this.options.id || this.options.namespace + _.now()

    if (this.options.body) {
      this.options.body.html(body.join(''))
    } else {
      this.$dialog = Global.ui.dialog.show({
        id: this.uuid,
        title: this.options.title,
        size: '',
        body: body.join(''),
      })

      this.$dialog.on('hidden.bs.modal', function (e) {
        $(this).remove()
        self.destroy()
      })
    }

    this._bindEvents()
  },

  _bindEvents() {
    this._on({
      'click .js-fc-aHref': 'changeHrefHandler',
    })
  },

  changeHrefHandler(e) {
    if (this.$dialog) {
      this.$dialog.modal('hide')
    }
  },

  show() {
    Global.ui.dialog.show({
      id: this.uuid,
    })
  },
})

module.exports = $.gl.securityTip
