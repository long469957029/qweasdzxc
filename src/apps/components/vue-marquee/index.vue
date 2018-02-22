<template>
  <div class="marquee" @mouseover="stopScoll" @mouseout="startScoll">
    <div class="content" v-html="content" ref="container"></div>
  </div>
</template>

<script>
  export default {
    name: "vue-marquee",
    props:{
      // 速度 1:1px
      speed:{
        type: Number,
        default: 50
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
        //总长度
        initialLeft: 0,
        //当前长度
        currentLeft: 0
      }
    },
    watch:{
      content:function () {
        if(this.content !== ''){
          this.$nextTick(() => {
            this.currentLeft = this.initialLeft = this.$refs.container.offsetWidth
            this.stopScoll()
            this.startScoll()
          })
        }
      }
    },

    computed: {
      duration() {
        return (this.initialLeft * 2 - (this.initialLeft - this.currentLeft)) / this.speed * 1000000
      },
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
          duration: this.duration,
          complete: () => {
            this.currentLeft = this.scollWidth
            this.startScoll()
          }
        })
      },
      stopScoll(){
        console.log(this.$refs.container.offsetLeft)
        this.currentLeft = this.$refs.container.offsetLeft
        Velocity(this.$refs.container, 'stop', true)
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
      white-space: nowrap;
    }
  }
</style>
