<template>
  <div>
    <!--  banner区 -->
    <div class="dashboard-banner">
      <slide-show></slide-show>
    </div>

    <!-- 快报 news -->
    <div class="db-bulletin-container">
      <div class="dashboard-bulletin">
        <div class="bulletin-logo"></div>
        <div class="bulletin-content js-bulletin-marquee">
          <notice></notice>
        </div>
      </div>
    </div>
    <div class="dashboard-container">
      <div class="dashboard-row">
        <!-- 讯息轮播区块 -->
        <div class="col-md-9 js-db-game-entry-carousel db-shadow carousel slide">
          <ol class="carousel-indicators db-carousel-indicators">
            <li data-slide-to="0" class="active"></li>
            <li data-slide-to="1"></li>
          </ol>
          <div class="dashboard-carousel-table  carousel-inner">
            <!-- 优惠讯息 真人-->
            <div class="dashboard-row-inner item active">
              <div class="db-game-ad db-ah-ad"></div>
              <div class="carousel-table-content">
                <div class="dashboard-row-inner">
                  <div class=" content-item-2x db-ah-bjl">
                    <button class="db-ah-play-btn db-ah-play-btn-blue ">立即游戏</button>
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div class="dashboard-row-inner">
                  <div class="content-item-1x db-ah-sb">
                    <button class="db-ah-play-btn db-ah-play-btn-green ">立即游戏</button>
                  </div>
                  <div class="content-item-1x db-ah-lp">
                    <button class="db-ah-play-btn db-ah-play-btn-purple ">立即游戏</button>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <!-- 优惠讯息 老虎机-->
            <div class="dashboard-row-inner item ">
              <div class="db-game-ad db-slot-ad "></div>
              <div class="carousel-table-content">
                <div class="dashboard-row-inner">
                  <div class="col-md-6">
                    <div class=" content-item-1x db-slot-1-bg">
                      <span class="sfa sfa-slot-blsmy db-slot-logo"></span>
                      <div class="db-slot-name"></div>
                      <div class="db-slot-mask">
                        <div class="db-slot-play-btn"></div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class=" content-item-1x db-slot-2-bg">
                      <span class="sfa sfa-slot-blsmy db-slot-logo"></span>
                      <div class="db-slot-name"></div>
                      <div class="db-slot-mask">
                        <div class="db-slot-play-btn"></div>
                      </div>
                    </div>
                  </div>
                  <div class="clearfix"></div>
                </div>
                <div class="dashboard-row-inner">
                  <div class="col-md-6">
                    <div class=" content-item-1x db-slot-3-bg">
                      <span class="sfa sfa-slot-blsmy db-slot-logo"></span>
                      <div class="db-slot-name"></div>
                      <div class="db-slot-mask">
                        <div class="db-slot-play-btn"></div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class=" content-item-1x db-slot-4-bg">
                      <span class="sfa sfa-slot-blsmy db-slot-logo"></span>
                      <div class="db-slot-name"></div>
                      <div class="db-slot-mask">
                        <div class="db-slot-play-btn"></div>
                      </div>
                    </div>
                  </div>
                  <div class="clearfix"></div>
                </div>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="dashboard-mall db-shadow">
          <div class="db-block-border"></div>
          <div class="dashboard-mall-header">
            <div class="db-mall-title"></div>
          </div>
          <div class="js-db-mall-content">
            <div class="dashboard-mall-content">
              <div class="title">IPhone 6s plus 128GB</div>
              <div class="desc">苹果粉最爱，您值得拥有！</div>
              <a src="/" class="btn btn-mall-exchange">立即兑换</a>
              <div class="image"></div>
            </div>
            <div class="dashboard-mall-content">
              <div class="title">充值券 <span class="badge">新用户专享</span></div>
              <div class="desc">充值满1000即返20元</div>
              <a src="/" class="btn btn-mall-exchange">立即兑换</a>
              <div class="image"></div>
            </div>
            <div class="dashboard-mall-content">
              <div class="title">无限纷纷采 <span>返水券</span></div>
              <div class="desc">按投注额2%比例返水</div>
              <a src="/" class="btn btn-mall-exchange">立即兑换</a>
              <div class="image"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
  <!--&lt;!&ndash; 主内容区 &ndash;&gt;-->
  <!--<div class="dashboard-container">-->
  <!--<div class="dashboard-row">-->
  <!--&lt;!&ndash; 积分商城 &ndash;&gt;-->
  <!--<div class="col-md-3">-->
  <!--<div class="dashboard-mall db-shadow">-->
  <!--<div class="db-block-border"></div>-->
  <!--<div class="dashboard-mall-header">-->
  <!--<div class="db-mall-title"></div>-->
  <!--</div>-->
  <!--<div class="js-db-mall-content">-->
  <!--<div class="dashboard-mall-content">-->
  <!--<div class="title">IPhone 6s plus 128GB</div>-->
  <!--<div class="desc">苹果粉最爱，您值得拥有！</div>-->
  <!--<a src="/" class="btn btn-mall-exchange">立即兑换</a>-->
  <!--<div class="image"></div>-->
  <!--</div>-->
  <!--<div class="dashboard-mall-content">-->
  <!--<div class="title">充值券 <span class="badge">新用户专享</span></div>-->
  <!--<div class="desc">充值满1000即返20元</div>-->
  <!--<a src="/" class="btn btn-mall-exchange">立即兑换</a>-->
  <!--<div class="image"></div>-->
  <!--</div>-->
  <!--<div class="dashboard-mall-content">-->
  <!--<div class="title">无限纷纷采 <span>返水券</span></div>-->
  <!--<div class="desc">按投注额2%比例返水</div>-->
  <!--<a src="/" class="btn btn-mall-exchange">立即兑换</a>-->
  <!--<div class="image"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="clearfix"></div>-->
  <!--</div>-->

  <!--<div class="dashboard-row">-->
  <!--&lt;!&ndash; 动态区块 &ndash;&gt;-->
  <!--<div class="col-md-9">-->
  <!--<div class="db-ticket db-shadow">-->
  <!--<div class="db-block-border"></div>-->
  <!--<div class="db-ticket-ad"></div>-->
  <!--<div class="db-ticket-game">-->
  <!--<ul class="db-ticket-game-type">-->
  <!--<li class="js-db-ticket-game-type-item db-ticket-game-type-item active" data-type="1">盘口玩法</li>-->
  <!--<li class="js-db-ticket-game-type-item db-ticket-game-type-item" data-type="2">经典玩法</li>-->
  <!--</ul>-->
  <!--<a class="db-ticket-more">更多彩种 >></a>-->
  <!--<div class="js-db-ticket-game-type-container db-ticket-game-type-container" data-type="1">-->
  <!--<div class="db-ticket-item">-->
  <!--<div class="db-ticket-logo"></div>-->
  <!--<div class="db-ticket-name">重庆时时彩</div>-->
  <!--<div class="db-ticket-num">1234人参与投注</div>-->
  <!--<div class="db-ticket-progress-bg">-->
  <!--<div class="db-ticket-progress" style="width:80%;"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="db-ticket-item">-->
  <!--<div class="db-ticket-logo"></div>-->
  <!--<div class="db-ticket-name">北京赛车PK10</div>-->
  <!--<div class="db-ticket-num">1234人参与投注</div>-->
  <!--<div class="db-ticket-progress-bg">-->
  <!--<div class="db-ticket-progress" style="width:80%;"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="db-ticket-item">-->
  <!--<div class="db-ticket-logo"></div>-->
  <!--<div class="db-ticket-name">香港六合彩</div>-->
  <!--<div class="db-ticket-num">1234人参与投注</div>-->
  <!--<div class="db-ticket-progress-bg">-->
  <!--<div class="db-ticket-progress" style="width:80%;"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="js-db-ticket-game-type-container db-ticket-game-type-container hidden" data-type="2">-->
  <!--<div class="db-ticket-item">-->
  <!--<div class="db-ticket-logo"></div>-->
  <!--<div class="db-ticket-name">重庆时时彩</div>-->
  <!--<div class="db-ticket-num">1234人参与投注</div>-->
  <!--<div class="db-ticket-progress-bg">-->
  <!--<div class="db-ticket-progress" style="width:80%;"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="db-ticket-item">-->
  <!--<div class="db-ticket-logo"></div>-->
  <!--<div class="db-ticket-name">北京赛车PK10</div>-->
  <!--<div class="db-ticket-num">1234人参与投注</div>-->
  <!--<div class="db-ticket-progress-bg">-->
  <!--<div class="db-ticket-progress" style="width:80%;"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="db-ticket-item">-->
  <!--<div class="db-ticket-logo"></div>-->
  <!--<div class="db-ticket-name">香港六合彩</div>-->
  <!--<div class="db-ticket-num">1234人参与投注</div>-->
  <!--<div class="db-ticket-progress-bg">-->
  <!--<div class="db-ticket-progress" style="width:80%;"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--</div>-->
  <!--&lt;!&ndash; 新人大礼包 &ndash;&gt;-->
  <!--<div class="col-md-3">-->
  <!--<div class="db-activity db-shadow">-->
  <!--<div class="db-block-border"></div>-->
  <!--<div class="db-activity-content"></div>-->
  <!--</div>-->
  <!--</div>-->
  <!--<div class="clearfix"></div>-->
  <!--</div>-->
  <!--</div>-->

</template>
<script>
  import slideShow from './slideShow'
  import notice from './notice'
  export default {
    name: "dashboard",
    components: {
      slideShow,
      notice
    },
    data () {
      return {}
    },
    methods: {},
    mounted() {

    }
  }
</script>
<style lang="scss" scoped>
  @import "~base/styles/variable";

  body, .carousel-table-content {
    background: rgba(248, 248, 248, 1) !important;
  }
  @mixin center-container {
    position: relative;
    box-sizing: border-box;
    width: 1200px;
    margin: 0 auto;
  }

  @mixin inline-block {
    display: inline-block;
    vertical-align: top;
  }

  .dashboard-banner {
    width: 100%;
    height: 450px;
    overflow: hidden;
    position: relative;
  }
  .db-bulletin-container{
    width: 100%;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    margin-bottom: 30px;
  }
  .dashboard-bulletin {
    @include center-container;
    height: 50px;
    line-height: 50px;
    color: #707070;
    font-size: 14px;

    > div {
      @include inline-block;
    }

    .bulletin-logo {
      width: 140px;
      height: 50px;
      line-height: 50px;
      text-align: right;
      background: url('./misc/db-notice.png') no-repeat center;
    }

    .bulletin-content {
      width: 1055px;
      height: 50px;
    }
  }
  .dashboard-container {
    @include center-container();
    margin-bottom: 130px;
    * {
      box-sizing: border-box;
    }
    .db-carousel-indicators{
      left:11%;
      width: 10%;
      margin-left: 0;
    }
  }
  .dashboard-carousel-table {
    height: 460px;
    border: 9px solid #fff;
    font-size: 0;
    .db-game-ad {
      width: 273px;
      height: 442px;
      float: left
    }

    .carousel-table-content {
      width: 609px;
      height: 442px;
      border-left: 9px solid #fff;
      float: left
    }

  }
  .dashboard-row {
    margin-bottom: 30px;
  }

  .dashboard-row-inner {
    font-size: 0;
    display: inline-block;
    .content-item-2x {
      width: 600px;
    }
    .content-item-1x {
      background: url('./misc/db-slot-bg.png') no-repeat center;
      width: 296px;
    }

    .db-ah-ad{
      background: url('./misc/db-ah-ad.png') no-repeat center;
    }
    .db-ah-bjl{
      background: url('./misc/db-ah-bjl.png') no-repeat center;
      height: 236px;
      margin-bottom: 9px;
    }
    .db-ah-sb{
      display: inline-block;
      background: url('./misc/db-ah-sb.png') no-repeat center;
      margin-right: 9px ;
      width: 296px;
      height: 197px;
    }
    .db-ah-lp{
      display: inline-block;
      background: url('./misc/db-ah-lp.png') no-repeat center;
      width: 295px;
      height: 197px;
    }
    .db-slot-ad{
      background: url('./misc/db-slot-ad.png') no-repeat center;
    }
    .db-slot-1-bg{
      display: inline-block;
      background: url('./misc/db-slot-1-bg.png') no-repeat center;
      margin-right: 9px;
      margin-bottom: 9px;
      width: 296px;
      height: 216px;

    }
    .db-slot-2-bg{
      display: inline-block;
      background: url('./misc/db-slot-2-bg.png') no-repeat center;
      width: 295px;
      height: 216px;
      margin-bottom: 9px;
    }
    .db-slot-3-bg{
      display: inline-block;
      background: url('./misc/db-slot-3-bg.png') no-repeat center;
      margin-right: 9px;
      width: 296px;
      height: 216px;
    }
    .db-slot-4-bg{
      display: inline-block;
      background: url('./misc/db-slot-4-bg.png') no-repeat center;
      width: 295px;
      height: 216px;
    }
    .db-ah-play-btn{
      position: relative;
      width: 120px;
      height:38px;
      margin-top: 140px ;
      margin-left: 27px;
      border: 1px solid #fff;
      border-radius: 19px;
      line-height: 34px;
      text-align: center;
      background: transparent;
    }
    .db-ah-play-btn-blue{
      color: #4f84da;
      border: 1px solid #4f84da;
    }
    .db-ah-play-btn-green{
      color: #14b1bb;
      border: 1px solid #14b1bb;
    }
    .db-ah-play-btn-purple{
      color: #9f6ec5;
      border: 1px solid #9f6ec5;
    }
  }
  .dashboard-mall {
    width: 288px;
    height: 458px;
    margin-left: 12px;
    background: #fff;

    .dashboard-mall-header {
      text-align: center;
      width: 268px;
      height: 49px;
      margin: 0 10px;
      .db-mall-title {
        background: url('./misc/db-mall-title.png') no-repeat center;
        width: 268px;
        height: 49px;
        border-bottom: 1px solid $def-line-color;
      }
    }

    .dashboard-mall-content {
      margin: 0px 20px;
      padding: 28px 10px;
      border-bottom: 1px solid $font-auxiliary-color;

      &:nth-child(3) {
        border-bottom: none;
      }

      .title {
        font-size: 14px;
        color: $font-dark;
        line-height: 16px;
      }

      .desc {
        font-size: 12px;
        color: $new-inverse-color;
        line-height: 30px;
      }

      .badge {
        background: $font-auxiliary-color;
      }

      .btn-mall-exchange {
        width: 90px;
        margin-top: 5px;
        color: $new-main-deep-color;
        background: transparent;
        border: 1px solid $new-main-deep-color;
        border-radius: 20px / 20px;
      }
    }
  }
</style>
