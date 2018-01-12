import HeaderView from 'skeleton/bases/header'
import NavbarView from 'skeleton/bases/navbar'
import NoticeView from 'skeleton/bases/notice'
import FooterView from 'skeleton/bases/footer'
import ToolbarView from 'skeleton/bases/toolbar'

import RechargeView from 'com/fundOperate'

import './index.css'

const BetDetailView = require('fundCenter/gameRecord/betDetail')
const ChaseDetailView = require('fundCenter/gameRecord/chaseDetail')


// import WithDrawView from 'com/fundOperate/withdraw'
// import TransferView from 'com/fundOperate/transfer'

const App = new window.Base.Application()

App.on('start', () => {
  $('body').addClass('loaded').find('.wm-loader-wrapper').remove()
  $('.js-wrapper').removeClass('hide')
})

App.addRegions({
  headerRegion: '#header',
  navbarRegin: '#navbar',
  noticeRegin: '#notice',
  toolbarRegin: '#toolbar',
  mainRegin: '#main',
  newbieRegin: '#newbie',
  winnerRegin: '#winner',
  footerRegin: '#footer',
  // mobileDownloadRegin:'#mobileDownload'
})


const support = {
  animations: window.Modernizr.cssanimations,
}
const animEndEventNames = {
  WebkitAnimation: 'webkitAnimationEnd',
  OAnimation: 'oAnimationEnd',
  msAnimation: 'MSAnimationEnd',
  animation: 'animationend',
}
const animEndEventName = animEndEventNames[window.Modernizr.prefixed('animation')]

function onEndAnimation($el, callback) {
  const onEndCallbackFn = function (ev) {
    if (support.animations) {
      if (ev.target !== this) {
        return
      }
      this.removeEventListener(animEndEventName, onEndCallbackFn)
    }
    if (callback && typeof callback === 'function') {
      callback.call()
    }
  }
  if (support.animations) {
    $el.on(animEndEventName, onEndCallbackFn)
  } else {
    onEndCallbackFn()
  }
}

function _bindServiceHandler() {
  $(document).off('click.service').on('click.service', '.js-gl-service', () => {
    const acctInfo = Global.memoryCache.get('acctInfo')
    const username = acctInfo.username
    const vip = `(VIP${acctInfo.memberLevel})`
    const newwin = window.open(
      `${_.getCustomerServiceUrl()}&info=${encodeURIComponent(`userId=${acctInfo.userId}&name=${username}${vip}`)}`,
      'service',
      'width=800,height=680',
    )
    newwin.moveTo(100, 50)
  })
}
function _bindClosePopoverHandler() {
  $(document).off('click.popover').on('click.popover', '.popover', (e) => {
    const $target = $(e.target)
    const $popover = $target.closest('.popover')
    if (!$popover.length) {
      _($(':data(popover)')).each((el) => {
        const $el = $(el)
        if ($el.data('popover') !== $target.data('popover') &&
          $el.data('popover') && $el.data('popover').$tip && $el.data('popover').$tip.hasClass('in')) {
          $el.popover('hide')
        }
      })
    }
  })
}

function _bindClickFeedbackHandler() {
  $(document).off('click.clickFeedback', '.cbutton').on('click.clickFeedback', '.cbutton', (e) => {
    const $target = $(e.currentTarget)
    $target.addClass('cbutton--click')
    onEndAnimation($target.hasClass('cbutton--complex') ? $target.find('.cbutton__helper') : $target, () => {
      $target.removeClass('cbutton--click')
    })
  })
}

function _bindClickModalFadeHandler() {
  $(document).off('click.modal-backdrop', '.modal-backdrop').on('click.modal-backdrop', '.modal-backdrop', (e) => {
    const $target = $(e.currentTarget)
    if ($target.prev().hasClass('.modal-notification') && $target.prev().hasClass('hidden')) {
      $target.prev().remove()
      $target.remove()
    }
  })
}
const _bindFundOperatorDialogHandler = () => {
  $(document).off('click.fundDialog').on('click.fundDialog', '.js-header-recharge', () => {
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (!acctInfo || acctInfo.userStatus === 100) {
      Global.ui.notification.show('用户已被冻结，无法进行充值操作')
      return
    }

    const rechargeView = new RechargeView()

    const $fundOperateDialog = Global.ui.dialog.show({
      id: _.now(),
      title: '',
      size: 'fund-operate',
      bStyle: 'width: 740px;height:680px;border: 1px solid #d7d7d7;;"',
      bodyClass: 'js-fund-operate fund-operate',
      body: '<div class="js-fund-operate-container"></div>',
    })

    $fundOperateDialog.find('.js-fund-operate').html(rechargeView.render().el)

    $fundOperateDialog.on('hidden.modal', () => {
      $(this).remove()
      rechargeView.destroy()
    })
    $fundOperateDialog.on('click.modal', '.js-rc-close-dialog', () => {
      Global.router.goTo('#/aa')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-rc-recharge-to-record', () => {
      Global.router.goTo('#/fc/rd')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-wd-goTo-fundPwd', () => {
      Global.router.goTo('#/uc/pl')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-wd-goTo-bankCard', () => {
      Global.router.goTo('#/uc/cm')
      $fundOperateDialog.modal('hide')
    })
  })
}

// 查看用户投注记录
const _bindBetDetailHandler = () => {
  $(document).off('click.betDetailDialog').on('click.betDetailDialog', '.js-gl-bet-detail-dialog', (e) => {
    const $target = $(e.currentTarget)
    const tradeNo = $target.data('id')
    const $dialog = Global.ui.dialog.show({
      size: 'modal-bet',
      bStyle: 'width: 535px;height:620px;',
      body: '<div class="fc-gr-bet-detail sfa sfa-dailog-betting-detail"></div>',
      closeBtn: false,
      bodyClass: 'no-padding',
    })
    const $selectContainer = $dialog.find('.fc-gr-bet-detail')
    const editBetDetailView = new BetDetailView({tradeno: tradeNo})
    $selectContainer.html(editBetDetailView.render().el)

    $dialog.on('hidden.modal', () => {
      $(this).remove()
      editBetDetailView.destroy()
    })
    $dialog.off('click.cancelBet')
      .on('click.cancelBet', '.js-gr-submitBtn', (ev) => {
        const $currContainer = $dialog.find('.fc-gr-bet-detail-form')
        const clpValidate = $currContainer.parsley().validate()
        if (clpValidate) {
          const $target2 = $(ev.currentTarget)
          $target2.button('loading')
          return Global.sync.ajax({
            url: '/ticket/bet/cancel.json',
            data: {
              betId: $dialog.find('.js-gr-ticketBetId').val(),
            },
          }).done((res) => {
            if (res && res.result === 0) {
              Global.ui.notification.show('操作成功。')
              $dialog.modal('hide')
            } else {
              Global.ui.notification.show('操作失败。')
            }
          })
        }
      })
  })
}
// 查看用户追号记录
const _bindChaseDetailHandler = () => {
  $(document).off('click.chaseDetailDialog').on('click.chaseDetailDialog', '.js-gl-chase-detail-dialog', (e) => {
    const $target = $(e.currentTarget)
    const cId = $target.data('id')
    const tradeno = $target.data('no')
    const $dialog = Global.ui.dialog.show({
      size: 'modal-chase',
      bStyle: 'width: 848px;height:570px;',
      body: '<div class="fc-gr-chase-detail"></div>',
      closeBtn: false,
      bodyClass: 'no-padding',
    })
    const $selectContainer = $dialog.find('.fc-gr-chase-detail')
    const editChaseDetailView = new ChaseDetailView({chaseFormId: cId, tradeNo: tradeno})
    $selectContainer.html(editChaseDetailView.render().el)

    $dialog.on('hidden.modal', function () {
      $(this).remove()
      editChaseDetailView.destroy()
    })
    // $dialog.off('click.cancelBet')
    //   .on('click.cancelBet', '.js-gr-submitBtn', (ev) => {
    //     const $currContainer = $dialog.find('.fc-gr-bet-detail-form')
    //     const clpValidate = $currContainer.parsley().validate()
    //     if (clpValidate) {
    //       const $target2 = $(ev.currentTarget)
    //       $target2.button('loading')
    //       return Global.sync.ajax({
    //         url: '/ticket/bet/cancel.json',
    //         data: {
    //           betId: $dialog.find('.js-gr-ticketBetId').val(),
    //         },
    //       }).done((res) => {
    //         if (res && res.result === 0) {
    //           Global.ui.notification.show('操作成功。')
    //           $dialog.modal('hide')
    //         } else {
    //           Global.ui.notification.show('操作失败。')
    //         }
    //       })
    //     }
    //   })
  })
}
App.addInitializer(() => {
  App.headerRegion.show(new HeaderView())
  App.navbarRegin.show(new NavbarView({
    navbar: Global.ui.menu.getNav(),
  }))

  App.toolbarRegin.show(new ToolbarView())

  App.noticeRegin.show(new NoticeView())
  Global.newbieActivity.checkLogin()

  App.footerRegin.show(new FooterView())


  Backbone.history.start()

  _bindServiceHandler()
  _bindClosePopoverHandler()
  _bindClickFeedbackHandler()
  _bindClickModalFadeHandler()
  _bindFundOperatorDialogHandler() // 全局绑定资金操作(充值 提现 转帐)弹窗
  _bindBetDetailHandler() // 全局投注详情弹窗
  _bindChaseDetailHandler()
})


module.exports = App
