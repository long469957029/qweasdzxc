

require('./index.scss')

const ActivityView = Base.ItemView.extend({

  template: require('./index.html'),

  events: {},

  serializeData() {
    const list = [
      {
        title: '全民投注',
        brief: '活动介绍：每天登录平台，完成对应的投注金额，即可领取相应的投注奖金。',
        showTime: true,
        startTime: '2016-5-15 00:00',
        endTime: '',
        picUrl: require('./quanmintouzhu.jpg'),
      },
      {
        title: 'IOS移动端首登奖励',
        brief: '活动介绍：下载并安装无限IOS客户端，首次登录奖励8元。',
        showTime: true,
        startTime: '2016-3-14 00:00',
        endTime: '',
        picUrl: require('./ios8.jpg'),
      },
      {
        title: '呼朋唤友',
        brief: '活动介绍：邀请好友成为无限娱乐会员，上级可获奖金，好友在充值、投注、提现也可获奖金。',
        showTime: true,
        startTime: '2016-4-18 00:00',
        endTime: '2016-4-24 24:00',
        picUrl: require('./friends.jpg'),
      },
      {
        title: '充10000奖8888',
        brief: '根据每日充值的额度，完全相应的流水，即可获得相应的奖金，最高8888元。',
        showTime: true,
        startTime: '2016-4-18 00:00',
        endTime: '2016-4-24 24:00',
        picUrl: require('./baojiangle.jpg'),
      },
      {
        title: '摇钱树',
        brief: '活动介绍：每次在平台投注达1000元，即可唤出摇钱树，摇一摇可得金砖、金条、金元宝。',
        showTime: true,
        startTime: '2016-2-1 00:00',
        endTime: '2016-2-24 24:00',
        picUrl: require('./moneytree.jpg'),
      },
      {
        title: '红包雨',
        brief: '活动介绍：平台每天不定时的散落红包，用户点击红包可获得随机的奖金。',
        showTime: true,
        startTime: '2015-12-24 00:00',
        endTime: '2016-1-20 24:00',
        picUrl: require('./hongbao.jpg'),
      },
    ]

    return {
      list: _(list).map((item) => {
        const time = moment()
        if (!item.showTime) {
          item.status = -1
          item.formatStatus = '敬请期待'
        } else if (time.isBefore(item.startTime, item.endTime)) {
          item.status = -1
          item.formatStatus = '敬请期待'
        } else if (time.isBetween(item.startTime, item.endTime) || (time.isAfter(item.startTime) && !item.endTime)) {
          item.status = 0
          item.formatStatus = '活动进行中'
        } else {
          item.status = 1
          item.formatStatus = '活动已结束'
        }

        return item
      }),
    }
  },
})

module.exports = ActivityView
