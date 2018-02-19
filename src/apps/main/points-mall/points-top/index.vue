<template>
  <div class="points-top">
    <div class="left-top">
      <div class="left-top-inner">
        <div class="left-title">
          <div class="left-title-main">积分商城</div>
          <router-link class="intro-link" :to="{name: 'pointsIntro'}">
            了解积分商城
            <span class="sfa sfa-pt-intro"></span>
          </router-link>
        </div>
        <div class="sfa-pt-integral-mall"></div>
        <div class="left-profile">
          <div class="profile">
            <img :src="userAvatar" class="avatar" />
            您好！{{uName}}
            <div class="level">
              <span class="sfa" :class="`sfa-pt-level-${mallMemberLevel}`"></span>
            </div>
          </div>
          <div class="current-points">
            当前积分值：
            <span class="points-val">25320</span>
          </div>
          <div class="level-up">
            <div class="level-up-top">
              距离晋升还需：22046
            </div>
            <div class="left-ball">
              <div class="bar">
                <div class="current" style="width: 50%"></div>
              </div>
              LV4
            </div>
            <div class="level-tip">
              升级到LV4即可享受9.5折兑换特权
            </div>
          </div>
          <router-link class="points-exchange-btn" :to="{name: 'ticketRecords'}" tag="div">
            <span class="sfa sfa-pt-my-points"></span>
            我的积分与兑换
          </router-link>
        </div>
      </div>
    </div>
    <div class="right-banner-wrapper">
      <swiper>
        <swiper-item>
          <img :src="banner"/>
        </swiper-item>
      </swiper>
      <div class="sign-in" @click="showSignIn">
        <div class="sfa sfa-pt-sign-in"></div>
        签到
      </div>
    </div>
    <div v-transfer-dom>
      <x-dialog v-if="isShowSignIn" @modal-hidden="isShowSignIn = false">
        <sign-in slot="all"></sign-in>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import Swiper from './swiper'
  import SwiperItem from './swiper-item'
  import banner from './banner.png'

  import SignIn from '../points-sign-in'

  export default {
    name: 'points-top',

    components: {
      Swiper,
      SwiperItem,
      SignIn,
    },

    data() {
      return {
        banner,
        isShowSignIn: false
      }
    },

    computed: {
      ...mapState({
        'uName': state => state.loginStore.uName,
        'mallMemberLevel': state => state.loginStore.mallMemberLevel,
      }),
      ...mapGetters([
        'userAvatar'
      ])
    },

    methods: {
      showSignIn() {
        this.isShowSignIn = true
      }
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
      margin-left: -20px;
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

    .level {
      margin-left: 15px;
      margin-top: 4px;
    }

    .points-val {
      font-size: 24px;
      line-height: 30px;
      margin-left: 10px;
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
      box-shadow: inset 0px 1px 2px 0px    rgba(0, 0, 0, 0.42);
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
      .sfa-pt-my-points {
        margin-right: 5px;
      }
    }

  }

  .right-banner-wrapper {
    position: relative;
    margin-top: 23px;
    margin-left: -7px;

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
    }
  }
</style>
