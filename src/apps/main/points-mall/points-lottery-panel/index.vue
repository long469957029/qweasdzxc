<template>
  <div class="points-lottery-panel">
    <div class="lottery-panel-inner">
      <status-cell class="lottery-panel" :has-data="currentAwards.length" :status="loadingStatus">
        <div class="lottery-panel-main">
          <div class="x-switch">
            <input type="radio" class="switch-input" v-model.number="currentLottery" value="0" id="week">
            <label for="week" class="switch-label switch-label-off">
              {{cashRob | convert2yuan}}元夺宝
            </label>
            <input type="radio" class="switch-input" v-model.number="currentLottery" value="1" id="month">
            <label for="month" class="switch-label switch-label-on">
              {{cashRob10 | convert2yuan}}元夺宝
            </label>
            <span class="switch-selection"></span>
          </div>
          <div class="lottery-task">
            <div class="lottery-task-inner">
              <div class="task-cell-wrapper" v-for="(award, index) in currentAwards" :key="index" ref="awards">
                <div class="task-cell" :class="{selected: award.selected}">
                  <div class="task-cell-inner">
                    <div class="task-item">
                      <!-- 谢谢惠顾 -->
                      <div class="icon-task-smiley" v-if="award.awardTypeId === 0"></div>
                      <!-- 券 -->
                      <div class="points-ticket sfa" :class="`sfa-pt-${award.style1}`" v-else-if="award.awardTypeId === 1">
                        <span class="task-item-title">{{award.couponName}}</span>
                        <span class="task-item-val" v-if="award.conditionType === 2">{{award.bigShowNum}}%</span>
                        <span class="task-item-val" v-else><span class="task-item-unit">¥</span>{{award.bigShowNum}}</span>
                      </div>
                      <!-- 商品 -->
                      <img :src="award.picUrl" class="task-gift-pic" v-else-if="award.awardTypeId === 2" />
                      <!-- 积分 -->
                      <div class="sfa-pt-task-points" v-else-if="award.awardTypeId === 3"></div>
                    </div>
                    <div class="task-badge" v-if="award.awardTypeId === 1">
                      <template v-if="award.type === 601">
                        现金{{award.bigShowNum}}{{award.conditionUnit}}
                      </template>
                      <template v-else>
                        {{award.mainDesc}}
                      </template>
                    </div>
                    <div class="task-badge" v-else-if="award.awardTypeId === 2">{{award.itemName}}</div>
                    <div class="task-badge" v-else-if="award.awardTypeId === 3">积分 {{award.integral | convert2yuan}}</div>
                    <div class="task-badge" v-else>{{award.desc}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="task-button">
              <button class="points-btn btn btn-orange" @click="isLogin ? lottery(0) : login()" :disabled="pushing">
                {{currentIntegralRob | convert2yuan}} 积分夺宝
              </button>
              <button class="currency-btn btn" @click="isLogin ? lottery(1) : login()" :disabled="pushing">
                {{currentCashRob | convert2yuan}}元 现金夺宝
              </button>
            </div>
            <div class="task-tip">
              <span class="sfa sfa-pt-task-tip"></span>
              提示：每夺宝1次可获得{{currentRobLucky}}幸运值，幸运值可用于下方幸运抽奖
            </div>
          </div>
        </div>

        <!-- 获奖名单 -->
        <div class="lottery-list">
          <div class="lottery-list-inner">
            <div class="lottery-top">
              <span class="sfa sfa-pt-task-winner-list"></span>
              获奖名单
            </div>
            <div class="lottery-divider"></div>
            <transition-group class="lottery-list-main" name="ani-scroll" tag="div">
              <div class="lottery-list-main-inner" v-for="user in recentUser" :key="user.uid">
                <span class="lottery-list-left">恭喜 {{user.userName}}获得</span>
                <span class="lottery-list-right" v-if="user.awardTypeId === 1">
                  <span class="lottery-list-right-val">{{user.bigShowNum}}{{user.conditionUnit}}</span>{{user.couponName}}
                </span>
                <span class="lottery-list-right" v-if="user.awardTypeId === 2">
                  {{user.bonusName}}
                </span>
                <span class="lottery-list-right" v-if="user.awardTypeId === 3">
                  <!-- 旧资料 -->
                  <template v-if="user.subType === 0">
                    {{user.bonusName}}
                  </template>
                  <template v-else>
                    <span class="lottery-list-right-val">{{user.bonusAmount | convert2yuan}}</span>积分
                  </template>
                </span>
              </div>
            </transition-group>
          </div>
        </div>
      </status-cell>
      <div class="sfa-pt-hanger hanger-left"></div>
      <div class="sfa-pt-hanger hanger-right"></div>
    </div>
    <div class="lucky-panel">
      <div class="lucky-title">
        <span class="sfa sfa-pt-lucky-star"></span>
        当前幸运值：<span class="lucky-points">{{myLucky}}</span>
      </div>
      <div class="lucky-main">
        <div class="lucky-cell" v-for="(chest, index) in chestList" :key="index">
          <div class="cell-probability">{{chest.rate | formatDiv(100)}}%<br/>概率</div>
          <div class="lucky-prize-wrapper">
            <div class="lucky-prize">
              <div class="lucky-prize-inner">
                <!-- 券 -->
                <div class="sfa lucky-container" :class="`sfa-pt-${chest.style2}`" v-if="chest.awardTypeId === 1">
                  <span class="lucky-type">{{chest.couponName}}</span>
                  <!--<span class="lucky-val" >{{chest.conditionNumber}}{{chest.conditionUnit}}</span>-->
                </div>
                <!-- 商品 -->
                <img :src="chest.picUrl" class="gift-pic" v-else-if="chest.awardTypeId === 2" />
                <!--<div class="sfa-pt-task-points" ></div>-->
                <!-- 积分 -->
                <div class="sfa-pt-task-points" v-else-if="chest.awardTypeId === 3"></div>
              </div>
            </div>
          </div>
          <div class="lucky-prize-name" v-if="chest.awardTypeId === 1">
            <template v-if="chest.type === 601">
              现金{{chest.bigShowNum}}{{chest.conditionUnit}}
            </template>
            <template v-else-if="chest.secondDesc">
              {{chest.mainDesc}} {{chest.bigShowNum}}{{chest.conditionUnit}}
            </template>
            <template v-else>
              {{chest.mainDesc}}
            </template>
          </div>
          <div class="lucky-prize-name" v-else-if="chest.awardTypeId === 2">{{chest.itemName}}</div>
          <div class="lucky-prize-name" v-else-if="chest.awardTypeId === 3">
            积分{{chest.integral | convert2yuan}}
          </div>
          <button class="lucky-exchange-btn btn" @click="isLogin ? luckChest(chest) : login()" :disabled="pushing">
            <span class="sfa sfa-pt-lucky-star-points"></span>
            <span class="lucky-exchange-title">{{chest.lucky}} 幸运值{{chest.rate === 10000 ? '兑换' : '碰运气'}}</span>
          </button>
        </div>
      </div>
    </div>

    <div v-transfer-dom>
      <!-- 抽奖结果 中 -->
      <x-dialog v-if="isShowPrized" @modal-hidden="isShowPrized = false" type="arc">
        <div slot="head-main">恭喜您成功获得！</div>
        <div class="prize-main">
          <div class="prize-pic-wrapper">
            <!-- 券 -->
            <template v-if="lotteryResult.awardTypeId === 1">
              <div class="points-ticket sfa" :class="`sfa-pt-${lotteryResult.style1}`" v-if="currentLotteryType === 0">
                <span class="task-item-title">{{lotteryResult.couponName}}</span>
                <span class="task-item-val" v-if="lotteryResult.conditionType === 2">{{lotteryResult.bigShowNum}}%</span>
                <span class="task-item-val" v-else><span class="task-item-unit">¥</span>{{lotteryResult.bigShowNum}}</span>
              </div>
              <div class="sfa lucky-container" :class="`sfa-pt-${lotteryResult.style2}`" v-else>
                <span class="lucky-type">{{lotteryResult.couponName}}</span>
              </div>
            </template>
            <!-- 商品 -->
            <img :src="lotteryResult.picUrl" class="prize-pic" v-else-if="lotteryResult.awardTypeId === 2" />
            <!-- 积分 -->
            <div class="icon-points" v-else="lotteryResult.awardTypeId === 3"></div>

          </div>
          <div class="lucky-brief" v-if="lotteryResult.awardTypeId === 1">
            <template v-if="lotteryResult.type === 601">
              现金{{lotteryResult.bigShowNum}}{{lotteryResult.conditionUnit}}
            </template>
            <template v-else-if="lotteryResult.secondDesc">
              {{lotteryResult.mainDesc}} {{lotteryResult.bigShowNum}}{{lotteryResult.conditionUnit}}
            </template>
            <template v-else>
              {{lotteryResult.mainDesc}}
            </template>
          </div>
          <div class="lucky-brief" v-if="lotteryResult.brief">{{lotteryResult.brief}}</div>
          <div class="lucky-expire" v-if="lotteryResult.validEndDate">有效期至：{{lotteryResult.validEndDate | toTime}}</div>
          <div class="lucky-points-prize" v-if="lotteryResult.integral">
            <div class="icon-points-title"></div>
            <div class="">积分{{lotteryResult.integral | convert2yuan}}</div>
          </div>
        </div>
        <div class="btn-panel">
          <button class="btn btn-modal-confirm" @click="prizeConfirm">确定</button>
        </div>
      </x-dialog>

      <x-dialog v-if="isShowLose" @modal-hidden="isShowLose = false">
        <div slot="all" class="lose-main">
          <a data-dismiss="modal" class="close btn-close">×</a>
          <div class="icon-smiley"></div>
          <div class="lose-brief">谢谢您的参与！</div>
          <div class="btn-panel">
            <button class="btn btn-lose-confirm" @click="isShowLose = false">确认</button>
          </div>
        </div>
      </x-dialog>

      <!-- 抽奖条件不满足 -->
      <x-dialog v-if="isShowFailed" @modal-hidden="isShowFailed = false" type="arc">
        <div slot="head-main">夺宝失败</div>
        <div class="fail-main">
          <div class="icon-chest"></div>
          <div class="lucky-points-prize" v-if="currentType === 0">
            <div class="icon-points-title"></div>
            您的积分不足以本次夺宝！
          </div>
          <div class="lucky-points-prize" v-else>
            <div class="icon-balance-not-enough"></div>
            您的积分不足以本次夺宝！
          </div>
        </div>
        <div class="btn-panel">
          <button class="btn btn-modal-confirm" @click="isShowFailed = false">确定</button>
        </div>
      </x-dialog>

      <points-address v-if="isShowAddressModal" type="select"
                      @modal-hidden="isShowAddressModal = false"
                      @address-selected="addAddress"
      ></points-address>


    </div>
  </div>
</template>

<script>
  import {getTaskListApi, lotteryApi, luckyApi, addAddressToGiftApi} from 'api/points'
  import {formatCoupon, checkLogin} from 'build'
  import PointsAddress from '../points-address'

  const awardType = [
    {
      //谢谢惠顾
      id: 0,
    },
    {
      //优惠券
      id: 1
    },
    {
      //实体兑换
      id: 2,
    },
    {
      //积分
      id: 3,
    }
  ]

  export default {
    name: 'points-lottery',

    mixins: [checkLogin],

    components: {
      PointsAddress
    },

    data() {
      return {
        currentLottery: 0,
        radioList: [
          {
            title: '2元夺宝',
            value: 2,
          },
          {
            title: '10元夺宝',
            value: 10,
          },
        ],
        current: 2,


        //夺宝列表
        awards: [],
        awards10: [],
        cashRob: 0,
        cashRob10: 0,
        //幸运抽奖
        chestList: [],
        integralRob: 0,
        integralRob10: 0,
        myLucky: 0,
        //获奖用户
        recentUser: [],
        robLucky: 0,
        robLucky10: 0,

        timer: null,
        winnerTimer: null,


        //currentType 当前玩法 积分、元
        currentType: 0,
        //弹窗
        isShowPrized: false,
        isShowLose: false,
        isShowAddressModal: false,
        isShowFailed: false,

        lotteryResult: {},
        currentLotteryType: 0,
        loadingStatus: 'loading',

        pushing: false,
      }
    },

    watch: {
      currentLottery() {
        Velocity(this.$refs.awards, {
          rotateY: 0
        }, {
          duration: 0
        })
        Velocity(this.$refs.awards, {
          rotateY: 720
        }, {
          duration: 1000
        })
      }
    },

    methods: {
      getData({loading = true} = {loading: true}) {
        if (loading) {
          this.loadingStatus = 'loading'
        }
        getTaskListApi(({data}) => {
          if (data && data.result === 0) {
            this.awards = data.root.awards

            this.awards.push({
              awardTypeId: 0,
              id: -1,
              desc: '谢谢惠顾'
            })
            _.each(this.awards, (award) => {
              this.$set(award, 'selected', false)

              if (award.awardTypeId === 1) {
                Object.assign(award, this.couponFormat({
                  type: award.type,
                  threholdAmount: award.threholdAmount,
                  bonusPercentAmount: award.bonusPercentAmount,
                  bigShowNum: award.bonusAmount,
                  statType: award.statType,
                  ticketId: award.statTicketId,
                  gameType: award.gameType
                }))
              }
            })

            this.awards10 = data.root.awards10

            this.awards10.push({
              awardTypeId: 0,
              id: -1,
              desc: '谢谢惠顾'
            })

            _.each(this.awards10, (award) => {
              this.$set(award, 'selected', false)

              if (award.awardTypeId === 1) {
                Object.assign(award, this.couponFormat({
                  type: award.type,
                  threholdAmount: award.threholdAmount,
                  bonusPercentAmount: award.bonusPercentAmount,
                  bigShowNum: award.bonusAmount,
                  statType: award.statType,
                  ticketId: award.statTicketId,
                  gameType: award.gameType
                }))
              }
            })

            this.cashRob = data.root.cashRob
            this.cashRob10 = data.root.cashRob10
            this.integralRob = data.root.integralRob
            this.integralRob10 = data.root.integralRob10
            this.chestList = data.root.chest
            this.myLucky = data.root.myLucky

            if (_.isEmpty(this.recentUser)) {
              this.recentUser = _.map(data.root.recentUser, (user) => {
                return {
                  uid: _.uniqueId(),
                  ...(user.awardTypeId === 1 ? this.couponFormat({
                    type: user.subType,
                    bigShowNum: user.bonusAmount,
                    bonusPercentAmount: user.bonusPercentAmount,
                  }) : {}),
                  ...user
                }
              })
            }

            this.robLucky = data.root.robLucky
            this.robLucky10 = data.root.robLucky10


            _.each(this.chestList, (chest) => {
              if (chest.awardTypeId === 1) {
                Object.assign(chest, this.couponFormat({
                  type: chest.type,
                  threholdAmount: chest.threholdAmount,
                  bonusPercentAmount: chest.bonusPercentAmount,
                  bigShowNum: chest.bonusAmount,
                  statType: chest.statType,
                  ticketId: chest.statTicketId,
                  gameType: chest.gameType
                }))
              }
            })
          }
        })
          .finally(() => {
            if (loading) {
              this.loadingStatus = 'completed'
            }
          })
      },

      couponFormat({type, threholdAmount, bonusPercentAmount, bigShowNum = null, statType = null, ticketId = null, gameType = null}) {
        return formatCoupon({
          bigShowNum,
          type,
          threholdAmount,
          bonusPercentAmount,
          statType,
          ticketId,
          gameType,
        })
      },

      normalRoll({speed = 1000} = {speed: 1000}) {
        clearInterval(this.timer)
        this.timer = setInterval(() => {

          this.changeActiveAward()
        }, speed)
      },

      changeActiveAward() {
        const currentAward = _.findWhere(this.currentAwards, {selected: true})
        this.currentAwards.forEach((award) => {
          award.selected = false
        })

        _.chain(this.currentAwards).without(currentAward).sample().value().selected = true
      },

      lotteryRoll({times} = {times: 30}, completeCallback) {
        if (times === 0) {
          completeCallback()
          return
        }

        this.$_roll(() => {
          this.lotteryRoll({times: --times}, completeCallback)
        })

      },

      $_roll(callback) {
        this.timer = setTimeout(() => {
          this.changeActiveAward()
          callback()
        }, 100)
      },

      startLotteryAnimation(lotteryResult, completed) {
        clearInterval(this.timer)
        this.lotteryRoll({
          times: 30
        }, () => {
          const currentAward = _.findWhere(this.currentAwards, {selected: true})
          currentAward.selected = false

          _.findWhere(this.currentAwards, {
            id: lotteryResult.id || -1
          }).selected = true

          setTimeout(() => {
            this.normalRoll()
            completed()
          }, 1000)
        })
      },

      winnerRoll() {
        this.winnerTimer = setInterval(() => {
          if (this.recentUser.length) {
            const currentAward = this.recentUser.shift()
            _.delay(() => {
              this.recentUser.push(currentAward)
            }, 2000)
          }
        }, 3000)
      },
      lottery(type) {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行此操作，请先注册正式游戏账号',{modalDialogShadow:'modal-dialog-shadow'})
          return false
        }
        this.pushing = true
        this.currentType = type
        this.currentLotteryType = 0
        lotteryApi({
          type,
          lotteryType: this.currentLottery
        }, ({data}) => {
          if (data && data.result === 0) {
            //进行动画

            this.startLotteryAnimation(data.root, () => {
              this.lotteryResult = data.root

              switch (data.root.awardTypeId) {
                case 0:
                  //谢谢惠顾
                  this.isShowLose = true
                  break;
                //券
                case 1:
                  this.isShowPrized = true

                  this.lotteryResult = {
                    ...this.lotteryResult,
                    ...formatCoupon({
                      bigShowNum: this.lotteryResult.bonusAmount,
                      type: this.lotteryResult.type,
                      threholdAmount: this.lotteryResult.threholdAmount,
                      bonusPercentAmount: this.lotteryResult.bonusPercentAmount,
                      statType: this.lotteryResult.statType,
                      ticketId: this.lotteryResult.statTicketId,
                      gameType: this.lotteryResult.gameType,
                    })
                  }
                  break;
                //实体
                case 2:
                  this.isShowPrized = true
                  this.lotteryResult.brief = this.lotteryResult.itemName
                  break;
                //积分
                case 3:
                  this.isShowPrized = true
                  break;
                default:
                  break;
              }
              this.getData({loading: false})
              this.$store.dispatch(types.CHECK_LOGIN_STATUS)
              this.$store.dispatch(types.GET_USER_MALL_INFO)
            })

          } else {
            if (data.msg.includes('不足')) {
              this.isShowFailed = true
            } else {
              Global.ui.notification.show(data.msg || '')
            }
          }
        })
          .finally(() => {
            this.pushing = false
          })
      },

      luckChest(chestInfo) {
        if (window.Global.cookieCache.get('isTestUser')) {//试玩账号操作时提示
          Global.ui.notification.show('试玩会员无法进行此操作，请先注册正式游戏账号',{modalDialogShadow:'modal-dialog-shadow'})
          return false
        }
        this.pushing = true
        this.currentLotteryType = 1
        luckyApi({
          id: chestInfo.id
        }, ({data}) => {
          if (data && data.result === 0) {
            this.lotteryResult = data.root

            switch (data.root.awardTypeId) {
              case 0:
                //谢谢惠顾
                this.isShowLose = true
                break;
              //券
              case 1:
                this.isShowPrized = true

                this.lotteryResult = {
                  ...this.lotteryResult,
                  ...formatCoupon({
                    bigShowNum: this.lotteryResult.bonusAmount,
                    type: this.lotteryResult.type,
                    threholdAmount: this.lotteryResult.threholdAmount,
                    bonusPercentAmount: this.lotteryResult.bonusPercentAmount,
                    statType: this.lotteryResult.statType,
                    ticketId: this.lotteryResult.statTicketId,
                    gameType: this.lotteryResult.gameType,
                  })
                }
                break;
              //实体
              case 2:
                this.isShowPrized = true
                this.lotteryResult.brief = this.lotteryResult.itemName
                break;
              //积分
              case 3:
                this.isShowPrized = true
                break;
              default:
                break;
            }

            this.getData({loading: false})
            this.$store.dispatch(types.GET_USER_MALL_INFO)
          } else {
            Global.ui.notification.show(data.msg || '')
          }
        })
          .finally(() => {
            this.pushing = false
          })
      },
      prizeConfirm() {
        this.isShowPrized = false
        if (this.lotteryResult.awardTypeId === 2) {
          this.isShowAddressModal = true
        }
      },

      addAddress(addressInfo) {
        addAddressToGiftApi({
          itemId: this.lotteryResult.rid,
          addressId: addressInfo.rid,
        }, ({data}) => {
          if (data && data.result === 0) {
            this.isShowAddressModal = false
            this.$store.dispatch(types.GET_USER_MALL_INFO)

            Global.ui.notification.show(`<div class="m-bottom-lg">添加地址成功!</div>`, {
              type: 'success',
              hasFooter: false,
              displayTime: 1000,
              size: 'modal-xs',
              bodyClass: 'no-border no-padding',
              closeBtn: false,
            })
          } else {
            Global.ui.notification.show(data.msg)
          }
        })
      },
    },

    computed: {
      currentAwards() {
        return this.currentLottery === 0 ? this.awards : this.awards10
      },
      currentCashRob() {
        return this.currentLottery === 0 ? this.cashRob : this.cashRob10
      },
      currentIntegralRob() {
        return this.currentLottery === 0 ? this.integralRob : this.integralRob10
      },
      currentRobLucky() {
        return this.currentLottery === 0 ? this.robLucky : this.robLucky10
      }
    },

    mounted() {
      this.normalRoll()
      this.winnerRoll()
      this.getData()
    },

    destroyed() {
      clearInterval(this.timer)
      clearInterval(this.winnerTimer)
    }
  }
</script>

<style lang="scss" scoped>
  .lottery-panel-inner {
    border-radius: 10px;
    background-color: #ffffff;
    border: solid 2px #e6e6e6;
    margin-bottom: 35px;
    position: relative;
  }

  .points-lottery-panel {
    padding-top: 40px;
  }

  .lottery-panel-main {
    flex: 70%;
  }

  .lottery-panel {
    display: flex;
    height: 780px;
  }

  .lottery-task {
    width: 740px;
    margin: 0 auto;
  }

  .task-cell {
    width: 152px;
    height: 152px;
    border: solid 2px #14b1bb;
    transform: rotate(45deg);
    position: relative;
    overflow: hidden;
    margin: 0 auto;
    box-sizing: border-box;

    &.selected {
      border: solid 4px #e5a642;
      .task-cell-inner {
        top: -37px;
        left: -37px;
      }
    }
  }

  .task-cell-inner {
    transform: rotate(-45deg);
    height: 220px;
    width: 220px;
    position: absolute;
    top: -35px;
    left: -35px;
  }

  .task-item {
    height: 145px;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    align-items: center;
    padding-top: 60px;
  }

  .task-gift-pic {
    width: 100px;
    height: 100px;
  }
  .task-badge {
    height: 35px;
    background-color: #6d7a8f;
    color: #ffffff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1,
  }

  .points-ticket {
    display: flex;
  }

  .task-item-val {
    color: #ffffff;
    line-height: 54px;
    font-size: 16px;
    flex: 34%;
    text-align: center;
  }

  .task-item-title {
    color: #bd8935;
    line-height: 54px;
    font-size: 16px;
    /* width: 50px; */
    flex: 67%;
    text-align: center;
  }

  .lottery-task-inner {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    height: 520px;
  }

  .task-cell-wrapper {
    position: relative;
    padding: 30px;
    box-sizing: border-box;

    &:nth-of-type(4) {
      flex: 50% 0 0;
      left: 54px;
      top: -82px;
    }
    &:nth-of-type(5) {
      flex: 50% 0 0;
      right: 54px;
      top: -82px;
    }
    &:nth-of-type(n + 6) {
      top: -167px;
    }
  }

  .lottery-list {
    flex: 30%;
    /* margin-top: 115px; */
    border: solid 5px #edeef0;
    border-radius: 15px;
    margin: 115px 20px 0;
    box-sizing: border-box;
    height: 483px;
  }

  .lottery-top {
    width: 220px;
    height: 50px;
    background-color: #edeef0;
    border-radius: 25px;
    font-size: 18px;
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -30px auto 34px;
  }

  .lottery-divider {
    width: 303px;
    height: 1px;
    background-color: #b9e9ec;
    margin: 0 auto;
  }

  .lottery-list-main {
    height: 419px;
    overflow: hidden;
  }

  .lottery-list-main-inner {
    display: flex;
    justify-content: center;
    line-height: 50px;
  }

  .lottery-list-left {
    flex: 1;
    padding-left: 55px;
  }

  .lottery-list-right {
    flex: 1;
  }

  .lottery-list-right-val {
    color: #cd6d6d;
  }

  .points-btn {
    width: 150px;
    height: 50px;
    background-color: #e5a642;
    box-shadow: 0px 2px 0px 0px #a37731;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 10px;
  }

  .currency-btn {
    width: 150px;
    height: 50px;
    background-color: #14b1bb;
    box-shadow: 0px 2px 0px 0px #009097;
    border-radius: 5px;
    font-size: 16px;
  }

  .task-button {
    text-align: center;
    margin-bottom: 20px;
  }

  .task-tip {
    font-size: 14px;
    color: #666666;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hanger-left {
    position: absolute;
    bottom: -66px;
    left: 50px;
    z-index: 1;
  }

  .hanger-right {
    position: absolute;
    bottom: -66px;
    right: 50px;
    z-index: 1;
  }

  .icon-task-smiley {
    background: url(./misc/icon-task-smiley.png);
    width: 45px;
    height: 45px;
  }

  //lucky

  .lucky-panel {
    height: 379px;
    background-color: #ffffff;
    border-radius: 5px;
    border: solid 2px #e6e6e6;
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 135px;
  }

  .lucky-title {
    width: 240px;
    height: 50px;
    background-color: #edeef0;
    border-radius: 25px;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666666;
    margin-top: -25px;
  }

  .lucky-points {
    font-size: 24px;
  }

  .lucky-main {
    display: flex;
    width: 1040px;
    justify-content: space-between;
    padding-top: 40px;
  }

  .lucky-cell {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cell-probability {
    width: 52px;
    height: 52px;
    line-height: 14px;
    font-size: 14px;
    background-color: #e5a642;
    border-radius: 50px;
    text-align: center;
    position: absolute;
    top: -26px;
    right: -26px;
    color: #ffffff;
    padding-top: 13px;
    box-sizing: border-box;
    z-index: 1;
  }

  .lucky-prize-wrapper {
    width: 210px;
    height: 210px;
    background-color: #edeef0;
    border-radius: 5px;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lucky-container {
    color: #ffffff;
    font-size: 14px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-left: 10px;
    box-sizing: border-box;
  }

  .lucky-prize {
    width: 154px;
    height: 154px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .lucky-prize-name {
    font-size: 14px;
    color: #666666;
    text-align: center;
    padding: 10px 0;
  }

  .lucky-exchange-btn {
    width: 180px;
    height: 42px;
    background-color: #14b1bb;
    border-radius: 21px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sfa-pt-lucky-star-points {
    margin-top: -3px;
  }
  .lucky-exchange-title {
    margin-left: -14px;
  }


  .x-switch {
    position: relative;
    background: rgba(0, 0, 0, 0.25);
    width: 270px;
    height: 50px;
    background-color: #edeef0;
    box-shadow: 0px 1px 0px 0px    rgba(0, 0, 0, 0.1),    inset 0px 2px 2px 0px    rgba(0, 0, 0, 0.15);
    border-radius: 25px;
    display: flex;

    margin: 34px auto;
  }

  .switch-label {
    text-align: center;
    color: #666666;
    position: relative;
    z-index: 2;
    height: 100%;
    font-size: 11px;
    text-align: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    font-size: 16px;
  }

  .switch-input {
    display: none;
  }

  .switch-input:checked + .switch-label {
    color: #ffffff;
    transition: 0.15s ease-out;
  }

  .switch-input:checked + .switch-label-on ~ .switch-selection {
    left: 50%;
  }

  .switch-selection {
    display: block;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    transition: left 0.45s ease-out;
    width: 50%;
    height: 100%;
    background-color: #14b1bb;
    box-shadow: 0px 0px 3px 2px    rgba(65, 210, 219, 0.31);
    border-radius: 26px;
  }

  .lottery-list-main-inner {
    transition: all 2s;
  }

  .ani-scroll-leave-active {
    margin-top: -50px;
  }

  .icon-chest {
    background-image: url(./misc/icon-chest.png);
    width: 154px;
    height: 132px;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .gift-pic {
    width: 110px;
    height: 110px;
  }

  .arc {
    .prize-main {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 40px;
    }

    .prize-pic-wrapper {
      padding-bottom: 15px;
    }

    .prize-pic {
      width: 120px;
      height: 120px;
    }

    .lucky-brief {
      font-size: 16px;
      color: #333333;
    }

    .lucky-expire {
      color: #999999;
      font-size: 14px;
      margin-top: 15px;
    }

    .btn-modal-confirm {
      width: 200px;
      height: 42px;
      background-color: #14b1bb;
      border-radius: 21px;
      border: solid 1px #13a6af;
    }

    .btn-panel {
      text-align: center;
      margin: 30px 0;
    }

    .icon-points {
      background: url(./misc/icon-points.jpg);
      width: 134px;
      height: 98px;
    }
  }
  .lucky-points-prize {
    display: flex;
    font-size: 16px;
    color: #666666;
    align-items: center;
  }
  //积分不足
  .icon-points-title {
    background-image: url(./misc/icon-points-title.png);
    width: 23px;
    height: 23px;
    margin-right: 5px;
  }
  //余额不足
  .icon-balance-not-enough {
    background-image: url(./misc/icon-balance-not-enough.png);
    width: 25px;
    height: 27px;
  }

  //谢谢惠顾
  .icon-smiley {
    background: url(./misc/icon-smiley.png);
    width: 64px;
    height: 65px;
    margin-bottom: 22px;
  }

  .lose-main {
    width: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 46px;

    .btn-panel {
      width: 100%;
      text-align: center;
      padding: 17px 0 24px;
      border-top: 1px solid #e6e6e6;
    }
    .lose-brief {
      font-size: 14px;
      letter-spacing: 0px;
      margin-bottom: 30px;
      color: #666666;
    }

    .btn-lose-confirm {
      width: 108px;
      height: 36px;
      background-color: #14b1bb;
      border-radius: 3px;
    }
  }

  .fail-main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
