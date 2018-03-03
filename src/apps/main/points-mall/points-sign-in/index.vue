<template>
  <div class="points-sign-in">
    <a data-dismiss="modal" class="close close-white btn-close">×</a>
    <div class="sign-top">
      <div class="sign-state-wrapper">
        <div class="sign-state circle-ripple">
          <div class="sign-state-inner">
            <div class="state-top">
              {{checking ? '检查中' : isReceiveToday ? '已签到' : '签到中'}}
            </div>
            <div class="state-bottom">
              <span class="state-points-val">+{{integral | convert2yuan}}</span> 积分
            </div>
          </div>
        </div>
      </div>
      <div class="sign-combo-state">
        您已连签
        <span class="combo-state-val">{{combo}}</span>
        天
      </div>
    </div>

    <div class="sign-main">
      <div class="sign-step step-nav">
        <div class="step" v-for="(step, index) in stepList" :key="index">
          <div class="step-title">{{step.day}}天</div>
          <div class="line">
            <div class="progress"></div>
          </div>
          <div class="radial-progress" ref="radialProgress">
            <div class="circle">
              <div class="mask full">
                <div class="fill"></div>
              </div>
              <div class="mask half">
                <div class="fill"></div>
                <div class="fill fix"></div>
              </div>
              <div class="shadow"></div>
            </div>
            <div class="inset">
              <div class="inner-circle"></div>
            </div>
          </div>
          <div class="step-brief">
            <div class="step-point">+{{step.integral}}分</div>
            <div class="sign-in-icon"></div>
          </div>
          <div class="line line-last" v-if="index === stepList.length - 1">
            <div class="progress"></div>
          </div>
        </div>
      </div>

      <div class="check-sign cursor-pointer" @click="isShowDetail = true">
        查看签到规则>
      </div>

      <button class="btn confirm-btn" data-dismiss="modal">确定</button>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="isShowDetail">
        <div slot="all">
          <a data-dismiss="modal" class="close close-white btn-close">×</a>
          <div class="detail-header">
            签到规则
          </div>
          <div class="main">
            <p>1、首次签到获得积分 <span class="combo-state-val">5</span></p>
            <p v-for="(cfg, index) in cfgs" :key="index" v-if="cfg.day !== 0">
              {{index + 2}}、连续签到 <span class="combo-state-val">{{cfg.day}}</span> 天后积分奖励增至
              <span class="combo-state-val">{{cfg.integral | convert2yuan}}</span>
            </p>
            <div class="detail-tip">
              注：如果中间有一天间断签到，需重新开始计算<br>
              连续签到时间
            </div>
            <div class="btn-panel">
              <button class="btn confirm-btn" data-dismiss="modal">确定</button>
            </div>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {getSignInInfoApi, signInApi} from 'api/points'
  import {TimelineMax} from 'gsap'

  export default {
    name: 'points-sign-in',

    data() {
      return {
        cfgs: [{
          day: 0,
          integral: 50000
        }],
        combo: 0,
        currentDate: 0,
        integral: 50000,
        isReceiveToday: false,
        signDate: [],
        isShowDetail: false,
        mainTl: null,
        currentStep: 0,
        checking: true,
      }
    },

    watch: {
      combo(currentCombo) {
        this.stepTo(currentCombo > 5 ? 4 : currentCombo - 1)
      }
    },

    computed: {
      stepList() {
        return _.times(5, (index) => {
          const day = this.combo < 5 ? index + 1 : this.combo - 5 + index + 1
          return {
            day,
            integral: this.$_getIntegral(day)
          }
        })
      }
    },

    methods: {
      stepTo(index) {
          //先恢复原本大小
          // this.animateToDefault();

          // _.each(this.$refs.radialProgress, (radialProgress) => {
          //   $(radialProgress).removeClass('active')
          // })

        this.mainTl.tweenTo(`stopPoint-${index}`, {onComplete: this.animateToActive, onCompleteParams: [this.$refs.radialProgress[index]]});
      },

      animateToActive(el) {
        $(el).addClass('active');

        TweenLite.to(el, 0.3, {scale: 1.3, zIndex: 10, ease: Back.easeOut});
      },

      animateToDefault() {
        let mainCircle = $('.radial-progress.active');

        TweenLite.to(mainCircle, 0.3, {scale: 1, zIndex: 1, ease: Bounce.easeOut});
      },

      $_getIntegral(day) {
        let integral = 0
        _.find(this.cfgs, (cfg, index) => {
          if (day >= cfg.day) {
            if (!this.cfgs[index + 1] || day < this.cfgs[index + 1].day) {
              integral = cfg.integral
              return true
            }
          }
        })

        return _.convert2yuan(integral)
      },

      getSignInInfo() {
        getSignInInfoApi(({data}) => {
          if (data && data.result === 0) {
            const resData = data.root
            this.cfgs = [...this.cfgs, ...resData.cfgs]
            this.combo = resData.combo
            this.currentDate = resData.currentDate
            this.integral = resData.integral
            this.isReceiveToday = resData.isReceiveToday
            this.signDate = resData.signDate

            //如果isReceiveToday = false 进行签到
            if (!this.isReceiveToday) {
              this.signIn()
            }
            this.checking = false
          }
        })
      },

      signIn() {
        signInApi(({data}) => {
          if (data && data.result === 0) {
            this.$store.dispatch(types.GET_USER_MALL_INFO)
            this.getSignInInfo()
          }
        })
      }
    },

    mounted() {
      this.getSignInInfo()


      const fill_rotation = 180;
      const fix_rotation = fill_rotation * 2;

      this.mainTl = new TimelineMax({paused: true});

      $(this.$el).find('.step .radial-progress').each((i, circle) => {
        let $circle = $(circle)
        let line = $circle.prev('.line').find('.progress');
        let circleFill = $circle.find('.fill:not(.fix)');
        let circleMask = $circle.find('.mask.full');
        let circleFillMix = $circle.find('.fill.fix');
        let day = $circle.closest('.step').find('.step-title')

        //进度条100%
        this.mainTl.to(line, 0.15, {width: '100%'})
          .to($circle, 0.3, {rotation: "-=" + fill_rotation}, `fillCircle-${i}`)
          .to([circleFill, circleMask], 0.3, {rotation: fill_rotation}, `fillCircle-${i}`)
          .to(circleFillMix, 0.3, {rotation: fix_rotation}, `fillCircle-${i}`)
          .to(day, 0.3, {scale: 1.3, ease: Back.easeOut}, `fillCircle-${i}`)
          .to(day, 0.2, {scale: 1, ease: Back.easeOut})
          // .to(day, 0., {scale: 1, ease: Back.easeOut})
          .set(circleFillMix, {rotation: fix_rotation}, `stopPoint-${i}`);
      });

    }
  }
</script>

<style lang="scss" scoped>
  .points-sign-in {
    width: 350px;
    .sign-top {
      height: 260px;
      background-image: linear-gradient(3deg,
        #0d939b 0%,
        #14b1bb 76%,
        #1fbac4 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .sign-state {
      width: 148px;
      height: 148px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 0 auto;
    }

    .sign-state-inner {
      width: 135px;
      height: 135px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 50%;
      border: 1px solid #aae3e7;
    }

    .state-top {
      font-size: 24px;
      color: #129098;
      border-bottom: 1px solid rgba(20, 177, 187, 0.2);
      padding-bottom: 10px;
      width: 111px;
      text-align: center;
      margin-bottom: 12px;
    }

    .state-bottom {
      font-size: 16px;
      color: #14b1bb;
    }

    .state-points-val {
      font-size: 24px;
    }

    .sign-state-wrapper {
      padding-top: 40px;
    }

    .sign-combo-state {
      font-size: 16px;
      color: #ffffff;
      margin-top: 30px;
    }

    .sign-state {
      width: 148px;
      height: 148px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin: 0 auto;
    }

    .sign-state-inner {
      width: 135px;
      height: 135px;
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 50%;
      border: 1px solid #aae3e7;
    }

    .state-top {
      font-size: 24px;
      color: #129098;
      border-bottom: 1px solid rgba(20, 177, 187, 0.2);
      padding-bottom: 10px;
      width: 111px;
      text-align: center;
      margin-bottom: 12px;
    }

    .state-bottom {
      font-size: 16px;
      color: #14b1bb;
    }

    .state-points-val {
      font-size: 24px;
    }

    .sign-state-wrapper {
      padding-top: 40px;
    }

    .sign-top {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .sign-combo-state {
      font-size: 16px;
      color: #ffffff;
      margin-top: 30px;
    }

    .combo-state-val {
      color: #ffb400;
    }

    .sign-main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 30px 0;
    }

    .check-sign {
      color: #666666;
      padding: 20px;
    }
  }

  .combo-state-val {
    color: #ffb400;
  }

  .confirm-btn {
    width: 190px;
    height: 40px;
    background-color: #14b1bb;
    border-radius: 19px;
  }

  .step-nav {
    $circle-size: 14px;
    $circle-color: #14aeb8;

    height: $circle-size + 50px;
    padding-top: 25px;
    position: relative;
    margin: 0 auto;
    width: 300px;
    overflow: hidden;

    .step-title {
      position: absolute;
      top: -24px;
      left: 45px;
      white-space: nowrap;
    }

    .step-brief {
      position: absolute;
      bottom: -48px;
      left: 37px;
    }
    .step-point {
      white-space: nowrap;
    }

    .step {
      position: relative;
      float: left;
      width: 60px;
      height: $circle-size;

      &:first-of-type {
        margin-left: -23px;
      }

      .line {
        position: absolute;
        top: 50%;
        margin-top: -1px;
        width: 50px;
        height: 2px;
        background: #d6dadc;

        &:last-of-type {
          right: -50px;
        }

        .progress {
          width: 0%;
          height: 2px;
          background: $circle-color;
        }
      }

      .radial-progress {
        $circle-background: #d6dadc;
        $inset-size: 10px;

        width: $circle-size;
        height: $circle-size;
        background-color: $circle-background;
        position: absolute;
        right: 0;
        border-radius: 50%;
        transform: rotate(-90deg);

        .circle {
          .mask, .fill, .shadow {
            width: $circle-size;
            height: $circle-size;
            position: absolute;
            border-radius: 50%;
          }
          .mask, .fill {
            -webkit-backface-visibility: hidden;
          }
          .mask {
            clip: rect(0px, $circle-size, $circle-size, $circle-size/2);
            .fill {
              clip: rect(0px, $circle-size/2, $circle-size, 0px);
              background-color: $circle-color;
            }
          }
        }
        .inset {
          width: $inset-size;
          height: $inset-size;
          position: absolute;
          margin-left: ($circle-size - $inset-size)/2;
          margin-top: ($circle-size - $inset-size)/2;
          background-color: $circle-color;
          border-radius: 50%;

          .inner-circle {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #fafafa;
            border-radius: 50%;
          }
        }
      }
    }
    .sign-in-icon {
      background: url(./sign-in.png);
      width: 29px;
      height: 23px;
    }
  }

  .circle-ripple {
    animation: ripple 0.7s linear infinite;
  }

  .detail-header {
    width: 350px;
    height: 85px;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #13afb9;
    color: #ffffff;
    position: relative;
    &:before, &:after {
      content: '';
      display: block;
      width: 78px;
      height: 1px;
      background-color: rgba(250, 250, 250, 0.5);
      position: absolute;
      top: 50%;
    }

    &:before {
      left: 47px;
    }
    &:after {
      right: 47px;
    }
  }

  .main {
    padding: 40px;
    color: #666666;
    height: 344px;
    p {
      font-size: 14px;
    }
  }

  .detail-tip {
    font-size: 12px;
    color: #999999;
    margin: 35px 0 45px;
  }

  .btn-panel {
    text-align: center;
  }

  @keyframes ripple {
    $color: $main-deep-color;
    0% {
      box-shadow: 0 0 0 0 rgba(0, 0, 0, .5),
      0 0 0 10px rgba($color, 0.3),
      0 0 0 20px rgba($color, 0.3);
    }
    100% {
      box-shadow: 0 0 0 10px rgba($color, 0.2),
      0 0 0 20px rgba($color, 0.2),
      0 0 0 30px rgba($color, 0);
    }
  }
</style>
