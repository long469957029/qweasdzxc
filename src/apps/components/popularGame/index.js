/**
 * Created by dean on 2017/8/28.
 */


require('./index.scss')

const PopularGameView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {
    'click .js-close-btn-user': 'userCloseHandler',
    'click .js-close-btn-game': 'gameCloseHandler',
    'click .js-betting-btn': 'modelCloseHandler',
    'click .js-close-btn-mall': 'closeMallNoticeHandler',
  },
  getPopularInfoXHR () {
    return Global.sync.ajax({
      url: '/info/recentData/betInfo.json',
    })
  },
  getGameListXhr (data) {
    return Global.sync.ajax({
      url: '/ticket/game/list.json',
      data,
      async: false,
    })
  },
  getMallNoticeXhr () {
    return Global.sync.ajax({
      url: '/mall/notice/list.json',
    })
  },
  initialize () {
    const self = this
    $('body').append(self.render().$el)
  },
  onRender () {
    const self = this
    self.$pgGame1 = this.$('.js-pg-game1')
    self.$pgGame2 = this.$('.js-pg-game2')
    self.$userNum = this.$('.js-player-num')
    self.newUserTicket = this.$('.js-new-ticket-name')
    self.newUserHotType = this.$('.js-hot-play-type')
    self.$beforeGame = this.$('.js-before-game')
    self.$gameNameType = this.$('.js-game-name-type')
    self.$gameName = this.$('.js-game-name')
    self.$beUserTicket = this.$('.js-be-ticket-name')
    self.beUserHotType = this.$('.js-be-play-type')
    this.$mallNotice = this.$('.js-mall-notice')
    this.$mallNoticeTitle = this.$('.js-mall-notice-title')
    this.$mallNoticeContent = this.$('.js-mall-notice-content')
    this.isShowGame = false
    this.mallNoticeList = []
    this.mallNoticeNum = 0
    this.localStorageList = []
    this.showMallNotice()
    setInterval(() => {
      self.showMallNotice()
    }, 60000)
    this.storage = new Base.Storage({
      name: 'mallNotice',
      type: 'local',
    })
    this.userId = Global.memoryCache.get('acctInfo').userId
    this.localStorageList = _.isNull(this.storage.get(`${this.userId}mallNoticeList`)) ? [] : this.storage.get(`${this.userId}mallNoticeList`)
  },
  showMallNotice () {
    const self = this
    this.getMallNoticeXhr()
      .done((res) => {
        if (res.result === 0) {
          if (res.result === 0 && res.root && !_.isEmpty(res.root)) {
            self.mallNoticeList = res.root.records
            self.$mallNotice.removeClass('hidden')
            self.showMallNoticeInfo()
          } else {
            self.showGameInfo()
          }
        }
      })
      .fail(() => {
        self.showGameInfo()
      })
  },
  showMallNoticeInfo () {
    const self = this
    if (!this.$mallNotice.hasClass('hidden')) {
      if (this.mallNoticeNum <= this.mallNoticeList.length - 1) {
        this.mallNoticeId = this.mallNoticeList[this.mallNoticeNum].id
        if (_.indexOf(this.localStorageList, this.mallNoticeId) > -1) {
          this.mallNoticeNum += 1
          this.showMallNoticeInfo()
        } else {
          this.$mallNoticeTitle.html(this.mallNoticeList[this.mallNoticeNum].title)
          this.$mallNoticeContent.html(this.mallNoticeList[this.mallNoticeNum].content)
          this.$mallNotice.removeClass('hidden fadeOutDown').addClass('fadeInUp')
          clearTimeout(this.mallTimer)
          this.mallTimer = setTimeout(() => {
            self.closeMallNoticeHandler()
          }, 30000)
        }
      } else {
        this.$mallNotice.addClass('hidden')
        this.showGameInfo()
      }
    }
  },
  closeMallNoticeHandler () {
    const self = this
    self.localStorageList.push(self.mallNoticeId)
    this.storage.set(`${self.userId}mallNoticeList`, self.localStorageList)
    this.mallNoticeNum += 1
    this.$mallNotice.removeClass('fadeInUp').addClass('fadeOutDown')
    setTimeout(() => {
      self.showMallNoticeInfo()
    }, 800)
  },
  showGameInfo () {
    const self = this
    if (!this.isShowGame && self.ifFirstLogin()) {
      // 每日首次登录
      this.getPopularInfoXHR()
        .done((root) => {
          if (root.result == 0) {
            self.noticeShow(root.root)
          }
        })
        .fail((root) => {

        })
    }
  },
  userCloseHandler () {
    const self = this
    self.$pgGame1.hide()
  },
  gameCloseHandler () {
    const self = this
    self.$pgGame2.hide()
  },
  noticeShow (root) {
    const self = this
    if (root.type == 0) { // 新用户
      setTimeout(() => {
        self.$pgGame1.removeClass('hidden')
      }, 1000)
      self.$userNum.text(root.userCount)
      self.newUserTicket.text(root.hotTicketName)
      self.newUserHotType.text(root.hotPlayName)
      var hotPlayId = (root.hotPlayId).toString().slice(0, ((root.hotPlayId).toString()).length - 4)
      self.$('.js-all-play-path').attr('href', `#bc/${root.hotTicketId}`)
      self.$('.js-all-play-path').click(() => {
        const data = {
          ticketRuleId: hotPlayId,
          ticketPlayId: root.hotPlayId,
        }
        setTimeout(() => {
          Global.m.publish('bet:updating', data)
        }, 500)
      })
      setTimeout(() => {
        self.$pgGame1.hide()
      }, 31000)
    } else {
      if (root.type == 1) {
        setTimeout(() => {
          self.$pgGame2.removeClass('hidden')
        }, 1000)
        self.$beforeGame.text(root.recentTicketName)
        self.$gameNameType.text('热门玩法')
        self.$beUserTicket.text(root.hotTicketName)
        if (root.recentPlayName == null) {
          self.$('.js-null-game').css({ visibility: 'hidden' })
        } else {
          self.$gameName.text(root.recentPlayName)
        }
        self.beUserHotType.text(root.hotPlayName)
        const recentPlayId = (root.recentPlayId).toString().slice(0, ((root.recentPlayId).toString()).length - 4)
        var hotPlayId = (root.hotPlayId).toString().slice(0, ((root.hotPlayId).toString()).length - 4)
        self.$('.js-nearGame-path').attr('href', `#bc/${root.recentTicketId}`)
        self.$('.js-nearGame-path').click(() => {
          const data = {
            ticketRuleId: recentPlayId,
            ticketPlayId: root.recentPlayId,
          }
          setTimeout(() => {
            Global.m.publish('bet:updating', data)
          }, 500)
        })
        self.$('.js-hotGame-path').attr('href', `#bc/${root.hotTicketId}`)
        self.$('.js-hotGame-path').click(() => {
          const data = {
            ticketRuleId: hotPlayId,
            ticketPlayId: root.hotPlayId,
          }
          setTimeout(() => {
            Global.m.publish('bet:updating', data)
          }, 500)
        })
      } else if (root.type == 2) {
        setTimeout(() => {
          self.$pgGame2.removeClass('hidden')
        }, 1000)
        self.$beforeGame.text(root.recentChannelName)
        self.$gameNameType.text('投注游戏')
        self.$beUserTicket.text(root.hotTicketName)
        if (root.recentGameName == null) {
          self.$('.js-null-game').css({ visibility: 'hidden' })
        } else {
          self.$gameName.text(root.recentGameName)
        }
        self.beUserHotType.text(root.hotPlayName)
        var hotPlayId = (root.hotPlayId).toString().slice(0, ((root.hotPlayId).toString()).length - 4)
        self.$('.js-nearGame-path').click(() => {
          self.jumpGamePageHandler(root.recentType, root.recentChannelId, root.recentGameId)
        })
        self.$('.js-hotGame-path').attr('href', `#bc/${root.hotTicketId}`)
        self.$('.js-hotGame-path').click(() => {
          const data = {
            ticketRuleId: hotPlayId,
            ticketPlayId: root.hotPlayId,
          }
          setTimeout(() => {
            Global.m.publish('bet:updating', data)
          }, 500)
        })
      }
      setTimeout(() => {
        self.$pgGame2.addClass('hidden')
      }, 31000)
      this.isShowGame = true
    }
  },
  // 判断用户每日首次登录
  ifFirstLogin() {
    const acctInfo = Global.memoryCache.get('acctInfo')
    const nowUser = acctInfo.userId
    const firstTime = Global.cookieCache.get(`${nowUser}firstLogin`)
    if (!firstTime) {
      const time = this.convertTime(new Date(), '24:00:00')
      Global.cookieCache.set(`${nowUser}firstLogin`, true, time)
      return true
    }
    return false
  },
  convertTime (nowDate, Deadline) {
    const _dateArr = Deadline.split(':')
    const hours = parseInt(_dateArr[0])
    const minutes = parseInt(_dateArr[1])
    const seconds = parseInt(_dateArr[2])
    nowDate.setHours(hours)
    nowDate.setMinutes(minutes)
    nowDate.setSeconds(seconds)
    const result = Date.parse(nowDate)
    return result
  },
  jumpGamePageHandler (type, channelId, gameId) {
    const self = this
    var type = type
    var channelId = channelId
    var gameId = gameId
    let flag = false

    if (channelId == 7) { // 体育的点击节点在nav中
      Global.ui.notification.show('暂未开放，敬请期待！<br/><br/>', { id: 'ticketNotice', hasFooter: false, displayTime: 1000 })
      return false
    }

    this.getGameListXhr().done((res) => {
      if (res.result == 0) {
        self.gameList = res.root
        _(res.root).find((item, index) => {
          if (item.channelId == channelId && item.type == type) {
            if (item.status == 0) {
              // 只有这里需要跳转窗口
              // if(item.fundLock){
              //   Global.ui.notification.show('资金锁定状态无法进行游戏！<br/><br/>',{id:'ticketNotice',hasFooter:false,displayTime:1000});
              //   return false;
              // }
              if (item.fundLock) {
                Global.ui.notification.show('资金已锁定，请先' + '<a href="javascript:void(0);" ' +
                    'onclick="document.querySelector(\'.js-gl-hd-lock\').click();" ' +
                    'class="btn-link btn-link-pleasant"  data-dismiss="modal">资金解锁</a>' + '。')
                return false
              }
              flag = true
              return true
            } else if (item.status == 1) {
              Global.ui.notification.show(
                '当前游戏处于关闭状态，您可以尝试其他游戏！<br/><br/>',
                { id: 'ticketNotice', hasFooter: false, displayTime: 1000 },
              )
            } else if (item.status == 2) {
              Global.ui.notification.show(`平台官方维护中，维护时间：${
                _(item.mStart).toTime()}至${_(item.mEnd).toTime()}`)// ,{displayTime:2000}
            }
          }
          return false
        })
      }
    })
    if (flag) {
      if (type == 3) {
        this.$('.js-gc-slot-gameId').val(gameId)
        this.$('.js-gc-slot-token').val(Global.cookieCache.get('token'))
        this.$('.js-gc-slot-type').val(0)
        var $form = this.$('.js-gc-slot-form')
        $form.submit()
      } else if (type == 4 && channelId == 1) {
        var $form = self.$('.js-game-form')
        self.$('.js-form-game-id').val(5)
        self.$('.js-form-token').val(Global.cookieCache.get('token'))
        $form.submit()
      } else {
        var $form = self.$('.js-game-form')
        self.$('.js-form-game-id').val(channelId)
        self.$('.js-form-token').val(Global.cookieCache.get('token'))
        $form.submit()
      }
    }
  },
  modelCloseHandler () {
    const self = this
    self.$pgGame1.addClass('zoomOut')
    self.$pgGame2.addClass('zoomOut')
  },
})
module.exports = PopularGameView
