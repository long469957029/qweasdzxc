<template>
    <div>
      <div class="rules-text-panel">
        <div class="res-header">
          防DNS劫持教程
        </div>
        <div class="res-content">
          <div class="res-desc">
            在上网娱乐时，您可能经常遇到这种情况：明明输入的是相同的网址，但打开的页面却是另一个陌生的网站，出现这种情况是由于您的网络供应商漏洞而造成的。
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">那么我们如何避免或修复这样的问题呢？</div>
            1. 在打开相同网址，出现陌生网站时，请及时关闭不要继续打开，以防木马等病毒程序侵入电脑，对个人财产造成严重损失。<br/>
            2. 解决方法：可以通过手动指定DNS（DNS用于将域名正确转换为您想访问的网站的作用），修改后你的网络应用将更加稳定，安全。下面就让我们一步一步的教您如何修复本地DNS。
          </div>
          <div class="res-desc">
            <div class="res-desc-second-tit">第一步：</div>
            点击桌面左下角的 [开始]按钮，打开 [控制面板]，查看方式为类别，点击 [网络和Internet]，再进入 [网络和共享中心]。
          </div>
          <div class="res-desc">
            <img src="./misc/dns-1.jpg" />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <img src="./misc/dns-2.jpg" />
          </div>
          <div class="res-desc">
            <div class="res-desc-second-tit">第二步：</div>
            点击 [更改适配器设置]。
          </div>
          <div class="res-desc">
            <img src="./misc/dns-3.jpg" />
          </div>
          <div class="res-desc">
            <div class="res-desc-second-tit">第三步：</div>
            右键点击当前活动的网络连接，点弹出菜单中的 [属性]。
          </div>
          <div class="res-desc">
            <img src="./misc/dns-4.jpg" />
          </div>
          <div class="res-desc">
            <div class="res-desc-second-tit">第四步：</div>
            选择 [Internet 协议版本 4 (TCP/IPv4)]，再点击 [属性]。
          </div>
          <div class="res-desc">
            <img src="./misc/dns-5.jpg" />
          </div>
          <div class="res-desc">
            <div class="res-desc-second-tit">第五步：</div>
            选择 [使用下面的DNS服务器地址]，输入 [首选 DNS服务器为 8.8.8.8 ]和 [备用DNS服务器为8.8.4.4]，然后点击 [确定]。
          </div>
          <div class="res-desc">
            <img src="./misc/dns-6.jpg" />
          </div>
          <div class="res-desc">
            注：如果完成以上操作后仍无法解决问题，您可以请教专业电脑人员参阅以下链接为您处理：<br/>
            https://support.microsoft.com/zh-cn/kb/972034<br/>
            最后，我们再次郑重声明，无限娱乐唯一官方客服仅为平台在线客服，未提供QQ等其他第三方的服务渠道，在服务过程中更不会索要用户联系方式。
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    export default{
        name: 'dnsCourse',

        data () {
            return {}
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

        methods: {}
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
      }
    }
  }
</style>

