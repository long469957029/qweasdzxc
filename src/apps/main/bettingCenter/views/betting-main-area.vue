<template>
  <div :class="'width-100 bc-play-main' + wrapperClass">
    <betting-rules :initial-rules="playLevels"></betting-rules>
    <div class="bc-play-container clearfix">
      <div class="bc-play-left basic-inverse pull-left">
        <div class="bc-play-select-area clearfix">
          <betting-advance-rules></betting-advance-rules>
          <div class="pull-right bc-advance-mode-main">
            <div class="advance-bouns">
              单注奖金：<span class="font-md text-prominent js-bc-bet-mode"></span>元
            </div>
            <a class="advance-play-des js-bc-play-example">
              <span class="sfa sfa-bc-light vertical-middle"></span>
              玩法说明
            </a>
          </div>
        </div>
        <div class="bc-line"></div>
        <div class="m-LR-smd">
          <div class="bc-play-area clearfix">
            <betting-play-area-select class="bc-play-area clearfix" :play-rule="playRule" v-if="playRule.type === 'select'">
              <div class="gl-loading" v-html="loading"></div>
            </betting-play-area-select>
            <betting-play-area-input class="bc-play-area clearfix" :play-rule="playRule" v-else-if="playRule.type === 'input'">
              <div class="gl-loading" v-html="loading"></div>
            </betting-play-area-input>
          </div>
        </div>

        <div class="div-line"></div>

        <div class="m-LR-smd m-top-md m-bottom-md">
          <div class="form-inline m-TB-xs">
            <select name="" class="js-bc-unit-select select-default bc-unit-select">
              <option value="10000">元</option>
              <option value="1000">角</option>
              <option value="100">分</option>
              <option value="10">厘</option>
            </select>
            <div class="inline-block m-left-smd">
              <span class="js-bc-multi-range  vertical-middle bc-multi-range inline-block"></span>
              <label class="m-left-xs">倍</label>
            </div>

            <div class="inline-block m-left-smd">
              <span>共</span>
              <span class="js-bc-statistics-lottery text-pleasant font-sm font-bold">0</span>
              <span>注，金额</span>
              <span class="js-bc-statistics-money text-prominent font-sm font-bold">0</span>
              <span>元</span>
            </div>
            <select name="" class="js-bc-vouchers-select m-left-smd bc-vouchers-select">
              <option value="">使用代金券</option>
            </select>
            <div class="pull-right m-right-sm">
              <button class="js-bc-btn-lottery-buy btn btn-orange bc-md-btn m-bottom-xs" data-loading-text="提交中">
                <span class="sfa sfa-btn-icon-bolt vertical-middle"></span>
                快捷投注
              </button>
              <button class="js-bc-btn-lottery-add btn btn-cool bc-md-btn m-bottom-xs">
                <span class="sfa sfa-btn-icon-add vertical-middle"></span> 添加号码
              </button>
            </div>
          </div>
        </div>

        <div class="m-bottom-xs m-left-md">
          <div class="clearfix bc-margin-xs">
            <div class="js-bc-lottery-preview bc-lottery-preview border-table-all"></div>
            <div class="overflow-hidden font-sm m-top-md p-top-sm text-center bc-operate-section clearfix">
                <span>
                  <span>预期盈利</span>
                  <span class="js-bc-total-rebateMoney text-prominent font-bold">0</span>
                  <span>元，</span>
                </span>
              <span>
                  <span>总投注 【</span>
                  <span class="js-bc-total-lottery text-pleasant font-bold">0</span>
                  <span>】 注， </span>
                </span>
              <span>
                  <span>总金额</span>
                  <span class="js-bc-total-money text-prominent m-left-xs m-right-xs font-bold">0</span>
                  <span>元</span>
                </span>
              <a class="js-bc-chase inline-block text-black cursor-pointer m-left-md relative">
                <span class="sfa sfa-checkmark vertical-middle"></span>
                我要追号
                <span class="ba-chase-tip">追号能提高中奖率</span>
              </a>
            </div>
            <div class="m-top-md p-top-sm text-center m-bottom-md">
              <button class="js-bc-btn-lottery-confirm btn btn-orange bc-jb-btn"
                      data-loading-text="提交中"> 确认投注
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="js-bc-side-area bc-side-area pull-right"></div>
    </div>
    <div class="bc-bottom-area js-bc-records"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import betRulesConfig from 'bettingCenter/misc/betRulesConfig'

  import bettingRules from './betting-rules'
  import bettingAdvanceRules from './betting-advance-rules'
  import bettingPlayAreaSelect from './betting-play-area-select'
  import bettingPlayAreaInput from './betting-play-area-input'


  export default {
    name: "betting-main-area",
    props: {
      ticketInfo: Object,
      mark6TicketIdArr: Array,
    },
    components: {
      bettingRules,
      bettingAdvanceRules,
      bettingPlayAreaSelect,
      bettingPlayAreaInput,
    },
    data() {
      return {
        wrapperClass: _.indexOf(this.mark6TicketIdArr, parseInt(this.ticketInfo.info.id)) > -1 ? 'mark6' : '',
        loading: Global.ui.loader.get(),
        playRule: {}
      }
    },
    computed: mapState({
      playLevels: function() {
        return this.$store.getters.playLevels
      },
      bettingChoice: 'bettingChoice',
      bettingInfo: 'bettingInfo',
    }),

    watch: {
      'bettingChoice.playId': {
        handler: function(newVal, oldVal) {
          this.playRule = betRulesConfig.get(newVal)
        }
      },
    }
  }
</script>

<style scoped>

</style>
