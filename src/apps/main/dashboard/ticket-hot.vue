<template>
  <div>
    <ul class="db-ticket-game-type">
      <li :class="[{active: ticketType === 1},'db-ticket-game-type-item']" @click="showTicket(1)">盘口玩法</li>
      <li :class="[{active: ticketType === 2},'db-ticket-game-type-item']" @click="showTicket(2)">经典玩法</li>
    </ul>
    <router-link :to="ticketType === 1 ? `bc/2/${_.isEmpty(topHandicapTicket) ? 1 : topHandicapTicket.id}`
                : `/bc/0/${_.isEmpty(topClassicalTicket) ? 1 : topClassicalTicket.id}`" class="db-ticket-more">更多彩种 >>
    </router-link>
    <div class="ticket-game-main" @mouseover="showArrow()" @mouseout="showArrow()">
      <transition name="arrow-left">
        <a class="db-ticket-arrow left" @click="ticketSwitch('left')"
           v-show="ticketCount > 3 && showArrowBtn"></a>
      </transition>
      <transition name="arrow-right">
        <a class="db-ticket-arrow right" @click="ticketSwitch('right')"
           v-show="ticketCount > 3 && showArrowBtn"></a>
      </transition>
      <div class="db-ticket-game-type-container" v-show="ticketType === 1">
        <transition-group name="ticketGroup" tag="div">
          <div class="db-ticket-item" v-for="item in handicapTicketList" :key="item.ticketId">
            <!--<div :class="`db-ticket-logo sfa-bc-new-ssc-${item.ticketId}`"></div>-->
            <router-link :to="`bc/2/${item.ticketId}`" class="db-ticket-logo sfa-bc-new-ssc-1"></router-link>
            <div class="db-ticket-name">{{item.ticketName}}</div>
            <div class="db-ticket-num">
              <animated-integer :value="item.userBetCount"></animated-integer>
              人参与投注
            </div>
            <div class="db-ticket-progress-bg">
              <div class="db-ticket-progress"
                   :style="progressWidth(item.userBetCount)"></div>
            </div>
          </div>
        </transition-group>
      </div>
      <div class="db-ticket-game-type-container" v-show="ticketType === 2">
        <transition-group name="ticketGroup" tag="div">
          <div class="db-ticket-item" v-for="item in classicTicketLIst" :key="item.ticketId">
            <router-link :to="`bc/0/${item.ticketId}`" class="db-ticket-logo sfa-bc-new-ssc-1"></router-link>
            <div class="db-ticket-name">{{item.ticketName}}</div>
            <div class="db-ticket-num">
              <animated-integer :value="item.userBetCount"></animated-integer>
              人参与投注
            </div>
            <div class="db-ticket-progress-bg">
              <div class="db-ticket-progress"
                   :style="progressWidth(item.userBetCount)"></div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  import { getIndexTicketApi } from 'api/dashboard'
  export default {
    name: "ticket-hot",
    data(){
      return{
        handicapTicketList: [],
        classicTicketLIst: [],
        ticketType: 1,
        ticketCount: 0,
        ticketIndex: 1,
        showArrowBtn: false,
      }
    },
    computed: {
      ...mapGetters([
        'topClassicalTicket',
        'topHandicapTicket'
      ])
    },
    methods: {
      showTicket(type){
        this.ticketCount = type === 1 ? this.handicapTicketList.length : this.classicTicketLIst.length
        this.ticketType = type
      },
      showArrow(){
        this.showArrowBtn = !this.showArrowBtn
      },
      ticketSwitch(type){
        const arr = this.ticketType === 1 ? this.handicapTicketList : this.classicTicketLIst
        if (type === 'left') {
          arr.unshift(arr.pop())
        } else {
          arr.push(arr.shift())
        }
        if (this.ticketType === 1) {
          this.handicapTicketList = arr
        } else {
          this.classicTicketLIst = arr
        }
      },
      progressWidth(num){
        const width = num > 4000 ? '100%' : (num > 1000 ? `${_(num).div(4000)}%` : '25%')
        return `width:${width}`
      },
    },
    mounted() {
      getIndexTicketApi(
        ({data}) => {
          if (data && data.result === 0) {
            this.handicapTicketList = data.root.handicapTickets || this.handicapTicketList
            this.classicTicketLIst = data.root.classicTickets || this.classicTicketLIst
            this.ticketCount = this.handicapTicketList.length
          }
        }
      )
    }
  }
</script>

<style lang="scss" scoped>
  .db-ticket-game-type {
    width: 640px;
    height: 34px;
    padding: 0 12px;
    border-bottom: 1px solid $def-line-color;
  }
  .db-ticket-game-type-item {
    height: 34px;
    display: inline-block;
    border-bottom: 1px solid transparent;
    margin: 0 22px;
    padding: 0 5px;
    font-size: 16px;
    line-height: 34px;
    color: #000;
    cursor: pointer;
  &.active {
     color: $new-main-deep-color;
     border-bottom: 2px solid $new-main-deep-color;
   }
  }
  .db-ticket-more {
    position: absolute;
    right: 20px;
    top: 8px;
    color: $new-inverse-color;
    font-size: 14px;
    cursor: pointer;
  }
  .ticket-game-main {
    width: 665px;
    height: 272px;
    position: relative;
  .db-ticket-arrow {
    position: absolute;
    display: block;
    width: 30px;
    height: 30px;
    top: 100px;
    z-index: 2;
    cursor: pointer;
  &.left {
     background: url("./misc/arrow-left.png") no-repeat;
     left: 10px;
   }
  &.right {
     background: url("./misc/arrow-right.png") no-repeat;
     right: 10px;
   }
  }
  }
  .db-ticket-game-type-container {
    width: 665px;
    height: 272px;
    overflow: hidden;
  > div {
    display: flex;
  }
  }
  .db-ticket-item {
    display: inline-block;
    width: 222px;
    position: relative;
  &:after {
     content: '';
     width: 1px;
     height: 114px;
     position: absolute;
     right: 0;
     top: 35px;
     background-color: $sec-line-color;
   }
  &:last-child:after {
     width: 0;
   }
  }
  .db-ticket-logo {
    width: 155px;
    height: 160px;
    margin: 11px 33.5px;
    cursor: pointer;
    display: block;
  }
  .db-ticket-name {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    text-align: center;
    color: $def-black-color;
  }
  .db-ticket-num {
    height: 22px;
    font-size: 12px;
    color: $font-auxiliary-color;
    line-height: 22px;
    text-align: center;
  }
  .db-ticket-progress-bg {
    position: relative;
    width: 161px;
    height: 7px;
    margin: 7px 30px 27px;
    background: #ececec;
    border: 1px solid #e2e2e2;
    border-radius: 3px;
  }
  .db-ticket-progress {
    position: absolute;
    top: -1px;
    width: 161px;
    height: 7px;
    background: #14b1bb;
    border: 1px solid #14b1bb;
    border-radius: 3px;
  }
</style>
