

// 渠道类型：1AG，2EBET，3BBIN，4PT，5MG，6GG，7 188体育
// 游戏类型：1真人，2体育，3老虎机，4捕鱼
const channelList = [
  {
    channelId: 0,
    channelName: '中心钱包',
  },
  {
    channelId: 1,
    channelName: 'AG',
  },
  {
    channelId: 2,
    channelName: 'EBET',
  },
  {
    channelId: 3,
    channelName: 'BBIN',
  },
  {
    channelId: 4,
    channelName: 'PT',
  },
  {
    channelId: 5,
    channelName: 'MG',
  },
  {
    channelId: 6,
    channelName: 'GG',
  },
  {
    channelId: 7,
    channelName: '188体育',
  },
]
const gameTypeList = [
  {
    type: 1,
    typeName: '真人',
  },
  {
    type: 2,
    typeName: '体育',
  },
  {
    type: 3,
    typeName: '老虎机',
  },
  {
    type: 4,
    typeName: '捕鱼',
  },
]

module.exports = {
  getChannelList() {
    return channelList
  },
  getChannelById(id) {
    return _(channelList).find((channel) => {
      return id == channel.channelId
    })
  },
  getGameTypeList() {
    return gameTypeList
  },
  getGameTypeById(id) {
    return _(gameTypeList).find((gameType) => {
      return gameType.type == id
    })
  },

}
