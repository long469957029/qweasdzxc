<template>
  <div>
    <div class="rules-text-panel">
      <div class="res-header">
        购彩流程
      </div>
      <div class="res-content">
        <div class="res-desc">
          1）打开平台页面，鼠标移至导航栏上面的彩票菜单上，即可出现平台所有的彩种选择，请您直接点击自己喜欢的彩种进入到投注界面。
        </div>
        <div class="res-desc">
          <img src="./misc/lottery-1.png" />
        </div>
        <div class="res-desc">
          2）在彩种投注界面，在这里可以选择不同的游戏玩法或者点击“趣味”进入趣味玩法。
        </div>
        <div class="res-desc">
          <img src="./misc/lottery-2.png" />
        </div>
        <div class="res-desc">
          3）在对应的玩法下面选择号码进行投注，然后选择“元角分厘”模式，输入投注倍数。
        </div>
        <div class="res-desc">
          <img src="./misc/lottery-3.png" />
        </div>
        <div class="res-desc">
          4）再点击“添加号码”，最后点“确认投注”，投注成功。或在您选择号码和模式之后输入倍数，点击“快捷投注”。
        </div>
        <div class="res-desc">
          <img src="./misc/lottery-4.png" />
        </div>
        <div class="res-desc">
          5）快捷投注无须确认，直接即可投注成功；添加至号码栏中时，点击确认投注会需要再确认一次即可投注成功。
        </div>
        <div class="res-desc">
          <img src="./misc/lottery-5.png" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default{
        name: 'lotteryProcess',

        data () {
            return {}
        },

        props: {},

        components: {},

        mounted () {
            this.$nextTick(() => {
            })
        },

        watch: {},

        computed: {},

        filters: {},

        methods: {}
    }
</script>

<style lang="scss" scoped>
  .rules-text-panel{
    .res-header {
      padding: 14px 20px;
      color: $def-black-color;
      font-weight: 600;
      border-bottom: 1px solid $im-line-color;
      font-size: 14px;
    }
    .res-content{
      color: $def-black-color;
      padding: 10px 20px;
      font-size: 12px;
      .res-desc{
        padding: 10px 0;
        .res-desc-tit {
          font-size: 14px;
          color: $main-deep-color;
        }
        .res-desc-second-tit {
          font-size: 14px;
        }
      }
    }
  }
</style>

