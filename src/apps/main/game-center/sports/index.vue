<template>
  <div class="sports-center">
    <status-cell :status="loading" :has-data="true" loading-tip="" :transition="false"
                 v-if="loading !== 'completed'"
    ></status-cell>
    <iframe v-show="loading === 'completed'" class="iframe" :src="src" @load="loaded" ref="iframe" :height="height"></iframe>
  </div>
</template>

<script>

  import {getGameUrlApi} from 'api/gameCenter'
  import {checkLogin} from 'build'

  export default {
    name: 'game-sports',

    data() {
      return {
        src: '',
        height: 800,
        loading: 'loading'
      }
    },

    methods: {
      loaded() {
        if (this.src) {
          this.loading = 'completed'
        }
      }
    },

    mounted() {
      getGameUrlApi({
        gameId: 141,
      })
        .done((data) => {
          if (data && data.result === 0) {
            if (data.root && data.root.url && !_.isEmpty(data.root.url)) {
              this.src = data.root.url
            }
          } else {
            Global.ui.notification.show(`获取体育页面失败${data.msg}`)
          }
        })
    },
    beforeRouteEnter(to, from, next) {
      if (!window.store.getters.isLogin) {
        checkLogin.methods.login()
        return false
      }

      if (window.Global.cookieCache.get('isTestUser')) {
        Global.ui.notification.show('试玩会员无法进入该游戏，请先注册正式游戏账号', {modalDialogShadow: 'modal-dialog-shadow'})
        return false
      }

      next()
    }
  }
</script>

<style lang="scss" scoped>
  .sports-center {
    display: flex;
    /*align-items: center;*/
    justify-content: center;
    position: relative;
    background-size: cover;
    background: url(./bg.jpg) no-repeat top center;
    width: 100%;
    height: 970px;
  }
  .iframe {
    width: 1310px;
    border: 0;
    overflow: auto;
  }
</style>
