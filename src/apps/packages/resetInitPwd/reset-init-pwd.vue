<template>
  <div class="reset-center">
    <div class="reset-header">
      <div class="reset-title">
        <div class="inline-block">
          <div class="reset-logo-reset-lg inline-block"></div>
          <div class="reset-title-name inline-block">
            重置密码
          </div>
        </div>
        <div class="js-gl-service reset-title-panel inline-block">
          <a href="javascript:void(0)"
             onclick="newwin = window.open('https://szzero.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=576264&amp;configID=53412&amp;jid=9259996324&amp;s=1&amp;enterurl=http%3A%2F%2Fforehead.5x5x.com%2Flogin.html','service','width=800,height=680'); newwin.moveTo(100,50);"
             title="联系客服">
            <span class="title-img inline-block"></span>
            <span class="title-text inline-block">在线客服</span>
          </a>
        </div>
      </div>
    </div>
    <div class="reset-body clearfix">
      <div class="reset-body-left" ref="leftBuilding"></div>
      <div class="reset-body-right" ref="rightBuilding"></div>
      <div class="reset-panel">
        <div class="reset-panel-title">
          <span class="title-img"></span>
          <span>提示：{{type === 1 ? "此账户由上级开户生成，为保障您的账户安全，请修改初始密码！" : "您的登录密码已被重置，请重新设置新密码！"}}</span>
        </div>
        <div class="pwd-input-panel">
          <span class="pwd-desc">新登录密码：</span>
          <input type="password" class="pwd-input" v-model="passwordModel" @focus="showDesc"
                 @blur="verifyPwd" @keyup.enter="resetInitPwd"
                 autocomplete="new-password" required></div>

        <div class="message-container">
          <span class="sfa sfa-error-gray-icon" v-if="errorIcon===1"></span>
          <span class="sfa sfa-error-icon" v-else-if="errorIcon===2"></span>
          <span class="message-text"
                :class="{error:errorIcon===2}">{{errorText}}</span>
          <!--<span class="message-text">4-16个字符，支持中英文和数字，不能以数字开头</span>-->
        </div>
        <div class="pwd-input-panel confirm">
          <span class="pwd-desc-confirm">确认密码：</span>
          <input type="password" class="pwd-input" v-model="passwordcheckModel" @focus="showConfirmDesc"
                 @blur="verifyConfirmPwd" @keyup.enter="resetInitPwd"
                 autocomplete="new-password" required></div>

        <div class="message-container confirm">
          <span class="sfa sfa-error-gray-icon" v-if="checkErrorIcon===1"></span>
          <span class="sfa sfa-error-icon" v-else-if="checkErrorIcon===2"></span>
          <span class="message-text" :class="{error:checkErrorIcon===2}">{{checkErrorText}}</span>
        </div>
        <div class="reset-submit-container">
          <span class="reset-submit" @click="resetInitPwd">确定</span>
          <span class="reset-cancel" @click="cancelInitPwd">取消</span>
        </div>
      </div>
      <div class="reset-panel-footer">
        <footer-copyright></footer-copyright>
        <div class="footer-tips">
          无限娱乐郑重提示：彩票有风险、投注需谨慎，未满18周岁的青少年禁止购买
        </div>
      </div>

    </div>
  </div>
</template>
<script>
  import loginApi from 'api/login'
  import FooterCopyright from "com/footer/index"

  export default{
    name: 'reset-init-pwd',
    data () {
      return {
        passwordFlag: false,
        passwordModel: '',
        passwordcheckModel: '',
        errorText: '',
        checkErrorText: '',
        errorIcon: 0,
        checkErrorIcon: 0,
        pwdTips: false,
        userToken: '',
        type:1 // 重置密码类型  1代表开户  2代表后台重置
      }
    },

    props: {},

    components: {FooterCopyright},

    mounted () {
      this.type = Number(_.getUrlParam('type'))
    },

    watch: {},

    computed: {},

    filters: {},
    created(){
      this.userToken = Global.cookieCache.get('token')
      Global.cookieCache.clear('token')
      Global.cookieCache.clear('loginState')
    },
    methods: {
      resetInitPwd(){
        if (this.passwordModel === '') {
          this.errorIcon = 2
          this.errorText = '密码不能为空'
          return false
        }
        if (this.passwordcheckModel === '') {
          this.checkErrorIcon = 2
          this.checkErrorText = '密码不能为空'
          return false
        }
        if (this.passwordcheckModel !== this.passwordModel) {
          this.checkErrorIcon = 2
          this.checkErrorText = '两次密码输入不一致'
          return false
        }
        if (!this.verifyPwd() && !this.verifyConfirmPwd()) {
          return false
        }
        loginApi.resetInitPwd({
          newPwd: this.passwordcheckModel,
          userToken: this.userToken,
        }, ({data}) => {
          if (data.result === 0) {
            window.Global.cookieCache.set('token', this.userToken, 160)
            window.Global.cookieCache.set('loginState', true)
            window.history.back(-1)
          } else {
            this.checkErrorIcon = 2
            this.checkErrorText = data.msg.length === 0 ? '重置密码失败！' : data.msg
          }
        })
      },
      cancelInitPwd(){
        Global.cookieCache.clear('token')
        Global.cookieCache.clear('loginState')
        window.history.go(-1)
      },
      verifyPwd(){
        let errorText = ''
        const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
        if (this.passwordModel.length > 0) {
          if (this.passwordModel.length < 9 && this.strBetweenIsNumber(this.passwordModel, 0, 7)) {
            errorText = '密码不能是9位以下的纯数字！'
          } else if (!pwReg.test(this.passwordModel)) {
            errorText = '密码为6-20位字符组成（不含空格），区分大小写！'
          } else {
            errorText = ''
          }
        } else {
          this.errorIcon = 0
          this.errorText = ''
          return false
        }
        if (errorText !== '') {
          this.errorIcon = 2
          this.errorText = errorText
          return false
        } else {
          if (this.passwordModel.length > 0) {
            this.errorIcon = 0
            this.errorText = ''
            return true
          } else {
            this.errorIcon = 1
            this.errorText = '密码为6-20位字符组成（不含空格），区分大小写'
            return false
          }
        }
      },
      verifyConfirmPwd(){
        let errorText = ''
        const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
        if (this.passwordcheckModel.length > 0) {
          if (this.passwordcheckModel.length < 9 && this.strBetweenIsNumber(this.passwordcheckModel, 0, 7)) {
            errorText = '密码不能是9位以下的纯数字！'
          } else if (!pwReg.test(this.passwordModel)) {
            errorText = '密码为6-20位字符组成（不含空格），区分大小写！'
          }else if(this.passwordcheckModel!==this.passwordModel){
            errorText = '两次密码输入不一致'
          } else {
            errorText = ''
          }
        } else {
          this.checkErrorIcon = 0
          this.checkErrorText = ''
          return false
        }
        if (errorText !== '') {
          this.checkErrorIcon = 2
          this.checkErrorText = errorText
          return false
        } else {
          if (this.passwordcheckModel.length > 0) {
            this.checkErrorIcon = 0
            this.checkErrorText = ''
            return true
          } else {
            this.checkErrorIcon = 1
            this.checkErrorText = '密码为6-20位字符组成（不含空格），区分大小写'
            return false
          }
        }

      },
      showDesc(){
        this.errorIcon = 1
        this.errorText = '6-20位字符组成（不含空格），区分大小写，不能是9位以下的纯数字'
        return false
      },
      showConfirmDesc(){
        this.checkErrorIcon = 1
        this.checkErrorText = '请重复输入密码'
        return false
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
    }
  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/imports";

  .reset-center {
    height: 100%;
    overflow: hidden;
    .reset-header {
      width: 100%;
      height: 89px;
      position: relative;
      background: #ffffff;
      z-index: 51;
      box-shadow: 0 3px 8px 0 #e6e6e6;
      .reset-title {
        padding-top: 14px;
        width: 1000px;
        margin: 0 auto;
        .reset-logo-reset-lg {
          height: 47px;
          width: 181px;
          background: url('./misc/navbar-logo.png');
        }
        .reset-title-name {
          margin-left: 26px;
          font-size: 24px;
          vertical-align: top;
          margin-top: 19px;
          color: #666666;
        }
        .reset-title-panel {
          float: right;
          margin-top: 19px;
          width: 90px;
          font-size: 14px;
          text-align: right;
          height: 14px;
          line-height: 14px;
          position: relative;
          .title-img {
            width: 25px;
            height: 19px;
            background-image: url('./misc/initPwd-CustomService.png');
          }
          .title-text {
            margin-top: 3px;
            margin-left: 8px;
            float: right;
            color: #666666;
          }
        }
      }
    }
    .reset-body {
      width: 100%;
      height: 100%;
      background: #fafafa;
      position: relative;
      box-sizing: border-box;
      top: 0;
      .reset-body-left {
        width: 398px;
        background-image: url("./misc/initPwd-back-left.png");
        position: absolute;
        left: 0;
        /*background-size: cover;*/
        height: 248px;
      }
      .reset-body-right {
        width: 741px;
        background-image: url("./misc/initPwd-backgound-right.png");
        position: absolute;
        right: 0;
        bottom: 0;
        /*background-size: cover;*/
        height: 411px;
      }
      .reset-panel {
        border-radius: 5px;
        width: 1000px;
        z-index: 50;
        height: 460px;
        position: relative;
        background: $def-white-color;
        margin: 65px auto;
        box-sizing: border-box;
        border: 1px solid #e6e6e6;
        box-shadow: 0 3px 8px 0 #e6e6e6;
        opacity: 0.8;
        padding: 40px 115px;
        .reset-panel-title {
          padding: 4px 60px;
          height: 25px;
          line-height: 25px;
          width: 498px;
          font-size: 12px;
          color: $font-auxiliary-color;
          background-color: #fffcee;
          border: 1px solid #edd28b;
          margin-bottom: 45px;
          .title-img {
            float: left;
            width: 21px;
            height: 25px;
            margin-right: 5px;
            background-image: url("./misc/initPwd-light.png");
          }
        }
        .pwd-input-panel {
          font-size: 14px;
          margin-top: 27px;
          .pwd-desc {
            color: #666666;
            width: 80px;
          }
          .pwd-desc-confirm {
            color: #666666;
            width: 80px;
            margin-left: 13px;
          }
          .pwd-input {
            background-color: #f9f9f9;
            padding: 11.5px 10px;
            border: 1px solid #cccccc;
            border-radius: 4px;
            outline-width: 0;
            width: 258px;
            &.active, &:hover {
              border: 1px solid #14b1bb;
            }
          }
          &.confirm {
            position: absolute;
            top: 180px;
          }
        }
        .message-container {
          margin: 17px 88px;
          height: 14px;
          line-height: 14px;
          color: #999999;
          font-size: 12px;
          .message-text {
            vertical-align: top;
            color: #cccccc;
            &.error {
              color: #e84c4c;
            }
          }
          &.confirm {
            position: absolute;
            top: 246px;
          }
        }
        .reset-submit-container {
          padding: 30px 88px;
          position: absolute;
          top: 276px;
          .reset-submit {
            padding: 10.5px 81px;
            background-color: #14b1bb;
            color: #ffffff;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            margin-right: 20px;
          }
          .reset-cancel {
            color: #999999;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
      .reset-panel-footer {
        font-size: 0;
        margin: 150px auto 50px;
        width: 1000px;
        color: #333333;
        text-align: center;
        z-index: 50;
        position: relative;
        /*.footer-copyright {*/
        /*margin: 14px;*/
        /*color: #999999;*/
        /*font-size: 12px;*/
        /*.footer-copyright-name {*/
        /*margin-left: 3px;*/
        /*}*/
        /*}*/
        .footer-tips {
          margin: 3px;
          color: #999999;
          font-size: 12px;
        }
        /*<!--.footer-line {-->*/
        /*<!--width: 1200px;-->*/
        /*<!--height: 1px;-->*/
        /*<!--margin-bottom: 43px;-->*/
        /*<!--margin-left: -100px;-->*/
        /*<!--background-image: url("./misc/initPwd-back-line.png");-->*/
        /*<!--}-->*/
        /*.footer-partner {*/
        /*color: #999999;*/
        /*font-size: 12px;*/
        /*margin-bottom: 32px;*/
        /*.footer-partner-text {*/
        /*vertical-align: top;*/
        /*}*/
        /*.footer-partner-ag {*/
        /*width: 104px;*/
        /*height: 25px;*/
        /*background-image: url("./misc/initPwd-logo-ag.png");*/
        /*}*/
        /*.footer-partner-playtech {*/
        /*width: 104px;*/
        /*height: 25px;*/
        /*background-image: url("./misc/initPwd-logo-playtech.png");*/
        /*}*/
        /*.footer-partner-micro {*/
        /*width: 104px;*/
        /*height: 25px;*/
        /*background-image: url("./misc/initPwd-logo-micro.png");*/
        /*}*/
        /*.footer-partner-unipay {*/
        /*width: 104px;*/
        /*height: 25px;*/
        /*background-image: url("./misc/initPwd-logo-unipay.png");*/
        /*}*/
        /*.footer-partner-alipay {*/
        /*width: 104px;*/
        /*height: 25px;*/
        /*background-image: url("./misc/initPwd-logo-ali.png");*/
        /*}*/
        /*.footer-partner-wx {*/
        /*width: 104px;*/
        /*height: 25px;*/
        /*background-image: url("./misc/initPwd-logo-wx.png");*/
        /*}*/
        /*}*/
      }
    }
  }
</style>
