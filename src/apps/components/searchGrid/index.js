import FilterHelper  from 'skeleton/misc/filterHelper'

const SearchGrid = Base.PrefabView.extend({

  searchGridTpl: _(require('./index.html')).template(),

  options: {
    prevClass: 'js-pf',
    tableClass: 'table table-hover table-bordered table-center',
    checkable: false,
    dataProp: 'root',
    listProp: 'root',
    remoteEveryTime: true,
    divider: true,
    tip: '',
    cover: true, // 参数覆盖  团队
    subBreadCallBack: _.noop
  },

  constructor() {
    Base.PrefabView.prototype.constructor.apply(this, arguments)

    this._currentUrl = this.options.ajaxOps.url
    this._breadList = []
  },

  __events() {
    const events = {}

    events['submit .js-pf-search-form'] = 'searchHandler'
    events['click .js-pf-search-bread'] = 'subBreadHandler'
    events['click .js-pf-sub'] = 'subBreadHandler'
    // _(this.event).chain().pairs().each(function(item){
    //   events[item[0]] = item[1];
    // }).values();
    return events
  },

  render() {
    this.triggerMethod('before:render', this)

    this.filterHelper = new FilterHelper()
    const template = _(this.template).template()(this.options.reqData)

    this.$el.html(this.searchGridTpl({
      template,
      options: this.options,
    }))

    this.triggerMethod('render', this)
    return this
  },

  onRender() {
    this.$searchForm = this.$('.js-pf-search-form')

    this.$breadcrumb = this.$('.js-pf-breadcrumb')
    this.$divider = this.$('.js-pf-divider')

    this.$grid = this.$('.js-pf-search-grid')

    this.filterHelper.setForm(this.$searchForm)

    this._setUrlParams()

    this._initGrid(this.$grid)

    this.$searchForm.trigger('submit')
    return this
  },

  _setUrlParams() {
    const params = _.getUrlParam()
    _(params).each(function(val, prop) {
      const $searchItem = this.$searchForm.find(`[name=${prop}]`)
      if (!$searchItem.is('checkbox,radio')) {
        // todo 需要时再处理
        $searchItem.val(val)
      }
    }, this)
  },

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

  renderBread() {
    const html = ['<li>您正在查看：</li>']

    html.push(`<li class="js-pf-search-bread" data-type="bread" data-url="${this.options.ajaxOps.url}">`)
    html.push(`<a class="btn-link btn-link-cool" href="javascript:void(0)">${this.options.title}</a> `)
    html.push('<span class="divider">&gt;</span>')
    html.push('</li>')

    if (!this._breadList.length) {
      // this.$divider.removeClass('hidden');
      this.$breadcrumb.addClass('hidden')

      this.grid.height(this.options.height)
    } else {
      this.grid.height(this.options.height - 41)
      // this.$divider.addClass('hidden');

      _(this._breadList).each(function(breadInfo, index) {
        if (index + 1 !== this._breadList.length) {
          html.push('<li class="js-pf-search-bread" data-type="bread"')
        } else {
          html.push('<li class="active"')
        }

        _.each(breadInfo.data, (value, key) => {
          html.push(` data-${_(key).toDataStyle()}="${value}"`)
        })

        html.push('>')

        if (index + 1 !== this._breadList.length) {
          html.push(`<a href="javascript:void(0)" class="btn-link btn-link-cool">${breadInfo.label}</a> `)

          html.push('<span class="divider">&gt;</span>')
        } else {
          html.push(breadInfo.label)
        }

        html.push('</li>')
      }, this)

      this.$breadcrumb.html(html.join('')).removeClass('hidden')
    }
  },

  hasSub() {
    return !!this._breadList.length
  },

  isSub() {
    return !!this._breadList.length
  },

  getCurtSub() {
    return _(this._breadList).last() || {}
  },

  // events handler

  searchHandler() {
    this.filterHelper.serializeObject({
      reset: true,
    })

    this._breadList = []

    this.renderBread()

    this.grid.sortReset()

    this._getGridXhr({
      url: this.options.ajaxOps.url,
    })

    return false
  },

  subBreadHandler(e) {
    const $target = $(e.currentTarget)
    const filters = this.filterHelper.get()
    const url = $target.data('url') || this.options.subOps.url

    const type = $target.data('type')

    const name = $target.data('label')

    this.options.subBreadCallBack(e)

    // 删除并添加隐藏input
    const req = {}

    if (type === 'bread') {
      this._breadList.splice($target.index() - 1)
    }

    this.$searchForm.find('.js-pf-hidden-bread').remove()

    _(this.options.subOps.data || []).each((prop) => {
      const val = $target.data(prop)
      if (!_(val).isUndefined()) {
        req[prop] = val
      } else {
        req[prop] = null
      }
    })

    if (!_(req).isEmpty()) {
      if (type !== 'bread') {
        this._breadList.push({
          label: name,
          data: req,
        })
      }
    }

    if (filters.noCleanDate) {
      this.$searchForm.find('.js-rm-userName').val('')
    } else {
      this.$searchForm.find('[type=reset]').click()
    }

    this.filterHelper.serializeObject({
      reset: true,
    })

    this.renderBread()

    this.filterHelper.set(req, {
      cleanPage: true,
    })

    this.grid.sortReset()

    this._getGridXhr({
      url,
    })
  },
})

module.exports = SearchGrid
