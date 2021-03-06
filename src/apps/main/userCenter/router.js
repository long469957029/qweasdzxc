
require('./misc/index.scss')

const sidebar = Global.ui.menu.get('uc')

const MyMessageViewInfo = () => import(/* webpackChunkName: "user-center" */ './views/myMessage')
const PersonalManageView = () => import(/* webpackChunkName: "user-center" */ './views/personalManage')
const CardManageView = () => import(/* webpackChunkName: "user-center" */ './views/cardManage')
const PriceDetailsView = () => import(/* webpackChunkName: "user-center" */ './views/priceDetails')
const AccountSafeViewInfo = () => import(/* webpackChunkName: "user-center" */ './views/accountSafe')
const MyPointsCardView = () => import(/* webpackChunkName: "user-center" */ './views/myPointsCard')

// 'uc/pm': 'personalManage',
// 'uc/cm': 'cardManage', // 银行卡管理
// 'uc/pd': 'priceDetails', // 奖金详情
// 'uc/pl': 'accountSafe',
// 'uc/mg': 'myMessage',

export default [
  {
    path: '/uc/pm',
    component: function(resolve) {
      RouterController.async(resolve, PersonalManageView, {
        main: {
          // icon: ucMenuConfig.icon,
          title: '个人资料',
          titleDes: `<div class="title-des">
          <p>为了您的账号与资金安全，请完善以下信息，以方便我们及时与您取得联系。在逢年过节或玩家生日时，</p>
          <p>我们会给忠实会员派送礼金或礼品呦！</p>
          </div>`,
        },
        sidebar,
      })
    }
  },
  {
    path: '/uc/cm',
    component: function(resolve) {
      RouterController.async(resolve, CardManageView, {
        main: {
          // icon: ucMenuConfig.icon,
          title: '银行卡管理',
          titleDes: `<div class="title-des">
          <p>1、每个平台账号最多绑定<span class="text-prominent">5</span>张，新绑定的银行卡需要<span class="text-prominent">3</span>个小时才能正常取款</p>
          <p>2、为了您的资金安全，建议您点击<span class="text-prominent">锁定银行卡</span>，银行卡锁定以后不能再增加和删除银行卡，解锁需要联系在线客服并提交资料审核</p>
          </div>`,
        },
        sidebar,
      })
    }
  },
  {
    path: '/uc/pd',
    component: function(resolve) {
      RouterController.async(resolve, PriceDetailsView, {
        main: {
          // icon: ucMenuConfig.icon,
          title: '我的奖金组',
          titleDes: `平台彩种单期最高奖金限制：<span class="text-prominent"><span class="js-ac-pd-ssc-maxBonus" ></span>元</span>`
        },
        sidebar,
      })
    }
  },
  {
    path: '/uc/pl',
    component: function(resolve) {
      RouterController.async(resolve, AccountSafeViewInfo, {
        main: {
          title: '账户安全',
          titleDes: '建议您启动全部安全设置，以保障账号及资金安全',
        },
        sidebar,
      })
    }
  },
  {
    path: '/uc/mg',
    component: function(resolve) {
      RouterController.async(resolve, MyMessageViewInfo, () => {
        return {
          noticeId: _.getUrlParam('id'),
          triggerTab: 'jsSystemMessage'
        }
      }, {
        sidebar,
      })
    }
  },
  // {
  //   path: '/uc/mg/:id',
  //   component: function(resolve) {
  //     RouterController.async(resolve, MyMessageViewInfo, {
  //       noticeId: $route.params.id,
  //     }, {
  //       sidebar,
  //     })
  //   }
  // },
  {
    path: '/uc/fb',
    component: function(resolve) {
      RouterController.async(resolve, MyMessageViewInfo, {
        triggerTab: 'jsFeedback',
      }, {
        sidebar,
      })
    }
  },
  {
    path: '/uc/cp',
    component: function(resolve) {
      RouterController.async(resolve, MyPointsCardView, {
        main: {
          title: '我的优惠券',
        },
        sidebar,
      })
    }
  },
]
