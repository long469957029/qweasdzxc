const periods = [
  {
    title: '近100期',
    value: 100,
  },
]

const lowPeriods = [
  {
    title: '近30期',
    value: 30,
  },
  {
    title: '近50期',
    value: 50,
  },
  {
    title: '近100期',
    value: 100,
  },
]

const compareSize = (half, num) => {
  return num / half >= 1 ? '大' : '小'
}

const checkSingleAndDouble = (num) => {
  return num % 2 ? '单' : '双'
}

const total = (half, nums) => {
  const total = _.reduce(nums, (total, num) => {
    return total + Number(num)
  }, 0)
  const size = compareSize(half, total)
  const singleAndDouble = checkSingleAndDouble(total)

  return {
    total,
    size,
    singleAndDouble,
  }
}

const twoPositionTotal = (half, num1Pos, num2Pos, nums) => {
  return total(half, [nums[num1Pos], nums[num2Pos]])
}

const twoPositionLongHu = (half, num1Pos, num2Pos, nums) => {
  const total = _.reduce([nums[num1Pos], nums[num2Pos]], (total, num) => {
    return total + Number(num)
  }, 0)
  const cLongHu = longHu(num1Pos, num2Pos, nums)
  const size = compareSize(half, total)
  const singleAndDouble = checkSingleAndDouble(total)

  return {
    longHu: cLongHu,
    size,
    singleAndDouble,
  }
}

const longHu = (num1Index, num2Index, nums) => {
  return nums[num1Index] > nums[num2Index] ?
    '龙' : nums[num1Index] === nums[num2Index] ? '和' : '虎'
}

const group = (nums) => {
  const length = _.uniq(nums.slice(0, 3)).length
  return length === 3 ? '组六' : length === 2 ? '组三' : '豹子'
}

export const ssc = {
  periods,
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble,
  },
  total: _.partial(total, 25),
  longHu: _.partial(longHu, 0, 4),
}

export const choose15 = {
  periods,
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 6),
    singleAndDouble: checkSingleAndDouble,
  },
  total: _.partial(total, 30),
  longHu: _.partial(longHu, 0, 4),
}

export const p5p3 = {
  periods: lowPeriods,
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble,
  },
  total: _.partial(total, 25),
  form: group,
}

export const threeD = {
  periods: lowPeriods,
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble,
  },
  total: _.partial(total, 15),
  form: group,
}

export const quick3 = {
  periods,
  doubleHead: false,
  numCol: {
    num: 'dices',
    singleAndDouble: checkSingleAndDouble,
  },
  total: _.partial(total, 10),
}

export const mark6 = {
  periods: lowPeriods,
  doubleHead: ['开奖号码', {
    styles: 'title-mark6',
    content: '正1    正2    正3    正4    正5    正6        特码'
  }],
  numCol: {
    num: 'mark6',
  },
  specialCode: _.partial(total, 25),
  total: _.partial(total, 175),
}

export const pk10 = {
  periods,
  doubleHead: ['开奖号码', {
    styles: 'title-pk10',
    content: '冠  亚  季  四  五  六  七  八  九  十'
  }],
  numCol: {
    num: 'square',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble,
  },
  championAndRunnerUp: _.partial(twoPositionTotal, 12, 0, 1),
  compareLongHu: [
    {
      title: '冠军',
      algorithm: _.partial(twoPositionLongHu, 12, 0, 9),
    },
    {
      title: '亚军',
      algorithm: _.partial(twoPositionLongHu, 12, 1, 8),
    },
    {
      title: '季军',
      algorithm: _.partial(twoPositionLongHu, 12, 2, 7),
    },
    {
      title: '第四名',
      algorithm: _.partial(twoPositionLongHu, 12, 3, 6),
    },
    {
      title: '第五名',
      algorithm: _.partial(twoPositionLongHu, 12, 4, 5),
    },
  ],
}
