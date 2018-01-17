<template>
  <div v-if="total > 0">
    <div class="notice-content inline-block" @click="showNoticeDialog">
      <transition name="notice-trans">
        <a v-if="isShow">{{noticeList[nowIndex - 1].title}}</a>
      </transition>
      <transition name="notice-trans-old">
        <a v-if="!isShow">{{noticeList[nowIndex - 1].title}}</a>
      </transition>
    </div>
    <div class="bulletin-pager inline-block">
      <span class="js-wt-pn-up cursor-pointer" @click="goClick('prev')">&lt;</span>
      <span class="js-db-bulletin-cur">{{nowIndex}}</span>&nbsp;/ <span class="js-db-bulletin-total">{{total}}</span>
      <span class="js-wt-pn-down cursor-pointer" @click="goClick('next')">&gt;</span>
    </div>
    <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="noticeModal"
         v-if="showNoticeModal">
      <div class="notice-main">
        <div class="notice-list">
          <div class="header">
            <span>最新公告</span>
            <a class="close btn-close" data-dismiss="modal">&times;</a>
          </div>
          <div class="list-body">
            <ul>
              <li v-for="item in noticeList" :key="item.bulletionId">
                <div class="title">{{item.title}}</div>
                <div class="time">{{_(item.time).toTime()}}</div>
                <div class="detail">9月22日起PT、MG老虎机返水调整至0.8%，返水无上限领取！感谢一直以来
                  支持无限娱乐的会员，我们将一如既往的提供最好的服务与游戏产品！
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import dashboard from '../../api/dashboard'
  export default {
    name: 'notice',
    data() {
      return {
        noticeList: [],
        total: 0,
        nowIndex: 1,
        isShow: true,
        time: 5000,
        showNoticeModal: false
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
      },
      showNoticeDialog(){
        this.showNoticeModal = !this.showNoticeModal
        this.$nextTick(() => {
          $(this.$refs.noticeModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.showNoticeModal = false
            })
        })
      }
    },
    mounted() {
      this.getNotice()
      this.getList = setInterval(() => {
        this.getNotice()
      }, 30000)
    },
    destroyed() {
      clearInterval(this.getList)
    }
  }

</script>
<style lang="scss" scoped>
  @import "~base/styles/variable";

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
    cursor: pointer;
    a {
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
  .notice-main{
    display: flex;
    justify-content: center;
  }
  .notice-list {
    width: 540px;
    height: 450px;
    background-color: $def-white-color;
    box-shadow: 0px 5px 24px 0px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    border: solid 1px $def-gray-color;
    .header {
      width: 100%;
      height: 54px;
      background-color: $sec-line-color;
      text-align: center;
      font-size:18px;
      line-height: 54px;
      position: relative;
    }
    .close{
      display: block;
      position: absolute;
      font-size:30px;
      color: $font-auxiliary-color;
    }
    .list-body{
      width: 100%;
      height: 396px;
      overflow-y: auto;
      overflow-x: hidden;
      ul{
        width: 502px;
        margin: 0 auto;
      }
      li{
        list-style: none;
        padding: 20px;
        border-bottom: 1px dashed $im-line-color;
      }
      .title{
        width: 100%;
        font-size: $font-md;
        color: $def-black-color;
        position: relative;
        &:before{
          content: ' ';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: $def-gray-color;
          position: absolute;
          top: 5px;
          left: -20px;
        }
      }
      .time{
        font-size: $font-xs;
        color: $font-auxiliary-color;
        margin-top: 10px;
      }
      .detail{
        font-size: $font-sm;
        color: $new-inverse-color;
        margin-top: 10px;
      }
    }
  }
</style>
