const NotificationModule = Base.Module.extend({

  startWithParent: false,

  prevent: false,

  show(content, options) {
    let footer
    // const self = this

    options = options || {}

    if (this.prevent && !options.force) {
      return
    }

    const ops = {
      type: 'info',
      size: 'modal-sm',
      id: 'notification',
      modalClass: 'modal-notification',
      hasFooter: true,
      // event: _.noop
      btnContent: '确认',
      countdown: 0,
      displayTime: 0, // 显示时间，0无限制。
      btnClass: ''
    }
    if (options.notiType === 'cloud') {
      ops.modalClass = 'modal-cloud'
      ops.wrapperBody = false
      ops.size = ''
    }

    options = _(options || {}).defaults(ops)

    const body = []

    if (options.notiType === 'cloud') {
      body.push('<div class="cloud-pic"><div class="close-icon" data-dismiss="modal"></div>')
      body.push(`<div class="des-infor">${content}</div>`)
      if (options.hasFooter) {
        footer = `<div class="m-TB-md text-center"><button type="button" class="js-pf-notification-btn btn btn-cloud btn-linear" data-dismiss="modal">${options.btnContent}</button></div>`
      }
    } else {
      if (!options.title) { // 根据是否有title判断icon的排列顺序是上下还是左右
        body.push(`<div class="m-top-md m-bottom-md p-top-xs text-center"><span class="sfa sfa-dialog-${options.type}"></span></div>`)
        body.push(`<div class="text-center font-md">${content}</div>`)
      } else {
        body.push(`<span>${content}</span>`)
      }

      if (options.countdown) {
        body.push(`<div class="js-pf-notification-countdown pf-notification-countdown text-center font-md text-danger">${options.countdown}</div>`)
      }
      if (options.hasFooter) {
        footer = '<div class="div-line m-top-lg"></div>'
        if (options.type === 'success') {
          footer += `<div class="m-top-smd m-bottom-md text-center"><button type="button" class="js-pf-notification-btn btn btn-lg p-LR-lg" data-dismiss="modal">${options.btnContent}</button></div>`
        } else {
          footer += `<div class="m-top-smd m-bottom-xs text-center">
                    <button type="button" class="js-pf-notification-btn btn btn-lg btn-cool p-LR-lg ${this.options.btnClass}" data-dismiss="modal">${options.btnContent}</button></div>`
        }
      }
    }

    body.push(footer)
    const data = {
      id: this.options.id,
    }
    if (!options.title) {
      data.body = body.join('')
    } else {
      data.subTitle = body.join('')
    }

    const $dialog = Global.ui.dialog.show(_(data).extend(options))

    $dialog.on('hidden.modal', function() {
      // $(e.currentTarget).next('.modal-backdrop').remove().end().remove();
      $(this).remove()
    })

    if (options.displayTime !== 0) {
      setTimeout(() => {
        $dialog.modal('hide')
        setTimeout(() => {
          if ($dialog) {
            $dialog.next('.modal-backdrop').remove()
            $dialog.remove()
          }
        }, 1000)
      }, options.displayTime)
    }

    if (_(options.event).isFunction()) {
      $dialog.off('click.clickBtn')
        .on('click.clickBtn', '.js-pf-notification-btn', options.event)
    }

    return $dialog
  },

  setPrevent(bool) {
    this.prevent = bool
  },
})

export default NotificationModule
