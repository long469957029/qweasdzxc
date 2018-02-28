<template>
  <div>
    <div class="total-panel" v-if="_.indexOf(playRule.bettingArea, 'top') !== -1">

      <betting-chips-setting class="inline-block" @addBetMoney="addBetMoney" :chips="chips"></betting-chips-setting>

      <div class="betting-panel inline-block">
        金额
        <input type="text" class="total-betting-input" v-model.number="betMoney" @keyup="inputTotalBetMoney"
               @keydown="inputValidate" @blur="isInputing = false">
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
        <div class="main" v-if="_.isArray(rule.title)">
          <div class="main-title" v-for="title in rule.title">{{title}}</div>
        </div>
        <div class="main" v-else>
          <div class="main-title" v-if="!playRule.showItemOddsAtTitle">{{rule.title}}</div>
          <div class="main-title main-title-odds" v-else="playRule.showItemOddsAtTitle">
            {{rule.title}}
            （ 赔率：
            <animated-integer :value="_.convert2yuan(playInfo.betBonus[0].betMethodMin)"></animated-integer>
            ）
          </div>
        </div>

        <div class="side" v-if="rule.op.full">快捷组选</div>
      </div>
      <div class="body">
        <div class="main">
          <div class="main-row" v-for="rowItem in rule.items">

            <!--根据是否存在子项进行区别渲染-->
            <div class="main-item" v-for="item in rowItem" v-if="item.row" :class="{selected: item.selected}"
                 @click="select(item)">
              <div class="main-item-left" v-if="!_.isEmpty(item)">
                <span class="item" :class="item.style">
                  {{item.title}}
                </span>

                <span class="item" v-if="item.row" v-for="num in item.row">
                    <span :class="num.style">{{num.title}}</span>
                  </span>
              </div>
              <div class="main-item-right" v-if="!_.isEmpty(item)">
                <span class="item odds" v-if="rule.showItemOdds">{{item.odds}}</span>
                <input type="text" class="money-input" v-if="rule.showMoneyInput" v-model.number="item.betMoney"
                       @click.stop @keyup.stop="inputBetMoney(item)" @keydown.stop="inputValidate"/>
              </div>
            </div>

            <div class="main-item" v-else :class="{selected: item.selected, empty: _.isEmpty(item)}"
                 @click="select(item)">
              <div :class="rule.showItemOdds ? 'main-item-left' : 'main-item-center'" v-if="!_.isEmpty(item)">
                <span class="item" :class="item.style">{{item.title}}</span>
                <span class="item odds" v-if="rule.showItemOdds">{{item.odds}}</span>
              </div>
              <div class="main-item-right" v-if="!_.isEmpty(item) && rule.showMoneyInput">
                <input type="text" class="money-input" v-model.number="item.betMoney" @click.stop
                       @keyup.stop="inputBetMoney(item)" @keydown.stop="inputValidate"/>
              </div>
            </div>

          </div>
        </div>
        <div class="side" v-if="rule.op.full">
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('big', rule)">大</div>
            <div class="side-operate" @click="selectOperate('small', rule)">小</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('odd', rule)">单</div>
            <div class="side-operate" @click="selectOperate('even', rule)">双</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('add_big', rule)">和大</div>
            <div class="side-operate" @click="selectOperate('add_small', rule)">和小</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('add_odd', rule)">和单</div>
            <div class="side-operate" @click="selectOperate('add_even', rule)">和双</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('red', rule)">
              <span class="side-icon item red circle"></span>
            </div>
            <div class="side-operate" @click="selectOperate('blue', rule)">
              <span class="side-icon item blue circle"></span>
            </div>
            <div class="side-operate" @click="selectOperate('green', rule)">
              <span class="side-icon item green circle"></span>
            </div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('mouse', rule)">鼠</div>
            <div class="side-operate" @click="selectOperate('cow', rule)">牛</div>
            <div class="side-operate" @click="selectOperate('tiger', rule)">虎</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('rabbit', rule)">兔</div>
            <div class="side-operate" @click="selectOperate('dragon', rule)">龙</div>
            <div class="side-operate" @click="selectOperate('snack', rule)">蛇</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('horse', rule)">马</div>
            <div class="side-operate" @click="selectOperate('sheep', rule)">羊</div>
            <div class="side-operate" @click="selectOperate('monkey', rule)">猴</div>
          </div>
          <div class="side-row">
            <div class="side-operate" @click="selectOperate('chicken', rule)">鸡</div>
            <div class="side-operate" @click="selectOperate('dog', rule)">狗</div>
            <div class="side-operate" @click="selectOperate('pig', rule)">猪</div>
          </div>
          <div class="side-row"></div>
        </div>
      </div>
    </div>

    <div class="total-panel" v-if="_.indexOf(playRule.bettingArea, 'bottom') !== -1">

      <betting-chips-setting class="inline-block" @addBetMoney="addBetMoney" :chips="chips"></betting-chips-setting>

      <div class="betting-panel inline-block">
        金额
        <input type="text" class="total-betting-input" v-model.number="betMoney" @keyup="inputTotalBetMoney"
               @keydown="inputValidate" @blur="isInputing = false">
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
  import betRulesAlgorithm from './misc/betRulesAlgorithm'

  export default {
    name: "betting-play-area-handicap",

    components: {
      BettingChipsSetting
    },

    props: {
      playRule: Object,
      playInfo: Object,
      ticketInfo: Object,
      pushing: Boolean,
      sale: Boolean,
      pending: Boolean,
    },

    data() {
      return {
        chips: [5, 10, 200, 5000, 10000],
        lotteryList: [],
        formattedRuleList: [],
        type: 'handicap',
        betMoney: null,
        canBet: false,
        isInputing: false,
        showOverflow: false
      }
    },

    watch: {
      'playRule.list': {
        handler(list) {
          _.chain(list).pluck('items').each((itemGroup, index) => {
            _.each(itemGroup, (itemList) => {
              _.each(itemList, (item) => {
                const betBonus = _.findWhere(this.playInfo.betBonus, {betType: Number(item.num)})
                if (betBonus) {
                  if (list[index].showItemOdds) {
                    item.odds = _.convert2yuan(betBonus.betMethodMin)
                  }
                  item.maxMultiple = betBonus.betMultiLimitMin
                }
              })
            })
          })

          this.formattedRuleList = list
        },
      },
      'betMoney': {
        handler() {
          _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
            if (item.selected && (!item.betMoney || this.isInputing) || this.playRule.calculateType === 'unite') {
              this.isInputing = true
              this.$_setBetMoney(item, this.betMoney)
            }
          })
        }
      },
      'formattedRuleList': {
        handler(newVal, oldVal) {
          // let prevCanBet = this.canBet
          this.lotteryList = []
          this.canBet = false

          /**
           * 盘口有两种计算方式
           * 1 每个格子独立计算
           * 2 所有选中的格子统一计算 calculateType区分
           */
          switch (this.playRule.calculateType) {
            case 'unite':
              this.formatRuleListByUnite()
              break;
            case 'separate':
              this.formatRuleListBySeparate()
              break;
            default:
              console.error(`没有找到合适的格式化方法:${this.playRule.calculateType}`)
              break;
          }

          if (this.playRule.algorithm !== _.noop) {
            this.$_statisticsLottery()
          }
        },
        deep: true
      },
      showOverflow(isOverflow) {
        if (isOverflow) {
          Global.ui.notification.show('填写金额超过最大限额，已调整为最大投注额')
          this.showOverflow = false
        }
      }
    },

    methods: {
      formatRuleListByUnite() {
        // let lotteryNumList = []
        if (!this.betMoney) {
          return
        }
        _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
          if (item.selected) {
            this.canBet = true
            this.lotteryList.push(item)
          }
        })
      },

      formatRuleListBySeparate() {
        _.chain(this.formattedRuleList).pluck('items').flatten().each((item) => {
          if (item.selected && item.betMoney) {
            this.canBet = true
            this.lotteryList.push(item)
          }
        })
      },

      select(item) {
        if (!_.isEmpty(item)) {
          item.selected = !item.selected
          this.$_setBetMoney(item, item.selected ? this.betMoney : null)
        }
      },

      $_setBetMoney(item, betMoney) {
        if (betMoney > item.maxMultiple) {
          item.betMoney = item.maxMultiple
          this.showOverflow = true
          if (this.playRule.calculateType) {
            this.betMoney = item.maxMultiple
          }
        } else {
          item.betMoney = betMoney
        }
      },

      inputBetMoney(item) {
        if (!_.isNumber(item.betMoney) || item.betMoney === 0) {
          item.betMoney = null
        } else {
          item.selected = true
          this.$_setBetMoney(item, item.betMoney)
        }

        this.$_clearNotBetSelect()
      },

      addBetMoney(addMoney) {
        this.betMoney += addMoney
      },


      inputValidate($event) {
        if (!_.validateNumber($event.keyCode)) {
          $event.preventDefault()
        }
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
          if (!_.isEmpty(item)) {
            item.selected = false
            item.betMoney = null
          }
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

      selectOperate(op, row) {
        const fItems = _.flatten(row.items)
        let flag
        switch (op) {
          case 'big':
            _.filter(fItems, (num, index) => {
              flag = index >= Math.floor((fItems.length) / 2)
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'small':
            _.filter(fItems, (num, index) => {
              flag = index < Math.floor((fItems.length) / 2)
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'odd':
            _.filter(fItems, (num) => {
              flag = num.num % 2
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'even':
            _.filter(fItems, (num) => {
              flag = !(num.num % 2)
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'add_big':
            _.filter(fItems, (num) => {
              flag = _.indexOf(['07', '08', '09', '16', '17', '18', '19', '25', '26', '27', '28', '29', '34', '35',
                '36', '37', '38', '39', '43', '44', '45', '46', '47', '48'], num.num) > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'add_small':
            _.filter(fItems, (num) => {
              flag = _.indexOf(['01', '02', '03', '04', '05', '06', '10', '11', '12', '13', '14', '15', '20', '21',
                '22', '23', '24', '30', '31', '32', '33', '40', '41', '42'], num.num) > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'add_odd':
            _.filter(fItems, (num) => {
              flag = _.indexOf(['01', '03', '05', '07', '09', '10', '12', '14', '16', '18', '21', '23', '25', '27',
                '29', '30', '32', '34', '36', '38', '41', '43', '45', '47'], num.num) > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'add_even':
            _.filter(fItems, (num) => {
              flag = _.indexOf(['02', '04', '06', '08', '11', '13', '15', '17', '19', '20', '22', '24', '26', '28',
                '31', '33', '35', '37', '39', '40', '42', '44', '46', '48'], num.num) > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'red':
            _.filter(fItems, (num) => {
              flag = num.style.indexOf('red') > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'blue':
            _.filter(fItems, (num) => {
              flag = num.style.indexOf('blue') > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'green':
            _.filter(fItems, (num) => {
              flag = num.style.indexOf('green') > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          case 'mouse':
          case 'cow':
          case 'tiger':
          case 'rabbit':
          case 'dragon':
          case 'snack':
          case 'horse':
          case 'sheep':
          case 'monkey':
          case 'chicken':
          case 'dog':
          case 'pig':
            _.filter(fItems, (num) => {
              flag = _.indexOf(this.numBySx(op).nums, num.num) > -1
              num.betMoney = flag ? this.betMoney : null
              num.selected = flag
            })
            break
          default:
            break
        }
      },

      //父组件调用
      lotteryBuy() {
        this.$store.commit(types.ADD_HANDICAP_BET, {
          bettingInfo: {
            lotteryList: this.lotteryList,
            format: this.playRule.format,
            showFormat: this.playRule.showFormat,
            calculateType: this.playRule.calculateType,
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

    computed: {
      ...mapGetters([
        'numBySx'
      ])
    },

    beforeDestroy() {
      this.clearAll()
    }
  }
</script>

<style lang="scss" scoped>
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
      display: flex;
      flex-grow: 5;
      .main-title {
        flex-grow: 1;
        border-right: 1px solid #e6e6e6;
        width: 0;
        white-space: pre;
        &.main-title-odds {
          white-space: initial;
        }

        &:last-child {
          border-right: none;
        }
      }
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
        width: 0;
      }
      .main-item {
        padding: 9px 0;
        min-width: 60px;
        line-height: 25px;
        height: 25px;
        display: flex;
        border: 1px solid $def-gray-color;
        margin-right: -1px;
        border-top: none;
        font-size: 14px;
        cursor: pointer;
        transition: all .3s ease-in;

        &.selected {
          background-color: #fceed6;
        }
        &.empty {
          cursor: default;
        }
        .main-item-left {
          width: 60%;
          padding-left: 8%;
          text-align: left;
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
          margin: 0 4px 0 0;
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
        top: 8px;
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

  .main-item-right {
    display: flex;
    .item {
      width: 40px;
    }
  }
</style>
