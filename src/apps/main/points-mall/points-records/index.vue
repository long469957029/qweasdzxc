<template>
  <div class="points-records">
    <div class="points-records-top">
      <router-link :to="{name: 'pointsMall'}" class="return-to-mall"><span class="return-mall"></span> 返回商城首页
      </router-link>
      <div class="my-points">我的积分与兑换</div>
      <div class="my-history-points"><span class="top-star"></span> 历史获取积分值：{{mallBasicInfo.fTotalIntegral}}</div>
    </div>

    <div class="points-records-main">
      <div class="tab-toolbar">
        <div class="tab-group">
          <router-link class="tab" :to="{name: tab.name}" tag="span" v-for="(tab, i) in tabs" :key="i" ref="tabs">
            <span class="tab-inner">{{tab.title}}</span>
          </router-link>
          <div class="underline" ref="underline"></div>
        </div>
        <router-link class="address-manage" :to="{name: 'addressManage'}" tag="span">
          <span class="location-icon"></span> 收货地址管理
        </router-link>
      </div>

      <transition mode="out-in"
                  enter-active-class="animated-quick fadeIn"
                  leave-active-class="animated-quick fadeOut">
        <router-view class="main-content"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>

  const tabs = [
    {
      title: '券兑换记录',
      name: 'ticketRecords'
    },
    {
      title: '礼物兑换记录',
      name: 'giftRecords'
    },
    // {
    //   title: '电话／QQ充值记录',
    //   name: 'chargeRecords'
    // },
    {
      title: '积分明细',
      name: 'pointsRecords'
    },
  ]

  export default {
    name: 'points-records',

    data() {
      return {
        tabs
      }
    },

    computed: {
      ...mapGetters([
        'mallBasicInfo'
      ])
    },

    watch: {
      '$route': {
        handler(to) {
          let currentTab = 0
          switch (to.name) {
            case 'ticketRecords':
              currentTab = 0
              break;
            case 'giftRecords':
              currentTab = 1
              break;
            case 'chargeRecords':
              currentTab = 2
              break;
            case 'pointsRecords':
              currentTab = 2
              break;
            default:
              this.$nextTick(() => {
                Velocity(this.$refs.underline, {
                  opacity: 0
                })
              })
              return
          }


          this.$nextTick(() => {
            Velocity(this.$refs.underline, {
              opacity: 1,
              left: this.$refs.tabs[currentTab].$el.offsetLeft,
              width: this.$refs.tabs[currentTab].$el.offsetWidth,
            })
          })
        },
        immediate: true
      }
    },

    mounted() {
      this.$store.dispatch(types.GET_USER_MALL_INFO)
    }
  }
</script>

<style lang="scss" scoped>
  .points-records {
    width: 1200px;
    margin: 20px auto;
    position: relative;

    .return-mall {
      background-image: url(./misc/return-mall.png);
      width: 8px;
      height: 15px;
      display: inline-block;
      margin-right: 5px;
    }
    .top-star {
      background-image: url(./misc/top-star.png);
      width: 21px;
      height: 23px;
      display: inline-block;
      margin-right: 5px;
    }
    .points-records-top {
      background: url(./misc/records-banner.png) no-repeat center center;
      width: 1200px;
      height: 190px;
      display: flex;
      justify-content: top;
      flex-direction: column;
      align-items: center;
      position: relative;
      margin-bottom: 12px;
    }
    .my-points {
      position: relative;
      font-size: 30px;
      left: 10px;
      top: 60px;
    }

    .return-to-mall {
      position: absolute;
      left: 20px;
      display: flex;
      align-items: center;
      top: 15px;
    }

    .my-history-points {
      min-width: 210px;
      padding: 0 10px;
      box-sizing: border-box;
      height: 38px;
      border-radius: 19px;
      border: solid 1px #b2b9c2;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 82px;
      left: 10px;
      position: relative;
      font-size: 14px;
    }

    .points-records-main {
      background-color: #ffffff;
      min-height: 930px;
      box-sizing: border-box;
      padding: 30px 34px;
    }

    .tab {
      min-width: 120px;
      display: inline-block;
      font-size: 14px;
      text-align: center;
      padding: 20px 0;
      margin: 0 10px 0 0;
      background-color: transparent !important;
      color: $new-inverse-color;
      cursor: pointer;
    }

    .tab-toolbar {
      display: flex;
      color: #333;
      border-bottom: 2px solid #e6e6e6;
    }

    .tab-group {
      flex: 1;
      position: relative;
    }

    .router-link-exact-active {
      color: $main-deep-color;
    }

    .underline {
      position: absolute;
      height: 2px;
      width: 0;
      background-color: $main-deep-color;
      left: 0;
      bottom: -2px;
      display: flex;
      justify-content: center;
      &:after {
        position: absolute;
        content: '';
        display: block;
        top: -8px;
        border-left: 8px solid transparent;
        border-bottom: 10px solid $main-deep-color;
        border-right: 8px solid transparent;
      }
    }

    .location-icon {
      background-image: url(./misc/location.png);
      width: 17px;
      height: 23px;
      display: inline-block;
      position: relative;
      margin-right: 5px;

      &:after {
        content: '';
        display: block;
        height: 1px;
        box-shadow: 0 1px 2px #999999;
        bottom: 0;
        position: absolute;
        width: 80%;
        transform: translate(10%, 0);
      }
    }

    .address-manage {
      font-size: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;

      &.router-link-exact-active {
        .location-icon {
          background-image: url(./misc/location-active.png);
          &:after {
            box-shadow: 0 1px 2px #108189;
          }
        }
      }
    }

    .main-content {
      color: #333333;
    }
  }
</style>
