

const banks = [
  {
    id: 1,
    zhName: '招商银行',
    className: 'fc-re-bank-zhaoshang',
  },
  {
    id: 2,
    zhName: '工商银行',
    className: 'fc-re-bank-gongshang',
  },
  {
    id: 3,
    zhName: '建设银行',
    className: 'fc-re-bank-jianshe',
  },
  {
    id: 4,
    zhName: '农业银行',
    className: 'fc-re-bank-nongye',
  },
  {
    id: 5,
    zhName: '中国银行',
    className: 'fc-re-bank-zhongguo',
  },

  {
    id: 6,
    zhName: '交通银行',
    className: 'fc-re-bank-jiaotong',
  },
  {
    id: 7,
    zhName: '广发银行',
    className: 'fc-re-bank-guangfa',
  },
  {
    id: 8,
    zhName: '光大银行',
    className: 'fc-re-bank-guangda',
  },
  {
    id: 9,
    zhName: '浦发银行',
    className: 'fc-re-bank-pufa',
  },
  {
    id: 10,
    zhName: '民生银行',
    className: 'fc-re-bank-minsheng',
  },
  {
    id: 11,
    zhName: '平安银行',
    className: 'fc-re-bank-pingan',
  },
  {
    id: 12,
    zhName: '兴业银行',
    className: 'fc-re-bank-xingye',
  },
  {
    id: 13,
    zhName: '中信银行',
    className: 'fc-re-bank-zhongxin',
  },
  {
    id: 14,
    zhName: '邮政银行',
    className: 'fc-re-bank-youzheng',
  },
  {
    id: 15,
    zhName: '华夏银行',
    className: 'fc-re-bank-huaxia',
  },
]

module.exports = {
  get(id) {
    return _(banks).findWhere({
      id,
    })
  },
  getAll() {
    return _(banks)
  },
}

