<template>
  <div>
    <div class="total-panel" v-if="_.indexOf(playRule.bettingArea, 'top') !== -1">
      <betting-chips-setting class="inline-block"></betting-chips-setting>

      <div class="betting-panel inline-block">
        金额
        <input type="text" class="total-betting-input" v-model="betMoney" >
        <slot name="betting-button"></slot>
      </div>
    </div>

    <div class="handicap-grid" v-for="rule in formattedRuleList">
      <div class="title">
        <div class="main">{{rule.title}}</div>
        <div class="side"></div>
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
                <input type="text" class="money-input" v-if="rule.showMoneyInput" v-model.number="item.betMoney" @click.stop @keyup.stop="inputBetMoney(item, $event)" />
              </div>
            </div>

            <div class="main-item" v-else :class="{selected: item.selected}" @click="select(item)">
              <div :class="rule.showItemOdds ? 'main-item-left' : 'main-item-center'">
                <span class="item" :class="item.style">{{item.title}}</span>
                <span class="item odds" v-if="rule.showItemOdds">48.18</span>
              </div>
              <div class="main-item-right" v-if="rule.showMoneyInput">
                <input type="text" class="money-input" v-model.number="item.betMoney" @click.stop @keyup.stop="inputBetMoney(item, $event)" />
              </div>
            </div>

          </div>
        </div>
        <div class="side"></div>
      </div>
    </div>
    <!--<div class="tab-toolbar tab-border tab-toolbar-sm mark6-quick-select">-->
    <!--<div class="tab-group">-->
    <!--<div>-->
    <!--<span class="js-bc-select-op tab" data-op="shu" data-opid="0">鼠</span>-->
    <!--<span class="js-bc-select-op tab" data-op="niu" data-opid="1">牛</span>-->
    <!--<span class="js-bc-select-op tab" data-op="hu" data-opid="2">虎</span>-->
    <!--<span class="js-bc-select-op tab" data-op="tu" data-opid="3">兔</span>-->
    <!--<span class="js-bc-select-op tab" data-op="_long" data-opid="4">龙</span>-->
    <!--<span class="js-bc-select-op tab" data-op="she" data-opid="5">蛇</span>-->
    <!--</div>-->
    <!--<div>-->
    <!--<span class="js-bc-select-op tab" data-op="ma" data-opid="6">马</span>-->
    <!--<span class="js-bc-select-op tab" data-op="yang" data-opid="7">羊</span>-->
    <!--<span class="js-bc-select-op tab" data-op="hou" data-opid="8">猴</span>-->
    <!--<span class="js-bc-select-op tab" data-op="ji" data-opid="9">鸡</span>-->
    <!--<span class="js-bc-select-op tab" data-op="gou" data-opid="10">狗</span>-->
    <!--<span class="js-bc-select-op tab" data-op="zhu" data-opid="11">猪</span>-->
    <!--</div>-->
    <!--</div>-->
    <!--<div class="tab-group m-left-md sebo">-->
    <!--<div>-->
    <!--<span class="js-bc-select-op tab" data-op="mark6-big">大</span>-->
    <!--<span class="js-bc-select-op tab" data-op="mark6-small">小</span>-->
    <!--<span class="js-bc-select-op tab" data-op="odd">单</span>-->
    <!--<span class="js-bc-select-op tab" data-op="even">双</span>-->
    <!--</div>-->
    <!--<div>-->
    <!--<span class="js-bc-select-op tab" data-op="red">红波</span>-->
    <!--<span class="js-bc-select-op tab" data-op="blue">蓝波</span>-->
    <!--<span class="js-bc-select-op tab" data-op="green">绿波</span>-->
    <!--<span class="js-bc-select-op tab all-clear" data-op="clear">重置</span>-->
    <!--</div>-->
    <!--</div>-->
    <!--</div>-->
    <div class="total-panel" v-if="_.indexOf(playRule.bettingArea, 'bottom') !== -1">
      <betting-chips-setting class="inline-block"></betting-chips-setting>

      <div class="betting-panel inline-block">
        金额
        <input type="text" class="total-betting-input" v-model="betMoney" >
        <slot name="betting-button"></slot>
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
    },

    data: function() {
      return {
        lotteryList: [],
        formattedRuleList: [],
        coefficient: 1,
        type: 'handicap',
        betMoney: null
      }
    },

    watch: {
      'playRule.list': {
        handler(newVal, oldVal) {
          this.formattedRuleList = newVal
        },
        immediate: true
      },
    },

    methods: {

      select(item) {
        item.selected = !item.selected
        item.betMoney = item.selected ? this.betMoney : null
      },

      inputBetMoney(item, $event) {
        if (!_.isNumber(item.betMoney) || item.betMoney === 0) {
          item.betMoney = null
        } else {
          item.selected = true
        }
      },

      selectNumber(num, items) {
        //TODO 六合
        if (_.indexOf(this.mark6TicketIdArr, parseInt(this.ticketInfo.info.id, 10)) > -1) {
          const $itemsToolbars = $target.closest('.js-bc-playArea-items')
          this._mark6SelectNumber($target, $itemsToolbars)
        } else {
          this.$_selectNumber(num, items)
        }
      },

      clearAllSelected() {
        _.each(this.formattedRuleList, formattedRule => _.each(formattedRule.row.fItems, num => {
          num.selected = false
        }))
      },

      //自定义事件
      addBetting({type = 'normal', results = []} = {}) {
        if (type === 'auto') {
          _.each(results, (result) => {
            this.$store.commit(types.ADD_PREV_BET, {
              bettingInfo: {
                lotteryList: result.lotteryList,
                selectOptionals: result.selectOptionals,
                statistics: result.statistics,
                format: this.type,
                formatToNum: this.formatToNum || false, // PK10大小单双文字数字转换标示
              },
              options: {
                type
              }
          })
          })
        } else {
          this.$store.commit(types.ADD_PREV_BET, {
            bettingInfo: {
              lotteryList: this.lotteryList,
              selectOptionals: this.selectOptionals,
              format: this.type,
              formatToNum: this.formatToNum || false, // PK10大小单双文字数字转换标示
              formatToNumInfo: this.formatToNumInfo || false, // 六合彩文字转换数值
            },
            options: {
              type
            }
          })
        }
      },

      empty() {
        this.lotteryList = []

        this.clearAllSelected();
      },


      $_statisticsLottery() {
        let count = 0

        this.lotteryList = _(this.playRule.list).map(function(item) {
          let selected = []

          if (item.isShow) {
            selected = _.chain(this.formattedRuleList[item.id].row.fItems).where({selected: true}).pluck('num').value()
          }

          return selected
        }, this)

        // 如果系数不存在，根本无需计算
        if (this.coefficient) {
          // 任选玩法需要去掉没有选值的行，便于复选计算
          if (this.playRule.algorithmProps && this.playRule.algorithmProps.coefficient) {
            count = Math.round(_(this.coefficient).mul(this.playRule.algorithm.call(
              this.playRule,
              _(this.lotteryList).filter((list) => {
                return !_.isEmpty(list)
              }),
            ) || 0))
          } else {
            count = Math.round(_(this.coefficient).mul(this.playRule.algorithm.call(this.playRule, this.lotteryList) || 0))
          }
        }

        this.$store.commit(types.SET_STATISTICS, count)
      },

      $_selectNumbers(nums, row, toSelected = true) {
        _.chain(nums).flatten().each((num) => {
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/variable";

  .handicap-grid {
    margin-bottom: 18px;
    .title {
      background: $sec-line-color;
      text-align: center;
      line-height: 38px;
      font-size: 14px;
      border: 1px solid $def-gray-color;
    }
    .body {
      position: relative;
      top: -1px;
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
          padding-left: 10%;
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
          margin: 0 5px;
        }
      }
      .red {
        background-color: $red;
      }
      .green {
        background-color: $green;
      }
      .blue {
        background-color: $blue;
      }
      .circle {
        display: inline-block;
        width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 50%;
        text-align: center;
        color: $def-white-color;
        font-size: 12px;
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
</style>
