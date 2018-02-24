<template>
    <div>
      <div class="rules-text-panel">
        <div class="res-header">
          彩票投注FAQ
        </div>
        <div class="res-content">
          <div class="res-desc">
            <div class="res-desc-tit">什么是单挑模式？</div>
            平台单挑模式说明：理论中奖金额大于投注本金99倍的订单即为单挑模式，平台单挑奖金限额为1万元。<br/>
            例如：您2元投注一注五星直选，中奖奖金为17万，170000/2=85000倍，您的此笔注单就是单挑注单，平台就按照单挑模式，派发1万元的奖金。
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">什么是追号？</div>
            追号是指选定某些固定选号，在一定期数内进行连续投注的过程。以往在进行守号投注时，需要每天都投注一次，非常麻烦。如果某天因故未能购买，而错失中奖机会，将会令人抱憾不已。使用“追号”功能，只需一次操作即可自动完成多期投注，省时省力，还可自由选择“中奖后停止追号”大大的方便了平台用户投注。<br/>
            目前平台提供同倍追号、翻倍追号、利润率追号3种追号方式：<br/>
            1）同倍追号：同倍追号指设定追号期数和倍数之后，所有的期数的投注倍数都与设置倍数相同。<br/>
            2）翻倍追号：翻倍追号需要设置隔*期翻*倍，点击立即生成，系统将立即生成为与设置一致的投注，点击投注即可成功。<br/>
            3）利润率追号：指追号计划中保证中奖的最低利润，例如，后三直选投012共一注1倍，我们设定如果中奖最低盈利不低于100%。选择起始倍数为1倍，共追号25期，点击生成之后，系统会为您计算投注倍数。您的总投注金额是50元。如果您追号中奖之后，您的盈利将不低于已投注总金额100%。<br/>
            另在设置追号条件时玩家可设置中奖后停止追号，若在追号过程中出现中奖系统将自动终止追号任务，如还有剩余未追期数，系统将剩余期数的追号金额自动退还至玩家购彩账户。
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">官方未开奖如何处理？</div>
            平台对于高频彩如时时彩系列、11选5系列、快乐彩系列，若官方超过30分钟未开奖，平台会进行撤单处理；对于低频彩如3D、P3/P5彩种、六合彩，若官方超过5小时未开奖，平台将会进行撤单处理；撤单处理后如官方后续补开，平台依旧维持撤单处理。
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">为什么我无法进行游戏撤单？</div>
            如果要撤单，必须在停止投注之前进行撤单，如果投注时间已截止，那么将无法再进行撤单操作。如果投注时间未截止，请到“投注记录”->“购彩查询”，点击查询。在列表中的“投注时间”栏，找到您想要撤单的投注单，点击打开，再点击“撤单”。如果是撤消追号单，需要到“投注记录”->“追号查询”->“追号详情”里进行撤消追号处理。
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">什么是恶意投注？</div>
            用户使用不当程序在平台下载或者已经获知官方开奖结果等类似的情况下，在平台下注的行为视为“恶意投注”。基于公平公正的原则，平台对所有恶意投注的行为予以冻结账号处理。 （“恶意投注”的最终解释权归无限娱乐所有）
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">什么是冷热号？</div>
            彩票行业习惯性将一段时间内频繁出现的号码称为“热号”，而将一段时间内出现频率很低的号码称为“冷号”。冷热号只是一段时期的特征，长期看来，各号码出现的频率还是非常平均的。
          </div>
          <div class="res-desc">
            <div class="res-desc-tit">什么是奖金限额？平台奖金限额多少？</div>
            平台奖金限额是指在投注过程中，同一个彩种单期购买的所有注单的总奖金的限制额度。<br/>
            目前平台QQ30秒、QQ分分彩、腾讯分分彩单期的奖金限额为20万元，其他彩种奖金单期奖金限额40万元。
          </div>
        </div>
      </div>
    </div>
</template>
<script>
    export default{
        name: 'lotteryFAQ',

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

