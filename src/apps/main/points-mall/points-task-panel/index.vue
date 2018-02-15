<template>
  <div class="points-task-panel">
    <div class="point-task-cell">
      <div class="daily-prize">
        <div class="sfa-task-daily">
          <div class="task-tip">
            （说明：日任务每日一更新）
          </div>
        </div>
      </div>
      <div class="point-nav-panel">
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
      </div>
    </div>
    <div class="point-task-cell">
      <div class="daily-prize">
        <div class="sfa-task-weekly">
          <div class="task-tip">
            （说明：周任务每周一更新）
          </div>
        </div>
      </div>
      <div class="point-nav-panel">
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
        <task-card :max="5000" :value="100" title="累计充值">
          <span slot="brief">
            当天累计充值达<span class="text-val">5000</span>元，奖励积分<span class="text-val">400</span>
          </span>
          <span slot="icon" class="sfa-daily-charge"></span>
          <button slot="btn" class="">立即领取</button>
        </task-card>
      </div>
    </div>

  </div>
</template>

<script>

  import TaskCard from './task-card'

  export default {
    name: 'points-task',

    components: {
      TaskCard,
    }
  }
</script>

<style lang="scss" scoped>

</style>
