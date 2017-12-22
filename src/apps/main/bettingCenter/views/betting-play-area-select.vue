<template>
  <div>
    <!--选择位置-->
    <betting-play-area-position :optionals="playRule.optionals" @positionChange="positionChange"></betting-play-area-position>

    <!--机选-->
    <div class="js-bc-playArea-missOption bc-missOptional-main">
      <div class="js-bc-missOption bc-missOption-btn active" data-type="lastMissNum">当前遗漏</div>
      <div class="js-bc-missOption bc-missOption-btn" data-type="maxMissNum">最大遗漏</div>
      <div class="js-bc-lottery-auto bc-missOption-btn" data-times="1">机选一注</div>
      <div class="bc-missOption-btn" @click="clearAllSelected">清除选号</div>
    </div>

    <!--选区-->
    <div class="bc-page-content active" v-for="n in totalPage" v-show="n === 1">
      <div class="js-bc-playArea-items bc-playArea-items clearfix" v-for="(fRule, index) in formattedRuleList" v-if="fRule.row.isShow && (!playRule.page || (index < n * playRule.page && index >= (n - 1) * playRule.page))">
        <div class="js-be-playArea-items-toolbar tab-toolbar tab-circle pull-left">

          <div class="js-bc-select-item-title tab-title" v-show="fRule.row.title">
            <div>{{fRule.row.title == '无' ? '' : fRule.row.title}}</div>
          </div>
          <div class="js-bc-select-item-title tab-title" v-show="!fRule.row.title">
            <div>号码</div>
          </div>

          <!--六合-->
          <div class="tab-group <%= htmlNeedInfo.listClassName %>" v-show="!_.isEmpty(fRule.row.htmlNeedInfo)">
            <div :class="fRule.row.htmlNeedInfo.levelClassName">
              <div :class="fRule.row.htmlNeedInfo.playClassName">
                <div v-for="items in fRule.row.fItems">
                  <span class="bc-select-item cbutton cbutton--effect-novak tab" :class="fRule.limit" v-for="item in items" @click="selectNumber(item, fRule.row)">
                    <span :class="[fRule.row.htmlNeedInfo.numberClassName, item.color]">{{item.num}}</span>
                    <span>X</span>
                    <span class="mark6-odds"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-group" v-show="_.isEmpty(fRule.row.htmlNeedInfo)">
            <div v-for="n in fRule.row.totalPage">
              <span class="bc-select-item cbutton cbutton--effect-novak tab" @click="selectNumber(item, fRule.row)"
                    v-for="item in fRule.row.fItems" v-if="!fRule.row.page || (index < n * fRule.row.page && index >= (n - 1) * fRule.row.page)"
                  :class="[fRule.limit, {treble2: fRule.row.doublenum, active: item.selected}]">{{item.num}}
              </span>
            </div>
          </div>
        </div>

        <div class="tab-toolbar tab-border tab-toolbar-sm bc-quick-select m-left-lg vertical-middle pull-right" v-show="fRule.row.hasOp">
          <div class="tab-group m-left-md">
            <span class="tab" @click="selectOperate('all', fRule.row)" v-show="fRule.row.op.all">全</span>
            <span class="tab" @click="selectOperate('big', fRule.row)" v-show="fRule.row.op.big">大</span>
            <span class="tab" @click="selectOperate('small', fRule.row)" v-show="fRule.row.op.small">小</span>
            <span class="tab" @click="selectOperate('odd', fRule.row)" v-show="fRule.row.op.odd">奇</span>
            <span class="tab" @click="selectOperate('even', fRule.row)" v-show="fRule.row.op.even">偶</span>
            <span class="tab" @click="selectOperate('clear', fRule.row)" v-show="fRule.row.op.clear">清</span>
          </div>
        </div>

        <div class="tab-toolbar tab-border tab-toolbar-sm mark6-quick-select" v-show="!_.isEmpty(fRule.row.htmlNeedInfo) && fRule.row.htmlNeedInfo.groupSelect">
          <div class="tab-group">
            <div>
              <span class="js-bc-select-op tab" data-op="shu" data-opid="0">鼠</span>
              <span class="js-bc-select-op tab" data-op="niu" data-opid="1">牛</span>
              <span class="js-bc-select-op tab" data-op="hu" data-opid="2">虎</span>
              <span class="js-bc-select-op tab" data-op="tu" data-opid="3">兔</span>
              <span class="js-bc-select-op tab" data-op="_long" data-opid="4">龙</span>
              <span class="js-bc-select-op tab" data-op="she" data-opid="5">蛇</span>
            </div>
            <div>
              <span class="js-bc-select-op tab" data-op="ma" data-opid="6">马</span>
              <span class="js-bc-select-op tab" data-op="yang" data-opid="7">羊</span>
              <span class="js-bc-select-op tab" data-op="hou" data-opid="8">猴</span>
              <span class="js-bc-select-op tab" data-op="ji" data-opid="9">鸡</span>
              <span class="js-bc-select-op tab" data-op="gou" data-opid="10">狗</span>
              <span class="js-bc-select-op tab" data-op="zhu" data-opid="11">猪</span>
            </div>
          </div>
          <div class="tab-group m-left-md sebo">
            <div>
              <span class="js-bc-select-op tab" data-op="mark6-big">大</span>
              <span class="js-bc-select-op tab" data-op="mark6-small">小</span>
              <span class="js-bc-select-op tab" data-op="odd">单</span>
              <span class="js-bc-select-op tab" data-op="even">双</span>
            </div>
            <div>
              <span class="js-bc-select-op tab" data-op="red">红波</span>
              <span class="js-bc-select-op tab" data-op="blue">蓝波</span>
              <span class="js-bc-select-op tab" data-op="green">绿波</span>
              <span class="js-bc-select-op tab all-clear" data-op="clear">重置</span>
            </div>
          </div>
          <div class="tab-group m-left-md">
            <div>
              <label>尾：</label>
              <span class="js-bc-select-op tab" data-op="wei<%=i%>" v-for="n in 10">{{n - 1}}</span>
            </div>
            <div>
              <label>头：</label>
              <span class="js-bc-select-op tab" data-op="tou<%=i%>" v-for="n in 5">{{n - 1}}</span>
            </div>
          </div>
        </div>
        <span class="js-bc-select-op tab all-clear" data-op="clear" v-show="!_.isEmpty(fRule.row.htmlNeedInfo) && !fRule.row.htmlNeedInfo.groupSelect">重置</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import * as types from 'mutation-types'
  import betRulesAlgorithm from 'bettingCenter/misc/betRulesAlgorithm'
  import BettingPlayAreaPosition from "./betting-play-area-position";

  export default {
    name: "betting-play-area-select",

    components: {BettingPlayAreaPosition},

    props: {
      playRule: Object,
      ticketInfo: Object,
      mark6TicketIdArr: Array,
    },

    data: function() {
      return {
        selectOptionals: [],
        lotteryList: [],
        formattedRuleList: [],
        totalPage: 1,
        coefficient: 1,
        type: 'select'
      }
    },

    watch: {
      computedRuleList: {
        handler(newVal, oldVal) {
          this.formattedRuleList = newVal
        },
        immediate: true
      },
      'playRule.page': {
        handler(newVal) {
          this.totalPage = Math.ceil(this.formattedRuleList.length / newVal)
        }
      }
    },

    computed: mapState({
      computedRuleList: function() {
        return _(this.playRule.list).map((RuleItem) => {
          let fItems
          RuleItem.hasOp = _(RuleItem.op).some()
          fItems = _(RuleItem.items).map(item => {
            return {
              num: item,
              selected: false
            }
          });
          if (!_.isEmpty(RuleItem.htmlNeedInfo)) {
            if (_.indexOf(["mark6-tm-tm","mark6-zm-zm"],RuleItem.htmlNeedInfo.playClassName) > -1) {
              RuleItem.page = 10
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("tm-lm")>-1) {
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("tm-sebo")>-1) {
              RuleItem.page = 9
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("zm-lm")>-1){
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("sx-sx")>-1) {
              RuleItem.page = 6
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("tw-tw")>-1) {
              RuleItem.page = 10
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("zh-zh")>-1) {
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("bz-bz")>-1) {
              RuleItem.page = 10
            }

            RuleItem.totalPage = Math.ceil(RuleItem.items.length / RuleItem.page)
          } else {
            if (RuleItem.items.length === 16) {
              RuleItem.page = 8
              RuleItem.totalPage = Math.ceil(RuleItem.items.length / RuleItem.page)
            } else {
            RuleItem.totalPage = 1
            }
          }

          this.$set(RuleItem, 'fItems', fItems)

          return {
            limit: _(RuleItem.limits).pluck('name').join(' '),
            row: RuleItem,
            htmlNeedInfo: RuleItem.htmlNeedInfo,
          }
        })
      }
    }),

    methods: {
      positionChange(optionals) {
        this.$_calculateCoefficient(optionals)
        this.$_statisticsLottery()
      },

      selectNumber(num, items) {
        //六合
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
            }).value(), row)
            break
          case 'small':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return index < Math.floor((row.items.length) / 2)
            }).value(), row)
            break
          case 'odd':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return num.num % 2
            }).value(), row)
            break
          case 'even':
            this.$_selectNumbers(_.filter(row.fItems, (num, index) => {
              num.selected = false
              return !(num.num % 2)
            }).value(), row)
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
        _.each(this.formattedRuleList, formattedRule => _.each(formattedRule.row.fItem, num => {
          num.selected = false
        }))
      },

      //自定义事件
      addBetting(options) {
        this.$store.commit(types.ADD_PREV_BET, {
          bettingInfo: {
            lotteryList: this.lotteryList,
            selectOptionals: this.selectOptionals,
            format: this.type,
            formatToNum: this.formatToNum || false, // PK10大小单双文字数字转换标示
            formatToNumInfo: this.formatToNumInfo || false, // 六合彩文字转换数值
          },
          options
        })
      },

      empty() {
        this.lotteryList = []
        // this.$el.find('.js-bc-select-item,.js-bc-select-op').removeClass('active')

        this.$store.commit(types.SET_STATISTICS, 0)
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
            _.chain(row.fItems).flatten().each((item) => {
              if (num !== item) {
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
              _.chain(rule.row.fItems).flatten().each(item => {
                const num = _.isNumber(item.num) ? item.num : _.isNumber(item.num.number) ? item.num.number : item.num.name
                if (num === num.num || num.num * 11 === num || num.num % 10 == num) {
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

<style scoped>

</style>
