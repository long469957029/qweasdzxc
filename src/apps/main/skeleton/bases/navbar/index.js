

require('./index.scss')

const ticketConfig = require('skeleton/misc/ticketConfig')

const NavsView = Base.ItemView.extend({

  template: require('./index.html'),
  // gameTemplate: require('./game-temp.html'),

  events: {
    'click .js-db-nav-scroll': 'navScrollToggleHandler',
    'mouseenter .js-nav-ticket-list': 'navMouseenterrInHandler',
    'mouseleave .js-nav-ticket-list': 'navmouseLeaveHandler',
    // 'mouseleave .nav-sub': 'outTicketSelectHandler',
    // 'mouseenter .js-nav-game-type': 'gameTypeEnterHandler',
    'mouseleave .js-nav-game-type': 'gameTypeLeaveHandler',
    // 'click .js-nav-channel-item': 'channelItemClickHandler',
    'click .js-nav-channel-btn': 'jumpGamePageHandler',
    'click .nav-sub a': 'ckSubHanler',
    'mouseenter .js-nav-mall': 'navMallMouseenterrInHandler',
    'mouseleave .js-nav-mall': 'navMallmouseLeaveHandler',
    'mouseleave .js-nav-mall-sub': 'outMallSelectHandler',
  },
  // gameTypeEnterHandler(e) {
  //   const $target = $(e.currentTarget)
  //   const $gameContainer = $target.find('.js-nav-channel-container')
  //   $gameContainer.toggleClass('hidden', false)
  // },
  // gameTypeLeaveHandler(e) {
  //   const $target = $(e.currentTarget)
  //   const $gameContainer = $target.find('.js-nav-channel-container')
  //   $gameContainer.toggleClass('hidden', true)
  // },

  // type:1, // 游戏类型：1真人，2体育，3老虎机，4捕鱼
  // channelId:1, // 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
  // mStart:133333333, // 维护开始时间
  // mEnd:14444444,  // 维护结束时间
  // status:0 // 状态：0开启，1关闭，2维护中
  getGameListXhr (data) {
    return Global.sync.ajax({
      url: '/ticket/game/list.json',
      data,
      async: false,
    })
  },

  // channelItemClickHandler(e) {
  //   const $target = $(e.currentTarget)
  //   if ($target.find('.js-nav-channel-btn')[0]) {
  //     $target.find('.js-nav-channel-btn').trigger('click')
  //   } else {
  //     $target.find('.js-nav-link').trigger('click')
  //   }
  //   return false
  // },
  jumpGamePageHandler(e) {
    e.stopPropagation()
    e.preventDefault()
    const self = this
    const $target = $(e.currentTarget)
    $target.closest('.js-nav-channel-container').toggleClass('hidden', true)
    const type = $target.data('type')
    const channelId = $target.data('id')
    const gameId = $target.data('gameid')
    let flag = false

    if (channelId === 7) { // 体育的点击节点在nav中
      Global.ui.notification.show('暂未开放，敬请期待！<br/><br/>', { id: 'ticketNotice', hasFooter: false, displayTime: 1000 })
      return false
    }

    this.getGameListXhr().done((res) => {
      if (res.result === 0) {
        self.gameList = res.root
        _(res.root).find((item) => {
          if (item.channelId === channelId && item.type === type) {
            if (item.status === 0) {
              if (item.fundLock) {
                Global.ui.notification.show('资金已锁定，请先<a href="javascript:void(0);" ' +
                  'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
                  'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
                return false
              }
              if (type === 3) { // 老虎机进入游戏选择页
                if (channelId === 4) {
                  Global.router.goTo('gc/sc', { trigger: false })
                } else if (channelId === 5) {
                  Global.router.goTo('gc/scmg', { trigger: false })
                }
              } else {
                flag = true
                return true
              }
            } else if (item.status === 1) {
              Global.ui.notification.show(
                '当前游戏处于关闭状态，您可以尝试其他游戏！<br/><br/>',
                { id: 'ticketNotice', hasFooter: false, displayTime: 1000 },
              )
            } else if (item.status === 2) {
              Global.ui.notification.show(`平台官方维护中，维护时间：${
                _(item.mStart).toTime()}至${_(item.mEnd).toTime()}`)// ,{displayTime:2000}
            }
          }
          return false
        })
      }
    })
    if (flag) {
      const $form = self.$('.js-nav-form')
      self.$('.js-nav-form-game-id').val(gameId)
      self.$('.js-nav-form-token').val(Global.cookieCache.get('token'))
      $form.submit()
    }
  },


  initialize() {
    // this._lastId = null;
  },

  serializeData () {
    const self = this
    this.acctInfo = Global.memoryCache.get('acctInfo')
    let agencyMenuIndex = null
    const beginTicketList = ticketConfig.getBeginlist()
    this.options.navbar = _(this.options.navbar).map((menu, index) => {
      // 0是代理，1是玩家，玩家不显示代理中心
      if (self.acctInfo.userType === 1) {
        if (menu.first && menu.first === 'ac/llm') {
          agencyMenuIndex = index
        }
        if (menu.router === 'newDownload.html') {
          menu.router = 'newDownload.html?t=player'
        }
      }

      if (window.location.hash && !menu.router) {
        menu.isActive = false
      } else {
        menu.isActive = window.location.hash.indexOf(menu.router) !== -1
      }

      let platformTransferMenuIndex = null
      if (menu.sub) {
        menu.sub = _(menu.sub).map((subMenu, subindex) => {
          // 0是代理，1是玩家，玩家不显示平台转账
          if (self.acctInfo.userType === 1 && subMenu.router && subMenu.router === 'fc/pt') {
            platformTransferMenuIndex = subindex
          }

          if (window.location.hash && !subMenu.router) {
            subMenu.isActive = false
          } else {
            subMenu.isActive = window.location.hash.indexOf(subMenu.router) !== -1
          }

          return subMenu
        })

        if (platformTransferMenuIndex) {
          menu.sub.splice(platformTransferMenuIndex, 1)
        }
      }

      return menu
    })

    if (agencyMenuIndex) {
      this.options.navbar.splice(agencyMenuIndex, 1)
    }

    return {
      navbar: this.options.navbar,
      classicTicketList: beginTicketList.classic, // 彩票投注 经典模式
      handicapTicketList: beginTicketList.handicap, // 彩票投注 盘口模式
    }
  },
  getHotListXhr () {
    return Global.sync.ajax({
      url: '/mall/coupon/newItemList.json',
    })
  },
  onRender () {
    this.$navMain = this.$('.js-db-nav-main')

    this.$navScrollBtn = this.$('.js-db-nav-scroll')

    this.$ticketDropdown = this.$('.js-gl-h-ticket-div')

    this.$navSubtogglo = this.$('.nav-sub')

    this.$navMallSub = this.$('.js-nav-mall-sub')

    this.$navMallSubList = this.$('.js-nav-mall-sub-list')

    this.showMallList = false // 接口如果没有返回值或者报错 将不显示下拉

    this.formateMallEntryList()
  },
  formateMallEntryList () {
    const self = this
    this.getHotListXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.root) {
            self.showMallList = true
            const list = _(res.root.records).map((item) => {
              const {
                limitLevelType,
                levelLimit,
                limitRange,
                name,
                requireIntegral,
                couponDesc,
                couponType,
              } = item
              let infoExclusive = ''
              if (!_.isNull(levelLimit)
                && limitRange !== 0
                && limitRange !== 1
                && limitRange !== 2) {
                if (limitLevelType === 0) {
                  infoExclusive = `<span class="info-exclusive">Lv.${levelLimit}用户专享</span>`
                } else {
                  infoExclusive = `<span class="info-exclusive">Lv.${levelLimit}用户以上</span>`
                }
              }
              if (limitRange === 0) {
                infoExclusive = '<span class="info-exclusive">新用户专享</span>'
              } else if (limitRange === 1) {
                infoExclusive = '<span class="info-exclusive">老用户专享</span>'
              } else if (limitRange === 2) {
                infoExclusive = '<span class="info-exclusive">总代专享</span>'
              }
              const type = couponType === 0 ? 1 : 0
              const icon = couponType === 0 ? 'gift' : 'cou'
              return `${'<li>' +
                '<span class="mall-icon mall-entry-'}${icon}"></span>` +
                '<div class="mall-info">' +
                '<div class="clearfix info-text">' +
                `<span class="pull-left font-sm m-top-xs">${name}${infoExclusive}</span>` +
                `<span class="pull-right info-integral font-sm">${_(requireIntegral).convert2yuan()}积分</span>` +
                '</div>' +
                '<div class="clearfix info-text ">' +
                `<span class="pull-left font-xs info-text-desc" title="${couponDesc}">${couponDesc}</span>` +
                '<span class="pull-right">' +
                `<a href="#ma?type=${type}" class="info-btn font-xs" target="_blank">立即去抢</a>` +
                '</span>' +
                '</div>' +
                '</div>' +
                '</li>'
            })
            self.$navMallSubList.html(list.join(''))
          }
        }
      })
  },
  // generateGameMenu: function(gameList){
  //   var self = this;
  //   var $channelList = this.$('.js-nav-channel-list');
  //   var thirdPartGameMenu = _(this.options.navbar).filter(function(menu){
  //     return menu.thirdPartGame;
  //   });
  //   _(gameList).each(function(game){
  //     var type = game.type;
  //     var channelId = game.channelId;
  //
  //     self.$('.js-nav-channel-list[type='+type+']').append(self.gameTemplate())
  //   });
  //
  // },

  // common APIs

  isShow () {
    return !this.$navScrollBtn.hasClass('down')
  },

  showScroll () {
    this.$navScrollBtn.removeClass('hidden')
  },

  hideScroll () {
    this.$navScrollBtn.addClass('hidden')
  },

  // event handlers

  navScrollToggleHandler (e) {
    const $target = $(e.currentTarget)
    if ($target.hasClass('down')) {
      this.$navMain.removeClass('hidden')
    } else {
      this.$navMain.addClass('hidden')
    }
    $target.toggleClass('down')
  },
  navMouseenterrInHandler () {
    this.$navSubtogglo.css('display', 'block')
  },
  navmouseLeaveHandler (e) {
    if (e.clientY < 90) {
      this.$navSubtogglo.css('display', 'none')
    }
  },
  outTicketSelectHandler () {
    this.$navSubtogglo.css('display', 'none')
  },
  ckSubHanler () {
    this.$navSubtogglo.css('display', 'none')
  },
  navMallMouseenterrInHandler () {
    if (this.showMallList) {
      this.$navMallSub.removeClass('hidden')
    }
  },
  navMallmouseLeaveHandler (e) {
    if (e.clientY < 90) {
      this.$navMallSub.addClass('hidden')
    }
  },
  outMallSelectHandler () {
    this.$navMallSub.addClass('hidden')
  },
})

module.exports = NavsView
