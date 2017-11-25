

require('./index.scss')
const ToolbarView = require('mallCenter/toolbar')
const giftToolbarConfig = require('./giftToolbarConfig.js')
const PaginationView = require('mallCenter/pagination')
const StatusModule = require('../modules/pickUp/statusModule')

const GiftExchangeView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  itemTpl: _(require('./item.html')).template(),

  emptyTpl: _(require('../index/empty.html')).template(),

  events: {
    'click .js-gift-exchange': 'exchangeHandler',
  },

  options: {
    pageSize: 12,
  },

  initialize () {

  },

  // 获取礼物列表
  getGiftListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/gift/giftList.json',
      data,
    })
  },

  // 兑换礼物
  exchangeGiftXhr (data) {
    return Global.sync.ajax({
      url: '/mall/gift/exchange.json',
      data,
    })
  },

  onRender () {
    const self = this
    this.loadingFinish()
    this.itemType = _.noop()
    this.itemStatus = _.noop()
    this.sortFlag = 3
    this.sortType = 1
    // 分页
    this.$pagination = this.$('.js-mall-gift-pagination')
    this.pagination = new PaginationView({
      pageIndex: 0,
      pageSize: this.options.pageSize,
      maxPaginationNum: 5,
      onPaginationChange (pageIndex) {
        self.fetchCurrentPageData(pageIndex)
      },
      totalSize: 0,
    })

    // 功能列
    this.$toolbar = this.$('.js-mall-gift-toolbar')
    // 渲染功能列
    this.$toolbar.html(new ToolbarView(_.extend(giftToolbarConfig, {
      parent: this,
      pageSize: this.options.pageSize,
    })).on('show:loading', () => {
      self.$container.html(Global.ui.loader.get())
    }).render().el)

    // 礼物列表
    this.$container = this.$('.js-mall-gift-container')

    this.on('gift:updating', (data) => {
      self.itemType = data.itemType
      self.itemStatus = data.itemStatus
      self.sortFlag = data.sortFlag
      self.sortType = data.sortType
      self.pagination.update(data.rowCount, 0)
      self.renderCurrentPage(data.records)
    })

    // 渲染礼物资料
    this.fetchCurrentPageData(0)

    // 渲染分页
    this.$pagination.html(this.pagination.render().el)
  },

  fetchCurrentPageData (pageIndex) {
    const self = this
    self.$container.empty()
    this.getGiftListXhr({
      pageSize: self.options.pageSize,
      pageIndex,
      sortFlag: self.sortFlag, // $('.js-toolbar-sortable').find('span.active').data('flag'),
      itemStatus: self.itemStatus, // $('.js-toolbar-status').find('span.active').data('type'),
      itemType: self.itemType,
      sortType: self.sortType, // $('.js-sort-desc').data('sort-type')
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        if (res && res.result === 0) {
          const data = res.root || {}
          self.pagination.update(data.rowCount, pageIndex)
          self.renderCurrentPage(data.records)
        } else {
          Global.ui.notification.show('加载失败，请稍后再试')
        }
      })
  },

  renderEmptyPage () {
    const self = this
    const emptyHtml = this.emptyTpl({
      type: 'gift',
      msg: '暂无礼物',
      from: 0,
    })
    self.$container.html(emptyHtml)
  },

  renderCurrentPage (itemList) {
    const self = this
    if (itemList.length === 0) {
      self.renderEmptyPage()
      self.$pagination.addClass('hidden')
      return
    }
    self.$pagination.removeClass('hidden')

    const rows = self.generateRows(itemList, 4)

    const itemHtml = _.map(rows, (row) => {
      return `<div class="row">${
        _.map(row, (item) => {
          return self.itemTpl({
            status: item.status, // 状态 (0: 即将开始, 1:立即兑换, 3:已抢完)
            itemId: item.itemId,
            itemName: item.itemName,
            itemDesc: item.itemDesc,
            picUrl: item.picUrl,
            levelLimit: item.levelLimit,
            limitLevelType: item.limitLevelType,
            limitRange: item.limitRange,
            refPrice: _(item.refPrice).formatDiv(10000, {
              fixed: 2,
              clear: true,
            }),
            requireIntegral: _(item.requireIntegral).formatDiv(10000, {
              fixed: 2,
              clear: true,
            }),
            lastNum: _.isNull(item.maxNum) ? null : _(item.maxNum).sub(item.useNum),
          })
        }).join('')}<div class="clearfix"></div></div>`
    })

    self.$container.html(itemHtml)
  },

  generateRows (itemList, rowLength) {
    const rows = []
    let currentRow = []

    _.map(itemList, (item, index) => {
      if (index % rowLength === 0 && index !== 0) {
        rows.push(currentRow)
        currentRow = []
      }
      currentRow.push(item)
    })
    rows.push(currentRow)
    return rows
  },

  setInfoHandler () {
    const self = this
    const $dialog = Global.ui.dialog.show({
      anySize: '500',
      anyPosition: '170',
      body: '<div class="mall-gift-form"></div>',
      bodyClass: 'mc-pick-up-module-body',
    })

    const $container = $dialog.find('.mall-gift-form')
    $container.html(new StatusModule({
      type: 'form',
      status: 0,
      title: '收货信息',
      moneyImg: false,
      seal: false,
      itemId: self.itemId,
      exPhone: self.exPhone,
      exAddr: self.exAddr,
      exName: self.exName,
    }).on('hidden.dialog', () => {
      $dialog.modal('hide')
    }).on('show:myGift', () => {
      self.trigger('show:myGiftTab')
    }).render().el)

    $dialog.on('hidden.modal', function () {
      $(this).remove()
    })

    self.trigger('update:userInfo')
  },

  // 兑换礼物
  exchangeHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    const itemId = $target.data('id')
    self.itemId = itemId
    // 兑换成功 显示原积分 花费积分 等级 折扣
    // 然后弹窗
    // 兑换失败 积分不足 or 已抢光
    this.exchangeGiftXhr({
      itemId,
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        let data = res.root || {}
        let $dialog
        if (res && res.result === 0) {
          data = res.root
          $dialog = Global.ui.dialog.show({
            anySize: '500',
            anyPosition: '210',
            body: '<div class="mc-pk-moll"></div>',
            bodyClass: 'mc-pick-up-module-body',
          })
          const $container = $dialog.find('.mc-pk-moll')
          $container.html(new StatusModule({
            type: 'hint',
            status: 0,
            title: '兑换成功!',
            moneyImg: false,
            seal: false,
            msg: `本次兑换已花费积分${_(data.useIntegral).formatDiv(10000, {
              fixed: 2,
            })}`,
            text: `原积分${_(data.requireIntegral).convert2yuan()}，已享${data.levelName}等级${data.discount / 1000 === 10 ? '' : `${data.discount / 1000}折兑换特权`}`,
          }).render().el)

          $dialog.on('hidden.modal', function () {
            $(this).remove()
          })

          self.exName = data.exName
          self.exAddr = data.exAddr
          self.exPhone = data.exPhone
          self.itemId = data.itemId

          $dialog.off('click.setSendInfo')
            .on('click.setSendInfo', '.js-set-info', () => {
              // 兑换成功填写表单
              self.setInfoHandler()
            })

          self.trigger('update:userInfo')
        } else {
          $dialog = Global.ui.dialog.show({
            anySize: '500',
            anyPosition: '210',
            body: '<div class="mc-pk-moll"></div>',
            bodyClass: 'mc-pick-up-module-body',
          })
          const $pickUpStatus = $dialog.find('.mc-pk-moll')
          $pickUpStatus.html(new StatusModule({
            status: 1,
            moneyImg: false,
            seal: !!res.msg.includes('抢光'),
            title: '兑换失败!',
            msg: res.msg,
          }).render().el)
          $dialog.on('hidden.modal', function () {
            $(this).remove()
          })
        }
      })
  },

})

module.exports = GiftExchangeView
