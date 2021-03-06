

const banks = [
  {
    id: 1,
    zhName: '招商银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'zhaoshang',
  },
  {
    id: 2,
    zhName: '工商银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'gongshang',
  },
  {
    id: 3,
    zhName: '建设银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'jianshe',
  },
  {
    id: 4,
    zhName: '农业银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'nongye',
  },
  {
    id: 5,
    zhName: '中国银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'zhongguo',
  },
  {
    id: 6,
    zhName: '交通银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'jiaotong',
  },
  {
    id: 7,
    zhName: '广发银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'guangfa',
  },
  {
    id: 8,
    zhName: '光大银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'guangda',
  },
  {
    id: 9,
    zhName: '浦发银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'pufa',
  },
  {
    id: 10,
    zhName: '民生银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'minsheng',
  },
  {//
    id: 11,
    zhName: '平安银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'pingan',
  },
  {//
    id: 12,
    zhName: '兴业银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'xingye',
  },
  {
    id: 13,
    zhName: '中信银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'zhongxin',
  },
  {
    id: 14,
    zhName: '邮政银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'youzheng',
  },
  {//
    id: 15,
    zhName: '华夏银行',
    logo: require('./bankImages/zhaoshang.png'),
    bankClassName: 'huaxia',
  },

]

module.exports = {
  get(id) {
    return _(banks).findWhere({
      id,
    })
  },
}
