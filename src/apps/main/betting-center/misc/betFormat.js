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

  // 显示用format
  handicapNormal(itemList, {levelName}) {
    return _.map(itemList, (item) => {
      let formatInfo = {}

      if (item.levelName) {
        formatInfo.playName = item.levelName
      } else {
        formatInfo.playName = `${levelName}`
      }
      if (item.playName) {
        formatInfo.playName += `-${item.playName}`
      }

      if (item.showTitle) {
        formatInfo.formatBettingNumber = item.showTitle
      } else if (item.posName) {
        formatInfo.formatBettingNumber = `${item.posName}-${item.title}`
      } else {
        let title = item.title.indexOf('总和') !== -1 ? item.title.replace(/总和(.*)/, '总和-$1') : item.title

        formatInfo.formatBettingNumber = `${title}`
      }

      formatInfo.odds = item.odds
      formatInfo.fPrefabMoney = item.betMoney

      return formatInfo
    })
  },

  handicapSpecial(itemList, {levelName, playName, statistics}) {
    let formatInfo = {}
    formatInfo.playName = `${levelName}`
    if (playName) {
      formatInfo.playName += `-${playName}`
    }
    formatInfo.formatBettingNumber = _.map(itemList, (item) => {
      return `${item.title}`
    }).join(',')

    formatInfo.odds = itemList[0].odds

    formatInfo.fPrefabMoney = _.chain(itemList[0].betMoney)
      .mul(statistics)
      .value()

    return [formatInfo]
  },
}
