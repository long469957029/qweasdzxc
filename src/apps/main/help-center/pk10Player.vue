<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        PK10玩法规则
      </div>
      <div class="res-content">
        <div class="res-desc">
          <div class="res-desc-tit">单码/双面规则说明</div>
          <div class="res-desc-second-tit">定位</div>
          指冠军、亚军、季军、第四、第五、第六、第七、第八、第九、第十名出现的顺序与号码为派彩依据
          如第一个开奖号码为3号，投注冠军为3则视为中奖，其它号码视为不中奖。
          <div class="res-desc-second-tit">大小</div>
          开出的号码大于或等于6为大，小于或等于5为小 。
          <div class="res-desc-second-tit">单双</div>
          号码为双数叫双，如4、6；号码为单数叫单，如3、5。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">龙虎</div>
          <div class="res-desc-second-tit">冠军龙虎</div>
          * 龙：冠军号码大于第十名号码视为“龙”中奖，如冠军开出07，第十名开出03。<br/>
          * 虎：冠军号码小于第十名号码视为“虎”中奖，如冠军开出03，第十名开出07。
          <div class="res-desc-second-tit">亚军龙虎</div>
          * 龙：亚军号码大于第九名号码视为“龙”中奖，如亚军开出07，第九名开出03。<br/>
          * 虎：亚军号码小于第九名号码视为“虎”中奖，如亚军开出03，第九名开出07。
          <div class="res-desc-second-tit">季军龙虎</div>
          * 龙：季军号码大于第八名号码视为“龙”中奖，如季军开出07，第八名开出03。<br/>
          * 虎：季军号码小于第八名号码视为“虎”中奖，如季军开出03，第八名开出07。
          <div class="res-desc-second-tit">第四名龙虎</div>
          * 龙：第四名号码大于第七名号码视为“龙”中奖，如第四名开出07，第七名开出03。<br/>
          * 虎：第四名号码小于第七名号码视为“虎”中奖，如第四名开出03，第七名开出07。
          <div class="res-desc-second-tit">第五名龙虎</div>
          * 龙：第五名号码大于第六名号码视为“龙”中奖，如第五名开出07，第六名开出03。<br/>
          * 虎：第五名号码小于第六名号码视为“虎”中奖，如第五名开出03，第六名开出07。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">冠亚军和</div>
          冠军号码与亚军号码的和值区间为3~19，当投注组合符合冠亚军和值，即视为中奖
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">冠亚军和大小</div>
          当开奖结果冠军号码与亚军号码的和值大于11为大，投注“和大”则视为中奖；小于等于11为小，投注“和小”则视为中奖。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">冠亚军和单双</div>
          当开奖结果冠军号码与亚军号码的和值为单数如9、13，投注“和单”则视为中奖；为双数如12、16，投注“和双”则视为中奖。
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        name: 'pk10Player',

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

