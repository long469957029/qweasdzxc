<template>
  <div class="nav-channel-container">
    <ul class="nav-channel-content">
      <div class="nav-channel-banner realPic"></div>
      <div class="nav-channel-entry-container">
        <li class="entry-item ">
          <div class="entry-item-img icon-real-ag"></div>
          <div class="entry-item-content">
            <div class="entry-item-title">AG娱乐场</div>
            <div class="entry-item-desc">最具创新人气最旺</div>
            <a href="javascript:void(0);" @click.prevent="startGame(1,1,1)" class="btn entry-item-btn">进入游戏</a>
            <a href="javascript:void(0);" class="entry-down" @click.prevent="showDownLoad(1)"><span class="entry-qrcode"></span>手机APP下载</a>
          </div>
        </li>
        <li class="entry-item ">
          <div class="entry-item-img icon-real-ebet"></div>
          <div class="entry-item-content">
            <div class="entry-item-title">EBET娱乐场</div>
            <div class="entry-item-desc">亚洲最稳健的平台</div>
            <a href="javascript:void(0);"  @click.prevent="startGame(1,2,2)" class="btn entry-item-btn">进入游戏</a>
            <a href="javascript:void(0);" class="entry-down" @click.prevent="showDownLoad(2)"><span class="entry-qrcode"></span>手机APP下载</a>
          </div>
        </li>
        <li class="entry-item ">
          <div class="entry-coming-soon"></div>
          <div class="entry-item-img icon-real-bbin"></div>
          <div class="entry-item-content">
            <div class="entry-item-title">BBIN娱乐场</div>
            <div class="entry-item-desc">移动娱乐第一品牌</div>
            <a href="javascript:void(0);"  class="btn entry-item-btn disabled">进入游戏</a>
            <a href="javascript:void(0);" class="entry-down disabled" ><span class="entry-qrcode "></span>手机APP下载</a>
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
  export default{
    name: 'casino-menu',

    data () {
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
      showLogin(){
        if(!this.getLoginStatus){
          this.$store.commit(types.TOGGLE_LOGIN_DIALOG,true)
        }
      },
      startGame(type,channelId,gameId){
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进入该游戏，请先注册正式游戏账号',{bStyle:'box-shadow: -4px 2px 24px 0px rgba(0, 0, 0, 0.1)'})
          return false
        }
        if(!this.getLoginStatus){
          this.showLogin()
        }else{
          let flag = false
          getGameListApi()
            .done((data) => {
                if (data && data.result === 0) {
                  _(data.root).find((item) => {
                    if (item.fundLock) {
                      Global.ui.notification.show('资金已锁定，暂不能进入游戏')
                      return false
                    }
                    if (item.channelId === channelId && item.type === type) {
                      if (item.status === 0) {
                        flag = true
                        return true
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
          if(flag){
            let url = ''
            getGameUrlApi({gameId})
              .done((data) => {
                if (data && data.result === 0) {
                  if (data.root && data.root.url && !_.isEmpty(data.root.url)) {
                    url = data.root.url
                  }
                }
              })
            window.open(`./game.html?type=${gameId - 1}&src=${url}`)
          }
        }
      },
      showDownLoad(gameId){
        if(gameId === 3){
          // Global.ui.notification.show('暂未开放，敬请期待')
        }else{
          this.$store.commit(types.TOGGLE_GMAE_DOWN_LOAD,{showDialog:true,gameId})
        }
      }
    },

    mounted(){

    }
  }
</script>
<style lang="scss" scoped>

</style>
