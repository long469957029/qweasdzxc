

import './index.scss'

const SlotCenterView = Base.ItemView.extend({

  template: require('slotCenter/index.html'),

  hotGameTpl: _(require('slotCenter/hotGame.html')).template(),
  rewardTpl: _(require('slotCenter/reward.html')).template(),

  gameTpl: _(require('slotCenter/game.html')).template(),

  events: {
    'click .js-type-option': 'tabHandler',
    'keyup .js-sc-search': 'debounceQuery',
    'click .js-sc-game-btn': 'jumpIntoGameHandler',
    'click .js-sc-load-more-btn': 'loadMoreHandler',
    'change .js-channel-select': 'changeTypeHandler',
  },

  options: {
    pageIndex: 0,
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

  initialize() {
    this.throttleQuery = _.throttle(this.searchHandler.bind(this), 1000, true)
  },

  onRender() {
    const self = this

    self.$ptBalance = self.$('.js-ptBalance')
    self.$mgBalance = self.$('.js-mgBalance')
    self.$hotGames = self.$('.js-hotGames')
    self.$rewardList = self.$('.js-rewardList')
    self.$slotForm = self.$('.js-sc-slot-form')
    self.$tabContainer = self.$('.js-type-option-container')
    self.$search = self.$('.js-sc-search')
    self.$tab = self.$('.js-type-option')

    self.$gameList = self.$('.js-sc-content-container')

    self.renderHotGame()
    self.renderRewardList()
    self.renderGameList()

    self.renderAmount()
  },

  debounceQuery() {
    this.throttleQuery()
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
          Global.ui.notification.show('获取资金馀额失败')
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
            return self.hotGameTpl(hotGame)
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
      if (index === 5) {
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
          const html = _.chunk(gameList, 4).map((rowItems) => {
            const game = _.map(rowItems, (item) => {
              return self.gameTpl(item)
            }).join('')
            return `<div class="sc-game-row">${game}<div class="clearfix"></div></div>`
          })

          self.$gameList.html(html)
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
    const pageSize = 16
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
          const html = _.chunk(gameList, 4).map((rowItems) => {
            const game = _.map(rowItems, (item) => {
              return self.gameTpl(item)
            }).join('')
            return `<div class="sc-game-row">${game}<div class="clearfix"></div></div>`
          })

          self.$gameList.html(html)
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },

  jumpIntoGameHandler(e) {
    const self = this
    self.acctInfo = Global.memoryCache.get('acctInfo')
    if (this.acctInfo.foundsLock) {
      Global.ui.notification.show('资金已锁定，请先' +
        '<a href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
        'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>。')
      return false
    }
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    const gameId = $target.data('game-id')

    this.$('.js-sc-gameId').val(gameId)
    this.$('.js-sc-token').val(Global.cookieCache.get('token'))
    this.$('.js-sc-type').val(type)

    self.$slotForm.submit()
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
              return self.gameTpl(item)
            }).join('')
            return `<div class="sc-game-row">${game}<div class="clearfix"></div></div>`
          })

          self.$gameList.append(html)
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },

})

module.exports = SlotCenterView
