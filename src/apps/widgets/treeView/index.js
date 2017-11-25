$.widget('gl.treeView', {

  template: '' +
    '<div class="tree-view font-16 clearfix"></div>',

  options: {
    namespace: 'treeView',
    onClick: _.noop,
    onDblclick: _.noop,
    onCollapsed: _.noop,
  },

  _addEventHandler() {
    this._on({
      'dblclick li .js-wt-title': 'dblNodeCheckHandler',
      'click li .js-wt-title': 'nodeCheckHandler',
      'click li .js-wt-collapse': 'collapseHandler',
      'click li .custom-checkbox': 'checkboxHandler',
    })
  },

  _create() {
    const data = this.options.data

    const wrapper = _.template(this.template)()

    const markup = this._getTreeViewHtml(data)

    const $wrapper = $(wrapper)

    $wrapper.html(markup)

    this.element.html($wrapper)

    this._addEventHandler()
  },

  expand(target) {
    const $target = $(target).is('a') ? $(target).parent('li') : $(target)
    $target.addClass('open').find('ul').css('display', 'block')
  },

  insertNode(data, target, position) {
    let $target
    if (_.isNumber(target)) {
      $target = this.element.find('.tree-view li').eq(target)
    } else if (_.isObject(target)) {
      $target = $(target).closest('li').find('.subtree')
    } else {
      $target = this.element.find('.tree-view ul')
    }

    position = position || 'html' // ['before' | 'after' | 'prepend' | 'append']

    if (!$target[position]) {
      return false
    }

    if (position === 'subbegin' || position === 'subend') {
      const $subUl = $(target).find('ul.subtree')
      if (!$subUl.length) {
        $target = this._createEmptyParentNode($target)
      }

      $target = $target.find('ul.subtree')
    }

    const nodeHtml = this._getTreeViewNodeHtml(data)

    if (nodeHtml) {
      if ($target.length) {
        $target[position](nodeHtml)
      } else {
        this.element.find('.tree-view ul').prepend(nodeHtml)
      }

      this._updateLastItemClass($target)
    }

    return this
  },

  _updateLastItemClass(target) {
    const $ul = target.closest('ul')

    if ($ul.length) {
      $ul.find('li.last-link').removeClass('last-link').end().find('li:last-child')
        .addClass('last-link')
    }
  },

  _createEmptyParentNode(target) {
    target.addClass('openable')
      .append('<ul class="subtree"></ul>')
      .find('a')
      .prepend('<i class="js-wt-collapse fa fa-plus-square-o"></i> ')

    return target
  },


  _getTreeViewLiOpenTag(hasSubTree, isLast, text, value, data) {
    const openable = (hasSubTree ? 'openable ' : '')

    const type = (hasSubTree ? 'group' : 'item')

    const isLastLink = (isLast ? 'last-link ' : '')

    const icon = (hasSubTree ? '<i class="js-wt-collapse fa fa-plus-square-o"></i> ' : '')

    let checkboxHtml = ''

    data = data || {}
    _.extend(data, {
      text,
    })

    if (this.options.checkable) {
      const id = _.uniqueId('treeview')
      checkboxHtml = `${'<div class="custom-checkbox">' +
        '<input type="checkbox" id="'}${id}" class="${type}" value="${value}">` +
        `<label for="${id}"></label>` +
        '</div>'
    }

    const liOpenTagHtml = `<li class="${openable}${isLastLink}">` +
      `<a href="javascript:void 0;" data-data='${JSON.stringify(data) || '{}'}' data-no="${value}">${ 
        checkboxHtml}${icon}<span class="js-wt-title">${text}</span>` +
      '</a>'

    return liOpenTagHtml
  },

  _getTreeViewNodeHtml(list) {
    if (!_.isArray(list)) {
      return ''
    }

    const it = this

    function _doRecursion(list) {
      let html = ''

      _.each(list, (item, index) => {
        const hasSubTree = !!item.subItem

        const isLast = (1 + index === list.length)

        html += it._getTreeViewLiOpenTag(hasSubTree, isLast, item.text, item.value, item.data)

        if (hasSubTree) {
          html += '<ul class="subtree">'

          html += _doRecursion(item.subItem)

          html += '</ul>'
        }

        html += '</li>'
      })

      return html
    }

    return _doRecursion(list)
  },

  _getTreeViewHtml(data) {
    let html = '<ul>'

    html += this._getTreeViewNodeHtml(data)

    return html += '</ul>' // close root ul
  },

  // event handlers

  nodeCheckHandler(e) {
    const $target = $(e.currentTarget)

    const $a = $target.parent('a')

    this.options.onClick.call(this, e, $a.data('no'), $a.data('data'))

    // return false;
  },

  dblNodeCheckHandler(e) {
    const $target = $(e.currentTarget)

    const $a = $target.parent('a')

    this.options.onDblclick.call(this, e, $a.data('no'), $a.data('data'))

    // return false;
  },

  collapseHandler(e) {
    const $target = $(e.currentTarget)
    const $a = $target.parent('a')

    const $parent = $target.closest('.openable')

    if (!$parent.hasClass('open')) {
      $parent.children('a').find('.js-wt-collapse').removeClass('fa-plus-square-o').addClass('fa-minus-square-o')
      this.options.onCollapsed.call(this, e, $a.data('no'), $a.data('data'), $a.data('collapsed'))
    } else {
      $parent.children('a').find('.js-wt-collapse').removeClass('fa-minus-square-o').addClass('fa-plus-square-o')
      $a.data('collapsed', true)
    }

    $parent.toggleClass('open')
    $parent.children('.subtree').slideToggle(200)

    e.stopPropagation()
  },

  checkboxHandler(e) {
    e.stopPropagation()
  },
})

module.exports = $.gl.treeView
