<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        PK10玩法规则
      </div>
      <div class="res-content">
        <div class="res-desc">
          PK10是国家福利彩票管理中心统一发行的赛车主题排列型高频彩票，PK10每期由10辆赛车进行比赛的结果作为开奖号码，竞猜每次比赛后的10个名次，猜对0-10个名次即可获得对应奖金。PK10共有9种游戏玩法群：猜前一、猜前二、猜前三、猜前四、猜前五、定位胆、大小单双、龙虎、和值。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">PK10销售和开奖时间</div>
          <div class="res-desc-table">
            <table>
              <thead>
              <tr>
                <td width="20%">彩种</td>
                <td width="30%">销售时间</td>
                <td width="25%">期数间隔</td>
                <td width="25%">总期数</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>PK10</td>
                <td>09:07 - 23:57</td>
                <td>每期5分钟</td>
                <td>179期</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">PK10玩法说明</div>
          <div class="res-desc-table">
            <table>
              <thead>
              <tr>
                <td width="25%">玩法群</td>
                <td width="25%">玩法</td>
                <td width="50%">玩法说明</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>猜前一</td>
                <td>复式</td>
                <td style="text-align: left;">从冠军投注的1个号码与开奖号码中的第1位数号码相同，视为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">猜前二</td>
                <td>复式</td>
                <td style="text-align: left;">从冠军、亚军投注的两个号码与开奖号码中的前2个号码相同且顺序一致，视为中奖。</td>
              </tr>
              <tr>
                <td>单式</td>
                <td style="text-align: left;">手动输入一个2位数不重复的号码组成一注，所选号码的冠军位、亚军位开奖号码相同，且顺序一致，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">猜前三</td>
                <td>复式</td>
                <td style="text-align: left;">从冠军、亚军、季军投注的三个号码与开奖号码中的前3个号码相同且顺序一致，视为中奖。</td>
              </tr>
              <tr>
                <td>单式</td>
                <td style="text-align: left;">手动输入一个3位数不重复的号码组成一注，所选号码的冠军位、亚军位、季军位开奖号码相同，且顺序一致，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">猜前四</td>
                <td>复式</td>
                <td style="text-align: left;">从冠军、亚军、季军、第四名中选择一个4位数号码组成一注，所选号码与开奖号码相同，且顺序一致，即为中奖。</td>
              </tr>
              <tr>
                <td>单式</td>
                <td style="text-align: left;">手动输入一个4位数号码组成一注，所选号码的冠军、亚军、季军、第四名与开奖号码相同，且顺序一致，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">猜前五
                </td>
                <td>复式</td>
                <td style="text-align: left;">从冠军、亚军、季军、第四名、第五名中选择一个5位数号码组成一注，所选号码与开奖号码相同，且顺序一致，即为中奖。</td>
              </tr>
              <tr>
                <td>单式</td>
                <td style="text-align: left;">手动输入一个5位数号码组成一注，所选号码从冠军、亚军、季军、第四名、第五名所选号码与开奖号码相同，且顺序一致，即为中奖。</td>
              </tr>
              <tr>
                <td>定位胆</td>
                <td>定位胆</td>
                <td style="text-align: left;">从冠军位开始选择最少一个,最多十个位置，任意1个位置或者多个位置上选择1个号码，所选号码与相同位置上的开奖号码一致，即为中奖。</td>
              </tr>
              <tr>
                <td>大小单双</td>
                <td>冠亚季军</td>
                <td style="text-align: left;">选择冠军、亚军、季军的大或小或单或双进行投注，只要开奖的名次对应车号的大小单双（注：01 02 03 04 05 为小；06 07 08 09 10为大；01 03 05 07 09 为单；02 04 06 08 10 为双）与所选项一致即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="5">龙虎</td>
                <td>冠军VS十名</td>
                <td style="text-align: left;">开奖号码第一名大于第十名，龙中奖，反之则虎中奖。</td>
              </tr>
              <tr>
                <td>亚军VS九名</td>
                <td style="text-align: left;">开奖号码第二名大于第九名，龙中奖，反之则虎中奖。</td>
              </tr>
              <tr>
                <td>季军VS八名</td>
                <td style="text-align: left;">开奖号码第三名大于第八名，龙中奖，反之则虎中奖。</td>
              </tr>
              <tr>
                <td>四名VS七名</td>
                <td style="text-align: left;">开奖号码第四名大于第七名，龙中奖，反之则虎中奖。</td>
              </tr>
              <tr>
                <td>五名VS六名</td>
                <td style="text-align: left;">开奖号码第五名大于第六名，龙中奖，反之则虎中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">和值</td>
                <td>冠亚军</td>
                <td style="text-align: left;">所选数值等于冠军和亚军的数字之和，即为中奖。</td>
              </tr>
              <tr>
                <td>冠亚季军</td>
                <td style="text-align: left;">所选数值等于冠军、亚军和季军的数字之和，即为中奖。</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        name: 'Pk10Lottery',

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
    .res-desc-table {
      margin-top: 10px;
      table {
        width: 870px;
        border: 1px solid $im-line-color;
        thead {
          background-color: $sec-line-color;
        }
        tr,td {
          height: 25px;
          line-height: 25px;
          text-align: center;
        }
        tr {
          border-bottom: 1px solid $im-line-color;
        }
        td {
          border-right: 1px solid $im-line-color;
          padding: 5px 10px;
          line-height: 20px;
          text-align: center;
        }
      }
    }
  }
</style>

