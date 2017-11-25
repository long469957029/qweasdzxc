

const RebateView = Base.ItemView.extend({

  template: require('./index.html'),

  initialize() {
    const self = this

    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })

    this.on('available:false', () => {
      Global.ui.notification.show('很抱歉，您不满足活动条件。')
    })
    this.on('confirm', (data) => {
      const info = data.dataList[0]
      self.$('.js-money').text(info.result ? _(info.result).convert2yuan() : 0)

      self.$('.status_table tbody').html(_(data.subDataList).map((info, index, list) => {
        const html = []

        html.push('<tr>')
        html.push(`<td>${_(info.time).toDate()}</td>`)
        html.push(`<td>${info.username}</td>`)
        html.push(`<td>${_(info.consumeAmount).convert2yuan()}</td>`)
        html.push('</tr>')

        if (list.length - 1 === index) {
          html.push('<tr>')
          html.push('<td><span>总计</span></td>')
          html.push('<td>&nbsp;</td>')
          html.push(`<td><span>${_(list).chain().reduce((count, info) => {
            count += info.consumeAmount
            return count
          }, 0).convert2yuan()
            .value()}</span></td>`)
          html.push('</tr>')
        }

        return html.join('')
      }).join(''))
    })
  },
})

module.exports = RebateView
