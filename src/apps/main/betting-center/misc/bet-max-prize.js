const normal = ({count}) => {
  return count ? 1 : 0
}

const addAll = ({lotteryList}) => {
  return _.reduce(lotteryList, (multiple, lotteryRow) => {
    if (lotteryRow.length) {
      ++multiple
    }
    return multiple
  }, 0)
}

const group = ({lotteryList, n, k}) => {
  // const maxMultiple = _.combinations(n, k)
  let count = _.flatten(lotteryList).length
  if (count > n) {
    count = n
  }

  count -= (k - 1)

  count = polygonal(count, k)
  return count
}

const daxiaodanshuang = ({lotteryList}) => {
  return _.reduce(lotteryList, (count, lotteryRow) => {
    return count * $_daxiaodanshuang(lotteryRow)
  }, 1)
}

const daxiaodanshuangAdd = ({lotteryList}) => {
  return _.reduce(lotteryList, (count, lotteryRow) => {
    return count + $_daxiaodanshuang(lotteryRow)
  }, 0)
}

const $_daxiaodanshuang = (lotteryRow) => {
  let count = 0
  if (_.findWhere(lotteryRow, {title: '大'}) || _.findWhere(lotteryRow, {title: '小'})) {
    ++count
  }
  if (_.findWhere(lotteryRow, {title: '单'}) || _.findWhere(lotteryRow, {title: '双'})) {
    ++count
  }

  return count
}

const addAllNotRepeat = ({lotteryList}) => {
  const selectedRow = _.reduce(lotteryList, (multiple, lotteryRow) => {
    if (lotteryRow.length) {
      ++multiple
    }
    return multiple
  }, 0)

  let existNumberList = []
  _.each(lotteryList, (lotteryRow) => {
    if (lotteryRow.length) {
      const usableNumList = _.difference(_.pluck(lotteryRow, 'num'), existNumberList)

      if (usableNumList.length) {
        existNumberList = [...existNumberList, usableNumList[0]]
      }
    }
  })

  let maxMultiple = existNumberList.length

  if (maxMultiple > selectedRow) {
    maxMultiple = selectedRow
  }

  return maxMultiple
}

const addAllRow = ({lotteryList, max}) => {
  let count = _.flatten(lotteryList).length
  if (count > max) {
    count = max
  }
  return count
}


const nInN = ({lotteryList, n, k}) => {
  const maxMultiple = _.combinations(n, k)
  let _n = _.flatten(lotteryList).length
  let currentMultiple = 0
  if (_n >= k) {
    currentMultiple = _.combinations(_n, k)
    if(currentMultiple > maxMultiple) {
      currentMultiple = maxMultiple
    }
  }

  return currentMultiple
}

const overNInN = ({lotteryList, n, k, min}) => {
  const maxMultiple = _.combinations(n, k)
  let _n = _.flatten(lotteryList).length - min + 1
  let currentMultiple = polygonal(_n, k)
  if(currentMultiple > maxMultiple) {
    currentMultiple = maxMultiple
  }

  if (currentMultiple < 0) {
    currentMultiple = 0
  }

  return currentMultiple
}


//k代表k+2形数，循环k次
const polygonal = (count, k) => {
  let final = 1
  _.times(k, (k) => {
    final *= (count + k)
  })

  _.times(k, (k) => {
    final /= (k + 1)
  })

  return final
}



export {
  normal,
  addAll,
  addAllNotRepeat,
  group,
  daxiaodanshuang,
  daxiaodanshuangAdd,
  addAllRow,
  nInN,
  overNInN,
}

export default {
  normal,
  addAll,
  addAllNotRepeat,
  group,
  daxiaodanshuang,
  daxiaodanshuangAdd,
  addAllRow,
  nInN,
  overNInN,
}
