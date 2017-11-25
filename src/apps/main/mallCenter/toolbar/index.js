

require('./index.scss')

const ToolbarView = Base.ItemView.extend({

  template: require('./index.html'),

  startOnLoading: true,

  events: {
    'click .js-toolbar-option': 'queryHandler',
    'click .js-ticket-search': 'searchTicketHandler',
    'click .js-toolbar-dropdown-btn': 'dropdownHandler',
  },

  initialize (options) {
    this.parent = options.parent
  },

  serializeData () {
    // 根据传进来的参数决定要渲染哪一个区块 以下是以我的优惠券作为预设模版
    const options = _.defaults(this.options, {
      page: 'myCoupon', // 领券中心页面 myGift: 我的礼物兑换记录页面 gift: 礼物兑换页面
      type: { // 查询类型选项
        title: '券类型',
        limit: 4, // 第五个之后的都放入"更多"的下拉选单
        options: [{
          type: null,
          name: '全部',
        }, {
          type: 1,
          name: '充值券',
        }, {
          type: 2,
          name: '加奖券',
        }, {
          type: 3,
          name: '补贴券',
        }, {
          type: 4,
          name: '返水券',
        }, {
          type: 5,
          name: '代金券',
        }, {
          type: 6,
          name: '现金券',
        }],
      },
      status: { // 查询状态选项
        title: '状态',
        options: [{
          status: 1,
          name: '未使用',
          color: 'red',
        },
        {
          status: 2,
          name: '已使用',
          color: 'blue',
        },
        {
          status: 3,
          name: '已过期',
          color: 'gray',
        },
        {
          status: null,
          name: '全部',
        },
        ],
        showAmount: true, // 判断是否显示数量
      },
      sortable: false, // 是否显示排序功能
      search: true, // 是否显示搜寻框功能
    })
    return options
  },

  // 礼物查询功能
  giftListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/gift/giftList.json',
      data,
    })
  },

  // 我的礼物兑换记录查询功能
  myGiftListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/gift/myGiftList.json',
      data,
    })
  },

  // 领券中心查询功能
  couponListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/couponList.json',
      data,
    })
  },

  // 我的优惠券查询功能
  myCouponListXhr (data) {
    return Global.sync.ajax({
      url: '/mall/coupon/myCouponList.json',
      data,
    })
  },

  onRender () {
    const self = this
    this.loadingFinish()

    self.$page = this.$('.js-mall-page')
    self.$searchbar = this.$('.js-toolbar-searchbar')
    this.$noUse = this.$('.js-toolbar-option-red')
    this.$hasUse = this.$('.js-toolbar-option-blue')
    this.$expired = this.$('.js-toolbar-option-gray')

    this.$mallChevronDef = this.$('.js-mall-chevron-def')
    this.$mallChevronDown = this.$('.js-mall-chevron-down')
    this.$mallChevronUp = this.$('.js-mall-chevron-up')
  },

  queryHandler (e) {
    const self = this
    const $target = $(e.currentTarget)
    this.trigger('show:loading')
    $target.closest('.js-toolbar-container').find('.js-toolbar-option').each((i, dom) => {
      $(dom).removeClass('active')
      $(dom).find('.sfa-mall-arrow-down-black').removeClass('hidden')
      $(dom).find('.sfa-mall-arrow-down-white').addClass('hidden')
      $(dom).find('.sfa-mall-arrow-down-up').addClass('hidden')
    })
    $('.js-toolbar-dropdown').addClass('hidden')

    // 排序按钮样式
    if ($target.data('flag') === 2) {
      this.$mallChevronDef.addClass('hidden')
      if ($target.find('.sfa-mall-chevron-down').hasClass('hidden')) {
        $target.find('.sfa-mall-chevron-down').removeClass('hidden')
        $target.find('.sfa-mall-chevron-up').addClass('hidden')
        $target.data('sort-type', 1) // 设为倒序
      } else {
        $target.find('.sfa-mall-chevron-down').addClass('hidden')
        $target.find('.sfa-mall-chevron-up').removeClass('hidden')
        $target.data('sort-type', 0) // 设为正序
      }
    } else if (!this.$('.js-toolbar-option[data-sort-type]').hasClass('active')) {
      this.$mallChevronDef.removeClass('hidden')
      this.$mallChevronDown.addClass('hidden')
      this.$mallChevronUp.addClass('hidden')
    }

    $target.addClass('active')
    $target.find('.sfa-mall-arrow-down-black').addClass('hidden')
    $target.find('.sfa-mall-arrow-down-white').removeClass('hidden')

    const currentPage = self.$page.val() // 领券中心 我的礼物兑换记录 礼物兑换 ...
    const type = $('.js-toolbar-option.active[data-type]').data('type') // 根据页面不同 可能是券类别 礼物类别
    const status = $('.js-toolbar-option.active[data-status]').data('status') // 根据页面不同 可能是券状态 礼物状态
    const flag = $('.js-toolbar-option.active[data-flag]').data('flag') // 热门 所需积分 上架时间
    const token = self.$searchbar.val() // 礼物编号

    // 0正序，1倒序
    const sortType = $('.js-toolbar-option[data-sort-type]').data('sort-type')
    switch (currentPage) {
      case 'coupon':
        self.couponListXhr({
          couponType: type,
          couponStatus: status,
          sortFlag: flag,
          sortType,
          pageSize: self.options.pageSize,
          pageIndex: 0,
        }).done((res) => {
          if (res && res.result === 0) {
            let data = res.root
            data = _(data).extend({
              couponType: type, couponStatus: status, sortFlag: flag, sortType,
            })
            self.parent.trigger('coupon:updating', data)
          } else {
            Global.ui.notification.show('数据请求失败')
          }
        })
        break
      case 'gift':
        self.giftListXhr({
          itemType: type,
          itemStatus: status,
          sortFlag: flag,
          sortType,
          pageSize: self.options.pageSize,
          pageIndex: 0,
        }).done((res) => {
          if (res && res.result === 0) {
            let data = res.root
            data = _(data).extend({
              itemType: type, itemStatus: status, sortFlag: flag, sortType,
            })
            self.parent.trigger('gift:updating', data)
          } else {
            Global.ui.notification.show('数据请求失败')
          }
        })
        break
      case 'myGift':
        self.myGiftListXhr({
          itemType: type,
          itemStatus: status,
          itemToken: token,
        }).done((res) => {
          if (res && res.result === 0) {
            const data = res.root
            self.parent.trigger('myGift:updating', data)
          } else {
            Global.ui.notification.show('数据请求失败')
          }
        })
        break
      case 'myCoupon':
        self.myCouponListXhr({
          couponType: type,
          couponStatus: status,
          couponToken: token,
          pageSize: self.options.pageSize,
          pageIndex: 0,
        }).done((res) => {
          if (res && res.result === 0) {
            let data = res.root
            self.$noUse.html(`(${res.root.dataTotal.noUseCount})`)
            self.$hasUse.html(`(${res.root.dataTotal.useCount})`)
            self.$expired.html(`(${res.root.dataTotal.expireCount})`)
            data = _(data).extend({ couponType: type, couponStatus: status })
            self.parent.trigger('myCoupon:updating', data)
          } else {
            Global.ui.notification.show('数据请求失败')
          }
        })
        break
    }
  },

  dropdownHandler () {
    const self = this
    if ($('.js-toolbar-dropdown').hasClass('hidden')) {
      $('.js-toolbar-dropdown').removeClass('hidden')
    } else {
      $('.js-toolbar-dropdown').addClass('hidden')
    }
  },
  updateData (data) {
    this.$noUse.html(`(${data.noUseCount})`)
    this.$hasUse.html(`(${data.useCount})`)
    this.$expired.html(`(${data.expireCount})`)
  },
})

module.exports = ToolbarView
