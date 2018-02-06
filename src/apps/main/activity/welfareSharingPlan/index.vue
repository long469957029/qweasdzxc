<template>
  <div class="welfareSharingPlan">
    <div class="ws-header">
      <div class="ws-header-img">
        <div class="ws-header-container">
          <div class="ws-header-logo1"></div>
          <div class="ws-header-logo2"></div>
          <div class="ws-header-logo3"></div>
          <div class="ws-header-time">活动时间：2017年1月2日-2017年2月1日</div>

        </div>
      </div>
    </div>
    <div class="ws-desc">
      <div class="ws-desc-left">
      </div>
      <div class="ws-desc-right">
      </div>
      <div class="ws-desc-container">
        <div class="ws-desc-text">好福利齐分享，天天有钱天天分享！为答谢广大总代对平台的支持，
          也使平台能有序健康发展，无限娱乐特别为您定制这份福利分享活动，让你在为平台贡献力量时能享受丰厚的奖励
        </div>
      </div>
    </div>
    <div class="ws-body">
      <div class="ws-content">
        <div class="content-container"></div>
        <div class="ws-content-logo1"></div>
        <div class="ws-content-logo2"></div>
        <div class="ws-content-logo3"></div>
        <div class="ws-content-logo4"></div>
        <div class="ws-content-logo5"></div>
      </div>
      <div class="ws-footer">
        <div class="ws-footer-title">活动说明</div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">1</div>
          活动仅限12.8总代享受参与（不含平级）。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">2</div>
          活动统计周期为：根据团队前一天的销售与亏损情况，
          按下表标准收到领取奖励，逾期作废。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">3</div>
          在同等销量的情况下，贡献的亏损值不同，所获取的奖励也不同。
          如在销量10000的情况下，亏损200获得100元，亏损400获得130元，亏损500则可获得180元奖励，以此类推。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">4</div>
          领取获得奖励需销量，亏损同时达标才能获得对应的奖励，如销量达到亏损未达到，则以最低亏损段计算奖励：
          如亏损达到销量未达到，则以最低销量计算奖励。
        </div>
        <div class="ws-footer-text">
          <div class="ws-text-circle">5</div>
          每天销量封顶100万，亏损奖励最高18000元，无限娱乐享有活动的最终解释和修改权。
        </div>
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
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .welfareSharingPlan {
    overflow: hidden;
    font-family: "Microsoft Yahei", "Microsoft YaHei UI", sans-serif;
    display: block;
    position: relative;
    background-color: #ffffff;
    .ws-header {
      width: 100%;
      height: 479px;
      .ws-header-img {
        background-image: url('./misc/ws-header.png');
        width: 1920px;
        height: 100%;
        position: relative;
        top: 0;
        max-width: 1920px;
        left: 50%;
        margin-left: -960px;
      }
      .ws-header-container {
        width: 1200px;
        margin: 0 auto;
        padding: 30px 0;
        position: relative;
        .ws-header-logo1 {
          background-image: url('./misc/ws-header-logo1.png');
          width: 467px;
          height: 349px;
          margin: 0 auto;
        }
        .ws-header-logo2 {
          position: absolute;
          width: 191px;
          height: 114px;
          top: 30px;
          left: 83px;
          background-image: url('./misc/ws-header-logo2.png');
        }
        .ws-header-logo3 {
          width: 295px;
          height: 167px;
          position: absolute;
          top: 230px;
          background-image: url('./misc/ws-header-logo3.png');
        }
        .ws-header-time {
          font-size: 18px;
          color: #506660;
          left: 50%;
          position: relative;
          bottom: 114px;
          margin-left: -162px;
        }

      }
    }
    .ws-desc {
      width: 100%;
      height: 233px;
      position: relative;
      margin-top: -60px;
      .ws-desc-left {
        position: absolute;
        left: 0;
        width: 455px;
        height: 233px;
        background-image: url('./misc/ws-desc-left.png');
      }
      .ws-desc-right {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 400px;
        height: 153px;
        background-image: url('./misc/ws-desc-right.png');
      }
      .ws-desc-container {
        width: 1920px;
        height: 100%;
        position: absolute;
        margin-top: -15px;
        /* text-align: center; */
        left: 50%;
        margin-left: -276px;
        .ws-desc-text {
          position: absolute;
          font-size: 14px;
          color: #75aa9c;
          line-height: 25px;
          width: 565px;
          margin: -15px auto 0;
        }
      }
    }
    .ws-body {
      width: 100%;
      position: relative;
      padding-bottom: 55px;
      background: linear-gradient(to bottom, #d7f1e2, #9eccbc);
      .ws-content {
        margin: 0 auto;
        position: relative;
        width: 1098px;
        height: 1300px;
        .content-container {
          background-image: url('./misc/ws-body.png');
          width: 1098px;
          height: 1483px;
          margin: 0 auto;
          position: absolute;
          top: -160px;
        }
      }
      .ws-content-logo1{
        background-image: url('./misc/ws-content-logo1.png');
        width: 139px;
        height: 128px;
      }
      .ws-content-logo2{
        background-image: url('./misc/ws-content-logo2.png');
        width: 95px;
        height: 120px;
      }
      .ws-content-logo3{
        background-image: url('./misc/ws-content-logo3.png');
        width: 68px;
        height: 64px;
      }
      .ws-content-logo4{
        background-image: url('./misc/ws-content-logo4.png');
        width: 305px;
        height: 107px;
      }
      .ws-content-logo5{
        background-image: url('./misc/ws-content-logo5.png');
        width: 187px;
        height: 66px;
      }
      .ws-footer {
        width: 1200px;
        margin: 0 auto;
        background: transparent;
        .ws-footer-title {
          font-size: 20px;
          color: #2e8a72;
          font-weight: 600;
          margin-top: 100px;
          margin-bottom: 12px;
        }
        .ws-footer-text {
          color: #427769;
          font-size: 12px;
          line-height: 17px;
          margin: 6px 0;
          .ws-text-circle {
            width: 17px;
            height: 17px;
            background: #2e8a72;
            border-radius: 50px;
            color: #95cebf;
            font-size: 10px;
            text-align: center;
            line-height: 17px;
            float: left;
            margin-right: 12px;
          }
        }
      }
    }
  }
</style>

