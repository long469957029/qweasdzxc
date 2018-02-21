import FilterHelper  from 'skeleton/misc/filterHelper'

const PlatformNewsPlatformView = Base.ItemView.extend({

  template: require('newsCenter/templates/platformNews-platform.html'),

  events: {
    'click .js-nc-read': 'readHandler',
    'click .js-nc-link': 'setReadHandler',
    'click .js-nc-del': 'deleteHandler',
    'click .js-nc-all-read': 'readAllHandler',
  },

  deleteXhr(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/getnoticelist.json',
      tradition: true,
      data: {
        letterId: data,
      },
    })
  },

  initialize () {
    _(this.options).extend({
      columns: [
        {
          // name: '主题',
          width: '7%',
        },
        {
          // name: '时间',
          width: '76%',
        },
        {
          // name: '主题',
          width: '14%',
        },
      ],
      height: 380,
      gridOps: {
        emptyTip: '没有消息',
      },
      tip: '<span class="m-right-sm"><span class="js-pf-select-all cursor-pointer">全选</span> | ' +
      '<span class="js-pf-inverse cursor-pointer">反选</span></span>' +
      '<div class="btn-group"><button class="js-nc-read btn btn-hollow">标记为已读</button></div>' +
      '<div class="btn-group"><button class="js-nc-all-read btn btn-hollow">全部已读</button></div>' +
      '<div class="btn-group"><button class="js-nc-del btn btn-hollow">删除选中</button></div>',
      ajaxOps: {
        url: '/acct/usernotice/getnoticelist.json',
      },
    })
  },

  onRender() {
    this.$grid = this.$('.js-nc-platform-grid')

    this.filterHelper = new FilterHelper()

    this.initGrid(this.$grid)

    this._getGridXhr()
  },

  initGrid($grid) {
    const self = this
    $grid.grid({
      tableClass: 'table table-unbordered  no-margin',
      height: 386,
      checkable: true,
      // tip: this.options.tip,
      columnDefinitions: this.options.columns,
      tip: this.options.tip,
      emptyTip: this.options.gridOps.emptyTip,
      onPaginationChange(index) {
        self.filterHelper.set('pageIndex', index)
        self._getGridXhr()
      },
    })

    this.grid = $grid.grid('instance')

    return this
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.noticeList).map(function(info, index, list) {
      return {
        id: info.noticeId,
        columnEls: this.formatRowData(info, index, list),
        dataAttr: info,
      }
    }, this)

    if (gridData.noticeList && gridData.noticeList.length) {
      this.grid.hideEmpty()
    } else {
      this.grid.renderEmpty()
    }

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: true,
    })
      .hideLoading()
  },

  _getGridXhr() {
    const self = this
    const filters = this.filterHelper.get()
    this.grid
      .clean()
      .showLoading()

    Global.sync.ajax({
      url: this.options.ajaxOps.url,
      data: _(filters).extend(this.options.reqData),
    })
      .fail((def, type) => {
        if (type !== 'abort') {
          // Global.ui.notification.show('服务器异常，无法加载列表');
          self.grid.hideLoading()
        }
      })
      .done((res) => {
        if (res && res.result === 0) {
          self.renderGrid(res.root, res)
          Global.m.news.updateUnReadNum({ unReadNotice: res.root.unReadNotice })
        }
      })

    return this
  },

  readAllXhr () {
    return Global.sync.ajax({
      url: '/acct/usernotice/saveAllNoticeToRead.json',
    })
  },

  formatRowData(rowInfo) {
    const row = []

    const textStyle = !rowInfo.isRead ? ' text-cool' : 'text-black'

    const title = []

    title.push(`<span class="${textStyle}">`)

    switch (rowInfo.type) {
      case 0:
        title.push(rowInfo.title)
        break
      case 2:
        title.push(`${rowInfo.title}<a href="#as/ll" class="js-nc-link router btn-link">登录日志</a>`)
        break
      default:
        title.push(`<a href="nc/pn/detail/${rowInfo.noticeId}" class="js-nc-link router btn-link">${rowInfo.title}</a>`)
    }

    title.push('</span>')

    row.push(`<span class="sfa sfa-news-letter${!rowInfo.isRead ? '-active' : ''}"></span>`)

    row.push(title.join(''))

    row.push(`<span class="${textStyle}">${_(rowInfo.time).toTime()}</span>`)
    return row
  },

  _setRead(idList) {
    const self = this
    const model = Global.data.get('newsModel')
    const xhr = model.setReadNoticeXhr(idList)

    if (xhr) {
      xhr.done(() => {
        self._getGridXhr()
      })
    }
  },

  // event handlers

  readHandler(e) {
    const idList = this.grid.getChk().ids

    if (_.isEmpty(idList)) {
      return false
    }

    this._setRead(idList)
  },

  setReadHandler(e) {
    const $target = $(e.currentTarget)

    this._setRead([this.grid.getRowData($target).noticeId])
  },

  deleteHandler(e) {
    const self = this
    const idList = this.grid.getChk().ids

    if (_.isEmpty(idList)) {
      return false
    }

    const model = Global.data.get('newsModel')

    $(document).confirm({
      agreeCallback() {
        const xhr = model.deleteNoticeXhr(idList)

        if (xhr) {
          xhr.done(() => {
            self._getGridXhr()
          })
        }
      },
    })
  },

  readAllHandler () {
    const self = this
    const model = Global.data.get('newsModel')
    $(document).confirm({
      agreeCallback() {
        self.readAllXhr()
          .done((res) => {
            self._getGridXhr()
          })
          .fail((res) => {

          })
      },
    })
  },
})

module.exports = PlatformNewsPlatformView
