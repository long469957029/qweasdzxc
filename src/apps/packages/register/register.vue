<template>
  <div>
    <div class="loading">
      <img src="../download/images/wx/loading.gif" width="150" height="150">
    </div>
    <div id="fullpage" class="opacity-0">
      <div class="section " id="section1">
        <div class="register-header">
          <div class="header-container">
            <div class="register-logo"></div>
          </div>
        </div>
        <div class="panel basic-white">
          <a href="/newDownload.html" target="_blank" class="download-link"></a>
          <div class="panel-reg"></div>
          <div class="panel-main">

            <div class="js-pg-resetPassword-main wizard clearfix ac-reg-body" role="application" id="steps-uid-0">
              <div class="reg-ad pull-right">
                <div id="jsREADCarousel" class="js-re-carousel-container carousel slide">
                  <ol class="js-re-navigate carousel-indicators">
                  </ol>
                  <div class="js-re-ad-container carousel-inner ac-reg-pic">
                  </div>
                </div>
              </div>
              <div class="reg-info pull-left">
                <div class="js-re-register-container">

                  <form action="javascript:void(0);" id="jsRegisterForm" class="js-re-registerForm form-horizontal">

                    <div class="control-group">
                      <div class="controls">
                        <div class="input-prefix">
                          <div class="name-icon"></div>
                        </div>
                        <input type="text" class="js-re-userName" name="userName" placeholder="输入用户名" autocomplete="off" />
                        <div>
                          <span class="help-inline js-re-verify-username">*4-16个字符，支持英文和数字，不能以数字开头</span>
                        </div>
                        <input type="hidden" class="js-re-username-val-res" value="1">
                      </div>
                      <div class="controls">
                        <span class="js-re-name-tip text-danger form-control hidden"></span>
                      </div>
                    </div>
                    <div class="control-group">
                      <div class="controls">
                        <div class="input-prefix">
                          <div class="password-icon"></div>
                        </div>
                        <input type="password" id="jsRELoginPassword" name="loginPwd" placeholder="输入密码" autocomplete="off">

                        <div>
                          <span class="help-inline js-re-verify-password">6-20位字符组成（不含空格），区分大小写，不能是9位以下的纯数字</span>
                        </div>
                        <input type="hidden" class="js-re-password-val-res" value="1">
                      </div>
                    </div>
                    <div class="js-login-valRegion m-bottom-sm clearfix control-group">
                      <div class="controls">
                        <div class="input-prefix">
                          <div class="validation-icon"></div>
                        </div>
                        <input type="text" class="js-re-valCode input-block-level input-varCode" placeholder="输入验证码" name="" maxlength="4">
                        <input type="hidden" class="js-re-valCode-val-res" value="1">
                        <img class="js-re-valImg var-code ">

                        <div style="height:20px;">
                          <span class=" js-re-valCode-val-des"></span>
                        </div>
                      </div>
                    </div>
                    <div class="js-promise-check-valRegion m-bottom-sm clearfix control-group promise-check-valRegion">
                      <div class="inline-block checkbox-container">
                        <input type="checkbox" class="js-promise-check input-block-level" checked>
                        <label></label>
                      </div>
                      <div class="inline-block">
                        <span class="promise-hint">*我确定我已年满18岁，并已阅读和接受</span>
                        <a class="js-promise-open promise-link">无限娱乐平台的政策及隐私声明协议</a>
                        <span class="promise-hint">。</span>
                      </div>
                      <div style="height:20px;margin-left: 24px;">
                        <span class="js-promise-check-val-des"></span>
                      </div>
                    </div>

                    <div class="control-group">
                      <div class="controls">
                        <button class="js-re-register-submit btn btn-cool ac-reg-button" data-loading-text="保存中">立即注册</button>
                        <a class="highlight-link" href="/login.html">已有账号? 立即登录?</a>
                      </div>
                    </div>
                    <div class="js-re-notice">
                    </div>
                    <input type="hidden" class="js-re-linkId" name="linkId">
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="tutorial"></div>
        </div>
        <div class="next-btn js-move-down"></div>
      </div>
      <div class="section" id="section2">
        <div class="vertical-center">
          <div class="section-header"></div>
          <div class="section-content"></div>
        </div>
        <div class="next-btn js-move-down"></div>
      </div>
      <div class="section" id="section3">
        <div class="vertical-center">
          <div class="section-header"></div>
          <div class="section-content"></div>
        </div>
        <div class="next-btn js-move-down"></div>
      </div>
      <div class="section" id="section4">
        <div class="vertical-center">
          <div class="section-header"></div>
          <div class="section-content"></div>
        </div>
        <div class="next-btn js-move-down"></div>
      </div>
      <div class="section" id="section5">
        <div class="section-header"></div>
        <div class="section-content"></div>
        <div class="register-footer">
          <div class="footer-content"></div>
        </div>
      </div>
    </div>
    <div class="js-promise-mask promise-mask hidden">
      <div class="promise-container">
        <div class="promise-reg"></div>
        <div class="promise-hr"></div>
        <div class="promise-content">
          <p>一、 为避免于本网站投注时之争议，所有用户请务必于进入无限娱乐网站前详阅无限娱乐所定之各项规则，客户一旦进入无限娱乐时，即被视为已接受无限娱乐的所有协议与规则。</p>
          <p>二、 请定期修改自己的登录密码及资金密码，会员有责任确保自己的帐户以及登入资料的保密性，以会员帐号及密码进行的任何网上投注，将被视为有效。敬请不定时做密码变更之动作。若帐号密码被盗用，进行的投注，无限娱乐一概不负赔偿责任。</p>

          <p>三、 投注相关条款：①网上投注如未能成功提交，投注将被视为无效。②凡玩家于开奖途中且尚无结果前自动或强制断线时，并不影响开奖结算之结果。③若遇官网未开奖或开奖结果错误，本平台将根据实际情况做退奖退买处理；④如遇发生不可抗拒之灾害，骇客入侵，网络问题造成数据丢失的情况，以平台公告为最终方案。⑤无限娱乐将会对所有的电子交易进行记录，如有任何争议，本公司将会以注单记录为准。</p>

          <p>四、 若经本公司发现会员以不正当手法<利用外挂程式>进行投注或以任何非正常方式进行的个人、团体投注有损公司利益之投注情事发生，本公司保留权利取消该类注单以及注单产生的收益，并停用该会员帐号。无论代理还是会员，发现漏洞隐瞒不报，利用漏洞恶意刷钱、通过非法手段作弊、或造谣污蔑，攻击平台者，经平台核实后一律无条件永久冻结账号处理，账号所有金钱概不退还。另外，所有会员参与平台的活动时，投注彩票类游戏时不可超过总注数的70%。</p>

          <p>五、 若无限娱乐发现会员有重复申请帐号行为时，保留取消、收回会员所有优惠，以及优惠所产生的盈利权利。每位玩家、每一住址、每一电子邮箱、每一电话号码、相同支付卡/信用卡号码，以及共享电脑环境 (例如:网吧、其他公共用电脑等)只能够拥有一个会员帐号，各项优惠只适用于每位客户在本公司唯一的帐户。</p>

          <p>六、 本平台高频彩种每期最高奖金限额400000.00元，超出按400000.00元计算，超出的奖金无效并清0。</p>

          <p>七、 单挑奖金限额50,000元，超出限额的奖金不予发放。单挑模式说明：理论中奖金额大于投注本金99倍的订单即为单挑模式。玩法及注数包括：【高频时时彩以及低频彩系列】[五星直选]1000注包含以内，[四星直选]100注包含以内，[四星组选24]4注包含以内，[四星组选12]8注包含以内，[四星组选6]16注包含以内，[四星组选4]25注包含以内，[三星直选]10注包含以内，[三星直选和值]10注包含以内，[三星组六]1注，[三星组三]3注包含以内，[组选和值]2注包含以内，[二星直选]1注，[二星直选和值]1注。【高频PK10以及11选5系列】[前二玩法]1注，[前三玩法]10注包含以内，[任选五中五]以及[任选五中五胆拖]5注包含以内等。同一IP地址包括共享电脑环境(如网吧等)、多帐号投注，每期单挑盈利奖金视为同一会员投注。</p>

          <p>八、 平台取款时间为上午10:00-凌晨02:00，其他时间提款不排除会出现延误情况，并与提款银行维护等特殊情况有关；平台每日最多提款30次，单笔最低提款100元，单笔最高50000元，超过次数的提现将收取1%的手续费，最高为50元。</p>

          <p>九、 为了防止有人恶意洗钱，会员提款必须要消费充值的20%方可进行，真人类娱乐需消费1倍流水才可出款，否则财务不予受理。</p>

          <p>十、 平台客服没有任何QQ及其他联系方式，唯一途经点击菜单栏客服热线跳转至在线客服，其他均为假冒，请牢记，因此类问题上当受骗平台慨不负责。</p>

          <p>十一、 银行转账或支付宝转账等充值账号会不定期更换，请每次充值前务必打开充值界面获取最新收款账号，如自己充错造成的任何损失自由承担，与平台无关。</p>

          <p>十二、 无限娱乐保留不定时修改或增加本协定或游戏规则或保密条例等的操作权利，更改条款将从更改发生后立即生效，并保留一切有争议事项及最后的决策权。</p>
        </div>
        <button class="js-promise-close btn btn-cool ac-reg-button">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'register',
    data(){
      return{

      }
    },
    methods:{

    }
  }
</script>
<style lang="scss" scoped>
  $main-light-color: #1ba1b5 !default;
  $main-border-color: #007e90 !default;
  $input-placeholder: #0297ad !default;

  .reg-ad{
    display:inline-block;
    width: 332px;
    float: none;
    position: absolute;
    top: 50%;
    right: 40px;
    transform: translateY(-50%);
  }

  .ac-reg-pic{
    width: 322px;
    // height: 390px;
    // margin: 3px 25px 0 25px;
    border: 5px solid #00b4b9;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .panel {
    margin: 0 auto;
    width: 960px;
    height: 470px;
    box-shadow: 0px 6px 10px 0px #d3d3d3;
    border-radius: 5px;
    top: 54%;
    transform: translateY(-50%);
    margin-top: -120px;

    .download-link {
      background: url('images/download-link.png');
      width: 178px;
      height: 45px;
      position: absolute;
      top: -52px;
      right: 0px;
      display: inline-block;
    }

    .panel-reg {
      background: url('images/reg.png');
      position: absolute;
      width: 162px;
      height: 89px;
      top: -8px;
      left: -7px;
    }
    .ac-reg-body{

      .reg-info{
        display: inline-block;
        width: 560px;
        position: absolute;
        top: 53%;
        left: 0px;
        transform: translateY(-50%);
        .control-label {
          font-size: 16px;
        }
      }

      .highlight-link {
        color: #fa5c56;
        text-decoration: underline;
        font-size: 14px;
        transform: translate(4px,18px);
        display: inline-block;
      }

      .control-group {
        margin-bottom: 30px;
        height: 50px;
        position: relative;
        .input-prefix {
          position: absolute;
          top: 0;
          left: 71px;
          border: 1px solid #d8d9d9;
          border-right: none;
          border-radius: 0;
          border-top-left-radius: 5px;
          border-bottom-left-radius: 5px;
          background: #fbfbfb;
          width: 48px;
          height: 48px;

          .name-icon {
            background: url('images/name-icon.png');
            width: 21px;
            height: 22px;
            margin: 13px auto 0;
          }

          .password-icon {
            background: url('images/password-icon.png');
            width: 19px;
            height: 22px;
            margin: 13px auto 0;
          }

          .validation-icon {
            background: url('images/validation-icon.png');
            width: 19px;
            height: 20px;
            margin: 14px auto 0;
          }
        }
        .val-img-times {
          line-height: 17px;
          margin-top: 4px;
        }
        .val-img-check{
          line-height: 17px;
          margin-top: 4px;
        }
      }

      ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
        color: #d8d9d9;
      }
      ::-moz-placeholder { /* Firefox 19+ */
        color: #d8d9d9;
      }
      :-ms-input-placeholder { /* IE 10+ */
        color: #d8d9d9;
      }
      :-moz-placeholder { /* Firefox 18- */
        color: #d8d9d9;
      }

      input {
        width: 325px;
        height: 50px;
        border: 1px solid #dfdfdf;
        line-height: 50px;
        border-radius: 5px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        font-size: 14px;
        box-sizing: border-box;
        box-shadow: inset -4px 11px 4px -10px #d8d9d9;
        transition: all .3s;
        padding: 4px 12px;
        &:focus, &:active {
          box-shadow: inset -4px 9px 4px -10px #d8d9d9;
        }
      }

      .checkbox-container {
        width: 25px;
        height: 25px;
      }

      input[type='checkbox'] {
        width: 20px;
        height: 20px;
        outline: none;
        box-shadow: none;
        opacity: 0;
        position: absolute;
        z-index: 2;

        & + label {
          background: url('images/check-off.png');
          width: 16px;
          height: 16px;
          transform: translate(0px, 12px);
        }

        &:checked + label {
          background: url('images/checked.png');
          width: 19px;
          height: 17px;
          transform: translate(-1px, 10px);
        }
      }

      .promise-hint {
        color: #666;
        letter-spacing: -1px;
      }

      .promise-link {
        color: #00ced4;
        margin-left: -3px;
        letter-spacing: -1px;
        text-decoration: underline;
        cursor: pointer;
      }

      .promise-check-valRegion {
        margin-left: 72px;
        margin-top: 48px;
      }

      .help-inline {
        font-size: 12px;
        color: #666;
      }
      .input-varCode {
        // border: 1px solid darkgray;
        // border-radius: 4px;
        // height: 32px;
        // width: 161px;
        // padding-top: 4px;
        // padding-bottom: 4px;
      }
      .var-code {
        background-color: #eceff4;
        height: 35px;
        width: 70px;
        border: 1px solid #888;
        transform: translateX(-85px);
      }
      .ac-reg-button{
        width: 260px;
        height: 50px;
        border-radius: 4px;
        background: linear-gradient(to bottom, #00d3d8, #00bbc0);
        font-size: 16px;
        color: white;
      }

    }
  }



  .ac-reg-code-lan-width{
    width: 170px;
  }
  .ac-reg-code-left-width{
    width: 75px;
  }


  .header-login {
    font-size: 16px;
    float: right;
    margin-top: 14px;
    margin-right: 20px;
  }

  #fullpage {
    transition: opacity 1s;

    .panel-main {
      margin-top: 0;
      height: 100%;
    }
  }

  #section1, #section2, #section3, #section4, #section5 {
    background: url(images/section-bg.png) no-repeat;
    background-size: 100% 100%;
    position: relative;

    & .vertical-center {
      position: relative;
      top: 47%;
      transform: translateY(-50%);
    }
    & .section-header {
      position: relative;
      margin: 0 auto;
      transform: translateY(90px);
      opacity: 0;
      transition: opacity .5s;
      &.active {
        animation: show .8s ease forwards;
      }
    }
    & .section-content {
      position: relative;
      margin: 0 auto;
      left: 0;
      right: 0;
    }
  }

  #section1 {

    .tutorial {
      background: url('images/tutorial.png');
      width: 896px;
      height: 83px;
      margin: 0px auto;
      position: absolute;
      bottom: -125px;
      left: 0;
      right: 0;
    }
  }


  @keyframes show {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }

  @keyframes fadeRightIn {
    0%{
      transform: translateX(50px);
      opacity: 0;
    }
    100%{
      transform: translateX(0px);
      opacity: 1;
    }
  }

  #section2 {
    .section-header {
      background: url('images/section-2-header.png');
      width: 1099px;
      height: 180px;

    }
    .section-content {
      background: url('images/section-2-content.png');
      width: 1095px;
      height: 457px;
      margin-top: 60px;
      opacity: 0;
      transform: translateX(50px);

      &.active {
        animation: fadeRightIn .8s ease .3s forwards;
      }
    }
  }

  @keyframes fadeTopIn {
    0%{
      transform: translateY(-50px);
      opacity: 0;
    }
    100%{
      transform: translateY(0px);
      opacity: 1;
    }
  }

  #section3 {
    .section-header {
      background: url('images/section-3-header.png');
      width: 1099px;
      height: 182px;
    }
    .section-content {
      background: url('images/section-3-content.png');
      width: 1202px;
      height: 504px;
      margin-top: 70px;
      transform: translateY(-50px);
      opacity: 0;

      &.active {
        animation: fadeTopIn .8s ease .3s forwards;
      }
    }
  }

  @keyframes fadeBottomIn {
    0%{
      transform: translateY(50px);
      opacity: 0;
    }
    100%{
      transform: translateY(0px);
      opacity: 1;
    }
  }
  #section4 {
    .section-header {
      background: url('images/section-4-header.png');
      width: 1265px;
      height: 180px;
    }
    .section-content {
      background: url('images/section-4-content.png');
      width: 1347px;
      height: 495px;
      margin-top: 150px;
      transform: translateY(50px);
      opacity: 0;

      &.active {
        animation: fadeBottomIn .8s ease .3s forwards;
      }
    }
  }

  #section5 {
    .section-header {
      background: url('images/section-5-header.png');
      width: 1099px;
      height: 180px;
      transform: translateY(60px);
    }
    .section-content {
      background: url('images/section-5-content.png');
      width: 807px;
      height: 294px;
      margin-top: 110px;
      opacity: 0;

      &.active {
        animation: show .8s ease .3s forwards;
      }
    }
  }

  .register-header {
    background: url('images/header-bg.png');
    position: relative;
    width: 100%;
    height: 85px;
    background-size: cover;

    & .header-container {
      padding-top: 10px;
      width: 1100px;
      margin: 0 auto;
    }

    & .register-logo {
      background: url('images/register-logo.png');
      width: 223px;
      height: 58px;
    }
  }

  .register-footer {
    background: #5e5f66;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 138px;
    padding-top: 20px;

    & .footer-content {
      background: url('images/footer-content.png');
      width: 854px;
      height: 98px;
      margin: 0 auto;
    }
  }

  .opacity-0 {
    opacity: 0;
  }

  #fp-nav ul,
  .fp-slidesNav ul {
    margin: 28px 0px 68px;;
    padding: 0;

    li {
      display: block;
      width: 14px;
      height: 13px;
      margin: 24px 16px;
      position: relative;

      a {
        display: block;
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        cursor: pointer;
        text-decoration: none;

        &.active span {
          height: 10px;
          width: 10px;
          margin: -5px 0 0 -5px;
          border-radius: 100%;
          background: #00b4b9;

          #fp-nav ul li:hover &,
          #fp-slidesNav ul li:hover & {
            height: 10px;
            width: 10px;
            margin: -5px 0 0 -5px;
            border-radius: 100%;
          }
        }

        span {
          border-radius: 50%;
          position: absolute;
          z-index: 1;
          height: 10px;
          width: 10px;
          border: 0;
          background: #bdbdbd;
          left: 50%;
          top: 50%;
          margin: -5px 0 0 -5px;
          -webkit-transition: all 0.1s ease-in-out;
          -moz-transition: all 0.1s ease-in-out;
          -o-transition: all 0.1s ease-in-out;
          transition: all 0.1s ease-in-out;
        }
      }

      &:hover {

        a, a.active {
          span {
            width: 10px;
            height: 10px;
            margin: -5px 0px 0px -5px;
          }
        }
      }

      &:nth-last-child(1) {
        width: 15px;
        &::after {
          content: '';
          width: 22px;
          height: 38px;
          background: url('images/mouse.png');
          position: absolute;
          transform: translate(-3px, 13px);
        }
      }

    }
  }

  #fp-nav {
    position: fixed;
    z-index: 100;
    margin-top: -32px;
    top: 50%;
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    &.right {
      right: 35px;
      background: #f1f1f1;
      border: 1px solid #d2d2d2;
      border-radius: 35px;
    }
    &.left {
      left: 17px
    }
    .mouse {
      // background: url('./mouse.png');
      width: 28px;
      height: 39px;
      display: block;
      background-size: contain;
    }
    .fa {
      margin-left: 6px;
      color: #333;
      font-size: 24px;
    }
    ul {
      li {
        .fp-tooltip {
          position: absolute;
          top: -2px;
          color: #fff;
          font-size: 14px;
          font-family: arial, helvetica, sans-serif;
          white-space: nowrap;
          max-width: 220px;
          overflow: hidden;
          display: block;
          opacity: 0;
          width: 0;

          &.right {
            right: 20px;
          }

          &.left {

          }
        }
        &:hover {
          .fp-tooltip {
            -webkit-transition: opacity 0.2s ease-in;
            transition: opacity 0.2s ease-in;
            width: auto;
            opacity: 1;
          }
        }
      }
    }
    &.fp-show-active a.active + .fp-tooltip {
      -webkit-transition: opacity 0.2s ease-in;
      transition: opacity 0.2s ease-in;
      width: auto;
      opacity: 1;
    }
  }


  .loading img {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    transform: translateY(-50%);
    margin: 0 auto;
  }


  .promise-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    z-index: 101;

    .promise-container {
      position: relative;
      top: 20%;
      width: 800px;
      height: 530px;
      max-height: 530px;
      border-radius: 10px;
      border: 1px solid #e0e0e0;
      padding: 0 20px 20px;
      margin: 0 auto;
      background: white;

      .promise-reg {
        background: url('images/promise-reg.png');
        width: 289px;
        height: 47px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: -9px;
      }
      .promise-hr {
        border-bottom: 1px solid;
        width: 425px;
        color: #d8d8d8;
        height: 1px;
        margin: 70px auto 32px;
      }

      .promise-content {
        color: #666;
        height: 370px;
        overflow-y: scroll;
        letter-spacing: 1px;
        line-height: 38px;
        font-size: 14px;
      }

      .ac-reg-button{
        width: 210px;
        height: 50px;
        border-radius: 4px;
        background: linear-gradient(to bottom, #00d3d8, #00bbc0);
        font-size: 16px;
        color: white;
        margin: 10px auto;
        display: block;
      }
    }
  }

  .next-btn {
    background: url('images/next-btn.png');
    width: 46px;
    height: 41px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: 25px;
    cursor: pointer;
    animation: infinite-move 1.5s infinite linear forwards;
  }

  @keyframes infinite-move{
    0% {
      transform:translateY(0);
    }

    50% {
      transform:translateY(20%);
    }
    100% {
      transform:translateY(0);
    }
  }
</style>
