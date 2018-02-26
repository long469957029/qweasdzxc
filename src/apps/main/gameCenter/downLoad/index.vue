<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="gameDownLoad">
    <div class="modal-dialog modal-gameDownLoad">
      <div class="game-header">
        <a class="go-back" v-show="showUserInfo" @click="goBack">返回</a>
        {{title}}手机版下载
        <a class="close-md btn-close" data-dismiss="modal"></a>
      </div>
      <div class="game-body" v-show="!showUserInfo">
        <div class="tab">
          <div class="tab-main">
            <div :class="['tab-info',{'active': phoneIndex === 1}]" @click="phoneIndex = 1">
              <span class="icon android"></span>
              安卓版本
            </div>
            <div :class="['tab-info',{'active': phoneIndex === 2}]" @click="gameDownLoadGameId === 6 ? '' : phoneIndex = 2">
              <span class="icon ios"></span>
              IOS版本{{gameDownLoadGameId === 6 ? '（未开放）' : ''}}
            </div>
          </div>
        </div>
        <div class="type-one">
          <div class="text-default">下载方式一</div>
          <div class="text-inverse">扫描二维码下载</div>
          <img class="qrcode" :src="qrCode">
        </div>
        <div class="type-two">
          <div class="text-default">下载方式二</div>
          <div class="text-inverse">手机浏览器打开网址：<span class="text-cool">{{linkUrl}}</span></div>
        </div>
        <div class="show-user-pwd" @click="triggerShow" v-if="haveUserInfo">手机版专属账号>></div>
        <div class="tip">
          <span class="tip-icon"></span>
          建议使用浏览器扫码功能或专业二维码扫描工具，不建议使用微信、QQ扫码功能。
        </div>
      </div>
      <div class="user-body" v-show="showUserInfo">
        <div class="user-input">
          <label>账号：</label>
          <input type="text" disabled :value="userName"/>
        </div>
        <div class="user-input">
          <label>密码：</label>
          <input type="text" :disabled="!changePwd" v-model.trim="passWord" ref="pwdInput"/>
        </div>
        <div :class="['error-tip',{'text-hot': errorShow}]" v-show="changePwd">
          <span :class="['sfa',{'sfa-error-icon': errorShow,'sfa-error-gray-icon': !errorShow}]"></span>
          {{errorText}}
        </div>
        <div class="user-btn" @click="btnClick">{{changePwd ? '保存密码' : '修改密码'}}</div>
      </div>
    </div>
  </div>
</template>
<script>
  const config = [
      {
        gameId:1,
        title:"AG",
        qrCode: require('./images/ag-real-qrcode.png'),
        linkUrl:'agmbet.com'
      },
    {
      gameId:2,
      title:"EBET",
      qrCode: require('./images/ebet-qrcode.png'),
      linkUrl:'ebetapp.com/hezhong'
    },
    {
      gameId:3,
      title:"BBIN",
      qrCode:'',
      linkUrl:''
    },
    {
      gameId:4,
      title:"PT",
      qrCode:'',
      linkUrl:''
    },
    {
      gameId:5,
      title:"AG",
      qrCode: require('./images/ag-fish-qrcode.png'),
      linkUrl: 'hunter2.agmjs.com'
    },
    {
      gameId:6,
      title:"GG",
      qrCode: require('./images/gg-qrcode.png'),
      linkUrl:'app.5x5x.vip/gg'
    }
    ]
  import {
    getDownGameUserInfo,
    saveDownGamePwd
  } from 'api/other'
  export default{
    name: 'game-down-load',
    data(){
      return{
        title: '',
        qrCode: '',
        linkUrl: '',
        phoneIndex: 1,
        haveUserInfo:false,
        showUserInfo:false,
        userName:'',
        passWord:'',
        oldPwd:'',  // 用户点击返回时  将密码输入框内容重置为保存成功的密码
        changePwd:false,
        errorShow:false,
        errorText:'密码为6~12位字母或数字'
      }
    },
    computed:{
      ...mapGetters([
        'gameDownLoadGameId'
      ]),
    },
    methods: {
      triggerShow(){
        this.showUserInfo = !this.showUserInfo
      },
      btnClick(){
        if(this.changePwd){
          this.savePwd()
        }else{
          this.changePwd = !this.changePwd
          setTimeout(() => {
            this.$refs.pwdInput.focus()
          },300)
        }
      },
      goBack(){
        this.showUserInfo = !this.showUserInfo
        this.passWord = this.oldPwd
        this.changePwd = false
      },
      savePwd(){
        const passwordReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,12}$/
        if(this.passWord === ''){
          this.showError('新密码不可为空')
          return false
        } else if (!passwordReg.test(this.passWord)) {
          this.showError('您填写的密码不符合要求，请重新填写')
          return false
        } else{
          this.errorShow = false,
          this.errorText = '密码为6~12位字母或数字'
          saveDownGamePwd({channelId: this.gameDownLoadGameId,password:this.passWord},
            ({data}) => {
              if(data && data.result === 0){
                Global.ui.notification.show('修改密码成功', {
                  type: 'success',
                })
                this.changePwd = false
                this.oldPwd = this.passWord
              }else{
                this.showError(data.msg === 'fail' ? '验证失败，请稍后重试！' : data.msg)
              }
            },
            ({data}) => {
              this.showError(data.msg === 'fail' ? '验证失败，请稍后重试！' : data.msg)
            }
          )
        }
      },
      showError(text){
        this.errorShow = true
        this.errorText = text
      }
    },
    mounted(){
      this.title =  _(config).find({gameId: this.gameDownLoadGameId}).title
      this.qrCode = _(config).find({gameId: this.gameDownLoadGameId}).qrCode
      this.linkUrl = _(config).find({gameId: this.gameDownLoadGameId}).linkUrl
      this.$nextTick(() => {
        $(this.$refs.gameDownLoad).modal({
          backdrop: 'static',
        })
          .on('hidden.modal', () => {
            this.$store.commit(types.TOGGLE_GMAE_DOWN_LOAD, {showDialog:false})
          })
      })
      if(this.gameDownLoadGameId ===2 || this.gameDownLoadGameId === 6){
        getDownGameUserInfo({channelId: this.gameDownLoadGameId},
          ({data}) => {
            if(data && data.result === 0){
              if(!_.isNull(data.root)){
                this.haveUserInfo = true
                this.userName = data.root.gameUserName
                this.passWord = data.root.gameUserPassword
                this.oldPwd = data.root.gameUserPassword
              }
            }
          })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .modal-gameDownLoad{
    width: 570px;
    height: 530px;
    background-color: $def-white-color;
    border-radius: 5px;
    .game-header{
      width: 100%;
      height: 56px;
      background-color: $new-main-deep-color;
      box-shadow: 0px 1px 0px 0px
      rgba(0, 0, 0, 0.1);
      text-align: center;
      position: relative;
      line-height: 56px;
      font-size: 18px;
      color: $def-white-color;
      .go-back{
        width: 50px;
        height: 18px;
        cursor: pointer;
        color: $def-white-color;
        text-align: right;
        font-size: $font-sm;
        position: absolute;
        left: 21px;
        line-height: 18px;
        background: url("./images/arrow.png") no-repeat left;
        top: 19px;
      }
    }
    .game-body{
      width: 96%;
      margin: 0 auto;
      .tab{
        width: 100%;
        height: 80px;
        border-bottom: 2px solid #e9e9e9;
      }
      .tab-main{
        width: 75%;
        margin: 0 auto;
      }
      .tab-info{
        display: inline-block;
        width: 48%;
        height: 80px;
        margin-left: 1%;
        color: $new-inverse-color;
        font-size: $font-md;
        text-align: center;
        line-height: 80px;
        position: relative;
        cursor: pointer;
        &.active{
          color: $new-main-deep-color;
          &:after{
            content: '';
            width: 80%;
            height: 3px;
            background-color: $new-main-deep-color;
            display: block;
            position: absolute;
            left:10%;
            bottom: -2px;
          }
          .ios{
            background: url("./images/ios-active.png") no-repeat;
          }
          .android{
            background: url("./images/android-active.png") no-repeat;
          }
        }
      }
      .icon{
        width: 40px;
        height: 40px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        &.ios{
          background: url("./images/ios.png") no-repeat;
        }
        &.android{
          background: url("./images/android.png") no-repeat;
        }
      }
      .type-one{
        text-align: center;
        margin-top: 20px;
        font-size: $font-sm;
        color: $def-black-color;
        .qrcode{
          margin-top: 30px;
          width: 136px;
          height: 136px;
        }
      }
      .type-two{
        text-align: center;
        text-align: center;
        margin-top: 20px;
        font-size: $font-sm;
      }
      .tip{
        text-align: center;
        margin-top: 50px;
        .tip-icon{
          width: 18px;
          height: 18px;
          display: inline-block;
          background: url("./images/icon-tip.png") no-repeat;
          margin-right: 5px;
          vertical-align: middle;
          transform: translateY(-2px);
        }
      }
      .show-user-pwd{
        position: absolute;
        text-align: center;
        font-size: $font-sm;
        text-decoration: underline;
        cursor: pointer;
        width: 100%;
        bottom: 70px;
      }
    }
    .user-body{
      width: 380px;
      margin: 0 auto;
      padding-top: 35px;
      .user-input{
        margin-top: 25px;
        label{
          font-size: $font-sm;
          color: $def-black-color;
        }
        input{
          width: 306px;
          height: 40px;
          background-color: #f9f9f9;
          border-radius: 3px;
          border: solid 1px $def-gray-color;
        }
      }
      .error-tip{
        margin-top: 10px;
        margin-left: 46px;
        font-size: $font-xs;
        color: $font-auxiliary-color;
        .sfa{
          transform: translateY(3px);
        }
      }
      .user-btn{
        width: 320px;
        height: 54px;
        background-color: $new-main-deep-color;
        border-radius: 3px;
        margin-left: 45px;
        margin-top: 31px;
        text-align: center;
        line-height: 54px;
        color: $def-white-color;
        cursor: pointer;
      }
    }
  }
</style>
