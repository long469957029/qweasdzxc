
import ToolbarView from 'skeleton/bases/toolbar'

import RechargeView from 'com/fundOperate'
import MessageView from 'skeleton/bases/toolbar/message' // 站内消息
import rechargeVipView from 'com/fundOperate/vip/index.html'

import './index.css'

const BetDetailView = require('fundCenter/gameRecord/betDetail')
const ChaseDetailView = require('fundCenter/gameRecord/chaseDetail')


const App = new window.Base.Application()

App.addRegions({
  toolbarRegin: '#toolbar',
  mainRegin: '#main',
})

function _bindServiceHandler() {
  $(document).off('click.service').on('click.service', '.js-gl-service', () => {
    const acctInfo = Global.memoryCache.get('acctInfo')
    let newwin = ''
    if (!_.isUndefined(acctInfo)) {
      const username = acctInfo.username
      const vip = `(VIP${acctInfo.memberLevel})`
      newwin = window.open(
        `${_.getCustomerServiceUrl()}&info=${encodeURIComponent(`userId=${acctInfo.userId}&name=${username}${vip}`)}`,
        'service',
        'width=800,height=680',
      )
    } else {
      newwin = window.open(`${_.getCustomerServiceUrl()}`, 'service', 'width=800,height=680')
    }
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
  $(document).off('click.fundDialog').on('click.fundDialog', '.js-header-recharge', (e) => {
    const $target = $(e.currentTarget)
    const tabName = $target.data('name')
    const toId = $target.data('toid')
    const acctInfo = Global.memoryCache.get('acctInfo')
    if (!acctInfo || acctInfo.userStatus === 100) {
      Global.ui.notification.show('用户已被冻结，无法进行资金操作')
      return
    }
    const $fundOperateDialog = Global.ui.dialog.show({
      id: _.now(),
      // modalClass:'js-fund-operate-dialog',
      size: 'js-fund-operate-dialog fund-operate',
      bStyle: 'width: 740px;height:680px;',
      bodyClass: 'js-fund-operate fund-operate',
      body: '<div class="js-fund-operate-container"></div>',
      specialClose: '<a class="fund-operate-close btn-close" data-dismiss="modal"><span class="sfa sfa-dialog-close"></span></a>'
    })
    const rechargeView = new RechargeView({
      triggerTab: tabName,
      toId: toId,
    })

    $fundOperateDialog.find('.js-fund-operate').html(rechargeView.render().el)
    if(window.store.getters.userIsVip){
    $fundOperateDialog.find('.js-fund-operate-dialog').after('<div class="js-fund-vip-panel fund-vip-panel">' +
      '<div class="js-fund-vip fund-vip"></div><div class="js-fund-vip-tips fund-vip-tips"></div></div><input class="js-vip-tips-active" type="hidden">')
    }
    $fundOperateDialog.on('hidden.modal', () => {
      $(this).remove()
      rechargeView.destroy()
    })
    $fundOperateDialog.on('click.modal', '.js-rc-close-dialog', () => {
      Global.router.goTo('aa')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-rc-recharge-to-record', () => {
      Global.router.goTo('fc/rd')
      $fundOperateDialog.modal('hide')
      $('.js-refresh-withdraw-record').trigger('click')
      $('.js-refresh-recharge-record').trigger('click')
      $('.js-refresh-transfer-record').trigger('click')
    })
    $fundOperateDialog.on('click.modal', '.js-wd-goTo-fundPwd', () => {
      Global.router.goTo('uc/pl')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-wd-goTo-bankCard', () => {
      Global.router.goTo('uc/cm')
      $fundOperateDialog.modal('hide')
    })
    $fundOperateDialog.on('click.modal', '.js-fund-vip', () => {
      const status = $fundOperateDialog.find('.js-vip-tips-active').val()
      if (status === '' || status === undefined || status === 'hide') {
        $fundOperateDialog.find('.js-fund-vip-tips').append(rechargeVipView)
        $fundOperateDialog.find('.js-vip-tips-active').val('show')
      }else if(status==='show'){
        $fundOperateDialog.find('.js-fund-vip-tips-container').remove()
        $fundOperateDialog.find('.js-vip-tips-active').val('hide')
      }
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
      body: '<div class="fc-gr-bet-detail"></div>',
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
              window.Global.m.publish('acct:cancelBet')
              Vue.$global.bus.$emit('cancel-bet')
              Global.ui.notification.show('操作成功。')
              $dialog.modal('hide')
            } else {
              Global.ui.notification.show(res.msg)
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
      bStyle: 'width: 848px;height:570px;',
      body: '<div class="fc-gr-chase-detail"></div>',
      closeBtn: false,
      bodyClass: 'no-padding no-bg',
    })
    const $selectContainer = $dialog.find('.fc-gr-chase-detail')
    const editChaseDetailView = new ChaseDetailView({chaseFormId: cId, tradeNo: tradeno})
    $selectContainer.html(editChaseDetailView.render().el)

    $dialog.on('hidden.modal', function () {
      $(this).remove()
      editChaseDetailView.destroy()
    })
  })
}
// const _bindCloseTablePopoverHandler = () => {
//   $(document).off('click').on('click', '.popover', (e) => {
//     const $target = $(e.target)
//     const $popover = $target.find('.popover')
//     _($popover).each((el) => {
//       const $el = $(el)
//       $el.remove()
//     })
//   })
// }
// 站内信弹窗
const _bindImDialogHandler = () => {
  $(document).off('click.imDialog').on('click.imDialog', '.js-toolbar-im-dialog', (e) => {
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    const $imDialog = Global.ui.dialog.show({
      size: 'im-dialog-panel',
      // bStyle: 'width: 832;height:600;border:0;"',
      bodyClass: 'js-sideBar-im im-panel',
      body: '<div class="im-dialog-container"></div>',
    })
    const $dialogContainer = $imDialog.find('.im-dialog-container')
    const messageView = new MessageView({userId: id})
    $dialogContainer.html(messageView.render().el)

    $imDialog.on('hidden.modal', function () {
      $(this).remove()
      messageView.destroy()
    })
    $imDialog.on('click.modal', '.js-admin-message-change', (e) => {
      const $target = $(e.currentTarget)
      const path = $target.data('id')
      Global.router.goTo(path)
      $imDialog.modal('hide')
    })
  })
}
//侧边栏关闭
const _bindToolBarCloseHandler = () => {
  $(document).off('click.toolbar').on('click.toolbar','.js-app-container',(e)=>{
    let $container = $('.js-toolbar-container')
    $container.find('.js-toolbar-option').each((index, dom) => {
      $(dom).removeClass('active')
    })
    $container.removeClass('open')
    $container.find('.js-toolbar-option-container').css('margin-left','-48px')
    $container.find('.toolbar-option').css('border-radius','3px')
  })
}
App.addInitializer(() => {
  // App.navbarRegin.show(new NavbarView({
  //   navbar: Global.ui.menu.getNav(),
  // }))

  App.toolbarRegin.show(new ToolbarView())

  Backbone.history.start()

  _bindServiceHandler()
  _bindClosePopoverHandler()
  _bindClickModalFadeHandler()
  _bindFundOperatorDialogHandler() // 全局绑定资金操作(充值 提现 转帐)弹窗
  _bindBetDetailHandler() // 全局投注详情弹窗
  _bindChaseDetailHandler()
  _bindImDialogHandler() // 站内信弹窗
  _bindToolBarCloseHandler()//侧边栏
  // _bindCloseTablePopoverHandler()
})


module.exports = App
