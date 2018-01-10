<template>
  <div class="bc-main-quick">
    <transition-group name="flip-list" tag="div" class="pull-left quick-list">
      <router-link v-for="(ticket, i) in fTickets" :to="`/bc/${ticket.id}`" class="quick-list-info" :class="{active: i === 0}" :key="ticket.id">
        {{ticket.zhName}}
        <i :class="`sfa-badge-${ticket.badge}`" v-if="ticket.badge"></i>
      </router-link>
    </transition-group>
    <div class="quick-more pull-right">
      <a class="sfa cursor-pointer bc-quick-more-btn" :class="[isShowMore ? 'sfa-bc-quick-close' : 'sfa-bc-quick-more']" @click="isShowMore = !isShowMore"></a>
      <div class="quick-ticket-list" :class="{'quick-ticket-list-animate' : isShowMore}">
        <div class="quick-ticket-main clearfix">
          <div v-for="ticketInfo in ticketList">
            <div class="pull-left">
              <div class="quick-ticket-type-name">{{ticketInfo.ticketName}}</div>
              <div class="ticket-ssc-list quick-ticket-ssc clearfix">
                <router-link :to="`/bc/${item.id}`" v-for="item in ticketInfo.list" class="ticket-info">
                  {{item.zhName}}
                  <i v-if="item.badge === 'hot'" class="sfa-badge-hot"></i>
                  <i v-else-if="item.badge === 'new'" class="sfa-badge-new"></i>
                </router-link>
              </div>
            </div>
            <div class="quick-ticket-line"></div>
          </div>
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
      ticketList: Array,
      isShowMore: {
        type: Boolean,
        default: false
      }
    },

    computed: mapGetters({
      fTickets: 'fTickets',
    }),

    methods: {
    },

    watch: {
      'ticketId'(currentId) {
        this.$store.commit(types.RESORT_TOP_TICKETS, {
          currentId
        })
      }
    },

    mounted() {
      this.$store.dispatch(types.GET_TOP_TICKETS)
    }
  }
</script>

<style lang="scss" scoped>
  @import
  "~base/styles/variable";

  .bc-main-quick {
    width: 100%;
    height: 70px;
    background-color: #f3fbfc;
    .quick-list{
      width: 95%;
      height: 70px;
      a{
        display: inline-block;
        margin-left: 10px;
        padding: 10px 20px;
        border-radius: 20px;
        color: $main-deep-color;
        font-size:$font-md;
        cursor: pointer;
        margin-top: 15px;
        &.active,&:hover{
          background-color: $main-deep-color;
          color: $def-white-color;
        }
        i{
          position: absolute;
        }
      }
    }
    .quick-more{
      width: 5%;
      height: 70px;
      position: relative;

      .bc-quick-more-btn{
        margin-top: 24.5px;
      }
      .quick-ticket-list{
        position: absolute;
        width: 1200px;
        height: 180px;
        right: -1200px;
        z-index: 2;
        background: $main-deep-color;
        top: 70px;
        color: $def-white-color;
        &.quick-ticket-list-animate{
          animation: bounceInRight 1s forwards;
        }
        .quick-ticket-main{
          margin: 20px 80px 0;
        }
        .quick-ticket-type-name{
          font-size:$font-md;
          color: $def-white-color;
          writing-mode:vertical-lr;
          display: inline-block;
          margin-top: 10px;
        }
        .ticket-ssc-list{
          display: inline-block;
          vertical-align: top;
          &.quick-ticket-ssc{
            width: 265px;
          }
          &.quick-ticket-choose5,&.quick-ticket-low,&.quick-ticket-happy{
            width: 145px;
          }
        }
        .ticket-info{
          float: left;
          margin-left: 20px;
          padding: 5px 15px 5px 30px;
          border-radius: 20px;
          position: relative;
          transition: 0.3s background linear;
          min-width: 65px;
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
            position: absolute;
            top: 5px;
            right: 7px;
          }
        }
        .quick-ticket-line{
          float: left;
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

</style>
