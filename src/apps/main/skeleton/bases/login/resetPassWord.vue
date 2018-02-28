<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="resetPwdModal">
    <div class="reset-dialog clearfix">
      <div class="reset-header">
        找回密码
        <a class="close-md close-md-gray btn-close" data-dismiss="modal"></a>
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
          <transition name="step-animate">
            <div class="rp-step-div" v-if="stepsIndex === 0">
              <form action="javascript:void(0);" class="form-horizontal rp-step-1-form " ref="verifyUN">
                <div class="text-center m-TB-md p-top-sm font-sm">请输入您要找回密码的账号</div>
                <div class="control-group">
                  <label class="control-label">用户名：</label>
                  <div class="controls">
                    <input type="text" id="jsRPUserName" class="reset-input" v-model="userName" data-parsley-username
                           data-parsley-errors-container=".js-rp-user-error" placeholder="输入用户名" autocomplete="off" required/>
                    <div class="js-rp-user-error rp-user-error parsley-error-container inline-block" style="max-width: 140px"></div>
                  </div>
                </div>
                <div class="control-group">
                  <label class="control-label">验证码：</label>
                  <div class="controls">
                    <input type="text" class="input-varCode" @input="valCode" v-model="codeVal" name=""  maxlength="4"
                           data-parsley-errors-container=".js-rp-code-error"  placeholder="输入验证码" autocomplete="off">
                    <img class="var-code" :src="codeSrc" @click="refreshValCode">
                    <div class="text-hot m-top-xs inline-block" v-if="codeError"  style="max-width: 140px">
                      <span class="sfa sfa-error-icon vertical-middle"></span>
                      {{codeErrorText}}
                    </div>
                    <span class="code-check" v-if="codeRes === 0"></span>
                  </div>
                  <div class="text-hot m-top-xs text-left" v-if="errorText"  style="margin-left: 130px">
                    <span class="sfa sfa-error-icon vertical-middle"></span>
                    {{errorText}}
                  </div>
                </div>
                <div class="text-left m-top-lg">
                  <button type="button" class="btn re-btn" data-loading-text="校验中" @click="verifyUsetName">提交</button>
                </div>
              </form>
            </div>
          </transition>

          <!--选择密码找回方式-->
          <transition name="step-animate">
            <div class="rp-step-div" v-if="stepsIndex === 1">
              <div class="find-type m-top-lg clearfix" v-show="findTypeNum === 0">
                <div class="type-list">
                  <div class="text-center font-sm m-bottom-md">密保问题</div>
                  <div :class="['icon',{active: hasBindQes}]">
                    <div class="wechat"></div>
                  </div>
                  <div class="text-center m-top-md">
                    <button type="button" :class="['btn', 'find-btn', {disable: !hasBindQes}]" :disabled="!hasBindQes"
                            @click="findType(1)">{{(hasBindQes) ? "立即找回" : "未设置"}}
                    </button>
                  </div>
                </div>
                <div class="type-list">
                  <div class="text-center font-sm m-bottom-md">手机验证</div>
                  <div :class="['icon',{active: hasBindMoblie}]">
                    <div class="moblie"></div>
                  </div>
                  <div class="text-center m-top-md">
                    <button type="button" :class="['btn', 'find-btn', {disable: !hasBindMoblie}]" :disabled="!hasBindMoblie"
                            @click="findType(2)">{{(hasBindMoblie) ? "立即找回" : "未绑定"}}
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
                            @click="findType(3)">{{(hasBindMail) ? "立即找回" : "未绑定"}}
                    </button>
                  </div>
                </div>
                <div class="clearfix"></div>
                <div class="text-center font-sm m-top-lg m-bottom-md">
                  <i class="sfa sfa-error-icon"></i>
                  温馨提示：如以上方式都无法使用，请与
                  <a class="text-hot cursor-pointer js-gl-service">在线客服</a>
                  联系，协助解决问题。
                </div>
              </div>
              <div v-if="findTypeNum === 1">
                <div class="text-center m-TB-md p-top-sm font-sm">请正确输入密保问题</div>
                <form action="javascript:void(0);" class="form-horizontal rp-step-1-form" ref="verifyQes">
                  <div class="control-group">
                    <label class="control-label">问题一：</label>
                    <div class="controls">
                      <!--<select class="select-qes" v-model="questionFirst" @change="changeQes(1)">-->
                        <!--<option v-for="item in qesFirstList" :value="item">-->
                          <!--{{item.question}}-->
                        <!--</option>-->
                      <!--</select>-->
                      <span class="font-sm">{{questionFirst.question}}</span>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label p-top-sm">答案：</label>
                    <div class="controls">
                      <input type="text" class="qes-input" v-model="answerFirst" autocomplete="off" data-parsley-errors-container=".js-rp-answer1-error" required>
                      <div class="js-rp-answer1-error  parsley-error-container inline-block" style="max-width: 144px"></div>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label">问题二：</label>
                    <div class="controls">
                      <!--<select class="select-qes" v-model="questionSecond" @change="changeQes(2)">-->
                        <!--<option v-for="item in qesSecondList" :value="item">-->
                          <!--{{item.question}}-->
                        <!--</option>-->
                      <!--</select>-->
                      <span class="font-sm">{{questionSecond.question}}</span>
                    </div>
                  </div>
                  <div class="control-group">
                    <label class="control-label p-top-sm">答案：</label>
                    <div class="controls">
                      <input type="text" class="qes-input" v-model="answerSecond" autocomplete="off" data-parsley-errors-container=".js-rp-answer2-error" required>
                      <div class="js-rp-answer2-error parsley-error-container inline-block" style="max-width: 144px"></div>
                      <div class="text-hot text-left m-top-sm" v-if="qesError">
                        <span class="sfa sfa-error-icon tooltip-icon vertical-middle pull-left"></span>
                        <div class="tooltip-inner">{{qesErrorText}}</div>
                      </div>
                    </div>
                  </div>
                  <div class=" m-top-lg">

                    <button type="button" class="btn re-btn" data-loading-text="校验中" @click="verifyQes">提交</button>
                  </div>
                  <div class="">
                    <button type="button" class="btn btn-link re-btn font-sm m-TB-sm" data-loading-text="校验中" @click="goPrev">
                      返回上一步
                    </button>
                  </div>
                </form>
              </div>
              <div v-if="findTypeNum === 2 || findTypeNum === 3">
                <reset-pwd-input :find-type="findTypeNum" :mobile="mobile" :email="email" :user-name="userName"
                                 :login-token="loginToken" @goprev="goPrev" @gonext="goStepsNext"></reset-pwd-input>
              </div>
            </div>
          </transition>
          <!--修改登录密码-->
          <transition name="step-animate">
            <div class="rp-step-div" v-if="stepsIndex === 2">
              <reset-set-pwd :user-name="userName" :login-token="loginToken" @gonext="goStepsNext"></reset-set-pwd>
            </div>
          </transition>

          <!--完成-->
          <transition name="step-animate">
            <div class="rp-step-div" v-if="stepsIndex === 3">
              <div class="info text-cool m-TB-lg font-md text-center">
                <span class="sfa sfa-checkmark-blue vertical-middle"></span>
                您的新密码已经设置成功！
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    valCodeXhr,
    verifyUserNameXhr,
    getSecurityQuestionXhr,
    verifySecurityQuestionXhr
  } from 'api/resetPwd'
  import resetPwdInput from './resetPwdInput'
  import resetSetPwd from './resetSetPwd'

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
      sendCode:true,
      errorText:'',
      hasBindQes: false,
      hasBindMoblie: false,
      hasBindMail: false,
      email: '',
      mobile: '',
      findTypeNum: 0, // 选择找回密码方式id
      loginToken: '',
      questionList: [],
      // qesFirstList: [],
      // qesSecondList: [],
      questionFirst: {},
      answerFirst: '',
      questionSecond: {},
      answerSecond: '',
      qesError: false,
      qesErrorText: '',
    }
  }
  export default {
    name: 'reset-pwd',
    data: initData,
    components: {
      resetPwdInput,
      resetSetPwd
    },
    methods: {
      refreshValCode(){
        this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
        this.codeRes = 1
      },
      valCode(){
        if(this.sendCode){
          console.log( 'val:'+this.codeVal)
          if (this.codeVal && this.codeVal !== '' && this.codeVal.length === 4) {
            this.sendCode = false
            valCodeXhr({
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
              .finally(() => {
                this.sendCode = true
              })
          }
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
          verifyUserNameXhr({username: this.userName, verifyCode: this.codeVal},
            ({data}) => {
              if (data && data.result === 0) {
                this.codeError = false
                this.codeErrorText = ''
                this.hasBindQes = data.root.qesStatus === 1
                this.hasBindMoblie = !_.isNull(data.root.mobile)
                this.hasBindMail = !_.isNull(data.root.email)
                this.email = data.root.email
                this.mobile = data.root.mobile
                this.loginToken = data.root.pwdToken
                this.stepsIndex += 1
                this.errorText = ''
              } else {
                // this.codeError = true
                this.errorText = data.msg
              }
            },
            ({data}) => {
              // this.codeError = true
              this.errorText = '验证用户名请求失败'
            })
        }
      },
      findType(type){
        if (type === 1) {
          if (_.isEmpty(this.questionList)) {
            this.getQeqList()
          } else {
            this.randomQeqList()
            this.findTypeNum = type
          }
        } else {
          this.findTypeNum = type
        }
      },
      getQeqList(){
        getSecurityQuestionXhr({username: this.userName, loginToken: this.loginToken},
          ({data}) => {
            if (data && data.result === 0) {
              this.questionList = [...data.root]
              this.randomQeqList()
              // this.qesFirstList = _(arr1).remove((n,index) => {
              //   return index !== 1
              // })
              // this.qesSecondList = _(arr2).remove((n ,index) => {
              //   return index !== 0
              // })
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
      randomQeqList(){
        const arr1 = _(this.questionList).shuffle()
        this.questionFirst = arr1[0]
        this.questionSecond = arr1[1]
      },
      changeQes(num){
        const arr = [...this.questionList]
        if (num === 1) {
          this.qesSecondList = _(arr).remove((n) => {
            return n.qesId !== this.questionFirst.qesId
          })
        } else {
          this.qesFirstList = _(arr).remove((n) => {
            return n.qesId !== this.questionSecond.qesId
          })
        }
      },
      verifyQes(){
        const status = $(this.$refs.verifyQes).parsley().validate()
        if (status) {
          const secrityList = [
            {
              securityId: this.questionFirst.qesId,
              securityQes: this.questionFirst.question,
              securityAsw: this.answerFirst,
            },
            {
              securityId: this.questionSecond.qesId,
              securityQes: this.questionSecond.question,
              securityAsw: this.answerSecond,
            }
          ]
          verifySecurityQuestionXhr({username: this.userName, loginToken: this.loginToken, secrityList},
            ({data}) => {
              if (data && data.result === 0) {
                this.goStepsNext()
              } else if (data.root != null && _(data.root).isNumber()) {
                if (data.root > 0) {
                  this.qesErrorText = `验证失败,剩余${data.root}次机会。`
                } else {
                  this.qesErrorText = '验证失败,请一个小时后再验证！'
                }
                this.qesError = true
              } else {
                this.qesError = true
                this.qesErrorText = `验证失败,${data.msg}`
              }
            },
            ({fail}) => {
              this.qesError = true
              this.qesErrorText = '密保问题验证请求失败'
            })
        }
      },
      goPrev(){
        this.findTypeNum = 0
      },
      goStepsNext(){
        this.stepsIndex += 1
        if(this.stepsIndex === 3){
          setTimeout(() => {
            $(this.$refs.resetPwdModal).modal('hide')
          },2000)
        }
      },
    },
    mounted(){
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
    }
  }
</script>
<style lang="scss">
  @mixin transition-cfg {
    transition: all .5s;
  }

  .step-animate-enter {
    opacity: 0;
  }

  .step-animate-enter-active {
    transition: all .5s .5s;
  }

  .step-animate-leave-active {
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
    /*min-height: 550px;*/
    .filled {
      margin-left: 0px;
    }
    .reset-header {
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
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
      /*padding: 50px 0px;*/
      min-height: 490px;
      /*overflow: hidden;*/
      .step-list {
        /*position: relative;*/
        /*min-height: 266px;*/
        display: flex;
      }
      .steps {
        margin-top: 40px;
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
        margin-top: 0px;
        padding: 0;
      }
      .controls {
        margin-left: 130px;
        span{
          margin-top: 0;
        }
      }
      .re-btn {
        margin-left: 130px;
        width: 360px;
        height: 46px;
        font-size: $font-sm;
      }
      .rp-step-div {
        width: 690px;
        /*position: relative;*/
        background-color: $def-white-color;
        margin-left: 40px;
      }
      .var-code {
        width: 110px;
        height: 44px;
        margin-left: 10px;
      }
      .code-check{
        display: inline-block;
        width: 18px;
        height: 18px;
        background: url("~base/images/register-check.png") no-repeat;
        vertical-align: middle;
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
      .info {
        height: 40px;
        line-height: 40px;
      }
    }
  }
</style>
