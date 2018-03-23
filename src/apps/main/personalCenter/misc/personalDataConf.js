/**
 * Created by steven on 2018/3/19.
 */
const walletConf = [
  {
    id: 0,
    title: '充值',
    name:'recharge',
    img:'sfa-icon-recharge-green',
  },
  {
    id: 1,
    title: '提现',
    name:'withdraw',
    img:'sfa-icon-withdraw-green'
  },
  {
    id: 2,
    title: '投注',
    name:'bet',
    img:'sfa-icon-bet-green',
  },
  {
    id: 3,
    title: '派奖',
    name:'award',
    img:'sfa-icon-award-green'
  },
  {
    id: 4,
    title: '返点',
    name:'rebate',
    img:'sfa-icon-rebate-green'
  },
  {
    id: 5,
    title: '返水',
    name:'back',
    img:'sfa-icon-back-green'
  },
  {
    id: 6,
    title: '活动',
    name:'activity',
    img:'sfa-icon-activity-green'
  },
  {
    id: 7,
    title: '总盈亏',
    name:'profit',
    img:'sfa-icon-profit-green'
  },
]
module.exports = {
  getAll() {
    return walletConf
  },
}
