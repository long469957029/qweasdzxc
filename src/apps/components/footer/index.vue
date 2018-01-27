<template>
  <div class="footer-main">
    <div class="footer-line"></div>
    <div class="footer-partner">
      <span class="footer-partner-text inline-block">合作伙伴：</span>
      <span class="footer-partner-ag inline-block"></span>
      <span class="footer-partner-playtech inline-block"></span>
      <span class="footer-partner-micro inline-block"></span>
      <span class="footer-partner-unipay inline-block"></span>
      <span class="footer-partner-alipay inline-block"></span>
      <span class="footer-partner-wx inline-block"></span>
    </div>
    <div class="footer-copyright">
      Copyright <i class="fa fa-copyright footer-copyright-img" aria-hidden="true"></i> 2017-2018<span
      class="footer-copyright-name">无限娱乐</span> 版权所有
    </div>
  </div>
</template>
<script>
  export default{
    name: 'footer-copyright',
    data(){
      return{

      }
    }
  }
</script>
<style lang="scss" scoped>
  .footer-main{
    width: 1200px;
    margin: 0 auto;
  }
  .footer-copyright {
    margin: 14px;
    color: #999999;
    font-size: 12px;
    text-align: center;

    .footer-copyright-name {
      margin-left: 3px;
    }

  }

  .footer-line {
    width: 1200px;
    height: 1px;
    margin-bottom: 43px;
    background-image: url("./images/initPwd-back-line.png");
  }

  .footer-partner {
    color: #999999;
    font-size: 12px;
    margin-bottom: 32px;
    text-align: center;

    .footer-partner-text {
      vertical-align: top;
    }

    .footer-partner-ag {
      width: 104px;
      height: 25px;
      background-image: url("./images/initPwd-logo-ag.png");
    }

    .footer-partner-playtech {
      width: 104px;
      height: 25px;
      background-image: url("./images/initPwd-logo-playtech.png");
    }

    .footer-partner-micro {
      width: 104px;
      height: 25px;
      background-image: url("./images/initPwd-logo-micro.png");
    }

    .footer-partner-unipay {
      width: 104px;
      height: 25px;
      background-image: url("./images/initPwd-logo-unipay.png");
    }

    .footer-partner-alipay {
      width: 104px;
      height: 25px;
      background-image: url("./images/initPwd-logo-ali.png");
    }

    .footer-partner-wx {
      width: 104px;
      height: 25px;
      background-image: url("./images/initPwd-logo-wx.png");
    }

  }
</style>
