export default (status) => {
  let formatStatus

  switch(status) {
    case 0:
      formatStatus = '未使用'
      break;
    case 1:
      formatStatus = '已使用'
      break;
    case 2:
      formatStatus = '已过期'
      break;
    case 3:
      formatStatus = '统计中'
      break;
    default:
      formatStatus = status
      break;
  }
  return formatStatus
}
