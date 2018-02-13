<template>
  <div>
    <div class="loading" v-show="loading">
      <img src="../download/images/wx/loading.gif" width="150" height="150">
    </div>
    <div v-show="!loading">
      <div class="register-header">
        <div class="header-container">
          <div class="pull-left">
            <div class="register-logo"></div>
            <span class="title">欢迎您的加入</span>
          </div>
          <div class="pull-right down-btn">
            <span class="vertical-top">手机端下载</span>
            <a class="icon android" @click="qrtype !== 1 ? qrtype = 1 : qrtype = 0"></a>
            <a class="icon ios" @click="qrtype !== 2 ? qrtype = 2 : qrtype = 0"></a>
            <div class="qrcode ios" v-show="qrtype === 2">
              <div class="qrimg"></div>
            </div>
            <div class="qrcode android" v-show="qrtype === 1">
              <div class="qrimg"></div>
            </div>
          </div>
          <transition name="redPack">
            <div class="register-red-pack" v-if="showRedPack">
              <div class="line-left"></div>
              <div class="line-right"></div>
              <div class="red-main clearfix">
                <div class="red-title"></div>
                <div class="red-money"><span class="num">{{redPackNum}}</span>元</div>
                <div class="red-time">红包<span class="time">{{redPackTime}}s</span>后失效</div>
              </div>
            </div>
          </transition>
        </div>
      </div>
      <div id="fullpage" class="" ref="fullpage">
        <div class="section " id="section1">
          <div class="panel basic-white">
            <div class="panel-main clearfix">
              <div class="clearfix ac-reg-body">
                <div class="reg-ad pull-right">
                  <div class="banner"></div>
                  <div class="content">
                    <div class="title">新人注册四重壕礼等你领：</div>
                    <div class="line"></div>
                    <div class="text">
                      <p>1、新人专属大礼包，首次充值即返惊喜</p>
                      <p>2、每天投注都有礼，连续三天好礼不断</p>
                      <p>3、新人专属代金券，指定彩种免费娱乐</p>
                      <p>4、新用户完成手机和邮箱认证、绑定银行卡，还有现金奖励</p>
                    </div>
                  </div>
                </div>
                <div class="reg-info pull-left">
                  <form action="javascript:void(0);" id="jsRegisterForm" class="js-re-registerForm form-horizontal">
                    <div class="input-control">
                      <div class="input-icon name"></div>
                      <input type="text" class="register-input" name="userName" v-model.trim="userName"
                             @focus="inputFocus(1)" @blur="inputBlur(1)"
                             placeholder="请设置您的账号" autocomplete="off"/>
                      <span class="input-check" v-if="userStatus === 3"></span>
                    </div>
                    <div :class="['error-text',{'text-hot': userStatus === 2}]">
                    <span
                      :class="['sfa',{'sfa-error-gray-icon': userStatus === 1 && userErrorText !== '','sfa-error-icon': userStatus === 2 && userErrorText !== ''}]"></span>
                      {{userErrorText}}
                    </div>
                    <div class="input-control">
                      <div class="input-icon pwd"></div>
                      <input type="password" class="register-input" name="userName" v-model.trim="passWord"
                             @focus="inputFocus(2)" @blur="inputBlur(2)"
                             placeholder="请设置您的密码" autocomplete="off"/>
                      <span class="input-check" v-if="pwdStatus === 3"></span>
                    </div>
                    <div :class="['error-text',{'text-hot': pwdStatus === 2}]">
                    <span
                      :class="['sfa',{'sfa-error-gray-icon': pwdStatus === 1 && pwdErrorText !== '','sfa-error-icon': pwdStatus === 2 && pwdErrorText !== ''}]"></span>
                      {{pwdErrorText}}
                    </div>
                    <div class="input-control">
                      <div class="input-icon code"></div>
                      <input type="text" class="register-input code-input" name="userName" v-model.trim="codeVal"
                             @change="codeValVerification" placeholder="请输入验证码" autocomplete="off"/>
                      <img class="var-code" :src="codeSrc" @click="refreshValCode">
                      <span class="input-check" v-if="codeStatus === 3"></span>
                    </div>
                    <div :class="['error-text',{'text-hot': codeStatus === 2}]">
                    <span
                      :class="['sfa',{'sfa-error-gray-icon': codeStatus === 1 && codeErrorText !== '' ,'sfa-error-icon': codeStatus === 2 && codeErrorText !== '' }]"></span>
                      {{codeErrorText}}
                    </div>
                    <div class="m-bottom-sm clearfix width-reg">
                      <div class="pull-left">
                        <custom-checkbox v-model="agree"></custom-checkbox>
                      </div>
                      <span class="promise-hint pull-right">*我确定我已年满18岁，并已阅读和接受<a class="js-promise-open promise-link"
                                                                                  @click="showPromiseDailog">无限娱乐平台的政策及隐私声明协议。</a></span>
                    </div>

                    <div class="text-left m-top-lg">
                      <button class="btn btn-cool ac-reg-btn" :disabled="!agree" @click="register"
                              data-loading-text="保存中">立即注册
                      </button>
                    </div>
                    <div class="width-reg text-center m-top-md">
                    <span class="text-auxiliary">已有账号?<a class="text-inverse m-left-xs"
                                                         href="/index.html">请登录</a></span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="tutorial">
            <div class="tutorial-title inline-block">新手引导</div>
            <div class="tutorial-arrow"></div>
            <div class="tutorial-text tutorial-one">
              <span class="text">注册账号</span>
            </div>
            <div class="tutorial-arrow"></div>
            <div class="tutorial-text tutorial-two">
              <span class="text">登录平台享新手优惠</span>
            </div>
            <div class="tutorial-arrow"></div>
            <div class=" tutorial-text tutorial-three">
              <span class="text">下载手机端畅玩无限</span>
            </div>
          </div>
          <div class="next-btn js-move-down" @click="moveSectionDown"></div>
        </div>
        <div class="section" id="section2">
          <div class="vertical-center">
            <div class="section-header">
              <div class="title">五年耕耘，品牌至上</div>
              <div class="line"></div>
              <div class="sub-title">新力量，最具潜力的娱乐平台</div>
            </div>
            <div class="section-content clearfix">
              <div class="pull-left left">
                <div class="m-top-lg">
                  <p class="p-one">凭借尖端前沿的技术实力与行业信誉度，始终坚持将<span class="font-md text-cool">用户体验放在第一</span>，</p>
                  <p>历经五年成长，无限娱乐一路高歌猛进，</p>
                  <p>现已成为东南亚地区最具竞争力和行业潜力的娱乐品牌。</p>
                </div>
                <div class="m-top-lg">
                  <p class="p-one">无限娱乐已经成为东南亚地区最佳彩票运营专家级平台，</p>
                  <p>并将于2017年正式开放 <span class="font-md text-cool">“真人、捕鱼、体育、电子游艺”</span>等业务体系，</p>
                  <p>通过良好的口碑和关系网，</p>
                  <p>无限娱乐正致力打造成为亚洲最佳的在线娱乐平台。</p>
                </div>
              </div>
              <div class="pull-right right"></div>
            </div>
          </div>
          <div class="next-btn js-move-down" @click="moveSectionDown"></div>
        </div>
        <div class="section" id="section3">
          <div class="vertical-center">
            <div class="section-header">
              <div class="title">你想要的，这里都有</div>
              <div class="line"></div>
              <div class="sub-title">玩法更新最快，平台衔接最稳</div>
            </div>
            <div class="section-content">
              <div :class="['game-info',{'active': gameIndex === 1}]" @mouseover="gameHover(1)" @mouseout="startGameChange">
                <div class="game-logo one"></div>
                <div class="game-title">彩票平台</div>
                <div class="game-text">
                  <ul>
                    <li>重庆时时彩</li>
                    <li>PK10</li>
                    <li>11选5</li>
                    <li>快乐彩</li>
                  </ul>
                </div>
              </div>
              <div :class="['game-info',{'active': gameIndex === 2}]" @mouseover="gameHover(2)" @mouseout="startGameChange">
                <div class="game-logo two"></div>
                <div class="game-title">真人视讯</div>
                <div class="game-text">
                  <ul>
                    <li>AG真人</li>
                    <li>Ebet真人</li>
                    <li>Bbin真人</li>
                  </ul>
                </div>
              </div>
              <div :class="['game-info',{'active': gameIndex === 3}]" @mouseover="gameHover(3)" @mouseout="startGameChange">
                <div class="game-logo three"></div>
                <div class="game-title">电子游戏</div>
                <div class="game-text">
                  <ul>
                    <li>MG老虎机</li>
                    <li>PT老虎机</li>
                  </ul>
                </div>
              </div>
              <div :class="['game-info',{'active': gameIndex === 4}]" @mouseover="gameHover(4)" @mouseout="startGameChange">
                <div class="game-logo four"></div>
                <div class="game-title">捕鱼游戏</div>
                <div class="game-text">
                  <ul>
                    <li>AG捕鱼</li>
                    <li>GG捕鱼</li>
                  </ul>
                </div>
              </div>
              <div :class="['game-info',{'active': gameIndex === 5}]" @mouseover="gameHover(5)" @mouseout="startGameChange">
                <div class="game-logo five"></div>
                <div class="game-title">体育平台</div>
                <div class="game-text">
                  <ul>
                    <li>沙巴体育</li>
                    <li>188体育</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="next-btn js-move-down" @click="moveSectionDown"></div>
        </div>
        <div class="section" id="section4">
          <div class="vertical-center">
            <div class="section-header">
              <div class="title">在手机上也可以娱乐</div>
              <div class="line"></div>
              <div class="sub-title">买大买小，投多投少，无限想象</div>
            </div>
            <div class="section-content">
              <div class="btn-list">
                <div class="info">
                  <span class="icon windows"></span>
                  <span class="">PC客户端</span>
                </div>
                <div class="info">
                  <span class="icon web-phone"></span>
                  <span class="">手机网页版</span>
                </div>
                <div class="info">
                  <span class="icon apple"></span>
                  <span class="">苹果手机</span>
                </div>
                <div class="info">
                  <span class="icon android"></span>
                  <span class="">安卓手机</span>
                </div>
              </div>
              <div class="content">
                <div class="phone"></div>
                <div class="hand"></div>
                <div class="banner">
                  <swiper :options="swiperOption" ref="myPhoneSwiper">
                    <swiper-slide v-for="(item, i) in phoneBannerCfg" :key="i">
                        <img :src="item.url"/>
                    </swiper-slide>
                  </swiper>
                </div>
              </div>
            </div>
          </div>
          <div class="next-btn js-move-down" @click="moveSectionDown"></div>
        </div>
        <div class="section" id="section5">
          <div class="section-header">
            <div class="title">玩家至上，安心畅快</div>
            <div class="line"></div>
            <div class="sub-title">有实力，最受信任的游戏平台</div>
          </div>
          <div class="section-content">
            <div class="info-list">
              <div :class="['info', 'one', {'active': fiveIndex === 1}]" @mouseover="fiveIndex = 1">
                <div class="logo"></div>
                <div class="title">安全稳定，严密防护</div>
                <div class="sub-title">128位银行级加密，百万级服务器架构</div>
              </div>
              <div :class="['info', 'two', {'active': fiveIndex === 2}]" @mouseover="fiveIndex = 2">
                <div class="logo"></div>
                <div class="title">原创自主研发，应变更灵活</div>
                <div class="sub-title">
                  <p>每位用户的需求，我们都可以实现</p>
                  <p>私人定制更简单</p>
                </div>
              </div>
              <div :class="['info', 'three', {'active': fiveIndex === 3}]" @mouseover="fiveIndex = 3">
                <div class="logo"></div>
                <div class="title">积分体系，让利回馈</div>
                <div class="sub-title">
                  <p>用积分换手机、话费、夺宝等</p>
                  <p>有积分就有丰厚的回报</p>
                </div>
              </div>
              <div :class="['info', 'four', {'active': fiveIndex === 4}]" @mouseover="fiveIndex = 4">
                <div class="logo"></div>
                <div class="title">充提稳固，分秒必达</div>
                <div class="sub-title">
                  <p>转账、网银、微信、支付宝、到账更快捷</p>
                  <p>提款迅速，5分钟到账</p>
                </div>
              </div>
            </div>
          </div>
          <div class="register-footer">
            <footer-copyright></footer-copyright>
          </div>
        </div>
      </div>
    </div>
    <div class="js-promise-mask promise-mask " v-show="showPromise">
      <div class="promise-container">
        <div class="promise-reg">无限娱乐政策声明及用户协议</div>
        <div class="promise-hr"></div>
        <div class="promise-content">
          <p>一、 为避免于本网站投注时之争议，所有用户请务必于进入无限娱乐网站前详阅无限娱乐所定之各项规则，客户一旦进入无限娱乐时，即被视为已接受无限娱乐的所有协议与规则。</p>
          <p>
            二、 请定期修改自己的登录密码及资金密码，会员有责任确保自己的帐户以及登入资料的保密性，以会员帐号及密码进行的任何网上投注，将被视为有效。敬请不定时做密码变更之动作。若帐号密码被盗用，进行的投注，无限娱乐一概不负赔偿责任。</p>

          <p>
            三、 投注相关条款：①网上投注如未能成功提交，投注将被视为无效。②凡玩家于开奖途中且尚无结果前自动或强制断线时，并不影响开奖结算之结果。③若遇官网未开奖或开奖结果错误，本平台将根据实际情况做退奖退买处理；④如遇发生不可抗拒之灾害，骇客入侵，网络问题造成数据丢失的情况，以平台公告为最终方案。⑤无限娱乐将会对所有的电子交易进行记录，如有任何争议，本公司将会以注单记录为准。</p>

          <p>四、 若经本公司发现会员以不正当手法
            <利用外挂程式>
              进行投注或以任何非正常方式进行的个人、团体投注有损公司利益之投注情事发生，本公司保留权利取消该类注单以及注单产生的收益，并停用该会员帐号。无论代理还是会员，发现漏洞隐瞒不报，利用漏洞恶意刷钱、通过非法手段作弊、或造谣污蔑，攻击平台者，经平台核实后一律无条件永久冻结账号处理，账号所有金钱概不退还。另外，所有会员参与平台的活动时，投注彩票类游戏时不可超过总注数的70%。
          </p>

          <p>
            五、 若无限娱乐发现会员有重复申请帐号行为时，保留取消、收回会员所有优惠，以及优惠所产生的盈利权利。每位玩家、每一住址、每一电子邮箱、每一电话号码、相同支付卡/信用卡号码，以及共享电脑环境 (例如:网吧、其他公共用电脑等)只能够拥有一个会员帐号，各项优惠只适用于每位客户在本公司唯一的帐户。</p>

          <p>六、 本平台高频彩种每期最高奖金限额400000.00元，超出按400000.00元计算，超出的奖金无效并清0。</p>

          <p>
            七、 单挑奖金限额50,000元，超出限额的奖金不予发放。单挑模式说明：理论中奖金额大于投注本金99倍的订单即为单挑模式。玩法及注数包括：【高频时时彩以及低频彩系列】[五星直选]1000注包含以内，[四星直选]100注包含以内，[四星组选24]4注包含以内，[四星组选12]8注包含以内，[四星组选6]16注包含以内，[四星组选4]25注包含以内，[三星直选]10注包含以内，[三星直选和值]10注包含以内，[三星组六]1注，[三星组三]3注包含以内，[组选和值]2注包含以内，[二星直选]1注，[二星直选和值]1注。【高频PK10以及11选5系列】[前二玩法]1注，[前三玩法]10注包含以内，[任选五中五]以及[任选五中五胆拖]5注包含以内等。同一IP地址包括共享电脑环境(如网吧等)、多帐号投注，每期单挑盈利奖金视为同一会员投注。</p>

          <p>
            八、 平台取款时间为上午10:00-凌晨02:00，其他时间提款不排除会出现延误情况，并与提款银行维护等特殊情况有关；平台每日最多提款30次，单笔最低提款100元，单笔最高50000元，超过次数的提现将收取1%的手续费，最高为50元。</p>

          <p>九、 为了防止有人恶意洗钱，会员提款必须要消费充值的20%方可进行，真人类娱乐需消费1倍流水才可出款，否则财务不予受理。</p>

          <p>十、 平台客服没有任何QQ及其他联系方式，唯一途经点击菜单栏客服热线跳转至在线客服，其他均为假冒，请牢记，因此类问题上当受骗平台慨不负责。</p>

          <p>十一、 银行转账或支付宝转账等充值账号会不定期更换，请每次充值前务必打开充值界面获取最新收款账号，如自己充错造成的任何损失自由承担，与平台无关。</p>

          <p>十二、 无限娱乐保留不定时修改或增加本协定或游戏规则或保密条例等的操作权利，更改条款将从更改发生后立即生效，并保留一切有争议事项及最后的决策权。</p>
        </div>
        <button class="js-promise-close btn btn-cool ac-reg-button" @click="showPromiseDailog">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    checkNameExistApi,
    registerApi,
    getBannerADApi,
    sendLinkViewApi,
    checkLinkTypeApi,
    recieveRedpackApi
  } from 'api/register'
  import {valCodeXhr} from 'api/resetPwd'
  import 'swiper/dist/css/swiper.css'
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import FooterCopyright from "../../components/footer/index.vue";
  export default {
    name: 'register',
    components: {
      FooterCopyright,
      swiper,
      swiperSlide
    },
    data(){
      return {
        loading: true,
        url: window.self.location.toString(),
        codeUrl: '',
        codeSrc: '',
        linkId: '',
        userStatus: 1, // 1代表不显示错误提示  2表示显示错误  3表示验证成功
        userErrorText: '',
        pwdStatus: 1,
        pwdErrorText: '',
        codeStatus: 1,
        codeErrorText: '',
        userName: '',
        passWord: '',
        codeVal: '',
        agree: false,
        showPromise: false,
        swiperOption: {
          slidesPerView: 1,
          spaceBetween: 10,
          loop: true,
          centeredSlides: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
        },
        gameIndex:1,
        fiveIndex:0,
        phoneBannerCfg:[
          {
            url:require('./images/section-4-banner1.png')
          },
          {
            url:require('./images/section-4-banner2.png')
          },
          {
            url:require('./images/section-4-banner3.png')
          }
        ],
        redPackNum:0,
        showRedPack:false,
        redPackTime:60,
        qrtype: 0
      }
    },
    methods: {
      init(){
        $(this.$refs.fullpage).fullpage({
          verticalCentered: false,
          css3: true,
          navigation: true,
          loopBottom: true,
          afterLoad: (anchorLink, index) => {
            const selectorHeader = `#section${index} .section-header`
            const selectorContent = `#section${index} .section-content`
            $(selectorHeader).addClass('active')
            $(selectorContent).addClass('active')
            if(index === 3){
              this.startGameChange()
            }
          },

          onLeave: (index, nextIndex, direction) => {
            const selectorHeader = `#section${index} .section-header`
            const selectorContent = `#section${index} .section-content`
            $(selectorHeader).removeClass('active')
            $(selectorContent).removeClass('active')
            this.clearGameChange()
          },
        })
      },
      startGameChange(){
        this.gameInterval = setInterval(() => {
          const index = this.gameIndex + 1
          this.gameIndex = index > 5 ? 1 : index
        }, 3000)
      },
      clearGameChange(){
        clearInterval(this.gameInterval)
      },
      inputFocus(type){
        if (type === 1) {
          if (this.userStatus !== 2) {
            this.userErrorText = '4-16个字符，支持中英文和数字,不能以数字开头'
          }
        } else if (type === 2) {
          if (this.pwdStatus !== 2) {
            this.pwdErrorText = '6-20位字符组成（不含空格），区分大小写，不能是9位以下的纯数字'
          }
        }
      },
      inputBlur(type){
        if (type === 1) {
          this.checkNameExist()
        } else if (type === 2) {
          this.valPassword()
        } else {

        }
      },
      checkNameExist(){
        if (this.userName === '') {
          this.userStatus = 2
          this.userErrorText = '用户名不能为空'
          return false
        }
        const myReg = /^[A-Za-z][A-Za-z0-9]{3,15}$/
        if (!myReg.test(this.userName)) {
          this.userStatus = 2
          this.userErrorText = '仅支持4-16位字母和数字，不能以数字开头'
          return false
        }
        checkNameExistApi({username: this.userName},
          ({data}) => {
            if (data && data.result === 0) {
              this.userStatus = 3
              this.userErrorText = ''
            } else {
              this.userStatus = 2
              if (data.msg === 'invalid user token') {
                this.userErrorText = '操作异常，请清除浏览器缓存'
              } else {
                this.userErrorText = data.msg === 'fail' ? '校验用户名失败' : data.msg
              }
            }
          },
          ({data}) => {
            this.userStatus = true
            this.userErrorText = data.msg === 'fail' ? '校验用户名失败' : data.msg
          }
        )
      },
      valPassword(){
        if (this.passWord === '') {
          this.pwdErrorText = '登录密码不能为空'
          this.pwdStatus = 2
          return false
        }
        let validationStatus = true
        const pwReg = /^[0-9a-zA-Z\~\!\@\#\$\%\^&\*\(\)\-\=\_\+\[\]\{\}\\\|\;\'\:\"\,\.\<\>\/\?]{6,20}$/
        if (this.passWord.length < 9 && this.strBetweenIsNumber(this.passWord, 0, 7)) {
          validationStatus = false
        } else if (!pwReg.test(this.passWord)) {
          validationStatus = false
        }

        if (validationStatus) {
          this.pwdErrorText = ''
          this.pwdStatus = 3
          return true
        }
        this.pwdErrorText = '密码为6-20位字符组成（不含空格），区分大小写，不能是9位以下的纯数字'
        this.pwdStatus = 2
        return false
      },
      codeValVerification(){
        if (this.codeVal !== '' && this.codeVal.length === 4) {
          valCodeXhr({code: this.codeVal},
            ({data}) => {
              if (data && data.result === 0) {
                this.codeStatus = 3
                this.codeErrorText = ''
              } else {
                this.codeStatus = 2
                this.codeErrorText = data.msg === 'fail' ? '验证码输入有误' : data.msg
                this.refreshValCode()
              }
            },
            ({data}) => {
              this.codeStatus = 2
              this.codeErrorText = data.msg === 'fail' ? '验证码输入有误' : data.msg
              this.refreshValCode()
            }
          )
        }
      },
      strBetweenIsNumber (str, star, end) {
        const strArr = str.split('').slice(star, end)
        let isHasNumber = true
        $.each(strArr, (index, item) => {
          if (!$.isNumeric(item)) {
            isHasNumber = false
          }
        })
        return isHasNumber
      },
      refreshValCode(){
        this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
      },
      register(){
        if (this.userName === '' || this.userStatus !== 3) {
          this.userStatus = 2
          this.userErrorText = '仅支持4-16位字母和数字，不能以数字开头'
          return false
        }
        if (!this.valPassword()) {
          return false
        }
        if (this.codeVal === '' || this.codeStatus !== 3) {
          this.codeStatus = 2
          this.codeErrorText = '请输入正确的验证码'
          return false
        }
        registerApi({userName: this.userName, loginPwd: this.passWord, linkId: this.linkId},
          ({data}) => {
            if (data && data.result === 0) {
              window.Global.cookieCache.set('token', data.root.token, 150)
              window.Global.cookieCache.set('loginState', true)
              setTimeout(() => {
                window.location.href = 'index.html'
              }, 2000)
              Global.ui.notification.show('注册成功！')
            } else {
              const btnContent = data.msg === 'fail' ? '确定' : '重新注册'
              Global.ui.notification.show(data.msg === 'fail' ? '注册失败' : data.msg, {
                btnContent,
                event () {
                  window.location.reload()
                },
              })
            }
          },
          ({data}) => {
            Global.ui.notification.show('注册失败！', {
              btnContent: '重新注册',
              event () {
                window.location.reload()
              },
            })
          }
        )
      },
      gameHover(num){
        this.gameIndex = num
        this.clearGameChange()
      },
      moveSectionDown(){
        $.fn.fullpage.moveSectionDown()
      },
      showPromiseDailog(){
        this.showPromise = !this.showPromise
        if(this.showPromise){
          $.fn.fullpage.setAllowScrolling(false)
        }else{
          $.fn.fullpage.setAllowScrolling(true)
        }
      },
      runTime(){
        this.redPackTimeInv = setInterval(() => {
          this.redPackTime -= 1
          if(this.redPackTime < 0){
            clearInterval(this.redPackTimeInv)
            this.showRedPack = false
          }
        }, 1000)
      },
    },
    mounted(){
      setTimeout(() => {
        this.loading = false
        this.init()
      }, 500)
      this.codeUrl = `${this.url.substring(0, this.url.indexOf('/', this.url.indexOf('://', 0) + 3))}/acct/imgcode/code`
      this.codeSrc = `${this.codeUrl}?_t=${_.now()}`
      this.linkId = _.getUrlParam('linkId')
      sendLinkViewApi({linkId: this.linkId})
      checkLinkTypeApi({linkUrl: this.linkId},
        ({data}) => {
          if(data && data.result === 0){
            if(data.root.type === 5){
              recieveRedpackApi({linkId: this.linkId},
                ({data}) => {
                  if(data && data.result === 0 && data.root){
                    this.redPackNum = _(data.root.redpackAmount).convert2yuan()
                    this.showRedPack = true
                    this.runTime()
                  }
                }
              )
            }
          }
        }
      )
    },
  }
</script>
<style lang="scss">
  $main-light-color: #1ba1b5 !default;
  $main-border-color: #007e90 !default;
  $input-placeholder: #0297ad !default;

  .redPack-enter-active{
    animation: jumpDown .8s;
  }
  .redPack-leave-active{
    opacity: 0;
    transform: translateY(-50%);
    transition: all .5s;
  }

  @keyframes jumpDown {
    from{
      opacity: 0;
      transform: translate3d(0, -10%, 0);
    }
    40%,to{
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    70%{
      transform: translate3d(0, -15px, 0);
    }

  }
  .reg-ad {
    display: inline-block;
    width: 332px;
    height: 390px;
    overflow: hidden;
    margin-top: 55px;
    margin-right: 50px;
    .banner{
      width: 340px;
      height: 155px;
      background: url('./images/banner-1.png') no-repeat;
    }
    .title{
      font-size: $font-md;
      margin-top: 20px;
    }
    .line{
      width: 28px;
      height: 3px;
      margin-top: 15px;
      background: $new-main-deep-color;
    }
    .text{
      margin-top: 15px;
      font-size: $font-xs;
    }
  }

  .ac-reg-pic {
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
    width: 1000px;
    height: 546px;
    background-color: $def-white-color;
    box-shadow: 0px 2px 18px 0px rgba(0, 0, 0, 0.05);
    border-radius: 3px;
    position: relative;
    top: 140px;

    .ac-reg-body {

      .reg-info {
        display: inline-block;
        width: 495px;
        height: 461px;
        border-right: 1px solid $im-line-color;
        margin-top: 23px;
        padding-left: 65px;
        padding-top: 39px;
        .control-label {
          font-size: 16px;
        }
      }

      .input-control {
        width: 378px;
        height: 48px;
        background-color: #f9f9f9;
        border-radius: 3px;
        border: solid 1px $im-line-color;
        position: relative;
        .input-icon {
          width: 50px;
          height: 50px;
          display: inline-block;
          &.name {
            background: url("./images/name-icon.png") center no-repeat;
          }
          &.pwd {
            background: url("./images/password-icon.png") center no-repeat;
          }
          &.code {
            background: url("./images/validation-icon.png") center no-repeat;
          }
        }
        .register-input {
          vertical-align: top;
          border: none;
          height: 40px;
          width: 310px;
          &.code-input {
            width: 198px;
          }
        }
        .input-check {
          display: block;
          width: 18px;
          height: 18px;
          background: url("./images/register-check.png") no-repeat;
          position: absolute;
          right: -25px;
          top: 15px;
        }
      }
      .error-text {
        width: 378px;
        height: 40px;
        line-height: 40px;
        .sfa {
          transform: translateY(2px);
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

      .checkbox-container {
        width: 25px;
        height: 25px;
      }

      .promise-hint {
        width: 350px;
        color: $font-auxiliary-color;
        font-size: $font-xs;
      }

      .promise-link {
        color: #00ced4;
        margin-left: -3px;
        letter-spacing: -1px;
        text-decoration: underline;
        cursor: pointer;
      }

      .width-reg {
        width: 378px;
      }
      .help-inline {
        font-size: 12px;
        color: #666;
      }
      .var-code {
        height: 49px;
        width: 110px;
        border-radius: 3px;
        position: absolute;
        top: 0;
        right: 0;
      }
      .ac-reg-btn {
        width: 380px;
        height: 54px;
      }
      .ac-reg-button {
        width: 260px;
        height: 50px;
        border-radius: 4px;
        background: linear-gradient(to bottom, #00d3d8, #00bbc0);
        font-size: 16px;
        color: white;
      }

    }
  }

  .ac-reg-code-lan-width {
    width: 170px;
  }

  .ac-reg-code-left-width {
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
  .section{
    &:nth-of-type(odd){
      background-color: $title-gray;
    }
    &:nth-of-type(even){
      background-color: $def-white-color;
    }
  }
  #section1, #section2, #section3, #section4, #section5 {
    /*background: url(images/section-bg.png) no-repeat;*/
    /*background-size: 100% 100%;*/
    position: relative;
    &:before {
      content: '';
      position: absolute;
      width: 398px;
      height: 248px;
      background: url("./images/bg-left-top.png") no-repeat;
      display: block;
      top: 90px;
      left: 0;
      z-index: 0;
    }
    &:after {
      content: '';
      position: absolute;
      display: block;
      width: 741px;
      height: 411px;
      right: 0;
      bottom: 0;
      background: url("./images/bg-right-down.png") no-repeat;
      z-index: 0;
    }

    & .vertical-center {
      position: relative;
      top: 47%;
      transform: translateY(-50%);
      z-index: 1;
    }
    & .section-header {
      position: relative;
      margin: 0 auto;
      transform: translateY(50px);
      .title {
        font-size: 36px;
        color: $new-main-deep-color;
        width: 100%;
        height: 111px;
        line-height: 111px;
        text-align: center;
        opacity: 0;
      }
      .line {
        width: 112px;
        height: 6px;
        background-color: $new-main-deep-color;
        margin: 0 auto;
        transform: scale(0, 0);
      }
      .sub-title {
        font-size: 24px;
        color: $new-inverse-color;
        margin-top: 37px;
        text-align: center;
        opacity: 0;
      }
      &.active {
        .title {
          animation: fadeBottomIn .5s .5s forwards;
        }
        .sub-title {
          animation: fadeTopIn .5s .5s forwards;
        }
        .line {
          transform: scale(1, 1);
          transition: all .5s;
        }
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
      /*background: url('images/tutorial.png');*/
      width: 1000px;
      height: 73px;
      margin: 0px auto;
      position: relative;
      top: 185px;
      line-height: 73px;
      .tutorial-title {
        width: 115px;
        height: 42px;
        text-align: right;
        line-height: 42px;
        font-size: 18px;
        color: $new-main-deep-color;
        background: url("./images/tutorial-guide.png") no-repeat;
        opacity: 0;
        animation: fadeInUp 1s forwards;
      }
      .tutorial-arrow {
        display: inline-block;
        width: 29px;
        height: 18px;
        background: url("./images/tutorial-arrow.png") no-repeat;
        margin-left: 3px;
        opacity: 0;
        animation: fadeInUp 1s forwards;
        &:first-child {
          animation-delay: 0.3s
        }
        &:nth-child(1) {
          animation-delay: 0.5s
        }
        &:last-child {
          animation-delay: 0.8s
        }
      }
      .tutorial-text {
        width: 170px;
        height: 73px;
        display: inline-block;
        margin-left: 3px;
        vertical-align: top;
        line-height: 73px;
        padding-left: 80px;
        opacity: 0;
        animation: fadeInUp 1s forwards;
        &.tutorial-one {
          background: url("./images/tutorial-one.png") no-repeat;
          animation-delay: 0.3s
        }
        &.tutorial-two {
          background: url("./images/tutorial-two.png") no-repeat;
          animation-delay: 0.6s
        }
        &.tutorial-three {
          background: url("./images/tutorial-three.png") no-repeat;
          animation-delay: 0.9s
        }
        .num {
          font-size: 48px;
          color: $def-gray-color;
        }
        .text {
          vertical-align: top;
          color: $new-inverse-color;
          font-size: $font-md;
        }
      }
    }
  }

  @keyframes show {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes fadeRightIn {
    0% {
      transform: translateX(50px);
      opacity: 0;
    }
    100% {
      transform: translateX(0px);
      opacity: 1;
    }
  }

  #section2 {
    .section-header {
      width: 1099px;
      height: 180px;
      .title{
        background: url("./images/brand.png") no-repeat center;
      }
    }
    .section-content {
      width: 1165px;
      height: 457px;
      margin-top: 60px;
      transform: translateX(50px);
      p {
        font-size: $font-sm;
        color: $new-inverse-color;
        &.p-one {
          position: relative;
          &:before {
            content: '';
            width: 6px;
            height: 6px;
            background-color: $new-main-deep-color;
            border-radius: 50%;
            display: block;
            position: absolute;
            top: 7px;
            left: -15px;
          }
        }
      }
      .left{
        opacity: 0;
      }
      .right {
        width: 687px;
        height: 359px;
        background: url("./images/section-2-content.png") no-repeat;
        opacity: 0;
      }

      &.active {
        .left {
          animation: fadeInLeft .5s forwards;
        }
        .right {
          animation: fadeInRight .5s forwards;
        }
      }
    }
  }

  @keyframes fadeTopIn {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  #section3 {
    .section-header {
      width: 1099px;
      height: 182px;
      .title{
        background: url('./images/entertainment.png') no-repeat center;
      }
    }
    .section-content {
      width: 1202px;
      height: 405px;
      margin-top: 70px;
      transform: translateY(-50px);
      opacity: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      .game-info{
        width: 240px;
        height: 173px;
        transition: height .5s;
        cursor: pointer;
        overflow: hidden;
        position: relative;
        &.active{
          height: 405px;
          .game-logo {
            &.one {
              background: url("./images/game-one-active.png") no-repeat;
            }
            &.two {
              background: url("./images/game-two-active.png") no-repeat;
            }
            &.three {
              background: url("./images/game-three-active.png") no-repeat;
            }
            &.four {
              background: url("./images/game-four-active.png") no-repeat;
            }
            &.five {
              background: url("./images/game-five-active.png") no-repeat;
            }
          }
          .game-text{
            transition: opacity .5s;
            opacity: 1;
          }
        }
        .game-title{
          width: 100%;
          text-align: center;
          color: $def-white-color;
          position: absolute;
          font-size: 20px;
          top:49%;
          z-index: 2;
        }
        .game-logo{
          width: 240px;
          height: 173px;
          position: absolute;
          transition: background .5s;
          &.one{
            background: url("./images/game-one.png") no-repeat;
          }
          &.two{
            background: url("./images/game-two.png") no-repeat;
          }
          &.three{
            background: url("./images/game-three.png") no-repeat;
          }
          &.four{
            background: url("./images/game-four.png") no-repeat;
          }
          &.five{
            background: url("./images/game-five.png") no-repeat;
          }
        }
        .game-text{
          position: absolute;
          top:145px;
          width: 240px;
          height: 227px;
          background: url("./images/game-text-bg.png") no-repeat;
          opacity: 0;
          ul{
            padding-top: 89px;
            li{
              width: 40%;
              font-size: $font-sm;
              text-align: center;
              margin: 0 auto;
              line-height: 25px;
            }
          }
        }
      }

      &.active {
        animation: fadeTopIn .5s ease forwards;
      }
    }
  }

  @keyframes fadeBottomIn {
    0% {
      transform: translateY(50px);
      opacity: 0;
    }
    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }

  #section4 {
    .section-header {
      width: 1265px;
      height: 180px;
      transform: translateY(90px);
      .title{
        background: url('./images/mobile.png') no-repeat center;
      }
    }
    .section-content {
      /*background: url('images/section-4-content.png');*/
      width: 1347px;
      height: 495px;
      margin-top: 150px;
      transform: translateY(50px);
      opacity: 0;
      position: relative;
      .btn-list{
        display: flex;
        width: 656px;
        margin: 0 auto;
        .info{
          width: 160px;
          height: 40px;
          background-color: $def-white-color;
          border-radius: 20px;
          border: solid 1px $font-auxiliary-color;
          line-height: 40px;
          text-align: center;
          margin-left: 24px;
          color: $new-inverse-color;
          cursor: pointer;
          transition:  background-color .5s;
          &:hover{
            background-color: $new-main-deep-color;
            border-color: $new-main-deep-color;
            color: $def-white-color;
            .icon{
              &.apple{
                background: url("./images/apple-active.png") no-repeat;
              }
              &.android{
                background: url("./images/android-active.png") no-repeat;
              }
              &.windows{
                background: url("./images/pc-active.png") no-repeat;
              }
              &.web-phone{
                background: url("./images/webphone-active.png") no-repeat;
              }
            }
          }
        }
        .icon{
          display: inline-block;
          vertical-align: middle;
          transform: translateY(-3px);
          margin-right: 5px;
          transition: background .5s;
          &.apple{
            width: 21px;
            height: 25px;
            background: url("./images/apple.png") no-repeat;
          }
          &.android{
            width: 23px;
            height: 24px;
            background: url("./images/android.png") no-repeat;
          }
          &.windows{
            width: 25px;
            height: 24px;
            background: url("./images/pc.png") no-repeat;
          }
          &.web-phone{
            width: 15px;
            height: 25px;
            background: url("./images/webphone.png") no-repeat;
          }
        }
      }
      .content{
        width: 689px;
        height: 360px;
        background: url("./images/ball-bg.png") no-repeat;
        position: absolute;
        top: 140px;
        left: 50%;
        margin-left: -345px;
        .hand{
          width: 793px;
          height: 381px;
          background: url("./images/section-4-hand.png") no-repeat;
          position: absolute;
          top: 78px;
          left: 152px;
          z-index: 3;
        }
        .phone{
          width: 544px;
          height: 373px;
          background: url("./images/section-4-phone.png") no-repeat;
          position: absolute;
          z-index: 1;
          top: 43px;
          left: 171px;
        }
        .banner{
          width: 409px;
          height: 233px;
          position: absolute;
          transform: rotate(-17deg);
          top: 112px;
          z-index: 2;
          left: 240px;
        }
      }
      &.active {
        animation: fadeBottomIn .5s ease forwards;
      }
    }
  }

  #section5 {
    .section-header {
      width: 1099px;
      height: 180px;
      transform: translateY(140px);
      .title{
        background: url("./images/confidence.png") no-repeat center;
      }
    }
    .section-content {
      width: 1200px;
      height: 280px;
      margin: 0 auto;
      padding-top: 250px;
      opacity: 0;
      .info-list{
        display: flex;
        .info{
          width: 280px;
          height: 226px;
          margin-left: 20px;
          cursor: pointer;
          padding-top: 54px;
          .logo{
            width: 69px;
            height: 69px;
            margin: 0 auto;
          }
          .title{
            font-size: $font-md;
            color: $def-white-color;
            text-align: center;
            margin-top: 30px;
          }
          .sub-title{
            font-size: $font-xs;
            color: $def-white-color;
            text-align: center;
            margin-top: 20px;
          }
          &.one{
            background: url("./images/section-five-one.png") no-repeat;
            .logo{
              background: url("./images/section-five-logo-one.png") no-repeat;
            }
          }
          &.two{
            background: url("./images/section-five-two.png") no-repeat;
            .logo{
              background: url("./images/section-five-logo-two.png") no-repeat;
            }
          }
          &.three{
            background: url("./images/section-five-three.png") no-repeat;
            .logo{
              background: url("./images/section-five-logo-three.png") no-repeat;
            }
          }
          &.four{
            background: url("./images/section-five-four.png") no-repeat;
            .logo{
              background: url("./images/section-five-logo-four.png") no-repeat;
            }
          }
          &.active{
            animation: flipInY .8s;
            background: $new-main-deep-color;
          }
        }
      }
      &.active {
        animation: show .5s ease forwards;
      }
    }
  }

  .register-header {
    position: fixed;
    width: 100%;
    height: 90px;
    background-color: #ffffff;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.08);
    top:0;
    left: 0;
    z-index: 10;

    .header-container {
      padding-top: 15px;
      width: 1100px;
      margin: 0 auto;
      position: relative;
      z-index: 10;
    }

    .register-logo {
      background: url('images/register-logo.png') no-repeat;
      width: 181px;
      height: 47px;
      display: inline-block;
    }
    .title {
      display: inline-block;
      font-size: 24px;
      color: $new-inverse-color;
      margin-left: 25px;
      vertical-align: top;
      margin-top: 18px;
    }
    .down-btn {
      height: 35px;
      line-height: 35px;
      font-size: 14px;
      color: $new-inverse-color;
      margin-top: 12.5px;
      position: relative;
      .icon {
        width: 34px;
        height: 35px;
        display: inline-block;
        margin-left: 10px;
        cursor: pointer;
        &.android {
          background: url("./images/icon-android.png") no-repeat;
        }
        &.ios {
          background: url("./images/icon-ios.png") no-repeat;
        }
      }
      .qrcode{
        width: 150px;
        height: 158px;
        background: url("./images/qrcode-bg.png") no-repeat;
        position: absolute;
        &.ios{
          left: 74px;
        }
        &.android{
          left: 27px;
        }
        .qrimg{
          width: 100px;
          height: 100px;
          background: url("./images/qrcode.png") center;
          background-size: cover;
          margin-top: 33px;
          margin-left: 25px;
        }
      }
    }
    .register-red-pack{
      position: absolute;
      width: 124px;
      height: 219px;
      top: 90px;
      left: -40px;
      .line-left{
        width: 12px;
        height: 54px;
        background: url("./images/line-left.png") no-repeat;
        position: relative;
        left: 50px;
        z-index: 3;
      }
      .line-right{
        width: 11px;
        height: 53px;
        background: url("./images/line-right.png") no-repeat;
        position: relative;
        top: -53px;
        left: 62px;
        z-index: 1;
      }
      .red-main{
        width: 124px;
        height: 165px;
        background: url("./images/red-pack-bg.png") no-repeat;
        z-index: 2;
        position: relative;
        top: -68px;
        animation: rotateRed 4s infinite;
        transform-origin:50% 5%;
        .red-title{
          width: 85px;
          height: 14px;
          background: url("./images/title.png") no-repeat;
          margin: 54px 0px 0px 19px;
        }
        .red-money{
          width: 80%;
          margin: 0 auto;
          text-align: center;
          font-size: $font-xs;
          color: rgba(111, 35, 28, 0.8);
          margin-top: 15px;
          .num{
            font-size: 24px;
            color: #eeb10c;
            margin-top: 15px;
          }
        }
        .red-time{
          text-align: center;
          font-size: $font-xs;
          margin-top: 23px;
          .time{
            margin: 0px 3px;
            font-size:13px;
          }
        }
      }
    }
  }

  .register-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 135px;

  }

  .opacity-0 {
    opacity: 0;
  }

  #fp-nav ul,
  .fp-slidesNav ul {
    padding: 0;

    li {
      display: block;
      width: 140px;
      height: auto;
      position: relative;
      display: flex;
      align-items: center;
      margin: 0;
      margin-top: 20px;
      a {
        display: block;
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        cursor: pointer;
        text-decoration: none;
        /*margin: 24px 16px;*/

        &.active {
          width: 140px;
          height: 100px;
          span {
            position: relative;
            width: 140px;
            height: 100px;
            margin: 0;
            left: 0;
            top: 0;
            background-color: $new-main-deep-color;
            border-radius: 0px;
            border-top-left-radius: 50%;
            border-bottom-left-radius: 50%;
            animation: fadeInRight .8s;
            &:before {
              content: '';
              width: 16px;
              height: 28px;
              background: url("./images/mouse.png") no-repeat;
              display: block;
              position: relative;
              top: 29px;
              left: 74px;
            }
            &:after {
              content: '';
              width: 15px;
              height: 10px;
              background: url("./images/full-down.png") no-repeat;
              display: block;
              position: relative;
              position: relative;
              top: 40px;
              left: 75px;
            }
          }
        }

        span {
          border-radius: 50%;
          position: relative;
          z-index: 1;
          height: 10px;
          width: 10px;
          border: 0;
          background-color: rgba(0, 0, 0, 0.1);
          margin: 0;
          margin-left: 8px;
          /*-webkit-transition: all 0.1s ease-in-out;*/
          /*-moz-transition: all 0.1s ease-in-out;*/
          /*-o-transition: all 0.1s ease-in-out;*/
          /*transition: all 0.1s ease-in-out;*/
          display: block;
        }
      }

      &:hover {
        a {
          span {
            margin: 0px 0px 0px 8px;
          }
          &.active {
            span {
              width: 140px;
              height: 100px;
              border-radius: 0px;
              border-top-left-radius: 50%;
              border-bottom-left-radius: 50%;
              margin: 0;
            }
          }
        }
      }
    }
  }

  #fp-nav {
    position: fixed;
    z-index: 100;
    margin-top: -32px;
    top: 40%;
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    &.right {
      right: 0px;
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
        background: url('images/promise-reg.png') no-repeat;
        width: 289px;
        height: 44px;
        position: absolute;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: -9px;
        font-size: $font-md;
        text-align: center;
        line-height: 44px;
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

      .ac-reg-button {
        width: 210px;
        height: 50px;
        border-radius: 4px;
        /*background: linear-gradient(to bottom, #00d3d8, #00bbc0);*/
        font-size: 16px;
        color: white;
        margin: 10px auto;
        display: block;
      }
    }
  }

  .next-btn {
    /*background: url('images/next-btn.png');*/
    width: 231px;
    height: 61px;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: 0;
    cursor: pointer;
    &:before {
      content: '';
      width: 300px;
      height: 300px;
      border-radius: 50%;
      border: 1px dashed $im-line-color;
      display: block;
      position: relative;
      top: 0;
      left: -34.5px;
    }
    &:after {
      content: '';
      width: 23px;
      height: 13px;
      background: url("./images/next-arrow.png") no-repeat;
      position: absolute;
      top: 31px;
      left: 105px;
      display: block;
      animation: infinite-move 1.5s infinite linear forwards;
    }
  }

  @keyframes infinite-move {
    0% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(20%);
    }
    100% {
      transform: translateY(0);
    }
  }

  @keyframes fadeInRight {

    from {
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    to {
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInUp {

    from {
      opacity: 0;
      -webkit-transform: translate3d(0, 100%, 0);
      transform: translate3d(0, 100%, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInLeft {

    from {
      opacity: 0;
      -webkit-transform: translate3d(-100%, 0, 0);
      transform: translate3d(-100%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }

  @keyframes fadeInRight {

    from {
      opacity: 0;
      -webkit-transform: translate3d(100%, 0, 0);
      transform: translate3d(100%, 0, 0);
    }
    to {
      opacity: 1;
      -webkit-transform: none;
      transform: none;
    }
  }
  @keyframes rotateRed {
    0%,100%{
      transform: rotate(-15deg);
    }
    50%{
      transform: rotate(15deg);
    }
  }
</style>
