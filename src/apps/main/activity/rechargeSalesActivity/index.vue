<template>
  <div class="activity-rechargeSales">
    <div class="rs-header-panel">
      <div class="rs-header-img"></div>
      <div class="rs-header-time">活动时间：2018.01-2018.06</div>
    </div>
    <div class="rs-body">
      <div class="rs-panel">
        <div class="rs-panel-content">
          <div class="rs-panel-left inline-block">
            <div class="rs-panel-left-item">日均销量</div>
            <div class="rs-panel-left-item">200000元<span class="rs-panel-left-item-line">/</span>天</div>
            <div class="rs-panel-left-item">300000元<span class="rs-panel-left-item-line">/</span>天</div>
            <div class="rs-panel-left-item">400000元<span class="rs-panel-left-item-line">/</span>天</div>
            <div class="rs-panel-left-item">500000元<span class="rs-panel-left-item-line">/</span>天</div>
            <div class="rs-panel-left-item">600000元<span class="rs-panel-left-item-line">/</span>天</div>
            <div class="rs-panel-left-item">700000元<span class="rs-panel-left-item-line">/</span>天</div>
          </div>
          <div class="rs-panel-right inline-block">
            <div class="res-panel-right-top">
              <div class="top-item inline-block">
                <div class="top-item-img">第7天</div>
              </div>
              <div class="top-item inline-block">
                <div class="top-item-img">第14天</div>
              </div>
              <div class="top-item inline-block">
                <div class="top-item-img">第21天</div>
              </div>
              <div class="top-item inline-block">
                <div class="top-item-img">第28天</div>
              </div>
            </div>
          </div>
        </div>
        <div class="rs-panel-receive">
        </div>
        <div class="rs-panel-received hidden"></div>
        <div class="rs-tips">
          <div class="rs-tips-text">活动说明：</div>
          <div class="rs-tips-text">1、从活动之日起，根据日均销量的不同，每7天可领取一次对应的奖金。</div>
          <div class="rs-tips-text">2、销量按周期统计，如在到达第8天时，系统会自动统计前7天的销量总和计算平均日量，并发放与其对应的销售奖励。</div>
          <div class="rs-tips-text">3、前7天的奖励如在第14天之前未领取，则视为放弃，领取周期以此类推。</div>
          <div class="rs-tips-text">4、活动最终解释权归无限娱乐所有。</div>
        </div>
      </div>
    </div>
    <div class="rs-footer">
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
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .activity-rechargeSales {
    display: block;
    position: relative;
    background-color: #fcfcf8;
    .rs-header-panel {
      width: 100%;
      height: 686px;
      .rs-header-img {
        background-image: url('./misc/rs-back-header.png');
        width: 1920px;
        height: 100%;
        position: relative;
        top: 0;
        max-width: 1920px;
        left: 50%;
        margin-left: -960px;
      }
      .rs-header-time {
        background-image: url('./misc/rs-header-time-back.png');
        color: #ffffff;
        font-size: 22px;
        text-align: center;
        position: absolute;
        left: 50%;
        margin-left: -237px;
        width: 489px;
        top: 337px;
        height: 115px;
        line-height: 175px;

      }
    }

    .rs-body {
      position: relative;
      margin-top: -100px;
      .rs-panel {
        margin: 0 auto;
        width: 1200px;
        height: 1006px;
        position: relative;
        background-image: url('./misc/rs-panel-back.png');
        .rs-panel-content {
          padding: 60px 123px 0;
          min-height: 595px;
          .rs-panel-left {
            margin-right: 8px;
            text-align: center;
            .rs-panel-left-item {
              background-color: #e8e0c9;
              font-size: 16px;
              color: #760e0a;
              margin-bottom: 1px;
              width: 159px;
              padding: 31px 23px;
              .rs-panel-left-item-line {
                margin: 0 3px;
              }
            }
          }
          .rs-panel-right {
            text-align: center;
            vertical-align: top;
            .res-panel-right-top {
              position: relative;
              font-size: 0;
              top: 0;
              .top-item {
                background-color: #efede5;
                font-size: 16px;
                color: #ffffff;
                padding: 0 43px 8px;
                margin-right: 10px;
                .top-item-img {
                  background-image: url('./misc/rs-right-top-img.png');
                  width: 88px;
                  height: 74px;
                  line-height: 74px;
                }
              }
            }
          }
        }
        .rs-panel-receive {
          margin: 30px auto;
          background-image: url('./misc/rs-receive-up.png');
          width: 175px;
          height: 54px;
          &.active, &:hover {
            background-image: url('./misc/rs-receive-down.png');
          }
        }
        .rs-tips {
          display: block;
          font-size: 14px;
          color: #5d686b;
          line-height: 24px;
          padding: 20px 123px;
        }
      }
    }
    .rs-footer {
      background-image: url('./misc/rs-footer-back.png');
      width: 1920px;
      height: 460px;
      position: relative;
      top: 0;
      max-width: 1920px;
      left: 50%;
      margin-left: -960px;
    }
  }
</style>

