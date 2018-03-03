<template>
  <status-cell class="slide-show" :status="bannerLoading" :has-data="slides.length" loading-tip="">
    <div class="slide-img" @mouseover="clearInv"
         @mouseout="runInv">
      <a :href="slides[nowIndex].advUrl">
        <transition name="slide-trans">
          <img v-if="isShow" :src="locUrl + slides[nowIndex].picUrl">
        </transition>
        <transition name="slide-trans-old">
          <img v-if="!isShow" :src="locUrl + slides[nowIndex].picUrl">
        </transition>
      </a>
    </div>
    <!--<h2>{{ slides[nowIndex].title }}</h2>-->
    <ul class="slide-pages" v-show="isPage">
      <!--<li @click="goto(prevIndex)">&lt;</li>-->
      <li v-for="(item, index) in slides"
          @click="goto(index)">
        <a :class="{on: index === nowIndex}"></a>
      </li>
      <!--<li @click="goto(nextIndex)">&gt;</li>-->
    </ul>
  </status-cell>
</template>

<script>
  import animateLoading from 'com/loading-animate'
  import {getBannerADApi} from 'api/dashboard'

  export default {
    props: {
      inv: {
        type: Number,
        default: 5000
      }
    },
    components: {
      animateLoading
    },
    data() {
      return {
        slides: [
          {
            picUrl: require('./misc/banner-1.png'),
          },
          {
            picUrl: require('./misc/banner-2.png'),
          },
          {
            picUrl: require('./misc/banner-3.png'),
          }
        ],
        nowIndex: 0,
        isShow: true,
        isPage: false,
        bannerLoading: 'loading',
        locUrl: 'http://' + window.location.host,
      }
    },
    computed: {
      prevIndex() {
        if (this.nowIndex === 0) {
          return this.slides.length - 1
        }
        else {
          return this.nowIndex - 1
        }
      },
      nextIndex() {
        if (this.nowIndex === this.slides.length - 1) {
          return 0
        }
        else {
          return this.nowIndex + 1
        }
      }
    },
    methods: {
      goto(index) {
        this.isShow = false
        setTimeout(() => {
          this.isShow = true
          this.nowIndex = index
        }, 10)
      },
      runInv() {
        if (this.slides.length > 1) {
          this.invId = setInterval(() => {
            this.goto(this.nextIndex)
          }, this.inv)
        }
      },
      clearInv() {
        clearInterval(this.invId)
      }
    },
    mounted() {
      this.bannerLoading = 'loading'
      getBannerADApi(
        ({data}) => {
          if (data && data.result === 0) {
            this.slides = data.root || this.slides
            this.bannerLoading = 'completed'
            this.isPage = this.slides.length > 1
          }
        })
        .finally(() => {
          this.loadingStatus = 'completed'
        })
      this.runInv();
    }
  }
</script>

<style scoped>
  .slide-trans-enter-active {
    transition: all 1s;
  }

  .slide-trans-enter {
    transform: scale(1.2, 1.2);
    opacity: 1;
  }

  .slide-trans-old-leave-active {
    transition: all 1s;
    opacity: 0;
  }

  .slide-show {
    position: relative;
    margin: 0 auto;
    width: 100%;
    height: 450px;
    overflow: hidden;
    display: flex;
    justify-content: center;
  }

  .slide-img {
    width: 100%;
  }

  .slide-img img {
    width: 1920px;
    height: 100%;
    position: absolute;
    top: 0;
    max-width: 1920px;
    left: 50%;
    margin-left: -960px;
  }

  .slide-pages {
    position: absolute;
    bottom: 20px;
    margin-bottom: 5px;
    padding: 5px 20px;
    background: rgba(0, 0, 0, .4);
    border-radius: 20px;
  }

  .slide-pages li {
    display: inline-block;
  }

  .slide-pages li a {
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(0, 0, 0, .6);
    margin-right: 15px;
    margin-left: 15px;
    cursor: pointer;
  }

  .slide-pages li a.on {
    background: rgba(255, 255, 255, .6);
  }
</style>
