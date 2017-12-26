
const SystemMessageView = Base.ItemView.extend({

  template: require('userCenter/templates/systemMessage.html'),

  className: '',

  startOnLoading: true,

  events: {
    'click .js-message-btn': 'messageBtnHandler',
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
          self.initPage(res.root.rowCount)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '获取系统消息失败！' : res.msg)
      })
  },
  formateNoticeList(data) {
    if (data) {
      const list = _(data).map((item) => {
        return `<div class="system-message-list clearfix">
                  <div class="pull-left m-top-md m-left-md">
                    <div class="message-title ${item.new ? 'new' : ''} ${!item.isRead ? 'unRead' : ''} unRead font-sm">${item.title}</div>
                    <div class="message-sub-title text-auxiliary">积分商城每日好券限量放送，每天不同时间段您到可以在商城中兑换到不同的优惠券惊喜</div>
                  </div>
                  <div class="pull-right m-right-md p-top-md">
                    <div class="message-date text-auxiliary font-sm inline-block m-right-md vertical-middle">[${_(item.time).toTime()}]</div>
                    <a class="message-btn vertical-middle js-message-btn" data-noticeId="${item.noticeId}" data-read="${item.isRead ? '1' : '0'}" data-detail="0"></a>
                  </div>
                  <div class="message-info clearfix js-message-info js-message-info-${item.noticeId}"></div>
                </div>`
      })
      this.$systemMessageMain.html(list.join(''))
    }
  },
  initPage(count) {
    if (count) {
      this.$page.pagination({
        pageSize: 10,
        onPaginationChange: this.changePage,
        totalSize: count,
      })
    }
  },
  changePage(num) {
    this.getNoticeList({ pageIndex: num })
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
    const id = $target.data('noticeId')
    const isRead = $target.data('read')
    const hasGetDetail = $target.data('detail')
    $target.toggleClass('active')
    this.$('.js-message-info').addClass('hidden')
    if ($target.hasClass('active')) {
      if (hasGetDetail) {
        this.$(`.js-message-info-${id}`).removeClass('hidden')
      } else {
        // 获取详情  设置已读
        this.getNewDetailXhr({ noticeId: id })
          .done((res) => {
            if (res.result === 0) {
              self.$(`.js-message-info-${id}`).html(res.root.context)
              $target.attr('detail', 1)
              if (!isRead) {
                if (self._setRead(id)) {
                  $target.attr('read', 1)
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
