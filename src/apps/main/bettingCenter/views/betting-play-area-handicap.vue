<template>
  <div>
    <div class="total-panel" v-if="_.indexOf(playRule.bettingArea, 'top') !== -1">

      <betting-chips-setting class="inline-block" @addBetMoney="addBetMoney" :chips="chips"></betting-chips-setting>

      <div class="betting-panel inline-block">
        金额
        <input type="text" class="total-betting-input" v-model.number="betMoney" @keyup="inputTotalBetMoney" >
        <button class="btn btn-orange m-bottom-xs" data-loading-text="提交中" @click="lotteryBuy"
                :disabled="!canBet || pushing || !sale || pending">
          投注
        </button>
        <button class="btn btn-cool m-bottom-xs" @click="clearAll" :disabled="pushing || !sale || pending">
          重置
        </button>
      </div>
    </div>

    <div class="handicap-grid" v-for="rule in formattedRuleList">
      <div class="title">
        <div class="main">{{rule.title}}</div>
        <div class="side">快捷组选</div>
      </div>
      <div class="body">
        <div class="main">
          <div class="main-row" v-for="rowItem in rule.items">

            <!--根据是否存在子项进行区别渲染-->
            <div class="main-item" v-for="item in rowItem" v-if="item.row" :class="{selected: item.selected}" @click="select(item)">
              <div class="main-item-left">
                <span class="item" :class="item.style">{{item.title}}</span>

                <span class="item" v-if="item.row" v-for="num in item.row">
                    <span :class="num.style">{{num.title}}</span>
                  </span>
              </div>
              <div class="main-item-right">
                <span class="item odds" v-if="rule.showItemOdds">48.18</span>
                <input type="text" class="money-input" v-if="rule.showMoneyInput" v-model.number="item.betMoney" @click.stop @keyup.stop="inputBetMoney($event, item)" />
              </div>
            </div>

            <div class="main-item" v-else :class="{selected: item.selected}" @click="select(item)">
              <div :class="rule.showItemOdds ? 'main-item-left' : 'main-item-center'">
                <span class="item" :class="item.style">{{item.title}}</span>
                <span class="item odds" v-if="rule.showItemOdds">48.18</span>
              </div>
              <div class="main-item-right" v-if="rule.showMoneyInput">
                <input type="text" class="money-input" v-model.number="item.betMoney" @click.stop @keyup.stop="inputBetMoney($event, item)" />
              </div>
            </div>

          </div>
        </div>
        <div class="side" v-if="rule.op.full">
          <div class="side-row">
            <div class="side-operate">大</div>
            <div class="side-operate">小</div>
          </div>
          <div class="side-row">
            <div class="side-operate">单</div>
            <div class="side-operate">双</div>
          </div>
          <div class="side-row">
            <div class="side-operate">和大</div>
            <div class="side-operate">和小</div>
          </div>
          <div class="side-row">
            <div class="side-operate">和单</div>
            <div class="side-operate">和双</div>
          </div>
          <div class="side-row">
            <div class="side-operate">
              <span class="side-icon item red circle"></span>
            </div>
            <div class="side-operate">
              <span class="side-icon item blue circle"></span>
            </div>
            <div class="side-operate">
              <span class="side-icon item green circle"></span>
            </div>
          </div>
          <div class="side-row">
            <div class="side-operate">鼠</div>
            <div class="side-operate">牛</div>
            <div class="side-operate">虎</div>
          </div>
          <div class="side-row">
            <div class="side-operate">兔</div>
            <div class="side-operate">龙</div>
            <div class="side-operate">蛇</div>
          </div>
          <div class="side-row">
            <div class="side-operate">马</div>
            <div class="side-operate">羊</div>
            <div class="side-operate">猴</div>
          </div>
          <div class="side-row">
            <div class="side-operate">鸡</div>
            <div class="side-operate">狗</div>
            <div class="side-operate">猪</div>
          </div>
          <div class="side-row"></div>
        </div>
      </div>
    </div>

    <div class="total-panel" v-if="_.indexOf(playRule.bettingArea, 'bottom') !== -1">

      <betting-chips-setting class="inline-block" @addBetMoney="addBetMoney" :chips="chips"></betting-chips-setting>

      <div class="betting-panel inline-block">
        金额
        <input type="text" class="total-betting-input" v-model.number="betMoney" @keyup="inputTotalBetMoney" >
        <button class="btn btn-orange m-bottom-xs" data-loading-text="提交中" @click="lotteryBuy"
                :disabled="!canBet || pushing || !sale || pending">
          投注
        </button>
        <button class="btn btn-cool m-bottom-xs" @click="clearAll" :disabled="pushing || !sale || pending">
          重置
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import BettingChipsSetting from './betting-chips-setting'
  import betRulesAlgorithm from 'bettingCenter/misc/betRulesAlgorithm'

  export default {
    name: "betting-play-area-handicap",

    components: {
      BettingChipsSetting
    },

    props: {
      playRule: Object,
      ticketInfo: Object,
      pushing: Boolean,
      sale: Boolean,
      pending: Boolean,
    },

    data: function() {
      return {
        chips: [5, 10, 200, 5000, 10000],
        lotteryList: [],
        formattedRuleList: [],
        type: 'handicap',
        betMoney: null,
        canBet: false
      }
    },

    watch: {
      'playRule.list': {
        handler(newVal, oldVal) {
          this.formattedRuleList = newVal
        },
        immediate: true
      },
      'betMoney': {
        handler() {
          _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
            if (item.selected && !item.betMoney) {
              item.betMoney = this.betMoney
            }
          })
        }
      },
      'formattedRuleList': {
        handler(newVal, oldVal) {
          // let prevCanBet = this.canBet
          this.lotteryList = []
          this.canBet = false
          _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
            if (item.selected && item.betMoney) {
              this.canBet = true
              this.lotteryList.push(item)
            }
          })

          if (this.playRule.algorithm !== _.noop) {
            this.$_statisticsLottery()
          }
        },
        deep: true
      }
    },

    methods: {

      select(item) {
        item.selected = !item.selected
        item.betMoney = item.selected ? this.betMoney : null
      },

      inputBetMoney($event, item) {
        if (!_.isNumber(item.betMoney) || item.betMoney === 0) {
          item.betMoney = null
        } else {
          item.selected = true
        }

        this.$_clearNotBetSelect()
      },

      addBetMoney(addMoney) {
        this.betMoney += addMoney
      },

      inputTotalBetMoney() {
        if (!_.isNumber(this.betMoney) || this.betMoney === 0) {
          this.betMoney = null
          if (!this.playRule.showMoneyInput) {
            _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
              item.betMoney = null
            })
          }
        }
      },

      clearAll() {
        _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
          item.selected = false
          item.betMoney = null
        })
        this.betMoney = null
      },

      $_clearNotBetSelect() {
        _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
          if (!item.betMoney) {
            item.selected = false
          }
        })
      },

      //父组件调用
      lotteryBuy() {
        this.$store.commit(types.ADD_HANDICAP_BET, {
          bettingInfo: {
            lotteryList: this.lotteryList,
            format: this.playRule.format
          }
        })


        this.$emit('lotteryBuy')
      },

      $_statisticsLottery() {
        let count = 0

        count = Math.round(this.playRule.algorithm.call(this.playRule, [this.lotteryList]) || 0)

        this.canBet = !!count
        this.$store.commit(types.SET_STATISTICS, count)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/variable";

  .handicap-grid {
    margin-bottom: 18px;
    .title {
      display: flex;
      background: $sec-line-color;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      border: 1px solid $def-gray-color;
    }

    .main {
      flex-grow: 5;
    }

    .side {
      width: 144px;
      position: relative;
      margin-top: 1px;
      right: 1px;
    }

    .body {
      position: relative;
      top: -1px;
      display: flex;
      .main {
        display: flex;
        border: 1px solid $def-gray-color;
        border-top: none;
        border-left: none;
      }
      .main-row {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        position: relative;
        top: 1px;
      }
      .main-item {
        padding: 9px 0;
        min-width: 60px;
        display: flex;
        border: 1px solid $def-gray-color;
        margin-right: -1px;
        border-top: none;
        font-size: 14px;
        cursor: pointer;

        &.selected {
          background-color: #fceed6;
        }
        .main-item-left {
          width: 60%;
          padding-left: 5%;
          box-sizing: border-box;
          line-height: 25px;
        }
        .main-item-right {
          width: 40%;
          box-sizing: border-box;
        }
        .main-item-center {
          text-align: center;
          flex-grow: 1;
        }
        .item {
          margin: 0 3px;
        }
      }
      .red {
        background-color: $red;
        color: $def-white-color;
      }
      .green {
        background-color: $green;
        color: $def-white-color;
      }
      .blue {
        background-color: $blue;
        color: $def-white-color;
      }
      .gray {
        background-color: #f0f0f0;
        color: $new-inverse-color;
      }
      .circle {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        text-align: center;
        font-size: 12px;
      }
    }

    .side-row {
      display: flex;
      width: 144px;
      line-height: 43px;
      height: 43px;
      border: 1px solid #cccccc;
      border-top: none;

      div {
        flex-grow: 1;
        border-right: 1px solid #cccccc;
        text-align: center;
        margin-right: -1px;
        border-top: none;
      }

      .side-icon {
        position: relative;
        top: 6px;
      }
    }

    .money-input {
      width: 55%;
      border-color: $def-gray-color
    }

    .odds {
      color: $prominent-color;
    }
  }
  .total-panel {
    margin: 10px;
  }
  .betting-panel {
    vertical-align: top;
    font-size: 14px;
  }

  .total-betting-input {
    width: 82px;
    padding: 7px;
    vertical-align: top;
    margin-right: 10px;
    border-color: $def-gray-color;
  }
  .btn {
    padding: 7px 22px;
    margin-right: 10px;
  }
  .side-operate {
    cursor: pointer;
  }
</style>
