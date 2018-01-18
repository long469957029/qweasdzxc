<template>
  <div>
    <div class="footer-inner">
      <div class="footer-main footer-center clearfix">
        <div class="footer-lists">
          <div class="footer-list">
            <div class="footer-title"><a href="promotion.html" target="_blank">关于我们</a></div>
            <!--<ul>
              <li><a href="promotion.html" target="_blank">品牌介绍</a></li>
              &lt;!&ndash;<li><a href="merchants.html#/products" target="_blank">品牌介绍</a></li>&ndash;&gt;
              &lt;!&ndash;<li><a href="merchants.html#/join" target="_blank">联系我们</a></li>&ndash;&gt;
            </ul>-->
          </div>
          <div class="footer-list footer-line">|</div>
          <div class="footer-list">
            <div class="footer-title"><a href="#/hc?page=newbie">帮助中心</a></div>
            <!--<ul>
              <li><a class="router" href="#/hc?page=quick-top-up">如何充值</a></li>
              <li><a class="router" href="#/hc?page=withdrawal-flow">如何提现</a></li>
            </ul>-->
          </div>
          <div class="footer-list footer-line">|</div>
          <div class="footer-list">
            <div class="footer-title"><a href="#/hc?page=ssc">彩种介绍</a></div>
            <!--<ul>
              <li><a class="router" href="#hc?page=ssc">时时彩</a></li>
              <li><a class="router" href="#hc?page=num">11选5</a></li>
              <li><a class="router" href="#hc?page=low">低频彩</a></li>
            </ul>-->
          </div>
          <div class="footer-list footer-line">|</div>
          <div class="footer-list">
            <div class="footer-title"><a href="newDownload.html" target="_blank">客户端下载</a></div>
          </div>
          <div class="footer-list footer-line">|</div>
          <div class="footer-list">
            <div class="footer-title"><a href="/index.html#nb/detail/287">防劫持教程</a></div>
          </div>
        <!-- <div class="footer-list">
            <div class="footer-title">品牌新闻</div>
            <ul>
              <li><a href="http://taiyuan.news.163.com/15/1204/18/BA0TKL7S033613CK.html" target="_blank">网易网</a></li>
              <li><a href="http://zj.sina.com.cn/finance/xfgz/2015-12-02/detail_finance-ifxmazmy2366325.shtml" target="_blank">新浪网</a></li>
              <li><a href="http://xiamen.auto.qq.com/a/20151202/050981.htm" target="_blank">腾讯网</a></li>
              <li><a href="http://mt.sohu.com/20151202/n429319951.shtml" target="_blank">搜狐网</a></li>
            </ul>
          </div>-->
          <div style="clear: both"></div>
          <div class="footer-list-game">
            <img src="./footer-new2.png" class="icon-img" alt="">
            <!--<span class="sfa sfa-footer-new-1 icon-img"></span>-->
          </div>
          <div class="footer-list">
            <div class="footer-title" style="float: left">品牌新闻:</div>
            <ul>
              <li><a href="http://taiyuan.news.163.com/15/1204/18/BA0TKL7S033613CK.html" target="_blank">网易新闻</a></li>
              <li><a href="http://zj.sina.com.cn/finance/xfgz/2015-12-02/detail_finance-ifxmazmy2366325.shtml" target="_blank">新浪新闻</a></li>
              <li><a href="http://xiamen.auto.qq.com/a/20151202/050981.htm" target="_blank">腾讯新闻</a></li>
              <!--<li><a href="http://mt.sohu.com/20151202/n429319951.shtml" target="_blank">搜狐网</a></li>-->
            </ul>
          </div>
        </div>
        <!--<div class="footer-middle">
          <div class="footer-middle-container">
            <span>运营资质</span>
            <span class="sfa sfa-footer-1"></span>
            <span class="sfa sfa-footer-2"></span>
          </div>
          <div class="footer-middle-container">
            <span>博彩责任</span>
            <span class="sfa sfa-footer-3"></span>
            <span class="sfa sfa-footer-4"></span>
            <span class="sfa sfa-footer-5"></span>
          </div>
        </div>-->

        <div class="vr-code">
          <div class="vr-main">
            <div class="js-footer-desc">
              <p>扫一扫下载</p>
              <p>无限彩票APP</p>
            </div>
          </div>
          <img class="js-footer-code" src="./vr-code1.png">
          <div class="btn-group-list">
            <a target="_blank" href="/wx.exe"><button class="icon-btn2"></button></a>
            <a target="_blank" href="/setup.exe"><button class="icon-btn1"></button></a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-inner footer-inner-2">
      <div class="footer-main-2 footer-center clearfix">
        <div class="footer-logo"><!--<img class="js-footer-logo">-->
          Copyright © 2016-2017 无限娱乐 版权所有
        </div>
        <!--<div class="footer-copyright">copyright &copy; 2015 无限娱乐 All rights reserved</div>-->
        <div class="footer-time">
          <span class="sfa sfa-footer-new-2" style="margin-top: 4px;"></span>
          <img class="js-footer-calendar-icon  hidden">
          <span class="js-footer-calendar-text footer-time-text hidden"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main-footer'
}
</script>

<style lang="scss"  scoped>
  @import "~base/styles/imports";
  .footer {
    position: relative;
    bottom: 0;
    right: 0;
    left: 0;
    display: none;
    color: $font-default;
    height: 165px;
    line-height: 30px;

    .footer-inner {
      background: #5e5f65;
      &.footer-inner-2 {
        background: $new-dark-color;
      }
    }
    .footer-center {
      position: relative;
      width: 1221px;
      margin: 0 auto;
    }

    .footer-main {
      padding: 5px 0 10px;
      background: #5e5f65;
    }
    .footer-lists {
      float: left;
      .footer-line{
        width: 20px;
        text-align: center;
      }
    }
    .footer-list {
      display: inline-block;
      /*width: 110px;*/
      float: left;
      ul {
        float:left;
        li {
          list-style: none;
          float:left;
          margin-left: 15px;
          color: #b5b5b8;
          line-height: 30px;
          a {
            color: #b5b5b8;
          }
        }
        li:first-child{
          margin-left: 8px;
        }
      }
    }
    .footer-title {
      font-size: 14px;
    }

    .footer-middle {
      float: left;
      font-size: 14px;
      margin-left: 100px;
      margin-top: 18px;
      .sfa {
        vertical-align: middle;
        margin-left: 12px;
      }
    }
    .footer-middle-container {
      margin-bottom: 10px;
    }

    .vr-code {
      float: right;
    /* width: 275px;*/
      img {
        width: 120px;
        height: 116px;
        float: left;
        margin-right: 10px;
        margin-top: 5px;
      }
      .vr-main {
        float: left;
        overflow: hidden;
        text-align: center;
        line-height: 20px;
        width: 130px;
        margin-top: 40px;
        font-size: 14px;
      }
      .btn-group-list{
        float: left;
        width: 123px;
        position: relative;
        .icon-btn1{
          width: 123px;
          height: 29px;
          top:75px;
          right: -20px;
          position: absolute;
          background: url("./btn1.png") no-repeat;
          outline: none;
          border: none;
        }
        .icon-btn2{
          width: 123px;
          height: 29px;
          position: absolute;
          top:25px;
          right: -20px;
          background: url("./btn2.png") no-repeat;
          outline: none;
          border: none;
        }
      }
      .vr-title {
        font-size: 24px;
        font-weight: bold;
        margin-top: 40px;
      }
    }

    .footer-main-2 {
      .footer-logo {
        float: left;
        font-size: 12px;
      }
      .footer-copyright {
        display: inline-block;
      }
      .footer-time {
        background: $new-dark-color;
        float: right;
      }
      .footer-time-text {
        margin-top: 5px;
      }
    }
  }

  @media (min-height: 930px) {
    .footer {
      display: block;
    }
  }
  .footer-list-game{
    height: 60px;
    .icon-img{
      margin-top: 13px;
    }
  }
</style>
