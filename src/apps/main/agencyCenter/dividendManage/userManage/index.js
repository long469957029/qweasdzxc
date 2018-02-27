

const SearchGrid = require('com/searchGrid')

const TicketSelectGroup = require('com/ticketSelectGroup')

import Timeset from 'com/timeset'

const ReportManageView = SearchGrid.extend({

  template: require('./index.html'),

  events: {
    'click .js-ac-dm-um-del': 'delSignRecordHandler',
    'click .js-ac-dm-um-break': 'breakSignHandler',
    'click .js-ac-dm-um-log': 'showLogHandler',
    'click .js-popover-close': 'closePopoverHandler',
  },

  _getQuotaXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/quota.json',
      data,
    })
  },

  delSignRecordHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const agreeId = $target.data('agreeid')
    const userId = $target.data('userid')
    const username = $target.data('username')
    $(document).confirm({
      content: `<div class="m-TB-lg">确定删除与${username}的签约记录？</div>`,
      type: 'exit',
      agreeCallback() {
        self.delSignRecordXhr({ userId }).done((res) => {
          if (res.result === 0) {
            Global.ui.notification.show('删除成功！。')
          } else {
            Global.ui.notification.show('删除失败！')
          }
        })
      },
    })
  },
  breakSignHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const agreeId = $target.data('agreeid')
    const userId = $target.data('userid')
    const username = $target.data('username')
    $(document).confirm({
      content: `<div class="m-TB-lg">确定解除与${username}的签约？</div>`,
      type: 'exit',
      agreeCallback() {
        // Global.ui.confirm()
        self.breakOffXhr({ userId }).done((res) => {
          if (res.result === 0) {
            Global.ui.notification.show('解约成功！')
          } else {
            Global.ui.notification.show('解约成功！')
          }
        })
      },
    })
  },
  breakOffXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/cancel.json',
      data,
    })
  },
  delSignRecordXhr(data) {
    return Global.sync.ajax({
      url: '/fund/divid/cancel.json',
      data,
    })
  },
  getLogXhr (data) {
    return Global.sync.ajax({
      url: '/fund/divid/sublog.json',
      data,
    })
  },
  initialize () {
    _(this.options).extend({
      height: 552,
      title: '签约用户管理',
      tableClass: 'table table-bordered table-center border-bottom',
      columns: [
        {
          name: '签约用户',
          width: '15%',
        },
        {
          name: '创建时间',
          width: '15%',
        },
        {
          name: '协议生效日',
          width: '15%',
        },
        {
          name: '状态',
          width: '10%',
        },
        {
          name: '最近记录',
          width: '15%',
        },
        {
          name: '操作',
          width: '20%',
        },
      ],
      // tip: '<div class="tip-hot"><span>提示</span>报表只保留最近35天的数据。</div>',
      gridOps: {
        emptyTip: '没有记录',
      },
      reqData: {
        pageSize: 12,
      },
      ajaxOps: {
        url: '/fund/divid/findsublist.json',
      },
    })
  },

  onRender () {
    const self = this
    this._getQuotaXhr()
      .done((res) => {
        if (res.result === 0) {
          self._parentView.setUserManageData(res.root)
        }
      })
    SearchGrid.prototype.onRender.apply(this, arguments)
  },

  renderGrid(gridData) {
    const rowsData = _(gridData.usbUserList).map(function(fundTrace, index, betList) {
      return {
        columnEls: this.formatRowData(fundTrace, index, betList),
        dataAttr: fundTrace,
      }
    }, this)

    this.grid.refreshRowData(rowsData, gridData.rowCount, {
      pageIndex: this.filterHelper.get('pageIndex'),
      initPagination: false,
    })

    if (!_(gridData.parents).isEmpty()) {
      this._breadList = _(gridData.parents).map((parent) => {
        return {
          data: {
            userId: parent.userId,
          },
          label: parent.userName,
        }
      })
      this.renderBread()
    }
    this.$('.js-ac-dm-um-log').popover({
      trigger: 'click',
      container: this.$el,
      html: true,
      content: `${'<div class="ac-log-main">' +
      '<div class="ac-log-header">' +
      '<span>最近记录</span>' +
      '<a class="close js-popover-close btn-close">&times;</a>' +
      '</div>' +
      '<div class="js-ac-log-container ac-log-container">'}${Global.ui.loader.get()}</div>` +
      '</div>',
      placement: 'left',
    })
    this.grid.hideLoading()
  },

  formatRowData(rowInfo) {
    const row = []
    row.push(rowInfo.username)
    row.push(_(rowInfo.agreeDate).formatTime())
    row.push(rowInfo.effectDay === '-' ? '-' : _(rowInfo.effectDay).formatTime())
    // 0: 待签约
    // 1: 签约中
    // 2: 未签约
    // 3: 已解约
    let status = ''
    const operation = [
      [
        `<a class="btn btn-link router" href="#/ac/sum/am?operationStatus=2&agreeId=${rowInfo.agreeId}&username=${rowInfo.username}">查看</a>`,
      ],
      [
        `<a class="btn btn-link router" href="#/ac/sum/am?operationStatus=2&agreeId=${rowInfo.agreeId}&username=${rowInfo.username}">查看</a>`,
        `<a class="btn btn-link router" href="#/ac/sum/am?operationStatus=1&agreeId=${rowInfo.agreeId}&username=${rowInfo.username}">修改</a>`,
        `<a class="btn btn-link js-ac-dm-um-break" href="javascript:void(0);" data-agreeId="${rowInfo.agreeId}" data-userId="${rowInfo.userId}" data-username="${rowInfo.username}">解约</a>`,
      ],
      [
        `<a class="btn btn-link router" href="#/ac/sum/am?operationStatus=2&agreeId=${rowInfo.agreeId}&username=${rowInfo.username}">查看</a>`,
        `<a class="btn btn-link router" href="#/ac/sum/am?operationStatus=1&agreeId=${rowInfo.agreeId}&username=${rowInfo.username}">重新签约</a>`,
        // '<a class="btn btn-link js-ac-dm-um-del " href="javascript:void(0);" data-agreeId="'+rowInfo.agreeId+'" data-userId="'+ rowInfo.userId +'" data-username="'+rowInfo.username+'">删除</a>'
      ],
    ]
    let operationsIndex = 0
    switch (rowInfo.status) {
      case 0: status = '待签约'
        operationsIndex = 0
        break
      case 1: status = '签约中'
        operationsIndex = 1
        break
      case 2: status = '未签约'
        operationsIndex = 2
        break
      case 3: status = '已解约'
        operationsIndex = 2
        break
      default:
        break
    }
    if (rowInfo.readOnly) { // 版本更新前一天操作的部分数据无法准确获取准确状态，可能会传此属性为true,
      operationsIndex = 0
    }
    row.push(status)
    // 1:发起签约, 2:下级同意签约, 3:上级修改协议, 5:下级同意修改,
    //   6:下级拒绝修改, 7:修改确认过期, 8:申请解约, 9:解约未通过,
    //   10:签约过期, 11:下级拒绝签约, 12:解约通过
    let statusDetail = ''
    switch (rowInfo.statusDetail) {
      case 0: statusDetail = ''; break
      case 1: statusDetail = '发起签约'; break
      case 2: statusDetail = '下级同意签约'; break
      case 3: statusDetail = '上级修改协议'; break

      case 5: statusDetail = '下级同意修改'; break
      case 6: statusDetail = '下级拒绝修改'; break
      case 7: statusDetail = '修改确认过期'; break
      case 8: statusDetail = '申请解约'; break
      case 9: statusDetail = '解约未通过'; break
      case 10: statusDetail = '签约过期'; break
      case 11: statusDetail = '下级拒绝签约'; break
      case 12: statusDetail = '解约通过'; break
      default: break
    }
    row.push(`<span class="m-right-sm">${statusDetail}</span>
      <a class="js-ac-dm-um-log ac-dm-um-log" data-agreeId="${rowInfo.agreeId}" data-userId="${rowInfo.userId}" data-username="${rowInfo.username}"></a>`)
    row.push(operation[operationsIndex].join(''))
    return row
  },

  modifyHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const data = this.grid.getRowData($target)

    const $dialog = Global.ui.dialog.show({
      title: '修改签约分红',
      body: '<div class="js-ac-add-container"></div>',
      size: 'modal-lg',
      footer: '',
    })

    const $container = $dialog.find('.js-ac-add-container')

    const signedView = new SignedView({
      el: $container,
      dividConf: this._parentView.dividConf,
      userData: data,
    })
      .render()
      .on('hide', () => {
        self.$grid.staticGrid('update')
        $dialog.modal('hide')
      })

    $dialog.on('hidden.modal', function() {
      $(this).remove()
      signedView.destroy()
    })
  },
  breakOffHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const data = this.grid.getRowData($target)

    const $dialog = Global.ui.dialog.show({
      title: '提示',
      body: `${'<form class="js-ac-break-off ac-break-off no-margin" action="javascript:void(0)">' +
      '<p class="js-ac-detail text-bold-pleasant">您确定要解约与'}${data.username}的分红关系？` +
      '请确保您的余额可以完成本次分红，否则会解约失败。</p><div class="dot-divider dot-divider-md"></div>' +
      '<p>请说明原因：</p><textarea class="js-ac-remark" required maxlength="200"></textarea>' +
      '<div class="controls control-confirm text-center">' +
      '<button class="js-ac-break-confirm btn btn-pleasant">确定</button>' +
      '</div>' +
      '</form>',
      footer: '',
    })

    const $remark = $dialog.find('.js-ac-remark')
    const $btnConfirm = $dialog.find('.js-ac-break-confirm')

    $dialog.find('.js-ac-break-off').parsley()

    $dialog.on('hidden.modal', function() {
      $(this).remove()
    })

    $dialog.on('submit', '.js-ac-break-off', () => {
      // const $target = $(e.currentTarget)

      $btnConfirm.button('loading')

      self.breakOffXhr({
        userId: data.userId,
        remark: _($remark.val()).escape(),
      })
        .always(() => {
          $btnConfirm.button('reset')
        })
        .done((res) => {
          if (res && res.result === 0) {
            Global.ui.notification.show('操作成功！等待审核。')
            self.$grid.staticGrid('update')
            $dialog.modal('hide')
          } else {
            Global.ui.notification.show(res.msg || '')
          }
        })
    })
  },
  // reSignHandler(e) {
  //
  // },
  // delSignRecord(e) {
  //
  // },
  showLogHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    // const agreeId = $target.data('agreeid')
    const userId = $target.data('userid')
    // const username = $target.data('username')
    this.getLogXhr({ userId })
      .done((res) => {
        if (res.result === 0) {
          self.showLogDialog(res.root)
        } else {
          Global.ui.notification.show('查询日志失败')
        }
      })
      .fail(() => {
        Global.ui.notification.show('查询日志失败')
      })
  },
  showLogDialog (data) {
    if (this.TicketGrid) {
      this.TicketGrid.destroy()
    }
    this.TicketGrid = this.$('.js-ac-log-container').staticGrid({
      startOnLoading: false,
      height: 128,
      showHeader: false,
      tableClass: 'table table-bordered table-center',
      hasBorder: false,
      colModel: [
        {
          label: '',
          name: 'desc',
          width: '50%',
          formatter(val) {
            return val
          },
        },
        {
          label: '',
          name: 'createTime"',
          width: '50%',
          formatter(val, index, info) {
            return _(info.createTime).toTime()
          },
        },
      ],
      emptyTip: false,
      row: data,
    }).staticGrid('instance')
  },
  closePopoverHandler() {
    this.$('.js-ac-dm-um-log').popover('hide')
  },
})

module.exports = ReportManageView
