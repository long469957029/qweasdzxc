<template>
  <div class="marquee" @mouseover="stopScoll" @mouseout="startScoll">
    <div class="content" v-html="content" ref="container"></div>
  </div>
</template>

<script>
  export default {
    name: "vue-marquee",
    props:{
      speed:{  // 速度 毫秒
        type: Number,
        default:60000
      },
      scollWidth:{
        type: Number,
        required: true
      },
      content:{
        type:String,
        required: true
      }
    },
    data(){
      return{
        initialLeft: 0,
        currentLeft: 0
      }
    },
    watch:{
      content:function () {
        if(this.content !== ''){
          this.$nextTick(() => {
            this.currentLeft = this.initialLeft = this.$refs.container.offsetWidth
            this.startScoll()
          })
        }
      }
    },
    methods:{
      startScoll(){
        Velocity(this.$refs.container, {
          left: this.currentLeft
        }, {
          duration: 0
        })
        Velocity(this.$refs.container, {
          left: -this.initialLeft
        }, {
          easing: 'linear',
          duration: this.speed,
          complete: () => {
            this.startScoll()
          }
        })
      },
      stopScoll(){
        this.currentLeft = this.$refs.container.style.left
        Velocity(this.$refs.container, 'stop')
      }
    },
  }
</script>

<style lang="scss">
  .marquee{
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    .content{
      position: absolute;
      left: 100%;
      /*min-width: 100%;*/
      height: 100%;
    }
  }
</style>
