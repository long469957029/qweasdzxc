<template>
  <transition mode="out-in"
    enter-active-class="animated-02s fadeIn"
    leave-active-class="animated-02s fadeOut">
    <div class="status-cell" v-if="status === 'loading'" key="status-loading" :style="`height: ${height}`">
      <div class="loading-contianer">
        <div class="ring"></div>
        <p>{{loadingTip}}</p>
      </div>
    </div>
    <div class="status-cell" v-else-if="!hasData" key="status-empty" :style="`height: ${height}`">
      <div class="empty-container">
        <div class="empty-icon"></div>
        <p>{{emptyTip}}</p>
      </div>
    </div>
    <component :is="tag" v-else>
      <slot></slot>
    </component>
  </transition>
</template>

<script>
  export default {
    name: 'status-cell',

    // render(createElement) {
    //   if (this.hasData) {
    //     return createElement(
    //       this.tag
    //     )
    //   } else {
    //     return createElement(
    //       'div', {
    //         'class': {
    //           status: true
    //         }
    //       }
    //     )
    //   }
    // },

    props: {
      hasData: {
        Type: Boolean,
        default: true,
      },
      //loading completed
      status: {
        default: 'loading'
      },
      loadingTip: {
        default: '加载中，请稍后...',
      },
      emptyTip: {
        default: '亲，暂时没有记录!'
      },
      tag: {
        type: String,
        default: 'div'
      },
      height: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .status-cell {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ring {
    width: 10px;
    height: 10px;
    margin: 15px auto;
    padding: 10px;
    border: 7px dashed #4b9cdb;
    border-radius: 100%;
    animation: loadingD 1.5s cubic-bezier(.17, .37, .43, .67) infinite;
  }

  @keyframes loadingD {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  //空表单页面
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .empty-icon {
      background-image: url(./empty.png);
      width: 204px;
      height: 174px;
      margin-bottom: 15px;
    }
  }

  p {
    font-size: 14px;
    color: #666666;
  }
</style>
