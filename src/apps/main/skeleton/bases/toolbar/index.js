import './index.scss'

import FundView from './fund' // 资金管理
import RecordView from './record' // 游戏记录
import CouponView from './coupon' // 我的优惠券
import MessageView from './message' // 站内消息
import FeedbackView from './feedback' // 意见反馈

const ToolbarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-toolbar-option': 'openSidebarHandler', // 展开侧边栏
    'click .js-sidebar-close': 'closeSidebarHandler', // 收起侧边栏
    'click .js-toolbar-scroll-to-top': 'scrollHandler', // 回滚到顶部
    'click .js-toolbar-feedback-dialog': 'feedbackDialogHandler', // 意见反馈弹窗
  },

  initialize() {
  },

  serializeData() {
  },

  onRender() {
    const self = this
    self.$sidebar = self.$('.js-toolbar-sidebar')
    self.$closeMask = self.$('.js-sidebar-close')
  },

  closeSidebarHandler() {
    const self = this

    self.$sidebar.closest('.js-toolbar-container').removeClass('open')
    self.$closeMask.addClass('hidden')
  },

  openSidebarHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const option = $target.data('option')

    self.$sidebar.closest('.js-toolbar-container').addClass('open')
    self.$closeMask.removeClass('hidden')

    self.renderSidebarViewHandler(option)
  },

  renderSidebarViewHandler(option) {
    const self = this

    switch (option) {
      case 1: // 资金管理
        self.$sidebar.html(new FundView({}).render().el)
        break
      case 2: // 游戏记录
        self.$sidebar.html(new RecordView({}).render().el)
        break
      case 3: // 我的优惠券
        self.$sidebar.html(new CouponView({}).render().el)
        break
      case 4: // 站内消息
        self.$sidebar.html(new MessageView({}).render().el)
        break
      case 5: // 意见反馈
        // self.$sidebar.html(new FeedbackView({}).render().el)
        break

      default:
        break
    }
  },
  feedbackDialogHandler() {
    const $feedbackDialog = Global.ui.dialog.show({
      anySize: '610',
      anyPosition: '210',
      body: '<div class="feedback-dialog-container"></div>',
    })
    const $dialogContainer = $feedbackDialog.find('.feedback-dialog-container')

    $dialogContainer.html(new FeedbackView().render().el)

    $feedbackDialog.on('hidden.modal', function() {
      $(this).remove()
    })
  },

  scrollHandler() {
    $('html').animate({ scrollTop: 0 }, 'slow')
  },
})

module.exports = ToolbarView
