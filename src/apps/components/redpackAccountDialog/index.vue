<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="redPackContainer" v-if="showDailog">
    <div class="modal-dialog modal-red-pack-account">
      <div class="close-status" v-if="!openRedPack">
        <div class="remove-icon"></div>
        <div class="text">
          <div class="account" v-if="redPackType === 0">
            <div>恭喜您获得</div>
            <div class="m-top-sm">一个现金红包</div>
          </div>
          <div class="user-return" v-if="redPackType === 1">
            <div class="m-top-xs">Hi老友，</div>
            <div class="m-top-xs">送您一个吉利红包</div>
            <div class="m-top-xs">祝您投注愉快，盈利多多</div>
          </div>
        </div>
        <div class="btn-red-pack" @click="openBtn">立即拆开</div>
      </div>
      <transition name="open-red-pack">
        <div class="open-status" v-if="openRedPack">
          <div class="close btn-close" data-dismiss="modal"></div>
          <div class="text">
            <div class="text-center">恭喜您获得</div>
            <div class="text-center font-sm m-top-sm">现金红包</div>
            <div class="text-center font-md m-top-sm"><span class="money">{{redPackMoney}}</span>元</div>
          </div>
          <div class="btn-red-pack" data-dismiss="modal">愉快收下</div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
  import { checkHasRedpackApi } from 'api/register'
  import { userLossInfoApi, userGetAwardInfoApi } from 'api/userLoss'
  export default{
    name:'red-pack-account',
    props:{
      redPackType:{   //红包类型： 0 开户红包 1 老友回归红包
        type:Number,
        default: 0
      }
    },
    data(){
      return{
        showDailog:false,
        openRedPack:false,
        redPackMoney:0
      }
    },
    computed:{
      openBtn: function () {
        return this.redPackType === 0 ? openRedPack = !openRedPack : this.getAward
      }
    },
    methods:{
      init(){
        this.$nextTick(() => {
          $(this.$refs.redPackContainer).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.$emit('next')
            })
        })
      },
      getAward(){
        userGetAwardInfoApi(
          ({data}) => {
            if(data && data.result === 0){
              this.redPackMoney = data.root.awardAmount
              this.openRedPack = true
            }else{
              Global.ui.notification.show(data.msg === 'fail' ? '红包领取失败' : data.msg);
            }
          }
        )
      }
    },
    mounted(){
      const api = this.redPackType === 0 ? checkHasRedpackApi : userLossInfoApi
      api(
        ({data}) => {
          if(data && data.result === 0){
            if(this.redPackType === 0){
              if(data.root && data.root.redpackOpenType === 1){
                this.redPackMoney = _(data.root.bonus).convert2yuan()
                this.showDailog = true
                this.init()
              }else{
                this.$emit('next')
              }
            }else if(this.redPackType === 1){
              if(data.root && data.root.isAward){
                this.showDailog = true
                this.init()
              }else{
                this.$emit('next')
              }
            }
          }else{
            this.$emit('next')
          }
        },
        () => {
          this.$emit('next')
        }
      )
    },
  }
</script>
<style lang="scss" scoped>

  .open-red-pack-enter{
    transform: rotateY(-90deg);
  }
  .open-red-pack-enter-active{
    transition: all .5s ease;
  }

  .in{
    top: 20% !important;
  }
  .close-status{
    width: 267px;
    height: 311px;
    background: url("./images/close-status-bg.png") no-repeat;
    position: relative;
    margin: 0 auto;
    .text{
      width: 100%;
      text-align: center;
      color: $def-white-color;
    }
    .account{
      font-size: 18px;
      padding-top: 135px;
    }
    .user-return{
      font-size: 16px;
      padding-top: 125px;
    }
  }
  .open-status{
    width: 271px;
    height: 370px;
    background: url("./images/open-status.png") no-repeat;
    position: relative;
    margin: 0 auto;
    .close{
      width: 35px;
      height: 35px;
      background: url("./images/close-bg.png") no-repeat;
      position: absolute;
      top: 20px;
      right: -20px;
    }
    .text{
      width: 100%;
      text-align: center;
      padding-top: 100px;
      font-size:18px;
      color: #c4302f;
      .money{
        font-size: 40px;
      }
    }
  }
  .remove-icon{
    width: 67px;
    height: 67px;
    background: url("./images/remove-bg.png") no-repeat;
    position: absolute;
    left: 50%;
    margin-left: -33.5px;
    top:46px;
    animation: remove 3s ease infinite;
  }
  .btn-red-pack{
    position: absolute;
    width: 146px;
    height: 36px;
    background-color: #f5c74b;
    border-radius: 18px;
    font-size:$font-md;
    color: #852016;
    text-align: center;
    line-height: 36px;
    left: 50%;
    margin-left: -73px;
    bottom: 30px;
    cursor: pointer;
  }

  @keyframes remove {
    from{
      transform: rotateY(0deg);
    }
    to{
      transform: rotateY(360deg);
    }
  }
</style>
