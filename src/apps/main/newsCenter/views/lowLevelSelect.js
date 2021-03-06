define((require, exports, module) => {
  const lowLevelSelectView = Base.ItemView.extend({

    template: require('newsCenter/templates/lowLevelSelect.html'),

    events: {
      'keyup .js-mo-lowLevel-username': 'searchHandler',
      'change .js-mo-userId': 'selectChangeHandler',
      'change .js-mo-select-all': 'selectAllHandler',
      'change .js-mo-select-reverse': 'reverseHandler',
    },

    getLowLevelXhr(data) {
      return Global.sync.ajax({
        url: '/acct/usernotice/getusersub.json',
        data,
      })
    },

    onRender() {
      const self = this

      this.$selectAll = this.$('.js-mo-select-all')
      this.$reverse = this.$('.js-mo-select-reverse')

      this.$lowLevelContainer = this.$('.js-mo-lowLevel-container')

      this.$statistics = this.$('.js-mo-statistics')

      this.$statistics.statistics({
        targetEl: this.$lowLevelContainer,
        max: 0,
        type: 'dom',
        filter: '.js-mo-userId',
        countFilter: '.js-mo-userId:checked',
        triggerEvent: 'change',
        // countFilter: '.js-mo-userId:checked'
      })

      this.statistics = this.$statistics.statistics('instance')


      this.getLowLevelXhr()
        .done((res) => {
          if (res && res.result === 0) {
            self.renderList(res.root)
            self.statistics.setMax(res.root.length)
            if (self.options.selectedList && _(self.options.selectedList).size() > 0) {
              _(self.options.selectedList).each((item) => {
                self.$(`.js-mo-userId[value="${item.userId}"]`).prop('checked', true)
              })
            }
          } else {
            Global.ui.notification.show('服务器异常，无法加载列表')
          }
        })
    },

    renderList(list) {
      this.$lowLevelContainer.html(_(list).map((info, index) => {
        const uniqueId = _.uniqueId('js')
        const html = []

        html.push(`<label class="js-mo-user-label width-sm inline-block"title="${info.username}">`)
        html.push('<span class="custom-checkbox checkbox-inverse">')
        html.push(`<input type="checkbox" id="${uniqueId}" class="js-mo-userId" name="userId[${index}]" value="${info.userId}" data-name="${info.username}">`)
        html.push(`<label class="checkbox-label" for="${uniqueId}"></label>`)
        html.push('</span>')
        html.push(`${info.username}</label>`)

        // html.push('<label class="js-mo-user-label checkbox inline-block width-sm ellipsis overflow-hidden" title="' +
        //  info.username + '">');
        // html.push('<input class="js-mo-userId" type="checkbox" data-name="' + info.username + '" ' +
        //  ' value="' + info.userId + '">' + info.username + '</label>');

        return html.join('')
      }).join(''))
    },

    // common

    getSelected() {
      const checkedList = []

      this.$lowLevelContainer.find('.js-mo-userId:checked').each((index, checkbox) => {
        checkedList.push({
          username: $(checkbox).data('name'),
          userId: Number(checkbox.value),
        })
      })

      return checkedList
    },

    // event handlers

    searchHandler(e) {
      const $target = $(e.currentTarget)
      const keyword = $target.val()

      this.$lowLevelContainer.find('.js-mo-user-label').each((index, label) => {
        const $label = $(label)
        const text = $label.attr('title')

        if (!keyword || (text && text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)) {
          $label.removeClass('hidden')
        } else {
          $label.addClass('hidden')
        }
      })

      this.$lowLevelContainer.find('.js-mo-userId:hidden').prop('checked', false)

      this.statistics.reCount()
    },

    selectChangeHandler(e) {
      this.$selectAll.prop('checked', false)
      this.$reverse.prop('checked', false)
    },

    selectAllHandler(e) {
      const val = this.$selectAll.prop('checked')

      const $checkboxes = this.$lowLevelContainer.find('.js-mo-userId')
      $checkboxes.filter(':visible').prop('checked', val)

      this.$reverse.prop('checked', false)

      this.statistics.reCount()
    },

    reverseHandler(e) {
      const $checkboxes = this.$lowLevelContainer.find('.js-mo-userId')

      $checkboxes.filter(':visible').each((index, checkbox) => {
        const $checkbox = $(checkbox)
        $checkbox.prop('checked', !$checkbox.prop('checked'))
      })

      this.$selectAll.prop('checked', false)

      this.statistics.reCount()
    },
  })

  module.exports = lowLevelSelectView
})
