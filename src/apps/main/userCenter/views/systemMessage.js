
const SystemMessageView = Base.ItemView.extend({

  template: require('userCenter/templates/systemMessage.html'),

  className: '',

  startOnLoading: true,

  events: {
    'click .js-message-btn': 'messageBtnHandler',
  },

  setNoticeEntry() {
    return Global.sync.ajax({
      url: '/acct/usernotice/entryNoticeList.json',
    })
  },

  getNoticeListXhr(data) {
    _(data).extend({
      version: 1,
      pageSize: 10,
    })
    return Global.sync.ajax({
      url: '/acct/usernotice/getnoticelist.json',
      data,
    })
  },

  getNewDetailXhr(data) {
    return Global.sync.ajax({
      url: '/acct/usernotice/getusernoticedetail.json',
      data,
    })
  },

  onRender() {
    this.$systemMessageMain = this.$('.js-system-message-main')
    this.$page = this.$('.js-system-message-page')
    this.setNoticeEntry()
    this.getNoticeList({ pageIndex: 0 })
  },

  getNoticeList(data) {
    const self = this
    this.getNoticeListXhr(data)
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res.result === 0) {
          self.formateNoticeList(res.root.noticeList)
          if (_.isUndefined(self.pagination)) {
            self.initPage(res.root.rowCount)
          } else {
            self.pagination.update(res.root.rowCount, data.pageIndex)
          }
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '获取系统消息失败！' : res.msg)
      })
  },

  formateNoticeList(data) {
    if (data) {
      const list = _(data).map((item) => {
        return `<div class="system-message-list js-system-message-list clearfix">
                  <div class="pull-left m-top-md m-left-md">
                    <div class="message-title ${item.new ? 'new' : ''} ${Number(item.isRead) === 0 ? 'unRead' : ''} font-sm">${item.title}</div>
                    <div class="message-sub-title text-auxiliary">${item.desc}</div>
                  </div>
                  <div class="pull-right m-right-md p-top-md">
                    <div class="message-date text-auxiliary font-sm inline-block m-right-md vertical-middle">[${_(item.time).toTime()}]</div>
                    <a class="message-btn vertical-middle js-message-btn" data-noticeid="${item.noticeId}" data-read="${item.isRead}" data-detail="0"></a>
                  </div>
                  <div class="message-info message-info-open clearfix js-message-info hidden js-message-info-${item.noticeId}"></div>
                </div>`
      })
      this.$systemMessageMain.html(list.join(''))
    }
  },
  initPage(count) {
    if (count) {
      const self = this
      this.$page.pagination({
        pageSize: 10,
        totalSize: count,
        onPaginationChange: (num) => {
          self.getNoticeList({ pageIndex: num })
        },
      })
      this.pagination = this.$page.pagination('instance')
    }
  },

  _setRead(idList) {
    // const self = this
    const model = Global.data.get('newsModel')
    const xhr = model.setReadNoticeXhr(idList)

    if (xhr) {
      xhr.done(() => {
        return true
      })
    }
  },
  messageBtnHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const id = Number($target.attr('data-noticeid'))
    const isRead = Number($target.attr('data-read'))
    const hasGetDetail = Number($target.attr('data-detail'))
    this.$('.js-message-info').addClass('hidden')
    $target.toggleClass('active').parents('.js-system-message-list').siblings().removeClass('active')
      .find('.js-message-btn')
      .removeClass('active')
    if ($target.hasClass('active')) {
      if (hasGetDetail === 1) {
        this.$(`.js-message-info-${id}`).removeClass('hidden').parents('.js-system-message-list').addClass('active')
      } else {
        // 获取详情  设置已读
        this.getNewDetailXhr({ noticeId: id })
          .done((res) => {
            if (res.result === 0) {
              self.$(`.js-message-info-${id}`).html(res.root.context).removeClass('hidden').parents('.js-system-message-list')
                .addClass('active')
              $target.attr('data-detail', 1)
              if (!isRead) {
                if (self._setRead(id)) {
                  $target.attr('data-read', 1)
                }
              }
            } else {
              Global.ui.notification.show(res.msg === 'fail' ? '获取系统通知详情失败' : res.msg)
            }
          })
          .fail((res) => {
            Global.ui.notification.show(res.msg === 'fail' ? '获取系统通知详情失败' : res.msg)
          })
      }
    } else {
      this.$(`.js-message-info-${id}`).addClass('hidden')
    }
  },
})

module.exports = SystemMessageView
