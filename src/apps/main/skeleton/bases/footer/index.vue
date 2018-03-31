<template>
  <div class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div>
          <div class="link-list">
            <!-- 关于我们 和规则和条款是同一个页面的不同内容页   -->
            <li><router-link :to="{path:'/au',query: { page: 'AboutUs' }}">关于我们</router-link></li>
            <li><router-link :to="{path:'/au',query: { page: 'RulesAndTerms' }}" >规则与条款</router-link></li>
            <!-- 常见问题是去帮助中心 -->
            <!--<li><a href="#/hc?page=newbie">常见问题</a></li>-->
            <li><router-link :to="{path:'/hc',query: { page: 'DepositProcess' }}">常见问题</router-link></li>
            <!-- 游戏规则也是去帮助中心 -->
            <li><router-link :to="{path:'/hc',query: { page: 'SscLottery' }}">游戏规则</router-link></li>
            <!--<li><router-link to="mb" >下载中心</router-link></li>-->
            <!--<li><a href="/index.html#nb/detail/287">防劫持教程</a></li>-->
            <li><router-link :to="{path:'/hc',query: { page: 'DnsCourse' }}">防劫持教程</router-link></li>
          </div>

          <div class="download">
            <span class="download-list">
              <!-- 下载手机app点击任意icon都是进到下载中心页面 -->
              <span>下载手机APP：</span>
              <!--<router-link to="mb" ><div class="android-icon"></div></router-link>-->
              <!--<router-link to="mb" ><div class="ios-icon"></div></router-link>-->
              <a class="android-icon" href="#/mb"></a>
              <a class="ios-icon" href="#/mb"></a>
            </span>
          </div>
          <p>Copyright © 2016-2018 无限娱乐 版权所有</p>
          <p>无限娱乐郑重提示：彩票有风险，投注需谨慎，未满18周岁的青少年禁止购买</p>
          <div class="desc-bottom">
            <span class="cooperator-list">
              <span>合作伙伴：</span>
              <transition-group name="carousel-list" class="flex-row">
                <div v-for="index in cooperatorList" :key="`cooperator-${index}`" :class="`carousel-item cooperator-icon-${index}`"></div>
              </transition-group>
            </span>
          </div>
        </div>

        <div>
          <div class="desc-company">
            <p>
              作为行业挑战者，无限娱乐始终将品牌信誉作为发展的第一要务，
              在游戏选择，产品设计，运营服务的创新上从未妥协。实力让情怀
              落地，厚积薄发才能带给用户最极致的游戏体验。
            </p>
          </div>
          <div class="follow">
            <span class="follow-list">
              <span>关注我们：</span>
              <div class="wechat-icon icon"></div>
              <a href="https://weibo.com/6456736183/profile?rightmod=1&wvr=6&mod=personinfo&is_all=1" class="weibo-icon icon" target="_blank"></a>
              <a href="https://www.facebook.com/wx.wx.547389" class="facebook-icon icon" target="_blank"></a>
              <a href="https://twitter.com/wx_game" class="twitter-icon icon" target="_blank"></a>
            </span>
          </div>
          <div class="duty">
            <span class="duty-list">
              <span>博彩责任：</span>
              <transition-group name="carousel-list" class="flex-row">
                <div v-for="index in dutyList" :key="`duty-${index}`" :class="`carousel-item duty-icon-${index}`"></div>
              </transition-group>
            </span>
          </div>
        </div>
      </div>
      <div class="footer-bg"></div>
    </div>
    <div class="line"></div>
  </div>
</template>

<script>
export default {
  name: "main-footer",
  mounted() {
    const vm = this
    // vm.rotateCooperatorList()
    // vm.rotateDutyList()
    // setInterval(function() {
    //   vm.rotateCooperatorList()
    // }, 6000)
    // setInterval(function() {
    //   vm.rotateDutyList()
    // }, 4000)
  },
  data() {
    return {
      cooperatorList: _.range(1, 7),
      dutyList: _.range(1, 4),
      id: this._uid
    }
  },
  methods: {
    rotateCooperatorList() {
      const vm = this
      const firstCoperator = vm.cooperatorList[0]

      vm.cooperatorList.shift()
      vm.cooperatorList.push(firstCoperator)
    },

    rotateDutyList() {
      const vm = this
      const firstDuty = vm.dutyList[0]
      setTimeout(function() {
        vm.dutyList.shift()
        vm.dutyList.push(firstDuty)
      }, 500)
    }
  }
};
</script>

<style lang="scss"  scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.footer {
  position: relative;
  bottom: 0;
  right: 0;
  left: 0;
  /*display: none;*/
  height: 280px;
  background: #21232a;
  overflow: hidden;
  .line{
    position: absolute;
    width: 20000px;
    height: 0;
    border: 1px dashed #262931;
    top: 200px;
    left: 50%;
    margin-left: -947px;
  }
}

.footer-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;

  > div:nth-child(1) {
    width: 730px;
  }

  > div:nth-child(2) {
    width: 360px;
  }
}

.footer-bg {
  width: 517px;
  height: 280px;
  background: url("./images/footer-bg.png");
  position: absolute;
  right: 0;
  top: 0;
}

.footer-container {
  width: 1200px;
  position: relative;
  margin: 0 auto;
  padding: 24px 0 30px;

  span {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
  }

  p {
    font-size: 12px;
    color: #999;
  }
}

.link-list {
  display: flex;
  flex-direction: row;
  margin-bottom: 25px;

  li {
    height: 12px;
    border-right: #4d4f55;
    padding: 0 24px;
    list-style: none;
    position: relative;
    &:after{
      content: '';
      width: 1px;
      height: 12px;
      background: $new-inverse-color;
      position: absolute;
      display: block;
      right: 0;
      top: 5px;
    }
    &:nth-child(1) {
      padding-left: 0;
      padding-right: 20px;
    }
    &:last-child{
      &:after{
        display: none;
      }
    }
  }

  a {
    color: white;
    transition: all 0.3s;
    text-decoration: none;
    font-size: 14px;

    &:hover,
    &:active {
      color: $main-deep-color;
      text-decoration: underline;
    }
  }
}

.desc-bottom {
  margin-top: 50px;

  span {
    font-size: 14px;
  }
}

.desc-company {
  margin: 40px 0 10px;
  line-height: 25px;
}

.download {
  margin-bottom: 15px;

  .download-list {
    > a {
      margin-right: 10px;
    }

    > span {
      margin-right: 3px;
    }
  }
}

.follow {
  .follow-list {
    > span {
      margin-right: 10px;
    }

    .icon {
      margin-right: 10px;
    }
  }
}

.duty {
  margin-top: 40px;

  .duty-list {
    > span {
      font-size: 14px;
      margin-right: 10px;
    }

    > span > div {
      margin-right: 30px;
    }
  }
}

.download-list,
.follow-list,
.duty-list,
.cooperator-list {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.android-icon {
  width: 45px;
  height: 45px;
  background: url("./images/android-icon.png");
  transition: all 0.3s;

  &:hover,
  &:active {
    background: url("./images/android-icon-active.png");
  }
}

.wechat-icon {
  width: 28px;
  height: 28px;
  background: url("./images/wechat-icon.png");

  &:hover,
  &:active {
    background: url("./images/wechat-icon-active.png");
  }
}

.weibo-icon {
  width: 28px;
  height: 28px;
  background: url("./images/weibo-icon.png");

  &:hover,
  &:active {
    background: url("./images/weibo-icon-active.png");
  }
}
.facebook-icon {
  width: 28px;
  height: 28px;
  background: url("./images/facebook-icon.png");

  &:hover,
  &:active {
    background: url("./images/facebook-icon-active.png");
  }
}
.twitter-icon {
  width: 28px;
  height: 28px;
  background: url("./images/twitter-icon.png");

  &:hover,
  &:active {
    background: url("./images/twitter-icon-active.png");
  }
}

.duty-list {
  .duty-icon-1 {
    width: 24px;
    height: 26px;
  }

  .duty-icon-2 {
    width: 25px;
    height: 25px;
  }

  .duty-icon-3 {
    width: 25px;
    height: 24px;
  }
}

.cooperator-list {
  > span > div {
    margin: 0 15px;
  }

  .cooperator-icon-1 {
    width: 66px;
    height: 22px;
  }

  .cooperator-icon-2 {
    width: 94px;
    height: 20px;
  }

  .cooperator-icon-3 {
    width: 96px;
    height: 24px;
  }

  .cooperator-icon-4 {
    width: 84px;
    height: 21px;
  }

  .cooperator-icon-5 {
    width: 86px;
    height: 25px;
  }

  .cooperator-icon-6 {
    width: 65px;
    height: 22px;
  }
}

.ios-icon {
  width: 45px;
  height: 45px;
  background: url("./images/ios-icon.png");
  transition: all 0.3s;

  &:hover,
  &:active {
    background: url("./images/ios-icon-active.png");
  }
}

.carousel-item {
  transition: all 1s;
}

.carousel-list-leave-active {
  position: absolute;
}

@for $i from 1 to 7 {
  .cooperator-icon-#{$i} {
    background: url("./images/cooperator-icon-#{$i}.png");
  }
}

@for $i from 1 to 4 {
  .duty-icon-#{$i} {
    background: url("./images/duty-icon-#{$i}.png");
  }
}

@media (min-height: 930px) {
  .footer {
    display: block;
  }
}
</style>
