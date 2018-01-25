<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="loginLauncherModal">
    <div class="modal-dialog modal-loginLauncher">
      <div class="launcher-header">
        <a class="close btn-close" data-dismiss="modal">×</a>
      </div>
      <div class="modal-container">
        <div class="modal-container-left inline-block"></div>
        <div class="modal-container-right inline-block">
          <div class="container-head"></div>
          <div class="container-line"></div>
          <div class="container-text">
            <span class="text-circle"></span>
            <span class="text-desc">根据您的网络状况，推荐3条最快的访问线路</span>
          </div>
          <div class="container-text">
            <span class="text-circle"></span>
            <span class="text-desc">完美避免假冒、山寨版网站，保证账号资金安全</span>
          </div>
          <div class="container-text">
            <span class="text-circle"></span>
            <span class="text-desc">只需下载一次，永久自动更新</span>
          </div>
          <div class="container-download">
            <a href="/setup.exe" target="_blank" class="logger">下载登录器</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'login-launcher',

    data () {
      return {}
    },

    props: {},

    components: {},
    watch: {
      loginLauncherStatus(loginLauncherStatus) {
        if (loginLauncherStatus) {
          this.openLoginLauncher()
        }
      },
    },

    computed: {
      ...mapGetters([
        'loginLauncherStatus',
      ]),
    },

    filters: {},

    methods: {
      openLoginLauncher(){
        this.$nextTick(() => {
          $(this.$refs.loginLauncherModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$store.commit(types.TOGGLE_LOGIN_LAUNCHER, false)
            })
        })
      },
      closeDialog(){
        $(this.$refs.loginLauncherModal).modal('hide')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .modal-loginLauncher {
    border: 0;
    width: 760px;
    min-height: 450px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    border-radius: 7px;
    box-shadow: 0 3px 8px 0 #999999;
    z-index: 1050;
    .launcher-header {
      width: 760px;
      height: 150px;
      background-image: url('./misc/loginLauncher-back.png');
      .btn-close {
        color: #fff;
        &.active, &:hover {
          color: #fff;
        }
      }
    }
    .modal-container {
      margin-top: -30px;
      .modal-container-left {
        margin: 15px 30px;
        width: 354px;
        float: left;
        height: 218px;
        background-image: url('./misc/loginLauncher-computer.png');
      }
      .modal-container-right {
        text-align: left;
        .container-head {
          width: 207px;
          height: 28px;
          background-image: url('./misc/loginLauncher-title.png');
        }
        .container-line {
          width: 40px;
          height: 3px;
          margin-top: 18px;
          margin-bottom: 10px;
          background-color: #17b4bd;
        }
        .container-text {
          padding: 8px 0;
          .text-circle {
            width: 5px;
            height: 5px;
            border-radius: 40px;
            float: left;
            margin-right: 8px;
            background-color: #cccccc;
            margin-top: 7px;
          }
          .text-desc {
            font-size: 14px;
            color: #cccccc;
          }
        }
        .container-download {
          margin-top: 35px;
          border-radius: 25px;
          text-align: center;
          font-size: 17px;
          padding: 13px 0;
          height: 22px;
          width: 210px;
          background-color: #15b2bc;
          color: #fff;
        }
      }
    }
  }
</style>

