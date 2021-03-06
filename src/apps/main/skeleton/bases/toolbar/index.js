import './index.scss'
import ActivityEntry from './activity-entry'
import FundView from './fund' // 资金管理
import RecordView from './record' // 游戏记录
import CouponView from './coupon' // 我的优惠券
// import MessageView from './message' // 站内消息
import FeedbackView from './feedback' // 意见反馈

import {
  getTicketListApi,
  getGiftPackageListApi
} from 'api/activity'
import {PointsCard} from "@/apps/build";

const ToolbarView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-toolbar-option': 'openSidebarHandler', // 展开侧边栏
    'click .js-sidebar-close': 'closeSidebarHandler', // 收起侧边栏
    'click .js-toolbar-scroll-to-top': 'scrollHandler', // 回滚到顶部
    'click .js-toolbar-feedback-dialog': 'feedbackDialogHandler', // 意见反馈弹窗
    // 'click .js-toolbar-im-dialog': 'imDialogHandler', // 站内信弹窗
    'click .js-logout': 'logoutHandler', // 退出登录
    'click .js-novice-package': 'openNovicePackageHandler',//新手礼包弹窗
    'click .js-new-im-dialog': 'imDialogHandler' //新版站内信弹窗

  },

  initialize() {
  },

  serializeData() {
  },
  getNovicePackgeXhr(data) {
    return $http({
      url: '/info/newpack/info.json',
      data,
    })
  },
  // 获取我的优惠券列表
  getMyCouponListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/myCouponList.json',
      data,
      abort: false
    })
  },
  // 获取未读消息数目接口
  getRecentChatStatXhr (data) {
    return Global.sync.ajax({
      url: '/acct/userChat/recentChatStat.json',
      data,
      abort: false
    })
  },
  onRender() {
    const self = this
    this.subscribe('acct', 'acct:login', () => {
      $('.js-toolbar-option-operation-container').removeClass('hidden')
      // const def1 = this.getNovicePackgeXhr().then(({data}) => {
      //   if (data.result === 0) {
      //     if (data.root.status === 0 || data.root.status === 1) {
      //       this.$('.js-novice-package').removeClass('hidden')
      //       return true
      //     }
      //   } else {
      //     return false
      //   }
      // })
      //
      // const def2 = getTicketListApi(({data}) => {
      //   if (data && data.result === 0) {
      //     return true
      //   } else {
      //     return false
      //   }
      // })
      //
      // const def3 = getGiftPackageListApi(({data}) => {
      //   if (data && data.result === 0) {
      //     if(moment(_(data.root.systemDate || moment().unix() * 1000).sub(data.root.userRegTime)).dayOfYear() > 3){
      //       return true
      //     }else{
      //       return false
      //     }
      //   } else {
      //     return false
      //   }
      // })
      //
      // Promise.all([def1, def2, def3]).then((result) => {
      //   const result1 = result[0]
      //   const result2 = result[1]
      //   const result3 = result[2]
      //   if (result1 && result2 && result3) {
      //     setInterval(() => {
      //       this.$('.js-novice-package').addClass('hidden')
      //       this.$('.js-arena-package').addClass('hidden')
      //       this.$('.js-user-return-package').removeClass('hidden')
      //
      //     }, 15000)
      //     _.delay(() => {
      //       //新人
      //       setInterval(() => {
      //         //排行榜
      //         this.$('.js-novice-package').addClass('hidden')
      //         this.$('.js-arena-package').removeClass('hidden')
      //         this.$('.js-user-return-package').addClass('hidden')
      //       }, 15000)
      //     }, 5000)
      //     _.delay(() => {
      //       //回归
      //       setInterval(() => {
      //         this.$('.js-novice-package').removeClass('hidden')
      //         this.$('.js-arena-package').addClass('hidden')
      //         this.$('.js-user-return-package').addClass('hidden')
      //       }, 15000)
      //     }, 10000)
      //   } else if(result1 && result2){
      //     setInterval(() => {
      //       this.$('.js-novice-package').addClass('hidden')
      //       this.$('.js-arena-package').removeClass('hidden')
      //       this.$('.js-user-return-package').addClass('hidden')
      //     }, 10000)
      //     _.delay(() => {
      //       setInterval(() => {
      //         this.$('.js-novice-package').removeClass('hidden')
      //         this.$('.js-arena-package').addClass('hidden')
      //         this.$('.js-user-return-package').addClass('hidden')
      //       }, 10000)
      //     }, 5000)
      //   }else{
      //     if (result1) {
      //       this.$('.js-novice-package').removeClass('hidden')
      //     }
      //     if (result2) {
      //       this.$('.js-arena-package').removeClass('hidden')
      //     }
      //     if (result3) {
      //       this.$('.js-user-return-package').removeClass('hidden')
      //     }
      //   }
      // })
      this.app = new Vue({
        template: `<div><activity-entry></activity-entry></div>`,
        components: {
          ActivityEntry
        },
        store: window.store,
        el: this.$el.find('#js-activity-panel')[0],
      })
    })
    const token = Global.cookieCache.get('token')
    if (token && token !== '' && token !== undefined && token !== null) {
      self.$('.js-toolbar-option-operation-container').removeClass('hidden')
    }
    this.subscribe('acct', 'acct:loginOut', () => {
      $('.js-toolbar-option-operation-container').addClass('hidden')
    })

    self.$sidebar = self.$('.js-toolbar-sidebar')
    // self.$closeMask = self.$('.js-sidebar-close')
    self.$container = self.$('.js-toolbar-option-container')
    self.$toption = self.$('.toolbar-option')

    var timer;

    Vue.$global.bus.$on('message-update', () => {
      this.messageUpate()
    })
    window.Global.m.subscribe('acct', 'acct:login', () => {
      // 定时器
      self.timerHandler()
      timer = setInterval(function () {
        // 获取定时更新数据列表
        clearInterval(timer);
        self.timerHandler()
      }, 600000);
    })
    window.Global.m.subscribe('acct', 'acct:loginOut', () => {
      clearInterval(timer);
    })
  },

  timerHandler() {
    var self = this;
    // 获取未使用优惠券
    self.getMyCouponListXhr()
      .done(function (res) {
        if (res && res.result == 0) {
          if (!_(res.root.records).isNull() && !_(res.root.records).isEmpty()) {
            self.$('.js-coupon-remind').removeClass('hidden');
            Global.memoryCache.set('myPointsNoUse', res.root.dataTotal.noUseCount)
            Vue.$global.bus.$emit('myPointsNoUse', res.root.dataTotal.noUseCount)
          } else {
            self.$('.js-coupon-remind').addClass('hidden');
          }
        } else {
          // Global.ui.notification.show(res.msg);
          self.$('.js-coupon-remind').addClass('hidden');
        }
      });
    this.messageUpate()
  },

  messageUpate() {
    var self = this
    // 获取未读消息
    self.getRecentChatStatXhr()
      .done(function (res) {
        if (res && res.result == 0) {
          if (res.root.records.length > 0) {
            if (!_(res.root.records[0].newMsgNum).isNull() && res.root.records[0].newMsgNum != 0) {
              self.$('.js-news-remind').removeClass('hidden');
              var newMsgNum = '';
              if (res.root.records[0].newMsgNum > 99) {
                newMsgNum = 99;
              } else {
                newMsgNum = res.root.records[0].newMsgNum;
              }
              self.$('.js-news-remind').html(newMsgNum);
              // self.$('.js-news-remind').html(res.root.records[0].newMsgNum);
            } else {
              self.$('.js-news-remind').addClass('hidden');
            }
          } else {
            self.$('.js-news-remind').addClass('hidden');
          }
        } else {
          // Global.ui.notification.show(res.msg);
          self.$('.js-news-remind').addClass('hidden');
        }
      });
  },

  toggle(isShow) {
    this.$el.toggle(isShow)
  },

  closeSidebarHandler(e) {
    const $target = $(e.currentTarget)
    const path = $target.data('id')
    const self = this
    self.$sidebar.closest('.js-toolbar-container').find('.js-toolbar-option').each((index, dom) => {
      $(dom).removeClass('active')
    })
    self.$sidebar.closest('.js-toolbar-container').removeClass('open')
    // self.$closeMask.addClass('hidden')
    if (path !== undefined) {
      Global.router.goTo(path)
    }

    self.$container.css('margin-left', '-48px')
    self.$toption.css('border-radius', '3px')
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
    // self.$closeMask.removeClass('hidden')

    self.renderSidebarViewHandler(option)

    self.$container.css('margin-left', '-36px')
    self.$toption.css('border-top-right-radius', '0px')
    self.$toption.css('border-bottom-right-radius', '0px')
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
      //   self.$sidebar.html(new MessageView({}).render().el)
      //   break
      case 5: // 意见反馈
        self.$sidebar.html(new FeedbackView({}).render().el)
        break

      default:
        break
    }
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
    $feedbackDialog.off('click.submitFeedback')
      .on('click.submitFeedback', '.js-feedback-submit', (ev) => {
        const $currContainer = $feedbackDialog.find('.js-sideBar-feedback-form')
        const clpValidate = $currContainer.parsley().validate()
        if (clpValidate) {
          const $target2 = $(ev.currentTarget)
          $target2.button('loading')
          return Global.sync.ajax({
            url: '/info/feedback/create.json',
            data: {
              adviceType: $feedbackDialog.find('.js-feedback-type').find('option:selected').val(),
              subject: $feedbackDialog.find('.js-feedback-title').val(),
              content: $feedbackDialog.find('.js-feedback-content').val(),
            },
          }).always(() => {
            $target2.button('reset')
          }).done((res) => {
            if (res && res.result === 0) {
              Global.ui.notification.show('提交成功。')
              $feedbackDialog.modal('hide')
            } else {
              Global.ui.notification.show('提交失败。')
            }
          })
        }
      })
  },
  imDialogHandler(){
    window.app.$store.commit(types.TOGGLE_IM_DIALOG, true)
  },
  scrollHandler() {
    $('html,body').animate({scrollTop: 0}, 'slow')
  },
  logoutHandler() {
    Global.ui.loader.show()
    $(document).confirm({
      content: '<div class="m-TB-lg">确定要退出登录？</div>',
      type: 'exit',
      agreeCallback: () => {
        window.app.$store.dispatch(types.DO_LOGOUT)
      },
    })
    this.closeSidebarHandler()
    return false
  },
  openNovicePackageHandler(){
    window.app.$store.commit(types.TOGGLE_NOVICE_PACKAGE, true)
  }
})

export default ToolbarView
