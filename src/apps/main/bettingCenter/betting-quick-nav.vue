<template>
  <div class="bc-main-quick">
    <transition-group name="flip-list" tag="div" class="pull-left top-list">
      <router-link v-for="ticket in fTickets" :to="`/bc/${ticketType}/${ticket.id}`" class="top-list-info" :class="{active: ticket.active}" :key="ticket.id">
        {{ticket.zhName}}
        <i :class="`sfa-badge-${ticket.badge}`" v-if="ticket.badge"></i>
      </router-link>
    </transition-group>
    <div class="quick-more pull-right">
      <a class="sfa cursor-pointer bc-quick-more-btn" :class="[isShowMore ? 'sfa-bc-quick-close' : 'sfa-bc-quick-more']" v-if="ticketType === 0" @click="isShowMore = !isShowMore"></a>
      <div class="quick-ticket-nav quick-ticket-main" :class="{'quick-ticket-list-animate' : isShowMore}">
        <div class="quick-list" v-for="(ticketInfo, i) in ticketList">
          <div class="quick-ticket-type-name">{{ticketInfo.title}}</div>
          <div class="ticket-inner-list clearfix">
            <router-link :to="`/bc/${item.id}`" v-for="item in ticketInfo.list" class="ticket-info">
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
    },

    data() {
      return {
        isShowMore: false
      }
    },

    computed: mapGetters([
      'fTickets',
    ]),

    methods: {
    },

    watch: {
      'ticketType':{
        handler(currentId) {
          this.$store.commit(types.TOGGLE_TOP_TICKETS_BY_TYPE, {
            type: currentId
          })
        },
        immediate: true
      },
      'ticketId'(currentId) {
        if (this.ticketType === consts.TICKET_HANDICAP_TYPE) {
          this.$store.commit(types.ACTIVE_TOP_TICKETS, {
            currentId,
          })
        } else {
          this.$store.dispatch(types.SET_TOP_CURRENT_TICKET, {
            ticketId: currentId,
          })
          this.$store.commit(types.RESORT_TOP_TICKETS, {
            currentId,
          })
        }
      },
    },

    // mounted() {
    // }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .bc-main-quick {
    width: 100%;
    height: 70px;
    background-color: #f3fbfc;

    .top-list{
      display: flex;
      a{
        display: inline-block;
        margin-left: 10px;
        padding: 10px 20px;
        border-radius: 20px;
        color: $main-deep-color;
        font-size:$font-md;
        cursor: pointer;
        margin-top: 15px;
        position: relative;
        &.active,&:hover{
          background-color: $main-deep-color;
          color: $def-white-color;
        }
        i{
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
      &:first-of-type{
        flex-grow: 1;
      }
    }

    .quick-more{
      width: 5%;
      height: 70px;
      position: relative;

      .bc-quick-more-btn{
        margin-top: 24.5px;
      }
      .quick-ticket-nav{
        position: absolute;
        width: 1200px;
        height: 180px;
        right: -1200px;
        box-sizing: border-box;
        padding: 30px 55px;
        display: flex;
        z-index: 2;
        background: $main-deep-color;
        top: 70px;

        &.active,&:hover{
          background-color: $main-deep-color;
        }
        i{
          position: absolute;
          top: 5px;
          right: 5px;
        }
        &.quick-ticket-list-animate{
          animation: bounceInRight 1s forwards;
        }
        .quick-ticket-type-name{
          font-size:$font-md;
          color: $def-white-color;
          writing-mode:vertical-lr;
          display: inline-block;
          margin-top: 10px;
        }
        .ticket-inner-list{
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          width: auto;
          flex-grow: 1;
        }
        .ticket-info{
          margin-left: 15px;
          padding: 5px 15px 5px 30px;
          border-radius: 20px;
          position: relative;
          transition: 0.3s background linear;
          min-width: 65px;
          font-size: 12px;
          color: $def-white-color;
          cursor: pointer;
          &:before{
            content: ' ';
            width: 0;
            height: 0;
            border: 5px solid transparent;
            border-left-color: $def-white-color;
            position: absolute;
            top: 11px;
            left: 10px;
          }
          &.active,&:hover{
            background-color: #009297;
          }
          i{
            position: relative;
            top: -6px;
            right: -1px;
            display: inline-block;
          }
        }
        .quick-ticket-line{
          width: 1px;
          height: 100px;
          background-color: $def-white-color;
          opacity: .5;
          margin: 10px 30px;
        }
      }
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

</style>
