<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        时时彩玩法规则
      </div>
      <div class="res-content">
        <div class="res-desc">
          <div class="res-desc-tit">两面玩法</div>
          <div class="res-desc-second-tit">大小</div>
          开奖结果万位、千位、百位、十位或个位数字为5、6、7、8、9时为“大”，若为0、1、2、3、4时为“小”，当投注位数大小与开奖结果的位数大小相符时，即为中奖。<br/>
          ※举例：投注者购买佰位小，当期开奖结果如为20352（3为小），则视为中奖。
          <div class="res-desc-second-tit">单双</div>
          开奖结果万位、千位、百位、十位或个位数字为1、3、5、7、9时为“单”，若为0、2、4、6、8时为“双”，当投注位数单双与开奖结果的位数单双相符时，即为中奖。<br/>
          ※举例:投注者购买佰位单，当期开奖结果如为20130（1为单），则视为中奖。
          <div class="res-desc-second-tit">总和</div>
          总大：开奖结果5个号码加起的总和，大于等于23为总大。※举例：投注者购买总和大，当期开奖结果如为总数为28，则视为中奖。<br/>
          总小：开奖结果5个号码加起的总和，小于等于22为总小。※举例：投注者购买总和小，当期开奖结果如为总数为18，则视为中奖。<br/>
          总单：开奖结果5个号码加起的总和为单数。※举例：投注者购买总和单，当期开奖结果如为总数为29，则视为中奖。<br/>
          总双：开奖结果5个号码加起的总和为双数。※举例：投注者购买总和双，当期开奖结果如为总数为18，则视为中奖。
          <div class="res-desc-second-tit">龙虎</div>
          龙：开出之号码第一球(万位)的中奖号码大于第五球(个位)的中奖号码，如出和局为打和。如：第一球开出4，第五球开出2； 第一球开出9，第五球开出8； 第一球开出5，第五球开出1...中奖为龙。<br/>
          虎：开出之号码第一球(万位)的中奖号码小于第五球(个位)的中奖号码，如出和局为打和。如：第一球开出7，第五球开出9； 第一球开出3，第五球开出5； 第一球开出5，第五球开出8...中奖为虎。<br/>
          和：开出之号码第一球(万位)的中奖号码等于第五球(个位)的中奖号码 如：2***2则投注和局者视为中奖，其他视为不中奖。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">趣味玩法</div>
          豹子：三个位置对应的中奖号码都相同。如：中奖号码为000、111、999等，则投注豹子者视为中奖，其它视为不中奖。<br/>
          顺子：三个位置对应的中奖号码数字相连（不分顺序）。如：中奖号码为012、123、234、345等，则投注顺子者视为中奖，其它视为不中奖。<br/>
          对子：三个位置对应的中奖号码中有且仅有两个号码相同（不包括豹子）。如：中奖号码为001，112、696等，则投注对子者视为中奖，其它视为不中奖。<br/>
          杂六：不包括豹子、对子、顺子的其他中奖号码。如：中奖号码为157，中奖号码位数之间无关联性，则投注杂六者视为中奖，其它视为不中奖。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">数字盘玩法</div>
          于万千百十个任选一位，自0~9任选1个号进行投注，当开奖结果与所选的定位与号码相同且顺序一致时，即为中奖。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">龙虎斗玩法</div>
          龙虎游戏规则：龙虎是以开奖结果的五个数字作为基准，取任意位置（万、千、百、十、个）的数字进行组合大小比对的一种玩法；<br/>
          当投注龙/虎时，开奖结果为和局，那么押注龙/虎视为不中奖；<br/>
          当投注"和"时，开奖结果为龙/虎，投注“和”视为不中奖；<br/>
          举例：开奖结果为：2,1,3,5,2 万为龙、千为龙虎时：结果 龙(2）大于虎（1），即为开龙；如万为龙，个为虎时，结果一样大，即为开和局！<br/>
          说明：龙1 VS 虎2 即为万为龙，千为虎；龙2 VS 虎4 即为千为龙，十为虎；
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        name: 'sscPlayer',

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
        line-height: 25px;
        .res-desc-tit {
          font-size: 14px;
          color: $main-deep-color;
          font-weight: 600;
        }
        .res-desc-second-tit {
          font-size: 14px;
          font-weight: 600;
          margin-top: 10px;
        }
      }
    }
  }
</style>

