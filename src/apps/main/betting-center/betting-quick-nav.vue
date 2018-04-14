<template>
  <div class="bc-main-quick-wrapper" :class="componentType">
    <div class="bc-main-quick" ref="mainQuick">
      <div class="clearfix">
        <transition-group name="flip-list" tag="div" class="pull-left top-list">
          <router-link v-for="ticket in fTickets" :to="`/bc/${ticketType}/${ticket.id}`" class="top-list-info"
                       :class="{active: ticket.active}" :key="ticket.id">
            {{ticket.zhName}}
            <i :class="`sfa-badge-${ticket.badge}`" v-if="ticket.badge"></i>
          </router-link>
        </transition-group>
        <div class="quick-more pull-right">
          <a class="sfa cursor-pointer bc-quick-more-btn" :class="[isShowMore ? 'sfa-bc-quick-close' : 'sfa-bc-quick-more']"
             v-if="ticketType === 0" @click="toggleShowMore(!isShowMore)"></a>
        </div>
      </div>
      <div class="quick-split"></div>
      <div class="quick-ticket-nav quick-ticket-main" ref="nav">
        <div class="quick-list" v-for="(ticketInfo, i) in ticketList">
          <div class="quick-ticket-type-name" v-html="ticketInfo.title"></div>
          <div class="ticket-inner-list clearfix">
            <router-link :to="`/bc/${item.id}`" v-for="(item, i) in ticketInfo.list" :key="i" class="ticket-info">
              {{item.zhName}}
              <i v-if="item.badge === 'hot'" class="sfa-badge-hot"></i>
              <i v-else-if="item.badge === 'new'" class="sfa-badge-new"></i>
            </router-link>
          </div>
          <div class="quick-ticket-line" v-if="ticketInfo.list.length !== i- 1"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "betting-quick-nav",
    props: {
      ticketId: Number,
      ticketType: Number,
      ticketList: Array,
      componentType: String,
    },

    data() {
      return {
        isShowMore: false
      }
    },

    computed: mapGetters([
      'fTickets',
    ]),

    watch: {
      '$route'() {
        this.toggleShowMore(false)
      },
      'ticketType': {
        handler(currentId) {
          this.$store.commit(types.TOGGLE_TOP_TICKETS_BY_TYPE, {
            type: currentId
          })
        },
        immediate: true
      },
      'ticketId': {
        handler(currentId) {
          //盘口
          this.$store.dispatch(types.SET_TOP_CURRENT_TICKET, {
            ticketId: currentId,
            type: this.ticketType
          })

          if (this.ticketType === consts.TICKET_HANDICAP_TYPE) {
            this.$store.commit(types.ACTIVE_TOP_TICKETS, {
              currentId,
            })
          } else {
            //普通
            this.$store.commit(types.RESORT_TOP_TICKETS, {
              currentId,
            })
          }
        },
        immediate: true
      }
    },
    methods: {
      toggleShowMore(flag) {
        this.isShowMore = flag
        if (this.isShowMore) {
          Velocity(this.$refs.mainQuick, {
            height: 250,
          })
          Velocity(this.$refs.nav, {
            opacity: 1,
          })

        } else {
          Velocity(this.$refs.mainQuick, {
            height: 90,
          })
          Velocity(this.$refs.nav, {
            opacity: 0,
          })
        }
      }
    }

    // mounted() {
    // }
  }
</script>

<style lang="scss" scoped>

  .bc-main-quick-wrapper {
    height: 70px;
  }

  .bc-main-quick {
    width: 100%;
    height: 70px;
    background-color: #f3fbfc;
    overflow: hidden;

    .top-list {
      display: flex;
      a {
        display: inline-block;
        margin-left: 10px;
        padding: 10px 20px;
        border-radius: 20px;
        color: $main-deep-color;
        font-size: $font-md;
        cursor: pointer;
        margin-top: 15px;
        position: relative;
        &:hover,&.active {
          background: $new-main-deep-color;
          color: $def-white-color;
        }
        i {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      }
    }

    .quick-list {
      display: flex;
      flex-direction: row;
      height: 100%;
      float: left;
      &:first-of-type {
        /*flex-grow: 3;*/
        width: 480px;
      }
      &:nth-of-type(2) {
        /*flex-grow: 2;*/
        width: 300px;
      }
    }

    .quick-more {
      width: 5%;
      height: 70px;
      position: relative;
      z-index: 2;

      .bc-quick-more-btn {
        margin-top: 24.5px;
      }
    }
  }

  .quick-ticket-nav {
    position: relative;
    width: 100%;
    height: 180px;
    right: 0;
    box-sizing: border-box;
    padding: 15px 28px;
    z-index: 2;
    /*display: flex;*/
    background-color: $new-main-deep-color;

    i {
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .quick-ticket-type-name {
      font-size: $font-md;
      color: $def-white-color;
      display: inline-block;
      margin-top: 10px;
      width: 20px;
      line-height: 18px;
      text-align: center;
    }
    .ticket-inner-list {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      width: auto;
      flex-grow: 1;
    }
    .ticket-info {
      margin-left: 13px;
      padding: 5px 20px 5px 30px;
      border-radius: 20px;
      position: relative;
      transition: 0.3s background linear;
      min-width: 65px;
      font-size: 12px;
      color: $def-white-color;
      cursor: pointer;

      /*&:nth-of-type(11) {*/
        /*margin-bottom: 20px;*/
      /*}*/
      &:before {
        content: ' ';
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-left-color: $def-white-color;
        position: absolute;
        top: 11px;
        left: 10px;
      }
      &.active, &:hover {
        background-color: #009297;
      }
      i {
        position: relative;
        top: -6px;
        right: -1px;
        display: inline-block;
      }
    }
    .quick-ticket-line {
      width: 1px;
      height: 100px;
      background-color: $def-white-color;
      opacity: .5;
      margin: 10px 15px;
    }
  }

  .flip-list-move {
    transition: transform 1s;
  }

  .flip-list-leave-active {
    transition: opacity 0.3s;
    opacity: 0;
    position: absolute;
  }

  .mmc {
    height: 90px;
    margin: 30px auto 15px;
    .bc-main-quick {
      width: 1140px;
      height: 90px;
      background-color: rgba(6, 24, 34, 0.85);
      box-shadow: inset 0px 0px 0px 2px
      rgba(75, 194, 204, 0.22);
      border-radius: 45px;
      margin: 30px auto 15px;
      z-index: 10;
      position: relative;
    }

    .top-list {
      a {
        display: inline-block;
        margin-left: 10px;
        margin-top: 35px;
        padding: 0 20px 35px;
        height: 20px;
        border-radius: 20px;
        color: #14b1bb;
        font-size: 16px;
        cursor: pointer;
        position: relative;
        &.active, &:hover {
          background-color: transparent;
          color: #f4f2c3;
        }
        i {
          position: absolute;
          top: 5px;
          right: 5px;
        }
      }
    }
    .ticket-info {
      color: #9faeb3;

      &:hover {
        color: #ffffff;
      }
    }
    .quick-ticket-nav {
      position: relative;
      width: 1120px;
      height: 165px;
      right: 0;
      box-sizing: border-box;
      padding: 10px 15px;
      margin: 0 10px;
      z-index: 2;
      box-sizing: border-box;
      background-color: transparent;
    }
    .quick-ticket-line {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .quick-more {
      top: 10px;
      right: 10px;
    }
    .quick-split {
      width: 1093px;
      height: 1px;
      background-color: rgba(255, 255, 255, 0.2);
      margin: 0 auto;
    }
  }

</style>
