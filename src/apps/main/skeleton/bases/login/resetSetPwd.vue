<template>
  <div>
    <form action="javascript:void(0);" class="form-horizontal rp-step-1-form " ref="setLoginPwd">
      <div class="text-center m-TB-md p-top-sm font-sm">请设置账户的新密码</div>
      <div class="control-group">
        <label class="control-label">新密码：</label>
        <div class="controls">
          <input type="password" class="reset-input" id="jsRPLoginPwd1"  data-parsley-length="[6, 20]"
                 v-model="pwdOne" value="" placeholder="6-20为字符组成，区分大小写，不能使用特殊字符"/>
        </div>
      </div>
      <div class="control-group">
        <label class="control-label">确认密码：</label>
        <div class="controls">
          <input type="password" class="reset-input" data-parsley-length="[6, 20]"
                 data-parsley-equalto="#jsRPLoginPwd1" value=""/>
        </div>
      </div>
      <div class="error-container text-center" v-show="error">
        <span class="sfa sfa-error-icon vertical-middle"></span>
        {{errorText}}
      </div>
      <div class="text-center m-top-lg">
        <button type="button" class="btn re-btn" data-loading-text="校验中" @click="setLoginPwd">提交</button>
      </div>
    </form>
  </div>
</template>
<script>
  import {resetLoginPwd} from 'api/resetPwd'
  export default {
    name: 'reset-set-pwd',
    props:{
      userName:{
        type:String,
        required: true
      },
      loginToken:{
        type:String,
        required: true
      }
    },
    data(){
      return{
        pwdOne:'',
        error:false,
        errorText:''
      }
    },
    methods:{
      setLoginPwd(){
        const status = $(this.$refs.setLoginPwd).parsley().validate()
        if(status){
          resetLoginPwd({loginPwd:this.pwdOne,username:this.userName,loginToken: this.loginToken},
            ({data}) => {
              if(data && data.result === 0){
                this.$emit('gonext')
              }else{
                this.error = true
                this.errorText = data.msg === 'fail' ? '设置登录密码请求失败' : data.msg
              }
            },
            ({data}) => {
              this.error = true
              this.errorText = data.msg === 'fail' ? '设置登录密码请求失败' : data.msg
            }
          )
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
