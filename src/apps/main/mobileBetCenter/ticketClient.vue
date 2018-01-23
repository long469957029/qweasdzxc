<template>
  <div>
    <div class="ticket-Client-Container">
      <div class="container-left inline-block">
        <div class="container-left-text">
          <div class="container-left-word"></div>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-title" v-if="showLine1">
              <span class="title-name inline-block">无限彩票客户端</span>
              <span class="title-logo-apple inline-block"></span>
              <span class="title-logo-andrews inline-block"></span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content1" v-if="showLine2">
              首创横屏游戏风格，更符合操作习惯，丝毫不会有任何不适，双手游戏带来的协作性和流畅感，让每一次投注从容不迫。
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content2" v-if="showLine3">
              <span class="text-circle"></span>
              <span class="text-desc">前所未有的大场景，竖版看不到的内容统统一次看够</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content2" v-if="showLine4">
              <span class="text-circle"></span>
              <span class="text-desc">前所未有的兼容性，一个页面即可完成走势、投注、开奖等众多操作</span>
            </div>
          </transition>
          <transition enter-active-class="animated-slow fadeInUp">
            <div class="container-left-content2" v-if="showLine5">
              <span class="text-circle"></span>
              <span class="text-desc">前所未有的顺畅感你，像玩游戏一样玩转彩票</span>
            </div>
          </transition>
        </div>
        <transition enter-active-class="animated-slow fadeInUp">
          <div class="container-left-download" v-if="showLine6">
            <div class="download-type inline-block">
              <div class="download-title">下载方式一</div>
              <div class="download-type-desc">使用设备浏览器打开下列网址即可下载客户端</div>
              <div class="download-type-url">
                <span>app.5x5x.vip</span>
              </div>
            </div>
            <div class="download-type inline-block">
              <div class="download-title">下载方式二</div>
              <div class="download-QRCord">
                <div class="download-QRCord-img"></div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="container-right inline-block"></div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'ticketClient',

    data () {
      return {
        showLine1: false,
        showLine2: false,
        showLine3: false,
        showLine4: false,
        showLine5: false,
        showLine6: false,


      }
    },

    props: {},
    created () {
      // 显示第一行
      setTimeout(() => {
        this.showLine1 = true;
      }, 0);
      // 显示第二行
      setTimeout(() => {
        this.showLine2 = true;
      }, 500);
      // 显示第三行
      setTimeout(() => {
        this.showLine3 = true;
      }, 500);
      // 显示第四行
      setTimeout(() => {
        this.showLine4 = true;
      }, 500);
      // 显示第五行
      setTimeout(() => {
        this.showLine5 = true;
      }, 500);
      // 显示第六行
      setTimeout(() => {
        this.showLine6 = true;
      }, 500);
    },
    components: {},

    mounted () {
      this.$nextTick(() => {
      })
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {}
  }
</script>

<style lang="scss" scoped>
  .ticket-Client-Container {
    padding-top: 100px;
    min-height: 760px;
    .container-left {
      width: 550px;
      padding: 0 30px;
      .container-left-word {
        position: absolute;
        width: 446px;
        height: 122px;
        background-image: url('./misc/mb-ticket-word.png');

      }
      .container-left-title {
        padding-top: 45px;
        height: 30px;
        line-height: 30px;
        position: relative;
        .title-name {
          vertical-align: top;
          font-size: 30px;
          color: #333333;
        }
        .title-logo-apple {
          width: 34px;
          height: 35px;
          margin-left: 10px;
          background-image: url('./misc/mb-apple-green.png');
        }
        .title-logo-andrews {
          width: 34px;
          height: 35px;
          background-image: url('./misc/mb-andrews-green.png');
        }
      }
      .container-left-content1 {
        margin-top: 60px;
        color: #666666;
        font-size: 14px;
        line-height: 24px;
        margin-bottom: 25px;
      }
      .container-left-content2 {
        padding: 7px 0;
        .text-circle {
          width: 5px;
          height: 5px;
          border-radius: 50px;
          margin-right: 8px;
          background-color: #66c9ae;
          float: left;
          margin-top: 8px;
        }
        .text-desc {
          font-size: 12px;
          color: $font-auxiliary-color;
        }
      }
      .container-left-download {
        margin-top: 58px;
        .download-type {
          float: left;
          text-align: center;
          width: 250px;
          .download-title {
            color: $def-black-color;
          }
          .download-type-desc {
            margin: 34px auto 24px;
            color: $font-auxiliary-color;
            width: 155px;
          }
          .download-type-url {
            width: 210px;
            height: 30px;
            background-color: #e6e6e6;
            line-height: 24px;
            margin: 0 auto;
            color: $def-black-color;
          }
          .download-QRCord {
            margin: 28px auto;
            width: 114px;
            height: 114px;
            padding: 5px;
            background-color: $def-white-color;
            box-shadow: 0 3px 8px 0 $font-auxiliary-color;
            .download-QRCord-img {
              background-image: url('./misc/change-QRcode.png');
              background-size: cover;
              width: 100%;
              height: 100%;
            }
          }
        }

      }
    }
    .container-right {
      background-image: url('./misc/mb-ticket.png');
      float: right;
      width: 574px;
      height: 502px;
    }
  }
</style>

