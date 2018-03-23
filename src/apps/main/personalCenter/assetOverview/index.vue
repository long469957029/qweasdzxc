<template>
  <div class="fc-fm-portlet">
    <ul class="fc-fm-amount-desc">
      <li>
        <div class="fc-fm-sum-left inline-block">
          <div class="fc-fm-sum-name">钱包总额</div>
          <div class=" fc-fm-amount-sum">
            <span class="fc-fm-amount-sum-num inline-block">{{rechargeTotal}}</span>
            <i class="fc-fm-amount-sum-img inline-block fa fa-refresh" aria-hidden="true"></i>
          </div>
        </div>
        <div class="fc-fm-re-sum-operation inline-block">
          <button class="btn js-header-recharge fc-fm-re-btn" data-name="jsFcRecharge">充值</button>
        </div>
      </li>
      <li>
        <div class="fc-fm-sum-left inline-block">
          <div class="fc-fm-sum-name">可提金额</div>
          <div class=" fc-fm-amount-sum"><span class="fc-fm-amount-sum-num inline-block">{{withdrawTotal}}</span>
          </div>
        </div>
        <div class="fc-fm-wd-sum-operation inline-block">
          <button class="btn js-header-recharge fc-fm-wd-btn" data-name="jsFcWithdraw">提现</button>
        </div>

      </li>
      <div class="fc-fm-wd-bankCard inline-block">
      <span class="js-fc-fm-wd-bankCard-img fc-fm-wd-bankCard-img" title="银行卡管理">
      </span>
      </div>
    </ul>
    <ul class="fc-fm-mb-qu">
      <div class="inline-block fc-fm-mb-qu-left">
        <li class="fc-fm-mb-item" v-for="item in walletList" :key="item.id">
          <i class="fa fa-circle " aria-hidden="true" :class="item.color"></i>
          <div class="fc-fm-channel-name">{{item.title}}</div>
          <div class="fc-fm-channel-amount">{{item.amount}}</div>
        </li>
      </div>
      <div class="inline-block fc-fm-mb-qu-right">
        <form class="js-fc-fm-form" action="javascript:void(0);">
          <div class="fc-fm-out-select" :class="{down:changeOutInStatus}">
            <span class="fc-fm-div-name">转出钱包：</span>
            <div class="fc-fm-out-select-panel" :class="{'side-down':outWalletStatus}" @click="openOutWallet()">
              <div class="fc-fm-out-selected">
                <div>
                  <span class="rc-name">{{transferOutSelected.title}}</span>
                  <span class="select-down"
                        :class="{'up':outWalletStatus}"></span>
                </div>
              </div>
              <div class="fc-tr-out-items">
                <div class="fc-fm-out-item" v-for="(item,index) in transferOutUnSelect" :key="index"
                     @click="formatOutPanel(item.channelId)">
                  <span class="rc-name">{{item.title}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="fc-fm-in-select" :class="{up:changeOutInStatus}">
            <span class="fc-fm-div-name">转入钱包：</span>
            <div class="fc-fm-in-select-panel" :class="{'side-down':inWalletStatus}" @click="openInWallet()">
              <div class="fc-fm-in-selected">
                <div>
                  <span class="rc-name">{{transferInSelected.title}}</span>
                  <span class="select-down" :class="{'up':inWalletStatus}"></span>
                </div>
              </div>
              <div class="fc-fm-in-items">
                <div class="fc-fm-in-item" v-for="(item,index) in transferInUnSelect" :key="index"
                     @click="formatInPanel(item.channelId)">
                  <span class="rc-name">{{item.title}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="fc-tf-div-amount">
            <span class="fc-fm-div-name">金额：</span>
            <input class="fc-fm-input" required data-parsley-type="integer"
                   data-parsley-max-message="您申请的金额超出可转账金额" autocomplete="off">
          </div>
          <input type="hidden" class="js-fm-tradeNum">

          <div class="js-fc-tf-button fc-tf-div-submit">
            <button class="btn font-sm fc-fm-tf-btn">确定</button>
          </div>
          <div class="js-fc-fm-error-container fc-fm-tr-error-container">
          </div>
        </form>
      </div>
      <div class="inline-block fc-tf-change">
        <span class="inline-block fc-tf-change-img sfa sfa-icon-change" @click="changeTransferOutIn"></span>
      </div>

    </ul>
    <ul>
      <div class="fc-tf-personal-info-select">
        <span class="fc-tf-info-select-name inline-block">个人数据总览</span>
        <div class="inline-block fm-to-search-bar">
          <x-timeset :startConfig="startDate" :endConfig="endDate" :showRange="true"
                     :startTime.sync="startTime" :endTime.sync="endTime"
                     :isRefreshDate.sync="isRefreshDate"></x-timeset>
        </div>
        <button class="btn fc-fm-info-btn" @click="searchPersonalData">查询</button>
      </div>

      <div class="fc-tf-personal-info-panel">
        <li class="fc-fm-info-item" v-for="item in dataConf">
          <div class="inline-block fc-fm-info-item-img">
            <span class="fc-fm-info-item-img-area sfa " :class="item.img"></span>
          </div>
          <div class="inline-block fc-fm-info-item-info">
            <div class="fc-fm-info-item-name">{{item.title}}
            </div>
            <div class="fc-fm-info-item-num">
              <span class="fc-fm-info-item-num-value">{{item.amount}}</span>
            </div>
          </div>
        </li>
      </div>
    </ul>

  </div>

</template>
<script>
  import fundApi from 'api/fund'
  import walletConf from '../misc/walletConf'
  import dataConf from '../misc/personalDataConf'
  import xTimeset from 'com/x-timeset';
  export default{
    name: 'index',

    data () {
      return {
        walletList: [],
        dataConf: [],
        rechargeTotal: 0.00,
        withdrawTotal: 0.00,
        transferInSelected: 1,
        transferInUnSelect: [],
        transferOutSelected: 0,
        transferOutUnSelect: [],
        walletConf: [],
        startDate: {},
        endDate: {},
        startTime: '',
        endTime: '',
        isRefreshDate: false,
        outWalletStatus: false,
        inWalletStatus: false,
        changeOutInStatus: false,
      }
    },

    props: {},

    components: {
      xTimeset
    },

    mounted () {
      this.dataConf = dataConf.getAll()
      this.walletConf = walletConf.getAll()
      this.startTime = _(new Date()).toDate()
      this.endTime = _(new Date()).toDate()
      this.userFundInfo()
      this.userRechargeWithdrawInfo()
      this.userProfitInfo()
      this.formatOutPanel()
      this.formatInPanel()
      this.startDate = {
        format: 'YYYY-MM-DD',
        locale: moment.locale('zh-cn')
      }
      this.endDate = {
        format: 'YYYY-MM-DD',
        locale: moment.locale('zh-cn')
      }

    },

    watch: {
      isRefreshDate(){
        if (this.isRefreshDate) {
          this.refreshDate()
        }
      },
      transferOutSelected(){
        if (this.transferOutSelected.channelId === 0 && this.transferInSelected.channelId === 0) {
          this.formatInPanel(1)
        } else if (this.transferOutSelected.channelId !== 0 && this.transferInSelected.channelId !== 0) {
          this.formatInPanel(0)
        }
      },
      transferInSelected(){
        if (this.transferInSelected.channelId === 0 && this.transferOutSelected.channelId === 0) {
          this.formatOutPanel(1)
        } else if (this.transferOutSelected.channelId !== 0 && this.transferInSelected.channelId !== 0) {
          this.formatOutPanel(0)
        }
      },
      outWalletStatus(){
        if (this.outWalletStatus && this.inWalletStatus) {
          this.inWalletStatus = false
        }
      },
    },

    computed: {},

    filters: {},

    methods: {
      changeTransferOutIn(){
        if (!this.changeOutInStatus) {
          this.changeOutInStatus = true

          setTimeout(() => {
            this.changeOutInStatus = false
          }, 200)
          const beforeInSelected = this.transferInSelected.channelId
          const beforeOutSelected = this.transferOutSelected.channelId
          this.formatOutPanel(beforeInSelected)
          this.formatInPanel(beforeOutSelected)
//          this.
        }
      },
      searchPersonalData(){
        this.userRechargeWithdrawInfo()
        this.userProfitInfo()
      },
      formatOutPanel(channelId){
        const selectId = (channelId === undefined) ? 0 : channelId
        this.transferOutSelected = _(this.walletConf).findWhere({
          channelId: selectId,
        })
        this.transferOutUnSelect = _(this.walletConf).without(this.transferOutSelected)
      },
      formatInPanel(channelId){
        const selectId = (channelId === undefined) ? 1 : channelId
        this.transferInSelected = _(this.walletConf).findWhere({
          channelId: selectId,
        })
        this.transferInUnSelect = _(this.walletConf).without(this.transferInSelected)
      },
      userFundInfo(){
        fundApi.userFundInfo(
          ({data}) => {
            if (data && data.result === 0) {
              this.rechargeTotal = _(data.root.total).format2yuan()// 总余额
              this.withdrawTotal = _(data.root.validBalance).format2yuan()// 可用余额
              this.walletList = _(walletConf.getAll()).each((item) => {
                item.amount = _(_(data.root.gameBalance).find({
                  channelId: item.id
                }).balance).format2yuan()
              })
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? data.msg : '获取数据失败！')
            }
          }
        )
      },
      userRechargeWithdrawInfo(){
        const reqData = {
          startTime: this.startTime,
          endTime: this.endTime,
        }
        fundApi.userRechargeWithdrawInfo((reqData),
          ({data}) => {
            if (data && data.result === 0) {
              this.dataConf = _(this.dataConf).each((item) => {
                if (item.id === 0) {
                  item.amount = _(data.root.recharge).format2yuan()
                } else if (item.id === 1) {
                  item.amount = _(data.root.withdraw).format2yuan()
                }
              })
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? data.msg : '获取数据失败！')
            }
          }
        )
      },
      userProfitInfo(){
        const reqData = {
          startTime: this.startTime,
          endTime: this.endTime,
        }
        fundApi.userProfitInfo((reqData),
          ({data}) => {
            if (data && data.result === 0) {
              this.dataConf = _(this.dataConf).each((item) => {
                if (item.id === 2) {
                  item.amount = _(data.root.bet).format2yuan()
                } else if (item.id === 3) {
                  item.amount = _(data.root.prize).format2yuan()
                } else if (item.id === 4) {
                  item.amount = _(data.root.rebate).format2yuan()
                } else if (item.id === 5) {
                  item.amount = _(data.root.gameRebate).format2yuan()
                } else if (item.id === 6) {
                  item.amount = _(data.root.activity).format2yuan()
                } else if (item.id === 7) {
                  item.amount = _(data.root.profit).format2yuan()
                }
              })
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? data.msg : '获取数据失败！')
            }
          }
        )
      },
      platformTransferInfo(){
        fundApi.userProfitInfo(({channelId: Number($to) || Number($from) || '1'}),
          ({data}) => {
            if (data && data.result === 0) {
              this.platformTransferTypeLimit(data.root)
            } else {
              Global.ui.notification.show(data.msg === 'fail' ? data.msg : '获取数据失败！')
            }
          }
        )
      },
      platformTransferTypeLimit(data){
        const to = this.transferInSelected.channelId
        if (to === 0) { // 从其他钱包转入中心钱包
          data.minMoney = prop.inMin
          data.maxMoney = prop.inMax
          data.tradeNum = prop.leftInTimes
          data.confNum = prop.inTimes
          data.validBalance = prop.gameValid
        } else { // 从中心钱包转入到其他钱包
          data.minMoney = prop.outMin
          data.maxMoney = prop.outMax
          data.tradeNum = prop.leftOutTimes
          data.confNum = prop.outTimes
          data.validBalance = prop.balance
        }
        // var valMin = _(data.minMoney).convert2yuan();
        // var valMax = _(data.maxMoney).convert2yuan();
        let valMin = data.minMoney
        let valMax = data.maxMoney
        let valTradeNum = data.tradeNum
        // let desMin = ''
        // let desMax = ''
        // let desTradeNum = ''

        if (valMin === 0) {
          valMin = 1
          // desMin = '（单笔最低转账金额无限制'
        }
        // else {
        //   desMin = `（最低转账金额<span class="js-fc-tf-minLimit text-pleasant">${valMin}</span>元`
        // }
        if (valMax === 0) {
          valMax = 5000000
          // desMax = ',最高转账金额无限制'
        }
        // else {
        //   desMax = `,最高转账金额<span class="js-fc-tf-maxLimit text-pleasant">${valMax}</span>元`
        // }
        if (data.confNum === 0) {
          valTradeNum = -1
          // desTradeNum = ',转账次数无限制）'
        }
        // else {
        //   desTradeNum = `,今日还可以转账<span class="text-pleasant">${valTradeNum}次</span>）`
        // }
      },
      refreshDate(){
        this.userRechargeWithdrawInfo()
        this.userProfitInfo()
        this.isRefreshDate = false
      },
      openOutWallet(){
        this.outWalletStatus = this.outWalletStatus ? false : true
      },
      openInWallet(){
        this.inWalletStatus = this.inWalletStatus ? false : true
      }
    },
  }
</script>

<style scoped lang="scss">
  .fc-fm-portlet {
    min-height: 750px;
    background: #ffffff;
    padding-bottom: 100px;
    ul {
      background: $def-white-color;
    }
    .fc-fm-amount-desc {
      font-size: 0px;
      vertical-align: middle;
      border-bottom: 1px solid #e6e6e6;
      li {
        width: 460px;
        height: 97px;
        display: inline-block;
        background: #fff;
        padding: 3px;
        border-radius: 6px;
        overflow: hidden;
        margin-top: 10px;

        .fc-fm-sum-left {
          padding: 20px;
          margin-left: 20px;
          width: 190px;
          vertical-align: middle;
          .fc-fm-sum-name {
            vertical-align: middle;
            height: 23px;
            line-height: 23px;
            font-size: 14px;
            color: #666666;
            margin-bottom: 10px;
            .sfa {
              vertical-align: -14%;
            }
          }
          .fc-fm-amount-sum {
            font-size: 20px;
            //width: 150px;
            border-radius: 4px;
            color: #f09932;
            border: 0;
            .fc-fm-amount-sum-num {
              margin-right: 5px;
            }
            .fc-fm-amount-sum-img {
              color: #cccccc;
              font-size: 17px;
              cursor: pointer;
            }
          }

        }
        &:nth-child(2) {
          .sfa {
            vertical-align: -21%;
          }
        }

        .fc-fm-re-sum-operation {
          border-right: 1px solid #cccccc;
          width: 195px;
          .fc-fm-re-btn {
            width: 95px;
            height: 30px;
            margin-top: 25px;
            border-radius: 4px;
            background: #f09932;
            border: 0;
            font-size: 14px;
          }
          .fc-fm-wd-btn {
            width: 95px;
            height: 30px;
            margin-top: 25px;
            border-radius: 4px;
            background: #0ea8b5;
            border: 0;
            font-size: 14px;
            backgroud-color: #14b1bb;
          }
        }
        &:last-child {
          margin-right: 0;
        }
        .fc-fm-wd-sum-operation {
          width: 95px;
          .fc-fm-re-btn {
            width: 95px;
            height: 30px;
            margin-top: 20px;
            border-radius: 4px;
            background: #f09932;
            border: 0;
            font-size: 14px;
          }
          .fc-fm-wd-btn {
            width: 95px;
            height: 30px;
            margin-top: 25px;
            border-radius: 4px;
            background: #0ea8b5;
            border: 0;
            font-size: 14px;
          }
        }
        &:last-child {
          margin-right: 0;
        }

      }
      .fc-fm-wd-bankCard {
        width: 65px;
        height: 91px;
        .fc-fm-wd-bankCard-img {
          width: 40px;
          height: 40px;
          display: block;
          margin-top: 30px;
          cursor: pointer;
          margin-left: -40px;
          background: url("../../../../base/images/sprites/fund/icon-bankCard-gray.png") no-repeat;
          &.active, &:hover {
            background: url("../../../../base/images/sprites/fund/icon-backCard-deepGray.png") no-repeat
          }
        }

      }
    }
    .fc-fm-mb-qu {
      border-bottom: 1px solid #e3e3e3;
      font-size: 0px;
      height: 340px;
      vertical-align: middle;
      background: $def-white-color;
      .fc-fm-mb-qu-left {
        width: 590px;
        margin-top: 16px;
        margin-left: 20px;
        float: left;
        li.fc-fm-mb-item {
          position: relative;
          width: 220px;
          height: 65px;
          line-height: 65px;
          display: inline-block;
          background: #fff;
          padding: 3px;
          vertical-align: middle;
          overflow: hidden;
          margin-left: 20px;
          margin-right: 20px;
          font-size: 14px;
          color: #666666;
          .fc-fm-channel-name {
            height: 65px;
            width: 80px;
            line-height: 61px;
            vertical-align: middle;
            display: inline-block;
            margin-left: 16px;
          }
          &:nth-child(1) {
            .sfa {
              vertical-align: -5%;
            }
          }
          &:nth-child(2) {
            .sfa {
              vertical-align: -1%;
            }
          }
          &:nth-child(3) {
            .sfa {
              vertical-align: -4%;
            }
          }
          &:nth-child(4) {
            .sfa {
              vertical-align: -6%;
            }
          }
          &:nth-child(5) {
            .sfa {
              vertical-align: -4%;
            }
          }
          &:nth-child(6) {
            .sfa {
              vertical-align: -6%;
            }
          }
          &:nth-child(7) {
            .sfa {
              vertical-align: -4%;
            }
          }
          .fc-fm-channel-amount {
            height: 65px;
            width: 75px;
            line-height: 65px;
            vertical-align: middle;
            display: inline-block;
            color: #333333;
            text-align: right;
          }

          &:nth-of-type(2n) {
            border-right: 0px solid #e3e3e3;
          }
          &:nth-child(1) {
            border-radius: 6px 0 0 0;
          }
          &:nth-child(2) {
            border-radius: 0 6px 0 0;
          }
          &:nth-last-child(1) {
            border-radius: 0 0 6px 0;
            border-bottom: 0px solid #e3e3e3;
          }
          &:nth-last-child(2) {
            border-radius: 0 0 0 6px;
            border-bottom: 0px solid #e3e3e3;
          }
          .fa-circle-ce {
            color: #9eedcf;
          }
          .fa-circle-gg {
            color: #9eedcf;
          }
          .fa-circle-ag {
            color: #f0ddb6;
          }
          .fa-circle-PT {
            color: #f0ddb6;
          }
          .fa-circle-ebet {
            color: #b7ceed;
          }
          .fa-circle-mg {
            color: #b7ceed;
          }
          .fa-circle-bbin {
            color: #edbeae;
          }
          .fa-circle-188 {
            color: #edbeae;
          }
        }
      }
      .fc-fm-mb-qu-right {
        width: 246px;
        padding-top: 35px;
        padding-left: 20px;
        font-size: 14px;
        margin-left: 30px;
        color: #666666;
        position: absolute;
        .fc-tf-div-amount {
          position: absolute;
          top: 181px;
          .fc-tf-div-name {
            display: block;
            margin-bottom: 5px;
          }
          .fc-fm-input {
            text-align: center;
            width: 208px;
            border-radius: 3px;
            border: 1px solid;
            padding: 0 20px;
            border-color: #cccccc !important;
            height: 35px;
            &.active, &:hover, &:focus, &:active {
              border: 1px solid;
              border-color: #14b1bb !important;
              outline-width: 0;
            }
          }

        }
        .fc-tf-div-submit {
          position: absolute;
          top: 248px;
          .fc-fm-tf-btn {
            width: 175px;
            height: 35px;
            border-radius: 20px;
            margin-left: 40px;
            margin-top: 15px;
            background-color: #14b1bb;
          }
        }
        .fc-fm-error-container {
          position: absolute;
          top: 308px;
          margin-left: 40px;
          .sfa-error-icon {
            margin-top: 2px;
          }
          .parsley-error-text {
            margin-left: 3px;
          }
        }
        .fc-fm-tr-error-container {
          position: absolute;
          top: 240px;
          .sfa-error-icon {
            margin-top: 2px;
          }
          .parsley-error-text {
            margin-left: 3px;
          }
        }
        .fc-fm-out-select {
          z-index: 4;
          position: absolute;
          top: 30px;
          &.down {
            transform: translateY(73px);
            transition: all .1s;
          }
          .fc-fm-div-name {
            display: block;
            margin-bottom: 5px;
          }
          .fc-fm-out-select-panel {
            z-index: 5;
            overflow: hidden;
            width: 208px;
            height: 33px;
            background: #ffffff;
            border: 1px solid #cccccc;
            line-height: 33px;
            border-radius: 3px;
            display: inline-block;
            position: relative;
            text-align: left;
            cursor: pointer;
            transition: height 0.5s;
            padding: 0 20px;
            .fc-fm-out-selected {
              height: 33px !important;
            }
            .fc-fm-out-item {
              border-top: 1px solid #e6e6e6;
            }
            .rc-name {
              display: inline-block;
              margin-left: 75px;
              color: #666666;
              font-size: 14px;
            }
            .select-down {
              width: 18px;
              height: 10px;
              display: block;
              position: absolute;
              top: 13px;
              left: 205px;
              background: url("~base/images/v2/icon-select-down.png") no-repeat;
              &.up {
                transform: rotate(180deg);
              }
            }
            &.side-down {
              border: 1px solid $new-main-deep-color;
              height: 203px;
              overflow: auto;
            }
          }

        }
        .fc-fm-in-select {
          position: absolute;
          top: 103px;
          z-index: 2;
          &.up {
            transform: translateY(-73px);
            transition: all .1s;
          }
          .fc-fm-div-name {
            display: block;
            margin-bottom: 5px;
          }
          .fc-fm-in-select-panel {
            z-index: 3;
            overflow: hidden;
            width: 208px;
            height: 33px;
            background: #ffffff;
            border: 1px solid #cccccc;
            line-height: 33px;
            border-radius: 3px;
            display: inline-block;
            position: relative;
            text-align: left;
            cursor: pointer;
            transition: height 0.5s;
            padding: 0 20px;
            .fc-fm-in-selected {
              height: 33px !important;
            }
            .fc-fm-in-item {
              border-top: 1px solid #e6e6e6;
            }
            .rc-name {
              display: inline-block;
              margin-left: 75px;
              color: #666666;
              font-size: 14px;
            }
            .select-down {
              width: 18px;
              height: 10px;
              display: block;
              position: absolute;
              top: 13px;
              left: 205px;
              background: url("~base/images/v2/icon-select-down.png") no-repeat;
              &.up {
                transform: rotate(180deg);
              }
            }
            &.side-down {
              border: 1px solid $new-main-deep-color;
              height: 203px;
              overflow: auto;
            }
          }

        }
        .parsley-errors-list.filled {
          margin-top: 10px;
          margin-left: 5px;
        }
      }
      .fc-tf-change {
        height: 73px;
        width: 20px;
        float: right;
        margin-top: 72px;
        border-top: 1px solid #cccccc;
        border-right: 1px solid #cccccc;
        border-bottom: 1px solid #cccccc;
        margin-right: 67px;
        .fc-tf-change-img {
          margin-top: 28px;
          margin-left: 11px;
          cursor: pointer;
        }
      }
    }
    .fc-tf-personal-info-select {
      height: 50px;
      font-size: 12px;
      color: #666666;
      padding: 20px 0 10px 20px;
      margin: 0 45px 0 20px;
      .fc-tf-info-select-name {
        margin-right: 145px;
        font-size: 14px;
        float: left;
        margin-top: 5px;
      }
      .fc-fm-info-btn {
        width: 60px;
        height: 25px;
        background-color: #14b1bb;
        font-size: 12px;
        position: relative;
        margin-left: 10px;
        margin-top: 2px;
        vertical-align: top;
      }
    }
    .fc-tf-personal-info-panel {
      margin-top: -11px;
      margin-left: 30px;
      li.fc-fm-info-item {
        background-color: #f9f9f9;
        display: inline-block;
        width: 210px;
        height: 100px;
        border: 1px solid #e9e9e9;
        margin: 10px;
        border-radius: 4px;
        .fc-fm-info-item-img {
          margin: 30px 0px 30px 30px;
          width: 40px;
          height: 40px;
          float: left;
          .fc-fm-info-item-img-area {
            width: 40px;
            height: 40px;
            display: block;
          }
        }
        .fc-fm-info-item-info {
          margin: 24px 0px 24px 0px;
          width: 140px;
          height: 52px;
          backgroud-color: transparent;
          text-align: center;
          .fc-fm-info-item-name {
            padding: 3px;
            font-size: 14px;
            color: #999999;
          }
          .fc-fm-info-item-num {
            padding: 3px;
            font-size: 14px;
            color: #333333;
            .fc-fm-info-item-num-value {
              font-size: 16px;
              color: #f09932;
            }
          }
        }
        &.active {
          .fc-fm-info-item-num {
            .fc-fm-info-item-num-value {
              color: #f09932;
            }
            color: #f09932;
          }
        }
      }
    }

  }


</style>

