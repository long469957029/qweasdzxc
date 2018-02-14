<template>
  <div class="points-lottery-panel">
    <div class="lottery-panel-inner">
      <div class="lottery-panel">
        <div class="lottery-panel-main">
          <div class="x-switch">
            <input
              type="radio"
              class="switch-input"
              name="view"
              value="week"
              id="week"
              checked
            >
            <label for="week" class="switch-label switch-label-off">
              2元夺宝
            </label>
            <input
              type="radio"
              class="switch-input"
              name="view"
              value="month"
              id="month"
            >
            <label
              for="month"
              class="switch-label switch-label-on"
            >
              10元夺宝
            </label>
            <span
              class="switch-selection"
            >
        </span>
          </div>
          <div class="lottery-task">
            <div class="lottery-task-inner">

              <div class="task-cell-wrapper" v-for="award in awards" :key="award.rid">
                <div class="task-cell" :class="{selected: award.selected}">
                  <div class="task-cell-inner">
                    <div class="task-item">
                      <div class="points-ticket sfa sfa-pt-task-allowance">
                        <span class="task-item-title">现金券</span>
                        <span class="task-item-val"><span class="">¥</span>20</span>
                      </div>
                    </div>
                    <div class="task-badge">{{award.desc}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="task-button">
              <button class="points-btn btn btn-orange">250 积分夺宝</button>
              <button class="currency-btn btn">10元 现金夺宝</button>
            </div>
            <div class="task-tip">
              <span class="sfa sfa-pt-task-tip"></span>
              提示：每夺宝1次可获得1幸运值，幸运值可用于下方幸运抽奖
            </div>
          </div>
        </div>
        <div class="lottery-list">
          <div class="lottery-top">
            <span class="sfa sfa-pt-task-winner-list"></span>
            获奖名单
          </div>
          <div class="lottery-divider"></div>
          <transition-group class="lottery-list-main" name="ani-scroll" tag="div">
            <div class="lottery-list-main-inner" v-for="user in recentUser" :key="user.uid">
              <span class="lottery-list-left">恭喜 {{user.userName}}获得</span>
              <span class="lottery-list-right"><span class="lottery-list-right-val">10元</span>{{user.bonusName}}获得</span>
            </div>
          </transition-group>
        </div>
      </div>

      <div class="lucky-panel">
        <div class="lucky-title">
          <span class="sfa sfa-pt-star"></span>
          当前幸运值：<span class="lucky-points">56</span>
        </div>
        <div class="lucky-main">
          <div class="lucky-cell" v-for="(chest, index) in chestList" :key="index">
            <div class="cell-probability">{{chest.rate | formatDiv(10)}}%<br />概率</div>
            <div class="lucky-prize-wrapper">
              <div class="lucky-prize">
                <div class="lucky-prize-inner">
                  <div class="sfa sfa-lucky-currency">
                    <span class="lucky-type">现金券</span>
                    <span class="lucky-val">50</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="lucky-prize-name">积分{{chest.lucky}}</div>
            <button class="lucky-exchange-btn btn">
              <span class="sfa sfa-pt-lucky-star-points"></span>
              <span class="lucky-exchange-title">10 幸运值兑换</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getTaskListApi} from 'api/points'

  export default {
    name: 'points-lottery',

    components: {

    },

    data() {
      return {
        radioList: [
          {
            title: '2元夺宝',
            value: 2,
          },
          {
            title: '10元夺宝',
            value: 10,
          },
        ],
        current: 2,


        //夺宝列表
        awards: [],
        cashRob: 0,
        //幸运抽奖
        chestList: [],
        integralRob: 0,
        myLucky: 9,
        //获奖用户
        recentUser: [],
        robLucky: 0,

        timer: null,
        winnerTimer: null,
      }
    },

    methods: {
      normalRoll() {
        this.timer = setInterval(() => {

          const currentAward = _.findWhere(this.awards, {selected: true})
          this.awards.forEach((award) => {
            award.selected = false
          })

          _.chain(this.awards).without(currentAward).sample().value().selected = true
        }, 1000)
      },

      winnerRoll() {
        this.winnerTimer = setInterval(() => {
          if (this.recentUser.length) {
            const currentAward = this.recentUser.shift()
            _.delay(() => {
              this.recentUser.push(currentAward)
            }, 2000)
          }
        }, 3000)
      }

    },

    mounted() {
      this.normalRoll()
      this.winnerRoll()
      getTaskListApi(({data}) => {
        if (data && data.result === 0) {
          this.awards = _.initial(data.root.awards, 1)
          this.awards.forEach((award) => {
            this.$set(award, 'selected', false)
          })
          this.cashRob = data.root.cashRob
          this.chestList = data.root.chest
          this.integralRob = data.root.integralRob
          this.myLucky = data.root.myLucky
          this.recentUser = _.map(data.root.recentUser, (user) => {
            return {
              uid: _.uniqueId(),
              ...user
            }
          })
          this.robLucky = data.root.robLucky
        }
      })
    }

  }
</script>

<style lang="scss" scoped>
  .lottery-panel-inner {
    border-radius: 10px;
    border: solid 2px #e6e6e6;
  }

  .points-lottery-panel {
    padding-top: 40px;
  }

  .lottery-panel-main {
    flex: 60%;
  }

  .lottery-panel {
    display: flex;
  }

  .lottery-task {
    width: 740px;
    margin: 0 auto;
  }

  .task-cell {
    width: 152px;
    height: 152px;
    border: solid 2px #14b1bb;
    transform: rotate(45deg);
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;

    &.selected {
      border: solid 4px #e5a642;
      .task-cell-inner {
        top: -37px;
        left: -37px;
      }
    }
  }

  .task-cell-inner {
    transform: rotate(-45deg);
    height: 220px;
    width: 220px;
    position: absolute;
    top: -35px;
    left: -35px;
  }

  .task-item {
    height: 145px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    padding-top: 60px;
  }

  .task-badge {
    height: 35px;
    background-color: #6d7a8f;
    color: #ffffff;
    text-align: center;
    line-height: 35px;
  }
  .points-ticket {
    display: flex;
  }

  .task-item-val {
    color: #ffffff;
    line-height: 54px;
    font-size: 16px;
    flex: 34%;
    text-align: center;
  }

  .task-item-title {
    color: #bd8935;
    line-height: 54px;
    font-size: 16px;
    /* width: 50px; */
    flex: 67%;
    text-align: center;
  }

  .lottery-task-inner {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 520px;
  }

  .task-cell-wrapper {
    position: relative;
    padding: 30px;
    box-sizing: border-box;

    &:nth-of-type(4) {
      flex: 50% 0 0;
      left: 54px;
      top: -82px;
    }
    &:nth-of-type(5) {
      flex: 50% 0 0;
      right: 54px;
      top: -82px;
    }
    &:nth-of-type(n + 6) {
      top: -167px;
    }
  }


  .lottery-list {
    flex: 33%;
    /* margin-top: 115px; */
    border: solid 5px #edeef0;
    border-radius: 15px;
    margin: 115px 20px 0;
    box-sizing: border-box;
    height: 483px;
  }

  .lottery-top {
    width: 220px;
    height: 50px;
    background-color: #edeef0;
    border-radius: 25px;
    font-size: 18px;
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -30px auto 34px;
  }

  .lottery-divider {
    width: 303px;
    height: 1px;
    background-color: #b9e9ec;
    margin: 0 auto;
  }

  .lottery-list-main {
    height: 419px;
    overflow: hidden;
  }

  .lottery-list-main-inner {
    display: flex;
    justify-content: center;
    line-height: 50px;
  }

  .lottery-list-left {
    flex: 1;
    padding-left: 60px;
    /* vertical-align: bottom; */
  }

  .lottery-list-right {
    flex: 1;
  }

  .lottery-list-right-val {
    color: #cd6d6d;
  }


  .points-btn {
    width: 150px;
    height: 50px;
    background-color: #e5a642;
    box-shadow: 0px 2px 0px 0px    #a37731;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 10px;
  }

  .currency-btn {
    width: 150px;
    height: 50px;
    background-color: #14b1bb;
    box-shadow: 0px 2px 0px 0px    #009097;
    border-radius: 5px;
    font-size: 16px;
  }

  .task-button {
    text-align: center;
    margin-bottom: 20px;
  }


  .task-tip {
    font-size: 14px;
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
  }




  .x-switch {
    position: relative;
    margin: 20px auto;
    height: 26px;
    width: 120px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8), 0 1px rgba(255, 255, 255, 0.3);
  }

  .switch-label {
    position: relative;
    z-index: 2;
    float: left;
    width: 58px;
    line-height: 26px;
    font-size: 11px;
    color: #888;;
    text-align: center;
    text-shadow: 0 2px 1px rgba(0, 0, 0, 1);
    cursor: pointer;
  }

  .switch-label:hover {
    color: #fff;
  }

  .switch-input {
    display: none;
  }

  .switch-input:checked + .switch-label {
    font-weight: bold;
    color: rgba(0, 0, 0, 1);
    text-shadow: 0 1px 0px rgba(1, 1, 1, .1);
    transition: 0.15s ease-out;
  }

  .switch-input:checked + .switch-label-on ~ .switch-selection {
    left: 60px;
  }

  .switch-selection {
    display: block;
    position: absolute;
    z-index: 1;
    top: 2px;
    left: 2px;
    width: 58px;
    height: 22px;
    background: #888;
    border-radius: 3px;
    box-shadow: inset 0 1px rgba(255, 255, 255, 0.5), 0 0 2px rgba(0, 0, 0, 0.2);
    transition: left 0.15s ease-out;
  }

  .lottery-list-main-inner {
    transition: all 2s;
  }

  .ani-scroll-leave-active {
    margin-top: -50px;
  }

</style>
