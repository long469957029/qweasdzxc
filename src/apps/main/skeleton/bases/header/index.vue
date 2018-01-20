<template>
  <div class="top-nav">
    <div class="header-main ">
      <div class="pull-left">
        <a class="header-left-link" href="#/">线路中心</a>
        <a class="header-left-link" href="#/">急速登录器</a>
        <a class="header-left-link" href="#/">防劫持教程</a>
      </div>
      <div class="js-gl-service header-customer-entry  pull-right overflow-hidden">
        <span class="sfa sfa-customer-service"></span><span class="header-customer-text">在线客服</span>
      </div>
      <transition mode="out-in"
                  enter-active-class="animated-general fadeInRightBig"
                  leave-active-class="animated-general fadeOutRightBig"
      >
        <div class="header-not-login pull-right" v-if="!isLogin" key="login">
          <a class="header-try header-try" href="javascript:void(0);">免费试玩</a>
          <button type="button" class="js-header-login header-login " @click="showLogin">登录</button>
        </div>
        <div class="js-header-has-logined header-has-logined  pull-right" key="logined"
             v-else>
          <div class="js-header-menu header-menu">
            <span class="sfa header-headshot "><img :src="imgUrl"/></span>
            <span class="js-header-username header-name">{{userUname}}</span>
            <i class="fa fa-angle-down "></i>
            <div class="header-menu-place"></div>
            <div class="js-header-menu-body header-menu-body">
              <a href="#/fc/fm" class="header-menu-item"><span class="header-menu-item-text">资金总览</span></a>
              <a href="#/fc/ad" class="header-menu-item"><span class="header-menu-item-text">帐变明细</span></a>
              <a href="#/fc/td" class="header-menu-item"><span class="header-menu-item-text">投注记录</span></a>
              <div class="header-menu-item" @click="logout"><i
                class="fa fa-power-off header-menu-item-img inline-block" aria-hidden="true"></i>
                <span class="header-menu-item-text inline-block">退出</span></div>
            </div>
          </div>

          <div class="header-amount-panel">
            <div class="header-amount-img">￥</div>
            <div class=" header-amount">{{userAmount}}</div>
            <div class="js-header-recharge header-recharge">充值</div>
          </div>
          <div class="js-header-announcement header-announcement active">
            <span class="sfa sfa-announcement "></span><span>消息</span>
            <span class="js-header-announcement-num header-announcement-num" v-if="newRowCount > 0">{{newRowCount}}</span>
            <div class="header-announcement-place"></div>
            <div class="js-header-announcement-body header-announcement-body">
              <div class="header-announcement-content">
                <a :href="messageLink(item.type,item.noticeId)" class="content-item" v-for="item in newList" :key="_(item.time).add(_.random(10000))">
                  <div class="content-item-panel">
                    <div class="content-item-title-panel">
                      <div class="content-item-img inline-block"></div>
                      <div class="content-item-title inline-block">{{item.title}}</div>
                      <div class="content-item-date pull-right inline-block">{{_(item.time).toTime()}}</div>
                    </div>
                    <div class="content-item-text" v-html="formatDesc(item.desc)">}</div>
                  </div>
                </a>
              </div>
              <router-link to="/uc/mg" class="header-announcement-showMore">查看更多</router-link>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <!-- 登录 -->
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="loginModal"
         v-show="openOpenDialog">
      <login ref="login" @dialogClose="closeDialog"></login>
    </div>
  </div>
</template>

<script>
  import Login from 'skeleton/bases/login/login'
  import avatarConf from 'userCenter/misc/avatarConfig'
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
        amount: 0.00,
        username: '',
        userAvatar: '',
        newRowCount:0,
        newList:[]
      }
    },

    props: {},

    components: {
      Login,
    },

    watch: {},

    computed: {
      userUname() {
        return this.$store.state.loginStore.uName
      },
      userAmount() {
        return this.$store.state.loginStore.fBalance
      },
      imgUrl(){
        return avatarConf.get(this.$store.state.loginStore.headIcon).logo
      },
      isLogin(){
        return this.$store.getters.getLoginStatus
      },
      openOpenDialog(){
        if (this.$store.getters.getLoginDialogStatus) {
          this.openLoginDialog()
        }
      },
    },

    filters: {},

    methods: {
      showLogin() {
        this.pushing = true
//        this.showLoginModal = true
        this.$store.commit(types.OPEN_LOGIN_DIALOG, true)
        this.openLoginDialog()
      },
      openLoginDialog(){
        this.$nextTick(() => {
//          this.$refs.showLogin.init()

          $(this.$refs.loginModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$store.commit(types.OPEN_LOGIN_DIALOG, false)
            })
        })
      },
      closeDialog(){
        this.loginPanel = false
        this.userPanel = true
        $(this.$refs.loginModal).modal('hide')
      },
      logout() {
        Global.ui.loader.show()
        $(document).confirm({
          content: '<div class="m-TB-lg">确定要退出登录？</div>',
          type: 'exit',
          agreeCallback() {
            Global.oauth.logout().done((data) => {
              if (data && data.result === 0) {
                Global.cookieCache.clear('token')
                Global.cookieCache.clear('loginState')
                Global.router.goTo('')
                app.$store.commit(types.USER_LOGOUT_SUCCESS)
                window.Global.m.publish('acct:loginOut')
              }
            }).always(() => {
              Global.ui.loader.hide()
            })
          },
        })
        return false
      },
      renderMsgList(model){
        this.newRowCount = model.get('newRowCount')
        this.newList = model.get('newList')
      },
      messageLink(type,id){
        let url = type === 0 ? '#/uc/mg' : '#/uc/fb'
//        const data = { path: url}
        if (type === 0){
//          _(data).extend({
//            query:{id: id}
//          })
          url = url + `?id=${id}`
        }
        return url
      },
      formatDesc(text){
        if(text.length > 42) {
          text = text.slice(0, 41) + '...'
        }
        return text
      }
    },
    mounted(){
      Global.m.subscribe('news', 'news:updating', this.renderMsgList)
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
    z-index: 1050;
    position: relative;
    vertical-align: middle;

    .header-main {
      width: 1200px;
      height: 40px;
      margin: 0 auto;
    }
    .header-left-link {
      display: inline-block;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      margin-right: 24px;
      line-height: 40px;
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
    .header-login {
      display: inline-block;
      float: left;
      width: 90px;
      height: 27px;
      line-height: 25px;
      margin: 6px 20px;
      border: 0;
      border-radius: 3px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      vertical-align: middle;
      color: rgba(255, 255, 255, 0.5);
      background: transparent;
      &.active, &:hover {
        background: #237477;
        color: #fff;
      }
    }

    .header-customer-entry {
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      text-align: center;
      border-left: 2px solid #41a6ad;
      border-right: 2px solid #41a6ad;
      vertical-align: middle;
      cursor: pointer;
      .sfa-customer-service {
        vertical-align: text-bottom;
      }
      .header-customer-text {
        margin-left: 5px;
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
        height: 40px;
        padding: 0 14px;
        border-left: 2px solid #41a6ad;
        vertical-align: top;
        font-size: 14px;
        cursor: pointer;
        min-width: 120px;
        .header-headshot {
          display: inline-block;
          width: 32px;
          height: 32px;
          /*margin: 4px 0;*/
          vertical-align: middle;
          float: left;
        }
        .header-name {
          display: inline-block;
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          vertical-align: middle;
          float: left;
          min-width: 65px;
          text-align: center;
          padding: 0 8px 0 5px;
        }
        .sfa-angle {
          margin: 15px 0;
          vertical-align: middle;
          float: left;
        }
        &:hover {
          background: $new-main-deep-hover-color;
          .header-menu-body {
            display: block;
          }
        }
        .header-menu-place {
          position: absolute;
          left: 0;
          top: 0;
          height: 51px;
          width: 180px;
        }
        .header-menu-body {
          position: absolute;
          display: none;
          top: 50px;
          background: $new-main-deep-color;
          border-radius: 5px;
          z-index: 10;
          background: #ffffff;
          color: #666666;
          border: 1px solid $def-line-color;
          width: 133px;
          height: 193px;
          left: 50%;
          margin-left: -65px;
          &:before {
            content: "";
            position: absolute;
            width: 12px;
            height: 12px;
            background: white;
            transform: translateX(-50%) translateY(-50%) rotate(45deg);
            top: -1px;
            border-top: 1px solid $def-gray-color;
            border-left: 1px solid $def-gray-color;
            right: 39%;
            border-top-left-radius: 4px;
          }
          .header-menu-item {
            display: block;
            height: 49px;

            text-align: center;
            font-size: 14px;
            color: $new-inverse-color;
            line-height: 49px;
            //padding: 0 25px;
            .header-menu-item-text {
              display: block;
              height: 49px;
              margin: 0 7px;
              border-bottom: 1px solid $sec-line-color;
            }

            &:hover {
              color: $new-main-deep-color;
              border-radius: 5px;
            }
            &:nth-child(4) {
              .header-menu-item-text {
                color: $font-auxiliary-color;
                border-bottom: 0;
              }
              .header-menu-item-img {
                color: $font-auxiliary-color;
              }
            }
          }
        }
      }
      .header-amount-panel {
        display: inline-block;
        .header-amount-img {
          display: inline-block;
          height: 40px;
          color: #ffffff;
          font-size: 14px;
          position: absolute;
          margin-left: 12px;
        }
        .header-amount {
          display: inline-block;
          //width: 106px;
          height: 40px;
          font-size: 14px;
          line-height: 40px;
          text-align: right;
          border-left: 2px solid #41a6ad;
          vertical-align: top;
          padding: 0 4px 0 28px;
        }
        .header-recharge {
          display: inline-block;
          width: 56px;
          height: 26px;
          margin: 7px 14px;
          background: #d0e9ea;
          border-radius: 13px;
          font-size: 14px;
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
        display: inline-block;
        width: 100px;
        height: 40px;
        line-height: 40px;
        border-left: 2px solid #41a6ad;
        cursor: pointer;
        vertical-align: top;
        font-size: 14px;
        position: relative;
        .sfa-announcement {
          margin: -5px 6px 0 12px;
          vertical-align: middle;
        }
        .header-announcement-num {
          margin: 5px;
          width: 21px;
          height: 21px;
          line-height: 21px;
          display: inline-block;
          background: #e29c49;
          border-radius: 9px;
          text-align: center;
        }
        .header-announcement-place {
          position: absolute;
          left: 0;
          top: 0;
          height: 51px;
          width: 100px;
        }
        .header-announcement-body {
          position: absolute;
          display: none;
          top: 50px;
          background: $new-main-deep-color;
          border-radius: 5px;
          z-index: 10;
          background: #ffffff;
          color: #666666;
          border: 1px solid $def-line-color;
          left: 50%;
          margin-left: -183px;
          //display: block;
          width: 340px;
          height: 370px;
          &:before {
            content: "";
            position: absolute;
            width: 0px;
            height: 0px;
            border: 6px solid transparent;
            top: -12px;
            left: 50%;
            border-bottom-color: $def-line-color;
          }
          &:after{
            content: "";
            position: absolute;
            width: 0px;
            height: 0px;
            border: 5px solid transparent;
            border-bottom-color: $def-white-color;
            top: -10px;
            left: 50.5%;
          }
          .header-announcement-content {
            height: 318px;
            .content-item {
              display: block;
              height: 80px;
              padding: 26px 20px 0 26px;
              transition: all .5s;
              .content-item-panel{
                border-bottom: 1px dashed $def-line-color;
              }
              .content-item-title-panel {
                color: $font-auxiliary-color;
                height: 14px;
                line-height: 14px;
                margin-bottom: 10px;
                .content-item-img {
                  width: 6px;
                  height: 6px;
                  display: inline-block;
                  background: $font-auxiliary-color;
                  border-radius: 9px;
                  text-align: center;
                  margin-top: 5px;
                  margin-left: -10px;
                  position: absolute;
                }
                .content-item-title {
                  color: $new-inverse-color;
                  font-size: 14px;
                }
                .content-item-date {
                  font-size: 12px;
                }
              }
              .content-item-text {
                color: $font-auxiliary-color;
                text-align: left;
                line-height: 20px;
                margin-bottom: 5px;
                width: 294px;
                height: 40px;
                position: relative;
                overflow: hidden;
                /*text-overflow: ellipsis;*/
                /*white-space: nowrap;*/
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
            background: $sec-line-color;
            font-size: 14px;
            width: 100%;
            height: 56px;
            line-height: 56px;
            text-align: center;
            margin-top: -4px;
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
