const SystemMessageView = Base.ItemView.extend({

  template: require('userCenter/templates/systemMessage.html'),

  className: '',

  startOnLoading: true,

  events: {
    'click .js-message-btn': 'messageBtnHandler',
    'click .js-system-message-clear-all': 'allMessageToReadHandler'
  },

  setNoticeEntry() {
    return Global.sync.ajax({
      url: '/acct/usernotice/entryNoticeList.json',
    })
  },
  setAllMessageToRead() {
    return Global.sync.ajax({
      url: '/acct/usernotice/saveAllNoticeToRead.json',
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

  // getNewDetailXhr(data) {
  //   return Global.sync.ajax({
  //     url: '/acct/usernotice/getusernoticedetail.json',
  //     data,
  //   })
  // },

  onRender() {
    this.$systemMessageMain = this.$('.js-system-message-main')
    this.$page = this.$('.js-system-message-page')
    this.canClick = true
    this.setNoticeEntry()
    this.getNoticeList({pageIndex: 0})
    // console.log(this.options.noticeId)
  },

  getNoticeList(data) {
    const self = this
    this.getNoticeListXhr(data)
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res.result === 0) {
          self.unReadNotice = res.root.unReadNotice
          self.newFeedbackCount = res.root.newFeedbackCount
          self.parentRenderUnread()
          self.formateNoticeList(res.root.noticeList)
          self.$(`.js-message-btn[data-noticeid=${this.options.noticeId}]`).trigger('click')
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
  parentRenderUnread() {
    this._parentView.renderUnread({unReadNotice: this.unReadNotice, newFeedbackCount: this.newFeedbackCount})
  },

  formateNoticeList(data) {
    if (data) {
      const list = _(data).map((item) => {
        return `<div class="system-message-list js-system-message-list accordion-group">
                  <div class="message-top cursor-pointer clearfix js-message-btn" data-toggle="collapse"
               data-target="#message-info-${item.noticeId}" data-parent="#accordion1" data-noticeid="${item.noticeId}" data-read="${item.isRead}">
                    <div class="pull-left m-top-md m-left-md">
                      <div class="message-title js-message-title-${item.noticeId} ${item.new ? 'new' : ''} ${Number(item.isRead) === 0 ? 'unRead' : ''} font-sm">${item.title}
                      <div class="${Number(item.isRead) === 0 ? 'unReadIcon' : ''}"></div></div>
                      <div class="message-sub-title text-auxiliary">${item.desc}</div>
                    </div>
                    <div class="pull-right m-right-md p-top-md">
                      <div class="message-date text-auxiliary font-sm inline-block m-right-md vertical-middle">[${_(item.time).toTime()}]</div>
                      <a class="message-btn vertical-middle js-message-btn-a" ></a>
                    </div>
                  </div>                  
                  <div class="message-info clearfix js-message-info js-message-info-${item.noticeId} collapse" id="message-info-${item.noticeId}">
                    <div class="m-TB-md">${item.content}</div>
                  </div>
                </div>`
      })
      const clearAllNotice = '<div class="js-system-message-clear-all system-message-clear-all">全部标记已读</div>' + list.join('')
      this.$systemMessageMain.html(clearAllNotice)
    }
  },
  initPage(count) {
    if (count) {
      const self = this
      this.$page.pagination({
        pageSize: 10,
        totalSize: count,
        onPaginationChange: (num) => {
          self.getNoticeList({pageIndex: num})
        },
      })
      this.pagination = this.$page.pagination('instance')
    }
  },
  allMessageToReadHandler(){
    const self = this
    this.setAllMessageToRead()
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          this.getNoticeList({pageIndex: 0})
          Global.ui.notification.show('标记已读操作成功！', {
            type: 'success',
            hasFooter: false,
            closeBtn: false,
            displayTime: 800,
            size: 'modal-xs',
          })
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '标记已读操作失败！' : res.msg, {
          type: 'fail',
          hasFooter: false,
          closeBtn: false,
          displayTime: 800,
          size: 'modal-xs',
        })
      })
  },
  _setRead(idList) {
    // const self = this
    return Global.sync.ajax({
      url: '/acct/usernotice/savenoticetoread.json',
      tradition: true,
      data: {
        list: idList,
      },
    }).done(() => {
      return true
    })
  },
  messageBtnHandler(e) {
    if (this.canClick) {
      this.canClick = false
      const self = this
      const $target = $(e.currentTarget)
      const id = Number($target.data('noticeid'))
      const isRead = Number($target.data('read'))
      $target.toggleClass('active').parents('.js-system-message-list').siblings().removeClass('active')
        .find('.js-message-btn')
        .removeClass('active').find('.js-message-btn-a').removeClass('active')
      if ($target.hasClass('active')) {
        $target.parents('.js-system-message-list').addClass('active')
        $target.find('.js-message-btn-a').addClass('active')
        if (!isRead) {
          if (self._setRead(id)) {
            $target.data('read', 1)
            self.$(`.js-message-title-${id}`).removeClass('unRead')
            self.$(`.js-message-title-${id}`).children().removeClass('unReadIcon')
            self.unReadNotice -= 1
            self.parentRenderUnread()
          }
        }
      } else {
        $target.parents('.js-system-message-list').removeClass('active')
        $target.find('.js-message-btn-a').removeClass('active')
      }
      setTimeout(() => {
        this.canClick = true
      }, 500)
    }
  },
})

export default SystemMessageView
