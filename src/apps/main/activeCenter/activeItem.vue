<template>
  <span class="item-container">
    <figure v-is-in-view></figure>
    <div
      class="item"
      v-for="(activity, key, index) in filterActivityList"
      :key="activity.rid"
      v-is-in-view="{
        showIfPartial: true,
        callback: visibilityChanged
      }">
      <div :class="{ badge: true, 'not-ready': activity.activityStatus === 0, gray: activity.activityStatus === 2}">{{statusNameList[activity.activityStatus]}}</div>
      <div :class="{ mask: true, transparent: (activity.activityStatus !== 0)}"></div>
      <img :class="{ thumb: true, gray: (activity.activityStatus === 2)}" :src="activity.bannerListUrl">
      <div class="item-title">{{activity.title}}</div>
      <div class="item-desc">{{activity.summary}}</div>
      <div class="bottom-container">
        <div class="item-date">
          <div class="clock-icon"></div>
          {{timeRange(activity.startDate, activity.endDate)}}
        </div>
        <a class="item-btn" :href="activity.linkUrl" v-if="activity.linkUrl !== ''">查看详情</a>
        <button :class="{'item-btn': true, disabled: activity.activityStatus === 2, pendding: isFetching}" :data-rid="activity.rid" @click="checkDetail" v-else>查看详情</button>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'active-item',

  data() {
    return {
      statusNameList: ["即将开始", "进行中", "已结束"],
    }
  },

  props: ['filterActivityList', 'isFetching'],
  methods: {
    timeRange(startDate, endDate) {
      return `${_(startDate).toDate()} ~ ${_(endDate).toDate()}`
    },

    visibilityChanged(element) {
      if (!element) {
        return
      }
      element.classList.add('item-fade')
    },

    checkDetail(event) {
      if (this.isFetching || event.currentTarget.classList.contains('disabled')) {
        return
      }

      const rid = event.currentTarget.dataset.rid
      this.$emit('openDetailDialog', rid)
    }
  }
}
</script>

<style lang="scss" scoped>
  .item-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    min-height: 360px;
  }

  figure {
    position: absolute;
  }

  .item {
    width: 530px;
    height: 360px;
    margin-bottom: 40px;
    border-radius: 3px;
    box-shadow: 0 0 20px 3px #dcdcdc;
    background: white;
    position: relative;
    transition: all 1s;
    transform: translateX(-50px);
    opacity: 0;

    &:nth-child(odd) {
      transform: translateX(50px);
    }

    &.item-fade {
      transform: translateX(0px);
      opacity: 1;
    }
  }



  .clock-icon {
    background: url('./misc/clock-icon.png');
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: bottom;
    margin-right: 3px;
  }

  .badge {
    position: absolute;
    top: 15px;
    left: 0;
    width: 82px;
    height: 49px;
    text-align: center;
    font-size: 14px;
    color: white;
    border-top-right-radius: 25px;
    border-bottom-right-radius: 25px;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    z-index: 2;
    line-height: 49px;

    &.not-ready {
      background: rgba(20, 177, 187, 0.5);
    }

    &.gray {
      background: #666;
    }
  }

  .mask {
    background: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 230px;
    z-index: 1;
    position: absolute;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    &.transparent {
      background: transparent;
    }
  }

  .thumb {
    width: 530px;
    height: 230px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    &.gray {
      filter: grayscale(100%);
    }
  }

  .item-title {
    font-size: 16px;
    color: #333;
    margin-top: 15px;
    margin-left: 15px;
  }

  .item-desc {
    font-size: 14px;
    color: #999;
    margin-top: 15px;
    margin-left: 15px;
  }

  .item-date {
    font-size: 12px;
    color: #666;
    margin-left: 15px;
  }

  .bottom-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .item-btn {
    width: 96px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: $main-deep-color;
    color: white;
    font-size: 14px;
    outline: none;
    border: none;
    border-radius: 3px;
    margin-right: 15px;
    transition: all 0.3s;

    &:hover,
    &:active {
      background: darken($main-deep-color, 10%);
    }

    &.pendding, &.disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
</style>
