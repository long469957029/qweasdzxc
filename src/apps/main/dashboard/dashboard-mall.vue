<template>
  <div class="dashboard-mall db-shadow">
    <div class="db-block-border"></div>
    <div class="dashboard-mall-header">
      <div class="db-mall-title"></div>
    </div>
    <div class="js-db-mall-content">
      <div class="dashboard-mall-content clearfix" v-for="item in mallList">
        <div class="info">
          <div class="title">
            {{item.name}}
            <span class="badge" v-if="!_.isNull(item.levelLimit)
                && item.limitRange !== 0
                && item.limitRange !== 1
                && item.limitRange !== 2">{{item.limitLevelType === 0 ? `Lv.${item.levelLimit}用户专享` : `Lv.${item.levelLimit}用户以上`}}</span>
            <span v-else-if="!_.isNull(item.limitRange)">
                  {{item.limitRange === 0 ? '新用户专享' : (item.limitRange === 1 ? '老用户专享' : '总代专享')}}
                </span>
          </div>
          <div class="desc">{{item.couponDesc}}</div>
          <a :href="`#/${item.couponType === 0 ? 'points/gifts' : 'points'}`" class="btn-mall-exchange">立即兑换</a>
        </div>
        <div class="image-info">
          <img :src="item.itemPicUrl" v-if="item.couponType === 0"/>
          <span :class="`coupont-${item.couponType}`" v-else></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {getMallHotListApi} from 'api/dashboard'

  export default {
    name: "dashboard-mall",
    data() {
      return {
        mallList: [],
      }
    },
    mounted() {
      getMallHotListApi(
        ({data}) => {
          if (data && data.result === 0) {
            this.mallList = data.root.records || this.mallList
          }
        }
      )
    }
  }
</script>

<style lang="scss" scoped>
  .db-block-border {
    height: 2px;
    width: 100%;
    background: linear-gradient(to right, #4fbab0, #598bee);
  }

  .dashboard-mall {
    width: 288px;
    height: 458px;
    margin-left: 12px;
    background: #fff;

    .dashboard-mall-header {
      text-align: center;
      width: 268px;
      height: 49px;
      margin: 0 10px;
      .db-mall-title {
        background: url('./misc/db-mall-title.png') no-repeat center;
        width: 268px;
        height: 49px;
        border-bottom: 1px solid $def-line-color;
      }
    }

    .dashboard-mall-content {
      margin: 0px 20px;
      padding: 21px 0px 21px 10px;
      border-bottom: 1px solid $sec-line-color;

      &:nth-child(3) {
        border-bottom: none;
      }
      .info{
        float: left;
        width: 60%;
      }
      .image-info{
        width: 40%;
        float: right;
        @for $i from 1 through 6 {
          .coupont-#{$i}{
            display: block;
            background: url("./misc/coupon-#{$i}.png");
            width: 111px;
            height: 83px;
          }
        }
      }
      .title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 14px;
        color: $font-dark;
        line-height: 16px;
      }

      .desc {
        font-size: 12px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $new-inverse-color;
        line-height: 30px;
      }

      .badge {
        background: $font-auxiliary-color;
      }

      .btn-mall-exchange {
        width: 100px;
        height: 28px;
        text-align: center;
        display: block;
        line-height: 26px;
        margin-top: 17px;
        color: $new-main-deep-color;
        background: transparent;
        border: 1px solid $new-main-deep-color;
        border-radius: 20px / 20px;
        transition: color, background .5s;
        cursor: pointer;
        &:hover {
          color: $def-white-color;
          background: $new-main-deep-color;
        }
      }
    }
  }
</style>
