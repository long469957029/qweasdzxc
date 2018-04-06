<template>
  <div>
    <div class="main-display">
      <!--<span class="js-db-nav-scroll scroll-btn"></span>-->
      <div class="js-db-nav-main nav-main">
        <div class="">
          <div class="gl-main-navbar">
            <a href="#/?dashboard=1" class="navbar-logo"></a>
            <ul class="nav js-navbar-nav" style="position: static">
              <li data-index="1">
                <!--<a href="#/?dashboard=1">首页</a>-->
                <router-link :to="{name: 'gameSports'}">
                  体育
                  <img class="sports-icon" src="./images/world-cup.png">
                </router-link>
              </li>
              <li data-index="1">
                <a @click.prevent="goTo(`/bc/0/${topClassicalTicket.id}`)">彩票
                  <!--<div class="navbar-down-icon"></div>-->
                </a>
                <ticket-menu></ticket-menu>
              </li>
              <li data-index="18">
                <a @click.prevent="goTo(`/bc/2/${topHandicapTicket.id}`)">双面盘
                  <!--<div class="navbar-down-icon"></div>-->
                </a>
              </li>
              <li data-index="2">
                <a href="#/rc" class="js-navbar-tab ">娱乐场
                  <!--<div class="navbar-down-icon"></div>-->
                </a>
                <casino-menu></casino-menu>
              </li>
              <li data-index="3">
                <a href="#/sc" class="js-navbar-tab ">老虎机
                  <!--<div class="navbar-down-icon"></div>-->
                </a>
                <slot-menu></slot-menu>
              </li>
              <li data-index="4">
                <a href="#/fh" class="js-navbar-tab ">捕鱼
                  <!--<div class="navbar-down-icon"></div>-->
                </a>
                <fish-menu></fish-menu>
              </li>
              <li data-index="5"><a href="#/aa" class="js-navbar-tab">优惠活动</a></li>
              <li data-index="7"><a href="#/points" class="js-navbar-tab">积分商城<span class="nav-hot-icon"></span></a>
              </li>
              <li data-index="6"><a href="#/mb" class="js-navbar-tab">手机投注</a></li>
              <div class="navbar-slide-underline js-navbar-slide-underline"></div>
            </ul>
            <div class="nav-mall-sub js-nav-mall-sub hidden"><i class="sfa-up_icon"></i>
              <div class="mall-sub-title"><span class="sfa sfa-mall-entry-rec"></span> 商城最新推荐
              </div>
              <ul class="js-nav-mall-sub-list"></ul>
              <div class="mall-more"><a href="#/ma" target="_blank">查看更多&gt;&gt;</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TicketMenu from "./ticket-menu";
  import CasinoMenu from "./casino-menu";
  import SlotMenu from "./slot-menu";
  import FishMenu from "./fish-menu";

  export default {
    name: 'nav-bar',
    components: {
      TicketMenu,
      CasinoMenu,
      SlotMenu,
      FishMenu,
    },
    data() {
      return {}
    },

    props: {},

    watch: {},

    computed: {
      ...mapGetters([
        'topClassicalTicket',
        'topHandicapTicket'
      ]),
      loginStatus(){
        return this.$store.getters.getLoginStatus
      },
    },

    filters: {},

    methods: {
      goTo(router){
        if(this.loginStatus){
          this.$router.push(router)
        }else{
          this.showLogin()
        }
      },
      showLogin() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
      },
//      navItemHover(e){
//        const self = this
//        const $target = $(e.currentTarget)
//
//        self.$('.js-navbar-nav').find('.js-navbar-tab').each((index, tab) => {
//          $(tab).removeClass('active')
//        })
//        $target.addClass('active')
//
//        const tabIndex = parseInt($target.closest('li').data('index'), 10)
//
//        if (tabIndex === 0) {
//          this.$underLine.addClass('hidden')
//        } else {
//          this.$underLine.removeClass('hidden')
//          this.$underLine.animate({
//            left: `${196 + (tabIndex - 1) * 99}px`,
//          })
//        }
//      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/imports";

  $nav-height: 70px;
  $nav-item-horizontal-padding: 20px;
  $nav-item-vertical-padding: 5px;
  $navbar-container-color: white;

  .nav-main {
    height: $nav-height;
    transition: height 0.5s ease-in-out;

    * {
      box-sizing: border-box;
    }

  }

  .navbar-logo {
    height: 49px;
    width: 186px;
    background: url('./images/navbar-logo.png') no-repeat left/contain;
    margin-top: 5px;
    float: left;
    position: relative;
    z-index: 12;
    margin-left: 0px;
  }

  .nav {
    position: static;
    float: right;
    > li {
      float: left;
      height: 70px;
      min-width: 60px;
      line-height: $nav-height;
      text-align: center;
      padding: 0 10px;

      .navbar-down-icon {
        background: url('./images/navbar-down-icon.png') no-repeat left;
        width: 11px;
        height: 7px;
        display: inline-block;
        transform: translate(4px, -1px);
        transition: opacity .3s;
      }

      > a {
        display: inline-block;
        position: relative;
        font-size: 14px;
        color: $font-dark;
        padding: 0px 15px;
        line-height: $nav-height;
        z-index: 12;
        background-color: transparent;
        text-align: center;
        transition: background 0.3s ease;
        cursor: pointer;
        height: 70px;
        min-width: 68px;
        box-sizing: border-box;
        &:after {
          content: "";
          transition: background 0.3s ease;
        }
        .nav-hot-icon {
          background: url('./images/nav-hot-icon.png');
          width: 20px;
          height: 26px;
          display: inline-block;
          /*transform: translate(35px, 24px);*/
          position: relative;
        }
      }

      &:hover, &:active {
        > a {
          color: $new-main-deep-color;
          border-bottom: 3px solid $new-main-deep-hover-color;
        }
      }

    }

    /*  .navbar-slide-underline {
        background: $new-main-deep-hover-color;
        width: 96px;
        height: 3px;
        position: absolute;
        top: 67px;
        left: 196px;
        z-index: 11;
      }*/
  }

  .sports-icon {
    position: absolute;
    top: 16px;
    left: -10px;
  }

</style>

<style lang="scss">
  @import '../../../game-center/misc/mixin';
  //公共样式 begin
  .gl-main-navbar {
    .nav {
      > li {
        &:hover, &.active {
          .nav-channel-container {
            display: block;
            animation-name: fadeInDown;
            animation-timing-function: ease;
            animation-duration: .5s;
            animation-fill-mode: forwards;
          }
          @keyframes fadeInDown {
            0% {
              display: none;
              opacity: 0;
              transform: translate(-50%, -5%) ;//scaleY(1)
            }

            100% {
              display: block;
              opacity: 1;
              transform: translate(-50%, 0px) ;//scaleY(1)
            }
          }
        }
      }
    }

    .nav-channel-container {
      position: absolute;
      background: #fcfcfc;
      display: none;
      height: 180px;
      left: 50%;
      top: 70px;
      transform:  translate(-50%, -100%) ;//scaleY(0)
      opacity: 0;
      width: 100%;
      margin: 0 auto;
      box-shadow: 0 1px 5px #ddd inset;
      z-index: 0;

      .nav-channel-content {
        width: 1200px;
        margin: 0 auto;
        font-size: 0;
      }

      .nav-channel-banner {
        @include inline-block-list();
        width: 238px;
        height: 180px;
        background-size: cover;
        float: left;
        &.slotPic {
          background: url('./images/banner-slot.png') no-repeat left/contain;
        }

        &.fishPic {
          background: url('./images/banner-fish.png') no-repeat left/contain;
        }

        &.realPic {
          background: url('./images/banner-real.png') no-repeat left/contain;
        }

        &.ticketPic {
          background: url('./images/banner-ticket.png') no-repeat left/contain;
        }
      }
      //公共样式 end

      //彩票菜单-特有 begin
      .nav-channel-main {
        position: relative;
        width: 961px;
        float: left;
        height: 162px;
        display: inline-block;
        padding: 18px 0 0;
        border-right: 1px solid #f0f0f0;
      }
      .nav-channel-list-container {
        @include inline-block-list();
        width: 610px;
        height: 196px;
        padding: 30px;
      }
      .classic-title {
        position: relative;
        float: left;
        width: 19px;
        height: 80px;
        padding: 10px 19px;
        z-index: 14;
        font-size: 14px;
        line-height: 15px;
        color: #323232;
        text-align: center;
        word-wrap: break-word;
      }

      .container-list {
        position: relative;
        float: left;
        height: 150px;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        &.constantly {
          width: 404px;
        }
        &.eleven {
          width: 101px;
        }
        //不符合语法
        /*&.3d {*/
          /*width: 101px;*/
        /*}*/
        &.happy {
          width: 101px;
        }
        li {
          display: inline-block;
          vertical-align: middle;
          list-style-type: none;
          width: 101px;
          height: 34px;
          position: relative;
          line-height: 34px;
          text-align: left;

          .navbar-ticket-chavon {
            background: url('./images/navbar-ticket-chavon.png');
            width: 4px;
            height: 7px;
            display: inline-block;
            margin-right: 10px;
            transition: background .3s;
          }

          a {
            font-size: 12px;
            color: #858585;
            transition: color .3s;
          }
          &:hover, &:active {
            .navbar-ticket-chavon {
              background: url('./images/navbar-ticket-chavon-active.png');
            }
            a {
              color: $new-main-deep-color;
            }
          }
        }
      }
      .navbar-ticket-icon-hot {
        position: absolute;
        top: 9px;
        width: 9px;
        height: 9px;
        background: url('./images/navbar-ticket-icon-hot.png');
        margin-left: 3px;
      }
      .navbar-ticket-icon-new {
        position: absolute;
        top: 9px;
        width: 9px;
        height: 9px;
        background: url('./images/navbar-ticket-icon-new.png');
        margin-left: 3px;
      }
      .sfa-badge-new {
        position: absolute;
        top: 9px;
        margin-left: 3px;
      }
      //彩票菜单-特有 end

      //体育菜单-特有
      /*     .list-item {
           display: inline-block;
           vertical-align: top;
           color: $font-dark;
           font-size: 14px;
           margin-right: 55px;
           margin-bottom: 20px;

           .sfa-mall-sport-icon {
             width: 25px;
             height: 25px;
             background: darken($font-auxiliary-color, 50%);;
             border-radius: 20px;
             margin-right: 20px;
           }
           .list-item-title {
             background: transparent;
             color: $font-dark;
             line-height: 25px;
             vertical-align: top;
           }
         }*/
      //体育菜单-特有 end

      //真人菜单,老虎机，捕鱼,-特有 begin
      .nav-channel-entry-container {
        @include inline-block-list();
        width: 961px;
        height: 180px;
        display: inline-block;
        border-right: 1px solid #f0f0f0;
      }
      .entry-item {
        @include inline-block-list();
        position: relative;
        width: 284px;
        height: 140px;
        border-right: 1px solid #f0f0f0;
        padding: 40px 0 0 35px;
        text-align: left;
        &:last-child {
          border-right: 0;
        }
        &.slot {
          width: 430px;
          height: 149px;
          padding: 15px 0 0 50px;
        }
        &.fish {
          width: 392px;
          height: 155px;
          padding: 25px 0 0 88px;
        }
        > div {
          @include inline-block-list();
        }
        .entry-coming-soon {
          position: absolute;
          top: 0;
          left: 0;
          width: 73px;
          height: 68px;
          background: url(./images/entry-coming-soon.png);
        }

      }

      .entry-item-img {
        width: 97px;
        height: 93px;
        margin-right: 15px;
        background-position: center bottom;
        background-repeat: no-repeat;

        &.icon-real-ag {
          background-image: url('./images/icon-real-ag.png');
        }
        &.icon-real-ebet {
          background-image: url('./images/icon-real-ebet.png');
        }
        &.icon-real-bbin {
          background-image: url('./images/icon-real-bbin.png');
        }

        &.icon-slot-pt {
          background-image: url('./images/icon-slot-pt.png');
          width: 243px;
          height: 150px;
        }

        &.icon-slot-mg {
          background-image: url('./images/icon-slot-mg.png');
          width: 243px;
          height: 150px;
        }

        &.icon-fish-ag {
          background-image: url('./images/icon-fish-ag.png');
          width: 130px;
          height: 137px;
          margin-right: 40px;
        }

        &.icon-fish-gg {
          background-image: url('./images/icon-fish-gg.png');
          width: 155px;
          height: 137px;
          margin-right: 40px;
        }
      }

      .entry-down {
        font-size: 12px;
        color: #4dafb9;
        .entry-qrcode {
          display: inline-block;
          width: 16px;
          height: 15px;
          margin: 0 5px 0 5px;
          background: url(./images/entry-qrcode.png);
          vertical-align: middle;
        }
        &.disabled {
          color: #999;
          cursor: default;
          .entry-qrcode {
            display: inline-block;
            width: 16px;
            height: 15px;
            margin: 0 5px 0 5px;
            background: url(./images/entry-qrcode-disabled.png);
            vertical-align: middle;
          }
        }

      }

      .entry-item-content {
        position: absolute;
        top: 34px;
        margin-left: 10px !important;
      }

      .entry-item-title {
        font-size: 16px;
        color: $new-inverse-color;
        margin-bottom: 5px
      }

      .entry-item-desc {
        font-size: 14px;
        color: $def-gray-color;
        margin-bottom: 14px
      }

      .entry-item-btn {
        width: 90px;
        height: 28px;
        border-radius: 14px / 14px;
        border: none;
        color: $def-black-color !important;
        font-size: 14px !important;
        line-height: 28px;
        border: 1px solid $def-gray-color;
        background: $def-white-color;
        padding: 0;
        display: block;
        //margin: 0 auto 10px;
        margin-bottom: 15px;

        &:hover, &:active {
          background: $new-main-deep-color;
          color: white !important;
          border-color: $new-main-deep-color;
        }
        &.disabled {
          &:hover, &:active {
            background: $def-white-color;
            color: $def-black-color !important;
            border-color: $def-gray-color;
          }
        }
      }

      //真人菜单,老虎机，捕鱼,-特有 begin

    }
  }
</style>
