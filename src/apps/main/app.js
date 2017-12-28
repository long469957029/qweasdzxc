import HeaderView from 'skeleton/bases/header'
import NavbarView from 'skeleton/bases/navbar'
import NoticeView from 'skeleton/bases/notice'
import FooterView from 'skeleton/bases/footer'
import ToolbarView from 'skeleton/bases/toolbar'

import RechargeView from 'com/fundOperate'

import './index.css'
// import WithDrawView from 'com/fundOperate/withdraw'
// import TransferView from 'com/fundOperate/transfer'

const App = new window.Base.Application()

App.on('start', () => {
  $('body').addClass('loaded').find('.wm-loader-wrapper').remove()
  $('.js-wrapper').removeClass('hide')

  // 六合彩选号区内容过长，footer调整
  const $footer = $('#footer')
  $('.js-gl-main-navbar .nav').on('click', '>li', () => {
    $footer.removeClass('mark6-footer')
  })
  const $header = $('#header')
  $header.find('.js-user-info-btn>a').on('click', (e) => {
    const $target = $(e.currentTarget)
    if ($target.attr('href').indexOf('javascript:void(0)') > -1) { // eslint-disable-line
      $footer.removeClass('mark6-footer')
    }
  })

  $header.find('.js-gl-h-ticket-dropdown').on('click', () => {
    if ($footer.hasClass('mark6-footer')) {
      $footer.removeClass('mark6-footer')
    }
  })

  // 六合彩系类页面过长的PlayId
  const playIdArr = [
    34010101,
    34010103,
    34020101,
    34020102,
    34020103,
    34020104,
    34020105,
    34020106,
    34020107,
    34040101,
    34060101,
    34060102,
    34060103,
    34060104,
    34060105,
    34060106,
    35010101,
    35010103,
    35020101,
    35020102,
    35020103,
    35020104,
    35020105,
    35020106,
    35020107,
    35040101,
    35060101,
    35060102,
    35060103,
    35060104,
    35060105,
    35060106,
  ]
  $('.global-main').on('click', 'a', (e) => {
    const $target = $(e.currentTarget)
    if ($target.hasClass('js-bc-records-tab')) {
      return
    }
    const href = $target.attr('href')

    if (href && href.indexOf('javascript:void(0)') == -1) { // eslint-disable-line
      if (href.indexOf('bc/34') > -1 || href.indexOf('bc/35') > -1) { // 如果六合彩在定制入口上
        if (!$footer.hasClass('mark6-footer')) {
          $footer.addClass('mark6-footer')
        }
      } else if (href && href.indexOf('#bc/br/detail') > -1) { // 如果点击的是最近投注记录上的数据footer存playId
        const currentPlayId = $('.js-bc-advance-rule.active').data('id')
        $footer.data('currentPlayId', currentPlayId)
        $footer.removeClass('mark6-footer')
      } else {
        $footer.removeClass('mark6-footer')
      }
    }
  }).on('click', '.btn.sub-return', () => {
    // 从最近投注记录跳转到投注信息页面时获取footer上playId，判断是否是六合那几个内容过长的玩法
    const currentPlayId = $footer.data('currentPlayId')
    if (_.indexOf(playIdArr, currentPlayId) > -1) {
      $footer.addClass('mark6-footer')
    } else {
      $footer.removeClass('mark6-footer')
    }
  })
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
  $(document).off('click.fundDialog').on('click.fundDialog', '.js-fc-re', () => {
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
      bStyle: 'width: 740px;height:680px;border:0;"',
      bodyClass: 'js-fund-operate fund-operate',
      body: '<div class="js-fund-operate-container"></div>',
    })

    $fundOperateDialog.find('.js-fund-operate').html(rechargeView.render().el)

    $fundOperateDialog.on('hidden.modal', () => {
      $(this).remove()
    })
    $fundOperateDialog.on('click.modal', '.js-rc-close-dialog', () => {
      Global.router.goTo('#aa')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-rc-recharge-to-record', () => {
      Global.router.goTo('#fc/rd')
      $fundOperateDialog.modal('hide')
    })
  })
}
App.addInitializer(() => {
  App.headerRegion.show(new HeaderView())
  App.navbarRegin.show(new NavbarView({
    navbar: Global.ui.menu.getNav(),
  }))

  App.toolbarRegin.show(new ToolbarView())

  App.headerRegion.show(new HeaderView())
  App.noticeRegin.show(new NoticeView())
  Global.newbieActivity.checkLogin()

  App.footerRegin.show(new FooterView())


  Backbone.history.start()

  _bindServiceHandler()
  _bindClosePopoverHandler()
  _bindClickFeedbackHandler()
  _bindClickModalFadeHandler()
  _bindFundOperatorDialogHandler() // 全局绑定资金操作(充值 提现 转帐)弹窗
})


module.exports = App
