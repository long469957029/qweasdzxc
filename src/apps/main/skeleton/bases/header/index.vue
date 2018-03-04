<template>
  <div class="top-nav">
    <div class="back-to-old"  v-if="!isTestUser" @click="backToOldVersion"><i class="fa fa-exchange"></i>&nbsp;返回旧版</div>
    <div class="header-main ">
      <div class="header-assist">
        <a class="header-left-link" href="/change.html">线路中心</a>
        <a class="header-left-link" @click="showLoginLauncher">极速登录器</a>
        <a class="header-left-link" @click="clearCache">清理缓存</a>
      </div>
      <div class="js-gl-service header-customer-entry  pull-right overflow-hidden">
        <span class="sfa sfa-customer-service"></span><span class="header-customer-text">客服</span>
      </div>
      <!--<transition mode="out-in"-->
                  <!--enter-active-class="animated-general fadeInRightBig"-->
                  <!--leave-active-class="animated-general fadeOutRightBig"-->
      <!--&gt;-->
        <div class="header-not-login pull-right" v-if="!loginStatus" key="login">
          <button type="button" class="header-game " @click="showFreeTrial">免费试玩</button>
          <button type="button" class="header-login " @click="showLogin">登录</button>
        </div>
        <div class="header-has-logined  pull-right" key="logined"
             v-else>
          <div class="header-menu">
            <div class="test-marking" v-if="isTestUser"><p>试</p></div>
            <span class="sfa header-headshot "><img :src="userAvatar"/></span>
            <span class="header-name">{{username}}</span>
            <i class="fa fa-angle-down "></i>
            <div class="header-menu-place" @click="goToPersonCenter"></div>
            <div class="header-menu-body" v-if="!isAgent">
              <a href="#/fc/fm" class="header-menu-item"><span class="header-menu-item-text">资金总览</span></a>
              <a href="#/fc/ad" class="header-menu-item"><span class="header-menu-item-text">帐变明细</span></a>
              <a href="#/fc/rd" class="header-menu-item"><span class="header-menu-item-text">充提记录</span></a>
              <a href="#/fc/td" class="header-menu-item"><span class="header-menu-item-text">投注记录</span></a>
              <div class="header-menu-item" @click="logout">
                <i class="fa fa-power-off header-menu-item-img inline-block" aria-hidden="true"></i>
                <span class="header-menu-item-text inline-block">安全退出</span>
              </div>
            </div>
            <div class="header-menu-body-agent" v-if="isAgent">
              <div class="header-menu-body-agent-item">
                <div class="header-menu-title">个人中心</div>
                <a href="#/fc/fm" class="header-menu-item"><span class="header-menu-item-text">资金总览</span></a>
                <a href="#/fc/ad" class="header-menu-item"><span class="header-menu-item-text">账变明细</span></a>
                <a href="#/fc/rd" class="header-menu-item"><span class="header-menu-item-text">充提记录</span></a>
                <a href="#/fc/td" class="header-menu-item"><span class="header-menu-item-text">投注记录</span></a>
              </div>
              <div class="header-menu-body-agent-item">
                <div class="header-menu-title">团队中心</div>
                <a href="#/ac/to" class="header-menu-item"><span class="header-menu-item-text">团队总览</span></a>
                <a href="#/ac/spl" class="header-menu-item"><span class="header-menu-item-text">团队盈亏</span></a>
                <a href="#/ac/llm" class="header-menu-item"><span class="header-menu-item-text">下级管理</span></a>
                <a href="#/ac/oam" class="header-menu-item"><span class="header-menu-item-text">开户管理</span></a>
              </div>
              <div class="header-menu-body-agent-logout" @click="logout">
                <i class="fa fa-power-off header-menu-item-img inline-block" aria-hidden="true"></i>
                <span class="header-menu-item-text inline-block">安全退出</span>
              </div>
            </div>
          </div>

          <div class="header-amount-panel">
            <div class="js-header-recharge header-recharge" data-name="jsFcRecharge">充值</div>
            <div class=" header-amount">￥&nbsp;{{amount}}</div>
            <div class="header-amount-img"></div>
          </div>
          <div class="js-header-announcement header-announcement active">
            <span class="sfa sfa-announcement "></span><span class="header-announcement-title ">消息</span>
            <span :class="'js-header-announcement-num header-announcement-num '+ (newRowCount>9?'header-announcement-num-two':'')"
                  v-if="newRowCount > 0">{{newRowCount}}</span>
            <div class="header-announcement-place" @click="goToAnnouncement"></div>
            <div class="js-header-announcement-body header-announcement-body">
              <div class="header-announcement-content">
                <a :href="messageLink(item.type,item.noticeId)" class="content-item" v-for="item in newList"
                   :key="_(item.time).add(_.random(10000))">
                  <div class="content-item-panel">
                    <div class="content-item-title-panel">
                      <div class="content-item-img inline-block"></div>
                      <div class="content-item-title inline-block">{{item.title}}</div>
                      <div class="content-item-date pull-right inline-block">{{_(item.time).toDate('MM/DD')}}</div>
                    </div>
                    <div class="content-item-text" v-html="formatDesc(item.desc)">}</div>
                  </div>
                </a>
              </div>
              <router-link to="/uc/mg" class="header-announcement-showMore">查看全部信息</router-link>
            </div>
          </div>
        </div>
      <!--</transition>-->
    </div>
  </div>
</template>

<script>
  import avatarConf from 'userCenter/misc/avatarConfig'
  import fundApi from 'api/fund'
  import { getAccountSafeApi, getBindInfoApi } from 'api/userCenter'
  import loginApi from 'api/login'
  import Fingerprint2 from 'fingerprintjs2'

  export default{
    name: 'main-header',

    data () {
      return {
        //提交中，禁用按钮
        pushing: false,
        // 默认显示登录
        loginPanel: true,
        // 默认隐藏用户界面
        userPanel: false,
//        amount: 0.00,
//        username: '',
        newRowCount: 0,
        newList: [],
        loginLauncherDialog: false,
        isTestUser: false,
      }
    },

    props: {},

    components: {},

    watch: {
      userInfo(userInfo) {
        this.showUserInfo(userInfo)
      },
      loginStatus(loginStatus){
        if (loginStatus) {
          this.getUserSecurityInfo()
          this.getUserBindInfo()
        }
        this.judgeIsTestUser()
      },
    },

    computed: {
      isAgent(){
        return this.$store.state.loginStore.userType === 0
      },
      // isTestUser(){
      //   return Global.cookieCache.get('isTestUser')
      // },
      amount(){
        return this.$store.getters.getUserInfo.fBalance
      },
      username(){
        if (this.$store.getters.getUserInfo.uName === '' || this.$store.getters.getUserInfo.uName === null) {
          return this.$store.getters.getUserInfo.username
        } else {
          return this.$store.getters.getUserInfo.uName
        }
      },
      ...mapGetters([
        'userAvatar'
      ]),
      loginStatus(){
        return this.$store.getters.getLoginStatus
      },
    },

    filters: {},

    methods: {
      backToOldVersion(){
        window.location.href = _.getV2Domain()
      },
      judgeIsTestUser(){
        this.isTestUser = Global.cookieCache.get('isTestUser')
      },
      showLogin() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
//        this.openLoginDialog()
      },
      showLoginLauncher(){
        this.$store.commit(types.TOGGLE_LOGIN_LAUNCHER, true)
      },
      showFreeTrial(){

        this.getUUID().then(({uuid}) => {

          loginApi.testUserReg({uuid}, (data) => {
            if (data.data && data.data.result === 0 && data.data.root) {
              window.Global.cookieCache.set('token', data.data.root.token, 160)
              window.Global.cookieCache.set('loginState', true)
              window.Global.cookieCache.set('isTestUser', true)//存一份到cookie，用于应用刷新时记住试玩状态
              let testUsername = window.Global.cookieCache.get('testUsername')
              if(!testUsername || (testUsername && testUsername!==data.data.root.username && data.data.root.balance === 10000000)) {
                this.$store.commit(types.TOGGLE_FREE_TRIAL, true)
              }
              window.Global.cookieCache.set('testUsername',data.data.root.username)
              this.judgeIsTestUser()
              window.store.commit(types.USER_LOGIN_SUCCESS, data.data.root || {})
            }
          })
        })


      },
      getUUID(){
        return new Promise((resolve) => {
          var uuid = Global.cookieCache.get('testUserUUID')
          if (!uuid) {
            new Fingerprint2().get(function (result, components) {
//              console.log(result) // a hash, representing your device fingerprint
//              console.log(components) // an array of FP components
              if (!result) {
                result = new Date().getMilliseconds()
              }
              Global.cookieCache.set('testUserUUID', result)
              resolve({uuid: result})
            })
          } else {
            resolve({uuid: uuid})
          }
        })
      },
      renderMsgList(model){
        this.newRowCount = model.get('newRowCount')
        this.newList = model.get('newList')
      },
      messageLink(type, id){
        let url = type === 0 ? '#/uc/mg' : '#/uc/fb'
        if (type === 0) {
          url = url + `?id=${id}`
        }
        return url
      },
      formatDesc(text){
        if (text.length > 42) {
          text = text.slice(0, 41) + '...'
        }
        return text
      },
      logout(){
        this.$store.commit(types.TOGGLE_LOGOUT_DIALOG, true)
      },
      getAccountSafe(){
        getAccountSafeApi(
          ({data}) => {
            if (data && data.result === 0) {
              Global.memoryCache.set('accountSafe', data.root)
              Global.m.publish('safe:updating', data.root)
            }
          }
        )
      },
      getUserBindInfo(){
        getBindInfoApi(
          ({data}) => {
            if(data && data.result === 0 && !_(data.root).isNull()){
              Global.cookieCache.set('userBindInfo', data.root)
            }
          }
        )
      },
      getUserSecurityInfo(){
        fundApi.userSecurityInfo(({data}) => {
          if (data.result === 0) {
            // 判断是否绑定银行卡，0：银行卡与密码都未绑定，1：银行卡与密码都已绑定，2：只绑定资金密码，3：只绑定银行卡
            let status = 0
            if (data.root.hasBankCard && data.root.hasMoneyPwd) {
              status = 1
            } else if (!data.root.hasBankCard && data.root.hasMoneyPwd) {
              status = 2
            } else if (data.root.hasBankCard && !data.root.hasMoneyPwd) {
              status = 3
            }
            window.Global.cookieCache.set('security', status)
          }
        })
        this.getAccountSafe()
      },
      goToPersonCenter(){
        window.Global.router.goTo('fc/fm')
      },
      goToAnnouncement(){
        window.Global.router.goTo('uc/mg')
      },
      clearCache(){
        Global.ui.notification.show('请按Ctrl+Shift+Delete进行浏览器缓存清理')
      }
    },

    mounted(){
      if(this.$route.query && this.$route.query.popupLogin==='true'){
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG,true)
        this.$router.push('/')
      }
      window.Global.m.subscribe('news', 'news:updating', this.renderMsgList)
      if (this.loginStatus) {  //登陆状态下 获取用户安全设置信息
        this.getAccountSafe()
      }
      this.judgeIsTestUser()
      Vue.$global.bus.$on('update:newRowCount',()=>{
        this.newRowCount = 0
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/imports";

  //top-nav entry/index.html中定义
  .top-nav {
    //position: absolute;
    background-color: $header-color;
    height: $header-height;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
    position: relative;
    vertical-align: middle;

    .back-to-old {
      position: absolute;
      /*left: 0;*/
      /*top: 0;*/
      float: left;
      display: inline-block;
      width: 136px;
      background: #108189;
      font-size: 12px;
      color: #fff;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      z-index: 1;
    }
    .header-main {
      position: relative;
      width: 1200px;
      height: 40px;
      margin: 0 auto;
    }
    /*@media screen and (max-width: 1200px) {*/
      /*.header-assist {*/
        /*!*position: absolute;*!*/
        /*float: left;*/
        /*left: 136px;*/
      /*}*/
    /*}*/
    @media screen and (max-width: 1481px) {
      .header-assist {
        /*position: absolute;*/
        /*left: 136px;*/
        float: left;
        margin-left: 140px;
      }
    }
    @media screen and (min-width: 1482px) {
      .header-assist {
        position: absolute;
        left: 0px;
      }
    }

    .header-left-link {
      display: inline-block;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 24px;
      line-height: 40px;
      cursor: pointer;
    }
    .header-try {
      display: inline-block;
      float: left;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.5);
      vertical-align: middle;
      margin: 6px 0px;
      width: 90px;
      height: 27px;
      border-radius: 3px;
      text-align: center;
      line-height: 27px;
      border: 0;
      &.active, &:hover {
        background: #237477;
        color: #fff;
      }
    }
    .header-game {
      display: inline-block;
      float: left;
      width: 74px;
      height: 27px;
      line-height: 25px;
      margin: 6px 0px;
      border: 0;
      font-size: 13px;
      text-align: center;
      vertical-align: middle;
      color: rgba(255, 255, 255, 0.5);
      background: transparent;
      outline: none;
      &.active, &:hover {
        color: #fff;
        text-decoration: underline;
      }
    }
    .header-login {
      display: inline-block;
      float: left;
      width: 74px;
      height: 27px;
      line-height: 25px;
      margin: 6px 28px 6px 22px;
      border: 0;
      border-radius: 3px;
      font-size: 13px;
      color: #fff;
      text-align: center;
      vertical-align: middle;
      background-color: rgba(0, 0, 0, 0.2);
      outline: none;
      &.active, &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
      }
    }
    /*.header-login {*/
      /*display: inline-block;*/
      /*float: left;*/
      /*width: 74px;*/
      /*height: 27px;*/
      /*line-height: 25px;*/
      /*margin: 6px 28px;*/
      /*border: 0;*/
      /*border-radius: 3px;*/
      /*font-size: 13px;*/
      /*color: #fff;*/
      /*text-align: center;*/
      /*vertical-align: middle;*/
      /*color: rgba(255, 255, 255, 0.5);*/
      /*background: transparent;*/
      /*&.active, &:hover {*/
        /*background: #237477;*/
        /*color: #fff;*/
      /*}*/
    /*}*/

    .header-customer-entry {
      padding: 0 12px;
      height: 40px;
      width: 71px;
      line-height: 40px;
      font-size: 13px;
      text-align: center;
      border-left: 1px solid #41a6ad;
      border-right: 1px solid #41a6ad;
      vertical-align: middle;
      cursor: pointer;
      .sfa-customer-service {
        vertical-align: text-bottom;
      }
      .header-customer-text {
        margin-left: 4px;
        display: inline-block;
      }
      &:hover {
        background: $new-main-deep-hover-color;
      }
    }

    .header-has-logined {
      height: 40px;
      padding-left: 20px;
      font-size: 0;
      line-height: 40px;
      vertical-align: middle;
      .header-menu {
        position: relative;
        display: inline-block;
        max-width: 131px;
        height: 40px;
        padding: 0 12px;
        border-left: 1px solid #41a6ad;
        vertical-align: top;
        font-size: 13px;
        text-align: center;
        cursor: pointer;
        min-width: 111px;
        .test-marking {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border: 13px solid;
          border-color: #0a585d transparent transparent #0a585d;
          > p {
            margin-top: -26px;
            margin-left: -11px;
            font-size: 10px;
          }
        }
        .header-headshot {
          display: inline-block;
          width: 27px;
          height: 27px;
          margin: 4px 0 0;
          vertical-align: top;
          border: 2px solid #0D676e;
          border-radius: 50%;
          > img {
            vertical-align: top;
          }
        }
        .header-name {
          display: inline-block;
          max-width: 72px;
          height: 40px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          line-height: 40px;
          vertical-align: top;
          /*float: left;*/
          min-width: 38px;
          text-align: center;
          padding: 0 5px;
        }
        .fa-angle-down {
          margin: 14px 0;
          /*vertical-align: middle;*/
          /*float: right;*/
        }
        &:hover {
          background: $new-main-deep-hover-color;
          .header-menu-body, .header-menu-body-agent {
            display: block;
          }

        }
        .header-menu-place {
          position: absolute;
          left: 0;
          top: 0;
          height: 41px;
          width: 149px;
        }
        .header-menu-body {
          position: absolute;
          display: none;
          top: 40px;
          background: $new-main-deep-color;
          z-index: 10;
          background: #ffffff;
          color: #666666;
          border: 1px solid #d8eeef;
          width: 100%;
          height: 188px;
          left: 64px;
          margin-left: -65px;
          &:after{
            content:'';
            width: 0;
            height: 0;
            border-bottom: 5px;
            border-style: solid;
            border-color: #fff;
            position: absolute;
            top: -5px;
            left: 50%;
            transform: rotate(45deg)
          }
          .header-menu-item {
            display: block;
            height: 35px;
            pading: 0 10px;
            text-align: center;
            font-size: 13px;
            color: $new-inverse-color;
            line-height: 35px;
            //padding: 0 25px;
            .header-menu-item-text {
              display: block;
              height: 35px;
              margin: 0 7px;
            }
            &:hover {
              color: $new-main-deep-color;
              border-radius: 5px;
            }
            &:nth-child(5) {
              line-height: 48px;
              margin: 0 6px;
              border-top: 1px dashed $sec-line-color;
              .header-menu-item-img {
                color: $font-auxiliary-color;
                font-size: 16px;
                vertical-align: text-bottom;
              }
            }
          }
        }
        .header-menu-body-agent {
          position: absolute;
          display: none;
          top: 40px;
          background: $new-main-deep-color;
          z-index: 10;
          background: #ffffff;
          color: #666666;
          border: 1px solid #d8eeef;
          width: 225px;
          height: 222px;
          left: 64px;
          margin-left: -65px;
          font-size: 0;
          &:after{
            content:'';
            width: 0;
            height: 0;
            border-bottom: 3px;
            border-style: solid;
            border-color: #fff;
            position: absolute;
            top: -4px;
            left: 23.5%;
            transform: rotate(45deg)
          }
          .header-menu-body-agent-item {
            display: inline-block;
            width: 110px;
            margin: 20px 0 12px 0;
            &:first-child {
              border-right: 1px solid $sec-line-color;
            }
            .header-menu-title {
              position: relative;
              font-size: 13px;
              color: #000;
              height: 24px;
              line-height: 13px;
              width: 110px;
              margin-bottom: 7px;
              text-align: center;
              &:after {
                position: absolute;
                left: 44px;
                bottom: 0px;
                content: '';
                width: 24px;
                height: 0;
                border-bottom: 2px solid #15b0bb;
              }
            }

            .header-menu-item {
              display: block;
              height: 30px;
              pading: 0 10px;
              text-align: center;
              font-size: 13px;
              color: $new-inverse-color;
              line-height: 30px;
              //padding: 0 25px;
              .header-menu-item-text {
                display: block;
                height: 35px;
                margin: 0 7px;
                font-size: 12px;
              }
              &:hover {
                color: $new-main-deep-color;
                border-radius: 5px;
              }
            }
          }
          .header-menu-body-agent-logout {
            height: 38px;
            margin: 0 6px;
            text-align: center;
            line-height: 38px;
            border-top: 1px dashed $sec-line-color;
            .header-menu-item-img {
              color: $font-auxiliary-color;
              font-size: 16px;
              vertical-align: baseline;
            }
            .header-menu-item-text {
              display: block;
              height: 39px;
              line-height: 39px;
              margin-left: 5px;
              font-size: 12px;
            }
          }
        }
      }
      .header-amount-panel {
        display: inline-block;
        border-left: 1px solid #41a6ad;
        max-width: 172px;
        padding: 0 12px;
        /*.header-amount-img {*/
        /*float: right;*/
        /*display: inline-block;*/
        /*height: 40px;*/
        /*color: #ffffff;*/
        /*font-size: 13px;*/
        /*}*/
        .header-amount {
          float: right;
          display: inline-block;
          height: 40px;
          font-size: 13px;
          line-height: 40px;
          text-align: center;
          vertical-align: top;
          max-width:104px;
          min-width: 44px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .header-recharge {
          float: right;
          display: inline-block;
          width: 56px;
          height: 26px;
          margin: 7px 0 7px 12px;
          background: #d0e9ea;
          border-radius: 13px;
          font-size: 13px;
          color: #14b1bb;
          line-height: 26px;
          text-align: center;
          outline: none;
          vertical-align: top;
          cursor: pointer;
        }
        &:hover {
          background: $new-main-deep-hover-color;
        }
      }
      .header-announcement {
        position: relative;
        display: inline-block;
        width: 72px;
        height: 40px;
        border-left: 1px solid #41a6ad;
        font-size: 13px;
        line-height: 40px;
        cursor: pointer;
        text-align: center;
        vertical-align: top;
        padding: 0 12px;
        .sfa-announcement {
          margin: -5px 5px 0 0;
          vertical-align: middle;
        }

        .header-announcement-num {
          margin-left: 2px;
          width: 16px;
          height: 16px;
          line-height: 16px;
          display: inline-block;
          background: #e29c49;
          border-radius: 3px;
          text-align: center;
          text-indent: -2px;
        }
        .header-announcement-num-two{
          text-indent: -1px;
        }
        .header-announcement-place {
          position: absolute;
          left: 0;
          top: 0;
          height: 41px;
          width: 100px;
        }
        .header-announcement-body {
          position: absolute;
          display: none;
          top: 40px;
          background: $new-main-deep-color;
          /*border-radius: 5px;*/
          z-index: 10;
          background: #ffffff;
          color: #666666;
          border: 1px solid $def-line-color;
          right: -97px;
          margin-left: -183px;
          //display: block;
          width: 348px;
          height: 367px;
          &:after{
            content:'';
            width: 0;
            height: 0;
            border-bottom: 3px;
            border-style: solid;
            border-color: #fff;
            position: absolute;
            top: -4px;
            left: 58%;
            transform: rotate(45deg)
          }

          .header-announcement-content {
            height: 318px;

            .content-item {
              display: block;
              height: 82px;
              padding: 24px 9px 0 12px;
              transition: all .5s;
              &:last-child {
                .content-item-panel {
                  border-bottom: 1px dashed $def-line-color;
                }
              }
              .content-item-panel {
                padding: 0 12px 0 24px;
                border-bottom: 1px solid $def-line-color;
              }
              .content-item-title-panel {
                color: $font-auxiliary-color;
                height: 13px;
                line-height: 13px;
                margin-bottom: 10px;
                .content-item-img {
                  width: 6px;
                  height: 6px;
                  display: inline-block;
                  background: $font-auxiliary-color;
                  border-radius: 9px;
                  text-align: center;
                  margin-top: 5px;
                  margin-left: -12px;
                  position: absolute;
                }
                .content-item-title {
                  width: 242px;
                  height: 20px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: keep-all;
                  white-space: nowrap;
                  color: $new-inverse-color;
                  font-size: 13px;
                  text-align: left;
                }
                .content-item-date {
                  font-size: 13px;
                }
              }
              .content-item-text {
                position: relative;
                width: 294px;
                height: 53px;
                margin-bottom: 5px;
                font-size: 12px;
                color: $font-auxiliary-color;
                text-align: left;
                line-height: 20px;
              }
              &:hover {
                .content-item-title-panel {
                  .content-item-img {
                    background: $new-main-deep-color;
                  }
                  .content-item-title {
                    color: $new-main-deep-color;
                  }
                }
                background-color: $sec-line-color;
              }
            }
          }
          .header-announcement-showMore {
            color: $font-auxiliary-color;
            font-size: 13px;
            width: 100%;
            height: 50px;
            line-height: 50px;
            text-align: center;
            display: block;
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            &:hover {
              color: $new-main-deep-color;
            }
          }
        }
        &:hover {
          background: $new-main-deep-hover-color;
          .header-announcement-body {
            display: block;
          }
        }
      }
    }
  }
</style>
