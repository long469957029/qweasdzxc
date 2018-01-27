require('./index.scss')

$.widget('gl.pagination', {

  options: {
    namespace: 'glPagination',
    pageIndex: 0,
    pageSize: 12,
    maxPaginationNum: 6,
    onPaginationChange: _.noop,
    totalSize: 0,
    pageStyle: 'default',
  },

  _create() {
    if (this.options.totalSize !== -1) {
      this._initPagination(this.options.totalSize)
    }

    this._bindEvents()
  },

  _bindEvents() {
    const events = {
      'click div.pagination ul li': this.paginationClickHandler,
      'click div.pagination-mall ul li': this.paginationClickHandler,
      'click .js-wt-grid-btn-go-to': this.gotoPageSubmitHandler,
      'keypress .js-wt-grid-curt-page': this.gotoPageHandler,
    }

    this._on(events)
  },

  // common APIs

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

  _initPagination(totalSize, pageIndex) {
    pageIndex = pageIndex || 0
    totalSize = totalSize || 0

    const pageSize = this.options.pageSize
    const totalPage = Math.ceil(totalSize / pageSize)
    const pageIndexs = totalPage
    const html = []
    let i
    // 最小区间
    let minSphere
    // 最大区间
    let maxSphere
    let size

    // if (totalSize === 0) {
    // return;
    // }
    // maxSphere,
    minSphere = pageIndex - Math.floor(_(this.options.maxPaginationNum).div(2))
    minSphere = minSphere > 0 ? minSphere : 0

    maxSphere = pageIndex + Math.ceil(_(this.options.maxPaginationNum).div(2)) +
      (Math.floor(_(this.options.maxPaginationNum).div(2)) - pageIndex + minSphere) - 1
    maxSphere = maxSphere > (totalPage - 1) ? (totalPage - 1) : maxSphere

    if (pageIndexs <= this.options.maxPaginationNum) {
      size = pageIndexs
    } else {
      size = this.options.maxPaginationNum
    }

    html.push('<div class="clearfix">')

    if (this.options.pageStyle === 'default') {
      if (totalSize > 0) {
        html.push('<div class="text-center foot-nav">')

        html.push(`<div class="inline-block m-right-xs">共<span class="total-size">${totalSize}</span>条记录</span></div>`)

        html.push('<div class="pagination inline-block">')
        html.push('<ul>')

        if (pageIndex > 0) {
          html.push('<li class="pagination-pre" data-pageIndex="prev"><span>&lt;</span></li>')
        } else {
          html.push('<li class="pagination-pre disabled" data-pageIndex="prev"><span>&lt;</span></li>')
          // html.push('<li class="pagination-pre disabled" data-pageIndex="prev"><span>&lt;上一页</span></li>')
        }
        // if (maxSphere <= maxSphere) {
        //   for (i = minSphere; i <= maxSphere; ++i) {
        //     html.push(`<li data-pageIndex="${i}"`)
        //     if (i === pageIndex) {
        //       html.push(' class="active" ')
        //     }
        //     html.push(`><span>${i + 1}</span></li>`)
        //   }
        // } else {
        //   const preHtml = []
        //   const lastHtml = []
        //   if (pageIndex < 1) {
        //     lastHtml.push(`<li data-pageIndex="${maxSphere}" ><span>${maxSphere + 1}</span></li>`)
        //     for (i = minSphere; i <= 1; ++i) {
        //       if (i === pageIndex) {
        //         preHtml.push(`<li data-pageIndex="${i}" class="active"><span>${i + 1}</span></li>`)
        //       } else {
        //         preHtml.push(`<li data-pageIndex="${i}" ><span>${i + 1}</span></li>`)
        //       }
        //     }
        //     html.push(preHtml.join(''))
        //     html.push('<li class="foot-nav-null">···</li>')
        //     html.push(lastHtml)
        //   } else if (pageIndex >= maxSphere - 1) {
        //     preHtml.push('<li data-pageIndex="0"><span>1</span></li>')
        //     for (i = maxSphere - 1; i <= maxSphere; ++i) {
        //       if (i === pageIndex) {
        //         lastHtml.push(`<li data-pageIndex="${i}" class="active"><span>${i + 1}</span></li>`)
        //       } else {
        //         lastHtml.push(`<li data-pageIndex="${i}" ><span>${i + 1}</span></li>`)
        //       }
        //     }
        //     html.push(preHtml)
        //     html.push('<li class="foot-nav-null">···</li>')
        //     html.push(lastHtml.join(''))
        //   } else {
        //     lastHtml.push(`<li data-pageIndex="${maxSphere}" ><span>${maxSphere + 1}</span></li>`)
        //     for (i = pageIndex - 1; i <= pageIndex; ++i) {
        //       if (i === pageIndex) {
        //         preHtml.push(`<li data-pageIndex="${i}" class="active"><span>${i + 1}</span></li>`)
        //       } else {
        //         preHtml.push(`<li data-pageIndex="${i}" ><span>${i + 1}</span></li>`)
        //       }
        //     }
        //     html.push(preHtml.join(''))
        //     html.push('<li class="foot-nav-null">···</li>')
        //     html.push(lastHtml)
        //   }
        // }
        this.options.pageIndex = pageIndex;
        //页号
        for (i = minSphere; i <= maxSphere; ++i) {
          html.push('<li data-pageIndex="' + i + '"');
          if (i === pageIndex) {
            html.push(' class="active" ');
          }
          html.push('><span>' + (i + 1) + '</span></li>');
        }
        if(totalPage - 2 > maxSphere){
          html.push('&hellip;<li data-pageIndex="' + (totalPage-1) + '"><span>' + (totalPage) + '</span></li>');
        }

        if (pageIndex < totalPage - 1) {
          html.push(`<li class="pagination-next" data-pageIndex="next" data-maxPageIndex="${pageIndexs}"><span>&gt;</span></li>`)
        } else {
          html.push(`<li class="pagination-next disabled" data-pageIndex="next" data-maxPageIndex="${pageIndexs}"><span>&gt;</span></li>`)
        }

        html.push('</ul>')

        html.push('<span>跳转至 </span>')
        html.push(`<input type="text" value="${pageIndex + 1}" data-cur-page="${pageIndex}" class="js-wt-grid-curt-page pagination-curt-page" />`)
        html.push('</span>')
        // html.push(`</span><span> / <span class="total-page">${totalPage}</span> `)
        html.push('<button class="js-wt-grid-btn-go-to pagination-go-to btn">GO</button>')

        html.push('</div>')
        html.push('</div>')
      }
    } else if (this.options.pageStyle === 'mall') {
      html.push('<div class="text-center">')

      html.push('<div class="pagination-mall inline-block">')
      html.push('<ul>')

      if (pageIndex > 0) {
        html.push('<li class="pagination-pre" data-pageIndex="prev"><span>上一页</span></li>')
      } else {
        html.push('<li class="pagination-pre disabled" data-pageIndex="prev"><span>上一页</span></li>')
      }

      for (i = minSphere; i <= maxSphere; ++i) {
        html.push(`<li data-pageIndex="${i}"`)
        if (i === pageIndex) {
          html.push(' class="active" ')
        }
        html.push(`><span>${i + 1}</span></li>`)
      }
      if (totalPage - 2 > maxSphere) {
        html.push(`&nbsp;&nbsp;&nbsp;&nbsp;&hellip;<li data-pageIndex="${totalPage - 2}"><span>${totalPage - 1}</span></li><li data-pageIndex="${totalPage - 1}"><span>${totalPage}</span></li>`)
      }

      if (pageIndex < totalPage - 1) {
        html.push(`<li class="pagination-next" data-pageIndex="next" data-maxPageIndex="${pageIndexs}"><span>下一页</span></li>`)
      } else {
        html.push(`<li class="pagination-next disabled" data-pageIndex="next" data-maxPageIndex="${pageIndexs}"><span>下一页</span></li>`)
      }

      html.push('</ul>')

      html.push('</div>')
      html.push('</div>')
    }

    this.element.html(html.join('')).removeClass('hidden')
  },

  // event handlers

  paginationClickHandler(e) {
    const $paginationItem = $(e.currentTarget)
    const pageIndex = $paginationItem.attr('data-pageIndex')

    if ($paginationItem.hasClass('disabled')) {
      return
    }

    if (pageIndex === 'prev') {
      // --this.options.pageIndex
      this.options.pageIndex = this.options.pageIndex - 1
    } else if (pageIndex === 'next') {
      // ++this.options.pageIndex
      this.options.pageIndex = this.options.pageIndex + 1
    } else {
      this.options.pageIndex = pageIndex
    }

    this.options.onPaginationChange(this.options.pageIndex)

    return false
  },

  gotoPageSubmitHandler() {
    if (this.options.totalSize) {
      const $gotoInput = this.element.find('.js-wt-grid-curt-page')

      const gotoPageIndex = Number($gotoInput.val())

      this._gotoPage(gotoPageIndex)
    }

    return false
  },

  gotoPageHandler(e) {
    if (e.keyCode === 13) {
      if (this.options.totalSize) {
        const gotoPageIndex = Number(e.target.value)
        this._gotoPage(gotoPageIndex)
      }

      return false
    }
  },

  _gotoPage(gotoPageIndex) {
    // 如果输入 非法字符，负值或大于最大值的数值 还原之前的值 并阻止刷新
    if (!gotoPageIndex || gotoPageIndex < 0) {
      gotoPageIndex = 1
    } else if (gotoPageIndex > Math.ceil(this.options.totalSize / this.options.pageSize)) {
      gotoPageIndex = Math.ceil(this.options.totalSize / this.options.pageSize)
    }

    this.options.onPaginationChange(gotoPageIndex - 1)
  },
})

module.exports = $.gl.pagination
