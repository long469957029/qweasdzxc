

import './index.scss'

const SlotCenterView = Base.ItemView.extend({

  template: require('./index.html'),

  hotGameTpl: _(require('./hotGame.html')).template(),
  rewardTpl: _(require('./reward.html')).template(),

  gameTpl: _(require('./game.html')).template(),

  events: {
    'click .js-type-option': 'tabHandler',
    'keyup .js-sc-search': 'debounceQuery',
    'click .js-sc-game-btn': 'jumpIntoGameHandler',
    'click .js-sc-load-more-btn': 'loadMoreHandler',
    'change .js-channel-select': 'changeTypeHandler',
    'click .js-sc-slot-collect': 'collectHandler',
    'click .js-show-login': 'showLoginHandler',
    'click .js-down-phone': 'showDownPhoneHandler'
  },

  options: {
    pageIndex: 0,
    pageSize:16
  },

  serializeData(){
    return{
      isLogin: this.checkLoginStatus()
    }
  },

  getSummaryXhr() {
    return Global.sync.ajax({
      url: '/fund/balance/summary.json',
    })
  },

  // 前台 - 中奖记录
  getRewardListXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/prizeList.json',
      data,
    })
  },

  getGameListXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/sublist.json',
      data,
    })
  },
  // channelId (0:中心, 1:AG, 2:Ebet, 3:bbin, 4:PT, 5:MG, 6:GG, 7:体育)

  getHotGameListXhr() {
    return Global.sync.ajax({
      url: '/info/indexGameConfig/gameConf.json',
    })
  },

  slotGameCollecteXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/addGameCollection.json',
      data,
    })
  },

  getGameUrlXhr(data) {
    return Global.sync.ajax({
      url: '/info/game/jumpInfo.json',
      data,
      async: false,
    })
  },

  initialize() {
    this.throttleQuery = _.throttle(this.searchHandler.bind(this), 1000, true)
  },

  onRender() {
    const self = this

    self.$ptBalance = self.$('.js-ptBalance')
    self.$mgBalance = self.$('.js-mgBalance')
    self.$hotGames = self.$('.js-hotGames')
    self.$rewardList = self.$('.js-rewardList')
    // self.$slotForm = self.$('.js-sc-slot-form')
    self.$tabContainer = self.$('.js-type-option-container')
    self.$search = self.$('.js-sc-search')
    self.$tab = self.$('.js-type-option')
    self.$loadMore = self.$('.js-sc-load-more')
    self.$empty = self.$('.js-sc-content-empty')
    self.$emptyIcon = self.$('.js-sc-empty-icon')
    self.$emptyText = self.$('.js-sc-empty-text')

    self.$gameList = self.$('.js-sc-content-container')

    self.renderHotGame()
    self.renderRewardList()
    self.renderGameList()
    if(this.checkLoginStatus()) {
      self.renderAmount()
    } else{
      this.subscribe('acct', 'acct:login', () => {
        this.renderAmount()
      })
    }
  },

  debounceQuery() {
    this.throttleQuery()
  },

  checkLoginStatus(){
    if(window.store.getters.getLoginStatus){
      return true
    }
    return false
  },

  renderAmount() {
    const self = this
    self.getSummaryXhr()
      .done((res) => {
        if (res.root && res.result === 0) {
          const { gameBalance } = res.root
          const ptBalance = _.find(gameBalance, { channelId: 4 }).balance
          const mgBalance = _.find(gameBalance, { channelId: 5 }).balance

          self.$ptBalance.html(_(ptBalance).formatDiv(10000, { fixed: 2 }))
          self.$mgBalance.html(_(mgBalance).formatDiv(10000, { fixed: 2 }))
        } else {
          Global.ui.notification.show('获取资金余额失败')
        }
      })
  },

  renderHotGame() {
    const self = this

    self.getHotGameListXhr()
      .done((res) => {
        if (res.root && res.result === 0) {
          const { hotGames } = res.root

          const html = _.map(hotGames, (hotGame) => {
            const img = require(`base/images/game/slot-${hotGame.channelId}-${hotGame.gameCode}.png`)
            return self.hotGameTpl({hotGame,img})
          })

          self.$hotGames.html(html)
        }
      })
  },

  renderRewardList() {
    const self = this

    self.getRewardListXhr({ gameType: 3 })
      .done((res) => {
        if (res.root && res.result === 0) {
          const { records } = res.root

          const html = _.map(records, (record) => {
            return self.rewardTpl(record)
          })

          self.$rewardList.html(html)
          this.rolling()
        }
      })
  },

  rolling() {
    const self = this
    clearInterval(this.$rollTime)
    this.$rollTime = setInterval(() => {
      self.$rewardList.animate({
        top: '-73px',
      }, 1000, () => {
        const $items = self.$rewardList.find('.sc-win-item')
        self.$rewardList.css('top', '0px')
        $items.eq(0).appendTo(self.$rewardList)
      })
    }, 3000)
  },

  changeTypeHandler() {
    const self = this
    self.$tab.each((index, tab) => {
      if (index === 0) {
        $(tab).addClass('active')
        return
      }
      $(tab).removeClass('active')
    })
    self.options.pageIndex = 0
    self.renderGameList()
  },

  searchHandler() {
    const self = this
    const gameName = self.$search.val()
    self.getGameListXhr({ gameName })
      .done((res) => {
        if (res.result === 0 && res.root) {
          const { gameList } = res.root
          if(_.isEmpty(gameList)){
            self.$empty.removeClass('hidden')
            self.$emptyIcon.addClass('search').removeClass('collection')
            self.$emptyText.html(`非常抱歉，未找到与“${gameName}”相关的游戏！`)
            self.$loadMore.addClass('hidden')
            self.$gameList.empty()
          }else{
            self.$empty.addClass('hidden')
            const html = _.chunk(gameList, 4).map((rowItems) => {
              const game = _.map(rowItems, (item) => {
                const img = require(`base/images/game/slot-${item.channelId}-${item.gameCode}.png`)
                return self.gameTpl({item,img})
              }).join('')
              return `<div class="sc-game-row">${game}<div class="clearfix"></div></div>`
            })

            self.$gameList.html(html)
            if(res.root.gameCount < self.options.pageSize) {
              self.$loadMore.addClass('hidden')
            } else {
              self.$loadMore.removeClass('hidden')
            }
          }
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },

  tabHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    self.$tab.each((index, tab) => {
      $(tab).removeClass('active')
    })
    $target.addClass('active')
    self.options.pageIndex = 0
    self.renderGameList()
  },

  getParamsHandler() {
    const self = this
    const type = 3
    const channelId = self.$('.js-channel-select').val()
    const subType = self.$tabContainer.find('.js-type-option.active').data('subtype') || ''
    const collect = self.$tabContainer.find('.js-type-option.active').data('collect') || 0
    const pageSize = this.options.pageSize
    const pageIndex = 0
    return {
      channelId,
      type,
      subType,
      collect,
      pageSize,
      pageIndex,
    }
  },

  renderGameList() {
    const self = this
    const reqData = self.getParamsHandler()
    self.getGameListXhr(reqData)
      .done((res) => {
        if (res.result === 0 && res.root) {
          const { gameList } = res.root
          if(_.isEmpty(gameList) && reqData.collect === 1){
            self.$empty.removeClass('hidden')
            self.$emptyIcon.addClass('collection').removeClass('search')
            self.$emptyText.html('暂无收藏，点击游戏右上角收藏按钮可将常玩的游戏加入收藏呦~')
            self.$loadMore.addClass('hidden')
            self.$gameList.empty()
          }else{
            self.$empty.addClass('hidden')
            const html = _.chunk(gameList, 4).map((rowItems) => {
              const game = _.map(rowItems, (item) => {
                const img = require(`base/images/game/slot-${item.channelId}-${item.gameCode}.png`)
                return self.gameTpl({item,img})
              }).join('')
              return `<div class="sc-game-row">${game}<div class="clearfix"></div></div>`
            })
            self.$gameList.html(html)
            if(res.root.gameCount < self.options.pageSize) {
              self.$loadMore.addClass('hidden')
            } else {
              self.$loadMore.removeClass('hidden')
            }
          }
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },

  jumpIntoGameHandler(e) {
    const self = this
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    // if(type === 1){ // 需要调用免费试玩的接口   暂时还没有  先这么写
    //   Global.ui.notification.show('免费试玩的接口还木有`别着急！')
    // }else{
      if(this.checkLoginStatus()){
        const acctInfo = Global.memoryCache.get('acctInfo')
        if(acctInfo.userType === 2){
          Global.ui.notification.show('试玩账号无法进入该游戏，请先注册正式游戏账号')
        } else{
          if (acctInfo.foundsLock) {
            Global.ui.notification.show('资金已锁定，请先' +
              '<a href="javascript:void(0);" ' +
              'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
              'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
            return false
          }

          const data = {
            token: Global.cookieCache.get('token'),
            gameId: $target.data('game-id'),
            type: $target.data('type'),
            device: 0,
          }
          let resRoot = ''
          this.getGameUrlXhr(data)
            .done((res) => {
              if (res.result === 0) {
                if (res.root && res.root.url && !_.isEmpty(res.root.url)) {
                  resRoot = res.root.url
                }
              }
            })
          window.open(`./game.html?type=${this.options.channelId === 4 ? 3 : 6}&src=${resRoot}`)
        }
      }else{
        this.showLoginHandler()
      }
    // }
  },

  loadMoreHandler() {
    const self = this
    const type = 3
    const channelId = self.$('.js-channel-select').val()
    const subType = self.$tabContainer.find('.js-type-option.active').data('subtype') || ''
    const collect = self.$tabContainer.find('.js-type-option.active').data('collect') || 0
    const pageIndex = self.options.pageIndex + 1
    self.options.pageIndex += 1
    const pageSize = 16

    const data = {
      channelId,
      type,
      subType,
      collect,
      pageSize,
      pageIndex,
    }


    self.getGameListXhr(data)
      .done((res) => {
        if (res.result === 0 && res.root) {
          const { gameList } = res.root
          const html = _.chunk(gameList, 4).map((rowItems) => {
            const game = _.map(rowItems, (item) => {
              const img = require(`base/images/game/slot-${item.channelId}-${item.gameCode}.png`)
              return self.gameTpl({item, img})
            }).join('')
            return `<div class="sc-game-row">${game}<div class="clearfix"></div></div>`
          })
          self.$gameList.append(html)
          if(_(self.options.pageIndex + 1).mul(self.options.pageSize) >= res.root.gameCount) {
            self.$loadMore.addClass('hidden')
          } else {
            self.$loadMore.removeClass('hidden')
          }
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },

  collectHandler(e) {
    if(this.checkLoginStatus()) {
      const $target = $(e.currentTarget)
      const collected = $target.hasClass('liked')
      const gameId = $target.data('id')
      const data = {type: (collected ? '1' : '0'), gameId}
      this.slotGameCollecteXhr(data).done((res) => {
        if (res.result == 0) {
          if (collected) {
            $target.removeClass('liked')
          } else {
            $target.addClass('liked')
          }
        }
      })
    }else{
      this.showLoginHandler()
    }
  },
  showLoginHandler(){
    window.store.commit(types.TOGGLE_LOGIN_DIALOG,true)
  },
  showDownPhoneHandler(){
    Global.ui.notification.show('暂未开放，敬请期待')
  }
})

module.exports = SlotCenterView
