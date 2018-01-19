<template>
  <div class="footer">
    <div class="footer-container">
      <div>
        <div class="link-list">
          <li><a href="">关于我们</a></li>
          <li><a href="">规则与条款</a></li>
          <li><a href="">常见问题</a></li>
          <li><a href="">游戏规则</a></li>
          <li><a href="">下载中心</a></li>
          <li><a href="">防劫持教程</a></li>
        </div>

        <div class="download">
          <span>下载手机APP：</span>
          <span class="download-list">
            <div class="android-icon"></div>
            <div class="ios-icon"></div>
          </span>
        </div>
        <p>Copyright © 2016-2017 无限娱乐 版权所有</p>
        <p>无限娱乐郑重提示：彩票有风险，投注需谨慎，未满18周岁的青少年禁止购买</p>
        <div class="desc-bottom">
          <span>合作夥伴：</span>
          <span class="cooperator-list">
            <div class="cooperator-icon-1"></div>
            <div class="cooperator-icon-2"></div>
            <div class="cooperator-icon-3"></div>
            <div class="cooperator-icon-4"></div>
            <div class="cooperator-icon-5"></div>
            <div class="cooperator-icon-6"></div>
          </span>
        </div>
      </div>

      <div>
        <div class="desc-company">
          <p>
            作为行业挑战者，无限娱乐始终将品牌信誉作为发展的第一要务，
            从游戏选择，产品设计，运营服务的创新上从未妥协。实力让情怀
            落地，厚积薄发才能带给用户最极致的游戏体验。
          </p>
        </div>
        <div class="follow">
          <span class="follow-list">
            <span>关注我们：</span>
            <div class="wechat-icon"></div>
            <div class="weibo-icon"></div>
          </span>
        </div>
        <div class="desc-bottom">
          <div class="duty-list">
            <span class="duty-icon-1"></span>
            <span class="duty-icon-2"></span>
            <span class="duty-icon-3"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="footer-title"><a href="promotion.html" target="_blank">关于我们</a></div> -->
    <!-- Copyright © 2016-2017 无限娱乐 版权所有 -->
    <!--<ul>
      <li><a href="promotion.html" target="_blank">品牌介绍</a></li>
      &lt;!&ndash;<li><a href="merchants.html#/products" target="_blank">品牌介绍</a></li>&ndash;&gt;
      &lt;!&ndash;<li><a href="merchants.html#/join" target="_blank">联系我们</a></li>&ndash;&gt;
    </ul>-->
    <!--  1. 关于我们 2. 规则与条款 3. 常见问题 4. 游戏规则 5. 下载中心 6. 防劫持较成 -->
    <!-- <div class="footer-title"><a href="#/hc?page=newbie">帮助中心</a></div> -->
    <!-- <div class="footer-title"><a href="#/hc?page=ssc">彩种介绍</a></div> -->
    <!-- <div class="footer-title"><a href="newDownload.html" target="_blank">客户端下载</a></div> -->
    <!-- <div class="footer-title"><a href="/index.html#nb/detail/287">防劫持教程</a></div> -->
  </div>
</template>

<script>
export default {
  name: 'main-footer'
}
</script>

<style lang="scss"  scoped>
  @import "~base/styles/variable";
  .footer {
    position: relative;
    bottom: 0;
    right: 0;
    left: 0;
    display: none;
    height: 280px;
    background: #21232a;
  }

  .footer-container {
    width: 1200px;
    position: relative;
    display: flex;
    margin: 0 auto;
    padding: 20px 0 30px;
    justify-content: space-between;

    .footer-bg {
      width: 602px;
      height: 280px;
      background: url('./images/footer-bg.png');
      position: absolute;
      right: 0;
    }

    span {
      font-size: 12px;
      color: #999;
    }
  }

  .link-list {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    li {
      height: 12px;
      border-right: #4d4f55;
      padding: 0 20px;
      list-style: none;
    }
    a {
      color: white;
      transition: all .3s;
      text-decoration: none;
      font-size: 14px;

      &:hover, &:active {
        color: $main-deep-color;
        text-decoration: underline;
      }
    }
  }

  .desc-bottom {
    margin-top: 50px;

    span {
      font-size: 14px;
    }
  }

  .desc-company {
    margin: 70px 0 18px;
  }

  .follow-list, .download-list, .follow-list, .duty-list, .cooperator-list {
    display: flex;
    flex-direction: row;
    align-items: center;
  }



  .android-icon {
    width: 45px;
    height: 45px;
    background: url('./images/android-icon.png');
    transition: all .3s;

    &:hover, &:active {
      background: url('./images/android-icon-active.png');
    }
  }

  .wechat-icon {
    width: 28px;
    height: 28px;
    background: url('./images/wechat-icon.png');

    &:hover, &:active {
      background: url('./images/wechat-icon-active.png');
    }
  }

  .weibo-icon {
    width: 28px;
    height: 28px;
    background: url('./images/weibo-icon.png');

    &:hover, &:active {
      background: url('./images/weibo-icon-active.png');
    }
  }

  .duty-list {

    .duty-icon-1 {
      width: 24px;
      height: 26px;
    }

    .duty-icon-2 {
      width: 25px;
      height: 25px;
    }

    .duty-icon-3 {
      width: 25px;
      height: 24px;
    }
  }


  .cooperator-list {

    > div {
      margin: 0 15px;
    }

    .cooperator-icon-1 {
      width: 66px;
      height: 22px;
    }

    .cooperator-icon-2 {
      width: 94px;
      height: 20px;
    }

    .cooperator-icon-3 {
      width: 96px;
      height: 24px;
    }

    .cooperator-icon-4 {
      width: 84px;
      height: 21px;
    }

    .cooperator-icon-5 {
      width: 86px;
      height: 25px;
    }

    .cooperator-icon-6 {
      width: 65px;
      height: 22px;
    }
  }

  .ios-icon {
    width: 45px;
    height: 45px;
    background: url('./images/ios-icon.png');
    transition: all .3s;

    &:hover, &:active {
      background: url('./images/ios-icon-active.png');
    }
  }

  @for $i from 1 to 6 {
    .cooperator-icon-#{$i} {
      background: url('./images/cooperator-icon-#{$i}.png');
    }
  }

  @for $i from 1 to 3 {
    .duty-icon-#{$i} {
      background: url('./images/duty-icon-#{$i}.png');
    }
  }

  @media (min-height: 930px) {
    .footer {
      display: block;
    }
  }
</style>
