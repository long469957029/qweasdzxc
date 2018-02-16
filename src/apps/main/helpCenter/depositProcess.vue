<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        存款流程
      </div>
      <div class="res-content">
        <div class="res-desc-check">
          <div class="res-desc-btn activity" @click.native="tType=1">银行卡转账</div>
          <div class="res-desc-btn" @click.native="tType=2">微信转账</div>
          <div class="res-desc-btn" @click.native="tType=3">支付宝转账</div>
        </div>
        <!--银行卡转账-->
        <div v-if="tType === 1">
          <div class="res-desc">
            作为最早彩民朋友们使用的充值方式，银行卡转账对于任何一位资深的彩民都不陌生，但对于后起之秀会略显生疏，下面就让我们一起来学习下如何使用银行卡转账的方式进行充值。
          </div>
          <div class="res-desc">
            第一步：点击平台的“资金管理”－“在线充值”－选择“银行卡转账”。<br/>
            第二步：在银行卡转账界面选择您的转账银行（您的银行卡是什么银行的，就选择那个），选择后在下方输入您此次充值的金额。<br/>
            <span class="res-desc-hot">特别注意：充值多少填写多少，切记不要在这里填写100，然后转账时转200，这样是会导致充值不成功。</span>
          </div>
          <div class="res-desc">
            <img src="./misc/bank-1.png" />
          </div>
          <div class="res-desc">
            第三步：点击“下一步”获取平台的银行卡信息，除了认准平台的收款银行和账号信息外，银行卡转账时平台每次都会给您一个“附言”信息，在银行操作转账时，一定要填写该附言信息。<br/>
            <span class="res-desc-hot">特别注意：该收款信息为一次性使用，下次充值时请重复以上两步获取新的收款银行信息，因为平台会不定期的更换收款银行。</span>
          </div>
          <div class="res-desc">
            <img src="./misc/bank-2.png" />
          </div>
          <div class="res-desc">
            第四步：选择“点击充值”，跳转至银行转账界面，使用手机银行转账无须跳转，直接在手机上输入银行信息进行转账即可。<br/>
            <span class="res-desc-hot">特别注意：转账金额一定要与在平台填写的充值金额一致，并且一定要在银行转账时的附言栏填写平台给出的“附言”信息。（下图以工商银行转账界面为例）</span>
          </div>
          <div class="res-desc">
            <img src="./misc/bank-3.png" />
          </div>
          <div class="res-desc">
            第五步：银行卡转账成功后，如果您选择的是实时汇款，一般静等5分钟左右即可充值成功；如超过10分钟以上，可以提供转账截图至在线客服为您查询到账情况。
          </div>
          <div class="res-desc">
            至此，银行卡转账的充值方式就完成了，充值过程中切记两点：<br/>
            1、平台充值页面填写的多少，转账时就转多少，不要有金额的出入。<br/>
            2、银行转账附言一定要填写平台提供的附言，以便充值成功。<br/>
            3、每次使用转账充值必须在平台获取最新的银行信息，不要使用以往转账的银行信息，因为平台的收款卡是随时变动的。<br/>
            如在支付中有任何疑问，欢迎咨询在线客服，我们将竭诚为您服务！
          </div>
        </div>
        <!--微信转账-->
        <div v-else-if="tType === 2">
          <div class="res-desc">
            微信充值作为目前最流行的充值方式，因官方管控原因导致充值始终有所不畅，为方便广大用户，我们特别推出了微信转账的功能，到账率达100%，且安全稳定，下面就让我们一起先学习如何使用微信转账的方式进行充值。<br/>
          </div>
          <div class="res-desc">
            第一步：在平台选择【微信转账】，填写充值金额后点击【下一步】
          </div>
          <div class="res-desc">
            <img src="./misc/wechat-1.png" />
          </div>
          <div class="res-desc">
            第二步：复制收款账户的姓名、卡号、充值金额、附言信息，收款卡会不定期更换，请您每次充值时务必通过充值通道获取最新收款信息。
          </div>
          <div class="res-desc">
            <img src="./misc/wechat-2.png" />
          </div>
          <div class="res-desc">
            第三步：依次打开【微信】—【钱包】—【收付款】下拉找到“转账到银行卡”的选项。
          </div>
          <div class="res-desc">
            <img src="./misc/wechat-3.png" />
          </div>
          <div class="res-desc">
            第四步：将第二步获取的姓名、卡号、银行卡，正确填写至转账信息栏目中，点击下一步
          </div>
          <div class="res-desc">
            <img src="./misc/wechat-4.png" />
          </div>
          <div class="res-desc">
            第五步：点击【转账说明】，将第二步的【附言】填写至转账说明中，点击【转账】
          </div>
          <div class="res-desc">
            <img src="./misc/wechat-5.png" />
          </div>
          <div class="res-desc">
            第六步：选择转账时间为“两小时到账”，点击【下一步】支付后等待约三分钟即可成功到账。
          </div>
          <div class="res-desc">
            <img src="./misc/wechat-6.png" />
          </div>
          <div class="res-desc">
            如您在充值过程中需要帮助，欢迎咨询在线客服。
          </div>
        </div>
        <!--支付宝转账-->
        <div v-else-if="tType === 3">
          <div class="res-desc">
            支付宝的方便快捷一直为人们津津乐道，为方便广大用户充值，我们特别推出了支付宝转账，下面让我们详细的介绍下关于支付宝转账充值的过程，希望能给您的游戏体验带去更多顺畅。<br/>
          </div>
          <div class="res-desc">
            第一步：点击平台的“资金管理”－“在线充值”－选择“支付宝转账”。<br/>
            第二步：在支付宝转账的界面上填写您的“存款人姓名”（必须与付款方姓名一致），并在充值金额中填写您本次想要充值的金额。<br/>
            特别注意：充值多少填写多少，切记不要在这里填写100，然后转账时又转200，这样是会导致充值不成功的。
          </div>
          <div class="res-desc">
            <img src="./misc/ali-1.png" />
          </div>
          <div class="res-desc">
            第三步：填写完姓名和充值金额后，点击“下一步”，获取平台收款的银行信息。<br/>
            特别注意：该收款信息为一次性使用，下次充值时请重复以上三步获取新的收款银行信息，因为平台会不定期的更换收款银行。
          </div>
          <div class="res-desc">
            <img src="./misc/ali-2.png" />
          </div>
          <div class="res-desc">
            第四步：点击“登录支付宝”进入网页版的支付宝，或是直接打开手机版的支付宝，选择“转账到银行卡”进入转账界面，填写刚刚获取的收款银行信息进行转账，转账金额一定要与在平台上填写的相符合。
          </div>
          <div class="res-desc">
            <img src="./misc/ali-3.png" />
          </div>
          <div class="res-desc">
            第五步：在支付宝转账成功后，请静等5分钟即可到账成功，如果超过10分钟仍然未到账，可将转账成功的截图提交给平台客服查询到账情况。
          </div>
          <div class="res-desc">
            另外，晚上的23:30 - 01:00期间，使用支付宝转账时，如果支付宝上面提示此次转账需第二天才到账，请勿付款。<br/>
            至此，支付宝转账充值就完成了，只要记住三个要点：<br/>
            1、填写多少充多少，不要出现金额的出入；<br/>
            2、每次充值前都要重新获取转账信息，不要用以往的转账信息；<br/>
            3、如果支付宝提示第二天到账，不要付款。<br/>
            如在支付中有任何疑问，欢迎咨询在线客服，我们将竭诚为您服务！
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'depositProcess',

    data () {
      return {
        tType: 1,
      }
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {
      click(tType){
        console.log(tType)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rules-text-panel{
    .res-header {
      padding: 14px 20px;
      color: $def-black-color;
      font-weight: 600;
      border-bottom: 1px solid $im-line-color;
      font-size: 14px;
    }
    .res-content{
      color: $def-black-color;
      padding: 10px 20px;
      font-size: 12px;
      .res-desc{
        padding: 10px 0;
        .res-desc-tit {
          font-size: 14px;
          color: $main-deep-color;
        }
        .res-desc-second-tit {
          font-size: 14px;
        }
        .res-desc-hot {
          color: $prominent-red-color;
        }
      }
      .res-desc-check {
        width: 100%;
        height: 30px;
        .res-desc-btn {
          width: 80px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          border-radius: 5px;
          float: left;
          margin-right: 15px;
          cursor: pointer;
        }
        .activity {
          background-color: $main-deep-color;
          color: #ffffff;
        }
      }
    }
  }
</style>

