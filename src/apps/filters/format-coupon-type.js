export default (type) => {

  let formatType
  switch(type) {
    case 1:
      formatType = '充值券'
      break;
    case 2:
      formatType = '加奖券'
      break;
    case 3:
      formatType = '补贴券'
      break;
    case 4:
      formatType = '返水券'
      break;
    case 5:
      formatType = '代金券'
      break;
    case 6:
      formatType = '现金券'
      break;
    default:
      formatType = ''
      break;
  }
  return formatType
}
