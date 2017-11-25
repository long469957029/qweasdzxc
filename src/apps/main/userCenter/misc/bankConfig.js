

const banks = [
  {
    id: 1,
    zhName: '招商银行',
    pic: require('./zhaoshang.png'),
    lockPic: require('./lockzhaoshang.png'),
    logo: require('./zhaoshangL.png'),
    disLogo: require('./diszhaoshangL.png'),
  },
  {
    id: 2,
    zhName: '工商银行',
    pic: require('./gongshang.png'),
    lockPic: require('./lockgongshang.png'),
    logo: require('./gongshangL.png'),
    disLogo: require('./disgongshangL.png'),
  },
  {
    id: 3,
    zhName: '建设银行',
    pic: require('./jianshe.png'),
    lockPic: require('./lockjianshe.png'),
    logo: require('./jiansheL.png'),
    disLogo: require('./disjiansheL.png'),
  },
  {
    id: 4,
    zhName: '农业银行',
    pic: require('./nongye.png'),
    lockPic: require('./locknongye.png'),
    logo: require('./nongyeL.png'),
    disLogo: require('./disnongyeL.png'),
  },
  {
    id: 5,
    zhName: '中国银行',
    pic: require('./zhongguo.png'),
    lockPic: require('./lockzhongguo.png'),
    logo: require('./zhongguoL.png'),
    disLogo: require('./diszhongguoL.png'),
  },
  {
    id: 6,
    zhName: '交通银行',
    pic: require('./jiaotong.png'),
    lockPic: require('./lockjiaotong.png'),
    logo: require('./jiaotongL.png'),
    disLogo: require('./disjiaotongL.png'),
  },
  {
    id: 7,
    zhName: '广发银行',
    pic: require('./guangfa.png'),
    lockPic: require('./lockguangfa.png'),
    logo: require('./guangfaL.png'),
    disLogo: require('./disguangfaL.png'),
  },
  {
    id: 8,
    zhName: '光大银行',
    pic: require('./guangda.png'),
    lockPic: require('./lockguangda.png'),
    logo: require('./guangdaL.png'),
    disLogo: require('./disguangdaL.png'),
  },
  {
    id: 9,
    zhName: '浦发银行',
    pic: require('./pufa.png'),
    lockPic: require('./lockpufa.png'),
    logo: require('./pufaL.png'),
    disLogo: require('./dispufaL.png'),
  },
  {
    id: 10,
    zhName: '民生银行',
    pic: require('./minsheng.png'),
    lockPic: require('./lockminsheng.png'),
    logo: require('./minshengL.png'),
    disLogo: require('./disminshengL.png'),
  },
  {//
    id: 11,
    zhName: '平安银行',
    pic: require('./pingan.png'),
    lockPic: require('./noLogo.png'),
    logo: require('./noLogo.png'),
    disLogo: require('./noLogo.png'),
  },
  {//
    id: 12,
    zhName: '兴业银行',
    pic: require('./xingye.png'),
    lockPic: require('./noLogo.png'),
    logo: require('./xingyeL.png'),
    disLogo: require('./noLogo.png'),
  },
  {
    id: 13,
    zhName: '中信银行',
    pic: require('./zhongxing.png'),
    lockPic: require('./lockzhongxing.png'),
    logo: require('./zhongxingL.png'),
    disLogo: require('./diszhongxingL.png'),
  },
  {
    id: 14,
    zhName: '邮政银行',
    pic: require('./youzheng.png'),
    lockPic: require('./lockyouzheng.png'),
    logo: require('./youzhengL.png'),
    disLogo: require('./disyouzhengL.png'),
  },
  {//
    id: 15,
    zhName: '华夏银行',
    pic: require('./huaxia.png'),
    lockPic: require('./noLogo.png'),
    logo: require('./noLogo.png'),
    disLogo: require('./noLogo.png'),
  },

]

module.exports = {
  get(id) {
    return _(banks).findWhere({
      id,
    })
  },
}
