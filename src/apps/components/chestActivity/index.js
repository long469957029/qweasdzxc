

require('./index.scss')

const WinlossView = Base.ItemView.extend({

  template: require('./index.html'),

  rootData: null,

  events: {
    'click .js-description-entry': 'goToDescriptionModalHandler',
    'click .js-treasure': 'getTreasureHandler',
    'click .js-super-entry': 'goToGotModalHandler',
    'click .js-treasure-close': 'closeTreasureModalHandler',

    'click .js-description-get': 'goToGotModalHandler',
    'click .js-description-return': 'closeDescriptionsModalHandler',

    'click .js-got-get': 'getBigTreasureChestHandler',
    'click .js-got-return': 'closeGotModalHandler',

    'click .js-getting-confirm': 'gettingConfirmHandler',


  },


  // 查看活动详细信息接口
  getActivityInfoXhr() {
    return Global.sync.ajax({
      url: '/info/allPeopleChest/info.json',
      async: false,
    })
  },

  // 领取宝箱接口data={chestId:chestId}
  getTreasureChestXhr(data) {
    return Global.sync.ajax({
      url: '/info/allPeopleChest/getChest.json',
      data,
    })
  },

  // 五日大宝箱接口
  getBigChestInfoXhr () {
    return Global.sync.ajax({
      url: '/info/allPeopleChest/bigInfo.json',
    })
  },

  // 前台领取五日宝箱接口
  getBigChestXhr() {
    return Global.sync.ajax({
      url: '/info/allPeopleChest/getBigChest.json',
    })
  },

  initialize() {

  },

  onRender() {
    // this.initTimer();//
    this.$mainContain = this.$('.js-chest-mask')
    this.$descriptionsModal = this.$('.js-descriptions-modal')
    this.$gotModal = this.$('.js-got-modal')
    this.$gettingModal = this.$('.js-getting-modal')
    this.$rate = this.$('.js-rate')
    this.$gotTreasure = this.$('.js-got-treasure')
    this.$superTreasure = this.$('.js-super-treasure')
    this.$Amount = this.$('.js-amount')
    this.$Integral = this.$('.js-integral')
    this.$getSuper = this.$('.js-got-get')
    this.initPage()// 初始化页面
  },

  // 初始化页面,获取数据展示当前状态
  initPage() {
    this.initData()
    if (!this.Data) {
      return
    }
    // 控制节点显示状态
    if (this.ifShow) {
      this.$mainContain.removeClass('hidden')
    } else {
      this.$mainContain.addClass('hidden')
    }
    // 初始化宝箱状态
    this.initTreasureChesStatus()
    // 初始化活动描述
    this.initActivityDescription()
    // 初始化大包厢进度
    this.initBigChestProgress()
  },
  initTreasureChesStatus() {
    // 初始化进度条比例
    const self = this
    const currentIntegral = this.Data.currentIntegral
    const confList = this.Data.chestConfigList
    let stop = false
    if (confList && confList.length == 5) {
      const maxIntegral = confList[4].integral
      let progress = _(currentIntegral).chain().mul(100).div(maxIntegral)
        .value()
      //
      _(confList).chain().sortBy((item) => {
        return item.chestId
      }).each((item) => {
        const chestId = item.chestId
        const integral = item.integral
        const status = item.status
        const baseRate = 10
        const $target = self.$('.js-treasure').eq(chestId - 1)
        self.$('.js-sc-tcc-integral').eq(chestId - 1).html(`${Math.floor(_(currentIntegral).div(10000)).toFixed(0)}/${Math.floor(_(integral).div(10000)).toFixed(0)}`)
        // 进度条显示数据准备
        // 显示进度的长度比例时比较粗糙，如果大于某个级别，那么默认进度条显示在一个超出当前级别的的固定位置，等于则显示在另一个固定位置。
        if (!stop) {
          if (currentIntegral < integral) {
            stop = true
            if (chestId == 1) {
              if (currentIntegral == 0) {
                progress = 0
              } else {
                progress = baseRate
              }
            } else {
              progress = baseRate + (15 * (chestId - 1))
            }
          } else if (currentIntegral == integral) {
            stop = true
            progress = 15 * chestId
          } else if (currentIntegral > integral) {
            if (chestId == 5) {
              stop = true
              progress = 80
            }
          }
        }
        self.$('.js-treasure-progress').css('width', `${progress}%`)

        // 宝箱状态处理
        if (status == 0) {
          // 未开启
          $target.removeClass('shake-slow ')
          $target.removeClass('shake-constant')
          $target.removeClass('shake-constant--hover')
          $target.removeClass('click-me').removeClass(`treasure-${chestId}-opened`).addClass(`treasure-${chestId}-closed`)
        } else if (status == 1) {
          // 未开启
          $target.addClass('click-me').removeClass(`treasure-${chestId}-opened`).addClass(`treasure-${chestId}-closed`)
          // 颤抖起来
          $target.addClass(' shake-slow shake-constant shake-constant--hover')
        } else {
          // 已开启
          $target.removeClass('shake-slow ')
          $target.removeClass('shake-constant')
          $target.removeClass('shake-constant--hover')
          $target.removeClass('click-me').addClass(`treasure-${chestId}-opened`).removeClass(`treasure-${chestId}-closed`)
        }
      })
    } else {
      // 配置与活动不匹配
      
    }
  },
  initActivityDescription() {
    const self = this
    // 展示转换比例
    _(this.Data.betActiveConfigList).each((item, index) => {
      self.$rate.eq(index).html(`${item.bet} ： ${item.active}`)
    })
  },
  initBigChestProgress() {
    const self = this
    this.BigTreasureCanOpen = false 

    // 展示每日宝箱最高纪录，以及大宝箱状态
    this.getBigChestInfoXhr().done((res) => {
      if (res.result == 0) {
        _(res.root.chestList).each((item, index) => {
          if (item != null) {
            self.$gotTreasure.eq(index).children().addClass(`treasure-grade-${item}`).removeClass('treasure-interrogation')
            // self.BigTreasureCanOpen = true;
          } else {
            self.$gotTreasure.eq(index).children().addClass('treasure-interrogation').removeClass(`treasure-grade-${item}`)
            // self.BigTreasureCanOpen = false;
          }
        })
        // if(self.BigTreasureCanOpen){
        if (res.root.bigChestStatus == 0) {
          self.BigTreasureCanOpen = false
          self.$superTreasure.children().removeClass('treasure-grade-6-opened')
          self.$superTreasure.children().addClass('treasure-grade-6-closed')
          self.$getSuper.addClass('got-disabled')
        } else if (res.root.bigChestStatus == 1) {
          self.BigTreasureCanOpen = true
          self.$superTreasure.children().removeClass('treasure-grade-6-opened')
          self.$superTreasure.children().addClass('treasure-grade-6-closed')
          // self.$superTreasure.addClass('shake-chunk shake-constant shake-constant--hover');
          self.$getSuper.removeClass('got-disabled')
        } else {
          self.BigTreasureCanOpen = false
          self.$superTreasure.children().addClass(' treasure-grade-6-opened')
          self.$superTreasure.children().removeClass('treasure-grade-6-closed')
          self.$getSuper.addClass('got-disabled')
        }


        // }
      }
    })
  },
  /**
   * 获取并缓存活动数据公共方法，同步调用
   * @param callback
   */
  initData(callback) {
    const self = this
    self.ifShow = false// false;true;
    this.getActivityInfoXhr().done((res) => {
      if (res.result == 0) {
        const fromDate = moment(res.root.fromDate)
        const endDate = moment(res.root.endDate)
        const now = moment(res.root.nowTime)
        self.ifShow = now.isBetween(fromDate, endDate, null, '[]')// 当前是否在活动时间
        self.Data = res.root
        callback && callback()
      }
    })
  },


  // TODO 请求活动起止时间的信息，当前时间在活动时间期间则显示图标
  checkState($target) {
    const self = this
    let $dialog = null
    this.initData()
    if (self.ifShow) {
      $dialog = self.render().$el
      $target.css('display', 'block')
    } else {
      $target.remove()
    }
    $target.css('display', 'block')
    const acctInfo = Global.memoryCache.get('acctInfo')
    let flag = false
    if (acctInfo.isFirstLoginToday && self.ifShow) {
      flag = true
    }
    return { $dialog, dialogParent: '.js-chest-mask', isShow: flag }
  },
  getTreasureHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const id = $target.data('id')
    const data = { chestId: id }
    if (!$target.hasClass('click-me')) {
      return 
    }
    this.getTreasureChestXhr(data).done((res) => {
      if (res.result == 0) {
        $target.removeClass('shake-slow ')
        $target.removeClass('shake-constant')
        $target.removeClass('shake-constant--hover')
        $target.removeClass('click-me')
        $target.addClass(`treasure-${id}-opened`)
        $target.removeClass(`treasure-${id}-closed`)

        self.showGettingModal(true, _(Math.floor(_(res.root.amount || 0).div(100))).div(100), _(Math.floor(_(res.root.integral || 0).div(100))).div(100))
      } else {
        Global.ui.notification.show(`领取失败！${res.msg}`)
      }
    })
  },

  closeTreasureModalHandler(e) {
    this.destroy()
  },

  goToDescriptionModalHandler(e) {
    this.$gettingModal.toggleClass('hidden', true)
    this.$gotModal.toggleClass('hidden', true)
    this.$descriptionsModal.toggleClass('hidden')
  },
  closeDescriptionsModalHandler(e) {
    this.$descriptionsModal.toggleClass('hidden', true)
  },

  goToGotModalHandler(e) {
    if (this.$gotModal.hasClass('hidden')) {
      this.initBigChestProgress()
    }
    this.$gettingModal.toggleClass('hidden', true)
    this.$descriptionsModal.toggleClass('hidden', true)
    this.$gotModal.toggleClass('hidden')
  },
  closeGotModalHandler(e) {
    this.$gotModal.toggleClass('hidden', true)
  },
  showGettingModal(show, amount, integral, vip) {
    if (vip) {
      this.$gettingModal.addClass('getting-modal-vip')
    } else {
      this.$gettingModal.removeClass('getting-modal-vip')
    }
    if (!show) {
      this.$gettingModal.toggleClass('hidden', true)
    } else {
      this.$gettingModal.toggleClass('hidden', false)
      this.$Amount.html(`${amount}元`)
      this.$Integral.html(`${integral}点`)
    }
  },

  getBigTreasureChestHandler(e) {
    const self = this
    if (!this.BigTreasureCanOpen) {
      return 
    }
    this.getBigChestXhr().done((res) => {
      if (res.result == 0) {
        self.$superTreasure.removeClass('shake-chunk ')
        self.$superTreasure.removeClass('shake-constant')
        self.$superTreasure.removeClass('shake-constant--hover')
        self.$superTreasure.removeClass('click-me')
        self.$superTreasure.children().addClass('treasure-grade-6-opened')
        self.$superTreasure.children().removeClass('treasure-grade-6-closed')
        self.$getSuper.addClass('got-disabled')
        self.showGettingModal(true, _(Math.floor(_(res.root.amount || 0).div(100))).div(100), _(Math.floor(_(res.root.integral || 0).div(100))).div(100), true)
      } else {
        Global.ui.notification.show(`领取失败！${res.msg}`)
      }
    })
  },
  gettingConfirmHandler(e) {
    this.$gettingModal.toggleClass('hidden', true)
  },

})
module.exports = WinlossView
