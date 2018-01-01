/**
 * Created by steven on 2017/12/27.
 */

const wallet = [
  {
    id: 0,
    name: 'center',
    zhName: '中心钱包',
  },
  {
    id: 1,
    name: 'ag',
    zhName: 'AG钱包',
  },
  {
    id: 2,
    name: 'ebet',
    zhName: 'EBET钱包',
  },
  {
    id: 3,
    name: 'bbin',
    zhName: 'BBIN钱包',
  },
  {
    id: 4,
    name: 'pt',
    zhName: 'PT钱包',
  },
  {
    id: 5,
    name: 'mg',
    zhName: 'MG钱包',
  },
  {
    id: 6,
    name: 'gg',
    zhName: 'GG钱包',
  },
  {
    id: 7,
    name: '188',
    zhName: '188体育钱包',
  },
]

module.exports = {
  get(uId) {
    return _(wallet).findWhere({
      id: uId,
    })
  },
  getAll() {
    return _(wallet)
  },
}
