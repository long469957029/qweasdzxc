<template>
  <div class="rechargePlan">
    <div class="rp-header">
      <div class="ws-header-img">
        <div class="rp-header-shadow">
        </div>
        <div class="rp-header-text">
          先领取任务，默认为领取任务后的第一笔充值为奖励返还的值，充值不累计流水可累积。
          在完成一轮充值任务并领取奖励后，可领取下一轮的充值任务。
        </div>
      </div>
    </div>
    <div class="rp-process">
      <div class="rp-process-panel">
        <div class="rp-process-back"></div>
        <div class="rp-process-title">当前任务进度</div>
        <div class="rp-process-content">
          <div class="rp-process-task inline-block">
            <div class="rp-task-title">当前任务</div>
            <div class="rp-task-text">8倍流水返5%充值额</div>
          </div>
          <div class="rp-process-task-detail inline-block">
            <div class="detail-value">
              <div class="detail-value-item">
                <div class="rp-task-title">您的充值额</div>
                <div class="rp-value-text">10000</div>
              </div>
              <div class="detail-value-item">
                <div class="rp-task-title">奖励金额</div>
                <div class="rp-value-text">100</div>
              </div>
              <div class="detail-value-item claim">
                <div class="rp-task-title">流水要求</div>
                <div class="rp-value-text">1000000</div>
              </div>
            </div>
            <div class="detail-process">
              <span class="rp-task-title">流水进度</span>
              <span class="rp-task-img"></span>
              <span class="rp-task-text">5000/8000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rp-plan">
      <div class="rp-plan-panel">
        <div class="rp-plan-back"></div>
        <div class="rp-plan-title">充值计划</div>
        <div class="rp-plan-item">
          <div class="item-img one inline-block"></div>
          <div class="item-text-container inline-block">
            <div class="item-text"><span class="item-text-value">8</span>倍流水返回<span class="item-text-value">5%</span>
              +无限分分彩<span class="item-text-value">10</span>元代金券
            </div>
            <div class="item-desc">如：充10000，流水10000元，返500元</div>
          </div>
          <div class="item-receive hidden">立即领取</div>
          <div class="item-status doing"></div>
        </div>
        <div class="rp-plan-item">
          <div class="item-img two inline-block"></div>
          <div class="item-text-container inline-block">
            <div class="item-text"><span class="item-text-value">8</span>倍流水返回<span class="item-text-value">5%</span>
              +无限分分彩<span class="item-text-value">10</span>元代金券
            </div>
            <div class="item-desc">如：充10000，流水10000元，返500元</div>
          </div>
          <div class="item-receive hidden">立即领取</div>
          <div class="item-status done"></div>
        </div>
        <div class="rp-plan-item">
          <div class="item-img three inline-block"></div>
          <div class="item-text-container inline-block">
            <div class="item-text"><span class="item-text-value">8</span>倍流水返回<span class="item-text-value">5%</span>
              +无限分分彩<span class="item-text-value">10</span>元代金券
            </div>
            <div class="item-desc">如：充10000，流水10000元，返500元</div>
          </div>
          <div class="item-receive inline-block">立即领取</div>
          <div class="item-status hidden"></div>
        </div>
        <div class="rp-plan-item">

          <div class="item-img four inline-block"></div>
          <div class="item-text-container inline-block">
            <div class="item-text"><span class="item-text-value">8</span>倍流水返回<span class="item-text-value">5%</span>
              +无限分分彩<span class="item-text-value">10</span>元代金券
            </div>
            <div class="item-desc">如：充10000，流水10000元，返500元</div>
          </div>
          <div class="item-receive inline-block">立即领取</div>
          <div class="item-status hidden"></div>
        </div>
        <div class="rp-plan-item">
          <div class="item-img five inline-block"></div>
          <div class="item-text-container inline-block">
            <div class="item-text"><span class="item-text-value">8</span>倍流水返回<span class="item-text-value">5%</span>
              +无限分分彩<span class="item-text-value">10</span>元代金券
            </div>
            <div class="item-desc">如：充10000，流水10000元，返500元</div>
          </div>
          <div class="item-receive  inline-block">立即领取</div>
          <div class="item-status hidden"></div>
        </div>
      </div>
    </div>
    <div class="rp-footer">
      <div class="rp-footer-panel">
        <div class="rp-footer-title">活动规则</div>
        <div class="rp-footer-text">1、单次充值金额需大于100元，小于100元充值活动资格无效。</div>
        <div class="rp-footer-text">2、仅计算在领取任务后的首笔金额大于100的充值为返奖充值，流水可累积，充值不累积。如领取任务后充值1000元，打满8倍流水则奖励为1000*5%=50元，未打满8倍流水，
          再次充值1000元（不再计算为奖励），打够此前1000元的8倍流水，则依然可享50元充值奖励。</div>
        <div class="rp-footer-text">3、充值奖励在达到目标后自动返还，在完成一个任务后可领取其他的充值任务。</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'index',

    data () {
      return {}
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .rechargePlan {
    overflow: hidden;
    font-family: "Microsoft Yahei", "Microsoft YaHei UI", sans-serif;
    display: block;
    position: relative;
    background-color: #ffffff;
    .rp-header {
      width: 100%;
      height: 600px;
      .ws-header-img {
        background-image: url('./misc/rp-header.png');
        width: 1920px;
        height: 100%;
        position: relative;
        top: 0;
        max-width: 1920px;
        left: 50%;
        margin-left: -960px;
        .rp-header-text {
          background: #ffffff;
          color: #544934;
          font-size: 16px;
          width: 624px;
          height: 55px;
          left: 50%;
          margin-left: -400px;
          padding: 39px 89px;
          line-height: 27px;
          top: 480px;
          position: absolute;
          z-index: 2;
          text-align: center;
        }
        .rp-header-shadow {
          background: #ffffff;
          color: #544934;
          font-size: 16px;
          width: 622px;
          height: 55px;
          position: relative;
          left: 50%;
          margin-left: -400px;
          padding: 39px 89px;
          line-height: 27px;
          top: 480px;
          z-index: 1;
        }

        .rp-header-shadow:before {
          position: absolute;
          z-index: -1;
          left: 20px;
          bottom: 17px;
          width: 80%;
          height: 30px;
          content: "";
          transform: skew(-18deg) rotate(-3deg);
          -webkit-transform: skew(-18deg) rotate(-3deg);
          -moz-transform: skew(-18deg) rotate(-3deg);
          box-shadow: 0 20px 20px #8f8f8f;
        }
        .rp-header-shadow:after {
          position: absolute;
          z-index: -2;
          right: 20px;
          bottom: 17px;
          width: 80%;
          height: 30px;
          content: "";
          transform: skew(18deg) rotate(3deg);
          -webkit-transform: skew(18deg) rotate(3deg);
          -moz-transform: skew(18deg) rotate(3deg);
          box-shadow: 0 20px 20px #8f8f8f;
        }
      }

    }
    .rp-process {
      width: 100%;
      position: relative;
      margin-top: 60px;
      height: 345px;
      .rp-process-panel {
        margin: 0 auto;
        position: relative;
        width: 1200px;
        .rp-process-back {
          position: absolute;
          background-image: url('./misc/rp-taskProgress.png');
          width: 462px;
          height: 73px;
        }
        .rp-process-title {
          font-size: 47px;
          color: #333333;
          padding-top: 33px;
          position: relative;
          line-height: 47px;
          font-weight: 600;
        }
        .rp-process-content {
          margin-top: 43px;
          .rp-process-task {
            vertical-align: top;
            background-image: url('./misc/rp-task.png');
            width: 294px;
            height: 128px;
            padding-top: 44px;
            margin-right: 150px;
            text-align: center;
            box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
            .rp-task-title {
              margin-bottom: 35px;
            }
          }
          .rp-process-task-detail {
            .detail-value {
              margin-top: 10px;
              .detail-value-item {
                width: 190px;
                height: 83px;
                display: inline-block;
                text-align: center;
                border-right: 1px solid #e5e5e5;
                .rp-task-title {
                  margin-bottom: 40px;
                  vertical-align: top;
                }
                .rp-value-text {
                  font-size: 20px;
                  color: #f3ba2e;
                }
                &.claim {
                  border-right: 0;
                }
              }
            }
            .detail-process {
              margin-top: 50px;
              margin-left: 38px;
              .rp-task-title {
                margin-right: 10px;
              }
              .rp-task-img {
                width: 365px;
              }
              .rp-task-text {
                margin-left: 25px;
              }
            }
          }
          .rp-task-title {
            font-size: 22px;
            color: #665d3e;
            text-align: center;
            font-weight: 600;
          }
          .rp-task-text {
            color: #665d3e;
            font-size: 22px;
          }
        }
      }
    }
    .rp-plan {
      width: 100%;
      position: relative;
      background: #f9f9f9;
      .rp-plan-panel {
        margin: 0 auto;
        position: relative;
        width: 1200px;
        padding-top: 40px;
        .rp-plan-back {
          position: absolute;
          background-image: url('./misc/rp-rechargePlan.png');
          width: 473px;
          height: 73px;
        }
        .rp-plan-title {
          font-size: 47px;
          color: #333333;
          padding-top: 33px;
          position: relative;
          line-height: 47px;
          font-weight: 600;
          margin-bottom: 40px;
        }
        .rp-plan-item {
          width: 1190px;
          height: 90px;
          padding: 30px 0 30px 30px;
          margin: 25px 0;
          box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
          background: #ffffff;
          position: relative;
          .item-img {
            width: 90px;
            height: 90px;
            margin-right: 95px;
            vertical-align: top;
            &.one {
              background-image: url('./misc/rs-plan-logo1.png');
            }
            &.two {
              background-image: url('./misc/rs-plan-logo2.png');
            }
            &.three {
              background-image: url('./misc/rs-plan-logo3.png');
            }
            &.four {
              background-image: url('./misc/rs-plan-logo4.png');
            }
            &.five {
              background-image: url('./misc/rs-plan-logo5.png');
            }
          }
          .item-text-container {
            margin-top: 15px;
            color: #4a340f;
            vertical-align: top;
            .item-text {
              font-size: 22px;
              margin-bottom: 25px;
              .item-text-value {
                color: #c4a25d;
                font-size: 26px;
              }
            }
            .item-desc {
              font-size: 16px;
            }
          }
          .item-receive {
            right: 60px;
            text-align: center;
            color: #ffffff;
            font-size: 22px;
            background: #e0bd77;
            width: 147px;
            height: 54px;
            line-height: 54px;
            position: absolute;
            margin-top: 18px;
            border-radius: 4px;
            box-shadow: 0 3px 5px #e0bd77;
          }
          .item-status {
            position: absolute;
            right: -14px;
            top: -14px;
            width: 156px;
            height: 165px;
            &.doing {
              background-image: url('./misc/rs-plan-doing.png');
            }
            &.done {
              background-image: url('./misc/rs-plan-done.png');
            }
          }
        }
      }

    }
    .rp-footer {
      width: 100%;
      background-image: url('./misc/rs-footer.png');
      height:485px;
      margin-top: -165px;
      .rp-footer-panel {
        padding-top: 220px;
        width: 1200px;
        margin: 0 auto;
        text-align: left;
        .rp-footer-title {
          font-size: 29px;
          margin-bottom: 20px;
          color: #333333;
        }
        .rp-footer-text {
          line-height: 45px;
          font-size: 18px;
          color: #666666;
        }
      }
    }
  }
</style>

