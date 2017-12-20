<template>
  <div>
    <!--选择位置-->
    <betting-play-area-position :optionals="playRule.optionals"></betting-play-area-position>

    <!--机选-->
    <div class="js-bc-playArea-missOption bc-missOptional-main">
      <div class="js-bc-missOption bc-missOption-btn active" data-type="lastMissNum">当前遗漏</div>
      <div class="js-bc-missOption bc-missOption-btn" data-type="maxMissNum">最大遗漏</div>
      <div class="js-bc-lottery-auto bc-missOption-btn" data-times="1">机选一注</div>
      <div class="js-bc-missOption bc-missOption-btn" data-type="clear">清除选号</div>
    </div>

    <!--选区-->
    <div class="bc-page-content active" v-for="(formattedList, index) in formattedRuleList" v-show="index === 0">
      <div class="js-bc-playArea-items bc-playArea-items clearfix" v-for="fRule in formattedList">
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
                  <span class="js-bc-select-item bc-select-item cbutton cbutton--effect-novak tab" :class="fRule.limit" v-for="item in items">
                    <span :class="[fRule.row.htmlNeedInfo.numberClassName, item.color]">{{item.number}}</span>
                    <span>X</span>
                    <span class="mark6-odds"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-group" v-show="_.isEmpty(fRule.row.htmlNeedInfo)">
            <div v-for="items in fRule.row.fItems">
              <span class="js-bc-select-item bc-select-item cbutton cbutton--effect-novak tab" v-for="item in items"
                  :class="[fRule.limit, {treble2: fRule.row.doublenum}]">{{item}}
              </span>
            </div>
          </div>
        </div>

        <div class="tab-toolbar tab-border tab-toolbar-sm bc-quick-select m-left-lg vertical-middle pull-right" v-show="fRule.row.hasOp">
          <div class="tab-group m-left-md">
            <span class="js-bc-select-op tab" data-op="all" v-show="fRule.row.op.all">全</span>
            <span class="js-bc-select-op tab" data-op="big" v-show="fRule.row.op.big">大</span>
            <span class="js-bc-select-op tab" data-op="small" v-show="fRule.row.op.small">小</span>
            <span class="js-bc-select-op tab" data-op="odd" v-show="fRule.row.op.odd">奇</span>
            <span class="js-bc-select-op tab" data-op="even" v-show="fRule.row.op.even">偶</span>
            <span class="js-bc-select-op tab" data-op="clear" v-show="fRule.row.op.clear">清</span>
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
  import betRulesAlgorithm from 'bettingCenter/misc/betRulesAlgorithm'
  import ticketConfig from 'skeleton/misc/ticketConfig'
  import chunk from "lodash/chunk";
  import BettingPlayAreaPosition from "./betting-play-area-position";

  export default {
    name: "betting-play-area-select",

    components: {BettingPlayAreaPosition},

    props: {
      playRule: Object,
      mark6TicketIdArr: Array,
    },

    data: function() {
      return {
        selectOptionals: [],
        rowsResult: []
      }
    },

    computed: {
      formattedRuleList: function() {
        if (this.playRule.page) {
          this.playRule.formattedList = chunk(this.playRule.list, this.playRule.page)
        } else {
          this.playRule.formattedList = [this.playRule.list]
        }

        return _(this.playRule.formattedList).map((list) => _(list).map((RuleItem) => {
          let fItems
          RuleItem.hasOp = _(RuleItem.op).some()
          if (!_.isEmpty(RuleItem.htmlNeedInfo)) {
            if (_.indexOf(["mark6-tm-tm","mark6-zm-zm"],RuleItem.htmlNeedInfo.playClassName) > -1) {
              fItems = chunk(RuleItem.items, 10)
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("tm-lm")>-1) {
              fItems = [RuleItem.items]
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("tm-sebo")>-1) {
              fItems = chunk(RuleItem.items, 9)
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("zm-lm")>-1){
              fItems = [RuleItem.items]
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("sx-sx")>-1) {
              fItems = chunk(RuleItem.items, 6)
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("tw-tw")>-1) {
              fItems = chunk(RuleItem.items, 10)
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("zh-zh")>-1) {
              fItems = [RuleItem.items]
            } else if (RuleItem.htmlNeedInfo.playClassName.indexOf("bz-bz")>-1) {
              fItems = chunk(RuleItem.items, 10)
            }
          } else {
            if (RuleItem.items.length === 16) {
              fItems = chunk(RuleItem.items, 8)
            } else {
              fItems = [RuleItem.items]
            }
          }

          RuleItem.fItems= fItems
          return {
            limit: _(RuleItem.limits).pluck('name').join(' '),
            row: RuleItem,
            htmlNeedInfo: RuleItem.htmlNeedInfo,
          }
        }))
      }
    },
  }
</script>

<style scoped>

</style>
