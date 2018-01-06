

require('./index.scss')

const SignUserView = Base.ItemView.extend({

  template: require('./index.html'),

  // officialAgreementTpl: _(require('./../official-agreement.html')).template(),

  events: {
    'click .js-ac-dm-su-ticket-add': 'addTicketRowHandler',
    'click .js-ac-dm-su-ticket-subtraction': 'subTicketRowHandler',
    'click .js-ac-dm-su-game-add': 'addGameRowHandler',
    'click .js-ac-dm-su-game-subtraction': 'subGameRowHandler',
    'change .js-ac-dm-su-check': 'changeAgreeHandler',
    'click .js-ac-dm-su-agree': 'confirmHandler',
    'click .js-ac-dm-su-cancel': 'cancelHandler',
  },

  signXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/savesubagreedividdetail.json',
      data,
      tradition: true,
    })
  },

  verifyXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/valid.json',
      data,
    })
  },
  _getQuotaXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/quota.json',
      data,
    })
  },
  _getSubAgreementXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/subagreedividdetail.json',
      data,
    })
  },
  _getMyAgreementXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/myDividStandardInfo.json',
      data,
    })
  },

  serializeData() {
    return this.options
  },

  onRender() {
    const self = this
    // 彩票grid
    this.$ticketGrid = this.$('.js-ac-dm-su-ticket-grid')
    this.$betTotal = this.$('.js-ac-dm-su-ticket-betTotal')
    this.$ticketDivid = this.$('.js-ac-dm-su-ticket-divid')
    this.$ticketAdd = this.$('.js-ac-dm-su-ticket-add')
    this.$ticketSub = this.$('.js-ac-dm-su-ticket-subtraction')
    this.$ticketIndent = this.$('.js-ac-dm-su-ticket-indent')
    // 游戏grid
    this.$gameGrid = this.$('.js-ac-dm-su-game-grid')
    this.$profitTotal = this.$('.js-ac-dm-su-game-profitTotal')
    this.$activeUser = this.$('.js-ac-dm-su-game-activeUser')
    this.$gameDivid = this.$('.js-ac-dm-su-game-divid')
    this.$gameAdd = this.$('.js-ac-dm-su-game-add')
    this.$gameSub = this.$('.js-ac-dm-su-game-subtraction')
    this.$gameIndent = this.$('.js-ac-dm-su-game-indent')
    // 公共
    this.$userName = this.$('input[name=username]')
    this.$agreement = this.$('.js-ac-dm-su-agreement')
    this.$btnNext = this.$('.js-ac-dm-su-agree')
    this.$form = this.$('.js-ac-signed-form')
    this.$form.parsley()


    window.ParsleyExtend.addAsyncValidator('accheckusername', function(xhr) {
      const valid = xhr.responseJSON.result === 0

      this.$element.parsley().domOptions.remoteMessage = xhr.responseJSON.msg || ''

      return valid
    }, '/fund/divid/valid.json')


    this.initPageStatus()
  },
  initPageStatus() {
    const self = this
    const operationStatus = _.getUrlParam('operationStatus')
    const agreeId = _.getUrlParam('agreeId')
    const username = _.getUrlParam('username')
    switch (operationStatus) {
      case '1': // 修改
        this._getSubAgreementXhr({ agreeId })
          .done((res) => {
            if (res.result === 0) {
              self.options.edit = true
              // if(res.root.dividBetCfgList && res.root.dividBetCfgList.length > 0) {
              self.$ticketIndent.removeClass('hidden')
              self._getTicketTable(res.root.dividBetCfgList)
              // }
              // if(res.root.otherGameDividCfgList && res.root.otherGameDividCfgList.length > 0) {
              self.$gameIndent.removeClass('hidden')
              self._getGameTable(res.root.otherGameDividCfgList)
              // }
              self.$agreement.val(res.root.agreement)
            }
          })
        this._initQuota()
        this.$('.js-ac-dm-su-notice').addClass('hidden')
        this.$('.js-ac-dm-su-username-div').addClass('hidden')
        this.$userName.val(username)
        this.$userName.attr('readonly', true)
        break
      case '2': // 查看
        this._getSubAgreementXhr({ agreeId })
          .done((res) => {
            if (res.result === 0) {
              if (res.root.dividBetCfgList && res.root.dividBetCfgList.length > 0) {
                self.$ticketIndent.removeClass('hidden')
                self._getTicketTable(res.root.dividBetCfgList)
              }
              if (res.root.otherGameDividCfgList && res.root.otherGameDividCfgList.length > 0) {
                self.$gameIndent.removeClass('hidden')
                self._getGameTable(res.root.otherGameDividCfgList)
              }
              self._initInputStatus()
              self.$agreement.val(res.root.agreement)
            }
          })
        // this._initQuota();
        this.$('.js-ac-dm-su-confirm-dev').addClass('hidden')
        break
      case '3': // 查看自己
        this._getMyAgreementXhr().done((res) => {
          if (res.result === 0) {
            if (res.root.dividBetCfgList && res.root.dividBetCfgList.length > 0) {
              self.$ticketIndent.removeClass('hidden')
              self._getTicketTable(res.root.dividBetCfgList)
            }
            if (res.root.otherGameDividCfgList && res.root.otherGameDividCfgList.length > 0) {
              self.$gameIndent.removeClass('hidden')
              self._getGameTable(res.root.otherGameDividCfgList)
            }
            self.$agreement.val(res.root.agreement)
          }
        })
        this._initInputStatus()
        this.$('.js-ac-dm-su-username-div').addClass('hidden')
        this.$('.js-ac-dm-su-confirm-dev').addClass('hidden')
        break
      default: // 添加
        if (this.options.dividBetCfgList || this.options.otherGameDividCfgList) {
          if (this.options.dividBetCfgList && this.options.dividBetCfgList.length > 0) {
            self.$ticketIndent.removeClass('hidden')
            self._getTicketTable(this.options.dividBetCfgList)
          }
          if (this.options.otherGameDividCfgList && this.options.otherGameDividCfgList.length > 0) {
            self.$gameIndent.removeClass('hidden')
            self._getGameTable(this.options.otherGameDividCfgList)
          }
          self.$('.js-ac-dm-su-countdown-div').removeClass('hidden')
          this._initInputStatus()
          this.$('.js-ac-dm-su-username-div').addClass('hidden')
          this.$('.js-ac-dm-su-confirm-dev').addClass('hidden')

          break
        } else {
          self.$ticketIndent.removeClass('hidden')
          self.$gameIndent.removeClass('hidden')
          this._initQuota()

          self._getTicketTable([])
          self._getGameTable([])
          break
        }
    }
  },
  _initQuota() {
    const self = this
    this._getQuotaXhr().done((res) => {
      if (res.result === 0) {
        self._parentView.setUserManageData(res.root)
      }
    })
  },
  _initInputStatus() {
    this.$('.js-ac-dm-su-notice').addClass('hidden')
    this.$('.js-ac-dm-su-username-div').addClass('hidden')
    // this.$('.js-ac-dm-su-notice').addClass('hidden');
    this.$userName.attr('readonly', true)
    this.$('.js-ac-dm-su-ticket-betTotal').attr('readonly', true)
    this.$('.js-ac-dm-su-ticket-divid').attr('readonly', true)
    this.$('.js-ac-dm-su-game-profitTotal').attr('readonly', true)
    this.$('.js-ac-dm-su-game-activeUser').attr('readonly', true)
    this.$('.js-ac-dm-su-game-divid').attr('readonly', true)
    this.$ticketAdd.addClass('hidden')
    this.$ticketSub.addClass('hidden')
    this.$gameAdd.addClass('hidden')
    this.$gameSub.addClass('hidden')
  },
  // 获取表格
  _getTicketTable (rebateList) {
    if (this.TicketGrid) {
      this.TicketGrid.destroy()
    }
    this.TicketGrid = this.$ticketGrid.staticGrid({
      startOnLoading: false,
      // height: 80,
      tableClass: 'table table-bordered table-center',
      colModel: [
        { label: '序号', name: 'no', width: 90 },
        { label: '日量标准', name: 'betTotal', width: 399 },
        { label: '分红比例', name: 'divid', width: 399 },
      ],
      emptyTip: false,
      row: this._formatTicketData(rebateList || []),
    }).staticGrid('instance')
  },
  _formatTicketData(rebateList) {
    const self = this
    this.TicketRowIndex = 1
    if (this.options.edit) {
      return _(rebateList).map((item) => {
        return self._generateTicketRowData(item)
      })
    }
    return _(rebateList).map((item, index) => {
      return {
        no: index + 1,
        betTotal: `≥${_(item.betTotal).convert2yuan()}元/日`,
        divid: `${_(item.divid).formatDiv(100)}%`,
      }
    })
  },
  addTicketRowHandler() {
    const rowData = this._generateTicketRowData({})
    this.TicketGrid.addRows([rowData])
  },
  _generateTicketRowData(item) {
    return {
      no: this.TicketRowIndex += 1,
      betTotal: `≥<div class="inline-block"><input  type="text" class="js-ac-dm-su-ticket-betTotal ac-dm-su-input" value="${
        _(item.betTotal || '').convert2yuan()}"   required data-parsley-twoDecimal  ></div>元/日`,
      divid: `<div class="inline-block"><input  type="text" class="js-ac-dm-su-ticket-divid ac-dm-su-input" value="${_(item.divid).formatDiv(100) || ''}"   
        required data-parsley-twoDecimal data-parsley-range="[0,100]" ></div>% <div class="js-ac-dm-su-ticket-subtraction ac-dm-su-subtraction   "><span class="sfa sfa-ac-dm-su-sub"></span></div>`,
    }
  },
  subTicketRowHandler(e) {
    const $tr = $(e.currentTarget).closest('tr')
    if ($tr.next().length > 0) {
      Global.ui.notification.show('请从一条开始删除!')
      return
    }
    this.TicketRowIndex -= 1
    $tr.remove()
  },

  // 获取表格
  _getGameTable (rebateList) {
    if (this.GameGrid) {
      this.GameGrid.destroy()
    }

    this.GameGrid = this.$gameGrid.staticGrid({
      startOnLoading: false,
      // height: 80,
      tableClass: 'table table-bordered table-center',
      colModel: [
        { label: '序号', name: 'no', width: 90 },
        { label: '亏损要求', name: 'profitTotal', width: 310 },
        { label: '活跃要求', name: 'activeUser', width: 264 },
        { label: '分红比例', name: 'divid', width: 224 },
      ],
      emptyTip: false,
      row: this._formatGameData(rebateList || []),
    }).staticGrid('instance')
  },
  _formatGameData(rebateList) {
    const self = this
    this.GameRowIndex = 1
    if (this.options.edit) {
      return _(rebateList).map((item) => {
        return self._generateGameRowData(item)
        // return self.addGameRowHandler(item);
      })
    }
    return _(rebateList).map((item, index) => {
      return {
        no: index + 1,
        profitTotal: `≥${_(item.profitTotal).convert2yuan()}元`,
        activeUser: `≥${item.activeUser}人/月`,
        divid: `${_(item.divid).formatDiv(100)}%`,
      }
    })
  },
  addGameRowHandler() {
    const rowData = this._generateGameRowData({})
    this.GameGrid.addRows([rowData])
  },
  _generateGameRowData(item) {
    return {
      no: this.GameRowIndex++,
      profitTotal: `≥<div class="inline-block"><input type="text" class="js-ac-dm-su-game-profitTotal ac-dm-su-input" value="${_(item.profitTotal || '').convert2yuan()}" 
        required data-parsley-twoDecimal  ></div>元/月`,
      activeUser: `≥<div class="inline-block"><input type="text" class="js-ac-dm-su-game-activeUser ac-dm-su-input" value="${item.activeUser || ''}" required data-parsley-type="integer" ></div>人/月`,
      divid: `<div class="inline-block"><input  type="text" class="js-ac-dm-su-game-divid ac-dm-su-input" value="${_(item.divid || '').formatDiv(100)}"  
        required data-parsley-twoDecimal data-parsley-range="[0,100]" ></div>%<div class="js-ac-dm-su-game-subtraction ac-dm-su-subtraction "><span class="sfa sfa-ac-dm-su-sub"></span></div>`,
    }
  },
  subGameRowHandler(e) {
    const $tr = $(e.currentTarget).closest('tr')
    if ($tr.next().length > 0) {
      Global.ui.notification.show('请从一条开始删除!')
      return
    }
    this.GameRowIndex -= 1
    $tr.remove()
  },

  changeAgreeHandler(e) {
    const $target = $(e.currentTarget)
    this.$btnNext.prop('disabled', !$target.prop('checked'))
    this.$btnNext.removeClass('disable')
  },

  confirmHandler() {
    const self = this
    const $btnConfirm = this.$('.js-ac-dm-su-agree')
    const $form = this.$('.js-ac-dm-su-form')

    const username = this.$userName.val()
    if (username === '' || username === undefined || username == null) {
      Global.ui.notification.show('请先输入需要签约的下级用户名!')
      return
    }
    const dividBetCfgList = this._getTicketCfgList()
    const otherGameDividCfgList = this._getGameCfgList()
    if (_(dividBetCfgList).size() === 0 && _(otherGameDividCfgList).size() === 0) {
      Global.ui.notification.show('请先添加签约内容!')
      return
    }
    const validate = $form.parsley().validate()
    if (!validate) {
      return false
    }
    $btnConfirm.button('loading')
    const agree = this.$agreement.val()
    const data = {
      userName: username,
      dividBetCfgList,
      otherGameDividCfgList,
      agreement: agree,
    }
    this.signXhr(data)
      .always(() => {
        $btnConfirm.button('reset')
      })
      .done((res) => {
        if (res && res.result === 0) {
          Global.ui.notification.show('操作成功！<br/>等待下级同意签约。')
          self.render()
        } else {
          Global.ui.notification.show(res.msg || '')
        }
      })
  },
  _getTicketCfgList() {
    const self = this
    return _(this.$('.js-ac-dm-su-ticket-betTotal')).map((item, index) => {
      return {
        betTotal: $(item).val(),
        divid: self.$('.js-ac-dm-su-ticket-divid').eq(index).val(),
      }
    })
  },
  _getGameCfgList() {
    const self = this
    return _(this.$('.js-ac-dm-su-game-profitTotal')).map((item, index) => {
      return {
        profitTotal: $(item).val(),
        activeUser: self.$('.js-ac-dm-su-game-activeUser').eq(index).val(),
        divid: self.$('.js-ac-dm-su-game-divid').eq(index).val(),
      }
    })
  },
  cancelHandler() {
    this.render()
  },

})

module.exports = SignUserView
