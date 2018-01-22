<template>
  <div v-if="total > 0">
    <div class="notice-content inline-block">
      <transition name="notice-trans">
        <a v-if="isShow" @click="showNoticeDialog(nowIndex - 1)">【{{noticeList[nowIndex - 1].title}}】{{noticeList[nowIndex - 1].desc}}</a>
      </transition>
      <transition name="notice-trans-old">
        <a v-if="!isShow" @click="showNoticeDialog(nowIndex - 1)">【{{noticeList[nowIndex - 1].title}}】{{noticeList[nowIndex - 1].desc}}</a>
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
              <transition-group name="list-detail" tag="div">
                <div class="list-info" v-for="(item, index) in noticeList" :key="item.bulletionId" v-show="detailPage === index">
                  <div class="title">【{{item.title}}】</div>
                  <div class="time">{{_(item.time).toTime()}}</div>
                  <div class="detail" v-html="item.content"></div>
                </div>
              </transition-group>
            <div class="page">
              <a class="page-btn" @click="goToPage('prev')">&lt;</a>
              <span :class="[{active: detailPage === index},'page-btn-sm']" v-for="(item, index) in noticeList" @click="goToPage(index)"></span>
              <a class="page-btn" @click="goToPage('next')">&gt;</a>
            </div>
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
        showNoticeModal: false,
        detailPage: 0
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
      showNoticeDialog(num){
        this.showNoticeModal = !this.showNoticeModal
        this.detailPage = num
        this.$nextTick(() => {
          $(this.$refs.noticeModal).modal({
            backdrop: 'static',
          })
            .on('hidden.modal', () => {
              this.showNoticeModal = false
              this.detailPage = 0
            })
        })
      },
      goToPage(index){
        if(index === 'prev'){
          this.detailPage = this.detailPage === 0 ? this.noticeList.length -1 : this.detailPage - 1
        }else if(index === 'next'){
          this.detailPage = this.detailPage === this.noticeList.length -1 ? 0 : this.detailPage + 1
        }else {
          this.detailPage = index
        }
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
  @mixin transition-cfg {
    transition: all .5s;
  }
  .notice-trans-enter-active {
    @include transition-cfg;
  }

  .notice-trans-enter {
    transform: translateY(50px);
  }

  .notice-trans-leave-active {
    @include transition-cfg;
    transform: translateY(-50px);
  }

  .notice-trans-old-leave-active {
    @include transition-cfg;
    transform: translateY(50px);
  }

  .list-detail-enter,.list-detail-leave-to{
    opacity: 0;
    transform: scale(1.5,1.5);
  }
  .list-detail-enter-active, .list-detail-leave-active{
    @include transition-cfg;
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
      cursor: pointer;
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
      overflow: hidden;
      line-height: normal;
      position: relative;
      >div{
        width: 502px;
        margin: 0 auto;
        height: 310px;
        overflow: hidden;
      }
      .list-info{
        width: 502px;
        margin-top: 20px;
        display: inline-block;
        position: absolute;
      }
      .title{
        width: 100%;
        font-size: $font-md;
        color: $def-black-color;
      }
      .time{
        font-size: $font-xs;
        color: $font-auxiliary-color;
        margin-top: 10px;
        padding-left: 10px;
      }
      .detail{
        font-size: $font-sm;
        color: $new-inverse-color;
        margin-top: 10px;
        border-top: 1px dashed $im-line-color;
        padding-top: 20px;
        width: 100%;
        height: 182px;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .page{
        text-align: center;
        margin-top: 20px;
        /*display: flex;*/
        /*align-items: center;*/
        width: 100%;
        height: 34px;
        /*justify-content: center;*/
        .page-btn{
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          border: 1px solid $new-main-deep-color;
          color: $new-main-deep-color;
          cursor: pointer;
          transition: color,background-color .5s;
          &:hover{
            color:$def-white-color;
            background-color: $new-main-deep-color;
          }
        }
        .page-btn-sm{
          width: 8px;
          height: 8px;
          display: inline-block;
          cursor: pointer;
          margin: 0px 10px;
          background-color: $def-gray-color;
          border-radius: 50%;
          &.active{
            background-color: $new-main-deep-color;
          }
        }
      }
    }
  }
</style>
