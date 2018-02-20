const FeedBackView = Base.ItemView.extend({

  template: require('userCenter/templates/feedBack.html'),

  className: '',

  startOnLoading: true,

  events: {
    'click .js-feed-form-btn': 'checkFormHandler',
    'click .js-open-more': 'openMoreHandler',
  },
  // setFeedBackEntry() {
  //   return Global.sync.ajax({
  //     url: 'info/feedback/entryList.json',
  //   })
  // },
  getFeedXhr(data) {
    _(data).extend({
      pageSize: 10,
    })
    return Global.sync.ajax({
      url: '/info/feedback/list.json',
      data,
    })
  },
  saveFeedXhr(data) {
    return Global.sync.ajax({
      url: '/info/feedback/create.json',
      data,
    })
  },

  onRender() {
    this.$feedType = this.$('.js-feed-type')
    this.$feedTitle = this.$('.js-feed-form-title')
    this.$feedContainer = this.$('.js-feed-form-container')
    this.$feedError = this.$('.js-feed-from-error')
    this.$feedPage = this.$('.js-feed-page')
    this.$feedList = this.$('.js-list-info')
    // this.setFeedBackEntry()
    this.getFeedList({ pageIndex: 0 })
  },

  getFeedList(data) {
    const self = this
    this.getFeedXhr(data)
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res.result === 0) {
          self.formartFeedList(res.root)
          if (_.isUndefined(self.pagination)) {
            self.initPage(res.root.rowCount)
          } else {
            self.pagination.update(res.root.rowCount, data.pageIndex)
          }
        } else {
          Global.ui.notification.show(res.msg === 'fail' ? '获取反馈信息列表失败！' : res.msg)
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '获取反馈信息列表失败！' : res.msg)
      })
  },

  checkFormHandler() {
    if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
      Global.ui.notification.show('试玩会员无法进行建议反馈操作，请先注册正式游戏账号')
      return false
    }
    const self = this
    const adviceType = this.$feedType.val()
    const subject = this.$feedTitle.val().trim()
    const content = this.$feedContainer.val().trim()
    if (adviceType === '') {
      this.setError('请选择意见类型')
      return false
    }
    if (subject === '') {
      this.setError('请输入内容标题')
      this.$feedTitle.focus()
      return false
    } else if (subject.length < 10) {
      this.setError('您输入的标题内容太少啦~标题字数在10-50之间呦~')
      return false
    } else if (subject.length > 50) {
      this.setError('您输入的标题内容太少啦~标题字数在10-50之间呦~')
      return false
    } else if (!this.antiSqlValid(subject)) {
      this.setError('您输入的标题中含有非法字符，请重新输入')
      this.$feedTitle.val('')
      this.$feedTitle.focus()
      return false
    }
    if (content === '') {
      this.setError('请输入建议内容')
      this.subject.focus()
      return false
    } else if (content.length < 20) {
      this.setError('您输入的建议内容太少啦~建议内容字数在20-2000之间呦~')
      return false
    } else if (content.length > 2000) {
      this.setError('您输入的建议内容太多啦~标题字数在20-2000之间呦~')
      return false
    } else if (!this.antiSqlValid(content)) {
      this.setError('您输入的建议内容中含有非法字符，请重新输入')
      this.$feedContainer.val('')
      this.$feedContainer.focus()
      return false
    }
    const data = {
      adviceType,
      subject,
      content,
    }
    this.saveFeedXhr(data)
      .done((res) => {
        if (res.result === 0) {
          Global.ui.notification.show('您的建议已提交成功！感谢您！')
          self.render()
        }
      })
      .fail((res) => {
        Global.ui.notification.show(res.msg === 'fail' ? '保存建议失败！' : res.msg)
      })
  },

  formartFeedList(data) {
    if (data) {
      let list = ''
      if (data.rowCount > 0) {
        list = _(data.records).map((item) => {
          return `<div class="list-info">
                    <div class="info-title clearfix">
                      <div class="title pull-left font-sm text-black p-left-md">${item.subject}</div>
                      <div class="time pull-right text-auxiliary p-right-smd">${_(item.createDate).toTime()}</div>
                    </div>
                    <div class="info-contant text-auxiliary p-left-md">${item.content}</div>
                    ${item.reply ? `<div class="info-reply ${item.new ? 'new' : ''}">
                    <div class="reply-title clearfix">
                      <div class="title-info pull-left text-black p-left-lg">平台回复</div>
                      <div class="time pull-right text-auxiliary">${_(item.lastUpdateDate).toTime()}</div>
                    </div>
                    <div class="reply-contant text-auxiliary p-left-lg">${item.reply.length > 133 ? `<div>
                         ${item.reply.substring(0, 133)}...<a class="text-hot cursor-pointer js-open-more" data-id="${item.rid}">【展开更多】</a>
                       </div><div class="js-more-info-${item.rid} hidden">${item.reply}</div>` : item.reply}</div>
                  </div>` : ''}
                  </div>`
        })
        this.$feedList.html(list)
      }
    }
  },
  initPage(count) {
    if (count) {
      const self = this
      this.$feedPage.pagination({
        pageSize: 5,
        totalSize: count,
        onPaginationChange: (num) => {
          self.getFeedList({ pageIndex: num })
        },
      })
      this.pagination = this.$feedPage.pagination('instance')
    }
  },

  setError(data) {
    const errorTpl = `<span class="text-hot"><span class="sfa sfa-error-icon vertical-sub m-right-sm"></span>${data}</span>`
    this.$feedError.html(errorTpl)
  },
  antiSqlValid(value) {
    const re = /select|update|delete|exec|count|’|"|=|;|>|<|%/i
    if (re.test(value)) {
      return false
    }
    return true
  },
  openMoreHandler(e) {
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    $target.addClass('hidden')
    this.$(`.js-more-info-${id}`).removeClass('hidden')
  },
})

export default FeedBackView
