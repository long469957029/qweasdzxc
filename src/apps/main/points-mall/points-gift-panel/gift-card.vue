<template>
  <div class="gift-card" :class="[{finished: isFinished}]">
    <div class="gift-card-main">
      <div class="card-badge sfa-gift-level" v-if="levelLimit > 0">
        LV{{levelLimit}}
        <template v-if="1 === limitLevelType">以上</template>
        <template v-else>专享</template>
      </div>
      <div class="card-left" v-if="maxNum && maxNum - useNum > 0">剩{{maxNum - useNum}}</div>
      <div v-else-if="isFinished" class="sfa-finished"></div>
      <img  class="gift-card-img" :src="picUrl" />
      <div class="card-intro">
        <div class="card-title">
          {{itemName}}
        </div>
        <div class="card-price">
          <span class="card-price-title">参考价：</span>
          <span class="card-price-val">¥{{refPrice | convert2yuan}}</span>
        </div>
        <div class="card-brief">
          {{itemDesc}}
        </div>
      </div>
    </div>
    <div class="gift-card-op">
      <div class="card-points">
        <span class="sfa sfa-points"></span>
        兑换积分：
        <span class="card-points-val">{{requireIntegral | convert2yuan}}</span>
      </div>
      <button class="btn btn-exchange-btn" @click="$emit('exchange')">立即兑换</button>
    </div>
    <div class="gift-masking" :class="{finished: isFinished}"></div>
  </div>
</template>

<script>
  export default {
    name: 'gift-card',

    props: [
      'itemDesc',
      'itemName',
      'levelLimit',
      'limitLevelType',
      'picUrl',
      'refPrice',
      'requireIntegral',
      'useNum',
      'maxNum',
    ],

    computed: {
      isFinished() {
        return this.maxNum && this.maxNum - this.useNum === 0
      },
    },
  }
</script>

<style lang="scss" scoped>
  .gift-card {
    background-color: #ffffff;
    border: solid 1px #e6e6e6;
    box-sizing: border-box;
    transition: all .3s;
    position: relative;
    &:hover {
      box-shadow: 0px 1px 20px 0px    rgba(0, 0, 0, 0.1);
      .card-brief {
        white-space: normal;
      }
    }

    .gift-masking {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, .09);
      display: none;
    }

    &.finished {
      .gift-masking {
        display: block;
      }
      .card-brief {
        white-space: nowrap;
      }
    }

  }

  .sfa-points {
    background: url(./points.png) no-repeat;
    width: 19px;
    height: 19px;
    display: inline-block;
    margin-right: 5px;
  }

  .sfa-finished {
    background: url(./finished.png) no-repeat;
    width: 106px;
    height: 106px;
    display: inline-block;
    position: absolute;
    left: 43%;
    top: 60px;
    z-index: 2;
  }

  .sfa-gift-level {
    background: url(./gift-level.png) no-repeat;
    width: 60px;
    height: 34px;
    display: inline-block;
    position: absolute;
    color: #ffffff;
    left: -7px;
    line-height: 25px;
    top: 10px;
  }

  .gift-card-img {
    height: 220px;
    margin-bottom: 5px;
  }

  .gift-card-main {
    width: 280px;
    text-align: center;
    height: 300px;
    position: relative;
  }

  .card-left {
    width: 40px;
    height: 40px;
    background-color: #e84c4c;
    border-radius: 40px;
    text-align: center;
    line-height: 40px;
    color: #ffffff;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .card-title {
    font-size: 14px;
    color: #333333;
    flex: 60%;
    text-align: left;
    padding-bottom: 5px;
  }

  .card-intro {
    display: flex;
    flex-flow: row wrap;
    padding: 5px 15px 0 12px;
    min-height: 75px;
    border-bottom: 1px solid #e6e6e6;
    align-content: baseline;
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
  }

  .card-price {
    flex: 40%;
    text-align: right;
    color: #666666;
    .card-price-val {
      color: #f09932;
    }
  }

  .card-brief {
    color: #999999;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
  }

  .gift-card-op {
    display: flex;
    padding: 10px;
    align-items: center;
  }

  .card-points {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    height: 31px;
    color: #999999;
  }

  .card-points-val {
    color: #333333;
  }
  .btn-exchange-btn {
    width: 97px;
    height: 31px;
    background-color: #14b1bb;
    border-radius: 15px;
    font-size: 12px;
  }

</style>
