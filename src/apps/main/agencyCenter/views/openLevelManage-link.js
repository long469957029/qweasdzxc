require('../misc/jquery.qrcode.min')
var Clipboard = require('clipboard')
const SearchGrid = require('com/searchGrid')

const OpenAccountManageLinkView = SearchGrid.extend({

  template: require('agencyCenter/templates/openAccoutManage-link.html'),
  startOnLoading: true,
  redPackDetailTpl: _(require('agencyCenter/templates/openReadPackDetail.html')).template(),

  events: {
    // 'click .js-ac-add-link': 'addLinkHandler',
    'click .js-ac-auto-btn-edit': 'editAutoHandler',
    // 'blur .js-ac-auto-rebate': 'inputRebateHandler',
    'click .js-ac-auto-remark-saveBtn': 'saveAutoHandler',
    'click .js-ac-op-auto-register': 'registerpopHander',
    // 'click .js-look-bonus': 'lookBonusViewHandler',
    'click .js-ac-btn-qr-code': 'showQrcodeHander',
    'click .js-qr-code-div-all-closeBtn': 'hideQrcode',
    'click .js-ac-auto-remark-updateBtn': 'remarkChangeInputHander',
    'click .js-ac-link-del': 'delSubAcctHander',
    'click .js-ac-btn-red-detail': 'redPackDetailHandler',

    // 'mouseover .js-qr-code' : 'hoverQrcode',
    // 'mouseout .js-qr-code' : 'hoverhideQrcode'
  },
  initialize () {
    _(this.options).extend({
      height: 624,
      title: '链接管理',
      tableClass: 'table table-bordered table-center ac-auto-container border-bottom',
      columns: [
        {
          name: '注册链接',
          width: '44%',
        },
        {
          name: '开户类型',
          width: '7%',
          sortable: true,
          id: 1,
        },
        {
          name: '返点',
          width: '7%',
          sortable: true,
          id: 2,
        },
        {
          name: '访问人数',
          width: '7%',
          sortable: true,
          id: 3,
        },
        {
          name: '注册人数',
          width: '10%',
          sortable: true,
          id: 4,
        },
        {
          name: '备注',
          width: '20%',
          id: 5,
        },
        {
          name: '操作',
          width: '5%',
        },
      ],
      gridOps: {
        emptyTip: '暂无开户链接',
      },
      ajaxOps: {
        url: '/acct/subaccount/getsubacctlink.json',
      },
      reqData: {
        pageSize: 12,
      },
      listProp: 'root.linkList',
    })
  },


  delSubAcctLinkXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/delsubacctlink.json',
      data,
    })
  },

  onRender() {
    SearchGrid.prototype.onRender.apply(this, arguments)
  },
  renderGrid(gridData) {
    const rowsData = _(gridData.linkList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false,
    }).hideLoading()
    this.clipboard = new Clipboard('.js-ac-btn-link-copy');
    this.clipboard.on('success', function(e) {
      e.clearSelection();
    });

    this.clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  },

  formatRowData(rowInfo) {
    const row = []
    let html = `<div class="text-left p-left-sm"><input type="text" class="js-ac-span-link input-link" value="${_(`/register.html?linkId=${rowInfo.userLinkUrl}`).toLink()}">`
    html += `<button type="button" class="js-ac-btn-link-copy btn m-right-xs ac-btn-link-copy" 
            data-clipboard-text="${_(`/register.html?linkId=${rowInfo.userLinkUrl}`).toLink()}">复制</button>`
    html += `<button userLinkUrl="${rowInfo.userLinkUrl}" type="button" class="js-ac-btn-qr-code btn ac-btn-qr-code">二维码</button>`
    if (rowInfo.linkType === 1) {
      html += '<a class="js-ac-btn-red-detail ac-btn-red-detail"></a>'
    }
    row.push(html)
    row.push(rowInfo.userType === 0 ? '代理' : '玩家')
    row.push(`<span class="js-ac-auto-subAcctRebate" data-subacctrebate="${rowInfo.subAcctRebate}">${_(rowInfo.subAcctRebate).formatDiv(10, { fixed: 1 })}</span>`)
    row.push(rowInfo.viewNum)
    row.push(rowInfo.regUserNum)
    row.push(`<span class="js-ac-span-remark ac-span-remark" title="${rowInfo.userLinkDes}">${rowInfo.userLinkDes}</span>
          <span class="js-ac-auto-remark-updateBtn ac-auto-remark-updateBtn"></span>`)
    row.push(`<span data-userlinkid="${rowInfo.userLinkId}" class="js-ac-link-del ac-link-del"></span>`)
    return row
  },

  // event handlers

  editAutoHandler(e) {
    const $target = $(e.currentTarget)
    const $editContainer = $target.closest('.js-ac-link-bar').find('.js-ac-link-edit-container')
    $editContainer.toggleClass('hidden')
  },

  saveAutoHandler(e) {
    const $target = $(e.currentTarget)
    const $tr = $target.closest('tr')
    const $remark = $tr.find('.js-ac-auto-remark')
    const $subAcctRebate = $tr.find('.js-ac-auto-subAcctRebate')

    $remark.parsley().validate()
    if (!$remark.parsley().isValid()) {
      return false
    }
    const userlinkurl = $tr.find('.js-ac-btn-qr-code').attr('userlinkurl')
    Global.sync.ajax({
      url: '/acct/subaccount/savesubacctlink.json',
      data: {
        'link[0].linkId': userlinkurl,
        'link[0].linkUrl': userlinkurl,
        'link[0].linkDes': $remark.val(),
        'link[0].subAcctRebate': $subAcctRebate.data('subacctrebate'),
      },
    }).always(() => {
      $target.button('reset')
    })
      .done((res) => {
        if (res && res.result === 0) {
          const $td = $target.closest('td')
          $td.html(`<span class="js-ac-span-remark ac-span-remark">${$remark.val()}</span><span class="js-ac-auto-remark-updateBtn ac-auto-remark-updateBtn"></span>`)
        } else {
          Global.ui.notification.show(res.msg)
        }
      })
  },

  remarkChangeInputHander (e) {
    const $target = $(e.currentTarget)
    const $td = $target.closest('td')
    const $remark = $td.find('.js-ac-span-remark')
    $td.html(`<input type="text" value="${$remark.html()}" class="js-ac-auto-remark ac-auto-remark" data-parsley-maxlength="20" />` +
      '<span class="js-ac-auto-remark-saveBtn ac-auto-remark-saveBtn"></span>')
  },

  toLink (arg) {
    const href = window.location.href
    const index = href.indexOf('/index.html')
    if (index > -1) {
      return href.substring(0, index) + arg
    }
    return href.substring(0, href.indexOf('/#')) + arg
  },

  showQrcodeHander (e) {
    const $target = $(e.currentTarget)
    if (!$target.hasClass('selected')) {
      this.$('.js-ac-btn-qr-code').removeClass('selected')
      $target.addClass('selected')
      const linkId = $target.attr('userlinkurl')
      const $qrCodeDivAll = this.$('.js-qr-code-div-all')
      $qrCodeDivAll.find('canvas').remove()
      $qrCodeDivAll.qrcode({ size: 150, text: this.toLink(`/register.html?linkId=${linkId}`) || "size doesn't matter" })
      $qrCodeDivAll.show()
    }
  },

  hideQrcode () {
    this.$('.js-ac-btn-qr-code').removeClass('selected')
    this.$('.js-qr-code-div-all').hide()
  },

  // copyLinkHandler ($parent) {
  //   $parent.find('.js-ac-btn-link-copy').textCopy({
  //     textEl: $parent.find('.js-ac-span-link'),
  //     toolTipDirection: 'left',
  //   })
  // },

  delSubAcctHander (e) {
    const self = this
    const $target = $(e.currentTarget)
    // const $tr = $target.closest('tr')
    const userlinkid = $target.data('userlinkid')

    this.delSubAcctLinkXhr({ linkId: userlinkid }).done((res) => {
      if (res && res.result === 0) {
        self._getGridXhr()
      } else {
        Global.ui.notification.show(res.msg)
      }
    })
  },
  redPackDetailHandler(e) {
    const $target = $(e.currentTarget)
    const $tr = $target.closest('tr')
    const redPackType = $tr.data('redpack-type')
    const totalRedpackAmount = _($tr.data('total-redpack-amount')).convert2yuan()
    const leftRedpackAmount = _($tr.data('left-redpack-amount')).convert2yuan()
    const redpackNum = $tr.data('redpack-num')
    const leftRedpackNum = $tr.data('left-redpack-num')
    const $dialog = Global.ui.dialog.show({
      anySize: '378',
      body: '<div class="js-red-detail-dialog"></div>',
      bodyClass: 'no-padding no-bg no-border',
      closeBtn: false,
    })
    $dialog.find('.js-red-detail-dialog').html(this.redPackDetailTpl({
      redPackType,
      totalRedpackAmount,
      leftRedpackAmount,
      redpackNum,
      leftRedpackNum,
    }))
    $dialog.on('hidden.modal', function() {
      $(this).remove()
    })
  },
})

module.exports = OpenAccountManageLinkView
