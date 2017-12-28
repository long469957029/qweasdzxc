

require('./index.scss')

const slimscroll = require('jquery-slimscroll')

$.widget('gl.grid', {
  template: require('./index.html'),

  options: {
    checkable: true,
    chkAllId: 'chkAll',
    namespace: 'glGrid',
    tableClass: 'table table-bordered ',
    footerClass: '',
    height: 300,
    columnDefinitions: [],
    tip: '',
    emptyTip: '暂无数据',
    onRowItemClick: _.noop,
    onRowCheckboxClick: _.noop,
    onSelectAll: _.noop,
    onSort: _.noop,
    rowData: null,

    // pagination
    pageIndex: 0,
    pageSize: 15,
    maxPaginationNum: 6,
    totalSize: 0,
    onPaginationChange: _.noop,
    emptyClass: 'sfa-grid-empty',
  },

  _create() {
    this.options.chkAllId = _.uniqueId('chk_')
    this.options.hasBorder = this.options.tableClass.indexOf('table-bordered') > -1

    this._data = []

    if (!this._formatColumnDefinitions()) {
      window.WemartApp.ui.notification.show('Table 列定义信息不足')
      return false
    }

    const html = _(this.template).template()(_({
      loading: Global.ui.loader.get({
        wrapperClass: 'loader-container hidden',
      }),
      tip: this.options.tip,
      emptyTip: this.getEmptyHtml(),
    }).extend(_(this.options).pick(
      'checkable',
      'chkAllId',
      'tableClass',
      'footerClass',
      'columnDefinitions',
      'hasBorder',
    )))

    this.element.html(html)

    this.$bodyDiv = this.element.find('.js-wt-body-main')
    this.$body = this.$bodyDiv.find('tbody')

    this.$footerDiv = this.element.find('.js-wt-footer-main')
    this.$footerBody = this.$footerDiv.find('tbody')

    this.$tip = this.element.find('.js-wt-tip')
    this.$pagination = this.element.find('.js-wt-pagination')

    this.$emptyContainer = this.element.find('.js-wt-empty-container')

    if (this.options.height > 0) {
      this.$bodyDiv.slimScroll({
        height: this.options.height,
      })
    }

    if (this.options.rowData) {
      this.refreshRowData(this.options.rowData)
    }

    this.$pagination.pagination(_.pick(
      this.options,
      'pageIndex',
      'pageSize',
      'maxPaginationNum',
      'onPaginationChange',
      'totalSize',
      'pageStyle',
    ))

    this.pagination = this.$pagination.pagination('instance')

    this._bindEvents()
  },

  _bindEvents() {
    const events = {
      'click tbody>tr': this.clickRowHandler,
      'click .sortable-grid-col-header': this.sortGridHandler,
      'click .js-pf-select-all': this.selectAllHandler,
      'click .js-pf-inverse': this.inverseHandler,
    }

    if (this.options.checkable) {
      _.extend(events, {
        'click .inbox-check': this.selectRowHandler,
      })

      events[`click #${this.options.chkAllId}`] = this.selectAllRowHandler
    }

    this._on(events)
  },

  _formatColumnDefinitions() {
    const definitions = this.options.columnDefinitions
    if (!_.isArray(definitions)) {
      return false
    }

    this.options.columnDefinitions = _(definitions).map((define) => {
      return ($.isPlainObject(define)) ? define : { name: define }
    })

    return true
  },

  // common APIs

  refreshRowData(rows, totalSize, options) {
    let html = '',
      self = this

    this.resetChkAll()

    if (_(rows).size() === 0) {
      this.renderEmpty()
    }

    if (_.isArray(rows)) {
      this._data = rows
      _.each(rows, (row) => {
        html += self._getSingleRowEl(row)
      })
    }

    this.$body.html(html)

    // 插入extRow
    this._addExtRows(rows)

    // this.element.find('.smart-grid .smart-grid-nodata').remove();

    // if (!html) {
    //  this.element.find('.smart-grid').append(this._getNoDataInfoEl());
    // }

    this.$tip.removeClass('hidden')
    this.pagination.update(totalSize, options.pageIndex, options)

    return this
  },
  destroy () {
    // In jQuery UI 1.8及以前用法
    $.Widget.prototype.destroy.call(this)
    // In jQuery UI 1.9及以后<br>
    // }
  },

  height(height) {
    this.$bodyDiv.nextAll('.slimScrollRail,.slimScrollBar').remove()

    this.$bodyDiv.slimScroll({
      destroy: true,
    })

    this.$bodyDiv.slimScroll({
      height,
    })
  },

  setPageSize(pageSize) {
    this.pagination.option('pageSize', Number(pageSize))
  },

  addRows(rows, toTopPosition) {
    let html = '',
      self = this

    if (_.isArray(rows)) {
      _.each(rows, (row) => {
        html += self._getSingleRowEl(row, 'body')
      })
    } else {
      html = this._getSingleRowEl(rows, 'body')
    }

    if (toTopPosition) {
      this.$body.prepend(html)
      this._data.unshift(rows)
    } else {
      this.$body.append(html)
      this._data.push(rows)
    }

    return this
  },

  addFooterRows(rows, toTopPosition) {
    let html = '',
      self = this

    if (_.isArray(rows)) {
      _.each(rows, (row) => {
        html += self._getSingleRowEl(row, 'footer')
      })
    } else {
      html = this._getSingleRowEl(rows, 'footer')
    }

    if (toTopPosition) {
      this.$footerBody.prepend(html)
    } else {
      this.$footerBody.append(html)
    }

    return this
  },

  _addExtRows(row) {
    const self = this

    const $trs = this.element.find('tbody tr')

    $trs.each((index, tr) => {
      if (row[index] && row[index].extRow) {
        const $extTr = $(`<tr><td class="bg-grey no-padding" colspan="${self.options.columnDefinitions.length}"></td></tr>`)
        $extTr.find('td').append(row[index].extRow)
        $(tr).after($extTr)
      }
    })
  },

  clean() {
    this.$body.empty()
    this.$footerBody.empty()

    this.$tip.addClass('hidden')
    this.pagination.clean()

    return this
  },

  resetChkAll() {
    this.element.find(`#${this.options.chkAllId}`).prop('checked', false)
    return this
  },

  getChk() {
    const chkData = {}
    const $trs = this.element.find('tbody tr.active')
    let ids

    if ($trs.length) {
      ids = _($trs.find('.inbox-check')).map((checkbox) => {
        return $(checkbox).attr('id')
      })
      chkData.ids = ids
      chkData.$rows = $trs
    }

    return chkData
  },

  getSelectedRows() {
    let selectedRowsData = [],
      $selectedRows = this.element.find('.inbox-check:checked')
    $selectedRows.each(function() {
      const $container = $(this).closest('tr')
      selectedRowsData.push($container.data() || {})
    })

    return selectedRowsData
  },

  getEmptyHtml() {
    const html = []
    if (this.options.emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center hidden">')
      html.push('<div class="empty-container-main">')
      html.push(`<div class="grid-empty ${this.options.emptyClass}"></div>`)
      html.push(this.options.emptyTip)
      html.push('</div>')
      html.push('</div>')
    }

    return html.join('')
  },


  selectAll() {
    this._selectAll(true)
  },

  selectInverse() {
    this.element.find('.inbox-check').each((index, checkbox) => {
      const $checkbox = $(checkbox)
      $checkbox.prop('checked', !$checkbox.prop('checked'))
    })
  },

  renderEmpty() {
    this.$emptyContainer.removeClass('hidden')

    return this
  },

  hideEmpty() {
    this.$emptyContainer.addClass('hidden')

    return this
  },

  showLoading() {
    this.element.find('.loader-container').removeClass('hidden')
    return this
  },

  hideLoading() {
    this.element.find('.loader-container').addClass('hidden')
    return this
  },

  getRowData($el) {
    const $row = $($el).closest('tr')
    return $row.data()
  },

  sortReset() {
    this.element.find('.sortable-grid-col-header i').filter('.fa-sort-asc, .fa-sort-desc').attr('class', 'fa fa-sort')

    return this
  },

  getSingleRowHtml(data) {
    return this._getSingleRowEl(data)
  },

  /**
   * 私有方法
   * rowData:
   *   id (字符串，可选) 作为这一行的唯一标识符
   *   columnEls (数组，每个Item可以HTML字符串) 指定一行中，每一列具体要显示的样式
   *   dataAttr (对象) 绑定在`tr`元素上，便于其他操作对于数据的调用
   * example:
   * {
   *    id: 'checkbox-1',
   *    dataAttr: {
   *      name: 'test',
   *      no: 12
   *    },
   *    columnEls: ['test', '<div><p>line 1</p><p>line 2</p></div>', {
   *    colspan: 2,
   *    cell: 'test',
   *    }]
   *    collapse: false, //默认 false，展开
   *    extRow: ''
   *    }
   * }
   */

  _getSingleRowEl(rowData, rowType) {
    let html = [],
      id = rowData.id || _.uniqueId(`${this.options.namespace}chk`),
      columnEls = rowData.columnEls || [],
      dataAttr = rowData.dataAttr || {},
      i

    html.push('<tr')

    if (rowData.trClass) {
      html.push(` class="${rowData.trClass}"`)
    }

    _.each(dataAttr, (value, key) => {
      html.push(` data-${_(key).toDataStyle()}="${_(value).escape()}"`)
    })

    html.push('>')

    if (this.options.checkable) {
      html.push('<td>')

      if (rowType !== 'footer') {
        html.push('<div class="custom-checkbox">')
        html.push(`<input type="checkbox" id="${id}" class="inbox-check">`)
        html.push(`<label class="checkbox-label" for="${id}"></label>`)
        html.push('</div>')
      }

      html.push('</td>')
    }

    _(columnEls).each((column) => {
      if (_(column).isObject()) {
        html.push(`<td colspan="${column.colspan || 1}">`)
        html.push(column.content)
      } else {
        html.push('<td>')
        html.push(column)
      }
      html.push('</td>')
    })

    html.push('</tr>')

    return html.join('')
  },

  // event handlers

  clickRowHandler(e) {
    let $rowItem = $(e.currentTarget),
      data = $rowItem.data() || {}

    this.options.onRowItemClick(data)
  },

  selectRowHandler(e) {
    let $checkbox = $(e.currentTarget),
      $activeRow = $checkbox.parent().parent().parent()

    $activeRow.toggleClass('active')

    if (!$checkbox.prop('checked')) {
      this.element.find(`#${this.options.chkAllId}`).prop('checked', false)
    }

    this.options.onRowCheckboxClick(e)

    e.stopPropagation()
  },

  selectAllRowHandler(e) {
    this._selectAll($(e.currentTarget).prop('checked'))
  },

  _selectAll(flag) {
    if (flag) {
      this.element.find('.inbox-check').prop('checked', true)
      this.element.find('.inbox-check').parent().parent().parent()
        .addClass('active')
    } else {
      this.element.find('.inbox-check').prop('checked', false)
      this.element.find('.inbox-check').parent().parent().parent()
        .removeClass('active')
    }

    this.options.onSelectAll()
  },

  sortGridHandler(e) {
    const $target = $(e.currentTarget)
    const $i = $target.find('i')
    const iClass = $i.attr('class')

    this.sortReset()

    const sortDir = ((iClass.indexOf('fa-sort-desc') === -1) ? 'desc' : 'asc')

    $i.attr('class', `fa fa-sort-${sortDir}`)

    this.options.onSort(e, sortDir)
  },

  selectAllHandler() {
    this.selectAll()
  },

  inverseHandler() {
    this.selectInverse()
  },
})

module.exports = $.gl.grid
