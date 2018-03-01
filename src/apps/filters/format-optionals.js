export default (optionals) => {

  let split = _.isArray(optionals) ? optionals : optionals.split(',')

  const format = _.map(split, (optional) => {
    switch(Number(optional)) {
      case 0:
        return '万'
      case 1:
        return '千'
      case 2:
        return '百'
      case 3:
        return '十'
      case 4:
        return '个'
    }
  })

  return format
}
