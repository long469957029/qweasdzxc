<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        快三玩法规则
      </div>
      <div class="res-content">
        <div class="res-desc">
          快三是一种由中国福利彩票发行管理中心组织销售，江苏省福利彩票发行中心承销的福彩快开彩票，2元1注，每10分钟开一期奖，每期摇出3个号码，每个号码从1-6中开出，有通选，有单选，根据号码组合共分为“和值”、“三同号”、“二同号”、“三不同号”、“二不同号”、“三连号通选”投注方式，简单好玩又易中。
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">快三销售和开奖时间</div>
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
                  <td>江苏快三</td>
                  <td>08:40 - 22:10</td>
                  <td>每期10分钟</td>
                  <td>82期</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="res-desc">
          <div class="res-desc-tit">快三玩法说明</div>
          <div class="res-desc-table">
            <table>
              <thead>
              <tr>
                <td width="15%">玩法群</td>
                <td width="15%">玩法</td>
                <td width="35%">玩法说明</td>
                <td width="35%">中奖示例</td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>和值</td>
                <td>和值</td>
                <td style="text-align: left;">至少选择1个和值（3个号码之和）进行投注，所选和值与开奖的3个号码的和值相同，即为中奖。</td>
                <td style="text-align: left;">如：选择5，开奖号码为是113(和值为5)(顺序不限)，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">三同号</td>
                <td>三同号(通选)</td>
                <td style="text-align: left;">对所有相同的三个号码（111、222、333、444、555、666）进行投注，开出任意三个相同号码，即为中奖。</td>
                <td style="text-align: left;">如：开奖号码为三个相同号码(111、222、…、666)，即为中奖。</td>
              </tr>
              <tr>
                <td>三同号(单选)</td>
                <td style="text-align: left;">选择相同的三个号码（111、222、333、444、555、666）中的任意一个进行投注，所选号码开出，即为中奖。</td>
                <td style="text-align: left;">如：选择111，开奖号码为111，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">三不同号</td>
                <td>三不同号(标准)</td>
                <td style="text-align: left;">从1-6中任选3个或3个以上的号码，所选号码与开奖号码的3个号码相同，即为中奖。</td>
                <td style="text-align: left;">如：选择123，开奖号码为123(顺序不限)，即为中奖。</td>
              </tr>
              <tr>
                <td>三不同号(胆拖)</td>
                <td style="text-align: left;">分别从胆码和拖码的1-6中，至少选择1个胆码和2个拖码组成一注，只要所选的每注3个号码与当期开奖号码相同，即为中奖。</td>
                <td style="text-align: left;">如：选择胆码 1，选择拖码 34，开奖号码为 134，即为中奖。</td>
              </tr>
              <tr>
                <td>三连号</td>
                <td>三连号通选</td>
                <td style="text-align: left;">对所有3个相连的号码（123、234、345、456）进行投注，开出任意相连号码，即中奖。</td>
                <td style="text-align: left;">如：开奖号码为123，234，345，456(顺序不限)，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">二同号</td>
                <td>二同号复选</td>
                <td style="text-align: left;">从11-66中任选1个或多个号码，选号与奖号（包含11-66，不限顺序）相同，为中奖。</td>
                <td style="text-align: left;">如：选择11*，开奖号码为112，113，114，115，116(顺序不限)，即中奖。</td>
              </tr>
              <tr>
                <td>二同号(单选)</td>
                <td style="text-align: left;">选择1对相同号码和1个不同号码投注，所选号码与开奖号码相同（顺序不限），即中奖。</td>
                <td style="text-align: left;">如：选择112，开奖号码为112(顺序不限)，即为中奖。</td>
              </tr>
              <tr>
                <td rowspan="2">二不同号</td>
                <td>二不同号(标准)</td>
                <td style="text-align: left;">从1-6中任选2个或多个号码，所选号码与开奖号码任意2个号码相同，即为中奖。</td>
                <td style="text-align: left;">如： 选择12，开奖号码为12*(顺序不限)，即为中奖。</td>
              </tr>
              <tr>
                <td>二不同号(胆拖)</td>
                <td style="text-align: left;">分别从胆码和拖码的1-6中，至少选择1个胆码和1个拖码组成一注，所选的每注2个号码与当期任意2个开奖号码相同，即中奖。</td>
                <td style="text-align: left;">如：选择胆码 1，选择拖码 3，开奖号码为 13456，即为中奖。</td>
              </tr>
              <tr>
                <td>猜1个就中</td>
                <td>猜1个号就中奖</td>
                <td style="text-align: left;">选择1个号码，所选号码在开奖号码中出现，即为中奖。</td>
                <td style="text-align: left;">如：选择投注号码1，开奖号码中有1，例如111、116、126，即为中一注奖。</td>
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
        name: 'ksLottery',

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
          height: 35px;
          line-height: 35px;
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

