<template>
  <div class="modal hide fade" tabindex="-1" role="dialog" aria-hidden="false" ref="novicePackageModal">
    <div class="modal-dialog modal-novicePackage">
      <a class="close btn-close btn-np" data-dismiss="modal" @click="closeDialog"></a>
      <div class="novice-header">
      </div>
      <div class="novice-body">
        <div class="novice-item">
          <div class="item-num">01
          </div>
          <div class="novice-item-panel">
            <div class="novice-item-panel-header">
            </div>
            <div class="novice-item-panel-body">
              <div class="item-panel-body">
                <div class="panel-header">
                  <span class="header-text1">¥</span>
                  <span class="header-text2">10</span>
                  <span class="header-text3">代金券</span>
                </div>
                <div class="panel-content">
                  <div class="panel-content-coupons first">
                    <div class="coupons-text1">黑龙江时时彩</div>
                    <div class="panel-content-coupons-value">
                      <span class="coupons-text2">¥</span>
                      <span class="coupons-text3">500</span>
                    </div>
                  </div>
                  <div class="panel-content-coupons second">
                    <div class="coupons-text1">QQ分分彩</div>
                    <div class="panel-content-coupons-value">
                      <span class="coupons-text2">¥</span>
                      <span class="coupons-text3">10</span>
                    </div>
                  </div>
                </div>
                <div class="panel-footer" @click="reviceCoupons">立即领取</div>
              </div>
            </div>
          </div>
        </div>
        <div class="novice-item">
          <div class="item-num">02
          </div>
          <div class="novice-item-panel">
            <div class="novice-item-panel-header">
            </div>
            <div class="novice-item-panel-body">
              <div class="item-panel-body">
                <div class="panel-header">
                  <span class="header-text1">¥</span>
                  <span class="header-text2">8</span>
                  <span class="header-text3">首充奖励</span>
                </div>
                <div class="panel-content">
                  <div class="panel-content-img-panel">
                    <div class="panel-content-img recharge"></div>
                  </div>
                  <div class="panel-content-text-panel">
                    <div class="panel-content-text">首次充值任意金额即可返<span class="panel-content-text red">8元，</span></div>
                    <div class="panel-content-text">该奖励自首次登录之日起</div>
                    <div class="panel-content-text"><span class="panel-content-text red">3天</span>内有效</div>
                  </div>
                </div>
                <div class="js-header-recharge panel-footer" @click="closeDialog">立即充值</div>
              </div>
            </div>
          </div>
        </div>
        <div class="novice-item">
          <div class="item-num">03
          </div>
          <div class="novice-item-panel">
            <div class="novice-item-panel-header">
            </div>
            <div class="novice-item-panel-body">
              <div class="item-panel-body">
                <div class="panel-header">
                  <span class="header-text2">0.3</span>
                  <span class="header-text1">%</span>
                  <span class="header-text3">投注返水</span>
                </div>
                <div class="panel-content">
                  <div class="panel-content-img-panel">
                    <div class="panel-content-img bet"></div>
                  </div>
                  <div class="panel-content-text-panel">
                    <div class="panel-content-text">自首次登录之日起<span class="panel-content-text red">3天</span>内的投注</div>
                    <div class="panel-content-text">额，平台将按<span class="panel-content-text red">0.3%</span>的比例</div>
                    <div class="panel-content-text">结算返水奖励</div>
                  </div>
                </div>
                <div class="panel-footer"><a href="#/bc/0/19" @click="closeDialog">立即投注</a></div>
              </div>
            </div>
          </div>
        </div>
        <div class="novice-item">
          <div class="item-num">04
          </div>
          <div class="novice-item-panel">
            <div class="novice-item-panel-header">
            </div>
            <div class="novice-item-panel-body">
              <div class="item-panel-body">
                <div class="panel-header">
                  <span class="header-text1">¥</span>
                  <span class="header-text2">18</span>
                  <span class="header-text3">额外奖励</span>
                </div>
                <div class="panel-content">
                  <div class="panel-content-img-panel">
                    <div class="panel-content-img add"></div>
                  </div>
                  <div class="panel-content-text-panel">
                    <div class="panel-content-text">1、手机号码认证：<span class="panel-content-text red">奖励8元</span></div>
                    <div class="panel-content-text">2、电子邮箱认证：<span class="panel-content-text red">奖励5元</span></div>
                    <div class="panel-content-text">3、绑定银行卡：<span class="panel-content-text red">奖励5元</span></div>
                  </div>
                </div>
                <div class="panel-footer" @click="closeDialog"><a href="#/uc/pl" @click="closeDialog">去完善资料</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="novice-footer"></div>
    </div>
  </div>
</template>
<script>
  import activityInfo from 'api/activity'
  export default{
    name: 'index',

    data () {
      return {}
    },

    props: {},

    components: {},

    mounted () {
      this.$nextTick(() => {
        $(this.$refs.novicePackageModal).modal({
          backdrop: 'static',
        })
          .on('hidden.modal', () => {
            this.$store.commit(types.TOGGLE_NOVICE_PACKAGE, false)
          })
      })
      activityInfo.getNovicePackageInfo(
        ({data}) => {
          if (data && data.result === 0) {
            this.initActivityData(data)
          }else{
            Global.ui.notification.show(data.msg)
          }
        }
      )
    },

    watch: {},

    computed: {},

    filters: {},

    methods: {
      reviceCoupons(){
        Global.ui.notification.show('代金券领取成功！')
      },
      closeDialog(){
        $(this.$refs.novicePackageModal).modal('hide')
        setTimeout(() => {
          this.$store.commit(types.TOGGLE_NOVICE_PACKAGE, false)
        }, 1000)
      },
    }
  }
</script>

<style lang="scss" scoped>
  .modal-novicePackage {
    z-index: 1050;
    border: 0;
    width: 979px;
    min-height: 621px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    position: relative;
    padding: 0;
    .btn-np {
      background: url('./misc/np-close.png');
      width: 35px;
      height: 35px;
      top: 17px;
      right: 20px;
    }
    .novice-header {
      background: url('./misc/np-header.png');
      width: 980px;
      height: 179px;
    }
    .novice-body {
      padding: 0 34px;
      position: relative;
      z-index: 2;
      .novice-item {
        vertical-align: top;
        margin: 0 11px;
        text-align: center;
        display: inline-block;
        width: 200px;
        .item-num {
          font-size: 28px;
          color: #dfd2bf;
          width: 60px;
          padding: 16px 0;
          border-bottom: 4px solid #e4dfd5;
          margin: 0 auto;
        }
        .novice-item-panel {
          margin-top: 23px;
          width: 200px;
          background: #ffffff;
          /*box-shadow: 0 4px 10px rgba(0, 0, 0, .1);*/
          .novice-item-panel-header {
            background: url('./misc/np-panel-header.png');
            width: 217px;
            margin-left: -8px;
            z-index: 1;
            position: relative;
            height: 50px;
          }
          .novice-item-panel-body {
            height: 270px;
            box-shadow: 0 0px 15px rgba(0, 0, 0, .2);
            margin-top: -2px;
            width: 201px;
            bottom: 44px;
            .item-panel-body {
              position: absolute;
              bottom: -7px;
              z-index: 2;
              .panel-header {
                border-bottom: 1px dashed #f2e3c8;
                padding: 13px 0;
                height: 23px;
                margin: 0 14px;
                width: 174px;
                .header-text1 {
                  font-size: 18px;
                  color: #a1895f;
                  vertical-align: top;
                  line-height: 14px;
                  text-align: left;
                  margin-right: 3px;
                }
                .header-text2 {
                  display: inline-block;
                  margin-left: -5px;
                  font-size: 32px;
                  color: #c9a76d;
                  /*font-style: italic;*/
                  /*font-family: "黑体";*/
                  font-weight: 500;
                  transform: skew(-8deg, 2deg);
                }
                .header-text3 {
                  font-size: 16px;
                  color: #cdc2b0;
                  margin-left: 3px;
                }
              }
              .panel-content {
                height: 162px;
                border-bottom: 1px dashed #f2e3c8;
                margin: 0 14px;
                width: 174px;
                padding-top: 15px;
                .panel-content-img-panel {
                  width: 64px;
                  height: 64px;
                  border-radius: 50px;
                  background: #f4f2ee;
                  margin: 15px auto;
                  .panel-content-img {
                    width: 64px;
                    height: 64px;
                    &.recharge {
                      background: url('./misc/np-recharge.png')
                    }
                    &.bet {
                      background: url('./misc/np-bet.png')
                    }
                    &.add {
                      background: url('./misc/np-activity.png')
                    }
                  }
                }
                .panel-content-text-panel {
                  .panel-content-text {
                    font-size: 12px;
                    text-align: left;
                    color: #333333;
                    &.red {
                      color: #e84c4c;
                    }
                  }
                }
                .panel-content-coupons {
                  height: 55px;
                  color: #ffffff;
                  padding: 0 18px;
                  margin: 13px auto;
                  width: 83px;
                  .coupons-text1 {
                    text-align: left;
                    font-size: 12px;
                    padding: 3px;

                  }
                  .panel-content-coupons-value {
                    text-align: left;
                    margin-left: 5px;
                  }
                  .coupons-text2 {
                    font-size: 12px;
                    vertical-align: top;
                    float: left;
                    line-height: 14px;
                  }
                  .coupons-text3 {
                    font-size: 20px;
                    font-style: italic;
                  }
                  &.first {
                    background: url('./misc/np-coupons-red.png');
                  }
                  &.second {
                    background: url('./misc/np-coupons-blue.png');
                  }
                }
              }
              .panel-footer {
                cursor: pointer;
                margin: 23px auto;
                width: 150px;
                height: 32px;
                border-radius: 20px;
                color: #ffffff;
                line-height: 32px;
                font-size: 14px;
                background: linear-gradient(to right, #efdbaf, #aa8b5b);
                bottom: 4px;
                position: relative;
                &.active, &:hover {
                  box-shadow: rgba(0, 0, 0, 0.2) 3px 3px 10px;
                }
              }
            }
          }
        }
      }
    }
    .novice-footer {
      background: url('./misc/np-footer.png');
      width: 329px;
      height: 145px;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
</style>

