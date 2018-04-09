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
    zhName: 'AG',
  },
  {
    id: 2,
    name: 'ebet',
    zhName: 'EBET',
  },
  // {
  //   id: 3,
  //   name: 'bbin',
  //   zhName: 'BBIN钱包',
  // },
  {
    id: 4,
    name: 'pt',
    zhName: 'PT',
  },
  {
    id: 5,
    name: 'mg',
    zhName: 'MG',
  },
  {
    id: 6,
    name: 'gg',
    zhName: 'GG',
  },
  // {
  //   id: 7,
  //   name: 'sports',
  //   zhName: '体育',
  // },
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
