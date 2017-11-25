

const NewsBarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
  },

  initialize() {
  },

  serializeData() {
    const model = Global.data.get('newsModel')

    const data = model.toJSON()

    _(data.noticeList).each((notice) => {
      switch (notice.type) {
        case 0:
          break
        case 2:
          notice.title += '<a href="#as/ll" class="router">登录日志</a>'
          break
        default:
          notice.title = `<a href="#nc/pn/detail/${notice.noticeId}" class="router">${notice.title}</a>`
          break
      }
    })

    return data
  },

  onRender() {
    const self = this
    // this.subscribe('acct', 'acctUpdating', function() {
    //  self.renderAcctInfo();
    // });
  },

  hidden() {
    this.setRead()
  },

  setRead() {
    const model = Global.data.get('newsModel')
    model.setReadNoticeXhr()
  },

})

module.exports = NewsBarView
