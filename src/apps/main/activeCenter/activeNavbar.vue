<template>
  <div class="aa-navbar">
    <transition-group name="option-list">
      <div
        v-for="(option, index) in activityOptionList"
        :class="`query-option option-${index + 1} ${isFetching ? 'disabled' : ''}`"
        :key="`option-${option.type}`"
        :data-type="option.type"
        :data-name="option.name"
        data-position="0"
        @click="queryChange($event)"
      >{{option.name}}</div>
    </transition-group>
    <div class="dot-bg"></div>
    <transition name="main-option">
      <div class="query-option main" v-if="selectActivityOption">{{selectActivityOption.name}}</div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'active-navbar',
  props: ['activityType', 'isFetching'],

  data() {
    return {
      activityOptionList: [
        { type: 1, name: '捕鱼'},
        { type: 2, name: '真人'},
        { type: 3, name: '老虎机'},
        { type: 4, name: '彩票'},
        { type: 5, name: '节日'},
        { type: 6, name: '其他'},
      ],
      selectActivityOption: { type: '', name: '全部' },
    }
  },

  methods: {
    queryChange(event) {
      if (this.isFetching) {
        return
      }
      const activityType = event.currentTarget.dataset.type
      const activityTypeName = event.currentTarget.dataset.name

      // 变更选项排列顺序
      this.changeActivityList(activityTypeName, activityType)

      // 获取资料
      this.$emit('fetchData', activityType)
    },
    changeActivityList(activityTypeName, activityType) {
      if (activityTypeName === this.selectActivityOption.name) {
        return
      }
      const vm = this
      const currentPosition = _.findIndex(this.activityOptionList, { name: activityTypeName })
      const fillingPosition = activityType - 1
      this.activityOptionList.splice(currentPosition, 1) // 拿掉
      this.activityOptionList.push({type: this.selectActivityOption.type, name: this.selectActivityOption.name}) // 填入最尾端

      // 变更中间选项资料，使用了 v-if ，他要data改变足够时间才会有过渡效果
      this.selectActivityOption = null
      setTimeout(function() {
        vm.selectActivityOption = {type: activityType, name: activityTypeName}
      }, 100)

    },
  }
}
</script>

<style lang="scss" scoped>
  .aa-navbar {
    width: 1200px;
    height: 90px;
    margin: 40px auto 30px;
    position: relative;

    .dot-bg {
      width: 630px;
      height: 7px;
      background: url('./misc/dot-bg.png');
      margin: 0 auto;
      position: absolute;
      left: 0;
      right: 0;
      top: 41px;
      z-index: 0;
    }

    .query-option {
      width: 61px;
      height: 61px;
      line-height: 61px;
      position: absolute;
      border-radius: 100%;
      background: $main-deep-color;
      font-size: 14px;
      margin: 0 15px;
      text-align: center;
      border: 4px solid #dcdcdc;
      cursor: pointer;
      z-index: 1;
      top: 10px;

      &.disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      &.option-1 {
        left: 187px;
      }

      &.option-2 {
        left: 291px;
      }

      &.option-3 {
        left: 398px;
      }

      &.option-4 {
        left: 701px;
      }

      &.option-5 {
        left: 808px;
      }

      &.option-6 {
        left: 917px;
      }

      &.main {
        position: absolute;
        width: 80px;
        height: 80px;
        line-height: 80px;
        font-size: 18px;
        border: 4px solid white;
        box-shadow: 0 0 5px 2px #dcdcdc;
        left: 541px;
        top: 0px;
      }
    }

    .main-option-enter-active {
      animation: bounceIn .6s forwards;
    }

    @keyframes bounceIn {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1);
      }
    }

    .query-option, .options {
      transition: transform 1s, background .3s;
      display: inline-block;
      margin-right: 10px;
    }
    .option-list-enter, .option-list-leave-to {
      opacity: 0;
      transform: translateY(30px);
    }
    .option-list-leave-active {
      position: absolute;
    }
  }
</style>
