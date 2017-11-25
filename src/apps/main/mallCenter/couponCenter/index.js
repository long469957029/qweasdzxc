

require('./index.scss')
const couponToolbarConfig = require('./couponToolbarConfig.js')
const myCouponToolbarConfig = require('./myCouponToolbarConfig.js')
const couponConfig = require('./couponConfig.js')

const ToolbarView = require('mallCenter/toolbar')
const PaginationView = require('mallCenter/pagination')
const StatusModule = require('../modules/pickUp/statusModule')

const CouponCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  couponTpl: _(require('./coupon.html')).template(),

  emptyTpl: _(require('../index/empty.html')).template(),

  startOnLoading: true,

  events: {
    'click .js-coupon-exchange': 'exchangeHandler',
  },

  options: {
    from: 0, // 0 代表领券中心 1代表我的优惠券
    pageSize: 9,
  },

  // 兑换优惠券
  exchangeCouponXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/exchange.json',
      data,
    })
  },

  // 获取优惠券列表
  getCouponListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/couponList.json',
      data,
    })
  },
  getMyCouponListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/myCouponList.json',
      data,
    })
  },
  serializeData() {
    return {
      loading: Global.ui.loader.get(),
    }
  },
  onRender () {
    const self = this


    // 分页
    this.couponType = _.noop()
    this.couponStatus = _.noop()
    this.sortFlag = 3
    this.sortType = 1
    this.$pagination = this.$('.js-mall-coupon-pagination')
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
    this.$toolbar = this.$('.js-mall-coupon-toolber')
    // 渲染功能列
    this.toolbarView = new ToolbarView(_.extend(this.options.from === 0 ?
      couponToolbarConfig :
      myCouponToolbarConfig, {
      parent: this,
      pageSize: this.options.pageSize,
    })).on('show:loading', () => {
      self.$container.html(Global.ui.loader.get())
    })
    this.$toolbar.html(this.toolbarView.render().el)

    // 优惠券列表
    this.$container = this.$('.js-mall-coupon-container')

    this.on('coupon:updating', (data) => {
      self.couponType = data.couponType
      self.couponStatus = data.couponStatus
      self.sortFlag = data.sortFlag
      self.sortType = data.sortType
      self.pagination.update(data.rowCount, 0)
      self.renderCurrentPage(data.records)
    })
    this.on('myCoupon:updating', (data) => {
      self.couponType = data.couponType
      self.pagination.update(data.rowCount, 0)
      self.renderCurrentPage(data.records)
    })

    // 渲染优惠券资料
    this.fetchCurrentPageData(0)

    this.$pagination.html(this.pagination.render().el)
    // this.loadingFinish();
  },

  // 接收当前页面资料
  fetchCurrentPageData (pageIndex) {
    const self = this
    self.$container.empty()
    if (this.options.from === 0) {
      this.getCouponListXhr({
        pageSize: self.options.pageSize,
        pageIndex,
        sortFlag: self.sortFlag,
        couponStatus: self.couponStatus,
        couponType: self.couponType,
        sortType: self.sortType,
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
    } else {
      this.getMyCouponListXhr({
        pageSize: self.options.pageSize,
        pageIndex,
        sortFlag: self.sortFlag,
        couponStatus: self.couponStatus,
        couponType: self.couponType,
        sortType: self.sortType,
      })
        .always(() => {
          self.loadingFinish()
        })
        .done((res) => {
          if (res && res.result === 0) {
            const data = res.root || {}
            self.pagination.update(data.rowCount, pageIndex)
            self.toolbarView.updateData(data.dataTotal)
            self.renderCurrentPage(data.records)
          } else {
            Global.ui.notification.show('加载失败，请稍后再试')
          }
        })
    }
  },

  renderEmptyPage () {
    const self = this
    const emptyHtml = self.emptyTpl({
      type: 'coupon',
      msg: '暂无优惠券',
      from: self.options.from,
    })
    self.$container.html(emptyHtml)
  },

  // 根据条件渲染每一横排
  generateRows (couponList, rowLength) {
    const rows = []
    let currentRow = []

    _.map(couponList, (coupon, index) => {
      if (index % rowLength === 0 && index !== 0) {
        rows.push(currentRow)
        currentRow = []
      }
      currentRow.push(coupon)
    })
    rows.push(currentRow)
    return rows
  },

  // 渲染整体页面
  renderCurrentPage (couponList) {
    const self = this
    if (couponList.length === 0) {
      self.renderEmptyPage()
      self.$pagination.addClass('hidden')
      return
    }
    self.$pagination.removeClass('hidden')

    const rows = self.generateRows(couponList, 3)
    const couponHtml = _.map(rows, (row) => {
      return `<div class="row">${
        _.map(row, (coupon) => {
          return self.couponTpl({
            from: self.options.from, // 1 我的优惠券 0 优惠券兑换
            couponStatus: coupon.couponStatus || coupon.status || 0, // 0:即将开始, 1:可兑换, 2:已兑换, 3:已抢完
            couponId: coupon.couponId,
            couponType: coupon.couponType,
            // 1充值 blue-green 2加奖 green 3补贴 purple 4返水 blue 5代金 yellow 6现金 red
            couponName: _.findWhere(couponConfig, {
              couponType: coupon.couponType,
            }).name,
            couponToken: coupon.couponToken,
            couponDesc: coupon.couponDesc,
            couponDetailDesc: coupon.couponDetailDesc.replace('\n', '<br>'),
            requireIntegral: _(coupon.requireIntegral).formatDiv(10000, {
              fixed: 2,
              clear: true,
            }),
            validStartDate: _(coupon.validStartDate).toTime('YYYY.MM.DD HH:mm'),
            validEndDate: _(coupon.validEndDate).toTime('YYYY.MM.DD HH:mm'),
            bigShowNum: _(coupon.bigShowNum).formatDiv(coupon.couponBonusType === 1 ? 10000 : 100),
            couponBonusType: coupon.couponBonusType, // 返利类型 (1:直接是元, 2:%)
            levelLimit: coupon.levelLimit, // Lv. 以上
            limitLevelType: coupon.limitLevelType,
            limitRange: coupon.limitRange, // 0: 新手, 1:老手
            styleClass: self.options.from === 0 ? _.findWhere(couponConfig, { //eslint-disable-line
              couponType: coupon.couponType,
            }).styleClass : (coupon.status === 0 ? _.findWhere(couponConfig, {
              couponType: coupon.couponType,
            }).styleClass : 'no'),
            lastNum: (_.isNull(coupon.maxNum) ||
              _.isUndefined(coupon.maxNum)) ?
              null :
              _(coupon.maxNum).sub(coupon.useNum),
          })
        }).join('')}<div class="clearfix"></div></div>`
    })

    self.$container.html(couponHtml)
  },

  // 兑换优惠券
  exchangeHandler (e) {
    const self = this
    const $target = $(e.currentTarget)

    // 兑换成功 显示原积分 花费积分 等级 折扣
    // 兑换失败 积分不足 or 已抢光
    this.exchangeCouponXhr({
      couponId: $target.data('id'),
    })
      .always(() => {
        self.loadingFinish()
      })
      .done((res) => {
        let data = res.root || {}
        let $pickUpStatus
        let $pickDialog
        if (res && res.result === 0) {
          $target.text('已兑换')
          $target.addClass('disabled').removeClass('js-coupon-exchange').attr('disabled')
          data = res.root
          $pickDialog = Global.ui.dialog.show({
            anySize: '500',
            anyPosition: '210',
            body: '<div class="mc-pk-moll"></div>',
            bodyClass: 'mc-pick-up-module-body',
          })
          $pickUpStatus = $pickDialog.find('.mc-pk-moll')
          $pickUpStatus.html(new StatusModule({
            status: 0,
            moneyImg: false,
            seal: false,
            title: '兑换成功!',
            msg: `本次兑换已花费积分${_(data.useIntegral).formatDiv(10000, {
              fixed: 2,
              clear: true,
            })}`,
            text: `原积分${_(data.requireIntegral).convert2yuan()}，已享${data.levelName}等级${data.discount / 1000}折兑换特权`, // (data.discount / 1000 === 10 ? '' : data.discount / 1000 + '折兑换特权')
            showLookBtn: true,
          }).on('show:myCoupon', () => {
            self.trigger('show:myCouponList')
          }).render().el)
          $pickDialog.on('hidden.modal', function() {
            $(this).remove()
          })
          self.trigger('update:userInfo')
        } else {
          $pickDialog = Global.ui.dialog.show({
            anySize: '500',
            anyPosition: '210',
            body: '<div class="mc-pk-moll"></div>',
            bodyClass: 'mc-pick-up-module-body',
          })
          $pickUpStatus = $pickDialog.find('.mc-pk-moll')
          $pickUpStatus.html(new StatusModule({
            status: 1,
            moneyImg: false,
            seal: !!res.msg.includes('抢光'),
            title: '兑换失败!',
            msg: res.msg,
          }).render().el)
          $pickDialog.on('hidden.modal', function() {
            $(this).remove()
          })
        }
      })
  },
})

module.exports = CouponCenterView
