

// const slimscroll = require('jquery-slimscroll')

$.widget('gl.staticGrid', {

  template: require('./index.html'),

  options: {
    tableClass: 'table table-bordered ',
    height: 0,
    emptyTip: '暂无数据',
    colModel: [],
    row: [],
    url: '',
    initRemote: true,
    startOnLoading: true,
    showHeader: true,
    abort: true,
    data: {},
    dataProp: 'root',
  },

  _create(gridOps) {
    this.options = gridOps ? _(this.options).extend(gridOps) : this.options
    this.options.hasBorder = _.isUndefined(this.options.hasBorder) ? this.options.tableClass.indexOf('table-bordered') > -1 : this.options.hasBorder

    this.element.html(_(this.template).template()(_({
      loading: Global.ui.loader.get({
        wrapperClass: 'js-wt-loader-container hidden',
      }),
      emptyTip: this.getEmptyHtml(),
    }).extend(_(this.options).pick(
      'tableClass',
      'colModel',
      'hasBorder',
      'showHeader',
      'wrapperClass',
    ))))

    this.$bodyDiv = this.element.find('.js-wt-body-main')
    this.$tbody = this.element.find('.js-wt-tbody')
    this.$footerDiv = this.element.find('.js-wt-footer-main')
    this.$footerBody = this.$footerDiv.find('tbody')
    this.$loaderContainer = this.element.find('.js-wt-loader-container')
    this.$emptyContainer = this.element.find('.js-wt-empty-container')

    if (this.options.height > 0) {
      this.$bodyDiv.slimScroll({
        height: this.options.height,
      })
    }

    if (this.options.url && this.options.initRemote) {
      this.getDataXhr()
    } else if (_.isEmpty(this.options.row)) {
      if (this.options.startOnLoading) {
        this.renderLoading()
      } else {
        this.renderEmpty()
      }
    } else {
      this.renderRow(this.options.row)
    }
    return this
  },

  update() {
    this.getDataXhr()
  },

  getDataXhr() {
    const self = this

    this.clean()
      .renderLoading()

    Global.sync.ajax({
      url: this.options.url,
      abort: this.options.abort,
      data: this.options.data,
    })
      .always(() => {
        self.hideLoading()
      })
      .fail((xhr, type) => {
        if (type !== 'abort') {
          self.renderFail()
        }
      })
      .done((res) => {
        if (res && res.result === 0) {
          self.currentData = _(self.options.dataProp.split('.')).reduce((_res, prop) => {
            let data = _res[prop]
            if (!data) {
              data = []
            }
            return data
          }, res)
          self.renderRow(self.currentData)
          self.element.trigger('update:done', res.root, res)
        } else {
          self.renderFail()
        }
      })
  },

  formatRow(rows) {
    const html = []
    let formatRows = []

    if (_.isArray(rows)) {
      formatRows = _.map(rows, function(row, index, data) {
        return this.formatRowData(row, index, data)
      }, this)

      if (formatRows.length) {
        _(formatRows).each((info, index) => {
          html.push('<tr class="js-gl-static-tr"')
          _.each(rows[index], (value, key) => {
            html.push(` data-${_(key).toDataStyle()}="${_(value).escape()}"`)
          })
          html.push('>')
          _(info).each((cell) => {
            html.push(cell)
          })

          html.push('</tr>')
        })
      }
    } else {
      html.push(`<tr class="js-gl-static-tr ${rows.trClass}">`)
      _(rows.columnEls).each((cell) => {
        html.push(`<td>${cell}</td>`)
      })
      html.push('</tr>')
    }


    return html.join('')
  },

  formatRowData(row, index, data) {
    const self = this
    // 合并行
    _(self.options.colModel).each((colInfo) => {
      if (colInfo.merge) {
        _(data).reduceRight((repeat, info) => {
          if (!_(repeat.val).isUndefined() && info[colInfo.name] === repeat.val) {
            repeat.num += 1
          } else {
            repeat.val = info[colInfo.name]
            repeat.num = 0
          }
          info[`${colInfo.name}Rowspan`] = repeat.num + 1

          return repeat
        }, {
          val: null,
          num: 0,
        })
      }
    })

    return _(self.options.colModel).reduce((formatRow, colInfo) => {
      const cell = []
      let cellContent = ''
      let rowName = ''
      let dataName = ''
      if (_(colInfo.name).indexOf('.') > -1) {
        const arr = colInfo.name.split('.')
        rowName = row[`${arr[0]}`][`${arr[1]}`]
        dataName = index > 0 ? data[index - 1][`${arr[0]}`][`${arr[1]}`] : ''
      } else {
        rowName = row[`${colInfo.name}`]
        dataName = index > 0 ? data[index - 1][`${colInfo.name}`] : ''
      }
      if (colInfo.merge && index > 0 && rowName === dataName) {
        cell.push('')
      } else {
        cell.push(`<td rowspan="${row[`${colInfo.name}Rowspan`] || 1}">`)
        if (colInfo.formatter) {
          cellContent = colInfo.formatter(rowName, index, row)
        } else if (rowName || rowName === 0) {
          cellContent = rowName
        }
        // cellContent = colInfo.formatter ? colInfo.formatter(row[colInfo.name], index, row) :
        //   (row[colInfo.name] || row[colInfo.name] === 0) ? row[colInfo.name] : ''

        cell.push(cellContent)

        cell.push('</td>')
      }

      formatRow.push(cell.join(''))

      return formatRow
    }, [])
  },

  getRowData($el) {
    const $row = $($el).closest('tr')
    return $row.data()
  },

  getEmptyHtml() {
    const html = []
    if (this.options.emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center hidden">')
      html.push('<div class="empty-container-main">')
      html.push('<div class="grid-empty sfa-grid-empty"></div>')
      html.push(this.options.emptyTip)
      html.push('</div>')
      html.push('</div>')
    }

    return html.join('')
  },

  // common APIs

  height() {
    return this.element.find('table').height()
  },

  clean() {
    this.$tbody.empty()
    this.$footerBody.empty()

    return this
  },

  addRows(rows, options) {
    options = options || {}
    const $rows = $(this.formatRow(rows))

    this.hideLoading()
    this.hideEmpty()

    if (_.isUndefined(options.prepend)) {
      this.$tbody.append($rows)
    } else {
      this.$tbody.prepend($rows)
    }
    return $rows
  },

  addFooterRows(rows, options) {
    options = options || {}

    const $rows = $(this.formatRow(rows))

    this.hideLoading()
    this.hideEmpty()

    if (_.isUndefined(options.prepend)) {
      this.$footerBody.append($rows)
    } else {
      this.$footerBody.prepend($rows)
    }
    return $rows
  },

  delRow(index) {
    this.$tbody.find('.js-gl-static-tr').eq(index).remove()
  },

  renderRow(row) {
    let $rows = $()

    if (row.length) {
      this.hideLoading()
      this.hideEmpty()

      $rows = $(this.formatRow(row))
      this.$tbody.html($rows)
    } else {
      this.$tbody.empty()
      this.renderEmpty()
    }

    return $rows
  },

  reformat(gridOps) {
    if (this.currentData) {
      if (gridOps) {
        this._create(_(gridOps).extend({
          initRemote: false,
          row: this.currentData,
        }))
      }
      // this.renderRow()
    }
  },

  renderEmpty() {
    this.$emptyContainer.removeClass('hidden')

    return this
  },

  hideEmpty() {
    this.$emptyContainer.addClass('hidden')

    return this
  },

  renderLoading() {
    this.$loaderContainer.removeClass('hidden')
    return this
  },

  hideLoading() {
    this.$loaderContainer.addClass('hidden')
    return this
  },

  renderFail() {
    this.hideEmpty()
    this.$tbody.html(`<tr><td class="text-center" colspan="${this.options.colModel.length}">加载数据失败</td></tr>`)
  },
})

module.exports = $.gl.staticGrid
