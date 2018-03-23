/**
 * Created by steven on 2018/3/19.
 */
const walletConf = [
  {
    id: 0,
    channelId: 0,
    title: '中心钱包',
    color: 'fa-circle-ce',

  },
  {
    id: 1,
    channelId: 6,
    title: 'GG钱包',
    color: 'fa-circle-ce',
  },
  {
    id: 2,
    channelId: 1,
    title: 'AG钱包',
    color: 'fa-circle-ag',
  },
  {
    id: 3,
    channelId: 4,
    title: 'PT钱包',
    color: 'fa-circle-ag',
  },
  {
    id: 4,
    channelId: 2,
    title: 'EBET钱包',
    color: 'fa-circle-ebet',
  },

  {
    id: 5,
    channelId: 5,
    title: 'MG钱包',
    color: 'fa-circle-ebet',
  },

]
module.exports = {
  getAll() {
    return walletConf
  },
}
