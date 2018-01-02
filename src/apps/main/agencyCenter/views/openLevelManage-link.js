require('../../../../base/scripts/jquery.qrcode.min')

const OpenAccountManageLinkView = Base.ItemView.extend({

  template: require('agencyCenter/templates/openAccountManage-link.html'),
  startOnLoading: true,
  linkBarTpl: _(require('agencyCenter/templates/openAccountManage-auto-linkBar.html')).template(),

  events: {
    'click .js-ac-add-link': 'addLinkHandler',
    'click .js-ac-auto-btn-edit': 'editAutoHandler',
    'blur .js-ac-auto-rebate': 'inputRebateHandler',
    'click .js-ac-auto-remark-saveBtn': 'saveAutoHandler',
    'click .js-ac-op-auto-register': 'registerpopHander',
    'click .js-look-bonus': 'lookBonusViewHandler',
    'click .js-ac-btn-qr-code': 'showQrcodeHander',
    'click .js-qr-code-div-all-closeBtn': 'hideQrcode',
    'click .js-ac-auto-remark-updateBtn': 'remarkChangeInputHander',
    'click .js-ac-link-del': 'delSubAcctHander',

    // 'mouseover .js-qr-code' : 'hoverQrcode',
    // 'mouseout .js-qr-code' : 'hoverhideQrcode'
  },

  createSubAcctXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/createsubacctlink.json',
      data,
    })
  },

  getSubAcctLinkXhr() {
    return Global.sync.ajax({
      url: '/acct/subaccount/getsubacctlink.json',
    })
  },

  delSubAcctLinkXhr(data) {
    return Global.sync.ajax({
      url: '/acct/subaccount/delsubacctlink.json',
      data,
    })
  },

  onRender() {
    const self = this

    this.$limit = this.$('.js-ac-quota-container')
    this.$autoContainer = this.$('.js-ac-auto-container')
    this.$acOpenAccountAutoForm = this.$('.js-ac-openAccountAuto-form')
    this.$acUserType = this.$('.js-ac-userType')
    this.$acAutoReBate = this.$('.js-ac-auto-rebate')
    this.$acBonusRangePrompt = this.$('.js-ac-bonus-range-Prompt')
    this.$acAutoRemarkInput = this.$('.js-ac-auto-remarkInput')

    this.subAcctLinkXhr = this.getSubAcctLinkXhr()

    this.subAcctLinkXhr.always(() => {
      self.loadingFinish()
    })
      .done((res) => {
        const data = res.root
        if (res && res.result === 0) {
          self.$acAutoReBate.val(_(0).formatDiv(10, { fixed: 1 }))
          self.$acAutoReBate.attr('data-parsley-range', `[${_(0).formatDiv(10, { fixed: 1 })},${_(data.maxRebateBeUse).formatDiv(10, { fixed: 1 })}]`)
          const subRebateRangePrompt = `${'0' + '～'}${_(data.maxRebateBeUse > 130 ? 130 : data.maxRebateBeUse).formatDiv(10, { fixed: 1 })}`
          self.$acBonusRangePrompt.html(subRebateRangePrompt)

          self.$autoContainer.staticGrid({
            startOnLoading: false,
            height: 210,
            tableClass: 'table table-bordered table-center',
            colModel: [
              {
                label: '序号',
                name: '',
                width: '5%',
                formatter(val, index, info) {
                  return `<span>${index + 1}</span>`
                },
              },
              {
                label: '注册链接',
                name: 'userLinkUrl',
                width: '30%',
                formatter(val, index, info) {
                  let html = `<span class="js-ac-span-link ac-span-link m-right-xs" title="${_(`/register.html?linkId=${val}`).toLink()}">${_(`/register.html?linkId=${val}`).toLink()}</span>`
                  html += '<button type="button" class="js-ac-btn-link-copy btn btn-cool m-right-xs ac-btn-link-copy">复制</button>'
                  html += `<button userLinkUrl="${val}" type="button" class="js-ac-btn-qr-code btn btn-cool ac-btn-qr-code">二维码</button>`
                  return html
                },
              },
              {
                label: '开户类型',
                name: 'userType',
                width: '7%',
                formatter(val, index, info) {
                  return val == 1 ? '玩家' : '代理'
                },
              },
              {
                label: '返点',
                name: 'subAcctRebate',
                width: '7%',
                formatter(val, index, info) {
                  return `<span class="js-ac-auto-subAcctRebate" data-subacctrebate="${val}">${_(val).formatDiv(10, { fixed: 1 })}</span>`
                },
              },
              {
                label: '访问数',
                name: 'viewNum',
                width: '7%',
                formatter(val, index, info) {
                  return val
                },
              },
              {
                label: '注册数',
                name: 'regUserNum',
                width: '7%',
                formatter(val, index, info) {
                  return val
                },
              },
              {
                label: '备注',
                name: 'userLinkDes',
                width: '15%',
                formatter(val, index, info) {
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

          self._parentView.renderLimit(self.$limit, res.root.quotaList)

          self.$autoContainer.find('tbody tr').each((index, item) => {
            self.copyLinkHandler($(item))
          })

          self.$autoContainer.append('<div class="js-qr-code-div-all qr-code-div-all"><div class="js-qr-code-div-all-closeBtn qr-code-div-all-closeBtn"></div></div>')
        }
      })
  },

  // event handlers
  // 新增链接
  addLinkHandler(e) {
    const rebateValidate = this.$acOpenAccountAutoForm.parsley().validate()
    if (!rebateValidate) {
      return
    }

    const self = this
    const $target = $(e.currentTarget)

    $target.button('loading')

    const userType = this.$acUserType.find('button.active').data('type')
    const data = {
      userType,
      rebate: _(this.$acAutoReBate.val()).formatMul(10),
      remark: this.$acAutoRemarkInput.val(),
    }

    $.when(this._parentView.subSubAcctXhr, this.createSubAcctXhr(data))
      .always(() => {
        $target.button('reset')
      })
      .done((infoResList, createResList) => {
        const infoRes = infoResList[0]
        const createRes = createResList[0]
        if (infoRes.result === 0 && createRes.result === 0) {
          const rebateVal = _(createRes.root.rebate).formatDiv(10, { fixed: 1 })
          const row = {
            columnEls: [
              self.$autoContainer.find('tbody tr').length + 1,
              `<span class="js-ac-span-link ac-span-link m-right-xs" title="${_(`/register.html?linkId=${createRes.root.linkId}`).toLink()}">${_(`/register.html?linkId=${createRes.root.linkId}`).toLink()}</span>` +
              '<button type="button" class="js-ac-btn-link-copy btn btn-cool m-right-xs ac-btn-link-copy">复制</button>' +
              `<button userLinkUrl="${createRes.root.linkId}" type="button" class="js-ac-btn-qr-code btn btn-cool ac-btn-qr-code">二维码</button>`,
              userType == 1 ? '玩家' : '代理',
              `<span class="js-ac-auto-subAcctRebate" data-subacctrebate="${createRes.root.rebate}">${rebateVal}</span>`,
              '0',
              '0',
              // _.isEmpty(createRes.root.remark) ?
              //   '<input type="text" class="js-ac-auto-remark ac-auto-remark" data-parsley-maxlength="20" /><span class="js-ac-auto-remark-saveBtn ac-auto-remark-saveBtn"></span>' :
              `<span class="js-ac-span-remark ac-span-remark" title="${createRes.root.remark}">${createRes.root.remark}</span><span class="js-ac-auto-remark-updateBtn ac-auto-remark-updateBtn"></span>`,
              `<span data-userlinkid="${createRes.root.userLinkId}" class="js-ac-link-del ac-link-del"></span>`,
            ],
          }

          self.$autoContainer.staticGrid('addRows', row)
          const $tbodyLastTr = self.$autoContainer.find('tbody tr:last')
          self.copyLinkHandler($tbodyLastTr)
        }
      })
  },

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

  inputRebateHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const range = $target.data('parsleyRange')
    const rebate = Number($target.val())

    if (rebate !== '' && _(rebate).isFinite() && range.length == 2) {
      if (rebate < range[0]) {
        $target.val(range[0])
      } else if (rebate > range[1]) {
        $target.val(range[1])
      }
    } else {
      $target.val(range[0])
    }
  },

  lookBonusViewHandler (e) {
    const $target = $(e.currentTarget)
    const ticket = $target.data('ticket')
    const rebate = Number(this.$('.js-ac-auto-rebate').val())
    if (_(rebate).isNumber() && _(rebate).isFinite()) {
      Global.appRouter.navigate(`#ac/oam/pd/${ticket}?rebate=${rebate}`, { trigger: true, replace: false })
    } else {
      Global.ui.notification.show('请输入有效的返点值。')
    }
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

  hideQrcode (e) {
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

        if (self.$autoContainer.find('.js-gl-static-tr').length == 0) {
          self.$autoContainer.staticGrid('renderEmpty')
        }
      } else {
        Global.ui.notification.show(res.msg)
      }
    })
  },
})

module.exports = OpenAccountManageLinkView
