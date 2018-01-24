<template>
  <div>
    <div class="aboutUs-text-panel">
      <div class="text-title">关于我们</div>
      <div class="text-desc">作为行业挑战者，无限娱乐始终将品牌信誉作为发展的第一要义，从游戏选择、产品设计、运营服务的创新上从未妥协。实力让情怀落地，厚积薄发才能带给用户最极致的游戏体验。</div>
      <div class="text-title">品牌理念</div>
      <div class="text-desc">
        无限娱乐前身是一家集游戏开发、运营、商务合作、技术服务于一体的综合性网络科技公司，成立于2012年，凭借尖端前沿的技术实力与行业信誉度，公司于2014年取得了菲律宾政府颁发的合法经营牌照。
        阅尽行业更迭、看尽盛世纷争，集多年的研发与服务沉淀后，公司于2015年底隆重推出了具有技术革命性的娱乐平台－－无限娱乐！
        我们一直认为：在行业高速发展的今天，技术、硬件、产品趋于同质化的背景下，整个行业的竞争最终将转为服务的竞争，正因为如此，无限娱乐坚持本心，将“极致体验，用心服务！”的品牌理念根植于每一个产品细节中。
      </div>
      <div class="text-title">平台历程</div>
      <div class="text-desc">
        <span class="text-desc-year">2012年</span>公司成立<br>
        <span class="text-desc-year">2014年</span>取得菲律宾博彩行业合法经营牌照<br>
        <span class="text-desc-year">2015年</span>无限娱乐平台上线<br>
        <span class="text-desc-year">2016年</span>无限娱乐一周年，成为年度最专业的彩票运营与研发平台<br>
        <span class="text-desc-year">2017年</span>无限娱乐两周年，跻身行业品牌前沿<br>
        <span class="text-desc-year">2018年</span>新版无限娱乐上线<br>
      </div>
    </div>
  </div>
</template>
<script>
  export default{
    name: 'aboutUs',

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
  .aboutUs-text-panel {
    padding-top: 20px;
    .text-title{
      font-size: 14px;
      color: #333333;
      font-weight: 600;
      padding:0 20px;
    }
    .text-desc{
      font-size: 12px;
      color: #666666;
      padding: 20px;
      line-height: 25px;
      .text-desc-year{
        margin-right: 10px;
      }
    }
  }
</style>

