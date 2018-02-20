require('./index.scss')

const NavsView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-db-nav-scroll': 'navScrollToggleHandler',
    'mouseenter .js-nav-ticket-list': 'navMouseenterrInHandler',
    'mouseleave .js-nav-ticket-list': 'navmouseLeaveHandler',
    'mouseleave .js-nav-game-type': 'gameTypeLeaveHandler',
    'click .js-nav-channel-btn': 'jumpGamePageHandler',
    'click .js-navbar-tab': 'tabEffectHandler',
  },

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

  tabEffectHandler(e) {
    const self = this
    const $target = $(e.currentTarget)

    self.$('.js-navbar-nav').find('.js-navbar-tab').each((index, tab) => {
      $(tab).removeClass('active')
    })
    $target.addClass('active')

    const tabIndex = parseInt($target.closest('li').data('index'), 10)

    if (tabIndex === 0) {
      this.$underLine.addClass('hidden')
    } else {
      this.$underLine.removeClass('hidden')
      this.$underLine.animate({
        left: `${196 + (tabIndex - 1) * 99}px`,
      })
    }
  },

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
      Global.ui.notification.show('暂未开放，敬请期待！<br/><br/>', {id: 'ticketNotice', hasFooter: false, displayTime: 1000})
      return false
    }
    if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
      Global.ui.notification.show('试玩会员无法进行充值操作，请先注册正式游戏账号')
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
                  Global.router.goTo('gc/sc', {trigger: false})
                } else if (channelId === 5) {
                  Global.router.goTo('gc/scmg', {trigger: false})
                }
              } else {
                flag = true
                return true
              }
            } else if (item.status === 1) {
              Global.ui.notification.show(
                '当前游戏处于关闭状态，您可以尝试其他游戏！<br/><br/>',
                {id: 'ticketNotice', hasFooter: false, displayTime: 1000},
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


  serializeData () {
    this.acctInfo = Global.memoryCache.get('acctInfo')
    let agencyMenuIndex = null
    const beginTicketList = ticketConfig.getBeginlist()
    this.options.navbar = _(this.options.navbar).map((menu, index) => {
      // 0是代理，1是玩家，玩家不显示代理中心
      // if (self.acctInfo.userType === 1) {
      if (menu.first && menu.first === 'ac/llm') {
        agencyMenuIndex = index
      }
      if (menu.router === 'newDownload.html') {
        menu.router = 'newDownload.html?t=player'
      }
      // }

      if (window.location.hash && !menu.router) {
        menu.isActive = false
      } else {
        menu.isActive = window.location.hash.indexOf(menu.router) !== -1
      }

      let platformTransferMenuIndex = null
      if (menu.sub) {
        menu.sub = _(menu.sub).map((subMenu, subindex) => {
          // 0是代理，1是玩家，玩家不显示平台转账
          // if (self.acctInfo.userType === 1 && subMenu.router && subMenu.router === 'fc/pt') {
          if (subMenu.router && subMenu.router === 'fc/pt') {
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

  onRender () {
    const self = this
    this.$navMain = this.$('.js-db-nav-main')

    this.$navScrollBtn = this.$('.js-db-nav-scroll')

    this.$ticketDropdown = this.$('.js-gl-h-ticket-div')

    this.$navSubtogglo = this.$('.nav-sub')

    this.$navMallSubList = this.$('.js-nav-mall-sub-list')

    this.$underLine = this.$('.js-navbar-slide-underline')

    this.$navTicket = this.$('.js-nav-ticket')

    Global.m.subscribe('ticketId', 'ticketId:updating', function(data){
      const id = _.isUndefined(data) ? 10 : data.id
      $('.js-nav-ticket').removeAttr('href').attr('href',`#/bc/0/${id}`)
    })
  },
  // common APIs

  isShow () {
    return !this.$navScrollBtn.hasClass('down')
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
})

module.exports = NavsView
