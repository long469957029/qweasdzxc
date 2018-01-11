<template>
  <div>
    <!--选择位置-->
    <betting-play-area-position v-if="!_.isEmpty(playRule.optionals)" :optionals="playRule.optionals" @positionChange="positionChange"></betting-play-area-position>

    <div class="bc-missOptional-main" v-if="_.find(playRule.topOp, op => op)">
      <transition-group
        name="custom-classes-transition"
        enter-active-class="animated fadeInLeftBig"
        leave-active-class="animated fadeOutLeftBig absolute"
      >
        <div class="inline-block transition" :key="'analysis'" v-if="playRule.analysis">
          <div class="bc-missOption-btn" @click="toggleCurrentMiss" :class="{active: showMiss}">当前遗漏</div><div class="bc-missOption-btn" @click="toggleColdHot" :class="{active: showCold}">30期冷热</div>
        </div>
        <slot name="autoAdd" v-if="playRule.topOp.auto"></slot>
        <div class="bc-missOption-btn" :key="'clear'" @click="clearAllSelected" v-if="playRule.topOp.clear">清除选号</div>
      </transition-group>
    </div>
    <!--选区-->
    <transition
      name="custom-classes-transition"
      enter-active-class="fadeIn animated"
    >
      <div v-if="show">
        <div class="bc-page-content active" :class="`bc-page-content-${playRule.style.position}`" v-for="n in totalPage" v-show="n === 1">
          <div class="bc-playArea-items clearfix" v-for="(fRule, index) in formattedRuleList" v-if="fRule.row.isShow && (!playRule.page || (index < n * playRule.page && index >= (n - 1) * playRule.page))">

            <div class="tab-toolbar" :class="[`tab-${playRule.style.numType}`, `tab-${playRule.style.position}`]">

              <div class="js-bc-select-item-title tab-title" v-if="fRule.row.title && fRule.row.title !== '无'">
                <div>{{fRule.row.title}}</div>
                <transition
                  name="custom-classes-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                >
                  <div class="miss-title" v-if="showMiss && playRule.analysis">遗漏</div>
                  <div class="miss-title" v-if="showCold && playRule.analysis">冷热</div>
                </transition>
              </div>
              <div class="js-bc-select-item-title tab-title" v-else-if="!fRule.row.title">
                <div>号码</div>
                <transition
                  name="custom-classes-transition"
                  enter-active-class="animated fadeIn"
                  leave-active-class="animated fadeOut"
                >
                  <div class="miss-title" v-if="showMiss && playRule.analysis">遗漏</div>
                  <div class="miss-title" v-if="showCold && playRule.analysis">冷热</div>
                </transition>
              </div>

              <div class="tab-group no-margin inline-block">
                <div v-for="n in fRule.row.totalPage"  class="clearfix inline-block">
                  <div class="bc-select-item" v-for="(item, itemIndex) in fRule.row.fItems" v-if="!fRule.row.page || (itemIndex < n * fRule.row.page && itemIndex >= (n - 1) * fRule.row.page)">
                  <span class="cbutton cbutton--effect-novak tab" @click="selectNumber(item, fRule.row)"
                        :class="[fRule.limit, {active: item.selected, clearfix: playRule.style.row !== 1 && Math.ceil(fRule.row.fItem / itemIndex) === playRule.style.row}]">
                    <span v-if="!fRule.row.doubleNum">{{item.title}}</span>
                    <span v-else>{{item.title[0]}}<i class="num-split"></i>{{item.title[1]}}</span>
                  </span>
                    <transition
                      name="custom-classes-transition"
                      enter-active-class="animated rotateIn"
                      leave-active-class="animated rotateOut"
                    >
                    <div class="miss-item" :class="currentMiss[index][itemIndex].style" v-if="showMiss && playRule.analysis">{{currentMiss[index][itemIndex].num}}</div>
                    <div class="miss-item" :class="coldHot[index][itemIndex].style" v-if="showCold && playRule.analysis">{{coldHot[index][itemIndex].num}}</div>
                    </transition>
                  </div>
                  <span v-if="fRule.row.op.clear2" class="operate-clear cursor-pointer" @click="selectOperate('clear', fRule.row)">清空</span>
                </div>
              </div>

            </div>

            <div class="tab-toolbar tab-border tab-toolbar-sm bc-quick-select vertical-middle clearfix" :class="playRule.style.operate === 'block' ? 'm-center' : 'm-left-lg pull-right'" v-if="fRule.row.hasOp">
              <div class="tab-group m-left-md">
                <span class="tab" @click="selectOperate('all', fRule.row)" v-if="fRule.row.op.all">全</span>
                <span class="tab" @click="selectOperate('big', fRule.row)" v-if="fRule.row.op.big">大</span>
                <span class="tab" @click="selectOperate('small', fRule.row)" v-if="fRule.row.op.small">小</span>
                <span class="tab" @click="selectOperate('odd', fRule.row)" v-if="fRule.row.op.odd">奇</span>
                <span class="tab" @click="selectOperate('even', fRule.row)" v-if="fRule.row.op.even">偶</span>
                <span class="tab" @click="selectOperate('clear', fRule.row)" v-if="fRule.row.op.clear">清</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import betRulesAlgorithm from 'bettingCenter/misc/betRulesAlgorithm'
  import BettingPlayAreaPosition from "./betting-play-area-position";

  export default {
    name: "betting-play-area-select",

    components: {BettingPlayAreaPosition},

    props: {
      playRule: Object,
      ticketInfo: Object,
    },

    data: function() {
      return {
        selectOptionals: [],
        lotteryList: [],
        formattedRuleList: [],
        totalPage: 1,
        coefficient: 1,
        type: 'select',
        show: false,
        showMiss: false,
        showCold: false,
      }
    },

    watch: {
      computedRuleList: {
        handler(newVal) {
          this.show = false
          this.$nextTick(() => {
            this.show = true
            this.formattedRuleList = newVal
          })
        },
        immediate: true
      },
      'playRule.page': {
        handler(newVal) {
          this.totalPage = Math.ceil(this.formattedRuleList.length / newVal)
        }
      },
    },

    computed: mapState({
      computedRuleList: function() {
        return _(this.playRule.list).map((RuleItem) => {
          let fItems
          RuleItem.hasOp = _([RuleItem.op.all, RuleItem.op.big, RuleItem.op.small, RuleItem.op.odd, RuleItem.op.even, RuleItem.op.clear]).some()
          fItems = _(RuleItem.items).map((item) => {
            return {
              title: _.isObject(item) ? item.title : item,
              num: _.isObject(item) ? item.num : item,
              // showNum: ,
              selected: false
            }
          });

          if (RuleItem.items.length === 16) {
            RuleItem.page = 8
            RuleItem.totalPage = Math.ceil(RuleItem.items.length / RuleItem.page)
          } else {
            RuleItem.totalPage = 1
          }

          this.$set(RuleItem, 'fItems', fItems)

          return {
            limit: _(RuleItem.limits).pluck('name').join(' '),
            row: RuleItem,
          }
        })
      },
      coldHot: state => state.bettingAnalysis.coldHot,
      currentMiss: state => state.bettingAnalysis.currentMiss,
    }),

    methods: {
      toggleCurrentMiss() {
        this.showCold = false

        this.$nextTick(() => {
          this.showMiss = !this.showMiss
        })
      },

      toggleColdHot() {
        this.showMiss = false

        this.$nextTick(() => {
          this.showCold = !this.showCold
        })
      },

      positionChange(optionals) {
        this.$_calculateCoefficient(optionals)
        this.$_statisticsLottery()
      },

      selectNumber(num, items) {
        this.$_selectNumber(num, items)
      },

      create(createTimes) {
        let results = []
        if (this.coefficient) {
          results = _(createTimes).times(this.playRule.create, this.playRule)
          _(results).each(function(result) {
            result.statistics = Math.round(_(this.coefficient).mul(result.statistics))
            result.selectOptionals = this.selectOptionals
          }, this)
        }

        return results
      },

      selectOperate(op, row) {
        switch (op) {
          case 'all':
            this.$_selectNumbers(row.fItems, row)
            break
          case 'big':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return index >= Math.floor((row.items.length) / 2)
            }), row)
            break
          case 'small':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return index < Math.floor((row.items.length) / 2)
            }), row)
            break
          case 'odd':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return num.num % 2
            }), row)
            break
          case 'even':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return !(num.num % 2)
            }), row)
            break
          case 'clear':
            this.$_selectNumbers(row.fItems, row, false)
            break
          default:
            break
        }

        this.$_statisticsLottery()
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

      $_calculateCoefficient(optionals) {
        let coefficient = 1

        const selectedList = optionals.list.filter(optional => optional.checked);
        const length = selectedList.length
        if (!_.isEmpty(optionals)) {
          coefficient = betRulesAlgorithm.optional(
            optionals.coefficient,
            length,
          )
        }

        this.selectOptionals = _(selectedList).pluck('id')
        this.coefficient = coefficient
      },

      $_statisticsLottery() {
        let count = 0

        this.lotteryList = _(this.playRule.list).map(function(item) {
          let selected = []

          if (item.isShow) {
            selected = _.chain(this.formattedRuleList[item.id].row.fItems).where({selected: true}).value()
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

      $_selectNumber(num, row, toSelected) {
        // 横向不允许冲突/超过最大选择数
        const cx = _.findWhere(row.limits, {name: 'conflict-x'});
        if (!num.selected && !_.isEmpty(cx)) {
          if (!cx.data.num || cx.data.num === 1) {
            _.each(row.fItems, (item) => {
              if (num.num !== item.num) {
                item.selected = false
              }
            })
            // $target.siblings().removeClass('active')
          } else {
            const selecteds = _.chain(row.fItems).flatten().findWhere({selected: true}).value();
            // const $actives = _(row.fItems).$parent.find('.js-bc-select-item.active')
            if (selecteds.length >= cx.data.num) {
              selecteds[0].selected = false
            }
          }
        }

        const cy = _.findWhere(row.limits, {name: 'conflict-y'});

        // 纵向不允许冲突
        if (!num.selected && !_.isEmpty(cy)) {
          _.each(this.formattedRuleList, rule =>  {
            if (row !== rule.row) {
              _.each(rule.row.fItems, item => {
                if (num.num === item.num) {
                  item.selected= false;
                }
              })
            }
          })
        }

        num.selected = _.isUndefined(toSelected) ? !num.selected : toSelected

        // 当是任选并且没有任选位置时，每次改变重新计算系数
        if (!_.isEmpty(this.playRule.optionals) && !this.playRule.optionals.list) {
          this.$_calculateCoefficient(this.playRule.optionals)
        }

        this.$_statisticsLottery()

        const indexs = []
        _(row.fItems).each((item, index) => {
          if (item.selected) {
            indexs.push(index)
          }
        })

        this.$store.commit(types.UPDATE_BONUS, indexs)
      },

      $_selectNumbers(nums, row, toSelected = true) {
        _.chain(nums).flatten().each((num) => {
          this.$_selectNumber(num, row, toSelected)
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .bc-page-content {
    min-height: 290px;
    width: 100%;
    display: none;
    &.active {
      display: block;
    }
    &.bc-page-content-center {
      &.active {
        display: table;
      }
      .bc-playArea-items {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
      }
    }
  }
  .bc-playArea-items{
    margin: 20px auto 20px auto;
    min-height: 70px;
  }

  .bc-select-item {
    margin-bottom: 10px;
    display: inline-block;
  }

  .miss-title {
    height: 20px;
    line-height: 20px;
    color: $font-auxiliary-color;
  }
  .miss-item {
    font-size: 12px;
    text-align: center;
    color: $font-auxiliary-color;
    &.max {
      color: $prominent-color;
    }
    &.min {
      color: $new-main-deep-color;
    }
  }

  .bc-quick-select{
    width: 221px;
    height: 39px;
    border-top: 1px solid $def-gray-color;
    border-radius: 20px;
    background-color: $sec-line-color;
    margin-bottom: 0;
  }

  .tab-default {
    display: inline-block;
  }

  .num-split {
    width: 0;
    border-right: 1px dashed $def-gray-color;
    margin: 0 8px;
    height: 35px;
    display: inline-block;
    position: relative;
    top: 6px;
  }

  .operate-clear {
    margin-left: 15px;
    font-size: 14px;
    display: inline-block;
    position: relative;
    bottom: 4px;
    :hover {
      color: $new-main-deep-color;
    }
  }
  .tab-longhu {
    .tab {
      width: 100px;
      height: 48px;
      background: linear-gradient(0deg, #e6e6e6 0%, #f2f2f2 46%, #fdfdfd 100%), linear-gradient( #f0f0f0, #f0f0f0);
      box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      border: solid 1px #cccccc;
      line-height: 48px;
      font-size: 24px;
      margin-right: 24px;
      &.active {
        color: #ffffff;
        background: #14b1bb;
      }
    }
  }

  .tab-group {
    max-width: 700px;
  }
</style>
