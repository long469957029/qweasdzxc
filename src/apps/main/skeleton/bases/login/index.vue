<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="loginModal">
    <!--v-show="openLogin">-->
    <div class="modal-dialog modal-login">
      <div class="login-head">
        <a class="close btn-close" data-dismiss="modal">×</a>
        <span class="modal-head-title">无限娱乐会员登录</span>
      </div>
      <div class="login-body">
        <div class="login-input-item">
          <div class="login-username-img">
            <i class="fa fa-user-o" aria-hidden="true"></i>
          </div>
          <input class="login-input" :class="{'parsley-error': usernameError,'parsley-success':usernameSuccess}"
                 @blur="verifyUserName"
                 placeholder="请输入您的用户名" v-model="username"
                 autocomplete="off" required></div>

        <div class="login-input-item">
          <div class="login-password-img sfa sfa-icon-password">
          </div>
          <input type="password" class="login-input"
                 :class="{'parsley-error': passwordError,'parsley-success':pwdSuccess}"
                 @blur="verifyPwd" @keyup.enter="userLogin"
                 placeholder="请输入您的密码" v-model="password"
                 autocomplete="off" required></div>
        <div class="login-input-item" :class="{'hidden':showCodeItem}">
          <div class="login-verity-img sfa sfa-icon-verify">
          </div>
          <input class="login-verity" :class="{'parsley-error': codeError,'parsley-success':codeSuccess}"
                 @blur="verifyCode"
                 placeholder="请输入验证码" v-model="code" maxlength="4" required
                 autocomplete="off">
          <img class="js-login-valImg  var-code" :src="codeUrl">
          <div class="login-verity-refresh pull-right inline-block" :class="{'toCircle':toCircle}"><i
            class="fa fa-repeat"
            aria-hidden="true"
            @click="clickRefreshValCode"></i>
          </div>
          <input type="hidden" value="0">
        </div>
      </div>
      <div class="login-footer">
        <div class="login-error-container" v-show="showErrorMsg">
          <span class="sfa sfa-error-icon vertical-sub pull-left"></span>
          <div class="tooltip-inner parsley-required">{{errorMsg}}</div>

        </div>
        <button @click="userLogin" class="submit btn-login-submit" data-loading-text="登录中" :disabled="pushing">登录
        </button>
        <span @click="forgotPwd" class="btn-forgot-pwd btn-link" data-dismiss="modal">忘记密码?</span>
      </div>
    </div>
  </div>
</template>
<script>
  import loginApi from 'api/login'
  const Encryption = require('com/encryption')

  export default{
    name: 'login',

    data () {
      return {
        showErrorMsg: false,
        usernameError: false,
        passwordError: false,
        usernameSuccess: false,
        pwdSuccess: false,
        codeError: false,
        codeSuccess: false,
        showCodeItem: true,
        toCircle: false,
        codeUrl: 'http://forehead.5x5x.com/acct/imgcode/code?_t=1515997888887',
        pushing: false,
        errorMsg: '',
        username: '',
        password: '',
        newUsername: '',
        newPassword: '',
        code: '',
        newCode: '',
      }
    },

    props: {},

    components: {},

    filters: {},

    methods: {
      userLogin(){
        const encryption = new Encryption()
        const param = encryption.encryptSha(`${new Date().valueOf()}`)
        const entPassword = encryption.encrypt(this.password, param)
        if (this.username === '' || this.password === '') {
          this.usernameError = false
          this.passwordError = false
          this.showErrorMsg = true
          this.errorMsg = '用户名或密码不能为空！'
          return false
        } else {
          if (!this.verifyUserName() && !this.verifyPwd()) {
            return false
          }
          if (this.showCodeItem) {
            if (!this.verifyCode()) {
              return false
            }
          }
        }
        this.pushing = true
        loginApi.pushLoginInfo({
          username: this.username,
          loginPwd: entPassword,
          param,
          code: this.code,
        }, ({data}) => {
          this.pushing = false
          if (data.result === 0) {
            // 状态的值
            // int WOKRING = 0;// 正常
            // int DISABLED = 100;// 冻结,只登录
            // int DEEP_DISABLED = 101;// 冻结，完全冻结
            // int ENABLED = 102;// 解冻
            // int RECOVER = 103;// 回收
            // int RESET = 104;// 重置
            // int BYPARENT = 105;// 手工开户
            // int BYSUPER = 106;// 总代开户
            const acctInfo = data.root || {}
            if (this.login && acctInfo.outTime && acctInfo.outTime !== 0) {
              this.autoLogoutCountdown(acctInfo.outTime)
            }
            window.Global.cookieCache.set('token', acctInfo.token, 90)
            window.Global.cookieCache.set('loginState', true)
            const status = Number(data.root.userStatus)
            if (status === 0 || status === 100 || status === 102) {
              this.$store.commit(types.USER_LOGIN_SUCCESS, acctInfo)
              this.closeDialog()
            } else if (status === 104 || status === 105 || status === 106) {
//              const ur = `userName=${data.root.username}${data.root.uName ? `&uName=${data.root.uName}` : ''}&status=${status}`
//              window.location.href = `resetInitPwd.html?${encodeURI(ur)}`
//              this.$store.commit(types.TOGGLE_RESET_INIT_PWD, true)
//              this.$store.commit(types.COMMIT_USER_TOKEN, acctInfo.token)
              $(this.$refs.loginModal).modal('hide')
              window.location.href = 'resetInitPwd.html'
            } else if (status === 101) {
              this.showErrorMsg = true
              this.errorMsg = '完全冻结的用户无法登录！'
            }
            else if (status === 103) {
              this.showErrorMsg = true
              this.errorMsg = '该用户已被回收！'
            } else {
              this.$emit('dialogClose')
              window.location.href = 'index.html'
            }

          } else if (data.msg.indexOf('验证码') !== -1) {
            this.showCodeItem = false
            this.codeError = true
            this.showErrorMsg = true
            this.codeSuccess = false
            this.errorMsg = '请输入验证码！'
            this.refreshValCode()
          } else {
            this.showErrorMsg = true
            this.errorMsg = `${data.msg}！`
          }
        })
      },
      forgotPwd() {
        this.$store.commit(types.TOGGLE_RESET_PASSWORD_DIALOG, true)
      },
      verifyUserName(){
        if (this.username === '') {
          this.usernameError = false
          this.showErrorMsg = false
          this.usernameSuccess = false
        } else {
          const myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
          if (!myReg.test(this.username)) {
            this.showErrorMsg = true
            this.errorMsg = '用户名仅支持4-16位字母和数字，不能以数字开头！'
            this.usernameError = true
            this.usernameSuccess = false
            return false
          } else {
            this.usernameError = false
            this.showErrorMsg = false
            this.usernameSuccess = true
            return false
          }
        }
        return true
      },
      verifyPwd(){
        if (this.password === '') {
          this.passwordError = false
          this.showErrorMsg = false
          this.pwdSuccess = false
        } else {
          const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
          if (this.password.length < 9 && this.strBetweenIsNumber(this.password, 0, 7)) {
            this.passwordError = true
            this.showErrorMsg = true
            this.pwdSuccess = false
            this.errorMsg = '密码不能是9位以下的纯数字！'
            return false
          } else if (!pwReg.test(this.password)) {
            this.passwordError = true
            this.showErrorMsg = true
            this.pwdSuccess = false
            this.errorMsg = '密码为6-20位字符组成（不含空格），区分大小写！'
            return false
          }
        }
        return true
      },
      verifyCode(){
        if (this.code === '') {
          this.codeError = false
          this.showErrorMsg = false
          this.codeSuccess = false
        } else if (this.code.length !== 4) {
          this.codeError = true
          this.showErrorMsg = true
          this.pwdSuccess = false
          this.errorMsg = '验证码输入错误！'
          return false
        } else {
          loginApi.valCodeXhr({
              code: this.code
            },
            ({data}) => {
              if (data && data.result === 0) {
                this.codeError = false
                this.showErrorMsg = false
                this.codeSuccess = false
              } else {
                if (this.showErrorMsg = false) {
                  this.codeError = true
                  this.showErrorMsg = true
                  this.codeSuccess = false
                  this.errorMsg = '请输入验证码！'
                } else {
                  this.codeError = true
                  this.showErrorMsg = true
                  this.codeSuccess = false
                  this.errorMsg = '验证码输入有误！'
                }
                this.refreshValCode()
              }
            })
        }
        return true
      },
      // 刷新登录表单验证码
      refreshValCode () {
//        const url = window.self.location.toString()
//        const codeChangeUrl = `${url.substring(0, url.indexOf('/', url.indexOf('://', 0) + 3))}/acct/imgcode/code`
        const codeChangeUrl = 'http://forehead.5x5x.com/acct/imgcode/code'
        this.codeUrl = ''
        // 验证码
        this.codeUrl = `${codeChangeUrl}?_t=${_.now()}`
        this.code = ''
      },
      // 点击刷新登录表单验证码
      clickRefreshValCode(){
        if (this.toCircle) {
          this.toCircle = false
        }
        this.toCircle = true
        this.refreshValCode()
      },
      strBetweenIsNumber (str, star, end) {
        const strArr = str.split('').slice(star, end)
        let isHasNumber = true
        $.each(strArr, (index, item) => {
          if (!$.isNumeric(item)) {
            isHasNumber = false
          }
        })
        return isHasNumber
      },

      closeDialog(){
        $(this.$refs.loginModal).modal('hide')
      },
    },
    mounted(){
      this.$nextTick(() => {
//          this.$refs.showLogin.init()
        $(this.$refs.loginModal).modal({
          backdrop: 'static',
        })
          .on('hidden.modal', () => {
            this.$store.commit(types.TOGGLE_LOGIN_DIALOG, false)
          })
      })
    },
  }
</script>

<style lang="scss" scoped>
  .modal-login {
    z-index:1051;
    border: 0;
    width: 386px;
    min-height: 425px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    .login-head {
      text-align: center;
      font-size: 15px;
      color: #333333;
      padding: 44px 0 17px 0;
    }
    .login-body {
      padding-bottom: 13px;
      .login-input-item {
        position: relative;
        margin: 26px 0;
        color: #999999;
        font-size: 0;
        .login-input {
          width: 320px;
          height: 50px;
          border: 1px solid #e6e6e6;
          padding-left: 68px;
          border-radius: 4px;
          outline: 0;
          color: $font-auxiliary-color;
          &.active, &:focus, &:active {
            border: 1px solid $new-main-deep-color;
          }
          &.parsley-error {
            color: #666666;
            border: 1px solid #e84c4c !important;
          }
          &.parsley-success {
            color: #666666;
            border: 1px solid $new-main-deep-color !important;
          }
        }
      }
      .login-username-img {
        font-size: 25px;
        position: absolute;
        top: 15px;
        left: 20px;
        color: #bababa;
      }
      .login-password-img {
        position: absolute;
        top: 14px;
        left: 18px;
      }
      .login-verity-img {
        position: absolute;
        top: 14px;
        left: 18px;
      }
      .login-verity {
        padding-left: 68px;
        width: 158px;
        height: 50px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        outline: 0;
        color: $font-auxiliary-color;
        &.active, &:focus {
          border: 1px solid $new-main-deep-color;
        }
        &.parsley-error {
          border: 1px solid #e84c4c !important;
        }
        &.parsley-success {
          color: #666666;
          border: 1px solid $new-main-deep-color !important;
        }
      }
      .var-code {
        width: 110px;
        height: 50px;
        border-radius: 4px;
        margin-left: 20px;
      }
      .login-verity-refresh {
        font-size: 21px;
        margin-top: 18px;
        color: #bababa;
        &.toCircle {
          transform: rotate(360deg);
          -ms-transform: rotate(360deg); /* IE 9 */
          -moz-transform: rotate(360deg); /* Firefox */
          -webkit-transform: rotate(360deg); /* Safari 和 Chrome */
          -o-transform: rotate(360deg); /* Opera */

          transition: 1s;
          -moz-transition: 1s; /* Firefox 4 */
          -webkit-transition: 1s; /* Safari 和 Chrome */
          -o-transition: 1s; /* Opera */
        }
      }
    }
    .login-footer {
      text-align: center;
      position: relative;
      .login-error-container {
        position: absolute;
        top: -25px;
        .tooltip-inner {
          margin-left: 10px;
        }
      }
      .btn-login-submit {
        width: 390px;
        height: 50px;
        border-radius: 4px;
        background-color: $new-main-deep-color;
        color: $def-white-color;
        border: 1px solid #14b1bb;
        outline: 0;
      }
      .btn-forgot-pwd {
        color: $new-inverse-color;
        margin: 25px 0 55px 0;
        font-size: 14px;

      }
    }
  }
</style>

