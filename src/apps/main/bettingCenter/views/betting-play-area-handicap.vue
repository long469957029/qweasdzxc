<template>
  <div>
    <div class="bc-page-content active" v-for="n in totalPage" v-show="n === 1">
      <div class="handicap-grid" v-for="rule in formattedRuleList">
        <div class="title">
          <div class="main">{{rule.title}}</div>
          <div class="side"></div>
        </div>
        <div class="body">
          <div class="main">
            <div class="main-row" v-for="row in rule.items">
              <span class="main-item" v-for="item in row">
                <span :class="item.style">{{item.title}}</span>
              </span>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import betRulesAlgorithm from 'bettingCenter/misc/betRulesAlgorithm'

  export default {
    name: "betting-play-area-handicap",

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
        type: 'handicap'
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
      positionChange(optionals) {
        this.$_calculateCoefficient(optionals)
        this.$_statisticsLottery()
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

      selectOprate6() {
        const self = this
        const $target = $(e.currentTarget)
        const $playArea = $target.closest('.js-bc-playArea-items')
        const $itemsToolbars = $playArea.find('.js-be-playArea-items-toolbar')
        const op = $target.data('op')
        const $items = $itemsToolbars.find('.js-bc-select-item')

        if ($target.hasClass('active')) {
          $target.removeClass('active')
          $items.removeClass('active')
        } else {
          const selectEle = []
          const opid = $target.data('opid')
          const selectNum = this.options.list[0].htmlNeedInfo.groupSelectData[parseInt(opid, 10)]
          let thisColorArr = ''
          let arrStr = 'redArr'
          let weiNum = ''
          let touNum
          switch (op) {
            case 'shu': case 'niu': case 'hu': case 'tu': case '_long': case 'she':
            case 'ma': case 'yang': case 'hou': case 'ji': case 'gou': case 'zhu':
            $items.each((index, ele) => {
              const $this = $(ele)
              _(selectNum.nums).each((num) => {
                if (parseInt(num, 10) === parseInt($this.data('num'), 10)) {
                  selectEle.push($this)
                }
              })
            })
            $items.removeClass('active')
            this.$_selectNumbers($(selectEle), $itemsToolbars)
            break
            case 'mark6-big':
              self.$_selectNumbers($items.removeClass('active').filter(':gt(23)'), $itemsToolbars)
              break
            case 'mark6-small':
              self.$_selectNumbers($items.removeClass('active').filter(':lt(24)'), $itemsToolbars)
              break
            case 'red': case 'blue': case 'green':
            if (op === 'blue') { arrStr = 'blueArr' } else if (op === 'green') { arrStr = 'greenArr' }
            thisColorArr = this.options.list[0].htmlNeedInfo.colorArr[arrStr]
            // let selectEle = []
            $items.each((index, ele) => {
              const $this = $(ele)
              _(thisColorArr).each((num) => {
                if (parseInt(num, 10) === parseInt($this.data('num'), 10)) {
                  selectEle.push($this)
                }
              })
            })
            $items.removeClass('active')
            this.$_selectNumbers($(selectEle), $itemsToolbars)
            break
            case 'wei0': case 'wei1': case 'wei2': case 'wei3': case 'wei4':
            case 'wei5': case 'wei6': case 'wei7': case 'wei8': case 'wei9':
            weiNum = op.substring(op.length - 1)
            // let selectEle = []
            $items.each((index, ele) => {
              const $this = $(ele)
              const currentNum = $this.data('num').toString()
              if (currentNum.substring(currentNum.length - 1) === weiNum) {
                selectEle.push($this)
              }
            })
            $items.removeClass('active')
            this.$_selectNumbers($(selectEle), $itemsToolbars)
            break
            case 'tou0': case 'tou1': case 'tou2': case 'tou3': case 'tou4':
            touNum = op.substring(op.length - 1)
            // let selectEle = []
            $items.each((index, ele) => {
              const $this = $(ele)
              const currentNum = $this.data('num').toString()
              if (currentNum.substring(0, 1) === touNum) {
                selectEle.push($this)
              }
            })
            $items.removeClass('active')
            this.$_selectNumbers($(selectEle), $itemsToolbars)
            break
            case 'odd':
              if ($items.eq(0).data('num') % 2) {
                this.$_selectNumbers($items.removeClass('active').filter(':even'), $itemsToolbars)
                // $items.removeClass('active').filter(':even').trigger('click');
              } else {
                this.$_selectNumbers($items.removeClass('active').filter(':odd'), $itemsToolbars)
                // $items.removeClass('active').filter(':odd').trigger('click');
              }
              break
            case 'even':
              if ($items.eq(0).data('num') % 2) {
                this.$_selectNumbers($items.removeClass('active').filter(':odd'), $itemsToolbars)
                // $items.removeClass('active').filter(':odd').trigger('click');
              } else {
                this.$_selectNumbers($items.removeClass('active').filter(':even'), $itemsToolbars)
                // $items.removeClass('active').filter(':even').trigger('click');
              }
              break
            case 'clear':
              $items.removeClass('active')
              $playArea.find('.js-bc-select-op').removeClass('active')
              break
            default:
              break
          }
          $target.addClass('active')
        }
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

      $_calculateCoefficient(optionals) {
        let coefficient = 1

        const selectedList = list.filter(optional => optional.checked);
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
        padding: 9px 10px;
        min-width: 100px;
        display: inline-block;
        border: 1px solid $def-gray-color;
        margin-right: -1px;
        border-top: none;
        font-size: 14px;
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
  }
</style>
