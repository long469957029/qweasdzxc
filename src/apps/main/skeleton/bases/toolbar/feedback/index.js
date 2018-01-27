import './index.scss'

const FeedbackView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-feedback-submit': 'submitFeedbackHandle',
  },
  submitFeedbackXhr (data) {
    return Global.sync.ajax({
      url: '/info/feedback/create.json',
      data,
    })
  },
  initialize() {
  },

  serializeData() {
  },

  onRender() {
    this.parsley = this.$('.js-sideBar-feedback-form').parsley({
      errorsWrapper: '<div class="tooltip parsley-errors-list"><span class="sfa sfa-error-icon vertical-sub pull-left"></div>',
      errorTemplate: '<div class="tooltip-inner">',
      trigger: 'change',
    })
  },
  submitFeedbackHandle() {
    const self = this
    if (!this.parsley.validate()) {
      return false
    }
    // const type = this.$('.js-feedback-type').find('option:selected').val()
    // const title = this.$('.js-feedback-title').val()
    // const feedContent = this.$('.js-feedback-content').val()
    //
    // const data = {
    //   adviceType: type,
    //   subject: title,
    //   content: feedContent,
    // }
    // self.submitFeedbackXhr(data)
    //   .done((res) => {
    //     if (res.result === 0) {
    //       Global.ui.notification.show('提交成功！')
    //       self.trigger('hidden.modal')
    //     } else {
    //       Global.ui.notification.show('提交失败！')
    //     }
    //   })
  },
})

module.exports = FeedbackView
