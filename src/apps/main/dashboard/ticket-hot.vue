<template>
  <div>
    <ul class="db-ticket-game-type">
      <li :class="[{active: ticketType === 1},'db-ticket-game-type-item']" @click="showTicket(1)">双面盘</li>
      <li :class="[{active: ticketType === 2},'db-ticket-game-type-item']" @click="showTicket(2)">经典彩票</li>
    </ul>
    <a href="javascript:void(0)" @click="goTo(ticketType === 1 ? `bc/2/${_.isEmpty(topHandicapTicket) ? 1 : topHandicapTicket.id}`
    : `/bc/0/${_.isEmpty(topClassicalTicket) ? 1 : topClassicalTicket.id}`)"  class="db-ticket-more">更多彩种<span class="sfa sfa-more-arrow-right-double"></span>
    </a>
    <div class="ticket-game-main" @mouseover="showArrow" @mouseout="showArrow">
      <transition name="arrow-left">
        <a class="db-ticket-arrow left" @click="ticketSwitch('left')"
           v-if="ticketCount > 3"></a>
      </transition>
      <transition name="arrow-right">
        <a class="db-ticket-arrow right" @click="ticketSwitch('right')"
           v-if="ticketCount > 3"></a>
      </transition>
      <div :class="['db-ticket-game-type-container',{'left': ticketCount > 3}]" v-show="ticketType === 1">
        <transition-group name="ticketGroup" tag="div">
          <div class="db-ticket-item" v-for="item in handicapTicketList" :key="item.uid">
            <!--<div :class="`db-ticket-logo sfa-bc-new-ssc-${item.ticketId}`"></div>-->
            <a href="javascript:void(0)" @click="goTo(`bc/2/${item.ticketId}`)"
                         :class="['db-ticket-logo',`${getTicketLogo(item.ticketId)}`]"></a>
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
      <div :class="['db-ticket-game-type-container',{'left': ticketCount > 3}]" v-show="ticketType === 2">
        <transition-group name="ticketGroupClassic" tag="div">
          <div class="db-ticket-item" v-for="item in classicTicketList" :key="item.uid">
            <a href="javascript:void(0)" @click="goTo(`bc/0/${item.ticketId}`)"
                         :class="['db-ticket-logo',`${getTicketLogo(item.ticketId)}`]"></a>
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
  import {getIndexTicketApi} from 'api/dashboard'
  import ticketCfg from 'skeleton/misc/ticketConfig'

  export default {
    name: "ticket-hot",
    data() {
      return {
        handicapTicketList: [],
        classicTicketList: [],
        ticketType: 1,
        ticketCount: 0,
        ticketIndex: 1,
        showArrowBtn: false,
        canClick:true
      }
    },
    computed: {
      ...mapGetters([
        'topClassicalTicket',
        'topHandicapTicket'
      ]),
      loginStatus(){
        return this.$store.getters.getLoginStatus
      },
    },
    methods: {
      goTo(router){
        if(this.loginStatus){
          this.$router.push(router)
        }else{
          this.showLogin()
        }
      },
      showLogin() {
        this.$store.commit(types.TOGGLE_LOGIN_DIALOG, true)
      },
      showTicket(type) {
        this.ticketCount = type === 1 ? this.handicapTicketList.length : this.classicTicketList.length
        this.ticketType = type
      },
      showArrow() {
        this.showArrowBtn = !this.showArrowBtn
      },
      ticketSwitch(type) {
        if(this.canClick){
          this.canClick = !this.canClick
          const arr = this.ticketType === 1 ? this.handicapTicketList : this.classicTicketList
          if (type === 'left') {
            arr.unshift(arr.pop())
          } else {
            arr.push(arr.shift())
          }
          if (this.ticketType === 1) {
            this.handicapTicketList = arr
          } else {
            this.classicTicketList = arr
          }
          setTimeout(() => {
            this.canClick = !this.canClick
          },500)
        }

      },
      progressWidth(num) {
        const width = num > 4000 ? '100%' : (num > 1000 ? `${_(num).div(4000)}%` : '25%')
        return `width:${width}`
      },
      getTicketLogo(id) {
        const ticketInfo = ticketCfg.getAllBy({id: id})
        return _(ticketInfo).isEmpty() ? '' : `sfa-bc-${ticketInfo[0].type}-${ticketInfo[0].mark}-hot`
      }
    },
    mounted() {
      getIndexTicketApi(
        ({data}) => {
          if (data && data.result === 0) {
            if(data.root.handicapTickets && data.root.handicapTickets.length > 3 && data.root.handicapTickets.length < 5){
              this.handicapTicketList = data.root.handicapTickets
              this.handicapTicketList = [...this.handicapTicketList, ..._.cloneDeep(this.handicapTicketList)]
            }else{
              this.handicapTicketList = data.root.handicapTickets || this.handicapTicketList
            }
            this.handicapTicketList.forEach(item => {
              item.uid = _.uniqueId()
            })

            if(data.root.classicTickets && data.root.classicTickets.length > 3 && data.root.classicTickets.length < 5){
              this.classicTicketList = data.root.classicTickets
              this.classicTicketList = [...this.classicTicketList, ..._.cloneDeep(this.classicTicketList)]
            }else{
              this.classicTicketList = data.root.classicTickets || this.classicTicketList
            }
            this.classicTicketList.forEach(item => {
              item.uid = _.uniqueId()
            })
            this.ticketCount = this.handicapTicketList.length
          }
        }
      )
    }
  }
</script>

<style lang="scss" scoped>
  @mixin transition-cfg {
    transition: all .5s;
  }

  .arrow-left-enter, .arrow-left-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }

  .arrow-right-enter, .arrow-right-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }

  .arrow-left-enter-active, .arrow-right-enter-active, .arrow-left-leave-active, .arrow-right-leave-active {
    @include transition-cfg;
  }

  .ticketGroup-move, .ticketGroupClassic-move {
    transition: all .5s, opacity 0s;
  }

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
    .sfa{
      margin-left: 4px;
    }
  }

  .ticket-game-main {
    width: 665px;
    height: 272px;
    position: relative;
    &:hover{
      .db-ticket-arrow {
        opacity: 1;
        &.left {
          opacity: 1;
          transform: translateX(0px);
        }
        &.right {
          opacity: 1;
          transform: translateX(0px);
        }
      }
    }
    .db-ticket-arrow {
      position: absolute;
      display: block;
      width: 30px;
      height: 30px;
      top: 100px;
      z-index: 99;
      cursor: pointer;
      &.left {
        background: url("./misc/arrow-left.png") no-repeat;
        left: 10px;
        opacity: 0;
        transform: translateX(10px);
        transition: all .5s;
      }
      &.right {
        background: url("./misc/arrow-right.png") no-repeat;
        right: 10px;
        opacity: 0;
        transform: translateX(-10px);
        transition: all .5s;
      }
    }
  }

  .db-ticket-game-type-container {
    width: 665px;
    height: 272px;
    overflow: hidden;
    position: relative;
    > div {
      display: flex;
      position: absolute;
      z-index: 2;
    }
    &.left{
      >div{
        left: -444px;
        .db-ticket-item{
          &:first-of-type, &:last-of-type {
            opacity: 0;
          }
        }
      }
    }
  }

  .db-ticket-item {
    /*display: inline-block;*/
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
    border-radius: 15px;
  }

  .db-ticket-progress {
    position: absolute;
    top: -1px;
    width: 161px;
    height: 7px;
    background: #14b1bb;
    border: 1px solid #14b1bb;
    border-radius: 15px;
  }
</style>
