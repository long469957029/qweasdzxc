<template>
  <div class="betPlan">
    <div class="bp-header">
      <div class="bp-header-img"></div>
      <div class="bp-header-time">同一时间只能领取一个任务，完成后奖励将自动发放，您还可领取其他更高的任务。</div>
    </div>
    <div class="bp-task">
      <div class="bp-task-item active">
        <div class="item-status"></div>
        <div class="item-title">任务一</div>
        <div class="item-text">投注10000元</div>
        <div class="item-text">奖励300元</div>
        <div class="item-down"><i class="fa fa-angle-double-down" aria-hidden="true"></i></div>
      </div>
      <div class="bp-task-item">
        <div class="item-status"></div>
        <div class="item-title">任务二</div>
        <div class="item-text">投注10000元</div>
        <div class="item-text">奖励300元</div>
        <div class="item-down"></div>
      </div>
      <div class="bp-task-item">
        <div class="item-status"></div>
        <div class="item-title">任务三</div>
        <div class="item-text">投注10000元</div>
        <div class="item-text">奖励300元</div>
        <div class="item-down"></div>
      </div>
      <div class="bp-task-item">
        <div class="item-status"></div>
        <div class="item-title">任务四</div>
        <div class="item-text">投注10000元</div>
        <div class="item-text">奖励300元</div>
        <div class="item-down"></div>
      </div>
      <div class="bp-task-item">
        <div class="item-status"></div>
        <div class="item-title">任务五</div>
        <div class="item-text">投注10000元</div>
        <div class="item-text">奖励300元</div>
        <div class="item-down"></div>
      </div>
      <div class="bp-task-item">
        <div class="item-status"></div>
        <div class="item-title">任务六</div>
        <div class="item-text">投注10000元</div>
        <div class="item-text">奖励300元</div>
        <div class="item-down"></div>
      </div>
    </div>
    <div class="bp-wavy-lines"></div>
    <div class="bp-task-detail">
      <div class="bp-task-content">
        <div class="bp-task-detail-title">任务详情</div>
        <div class="bp-task-detail-name">
          <div class="detail-name inline-block">任务1</div>
          <div class="bet-detail inline-block">投注10000元，奖励300元</div>
        </div>
        <div class="bp-task-target">
          <div class="bp-task-target-top">
            <div class="target-item inline-block top"></div>
            <div class="target-item inline-block">目标一</div>
            <div class="target-item inline-block">目标二</div>
            <div class="target-item inline-block">目标三</div>
            <div class="target-item add inline-block">全程完成额外奖励</div>
            <div class="target-item total inline-block">任务总奖励</div>
          </div>
          <div class="bp-task-target-bottom">
            <div class="bp-value-panel type">
              <div class="bp-value-item type">
                投注（元）
              </div>
              <div class="bp-value-item type">
                奖励（元）
              </div>
            </div>
            <div class="bp-value-panel">
              <div class="bp-value-item">
                6000
              </div>
              <div class="bp-value-item">
                8
              </div>
            </div>
            <div class="bp-value-panel">
              <div class="bp-value-item">
                8000
              </div>
              <div class="bp-value-item">
                28
              </div>
            </div>
            <div class="bp-value-panel">
              <div class="bp-value-item">
                10000
              </div>
              <div class="bp-value-item">
                58
              </div>
            </div>
            <div class="bp-value-panel add">
              <div class="value-money">
                150
              </div>
              <div>+</div>
              <div class="value-coupons">
                无限分分彩代金券10元
              </div>
            </div>
            <div class="bp-value-panel total">
              <div class="value-money">
                150
              </div>
              <div>+</div>
              <div class="value-coupons">
                无限分分彩代金券10元
              </div>
            </div>
          </div>
        </div>
        <div class="bp-task-receive"></div>
        <div class="bp-task-received hidden"></div>
      </div>
    </div>
    <div class="bp-footer">
      <div class="bp-footer-title">活动规则说明</div>
      <div class="bp-footer-text">1、同一时间只能领取一个任务，销量自领取任务后开始计算（领取任务之前的销量不计算），完成后奖励将自动发放，您还可以领取其他更高任务。</div>
      <div class="bp-footer-text">2、每位用户只能领取专属于自己的任务，过低的任务将不可领取。</div>
      <div class="bp-footer-text">3、由于奖励过于丰厚，一个IP仅限第一位参与的用户参与，同IP下其他用户不可再领取任务。</div>
      <div class="bp-footer-text">4、严禁一切违规套利行为，投注数不得高于总注数的70%，无限娱乐拥有该活动的最终解释权。</div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'index',

    data () {
      return {
        activityList: []
      }
    },

    props: {},

    components: {},

    mounted () {
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .betPlan {
    overflow: hidden;
    font-family: "Microsoft Yahei", "Microsoft YaHei UI", sans-serif;
    display: block;
    position: relative;
    background-color: #ffffff;
    .bp-header {
      width: 100%;
      height: 456px;
      .bp-header-img {
        background-image: url('./misc/bp-header.png');
        width: 1920px;
        height: 100%;
        position: relative;
        top: 0;
        max-width: 1920px;
        left: 50%;
        margin-left: -960px;
      }
      .bp-header-time {
        width: 812px;
        height: 77px;
        line-height: 77px;
        font-size: 16px;
        color: #9f8b63;
        left: 50%;
        background: #fff9f4;
        position: relative;
        margin-top: -38px;
        margin-left: -406px;
        text-align: center;
        border-radius: 50px;
        z-index: 1;
        box-shadow: 0 3px 5px rgba(0, 0, 0, .3);
      }
    }
    .bp-task {
      width: 1200px;
      margin: 0 auto;
      padding: 100px 0 70px;
      .bp-task-item {
        background-image: url('./misc/bp-task.png');
        width: 195px;
        display: inline-block;
        padding-top: 59px;
        position: relative;
        text-align: center;
        height: 174px;
        .item-status {
          float: right;
          position: absolute;
          width: 72px;
          height: 61px;

          &.doing {
            background-image: url('./misc/bp-task-doing.png');
          }
          &.end {
            background-image: url('./misc/bp-task-end.png');
          }
          &.unenable {
            background-image: url('./misc/bp-task-unenable.png');
          }
        }
        .item-title {
          font-size: 26px;
          color: #67583c;
          margin-bottom: 32px;
          line-height: 26px;
        }
        .item-text {
          font-size: 20px;
          color: #ac976d;
          margin: 7px auto;
        }
        .item-down {
          position: absolute;
          bottom: -44px;
          color: #ac976d;
          font-size: 37px;
          left: 50%;
          margin-left: -11px;
        }
        &.active {
          background-image: url('./misc/bp-task-active.png');
        }
      }
    }
    .bp-wavy-lines {
      background: url('./misc/bp-wavy.png') repeat-x;
      height: 12px;
    }
    .bp-task-detail {
      height: 430px;
      width: 100%;
      background: #fef7ea;
      .bp-task-content {
        width: 1200px;
        color: #544a41;
        text-align: center;
        margin: 0 auto;
        padding-top: 27px;
        .bp-task-detail-title {
          font-size: 28px;
          color: #c6ab77;
        }
      }
      .bp-task-detail-name {
        margin-top: 10px;
        text-align: left;
        .detail-name {
          padding: 15px 60px;
          font-size: 22px;
          background: #c6ab77;
          border-radius: 5px;
        }
        .bet-detail {
          font-size: 22px;
          margin-left: 20px;
          color: #c6ab77;
        }
      }
      .bp-task-target {
        margin-top: 20px;
        height: 188px;
        .bp-task-target-top {
          text-align: left;
          font-size: 0;
          .target-item {
            text-align: center;
            width: 179px;
            background: #c6ab77;
            height: 55px;
            line-height: 55px;
            font-size: 18px;
            vertical-align: top;
            border-right: 1px solid #9f895f;
            border-top: 1px solid #9f895f;
            border-bottom: 1px solid #9f895f;
            &.top {
              border-left: 1px solid #9f895f;
            }
            &.add {
              width: 234px;
            }
            &.total {
              width: 231px;
            }
          }
        }
        .bp-task-target-bottom {
          font-size: 0;
          .bp-value-panel {
            display: inline-block;
            vertical-align: top;
            float: left;
            .bp-value-item {
              text-align: center;
              background: #fff6e6;
              font-size: 18px;
              width: 179px;
              height: 64px;
              line-height: 64px;
              display: block;
              vertical-align: top;
              border-right: 1px solid #9f895f;
              border-bottom: 1px solid #9f895f;
              &.type {
                background: #c6ab77;
              }
            }
            &.type {
              background: #c6ab77;
              border-left: 1px solid #9f895f;
            }
            &.add {
              width: 234px;
              border-right: 1px solid #9f895f;
              border-bottom: 1px solid #9f895f;
              height: 129px;
              font-size: 18px;
            }
            &.total {
              width: 231px;
              border-right: 1px solid #9f895f;
              border-bottom: 1px solid #9f895f;
              font-size: 18px;
              height: 129px;
            }
            .value-money {
              margin: 25px auto 10px;
            }
            .value-coupons {
              margin-top: 10px;
            }
          }
        }
      }
      .bp-task-receive {
        margin: 23px auto;
        cursor: pointer;
        background-image: url('./misc/bp-recevie.png');
        width: 218px;
        height: 67px;
      }
      .bp-task-received {
        margin: 23px auto;
        cursor: pointer;
        background-image: url('./misc/bp-un-recevie.png');
        width: 218px;
        height: 67px;
      }
    }
    .bp-footer {
      width: 1200px;
      margin: 0 auto;
      text-align: left;
      padding: 65px 0;
      color: #a48e63;
      .bp-footer-title {
        font-size: 18px;
        margin-bottom: 10px;
      }
      .bp-footer-text {
        font-size: 12px;
        line-height: 30px;
      }
    }
  }
</style>

