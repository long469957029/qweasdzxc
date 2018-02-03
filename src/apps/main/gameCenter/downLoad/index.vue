<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="gameDownLoad">
    <div class="modal-dialog modal-gameDownLoad">
      <div class="game-header">
        {{title}}手机版下载
        <a class="close-md btn-close" data-dismiss="modal"></a>
      </div>
      <div class="game-body">
        <div class="tab">
          <div class="tab-main">
            <div :class="['tab-info',{'active': phoneIndex === 1}]" @click="phoneIndex = 1">
              <span class="icon ios"></span>
              IOS版本
            </div>
            <div :class="['tab-info',{'active': phoneIndex === 2}]" @click="phoneIndex = 2">
              <span class="icon android"></span>
              安卓版本
            </div>
          </div>
        </div>
        <div class="type-one">
          <div class="text-default">下载方式一</div>
          <div class="text-inverse">扫描二维码下载</div>
          <img class="qrcode" :src="qrCode">
        </div>
        <div class="type-two">
          <div class="text-default">下载方式二</div>
          <div class="text-inverse">手机浏览器打开网址：<span class="text-cool">{{linkUrl}}</span></div>
        </div>
        <div class="tip">
          <span class="tip-icon"></span>
          建议使用浏览器扫码功能或专业二维码扫描工具，不建议使用微信、QQ扫码功能。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  const config = [
      {
        gameId:1,
        title:"AG",
        qrCode: require('./images/ag-real-qrcode.png'),
        linkUrl:'agmbet.com'
      },
    {
      gameId:2,
      title:"EBET",
      qrCode: require('./images/ebet-qrcode.png'),
      linkUrl:'ebetapp.com/hezhong'
    },
    {
      gameId:3,
      title:"BBIN",
      qrCode:'',
      linkUrl:''
    },
    {
      gameId:4,
      title:"PT",
      qrCode:'',
      linkUrl:''
    },
    {
      gameId:5,
      title:"AG",
      qrCode: require('./images/ag-fish-qrcode.png'),
      linkUrl: 'hunter2.agmjs.com'
    },
    {
      gameId:6,
      title:"GG",
      qrCode: require('./images/gg-qrcode.png'),
      linkUrl:'app.5x5x.vip/gg'
    }
    ]
  export default{
    name: 'game-down-load',
    data(){
      return{
        title: '',
        qrCode: '',
        linkUrl: '',
        phoneIndex: 1
      }
    },
    computed:{
      ...mapGetters([
        'gameDownLoadGameId'
      ])
    },
    mounted(){
      this.title =  _(config).find({gameId: this.gameDownLoadGameId}).title
      this.qrCode = _(config).find({gameId: this.gameDownLoadGameId}).qrCode
      this.linkUrl = _(config).find({gameId: this.gameDownLoadGameId}).linkUrl
      this.$nextTick(() => {
        $(this.$refs.gameDownLoad).modal({
          backdrop: 'static',
        })
          .on('hidden.modal', () => {
            this.$store.commit(types.TOGGLE_GMAE_DOWN_LOAD, {showDialog:false})
          })
      })
    }
  }
</script>
<style lang="scss" scoped>
  .modal-gameDownLoad{
    width: 570px;
    height: 530px;
    background-color: $def-white-color;
    border-radius: 5px;
    .game-header{
      width: 100%;
      height: 56px;
      background-color: $new-main-deep-color;
      box-shadow: 0px 1px 0px 0px
      rgba(0, 0, 0, 0.1);
      text-align: center;
      position: relative;
      line-height: 56px;
      font-size: 18px;
      color: $def-white-color;
    }
    .game-body{
      width: 96%;
      margin: 0 auto;
      .tab{
        width: 100%;
        height: 80px;
        border-bottom: 2px solid #e9e9e9;
      }
      .tab-main{
        width: 70%;
        margin: 0 auto;
      }
      .tab-info{
        display: inline-block;
        width: 48%;
        height: 80px;
        margin-left: 1%;
        color: $new-inverse-color;
        font-size: $font-md;
        text-align: center;
        line-height: 80px;
        position: relative;
        cursor: pointer;
        &.active{
          color: $new-main-deep-color;
          &:after{
            content: '';
            width: 80%;
            height: 3px;
            background-color: $new-main-deep-color;
            display: block;
            position: absolute;
            left:10%;
            bottom: -2px;
          }
          .ios{
            background: url("./images/ios-active.png") no-repeat;
          }
          .android{
            background: url("./images/ios-active.png") no-repeat;
          }
        }
      }
      .icon{
        width: 40px;
        height: 40px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 10px;
        &.ios{
          background: url("./images/ios.png") no-repeat;
        }
        &.android{
          background: url("./images/android.png") no-repeat;
        }
      }
      .type-one{
        text-align: center;
        margin-top: 20px;
        font-size: $font-sm;
        color: $def-black-color;
        .qrcode{
          margin-top: 30px;
          width: 136px;
          height: 136px;
        }
      }
      .type-two{
        text-align: center;
        text-align: center;
        margin-top: 20px;
        font-size: $font-sm;
      }
      .tip{
        text-align: center;
        margin-top: 50px;
        .tip-icon{
          width: 18px;
          height: 18px;
          display: inline-block;
          background: url("./images/icon-tip.png") no-repeat;
          margin-right: 5px;
          vertical-align: middle;
          transform: translateY(-2px);
        }
      }
    }
  }
</style>
