<template>
  <div class="modal-dialog modal-chase">
    <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal">
        <span aria-hidden="true">×</span>
      </button>
      <span class="setting-icon"></span>
      <span>追号设置</span>
      <ul class="nav chase-nav">
        <li class="active">
          <a href="#jsBcChaseNormal" data-toggle="tab" data-index="0" data-name="normal">
            <span>同倍追号</span>
          </a>
        </li>
        <li>
          <a href="#jsBcChaseMulti" data-toggle="tab" data-index="1" data-name="multi">
            <span>翻倍追号</span>
          </a>
        </li>
        <li v-if="singleType">
          <a href="#jsBcChaseProfit" data-toggle="tab" data-index="2" data-name="profit">
            <span>利润率追号</span>
          </a>
        </li>
      </ul>
    </div>
    <div class="modal-body no-padding">
      <div class="view-container tab-content">

        <div id="jsBcChaseNormal" class="tab-pane fade in active">
          <form class="form-inline chase-search-form" action="javascript:void(0)">
            <div class="control-group font-sm">
              <label class="control-label">追号期数</label>
              <radio-group :radio-list="radioList" v-model="planPrefab" class="m-right-lg"></radio-group>
              <input name="chasePlans" type="text" class=" chase-input js-gl-monitor bc-monitor" autocomplete="off"
                     data-monitor-type="number" v-model.number="chasePlans" ref="chasePlans"/>
              期
              <label class="control-label m-left-md">起始倍数</label>
              <input name="startMultiple" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                     v-model="startMultiple"/> 倍
              <button type="button" class="chase-create btn btn-cool pull-right" @click="chaseCreate()"
                      :disabled="!plans.length || pushing">生成追号计划
              </button>
            </div>
          </form>
        </div>

        <div id="jsBcChaseMulti" class="tab-pane fade">
          <form class="form-inline chase-search-form" action="javascript:void(0)">
            <div class="control-group font-sm">
              <label class="control-label">追号期数</label>
              <input name="chasePlans" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                     data-monitor-type="number" v-model.number="chasePlans" ref="chasePlans"/>
              期
              <label class="control-label m-left-lg">起始倍数</label>
              <input name="startMultiple" type="text" class="js-gl-monitor bc-monitor chase-input"
                     data-monitor-type="number" autocomplete="off"
                     v-model="startMultiple"/> 倍
              <label class="control-label m-left-lg">每隔</label>
              <input name="gaps" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                     data-monitor-type="number" data-monitor-range="[1, 99999]" v-model="gaps"/>
              期
              <label class="control-label m-left-md">倍数X</label>
              <input name="incMultiple" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                     data-monitor-type="number" data-monitor-range="[1, 99999]" v-model="incMultiple"/>
              <button type="button" class="chase-create btn btn-cool pull-right" @click="chaseCreate({type: 'multi'})"
                      :disabled="!plans.length || pushing">生成追号计划
              </button>
            </div>
          </form>
        </div>

        <div id="jsBcChaseProfit" class="tab-pane fade " v-if="singleType">
          <form class="form-inline chase-search-form" action="javascript:void(0)">
            <div class="control-group">
              <label class="control-label">追号期数</label>
              <input name="chasePlans" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                     data-monitor-type="number" v-model.number="chasePlans" ref="chasePlans"/>
              期
              <label class="control-label m-left-lg">起始倍数</label>
              <input name="startMultiple" type="text" class="js-gl-monitor bc-monitor chase-input"
                     data-monitor-type="number" autocomplete="off"
                     v-model="startMultiple"/> 倍
              <button type="button" class="chase-create btn btn-cool pull-right" @click="chaseRateCreate()"
                      :disabled="!plans.length || pushing">生成追号计划
              </button>
            </div>
            <div class="control-group m-left-lg">
              <label class="inline-block no-margin">
                <div class="custom-radio radio-inverse">
                  <input type="radio" id="jsBcChaseType1" class="js-bc-chaseType" name="chaseType" value="rate"
                         v-model="chaseType">
                  <label for="jsBcChaseType1"></label>
                </div>
                利润率>=
                <input name="rate" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                       data-monitor-type="number" data-monitor-range="[1, 99999]" v-model="rate"/> %
              </label>
              <label class="inline-block m-left-md no-margin">
                <div class="custom-radio radio-inverse">
                  <input type="radio" id="jsBcChaseType3" class="js-bc-chaseType" name="chaseType" value="amount"
                         v-model="chaseType">
                  <label for="jsBcChaseType3"></label>
                </div>
                利润金额
                <input name="amount" type="text" class="js-gl-monitor bc-monitor chase-input" autocomplete="off"
                       data-monitor-type="number" data-monitor-range="[1, 999999]" v-model="amount"/>
              </label>
              元
            </div>
          </form>
        </div>
        <static-grid :wrapper-class="lotteryGridOps.wrapperClass" :table-class="lotteryGridOps.tableClass"
                     :col-model="lotteryGridOps.colModel"
                     :height="lotteryGridOps.height" :emptyTip="lotteryGridOps.emptyTip" :rows="chaseList"
                     ref="normalGrid"></static-grid>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center clearfix basic-inverse padding-smd">
        <div class="pull-left p-top-sm">
          <span class="m-right-lg font-sm">共追号
            <span class="text-cool">{{selectedChaseList.length}}</span>
            期，金额
            <span class="text-orange">{{totalMoney}}</span>
            元
          </span>
        </div>
        <div class="pull-left p-top-sm">
          <label>
                <span class="custom-checkbox">
                  <input type="checkbox" id="js-bc-chase-1" class="js-bc-chase-suspend" v-model="suspend"/>
                  <label class="checkbox-label" for="js-bc-chase-1"></label>
                </span>
            中奖后停止追号
          </label>
        </div>
        <div class="pull-right">
          <button type="button" class="btn btn-white btn-lg font-sm" :disabled="!selectedChaseList.length || pushing"
                  @click="clearAll">清除追号
          </button>
          <button type="button" class="btn btn-orange btn-lg font-sm" data-loading-text="投注中"
                  :disabled="!selectedChaseList.length || pushing" @click="chaseConfirm">确定投注
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RadioGroup from 'com/RadioGroup'

  export default {
    name: "betting-chase",

    components: {
      RadioGroup,
      StaticGrid,
    },

    props: {
      ticketId: Number,
      limitMoney: Number,
      ticketInfo: Object,
      planId: String,
      previewList: Array,
      totalLottery: Object
    },

    data: function () {
      return {
        fPreviewList: [],
        singleType: true,
        maxMultiple: 999999,
        basicBettingMoney: 0,
        basicMaxBonus: 0,
        // 基础利润比率
        perRateMoneyRate: 0,
        // 基础利润金额
        perRateMoney: 0,
        planPrefab: 5,
        chasePlans: 5,
        startMultiple: 1,
        incMultiple: 2,
        gaps: 1,
        rate: 50,
        amount: 100,
        suspend: true,
        chaseType: 'rate',
        totalMoney: 0,

        radioList: [
          {
            title: '5期',
            value: 5,
          },
          {
            title: '10期',
            value: 10,
          },
          {
            title: '15期',
            value: 15,
          },
          {
            title: '20期',
            value: 20,
          }
        ],
        lotteryGridOps: {
          wrapperClass: 'border-top',
          tableClass: 'table table-bordered chase-table',
          colModel: [
            {
              label: '序号',
              name: 'index',
              width: '15%',
              formatter: (val, index) => {
                return index + 1
              },
            },
            {
              label: `<label class="no-margin font-xs"><span class="custom-checkbox">
<input type="checkbox" id="js-bc-select-all" name="selectAll" value=""> <label for="js-bc-select-all" class="checkbox-label"></label></span>追号期数</label>`,
              name: 'ticketPlanId',
              width: '25%',
              formatter: (val, index, row) => {
                const id = _.uniqueId()
                let fVal = `<label class="no-margin font-xs inline-block"><span class="custom-checkbox">
<input type="checkbox" id="${id}" name="selectAll" class="js-bc-select" ${row.selected ? 'checked' : ''}> <label for="${id}" class="checkbox-label"></label></span>${val}</label>`
                if (index === 0 && val === this.planId) {
                  return `${fVal} <span class="badge">当前期</span>`
                }
                return fVal
              },
            },
            {
              label: '倍数',
              name: 'multiple',
              width: '20%',
              formatter: (val, index, row) => {
                return `<input type="text" class="js-bc-single-plan-multiple js-gl-monitor input-xs text-circle"
data-monitor-type="number" data-monitor-range="[1, ${this.maxMultiple}]" ${row.selected ? '' : 'disabled'} value="${row.selected ? val : ''}" /> 倍`
              },
            },
            {
              label: '金额',
              name: 'betMoney',
              width: '20%',
              formatter: (val, index, row) => {
                return row.selected ? `<span class="text-prominent">${_(val).convert2yuan()}</span>` : '0'
              },
            },
            {
              label: '开奖时间',
              name: 'formatTicketEndtime',
              width: '20%'
            },
          ],
          startOnLoading: false,
          height: 200,
        },
        chaseList: [],
        selectedChaseList: [],
        pushing: false
      }
    },

    watch: {
      initPlans: {
        handler() {
          this.chaseCreate({init: true})
        }
      },
      planId: {
        handler(newPlan, oldPlan) {
          if (!_.isEmpty(this.plans) && this.plans[0].ticketPlanId === oldPlan) {
            this.$store.commit(types.KICK_CHASE_PLANS)
            if (this.chaseList.length) {
              this.chaseList.splice(0, 1)
            }
          }
        }
      },
      planPrefab: {
        handler(newPlan) {
          this.chasePlans = newPlan
        }
      },
      chaseList: {
        handler() {
          this.selectedChaseList = _.where(this.chaseList, {selected: true})
          this.totalMoney = _.chain(this.selectedChaseList).reduce((total, item) => total + item.betMoney, 0).convert2yuan().value()
        },
        deep: true
      }
    },

    computed: mapState({
      plans: state => state.bettingChase.plans,
      initPlans: state => state.bettingChase.init
    }),

    methods: {
      init() {
        const params = {
          fPreviewList: [],
          singleType: true,
          maxMultiple: 999999,
          basicBettingMoney: 0,
          basicMaxBonus: 0,
        }

        const category = {
          playId: [],
          betMethod: [],
          unit: [],
        }

        params.fPreviewList = _(this.previewList).map((previewInfo) => {
          const info = _({}).extend(previewInfo)
          info.multiple = 1

          if (previewInfo.maxMultiple < params.maxMultiple) {
            params.maxMultiple = previewInfo.maxMultiple
          }

          params.prefabMoney = _(previewInfo.prefabMoney).div(previewInfo.multiple)

          params.basicBettingMoney = _(params.basicBettingMoney).add(params.prefabMoney)
          params.basicMaxBonus = _(params.basicMaxBonus).add(_(previewInfo.formatMaxBonus).div(previewInfo.multiple))

          category.playId.push(previewInfo.playId)
          category.betMethod.push(previewInfo.betMethod)
          category.unit.push(previewInfo.unit)

          return info
        })

        category.playId = _(category.playId).union()
        category.betMethod = _(category.betMethod).union()
        category.unit = _(category.unit).union()

        if (category.playId.length !== 1 || category.betMethod.length !== 1 || category.unit.length !== 1) {
          params.singleType = false
        }

        Object.assign(this, params)

        this.$store.dispatch(types.GET_CHASE_PLANS, {
          ticketId: this.ticketId
        })
      },

      chaseCreate({type = 'normal', init = false} = {}) {
        //生成追号列表，并选中
        if (this.chasePlans > this.chaseList.length) {
          const chasePlans = this.plans.slice(0, this.chasePlans > 15 ? this.chasePlans : 15)

          this.chaseList = _(chasePlans).map((chasePlan, index) => this.$_create(chasePlan, this.chasePlans > index, init))
        } else {
          _(this.chaseList).each((item, index) => item.selected = this.chasePlans > index)
        }

        //按照规则改变倍率
        this.$nextTick(() => {
          let currentGaps = this.gaps
          let times = 1
          let multiple = 1

          _.map(this.selectedChaseList).map(item => {
            if (type === 'multi') {
              if (currentGaps === 0) {
                multiple = Math.pow(this.incMultiple, times)
                ++times
                currentGaps = this.gaps
              }
              --currentGaps
            }

            item.multiple = _(this.startMultiple).mul(multiple)

            if (item.multiple > this.maxMultiple) {
              item.multiple = this.maxMultiple
            }

            item.betMoney = _(this.basicBettingMoney).mul(item.multiple)
          })
        })
      },

      chaseRateCreate() {
        if (this.chasePlans > this.chaseList.length) {
          const chasePlans = this.plans.slice(0, this.chasePlans > 15 ? this.chasePlans : 15)

          this.chaseList = _(chasePlans).map((chasePlan, index) => this.$_create(chasePlan, this.chasePlans > index, false))
        } else {
          _(this.chaseList).each((item, index) => item.selected = this.chasePlans > index)
        }

        this.$nextTick(() => {
          // 基础利润比率
          this.perRateMoneyRate = _(this.basicMaxBonus).div(this.basicBettingMoney)
          // 基础利润金额
          this.perRateMoney = _(this.basicMaxBonus).sub(this.basicBettingMoney)

          if (this.chaseType === 'rate') {
            this.rateCalculate()
          } else {
            this.amountCalculate()
          }
        })
      },

      rateCalculate() {
        // 之前倍数总和
        let prevTotalMultiple = 0

        const rate = _(this.rate).div(100)

        const maxMultiple = this.maxMultiple
        let multiple = this.startMultiple

        const constant = _(rate).chain().add(1).div(this.perRateMoneyRate)
          .value()

        if (constant < 0) {
          return
        }

        _.each(this.selectedChaseList, (item) => {
          this._calculate(item, multiple, prevTotalMultiple)

          if (item.bonusRate < rate) {
            multiple = Math.ceil(_(prevTotalMultiple).chain().mul(constant).div(_(1).sub(constant))
              .value())

            if (multiple > this.maxMultiple) {
              multiple = this.maxMultiple
            }

            this._calculate(item, multiple, prevTotalMultiple)
          }

          if (multiple > maxMultiple || multiple <= 0) {
            return
          }

          prevTotalMultiple += multiple
        })
      },

      amountCalculate() {
        let prevTotalMultiple = 0

        const amount = _(this.amount).formatMul(10000)

        let multiple = this.startMultiple

        let calculate

        _.each(this.selectedChaseList, (item) => {
          this._calculate(item, multiple, prevTotalMultiple)

          if (item.expectBonus < amount) {
            multiple = Math.ceil(_(amount).chain().add(_(this.basicBettingMoney).mul(prevTotalMultiple)).div(this.perRateMoney)
              .value())

            if (multiple > this.maxMultiple) {
              multiple = this.maxMultiple
            }

            calculate = this._calculate(item, multiple, prevTotalMultiple)
          }

          if (multiple > this.maxMultiple || multiple <= 0) {
            return
          }

          prevTotalMultiple += multiple
        })
      },

      _calculate(item, multiple, prevTotalMultiple) {
        // 当期投入
        const betMoney = _(this.basicBettingMoney).mul(multiple)
        // 当期奖金
        const basicMaxBonus = _(this.basicMaxBonus).mul(multiple)
        // 累计投入
        const statisticsMoney = _(this.basicBettingMoney).mul(multiple + prevTotalMultiple)
        // 预期盈利
        const expectBonus = _(basicMaxBonus).sub(statisticsMoney)
        // 利润率
        const bonusRate = _(expectBonus).div(statisticsMoney)

        Object.assign(item, {
          multiple,
          betMoney,
          statisticsMoney,
          basicMaxBonus,
          expectBonus,
          bonusRate,
        })
      },

      clearAll() {
        _.each(this.chaseList, item => item.selected = false)
        $(this.$el).find('#js-bc-select-all').prop('checked', false)
      },

      chaseConfirm() {
        // 腾讯分分彩，金额限制1000元
        if (this.ticketId === 31) {
          const chasePlan = _(this.selectedChaseList).find((item) => {
            return _(item.betMoney).formatDiv(10000) > this.ticketInfo.betAmountLimit
          })
          if (chasePlan) {
            Global.ui.notification.show(`试运行期间，每期单笔投注不超过${this.ticketInfo.betAmountLimit}元。`)
            return false
          }
        }

        this.pushing = true

        this.$store.dispatch('pushChase', {
          plan: this.selectedChaseList,
          suspend: this.suspend,
          amount: this.totalMoney
        })
          .catch(() => {
            this.pushing = false
          })
          .then((res) => {
            this.pushing = false

            if (res && res.result === 0) {
              Global.m.oauth.check()

              this.$emit('chaseComplete')

              Global.ui.notification.show('追号成功！', {
                type: 'success',
              })
            } else {
              Global.ui.notification.show(`追号失败！错误原因：${res.msg}` || '')
            }
          })
      },

      $_create({ticketPlanId, formatTicketEndtime}, selected, init) {
        return {
          ticketPlanId,
          multiple: 1,
          betMoney: this.basicBettingMoney,
          formatTicketEndtime,
          selected: init ? false : selected
        }
      },
    },

    mounted() {
      $(this.$el).on('change', '#js-bc-select-all', (e) => {
        _.each(this.chaseList, item => item.selected = e.target.checked)
      })
      $(this.$el).on('change', '.js-bc-select', (e) => {
        this.chaseList[$(e.currentTarget).closest('tr').index()].selected = e.target.checked
      })

    },

    destroyed() {
      this.$store.commit(types.EMPTY_CHASE_PLANS)
    }
  }
</script>

<style lang="scss">


  .modal-chase {
    border: 0;
    width: 850px;
    height: 550px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    .modal-header {
      height: 40px;
      background-color: #f0f0f0;
      padding: 10px 0 10px 20px;
      font-size: 16px;
      border-bottom: 1px solid #d7d7d7;
    }
    .setting-icon {
      background: url(misc/chips-setting.png);
      display: inline-block;
      width: 26px;
      height: 27px;
      vertical-align: middle;
    }

    .modal-body {
      width: 100%;
      border-radius: 9px;
      background: transparent;
      padding: 0 25px;
      flex-grow: 1;
    }
    .modal-footer {
      border-top: 1px solid $def-line-color;
      padding-top: 0;
      padding-bottom: 0;
    }

    .chase-nav {
      height: 30px;
      display: inline-block;
      position: relative;
      top: 8px;
      margin-left: 40px;

      li {
        height: 30px;
        line-height: 30px;
      }

      > li > a {
        height: 30px;
        line-height: 30px;
        background: transparent;
        border-radius: 15px;
        padding: 0 10px;
      }
      &.nav > li:hover, &.nav > li.active {
        a {
          background: $new-main-deep-color;
          color: #dbf5f6;
        }
      }
    }

    .chase-input {
      padding: 4px 5px 5px;
      text-align: center;
      vertical-align: top;
      border-radius: 30px;
      width: 60px;
    }

    .chase-create {
      padding: 7px 15px;
      border-radius: 50px;
      margin-top: -2px;
    }
    .chase-search-form {
      padding: 25px 30px;
      margin: 0;
    }

    .chase-table {
      thead {
        background: #ffffff;
        border-bottom: 1px solid $sec-line-color;
      }

      thead th {
        background: #ffffff;
      }

      tbody td {
        padding: 7px 0;
      }
    }
    .control-label {
      margin-top: 3px;
    }
    .control-group {
      font-size: 14px;
    }
  }

</style>
