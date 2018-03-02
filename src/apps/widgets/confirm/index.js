

$.widget('gl.confirm', {

  _currentSelItemMeta: {},

  options: {
    id: '',
    size: '',
    namespace: 'confirm',
    agreeCallback: _.noop,
    rejectCallback: _.noop,
    title: '操作确认',
    noFooter: false,
    content: '确定进行当前操作？',
    btnLeftText: '确定',
    btnRightText: '取消',
    closeBtn: false
  },

  _create() {
    const self = this

    this.uuid = this.options.id || `confirm-${_.now()}`
    const body = []
    let footer = this.options.footer ? this.options.footer : `${'<div class="text-center control-confirm-special m-top-md">' +
    '<button type="button" class="btn btn-left confirm-agree" data-loading-text="保存中">'}${this.options.btnLeftText}</button>` +
    `<button type="button" class="btn btn-link btn-right confirm-reject" data-dismiss="modal">${this.options.btnRightText}</button></div>`

    let data = {
      id: this.uuid,
      title: this.options.title,
      subTitle: this.options.content,
      size: this.options.size,
      footer: this.options.noFooter ? '' : footer,
      closeBtn: this.options.closeBtn
    }

    if (this.options.type === 'exit') {
      body.push('<div class="m-TB-md text-center"><span class="sfa sfa-dialog-info"></span></div>')
      body.push(`<div class="text-center font-md">${this.options.content}</div>`)

      footer = `${'<div class="m-TB-md text-center"><div class="text-center control-confirm-special ">' +
        '<button type="button" class="btn btn-left confirm-agree width-sm btn-lg" data-loading-text="处理中">'}${this.options.btnLeftText}</button>` +
        `<button type="button" class="btn btn-link btn-right confirm-reject" data-dismiss="modal">${this.options.btnRightText}</button></div>`
      body.push(footer)

      data = {
        size: 'modal-sm',
        modalClass: 'modal-notification',
        id: this.uuid,
        body: body.join(''),
        closeBtn: this.options.closeBtn,
        modalDialogShadow: this.options.closeBtn,
      }
    }

    this.$dialog = Global.ui.dialog.show(data)

    this.$dialog.on('hidden.modal', function() {
      $(this).remove()
      self.destroy()
    })

    this._bindEvents()
  },

  _bindEvents() {
    this._on({
      'click .confirm-agree': 'agreeConfirmHandler',
      'click .confirm-reject': 'rejectConfirmHandler',
    })
  },

  show() {
    Global.ui.dialog.show({
      id: this.uuid,
    })
  },

  hide() {
    this.$dialog.modal('hide')
  },

  agreeConfirmHandler(e) {
    this.options.agreeCallback(e)

    Global.ui.dialog.hide(this.uuid)

    return false
  },
  rejectConfirmHandler() {
    this.options.rejectCallback()

    Global.ui.dialog.hide(this.uuid)
    return false
  },

})

module.exports = $.gl.confirm
