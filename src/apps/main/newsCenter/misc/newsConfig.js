

const newsConfig = [
  {
    id: 1,
    name: 'fund',
  },
  {
    id: 2,
    name: 'user',
  },
  {
    id: 3,
    name: 'discount',
  },
]

module.exports = {
  get(id) {
    return _(newsConfig).findWhere({
      id,
    })
  },
}
