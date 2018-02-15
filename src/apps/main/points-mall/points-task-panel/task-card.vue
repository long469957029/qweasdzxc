<template>
  <div class="task-card">
    <div class="task-card-icon">
      <slot name="icon"></slot>
    </div>
    <div class="task-card-main">
      <div class="task-card-title">{{title}}</div>
      <slot name="brief" class="task-card-brief"></slot>
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" :style="`width: ${percent}%`"></div>
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
      }
    },

    computed: {
      percent() {
        return _.chain(this.value).formatDiv(max).mul(100).value()
      }
    }
  }
</script>

<style scoped>

</style>
