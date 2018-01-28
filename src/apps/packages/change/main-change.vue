<template>
  <div class="change-center">
    <div class="change-header">
      <div class="change-title">
        <div class="inline-block">
          <div class="sfa sfa-logo-change-lg inline-block"></div>
          <div class="change-title-name inline-block">
            <div class="sfa sfa-logo-change-name"></div>
            <div>行业品牌领导者</div>
          </div>
        </div>
        <div class="change-title-panel inline-block">
          <div class="change-title-features inline-block" v-on:click="doCollect">
            <div class="title-img-con inline-block"><i class="fa fa-heart" aria-hidden="true"></i></div>
            <div class="title-text inline-block">收藏我们</div>
          </div>
          <div class="change-title-features inline-block" v-on:click="openAppDownload">
            <div class="title-img-download inline-block"><i class="fa fa-mobile" aria-hidden="true"></i></div>
            <div class="title-text inline-block">APP下载</div>
            <div class="title-app-download-panel" v-show="appDownload">
              <div class="title-app-download-text">
                手机扫一扫下载
              </div>
              <div class="title-app-download">
                <div class="title-app-download-img"></div>
              </div>
            </div>
          </div>

          <div class="change-title-features-service customService inline-block">
            <a href="javascript:void(0)"
               onclick="newwin = window.open('https://szzero.livechatvalue.com/chat/chatClient/chatbox.jsp?companyID=576264&amp;configID=53412&amp;jid=9259996324&amp;s=1&amp;enterurl=http%3A%2F%2Fforehead.5x5x.com%2Flogin.html','service','width=800,height=680'); newwin.moveTo(100,50);"
               title="联系客服">
              <span class="title-img-service sfa sfa-icon-change-customSupport inline-block"></span>
              <span class="title-text inline-block">在线客服</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="change-body clearfix">
      <div class="change-body-left" ref="leftBuilding"></div>
      <div class="change-body-right" ref="rightBuilding"></div>
      <div class="change-panel">
        <div class="change-panel-title">
          线路检测中心
        </div>
        <div class="change-panel-desc">
          <!--<div class="change-panel-desc-line"></div>-->
          <div class="change-panel-desc-text">请选择最快的链接进入网站</div>
        </div>
        <div>
          <div class="change-panel-left inline-block">
            <div class="change-url-container">
              <div class="change-url-panel" v-for="(item, index) in serverList">
                <div class="change-url-speed inline-block" :class="item.className">
                  <span class="change-url-speed-num ">{{item.time}}</span>
                  <span class="change-url-speed-unit">ms</span>
                </div>
                <div class="change-url-link inline-block">{{item.server}}</div>
                <div class="change-url-button inline-block suggest" v-if="index===0">
                  <a :href="item.server" class="yr">推荐进入</a>
                </div>
                <div class="change-url-button inline-block" v-else>
                  <a :href="item.server" class="url-link">立即进入</a>
                </div>
              </div>
            </div>
            <div class="change-url-refresh-panel">
              <div class="change-url-refresh-button" v-on:click="refreshUrlList">
                <span class="sfa sfa-icon-change-refresh"></span>
                <span class="change-url-refresh-text">重新刷新检测</span>
              </div>
            </div>
          </div>
          <div class="change-panel-right inline-block">
            <div class="change-desc-line inline-block"></div>
            <div class="inline-block">
              <div class="change-desc-panel">
                <div class="change-desc-img">
                </div>
                <div class="change-desc-text">
                  本平台秉承重视安全的宗旨，不定期更换域名，<br>为了使您能随时最方便的获取到平台最新最快的登录域名，<br>请按<span class="text-cope">CTRL+D</span>收藏本页面,
                  <br>或<a class="download-url" href='/setup.exe' target='_blank'>下载登录器</a>获取永久自动更新。
                </div>
              </div>
              <div class="change-desc-panel">
                <div class="change-desc-img">
                </div>
                <div class="change-desc-text">
                  如果您在访问我们域名时被跳转到其他网站，<br>那是您当地电信运营商DNS被挟持，<br>
                  您可以通过电脑本地DNS来解决。<a class="DNS-url" href='/dns.docx' target='_blank'>防dns劫持教程</a>
                </div>
              </div>
              <div class="change-desc-panel">
                <div class="change-desc-img">
                </div>
                <div class="change-desc-text">
                  为了保证最佳使用体验，<br>请保持您的屏幕分辨率在1280及以上。
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <div class="change-panel-footer">
        <div class="footer-browser-text inline-block">
          为了更好的操作体验首选Chrome、Firefox或IE10以上浏览器，点击可立刻下载：
        </div>
        <div class="footer-browser inline-block">
          <div class="footer-browser-text inline-block"></div>
          <div class="footer-browser-area inline-block">
            <div class="browser-area inline-block">
              <a class="sfa sfa-icon-chrome-active" href="http://w.x.baidu.com/alading/anquan_soft_down_ub/14744"></a>
            </div>
            <div class="browser-area inline-block">
              <a class="sfa sfa-icon-firefox-active"
                 href="http://download.firefox.com.cn/releases-sha2/full/52.5esr/zh-CN/Firefox-ESR-full-latest.exe"></a>
            </div>
            <div class="browser-area inline-block">
              <a class="sfa sfa-icon-IE-active"
                 href="http://windows.microsoft.com/zh-cn/internet-explorer/download-ie"></a>
            </div>
          </div>
        </div>
        <div class="footer-copyright">
          Copyright <i class="fa fa-copyright footer-copyright-img" aria-hidden="true"></i> 2017-2018<span
          class="footer-copyright-name">无限娱乐</span> 版权所有
        </div>
      </div>
    </div>

  </div>
</template>
<script>
  import otherRequest from '../../api/other'
  export default{
    name: 'main-change',

    data () {
      return {
        appDownload: false,
        urlList: [],
        serverList: [],
      }
    },

    props: {},

    components: {},

    watch: {},
    mounted() {
      this.refreshUrlList()
      Velocity(this.$refs.leftBuilding, {
        opacity: 0,
        left: -1000
      }, {
        duration: 0
      })
      Velocity(this.$refs.rightBuilding, {
        opacity: 0,
        right: -1000
      }, {
        duration: 0
      })
      Velocity(this.$refs.leftBuilding, {
        opacity: 1,
        left: 0
      }, {
        duration: 2000
      })
      Velocity(this.$refs.rightBuilding, {
        opacity: 1,
        right: 0
      }, {
        duration: 2000
      })
    },
    computed: {},

    filters: {},
    methods: {
      urlConnectTest (urlList) {
        const servers = urlList

        const defer = $.Deferred()
          .done(() => {
            this.append(servers)
          })

        let contentCount = 0
        _(servers).each((serverInfo, index, list) => {
          const start = Date.now()
          serverInfo = (serverInfo.indexOf('http://') > -1 || serverInfo.indexOf('https://') > -1) ? serverInfo : `http://${serverInfo}`
          $.ajax({
            url: `${serverInfo}/connect-test.json`,
            dataType: 'jsonp',
            jsonpCallback: 'abc',
            timeout: 2000,
          })
            .always(() => {
              const serverAddress = serverInfo
              const timems = Math.floor((Date.now() - start))
              let className = ''
              if (timems > 200 && timems <= 700) {
                className = 'orange'
              } else if (timems > 700) {
                className = 'red'
              } else {
                className = 'green'
              }
              this.serverList.push({time: timems, server: serverAddress, className: className})
              if (++contentCount === list.length) {
                defer.resolve()
              }
            })
        })
      },

      append (urlList) {
        urlList.sort((a, b) => {
          return (a.time > b.time) ? 1 : -1
        })
      },
      refreshUrlList(){
        otherRequest.getServerListXhr(
          ({data}) => {
            if (data && data.result === 0) {
              this.serverList = []
              this.urlList = data.root || this.urlList
              this.urlConnectTest(this.urlList)
            }
          },
          () => {
            Global.ui.notification.show('数据请求失败')
          }
        )
      },
      openAppDownload(){
        if (this.appDownload) {
          this.appDownload = false
        } else {
          this.appDownload = true
        }
      },
      doCollect(){
        const url = window.location.href
        const title = document.title
        const ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL'

        if (window.sidebar) { // firefox;
          alert(`您正在使用的浏览器可以尝试通过快捷键${ctrl} + D 加入到收藏夹~`)
        } else if (document.all) { // document.all 用于低版本的IE
          window.external.addFavorite(url, title)
        } else {　// 添加收藏的快捷键
          alert(`您正在使用的浏览器可以尝试通过快捷键${ctrl} + D 加入到收藏夹~`)
        }
      }
    },

  }
</script>

<style lang="scss" scoped>
  @import "~base/styles/imports";

  .change-center {
    height: 100%;
    overflow: hidden;
    .change-header {
      width: 100vw;
      height: 89px;
      position: relative;
      background: #129098;
      z-index: 51;
      .change-title {
        padding-top: 14px;
        width: 1000px;
        margin: 0 auto;
        .change-title-name {
          margin-left: 17px;
          font-size: 14px;
        }
        .change-title-panel {
          float: right;
          margin-top: 23px;
          font-size: 0;
          .change-title-features {
            cursor: pointer;
            width: 75px;
            font-size: 14px;
            text-align: right;
            padding: 0 20px;
            border-right: 1px solid;
            height: 14px;
            line-height: 14px;
            position: relative;
            .title-img-con {
              font-size: 18px;
              position: absolute;
              left: 12px;
              margin-top: -2px;
            }
            .title-img-download {
              position: absolute;
              left: 17px;
              margin-top: -7px;
              font-size: 28px;
            }
            .title-text {
              margin-left: 8px;
              float: right;
            }
            .customService {
              width: 95px;
              border-right: 0;
            }
            .title-app-download-panel {
              position: absolute;
              padding: 0 17px 12px 17px;
              width: 116px;
              height: 138px;
              background: #ffffff;
              z-index: 99;
              top: 30px;
              left: 50%;
              margin-left: -75px;
              box-shadow: 0 3px 8px 0 $font-auxiliary-color;
              border-radius: 5px;
              .title-app-download-text {
                font-size: 12px;
                color: #666666;
                text-align: center;
                padding: 7px 0;
              }
            }
            .title-app-download-panel::before,
            .title-app-download-panel::after {
              position: absolute;
              content: '';
              height: 20px;
              width: 20px;
            }

            .title-app-download-panel::before {
              right: 17px;
              top: 27px;
              border-right: 1px solid $font-auxiliary-color;
              border-top: 1px solid $font-auxiliary-color;
            }

            .title-app-download-panel::after {
              left: 17px;
              bottom: 8px;
              border-left: 1px solid $font-auxiliary-color;
              border-bottom: 1px solid $font-auxiliary-color;
            }

            // 内层左上和右下 2 个角
            .title-app-download {
              width: 100px;
              height: 100px;
              padding: 7px;
              position: relative;
              .title-app-download-img {
                background-image: url('./change-QRcode.png');
                background-size: cover;
                width: 100%;
                height: 100%;
              }
            }

            .title-app-download::before,
            .title-app-download::after {
              position: absolute;
              content: '';
              height: 20px;
              width: 20px;
            }

            .title-app-download::before {
              left: 0;
              top: 0;
              border-left: 1px solid $font-auxiliary-color;
              border-top: 1px solid $font-auxiliary-color;
            }

            .title-app-download::after {
              right: -1px;
              bottom: 0;
              border-right: 1px solid $font-auxiliary-color;
              border-bottom: 1px solid $font-auxiliary-color;
            }
          }
          .change-title-features-service {
            width: 65px;
            padding-left: 39px;
            font-size: 14px;
            text-align: right;
            height: 14px;
            line-height: 14px;
            position: relative;
            .title-img-service {
              position: absolute;
              left: 12px;
              margin-top: -6px;
            }
            .title-text {
              margin-left: 8px;
              float: right;
            }
          }
        }
      }
    }
    .change-body {
      width: 100vw;
      height: 100%;
      background: $def-white-color;
      position: relative;
      box-sizing: border-box;
      top: 0;
      .change-body-left {
        width: 703px;
        background-image: url("./change-background-left.png");
        position: absolute;
        left: 0;
        background-size: cover;
        height: 100%;
      }
      .change-body-right {
        width: 671px;
        background-image: url("./change-background-right.png");
        position: absolute;
        right: 0;
        background-size: cover;
        height: 100%;
      }
      .change-panel {
        border-radius: 5px;
        width: 1000px;
        z-index: 50;
        height: 630px;
        position: relative;
        background: $def-white-color;
        margin: 50px auto;
        box-sizing: border-box;
        border: 1px solid #e6e6e6;
        box-shadow: 0 3px 8px 0 #e6e6e6;
        opacity: 0.8;
        padding: 15px 50px 55px 50px;
        .change-panel-title {
          padding: 13px 0;
          font-size: 22px;
          color: #333333;
          text-align: center;
          border-bottom: 2px solid #e5e5e5;
        }
        .change-panel-desc {
          text-align: left;

          .change-panel-desc-line {
            border-top: 2px solid $new-main-deep-color;
            width: 118px;
            margin-top: -2px;
          }
          .change-panel-desc-text {
            padding: 16px 0;
            font-size: 14px;
            color: $new-inverse-color;
          }

        }
        .change-panel-left {
          width: 518px;
          .change-url-container {
            min-height: 390px;
            overflow: auto;
            max-height: 440px;
            .change-url-panel {
              width: 460px;
              height: 40px;
              margin-bottom: 15px;
              .change-url-speed {
                border-right: 1px solid #e6e6e6;
                background-color: #f9fafa;
                border-top: 1px solid #e6e6e6;
                border-bottom: 1px solid #e6e6e6;
                padding: 8px 0 8px 16px;
                width: 60px;
                .change-url-speed-num {
                  font-size: 12px;
                  float: left;
                }
                .change-url-speed-num {
                  font-size: 10px;
                }
                &.green {
                  color: #5cb836;
                  border-left: 3px solid #5cb836;
                }
                &.orange {
                  color: #f09932;
                  border-left: 3px solid #f09932;
                }
                &.red {
                  color: #e84c4c;
                  border-left: 3px solid #e84c4c;
                }
              }
              .change-url-link {
                text-align: left;
                border-top: 1px solid #e6e6e6;
                border-bottom: 1px solid #e6e6e6;
                margin-left: -4px;
                color: #333333;
                padding: 8px 20px;
                width: 250px;
              }
              .change-url-button {
                border: 1px solid #e6e6e6;
                background-color: #f9fafa;
                margin-left: -4px;
                padding: 8px 14px;
                width: 60px;
                text-align: center;
                .url-link {
                  color: $new-main-deep-color;
                }
                &.suggest {
                  background-color: $new-main-deep-color;
                  border: 1px solid $new-main-deep-color;
                  color: $def-white-color;
                  &:hover {
                    color: $def-white-color;
                  }
                }
              }
            }
          }
          .change-url-refresh-panel {
            text-align: center;
            margin-top: 12px;
            .change-url-refresh-button {
              cursor: pointer;
              width: 124px;
              height: 22px;
              background-color: $new-main-deep-color;
              color: $def-white-color;
              padding: 9px 58px;
              margin-left: 105px;
              border-radius: 20px;
              .change-url-refresh-text {
                vertical-align: top;
                font-size: 14px;
                line-height: 21px;
                margin-left: 4px;
              }
            }
          }
        }
        .change-panel-right {
          float: right;
          padding-left: 67px;
          width: 312px;
          .change-desc-line {
            height: 440px;
            width: 2px;
            background: linear-gradient(#ffffff, #e5e5e5 50%, #ffffff);
            position: absolute;
            margin-left: -67px;
          }
          .change-desc-panel {
            margin-bottom: 40px;
            position: relative;
            text-align: left;
            .change-desc-img {
              width: 6px;
              height: 6px;
              background-color: $new-main-deep-color;
              border-radius: 40px;
              position: absolute;
              margin-top: 7px;
              margin-left: -20px;
            }
            .change-desc-text {
              color: $new-inverse-color;
              font-size: 12px;
              line-height: 23px;
              .text-cope {
                margin: 0 3px;
              }
              .download-url {
                color: $new-main-deep-color;
                margin: 0 3px;
              }
              .DNS-url {
                color: $new-main-deep-color;
                margin: 0 3px;
              }
            }
          }
        }
      }
      .change-panel-footer {
        font-size: 0;
        margin: 90px auto 0;
        width: 1000px;
        color: #333333;
        text-align: center;
        z-index: 50;
        position: relative;
        .footer-browser-text {
          vertical-align: top;
          margin-top: 14px;
          font-size: 14px;
          color: #333333;
        }
        .footer-browser {
          margin-left: 10px;
          .footer-browser-area {
            .browser-area {
              margin: 0 10px;
            }
          }
        }
        .footer-copyright {
          margin: 14px;
          color: #666666;
          font-size: 12px;
          .footer-copyright-name {
            margin-left: 3px;
          }

        }
      }
    }
  }
</style>

