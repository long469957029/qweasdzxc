<template>
  <div class="recognize-point">
    <p class="intro-title">积分的用途</p>
    <div class="intro-content">1、积分可在积分商城兑换活动优惠券，每个优惠券都相当于一个活动，再也不用等着平台来开启活动了，自己的活动自己随时兑换；</div>
    <div class="intro-content">2、积分可在商城兑换心仪的礼物<span class="text-intro">豪车，手机，充话费，</span>你能想到的，我们都为您准备好了，
      <span class="">有积分就有一切；</span></div>
    <div class="intro-content m-bottom-md">3、积分不够时，还可以使用积分去碰碰运气，玩转夺宝，用最少的积分获得意想不到的惊喜；</div>
    <div class="intro-steps m-TB-lg">
      <div class="intro-step">
        <div class="intro-icon">
          <div class="sfa-pt-intro-p-ticket"></div>
        </div>
        <div class="intro-brief">兑换优惠券</div>
      </div>
      <div class="intro-dot">...</div>

      <div class="intro-step">
        <div class="intro-icon">
          <div class="sfa-pt-intro-p-gift"></div>
        </div>
        <div class="intro-brief">兑换礼物</div>
      </div>
      <div class="intro-dot">...</div>

      <div class="intro-step">
        <div class="intro-icon">
          <div class="sfa-pt-intro-p-lottery"></div>
        </div>
        <div class="intro-brief">兑换夺宝</div>
      </div>
      <div class="intro-dot">...</div>

      <div class="intro-step">
        <div class="intro-icon">
          <div class="sfa-pt-intro-p-ticket"></div>
        </div>
        <div class="intro-brief">话费/QQ充值</div>
      </div>
    </div>

    <p class="intro-title">积分获取规则</p>
    <div class="intro-content m-bottom-md">玩家在平台的每一次有意义行为如充值、投注、签到、达成任务等均可获取积分，具体如下：</div>

    <table class="intro-table table">
      <thead>
      <tr>
        <th>玩家行为</th>
        <th>细项</th>
        <th>积分奖励</th>
        <th>奖励封顶</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>注册</td>
        <td>注册</td>
        <td>{{actionList[0]}}</td>
        <td>1次性奖励</td>
      </tr>
      <tr>
        <td rowspan="2">登录</td>
        <td>pc端登录</td>
        <td>{{actionList[1]}}</td>
        <td rowspan="2">每天奖励1次，以第1次登录端为准</td>
      </tr>
      <tr>
        <td>移动端登录</td>
        <td>{{actionList[2]}}</td>
      </tr>
      <tr>
        <td rowspan="5">签到</td>
        <td>pc端签到</td>
        <td>{{actionList[3]}}</td>
        <td rowspan="5">每天奖励1次，以第1次签到端为准</td>
      </tr>
      <tr>
        <td>移动端签到</td>
        <td>{{actionList[4]}}</td>
      </tr>
      <tr>
        <td>连签≥5天</td>
        <td>{{actionList[5]}}</td>
      </tr>
      <tr>
        <td>连签≥10天</td>
        <td>{{actionList[6]}}</td>
      </tr>
      <tr>
        <td>连签≥15天</td>
        <td>{{actionList[7]}}</td>
      </tr>

      <tr>
        <td rowspan="3">完善资料</td>
        <td>填写QQ</td>
        <td>{{actionList[8]}}</td>
        <td rowspan="3">1次性奖励</td>
      </tr>
      <tr>
        <td>填写邮箱</td>
        <td>{{actionList[9]}}</td>
      </tr>
      <tr>
        <td>填写生日</td>
        <td>{{actionList[10]}}</td>
      </tr>

      <tr>
        <td rowspan="2">充值</td>
        <td>首次充值</td>
        <td>{{actionList[11]}}</td>
        <td>1次性奖励</td>
      </tr>
      <tr>
        <td>日常充值</td>
        <td>充值积分比约为：{{actionList[12]}}</td>
        <td>无限制</td>
      </tr>

      <tr>
        <td rowspan="2">投注</td>
        <td>彩票投注</td>
        <td>充值积分比约为：{{actionList[13]}}</td>
        <td>无限制</td>
      </tr>
      <tr>
        <td>真人投注</td>
        <td>充值积分比约为：{{actionList[14]}}</td>
        <td>无限制</td>
      </tr>

      </tbody>
      <tfoot>
      <tr>
        <td>任务</td>
        <td colspan="3">请前往积分商城查看具体任务奖励</td>
      </tr>
      </tfoot>
    </table>

    <p class="intro-title">积分等级说明</p>
    <div class="intro-content m-bottom-md">积分不仅可用于在积分商城消费，玩家历史累计积分（不含兑换消耗）还可换算成对应积分等级，不同等级可享有在积分商城不同的 兑换折扣，具体如下：</div>
    <table class="intro-table table">
      <thead>
      <tr>
        <th>等级</th>
        <th>积分</th>
        <th>兑换折扣</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="level in levelList">
        <td><span class="sfa" :class="`sfa-pt-level-${level.levelId}`"></span></td>
        <td>{{level.levelId === 0 ? '<' : '≥'}}{{level.integral | convert2yuan}}</td>
        <td>
          <template v-if="level.discount === 10000">
            无折扣
          </template>
          <template v-else>
            {{_.formatDiv(level.discount, 1000)}}折
          </template>
        </td>
      </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
  import {actionIntroduceApi, levelIntroduceApi} from 'api/points'

  export default {
    name: 'recognize-point',

    data() {
      return {
        levelList: [],
        actionList: []
      }
    },

    mounted() {
      actionIntroduceApi(({data}) => {
        if (data && data.result === 0) {
          this.actionList = data.root.result
        }
      })

      levelIntroduceApi(({data}) => {
        if (data && data.result === 0) {
          this.levelList = data.root.confs
        }
      })
    }
  }
</script>

<style lang="scss" scoped>

  .intro-title {
    font-size: 20px;
    color: #333333;
    position: relative;
    margin-bottom: 35px;

    &:before {
      content: '';
      position: absolute;
      bottom: -15px;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: $main-deep-color;
    }
  }

  .intro-content {
    font-size: 14px;
    line-height: 30px;
    color: #666666;
  }

  .intro-steps {
    display: flex;
    justify-content: center;
  }

  .intro-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 12px;
    background-color: #808da6;
    border: solid 6px #f2f2f2;
    border-radius: 53px;
  }

  .intro-step {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
  }

  .intro-brief {
    font-size: 16px;
    color: #666666;
  }

  .intro-dot {
    color: #e2e2e2;
    font-size: 40px;
    margin: 24px;
  }

  .intro-table {
    margin-bottom: 80px;
    thead tr th {
      background-color: rgba(58, 127, 135, 0.7);
      opacity: 0.7;
      color: #ffffff;
      font-size: 14px;
      padding: 5px 0px;
      border: 1px solid #cdcdcd;
    }
    tbody td {
      background-color: #f5f5f5;
      border: 1px solid #cdcdcd;
      padding: 7px 0px;
    }
    tfoot td {
      background-color: #e6e6e6;
      border: 1px solid #cdcdcd;
      padding: 7px 0px;
    }
  }

  .text-intro {
    color: #3a7f87;
  }
</style>
