<template>

  <div class="js-nav-channel-container nav-channel-container">
    <ul class="nav-channel-content">
      <div class="nav-channel-banner slotPic"></div>
      <div class="nav-channel-entry-container">
        <li class="entry-item slot">
          <div class="entry-item-img icon-slot-pt"></div>
          <div class="entry-item-content">
            <div class="entry-item-title">PT老虎机</div>
            <div class="entry-item-desc">玩法丰富，实力超群</div>
            <a href="javascript:void(0)" @click="startGame(3,4)" class="btn entry-item-btn">进入游戏</a> <a data-id="4"
                                                                                                        data-gameid=""
                                                                                                        data-type="1"
                                                                                                        class="js-nav-channel-btn nav-channel-link prominent-link">试玩版</a>
            <a data-id="4" data-gameid="" data-type="0" class="js-nav-channel-btn nav-channel-link">手机版</a>
          </div>
        </li>
        <li class="entry-item slot">
          <div class="entry-item-img icon-slot-mg"></div>
          <div class="entry-item-content">
            <div class="entry-item-title">MG老虎机</div>
            <div class="entry-item-desc">欧美最流行老虎机</div>
            <a href="javascript:void(0)" @click="startGame(3,5)" class="btn entry-item-btn">进入游戏</a> <a data-id="5"
                                                                                                        data-gameid=""
                                                                                                        data-type="1"
                                                                                                        class="js-nav-channel-btn nav-channel-link prominent-link">试玩版</a>
            <a data-id="5" data-gameid="" data-type="0" class="js-nav-channel-btn nav-channel-link">手机版</a>
          </div>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
  import {
    getGameListApi,
    getGameUrlApi
  } from 'api/gameCenter'

  export default {
    name: 'slot-menu',

    data() {
      return {}
    },

    props: {},

    components: {},

    watch: {},

    computed: {
      ...mapGetters([
        'getLoginStatus'
      ])
    },

    filters: {},

    methods: {
      showLogin() {
        if (!this.getLoginStatus) {
          this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
        }
      },
      startGame(type, channelId, gameId) {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行转账操作，请先注册正式游戏账号')
          return false
        }
        if (!this.getLoginStatus) {
          this.showLogin()
        } else {
          getGameListApi()
            .done((data) => {
                if (data && data.result === 0) {
                  _(data.root).find((item) => {
                    // if (item.fundLock) {
                    //   Global.ui.notification.show('资金已锁定，暂不能进入游戏')
                    //   return false
                    // }
                    if (item.channelId === channelId && item.type === type) {
                      if (item.status === 0) {
                        // this.$router.push({
                        //   path: '/sc',
                        //   query: {
                        //     channelId
                        //   }
                        // })
                        Global.router.goTo('sc?channelId=' + channelId)
                      } else if (item.status === 1) {
                        Global.ui.notification.show('当前游戏处于关闭状态，您可以尝试其他游戏！')
                      } else if (item.status === 2) {
                        Global.ui.notification.show(`平台官方维护中，维护时间：${
                          _(item.mStart).toTime()}至${_(item.mEnd).toTime()}`)// ,{displayTime:2000}
                      }
                      return false
                    }
                  })
                }
              }
            )
        }
      },
    },

    mounted() {

    }
  }
</script>

<style lang="scss" scoped>

</style>
