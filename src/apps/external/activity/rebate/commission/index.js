

const CommissionView = Base.ItemView.extend({

  template: require('./index.html'),

  getListXhr() {
    return Global.sync.ajax({
      url: '/info/agentCommission/list.json',
      data: {
        commissionDate: _(moment().add('days', -1)).toDate(),
        pageSize: 200,
        pageIndex: 0,
      },
    })
  },

  initialize() {
    const self = this

    $('body').addClass('hidden')
    require.ensure(['./index.scss'], (require) => {
      require('./index.scss')
      $('body').removeClass('hidden')
    })

    this.getListXhr()
      .done((res) => {
        let data
        if (res && res.result === 0) {
          data = res.root || {}
          self.$('.status_table tbody').html(_(data.detailList).map((rowInfo) => {
            const html = []

            html.push('<tr>')
            html.push(`<td>${rowInfo.consumeUser}</td>`)
            html.push(`<td>${rowInfo.relationship}</td>`)
            html.push(`<td>${_(rowInfo.consumeAmount).fixedConvert2yuan()}</td>`)
            html.push(`<td>${_(rowInfo.commissionAmount).fixedConvert2yuan()}</td>`)
            html.push('</tr>')

            return html.join('')
          }).join(''))

          const html = []
          html.push('<tr>')
          html.push('<td>统计</td>')
          html.push('<td></td>')
          html.push(`<td>${_(data.betTotal).fixedConvert2yuan()}</td>`)
          html.push(`<td>${_(data.commissionAmount).fixedConvert2yuan()}</td>`)
          html.push('</tr>')
          self.$('.status_table tbody').append(html.join(''))
        }
      })
  },
})

module.exports = CommissionView
