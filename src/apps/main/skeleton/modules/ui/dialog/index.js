require('./index.scss')

const DialogModule = Base.Module.extend({

  startWithParent: false,

  show(options, targetEl) {
    const $container = targetEl ? $(targetEl) : $('body')

    _.defaults(options || {}, {
      wrapperBody: true,
      show: true,
      bodyClass: '',
      modalClass: '',
      size: '',
      closeBtn: true,
      bStyle: '',
      modalDialogShadow: '',
    })

    if (!options.id) {
      options.id = `js-mo-${_.uniqueId()}`
    }

    if (options.id && ($container.find(`#${options.id}`).size() > 0)) {
      $container.find(`#${options.id}`).next('.modal-backdrop').remove().end()
        .remove()
    }

    const html = []
    const id = options.id || (`dialog${_.now()}`)

    // 任意宽度
    let dStyle = ''
    if (options.anySize && options.anySize !== '') {
      dStyle = `width:${options.anySize}px; margin-left:-${Number(options.anySize) / 2}px; position: absolute; left: 50%;`
    }
    // 任意高低
    let pStyle = ''
    if (options.anyPosition && options.anyPosition !== '') {
      pStyle = `margin-top:${options.anyPosition}px;`
    }
    html.push(`<div class="modal fade ${options.modalClass}" id="`)
    html.push(id)
    html.push(`" tabindex="-1" role="dialog" aria-labelledby="${id}Label" aria-hidden="true">`)

    html.push(`<div class="modal-dialog ${options.size} ${options.modalDialogShadow}" style="${dStyle}${pStyle}${options.bStyle}"`)
    html.push('<div class="modal-content">')
    if(options.specialClose){
      html.push(options.specialClose)
    }else if (options.closeBtn) {
      html.push('<a class="close btn-close" data-dismiss="modal">&times;</a>')
    }
    if (options.title) {
      let marginClass = ''
      if (!options.body && !options.footer) {
        marginClass = 'margin-big'
      }
      html.push(`<div class="modal-header clearfix ${marginClass}">`)
      html.push('<div class="pull-left"><span class="sfa sfa-dialog-info-sm"></span></span></div>')
      html.push(`<div class="modal-title-container pull-left" id="${id}Label"><div class="modal-title">${options.title}</div>`)
      if (options.subTitle) {
        html.push(`<div class="modal-sub-title">${options.subTitle}</div>`)
      }
      html.push('</div></div>')
    }

    if (options.body) {
      if (options.wrapperBody) {
        html.push(`<div class="modal-body ${options.bodyClass}">${options.body}</div>`)
      } else {
        html.push(options.body)
      }
    }

    if (options.footer) {
      html.push(`<div class="modal-footer basic-inverse"><div class="text-center">${options.footer}</div></div>`)
    }

    html.push('</div>')
    html.push('</div>')
    html.push('</div>')

    $container.append(html.join(''))
    if (options.show) {
      const modal = $container.find(`#${options.id}`).modal({
        backdrop: 'static',
      })
      if (options.countdown) {
        const countdownInterval = setInterval(() => {
          const leftTime = $container.find('.js-pf-notification-countdown').text()
          if (leftTime === 1) {
            clearInterval(countdownInterval)
            modal.modal('hide')
            $container.find(`#${options.id}`).remove()
          }
          $container.find('.js-pf-notification-countdown').text(parseInt(leftTime, 10) - 1)
        }, 1000)
      }
    }
    return $container.find(`#${options.id}`)
  },

  hide(id, targetEl) {
    const $container = targetEl ? $(targetEl) : $('body')
    $container.find(`#${id}`).modal('hide')
  },

})

module.exports = DialogModule
