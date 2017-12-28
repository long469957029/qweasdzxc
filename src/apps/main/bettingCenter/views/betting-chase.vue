<template>
  <div class="js-bc-chase-container">
    <ul class="js-view-tabs view-tabs nav nav-tabs nav-tabs-border">
      <li class="active">
        <a href="#jsBcChaseNormal" data-toggle="tab" data-index="0" data-name="normal">
          <span>普通追号</span>
        </a>
      </li>
      <li v-if="singleType">
        <a href="#jsBcChaseProfit" data-toggle="tab" data-index="1" data-name="profit">
          <span>利润追号</span>
        </a>
      </li>
    </ul>

    <div class="view-container tab-content">
      <div id="jsBcChaseNormal" class="tab-pane fade in active">
        <div>
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

          <div class="text-center clearfix basic-inverse padding-smd">
            <div class="pull-left">
              <label>
                <span class="custom-checkbox checkbox-inverse" style="margin-top: 8px">
                  <input type="checkbox" id="js-bc-chase-1" class="js-bc-chase-suspend" checked />
                  <label class="checkbox-label" for="js-bc-chase-1"></label>
                </span>
                中奖后停止追号
              </label>
            </div>
            <div class="pull-right">
              <span class="m-right-sm">追号总期数：
                <span class="text-pleasant">
                  <span class="js-bc-chase-total">0</span> 期
                </span>
                追号总金额 ：
                <span class="text-pleasant">
                  <span class="js-bc-chase-total-money">0.00</span>元
                </span>
              </span>
              <button type="button" class="js-bc-chase-submit btn btn-cool btn-lg font-lg" data-loading-text="投注中">确定投注</button>
            </div>
          </div>
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
                             data-monitor-type="number" value="5" />
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

        <div class="text-center clearfix basic-inverse padding-smd">
          <div class="pull-left">
            <label>
              <span class="custom-checkbox checkbox-inverse" style="margin-top: 8px">
                <input type="checkbox" id="<%=obj.id %>" class="js-bc-chase-suspend" checked />
                <label class="checkbox-label" for="<%=obj.id %>"></label>
              </span>
              中奖后停止追号
            </label>
          </div>
          <div class="pull-right">
            <span class="m-right-sm">追号总期数：
              <span class="text-pleasant">
                <span class="js-bc-chase-total">0</span> 期
              </span>
              追号总金额 ：
              <span class="text-pleasant">
                <span class="js-bc-chase-total-money">0.00</span>元
              </span>
            </span>
            <button type="button" class="js-bc-chase-submit btn btn-cool btn-lg font-lg" data-loading-text="投注中">确定投注</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-chase",

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
      }
    }
  }
</script>

<style scoped>

</style>
