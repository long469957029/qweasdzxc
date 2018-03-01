<template>
  <div class="dashboard-mall db-shadow">
    <div class="db-block-border"></div>
    <div class="dashboard-mall-header">
      <div class="db-mall-title"></div>
    </div>
    <div class="js-db-mall-content">
        <router-link :class="`dashboard-mall-content clearfix`" v-for="(item, index) in mallList" :to="`/${item.couponType === 0 ? 'points/gifts' : 'points'}`" tag="div" :key="index">
          <div class="info">
            <div class="title">
              <span class="num" v-if="!_.isNull(item.bigShowNum)" v-html="(item.couponBonusType === 1 ? `${_(item.bigShowNum).convert2yuan()}<span class='font-sm'>元</span>`
                    : `${_(item.bigShowNum).div(100)}<span class='font-sm'>%</span>`)">
              </span>
              {{item.name}}
            </div>
            <div class="ticket-name">{{formatDesc(item).mainDesc}}</div>
            <div class="desc">{{(item.couponType === 0 ? formatGiftDesc(item.couponDesc) : formatDesc(item).secondDesc)}}</div>
          </div>
          <div class="image-info">
            <img :src="item.itemPicUrl" v-if="item.couponType === 0"/>
            <span :class="`coupont-img coupont-${item.couponType}`" v-else></span>
          </div>
        </router-link>
    </div>
  </div>
</template>

<script>
  import {getMallHotListApi} from 'api/dashboard'
  import {formatCoupon} from 'build'
  export default {
    name: "dashboard-mall",
    data() {
      return {
        mallList: [],
      }
    },
    methods:{
      formatGiftDesc(text){
        return text.length > 23 ? text.slice(0,23) + '...' : text
      },
      formatDesc(item){
        const info = formatCoupon({
            bigShowNum: item.bigShowNum,
            type: item.type,
            threholdAmount: item.threholdAmount,
            bonusPercentAmount: item.bonusPercentAmount,
            statType: item.statType,
            ticketId: item.statTicketId,
            gameType: item.gameType
          })
        return info
      }
    },
    mounted() {
      getMallHotListApi(
        ({data}) => {
          if (data && data.result === 0) {
            this.mallList = _(data.root.records).reverse() || this.mallList
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
      margin-left: 21px;
      margin-right: 10px;
      height: 134px;
      border-bottom: 1px solid $sec-line-color;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }
      .info{
        margin-top: 34px;
        float: left;
        width: 160px;
      }
      .image-info{
        width: 96px;
        height: 96px;
        float: right;
        margin-top: 19px;
        position: relative;
        .coupont-img{
          width: 111px;
          height: 83px;
          position: absolute;
          left: -7.5px;
          top: 6.5px;
        }
        @for $i from 1 through 6 {
          .coupont-#{$i}{
            display: block;
            background: url("./misc/coupon-#{$i}.png") no-repeat;

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
        margin-bottom: 10px;
        .num{
          font-size: 20px;
          color: $new-main-deep-color;
          margin-right: 5px;
        }
      }
      .ticket-name{
        font-size: 12px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $new-inverse-color;
      }
      .desc {
        font-size: 12px;
        width: 100%;
        color: $new-inverse-color;
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
