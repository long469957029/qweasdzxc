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
    html.push(options.anySize ? `<div style="${dStyle}${pStyle}">` : `<div class="modal-dialog ${options.size}">`)
    html.push(`<div class="modal-content" style=" ${options.bStyle || ''}">`)

    if (options.title) {
      html.push('<div class="modal-header">')
      html.push('<button type="button" class="close" data-dismiss="modal">')
      html.push('<span aria-hidden="true">&times;</span>')
      html.push('</button>')
      html.push(`<h4 class="modal-title" id="${id}Label">` +
        `<span class="portlet-icon sfa sfa-sub-title-user vertical-sub"></span> ${options.title}</h4>`)
      html.push('</div>')
    }

    if (options.body) {
      if (options.wrapperBody) {
        html.push(`<div class="modal-body basic-inverse ${options.bodyClass}">${options.body}</div>`)
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
