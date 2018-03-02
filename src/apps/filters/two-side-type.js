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
    one: '冠军',
    two: '亚军',
    three: '季军',
    four: '第四名',
    five: '第五名',
    six: '第六名',
    seven: '第七名',
    eight: '第八名',
    nine: '第九名',
    ten: '第十名',
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
