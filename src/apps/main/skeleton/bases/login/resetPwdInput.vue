<template>
  <div>
    <form action="javascript:void(0);" class="form-horizontal rp-step-1-form " ref="verifyPhoneOrMail">
      <div class="text-center m-TB-md font-sm">请输入{{findType === 2 ? '手机' : '电子邮箱'}}验证码</div>
      <div class="control-group">
        <label class="control-label">绑定{{findType === 2 ? '手机' : '邮箱'}}：</label>
        <div class="controls">
          <input type="text" class="reset-input" :value="findType === 2 ? mobile : email" disabled/>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">验证码：</label>
        <div class="controls">
          <input type="text" class="input-varCode" autocomplete="off" v-model="code" required  data-parsley-errors-container=".js-rp-code-error" />
          <a class="set-code-btn" @click="sendCode" :disabled="time > 0">{{text}}</a>
          <div class="js-rp-code-error parsley-error-container inline-block" style="max-width: 144px"></div>
        </div>
      </div>
      <div class="error-container text-center" v-show="error">
        <span class="sfa sfa-error-icon vertical-middle"></span>
        {{errorText}}
      </div>
      <div class="text-center m-top-md">
        <button type="button" class="btn re-btn" data-loading-text="校验中" @click="verifyPhoneOrMail">提交</button>
      </div>
      <div class="text-center">
        <button type="button" class="btn btn-link font-sm m-top-sm" @click="goParentPrev">返回上一步</button>
      </div>
    </form>
  </div>
</template>
<script>
  import {setSmscodeXhr, verifyCodeXhr} from 'api/resetPwd'
  const init = function () {
    return{
      code: '',
      error:false,
      errorText:'',
      second:30,
      time:0,
      dataXhr:{}
    }
  }
  export default{
    name: 'reset-pwd-input',

    props:{
      findType:{
        type:Number,
        required: true
      },
      mobile:{
        type:String
      },
      email:{
        type:String
      },
      userName:{
        type:String,
        required: true
      },
      loginToken:{
        type:String,
        required: true
      }
    },

    data: init,
    computed:{
      text: function () {
        return this.time > 0 ? `${this.time}s后重新获取` : '发送验证码'
      }
    },
    methods:{
      startCountDown(){
        this.time = this.second
        this.timer()
      },
      timer(){
        if(this.time > 0){
          this.time -= 1
          setTimeout(this.timer,1000)
        }
      },
      sendCode(){
        const url = this.findType === 2 ? '/acct/smscode/send.json' : '/acct/smtpCode/send.json'
        _(this.dataXhr).extend({
          url
        })
        setSmscodeXhr(this.dataXhr,
          ({data}) => {
            if(data && data.result === 0){
              this.startCountDown()
            }else {
              this.error = true
              this.errorText = data.msg === 'fail' ? '验证码发送失败' : data.msg
            }
          },
          ({data}) => {
            this.error = true
            this.errorText = data.msg === 'fail' ? '验证码发送失败' : data.msg
          }
        )
      },
      verifyPhoneOrMail(){
        if(this.code === ''){
          this.error = true
          this.errorText = '请输入验证码'
          return false
        }
        const url = this.findType === 2 ? '/acct/smscode/val.json' : '/acct/smtpCode/val.json'
        _(this.dataXhr).extend({
          url,
          code:this.code
        })
        verifyCodeXhr(this.dataXhr,
          ({data}) => {
            if(data && data.result === 0){
              if(data.root && data.root.success === 0){
                this.$emit('gonext')
              }else{
                this.error = true
                this.errorText = '验证码错误'
              }
            }else {
              this.error = true
              this.errorText = data.msg === 'fail' ? '验证码校验失败' : data.msg
            }
          },
          ({data}) => {
            this.error = true
            this.errorText = data.msg === 'fail' ? '验证码校验失败' : data.msg
          }
        )
      },
      goParentPrev(){
        Object.assign(this.$data, init())
        this.$emit('goprev')
      }
    },
    mounted(){
      _(this.dataXhr).extend({
        token: this.loginToken,
        username: this.userName,
        type: 6
      })
    }
  }
</script>
<style lang="scss" scoped>
  .set-code-btn{
    width: 110px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background-color: #f9f9f9;
    border-radius: 3px;
    border: solid 1px #e6e6e6;
    display: inline-block;
    font-size: $font-sm;
    color: $new-inverse-color;
    vertical-align: top;
    cursor: pointer;
    margin-left: 10px;
  }

</style>
