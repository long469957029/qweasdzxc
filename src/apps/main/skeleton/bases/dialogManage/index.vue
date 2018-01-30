<template>
  <div>
    <red-pack-account v-if="showIndex === 1" :red-pack-type="0" :key="showIndex" @next="showNext"></red-pack-account>
    <red-pack-account v-if="showIndex === 2" :red-pack-type="1" :key="showIndex" @next="showNext"></red-pack-account>
  </div>
</template>
<script>
  import RedPackAccount from 'com/redpackAccountDialog'
  export default{
    name:'dialog-manage',
    components:{
      RedPackAccount  // 注册开户红包弹窗
    },
    data(){
      return{
        showIndex:1  //弹窗顺序
      }
    },
    methods:{
      showNext(){
        this.showIndex += 1
      }
    }
  }
</script>
<style>

</style>
