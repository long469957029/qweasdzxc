export default (numList) => {
  const totalNum = _.reduce(numList, (total, num) => {
    return total + Number(num)
  }, 0)
  const parity = totalNum % 2 ? '单' : '双'
  const magnitude = totalNum > 9 ? '大' : '小'

  return {
    totalNum,
    parity,
    magnitude,
  }
}
