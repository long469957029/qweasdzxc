export default (val) => {
  let betNum = val
  let tryCompact = betNum.split(' ')
  if (tryCompact[0].length === 1) {
    betNum = tryCompact.join('')
  }
  if (val.length > 20) {
    betNum = `${betNum.slice(0, 20)}...`
  }
  return betNum
}
