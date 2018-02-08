<template>
  <div class="activity-rechargeSales">
    <div class="rs-header">
      <div class="rs-header-img"></div>
      <div class="rs-header-time">活动时间：<span v-model="fromTime">{{fromTime}}</span>-<span
        v-model="endTime">{{endTime}}</span></div>
    </div>
    <div class="rs-body">
      <div class="rs-banner-left"></div>
      <div class="rs-banner-right"></div>
      <div class="rs-panel">
        <div class="rs-panel-content">
          <div class="rs-panel-content-title">
            <div class="rs-panel-title-item top inline-block">日均销量</div>
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
          <div class="rs-panel-content-item" v-for="(item,index) in salesList">
            <div class="rs-panel-title-item inline-block">{{_(item.sales).formatDiv(10000)}}元<span
              class="rs-panel-left-item-line">/</span>天
            </div>
            <div class="rs-panel-value-items inline-block" v-for="value in item.days">
              <div class="rs-panel-value-item inline-block" :class="{light:index===1 || index===3|| index===5}">
                <div class="item-select"
                     :class="{canSelect:value.status===1}">
                  <div class="item-select-set">￥<span class="item-text">{{_(value.bonus).formatDiv(10000)}}</span></div>
                </div>
                <div class="item-status" :class="{selected:value.status===2 ,pass:value.status===3}"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="rs-panel-receive" v-if="cycle>0" @click="submitReceive">
        </div>
        <div class="rs-panel-received " v-else></div>
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
      <div class="rs-gold1"></div>
      <div class="rs-gold2"></div>
      <div class="rs-gold3"></div>
      <div class="rs-gold4"></div>
      <div class="rs-gold5"></div>
      <div class="rs-gold6"></div>
    </div>
  </div>
</template>
<script>
  import activityInfo from 'api/activity'
  export default{
    name: 'index',

    data () {
      return {
        salesList: [],
        fromTime: '',
        endTime: '',
        cycle: -1,
      }
    },

    props: {},

    components: {},

    mounted () {
      activityInfo.getRechargeSalesInfo(
        ({data}) => {
          if (data && data.result === 0) {
            this.salesList = data.root.itemList
            this.fromTime = _(data.root.fromDate).toDate('YYYY年M月D日')
            this.endTime = _(data.root.endDate).toDate('YYYY年M月D日')
            this.cycle = data.root.cycle
          }
        }
      )
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {
      submitReceive(){
        activityInfo.doRechargeSalesPlan ({
          cycle:this.cycle
        },(data)=>{
            if(data.result === 0){
              Global.ui.notification.show('奖励领取成功')
            }else{
              Global.ui.notification.show('数据请求失败')
            }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .activity-rechargeSales {
    font-family: "Microsoft Yahei", "Microsoft YaHei UI", sans-serif;
    display: block;
    position: relative;
    background-color: #fcfcf8;
    overflow: hidden;
    .rs-header {
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
      z-index: 1;
      .rs-banner-left {
        background-image: url('./misc/rs-banner-left.png');
        width: 328px;
        height: 245px;
        position: absolute;
        left: 127px;
        margin-top: -149px;
      }
      .rs-banner-right {
        width: 328px;
        height: 245px;
        position: absolute;
        right: 114px;
        margin-top: -145px;
        background-image: url('./misc/rs-banner-right.png');
      }
      .rs-panel {
        margin: 0 auto;
        width: 1200px;
        height: 1006px;
        position: relative;
        background-image: url('./misc/rs-panel-back.png');

        .rs-panel-content {
          padding: 60px 123px 0;
          min-height: 595px;
          font-size: 0;
          text-align: center;
          .rs-panel-title-item {
            background-color: #e8e0c9;
            font-size: 16px;
            color: #760e0a;
            margin-bottom: 1px;
            width: 159px;
            padding: 24px 23px;
            vertical-align: top;
            margin-right: 8px;
            height: 21px;
            &.top {
              padding: 31px 23px;
            }
            .rs-panel-left-item-line {
              margin: 0 3px;
            }

          }
          .rs-panel-content-item {
            height: 70px;
            .rs-panel-value-items {
              vertical-align: top;
              .rs-panel-value-item {
                color: #333333;
                font-size: 16px;
                margin-right: 10px;
                background: #e6e4dc;
                position: relative;
                height: 65px;
                line-height: 65px;
                width: 108px;
                padding: 2px 33px;
                &.light {
                  background: #efede5;
                }
                .item-select {
                  .item-select-set {
                    margin-left: 17px;
                  }
                  &.canSelect {
                    background-image: url('./misc/rs-value-canRecevie.png');
                    width: 64px;
                    height: 65px;
                    position: absolute;
                    color: #760e0a;
                  }

                }
                .item-status {
                  width: 60px;
                  height: 52px;
                  position: absolute;
                  right: 0;
                  top: 0;
                  &.selected {
                    background-image: url('./misc/rs-item-received.png');
                  }
                  &.pass {
                    background-image: url('./misc/rs-item-pass.png');
                  }
                }
              }
            }
          }
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
        .rs-panel-receive {
          margin: 30px auto;
          cursor: pointer;
          background-image: url('./misc/rs-receive-up.png');
          width: 175px;
          height: 54px;
          &.active, &:hover {
            background-image: url('./misc/rs-receive-down.png');
          }
        }
        .rs-panel-received {
          margin: 30px auto;
          cursor: pointer;
          background-image: url('./misc/rs-cannot-recevie.png');
          width: 175px;
          height: 54px;
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
      margin-top: -300px;
      .rs-gold1 {
        background-image: url('./misc/rs-gold1.png');
        width: 279px;
        height: 221px;
        float: right;
      }
      .rs-gold2 {
        background-image: url('./misc/rs-gold2.png');
        width: 240px;
        height: 281px;
        float: right;
        position: absolute;
        right: 65px;
        margin-top: -574px;
      }
      .rs-gold3 {
        background-image: url('./misc/rs-gold3.png');
        width: 38px;
        height: 36px;
        position: absolute;
        bottom: 210px;
        left: 300px;
      }
      .rs-gold4 {
        background-image: url('./misc/rs-gold4.png');
        width: 185px;
        height: 250px;

        position: absolute;
        bottom: 1171px;
        right: 503px;
      }
      .rs-gold5 {
        width: 180px;
        height: 168px;
        background-image: url('./misc/rs-gold5.png');
        position: absolute;
        left: 80px;
        bottom: 240px;
      }
      .rs-gold6 {
        width: 252px;
        height: 283px;
        background-image: url('./misc/rs-gold6.png');
        position: absolute;
        left: 80px;
        bottom: 800px;
      }
    }
  }
</style>

