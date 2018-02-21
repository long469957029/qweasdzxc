const NoticeBoardView = Base.ItemView.extend({

  template: '<div class="js-nc-board nc-board"></div><div class="nc-board-bottom"></div>',

  startOnLoading: true,

  itemTpl: _(require('dynamicCenter/templates/noticeBoard-item.html')).template(),

  className: 'nc-noticeBoard',

  events: {},

  getXhr(data) {
    return Global.sync.ajax({
      url: '/info/activitylist/getbulletinlist.json',
      data,
    })
  },

  onRender () {
    this.$grid = this.$('.js-nc-board')

    this.renderNoticeGrid(0)
  },

  renderNoticeGrid(pageIndex) {
    const self = this

    this.getXhr({
      pageSize: 20,
      pageIndex,
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        const data = res.root || {}
        if (res && res.result === 0) {
          self.renderGrid(data.buList)
        } else {
          Global.ui.notification.show('加载失败，请稍后再试')
        }
      })
  },

  renderGrid(rowList) {
    if (_.isEmpty(rowList)) {
      this.$grid.html(this.getEmptyHtml('暂时没有动态'))
    } else {
      this.$grid.html(_(rowList).map(function(rowInfo) {
        const date = moment(rowInfo.time)

        return this.itemTpl({
          title: rowInfo.title,
          month: date.month() + 1,
          day: date.date(),
          url: _.getUrl(`/detail/${rowInfo.bulletionId}`),
          desc: rowInfo.desc,
        })
      }, this))
    }
  },

  getEmptyHtml(emptyTip) {
    const html = []
    if (emptyTip) {
      html.push('<div class="js-wt-empty-container empty-container text-center">')
      html.push('<div class="empty-container-main">')
      html.push('<div class="sfa-grid-empty"></div>')
      html.push(emptyTip)
      html.push('</div>')
      html.push('</div>')
    }

    return html.join('')
  },

})

module.exports = NoticeBoardView
