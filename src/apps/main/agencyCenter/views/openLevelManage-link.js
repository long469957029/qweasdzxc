require('../../../../base/scripts/jquery.qrcode.min')

const OpenAccountManageLinkView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccoutManage-link.html'),
  startOnLoading: true,
  linkBarTpl: _(require('agencyCenter/templates/openAccountManage-auto-linkBar.html')).template(),
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

  getSubAcctLinkXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctlink.json',
      data,
    })
  },

  delSubAcctLinkXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/delsubacctlink.json',
      data,
    })
  },

  onRender() {
    this.$limit = this.$('.js-ac-quota-container')
    this.$autoContainer = this.$('.js-ac-auto-container')
    this.$acOpenAccountAutoForm = this.$('.js-ac-openAccountAuto-form')
    this.$acUserType = this.$('.js-ac-userType')
    this.$acAutoReBate = this.$('.js-ac-auto-rebate')
    this.$acBonusRangePrompt = this.$('.js-ac-bonus-range-Prompt')
    this.$acAutoRemarkInput = this.$('.js-ac-auto-remarkInput')
    this.$acLinkPage = this.$('.js-ac-link-page')
    this.getLinkList({ pageIndex: 0 })
  },
  getLinkList(page) {
    const self = this
    if (page) {
      _(page).extend({ pageSize: 12 })
      this.getSubAcctLinkXhr(page).always(() => {
        self.loadingFinish()
      })
        .done((res) => {
          if (res && res.result === 0) {
            const data = res.root
            self.$autoContainer.staticGrid({
              startOnLoading: false,
              height: 624,
              tableClass: 'table table-bordered table-center',
              colModel: [
                {
                  label: '注册链接',
                  name: 'userLinkUrl',
                  width: '47%',
                  formatter(val) {
                    // let html = `<span class="js-ac-span-link ac-span-link m-right-xs" title="${_(`/register.html?linkId=${val}`).toLink()}">${_(`/register.html?linkId=${val}`).toLink()}</span>`
                    let html = `<div class="text-left p-left-sm"><input type="text" class="js-ac-span-link input-link" value="${_(`/register.html?linkId=${val}`).toLink()}">`
                    html += '<button type="button" class="js-ac-btn-link-copy btn m-right-xs ac-btn-link-copy">复制</button>'
                    html += `<button userLinkUrl="${val}" type="button" class="js-ac-btn-qr-code btn ac-btn-qr-code">二维码</button>`
                    html += `<a userLinkUrl="${val}" class="js-ac-btn-red-detail ac-btn-red-detail"></a>`
                    return `${html}</div>`
                  },
                },
                {
                  label: '开户类型',
                  name: 'userType',
                  width: '7%',
                  formatter(val) {
                    return val === 1 ? '玩家' : '代理'
                  },
                },
                {
                  label: '返点',
                  name: 'subAcctRebate',
                  width: '7%',
                  formatter(val) {
                    return `<span class="js-ac-auto-subAcctRebate" data-subacctrebate="${val}">${_(val).formatDiv(10, { fixed: 1 })}</span>`
                  },
                },
                {
                  label: '访问数',
                  name: 'viewNum',
                  width: '7%',
                  formatter(val) {
                    return val
                  },
                },
                {
                  label: '注册数',
                  name: 'regUserNum',
                  width: '7%',
                  formatter(val) {
                    return val
                  },
                },
                {
                  label: '备注',
                  name: 'userLinkDes',
                  width: '20%',
                  formatter(val) {
                    // if(val){
                    return `<span class="js-ac-span-remark ac-span-remark" title="${val}">${val}</span><span class="js-ac-auto-remark-updateBtn ac-auto-remark-updateBtn"></span>`
                    // }else {
                    //   return '<input type="text" class="js-ac-auto-remark ac-auto-remark" data-parsley-maxlength="20" /><span class="js-ac-auto-remark-saveBtn ac-auto-remark-saveBtn"></span>';
                    // }
                  },
                },
                {
                  label: '操作',
                  name: '',
                  width: '5%',
                  formatter(val, index, info) {
                    return `<span data-userlinkid="${info.userLinkId}" class="js-ac-link-del ac-link-del"></span>`
                  },
                },
              ],
              row: data.linkList,
            })

            self.$autoContainer.find('tbody tr').each((index, item) => {
              self.copyLinkHandler($(item))
            })
            self.$autoContainer.append('<div class="js-qr-code-div-all qr-code-div-all"><div class="js-qr-code-div-all-closeBtn qr-code-div-all-closeBtn"></div></div>')

            self.initPage()
          }
        })
    }
  },
  initPage(count) {
    if (count) {
      const self = this
      this.$acLinkPage.pagination({
        pageSize: 10,
        totalSize: count,
        onPaginationChange: (num) => {
          self.getLinkList({ pageIndex: num })
        },
      })
      this.pagination = this.$acLinkPage.pagination('instance')
    }
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

  copyLinkHandler ($parent) {
    $parent.find('.js-ac-btn-link-copy').textCopy({
      textEl: $parent.find('.js-ac-span-link'),
      toolTipDirection: 'left',
    })
  },

  delSubAcctHander (e) {
    const self = this
    const $target = $(e.currentTarget)
    const $tr = $target.closest('tr')
    const userlinkid = $target.data('userlinkid')

    this.delSubAcctLinkXhr({ linkId: userlinkid }).done((res) => {
      if (res && res.result === 0) {
        self.$autoContainer.staticGrid('delRow', $tr.index())

        if (self.$autoContainer.find('.js-gl-static-tr').length === 0) {
          self.$autoContainer.staticGrid('renderEmpty')
        }
      } else {
        Global.ui.notification.show(res.msg)
      }
    })
  },
  redPackDetailHandler() {
    const $dialog = Global.ui.dialog.show({
      anySize: '378',
      body: '<div class="js-red-detail-dialog"></div>',
      bodyClass: 'no-padding no-bg no-border',
      closeBtn: false,
    })
    $dialog.find('.js-red-detail-dialog').html(this.redPackDetailTpl({

    }))
    $dialog.on('hidden.modal', function() {
      $(this).remove()
    })
  },
})

module.exports = OpenAccountManageLinkView
