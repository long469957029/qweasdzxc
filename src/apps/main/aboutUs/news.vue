<template>
  <div>
    <div class="new-text-panel">
      <div class="res-header">
        品牌新闻
      </div>
      <div class="new-text-title">【网易新闻】</div>
      <div class="new-text wangyi">
        <a class="new-text-url" href="http://sx.news.163.com/15/1204/18/BA0TKL7S033613CK.html" target="_blank">“大航海”时代 无限娱乐对游戏平台做出新诠释</a>
      </div>
      <div class="new-text-title">【新浪新闻】</div>
      <div class="new-text xinlang">
        <a class="new-text-url"
           href="http://zj.sina.com.cn/finance/xfgz/2015-12-02/detail_finance-ifxmazmy2366325.shtml"
           target="_blank">释放基因中的野性与热血 无限娱乐进军娱乐电游市场</a>
      </div>
      <div class="new-text-title">【腾讯新闻】</div>
      <div class="new-text tengxun">
        <a class="new-text-url" href="http://sx.news.163.com/15/1204/18/BA0TKL7S033613CK.html" target="_blank">无限娱乐：当游戏平台与互联网邂逅</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'new',

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
  .new-text-panel {
    .res-header {
      padding: 14px 20px;
      color: #333333;
      font-weight: 600;
      border-bottom: 1px solid #e6e6e6;
      font-size: 14px;
    }
    .new-text-title {
      margin-left: 10px;
      margin-top: 20px;
      font-size: 16px;
      color: #333333;
    }
    .new-text {
      line-height: 16px;
      margin: 20px;
      font-size: 16px;
      border-bottom: 1px solid #14b1bb;
      padding-bottom: 3px;
      .new-text-url{
        color: #14b1bb;
      }
      &.wangyi{
        margin-left: 20px;
        width: 342px;
      }
      &.xinlang{
        width: 373px;
        margin-left: 20px;
      }
      &.tengxun{
        width: 258px;
        margin-left: 20px;
      }
    }
  }
</style>

