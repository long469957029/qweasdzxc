<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="ticketVouchers" v-if="showDailog">
    <div class="modal-dialog modal-ticket">
      <div class="close btn-close" data-dismiss="modal"></div>
      <div class="text">
        <div class="text-left">
          代金券
        </div>
        <div class="text-right">
          <div class="text-center name">{{ticketName}}</div>
          <div class="text-center num"><span class="money">{{amount}}</span>元</div>
          <div class="text-center time">有效期:2018-09-01 0:00:00</div>
        </div>
      </div>
      <div class="des">您可在个人中心> 优惠券页面查看代金券详情</div>
      <router-link :to="`/bc/0/${ticketId}`" class="btn-red-pack" data-dismiss="modal">立即使用</router-link>
    </div>
  </div>
</template>

<script>
  import { getRedPackInfoApi } from 'api/vouchers'

  export default {
    name: "ticket-vouchers",
    data(){
      return{
        showDailog:false,
        ticketId: 0,
        dataList:[],
        amount:0,
        ticketName:'',
        isFirst: true // 登录之后第一次展示完 需要调用父组件下一个弹窗
      }
    },
    methods:{
      init(){
        this.$nextTick(() => {
          $(this.$refs.ticketVouchers).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.showDailog = false
              this.parentNext()
            })
        })
      },
      getApi(){
        getRedPackInfoApi(
          ({data}) => {
            if(data && data.result === 0 && !_(data.root.dataList).isEmpty()){
              this.dataList = data.root.dataList
              this.amount = this.dataList[0].amount
              this.ticketName = this.dataList[0].ticketName
              this.showDailog = true
              this.init()
            }else{
              this.parentNext()
            }
            this.startTimer()
          },
          ({data}) => {
            this.startTimer()
            this.parentNext()
          }
        )
      },
      startTimer(){
        setTimeout(() => {
          this.isFirst = false
          this.getApi()
        },20000)
      },
      parentNext(){
        if(this.isFirst){
          this.$emit('next')
        }
      },
    },
    mounted(){
      this.getApi()
    }
  }
</script>

<style lang="scss" scoped>
  .in{
    top: 20% !important;
  }
  .modal-ticket{
    width: 357px;
    height: 400px;
    background: url("./images/ticket-bg.png") no-repeat;
    position: relative;
    .close{
      width: 35px;
      height: 35px;
      background: url("./images/close-bg.png") no-repeat;
      position: absolute;
      top: 25px;
      right: 5px;
    }
    .text{
      position: relative;
    }
    .text-left{
      width: 21px;
      font-size: 20px;
      color: #b24f3b;
      position: absolute;
      top: 180px;
      left: 83px;
    }
    .text-right{
      width: 157px;
      float: right;
      position: absolute;
      top: 162px;
      left: 114px;
      font-size: $font-sm;
      color: #b24f3b;
    }
    .name{
      margin-top: 14px;
    }
    .num{
      margin-top: 10px;
    }
    .money{
      font-size: 32px;
      color: #a43018;
    }
    .time{
      font-size: 10px;
      color: rgba(178, 79, 59, 0.6);
      margin-top: 5px;
    }
    .des{
      width: 241px;
      height: 12px;
      font-size: $font-xs;
      color: $def-white-color;
      text-align: center;
      position: absolute;
      bottom: 21%;
      left: 14%;
    }
    .btn-red-pack{
      display: block;
      position: absolute;
      font-size: 16px;
      width: 100px;
      color: $def-white-color;
      text-align: center;
      bottom: 25px;
      left: 50%;
      margin-left: -55px;
      cursor: pointer;
    }
  }
</style>
