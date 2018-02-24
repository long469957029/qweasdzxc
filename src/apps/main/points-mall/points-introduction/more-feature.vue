<template>
  <div class="more-feature">
    <p class="intro-title">特色功能</p>
    <div class="feature-panel">
      <div class="feature-list">
        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-cell finished" :time="300">
            <div class="feature-icon">
              <div class="sfa sfa-pt-intro-m-task"></div>
            </div>
            <div class="cell-main">
              <div class="feature-title">任务奖励</div>
              <div class="feature-brief">每天／每周完成积分商城发布的任务，“海量积分”任你拿。</div>
            </div>
          </timeout-cell>
        </transition>
        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-line " :time="400"></timeout-cell>
        </transition>

        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-cell finished" :time="500">
            <div class="feature-icon">
              <div class="sfa sfa-pt-intro-m-lottery"></div>
            </div>
            <div class="cell-main">
              <div class="feature-title">幸运夺宝</div>
              <div class="feature-brief">可以使用少量的积分，在幸运夺宝中碰碰运气 <br>大奖豪礼，总有一样属于你。</div>
            </div>
          </timeout-cell>
        </transition>
        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-line" :time="500"></timeout-cell>
        </transition>

        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-cell" :time="700">
            <div class="feature-icon">
              <div class="sfa sfa-pt-intro-m-ticket"></div>
            </div>
            <div class="cell-main">
              <div class="feature-title">优惠券秒杀</div>
              <div class="feature-brief">每天限时推出的超值优惠券，数量有限<br>准点开杀，买到就是赚到。</div>
            </div>
          </timeout-cell>
        </transition>
        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-line" :time="700"></timeout-cell>
        </transition>

        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-cell" :time="900">
            <div class="feature-icon">
              <div class="sfa sfa-pt-intro-m-gift"></div>
            </div>
            <div class="cell-main">
              <div class="feature-title">赠送</div>
              <div class="feature-brief">想感谢好友，兑换优惠券或者是礼物<br>平台将会帮你转交给他哦。</div>
            </div>
          </timeout-cell>
        </transition>

        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-line" :time="900"></timeout-cell>
        </transition>

        <transition enter-active-class="animated-slow fadeInUp">
          <timeout-cell class="feature-cell" :time="1100">
            <div class="feature-icon">
              <div class="sfa sfa-pt-intro-m-transaction"></div>
            </div>
            <div class="cell-main">
              <div class="feature-title">交易中心</div>
              <div class="feature-brief">有多余的券，手头有点紧，用积分兑换好礼后<br>直接放在交易中心出售，赚钱超简单！</div>
            </div>
          </timeout-cell>
        </transition>
      </div>
      <transition enter-active-class="animated-slow fadeInRight">
        <timeout-cell class="feature-display" :time="900">
          <div class="sfa-pt-intro-m-bg"></div>
        </timeout-cell>
      </transition>
    </div>
  </div>
</template>

<script>
  import {TimeoutCell} from 'build'

  export default {
    name: 'more-feature',

    components: {
      TimeoutCell
    }
  }
</script>

<style lang="scss" scoped>
  .intro-title {
    font-size: 20px;
    color: #333333;
    position: relative;
    margin-bottom: 35px;

    &:before {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: $main-deep-color;
    }
  }

  .feature-cell {
    display: flex;

    &.finished {
      .feature-brief {
        color: #666666;
      }
      .feature-icon {
        border: solid 2px transparent;
        background-color: #3a7f87;
      }
    }
  }

  .feature-panel {
    display: flex;
  }

  .feature-icon {
    width: 59px;
    height: 59px;
    border: solid 2px #e6e6e6;
    border-radius: 50%;
    margin-right: 20px;

    &:hover {
      .sfa {
        animation: icon-rotate 2s ease-in-out 1s infinite;
      }
    }
  }

  .feature-title {
    font-size: 18px;
    color: #3a7f87;
    margin-bottom: 10px;
  }

  .feature-brief {
    font-size: 14px;
    color: #999999;
    white-space: nowrap;
  }

  .feature-line {
    width: 1px;
    height: 86px;
    background-color: #e6e6e6;
    margin-left: 32px;
  }

  .feature-display {
    display: flex;
  }

  .sfa-pt-intro-m-bg {
    margin-top: 64px;
  }


  @keyframes icon-rotate {
    from {

    }
    to {
      transform: rotateY(720deg);
    }
  }
</style>
