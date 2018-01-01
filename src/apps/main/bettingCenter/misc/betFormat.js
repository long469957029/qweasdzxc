export default {
  star(itemList) {
    return _.map(itemList, (item) => {
      return `${item.num}*${item.betMoney}`
    }).join(',')
  },

  multiFirst(itemList) {
    return `${itemList[0].betMoney} ${_.map(itemList, (item) => {
      return item.num
    }).join(',')}`
  },
}
