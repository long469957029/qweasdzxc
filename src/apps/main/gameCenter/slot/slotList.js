

const PersonalManageView = Base.ItemView.extend({

  template: require('gameCenter/slot/slotList.html'),
  gameListTpl: require('gameCenter/slot/slotList-gemeTpl.html'),

  startOnLoading: true,

  events: {
    'submit .js-uc-personalManage-form': 'updatePersonalInfoHandler',
    'click .js-gc-slot-entry-desc': 'jumpIntoGameHandler',
    'click .js-gc-slot-type-item': 'subTypeChangeHandler',
    'click .js-gc-slot-collect': 'collectHandler',
  },
  collectHandler(e) {
    const $target = $(e.currentTarget)
    const collected = $target.hasClass('sfa-slot-tab-collected')
    const gameId = $target.data('id')
    const data = { type: (collected ? '1' : '0'), gameId }
    this.slotGameCollecteXhr(data).done((res) => {
      if (res.result == 0) {
        $target.removeClass(collected ? 'sfa-slot-tab-collected' : 'sfa-slot-tab-collect').addClass(collected ? 'sfa-slot-tab-collect' : 'sfa-slot-tab-collected')
      } else {

      }
    })
  },
  subTypeChangeHandler(e) {
    const $target = $(e.currentTarget)
    $target.addClass('active').siblings().removeClass('active')
    const subType = $target.data('subtype')
    this.getGameListBySubType({
      channelId: this.options.channelId, type: 3, subType, collect: (this.options.collect == undefined ? '0' : this.options.collect), 
    })
  },
  slotGameCollecteXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/addGameCollection.json',
      data,
    })
  },
  slotGameListGetXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/sublist.json',
      data,
    })
  },
  slotGameListQueryXhr(data) {
    return Global.sync.ajax({
      url: '/ticket/game/sublist.json',
      data,
    })
  },
  onRender() {
    if (this.options.channelId !== undefined || this.options.collect !== undefined) {
      const subType = this.options.subType || 1
      this.$(`.js-gc-slot-type-ul[data="${this.options.subType}"]`).addClass('active').siblings().removeClass('active')
      this.$('.js-gc-slot-type-container').toggleClass('hidden', !!this.options.collect)
      this.getGameListBySubType({
        channelId: (this.options.channelId == undefined ? '' : this.options.channelId),
        type: 3,
        subType,
        collect: (this.options.collect == undefined ? '0' : this.options.collect),
      })
    } else {
      this.$('.js-gc-slot-type-ul').addClass('hidden')
      this.$('.js-gc-slot-notice').removeClass('hidden')
      this.$('.js-gc-slot-num').html(0)
      this.$('.js-gc-slot-queryString').html(this.options.queryString)

      this.getGameListByQueryString({ type: 3, gameName: this.options.queryString })
    }
  },
  getGameListByQueryString(data) {
    const self = this
    this.slotGameListGetXhr(data).always(() => {
      self.loadingFinish()
    })
      .done((res) => {
        if (res && res.result === 0) {
          self.$('.js-gc-slot-num').html(res.root.gameList.length)
          self.initGamePage(res.root)
        } else {
          Global.ui.notification.show('查找游戏失败')
        }
      })
  },
  getGameListBySubType(data) {
    const self = this
    this.slotGameListGetXhr(data).always(() => {
      self.loadingFinish()
    })
      .done((res) => {
        if (res && res.result === 0) {
          self.initGamePage(res.root)
        } else {
          Global.ui.notification.show('获取游戏列表失败')
        }
      })
  },

  initGamePage(root) {
    const self = this
    this.$('.js-gc-slot-game-list').html(_(this.gameListTpl).template()({ gameList: root.gameList, channelId: this.options.channelId }))
    // this.$('.js-gc-slot-pagination').pagination({
    //   pageIndex: this.options.pageIndex||1,
    //   pageSize: 15,
    //   totalSize: root.totalSize,
    //   maxPaginationNum: _(root.totalRow).div(15),
    //   onPaginationChange: function(e){
    //     var pageIndex = $(e.currentTarget).data('index');
    //     self.options.pageIndex = pageIndex;
    //     self.render();
    //   }
    // });
  },
  jumpIntoGameHandler(e) {
    this.acctInfo = Global.memoryCache.get('acctInfo')
    if (this.acctInfo.foundsLock) {
      Global.ui.notification.show('资金已锁定，请先' + '<a href="javascript:void(0);" ' +
        'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
        'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>' + '。')
      return false
    }
    const $target = $(e.currentTarget)
    const type = $target.data('type')
    this.$('.js-gc-slot-gameId').val($target.data('id'))
    this.$('.js-gc-slot-token').val(Global.cookieCache.get('token'))
    this.$('.js-gc-slot-type').val(type)
    const $form = this.$('.js-gc-slot-form')
    $form.submit()
  },

})

module.exports = PersonalManageView
