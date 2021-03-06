

const config = [
  {
    id: 0,
    zhName: '待发放',
    name: 'WAIT',
  },
  {
    id: 1,
    zhName: '已发放',
    name: 'DONE',
  },
  {
    id: 2,
    zhName: '不发放',
    name: 'PASS',
  },
  {
    id: 9,
    zhName: '统计中',
    name: 'STATISTIC',
  },
]

module.exports = {
  getByName(name) {
    return _(config).findWhere({
      name,
    }) || {}
  },

  getZh(id) {
    return _(config).getConfigById(id)
  },

  getAll() {
    return config
  },
}
