const normal = () => {
  return 1
}

const addAll = ({lotteryList}) => {
  return _.reduce(lotteryList, (multiple, lotteryRow) => {
    if (lotteryRow.length) {
      ++multiple
    }
    return multiple
  }, 0) || 1
}

const group = ({lotteryList, n, k}) => {
  // const maxMultiple = _.combinations(n, k)
  let count = _.flatten(lotteryList).length
  if (count > n) {
    count = n
  }

  count -= (k - 1)

  count = polygonal(count, k)
  return count || 1
}

const daxiaodanshuang = ({lotteryList}) => {
  return _.reduce(lotteryList, (count, lotteryRow) => {
    return count * $_daxiaodanshuang(lotteryRow)
  }, 1) || 1
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
  let existNumberList = []
  return _.reduce(lotteryList, (multiple, lotteryRow) => {
    if (lotteryRow.length) {
      ++multiple
    }
    return multiple
  }, 0) || 1
}

const addAllRow = ({lotteryList, max}) => {
  let count = _.flatten(lotteryList).length
  if (count > max) {
    count = max
  }
  return count || 1
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
  addAllRow,
}

export default {
  normal,
  addAll,
  addAllNotRepeat,
  group,
  daxiaodanshuang,
  addAllRow,
}
