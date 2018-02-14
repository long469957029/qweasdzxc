<template>
  <div>
    <div class="res-text-panel">
      <div class="res-header">
        博彩责任
      </div>
      <div class="res-content">
        <div class="res-desc">博彩是一项有趣的、高风险的娱乐行为，作为一种娱乐手段，它不是赚取现金的简单、直接的方法。在无限娱乐，我们希望每位玩家都以同样的方式来理解这项高风险的娱乐游戏。
          为了玩家的健康，我们坚持娱乐为主的原则，我们深知，这是一个负责任的娱乐平台应该担起的责任，并提醒每位玩家控制自己的投注行为。
        </div>
        <div class="res-title">预防未成年人投注</div>
        <div class="res-desc">
          只有年满18岁的人被允许访问、登录和使用无限娱乐平台的博彩服务。每位在平台娱乐的用户都需要使用经过年龄验证的银行卡、
          个人信息、手机等，假造个人资料被视为诈欺。在这种情况下，无限娱乐有权没收及终止未达18岁以下的用户奖金和账户使用。为了未成年人的最佳利益，不要：<br>
          将您银行登录信息泄露<br>
          在游戏软件运行中，让小朋友四处浏览<br>
          忘记在您电脑上安装网络过滤软件来限制博彩网站。
        </div>
        <div class="res-title">自愿限制</div>
        <div class="res-desc">
          无限娱乐看重每位玩家。我们有开发出特殊程序，对于那些无法控制自己的赌博行为，并希望自己限制所有的博彩服务。
          我们提供协助辅导。如果您想利用自愿限制的功能，请随时联系我们的客户服务支持。
        </div>
        <div class="res-title">设置您的极限</div>
        <div class="res-desc">
          如果您将赌博，必须准备好面对任何情况，您可赢可输。因将被视为有趣和盈利的，您必须为您所做的选择负责。
          因此，无限娱乐有帮您设置自己对时间和金钱方面的限制，我们努力为您提供一个健康的游戏环境。如果您需要设置权限，请联系我们的在线客服处理。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'dwFAQ',

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
  .res-text-panel {
    .res-header {
      padding: 14px 20px;
      color: #333333;
      font-weight: 600;
      border-bottom: 1px solid #e6e6e6;
      font-size: 14px;
    }
    .res-content {
      color: #666666;
      padding: 20px;
      font-size: 12px;
      .res-title{
        padding:20px 0;
        color: #333333;
        font-size: 12px;
        font-weight: 600;
      }
      .res-desc{
        line-height: 25px;
      }
    }
  }
</style>

