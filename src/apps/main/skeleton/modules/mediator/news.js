

const NewsModel = require('skeleton/models/news')

const NewsMediatorModule = Base.Module.extend({

  startWithParent: false,

  interval: 30000,

  initialize() {
    _.bindAll(this, 'fetchNews')
    this.model = Global.data.set('newsModel', new NewsModel())
  },

  onStart() {
    const self = this

    Global.polling.start('news:request', () => {
      self.fetchNews()
        .always(() => {
          Global.polling.next('news:request', {
            interval: self.interval,
          })
        })
    })
  },

  fetchNews() {
    const self = this

    // const letterXhr = Global.sync.ajax({
    //   url: '/acct/usernotice/getletterlist.json',
    //   abort: false,
    // })
    const noticeXhr = Global.sync.ajax({
      url: '/info/feedback/stat.json',
      abort: false,
    })

    // return $.when(letterXhr, noticeXhr)
    return noticeXhr
      .done((res) => {
        // const letterRes = letterResData[0]
        // const noticeRes = noticeResData[0]

        if (res.root) {
          self.model.set({
            // letterList: letterRes.root.letterList,
            // unReadLetter: letterRes.root.unReadLetter,
            // noticeList: noticeRes.root.noticeList,
            newRowCount: res.root.rowCount,
            newList: res.root.dataList,
          }, {
            parse: true,
          })
          if(!_(res.root.popList).isEmpty()){
            app.$store.commit(types.TOGGLE_DESKTOP_MESSAGE,{show:true,dataInfo:res.root.popList })
          }
          Global.m.publish('news:updating', self.model)
        }
      })
  },

  updateUnReadNum(data) {
    let flag = false
    if (data) {
      if (_(data.unReadLetter).isFinite()) {
        this.model.set({
          unReadLetter: data.unReadLetter,
        })
        flag = true
      }
      if (_(data.unReadNotice).isFinite()) {
        this.model.set({
          unReadNotice: data.unReadNotice,
        })
        flag = true
      }
      if (flag) {
        Global.m.publish('news:updating', this.model)
      }
    }
  },

  onStop() {
    Global.polling.stop('news:request')
  },
})

module.exports = NewsMediatorModule
