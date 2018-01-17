<template>
  <div v-if="total > 0">
    <div class="notice-content inline-block">
      <transition name="notice-trans">
        <a v-if="isShow">{{noticeList[nowIndex-1].title}}</a>
      </transition>
      <transition name="notice-trans-old">
        <a v-if="!isShow">{{noticeList[nowIndex-1].title}}</a>
      </transition>
    </div>
    <div class="bulletin-pager inline-block">
      <span class="js-wt-pn-up cursor-pointer" @click="goClick('prev')">&lt;</span>
      <span class="js-db-bulletin-cur">{{nowIndex}}</span>&nbsp;/ <span class="js-db-bulletin-total">{{total}}</span>
      <span class="js-wt-pn-down cursor-pointer" @click="goClick('next')">&gt;</span>
    </div>
  </div>
</template>
<script>
  import dashboard from '../../api/dashboard'
  export default {
    name: 'notice',
    data() {
      return{
        noticeList: [],
        total: 0,
        nowIndex: 1,
        isShow: true,
        time: 5000,
      }
    },
    methods: {
      goto (index) {
        this.isShow = false
        setTimeout(() => {
          this.isShow = true
          this.nowIndex = index
        }, 250)
      },
      runInv () {
        if (this.noticeList.length > 1) {
          this.invId = setInterval(() => {
            this.goto(this.changeIndex('next'))
          }, this.time)
        }
      },
      clearInv () {
        clearInterval(this.invId)
      },
      changeIndex(type){
        let index = 0
        if (type === 'prev') {
          index = this.nowIndex = this.nowIndex === 0 ? this.total : this.nowIndex -= 1
        } else {
          index = this.nowIndex = this.nowIndex === this.total ? 1 : this.nowIndex += 1
        }
        return index
      },
      goClick (type){
        this.goto(this.changeIndex(type))
        this.clearInv()
        this.runInv()
      },
      getNotice() {
        dashboard.getNoticeXhr(
          ({data}) => {
            if (data && data.result === 0) {
              this.noticeList = data.root || this.noticeList
              this.total = this.noticeList.length
              if (this.total > 1) {
                this.clearInv()
                this.runInv()
              }
            }
          }
        )
      }
    },
    mounted() {
      this.getNotice()
      this.getList = setInterval(() => {
        this.getNotice()
      },30000)
    },
    destroyed() {
      clearInterval(this.getList)
    }
  }

</script>
<style lang="scss" scoped>
  .notice-trans-enter-active {
    transition: all .5s;
  }

  .notice-trans-enter {
    transform: translateY(50px);
  }

  .notice-trans-leave-active {
    transition: all .5s;
    transform: translateY(-50px);
  }

  .notice-trans-old-leave-active {
    transition: all .5s;
    transform: translateY(50px);
  }
  .notice-content {
    width: 960px;
    height: 50px;
    overflow: hidden;
    position: relative;
    a{
      height: 50px;
      line-height: 50px;
      padding-left: 30px;
      position: relative;
      color: #333333;
      display: block;
      /*width: 930px;*/
      /*overflow: -webkit-marquee;*/
      /*-webkit-marquee-style: scroll;*/
      /*-webkit-marquee-repetition: infinite;*/
      /*-webkit-marquee-direction: up;*/
      /*-webkit-marquee-speed:slow;*/
      &:before {
        content: '';
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #333333;
        display: block;
        position: absolute;
        left: 10px;
        top: 22.5px;
      }
    }
  }

  .bulletin-pager {
    width: 90px;
    text-align: center;
    vertical-align: top;
  }
</style>
