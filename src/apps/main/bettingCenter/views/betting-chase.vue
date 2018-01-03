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
              <input name="chasePlans" type="text" class=" chase-input js-gl-monitor bc-monitor"
                     data-monitor-type="number" v-model="chasePlans" ref="chasePlans" />
              期
              <label class="control-label m-left-lg">起始倍数</label>
              <input name="startMultiple" type="text" class="chase-input"
                     v-model="startMultiple" /> 倍
              <button type="button" class="chase-create btn btn-cool pull-right" data-loading-text="生成中" @click="chaseCreate">生成追号计划</button>
            </div>
          </form>

          <static-grid :table-class="lotteryGridOps.tableClass" :col-model="lotteryGridOps.colModel" :height="lotteryGridOps.height" :emptyTip="lotteryGridOps.emptyTip" :rows="chaseList" ref="normalGrid"></static-grid>
        </div>

        <div id="jsBcChaseMulti" class="tab-pane fade">
          <div class="portlet-filter">
            <div class="portlet portlet-inverse no-m-bottom">
              <div class="portlet-body">
                <form class="js-bc-chase-normal-table form-inline no-margin row" action="javascript:void(0)">
                  <div class="control-group">
                    <div class="control-inline">
                      <label class="control-label">起始期号：</label>
                      <select class="bc-chase-normal-planId" name="startPlanId">
                        <option v-for="(plan, index) in plans" :value="plan.ticketPlanId">{{plan.ticketPlanId + (index === 0 ? '（当前期）' : '')}}</option>
                      </select>
                    </div>
                    <div class="control-inline">
                      <label class="control-label">追：</label>
                      <input name="chasePlans" type="text" class="js-gl-monitor bc-monitor"
                             data-monitor-type="number" value="5" ref="chasePlans" />
                      <label class="control-label">期（包含当前期最多可追<span>{{plans.length}}</span>期）</label>
                    </div>
                  </div>
                  <div class="control-group no-margin">
                    <div class="control-inline">
                      <label class="control-label">起始倍数：</label>
                      <input name="startMultiple" type="text" class="js-bc-start-multiple bc-monitor"
                             data-monitor-type="number" value="1" />
                    </div>
                    <div class="control-inline">
                      <label class="control-label">隔：</label>
                      <input name="gaps" type="text" class="js-bc-gaps js-gl-monitor bc-monitor"
                             data-monitor-type="number" data-monitor-range="[1, 99999]" value="1" />
                      <label class="control-label">期</label>
                    </div>

                    <div class="control-inline">
                      <label class="control-label">倍数X：</label>
                      <input name="incMultiple" type="text" class="js-bc-inc-multiple js-gl-monitor bc-monitor"
                             data-monitor-type="number" data-monitor-range="[1, 99999]" value="1" />
                    </div>
                    <button type="button" class="js-bc-chase-create bc-chase-create btn btn-cool btn-lg pull-right" data-loading-text="生成中">生成追号</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="dot-divider dot-divider-sm"></div>
          <div class="portlet-filter">
            <div class="js-bc-chase-normal-container"></div>
          </div>
        </div>

        <div id="jsBcChaseProfit" class="tab-pane fade " v-if="singleType">
          <div class="portlet-filter">
            <div class="portlet portlet-inverse no-m-bottom">
              <div class="portlet-inner">
                <div class="portlet-body">
                  <form class="js-bc-chase-profit-table form-inline no-margin row" action="javascript:void(0)">
                    <div class="control-group">
                    <span class="control-inline">
                      <label class="control-label">起始期号：</label>
                      <select class="bc-chase-normal-planId" name="startPlanId">
                        <option v-for="(plan, index) in plans" :value="plan.ticketPlanId">{{plan.ticketPlanId + (index === 0 ? '（当前期）' : '')}}</option>
                      </select>
                    </span>
                      <span>
                      <label class="control-label">追：</label>
                      <input name="chasePlans" type="text" class="js-gl-monitor bc-monitor"
                             data-monitor-type="number" :value="planPrefab" />
                      <label class="control-label">期（包含当前期最多可追<span>{{plans.length}}</span>期）</label>
                    </span>

                      <span class="pull-right">
                      <label class="control-label">起始倍数</label>
                      <input name="startMultiple" type="text" class="js-bc-start-multiple bc-monitor"
                             data-monitor-type="number" value="1" />
                    </span>
                    </div>
                    <div class="control-group">
                      <div class="js-bc-profit-normalRate js-bc-profit-area inline-block control-inline">
                        <div class="custom-radio radio-inverse">
                          <input type="radio" id="jsBcChaseType1" class="js-bc-chaseType" name="chaseType" value="normalRate">
                          <label for="jsBcChaseType1"></label>
                        </div>
                        利润率
                        <label class="radio"></label>
                        <input name="rate" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 99999]" value="10" /> %
                      </div>

                      <div class="js-bc-profit-advanceRate js-bc-profit-area inline-block">
                        <div class="custom-radio radio-inverse">
                          <input type="radio" id="jsBcChaseType2" class="js-bc-chaseType" name="chaseType" value="advanceRate">
                          <label for="jsBcChaseType2"></label>
                        </div>
                        前
                        <input name="prevPlans" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 240]" value="5" />
                        期利润率
                        <input name="prevRate" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 99999]" value="10" />
                        %，之后利润率
                        <input name="afterRate" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 99999]" value="5" />
                        %
                      </div>
                    </div>
                    <div class="control-group no-margin">
                      <div class="js-bc-profit-normalAmount js-bc-profit-area inline-block control-inline bc-profit-normalAmount">
                        <div class="custom-radio radio-inverse">
                          <input type="radio" id="jsBcChaseType3" class="js-bc-chaseType" name="chaseType" value="normalAmount">
                          <label for="jsBcChaseType3"></label>
                        </div>
                        利润金额
                        <input name="amount" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 999999]" value="100" />
                        元
                      </div>

                      <div class="js-bc-profit-advanceAmount js-bc-profit-area inline-block">
                        <div class="custom-radio radio-inverse">
                          <input type="radio" id="jsBcChaseType4" class="js-bc-chaseType" name="chaseType" value="advanceAmount">
                          <label for="jsBcChaseType4"></label>
                        </div>
                        前
                        <input name="prevPlans" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 240]" value="5" />
                        期利润金额
                        <input name="prevAmount" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 999999]" value="100" />
                        元，之后利润金额
                        <input name="afterAmount" type="text" class="input-xs js-gl-monitor"
                               data-monitor-type="number" data-monitor-range="[1, 999999]" value="50" />
                        元
                      </div>
                      <button type="button" class="js-bc-chase-create bc-chase-create btn btn-cool btn-lg pull-right" data-loading-text="生成中">生成追号</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="dot-divider dot-divider-sm"></div>
          <div class="portlet-filter">
            <div class="js-bc-chase-profit-container"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <div class="text-center clearfix basic-inverse padding-smd">
        <div class="pull-left">
          <span class="m-right-lg font-sm">共追号
            <span class="text-cool">{{_.find(chaseList, {selected: true}).length}}</span>
            期，金额
            <span class="text-orange">{{_.chain(chaseList).find({selected: true}).reduce((total, item) => total + item.betMoney, 0)}}</span>
            元
          </span>
        </div>
        <div class="pull-left">
          <label>
                <span class="custom-checkbox">
                  <input type="checkbox" id="js-bc-chase-1" class="js-bc-chase-suspend" checked />
                  <label class="checkbox-label" for="js-bc-chase-1"></label>
                </span>
            中奖后停止追号
          </label>
        </div>
        <div class="pull-right">
          <button type="button" class="btn btn-white btn-lg font-sm">清除追号</button>
          <button type="button" class="btn btn-orange btn-lg font-sm" data-loading-text="投注中">确定投注</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RadioGroup from 'com/RadioGroup/index.vue'

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

    data: function() {
      return {
        fPreviewList: [],
        singleType: true,
        maxMultiple: 999999,
        basicBettingMoney: 0,
        basicMaxBonus: 0,
        planPrefab: 5,
        chasePlans: 5,
        startMultiple: 5,
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
<input type="checkbox" id="a1" name="selectAll" value=""> <label for="a1" class="checkbox-label"></label></span>追号期数</label>`,
              name: 'ticketPlanId',
              width: '30%',
              formatter: (val, index) => {
                const id = _.uniqueId()
                let fVal = `<label class="no-margin font-xs inline-block"><span class="custom-checkbox">
<input type="checkbox" id="${id}" name="selectAll" value=""> <label for="${id}" class="checkbox-label"></label></span>${val}</label>`
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
              formatter: (val) => {
                return `${'<input type="text" class="js-bc-single-plan-multiple js-gl-monitor input-xs text-circle" ' +
                'data-monitor-type="number" data-monitor-range="[1, '}${this.maxMultiple}]" value="${val}" /> 倍`
              },
            },
            {
              label: '金额',
              name: 'betMoney',
              width: '20%',
              formatter: (val) => {
                return _(val).convert2yuan()
              },
            },
            {
              label: '累计投入',
              name: 'statisticsMoney',
              width: '20%',
              formatter: (val) => {
                return _(val).convert2yuan()
              },
            },
          ],
          startOnLoading: false,
          height: 200,
        },
        chaseList: [],
      }
    },

    watch: {
      planId: {
        handler(newPlan, oldPlan) {
          if (!_.isEmpty(this.plans) && this.plans[0].ticketPlanId === oldPlan) {
            this.plans.splice(0, 1)
          }
        }
      },
      planPrefab: {
        handler(newPlan) {
          this.chasePlans = newPlan
        }
      }
    },

    computed: mapState({
      plans: state => state.bettingChase.plans
    }),

    mounted: function() {
    },

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
      chaseCreate() {
        const chasePlans = this.plans.slice(0, this.chasePlans)

        this.chaseList = _(chasePlans).map((chasePlan) => {

          const calculate = this.$_calculate(chasePlan.ticketPlanId, 1)

          return calculate
        })
      },

      $_calculate(ticketPlanId, multiple) {
        multiple = _(this.startMultiple).mul(multiple)

        if (multiple > this.maxMultiple) {
          multiple = this.maxMultiple
        }

        const betMoney = _(this.basicBettingMoney).mul(multiple)

        return {
          ticketPlanId,
          multiple,
          betMoney,
          selected: false
        }
      },
    }
  }
</script>

<style lang="scss">
  @import
  "~base/styles/variable";

  .modal-chase {
    border: 0;
    width: 850px;
    height: 550px;
    background-color: #ffffff;
    .modal-header {
      height: 40px;
      background-color: #f0f0f0;
      padding: 10px 0 10px 20px;
      font-size: 16px;
      border-bottom: 1px solid #d7d7d7;
    }
    .setting-icon {
      background: url(../misc/chips-setting.png);
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
    }
    .modal-footer {
      margin-top: 84px;
      border-top: 1px solid $def-line-color;
      padding-top: 0;
    }
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
    padding: 7px 5px 6px;
    text-align: center;
    vertical-align: top;
    border-radius: 30px;
    width: 60px;
  }

  .chase-create {
    padding: 8px 15px;
    border-radius: 50px;
    margin-top: -2px;
  }
  .chase-search-form {
    padding: 25px 30px;
    border-bottom: 1px solid $def-line-color;
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
</style>
