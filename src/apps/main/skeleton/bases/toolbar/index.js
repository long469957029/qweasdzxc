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
    'click .js-toolbar-im-dialog': 'imDialogHandler', // 站内信弹窗
    'click .js-logout': 'logoutHandler', // 退出登录

  },

  initialize() {
  },

  serializeData() {
  },

  onRender() {
    const self = this
    this.subscribe('acct', 'acct:login', () => {
      $('.js-toolbar-option-operation-container').removeClass('hidden')
    })
    this.subscribe('acct', 'acct:loginOut', () => {
      $('.js-toolbar-option-operation-container').addClass('hidden')
    })
    const token = Global.cookieCache.get('token')
    if (token && token !== '' || token !== undefined) {
      self.$('.js-toolbar-option-operation-container').removeClass('hidden')
    }
    self.$sidebar = self.$('.js-toolbar-sidebar')
    self.$closeMask = self.$('.js-sidebar-close')
  },

  closeSidebarHandler() {
    const self = this
    self.$sidebar.closest('.js-toolbar-container').find('.js-toolbar-option').each((index, dom) => {
      $(dom).removeClass('active')
    })
    self.$sidebar.closest('.js-toolbar-container').removeClass('open')
    self.$closeMask.addClass('hidden')
  },

  openSidebarHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const option = $target.data('option')

    self.$sidebar.closest('.js-toolbar-container').find('.js-toolbar-option').each((index, dom) => {
      $(dom).removeClass('active')
    })
    $target.addClass('active')
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
      // case 4: // 站内消息
      //         // self.$sidebar.html(new MessageView({}).render().el)
      //   break
      // case 5: // 意见反馈
      //         // self.$sidebar.html(new FeedbackView({}).render().el)
      //   break

      default:
        break
    }
  },
  imDialogHandler() {
    const $imDialog = Global.ui.dialog.show({
      size: 'im-dialog-panel',
      // bStyle: 'width: 832;height:600;border:0;"',
      bodyClass: 'js-sideBar-im im-panel',
      body: '<div class="im-dialog-container"></div>',
    })
    const $dialogContainer = $imDialog.find('.im-dialog-container')
    const messageView = new MessageView()
    $dialogContainer.html(messageView.render().el)

    $imDialog.on('hidden.modal', function () {
      $(this).remove()
      messageView.destroy()
    })
  },
  feedbackDialogHandler() {
    const $feedbackDialog = Global.ui.dialog.show({
      title: '',
      size: 'feedback-panel',
      bStyle: 'width: 540px;height:470;border:0;"',
      bodyClass: 'js-sideBar-feedback feedback-panel',
      body: '<div class="feedback-dialog-container"></div>',
    })
    const $dialogContainer = $feedbackDialog.find('.feedback-dialog-container')

    $dialogContainer.html(new FeedbackView().render().el)

    $feedbackDialog.on('hidden.modal', function () {
      $(this).remove()
    })
  },

  scrollHandler() {
    $('html').animate({scrollTop: 0}, 'slow')
  },
  logoutHandler() {
    Global.ui.loader.show()
    $(document).confirm({
      content: '<div class="m-TB-lg">确定要退出登录？</div>',
      type: 'exit',
      agreeCallback() {
        Global.oauth.logout().done((data) => {
          if (data && data.result === 0) {
            Global.cookieCache.clear('token')
            Global.cookieCache.clear('loginState')
            Global.router.goTo('')
            window.app.$store.commit(types.USER_LOGOUT_SUCCESS, true)
            window.Global.m.publish('acct:loginOut')
          }
        }).always(() => {
          Global.ui.loader.hide()
        })
      },
    })
    this.closeSidebarHandler()
    return false
  },
})

export default ToolbarView
