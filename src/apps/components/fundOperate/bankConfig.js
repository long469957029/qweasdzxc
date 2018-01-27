const banks = [
  {
    id: 1,
    zhName: '招商银行',
    logo: require('base/images/v2/bank-zhaoshang.png'),
    bankClassName: 'zhaoshang',
    className: 'fc-re-zhaoshang',
  },
  {
    id: 2,
    zhName: '工商银行',
    logo: require('base/images/v2/bank-gongshang.png'),
    bankClassName: 'gongshang',
    className: 'fc-re-gongshang',
  },
  {
    id: 3,
    zhName: '建设银行',
    logo: require('base/images/v2/bank-jianshe.png'),
    bankClassName: 'jianshe',
    className: 'fc-re-jianshe',
  },
  {
    id: 4,
    zhName: '农业银行',
    logo: require('base/images/v2/bank-nongye.png'),
    bankClassName: 'nongye',
    className: 'fc-re-nongye',
  },
  {
    id: 5,
    zhName: '中国银行',
    logo: require('base/images/v2/bank-zhongguo.png'),
    bankClassName: 'zhongguo',
    className: 'fc-re-zhongguo',
  },
  {
    id: 6,
    zhName: '交通银行',
    logo: require('base/images/v2/bank-jiaotong.png'),
    bankClassName: 'jiaotong',
    className: 'fc-re-jiaotongo',
  },
  {
    id: 7,
    zhName: '广发银行',
    logo: require('base/images/v2/bank-guangfa.png'),
    bankClassName: 'guangfa',
    className: 'fc-re-guangfa',
  },
  {
    id: 8,
    zhName: '光大银行',
    logo: require('base/images/v2/bank-guangda.png'),
    bankClassName: 'guangda',
    className: 'fc-re-guangda',
  },
  {
    id: 9,
    zhName: '浦发银行',
    logo: require('base/images/v2/bank-pufa.png'),
    bankClassName: 'pufa',
    className: 'fc-re-pufa',
  },
  {
    id: 10,
    zhName: '民生银行',
    logo: require('base/images/v2/bank-mingsheng.png'),
    bankClassName: 'minsheng',
    className: 'fc-re-minsheng',
  },
  {//
    id: 11,
    zhName: '平安银行',
    logo: require('base/images/v2/bank-pingan.png'),
    bankClassName: 'pingan',
    className: 'fc-re-pingan',
  },
  {//
    id: 12,
    zhName: '兴业银行',
    logo: require('base/images/v2/bank-xingye.png'),
    bankClassName: 'xingye',
    className: 'fc-re-xingye',
  },
  {
    id: 13,
    zhName: '中信银行',
    logo: require('base/images/v2/bank-zhongxin.png'),
    bankClassName: 'zhongxin',
    className: 'fc-re-zhongxin',
  },
  {
    id: 14,
    zhName: '邮政银行',
    logo: require('base/images/v2/bank-youzheng.png'),
    bankClassName: 'youzheng',
    className: 'fc-re-youzheng',
  },
  {//
    id: 15,
    zhName: '华夏银行',
    logo: require('base/images/v2/bank-huaxia.png'),
    bankClassName: 'huaxia',
    className: 'fc-re-huaxia',
  },

]

module.exports = {
  get(id) {
    return _(banks).findWhere({
      id,
    })
  },
  getAll(){
    return banks
  }
}
