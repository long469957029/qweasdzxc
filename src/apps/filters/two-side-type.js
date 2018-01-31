const TYPE = {
  ssc: {
    units: '个位',
    tens: '十位',
    hundreds: '百位',
    thousands: '千位',
    tenThousands: '万位',
    LLH: '龙虎和',
    sum: '总和',
  },
  pk10: {
    one: '第一球',
    two: '第二球',
    three: '第三球',
    four: '第四球',
    five: '第五球',
    six: '第六球',
    seven: '第七球',
    eight: '第八球',
    nine: '第九球',
    ten: '第十球',
    sum: '冠亚和',
    llh1: '第一~十名龙虎',
    llh2: '第二~九名龙虎',
    llh3: '第三~八名龙虎',
    llh4: '第四~七名龙虎',
    llh5: '第五~六名龙虎',
  }
}

export default (type, ticketType) => {
  return TYPE[ticketType][type]
}
