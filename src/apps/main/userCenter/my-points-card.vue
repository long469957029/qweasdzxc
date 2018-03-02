<template>
  <div class="main">
    <router-link :to="{name: 'pointsMall'}" class="go-point" tag="div">去商城兑换<i class="fa fa-angle-right fa-lg m-left-xs"></i></router-link>
    <div class="nav clearfix">
      <div class="status">
        <span class="text-default">状态：</span>
        <span :class="['status-btn',{'active': couponStatus === 0}]" @click="couponStatus = 0">未使用({{dataTotal.noUseCount}})</span>
        <span :class="['status-btn',{'active': couponStatus === 1}]" @click="couponStatus = 1">已使用({{dataTotal.useCount}})</span>
        <span :class="['status-btn',{'active': couponStatus === 2}]" @click="couponStatus = 2">已过期({{dataTotal.expireCount}})</span>
      </div>
      <div class="type">
        <span class="text-default v-top">券类型：</span>
        <select class="type-select" v-model="couponType">
          <option v-for="item in typeOps" :value="item.id">{{item.name}}</option>
        </select>
      </div>
      <div class="search">
        <input type="text" class="search-input" placeholder="请输入券编号" v-model="couponToken" ref="searchInput"/>
        <span class="sfa sfa-mall-search-icon v-middle cursor-pointer" @click="searchCoupon"></span>
      </div>
    </div>
    <status-cell class="list" :status="loading" :has-data="couponList.length" loading-tip="">
      <points-card v-for="(item, index) in couponList" :key="index" :coupon-info="item" :is-my-coupon="true"></points-card>
      <div class="m-top-md" v-show="totalSize > 12">
        <x-pagination :page-size="12" :total-size="totalSize" v-model="pageIndex"></x-pagination>
      </div>
      <template slot="empty-tip">
        <span class="sfa sfa-mall-empty-tip-my"></span>
        <p class="text-auxiliary m-top-md">暂无可用优惠券，<router-link :to="{name: 'pointsMall'}" class="text-default">去商城</router-link>看看吧~</p>
      </template>
    </status-cell>
  </div>
</template>
<script>
  import { PointsCard,XPagination } from 'build'
  import { getUserCouponListApi } from 'api/points'
  const CARD_TYPE = [
    {
      id: '',
      name: '全部类型',
    },
    {
      id: 1,
      name: '充值券',
      type: 'blue'
    },
    {
      id: 2,
      name: '加奖券',
      type: 'green'
    },
    {
      id: 3,
      name: '补贴券',
      type: 'green'
    },
    {
      id: 4,
      name: '返水券',
      type: 'green'
    },
    {
      id: 5,
      name: '代金券',
      type: 'gold'
    },
    {
      id: 6,
      name: '现金券',
      type: 'red'
    },
  ]
  export default {
    name: "my-points-card",
    components:{
      PointsCard,
      XPagination
    },
    data(){
      return{
        typeOps: CARD_TYPE,
        couponList:{},
        couponType:'',
        couponStatus:0,
        couponToken:'',
        dataTotal:{},
        totalSize:0,
        pageIndex:0,

        loading:'loading'
      }
    },
    watch:{
      couponStatus(){
        this.pageIndex = 0
        this.getCouponList()
      },
      couponType(){
        this.pageIndex = 0
        this.getCouponList()
      },
      pageIndex() {
        this.getCouponList()
      }
    },
    methods:{
      getCouponList(){
        this.loading = 'loading'
        getUserCouponListApi({
            couponType: this.couponType,
            couponStatus:this.couponStatus,
            couponToken: this.couponToken,
            pageIndex: this.pageIndex
          },
          ({data}) => {
            if(data && data.result === 0){
              this.couponList = data.root.records
              this.dataTotal = data.root.dataTotal
              this.totalSize = data.root.rowCount

              this.loading = 'completed'
            }
          },
          ({data}) => {
            this.loading = 'completed'
          }
        )
      },
      searchCoupon(){
        if(this.couponToken !== ''){
          this.pageIndex = 0
          this.getCouponList()
        }else{
          this.$refs.searchInput.focus()
        }
      }
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
      padding: 17px 40px;
    }
    .status{
      float: left;
      .status-btn{
        font-size: $font-xs;
        color: $new-inverse-color;
        margin-left: 20px;
        cursor: pointer;
        &.active{
          color: $new-main-deep-color;
        }
      }
    }
    .type{
      float: left;
      margin-left: 35px;
      .type-select{
        width: 110px;
        height: 24px;
        background-color: $def-white-color;
        border: solid 1px $def-gray-color;
        border-radius: 0;
        font-size: $font-xs;
        color: $new-inverse-color;
        background: url(~base/images/select-caret-black.png) no-repeat scroll 97% center transparent,
      }
    }
    .search{
      float: right;
      width: 210px;
      height: 30px;
      background-color: $def-white-color;
      border-radius: 15px;
      border: solid 1px $def-gray-color;
      .search-input{
        border: none;
        width: 70%;
        height: 22px;
        border-radius: 15px;
        margin-left: 5%;
        font-size: $font-xs;
      }
    }
    .list{
      padding: 0px 33px;
      min-height: 380px;
      .points-card-wrapper{
        display: inline-block;
        margin: 15px;
      }
    }
  }
</style>
