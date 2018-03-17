<template>
  <div class="js-app-container">
    <div class="main-top">
      <main-header></main-header>
      <div id="notice" class="notice-container"></div>
      <nav-bar class="navbar-container"></nav-bar>
    </div>
    <div class="global-main wrapper m-center">
      <div class="wrapper-main">
        <div id="main" class="main-container clearfix"></div>
        <div id="main-vue" class="main-container clearfix">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </div>
    </div>
    <main-footer></main-footer>
    <login v-if="loginDialogStatus"></login>
    <logout v-if="logoutDialogStatus"></logout>
    <logout-notice v-if="logoutNoticeStatus"></logout-notice>
    <reset-pwd v-if="resetPassWordDialogStatus"></reset-pwd>
    <login-launcher v-if="loginLauncherStatus"></login-launcher>
    <free-trial v-if="freeTrialStatus"></free-trial>
    <dialog-manage v-if="getLoginStatus"></dialog-manage>
    <game-down-load v-if="gameDownLoadStatus"></game-down-load>
    <desktop-message v-if="openDeskTopMsgStatus"></desktop-message>
    <im-dialog v-if="openImDialogStatus"></im-dialog>

  </div>
</template>

<script>
  import MainHeader from 'skeleton/bases/header'
  import NavBar from 'skeleton/bases/navbar'
  import Login from 'skeleton/bases/login'
  import Logout from 'skeleton/bases/login/logout'
  import LogoutNotice from 'skeleton/bases/login/logoutNotice'
  import MainFooter from 'skeleton/bases/footer'
  import ResetPwd from 'skeleton/bases/login/resetPassWord'
  import LoginLauncher from 'skeleton/bases/loginLauncher'
  import FreeTrial from 'skeleton/bases/freeTrial'
  import DialogManage from 'skeleton/bases/dialogManage'
  import GameDownLoad from 'gameCenter/downLoad'
  import DesktopMessage from 'skeleton/bases/desktop-message'
  import ImDialog from 'skeleton/bases/toolbar/im'

  export default {
    name: 'app-entry',

    components: {
      MainHeader,
      NavBar,
      MainFooter,
      Login,
      Logout,
      LogoutNotice,
      ResetPwd,
      LoginLauncher,
      FreeTrial,
      DialogManage,
      GameDownLoad,
      DesktopMessage,
      ImDialog
    },

    data() {
      return {

      }
    },

    computed: {
      ...mapGetters([
        'loginDialogStatus',
        'logoutDialogStatus',
        'resetPassWordDialogStatus',
        'loginLauncherStatus',
        'freeTrialStatus',
        'getLoginStatus',
        'gameDownLoadStatus',
        'openDeskTopMsgStatus',
        'logoutNoticeStatus',
        'openImDialogStatus',
      ]),
    },
  }
</script>

<style scoped>

</style>
