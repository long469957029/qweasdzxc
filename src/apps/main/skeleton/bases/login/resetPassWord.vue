<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="resetPwdModal">
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
        <div class="step-list clearfix">
          <transition name="setp-animate">
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
                    <!--<input type="hidden" class="js-rp-valResult" value="1">-->
                    <img class="var-code" :src="codeSrc" @click="refreshValCode">
                    <!--<span class="js-rp-val-result-div re-val-result-div" id="jsRPValResult"><span-->
                    <!--class="js-re-val-res"></span></span>-->
                    <div class="text-hot m-top-xs" v-if="codeError">
                      <span class="sfa sfa-error-icon vertical-middle"></span>
                      {{codeErrorText}}
                    </div>
                  </div>
                </div>
                <div class="js-rp-notice-page1">
                </div>
                <div class="text-center">
                  <button type="button" class="btn re-btn" data-loading-text="校验中" @click="verifyUsetName">提交</button>
                </div>
              </form>
            </div>
          </transition>

          <!--选择密码找回方式-->
          <transition name="setp-animate">
            <div class="rp-step-div" v-show="stepsIndex === 1">
              <div class="find-type m-top-md clearfix" v-show="findTypeNum === 0">
                <div class="type-list">
                  <div class="text-center font-sm m-bottom-md">密保问题</div>
                  <div :class="['icon',{active: hasBindQes}]">
                    <div class="wechat"></div>
                  </div>
                  <div class="text-center m-top-md">
                    <button type="button" :class="['btn', 'find-btn', {disable: !hasBindQes}]" :disabled="!hasBindQes"
                            @click="findType(1)">立即找回
                    </button>
                  </div>
                </div>
                <div class="type-list">
                  <div class="text-center font-sm m-bottom-md">手机验证</div>
                  <div :class="['icon',{active: hasBindMoblie}]">
                    <div class="moblie"></div>
                  </div>
                  <div class="text-center m-top-md">
                    <button type="button" :class="['btn', 'find-btn', {disable: !hasBindMoblie}]"
                            :disabled="!hasBindMoblie" @click="findType(2)">立即找回
                    </button>
                  </div>
                </div>
                <div class="type-list">
                  <div class="text-center font-sm m-bottom-md">邮箱验证</div>
                  <div :class="['icon',{active: hasBindMail}]">
                    <div class="mail"></div>
                  </div>
                  <div class="text-center m-top-md">
                    <button type="button" :class="['btn', 'find-btn', {disable: !hasBindMail}]" :disabled="!hasBindMail"
                            @click="findType(3)">立即找回
                    </button>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="text-center font-sm m-TB-md">
                  <i class="sfa sfa-error-icon"></i>
                  温馨提示：如以上方式都无法使用，请与
                  <a class="text-hot cursor-pointer">在线客服</a>
                  联系，协助解决问题。
                </div>
              </div>
              <div v-show="findTypeNum === 1">
                <div class="text-center m-TB-md font-sm">请正确输入密保问题</div>
                <form action="javascript:void(0);" class="form-horizontal rp-step-1-form" ref="verifyQes">
                  <div class="control-group">
                    <label class="control-label">问题一：</label>
                    <div class="controls">
                      <select class="select-qes" v-model="questionFirst" @change="changeQes(1)">
                        <option v-for="item in qesFirstList" :value="item.qesId">
                          {{item.question}}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label">答案：</label>
                    <div class="controls">
                      <input type="text" class="qes-input" v-model="answerFirst" required>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label">问题二：</label>
                    <div class="controls">
                      <select class="select-qes" v-model="questionSecond" @change="changeQes(2)">
                        <option v-for="item in qesSecondList" :value="item.qesId">
                          {{item.question}}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label">答案：</label>
                    <div class="controls">
                      <input type="text" class="qes-input" v-model="answerSecond" required>
                    </div>
                  </div>
                  <div class="text-center">
                    <button type="button" class="btn re-btn" data-loading-text="校验中" @click="verifyQes">提交</button>
                  </div>
                  <div class="text-center">
                    <button type="button" class="btn btn-link font-sm m-top-sm" data-loading-text="校验中" @click="goPrev">返回上一步</button>
                  </div>
                </form>
              </div>
            </div>
          </transition>
          <!--修改登录密码-->
          <transition name="setp-animate">
            <div class="rp-step-div" v-show="stepsIndex === 2">
            </div>
          </transition>

          <!--完成-->
          <transition name="setp-animate">
            <div class="rp-step-div" v-show="stepsIndex === 3">
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import resetPwd from '../../../../api/resetPwd'

  const initData = function () {
    return {
      url: window.self.location.toString(),
      codeUrl: '',
      codeSrc: '',
      codeVal: '',
      codeRes: 1,
      userName: '',
      stepsIndex: 0,  //当前步骤数
      codeError: false,
      codeErrorText: '',
      hasBindQes: false,
      hasBindMoblie: false,
      hasBindMail: false,
      email: '',
      mobile: '',
      findTypeNum: 0,
      loginToken: '',
      questionList: [],
      qesFirstList: [],
      qesSecondList: [],
      questionFirst: 1,
      answerFirst: '',
      questionSecond: 2,
      answerSecond: '',
    }
  }
  export default {
    name: 'reset-pwd',
    data: initData,
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
          this.codeUrl = `${this.url.substring(0, this.url.indexOf('/', this.url.indexOf('://', 0) + 3))}/acct/imgcode/code`
          this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
          $(this.$refs.resetPwdModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              Object.assign(this.$data, initData())
              this.$store.commit(types.TOGGLE_RESET_PASSWORD_DIALOG, false)
            })
        })
      },
      refreshValCode(){
        this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
      },
      valCode(){
        if (this.codeVal && this.codeVal !== '' && this.codeVal.length === 4) {
          resetPwd.valCodeXhr({
              code: this.codeVal
            },
            ({data}) => {
              if (data && data.result === 0) {
                this.codeError = false
                this.codeErrorText = ''
                this.codeRes = 0
              } else {
                this.codeError = true
                this.codeErrorText = '验证码错误'
                this.refreshValCode()
              }
            },
            ({data}) => {
              this.codeError = true
              this.codeErrorText = '验证码错误'
              this.refreshValCode()
            }
          )
        }
      },
      verifyUsetName(){
        const status = $(this.$refs.verifyUN).parsley().validate()
        if (this.codeVal === '' || this.codeRes === 1) {
          this.codeError = true
          this.codeErrorText = '请输入正确的验证码'
          return false
        }
        if (status) {
          resetPwd.verifyUserNameXhr({username: this.userName, verifyCode: this.codeVal},
            ({data}) => {
              if (data && data.result === 0) {
                this.hasBindQes = data.root.qesStatus === 1
                this.hasBindMoblie = !_.isNull(data.root.mobile)
                this.hasBindMail = !_.isNull(data.root.email)
                this.email = data.root.email
                this.mobile = data.root.mobile
                this.loginToken = data.root.pwdToken
                this.stepsIndex += 1
              } else {
                this.codeError = true
                this.codeErrorText = '用户名验证失败'
              }
            }),
            ({data}) => {
              this.codeError = true
              this.codeErrorText = '验证用户名请求失败'
            }
        }
      },
      findType(type){
        if (type === 1) {
          if (_.isEmpty(this.questionList)) {
            this.getQeqList()
          } else {
            this.findTypeNum = type
          }
        } else {
          this.findTypeNum = type
        }
      },
      getQeqList(){
        resetPwd.getSecurityQuestionXhr({username: this.userName, loginToken: this.loginToken},
          ({data}) => {
            if (data && data.result === 0) {
              this.questionList = [...data.root]
              const first = [...data.root]
              const second = [...data.root]
              this.qesFirstList = _(first).remove((n)=>{
                return n.qesId !== 2
              })
              this.qesSecondList = _(second).remove((n) => {
                return n.qesId !== 1
              })
              this.findTypeNum = 1
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? '密保问题获取请求服务失败' : data.msg)
            }
          },
          ({data}) => {
            Global.ui.notification.show(data.msg === 'fail' ? '密保问题获取请求服务失败' : data.msg)
          }
        )
      },
      changeQes(num){
        const arr = [...this.questionList]
        if(num === 1) {
          this.qesSecondList = _(arr).remove((n) => {
            return n.qesId !== this.questionFirst
          })
        } else{
          this.qesFirstList = _(arr).remove((n) => {
            return n.qesId !== this.questionSecond
          })
        }
//        this.questionSelect = num === 1 ? this.questionSecond : this.questionFirst
      },
      verifyQes(){

      },
      goPrev(){
        this.findTypeNum -= 1
      }
    },
    mounted(){
      this.codeUrl = `${this.url.substring(0, this.url.indexOf('/', this.url.indexOf('://', 0) + 3))}/acct/imgcode/code`
      this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
    }
  }
</script>
<style lang="scss" scoped>
  @mixin transition-cfg {
    transition: all .5s;
  }
  .setp-animate-enter {
    opacity: 0;
  }
  .step-animate-enter-active {
    transition: all .5s .5s;
  }

  .setp-animate-leave-active {
    transform: translateX(-600px);
    opacity: 0;
    @include transition-cfg;
  }

  @mixin input-def {
    background-color: $prominent-dialog-body;
    border-radius: $globalInputRadius;
    border: solid 1px $im-line-color;
  }

  .reset-dialog {
    width: 800px;
    border-radius: 5px;
    background-color: $def-white-color;
    margin: 0 auto;
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
      /*overflow: hidden;*/
      .step-list {
        position: relative;
        /*min-height: 266px;*/
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
        position: relative;
        background-color: $def-white-color;
        left: 40px;
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
        float: left;
      }
      .find-btn {
        width: 90px;
        height: 36px;
        &.disable {
          background-color: $def-gray-color;
          border-color: $def-gray-color;
        }
      }
      .icon {
        width: 90px;
        height: 90px;
        box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        margin: 0 auto;
        background-color: $def-line-color;
        &.active {
          background-color: $new-main-deep-color;
        }
        .wechat {
          width: 100%;
          height: 100%;
          background: url("~base/images/wechat-bg.png");
        }
        .moblie {
          width: 100%;
          height: 100%;
          background: url("~base/images/mobile-bg.png");
        }
        .mail {
          width: 100%;
          height: 100%;
          background: url("~base/images/mail-bg.png");
        }
      }
      .select-qes {
        width: 360px;
        height: 46px;
        background-color: $prominent-dialog-body;
      }
      .qes-input {
        width: 348px;
        height: 36px;
        background-color: $def-white-color;
      }
    }
  }
</style>
