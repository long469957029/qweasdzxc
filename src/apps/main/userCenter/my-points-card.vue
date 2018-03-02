<template>
  <status-cell class="main" :status="loading" :has-data="couponList.length" loading-tip="">
    <router-link :to="{path: '/points'}" class="go-point" tag="div">去商城兑换<i class="fa fa-angle-right fa-lg m-left-xs"></i></router-link>
      <div class="nav">
        <div class="status">
          <span>状态：</span>
          <span class="status-btn">未使用（1）</span>
          <span class="status-btn">已使用（1）</span>
          <span class="status-btn">已过期（1）</span>
        </div>
        <div class="type">
          <label>券类型：</label>
          <select class="type-select">
            <option>全部类型</option>
          </select>
        </div>
        <div class="search">
          <input type="text" class="search-input"/>
        </div>
      </div>
      <div class="list">
        <points-card v-for="(item, index) in couponList" :key="index" :coupon-info="item"></points-card>
      </div>
  </status-cell>
</template>
<script>
  import { PointsCard } from 'build'
  import { getUserCouponListApi } from 'api/points'
  export default {
    name: "my-points-card",
    components:{
      PointsCard
    },
    data(){
      return{
        couponList:{},
        couponType:0,
        couponStatus:0,
        couponToken:'',
        loading:'loading'
      }
    },
    methods:{
      getCouponList(){
        this.loading = 'loading'
        getUserCouponListApi({},
          ({data}) => {
            if(data && data.result === 0){
              this.couponList = data.root.records
              this.loading = 'completed'
            }
          },
          ({data}) => {
            this.loading = 'completed'
          }
        )
      },
    },
    mounted(){
      this.getCouponList()
    }
  }
</script>
<style lang="scss" scoped>
  .main{
    width: 100%;
    min-height: 500px;
    border-top: 1px solid $third-line-color;
    position: relative;
    .go-point{
      width: 100px;
      color: $new-inverse-color;
      font-size: $font-sm;
      position: absolute;
      display: block;
      right: 50px;
      top: -46px;
      text-align: center;
      cursor: pointer;
    }
    .nav{
      padding: 17px ;
      .status{
        display: inline-block;
        vertical-align: top;
      }
      .type{
        display: inline-block;
        vertical-align: top;
      }
    }
    .list{
      padding: 0px 33px;
      margin-top: 20px;
      .points-card-wrapper{
        display: inline-block;
        margin: 15px;
      }
    }
  }
</style>
