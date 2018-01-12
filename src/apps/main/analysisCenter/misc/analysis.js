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

const longHu = (num1Index, num2Index, nums) => {
  return nums[num1Index] > nums[num2Index] ?
    '龙' : nums[num1Index] === nums[num2Index] ? '和' : '虎'
}

const group = (nums) => {
  const length = _.uniq(nums.slice(0, 3)).length
  return length === 3 ? '豹子' : length === 2 ? '组三' : '组六'
}

export const ssc = {
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble
  },
  total: _.partial(total, 25),
  longHu: _.partial(longHu, 0, 4),
}

export const p5p3 = {
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble
  },
  total: _.partial(total, 25),
  form: group,
}

export const threeD = {
  doubleHead: false,
  numCol: {
    num: 'balls',
    size: _.partial(compareSize, 5),
    singleAndDouble: checkSingleAndDouble
  },
  total: _.partial(total, 15),
  form: group,
}

export const quick3 = {
  doubleHead: false,
  numCol: {
    num: 'dices',
  },
  total: _.partial(total, 10),
}
