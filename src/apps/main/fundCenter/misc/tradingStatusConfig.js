

const status = [
  {
    index: 'ALL',
    id: '',
    zhName: '全部',
    searchName: '全部',
  },
  {
    index: 'INCOME_ALL',
    id: 10,
    zhName: '收入',
    searchName: '&nbsp;+&nbsp;收入',
  },
  {
    index: 'INCOME_CHARGE',
    id: 100,
    zhName: '充值',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>充值',
  },
  {
    index: 'INCOME_WITHDRAW_FAIL',
    id: 125,
    zhName: '提现退回',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>提现退回',
  },
  {
    index: 'INCOME_WINNING',
    id: 101,
    zhName: '中奖',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>中奖',
  },
  {
    index: 'INCOME_REBATE',
    id: 102,
    zhName: '返点',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>返点',
  },
  {
    index: 'INCOME_REBATE_AG',
    id: 246,
    zhName: 'AG平台返水',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>AG平台返水',
  },
  {
    index: 'INCOME_REBATE_EBET',
    id: 247,
    zhName: 'EBET平台返水',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>EBET平台返水',
  },
  {
    index: 'INCOME_REBATE_BBIN',
    id: 248,
    zhName: 'BBIN平台返水',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>BBIN平台返水',
  },
  {
    index: 'INCOME_REBATE_PT',
    id: 249,
    zhName: 'PT平台返水',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>PT平台返水',
  },
  {
    index: 'INCOME_REBATE_MG',
    id: 250,
    zhName: 'MG平台返水',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>MG平台返水',
  },
  {
    index: 'INCOME_REBATE_GG',
    id: 251,
    zhName: 'GG平台返水',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>GG平台返水',
  },
  {
    index: 'INCOME_CANCEL',
    id: 103,
    zhName: '撤单',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>撤单',
  },
  {
    index: 'INCOME_CANCEL_SYS',
    id: 113,
    zhName: '系统撤单',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>>系统撤单',
  },
  {
    index: 'INCOME_CANCEL_USER',
    id: 123,
    zhName: '用户撤单',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;>>用户撤单',
  },
  {
    index: 'INCOME_TRANSFER',
    id: 104,
    zhName: '上级转账',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>上级转账',
  },
  {
    index: 'INCOME_TRANSFER_CHANNEL',
    id: 114,
    zhName: '钱包转入',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>钱包转入',
  },
  {
    index: 'INCOME_ACTIVITY',
    id: 192,
    zhName: '活动',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>活动',
  },
  {
    index: 'INCOME_SYSTEM',
    id: 105,
    zhName: '系统加币',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>系统加币',
  },
  {
    index: 'OUTCOME_ALL',
    id: 11,
    zhName: '支出',
    searchName: '&nbsp;-&nbsp;支出',
  },
  {
    index: 'OUTCOME_WITHDRAW',
    id: 106,
    zhName: '提现',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>提现',
  },
  {
    index: 'OUTCOME_BETTING',
    id: 107,
    zhName: '投注',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>投注',
  },
  {
    index: 'OUTCOME_TRANSFER',
    id: 108,
    zhName: '下级转账',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>下级转账',
  },
  {
    index: 'OUTCOME_TRANSFER_CHANNEL',
    id: 118,
    zhName: '钱包转出',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>钱包转出',
  },
  {
    index: 'OUTCOME_SYSTEM',
    id: 109,
    zhName: '系统扣币',
    searchName: '&nbsp;&nbsp;&nbsp;&nbsp;>系统扣币',
  },
]


module.exports = {
  get(index) {
    return _(status).getConfig(index)
  },

  toZh(id) {
    return _(status).getConfigById(id) || id
  },
}
