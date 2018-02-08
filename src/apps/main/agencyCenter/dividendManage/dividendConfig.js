

const config = [
  {
    id: 0,
    zhName: '未开通',
    name: 'UN_APPLIED',
  },
  {
    id: 1,
    zhName: '申请中',
    name: 'APPLYING',
  },
  {
    id: 2,
    zhName: '已开通',
    name: 'APPLIED',
  },
  {
    id: 3,
    zhName: '修改中',
    name: 'REVISE',
  },
]

module.exports = {
  getByName(name) {
    return _(config).findWhere({
      name,
    }) || {}
  },
}
