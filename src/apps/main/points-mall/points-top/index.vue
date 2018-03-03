<template>
  <div class="points-top">
    <div class="left-top">
      <div class="left-top-inner">
        <div class="left-title">
          <div class="left-title-main">积分商城</div>
          <router-link class="intro-link" :to="{name: 'pointsIntro'}" target="_blank">
            了解积分商城
            <span class="sfa sfa-pt-intro"></span>
          </router-link>
        </div>
        <div class="sfa-pt-integral-mall"></div>
        <div class="left-profile" v-if="isLogin">
          <div class="profile">
            <img :src="userAvatar" class="avatar"/>
            <template>
              您好！{{username}}
            </template>
            <div class="level">
              <span class="sfa" :class="`sfa-pt-level-${mallBasicInfo.levelId}`"></span>
            </div>
          </div>
          <div class="current-points">
            可用积分值：
            <span class="points-val" :class="{'letter-spacing': !isLogin}">
              {{mallBasicInfo.fIntegral}}
            </span>
          </div>
          <div class="level-up">
            <div class="level-up-top">
              距离晋升还需：{{mallBasicInfo.fNextLevelIntegral}}
            </div>
            <div class="left-ball">
              <div class="bar">
                <div class="current" :style="`width: ${mallBasicInfo.nextPercent}%`"></div>
              </div>
              <template>
                {{mallBasicInfo.nextLevelName}}
              </template>
            </div>
            <div class="level-tip">
              <template>
                升级到{{mallBasicInfo.nextLevelName}}即可享受{{mallBasicInfo.fNextDiscount}}折兑换特权
              </template>
            </div>
          </div>
          <router-link class="points-exchange-btn" :to="{name: 'ticketRecords'}" tag="div" v-if="isLogin">
            <span class="sfa sfa-pt-my-points"></span>
            我的积分与兑换
          </router-link>
          <!--<div class="points-exchange-btn" @click="login" v-else>-->
          <!--立即登录-->
          <!--</div>-->
        </div>
        <div class="left-profile-unLogin" v-else>
          <div class="profile-unLogin-img">
            <div class="profile-unLogin-img-backend">
              <img :src="userAvatar" class="avatar"/>
            </div>
          </div>
          <div class="profile-unLogin-tips">
            登录后即可查看个人信息详情
          </div>
          <div class="points-exchange-btn" @click="login">
            马上登录
          </div>
        </div>
      </div>
    </div>
    <status-cell class="right-banner-wrapper" loading-tip="" :status="bannerStatus">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item, i) in bannerList" :key="i">
          <a :href="item.advUrl" v-if="item.advUrl" target="_blank">
            <img :src="item.picUrl"/>
          </a>
          <img v-else :src="item.picUrl"/>
        </swiper-slide>
        <template v-if="bannerList.length > 1">
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </template>
      </swiper>
      <div class="sign-in" @click="isLogin ? showSignIn() : login()">
        <div class="sfa sfa-pt-sign-in"></div>
        签到
      </div>
    </status-cell>
    <div v-transfer-dom>
      <x-dialog v-model="isShowSignIn">
        <sign-in slot="all" v-if="isShowSignIn"></sign-in>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {Swiper, SwiperSlide, checkLogin} from 'build'
  import {getMallBannerApi} from 'api/points'
  import banner from './banner.png'

  import SignIn from '../points-sign-in'

  export default {
    name: 'points-top',

    components: {
      Swiper,
      SwiperSlide,
      SignIn,
    },

    mixins: [checkLogin],

    data() {
      return {
        bannerList: [
          {
            advId: 0,
            advName: '',
            advUrl: '',
            picUrl: banner
          },
        ],
        bannerStatus: 'loading',
        isShowSignIn: false
      }
    },

    computed: {
      swiperOption() {
        let swiperOption = {
          loop: true,
          centeredSlides: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        }
        if (this.bannerList.length <= 1) {
          swiperOption.autoplay = false
        }
        return swiperOption
      },
      ...mapGetters([
        'username',
        'userAvatar',
        'mallBasicInfo'
      ])
    },

    methods: {
      login() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
      },
      showSignIn() {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行此操作，请先注册正式游戏账号', {modalDialogShadow: 'modal-dialog-shadow'})
          return false
        }
        this.isShowSignIn = true
      }
    },

    mounted() {
      getMallBannerApi(({data}) => {
        if (data && data.result === 0) {
          if (!_.isEmpty(data.root)) {
            this.bannerList = data.root
          }
        }
      })
        .finally(() => {
          this.bannerStatus = 'completed'
        })
    }
  }
</script>

<style lang="scss" scoped>
  .points-top {
    display: flex;
    .left-top {
      background: url('left-top.png');
      width: 350px;
      height: 479px;
      margin-left: -15px;
      margin-top: 9px;
    }
    .left-top-inner {
      margin-top: 14px;
      margin-left: 15px;
      margin-right: 15px;
    }

    .left-title {
      display: flex;
    }

    .left-title-main {
      font-size: 40px;
      color: #ffffff;
      line-height: 40px;
      flex: 1;
    }

    .left-top-inner {
      padding: 27px 10px 0 27px;
    }

    .left-profile {
      color: #ffffff;
    }

    .profile {
      display: flex;
      align-items: center;
      margin-bottom: 13px;

      .avatar {
        border: solid 2px #ffffff;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        margin-right: 15px;
      }
    }

    .sfa-pt-intro {
      margin-left: 3px;
    }

    .intro-link {
      display: flex;
      align-items: center;
    }

    .left-title {
      margin-bottom: 5px;
    }

    .sfa-pt-integral-mall {
      margin-bottom: 18px;
    }

    .left-profile {
      padding-top: 20px;
    }
    .left-profile-unLogin {
      text-align: center;
      padding: 26px;
      margin: 0 auto;
      .profile-unLogin-img-backend{
        width: 88px;
        height: 88px;
        text-align: center;
        background: #ffffff;
        border-radius: 50px;
        margin: 0 auto 25px;
        .avatar{
          margin-top: 4px;
        }
      }
      .profile-unLogin-tips{
        color: #ffffff;
        font-size: 15px;
        margin-bottom: 24px;
      }
      .points-exchange-btn{
        color: #ffffff;
        margin-left:0;
        font-size: 15px;
      }
    }
    .level {
      margin-left: 15px;
      margin-top: 4px;
    }

    .points-val {
      font-size: 24px;
      line-height: 30px;
      margin-left: 10px;
      &.letter-spacing {
        letter-spacing: 4px;
      }
    }

    .current-points {
      margin-left: 13px;
    }

    .level-up {
      padding-top: 5px;
      margin-left: 13px;
      margin-bottom: 30px;
    }

    .bar {
      height: 12px;
      width: 220px;
      background-color: #354257;
      margin-top: 4px;
      border-radius: 12px;
      margin-right: 8px;
      position: relative;
    }

    .left-ball {
      display: flex;
      color: #1b232f;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .current {
      height: 100%;
      background-color: #f7ca95;
      box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.42);
      border-radius: 6px;
    }

    .level-tip {
      color: #bec5cc;
    }

    .points-exchange-btn {
      cursor: pointer;
      margin-left: 12px;
      width: 240px;
      height: 46px;
      line-height: 46px;
      background-color: #808da6;
      border-radius: 23px;
      font-size: 14px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      .sfa-pt-my-points {
        margin-right: 5px;
      }
    }

  }

  .right-banner-wrapper {
    position: relative;
    margin-top: 23px;
    margin-right: 1px;
    height: 450px;
    width: 870px;
    flex: 1 0 auto;

    .swiper-container {
      height: 450px;
      width: 870px;
      overflow: hidden;
    }

    .sign-in {
      background-color: #e84c4c;
      box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.3);
      width: 42px;
      height: 52px;
      text-align: center;
      border-radius: 0 0 50px 50px;
      position: absolute;
      top: -10px;
      right: 12px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #ffffff;
      z-index: 1;
    }

    .swiper-button-prev {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23ffffff'/%3E%3C/svg%3E");
      left: -30px;
      right: auto;
      background-color: rgba(0, 0, 0, 0.2);
      width: 60px;
      height: 60px;
      border-radius: 50px;
      background-position: 75% 50%;
      background-size: 10px 20px;
      margin-top: -30px;
      transition: background-color .5s;
    }
    .swiper-button-next {
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23ffffff'/%3E%3C/svg%3E");
      right: -30px;
      left: auto;
      background-color: rgba(0, 0, 0, 0.2);
      width: 60px;
      height: 60px;
      border-radius: 50px;
      background-position: 25% 50%;
      background-size: 10px 20px;
      margin-top: -30px;
      transition: background-color .5s;
    }
    .swiper-button-next, .swiper-button-prev {
      &:hover {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
  }
</style>
