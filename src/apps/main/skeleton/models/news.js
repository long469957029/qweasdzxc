

const Model = require('skeleton/model')

const NewsModel = Model.extend({

  defaults: {
    letterList: [],
    letterRowCount: 0,
    unReadLetter: 0,

    noticeList: [],
    noticeRowCount: 0,
    unReadNotice: 0,
  },

  setReadNoticeXhr(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('noticeList')).pluck('noticeId')
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/savenoticetoread.json',
        tradition: true,
        data: {
          list: idList,
        },
      })
        .always(() => {
          Global.m.news.fetchNews()
        })
    }
  },

  deleteNoticeXhr(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('noticeList')).pluck('noticeId')
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/delnoticelist.json',
        tradition: true,
        data: {
          list: idList,
        },
      })
        .always(() => {
          Global.m.news.fetchNews()
        })
    }
  },

  setReadLetterXhr(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('letterList')).pluck('letterId')
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/savelettertoread.json',
        tradition: true,
        data: {
          list: idList,
        },
      })
        .always(() => {
          Global.m.news.fetchNews()
        })
    }
  },

  deleteLetterXhr(idList) {
    if (_.isUndefined(idList)) {
      idList = _(this.get('letterList')).pluck('letterId')
    }

    if (!_.isEmpty(idList)) {
      return Global.sync.ajax({
        url: '/acct/usernotice/deletter.json',
        tradition: true,
        data: {
          list: idList,
        },
      })
        .always(() => {
          Global.m.news.fetchNews()
        })
    }
  },

  getUnreadCount() {
    return this.get('unReadLetter') + this.get('unReadNotice')
  },
})

module.exports = NewsModel
