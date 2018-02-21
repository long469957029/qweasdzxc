<template>
  <div class="marquee">
    <div class="content" v-html="content"></div>
  </div>
</template>

<script>
  export default {
    name: "vue-marquee",
    props:{
      speed:{  // 速度 秒
        type: Number,
        default:10
      },
      // width:{
      //   type:Number,
      //   required: true
      // },
      content:{
        type:String,
        required: true
      }
    },
    data(){
      return{

      }
    }
  }
</script>

<style lang="scss" scoped>
  .marquee{
    width: 100%;
    overflow: hidden;
    .content{
      position: absolute;
    }
  }
</style>
