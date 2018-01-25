function mulAll(rowsResult) {
  return _(rowsResult).reduce(function (total, result, index) {
    if (this.list[index].isShow) {
      total *= result.length
    }
    return total
  }, 1, this)
}

function mulAllNotRepeat(rowsResult) {
  const combinations = []
  let total = _(rowsResult).reduce(function (total, result, index) {
    if (this.list[index].isShow) {
      total *= result.length
    }
    return total
  }, 1, this)

  if (total > 0) {
    total = 0
    _count([])
  }

  function _count() {
    if (combinations.length < rowsResult.length) {
      _(rowsResult[combinations.length]).each((item, index, row) => {
        const isFind = _(combinations).contains(item.num)
        if (!isFind) {
          combinations.push(item.num)
          if (combinations.length === rowsResult.length) {
            total++
            combinations.pop()
          } else {
            _count()
          }
        }

        if (index === row.length - 1) {
          combinations.pop()
        }
      })
    }
  }

  return total
}

function addAll(rowsResult) {
  return _(rowsResult).reduce(function (total, result, index) {
    if (this.list[index].isShow) {
      total += result.length
    }
    return total
  }, 0, this)
}

function _group(n, cTimes, factor) {
  let total = 1

  total = _(total).mul(factor)

  if (total) {
    _(_.range(cTimes)).each((cTime) => {
      total = _(total).chain().mul(_(n).sub(cTime)).div(_(cTimes).sub(cTime))
        .value()
    })
  }

  return total
}

// 组选 不定位
function group(rowsResult) {
  let total = 0
  const algorithmProps = this.algorithmProps
  const mainRow = _.pluck(rowsResult[algorithmProps.mainRow] && rowsResult[algorithmProps.mainRow], 'num')
  const subRow = _.pluck(rowsResult[1 - algorithmProps.mainRow] && rowsResult[1 - algorithmProps.mainRow], 'num')
  let n = mainRow.length

  // 组选都做两次相加
  total = _(total).add(_group(n, algorithmProps.cTimes, _(subRow).isUndefined() ? 1 : _(subRow).difference(mainRow).length))

  --n

  if (!_(subRow).isUndefined()) {
    total = _(total).add(_group(n, algorithmProps.cTimes, _(mainRow).intersection(subRow).length))
  }

  return total
}

function factorial(rowsResult) {
  let total = 1
  const algorithmProps = this.algorithmProps
  const mainRow = rowsResult[0] && rowsResult[algorithmProps.mainRow]

  const n = mainRow.length

  // 组选都做两次相加

  _(_.range(algorithmProps.cTimes)).each((cTime) => {
    total = _(total).chain().mul(_(n).sub(cTime)).value()
  })

  return total
}

// 和值
function statistics(rowsResult) {
  const algorithmProps = this.algorithmProps
  const totalCount = _(algorithmProps.selectCount).mul(9)
  const circleTimes = algorithmProps.selectCount - 1
  const selectedList = rowsResult[0]
  const halfCount = Math.ceil(totalCount / 2)

  return _(selectedList).reduce((total, selectNum) => {
    let n = selectNum.num
    if (totalCount - selectNum < halfCount) {
      n = totalCount - selectNum
    }

    if (n <= 9) {
      total += _(_.range(1, circleTimes + 1)).chain().reduce((total, index) => {
        return _(total).mul(_(n).add(index))
      }, 1).div(circleTimes)
        .value()
      // total += _(_(n).add(1)).chain().mul(_(n).add(2)).div(2).value();
    } else {
      total += _(_.range(1, circleTimes + 1)).chain().reduce((total, index) => {
        return _(total).mul(_(9).add(index))
      }, 1).div(circleTimes)
        .value()

      total = _(_.range(1, n - 8)).reduce((total, index) => {
        total += 10 - _(index).mul(circleTimes)
        return total
      }, total)
    }
    return total
  }, 0)
}

function fromConfig(rowsResult) {
  const algorithmProps = this.algorithmProps

  return _(rowsResult).reduce((total, result) => {
    return _(result).reduce((total, select) => {
      return total + algorithmProps.config[select.num]
    }, total)
  }, 0)
}

function staticVal(rowsResult) {
  const algorithmProps = this.algorithmProps

  return _(rowsResult).reduce((total, result) => {
    return _(result).reduce((total, select) => {
      return total + algorithmProps.val
    }, total)
  }, 0)
}

function optionalDouble(rowsResult) {
  const coefficient = this.algorithmProps.coefficient

  let count = 0

  if (rowsResult.length >= coefficient) {
    count = _optionalDouble(rowsResult, coefficient, 0, 0, [])
  }

  return count
}

function _optionalDouble(rowsResult, coefficient, parentIndex, times, combinations) {
  let count = 0
  let index = parentIndex
  let length

  ++times

  if (coefficient >= times) {
    length = rowsResult.length - coefficient + times - 1

    for (; index <= length; ++index) {
      combinations.push(rowsResult[index].length)
      count = _(count).add(_optionalDouble(rowsResult, coefficient, index + 1, times, combinations))

      if (index === length) {
        combinations.pop()
      }
    }
  } else {
    count = _(combinations).reduce((count, combination) => {
      return _(count).mul(combination)
    }, 1)

    combinations.pop()
  }

  return count
}

// 胆拖

function banker(rowsResult) {
  let count = 0
  const algorithmProps = this.algorithmProps
  const num = algorithmProps.num

  const danCount = rowsResult[algorithmProps.mainRow || 0].length
  const tuoCount = rowsResult[1 - algorithmProps.mainRow || 1].length

  if (tuoCount && danCount) {
    count = 1
    _(_(num).sub(danCount)).times((index) => {
      count = _(count).mul(_(tuoCount).sub(index))
      // if (_(danCount).sub(index)) {
      count = _(count).div(_(index).add(1))
      // } else {
      //  count = 0;
      // }
    })
  }

  return count
}

function optional(optionalCoefficient, selectLength) {
  // 任选玩法只负责计算出系数，其它仍旧交给各自的算法计算
  let coefficient = 1
  _(optionalCoefficient).times((time) => {
    coefficient = _(coefficient).mul(selectLength - time)
  })

  if (coefficient) {
    _(optionalCoefficient).times((time) => {
      coefficient = _(coefficient).div(time + 1)
    })
  }

  return coefficient
}

function getOptionals(coefficient, options) {
  options = _(options || {}).defaults({
    list: ['万位', '千位', '百位', '十位', '个位'],
  })

  return {
    coefficient,
    list: _(options.list).map((item, index) => {
      return {
        id: index,
        title: item,
        checked: options.list.length - index <= coefficient,
      }
    }),
  }
}

//= =============create

function getCreateFunc(length, options) {
  length = length || 5
  options = _(options || {}).defaults({
    innerSplit: '',
    range: _.range(10),
    repeat: false,
    // 最小接受的相同数,默认1
    minRepeat: 1,
    // 最大接受的相同数,默认不允许重复，当最大和最小相等时，则说明至少需要一个有此数量的相等数字出现,如都等于2时 233
    maxRepeat: 1,
    // 相同数字允许出现的对数, 默认不限
    acceptRepeat: -1,
    // 切割，默认不切割
    slice: _.range(length),
    // sort排序,指最外层的排序
    outerSort: false,
    // sort排序,指内层的排序,也就是在两个逗号中间的数值,一般只有单式需要使用false
    innerSort: true,
  })
  // options.repeat = options.maxRepeat > 1;


  return function () {
    let result = []
    let index = 0
    let current = []
    let acceptRepeat = options.acceptRepeat
    let currentNum
    let repeatTimes

    options.range = _.map(options.range, item => {
      if (!_.isObject(item)) {
        item = {
          title: item,
          num: item
        }
      }
      return item
    })

    for (; index < length; ++index) {
      currentNum = _.sample(options.range)

      if (!options.repeat && _(current).chain().flatten().contains(currentNum)
          .value()) {
        --index
        continue
      }

      if (acceptRepeat > 0) {
        repeatTimes = _.random(options.minRepeat, options.maxRepeat)
        currentNum = _(repeatTimes).times(_.constant(currentNum))
        current = current.concat(currentNum)

        --acceptRepeat
      } else {
        current.push(currentNum)
      }

      if (repeatTimes > 1) {
        index += repeatTimes - 1
      }
    }

    if (options.outerSort) {
      current = _(current).sortBy()
    }

    _(options.slice).reduce((startIndex, sliceIndex) => {
      let nums = current.slice(startIndex, sliceIndex + 1)

      if (options.innerSort) {
        nums = _(nums).sortBy()
      }
      result.push(nums)

      return sliceIndex + 1
    }, 0)

    if (options.matching) {
      _(this.list).each((item, index) => {
        if (!item.isShow) {
          result.splice(index, 0, [])
        }
      })
    }

    let statistics

    // list长度等于1时，需要统一格式进行统计，比如不定式和组选120等只有一行的彩种
    if (this.list && this.list.length === 1) {
      statistics = this.algorithm !== _.noop ? this.algorithm([_(result).flatten()]) : 1
    } else {
      statistics = this.algorithm !== _.noop ? this.algorithm(result) : 1
    }

    // 当长度不足时，用空数组补足，比如一星定位胆，有5行，随机只有一行数据
    if (this.list && this.list.length > result.length) {
      _(this.list.length - result.length).times((index) => {
        result.push([])
      })
      result = _(result).shuffle()
    }

    if (this.type === 'input') {
      result = _(result).map((bet) => {
        return [bet.join(options.innerSplit)]
      })
    }

    return {
      lotteryList: result,
      statistics,
    }
  }
}

function getValidateFunc(length, options) {
  length = length || 5
  options = _(options || {}).defaults({
    split: '',
    innerSplit: '',
    range: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    repeat: false,
    // 最小接受的相同数,默认1
    minRepeat: 1,
    // 最大接受的相同数,默认不允许重复，当最大和最小相等时，则说明至少需要一个有此数量的相等数字出现,如都等于2时 233
    maxRepeat: 1,
    // 相同数字允许出现的对数, 默认不限
    acceptRepeat: -1,
    // sort排序,指最外层的排序
    outerSort: false,
    // sort排序,指内层的排序,也就是在两个逗号中间的数值,一般只有单式需要使用false
    innerSort: false,
  })

  return function (numberList) {
    const result = {
      statistics: 0,
      errorNumbers: [],
      repeatNumbers: [],
      passNumbers: [],
      passNumbersObj: {},
    }

    _(numberList).each((number) => {
      let numbers = number.split(options.split)
      const temp = {}

      // 长度验证
      if (numbers.length !== length) {
        result.errorNumbers.push(number)
        return
      }

      // 排序
      if (options.innerSort) {
        numbers = _(numbers).sortBy()
      }

      // 字符验证
      for (let i = 0; i < numbers.length; ++i) {
        if (!_.contains(options.range, numbers[i])) {
          result.errorNumbers.push(number)
          return
        }
      }
      // if (!/^[\d\s]+$/.test(number)) {
      // }

      // 相同值验证

      _(numbers).each((number) => {
        temp[number] = temp[number] ? temp[number] + 1 : 1
      })

      if (options.acceptRepeat > 0) {
        const max = _(temp).chain().values()
        if (options.maxRepeat < _(max).max()) {
          result.errorNumbers.push(numbers.join(options.innerSplit))
          return
        }

        if (options.minRepeat > _(max).max()) {
          result.errorNumbers.push(number)
          return
        }
      } else if (options.acceptRepeat === 0) {
        if (_(temp).max() > 1) {
          result.errorNumbers.push(number)
          return
        }
      }

      const finalNumber = numbers.join(options.innerSplit)
      // 去重复
      if (result.passNumbersObj[finalNumber]) {
        result.repeatNumbers.push(number)
      } else {
        ++result.statistics
        result.passNumbers.push(finalNumber)

        result.passNumbersObj[finalNumber] = true
      }
    })

    return result
  }
}

module.exports = {
  mulAll,
  mulAllNotRepeat,

  addAll,

  // 组选 不定位
  group,

  factorial,

  // 和值
  statistics,

  fromConfig,

  staticVal,

  banker,

  optionalDouble,

  optional,

  //= =============create

  getCreateFunc,

  getValidateFunc,

  getOptionals,
}
