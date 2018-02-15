<template>
  <div class="task-card">
    <div class="task-card-icon">
      <slot name="icon"></slot>
    </div>
    <div class="task-card-main">
      <div class="task-card-title">{{title}}</div>
      <slot name="brief" class="task-card-brief"></slot>
      <div class="progress-panel">
        <div class="progress">
          <div class="progress-bar progress-bar-striped active" :class="style.progressbarStyle" :style="`width: ${percent}%`"></div>
        </div>
        <div class="progress-val">
          <span :class="style.progressStyle">{{value}}</span> / {{max}}
        </div>
      </div>
      <div class="task-btn">
        <slot name="btn"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'task-card',

    props: {
      title: {
        type: String,
        required: true
      },
      max: {
        type: Number,
        default: 1000,
      },
      value: {
        type: Number,
        default: 0,
      },
      cardType: {
        type: String,
        default: 'purple'
      }
    },

    computed: {
      style() {
        if (this.cardType === 'purple') {
          return {
            progressStyle: 'text-cool',
            progressbarStyle: 'progress-bar-purple'
          }
        } else {
          return {
            progressStyle: 'text-prominent',
            progressbarStyle: 'progress-bar-prominent'
          }
        }
      },
      percent() {
        return _.chain(this.value).formatDiv(this.max).mul(100).value()
      }
    }
  }
</script>

<style lang="scss" scoped>

  .task-card-icon {
    padding-right: 20px;
  }
  .task-card-title {
    font-size: 16px;
    color: #666666;
    margin-bottom: 10px;
  }

  .progress-panel {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .progress {
    height: 8px;
    width: 180px;
    margin-bottom: 0;
    flex: 1;
    margin-right: 5px;
  }

  .card-brief {
    color: #999999;
  }

  .text-val {
    color: #333333;
  }

  .progress-val {
    color: #999999;
  }

</style>
