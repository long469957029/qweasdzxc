<template>
  <div class="points-task-panel">
    <div class="point-task-cell">
      <div class="daily-prize">
        <div class="task-overview sfa-pt-task-daily">
          <div class="task-tip">
            （说明：日任务每日一更新）
          </div>
        </div>
      </div>
      <status-cell class="point-nav-panel" :status="loadingStatus">
        <task-card v-for="task in fDaily" :key="task.termId" :max="task.fTermThrehold" :value="task.fCurrentAmount" :title="task.termName">
          <span slot="brief" class="card-brief">
            当天{{task.termName}}达<span class="text-val">{{task.fTermThrehold}}</span>元，
            <template v-if="task.termBonusType === 1">
            奖励积分<span class="text-val">{{task.fTermBonus}}</span>
            </template>
            <template v-else>
            奖励现金<span class="text-val">{{task.fTermBonus}}元</span>
            </template>
          </span>
          <span slot="icon" class="sfa" :class="`sfa-pt-${task.icon}`"></span>
          <button slot="btn" class="receive-btn btn"
                  :class="{'received-btn': task.receiveState === ReceiveState.RECEIVED}" @click="receive($event, task)"
                  :disabled="task.receiveState === ReceiveState.RECEIVED || task.receiveState === ReceiveState.CANT_RECEIVE">
            {{task.receiveState === ReceiveState.RECEIVED ? '已领取' : '立即领取'}}
          </button>
        </task-card>
      </status-cell>
    </div>
    <div class="point-task-cell">
      <div class="daily-prize">
        <div class="task-overview sfa-pt-task-weekly">
          <div class="task-tip">
            （说明：周任务每周一更新）
          </div>
        </div>
      </div>
      <status-cell class="point-nav-panel" :status="loadingStatus">
        <task-card v-for="task in fWeek" card-type="prominent" :key="task.termId" :max="task.fTermThrehold" :value="task.fCurrentAmount" :title="task.termName">
          <span slot="brief" class="card-brief">
            当周{{task.termName}}达<span class="text-val">{{task.fTermThrehold}}</span>元，
            <template v-if="task.termBonusType === 1">
            奖励积分<span class="text-val">{{task.fTermBonus}}</span>
            </template>
            <template v-else>
            奖励现金<span class="text-val">{{task.fTermBonus}}元</span>
            </template>
          </span>
          <span slot="icon" class="sfa" :class="`sfa-pt-${task.icon}`"></span>
          <button slot="btn" class="receive-btn btn week"
                  :class="{'received-btn': task.receiveState === ReceiveState.RECEIVED}" @click="receive($event, task)"
                  :disabled="task.receiveState === ReceiveState.RECEIVED || task.receiveState === ReceiveState.CANT_RECEIVE">
            {{task.receiveState === ReceiveState.RECEIVED ? '已领取' : '立即领取'}}
          </button>
        </task-card>
      </status-cell>
    </div>

  </div>
</template>

<script>
  import {missionListApi, missionReceiveApi} from 'api/points'

  import TaskCard from './task-card'

  /**
   * 领取状态
   * @readonly
   * @const
   * @enum {{CAN_RECEIVE: number, CANT_RECEIVE: number, RECEIVED: number}}
   */
  const ReceiveState = {
    CAN_RECEIVE: 1,
    CANT_RECEIVE: 2,
    RECEIVED: 3,
  }

  const TaskType = {
    '101': {
      icon: 'daily-charge'
    },
    '102': {
      icon: 'daily-betting'
    },
    '103': {
      icon: 'daily-prize'
    },
    '104': {
      icon: 'daily-loss'
    },
    '201': {
      icon: 'weekly-charge'
    },
    '202': {
      icon: 'weekly-betting'
    },
    '203': {
      icon: 'weekly-prize'
    },
    '204': {
      icon: 'weekly-loss'
    },
  }

  export default {
    name: 'points-task',

    components: {
      TaskCard,
    },

    data() {
      return {
        fDaily: [],
        fWeek: [],
        ReceiveState,
        loadingStatus: 'loading',
      }
    },

    computed: {
      daily: {
        set(val) {
          this.fDaily = this.$_taskFormatter(val)
        },
        get() {
          return this.fDaily
        }
      },
      week: {
        set(val) {
          this.fWeek = this.$_taskFormatter(val)
        },
        get() {
          return this.fWeek
        }
      },
    },

    methods: {
      getData({loading = true} = {loading: true}) {
        if (loading) {
          this.loadingStatus = 'loading'
        }

        window.abc = missionListApi(({data}) => {
          if (data && data.result === 0) {
            this.daily = data.root.daily
            this.week = data.root.week
          }
        })
          .finally(() => {
            if (loading) {
              this.loadingStatus = 'completed'
            }
          })
      },
      receive($event, {termId, termBonusType}) {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行此操作，请先注册正式游戏账号',{modalDialogShadow:'modal-dialog-shadow'})
          return false
        }
        let html = '恭喜您成功领取积分'
        let unit = ''
        if (termBonusType == 2) {
          html = '恭喜您成功领取现金'
          unit = '元'
        }

        missionReceiveApi({
          termId,
        }, ({data}) => {
          if (data && data.result === 0) {
            Global.ui.notification.show(`<div class="m-bottom-lg">${html}${_.convert2yuan(data.root.reveiveIntegral)}${unit}</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 2000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })

            this.getData({loading: false})
            this.$store.dispatch(types.CHECK_LOGIN_STATUS)
          } else {
            Global.ui.notification.show(res.msg)
          }
        })
      },

      $_taskFormatter(daily) {
        return _.map(daily, (task) => {
          //
          let receiveState
          if (task.status === 0) {
            if (task.currentAmount >= task.termThrehold) {
              receiveState = ReceiveState.CAN_RECEIVE
            } else {
              receiveState = ReceiveState.CANT_RECEIVE
            }
          } else {
            receiveState = ReceiveState.RECEIVED
          }
          Object.assign(task, {
            fCurrentAmount: _.convert2yuan(task.currentAmount),
            fTermBonus: _.convert2yuan(task.termBonus),
            fTermThrehold: _.convert2yuan(task.termThrehold),
            receiveState,
            ...TaskType[task.termId]
          })

          return task
        })
      }
    },

    mounted() {
      this.getData()
    }
  }
</script>

<style lang="scss" scoped>

  .point-task-cell {
    display: flex;
    margin-bottom: 45px;
  }

  .daily-prize {
    display: flex;
  }

  .task-tip {
    font-size: 14px;
    color: #999999;
    margin-top: -61px;
  }

  .task-overview {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 22px;
  }

  .point-nav-panel {
    display: flex;
    flex-flow: row wrap;
    flex: 1;
    justify-content: space-between;
    align-content: space-between;
  }

  .task-card {
    width: 415px;
    height: 160px;
    background-color: #ffffff;
    border-radius: 5px;
    border: solid 1px #e6e6e6;
    display: flex;
    box-sizing: border-box;
    padding: 20px 20px;
  }

  .points-task-panel {
    padding-top: 60px;
  }

  .receive-btn {
    width: 94px;
    height: 30px;
    font-size: 12px;
    border: 1px solid #808da6;
    background-color: #808da6;
    border-radius: 15px;


    &[disabled] {
      background-color: #ced7ea;
      border: 1px solid #ced7ea;
      border-radius: 15px;
      color: #ffffff;
      cursor: not-allowed;
      opacity: 1;
    }
    &.week {
      border: 1px solid #eedcc7;
      background-color: #eedcc7;
    }

    &.received-btn {
      background-color: #b8b8ba;
      border-radius: 15px;
      cursor: not-allowed;
      &.week {
        border: 1px solid #d9a262;
        background-color: #d9a262;
      }
    }
  }
  .status-cell {
    justify-content: center;
    align-items: center;
    align-content: center;
  }

</style>
