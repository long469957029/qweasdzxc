'use scrict'

import MyMessageViewInfo from 'userCenter/views/myMessage'

const RouterController = require('skeleton/controllers/router')

const BettingRecordView = require('userCenter/views/bettingRecords')
// const BettingDetailView = require('userCenter/views/bettingDetail')

const TrackRecordView = require('userCenter/views/trackRecords')
// const TrackDetailView = require('userCenter/views/trackDetail')

const PersonalManageView = require('userCenter/views/personalManage')
const CardManageView = require('userCenter/views/cardManage')
// const CardBindingView = require('userCenter/views/cardBinding')
const PriceDetailsView = require('userCenter/views/priceDetails')
const AccountSafeViewInfo = require('userCenter/views/accountSafe')


// const ucMenuConfig = Global.ui.menu.get('uc')
// const gcMenuConfig = Global.ui.menu.get('gc')
const sidebar = Global.ui.menu.get('uc')

const UserCenterController = RouterController.extend({

  bettingRecords() {
    this.changeMainReginView(new BettingRecordView(), {
      main: {
        // icon: gcMenuConfig.icon,
        title: '投注记录',
      },
      sidebar,
    })
  },

  // bettingDetail(tradeNo) {
  //   this.changeSubReginView(new BettingDetailView({
  //     tradeNo,
  //   }), {
  //     main: {
  //       title: '投注详情',
  //     },
  //     parentRouter: 'gc/tr',
  //     destroyDiff: false,
  //   })
  // },

  trackRecords() {
    this.changeMainReginView(new TrackRecordView(), {
      main: {
        // icon: gcMenuConfig.icon,
        title: '追号记录',
      },
      sidebar,
    })
  },
  // 追号详情
  // trackDetail(tradeNo, chaseFormId) {
  //   this.changeSubReginView(new TrackDetailView({
  //     tradeNo,
  //     chaseFormId,
  //   }), {
  //     main: {
  //       title: '追号详情',
  //     },
  //     parentRouter: 'gc/tr',
  //     destroyDiff: false,
  //   })
  // },
  // 追号详情跳投注记录
  // trackBetDetail(chaseFormId, tradeNo) {
  //   this.changeSubReginView(new BettingDetailView({
  //     tradeNo,
  //   }), {
  //     parentRouter: 'gc/tr',
  //   })
  // },

  personalManage() {
    this.changeMainReginView(new PersonalManageView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '个人资料',
        titleDes: '<div class="title-des">' +
                    '<p>温馨提示：为了您的账号与资金安全，请完善一下信息，以方便我们及时与您取得联系。在逢年过节或玩家生日时，</p>' +
                    '<p>我们会给忠实会员派送礼金或礼品呦！</p>' +
                  '</div>',
      },
      sidebar,
    })
  },

  cardManage() {
    this.changeMainReginView(new CardManageView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '银行卡管理',
        titleDes: '<div class="title-des">' +
                    '<p>1、每个平台账号最多绑定<span class="text-prominent">5</span>张，新绑定的银行卡需要<span class="text-prominent">3</span>个小时才能正常取款</p>' +
                    '<p>2、为了您的资金安全，建议您点击<span class="text-prominent">锁定银行卡</span>，银行卡锁定以后不能再增加和删除银行卡，解锁需要联系在线客服并提交资料审核</p>' +
                  '</div>',
      },
      sidebar,
    })
  },
  // cardBinding() {
  //   this.changeSubReginView(new CardBindingView(), {
  //     main: {
  //       // icon: ucMenuConfig.icon,
  //       title: '银行卡管理',
  //     },
  //     parentRouter: 'uc/cm',
  //   })
  // },

  priceDetails() {
    this.changeMainReginView(new PriceDetailsView(), {
      main: {
        // icon: ucMenuConfig.icon,
        title: '我的奖金组',
        titleDes: '单期高频彩奖金最大值为<span class="text-prominent"><span class="js-ac-pd-ssc-maxBonus" ></span>元</span>,' +
        '单期低频彩奖金最大值为<span class="text-prominent"><span class="js-ac-pd-low-maxBonus" ></span>元</span>;' +
        '中奖概率低于<span class="text-prominent"><span class="js-ac-pd-num"></span>%</span>的投注均为单挑模式,' +
        '单期奖金最大值为<span class="text-prominent"><span class="js-ac-pd-num-maxBonus"></span>元</span>',
      },
      sidebar,
    })
  },
  accountSafe() {
    this.changeMainReginView(new AccountSafeViewInfo(), {
      main: {
        title: '账户安全',
        titleDes: '建议您启动全部安全设置，以保障资金及资金安全',
      },
      sidebar,
    })
  },
  myMessage() {
    this.changeMainReginView(new MyMessageViewInfo(), {
      sidebar,
    })
  },
})

module.exports = UserCenterController
