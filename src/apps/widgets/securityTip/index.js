

// const bankCard = require('./bankCard.png')
// const fundPwd = require('./fundPwd.png')

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
    body.push(`<div class="text-left ${this.options.customizeClass}">`)
    body.push('<div class="fc-security-notice-link">')
    let footer = ''
    if (this.options.showMoneyPwd) {
      body.push('<div class="security-notice-type-div">')
      let fundPasswordHmtl = '<span class="security-notice-span text-left">资金密码已设置完毕</span>'
      if (!this.options.hasMoneyPwd) {
        fundPasswordHmtl = `<span class="security-notice-span text-left">${this.options.content ? this.options.content : '资金密码未设置，请先设置资金密码'}</span>`
        footer = '<a class="js-fc-aHref btn btn-cool btn-lg m-TB-smd font-sm" href="#/uc/pl">点击设置</a>'
      }
      body.push(`${fundPasswordHmtl}</div>`)
    }

    if (this.options.showBankCard) {
      body.push('<div class="security-notice-type-div">')
      let bankCardHtml = '<span class="security-notice-span text-left">银行卡已绑定</span>'
      if (!this.options.hasBankCard) {
        bankCardHtml = `<span class="security-notice-span text-left">${this.options.content ? this.options.content : '您尚未绑定银行卡，请先绑定银行卡'}</span>`
        footer = '<a class="js-fc-aHref btn btn-cool btn-lg m-TB-smd font-sm" href="#/uc/cm">点击设置</a>'
      }
      body.push(`${bankCardHtml}</div>`)
    }

    if (this.options.showSecurity) {
      body.push('<div class="security-notice-type-div">')
      let securityHtml = '<span class="security-notice-span text-left">安全问题已绑定</span>'
      if (!this.options.hasSecurity) {
        securityHtml = `<span class="security-notice-span text-left">${this.options.content ? this.options.content : '您尚未设置安全问题，请先设置密保问题'}</span>`
        footer = '<a class="js-fc-aHref btn btn-cool btn-lg m-TB-smd font-sm" href="#/uc/pl">点击设置</a>'
      }
      body.push(`${securityHtml}</div>`)
    }

    body.push('</div>')
    body.push('</div>')

    this.uuid = this.options.id || this.options.namespace + _.now()

    if (this.options.body) {
      this.options.body.html(body.join(''))
    } else {
      $(document).confirm({
        id: this.uuid,
        title: '温馨提示',
        content: body.join(''),
        footer,
        // btnLeftText: '点击设置',
        // btnRightText: '',
      })
        .on('hidden.modal', function() {
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

  changeHrefHandler() {
    Global.ui.dialog.hide(this.uuid)
  },

  show() {
    Global.ui.dialog.show({
      id: this.uuid,
    })
  },
})

module.exports = $.gl.securityTip
