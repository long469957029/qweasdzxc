<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="resetPwdModal">
    <div class="dialog-main">
      <div class="reset-dialog clearfix">
        <div class="reset-header">
          找回密码
          <a class="close btn-close" data-dismiss="modal">×</a>
        </div>
        <div class="reset-main clearfix wizard" ref="resetMain">
          <div class="steps clearfix">
            <ul role="tablist">
              <li role="tab" :class="['first', {current: stepsIndex === 0, done: stepsIndex > 0}]">
                <a>
                  <span class="current-info audible">current step: </span>
                  <div class="title">
                    1.验证用户名
                  </div>
                  <div class="number">
                    1
                  </div>
                  <div class="over"></div>
                </a>
              </li>
              <li role="tab" :class="['disabled', {current: stepsIndex === 1, done: stepsIndex > 1}]">
                <a>
                  <div class="title">
                    2.选择找回方式
                  </div>
                  <div class="number">
                    2
                  </div>
                  <div class="over"></div>
                </a></li>
              <li role="tab" :class="['disabled', {current: stepsIndex === 3, done: stepsIndex > 3}]">
                <a>
                  <div class="title">
                    3.设置新密码
                  </div>
                  <div class="number">
                    3
                  </div>
                  <div class="over"></div>
                </a></li>
              <li role="tab" :class="['disabled', {done: stepsIndex === 3}]">
                <a>
                  <div class="title">
                    4.完成！
                  </div>
                  <div class="number">
                    4
                  </div>
                  <div class="over"></div>
                </a></li>
            </ul>
          </div>
          <div class="step-list">
            <transition name="setpAnimate">
              <div class="rp-step-div" v-show="stepsIndex === 0">
                <form action="javascript:void(0);" class="form-horizontal rp-step-1-form " ref="verifyUN">
                  <div class="text-center m-TB-md font-sm">请输入您要找回密码的账号</div>
                  <div class="control-group">
                    <label class="control-label">用户名：</label>
                    <div class="controls">
                      <input type="text" id="jsRPUserName" class="reset-input" v-model="userName" data-parsley-username
                             placeholder="输入用户名" required/>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label">验证码：</label>
                    <div class="controls">
                      <input type="text" class="input-varCode" @keyup="valCode" v-model="codeVal" name=""
                             placeholder="输入验证码">
                      <input type="hidden" class="js-rp-valResult" value="1">
                      <img class="var-code" :src="codeSrc">
                      <span class="js-rp-val-result-div re-val-result-div" id="jsRPValResult"><span
                        class="js-re-val-res"></span></span>
                    </div>
                  </div>
                  <div class="js-rp-notice-page1">
                  </div>
                  <div class="text-center">
                    <button type="button" class="btn re-btn" data-loading-text="校验中" @click="verifyUsetName">提交</button>
                  </div>
                  <input type="hidden" class="js-rp-userNameContainer"/>
                  <input type="hidden" class="js-rp-tokenContainer"/>
                </form>
              </div>
            </transition>

            <!--选择密码找回方式-->
            <transition name="setpAnimate">
              <div class="rp-step-div" v-show="stepsIndex === 1">
                <div class="find-type">
                  <div class="type-list">
                    <div class="text-center font-sm">密保问题</div>
                    <div></div>
                    <div class="text-center">
                      <button type="button" class="btn" @click="">立即找回</button>
                    </div>
                  </div>
                  <div class="type-list">
                    <div class="text-center font-sm">手机验证</div>
                    <div></div>
                    <div class="text-center">
                      <button type="button" class="btn" @click="">立即找回</button>
                    </div>
                  </div>
                  <div class="type-list">
                    <div class="text-center font-sm">游戏验证</div>
                    <div></div>
                    <div class="text-center">
                      <button type="button" class="btn" @click="">立即找回</button>
                    </div>
                  </div>
                  <div class="text-center font-sm m-TB-md">
                    <i class="sfa sfa-error-icon"></i>
                    温馨提示：如以上方式都无法使用，请与
                    <a class="text-hot">在线客服</a>
                    联系，协助解决问题。
                  </div>
                </div>
              </div>
            </transition>
            <!--修改登录密码-->
            <transition name="setpAnimate">
              <div class="rp-step-div" v-show="stepsIndex === 2">
              </div>
            </transition>

            <!--完成-->
            <transition name="setpAnimate">
              <div class="rp-step-div" v-show="stepsIndex === 3">
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'reset-pwd',
    data(){
      return {
        url: window.self.location.toString(),
        codeUrl: '',
        codeSrc: '',
        codeVal: '',
        userName: '',
        stepsIndex: 0,  //当前步骤数
      }
    },
    watch: {
      resetPassWordDialogStatus(resetPassWordDialogStatus) {
        if (resetPassWordDialogStatus) {
          this.openResetPwdDialog()
        }
      },
    },
    computed: {
      resetPassWordDialogStatus(){
        return this.$store.getters.resetPassWordDialogStatus
      },
    },
    methods: {
      openResetPwdDialog(){
        this.$nextTick(() => {
          $(this.$refs.resetPwdModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$store.commit(types.TOGGLE_RESET_PASSWORD_DIALOG, false)
            })
        })
      },
      valCode(){
        console.log(this.codeVal)
      },
      verifyUsetName(){
        const status = $(this.$refs.verifyUN).parsley().validate()
        if (status) {

        }
      }
    },
    mounted(){
      this.codeUrl = `${this.url.substring(0, this.url.indexOf('/', this.url.indexOf('://', 0) + 3))}/acct/imgcode/code`
      this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
    }
  }
</script>
<style lang="scss" scoped>
  @mixin input-def {
    background-color: $prominent-dialog-body;
    border-radius: $globalInputRadius;
    border: solid 1px $im-line-color;
  }

  .dialog-main {
    display: flex;
    justify-content: center;
  }

  .reset-dialog {
    width: 800px;
    border-radius: 5px;
    background-color: $def-white-color;
    .reset-header {
      width: 800px;
      height: 60px;
      font-size: 18px;
      background-color: $sec-line-color;
      line-height: 60px;
      text-align: center;
      position: relative;
      color: $def-black-color;
      .close {
        font-size: 35px;
        top: 18px;
      }
    }
    .reset-main {
      width: 680px;
      margin: 0 auto;
      padding: 20px 0px;
      overflow: hidden;
      .step-list {
        /*position: relative;*/
      }
      .reset-input {
        width: 348px;
        height: 34px;
        @include input-def;
      }
      .input-varCode {
        width: 224px;
        height: 34px;
        @include input-def;
      }
      .control-label {
        padding-top: 10px;
      }
      .controls {
        margin-left: 130px;
      }
      .re-btn {
        width: 340px;
        height: 46px;
        font-size: $font-sm;
      }
      .rp-step-div {
        width: 600px;
        margin: 0 auto;
        /*position: absolute;*/
      }
      .var-code {
        width: 110px;
        height: 44px;
        margin-left: 10px;
      }
      .find-type {
        width: 100%;
      }
      .type-list {
        width: 33.3%;
        float:left;
      }
    }
  }
</style>
