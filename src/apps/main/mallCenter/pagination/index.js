

require('./index.scss')

const PaginationView = Base.ItemView.extend({

  template: require('./index.html'),

  liTpl: _(require('./li.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-mall-pagination': 'paginationClickHandler',
  },

  /* 分页参数范例
   * options: {
   *   pageIndex: 0, // 页码
   *   pageSize: 12, // 每页数量
   *   totalSize: 100, // 总数量
   *   onPaginationChange: _.noop, // 变更页码触发的函式
   *   maxPaginationNum: 5, // 前半段 pagination 按钮数量
   *   restPaginationNum: 2, // 后半段 pagination 按钮数量
   * },
  */
  serializeData () {
    // var options = null;
    // return options;
  },

  onRender () {
    const self = this
    this.loadingFinish()

    if (this.options.totalSize !== -1) {
      this._initPagination(this.options.totalSize)
    }
  },

  _initPagination (totalSize, pageIndex) {
    const self = this
    pageIndex = pageIndex || 0
    totalSize = totalSize || 0

    const pageSize = this.options.pageSize
    const totalPage = Math.ceil(totalSize / pageSize)
    const pageIndexs = totalPage
    let html
    let index
    let minSphere // 最小区间
    let maxSphere // 最大区间

    minSphere = pageIndex - Math.floor(_(this.options.maxPaginationNum).div(2))
    minSphere = minSphere > 0 ? minSphere : 0
    maxSphere = pageIndex + Math.ceil(_(this.options.maxPaginationNum).div(2) +
      (Math.floor(_(this.options.maxPaginationNum).div(2)) - pageIndex + minSphere - 1))
    maxSphere = maxSphere > (totalPage - 1) ? (totalPage - 1) : maxSphere

    const firstHalfList = _.map(_.range(0, totalPage), (index) => {
      if (index === pageIndex) {
        return self.liTpl({ active: true, index })
      }

      return self.liTpl({ active: false, index })
    }).join('')

    // var secondHalfList = _.map(_.range(totalPage - 2, totalPage), function (index) {
    //   if (index === pageIndex) {
    //     return self.liTpl({active: true, index: index});
    //   }

    //   return self.liTpl({active: false, index: index});
    // }).join('');

    const disablePrev = (pageIndex === 0)
    const disableNext = (pageIndex >= totalPage - 1)

    html = `${'<ul>' +
      '<li class="js-mall-pagination '}${disablePrev ? 'disabled' : ''}" data-page-index="prev">上一页</li>${ 
      firstHalfList 
      // (totalPage > 5 ? '<span class="abridged">...</span>' + secondHalfList : '') +
    }<li class="js-mall-pagination ${disableNext ? 'disabled' : ''}" data-page-index="next">下一页</li>`
    '</ul>'

    this.$('.js-pagination-group').html(html)
  },

  paginationClickHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const pageIndex = $target.data('page-index')

    if ($target.hasClass('disabled')) {
      return 
    }

    if (pageIndex === 'prev') {
      this.options.pageIndex = $('.js-mall-pagination.active').data('page-index') - 1
    } else if (pageIndex === 'next') {
      this.options.pageIndex = $('.js-mall-pagination.active').data('page-index') + 1
    } else {
      this.options.pageIndex = pageIndex
    }

    this.options.onPaginationChange(this.options.pageIndex)

    return false
  },

  update(totalSize, pageIndex, options) {
    options = options || {}

    if (!_.isUndefined(totalSize)) {
      this.options.totalSize = totalSize
      options.initPagination = true
    }

    if (options.initPagination || pageIndex) {
      this._initPagination(this.options.totalSize, Number(pageIndex))
    }
  },

  clean() {
    this.element.addClass('hidden')

    return this
  },
})

module.exports = PaginationView
