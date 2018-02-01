// 需要验证菜单
const permissionsList = [
  {
    path: '/bc',
    mame: 'ticket',
    needLogin: true,
  },
  {
    path: '/uc',
    mame: 'user',
    needLogin: true,
  },
  {
    path: '/fc',
    mame: 'fund',
    needLogin: true,
  },
  {
    path: '/vip',
    mame: 'vip',
    needLogin: false,
  },
  {
    path: '/ac',
    mame: 'team',
    needLogin: true,
  },
  {
    path: '/nc',
    mame: 'notice',
    needLogin: true,
  },
  {
    path: '/rc',
    mame: 'realGame',
    needLogin: true,
  },
  // {
  //   path: '/sc',
  //   mame: 'slot',
  //   needLogin: true,
  // },
  {
    path: '/fh',
    mame: 'fish',
    needLogin: true,
  },
]

module.exports = {
  get(id) {
    return _(permissionsList).findWhere({
      id,
    })
  },
  permissionsList,
}
