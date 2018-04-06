<template>
  <div>
    <div class="novice-package" @click="showNovicePackage" v-show="isShow === 1"></div>
    <!--<router-link :to="{path: '/act/arena'}" class="arena-package" v-show="isShow === 2"></router-link>-->
    <!--<router-link :to="{path: '/act/userReturn'}" class="user-return-package" v-show="isShow === 3"></router-link>-->
    <a href="#/act/arena" class="js-arena-package arena-package" v-show="isShow === 2"></a>
    <a href="#/act/userReturn" class="js-user-return-package user-return-package" v-show="isShow === 3"></a>
  </div>
</template>
<script>
  import {
    getNovicePackageInfoApi,
    getTicketListApi,
    getGiftPackageListApi
  } from 'api/activity'
  export default {
    name:'activity-entry',
    data(){
      return{
        config:[
          {
            id:1,  //新手礼包活动
            api:getNovicePackageInfoApi,
          },
          {
            id:2, //彩种擂台活动
            api:getTicketListApi,
          },
          {
            id:3, //老用户回归活动
            api:getGiftPackageListApi,
          },
        ],
        isShow:'',
        showList:[],
        index:0,
        isFirst: true
      }
    },
    methods:{
      showNovicePackage(){ //显示新手活动弹窗
        window.app.$store.commit(types.TOGGLE_NOVICE_PACKAGE, true)
      },
      changeIndex(){
        this.isShow = this.showList[this.index].id
        this.index += 1
        if(this.index > this.showList.length){
          this.index = 0
        }
      }
    },
    mounted(){
      this.config.forEach((item) => {
        item.api((data) => {
         if(data && data.data && data.data.result === 0){
           if(item.id === 1){
             if(data.data.root.status === 0 || data.data.root.status === 1){
               this.showList.push(item.id)
               this.isShow = item.id
             }
           }else{
             this.showList.push(item.id)
           }
         }
        })
      })
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.changeIndex()
      }, 5000)
    }
  }
</script>
<style lang="scss" scoped>
  .novice-package {
    background: url('misc/acbar-novice-package.gif') no-repeat;
    width: 70px;
    height: 110px;
    display: block;
    position: absolute;
    right: 0px;
    top: -118px;
    cursor: pointer;
  }
  .arena-package {
    background: url('misc/arena-package.gif') no-repeat;
    background-position-x: -17px;
    width: 70px;
    height: 110px;
    display: block;
    position: absolute;
    right: 0px;
    top: -118px;
    cursor: pointer;
  }
  .user-return-package {
    background: url('misc/user-return-package.gif') no-repeat;
    background-position-x: -17px;
    width: 70px;
    height: 110px;
    display: block;
    position: absolute;
    right: 0px;
    top: -118px;
    cursor: pointer;
  }
</style>
