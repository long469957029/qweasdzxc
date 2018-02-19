const SearchGrid = Base.PrefabView.extend({
  _initGrid($grid) {
    const self = this
    $grid.grid(_(this.options).chain().pick(
      'tableClass',
      // 'footerClass',
      'height',
      'tip',
      'pageStyle',
    ).extend({
      checkable: this.options.checkable,
      columnDefinitions: this.options.columns,
      emptyTip: this.options.gridOps && this.options.gridOps.emptyTip,
      emptyClass: this.options.gridOps && this.options.gridOps.emptyClass,
      onPaginationChange(index) {
        self.filterHelper.set('pageIndex', index)
        self._getGridXhr({
          type: 'pagination',
        })
      },
      onSort(e, dir) {
        self.filterHelper.set({
          sortFlag: $(e.currentTarget).closest('th').data('id'),
          sortType: dir === 'desc' ? 1 : 2,
        })

        self._getGridXhr({
          type: 'sort',
        })
      },
    })
      .value())

    this.grid = $grid.grid('instance')

    return this
  },

  _getGridXhr(options) {
    const self = this
    const filters = this.filterHelper.get()

    options = _(options || {}).defaults({
      type: 'research',
    })

    this.grid
      .clean()
      .showLoading()

    if (_(filters.pageIndex).isUndefined()) {
      filters.pageIndex = 0
    }

    filters.pageIndex = Number(filters.pageIndex)

    if (filters.pageSize) {
      this.grid.setPageSize(filters.pageSize)
    }

    if (filters && filters.sortType) {
      _(this.options.columns).findWhere({
        id: filters.sortFlag,
      }).sortable = {
        defaultDir: filters.sortType === 1 ? 'desc' : 'asc',
      }
    }

    this._currentUrl = options.url || this._currentUrl

    if (options.type === 'research' || this.options.remoteEveryTime) {
      Global.sync.ajax({
        url: this._currentUrl,
        data: this.options.cover ? _(filters).extend(this.options.reqData) : _.chain(filters).pick(_.identity).defaults(this.options.reqData).value(),
      })
        .fail((def, type) => {
          if (type !== 'abort') {
            self.grid.hideLoading()
          }
        })
        .done((res) => {
          let list
          let data

          if (res && res.result === 0) {
            data = _(self.options.dataProp.split('.')).reduce((_res, prop) => {
              return _res[prop]
            }, res)

            list = _(self.options.listProp.split('.')).reduce((_res, prop) => {
              return _res[prop]
            }, res)

            if (!data) {
              res.root = []
            }

            self._cache = {
              list,
              data,
              res,
            }

            if (!self.options.remoteEveryTime) {
              list = self._cache.list.slice(
                _(filters.pageIndex).mul(self.grid.option('pageSize')),
                _(filters.pageIndex + 1).mul(self.grid.option('pageSize')),
              )
            } else {
              list = self._cache.list
            }

            if (_.isEmpty(list)) {
              self.grid.renderEmpty()
            } else {
              self.grid.hideEmpty()
            }

            self.renderGrid(data, list, res)
          } else {
            Global.ui.notification.show(res.msg)
          }
        })
    } else if (!this.options.remoteEveryTime && options.type !== 'research') {
      // 本地翻页
      self.renderGrid(this._cache.list.slice(
        _(filters.pageIndex).mul(self.grid.option('pageSize')),
        _(filters.pageIndex + 1).mul(self.grid.option('pageSize')),
      ), self._cache.res)
    }

    return this
  },
})

module.exports = SearchGrid
